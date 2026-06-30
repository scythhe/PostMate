import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  ExternalLink,
  FileText,
  LayoutGrid,
  Plus,
  Settings,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { deletePost, getPosts, getTrialDaysLeft, saveBusiness } from '../lib/storage'
import type { Business, Post, User } from '../types'

export function BusinessDashboard({
  business: init,
  user,
  onGetIdeas,
  onEditBusiness,
  onBusinessChange,
  onOpenPost,
}: {
  business: Business
  user: User
  onGetIdeas: () => void
  onEditBusiness: () => void
  onBusinessChange: (b: Business) => void
  onOpenPost: (post: Post) => void
}) {
  const [biz, setBiz]     = useState(init)
  const [posts, setPosts] = useState<Post[]>([])
  const [tab, setTab]     = useState<'calendar' | 'drafts' | 'promotions'>('calendar')
  const trialDays = getTrialDaysLeft(user)

  useEffect(() => { getPosts(biz.id).then(setPosts) }, [biz.id])

  async function persistBiz(updated: Business) {
    setBiz(updated); onBusinessChange(updated); await saveBusiness(updated)
  }

  async function handleDeletePost(postId: string) {
    await deletePost(postId, biz.id)
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  const approved   = posts.filter(p => p.status === 'approved')
  const drafts     = posts.filter(p => p.status === 'draft')
  const totalPromo = biz.deals.length + biz.events.length

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Trial banner */}
      {user.plan === 'trial' && (
        <div className={`px-4 py-2.5 text-center text-xs font-semibold tracking-wide ${trialDays === 0 ? 'bg-red-600 text-white' : trialDays <= 2 ? 'bg-amber-500 text-white' : 'bg-emerald-700 text-white'}`}>
          {trialDays === 0 ? 'Free trial ended.' : `${trialDays} day${trialDays === 1 ? '' : 's'} left in your free trial.`}
          {' '}<button type="button" className="font-bold underline underline-offset-2">Upgrade to Pro — $25/mo</button>
        </div>
      )}

      {/* ── Business hero header ── */}
      <div
        className="relative overflow-hidden px-4 pb-10 pt-8 sm:px-6"
        style={{ background: `linear-gradient(135deg, ${biz.primaryColor} 0%, ${biz.secondaryColor} 100%)` }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 size-48 rounded-full bg-black/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/20 text-3xl font-black text-white shadow-xl backdrop-blur-sm">
                {biz.name[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-black text-white leading-tight">{biz.name}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {biz.industry && (
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
                      {biz.industry}
                    </span>
                  )}
                  {biz.instagramHandle && (
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
                      {biz.instagramHandle.startsWith('@') ? biz.instagramHandle : `@${biz.instagramHandle}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button" onClick={onEditBusiness}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition"
            >
              <Settings size={13} /> Edit profile
            </button>
          </div>

          {/* Stat cards on hero */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <HeroStat icon={<CheckCircle2 size={16} />} label="Approved" value={approved.length} accent="emerald" sub="ready to post" />
            <HeroStat icon={<FileText size={16} />}     label="Drafts"   value={drafts.length}   accent="amber"   sub="need review" />
            <HeroStat icon={<Award size={16} />}        label="Promos"   value={totalPromo}       accent="blue"    sub="deals + events" />
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">

        {/* Pipeline strip */}
        <PipelineStrip drafts={drafts.length} approved={approved.length} onGetIdeas={onGetIdeas} />

        {/* Generate CTA */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-sm"
          style={{ background: `linear-gradient(135deg, ${biz.primaryColor}ee, ${biz.secondaryColor}cc)` }}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 size-44 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 size-24 rounded-full bg-black/10 blur-xl" />
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <Sparkles size={13} className="text-white/60" />
                <span className="text-xs font-black uppercase tracking-widest text-white/60">AI Content Studio</span>
              </div>
              <h2 className="text-xl font-black text-white">Generate new content ideas</h2>
              <p className="mt-1 text-sm text-white/60">20 tailored ideas → pick one → full post written for you in seconds</p>
            </div>
            <button
              type="button" onClick={onGetIdeas}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black shadow-lg transition hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{ color: biz.primaryColor }}
            >
              Get ideas <Sparkles size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1">
            {(['calendar', 'drafts', 'promotions'] as const).map(t => (
              <button
                key={t} type="button" onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition ${
                  tab === t ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {t === 'calendar'   && <Calendar size={13} />}
                {t === 'drafts'     && <FileText  size={13} />}
                {t === 'promotions' && <Tag       size={13} />}
                {t}
                {t === 'drafts' && drafts.length > 0 && (
                  <span className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-white">{drafts.length}</span>
                )}
                {t === 'calendar' && approved.length > 0 && (
                  <span className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white">{approved.length}</span>
                )}
              </button>
            ))}
          </div>
          {tab === 'drafts' && drafts.length > 0 && (
            <p className="text-xs text-zinc-400">{drafts.length} post{drafts.length !== 1 ? 's' : ''} waiting for your approval</p>
          )}
        </div>

        {/* Tab: calendar */}
        {tab === 'calendar' && (
          <CalendarView posts={approved} onDelete={handleDeletePost} onGetIdeas={onGetIdeas} />
        )}

        {/* Tab: drafts */}
        {tab === 'drafts' && (
          <div>
            {drafts.length === 0 ? (
              <EmptyState icon={<Zap size={28} />} title="No drafts yet" sub="Generate a post from an idea — it lands here for your review." cta="Get ideas" onCta={onGetIdeas} />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {drafts.map(p => (
                  <PostCard key={p.id} post={p} onDelete={() => handleDeletePost(p.id)} onOpen={() => onOpenPost(p)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: promotions */}
        {tab === 'promotions' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <PromoSection
              title="Deals" icon={<Tag size={14} />} color="emerald"
              emptyText="Active deals get woven into your content automatically."
              items={biz.deals.map(d => ({ id: d.id, title: d.title, sub: d.description, badge: d.validUntil ? `Until ${d.validUntil}` : undefined }))}
              fieldLabels={{ sub: 'Description', badge: 'Valid until' }}
              onAdd={item => persistBiz({ ...biz, deals: [...biz.deals, { id: item.id, title: item.title, description: item.sub ?? '', validUntil: item.badge?.replace('Until ', '') ?? '' }] })}
              onEdit={item => persistBiz({ ...biz, deals: biz.deals.map(d => d.id === item.id ? { ...d, title: item.title, description: item.sub ?? '', validUntil: item.badge?.replace('Until ', '') ?? '' } : d) })}
              onRemove={id => persistBiz({ ...biz, deals: biz.deals.filter(d => d.id !== id) })}
            />
            <PromoSection
              title="Events" icon={<Calendar size={14} />} color="blue"
              emptyText="Upcoming events generate timely content automatically."
              items={biz.events.map(ev => ({ id: ev.id, title: ev.title, sub: ev.description, badge: ev.date || undefined }))}
              fieldLabels={{ sub: 'Description', badge: 'Date' }}
              onAdd={item => persistBiz({ ...biz, events: [...biz.events, { id: item.id, title: item.title, description: item.sub ?? '', date: item.badge ?? '' }] })}
              onEdit={item => persistBiz({ ...biz, events: biz.events.map(e => e.id === item.id ? { ...e, title: item.title, description: item.sub ?? '', date: item.badge ?? '' } : e) })}
              onRemove={id => persistBiz({ ...biz, events: biz.events.filter(e => e.id !== id) })}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Hero stat card ─────────────────────────────────────────────

function HeroStat({ icon, label, value, accent, sub }: {
  icon: React.ReactNode; label: string; value: number; accent: 'emerald' | 'amber' | 'blue'; sub: string
}) {
  const accentMap = {
    emerald: 'bg-emerald-500/20 text-emerald-200',
    amber:   'bg-amber-500/20   text-amber-200',
    blue:    'bg-blue-500/20    text-blue-200',
  }
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
      <div className={`mb-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${accentMap[accent]}`}>
        {icon} {label}
      </div>
      <p className="text-3xl font-black text-white leading-none">{value}</p>
      <p className="mt-1 text-xs text-white/40">{sub}</p>
    </div>
  )
}

// ── Pipeline strip ─────────────────────────────────────────────

function PipelineStrip({ drafts, approved, onGetIdeas }: { drafts: number; approved: number; onGetIdeas: () => void }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4">
      <div className="flex items-center gap-1 mb-3">
        <TrendingUp size={13} className="text-zinc-400" />
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Content Pipeline</p>
      </div>
      <div className="flex items-center gap-2">
        <PipelineStep icon={<Sparkles size={13} />}     label="Ideas"                             color="bg-violet-100 text-violet-700 border-violet-200" onClick={onGetIdeas} />
        <ArrowRight size={14} className="shrink-0 text-zinc-300" />
        <PipelineStep icon={<FileText size={13} />}     label={`${drafts} Draft${drafts !== 1 ? 's' : ''}`}   color={drafts > 0   ? 'bg-amber-50 text-amber-700 border-amber-200'   : 'bg-zinc-50 text-zinc-400 border-zinc-200'} />
        <ArrowRight size={14} className="shrink-0 text-zinc-300" />
        <PipelineStep icon={<CheckCircle2 size={13} />} label={`${approved} Approved`}            color={approved > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-50 text-zinc-400 border-zinc-200'} />
        <ArrowRight size={14} className="shrink-0 text-zinc-300" />
        <PipelineStep icon={<LayoutGrid size={13} />}   label="Published"                         color="bg-zinc-50 text-zinc-400 border-zinc-200" />
      </div>
    </div>
  )
}

function PipelineStep({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick?: () => void }) {
  return (
    <button
      type="button" onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${color} ${onClick ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}`}
    >
      {icon} <span className="hidden sm:inline">{label}</span><span className="sm:hidden">{label.split(' ')[0]}</span>
    </button>
  )
}

// ── Calendar view ──────────────────────────────────────────────

function CalendarView({ posts, onDelete, onGetIdeas }: { posts: Post[]; onDelete: (id: string) => void; onGetIdeas: () => void }) {
  const [cursor, setCursor] = useState(new Date())
  const year  = cursor.getFullYear()
  const month = cursor.getMonth()

  const first       = new Date(year, month, 1)
  const startDow    = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [...Array(startDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  const byDate: Record<string, Post[]> = {}
  posts.forEach(p => { if (p.scheduledDate) (byDate[p.scheduledDate] ??= []).push(p) })

  const unscheduled = posts.filter(p => !p.scheduledDate)
  const monthLabel  = cursor.toLocaleString('default', { month: 'long', year: 'numeric' })
  const DOW         = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-zinc-400" />
          <h2 className="text-sm font-black text-zinc-950">{monthLabel}</h2>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => setCursor(new Date(year, month - 1, 1))} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 transition"><ChevronLeft size={16} /></button>
          <button type="button" onClick={() => setCursor(new Date(year, month + 1, 1))} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 transition"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-zinc-100 bg-zinc-50/60">
        {DOW.map(d => <div key={d} className="py-2 text-center text-[11px] font-bold uppercase tracking-wide text-zinc-400">{d}</div>)}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="min-h-[88px] border-r border-b border-zinc-100 bg-zinc-50/30" />
          const dateKey  = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayPosts = byDate[dateKey] ?? []
          const isToday  = new Date().toDateString() === new Date(year, month, day).toDateString()
          return (
            <div key={i} className={`min-h-[88px] border-r border-b border-zinc-100 p-1.5 ${isToday ? 'bg-emerald-50/70' : ''}`}>
              <p className={`mb-1 flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                isToday ? 'bg-emerald-600 text-white' : 'text-zinc-400'
              }`}>{day}</p>
              {dayPosts.map(p => <CalendarPostChip key={p.id} post={p} onDelete={() => onDelete(p.id)} />)}
            </div>
          )
        })}
      </div>

      {unscheduled.length > 0 && (
        <div className="border-t border-zinc-100 px-5 py-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Approved · No date set</p>
          <div className="flex flex-wrap gap-2">
            {unscheduled.map(p => <CalendarPostChip key={p.id} post={p} onDelete={() => onDelete(p.id)} />)}
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="py-14 text-center">
          <Calendar size={32} className="mx-auto mb-3 text-zinc-200" />
          <p className="text-sm font-semibold text-zinc-400">No approved posts yet</p>
          <p className="mt-1 text-xs text-zinc-300">Approve a post and set a date — it shows up here.</p>
          <button type="button" onClick={onGetIdeas} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-950 transition">
            <Sparkles size={14} /> Get ideas
          </button>
        </div>
      )}
    </div>
  )
}

