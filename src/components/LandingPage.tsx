import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  Camera,
  Captions,
  Check,
  Clock3,
  Download,
  Hash,
  ImagePlus,
  Layers3,
  MessageSquareText,
  Palette,
  Sparkles,
  Store,
  WandSparkles,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { BusinessSetup } from './BusinessSetup'
import { ButtonLink } from './Navbar'
import type { BusinessProfile, Feature } from '../types'

const features: Feature[] = [
  { icon: CalendarDays, title: 'Weekly content plans', description: 'Turn one offer into a balanced calendar of posts, reels, stories, and reminders.' },
  { icon: Captions, title: 'On-brand captions', description: 'Generate polished captions that match the business tone and audience.' },
  { icon: Hash, title: 'Local hashtag sets', description: 'Create practical hashtag groups around city, niche, occasion, and offer.' },
  { icon: Palette, title: 'Branded post previews', description: 'Preview Instagram-ready creative with business colors, offer copy, and visual hierarchy.' },
  { icon: BarChart3, title: 'Promotion rhythm', description: 'Balance sales posts with trust-building moments so the feed never feels pushy.' },
  { icon: Layers3, title: 'Reusable examples', description: 'Save proven post ideas and refresh them for new campaigns, seasons, and events.' },
]

const planItems = ['Monday: behind the counter reel', 'Wednesday: offer teaser post', 'Friday: seasonal latte promo']
const hashtags = ['#portlandcafe', '#localcoffee', '#brunchspot', '#supportlocal']

export function LandingPage({
  onBusinessSubmit,
  onStartDemo,
  onUseDemoData,
  showMarketing = true,
}: {
  onBusinessSubmit: (profile: BusinessProfile) => void
  onStartDemo: () => void
  onUseDemoData: () => void
  showMarketing?: boolean
}) {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      {showMarketing ? (
        <>
          <Hero onStartDemo={onStartDemo} />
          <ProblemSection />
          <HowItWorks />
          <FeaturesSection />
          <ExamplePreviewSection />
        </>
      ) : null}
      <BusinessSetup onSubmit={onBusinessSubmit} onUseDemoData={onUseDemoData} />
      {showMarketing ? <CtaSection /> : null}
    </main>
  )
}

function Hero({ onStartDemo }: { onStartDemo: () => void }) {
  return (
    <header className="relative overflow-hidden border-b border-zinc-950/10 bg-[#ebe6dc]">
      <div className="absolute inset-0 hero-grid opacity-70" />
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow icon={Sparkles}>Built for restaurants, cafes, salons, studios, and shops</Eyebrow>
          <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
            Instagram content without hiring an SMM.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
            PostMate helps local businesses generate Instagram posts, captions, hashtags, and weekly content plans from one simple business profile.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-950" onClick={onStartDemo} type="button">
              Try demo in 30 seconds <ArrowRight size={17} />
            </button>
            <ButtonLink href="#features" variant="light">
              Explore features
            </ButtonLink>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl">
          <ProductShowcase />
        </div>
      </div>
    </header>
  )
}

function ProductShowcase() {
  return (
    <div className="rounded-lg border border-zinc-950/10 bg-zinc-950 p-3 shadow-2xl shadow-zinc-950/20">
      <div className="grid gap-3 rounded-md bg-[#f8f6f0] p-3 lg:grid-cols-[1fr_0.9fr_0.8fr]">
        <DashboardPanel />
        <CaptionPanel />
        <PostPreview compact />
      </div>
    </div>
  )
}

