import { Calendar, ChevronLeft, ChevronRight, Edit2, ExternalLink, Plus, Settings, Sparkles, Tag, Trash2, X, Zap } from 'lucide-react'
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
  const [biz, setBiz]   = useState(init)
  const [posts, setPosts] = useState<Post[]>([])
  const [tab, setTab]   = useState<'calendar' | 'drafts' | 'promotions'>('calendar')
  const trialDays = getTrialDaysLeft(user)

  useEffect(() => { getPosts(biz.id).then(setPosts) }, [biz.id])

  async function persistBiz(updated: Business) {
    setBiz(updated); onBusinessChange(updated); await saveBusiness(updated)
  }

  async function handleDeletePost(postId: string) {
    await deletePost(postId, biz.id)
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  const approved = posts.filter(p => p.status === 'approved')
  const drafts   = posts.filter(p => p.status === 'draft')

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Trial banner */}
      {user.plan === 'trial' && (
        <div className={`px-4 py-2.5 text-center text-sm font-medium ${trialDays === 0 ? 'bg-red-600 text-white' : trialDays <= 2 ? 'bg-amber-500 text-white' : 'bg-emerald-700 text-white'}`}>
          {trialDays === 0 ? 'Your free trial has ended.' : `${trialDays} day${trialDays === 1 ? '' : 's'} left in your free trial.`}
          {' '}<button type="button" className="font-bold underline">Upgrade to Pro — $25/month</button>
        </div>
      )}

      {/* Business header */}
      <div className="px-4 py-8 sm:px-6" style={{ background: `linear-gradient(135deg, ${biz.primaryColor} 0%, ${biz.secondaryColor} 100%)` }}>
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-lg border border-white/20 backdrop-blur-sm shrink-0">
              {biz.name[0]?.toUpperCase()}
            </span>
            <div>
              <h1 className="text-xl font-bold text-white">{biz.name}</h1>
              <p className="text-sm text-white/60">{biz.industry || biz.instagramHandle}</p>
            </div>
          </div>
          <button type="button" onClick={onEditBusiness} className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition">
            <Settings size={14} /> Edit profile
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Approved posts" value={approved.length} sub="ready to publish" />
          <StatCard label="Drafts" value={drafts.length} sub="waiting for review" />
          <StatCard label="Promotions" value={biz.deals.length + biz.events.length} sub="deals + events" />
        </div>

        {/* Generate CTA */}
        <div className="relative overflow-hidden rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${biz.primaryColor}f0, ${biz.secondaryColor}d0)` }}>
          <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/5" />
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-white/70" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">AI Content</span>
              </div>
              <h2 className="text-lg font-bold text-white">Get content ideas</h2>
              <p className="text-sm text-white/60 mt-0.5">20 tailored ideas → pick one → full post written for you</p>
            </div>
            <button type="button" onClick={onGetIdeas}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold transition hover:bg-zinc-100"
              style={{ color: biz.primaryColor }}>
              Get ideas <Sparkles size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-zinc-200 bg-white p-1 w-fit">
          {(['calendar', 'drafts', 'promotions'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition capitalize ${tab === t ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-zinc-950'}`}>
              {t} {t === 'drafts' && drafts.length > 0 && <span className="ml-1 rounded-full bg-amber-400 px-1.5 text-xs text-white font-bold">{drafts.length}</span>}
            </button>
          ))}
        </div>

        {/* Tab: calendar */}
        {tab === 'calendar' && (
          <CalendarView posts={approved} onDelete={handleDeletePost} onGetIdeas={onGetIdeas} />
        )}

        {/* Tab: drafts */}
        {tab === 'drafts' && (
          <div>
            {drafts.length === 0 ? (
              <EmptyState icon={<Zap />} title="No drafts" sub="Generate a post from an idea — it lands here as a draft." cta="Get ideas" onCta={onGetIdeas} />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {drafts.map(p => <PostCard key={p.id} post={p} onDelete={() => handleDeletePost(p.id)} onOpen={() => onOpenPost(p)} />)}
              </div>
            )}
          </div>
        )}

        {/* Tab: promotions */}
        {tab === 'promotions' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <PromoSection title="Deals" icon={<Tag size={14} />} color="emerald" emptyText="Deals get woven into your content."
              items={biz.deals.map(d => ({ id: d.id, title: d.title, sub: d.description, badge: d.validUntil ? `Until ${d.validUntil}` : undefined }))}
              fieldLabels={{ sub: 'Description', badge: 'Valid until' }}
              onAdd={item => persistBiz({ ...biz, deals: [...biz.deals, { id: item.id, title: item.title, description: item.sub ?? '', validUntil: item.badge?.replace('Until ', '') ?? '' }] })}
              onEdit={item => persistBiz({ ...biz, deals: biz.deals.map(d => d.id === item.id ? { ...d, title: item.title, description: item.sub ?? '', validUntil: item.badge?.replace('Until ', '') ?? '' } : d) })}
              onRemove={id => persistBiz({ ...biz, deals: biz.deals.filter(d => d.id !== id) })} />
            <PromoSection title="Events" icon={<Calendar size={14} />} color="blue" emptyText="Events generate Friday content automatically."
              items={biz.events.map(ev => ({ id: ev.id, title: ev.title, sub: ev.description, badge: ev.date || undefined }))}
              fieldLabels={{ sub: 'Description', badge: 'Date' }}
              onAdd={item => persistBiz({ ...biz, events: [...biz.events, { id: item.id, title: item.title, description: item.sub ?? '', date: item.badge ?? '' }] })}
              onEdit={item => persistBiz({ ...biz, events: biz.events.map(e => e.id === item.id ? { ...e, title: item.title, description: item.sub ?? '', date: item.badge ?? '' } : e) })}
              onRemove={id => persistBiz({ ...biz, events: biz.events.filter(e => e.id !== id) })} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Calendar view ──────────────────────────────────────────────

function CalendarView({ posts, onDelete, onGetIdeas }: { posts: Post[]; onDelete: (id: string) => void; onGetIdeas: () => void }) {
  const [cursor, setCursor] = useState(new Date())
  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const first = new Date(year, month, 1)
  const startDow = first.getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [...Array(startDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  const byDate: Record<string, Post[]> = {}
  posts.forEach(p => {
    if (p.scheduledDate) {
      const key = p.scheduledDate
      ;(byDate[key] ??= []).push(p)
    }
  })

  const unscheduled = posts.filter(p => !p.scheduledDate)
  const monthLabel = cursor.toLocaleString('default', { month: 'long', year: 'numeric' })
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <h2 className="text-sm font-bold text-zinc-950">{monthLabel}</h2>
        <div className="flex gap-1">
          <button type="button" onClick={() => setCursor(new Date(year, month - 1, 1))} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 transition"><ChevronLeft size={16} /></button>
          <button type="button" onClick={() => setCursor(new Date(year, month + 1, 1))} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 transition"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* DOW headers */}
      <div className="grid grid-cols-7 border-b border-zinc-100">
        {DOW.map(d => <div key={d} className="py-2 text-center text-xs font-bold text-zinc-400">{d}</div>)}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="min-h-[80px] border-r border-b border-zinc-100 bg-zinc-50/50" />
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayPosts = byDate[dateKey] ?? []
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()
          return (
            <div key={i} className={`min-h-[80px] border-r border-b border-zinc-100 p-1.5 ${isToday ? 'bg-emerald-50/60' : ''}`}>
              <p className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}>{day}</p>
              {dayPosts.map(p => (
                <CalendarPostChip key={p.id} post={p} onDelete={() => onDelete(p.id)} />
              ))}
            </div>
          )
        })}
      </div>

      {/* Unscheduled approved posts */}
      {unscheduled.length > 0 && (
        <div className="border-t border-zinc-100 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Approved · No date set</p>
          <div className="flex flex-wrap gap-2">
            {unscheduled.map(p => (
              <CalendarPostChip key={p.id} post={p} onDelete={() => onDelete(p.id)} />
            ))}
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm font-semibold text-zinc-400">No approved posts yet</p>
          <p className="text-xs text-zinc-300 mt-1">Approve a post and set a date — it'll appear here.</p>
          <button type="button" onClick={onGetIdeas} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-950 transition">
            <Sparkles size={14} /> Get ideas
          </button>
        </div>
      )}
    </div>
  )
}

