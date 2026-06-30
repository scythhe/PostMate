-- ============================================================
-- PostMate — Supabase schema  (re-run safe: uses IF NOT EXISTS)
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

create schema if not exists public;

-- 1. Profiles
create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  name          text not null default '',
  plan          text not null default 'trial' check (plan in ('trial', 'pro')),
  trial_ends_at timestamptz not null default now() + interval '7 days',
  created_at    timestamptz default now()
);

-- 2. Businesses  (new brand-profile columns added)
create table if not exists public.businesses (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users(id) on delete cascade not null,
  name             text not null default '',
  description      text not null default '',
  instagram_handle text not null default '',
  website_url      text not null default '',
  primary_color    text not null default '#1F352D',
  secondary_color  text not null default '#C9A45C',
  industry         text not null default '',
  target_audience  text not null default '',
  tone             text not null default 'casual',
  products         text not null default '',
  location         text not null default '',
  brand_hashtags   text not null default '',
  deals            jsonb not null default '[]',
  events           jsonb not null default '[]',
  created_at       timestamptz default now()
);

-- Add new columns to existing businesses table (safe if already exists)
alter table public.businesses add column if not exists industry        text not null default '';
alter table public.businesses add column if not exists target_audience text not null default '';
alter table public.businesses add column if not exists tone            text not null default 'casual';
alter table public.businesses add column if not exists products        text not null default '';
alter table public.businesses add column if not exists location        text not null default '';
alter table public.businesses add column if not exists brand_hashtags  text not null default '';

-- 3. Posts  (individual AI-generated posts with approval state)
create table if not exists public.posts (
  id               uuid default gen_random_uuid() primary key,
  business_id      uuid references public.businesses(id) on delete cascade not null,
  status           text not null default 'draft' check (status in ('draft', 'approved')),
  idea_type        text not null default '',
  post_type        text not null default 'Post',
  content_category text not null default 'design',
  design_template  text,
  emoji            text not null default '✨',
  title            text not null default '',
  caption          text not null default '',
  short_caption    text not null default '',
  capture_note     text,
  image_prompt     text,
  hashtags         jsonb not null default '[]',
  scheduled_date   date,
  created_at       timestamptz default now()
);

-- 4. Generation sessions (legacy — kept for existing data)
create table if not exists public.generation_sessions (
  id           uuid default gen_random_uuid() primary key,
  business_id  uuid references public.businesses(id) on delete cascade not null,
  generated_at timestamptz not null default now(),
  month_key    text not null,
  preferences  text not null default '',
  posts        jsonb not null default '[]'
);

-- ── Row Level Security ──────────────────────────────────────────

alter table public.profiles           enable row level security;
alter table public.businesses         enable row level security;
alter table public.posts              enable row level security;
alter table public.generation_sessions enable row level security;

drop policy if exists "profiles_self"  on public.profiles;
create policy "profiles_self" on public.profiles
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "businesses_self" on public.businesses;
create policy "businesses_self" on public.businesses
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "posts_self" on public.posts;
create policy "posts_self" on public.posts
  using (auth.uid() = (select user_id from public.businesses where id = business_id))
  with check (auth.uid() = (select user_id from public.businesses where id = business_id));

drop policy if exists "sessions_self" on public.generation_sessions;
create policy "sessions_self" on public.generation_sessions
  using (auth.uid() = (select user_id from public.businesses where id = business_id))
  with check (auth.uid() = (select user_id from public.businesses where id = business_id));

-- ── Auto-create profile on signup ──────────────────────────────

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
