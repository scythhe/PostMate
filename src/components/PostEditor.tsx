import { ArrowLeft, Calendar, Check, CheckCircle, ClipboardCopy, Image, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generatePost } from '../lib/aiGenerator'
import { deletePost, savePost } from '../lib/storage'
import type { Business, ContentIdea, Post } from '../types'
import { PostPreview } from './PostPreview'
import type { DesignTemplate } from '../types'

export function PostEditor({
  business,
  idea,
  onBack,
  onApproved,
}: {
  business: Business
  idea: ContentIdea
  onBack: () => void
  onApproved: (post: Post) => void
}) {
  const [post, setPost]           = useState<Post | null>(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied]       = useState(false)
  const [schedDate, setSchedDate] = useState('')
  const [error, setError]         = useState('')

  async function generate() {
    setLoading(true); setError(''); setPost(null)
    try {
      const p = await generatePost(business, idea)
      setPost(p)
      await savePost(p)
    } catch (e) { setError(e instanceof Error ? e.message : 'Generation failed.') }
    finally { setLoading(false) }
  }

  useEffect(() => { generate() }, [])

  async function handleApprove() {
    if (!post) return
    setSaving(true)
    const updated: Post = { ...post, status: 'approved', scheduledDate: schedDate || undefined }
    try { await savePost(updated); onApproved(updated) }
    catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!post) return
    await deletePost(post.id, business.id)
    onBack()
  }

  function copyCaption() {
    if (!post) return
    navigator.clipboard.writeText(`${post.caption}\n\n${post.hashtags.join(' ')}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const TYPE_COLORS: Record<string, string> = {
    Post: 'bg-zinc-100 text-zinc-600', Reel: 'bg-purple-100 text-purple-700',
    Story: 'bg-amber-100 text-amber-700', Carousel: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <button className="mb-6 flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-950 transition" onClick={onBack} type="button">
        <ArrowLeft size={16} /> Back to ideas
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{idea.emoji}</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{idea.type}</p>
          <h1 className="text-xl font-bold text-zinc-950">{idea.title}</h1>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-12 flex flex-col items-center gap-4 text-center">
          <Loader2 size={32} className="animate-spin text-emerald-700" />
          <p className="text-sm font-medium text-zinc-500">Writing your post…</p>
          <p className="text-xs text-zinc-400">Tailoring it to {business.name}'s brand and voice.</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
          {error}
          <button onClick={generate} className="ml-2 underline font-medium" type="button">Try again</button>
        </div>
      )}

      {!loading && post && (
        <div className="grid gap-4">
          {/* Post meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${TYPE_COLORS[post.postType] ?? ''}`}>{post.postType}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${post.contentCategory === 'design' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
              {post.contentCategory === 'design' ? '🎨 Graphic' : '📷 Photo/Video'}
            </span>
            {post.status === 'approved' && (
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white flex items-center gap-1">
                <CheckCircle size={11} /> Approved
              </span>
            )}
          </div>

          {/* Capture note */}
          {post.contentCategory === 'capture' && post.captureNote && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-800">
              📷 <span className="font-bold">Shoot note:</span> {post.captureNote}
            </div>
          )}

          {/* Design preview toggle */}
          {post.contentCategory === 'design' && (
            <button
              type="button"
              onClick={() => setShowPreview(v => !v)}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-600 hover:border-zinc-300 transition w-fit"
            >
              <Image size={14} /> {showPreview ? 'Hide graphic preview' : 'Preview graphic'}
            </button>
          )}
          {showPreview && post.contentCategory === 'design' && (
            <div className="rounded-2xl overflow-hidden border border-zinc-200">
              <PostPreview
                title={post.title}
                shortCaption={post.shortCaption}
                emoji={post.emoji}
                handle={business.instagramHandle || `@${business.name.toLowerCase().replace(/\s+/g, '')}`}
                primaryColor={business.primaryColor}
                secondaryColor={business.secondaryColor}
                template={(post.designTemplate ?? 'bold') as DesignTemplate}
              />
            </div>
          )}

          {/* Caption */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Caption</p>
              <button
                type="button" onClick={copyCaption}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition"
              >
                {copied ? <><Check size={11} className="text-emerald-600" /> Copied!</> : <><ClipboardCopy size={11} /> Copy</>}
              </button>
            </div>
            <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-line">{post.caption}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.hashtags.map(h => (
                <span key={h} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">{h}</span>
              ))}
            </div>
          </div>

          {/* Image prompt */}
          {post.imagePrompt && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Image prompt</p>
              <p className="text-sm text-zinc-600 italic leading-relaxed">{post.imagePrompt}</p>
              <p className="mt-2 text-xs text-zinc-400">Use this prompt in Midjourney, DALL·E, or Stable Diffusion to generate the visual.</p>
            </div>
          )}

          {/* Schedule + approve */}
          {post.status !== 'approved' && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Schedule (optional)</p>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-zinc-400 shrink-0" />
                <input
                  type="date"
                  className="h-10 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                  value={schedDate}
                  onChange={e => setSchedDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              type="button" onClick={generate} disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-600 hover:border-zinc-300 transition disabled:opacity-40"
            >
              <RefreshCw size={14} /> Regenerate
            </button>
            <button
              type="button" onClick={handleDelete}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
            >
              <Trash2 size={14} /> Delete
            </button>
            {post.status !== 'approved' && (
              <button
                type="button" onClick={handleApprove} disabled={saving}
                className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition disabled:opacity-40"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                {saving ? 'Saving…' : 'Approve post'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
