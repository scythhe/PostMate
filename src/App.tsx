import { useEffect, useState } from 'react'
import { AuthPage } from './components/AuthPage'
import { BusinessAssets } from './components/BusinessAssets'
import { Dashboard } from './components/Dashboard'
import { LandingPage } from './components/LandingPage'
import { BrandLogo, Navbar } from './components/Navbar'
import { ProgressIndicator } from './components/ProgressIndicator'
import { SavedPosts } from './components/SavedPosts'
import { continueWithDemoAccount, getCurrentUser, getUserData, saveUserData, signOutUser } from './lib/authStorage'
import { defaultBusiness, demoBusinessAssets } from './lib/mockGenerator'
import type { AuthUser, BusinessAssets as BusinessAssetsData, BusinessProfile, SavedPost } from './types'

function App() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentUser())
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [businessAssets, setBusinessAssets] = useState<BusinessAssetsData | null>(null)
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([])
  const [hasLoadedUserData, setHasLoadedUserData] = useState(false)
  const [activeView, setActiveView] = useState<'dashboard' | 'history'>('dashboard')

  useEffect(() => {
    if (!currentUser) {
      setHasLoadedUserData(false)
      return
    }
    const data = getUserData(currentUser.email)
    setBusinessProfile(data.businessProfile)
    setBusinessAssets(data.businessAssets)
    setSavedPosts(data.savedPosts)
    setHasLoadedUserData(true)
  }, [currentUser])

  useEffect(() => {
    if (!currentUser || !hasLoadedUserData) return
    saveUserData(currentUser.email, {
      businessProfile,
      businessAssets,
      savedPosts,
    })
  }, [businessAssets, businessProfile, currentUser, hasLoadedUserData, savedPosts])

  const resetFlow = () => {
    setBusinessProfile(null)
    setBusinessAssets(null)
    setActiveView('dashboard')
  }

  const useDemoData = () => {
    setBusinessProfile(defaultBusiness)
    setBusinessAssets(demoBusinessAssets)
    setActiveView('dashboard')
  }

  const startGoldenPathDemo = () => {
    const user = continueWithDemoAccount()
    const existingData = getUserData(user.email)
    const nextSavedPosts = existingData.savedPosts ?? []

    saveUserData(user.email, {
      businessProfile: defaultBusiness,
      businessAssets: demoBusinessAssets,
      savedPosts: nextSavedPosts,
    })
    setHasLoadedUserData(true)
    setCurrentUser(user)
    setBusinessProfile(defaultBusiness)
    setBusinessAssets(demoBusinessAssets)
    setSavedPosts(nextSavedPosts)
    setActiveView('dashboard')
    setAuthMode(null)
  }

  const handleAuthenticated = (user: AuthUser) => {
    setHasLoadedUserData(false)
    setCurrentUser(user)
    setAuthMode(null)
  }

  const handleSignOut = () => {
    signOutUser()
    setCurrentUser(null)
    setBusinessProfile(null)
    setBusinessAssets(null)
    setSavedPosts([])
    setHasLoadedUserData(false)
    setActiveView('dashboard')
  }

  if (authMode) {
    return <AuthPage initialMode={authMode} onAuthenticated={handleAuthenticated} onBack={() => setAuthMode(null)} />
  }

  if (currentUser) {
    const hasDashboard = Boolean(businessProfile && businessAssets)

    return (
      <>
        <AuthenticatedTopBar
          canOpenDashboard={hasDashboard}
          currentUser={currentUser}
          onGoDashboard={() => setActiveView('dashboard')}
          onGoSavedPosts={() => setActiveView('history')}
          savedPostCount={savedPosts.length}
          onSignOut={handleSignOut}
        />
        {activeView === 'history' ? (
          <SavedPosts
            business={businessProfile ?? defaultBusiness}
            onDelete={(id) => setSavedPosts((current) => current.filter((post) => post.id !== id))}
            onOpen={() => setActiveView('dashboard')}
            posts={savedPosts}
          />
        ) : businessProfile && businessAssets ? (
          <Dashboard
            assets={businessAssets}
            business={businessProfile}
            isDemoMode={currentUser.email === 'demo@postmate.local' && businessProfile.businessName === defaultBusiness.businessName}
            onBackToAssets={() => setBusinessAssets(null)}
            onBackToProfile={resetFlow}
            onReset={resetFlow}
            onSavedPostsChange={setSavedPosts}
            savedPosts={savedPosts}
          />
        ) : businessProfile ? (
          <BusinessAssets business={businessProfile} onBack={resetFlow} onSubmit={setBusinessAssets} />
        ) : (
          <>
            <section className="bg-[#f7f4ee] px-4 py-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <ProgressIndicator availableSteps={[1]} currentStep={1} />
              </div>
            </section>
            <LandingPage onBusinessSubmit={setBusinessProfile} onStartDemo={startGoldenPathDemo} onUseDemoData={useDemoData} showMarketing={false} />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <Navbar onSignIn={() => setAuthMode('signin')} onSignUp={() => setAuthMode('signup')} onTryDemo={startGoldenPathDemo} />
      <section className="bg-[#f7f4ee] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProgressIndicator availableSteps={[1]} currentStep={1} />
        </div>
      </section>
      <LandingPage onBusinessSubmit={setBusinessProfile} onStartDemo={startGoldenPathDemo} onUseDemoData={useDemoData} />
    </>
  )
}

function AuthenticatedTopBar({
  canOpenDashboard,
  currentUser,
  onGoDashboard,
  onGoSavedPosts,
  savedPostCount,
  onSignOut,
}: {
  canOpenDashboard: boolean
  currentUser: AuthUser
  onGoDashboard: () => void
  onGoSavedPosts: () => void
  savedPostCount: number
  onSignOut: () => void
}) {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-950/10 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <BrandLogo />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button className="rounded-md px-3 py-2 font-semibold text-zinc-600 transition hover:bg-stone-100 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40" disabled={!canOpenDashboard} onClick={onGoDashboard} type="button">
            Dashboard
          </button>
          {savedPostCount > 0 ? (
            <button className="rounded-md px-3 py-2 font-semibold text-zinc-600 transition hover:bg-stone-100 hover:text-zinc-950" onClick={onGoSavedPosts} type="button">
              Saved Posts ({savedPostCount})
            </button>
          ) : null}
          <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold text-zinc-600">{currentUser.name || currentUser.email}</span>
          <button className="rounded-md bg-zinc-950 px-4 py-2 font-semibold text-white transition hover:bg-emerald-950" onClick={onSignOut} type="button">
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default App
