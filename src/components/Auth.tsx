import { ArrowRight, Eye, EyeOff, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { signIn, signUp } from '../lib/storage'
import type { User as AppUser } from '../types'
import { BrandLogo } from './Navbar'

type Mode = 'signin' | 'signup'

export function Auth({
  onAuth,
  onBack,
  defaultMode = 'signin',
}: {
  onAuth: (user: AppUser) => void
  onBack: () => void
  defaultMode?: Mode
}) {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        if (name.trim().length < 2) { setError('Enter your name.'); return }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
        const user = await signUp(name.trim(), email.toLowerCase().trim(), password)
        onAuth(user)
      } else {
        const user = await signIn(email.toLowerCase().trim(), password)
        onAuth(user)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f4ee] px-4">
      <div className="mb-8 cursor-pointer" onClick={onBack}>
        <BrandLogo />
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-950/5">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          {mode === 'signin' ? 'Welcome back' : 'Start your free week'}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {mode === 'signin' ? 'Sign in to your account.' : '7 days free, no credit card needed.'}
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <InputField label="Your name" icon={<User size={15} />} type="text" value={name} placeholder="e.g. Giorgi" onChange={setName} required />
          )}
          <InputField label="Email" icon={<Mail size={15} />} type="email" value={email} placeholder="you@example.com" onChange={setEmail} required />

          <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
            Password
            <span className="relative">
              <input
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 pr-10 text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                type={showPw ? 'text' : 'password'}
                value={password}
                placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600" onClick={() => setShowPw((v) => !v)}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </span>
          </label>

          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-950 text-sm font-bold text-white transition hover:bg-emerald-950 disabled:opacity-50"
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create free account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            className="font-semibold text-emerald-700 hover:underline"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
          >
            {mode === 'signin' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

function InputField({ label, icon, type, value, placeholder, onChange, required }: {
  label: string; icon: React.ReactNode; type: string; value: string
  placeholder: string; onChange: (v: string) => void; required?: boolean
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
      {label}
      <span className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">{icon}</span>
        <input
          className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} required={required}
        />
      </span>
    </label>
  )
}
