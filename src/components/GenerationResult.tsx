import { ArrowLeft, Camera, Check, Copy, Eye, EyeOff, Video } from 'lucide-react'
import { useState } from 'react'
import type { Business, GeneratedPost, GenerationSession } from '../types'
import { PostPreview } from './PostPreview'

const TYPE_COLOR: Record<string, string> = {
  Post: 'bg-zinc-100 text-zinc-600',
  Reel: 'bg-purple-100 text-purple-700',
  Story: 'bg-amber-100 text-amber-700',
  Carousel: 'bg-blue-100 text-blue-700',
}

export function GenerationResult({
  session,
  business,
  onBack,
}: {
  session: GenerationSession
  business: Business
  onBack: () => void
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <button
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-zinc-950"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={15} /> Dashboard
      </button>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Content plan</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{business.name} — 7 days</h1>
          <p className="mt-0.5 text-sm text-zinc-400">
            {new Date(session.generatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            {session.preferences ? ` · ${session.preferences.slice(0, 50)}` : ''}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {session.posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} business={business} />
        ))}
      </div>
    </div>
  )
}

function PostCard({
  post,
  index,
  business,
}: {
  post: GeneratedPost
  index: number
  business: Business
}) {
  const [copied, setCopied] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const isDesign = post.contentCategory === 'design'

  function copy() {
    navigator.clipboard.writeText(post.caption).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-2.5 px-5 pt-4 pb-3 border-b border-zinc-100">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-xs font-bold text-white">
          {index + 1}
        </span>
        <span className="text-sm font-semibold text-zinc-950">{post.day}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_COLOR[post.postType] ?? 'bg-zinc-100 text-zinc-600'}`}>
          {post.postType}
        </span>
        <span className={`ml-auto flex items-center gap-1 text-xs font-medium ${isDesign ? 'text-emerald-700' : 'text-blue-600'}`}>
          {isDesign ? (
            <><Eye size={11} /> digital</>
          ) : post.postType === 'Reel' ? (
            <><Video size={11} /> capture</>
          ) : (
            <><Camera size={11} /> capture</>
          )}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4 grid gap-3">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{post.title}</p>

        {/* Caption */}
        <div className="rounded-xl bg-zinc-50 px-4 py-3 relative">
          <p className="text-sm text-zinc-800 leading-6 whitespace-pre-wrap pr-16">{post.caption}</p>
          <button
            type="button"
            onClick={copy}
            className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-white border border-zinc-200 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm transition hover:bg-zinc-50"
          >
            {copied ? <><Check size={11} className="text-emerald-600" /> Copied</> : <><Copy size={11} /> Copy</>}
          </button>
        </div>

        {/* Capture note OR design preview toggle */}
        {isDesign ? (
          <button
            type="button"
            onClick={() => setPreviewOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 transition"
          >
            {previewOpen ? <EyeOff size={14} /> : <Eye size={14} />}
            {previewOpen ? 'Hide preview' : 'Preview graphic'}
          </button>
        ) : post.captureNote ? (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
            {post.postType === 'Reel' ? <Video size={12} className="shrink-0" /> : <Camera size={12} className="shrink-0" />}
            {post.captureNote}
          </div>
        ) : null}

        {/* Preview */}
        {isDesign && previewOpen && (
          <div className="w-full max-w-xs mx-auto mt-1">
            <PostPreview
              title={post.title}
              shortCaption={post.shortCaption}
              emoji={post.emoji ?? '✨'}
              handle={business.instagramHandle}
              primaryColor={business.primaryColor}
              secondaryColor={business.secondaryColor}
              template={post.designTemplate ?? 'bold'}
            />
          </div>
        )}

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5">
          {post.hashtags.map((h) => (
            <span
              key={h}
              className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
