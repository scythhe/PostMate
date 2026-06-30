import { ArrowLeft, ArrowRight, AtSign, CheckCircle, Globe, Loader2, PenLine, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { scrapeWebsite } from '../lib/aiGenerator'
import { saveBusiness } from '../lib/storage'
import type { Business } from '../types'
import { BrandLogo } from './Navbar'

type Step = 'method' | 'scraping' | 'manual' | 'review'
type Method = 'url' | 'manual'

export function Onboarding({
  userId,
  existingBusiness,
  onDone,
  onBack,
}: {
  userId: string
  existingBusiness: Business | null
  onDone: (biz: Business) => void
  onBack: () => void
}) {
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<Method>('url')
  const [saving, setSaving] = useState(false)

  // form state
  const [websiteUrl, setWebsiteUrl] = useState(existingBusiness?.websiteUrl ?? '')
  const [instagramHandle, setInstagramHandle] = useState(existingBusiness?.instagramHandle ?? '')
  const [businessName, setBusinessName] = useState(existingBusiness?.name ?? '')
  const [description, setDescription] = useState(existingBusiness?.description ?? '')
  const [primaryColor, setPrimaryColor] = useState(existingBusiness?.primaryColor ?? '#1F352D')
  const [secondaryColor, setSecondaryColor] = useState(existingBusiness?.secondaryColor ?? '#C9A45C')

  // scraping state
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState('')

  async function handleScrape() {
    if (!websiteUrl.trim()) return
    setScraping(true)
    setScrapeError('')
    const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
    setWebsiteUrl(url)
    try {
      const info = await scrapeWebsite(url)
      if (info.businessName) setBusinessName(info.businessName)
      if (info.description) setDescription(info.description)
      if (info.instagramHandle) setInstagramHandle(info.instagramHandle)
      setStep('review')
    } catch {
      setScrapeError('Could not load website. Enter your business description manually below.')
      setMethod('manual')
      setStep('manual')
    } finally {
      setScraping(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    const biz: Business = {
      id: existingBusiness?.id ?? crypto.randomUUID(),
      userId,
      name: businessName.trim(),
      description: description.trim(),
      instagramHandle: instagramHandle.trim(),
      websiteUrl: websiteUrl.trim(),
      primaryColor,
      secondaryColor,
      deals: existingBusiness?.deals ?? [],
      events: existingBusiness?.events ?? [],
    }
    try {
      await saveBusiness(biz)
      onDone(biz)
    } catch (err) {
      console.error('Save failed', err)
    } finally {
      setSaving(false)
    }
  }

  const canSave = businessName.trim().length > 1 && description.trim().length > 10

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <nav className="border-b border-zinc-950/10 bg-[#f7f4ee]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} type="button"><BrandLogo /></button>
          <button
            className="flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-zinc-950"
            onClick={onBack}
            type="button"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Setup</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {existingBusiness ? 'Update your business' : 'Tell us about your business'}
        </h1>

        {/* ── Step: method ── */}
        {step === 'method' && (
          <div className="mt-8 grid gap-4">
            <MethodCard
              active={method === 'url'}
              icon={<Globe size={20} />}
              title="Import from website"
              description="Paste your website URL — we'll read it and extract your business info automatically."
              onClick={() => setMethod('url')}
            />
            <MethodCard
              active={method === 'manual'}
              icon={<PenLine size={20} />}
              title="Enter manually"
              description="Type your business name and description yourself. Takes 2 minutes."
              onClick={() => setMethod('manual')}
            />

            {method === 'url' && (
              <div className="mt-2 grid gap-3">
                <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                  Website URL
                  <span className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Globe size={15} />
                    </span>
                    <input
                      className="h-11 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                      placeholder="https://yourbusiness.com"
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                  </span>
                </label>
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 text-sm font-semibold text-white transition hover:bg-emerald-950 disabled:opacity-50"
                  disabled={websiteUrl.trim().length < 5 || scraping}
                  onClick={handleScrape}
                  type="button"
                >
                  {scraping ? <><Loader2 size={16} className="animate-spin" /> Reading website…</> : <>Import info <ArrowRight size={16} /></>}
                </button>
                <button
                  className="text-center text-sm text-zinc-500 underline-offset-2 hover:underline"
                  onClick={() => { setMethod('manual'); setStep('manual') }}
                  type="button"
                >
                  I don't have a website — enter manually
                </button>
              </div>
            )}

            {method === 'manual' && (
              <button
                className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 text-sm font-semibold text-white transition hover:bg-emerald-950"
                onClick={() => setStep('manual')}
                type="button"
              >
                Continue <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* ── Step: scraping ── */}
        {step === 'scraping' && (
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <Loader2 size={40} className="animate-spin text-emerald-700" />
            <p className="text-lg font-medium text-zinc-950">Reading your website…</p>
            <p className="text-sm text-zinc-500">This takes a few seconds.</p>
          </div>
        )}

        {/* ── Step: manual ── */}
        {step === 'manual' && (
          <div className="mt-8 grid gap-5">
            {scrapeError && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {scrapeError}
              </div>
            )}
            <FormField label="Business name *">
              <input
                className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                placeholder="e.g. Café Tbilisi"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </FormField>
            <FormField label="Business description *" hint="What you do, who you serve, what makes you different. 2–5 sentences.">
              <textarea
                className="min-h-[120px] w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                placeholder="We're a cozy Georgian café in the heart of Tbilisi, known for our traditional recipes and specialty coffee. Our regulars come for the khachapuri and stay for the atmosphere…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>
            <FormField label="Instagram handle" hint="Optional — helps generate on-brand content">
              <span className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><AtSign size={15} /></span>
                <input
                  className="h-11 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                  placeholder="@yourbusiness"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                />
              </span>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <ColorField label="Primary color" value={primaryColor} onChange={setPrimaryColor} />
              <ColorField label="Accent color" value={secondaryColor} onChange={setSecondaryColor} />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md border border-zinc-200 text-sm font-semibold text-zinc-700 transition hover:bg-stone-50"
                onClick={() => setStep('method')}
                type="button"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-zinc-950 text-sm font-semibold text-white transition hover:bg-emerald-950 disabled:opacity-50"
                disabled={!canSave}
                onClick={() => setStep('review')}
                type="button"
              >
                Review <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step: review ── */}
        {step === 'review' && (
          <div className="mt-8 grid gap-5">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
              <CheckCircle size={16} className="shrink-0" />
              {method === 'url' ? 'Website imported successfully. Review and edit before saving.' : 'Review your details before saving.'}
            </div>

            <FormField label="Business name *">
              <input
                className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </FormField>
            <FormField label="Business description *" hint="Edit to make it more accurate or add personality.">
              <textarea
                className="min-h-[150px] w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>
            <FormField label="Instagram handle" hint="Optional">
              <span className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><AtSign size={15} /></span>
                <input
                  className="h-11 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
                  placeholder="@yourbusiness"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                />
              </span>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <ColorField label="Primary color" value={primaryColor} onChange={setPrimaryColor} />
              <ColorField label="Accent color" value={secondaryColor} onChange={setSecondaryColor} />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md border border-zinc-200 text-sm font-semibold text-zinc-700 transition hover:bg-stone-50"
                onClick={() => setStep(method === 'url' ? 'method' : 'manual')}
                type="button"
              >
                <ArrowLeft size={16} /> Edit
              </button>
              <button
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-zinc-950 text-sm font-semibold text-white transition hover:bg-emerald-950 disabled:opacity-50"
                disabled={!canSave}
                onClick={handleSave}
                type="button"
              >
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Sparkles size={16} /> Save &amp; continue</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MethodCard({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-4 rounded-xl border p-4 text-left transition ${
        active
          ? 'border-emerald-700 bg-emerald-50 ring-2 ring-emerald-700/20'
          : 'border-zinc-200 bg-white hover:border-zinc-300'
      }`}
    >
      <span className={`mt-0.5 ${active ? 'text-emerald-700' : 'text-zinc-400'}`}>{icon}</span>
      <span>
        <span className="block font-semibold text-zinc-950 text-sm">{title}</span>
        <span className="block text-xs leading-5 text-zinc-500 mt-0.5">{description}</span>
      </span>
    </button>
  )
}

function FormField({
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
      {hint && <span className="text-xs font-normal text-zinc-400">{hint}</span>}
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
      <span className="flex h-11 overflow-hidden rounded-md border border-zinc-200 bg-white">
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
