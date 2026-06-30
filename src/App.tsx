import { Loader2, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Auth } from './components/Auth'
import { BusinessDashboard } from './components/Dashboard'
import { IdeasBoard } from './components/IdeasBoard'
import { LandingPage } from './components/LandingPage'
import { BrandLogo } from './components/Navbar'
import { Onboarding } from './components/Onboarding'
import { PostEditor } from './components/PostEditor'
import { supabase } from './lib/supabase'
import { getBusiness, getCurrentUser, signOut } from './lib/storage'
import type { Business, ContentIdea, Post, User } from './types'

type View = 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'ideas' | 'post-editor'
type AuthMode = 'signin' | 'signup'

function App() {
  const [view,         setView]         = useState<View>('landing')
  const [authMode,     setAuthMode]     = useState<AuthMode>('signup')
  const [user,         setUser]         = useState<User | null>(null)
  const [business,     setBusiness]     = useState<Business | null>(null)
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [booting,      setBooting]      = useState(true)

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
        } catch { /* stale session — stay on landing */ }
      }
      setBooting(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_OUT') { setUser(null); setBusiness(null); setView('landing') }
    })
    return () => subscription.unsubscribe()
  }, [])

  if (booting) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee]">
      <Loader2 size={28} className="animate-spin text-emerald-700" />
    </div>
  )

  function doSignOut() { signOut(); setUser(null); setBusiness(null); setView('landing') }

  if (view === 'landing') return (
    <LandingPage
      onGetStarted={() => { setAuthMode('signup'); setView('auth') }}
      onSignIn={() => { setAuthMode('signin'); setView('auth') }}
      onTryDemo={() => { setAuthMode('signup'); setView('auth') }}
    />
  )

  if (view === 'auth') return (
    <Auth defaultMode={authMode} onBack={() => setView('landing')}
      onAuth={async u => {
        setUser(u)
        const biz = await getBusiness(u.id)
        setBusiness(biz)
        setView(biz ? 'dashboard' : 'onboarding')
      }}
    />
  )

  if (view === 'onboarding' && user) return (
    <Onboarding
      userId={user.id}
      existingBusiness={business}
      onDone={biz => { setBusiness(biz); setView('dashboard') }}
      onBack={() => { if (business) setView('dashboard'); else doSignOut() }}
    />
  )

  if (!user || !business) { doSignOut(); return null }

  if (view === 'ideas') return (
    <Shell userName={user.name} onSignOut={doSignOut}>
      <IdeasBoard
        business={business}
        onSelect={idea => { setSelectedIdea(idea); setView('post-editor') }}
        onBack={() => setView('dashboard')}
      />
    </Shell>
  )

  if (view === 'post-editor' && selectedIdea) return (
    <Shell userName={user.name} onSignOut={doSignOut}>
      <PostEditor
        business={business}
        idea={selectedIdea}
        initialPost={selectedPost ?? undefined}
        onBack={() => { setSelectedPost(null); setView(selectedPost ? 'dashboard' : 'ideas') }}
        onApproved={() => { setSelectedPost(null); setView('dashboard') }}
      />
    </Shell>
  )

  return (
    <Shell userName={user.name} onSignOut={doSignOut}>
      <BusinessDashboard
        business={business}
        user={user}
        onGetIdeas={() => setView('ideas')}
        onEditBusiness={() => setView('onboarding')}
        onBusinessChange={setBusiness}
        onOpenPost={post => {
          setSelectedPost(post)
          setSelectedIdea({ id: post.id, type: post.ideaType, title: post.title, hook: post.shortCaption, postType: post.postType, contentCategory: post.contentCategory, emoji: post.emoji })
          setView('post-editor')
        }}
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
            <button type="button" onClick={onSignOut} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition">
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
