import type { DesignTemplate } from '../types'

interface PreviewProps {
  title: string
  shortCaption: string
  emoji: string
  handle: string
  primaryColor: string
  secondaryColor: string
  template: DesignTemplate
}

export function PostPreview(props: PreviewProps) {
  if (props.template === 'light') return <LightTemplate {...props} />
  if (props.template === 'vivid') return <VividTemplate {...props} />
  return <BoldTemplate {...props} />
}

function BoldTemplate({ title, shortCaption, emoji, handle, primaryColor }: PreviewProps) {
  const textColor = getContrastColor(primaryColor)
  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-xl flex flex-col items-center justify-center text-center select-none"
      style={{ background: primaryColor }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 gap-3">
        <span className="text-5xl leading-none">{emoji}</span>
        <h3
          className="font-bold text-xl leading-snug tracking-tight"
          style={{ color: textColor === 'dark' ? 'rgba(0,0,0,0.9)' : '#ffffff' }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed max-w-[240px]"
          style={{ color: textColor === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.75)' }}
        >
          {shortCaption}
        </p>
      </div>
      <div
        className="w-full flex items-center justify-between px-5 py-2.5"
        style={{ background: textColor === 'dark' ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.20)' }}
      >
        <span
          className="text-xs font-medium"
          style={{ color: textColor === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.65)' }}
        >
          {handle || '@yourbusiness'}
        </span>
        <span
          className="text-xs"
          style={{ color: textColor === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)' }}
        >
          PostMate
        </span>
      </div>
    </div>
  )
}

function LightTemplate({ title, shortCaption, emoji, handle, primaryColor }: PreviewProps) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white flex flex-col select-none">
      <div className="h-1 w-full" style={{ background: primaryColor }} />
      <div className="flex-1 flex flex-col justify-center px-8 py-6 gap-4">
        <span className="text-4xl leading-none">{emoji}</span>
        <div>
          <h3 className="font-bold text-xl text-zinc-950 leading-snug">{title}</h3>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{shortCaption}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-100">
        <span className="text-xs font-semibold" style={{ color: primaryColor }}>
          {handle || '@yourbusiness'}
        </span>
        <span className="text-xs text-zinc-300">PostMate</span>
      </div>
    </div>
  )
}

function VividTemplate({ title, shortCaption, emoji, handle, primaryColor, secondaryColor }: PreviewProps) {
  const isDark = isColorDark(primaryColor)
  const textPrimary = isDark ? '#ffffff' : '#ffffff'
  const textSub = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.80)'
  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-xl flex flex-col items-center justify-center text-center select-none"
      style={{ background: `linear-gradient(145deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 gap-3">
        <span className="text-5xl leading-none">{emoji}</span>
        <h3 className="font-bold text-xl leading-snug tracking-tight" style={{ color: textPrimary }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed max-w-[240px]" style={{ color: textSub }}>
          {shortCaption}
        </p>
      </div>
      <div className="w-full flex items-center justify-between px-5 py-2.5 bg-black/15">
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {handle || '@yourbusiness'}
        </span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>PostMate</span>
      </div>
    </div>
  )
}

// ── Utilities ──────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

function isColorDark(hex: string): boolean {
  const rgb = hexToRgb(hex)
  if (!rgb) return true
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance < 0.55
}

function getContrastColor(hex: string): 'dark' | 'light' {
  return isColorDark(hex) ? 'light' : 'dark'
}
