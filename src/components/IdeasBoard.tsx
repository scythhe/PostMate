import { ArrowLeft, Loader2, RefreshCw, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generateIdeas } from '../lib/aiGenerator'
import { clearSavedIdeas, getSavedIdeas, saveIdeas } from '../lib/storage'
import type { Business, ContentIdea } from '../types'

const TYPE_COLORS: Record<string, string> = {
  'Post':     'bg-zinc-100 text-zinc-600',
  'Reel':     'bg-purple-100 text-purple-700',
  'Story':    'bg-amber-100 text-amber-700',
  'Carousel': 'bg-blue-100 text-blue-700',
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function IdeasBoard({
  business,
  onSelect,
  onBack,
}: {
  business: Business
  onSelect: (idea: ContentIdea) => void
  onBack: () => void
}) {
  const [ideas, setIdeas]       = useState<ContentIdea[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [savedAt, setSavedAt]   = useState<string | null>(null)

  useEffect(() => {
    const saved = getSavedIdeas(business.id)
    if (saved && saved.ideas.length >= 10) {
      setIdeas(saved.ideas)
      setSavedAt(saved.savedAt)
    } else {
      load()
    }
  }, [])

  async function load() {
    setLoading(true); setError('')
    try {
      const fresh = await generateIdeas(business)
      setIdeas(fresh)
      saveIdeas(business.id, fresh)
      setSavedAt(new Date().toISOString())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate ideas.')
    } finally {
      setLoading(false)
    }
  }

  async function refresh() {
    clearSavedIdeas(business.id)
    await load()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <button
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-950 transition"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={16} /> Dashboard
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Content ideas</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">What do you want to post?</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Pick an idea — we'll write the full post for you.
            {savedAt && !loading && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs text-zinc-400">
                <Sparkles size={10} className="text-emerald-600" />
                Generated {timeAgo(savedAt)}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-40"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Generating…' : 'Fresh ideas'}
        </button>
      </div>

      {loading && ideas.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <Loader2 size={32} className="animate-spin text-emerald-700" />
          <p className="text-sm font-medium text-zinc-500">Generating 20 content ideas for {business.name}…</p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
          {error}{' '}
          <button onClick={load} className="ml-2 underline font-medium" type="button">
            Try again
          </button>
        </div>
      )}

      {ideas.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ideas.map(idea => (
            <IdeaCard key={idea.id} idea={idea} onSelect={() => onSelect(idea)} />
          ))}
        </div>
      )}
    </div>
  )
}

function IdeaCard({ idea, onSelect }: { idea: ContentIdea; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group text-left rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-2xl">{idea.emoji}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[idea.postType] ?? 'bg-zinc-100 text-zinc-600'}`}>
          {idea.postType}
        </span>
      </div>
      <p className="text-sm font-bold text-zinc-950 leading-snug">{idea.title}</p>
      <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed line-clamp-2">{idea.hook}</p>
      <div className="mt-3 flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${idea.contentCategory === 'design' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
          {idea.contentCategory === 'design' ? '🎨 Graphic' : '📷 Photo/Video'}
        </span>
      </div>
      <p className="mt-3 text-xs font-semibold text-emerald-700 opacity-0 group-hover:opacity-100 transition">
        Generate this post →
      </p>
    </button>
  )
}
