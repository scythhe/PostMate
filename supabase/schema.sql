-- ============================================================
-- PostMate — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Profiles (extends Supabase auth.users)
create table if not exists profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  name         text not null default '',
  plan         text not null default 'trial' check (plan in ('trial', 'pro')),
  trial_ends_at timestamptz not null default now() + interval '7 days',
  created_at   timestamptz default now()
);

-- 2. Businesses
create table if not exists businesses (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users(id) on delete cascade not null,
  name             text not null default '',
  description      text not null default '',
  instagram_handle text not null default '',
  website_url      text not null default '',
  primary_color    text not null default '#1F352D',
  secondary_color  text not null default '#C9A45C',
  deals            jsonb not null default '[]',
  events           jsonb not null default '[]',
  created_at       timestamptz default now()
);

-- 3. Generation sessions
create table if not exists generation_sessions (
  id           uuid default gen_random_uuid() primary key,
  business_id  uuid references businesses(id) on delete cascade not null,
  generated_at timestamptz not null default now(),
  month_key    text not null,
  preferences  text not null default '',
  posts        jsonb not null default '[]'
);

-- ── Row Level Security ──────────────────────────────────────────

alter table profiles enable row level security;
alter table businesses enable row level security;
alter table generation_sessions enable row level security;

-- Profiles: each user can only see/edit their own row
create policy "profiles_self" on profiles
  using (auth.uid() = id) with check (auth.uid() = id);

-- Businesses: users manage their own businesses
create policy "businesses_self" on businesses
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Sessions: accessible if the user owns the linked business
create policy "sessions_self" on generation_sessions
  using (auth.uid() = (select user_id from businesses where id = business_id))
  with check (auth.uid() = (select user_id from businesses where id = business_id));

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
  for each row execute procedure handle_new_user();
