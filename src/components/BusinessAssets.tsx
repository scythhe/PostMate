import { ArrowLeft, ArrowRight, ImagePlus, Plus, Quote, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { demoBusinessAssets } from '../lib/mockGenerator'
import { ProgressIndicator } from './ProgressIndicator'
import type { BusinessAssets as BusinessAssetsData, BusinessProfile, PhotoCategory } from '../types'

const photoCategories: PhotoCategory[] = ['interior', 'food', 'drinks', 'exterior', 'ambience', 'team']

const emptyAssets: BusinessAssetsData = {
  menuItems: [],
  photos: [],
  reviews: [],
  events: [],
}

export function BusinessAssets({
  business,
  onBack,
  onSubmit,
}: {
  business: BusinessProfile
  onBack: () => void
  onSubmit: (assets: BusinessAssetsData) => void
}) {
  const [assets, setAssets] = useState<BusinessAssetsData>(emptyAssets)
  const [menuDraft, setMenuDraft] = useState({
    name: 'Adjara black truffle khachapuri',
    category: 'Signature dish',
    description: 'A refined tableside take on Georgian comfort with aged cheese and black truffle.',
    price: 'GEL 42',
    isFeatured: true,
  })
  const [photoCategory, setPhotoCategory] = useState<PhotoCategory>('interior')
  const [reviewDraft, setReviewDraft] = useState({
    text: 'The most elegant Georgian dinner we had in Tbilisi. Every course felt personal.',
    author: 'Nino K.',
  })
  const [eventDraft, setEventDraft] = useState('Friday cellar dinner with rare Kakheti wine pairings')

  const addMenuItem = () => {
    if (!menuDraft.name.trim()) return
    setAssets((current) => ({
      ...current,
      menuItems: [{ id: crypto.randomUUID(), ...menuDraft }, ...current.menuItems],
    }))
    setMenuDraft({ name: '', category: '', description: '', price: '', isFeatured: false })
  }

  const addPhotos = (files: FileList | null) => {
    if (!files) return
    const nextPhotos = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      category: photoCategory,
      fileName: file.name,
      previewUrl: URL.createObjectURL(file),
    }))
    setAssets((current) => ({ ...current, photos: [...nextPhotos, ...current.photos] }))
  }

  const addReview = () => {
    if (!reviewDraft.text.trim()) return
    setAssets((current) => ({
      ...current,
      reviews: [{ id: crypto.randomUUID(), ...reviewDraft }, ...current.reviews],
    }))
    setReviewDraft({ text: '', author: '' })
  }

  const addEvent = () => {
    if (!eventDraft.trim()) return
    setAssets((current) => ({ ...current, events: [eventDraft, ...current.events] }))
    setEventDraft('')
  }

  const removeItem = (collection: keyof BusinessAssetsData, idOrValue: string) => {
    setAssets((current) => ({
      ...current,
      [collection]: current[collection].filter((item) => (typeof item === 'string' ? item !== idOrValue : item.id !== idOrValue)),
    }))
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      <section className="bg-[#f7f4ee] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProgressIndicator availableSteps={[1, 2]} currentStep={2} onStepClick={(step) => (step === 1 ? onBack() : undefined)} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-10">
        <div className="grid gap-6">
          <header className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Business assets</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight">Give PostMate real material to work with.</h1>
                <p className="mt-2 text-sm font-semibold text-zinc-500">{business.businessName}</p>
              </div>
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-950" onClick={onBack} type="button">
                <ArrowLeft size={16} /> Back
              </button>
            </div>
            <p className="mt-4 max-w-2xl leading-8 text-zinc-600">
              Add dishes, photos, reviews, and special events. Everything stays in React state for this session.
            </p>
            <button
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-950/10 bg-white px-5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:border-emerald-900/30 hover:bg-stone-50"
              onClick={() => setAssets(demoBusinessAssets)}
              type="button"
            >
              <Star size={17} /> Use demo restaurant data
            </button>
          </header>

          <AssetPanel icon={<Star size={19} />} title="Menu items">
            <div className="grid gap-3 md:grid-cols-2">
              <TextInput label="Name" value={menuDraft.name} onChange={(value) => setMenuDraft((draft) => ({ ...draft, name: value }))} />
              <TextInput label="Category" value={menuDraft.category} onChange={(value) => setMenuDraft((draft) => ({ ...draft, category: value }))} />
              <TextInput label="Description" value={menuDraft.description} onChange={(value) => setMenuDraft((draft) => ({ ...draft, description: value }))} wide />
              <TextInput label="Price" value={menuDraft.price} onChange={(value) => setMenuDraft((draft) => ({ ...draft, price: value }))} />
              <label className="flex h-11 items-center gap-3 self-end rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700">
                <input checked={menuDraft.isFeatured} onChange={(event) => setMenuDraft((draft) => ({ ...draft, isFeatured: event.target.checked }))} type="checkbox" />
                Featured item
              </label>
            </div>
            <AddButton onClick={addMenuItem}>Add menu item</AddButton>
          </AssetPanel>

          <AssetPanel icon={<ImagePlus size={19} />} title="Photos">
            <div className="grid gap-3 md:grid-cols-[1fr_1.2fr]">
              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                Photo category
                <select
                  className="h-11 rounded-md border border-zinc-200 bg-white px-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                  value={photoCategory}
                  onChange={(event) => setPhotoCategory(event.target.value as PhotoCategory)}
                >
                  {photoCategories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                Upload local photos
                <input
                  accept="image/*"
                  className="h-11 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700"
                  multiple
                  onChange={(event) => addPhotos(event.target.files)}
                  type="file"
                />
              </label>
            </div>
          </AssetPanel>

          <AssetPanel icon={<Quote size={19} />} title="Customer reviews">
            <TextInput label="Review" value={reviewDraft.text} onChange={(value) => setReviewDraft((draft) => ({ ...draft, text: value }))} />
            <TextInput label="Author" value={reviewDraft.author} onChange={(value) => setReviewDraft((draft) => ({ ...draft, author: value }))} />
            <AddButton onClick={addReview}>Add review</AddButton>
          </AssetPanel>

          <AssetPanel icon={<Plus size={19} />} title="Events and special offers">
            <TextInput label="Event or offer" value={eventDraft} onChange={setEventDraft} />
            <AddButton onClick={addEvent}>Add event</AddButton>
          </AssetPanel>
        </div>

        <aside className="grid gap-6 lg:sticky lg:top-6 lg:self-start">
          <AssetSummary assets={assets} onRemove={removeItem} />
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white shadow-lg shadow-zinc-950/10 transition hover:bg-emerald-950"
            onClick={() => onSubmit(assets)}
            type="button"
          >
            Continue to generator <ArrowRight size={17} />
          </button>
        </aside>
      </section>
    </main>
  )
}

