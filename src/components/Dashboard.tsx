import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Edit2,
  Plus,
  Settings,
  Sparkles,
  Tag,
  Trash2,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { currentMonthKey, countSessionsThisMonth, getSessions, getTrialDaysLeft, saveBusiness } from '../lib/storage'
import type { Business, BusinessEvent, Deal, GenerationSession, User } from '../types'

const MAX_PER_MONTH = 4

export function BusinessDashboard({
  business: initialBusiness,
  user,
  onGenerate,
  onViewSession,
  onEditBusiness,
  onBusinessChange,
}: {
  business: Business
  user: User
  onGenerate: () => void
  onViewSession: (session: GenerationSession) => void
  onEditBusiness: () => void
  onBusinessChange: (biz: Business) => void
}) {
  const [biz, setBiz] = useState(initialBusiness)
  const [sessions, setSessions] = useState<GenerationSession[]>([])
  const [used, setUsed] = useState(0)
  const monthKey = currentMonthKey()
  const trialDays = getTrialDaysLeft(user)

  useEffect(() => {
    getSessions(biz.id).then(setSessions)
    countSessionsThisMonth(biz.id, monthKey).then(setUsed)
  }, [biz.id, monthKey])

  async function persistBiz(updated: Business) {
    setBiz(updated)
    onBusinessChange(updated)
    await saveBusiness(updated)
  }

  const remaining = MAX_PER_MONTH - used

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Trial banner */}
      {user.plan === 'trial' && (
        <div className={`px-4 py-2.5 text-center text-sm font-medium ${
          trialDays === 0 ? 'bg-red-600 text-white' :
          trialDays <= 2 ? 'bg-amber-500 text-white' :
          'bg-emerald-700 text-white'
        }`}>
          {trialDays === 0 ? 'Your free trial has ended.' : `${trialDays} day${trialDays === 1 ? '' : 's'} left in your free trial.`}
          {' '}<button type="button" className="font-bold underline">Upgrade to Pro — $25/month</button>
        </div>
      )}

      {/* Business header */}
      <div
        className="px-4 py-8 sm:px-6"
        style={{ background: `linear-gradient(135deg, ${biz.primaryColor} 0%, ${biz.secondaryColor} 100%)` }}
      >
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white shadow-lg border border-white/20 backdrop-blur-sm">
              {biz.name[0]?.toUpperCase()}
            </span>
            <div>
              <h1 className="text-xl font-bold text-white">{biz.name}</h1>
              {biz.instagramHandle && <p className="text-sm text-white/60">{biz.instagramHandle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onEditBusiness}
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <Settings size={14} /> Edit
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-xs font-medium text-zinc-400">This month</p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{used}<span className="text-sm text-zinc-300 font-normal"> / {MAX_PER_MONTH}</span></p>
            <div className="mt-2 flex gap-1">
              {Array.from({ length: MAX_PER_MONTH }).map((_, i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full ${i < used ? 'bg-emerald-500' : 'bg-zinc-100'}`} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-xs font-medium text-zinc-400">Remaining</p>
            <p className={`mt-1 text-2xl font-bold ${remaining === 0 ? 'text-red-500' : 'text-zinc-950'}`}>{remaining}</p>
            <p className="mt-1 text-xs text-zinc-300">resets next month</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-xs font-medium text-zinc-400">Promotions</p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{biz.deals.length + biz.events.length}</p>
            <p className="mt-1 text-xs text-zinc-300">deals + events</p>
          </div>
        </div>

        {/* Generate CTA */}
        <div
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ background: `linear-gradient(135deg, ${biz.primaryColor}f0, ${biz.secondaryColor}d0)` }}
        >
          <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/5" />
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-white/70" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">AI Content</span>
              </div>
              <h2 className="text-lg font-bold text-white">Generate this week's content plan</h2>
              <p className="text-sm text-white/60 mt-0.5">7 posts · captions · previews · footage guides</p>
            </div>
            <button
              type="button"
              onClick={onGenerate}
              disabled={remaining === 0}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold transition hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: biz.primaryColor }}
            >
              {remaining === 0 ? 'Limit reached' : <>Generate <ArrowRight size={15} /></>}
            </button>
          </div>
          {remaining > 0 && (
            <p className="relative mt-3 text-xs text-white/40">{remaining} generation{remaining !== 1 ? 's' : ''} remaining this month</p>
          )}
        </div>

        {/* Deals + Events */}
        <div className="grid gap-4 sm:grid-cols-2">
          <PromoSection
            title="Deals"
            icon={<Tag size={14} />}
            color="emerald"
            emptyText="Deals become your Wednesday content."
            items={biz.deals.map((d) => ({ id: d.id, title: d.title, sub: d.description, badge: d.validUntil ? `Until ${d.validUntil}` : undefined }))}
            onAdd={(item) => {
              const deal: Deal = { id: item.id, title: item.title, description: item.sub ?? '', validUntil: item.badge?.replace('Until ', '') ?? '' }
              persistBiz({ ...biz, deals: [...biz.deals, deal] })
            }}
            onEdit={(item) => {
              const deal: Deal = { id: item.id, title: item.title, description: item.sub ?? '', validUntil: item.badge?.replace('Until ', '') ?? '' }
              persistBiz({ ...biz, deals: biz.deals.map((d) => d.id === item.id ? deal : d) })
            }}
            onRemove={(id) => persistBiz({ ...biz, deals: biz.deals.filter((d) => d.id !== id) })}
            fieldLabels={{ sub: 'Description', badge: 'Valid until' }}
          />
          <PromoSection
            title="Events"
            icon={<Calendar size={14} />}
            color="blue"
            emptyText="Events become your Friday post."
            items={biz.events.map((ev) => ({ id: ev.id, title: ev.title, sub: ev.description, badge: ev.date || undefined }))}
            onAdd={(item) => {
              const ev: BusinessEvent = { id: item.id, title: item.title, description: item.sub ?? '', date: item.badge ?? '' }
              persistBiz({ ...biz, events: [...biz.events, ev] })
            }}
            onEdit={(item) => {
              const ev: BusinessEvent = { id: item.id, title: item.title, description: item.sub ?? '', date: item.badge ?? '' }
              persistBiz({ ...biz, events: biz.events.map((e) => e.id === item.id ? ev : e) })
            }}
            onRemove={(id) => persistBiz({ ...biz, events: biz.events.filter((e) => e.id !== id) })}
            fieldLabels={{ sub: 'Description', badge: 'Date' }}
          />
        </div>

        {/* Past sessions */}
        {sessions.length > 0 ? (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Past plans</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((s) => <SessionCard key={s.id} session={s} onClick={() => onViewSession(s)} />)}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-zinc-200 py-12 text-center">
            <Zap size={24} className="mx-auto text-zinc-300 mb-2" />
            <p className="text-sm font-semibold text-zinc-400">No plans yet</p>
            <p className="text-xs text-zinc-300 mt-1">Hit Generate to create your first week.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Session card ───────────────────────────────────────────────

function SessionCard({ session, onClick }: { session: GenerationSession; onClick: () => void }) {
  const TYPE_COLORS: Record<string, string> = {
    Post: 'bg-zinc-100 text-zinc-600',
    Reel: 'bg-purple-100 text-purple-700',
    Story: 'bg-amber-100 text-amber-700',
    Carousel: 'bg-blue-100 text-blue-700',
  }
  const typeCount = session.posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.postType] = (acc[p.postType] ?? 0) + 1
    return acc
  }, {})
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-md group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-zinc-950">
            {new Date(session.generatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">{session.posts.length} posts</p>
        </div>
        <ChevronRight size={15} className="text-zinc-300 group-hover:text-zinc-500 transition mt-0.5" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {Object.entries(typeCount).map(([type, count]) => (
          <span key={type} className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[type] ?? 'bg-zinc-100 text-zinc-600'}`}>
            {count}× {type}
          </span>
        ))}
      </div>
      {session.preferences && (
        <p className="mt-2 text-xs text-zinc-400 italic truncate">"{session.preferences}"</p>
      )}
    </button>
  )
}

