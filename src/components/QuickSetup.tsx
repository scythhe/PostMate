import { ArrowLeft, ArrowRight, AtSign, Globe, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { InputProfile } from '../types'
import { BrandLogo } from './Navbar'

export function QuickSetup({
  onGenerate,
  onBack,
  onTryDemo,
}: {
  onGenerate: (profile: InputProfile) => void
  onBack: () => void
  onTryDemo: () => void
}) {
  const [form, setForm] = useState<InputProfile>({
    websiteUrl: '',
    instagramHandle: '',
    recentCaptions: '',
    primaryColor: '#1F352D',
    secondaryColor: '#C9A45C',
  })

  const update = (field: keyof InputProfile, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.websiteUrl.trim()) return
    const url = form.websiteUrl.startsWith('http') ? form.websiteUrl : `https://${form.websiteUrl}`
    onGenerate({ ...form, websiteUrl: url })
  }

  const isReady = form.websiteUrl.trim().length > 4

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
              Paste your website. PostMate reads the rest.
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              PostMate scrapes your website and Instagram to understand your brand voice, offer, and audience — then generates a full week of on-brand content automatically.
            </p>

            <div className="mt-8 grid gap-4">
              <FlowStep
                icon={<Globe size={16} />}
                label="1"
                title="Paste your website URL"
                description="PostMate fetches and reads your site to understand your business"
              />
              <FlowStep
                icon={<AtSign size={16} />}
                label="2"
                title="Add your Instagram handle"
                description="PostMate scrapes your latest posts to match your existing tone and style"
              />
              <FlowStep
                icon={<Sparkles size={16} />}
                label="3"
                title="AI generates your plan"
                description="7-day content plan with captions, hashtags, and a branded post preview"
              />
            </div>

            <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">You'll get</p>
              <ul className="mt-3 grid gap-2 text-sm text-zinc-600">
                {[
                  '7-day Instagram content plan',
                  'Captions written in your brand voice',
                  'Hashtag sets matching your niche',
                  'Story text for each post',
                  'Export-ready branded post preview',
                  'PNG download',
                ].map((item) => (
                  <li className="flex items-center gap-2" key={item}>
                    <span className="size-1.5 rounded-full bg-emerald-700 shrink-0" />
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
            <p className="mt-1 text-sm text-zinc-500">Takes about 20 seconds to fill out.</p>

            <div className="mt-6 grid gap-5">
              <Field
                label="Website URL *"
                hint="Your homepage — PostMate will scrape it automatically"
                icon={<Globe size={15} className="text-zinc-400" />}
              >
                <input
                  className="h-11 rounded-md border border-zinc-200 bg-[#f7f4ee] pl-9 pr-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                  placeholder="https://yourbusiness.com"
                  type="url"
                  value={form.websiteUrl}
                  onChange={(e) => update('websiteUrl', e.target.value)}
                  required
                />
              </Field>

              <Field
                label="Instagram handle"
                hint="Public profile — PostMate will scrape your latest posts for tone matching"
                icon={<AtSign size={15} className="text-zinc-400" />}
              >
                <input
                  className="h-11 rounded-md border border-zinc-200 bg-[#f7f4ee] pl-9 pr-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                  placeholder="@yourbusiness"
                  value={form.instagramHandle}
                  onChange={(e) => update('instagramHandle', e.target.value)}
                />
              </Field>

              <Field
                label="Recent captions (optional)"
                hint="Paste 3–5 of your recent post captions if Instagram scraping is blocked"
              >
                <textarea
                  className="min-h-[100px] resize-none rounded-md border border-zinc-200 bg-[#f7f4ee] px-3 py-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10 text-sm"
                  placeholder="Paste your recent Instagram captions here to help PostMate match your tone..."
                  value={form.recentCaptions}
                  onChange={(e) => update('recentCaptions', e.target.value)}
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
                Scrape &amp; generate <ArrowRight size={17} />
              </button>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-200 px-5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-stone-50"
                onClick={onTryDemo}
                type="button"
              >
                <Sparkles size={16} /> Try with demo restaurant
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-zinc-400">
              PostMate only reads publicly available content. No login required.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  icon,
  children,
}: {
  label: string
  hint?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      {hint ? <span className="text-xs font-normal text-zinc-400">{hint}</span> : null}
      {icon ? (
        <span className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
          {children}
        </span>
      ) : (
        children
      )}
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
          className="min-w-0 flex-1 bg-transparent px-3 text-zinc-950 outline-none text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </span>
    </label>
  )
}

function FlowStep({
  icon,
  label,
  title,
  description,
}: {
  icon: React.ReactNode
  label: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col items-center gap-1">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-emerald-950 text-white text-xs font-bold">
          {label}
        </span>
        <span className="text-zinc-400">{icon}</span>
      </div>
      <div>
        <p className="font-semibold text-zinc-950 text-sm">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-zinc-500">{description}</p>
      </div>
    </div>
  )
}
