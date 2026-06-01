import { Download, WandSparkles } from 'lucide-react'
import { toPng } from 'html-to-image'
import { useRef, useState } from 'react'
import { CaptionGenerator } from './CaptionGenerator'
import { ContentPlan } from './ContentPlan'
import { InstagramPostPreview } from './InstagramPostPreview'
import { BrandLogo } from './Navbar'
import { ProgressIndicator } from './ProgressIndicator'
import { SavedPosts } from './SavedPosts'
import { generateCaptionPackage, generateContentPlan } from '../lib/mockGenerator'
import type { BusinessAssets, BusinessProfile, SavedPost } from '../types'

export function Dashboard({ assets, business, onReset }: { assets: BusinessAssets; business: BusinessProfile; onReset: () => void }) {
  const contentPlan = generateContentPlan(business, assets)
  const previewRef = useRef<HTMLDivElement>(null)
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState(0)
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const selectedIdea = contentPlan[selectedIdeaIndex]
  const captionPackage = generateCaptionPackage(business, selectedIdea)

  const saveSelectedPost = () => {
    const id = `${selectedIdea.day}-${selectedIdea.title}`
    setSavedPosts((current) => {
      const nextPost = { id, idea: selectedIdea, captionPackage }
      const existingIndex = current.findIndex((post) => post.id === id)

      if (existingIndex === -1) {
        return [nextPost, ...current]
      }

      return current.map((post, index) => (index === existingIndex ? nextPost : post))
    })
  }

  const downloadPreview = async () => {
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

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      <nav className="border-b border-zinc-950/10 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a className="flex items-center" href="#">
            <BrandLogo />
          </a>
          <button className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-950" onClick={onReset} type="button">
            Edit setup
          </button>
        </div>
      </nav>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-14">
        <div className="grid gap-6">
          <ProgressIndicator currentStep={3} />
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">{business.businessName}</h1>
            <p className="mt-4 max-w-2xl leading-8 text-zinc-600">
              {business.industry} in {business.location}. Tone: {business.tone}.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {['Content plan', 'Caption', 'Hashtags'].map((item) => (
              <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm" key={item}>
                <WandSparkles className="text-emerald-700" size={20} />
                <h2 className="mt-4 text-lg font-semibold">{item}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">Generated from your profile and business assets.</p>
              </article>
            ))}
          </div>
          <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Generated caption</h2>
            <p className="mt-3 leading-7 text-zinc-700">
              Step inside {business.businessName} for {business.offer.toLowerCase()}. Crafted for {business.targetAudience.toLowerCase()}, with a voice that feels {business.tone.toLowerCase()}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-600">
              <span className="rounded-full bg-stone-100 px-3 py-1">{assets.menuItems.length} menu items</span>
              <span className="rounded-full bg-stone-100 px-3 py-1">{assets.photos.length} photos</span>
              <span className="rounded-full bg-stone-100 px-3 py-1">{assets.reviews.length} reviews</span>
              <span className="rounded-full bg-stone-100 px-3 py-1">{assets.events.length} events</span>
            </div>
          </article>
          <ContentPlan ideas={contentPlan} selectedIndex={selectedIdeaIndex} onSelect={setSelectedIdeaIndex} />
          <CaptionGenerator idea={selectedIdea} output={captionPackage} onSave={saveSelectedPost} />
          <SavedPosts business={business} posts={savedPosts} />
          <DemoSummary assets={assets} business={business} />
        </div>
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="grid gap-3">
            <ProgressIndicator currentStep={4} />
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
