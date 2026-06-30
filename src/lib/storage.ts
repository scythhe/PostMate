import { supabase } from './supabase'
import type { Business, GenerationSession, Post, User } from '../types'

type LocalAuthUser = User & { password: string }

const LS_USERS    = 'postmate_local_users'
const LS_USER_ID  = 'postmate_local_current_user'
const LS_BIZ      = 'postmate_local_businesses'
const LS_POSTS    = 'postmate_local_posts'
const LS_SESSIONS = 'postmate_local_sessions'

function readJson<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback } catch { return fallback }
}
function writeJson(key: string, v: unknown) { localStorage.setItem(key, JSON.stringify(v)) }

function buildTrialEndsAt() { return new Date(Date.now() + 7 * 86_400_000).toISOString() }

function toPublicUser(u: LocalAuthUser): User {
  return { id: u.id, name: u.name, email: u.email, plan: u.plan, trialEndsAt: u.trialEndsAt }
}

function preferLocal(): boolean {
  return typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')
}
function isLocalUserId(id: string) { return readJson<LocalAuthUser[]>(LS_USERS, []).some(u => u.id === id) }
function isLocalBizId(id: string)  { return readJson<Business[]>(LS_BIZ, []).some(b => b.id === id) }

function networkError(e: unknown) {
  const m = String(e instanceof Error ? e.message : e).toLowerCase()
  return m.includes('failed to fetch') || m.includes('network') || m.includes('500') || m.includes('database error')
}

// ── Local auth ─────────────────────────────────────────────────

function signUpLocal(name: string, email: string, password: string): User {
  const users = readJson<LocalAuthUser[]>(LS_USERS, [])
  if (users.some(u => u.email === email)) throw new Error('An account with this email already exists.')
  const user: LocalAuthUser = { id: crypto.randomUUID(), name, email, password, plan: 'trial', trialEndsAt: buildTrialEndsAt() }
  writeJson(LS_USERS, [...users, user])
  localStorage.setItem(LS_USER_ID, user.id)
  return toPublicUser(user)
}

function signInLocal(email: string, password: string): User {
  const user = readJson<LocalAuthUser[]>(LS_USERS, []).find(u => u.email === email)
  if (!user || user.password !== password) throw new Error('Incorrect email or password.')
  localStorage.setItem(LS_USER_ID, user.id)
  return toPublicUser(user)
}

// ── Auth (Supabase with localStorage fallback) ─────────────────

export async function signUp(name: string, email: string, password: string): Promise<User> {
  if (preferLocal()) return signUpLocal(name, email.toLowerCase(), password)
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
  if (error) {
    if (error.message.toLowerCase().includes('already registered')) throw new Error('An account with this email already exists. Sign in instead.')
    if (networkError(error)) return signUpLocal(name, email.toLowerCase(), password)
    throw new Error(error.message)
  }
  if (!data.user) throw new Error('Signup failed — please try again.')
  if (!data.session) throw new Error('Account created. Check your email to confirm it, then sign in.')
  return { id: data.user.id, name, email: email.toLowerCase(), plan: 'trial', trialEndsAt: buildTrialEndsAt() }
}

export async function signIn(email: string, password: string): Promise<User> {
  if (preferLocal()) return signInLocal(email.toLowerCase(), password)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    const localExists = readJson<LocalAuthUser[]>(LS_USERS, []).some(u => u.email === email.toLowerCase())
    if (localExists || networkError(error)) return signInLocal(email.toLowerCase(), password)
    throw new Error('Incorrect email or password.')
  }
  if (!data.user) throw new Error('Sign in failed.')
  return loadUserProfile(data.user.id, data.user.email ?? email)
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(LS_USER_ID)
  if (!preferLocal()) await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<User | null> {
  if (preferLocal()) {
    const id = localStorage.getItem(LS_USER_ID)
    if (!id) return null
    const u = readJson<LocalAuthUser[]>(LS_USERS, []).find(u => u.id === id)
    return u ? toPublicUser(u) : null
  }
  const { data } = await supabase.auth.getUser()
  if (!data.user) return null
  try { return await loadUserProfile(data.user.id, data.user.email ?? '') } catch { return null }
}

async function loadUserProfile(userId: string, email: string): Promise<User> {
  const { data, error } = await supabase.from('profiles').select('name,plan,trial_ends_at').eq('id', userId).single()
  if (error || !data) throw new Error('Profile not found')
  return { id: userId, email, name: data.name ?? '', plan: (data.plan ?? 'trial') as User['plan'], trialEndsAt: data.trial_ends_at ?? new Date().toISOString() }
}

export function getTrialDaysLeft(user: User): number {
  return Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / 86_400_000))
}

// ── Business ───────────────────────────────────────────────────

export async function getBusiness(userId: string): Promise<Business | null> {
  if (preferLocal() || isLocalUserId(userId)) {
    return readJson<Business[]>(LS_BIZ, []).find(b => b.userId === userId) ?? null
  }
  const { data, error } = await supabase.from('businesses').select('*').eq('user_id', userId).maybeSingle()
  if (error) return readJson<Business[]>(LS_BIZ, []).find(b => b.userId === userId) ?? null
  return data ? rowToBusiness(data) : null
}