function DashboardPanel() {
  return (
    <section className="rounded-md border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">Weekly plan</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Cedar & Steam Cafe</h2>
        </div>
        <span className="grid size-10 place-items-center rounded-md bg-emerald-950 text-white">
          <CalendarDays size={18} />
        </span>
      </div>
      <div className="mt-5 grid gap-3">
        {planItems.map((item) => (
          <div className="flex items-center gap-3 rounded-md border border-zinc-100 bg-stone-50 px-3 py-3" key={item}>
            <Check className="shrink-0 text-emerald-700" size={17} />
            <span className="text-sm font-medium text-zinc-700">{item}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-md bg-emerald-950 p-4 text-white">
        <p className="text-sm text-white/70">Campaign focus</p>
        <p className="mt-1 font-semibold">Two-for-one seasonal lattes every Friday morning.</p>
      </div>
    </section>
  )
}

function CaptionPanel() {
  return (
    <section className="rounded-md border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquareText className="text-emerald-700" size={19} />
        <h2 className="font-semibold">Generated caption</h2>
      </div>
      <p className="text-sm leading-6 text-zinc-700">
        Bring a friend this Friday and make the morning sweeter. Our seasonal maple latte is two-for-one from 8 to 11, served with the warm corner-table energy you know us for.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {hashtags.map((tag) => (
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-zinc-600" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-600">
        <span className="flex items-center gap-2">
          <Clock3 size={15} /> Best time
        </span>
        <strong className="text-zinc-950">Friday 8:15 AM</strong>
      </div>
    </section>
  )
}

function ProblemSection() {
  const pains = [
    {
      icon: Clock3,
      title: 'No time to post',
      description: 'Owners are busy with operations, staff, customers, and daily problems.',
      stat: '3-5 hours/week lost',
      accent: 'bg-amber-50 text-amber-700',
    },
    {
      icon: CalendarDays,
      title: 'Random content',
      description: 'Posts happen only when someone remembers, so the feed feels inconsistent.',
      stat: 'No weekly plan',
      accent: 'bg-sky-50 text-sky-700',
    },
    {
      icon: BarChart3,
      title: 'SMM is expensive',
      description: 'Many small businesses cannot afford a monthly social media manager.',
      stat: 'High monthly cost',
      accent: 'bg-rose-50 text-rose-700',
    },
    {
      icon: Palette,
      title: 'Good place, weak page',
      description: 'The real business looks better than its Instagram presence.',
      stat: 'Missed first impression',
      accent: 'bg-violet-50 text-violet-700',
    },
  ]

  return (
    <SectionShell id="problem">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <SectionHeading
          eyebrow="The problem"
          title="Local owners need consistent marketing, but social media becomes another job."
          description="Hiring an SMM can be expensive before the business has proven its content rhythm. PostMate gives owners a practical starting point that still feels polished."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {pains.map((pain) => (
            <article className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-950/5" key={pain.title}>
              <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-stone-100 transition group-hover:scale-110" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <span className={`grid size-11 place-items-center rounded-md ${pain.accent}`}>
                    <pain.icon size={20} />
                  </span>
                  <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white">{pain.stat}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{pain.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{pain.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

function HowItWorks() {
  const flowSteps = [
    {
      icon: Store,
      label: '01',
      title: 'Create business profile',
      details: ['Name', 'Industry', 'Location', 'Tone', 'Audience', 'Brand colors'],
    },
    {
      icon: ImagePlus,
      label: '02',
      title: 'Add real assets',
      details: ['Menu items', 'Photos', 'Reviews', 'Offers', 'Events'],
    },
    {
      icon: WandSparkles,
      label: '03',
      title: 'Generate content',
      details: ['Weekly plan', 'Captions', 'Hashtags', 'Story text'],
    },
    {
      icon: Download,
      label: '04',
      title: 'Export post',
      details: ['Branded preview', 'PNG download'],
    },
  ]

  return (
    <SectionShell id="how" tone="white">
      <SectionHeading
        centered
        eyebrow="How it works"
        title="A real product flow from local business assets to export-ready posts."
        description="PostMate does not start from a blank prompt. It uses the business profile and real assets to shape the plan, copy, and preview."
      />
      <div className="mt-10 grid gap-4 lg:grid-cols-4">
        {flowSteps.map((step, index) => (
          <article className="relative rounded-lg border border-zinc-200 bg-stone-50 p-5 shadow-sm" key={step.label}>
            {index < flowSteps.length - 1 ? (
              <span className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-400 lg:grid">
                <ArrowRight size={14} />
              </span>
            ) : null}
            <div className="flex items-center justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-md bg-emerald-950 text-white">
                <step.icon size={20} />
              </span>
              <span className="text-sm font-semibold text-emerald-700">{step.label}</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {step.details.map((detail) => (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-200" key={detail}>
                  {detail}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <WorkflowMockup />
    </SectionShell>
  )
}

function WorkflowMockup() {
  const mockupSteps = [
    { title: 'Profile', items: ['Maison Marani', 'Luxury restaurant', 'Emerald + gold'] },
    { title: 'Assets', items: ['3 menu items', '4 photo categories', '2 reviews'] },
    { title: 'Plan', items: ['7 post ideas', 'Captions', 'Hashtags'] },
    { title: 'Post Preview', items: ['Square creative', 'Brand colors', 'PNG export'] },
  ]

  return (
    <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-950 p-3 shadow-xl shadow-zinc-950/10">
      <div className="grid gap-3 rounded-md bg-[#f8f6f0] p-3 md:grid-cols-4">
        {mockupSteps.map((step, index) => (
          <div className="rounded-md border border-zinc-200 bg-white p-4" key={step.title}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold tracking-tight">{step.title}</h3>
              {index < mockupSteps.length - 1 ? <ArrowRight className="hidden text-zinc-300 md:block" size={17} /> : null}
            </div>
            <div className="mt-4 grid gap-2">
              {step.items.map((item) => (
                <div className="rounded-md bg-stone-50 px-3 py-2 text-sm font-medium text-zinc-600" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <SectionShell id="features">
      <SectionHeading
        eyebrow="Features"
        title="Everything a local business needs before it hires a full social team."
        description="PostMate keeps the creative workflow focused: strategy, captions, hashtags, and a clear preview of the final post."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard feature={feature} key={feature.title} />
        ))}
      </div>
    </SectionShell>
  )
}

function ExamplePreviewSection() {
  return (
    <SectionShell id="example" tone="dark">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <Eyebrow icon={WandSparkles}>Example output</Eyebrow>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            A Friday offer becomes a post, caption, hashtag set, and weekly plan.
          </h2>
          <p className="mt-5 max-w-xl leading-8 text-zinc-300">
            This preview uses a restaurant and cafe profile by default, with warm language, a clear local offer, and premium visual direction.
          </p>
          <div className="mt-7 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
            <ProofPoint>Caption matched to brand tone</ProofPoint>
            <ProofPoint>Hashtags grouped for local reach</ProofPoint>
            <ProofPoint>Offer framed for conversion</ProofPoint>
            <ProofPoint>Design preview ready to approve</ProofPoint>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4">
            <MiniOutputCard icon={CalendarDays} title="Content plan" text="5 posts covering behind-the-scenes, trust, offer reminders, and a Friday promo." />
            <MiniOutputCard icon={Hash} title="Hashtags" text="#portlandcafe #latteart #localbrunch #coffeedeal #supportlocal" />
            <MiniOutputCard icon={BadgeCheck} title="Review status" text="Ready for owner approval with one clear promotional angle." />
          </div>
          <PostPreview />
        </div>
      </div>
    </SectionShell>
  )
}

function CtaSection() {
  return (
    <section className="bg-[#f7f4ee] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-lg border border-zinc-950/10 bg-white p-8 text-center shadow-xl shadow-zinc-950/5 sm:p-12" id="cta">
        <Eyebrow icon={Store}>Built for local businesses</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Give every local business a smarter way to show up on Instagram.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-8 text-zinc-600">PostMate is ready for SaaS demo flows, onboarding, and future backend integration.</p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="#setup" variant="dark">
            Start custom setup <ArrowRight size={17} />
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

function PostPreview({ compact = false }: { compact?: boolean }) {
  return (
    <article className="rounded-lg border border-white/15 bg-[#173f37] p-4 shadow-xl shadow-zinc-950/20">
      <div className="aspect-square rounded-md border border-white/20 bg-[linear-gradient(145deg,#17423a_0%,#173f37_48%,#e9ad55_100%)] p-5 text-white">
        <div className="flex h-full flex-col justify-between rounded-md border border-white/20 bg-black/15 p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Camera size={18} /> Cedar & Steam
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Portland</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Friday morning offer</p>
            <h3 className={`${compact ? 'mt-3 text-3xl' : 'mt-4 text-4xl'} font-semibold leading-none tracking-tight`}>Two-for-one seasonal lattes</h3>
          </div>
          <div className="flex items-end justify-between gap-4">
            <p className="max-w-[13rem] text-sm leading-6 text-white/75">Bring a friend. Stay for the pastry case.</p>
            <span className="grid size-11 place-items-center rounded-md bg-white text-zinc-950">
              <Sparkles size={19} />
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-950/5">
      <span className="grid size-11 place-items-center rounded-md bg-emerald-950 text-white">
        <feature.icon size={20} />
      </span>
      <h3 className="mt-5 text-xl font-semibold tracking-tight">{feature.title}</h3>
      <p className="mt-3 leading-7 text-zinc-600">{feature.description}</p>
    </article>
  )
}

function MiniOutputCard({ icon: Icon, title, text }: { icon: Feature['icon']; title: string; text: string }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/10 p-5 text-white backdrop-blur">
      <Icon className="text-amber-300" size={20} />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{text}</p>
    </article>
  )
}

function ProofPoint({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2">
      <Check className="text-amber-300" size={17} />
      {children}
    </p>
  )
}

function SectionShell({
  children,
  id,
  tone = 'stone',
}: {
  children: ReactNode
  id: string
  tone?: 'stone' | 'white' | 'dark'
}) {
  const toneClass = tone === 'dark' ? 'bg-zinc-950 text-white' : tone === 'white' ? 'bg-white text-zinc-950' : 'bg-[#f7f4ee] text-zinc-950'

  return (
    <section className={`${toneClass} px-4 py-16 sm:px-6 lg:px-8 lg:py-24`} id={id}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string
  title: string
  description: string
  centered?: boolean
}) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-zinc-600">{description}</p>
    </div>
  )
}

function Eyebrow({ children, icon: Icon }: { children: string; icon: Feature['icon'] }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-zinc-950/10 bg-white/75 px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm">
      <Icon size={15} />
      {children}
    </p>
  )
}
