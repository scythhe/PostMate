import type { ContentIdea } from '../types'

export function ContentPlan({
  ideas,
  selectedIndex,
  onSelect,
}: {
  ideas: ContentIdea[]
  selectedIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Mock generator</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">7-day Instagram content plan</h2>
        </div>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-zinc-600">Deterministic logic</span>
      </div>
      <div className="mt-6 grid gap-3">
        {ideas.map((idea, index) => (
          <ContentPlanCard idea={idea} isSelected={index === selectedIndex} key={`${idea.day}-${idea.title}`} onSelect={() => onSelect(index)} />
        ))}
      </div>
    </section>
  )
}

function ContentPlanCard({ idea, isSelected, onSelect }: { idea: ContentIdea; isSelected: boolean; onSelect: () => void }) {
  const shortDescription = idea.description.length > 108 ? `${idea.description.slice(0, 105).trim()}...` : idea.description

  return (
    <button
      className={`rounded-lg border p-4 text-left transition ${
        isSelected
          ? 'border-emerald-800 bg-emerald-950 text-white shadow-lg shadow-emerald-950/15'
          : 'border-zinc-200 bg-[#f7f4ee] text-zinc-950 hover:border-emerald-800/40 hover:bg-white'
      }`}
      onClick={onSelect}
      type="button"
    >
      <div className="grid gap-3 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
        <div>
          <span className={`text-sm font-semibold ${isSelected ? 'text-amber-200' : 'text-emerald-700'}`}>{idea.day}</span>
          <span className={`mt-2 block w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${isSelected ? 'bg-white/10 text-white ring-white/20' : 'bg-white text-zinc-600 ring-zinc-200'}`}>
            {idea.postType}
          </span>
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight">{idea.title}</h3>
          <p className={`mt-1 text-sm leading-5 ${isSelected ? 'text-white/75' : 'text-zinc-600'}`}>{shortDescription}</p>
        </div>
        <span className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-semibold ${isSelected ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-white'}`}>
          {isSelected ? 'Selected' : 'Generate caption'}
        </span>
      </div>
    </button>
  )
}
