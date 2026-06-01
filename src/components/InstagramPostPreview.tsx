import { Camera } from 'lucide-react'
import type { Ref } from 'react'
import type { BusinessProfile, ContentIdea } from '../types'

export function InstagramPostPreview({
  business,
  exportRef,
  idea,
}: {
  business: BusinessProfile
  exportRef?: Ref<HTMLDivElement>
  idea: ContentIdea
}) {
  const initials = getInitials(business.businessName)
  const subtitle = `${business.tone} - ${business.location.split(',')[0]}`

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-950/5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Post preview</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Export-ready square creative</h2>
        </div>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-zinc-600">{idea.postType}</span>
      </div>
      <div
        className="relative aspect-square overflow-hidden rounded-md p-6 text-white"
        ref={exportRef}
        style={{
          background: `linear-gradient(145deg, ${business.primaryColor} 0%, #101010 56%, ${business.secondaryColor} 120%)`,
        }}
      >
        <div className="absolute -right-16 -top-16 size-44 rounded-full border border-white/20 bg-white/10" />
        <div className="absolute -bottom-20 left-8 size-56 rounded-full opacity-70 blur-sm" style={{ backgroundColor: business.secondaryColor }} />
        <div className="absolute bottom-8 right-8 h-24 w-24 rotate-6 rounded-md border border-white/20 bg-white/10" />
        <div className="relative flex h-full flex-col justify-between rounded-md border border-white/20 bg-black/25 p-6 shadow-2xl backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-md bg-white text-sm font-bold text-zinc-950 shadow-lg">
                {initials || <Camera size={18} />}
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">{business.businessName}</p>
                <p className="mt-1 text-xs text-white/65">{subtitle}</p>
              </div>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold">{idea.day}</span>
          </div>

          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              {idea.postType}
            </p>
            <h2 className="max-w-[19rem] text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl">{idea.title}</h2>
            <p className="mt-4 max-w-[18rem] text-sm leading-6 text-white/72">{business.offer}</p>
          </div>

          <div className="flex items-end justify-between gap-4">
            <p className="max-w-[14rem] text-sm leading-6 text-white/70">{business.tone}</p>
            <span className="inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-bold text-zinc-950 shadow-lg" style={{ backgroundColor: business.secondaryColor }}>
              {idea.cta}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export function MiniInstagramPreview({ business, idea }: { business: BusinessProfile; idea: ContentIdea }) {
  const initials = getInitials(business.businessName)

  return (
    <div className="relative aspect-square overflow-hidden rounded-md p-3 text-white" style={{ background: `linear-gradient(145deg, ${business.primaryColor}, #111 58%, ${business.secondaryColor})` }}>
      <div className="absolute -right-7 -top-7 size-16 rounded-full border border-white/20 bg-white/10" />
      <div className="relative flex h-full flex-col justify-between rounded border border-white/20 bg-black/20 p-3">
        <span className="grid size-8 place-items-center rounded bg-white text-xs font-bold text-zinc-950">{initials || 'PM'}</span>
        <p className="text-[11px] font-semibold leading-tight">{idea.title}</p>
        <p className="text-[10px] text-white/70">{idea.cta}</p>
      </div>
    </div>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
