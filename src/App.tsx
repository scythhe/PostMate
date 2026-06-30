import { LogOut, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Auth } from './components/Auth'
import { BusinessDashboard } from './components/Dashboard'
import { GenerateWizard } from './components/GenerateWizard'
import { GenerationResult } from './components/GenerationResult'
import { LandingPage } from './components/LandingPage'
import { BrandLogo } from './components/Navbar'
import { Onboarding } from './components/Onboarding'
import { supabase } from './lib/supabase'
import { getBusiness, getCurrentUser, signOut } from './lib/storage'
import type { Business, GenerationSession, User } from './types'

type AppView = 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'wizard' | 'result'
type AuthMode = 'signin' | 'signup'

function App() {
  const [view, setView] = useState<AppView>('landing')
  const [authMode, setAuthMode] = useState<AuthMode>('signup')
  const [user, setUser] = useState<User | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [session, setSession] = useState<GenerationSession | null>(null)
  const [booting, setBooting] = useState(true)

  // ── Boot: check existing Supabase session ────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        try {
          const u = await getCurrentUser()
          if (u) {
            setUser(u)
            const biz = await getBusiness(u.id)
            setBusiness(biz)
            setView(biz ? 'dashboard' : 'onboarding')
          }
        } catch { /* session stale, stay on landing */ }
      }
      setBooting(false)
    })

    // Handle external sign-outs (e.g., token expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setBusiness(null)
        setView('landing')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee]">
        <Loader2 size={28} className="animate-spin text-emerald-700" />
      </div>
    )
  }

  // ── Landing ──────────────────────────────────────────────────
  if (view === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => { setAuthMode('signup'); setView('auth') }}
        onSignIn={() => { setAuthMode('signin'); setView('auth') }}
        onTryDemo={() => { setAuthMode('signup'); setView('auth') }}
      />
    )
  }

  // ── Auth ─────────────────────────────────────────────────────
  if (view === 'auth') {
    return (
      <Auth
        defaultMode={authMode}
        onAuth={async (u) => {
          setUser(u)
          const biz = await getBusiness(u.id)
          setBusiness(biz)
          setView(biz ? 'dashboard' : 'onboarding')
        }}
        onBack={() => setView('landing')}
      />
    )
  }

  // ── Onboarding ───────────────────────────────────────────────
  if (view === 'onboarding' && user) {
    return (
      <Onboarding
        userId={user.id}
        existingBusiness={business}
        onDone={(biz) => { setBusiness(biz); setView('dashboard') }}
        onBack={() => {
          if (business) setView('dashboard')
          else { signOut(); setUser(null); setBusiness(null); setView('landing') }
        }}
      />
    )
  }

  if (!user || !business) {
    signOut()
    setView('landing')
    return null
  }

  // ── Generate wizard ──────────────────────────────────────────
  if (view === 'wizard') {
    return (
      <Shell userName={user.name} onSignOut={() => { signOut(); setUser(null); setBusiness(null); setView('landing') }}>
        <GenerateWizard
          business={business}
          onDone={(s) => { setSession(s); setView('result') }}
          onBack={() => setView('dashboard')}
        />
      </Shell>
    )
  }

  // ── Generation result ────────────────────────────────────────
  if (view === 'result' && session) {
    return (
      <Shell userName={user.name} onSignOut={() => { signOut(); setUser(null); setBusiness(null); setView('landing') }}>
        <GenerationResult
          session={session}
          business={business}
          onBack={() => setView('dashboard')}
        />
      </Shell>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────
  return (
    <Shell userName={user.name} onSignOut={() => { signOut(); setUser(null); setBusiness(null); setView('landing') }}>
      <BusinessDashboard
        business={business}
        user={user}
        onGenerate={() => setView('wizard')}
        onViewSession={(s) => { setSession(s); setView('result') }}
        onEditBusiness={() => setView('onboarding')}
        onBusinessChange={setBusiness}
      />
    </Shell>
  )
}

function Shell({ children, userName, onSignOut }: { children: React.ReactNode; userName: string; onSignOut: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-zinc-500 sm:block">{userName}</span>
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}

export default App