// ── Generic Promotions section (Deals or Events) ───────────────

type PromoItem = { id: string; title: string; sub?: string; badge?: string }

function PromoSection({
  title, icon, color, emptyText, items, fieldLabels,
  onAdd, onEdit, onRemove,
}: {
  title: string
  icon: React.ReactNode
  color: 'emerald' | 'blue'
  emptyText: string
  items: PromoItem[]
  fieldLabels: { sub: string; badge: string }
  onAdd: (item: PromoItem) => void
  onEdit: (item: PromoItem) => void
  onRemove: (id: string) => void
}) {
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const accent = color === 'emerald'
    ? { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', add: 'text-emerald-600 hover:text-emerald-800', ring: 'focus:border-emerald-500' }
    : { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700', add: 'text-blue-600 hover:text-blue-800', ring: 'focus:border-blue-500' }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`flex items-center gap-2 text-sm font-bold text-zinc-950`}>
          <span className={`${color === 'emerald' ? 'text-emerald-600' : 'text-blue-600'}`}>{icon}</span>
          {title}
          {items.length > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${accent.badge}`}>{items.length}</span>
          )}
        </h2>
        {!adding && editId === null && (
          <button type="button" onClick={() => setAdding(true)} className={`flex items-center gap-1 text-xs font-semibold ${accent.add} transition`}>
            <Plus size={13} /> Add
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item) =>
          editId === item.id ? (
            <PromoForm
              key={item.id}
              initial={item}
              fieldLabels={fieldLabels}
              accentRing={accent.ring}
              onSave={(updated) => { onEdit(updated); setEditId(null) }}
              onCancel={() => setEditId(null)}
            />
          ) : (
            <PromoCard
              key={item.id}
              item={item}
              dot={accent.dot}
              badge={accent.badge}
              onEdit={() => setEditId(item.id)}
              onRemove={() => onRemove(item.id)}
            />
          )
        )}

        {adding && (
          <PromoForm
            fieldLabels={fieldLabels}
            accentRing={accent.ring}
            onSave={(item) => { onAdd(item); setAdding(false) }}
            onCancel={() => setAdding(false)}
          />
        )}

        {!adding && editId === null && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="w-full rounded-xl border border-dashed border-zinc-200 py-2.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600"
          >
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

function PromoCard({ item, dot, badge, onEdit, onRemove }: {
  item: PromoItem; dot: string; badge: string; onEdit: () => void; onRemove: () => void
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 transition hover:border-zinc-200 hover:bg-white hover:shadow-sm">
      <span className={`size-2 shrink-0 rounded-full ${dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 truncate">{item.title}</p>
        {item.sub && <p className="text-xs text-zinc-400 truncate">{item.sub}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.badge && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}>{item.badge}</span>
        )}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button type="button" onClick={onEdit} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition">
            <Edit2 size={12} />
          </button>
          <button type="button" onClick={onRemove} className="rounded-lg p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

function PromoForm({ initial, fieldLabels, accentRing, onSave, onCancel }: {
  initial?: PromoItem
  fieldLabels: { sub: string; badge: string }
  accentRing: string
  onSave: (item: PromoItem) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [sub, setSub] = useState(initial?.sub ?? '')
  const [badge, setBadge] = useState(initial?.badge ?? '')

  const base = `h-9 w-full rounded-xl border border-zinc-200 bg-white px-3 text-xs text-zinc-900 outline-none transition ${accentRing} focus:ring-4 focus:ring-current/10`

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-2">
      <input autoFocus className={base} placeholder="Name *" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className={base} placeholder={`${fieldLabels.sub} (optional)`} value={sub} onChange={(e) => setSub(e.target.value)} />
      <input className={base} placeholder={`${fieldLabels.badge} (optional)`} value={badge} onChange={(e) => setBadge(e.target.value)} />
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 transition"
        >
          <X size={11} /> Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (!title.trim()) return
            onSave({ id: initial?.id ?? crypto.randomUUID(), title: title.trim(), sub: sub.trim() || undefined, badge: badge.trim() || undefined })
          }}
          disabled={!title.trim()}
          className="rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  )
}
