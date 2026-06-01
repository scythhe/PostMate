import { ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { defaultBusiness } from '../lib/mockGenerator'
import type { BusinessProfile } from '../types'

export function BusinessSetup({
  onSubmit,
  onUseDemoData,
}: {
  onSubmit: (profile: BusinessProfile) => void
  onUseDemoData: () => void
}) {
  const [profile, setProfile] = useState(defaultBusiness)

  const updateField = (field: keyof BusinessProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(profile)
  }

  return (
    <section className="bg-white px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24" id="setup">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Business setup</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Create a profile PostMate can turn into content.</h2>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            These values are prefilled for a luxury restaurant in Tbilisi. Adjust them, submit the profile, and PostMate will move into the dashboard experience.
          </p>
          <button
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-950/10 bg-white px-5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:border-emerald-900/30 hover:bg-stone-50"
            onClick={onUseDemoData}
            type="button"
          >
            <Sparkles size={17} /> Use demo restaurant data
          </button>
        </div>
        <form className="rounded-lg border border-zinc-200 bg-[#f7f4ee] p-5 shadow-sm sm:p-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Business name" value={profile.businessName} onChange={(value) => updateField('businessName', value)} />
            <TextField label="Industry" value={profile.industry} onChange={(value) => updateField('industry', value)} />
            <TextField label="Location" value={profile.location} onChange={(value) => updateField('location', value)} />
            <TextField label="Tone" value={profile.tone} onChange={(value) => updateField('tone', value)} />
            <TextField label="Target audience" value={profile.targetAudience} onChange={(value) => updateField('targetAudience', value)} wide />
            <TextField label="Offer" value={profile.offer} onChange={(value) => updateField('offer', value)} wide />
            <ColorField label="Primary color" value={profile.primaryColor} onChange={(value) => updateField('primaryColor', value)} />
            <ColorField label="Secondary color" value={profile.secondaryColor} onChange={(value) => updateField('secondaryColor', value)} />
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-zinc-600">Profile is stored in local React state only.</p>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-950" type="submit">
              Continue to dashboard <ArrowRight size={17} />
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

function TextField({
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

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-700">
      {label}
      <span className="flex h-11 overflow-hidden rounded-md border border-zinc-200 bg-white">
        <input className="h-full w-12 cursor-pointer border-0 bg-transparent p-1" type="color" value={value} onChange={(event) => onChange(event.target.value)} />
        <input className="min-w-0 flex-1 px-3 text-zinc-950 outline-none" value={value} onChange={(event) => onChange(event.target.value)} />
      </span>
    </label>
  )
}