function CalendarPostChip({ post, onDelete }: { post: Post; onDelete: () => void }) {
  const colors: Record<string, string> = {
    Post:     'bg-zinc-200 text-zinc-700',
    Reel:     'bg-purple-100 text-purple-700',
    Story:    'bg-amber-100 text-amber-700',
    Carousel: 'bg-blue-100 text-blue-700',
  }
  return (
    <div className={`group mb-0.5 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${colors[post.postType] ?? 'bg-zinc-100 text-zinc-600'}`}>
      <span className="truncate max-w-[72px]">{post.emoji} {post.title}</span>
      <button type="button" onClick={onDelete} className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition"><X size={9} /></button>
    </div>
  )
}

// ── Post card (drafts) ─────────────────────────────────────────

function PostCard({ post, onDelete, onOpen }: { post: Post; onDelete: () => void; onOpen: () => void }) {
  const borderAccent: Record<string, string> = {
    Post:     'border-l-zinc-400',
    Reel:     'border-l-purple-400',
    Story:    'border-l-amber-400',
    Carousel: 'border-l-blue-400',
  }
  const typeBadge: Record<string, string> = {
    Post:     'bg-zinc-100 text-zinc-600',
    Reel:     'bg-purple-100 text-purple-700',
    Story:    'bg-amber-100 text-amber-700',
    Carousel: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className={`group rounded-2xl border border-zinc-200 border-l-4 ${borderAccent[post.postType] ?? 'border-l-zinc-300'} bg-white p-5 shadow-sm hover:shadow-md transition`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 text-2xl">{post.emoji}</span>
          <p className="truncate text-sm font-black text-zinc-950">{post.title}</p>
        </div>
        <button type="button" onClick={onDelete} className="shrink-0 rounded-lg p-1.5 text-zinc-300 hover:bg-red-50 hover:text-red-500 transition">
          <Trash2 size={13} />
        </button>
      </div>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">{post.shortCaption}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeBadge[post.postType] ?? ''}`}>{post.postType}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${post.contentCategory === 'design' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
            {post.contentCategory === 'design' ? '🎨 Graphic' : '📷 Capture'}
          </span>
        </div>
        <button
          type="button" onClick={onOpen}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-zinc-950 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition"
        >
          <ExternalLink size={11} /> Review
        </button>
      </div>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────

function EmptyState({ icon, title, sub, cta, onCta }: { icon: React.ReactNode; title: string; sub: string; cta: string; onCta: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-zinc-200 py-14 text-center">
      <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">{icon}</div>
      <p className="text-sm font-bold text-zinc-500">{title}</p>
      <p className="mt-1 text-xs text-zinc-400">{sub}</p>
      <button type="button" onClick={onCta} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-950 transition">
        <Sparkles size={14} /> {cta}
      </button>
    </div>
  )
}

// ── PromoSection ───────────────────────────────────────────────

type PromoItem = { id: string; title: string; sub?: string; badge?: string }

function PromoSection({ title, icon, color, emptyText, items, fieldLabels, onAdd, onEdit, onRemove }: {
  title: string; icon: React.ReactNode; color: 'emerald' | 'blue'; emptyText: string
  items: PromoItem[]; fieldLabels: { sub: string; badge: string }
  onAdd: (i: PromoItem) => void; onEdit: (i: PromoItem) => void; onRemove: (id: string) => void
}) {
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const accent = color === 'emerald'
    ? { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', add: 'text-emerald-600 hover:text-emerald-800', ring: 'focus:border-emerald-500', header: 'text-emerald-600' }
    : { badge: 'bg-blue-50 text-blue-700',       dot: 'bg-blue-500',    add: 'text-blue-600 hover:text-blue-800',       ring: 'focus:border-blue-500',    header: 'text-blue-600' }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-black text-zinc-950">
          <span className={accent.header}>{icon}</span>
          {title}
          {items.length > 0 && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${accent.badge}`}>{items.length}</span>}
        </h2>
        {!adding && !editId && (
          <button type="button" onClick={() => setAdding(true)} className={`flex items-center gap-1 text-xs font-bold ${accent.add} transition`}>
            <Plus size={13} /> Add
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map(item =>
          editId === item.id ? (
            <PromoForm key={item.id} initial={item} fieldLabels={fieldLabels} accentRing={accent.ring}
              onSave={u => { onEdit(u); setEditId(null) }} onCancel={() => setEditId(null)} />
          ) : (
            <div key={item.id} className="group flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 hover:border-zinc-200 hover:bg-white hover:shadow-sm transition">
              <span className={`size-2 shrink-0 rounded-full ${accent.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">{item.title}</p>
                {item.sub && <p className="truncate text-xs text-zinc-400">{item.sub}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {item.badge && <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${accent.badge}`}>{item.badge}</span>}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button type="button" onClick={() => setEditId(item.id)} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"><Edit2 size={12} /></button>
                  <button type="button" onClick={() => onRemove(item.id)} className="rounded-lg p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          )
        )}

        {adding && (
          <PromoForm fieldLabels={fieldLabels} accentRing={accent.ring}
            onSave={item => { onAdd(item); setAdding(false) }} onCancel={() => setAdding(false)} />
        )}

        {!adding && !editId && (
          <button type="button" onClick={() => setAdding(true)}
            className="w-full rounded-xl border border-dashed border-zinc-200 py-2.5 text-xs font-semibold text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 transition">
            + Add {title.toLowerCase().replace(/s$/, '')}
          </button>
        )}
      </div>

      {items.length === 0 && !adding && (
        <p className="mt-3 text-xs text-zinc-400">{emptyText}</p>
      )}
    </div>
  )
}

function PromoForm({ initial, fieldLabels, accentRing, onSave, onCancel }: {
  initial?: PromoItem; fieldLabels: { sub: string; badge: string }
  accentRing: string; onSave: (i: PromoItem) => void; onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [sub,   setSub]   = useState(initial?.sub   ?? '')
  const [badge, setBadge] = useState(initial?.badge ?? '')
  const inp = `h-9 w-full rounded-xl border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none transition ${accentRing} focus:ring-4 focus:ring-current/10`
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-2">
      <input autoFocus className={inp} placeholder="Name *" value={title} onChange={e => setTitle(e.target.value)} />
      <input className={inp} placeholder={`${fieldLabels.sub} (optional)`} value={sub} onChange={e => setSub(e.target.value)} />
      <input className={inp} placeholder={`${fieldLabels.badge} (optional)`} value={badge} onChange={e => setBadge(e.target.value)} />
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 transition"><X size={11} /> Cancel</button>
        <button type="button" disabled={!title.trim()}
          onClick={() => onSave({ id: initial?.id ?? crypto.randomUUID(), title: title.trim(), sub: sub.trim() || undefined, badge: badge.trim() || undefined })}
          className="rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 transition disabled:opacity-40">
          Save
        </button>
      </div>
    </div>
  )
}
