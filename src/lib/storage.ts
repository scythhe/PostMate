import { supabase } from './supabase'
import type { Business, GenerationSession, User } from '../types'

// ── Auth ───────────────────────────────────────────────────────

export async function signUp(name: string, email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  if (error) throw new Error(error.message)
  if (!data.user) throw new Error('Signup failed — please try again.')

  // Insert profile (trigger also does this as a safety net)
  const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  await supabase.from('profiles').upsert({
    id: data.user.id,
    name,
    plan: 'trial',
    trial_ends_at: trialEndsAt,
  })

  return { id: data.user.id, name, email, plan: 'trial', trialEndsAt }
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error('Incorrect email or password.')
  if (!data.user) throw new Error('Sign in failed.')
  return loadUserProfile(data.user.id, data.user.email ?? email)
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) return null
  try {
    return await loadUserProfile(data.user.id, data.user.email ?? '')
  } catch {
    return null
  }
}

async function loadUserProfile(userId: string, email: string): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, plan, trial_ends_at')
    .eq('id', userId)
    .single()
  if (error || !data) throw new Error('Profile not found')
  return {
    id: userId,
    email,
    name: data.name ?? '',
    plan: (data.plan ?? 'trial') as User['plan'],
    trialEndsAt: data.trial_ends_at ?? new Date().toISOString(),
  }
}

export function getTrialDaysLeft(user: User): number {
  const diff = new Date(user.trialEndsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// ── Business ───────────────────────────────────────────────────

export async function getBusiness(userId: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return rowToBusiness(data)
}

export async function saveBusiness(biz: Business): Promise<void> {
  const row = {
    id: biz.id,
    user_id: biz.userId,
    name: biz.name,
    description: biz.description,
    instagram_handle: biz.instagramHandle,
    website_url: biz.websiteUrl,
    primary_color: biz.primaryColor,
    secondary_color: biz.secondaryColor,
    deals: biz.deals,
    events: biz.events,
  }
  const { error } = await supabase.from('businesses').upsert(row)
  if (error) throw new Error(error.message)
}

function rowToBusiness(row: Record<string, unknown>): Business {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    description: row.description as string,
    instagramHandle: row.instagram_handle as string,
    websiteUrl: row.website_url as string,
    primaryColor: row.primary_color as string,
    secondaryColor: row.secondary_color as string,
    deals: (row.deals as Business['deals']) ?? [],
    events: (row.events as Business['events']) ?? [],
  }
}

// ── Generation sessions ────────────────────────────────────────

export async function getSessions(businessId: string): Promise<GenerationSession[]> {
  const { data, error } = await supabase
    .from('generation_sessions')
    .select('*')
    .eq('business_id', businessId)
    .order('generated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(rowToSession)
}

export async function saveSession(session: GenerationSession): Promise<void> {
  const row = {
    id: session.id,
    business_id: session.businessId,
    generated_at: session.generatedAt,
    month_key: session.monthKey,
    preferences: session.preferences,
    posts: session.posts,
  }
  const { error } = await supabase.from('generation_sessions').upsert(row)
  if (error) throw new Error(error.message)
}

export async function countSessionsThisMonth(businessId: string, monthKey: string): Promise<number> {
  const { count, error } = await supabase
    .from('generation_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', businessId)
    .eq('month_key', monthKey)
  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function getRecentPostTitles(businessId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('generation_sessions')
    .select('posts')
    .eq('business_id', businessId)
    .order('generated_at', { ascending: false })
    .limit(4)
  if (error) return []
  return (data ?? []).flatMap((row) =>
    (row.posts as Array<{ title?: string }> ?? []).map((p) => p.title ?? '').filter(Boolean)
  )
}

function rowToSession(row: Record<string, unknown>): GenerationSession {
  return {
    id: row.id as string,
    businessId: row.business_id as string,
    generatedAt: row.generated_at as string,
    monthKey: row.month_key as string,
    preferences: row.preferences as string,
    posts: row.posts as GenerationSession['posts'],
  }
}

// ── Utilities ──────────────────────────────────────────────────

export function currentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}