function AssetPanel({ children, icon, title }: { children: React.ReactNode; icon: React.ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-emerald-950 text-white">{icon}</span>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  )
}

function TextInput({
  label,
  value,
  onChange,
  wide = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  wide?: boolean
}) {
  return (
    <label className={`grid gap-2 text-sm font-medium text-zinc-700 ${wide ? 'md:col-span-2' : ''}`}>
      {label}
      <input
        className="h-11 rounded-md border border-zinc-200 bg-white px-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function AddButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-emerald-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-950" onClick={onClick} type="button">
      <Plus size={16} /> {children}
    </button>
  )
}

function AssetSummary({
  assets,
  onRemove,
}: {
  assets: BusinessAssetsData
  onRemove: (collection: keyof BusinessAssetsData, idOrValue: string) => void
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Asset library</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Session assets</h2>

      <div className="mt-5 grid gap-4">
        <SummaryGroup title={`Menu items (${assets.menuItems.length})`}>
          {assets.menuItems.length === 0 ? (
            <EmptyState text="Add a signature dish or best-selling service so PostMate can create menu spotlights." />
          ) : (
            assets.menuItems.map((item) => (
              <SummaryRow key={item.id} onRemove={() => onRemove('menuItems', item.id)} title={item.name} meta={`${item.category} ${item.price ? `- ${item.price}` : ''}${item.isFeatured ? ' - featured' : ''}`} />
            ))
          )}
        </SummaryGroup>

        <SummaryGroup title={`Photos (${assets.photos.length})`}>
          {assets.photos.length === 0 ? (
            <EmptyState text="Upload interior, food, drinks, or ambience photos so visual post ideas feel specific." />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {assets.photos.map((photo) => (
                <button className="group relative aspect-square overflow-hidden rounded-md border border-zinc-200" key={photo.id} onClick={() => onRemove('photos', photo.id)} type="button">
                  <img alt={photo.fileName} className="h-full w-full object-cover" src={photo.previewUrl} />
                  <span className="absolute inset-x-1 bottom-1 rounded bg-black/60 px-1 py-0.5 text-[10px] font-semibold text-white">{photo.category}</span>
                </button>
              ))}
            </div>
          )}
        </SummaryGroup>

        <SummaryGroup title={`Reviews (${assets.reviews.length})`}>
          {assets.reviews.length === 0 ? (
            <EmptyState text="Add a testimonial to unlock review-based trust posts and social proof captions." />
          ) : (
            assets.reviews.map((review) => (
              <SummaryRow key={review.id} onRemove={() => onRemove('reviews', review.id)} title={review.text} meta={review.author || 'Anonymous'} />
            ))
          )}
        </SummaryGroup>

        <SummaryGroup title={`Events (${assets.events.length})`}>
          {assets.events.length === 0 ? <EmptyState text="Add a weekend offer or event to generate timely promotional posts." /> : assets.events.map((event) => <SummaryRow key={event} onRemove={() => onRemove('events', event)} title={event} />)}
        </SummaryGroup>
      </div>
    </section>
  )
}

function SummaryGroup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-[#f7f4ee] p-4">
      <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
      <div className="mt-3 grid gap-2">{children}</div>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-md border border-dashed border-zinc-300 bg-white px-3 py-3 text-sm leading-6 text-zinc-500">{text}</p>
}

function SummaryRow({ meta, onRemove, title }: { meta?: string; onRemove: () => void; title: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-white p-3 text-sm">
      <div>
        <p className="font-semibold text-zinc-800">{title}</p>
        {meta ? <p className="mt-1 text-xs text-zinc-500">{meta}</p> : null}
      </div>
      <button className="shrink-0 text-zinc-400 transition hover:text-rose-600" onClick={onRemove} type="button">
        <Trash2 size={15} />
      </button>
    </div>
  )
}