function CalendarPostChip({ post, onDelete }: { post: Post; onDelete: () => void }) {
  const colors: Record<string, string> = {
    Post: 'bg-zinc-200 text-zinc-700', Reel: 'bg-purple-100 text-purple-700',
    Story: 'bg-amber-100 text-amber-700', Carousel: 'bg-blue-100 text-blue-700',
  }
  return (
    <div className={`group flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${colors[post.postType] ?? 'bg-zinc-100 text-zinc-600'}`}>
      <span className="truncate max-w-[80px]">{post.emoji} {post.title}</span>
      <button type="button" onClick={onDelete} className="opacity-0 group-hover:opacity-100 ml-0.5 transition">
        <X size={10} />
      </button>
    </div>
  )
}

// ── Post card ──────────────────────────────────────────────────

function PostCard({ post, onDelete, onOpen }: { post: Post; onDelete: () => void; onOpen: () => void }) {
  const TYPE_COLORS: Record<string, string> = {
    Post: 'bg-zinc-100 text-zinc-600', Reel: 'bg-purple-100 text-purple-700',
    Story: 'bg-amber-100 text-amber-700', Carousel: 'bg-blue-100 text-blue-700',
  }
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{post.emoji}</span>
          <p className="text-sm font-bold text-zinc-950">{post.title}</p>
        </div>
        <button type="button" onClick={onDelete} className="text-zinc-300 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 shrink-0">
          <Trash2 size={13} />
        </button>
      </div>
      <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">{post.shortCaption}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[post.postType] ?? ''}`}>{post.postType}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${post.contentCategory === 'design' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
            {post.contentCategory === 'design' ? '🎨 Graphic' : '📷 Capture'}
          </span>
        </div>
        <button type="button" onClick={onOpen} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition">
          <ExternalLink size={11} /> Open
        </button>
      </div>
    </div>
  )
}

