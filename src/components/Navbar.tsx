import type { ReactNode } from 'react'

export function Navbar({
  onGetStarted,
  onTryDemo,
}: {
  onGetStarted: () => void
  onTryDemo: () => void
}) {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-950/10 bg-[#f7f4ee]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="flex items-center" href="#">
          <BrandLogo />
        </a>
        <div className="hidden items-center gap-7 text-sm font-medium text-zinc-600 md:flex">
          <a className="transition hover:text-zinc-950" href="#problem">
            Problem
          </a>
          <a className="transition hover:text-zinc-950" href="#how">
            How it works
          </a>
          <a className="transition hover:text-zinc-950" href="#features">
            Features
          </a>
          <a className="transition hover:text-zinc-950" href="#example">
            Example
          </a>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="hidden h-11 items-center rounded-md px-3 text-sm font-semibold text-zinc-500 transition hover:text-zinc-950 sm:inline-flex"
            onClick={onTryDemo}
            type="button"
          >
            Try demo
          </button>
          <button
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-950"
            onClick={onGetStarted}
            type="button"
          >
            Get started
          </button>
        </div>
      </div>
    </nav>
  )
}

export function BrandLogo({ className = 'h-8' }: { className?: string }) {
  return <img alt="PostMate" className={`${className} w-auto object-contain`} src="/postmate-wordmark.png" />
}

export function ButtonLink({
  children,
  href,
  variant,
}: {
  children: ReactNode
  href: string
  variant: 'dark' | 'light'
}) {
  const className =
    variant === 'dark'
      ? 'bg-zinc-950 text-white hover:bg-emerald-950'
      : 'border border-zinc-950/10 bg-white text-zinc-950 hover:border-zinc-950/20 hover:bg-stone-50'

  return (
    <a
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition ${className}`}
      href={href}
    >
      {children}
    </a>
  )
}
