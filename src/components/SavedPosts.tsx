import { Download, ExternalLink, Trash2 } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useRef, useState } from 'react'
import { MiniInstagramPreview } from './InstagramPostPreview'
import type { BusinessProfile, SavedPost } from '../types'

export function SavedPosts({
  business,
  onDelete,
  onOpen,
  posts,
}: {
  business: BusinessProfile
  onDelete: (id: string) => void
  onOpen: (post: SavedPost) => void
  posts: SavedPost[]
}) {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">History</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Saved Posts</h1>
            <p className="mt-3 max-w-2xl leading-7 text-zinc-600">Your generated Instagram post packages are saved locally to this mock account.</p>
          </div>
          <span className="w-fit rounded-full bg-white px-3 py-1 text-sm font-semibold text-zinc-600 ring-1 ring-zinc-200">{posts.length} saved</span>
        </div>

        {posts.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">No saved posts yet.</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-zinc-600">Generate your first campaign, choose an idea, then save the post package here.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {posts.map((post) => (
              <SavedPostCard business={business} key={post.id} onDelete={() => onDelete(post.id)} onOpen={() => onOpen(post)} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function SavedPostCard({
  business,
  onDelete,
  onOpen,
  post,
}: {
  business: BusinessProfile
  onDelete: () => void
  onOpen: () => void
  post: SavedPost
}) {
  const previewRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadPng = async () => {
    if (!previewRef.current) return
    setIsDownloading(true)
    setError(null)

    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: business.primaryColor,
        canvasWidth: 900,
        canvasHeight: 900,
      })
      const link = document.createElement('a')
      link.download = `${slugify(`postmate-${business.businessName}-${post.idea.title}`)}.png`
      link.href = dataUrl
      link.click()
    } catch {
      setError('PNG download failed. Try again after the preview loads.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <article className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:grid-cols-[8.5rem_1fr]">
      <div ref={previewRef}>
        <MiniInstagramPreview business={business} idea={post.idea} />
      </div>
      <div className="min-w-0">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold text-emerald-700">{formatDate(post.createdAt)}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">{post.idea.title}</h2>
          </div>
          <span className="w-fit rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-zinc-600">{post.idea.postType}</span>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">{post.captionPackage.caption}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {post.captionPackage.hashtags.map((tag) => (
            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-zinc-600" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-emerald-950" onClick={onOpen} type="button">
            <ExternalLink size={15} /> Open
          </button>
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition hover:bg-stone-50" disabled={isDownloading} onClick={downloadPng} type="button">
            <Download size={15} /> {isDownloading ? 'Downloading...' : 'Download PNG'}
          </button>
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100" onClick={onDelete} type="button">
            <Trash2 size={15} /> Delete
          </button>
        </div>
        {error ? <p className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p> : null}
      </div>
    </article>
  )
}

function formatDate(value?: string) {
  if (!value) return 'Saved recently'
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
