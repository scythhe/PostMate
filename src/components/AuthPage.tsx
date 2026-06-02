import { ArrowLeft, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { BrandLogo } from './Navbar'
import { continueWithDemoAccount, signInUser, signUpUser } from '../lib/authStorage'
import type { AuthUser } from '../types'

export function AuthPage({
  initialMode,
  onBack,
  onAuthenticated,
}: {
  initialMode: 'signin' | 'signup'
  onBack: () => void
  onAuthenticated: (user: AuthUser) => void
}) {
  const [mode, setMode] = useState(initialMode)
  const [name, setName] = useState('Restaurant Owner')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isSignUp = mode === 'signup'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    if (!password.trim()) {
      setError('Password is required.')
      return
    }

    try {
      const user = isSignUp ? signUpUser({ name: name.trim() || email, email, password }) : signInUser(email, password)
      onAuthenticated(user)
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Something went wrong. Please try again.')
    }
  }

  const handleDemo = () => {
    setError(null)
    onAuthenticated(continueWithDemoAccount())
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <BrandLogo />
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-950" onClick={onBack} type="button">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <section className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Mock authentication</p>
          <h1 className="mt-3 text-5xl font-semibold leading-tight tracking-tight">{isSignUp ? 'Create your PostMate workspace.' : 'Welcome back to PostMate.'}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600">
            This demo uses localStorage only. No backend, real auth, database, or payments are connected.
          </p>
        </div>

        <form className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-950/5" onSubmit={handleSubmit}>
          <div className="mb-6 flex rounded-md bg-stone-100 p-1">
            <button className={`h-10 flex-1 rounded text-sm font-semibold ${!isSignUp ? 'bg-white shadow-sm' : 'text-zinc-500'}`} onClick={() => setMode('signin')} type="button">
              Sign In
            </button>
            <button className={`h-10 flex-1 rounded text-sm font-semibold ${isSignUp ? 'bg-white shadow-sm' : 'text-zinc-500'}`} onClick={() => setMode('signup')} type="button">
              Sign Up
            </button>
          </div>

          <div className="grid gap-4">
            {isSignUp ? <TextField label="Name" value={name} onChange={setName} /> : null}
            <TextField label="Email" type="email" value={email} onChange={setEmail} />
            <TextField label="Password" type="password" value={password} onChange={setPassword} />
          </div>

          {error ? <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p> : null}

          <button className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-950" type="submit">
            {isSignUp ? 'Create account' : 'Sign in'}
          </button>
          <button
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-stone-50"
            onClick={handleDemo}
            type="button"
          >
            <Sparkles size={17} /> Continue with demo account
          </button>
        </form>
      </section>
    </main>
  )
}

function TextField({
  label,
  onChange,
  type = 'text',
  value,
}: {
  label: string
  onChange: (value: string) => void
  type?: string
  value: string
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-700">
      {label}
      <input
        className="h-11 rounded-md border border-zinc-200 bg-white px-3 text-zinc-950 outline-none transition focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/10"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
