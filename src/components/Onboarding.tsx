import { ArrowLeft, ArrowRight, AtSign, CheckCircle, Globe, Loader2, PenLine, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { scrapeWebsite } from '../lib/aiGenerator'
import { saveBusiness } from '../lib/storage'
import type { Business, Tone } from '../types'
import { BrandLogo } from './Navbar'

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: 'professional', label: 'Professional', desc: 'Formal, expert, trustworthy' },
  { value: 'casual',       label: 'Casual',       desc: 'Friendly, approachable, warm' },
  { value: 'playful',      label: 'Playful',      desc: 'Fun, witty, energetic' },
  { value: 'inspiring',    label: 'Inspiring',    desc: 'Motivational, uplifting' },
  { value: 'educational',  label: 'Educational',  desc: 'Informative, helpful, clear' },
]

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
  const eb = existingBusiness
  const [step, setStep] = useState<'method' | 'form' | 'brand'>(eb ? 'form' : 'method')
  const [method, setMethod] = useState<'url' | 'manual'>('url')
  const [saving, setSaving] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState('')

  // Basic info
  const [websiteUrl,      setWebsiteUrl]      = useState(eb?.websiteUrl ?? '')
  const [instagramHandle, setInstagramHandle] = useState(eb?.instagramHandle ?? '')
  const [businessName,    setBusinessName]    = useState(eb?.name ?? '')
  const [description,     setDescription]     = useState(eb?.description ?? '')
  const [industry,        setIndustry]        = useState(eb?.industry ?? '')
  const [location,        setLocation]        = useState(eb?.location ?? '')
  const [primaryColor,    setPrimaryColor]    = useState(eb?.primaryColor ?? '#1F352D')
  const [secondaryColor,  setSecondaryColor]  = useState(eb?.secondaryColor ?? '#C9A45C')

  // Brand profile
  const [targetAudience, setTargetAudience] = useState(eb?.targetAudience ?? '')
  const [tone,           setTone]           = useState<Tone>(eb?.tone ?? 'casual')
  const [products,       setProducts]       = useState(eb?.products ?? '')
  const [brandHashtags,  setBrandHashtags]  = useState(eb?.brandHashtags ?? '')

  async function handleScrape() {
    if (!websiteUrl.trim()) return
    setScraping(true); setScrapeError('')
    const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
    setWebsiteUrl(url)
    try {
      const info = await scrapeWebsite(url)
      if (info.businessName) setBusinessName(info.businessName)
      if (info.description)  setDescription(info.description)
      if (info.instagramHandle) setInstagramHandle(info.instagramHandle)
      if (info.industry)     setIndustry(info.industry)
      if (info.location)     setLocation(info.location)
      setStep('form')
    } catch {
      setScrapeError('Could not read the website. Enter your business info manually.')
      setMethod('manual'); setStep('form')
    } finally {
      setScraping(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    const biz: Business = {
      id: eb?.id ?? crypto.randomUUID(), userId,
      name: businessName.trim(), description: description.trim(),
      instagramHandle: instagramHandle.trim(), websiteUrl: websiteUrl.trim(),
      primaryColor, secondaryColor,
      industry: industry.trim(), targetAudience: targetAudience.trim(),
      tone, products: products.trim(), location: location.trim(),
      brandHashtags: brandHashtags.trim(),
      deals: eb?.deals ?? [], events: eb?.events ?? [],
    }
    try { await saveBusiness(biz); onDone(biz) }
    catch (e) { console.error('Save failed', e) }
    finally { setSaving(false) }
  }

  const canGoNext = businessName.trim().length > 1 && description.trim().length > 10
  const canSave   = canGoNext && targetAudience.trim().length > 3

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <nav className="border-b border-zinc-950/10 bg-[#f7f4ee]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button onClick={onBack} type="button"><BrandLogo /></button>
          <button className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-950 transition" onClick={onBack} type="button">
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        {/* Progress dots */}
        <div className="mb-8 flex items-center gap-2">
          {(['method', 'form', 'brand'] as const).map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${
              s === step ? 'bg-zinc-950' : i < (['method','form','brand'] as const).indexOf(step) ? 'bg-emerald-500' : 'bg-zinc-200'
            }`} />
          ))}
        </div>

        {/* ── Step: method ── */}
        {step === 'method' && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Setup · Step 1</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">How do you want to start?</h1>
            <div className="mt-8 grid gap-4">
              <MethodCard active={method === 'url'} icon={<Globe size={20} />} title="Import from website"
                description="Paste your URL and we'll extract your business info automatically." onClick={() => setMethod('url')} />
              <MethodCard active={method === 'manual'} icon={<PenLine size={20} />} title="Enter manually"
                description="Type your business name and description yourself. Takes 2 minutes." onClick={() => setMethod('manual')} />

              {method === 'url' && (
                <div className="grid gap-3 mt-2">
                  <Field label="Website URL">
                    <div className="relative">
                      <Globe size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input className={INPUT + ' pl-9'} placeholder="https://yourbusiness.com" type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} />
                    </div>
                  </Field>
                  <button className={BTN_PRIMARY + ' w-full'} disabled={websiteUrl.trim().length < 5 || scraping} onClick={handleScrape} type="button">
                    {scraping ? <><Loader2 size={16} className="animate-spin" /> Reading website…</> : <>Import info <ArrowRight size={16} /></>}
                  </button>
                  <button className="text-center text-sm text-zinc-500 underline-offset-2 hover:underline" onClick={() => { setMethod('manual'); setStep('form') }} type="button">
                    No website — enter manually
                  </button>
                </div>
              )}

              {method === 'manual' && (
                <button className={BTN_PRIMARY + ' mt-2 w-full'} onClick={() => setStep('form')} type="button">
                  Continue <ArrowRight size={16} />
                </button>
              )}
            </div>
          </>
        )}

        {/* ── Step: form (basic info) ── */}
        {step === 'form' && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Setup · Step 2</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Basic info</h1>
            {scrapeError && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{scrapeError}</div>}
            {method === 'url' && !scrapeError && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2">
                <CheckCircle size={15} className="shrink-0" /> Website imported — review and edit below.
              </div>
            )}
            <div className="mt-6 grid gap-5">
              <Field label="Business name *">
                <input className={INPUT} placeholder="e.g. Café Tbilisi" value={businessName} onChange={e => setBusinessName(e.target.value)} />
              </Field>
              <Field label="Industry" hint="e.g. Restaurant, Boutique, Gym, Salon…">
                <input className={INPUT} placeholder="e.g. Restaurant" value={industry} onChange={e => setIndustry(e.target.value)} />
              </Field>
              <Field label="Location" hint="City or neighbourhood">
                <input className={INPUT} placeholder="e.g. Tbilisi, Georgia" value={location} onChange={e => setLocation(e.target.value)} />
              </Field>
              <Field label="Description *" hint="What you do and what makes you different. 2–4 sentences.">
                <textarea className={TEXTAREA} rows={4} placeholder="We're a cozy Georgian café known for traditional recipes and specialty coffee…" value={description} onChange={e => setDescription(e.target.value)} />
              </Field>
              <Field label="Instagram handle">
                <div className="relative">
                  <AtSign size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input className={INPUT + ' pl-9'} placeholder="@yourbusiness" value={instagramHandle} onChange={e => setInstagramHandle(e.target.value)} />
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <ColorField label="Primary color"  value={primaryColor}   onChange={setPrimaryColor} />
                <ColorField label="Accent color"   value={secondaryColor} onChange={setSecondaryColor} />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {!eb && <button className={BTN_GHOST + ' flex-1'} onClick={() => setStep('method')} type="button"><ArrowLeft size={16} /> Back</button>}
              <button className={BTN_PRIMARY + ' flex-1'} disabled={!canGoNext} onClick={() => setStep('brand')} type="button">
                Next — Brand profile <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}

        {/* ── Step: brand profile ── */}
        {step === 'brand' && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Setup · Step 3</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Brand profile</h1>
            <p className="mt-1 text-sm text-zinc-400">This tells the AI how to write content that actually sounds like you.</p>
            <div className="mt-6 grid gap-5">
              <Field label="Target audience *" hint="Who are your ideal customers?">
                <input className={INPUT} placeholder="e.g. Young professionals, local families, tourists visiting Tbilisi" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} />
              </Field>
              <Field label="Tone of voice">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {TONES.map(t => (
                    <button key={t.value} type="button" onClick={() => setTone(t.value)}
                      className={`rounded-xl border p-3 text-left text-sm transition ${tone === t.value ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}>
                      <span className="block font-semibold">{t.label}</span>
                      <span className={`block text-xs mt-0.5 ${tone === t.value ? 'text-zinc-300' : 'text-zinc-400'}`}>{t.desc}</span>
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Products & services" hint="What do you sell? List your main offerings.">
                <textarea className={TEXTAREA} rows={3} placeholder="e.g. Specialty coffee, traditional Georgian food, catering, private events" value={products} onChange={e => setProducts(e.target.value)} />
              </Field>
              <Field label="Brand hashtags" hint="Your go-to hashtags, comma-separated. Optional.">
                <input className={INPUT} placeholder="e.g. #cafetbilisi, #tbilisicoffee, #georgianfood" value={brandHashtags} onChange={e => setBrandHashtags(e.target.value)} />
              </Field>
            </div>
            <div className="mt-6 flex gap-3">
              <button className={BTN_GHOST + ' flex-1'} onClick={() => setStep('form')} type="button"><ArrowLeft size={16} /> Back</button>
              <button className={BTN_PRIMARY + ' flex-1'} disabled={!canSave || saving} onClick={handleSave} type="button">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Sparkles size={16} /> Finish setup</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────

const INPUT   = 'h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-zinc-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 text-sm'
const TEXTAREA = 'w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 resize-none'
const BTN_PRIMARY = 'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-950 text-sm font-bold text-white transition hover:bg-emerald-950 disabled:opacity-40 disabled:cursor-not-allowed'
const BTN_GHOST   = 'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 transition hover:bg-stone-50'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      {hint && <span className="text-xs font-normal text-zinc-400">{hint}</span>}
      {children}
    </label>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      <span className="flex h-11 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <input className="h-full w-12 cursor-pointer border-0 bg-transparent p-1.5" type="color" value={value} onChange={e => onChange(e.target.value)} />
        <input className="min-w-0 flex-1 bg-transparent px-3 text-sm text-zinc-950 outline-none" value={value} onChange={e => onChange(e.target.value)} />
      </span>
    </label>
  )
}

function MethodCard({ active, icon, title, description, onClick }: { active: boolean; icon: React.ReactNode; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition ${active ? 'border-emerald-700 bg-emerald-50 ring-2 ring-emerald-700/20' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}>
      <span className={`mt-0.5 ${active ? 'text-emerald-700' : 'text-zinc-400'}`}>{icon}</span>
      <span>
        <span className="block font-semibold text-zinc-950 text-sm">{title}</span>
        <span className="block text-xs leading-5 text-zinc-500 mt-0.5">{description}</span>
      </span>
    </button>
  )
}
