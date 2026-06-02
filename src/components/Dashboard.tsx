import { ArrowLeft, ArrowRight, Download, WandSparkles } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useRef, useState } from 'react'
import { CaptionGenerator } from './CaptionGenerator'
import { ContentPlan } from './ContentPlan'
import { InstagramPostPreview } from './InstagramPostPreview'
import { ProgressIndicator } from './ProgressIndicator'
import { generateCaptionPackage, generateContentPlan } from '../lib/mockGenerator'
import type { BusinessAssets, BusinessProfile, SavedPost } from '../types'

export function Dashboard({
  assets,
  business,
  isDemoMode = false,
  onBackToAssets,
  onBackToProfile,
  onReset,
  onSavedPostsChange,
  savedPosts,
}: {
  assets: BusinessAssets
  business: BusinessProfile
  isDemoMode?: boolean
  onBackToAssets: () => void
  onBackToProfile: () => void
  onReset: () => void
  onSavedPostsChange: (posts: SavedPost[]) => void
  savedPosts: SavedPost[]
}) {
  const contentPlan = generateContentPlan(business, assets)
  const previewRef = useRef<HTMLDivElement>(null)
  const exportSectionRef = useRef<HTMLDivElement>(null)
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(3)
  const selectedIdea = contentPlan[selectedIdeaIndex]
  const captionPackage = generateCaptionPackage(business, selectedIdea)

  const saveSelectedPost = () => {
    const id = `${selectedIdea.day}-${selectedIdea.title}`
    const existingPost = savedPosts.find((post) => post.id === id)
    const nextPost = { id, idea: selectedIdea, captionPackage, createdAt: existingPost?.createdAt ?? new Date().toISOString() }
    const existingIndex = savedPosts.findIndex((post) => post.id === id)

    if (existingIndex === -1) {
      onSavedPostsChange([nextPost, ...savedPosts])
      return
    }

    onSavedPostsChange(savedPosts.map((post, index) => (index === existingIndex ? nextPost : post)))
  }

  const downloadPreview = async () => {
    setCurrentStep(4)
    if (!previewRef.current) {
      setExportError('Preview is not ready yet. Please try again.')
      return
    }

    setIsExporting(true)
    setExportError(null)

    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: business.primaryColor,
        canvasWidth: 1800,
        canvasHeight: 1800,
      })
      const link = document.createElement('a')
      link.download = `${slugify(`postmate-${business.businessName}-${selectedIdea.title}`)}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error(error)
      setExportError('Export failed. Please try again after the preview finishes rendering.')
    } finally {
      setIsExporting(false)
    }
  }

  const goToExport = () => {
    setCurrentStep(4)
    exportSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleStepClick = (step: number) => {
    if (step === 1) {
      onBackToProfile()
      return
    }

    if (step === 2) {
      onBackToAssets()
      return
    }

    if (step === 3) {
      setCurrentStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 4) {
      goToExport()
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      <section className="bg-[#f7f4ee] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProgressIndicator availableSteps={[1, 2, 3, 4]} currentStep={currentStep} onStepClick={handleStepClick} />
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-10">
        <div className="grid gap-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Generator</p>
                  {isDemoMode ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">Demo mode: using sample restaurant data</span> : null}
                </div>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight">{business.businessName}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                  {business.industry} in {business.location}. Tone: {business.tone}.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-md bg-zinc-950 px-3 py-2 text-sm font-semibold text-white">
                <WandSparkles size={16} /> Ready to export
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-zinc-600">
              <span className="rounded-full bg-stone-100 px-3 py-1">{assets.menuItems.length} menu items</span>
              <span className="rounded-full bg-stone-100 px-3 py-1">{assets.photos.length} photos</span>
              <span className="rounded-full bg-stone-100 px-3 py-1">{assets.reviews.length} reviews</span>
              <span className="rounded-full bg-stone-100 px-3 py-1">{assets.events.length} events</span>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-stone-50" onClick={onBackToAssets} type="button">
                <ArrowLeft size={16} /> Back
              </button>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-emerald-950" onClick={goToExport} type="button">
                Go to export <ArrowRight size={16} />
              </button>
              <button className="inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-zinc-600 transition hover:bg-stone-100 hover:text-zinc-950" onClick={onReset} type="button">
                Edit setup
              </button>
            </div>
          </div>
          <CaptionGenerator assetSummary={`Generated from ${assets.menuItems.length} menu items, ${assets.photos.length} photos, ${assets.reviews.length} reviews, ${assets.events.length} events`} idea={selectedIdea} output={captionPackage} onSave={saveSelectedPost} />
          <ContentPlan ideas={contentPlan} selectedIndex={selectedIdeaIndex} onSelect={setSelectedIdeaIndex} />
          <DemoSummary assets={assets} business={business} />
        </div>
        <div className="lg:sticky lg:top-20 lg:self-start" ref={exportSectionRef}>
          <div className="grid gap-3">
            <InstagramPostPreview business={business} exportRef={previewRef} idea={selectedIdea} />
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white shadow-lg shadow-zinc-950/10 transition hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isExporting}
              onClick={downloadPreview}
              type="button"
            >
              <Download size={17} /> {isExporting ? 'Exporting PNG...' : 'Download PNG'}
            </button>
            {exportError ? <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{exportError}</p> : null}
          </div>
        </div>
      </section>
    </main>
  )
}

function DemoSummary({ assets, business }: { assets: BusinessAssets; business: BusinessProfile }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Demo summary</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">How PostMate generated this campaign</h2>
      <p className="mt-4 leading-7 text-zinc-600">
        PostMate used the {business.businessName} business profile, menu items, customer reviews, photo categories, and current offers to generate this weekly content plan, caption package, Instagram preview, and export-ready post.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryStat label="Menu items" value={assets.menuItems.length} />
        <SummaryStat label="Photos" value={assets.photos.length} />
        <SummaryStat label="Reviews" value={assets.reviews.length} />
        <SummaryStat label="Events/offers" value={assets.events.length} />
      </div>
    </section>
  )
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-[#f7f4ee] p-4">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm font-medium text-zinc-600">{label}</p>
    </div>
  )
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