export async function saveBusiness(biz: Business): Promise<void> {
  if (preferLocal() || isLocalUserId(biz.userId)) { saveLocalBiz(biz); return }
  const row = {
    id: biz.id, user_id: biz.userId, name: biz.name, description: biz.description,
    instagram_handle: biz.instagramHandle, website_url: biz.websiteUrl,
    primary_color: biz.primaryColor, secondary_color: biz.secondaryColor,
    industry: biz.industry, target_audience: biz.targetAudience, tone: biz.tone,
    products: biz.products, location: biz.location, brand_hashtags: biz.brandHashtags,
    deals: biz.deals, events: biz.events,
  }
  const { error } = await supabase.from('businesses').upsert(row)
  if (error) saveLocalBiz(biz)
}

function saveLocalBiz(biz: Business) {
  const all = readJson<Business[]>(LS_BIZ, [])
  writeJson(LS_BIZ, all.some(b => b.id === biz.id) ? all.map(b => b.id === biz.id ? biz : b) : [...all, biz])
}

function rowToBusiness(r: Record<string, unknown>): Business {
  return {
    id: r.id as string, userId: r.user_id as string, name: r.name as string,
    description: r.description as string, instagramHandle: r.instagram_handle as string,
    websiteUrl: r.website_url as string, primaryColor: r.primary_color as string,
    secondaryColor: r.secondary_color as string, industry: (r.industry as string) ?? '',
    targetAudience: (r.target_audience as string) ?? '', tone: ((r.tone as string) ?? 'casual') as Business['tone'],
    products: (r.products as string) ?? '', location: (r.location as string) ?? '',
    brandHashtags: (r.brand_hashtags as string) ?? '',
    deals: (r.deals as Business['deals']) ?? [], events: (r.events as Business['events']) ?? [],
  }
}

// ── Posts ──────────────────────────────────────────────────────

export async function getPosts(businessId: string): Promise<Post[]> {
  if (preferLocal() || isLocalBizId(businessId)) {
    return readJson<Post[]>(LS_POSTS, []).filter(p => p.businessId === businessId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
  const { data, error } = await supabase.from('posts').select('*').eq('business_id', businessId).order('created_at', { ascending: false })
  if (error) return readJson<Post[]>(LS_POSTS, []).filter(p => p.businessId === businessId)
  return (data ?? []).map(rowToPost)
}

export async function savePost(post: Post): Promise<void> {
  if (preferLocal() || isLocalBizId(post.businessId)) { saveLocalPost(post); return }
  const row = {
    id: post.id, business_id: post.businessId, status: post.status, idea_type: post.ideaType,
    post_type: post.postType, content_category: post.contentCategory, design_template: post.designTemplate,
    emoji: post.emoji, title: post.title, caption: post.caption, short_caption: post.shortCaption,
    capture_note: post.captureNote, image_prompt: post.imagePrompt, hashtags: post.hashtags,
    scheduled_date: post.scheduledDate ?? null, created_at: post.createdAt,
  }
  const { error } = await supabase.from('posts').upsert(row)
  if (error) saveLocalPost(post)
}

export async function deletePost(postId: string, businessId: string): Promise<void> {
  if (preferLocal() || isLocalBizId(businessId)) {
    writeJson(LS_POSTS, readJson<Post[]>(LS_POSTS, []).filter(p => p.id !== postId)); return
  }
  await supabase.from('posts').delete().eq('id', postId)
}

export async function countPostsThisMonth(businessId: string): Promise<number> {
  const monthKey = currentMonthKey()
  if (preferLocal() || isLocalBizId(businessId)) {
    return readJson<Post[]>(LS_POSTS, []).filter(p => p.businessId === businessId && p.createdAt.startsWith(monthKey.replace('-', '-'))).length
  }
  const start = `${monthKey}-01`
  const { count, error } = await supabase.from('posts').select('id', { count: 'exact', head: true })
    .eq('business_id', businessId).gte('created_at', start)
  if (error) return 0
  return count ?? 0
}

function saveLocalPost(post: Post) {
  const all = readJson<Post[]>(LS_POSTS, [])
  writeJson(LS_POSTS, all.some(p => p.id === post.id) ? all.map(p => p.id === post.id ? post : p) : [...all, post])
}

function rowToPost(r: Record<string, unknown>): Post {
  return {
    id: r.id as string, businessId: r.business_id as string, status: (r.status as Post['status']) ?? 'draft',
    ideaType: (r.idea_type as string) ?? '', postType: (r.post_type as Post['postType']) ?? 'Post',
    contentCategory: (r.content_category as Post['contentCategory']) ?? 'design',
    designTemplate: r.design_template as Post['designTemplate'] | undefined,
    emoji: (r.emoji as string) ?? '✨', title: (r.title as string) ?? '',
    caption: (r.caption as string) ?? '', shortCaption: (r.short_caption as string) ?? '',
    captureNote: r.capture_note as string | undefined, imagePrompt: r.image_prompt as string | undefined,
    hashtags: (r.hashtags as string[]) ?? [], scheduledDate: r.scheduled_date as string | undefined,
    createdAt: (r.created_at as string) ?? new Date().toISOString(),
  }
}

// ── Legacy sessions (kept for existing data) ───────────────────

export async function getSessions(businessId: string): Promise<GenerationSession[]> {
  if (preferLocal() || isLocalBizId(businessId)) {
    return readJson<GenerationSession[]>(LS_SESSIONS, []).filter(s => s.businessId === businessId)
  }
  const { data } = await supabase.from('generation_sessions').select('*').eq('business_id', businessId).order('generated_at', { ascending: false })
  return (data ?? []).map(r => ({ id: r.id, businessId: r.business_id, generatedAt: r.generated_at, monthKey: r.month_key, preferences: r.preferences, posts: r.posts }))
}

// ── Utilities ──────────────────────────────────────────────────

export function currentMonthKey(): string {
  const n = new Date()
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`
}