// ── Stat card ──────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <p className="text-xs font-medium text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-zinc-950">{value}</p>
      <p className="mt-1 text-xs text-zinc-300">{sub}</p>
    </div>
  )
}

function EmptyState({ icon, title, sub, cta, onCta }: { icon: React.ReactNode; title: string; sub: string; cta: string; onCta: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-zinc-200 py-12 text-center">
      <div className="mx-auto mb-2 text-zinc-300 [&>svg]:mx-auto">{icon}</div>
      <p className="text-sm font-semibold text-zinc-400">{title}</p>
      <p className="text-xs text-zinc-300 mt-1">{sub}</p>
      <button type="button" onClick={onCta} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-950 transition">
        <Sparkles size={14} /> {cta}
      </button>
    </div>
  )
}

// ── PromoSection (deals/events) ────────────────────────────────

type PromoItem = { id: string; title: string; sub?: string; badge?: string }

function PromoSection({ title, icon, color, emptyText, items, fieldLabels, onAdd, onEdit, onRemove }: {
  title: string; icon: React.ReactNode; color: 'emerald' | 'blue'; emptyText: string
  items: PromoItem[]; fieldLabels: { sub: string; badge: string }
  onAdd: (i: PromoItem) => void; onEdit: (i: PromoItem) => void; onRemove: (id: string) => void
}) {
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const accent = color === 'emerald'
    ? { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', add: 'text-emerald-600 hover:text-emerald-800', ring: 'focus:border-emerald-500' }
    : { badge: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500', add: 'text-blue-600 hover:text-blue-800', ring: 'focus:border-blue-500' }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-950">
          <span className={color === 'emerald' ? 'text-emerald-600' : 'text-blue-600'}>{icon}</span>
          {title}
          {items.length > 0 && <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${accent.badge}`}>{items.length}</span>}
        </h2>
        {!adding && !editId && (
          <button type="button" onClick={() => setAdding(true)} className={`flex items-center gap-1 text-xs font-semibold ${accent.add} transition`}>
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
                <p className="text-sm font-semibold text-zinc-900 truncate">{item.title}</p>
                {item.sub && <p className="text-xs text-zinc-400 truncate">{item.sub}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
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
          <button type="button" onClick={() => setAdding(true)} className="w-full rounded-xl border border-dashed border-zinc-200 py-2.5 text-xs font-medium text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 transition">
            + Add {title.toLowerCase().replace(/s$/, '')}
          </button>
        )}
      </div>
      {items.length === 0 && !adding && <p className="mt-3 text-xs text-zinc-400">{emptyText}</p>}
    </div>
  )
}

function PromoForm({ initial, fieldLabels, accentRing, onSave, onCancel }: {
  initial?: PromoItem; fieldLabels: { sub: string; badge: string }
  accentRing: string; onSave: (i: PromoItem) => void; onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [sub, setSub]     = useState(initial?.sub ?? '')
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
