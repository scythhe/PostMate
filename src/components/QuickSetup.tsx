import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { QuickProfile } from '../types'
import { BrandLogo } from './Navbar'

export function QuickSetup({
  onGenerate,
  onBack,
  onTryDemo,
}: {
  onGenerate: (profile: QuickProfile) => void
  onBack: () => void
  onTryDemo: () => void
}) {
  const [form, setForm] = useState<QuickProfile>({
    businessName: '',
    description: '',
    location: '',
    primaryColor: '#1F352D',
    secondaryColor: '#C9A45C',
  })

  const update = (field: keyof QuickProfile, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.businessName.trim() || !form.description.trim()) return
    onGenerate(form)
  }

  const isReady = form.businessName.trim().length > 0 && form.description.trim().length > 10

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <nav className="border-b border-zinc-950/10 bg-[#f7f4ee]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} type="button">
            <BrandLogo />
          </button>
          <button
            className="flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-zinc-950"
            onClick={onBack}
            type="button"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          {/* Left: explanation */}
          <div className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Setup</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Describe your business. PostMate does the rest.
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              No long forms. No uploads. Just tell us what you do in a sentence or two and we'll generate a full week of Instagram content instantly.
            </p>

            <div className="mt-8 grid gap-4">
              <StepBadge number={1} label="Describe your business in a few sentences" />
              <StepBadge number={2} label="Click generate — PostMate builds your plan" />
              <StepBadge number={3} label="Get 7 days of captions, hashtags, and a post preview" />
            </div>

            <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Example input</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600 italic">
                "A boutique Georgian bakery in Batumi specializing in traditional adjarian breads, honey pastries, and local wine. Cozy atmosphere, great for weekend brunches and tourists."
              </p>
            </div>

            <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">You'll get</p>
              <ul className="mt-3 grid gap-2 text-sm text-zinc-600">
                {['7-day Instagram content plan', 'Full captions + short versions', 'Hashtag sets for each post', 'Story text variations', 'Export-ready post preview', 'PNG download'].map((item) => (
                  <li className="flex items-center gap-2" key={item}>
                    <span className="size-1.5 rounded-full bg-emerald-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: form */}
          <form
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-950/5 sm:p-8"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-semibold tracking-tight">Your business</h2>
            <p className="mt-1 text-sm text-zinc-500">Takes about 30 seconds to fill out.</p>

            <div className="mt-6 grid gap-5">
              <Field label="Business name *" hint="Your official brand name">
                <input
                  className="h-11 rounded-md border border-zinc-200 bg-[#f7f4ee] px-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                  placeholder="e.g. Café Botanica"
                  value={form.businessName}
                  onChange={(e) => update('businessName', e.target.value)}
                  required
                />
              </Field>

              <Field
                label="Describe your business *"
                hint="What you offer, who you serve, what makes you different"
              >
                <textarea
                  className="min-h-[120px] resize-none rounded-md border border-zinc-200 bg-[#f7f4ee] px-3 py-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                  placeholder="e.g. We're a plant-based café in Tbilisi serving organic coffee and seasonal lunch bowls to remote workers and health-conscious locals..."
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  required
                />
              </Field>

              <Field label="City / Location" hint="Where your business is based">
                <input
                  className="h-11 rounded-md border border-zinc-200 bg-[#f7f4ee] px-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                  placeholder="e.g. Tbilisi, Georgia"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <ColorField
                  label="Primary color"
                  value={form.primaryColor}
                  onChange={(v) => update('primaryColor', v)}
                />
                <ColorField
                  label="Accent color"
                  value={form.secondaryColor}
                  onChange={(v) => update('secondaryColor', v)}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-zinc-100 pt-6">
              <button
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!isReady}
                type="submit"
              >
                Generate my content <ArrowRight size={17} />
              </button>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-200 px-5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-stone-50"
                onClick={onTryDemo}
                type="button"
              >
                <Sparkles size={16} /> Try with demo restaurant
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      {hint ? <span className="text-xs font-normal text-zinc-400">{hint}</span> : null}
      {children}
    </label>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      <span className="flex h-11 overflow-hidden rounded-md border border-zinc-200 bg-[#f7f4ee]">
        <input
          className="h-full w-12 cursor-pointer border-0 bg-transparent p-1.5"
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className="min-w-0 flex-1 bg-transparent px-3 text-zinc-950 outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </span>
    </label>
  )
}

function StepBadge({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-emerald-950 text-sm font-bold text-white">
        {number}
      </span>
      <span className="text-sm font-medium text-zinc-700">{label}</span>
    </div>
  )
}
