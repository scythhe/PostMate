import { useEffect, useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { LandingPage } from './components/LandingPage'
import { BrandLogo } from './components/Navbar'
import { QuickSetup } from './components/QuickSetup'
import { SavedPosts } from './components/SavedPosts'
import type { BusinessProfile, QuickProfile, SavedPost } from './types'

type AppView = 'landing' | 'setup' | 'dashboard' | 'saved'

const DEMO_PROFILE: QuickProfile = {
  businessName: 'Maison Marani',
  description:
    'A luxury Georgian restaurant in Tbilisi offering a chef-led supra tasting menu with rare Kakheti wine pairings, for food lovers, boutique hotel guests, and wine enthusiasts.',
  location: 'Tbilisi, Georgia',
  primaryColor: '#1F352D',
  secondaryColor: '#C9A45C',
}

function loadSavedPosts(): SavedPost[] {
  try {
    return JSON.parse(localStorage.getItem('postmate_saved') ?? '[]')
  } catch {
    return []
  }
}

function App() {
  const [view, setView] = useState<AppView>('landing')
  const [profile, setProfile] = useState<QuickProfile | null>(null)
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>(loadSavedPosts)

  useEffect(() => {
    localStorage.setItem('postmate_saved', JSON.stringify(savedPosts))
  }, [savedPosts])

  const handleGenerate = (p: QuickProfile) => {
    setProfile(p)
    setView('dashboard')
  }

  const handleTryDemo = () => {
    setProfile(DEMO_PROFILE)
    setView('dashboard')
  }

  const handleBack = () => {
    setView('setup')
  }

  if (view === 'saved' && profile) {
    const stubBusiness: BusinessProfile = {
      businessName: profile.businessName,
      industry: 'Local business',
      location: profile.location,
      tone: 'Professional',
      targetAudience: 'Local customers',
      offer: profile.description.slice(0, 80),
      primaryColor: profile.primaryColor,
      secondaryColor: profile.secondaryColor,
    }
    return (
      <AppShell
        onGoHome={() => setView('landing')}
        onBack={() => setView('dashboard')}
        onGoSaved={() => {}}
        savedPostCount={savedPosts.length}
        backLabel="Back to generator"
        activeSaved
      >
        <SavedPosts
          business={stubBusiness}
          posts={savedPosts}
          onDelete={(id) => setSavedPosts((current) => current.filter((p) => p.id !== id))}
          onOpen={() => setView('dashboard')}
        />
      </AppShell>
    )
  }

  if (view === 'dashboard' && profile) {
    return (
      <AppShell
        onGoHome={() => setView('landing')}
        onBack={handleBack}
        onGoSaved={() => setView('saved')}
        savedPostCount={savedPosts.length}
        backLabel="Edit business"
      >
        <Dashboard
          profile={profile}
          savedPosts={savedPosts}
          onSavedPostsChange={setSavedPosts}
          onBack={handleBack}
        />
      </AppShell>
    )
  }

  if (view === 'setup') {
    return (
      <QuickSetup
        onGenerate={handleGenerate}
        onBack={() => setView('landing')}
        onTryDemo={handleTryDemo}
      />
    )
  }

  return <LandingPage onGetStarted={() => setView('setup')} onTryDemo={handleTryDemo} />
}

function AppShell({
  children,
  onGoHome,
  onBack,
  onGoSaved,
  savedPostCount,
  backLabel,
  activeSaved = false,
}: {
  children: React.ReactNode
  onGoHome: () => void
  onBack: () => void
  onGoSaved: () => void
  savedPostCount: number
  backLabel: string
  activeSaved?: boolean
}) {
  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-zinc-950/10 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={onGoHome} type="button">
            <BrandLogo />
          </button>
          <div className="flex items-center gap-2">
            {savedPostCount > 0 && (
              <button
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  activeSaved
                    ? 'bg-stone-100 text-zinc-950'
                    : 'text-zinc-600 hover:bg-stone-100 hover:text-zinc-950'
                }`}
                onClick={onGoSaved}
                type="button"
              >
                Saved ({savedPostCount})
              </button>
            )}
            <button
              className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-950"
              onClick={onBack}
              type="button"
            >
              {backLabel}
            </button>
          </div>
        </div>
      </nav>
      {children}
    </>
  )
}

export default App
