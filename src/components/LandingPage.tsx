import { ArrowRight, Camera, Check, Eye, Sparkles, Zap } from 'lucide-react'
import { BrandLogo } from './Navbar'

export function LandingPage({
  onGetStarted,
  onSignIn,
  onTryDemo: _onTryDemo,
}: {
  onGetStarted: () => void
  onSignIn?: () => void
  onTryDemo: () => void
}) {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <LandingNav onGetStarted={onGetStarted} onSignIn={onSignIn ?? onGetStarted} />
      <Hero onGetStarted={onGetStarted} />
      <HowItWorks />
      <Pricing onGetStarted={onGetStarted} />
      <FinalCTA onGetStarted={onGetStarted} />
    </div>
  )
}

// ── Nav ────────────────────────────────────────────────────────

function LandingNav({ onGetStarted, onSignIn }: { onGetStarted: () => void; onSignIn: () => void }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSignIn}
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-emerald-950"
          >
            Try free <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </nav>
  )
}

// ── Hero ───────────────────────────────────────────────────────

function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="bg-zinc-950 px-4 pt-20 pb-0 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400">
          <Sparkles size={12} className="text-emerald-400" /> AI-powered · built for local businesses
        </span>
        <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          A week of Instagram posts,<br />
          <span className="text-emerald-400">ready in 30 seconds.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
          PostMate writes 7 days of captions, content ideas, and what to film — tailored to your exact business.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-500 px-6 text-base font-semibold text-white transition hover:bg-emerald-400"
          >
            Try free for 1 week <ArrowRight size={18} />
          </button>
        </div>
        <p className="mt-3 text-sm text-zinc-500">No credit card required · then $25/month</p>
      </div>

      {/* Product mockup */}
      <div className="mx-auto mt-14 max-w-5xl">
        <div className="rounded-t-2xl border border-white/10 bg-zinc-900 p-3">
          <div className="flex gap-1.5 mb-3 px-1">
            <span className="size-3 rounded-full bg-zinc-700" />
            <span className="size-3 rounded-full bg-zinc-700" />
            <span className="size-3 rounded-full bg-zinc-700" />
          </div>
          <MockDashboard />
        </div>
      </div>
    </section>
  )
}

function MockDashboard() {
  const posts = [
    { day: 'Mon', type: 'Post', category: 'design', emoji: '💬', title: 'Ask us anything', caption: 'We want to hear from you. Drop your question in the comments — we\'re answering everything this week.' },
    { day: 'Wed', type: 'Carousel', category: 'design', emoji: '🎁', title: 'Summer deal', caption: '20% off everything this week. Tag someone who needs this before it\'s gone.' },
    { day: 'Thu', type: 'Reel', category: 'capture', emoji: '🎬', title: 'Before we open', caption: 'This is what 7am looks like. The work nobody sees — but you get to.' },
    { day: 'Fri', type: 'Post', category: 'design', emoji: '🌟', title: 'Your weekend sorted', caption: 'Friday. You made it. We\'re here all weekend and the only thing better than Friday is spending it here.' },
  ]

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {posts.map((p) => (
        <div key={p.day} className="rounded-xl bg-zinc-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-zinc-400">{p.day}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.type === 'Reel' ? 'bg-purple-900/50 text-purple-300' : 'bg-zinc-700 text-zinc-300'}`}>
              {p.type}
            </span>
            <span className={`ml-auto text-xs ${p.category === 'design' ? 'text-emerald-400' : 'text-blue-400'}`}>
              {p.category === 'design' ? <Eye size={11} /> : <Camera size={11} />}
            </span>
          </div>
          <p className="text-lg">{p.emoji}</p>
          <p className="mt-1 text-xs font-semibold text-white">{p.title}</p>
          <p className="mt-1 text-xs text-zinc-500 leading-4 line-clamp-2">{p.caption}</p>
          <div className="mt-3 flex items-center gap-1">
            <div className="flex-1 rounded bg-zinc-700 px-2 py-1 text-xs text-zinc-400">Copy caption</div>
            {p.category === 'design' && (
              <div className="rounded bg-emerald-900/50 px-2 py-1 text-xs text-emerald-400">Preview</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── How it works ───────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: '01',
      icon: <Zap size={20} className="text-emerald-600" />,
      title: 'Set up in 2 minutes',
      desc: 'Paste your website URL or describe your business. PostMate reads it and builds your profile.',
    },
    {
      n: '02',
      icon: <span className="text-xl">🎁</span>,
      title: 'Add deals & events',
      desc: 'Got a promotion running? An event coming up? AI weaves them into the right posts automatically.',
    },
    {
      n: '03',
      icon: <Sparkles size={20} className="text-emerald-600" />,
      title: 'Generate → copy → post',
      desc: '7 posts. Captions you can copy in one click. A visual preview for posts you can design yourself.',
    },
  ]

  return (
    <section className="bg-[#f7f4ee] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-emerald-700">How it works</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          From zero to a week of content in minutes.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-zinc-100">{s.icon}</span>
                <span className="text-xs font-bold text-zinc-400">{s.n}</span>
              </div>
              <h3 className="font-bold text-zinc-950">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-6">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* What you get callouts */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: '✍️', label: 'Ready-to-copy captions' },
            { icon: '🎨', label: 'Digital post previews' },
            { icon: '📷', label: 'Footage guides for Reels' },
            { icon: '🔁', label: 'No repeated posts' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-semibold text-zinc-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ────────────────────────────────────────────────────

function Pricing({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-emerald-700">Pricing</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Start free. Stay if it works.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {/* Free trial */}
          <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-8">
            <span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
              Start here
            </span>
            <p className="mt-4 text-3xl font-bold text-zinc-950">Free</p>
            <p className="text-zinc-500">for 1 week · full access</p>
            <ul className="mt-6 grid gap-3">
              {['All 7-day post generations', 'Digital post previews', 'Deals & events AI', 'Copy-ready captions', 'Footage guides for Reels'].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <Check size={15} className="shrink-0 text-emerald-600" /> {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onGetStarted}
              className="mt-8 inline-flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-bold text-white transition hover:bg-emerald-400"
            >
              Start free trial <ArrowRight size={16} />
            </button>
            <p className="mt-3 text-center text-xs text-zinc-400">No credit card required</p>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-8">
            <span className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
              After trial
            </span>
            <p className="mt-4 text-3xl font-bold text-zinc-950">$25</p>
            <p className="text-zinc-500">per month · cancel anytime</p>
            <ul className="mt-6 grid gap-3">
              {['4 content plans per month', '28-post anti-repeat memory', 'Business deals & events', 'All post types + previews', 'Priority AI generation'].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <Check size={15} className="shrink-0 text-zinc-400" /> {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onGetStarted}
              className="mt-8 inline-flex w-full h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Start with the free trial first
            </button>
            <p className="mt-3 text-center text-xs text-zinc-400">Upgrade inside the app after trial</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Final CTA ──────────────────────────────────────────────────

function FinalCTA({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="bg-zinc-950 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Your next 7 posts are<br />
          <span className="text-emerald-400">30 seconds away.</span>
        </h2>
        <p className="mt-4 text-zinc-400">No agency. No blank page. No excuses.</p>
        <button
          type="button"
          onClick={onGetStarted}
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-500 px-8 text-base font-bold text-white transition hover:bg-emerald-400"
        >
          Try PostMate free <ArrowRight size={18} />
        </button>
        <p className="mt-3 text-sm text-zinc-600">1 week free · then $25/month · cancel anytime</p>
      </div>
    </section>
  )
}
