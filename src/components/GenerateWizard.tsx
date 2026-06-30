import { ArrowLeft, ArrowRight, Calendar, Loader2, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generatePosts } from '../lib/aiGenerator'
import { countSessionsThisMonth, currentMonthKey, getRecentPostTitles, saveSession } from '../lib/storage'
import type { Business, GenerationSession } from '../types'

const MAX_PER_MONTH = 4

export function GenerateWizard({
  business,
  onDone,
  onBack,
}: {
  business: Business
  onDone: (session: GenerationSession) => void
  onBack: () => void
}) {
  const monthKey = currentMonthKey()
  const [used, setUsed] = useState(0)
  const [preferences, setPreferences] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    countSessionsThisMonth(business.id, monthKey).then(setUsed)
  }, [business.id, monthKey])

  const remaining = MAX_PER_MONTH - used

  async function handleGenerate() {
    if (remaining <= 0) return
    setLoading(true)
    setError('')
    try {
      const previousTitles = await getRecentPostTitles(business.id)
      const posts = await generatePosts(business, preferences, previousTitles)
      const session: GenerationSession = {
        id: crypto.randomUUID(),
        businessId: business.id,
        generatedAt: new Date().toISOString(),
        monthKey,
        preferences,
        posts,
      }
      await saveSession(session)
      onDone(session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const monthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <button className="mb-6 flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-zinc-950" onClick={onBack} type="button">
        <ArrowLeft size={16} /> Dashboard
      </button>

      <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Generate</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">7-day content plan</h1>
      <p className="mt-1 text-sm text-zinc-400">For <span className="font-semibold text-zinc-700">{business.name}</span></p>

      {/* Usage counter */}
      <div className={`mt-6 flex items-center justify-between rounded-2xl border px-5 py-4 ${remaining === 0 ? 'border-red-200 bg-red-50' : 'border-zinc-200 bg-white'}`}>
        <div>
          <p className="text-sm font-semibold text-zinc-950">{monthLabel}</p>
          <p className={`text-sm mt-0.5 ${remaining === 0 ? 'text-red-600' : 'text-zinc-400'}`}>
            {remaining === 0 ? 'Monthly limit reached. Come back next month.' : `${remaining} of ${MAX_PER_MONTH} generations remaining`}
          </p>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_PER_MONTH }).map((_, i) => (
            <span key={i} className={`h-2 w-6 rounded-full ${i < used ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
          ))}
        </div>
      </div>

      {/* Active context for AI */}
      {(business.deals.length > 0 || business.events.length > 0) && (
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">AI will include these</p>
          <div className="grid gap-2">
            {business.deals.map((d) => (
              <div key={d.id} className="flex items-center gap-2 text-sm text-zinc-700">
                <Tag size={13} className="shrink-0 text-emerald-600" />
                <span className="font-medium">{d.title}</span>
                {d.description && <span className="text-zinc-400">— {d.description}</span>}
              </div>
            ))}
            {business.events.map((ev) => (
              <div key={ev.id} className="flex items-center gap-2 text-sm text-zinc-700">
                <Calendar size={13} className="shrink-0 text-emerald-600" />
                <span className="font-medium">{ev.title}</span>
                {ev.description && <span className="text-zinc-400">— {ev.description}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preferences */}
      <div className="mt-4">
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
          Any preferences for this week?
          <span className="text-xs font-normal text-zinc-400">Optional — steer the AI toward specific content.</span>
          <textarea
            className="min-h-[100px] resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="e.g. More Reels this week, focus on the new menu, include a customer story…"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            disabled={loading || remaining === 0}
          />
        </label>
      </div>

      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <button
        className="mt-5 inline-flex w-full h-12 items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-sm font-bold text-white transition hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={loading || remaining === 0}
        onClick={handleGenerate}
        type="button"
      >
        {loading ? <><Loader2 size={17} className="animate-spin" /> Generating…</> : <>Generate 7 posts <ArrowRight size={17} /></>}
      </button>

      {remaining > 0 && (
        <p className="mt-3 text-center text-xs text-zinc-400">Uses 1 of your {remaining} remaining for {monthLabel}.</p>
      )}
    </div>
  )
}
