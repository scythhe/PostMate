import { Check } from 'lucide-react'
import type { CaptionPackage, ContentIdea } from '../types'

export function CaptionGenerator({
  idea,
  output,
  onSave,
}: {
  idea: ContentIdea
  output: CaptionPackage
  onSave: () => void
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Caption generator</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {idea.day}: {idea.title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-zinc-600">{idea.postType}</span>
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-emerald-950" onClick={onSave} type="button">
            <Check size={16} /> Save Post
          </button>
        </div>
      </div>
      <div className="mt-6 grid gap-4">
        <GeneratedTextBlock label="Caption" text={output.caption} />
        <div className="grid gap-4 md:grid-cols-2">
          <GeneratedTextBlock label="Short caption" text={output.shortCaption} />
          <GeneratedTextBlock label="Story text" text={output.storyText} />
        </div>
        <div className="rounded-lg border border-zinc-200 bg-[#f7f4ee] p-4">
          <p className="text-sm font-semibold text-zinc-950">Hashtags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {output.hashtags.map((tag) => (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-200" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-zinc-950 p-4 text-white">
          <p className="text-sm text-white/60">CTA</p>
          <p className="mt-1 font-semibold">{output.cta}</p>
        </div>
      </div>
    </section>
  )
}

function GeneratedTextBlock({ label, text }: { label: string; text: string }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-[#f7f4ee] p-4">
      <p className="text-sm font-semibold text-zinc-950">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
    </article>
  )
}
