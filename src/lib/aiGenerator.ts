import type { Business, GeneratedPost, ScrapedInfo } from '../types'

const GENERATE_URL = import.meta.env.VITE_N8N_GENERATE_URL as string | undefined
const SCRAPE_URL = import.meta.env.VITE_N8N_SCRAPE_URL as string | undefined

// ── Website scraping ───────────────────────────────────────────

export async function scrapeWebsite(websiteUrl: string): Promise<ScrapedInfo> {
  if (!SCRAPE_URL) throw new Error('No scraping service configured')
  const response = await fetch(SCRAPE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ websiteUrl }),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const raw = await response.json()
  const d = raw?.output ?? raw?.result ?? raw?.data ?? raw
  return {
    businessName: String(d.businessName ?? ''),
    description: String(d.description ?? ''),
    instagramHandle: String(d.instagramHandle ?? ''),
  }
}

// ── Content generation ─────────────────────────────────────────

export async function generatePosts(
  business: Business,
  preferences: string,
  previousTitles: string[],
): Promise<GeneratedPost[]> {
  if (GENERATE_URL) {
    try {
      return await callN8n(business, preferences, previousTitles)
    } catch (err) {
      console.warn('n8n generation failed, using local fallback:', err)
    }
  }
  return localGenerate(business)
}

