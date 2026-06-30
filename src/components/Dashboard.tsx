import { ArrowLeft, Check, Copy, Download, ExternalLink, Loader2, RefreshCw, Sparkles, WandSparkles } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useEffect, useRef, useState } from 'react'
import { InstagramPostPreview } from './InstagramPostPreview'
import { generateContent } from '../lib/aiGenerator'
import type { BusinessProfile, ContentIdea, GeneratedContent, GeneratedDay, InputProfile, SavedPost } from '../types'

export function Dashboard({
  profile,
  savedPosts,
  onSavedPostsChange,
  onBack,
}: {
  profile: InputProfile
  savedPosts: SavedPost[]
  onSavedPostsChange: (posts: SavedPost[]) => void
  onBack: () => void
}) {
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const runGeneration = () => {
    setIsGenerating(true)
    setContent(null)
    generateContent(profile)
      .then(setContent)
      .finally(() => setIsGenerating(false))
  }

  useEffect(() => {
    runGeneration()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (isGenerating) return <LoadingState />
  if (!content || content.days.length === 0) return <ErrorState onBack={onBack} onRetry={runGeneration} />

  const selectedDay = content.days[selectedIndex] ?? content.days[0]
  const business = profileToBusiness(profile, content)

  const selectedIdea: ContentIdea = {
    day: selectedDay.day,
    postType: selectedDay.postType,
    title: selectedDay.title,
    description: selectedDay.description,
    cta: selectedDay.cta,
  }

  const savePost = (day: GeneratedDay) => {
    const id = `${day.day}-${day.title}`
    const post: SavedPost = {
      id,
      idea: {
        day: day.day,
        postType: day.postType,
        title: day.title,
        description: day.description,
        cta: day.cta,
      },
      captionPackage: {
        caption: day.caption,
        shortCaption: day.shortCaption,
        hashtags: day.hashtags,
        storyText: day.storyText,
        cta: day.cta,
      },
      createdAt: savedPosts.find((p) => p.id === id)?.createdAt ?? new Date().toISOString(),
    }
    const existingIndex = savedPosts.findIndex((p) => p.id === id)
    if (existingIndex === -1) {
      onSavedPostsChange([post, ...savedPosts])
    } else {
      onSavedPostsChange(savedPosts.map((p, i) => (i === existingIndex ? post : p)))
    }
  }

  const downloadPng = async () => {
    if (!previewRef.current) return
    setIsExporting(true)
    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: profile.primaryColor,
        canvasWidth: 1800,
        canvasHeight: 1800,
      })
      const a = document.createElement('a')
      a.download = `postmate-${slugify(content.businessName)}-${slugify(selectedDay.title)}.png`
      a.href = dataUrl
      a.click()
    } finally {
      setIsExporting(false)
    }
  }

  const isSaved = (day: GeneratedDay) =>
    savedPosts.some((p) => p.id === `${day.day}-${day.title}`)

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      {/* Header */}
      <section className="border-b border-zinc-950/5 bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Campaign</p>
              {content.isAiGenerated ? (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                  <Sparkles size={11} /> Generated with AI
                </span>
              ) : (
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-zinc-500">
                  Local generation (add n8n webhook for real AI)
                </span>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{content.businessName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
              <a
                className="flex items-center gap-1 transition hover:text-emerald-700"
                href={profile.websiteUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink size={12} /> {profile.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
              {profile.instagramHandle && (
                <span className="flex items-center gap-1">
                  {profile.instagramHandle.startsWith('@') ? profile.instagramHandle : `@${profile.instagramHandle}`}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-stone-50"
              onClick={onBack}
              type="button"
            >
              <ArrowLeft size={15} /> Edit business
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-emerald-950"
              onClick={runGeneration}
              type="button"
            >
              <RefreshCw size={15} /> Regenerate
            </button>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        {/* Left: 7-day plan */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">7-day Instagram plan</h2>
            <span className="text-sm text-zinc-500">{selectedDay.day} selected</span>
          </div>
          {content.days.map((day, index) => (
            <DayCard
              day={day}
              isSelected={index === selectedIndex}
              isSaved={isSaved(day)}
              key={day.day}
              onSelect={() => setSelectedIndex(index)}
              onSave={() => savePost(day)}
            />
          ))}
        </div>

        {/* Right: sticky preview + info */}
        <aside className="grid gap-4 lg:sticky lg:top-24 lg:self-start">
          <InstagramPostPreview business={business} exportRef={previewRef} idea={selectedIdea} />
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isExporting}
            onClick={downloadPng}
            type="button"
          >
            <Download size={17} /> {isExporting ? 'Exporting...' : 'Download PNG'}
          </button>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm">
            <p className="font-semibold text-zinc-950">Campaign summary</p>
            <p className="mt-2 leading-6 text-zinc-600">{content.offer}</p>
            <div className="mt-3 grid gap-1.5 text-xs text-zinc-500">
              <span>Tone: {content.tone}</span>
              <span>Audience: {content.targetAudience}</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

function DayCard({
  day,
  isSelected,
  isSaved,
  onSelect,
  onSave,
}: {
  day: GeneratedDay
  isSelected: boolean
  isSaved: boolean
  onSelect: () => void
  onSave: () => void
}) {
  return (
    <div
      className={`rounded-xl border transition-all ${
        isSelected
          ? 'border-emerald-800 bg-emerald-950 text-white shadow-lg shadow-emerald-950/15'
          : 'border-zinc-200 bg-white text-zinc-950 hover:border-emerald-800/30 hover:shadow-md'
      }`}
    >
      {/* Header row — always visible, click to select */}
      <button className="w-full p-5 text-left" onClick={onSelect} type="button">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-semibold ${isSelected ? 'text-amber-200' : 'text-emerald-700'}`}
            >
              {day.day}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                isSelected
                  ? 'bg-white/10 text-white ring-white/20'
                  : 'bg-stone-100 text-zinc-600 ring-zinc-200'
              }`}
            >
              {day.postType}
            </span>
          </div>
          <span
            className={`text-xs font-semibold ${isSelected ? 'text-white/60' : 'text-zinc-400'}`}
          >
            {isSelected ? '▾ selected' : '▸ select'}
          </span>
        </div>
        <h3 className="mt-2 text-base font-semibold tracking-tight">{day.title}</h3>
        {!isSelected && (
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-500">{day.description}</p>
        )}
      </button>

      {/* Expanded caption content */}
      {isSelected && (
        <div className="border-t border-white/10 px-5 pb-5 pt-4">
          <div className="grid gap-4">
            <CaptionBlock label="Caption" text={day.caption} light />
            <div className="grid gap-4 sm:grid-cols-2">
              <CaptionBlock label="Short caption" text={day.shortCaption} light />
              <CaptionBlock label="Story text" text={day.storyText} light />
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Hashtags</p>
                <CopyBtn text={day.hashtags.join(' ')} light />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {day.hashtags.map((tag) => (
                  <span
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-amber-500/20 px-4 py-3">
              <p className="text-sm font-semibold text-amber-200">CTA: {day.cta}</p>
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white px-4 text-xs font-semibold text-zinc-950 transition hover:bg-stone-100"
                onClick={onSave}
                type="button"
              >
                <Check size={13} /> {isSaved ? 'Saved ✓' : 'Save post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CaptionBlock({
  label,
  text,
  light = false,
}: {
  label: string
  text: string
  light?: boolean
}) {
  return (
    <div className={`rounded-lg p-4 ${light ? 'bg-white/10' : 'border border-zinc-200 bg-[#f7f4ee]'}`}>
      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm font-semibold ${light ? 'text-white' : 'text-zinc-950'}`}>{label}</p>
        <CopyBtn text={text} light={light} />
      </div>
      <p className={`mt-2 text-sm leading-6 ${light ? 'text-white/75' : 'text-zinc-600'}`}>{text}</p>
    </div>
  )
}

function CopyBtn({ text, light }: { text: string; light?: boolean }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <button
      className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition ${
        light
          ? 'bg-white/15 text-white hover:bg-white/25'
          : 'bg-white text-zinc-600 ring-1 ring-zinc-200 hover:text-zinc-950'
      }`}
      onClick={handleCopy}
      type="button"
    >
      <Copy size={11} /> {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-[#f7f4ee]">
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
        <div className="grid size-16 place-items-center rounded-2xl bg-emerald-950 text-white shadow-xl shadow-emerald-950/20">
          <WandSparkles size={28} />
        </div>
        <Loader2 className="animate-spin text-emerald-700" size={32} />
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Building your content plan...</h2>
          <p className="mt-2 text-zinc-500">PostMate is generating 7 days of Instagram content for your business.</p>
        </div>
      </div>
    </main>
  )
}

function ErrorState({ onBack, onRetry }: { onBack: () => void; onRetry: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f4ee] text-center">
      <h2 className="text-2xl font-semibold">Generation failed</h2>
      <p className="max-w-sm text-zinc-500">
        Something went wrong. Try again or go back and check your details.
      </p>
      <div className="flex gap-3">
        <button
          className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700"
          onClick={onBack}
          type="button"
        >
          Back
        </button>
        <button
          className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white"
          onClick={onRetry}
          type="button"
        >
          Retry
        </button>
      </div>
    </main>
  )
}

function profileToBusiness(profile: InputProfile, content: GeneratedContent): BusinessProfile {
  return {
    businessName: content.businessName,
    industry: 'Local business',
    location: profile.instagramHandle || profile.websiteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
    tone: content.tone,
    targetAudience: content.targetAudience,
    offer: content.offer,
    primaryColor: profile.primaryColor,
    secondaryColor: profile.secondaryColor,
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