async function callN8n(
  business: Business,
  preferences: string,
  previousTitles: string[],
): Promise<GeneratedPost[]> {
  const res = await fetch(GENERATE_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessName: business.name,
      description: business.description,
      instagramHandle: business.instagramHandle,
      deals: business.deals,
      events: business.events,
      preferences,
      previousTitles,
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const raw = await res.json()
  const d = raw?.output ?? raw?.result ?? raw?.data ?? raw
  const posts: Record<string, unknown>[] = Array.isArray(d.posts) ? d.posts : Array.isArray(d) ? d : []
  return posts.map((p, i) => ({
    id: crypto.randomUUID(),
    day: String(p.day ?? DAYS[i % 7]),
    postType: (VALID_TYPES.includes(String(p.postType)) ? p.postType : 'Post') as GeneratedPost['postType'],
    contentCategory: (String(p.contentCategory) === 'capture' ? 'capture' : 'design') as GeneratedPost['contentCategory'],
    designTemplate: (['bold', 'light', 'vivid'].includes(String(p.designTemplate)) ? p.designTemplate : 'bold') as GeneratedPost['designTemplate'],
    emoji: String(p.emoji ?? '✨'),
    title: String(p.title ?? ''),
    caption: String(p.caption ?? ''),
    shortCaption: String(p.shortCaption ?? ''),
    captureNote: p.captureNote ? String(p.captureNote) : undefined,
    hashtags: Array.isArray(p.hashtags) ? (p.hashtags as string[]) : [],
  }))
}

// ── Local generator ────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
const VALID_TYPES = ['Post', 'Reel', 'Story', 'Carousel']

function localGenerate(business: Business): GeneratedPost[] {
  const n = business.name
  const tag = n.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
  const handle = business.instagramHandle || `@${tag}`
  const deal = business.deals[0]
  const event = business.events[0]

  const posts: GeneratedPost[] = [
    // ── Monday: Community Q&A (design — bold) ──────────────────
    {
      id: crypto.randomUUID(),
      day: 'Monday',
      postType: 'Post',
      contentCategory: 'design',
      designTemplate: 'bold',
      emoji: '💬',
      title: 'Ask us anything',
      caption: `We want to hear from you. 💬\n\nWhat's something you've always wanted to know about ${n}? Drop your question in the comments — we're answering everything this week.\n\n${handle}`,
      shortCaption: `Questions welcome. Ask us anything about ${n} this week.`,
      hashtags: [`#${tag}`, '#community', '#qa', '#localbusiness', '#askus', '#smallbiz'],
    },

    // ── Tuesday: Signature product (capture — photo) ───────────
    {
      id: crypto.randomUUID(),
      day: 'Tuesday',
      postType: 'Post',
      contentCategory: 'capture',
      emoji: '📸',
      title: 'The one people keep coming back for',
      caption: `Some things just speak for themselves. 📸\n\nIf you've been here before, you already know. If you haven't — what are you waiting for?\n\n${handle}`,
      shortCaption: `The reason people keep coming back to ${n}.`,
      captureNote: 'Hero product · close-up · natural light · portrait or square format',
      hashtags: [`#${tag}`, '#localbusiness', '#shoplocal', '#quality', '#musttry', '#local'],
    },

    // ── Wednesday: Deal or value tip (design — vivid or light) ─
    ...(deal ? [{
      id: crypto.randomUUID(),
      day: 'Wednesday',
      postType: 'Post' as const,
      contentCategory: 'design' as const,
      designTemplate: 'vivid' as const,
      emoji: '🎁',
      title: deal.title,
      caption: `🎁 ${deal.title}\n\n${deal.description}${deal.validUntil ? `\n\nAvailable until ${deal.validUntil}.` : ''} Don't sleep on this one — tag someone who needs to see it.\n\n${handle}`,
      shortCaption: `${deal.title} — available now at ${n}.`,
      hashtags: [`#${tag}`, '#deal', '#offer', '#localbusiness', '#shoplocal', '#savemoney'],
    }] : [{
      id: crypto.randomUUID(),
      day: 'Wednesday',
      postType: 'Post' as const,
      contentCategory: 'design' as const,
      designTemplate: 'light' as const,
      emoji: '💡',
      title: 'Something most people don\'t know about us',
      caption: `Not everything makes it to the feed. 💡\n\nHere's something we don't talk about enough: ${n} started because of a simple belief — that [your community] deserves better. That hasn't changed.\n\nEdit this caption to tell your real story. It'll land better than anything we could write.\n\n${handle}`,
      shortCaption: `The story behind ${n} — and why it still matters.`,
      hashtags: [`#${tag}`, '#storytime', '#localbusiness', '#smallbiz', '#community', '#behindthescenes'],
    }]),

    // ── Thursday: Behind the scenes (capture — reel) ───────────
    {
      id: crypto.randomUUID(),
      day: 'Thursday',
      postType: 'Reel',
      contentCategory: 'capture',
      emoji: '🎬',
      title: 'Before we open',
      caption: `This is what it looks like before the doors open. 🎬\n\nThe work nobody sees — but you get to. Follow along for more behind-the-scenes at ${n}.\n\n${handle}`,
      shortCaption: `Behind the scenes at ${n} — the part nobody usually sees.`,
      captureNote: '15–30s vertical reel · morning prep sequence · handheld ok · no narration needed',
      hashtags: [`#${tag}`, '#behindthescenes', '#reel', '#smallbusiness', '#process', '#reelsviral'],
    },

    // ── Friday: FOMO/Weekend (design — bold or event) ──────────
    ...(event ? [{
      id: crypto.randomUUID(),
      day: 'Friday',
      postType: 'Post' as const,
      contentCategory: 'design' as const,
      designTemplate: 'bold' as const,
      emoji: '🗓️',
      title: event.title,
      caption: `📅 ${event.title}${event.date ? ` — ${event.date}` : ''}\n\n${event.description}\n\nDrop a 🙋 if you're coming. See you there.\n\n${handle}`,
      shortCaption: `${event.title} is happening at ${n}. You're invited.`,
      hashtags: [`#${tag}`, '#event', '#localevent', '#community', '#weekendvibes', '#tbilisi'],
    }] : [{
      id: crypto.randomUUID(),
      day: 'Friday',
      postType: 'Post' as const,
      contentCategory: 'design' as const,
      designTemplate: 'bold' as const,
      emoji: '🌟',
      title: 'Your weekend sorted',
      caption: `Friday. You made it. 🌟\n\nWe're here all weekend and the only thing better than making it to Friday is spending it at ${n}. Who are you bringing?\n\n${handle}`,
      shortCaption: `Weekend plans? ${n} is the answer.`,
      hashtags: [`#${tag}`, '#friday', '#weekend', '#weekendvibes', '#localbusiness', '#treatyourself'],
    }]),

    // ── Saturday: Atmosphere/vibes (capture — photo/carousel) ──
    {
      id: crypto.randomUUID(),
      day: 'Saturday',
      postType: 'Carousel',
      contentCategory: 'capture',
      emoji: '📷',
      title: 'What Saturday looks like here',
      caption: `This is what Saturdays look like at ${n}. 📸\n\nSwipe through and tag the person you'd bring. We saved you a spot.\n\n${handle}`,
      shortCaption: `Saturday at ${n}. Come see for yourself.`,
      captureNote: 'Atmosphere shots · 4–6 images · warm tones · mix of space, product, people',
      hashtags: [`#${tag}`, '#saturday', '#weekendvibes', '#localbusiness', '#community', '#goodtimes'],
    },

    // ── Sunday: Gratitude + tease (design — vivid) ─────────────
    {
      id: crypto.randomUUID(),
      day: 'Sunday',
      postType: 'Story',
      contentCategory: 'design',
      designTemplate: 'vivid',
      emoji: '💛',
      title: 'Thank you for this week',
      caption: `Another week down. 💛\n\nThank you to everyone who came in, ordered, messaged, or just hit follow. You're the reason ${n} exists.\n\nSomething worth waiting for is coming next week. Stay close.\n\n${handle}`,
      shortCaption: `${n} thanks you for this week. Something new is coming.`,
      hashtags: [`#${tag}`, '#sunday', '#grateful', '#community', '#thankyou', '#comingsoon'],
    },
  ]

  return posts
}
