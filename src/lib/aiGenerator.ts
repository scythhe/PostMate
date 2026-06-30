import type { Business, ContentIdea, Post, ScrapedInfo } from '../types'

const SCRAPE_URL   = import.meta.env.VITE_N8N_SCRAPE_URL   as string | undefined
const GENERATE_URL = import.meta.env.VITE_N8N_GENERATE_URL as string | undefined
// IDEAS_URL falls back to the same generate endpoint (mode field differentiates)
const IDEAS_URL    = (import.meta.env.VITE_N8N_IDEAS_URL as string | undefined) ?? GENERATE_URL

// ── Scrape ─────────────────────────────────────────────────────

export async function scrapeWebsite(websiteUrl: string): Promise<ScrapedInfo> {
  if (!SCRAPE_URL) throw new Error('No scraping service configured')
  const res = await fetch(SCRAPE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ websiteUrl }) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const raw = await res.json()
  const d = raw?.output ?? raw?.result ?? raw?.data ?? raw
  return {
    businessName:   String(d.businessName   ?? d.business_name    ?? ''),
    description:    String(d.description    ?? ''),
    instagramHandle:String(d.instagramHandle ?? d.instagram_handle ?? ''),
    industry:       String(d.industry       ?? ''),
    location:       String(d.location       ?? ''),
    targetAudience: String(d.targetAudience ?? d.target_audience  ?? ''),
    products:       String(d.products       ?? ''),
    tone:           String(d.tone           ?? ''),
    brandHashtags:  String(d.brandHashtags  ?? d.brand_hashtags   ?? ''),
  }
}

// ── Generate ideas ─────────────────────────────────────────────

export async function generateIdeas(business: Business): Promise<ContentIdea[]> {
  if (IDEAS_URL) {
    try {
      const res = await fetch(IDEAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'ideas',
          businessName: business.name,
          industry: business.industry,
          description: business.description,
          targetAudience: business.targetAudience,
          tone: business.tone,
          products: business.products,
          location: business.location,
          deals: business.deals,
          events: business.events,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.json()
      const d = raw?.output ?? raw?.result ?? raw?.data ?? raw
      const ideas: Record<string, unknown>[] = Array.isArray(d.ideas) ? d.ideas : Array.isArray(d) ? d : []
      if (ideas.length >= 10) {
        return ideas.map(i => ({
          id: crypto.randomUUID(),
          type: String(i.type ?? ''),
          title: String(i.title ?? ''),
          hook: String(i.hook ?? ''),
          postType: (VALID_TYPES.includes(String(i.postType)) ? i.postType : 'Post') as ContentIdea['postType'],
          contentCategory: String(i.contentCategory) === 'capture' ? 'capture' : 'design',
          emoji: String(i.emoji ?? '✨'),
        }))
      }
    } catch (err) {
      console.warn('Ideas generation via n8n failed, using local fallback:', err)
    }
  }
  return localIdeas(business)
}

// ── Generate single post from idea ────────────────────────────

export async function generatePost(business: Business, idea: ContentIdea): Promise<Post> {
  if (GENERATE_URL) {
    try {
      const res = await fetch(GENERATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'post',
          businessName: business.name,
          industry: business.industry,
          description: business.description,
          targetAudience: business.targetAudience,
          tone: business.tone,
          products: business.products,
          location: business.location,
          instagramHandle: business.instagramHandle,
          brandHashtags: business.brandHashtags,
          deals: business.deals,
          events: business.events,
          ideaType: idea.type,
          ideaTitle: idea.title,
          ideaHook: idea.hook,
          postType: idea.postType,
          contentCategory: idea.contentCategory,
          currentSeason: currentSeason(),
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.json()
      const d = raw?.output ?? raw?.result ?? raw?.data ?? raw
      const p = d.post ?? d
      return buildPost(business.id, idea, p)
    } catch (err) {
      console.warn('Post generation via n8n failed, using local fallback:', err)
    }
  }
  return localPost(business, idea)
}

function buildPost(businessId: string, idea: ContentIdea, p: Record<string, unknown>): Post {
  return {
    id: crypto.randomUUID(),
    businessId,
    status: 'draft',
    ideaType: idea.type,
    postType: (VALID_TYPES.includes(String(p.postType)) ? p.postType : idea.postType) as Post['postType'],
    contentCategory: (String(p.contentCategory) === 'capture' ? 'capture' : idea.contentCategory) as Post['contentCategory'],
    designTemplate: (['bold', 'light', 'vivid'].includes(String(p.designTemplate)) ? p.designTemplate : 'bold') as Post['designTemplate'],
    emoji: String(p.emoji ?? idea.emoji ?? '✨'),
    title: String(p.title ?? idea.title ?? ''),
    caption: String(p.caption ?? ''),
    shortCaption: String(p.shortCaption ?? p.short_caption ?? ''),
    captureNote: p.captureNote ? String(p.captureNote) : p.capture_note ? String(p.capture_note) : undefined,
    imagePrompt: p.imagePrompt ? String(p.imagePrompt) : p.image_prompt ? String(p.image_prompt) : undefined,
    hashtags: Array.isArray(p.hashtags) ? p.hashtags as string[] : [],
    createdAt: new Date().toISOString(),
  }
}

// ── Helpers ────────────────────────────────────────────────────

const VALID_TYPES = ['Post', 'Reel', 'Story', 'Carousel']

function currentSeason(): string {
  const m = new Date().getMonth()
  if (m < 2 || m === 11) return 'winter'
  if (m < 5) return 'spring'
  if (m < 8) return 'summer'
  return 'autumn'
}

// ── Local idea templates ───────────────────────────────────────

const IDEA_TEMPLATES: Array<Omit<ContentIdea, 'id' | 'title' | 'hook'>> = [
  { type: 'Meet the Team',       postType: 'Post',     contentCategory: 'capture', emoji: '👋' },
  { type: 'Product Highlight',   postType: 'Post',     contentCategory: 'capture', emoji: '⭐' },
  { type: 'FAQ',                 postType: 'Post',     contentCategory: 'design',  emoji: '❓' },
  { type: 'Customer Review',     postType: 'Carousel', contentCategory: 'design',  emoji: '💬' },
  { type: 'Before / After',      postType: 'Carousel', contentCategory: 'capture', emoji: '🔄' },
  { type: 'Weekend Promotion',   postType: 'Story',    contentCategory: 'design',  emoji: '🎉' },
  { type: 'Educational Tip',     postType: 'Post',     contentCategory: 'design',  emoji: '💡' },
  { type: 'Behind the Scenes',   postType: 'Reel',     contentCategory: 'capture', emoji: '🎬' },
  { type: 'Seasonal Offer',      postType: 'Post',     contentCategory: 'design',  emoji: '🍂' },
  { type: 'Day in the Life',     postType: 'Reel',     contentCategory: 'capture', emoji: '📅' },
  { type: 'Product Tutorial',    postType: 'Reel',     contentCategory: 'capture', emoji: '🎯' },
  { type: 'Industry Insight',    postType: 'Post',     contentCategory: 'design',  emoji: '📊' },
  { type: 'Community Spotlight', postType: 'Post',     contentCategory: 'capture', emoji: '🌟' },
  { type: 'Flash Sale',          postType: 'Story',    contentCategory: 'design',  emoji: '⚡' },
  { type: 'Quote Post',          postType: 'Post',     contentCategory: 'design',  emoji: '✍️' },
  { type: 'This or That Poll',   postType: 'Story',    contentCategory: 'design',  emoji: '🗳️' },
  { type: 'New Arrival',         postType: 'Post',     contentCategory: 'capture', emoji: '🆕' },
  { type: 'Ask Me Anything',     postType: 'Story',    contentCategory: 'design',  emoji: '🙋' },
  { type: 'Milestone Post',      postType: 'Post',     contentCategory: 'design',  emoji: '🏆' },
  { type: 'User Generated',      postType: 'Post',     contentCategory: 'capture', emoji: '📸' },
]

function localIdeas(business: Business): ContentIdea[] {
  const n = business.name
  const aud = business.targetAudience || 'your customers'
  const hooks: Record<string, [string, string]> = {
    'Meet the Team':       [`The faces behind ${n}`, `Who actually makes this place run? Time to meet them.`],
    'Product Highlight':   [`Our most talked-about product`, `The one thing ${aud} keep coming back for.`],
    'FAQ':                 [`The question we get every day`, `Answer the thing everyone wants to know about ${n}.`],
    'Customer Review':     [`Real words from real people`, `Let your customers speak — nothing converts better.`],
    'Before / After':      [`The transformation nobody expected`, `Show the process. Before → After. Always stops the scroll.`],
    'Weekend Promotion':   [`Your weekend just got better`, `A limited offer that gives ${aud} a reason to visit.`],
    'Educational Tip':     [`Most people don't know this`, `Share one thing from your expertise that surprises people.`],
    'Behind the Scenes':   [`What happens before you arrive`, `Pull back the curtain. People love seeing the work.`],
    'Seasonal Offer':      [`${currentSeason().charAt(0).toUpperCase() + currentSeason().slice(1)} at ${n}`, `A seasonal angle that feels timely and relevant right now.`],
    'Day in the Life':     [`A day at ${n} in 30 seconds`, `Morning to close — the Reel that makes people feel like they're there.`],
    'Product Tutorial':    [`How to get the most out of it`, `Show ${aud} exactly how to use what you sell.`],
    'Industry Insight':    [`Something your industry gets wrong`, `Take a confident stance. Your opinion earns trust.`],
    'Community Spotlight': [`Shining a light on someone local`, `Feature a customer, neighbor, or partner. It builds goodwill.`],
    'Flash Sale':          [`24 hours only`, `Create urgency with a time-limited offer that's hard to ignore.`],
    'Quote Post':          [`A line that hits different`, `One quote that captures what ${n} stands for.`],
    'This or That Poll':   [`Help us decide`, `Get ${aud} engaged with a simple two-choice question about your products.`],
    'New Arrival':         [`It's finally here`, `Announce something new with the excitement it deserves.`],
    'Ask Me Anything':     [`We're answering everything`, `Open the floor. It builds connection and fills your content calendar.`],
    'Milestone Post':      [`We just hit a milestone`, `Share a number or achievement. People love being part of a story.`],
    'User Generated':      [`You made our day`, `Repost a customer moment. Social proof in its purest form.`],
  }
  return IDEA_TEMPLATES.map(t => {
    const [title, hook] = hooks[t.type] ?? [t.type, `Create a ${t.type.toLowerCase()} post for ${n}.`]
    return { id: crypto.randomUUID(), ...t, title, hook }
  })
}

// ── Local post generation ──────────────────────────────────────

function localPost(business: Business, idea: ContentIdea): Post {
  const n = business.name
  const handle = business.instagramHandle || `@${n.toLowerCase().replace(/\s+/g, '')}`
  const tag = n.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
  const aud = business.targetAudience || 'our community'
  const season = currentSeason()

  const captions: Record<string, { caption: string; shortCaption: string; captureNote?: string; imagePrompt?: string; designTemplate?: Post['designTemplate'] }> = {
    'Meet the Team': {
      caption: `The people behind ${n}. 👋\n\nEvery great experience starts with the people who care enough to show up every day. Here's the team that makes it happen.\n\n${handle}`,
      shortCaption: `Meet the team behind ${n}.`,
      captureNote: 'Team photo · natural light · candid or posed · warm setting',
      imagePrompt: `Warm, professional team photo of people at ${n}, smiling, natural light, authentic atmosphere`,
    },
    'Product Highlight': {
      caption: `This is the one. ⭐\n\nIf you haven't tried it yet — this is your sign. ${n}'s most talked-about product, and for good reason.\n\nDrop a ⭐ if you know what we're talking about.\n\n${handle}`,
      shortCaption: `The product at ${n} that everyone keeps coming back for.`,
      captureNote: 'Hero shot · close-up · styled · natural or studio light',
      imagePrompt: `Professional product photography, ${n} product, clean background, natural light, appetizing and inviting`,
    },
    'FAQ': {
      caption: `The question we get every single day. ❓\n\n"${idea.hook}"\n\nHere's our honest answer — and we think you'll like it.\n\n${handle}`,
      shortCaption: `Answering the question everyone asks about ${n}.`,
      designTemplate: 'light',
      imagePrompt: `Clean FAQ graphic for ${n}, question and answer format, professional design, brand colors`,
    },
    'Customer Review': {
      caption: `We don't need to say anything. 💬\n\nOur customers said it better. This review came in recently and honestly made our week.\n\nIf you've been here — we'd love to hear from you too.\n\n${handle}`,
      shortCaption: `Real words from someone who's been to ${n}.`,
      designTemplate: 'light',
      imagePrompt: `Customer testimonial graphic for ${n}, quote design, clean and modern, trust-building visual`,
    },
    'Behind the Scenes': {
      caption: `This is what it looks like before you arrive. 🎬\n\nThe work nobody sees — the early starts, the prep, the care that goes into everything. We wanted to show you.\n\n${handle}`,
      shortCaption: `Behind the scenes at ${n} — the work nobody sees.`,
      captureNote: '15–30s vertical Reel · prep/process shots · handheld ok · no narration needed',
      imagePrompt: `Behind the scenes at ${n}, authentic work environment, candid moments, warm lighting`,
    },
    'Educational Tip': {
      caption: `Most people don't know this. 💡\n\n${idea.hook}\n\nShare this with someone who needs to know.\n\n${handle}`,
      shortCaption: `One useful tip from the team at ${n}.`,
      designTemplate: 'bold',
      imagePrompt: `Educational tip graphic for ${n}, bold typography, clear and easy to read, professional design`,
    },
    'Weekend Promotion': {
      caption: `This weekend only. 🎉\n\nWe're doing something special for ${aud} — and we didn't want you to miss it. Come see us.\n\n${handle}`,
      shortCaption: `A weekend special at ${n} worth knowing about.`,
      designTemplate: 'vivid',
      imagePrompt: `Weekend promotion graphic for ${n}, vibrant and exciting design, call-to-action focused`,
    },
    'Seasonal Offer': {
      caption: `${season.charAt(0).toUpperCase() + season.slice(1)} at ${n}. 🍂\n\nThe season changes and so do we. We've got something fitting for right now — come check it out.\n\n${handle}`,
      shortCaption: `${n} is doing something special this ${season}.`,
      designTemplate: 'vivid',
      imagePrompt: `${season} themed graphic for ${n}, seasonal colors and mood, warm and inviting`,
    },
    'Day in the Life': {
      caption: `A day at ${n} in 30 seconds. 📅\n\nMorning to close. Follow along.\n\n${handle}`,
      shortCaption: `A day in the life at ${n}.`,
      captureNote: '30s vertical Reel · time-lapse or quick cuts from open to close · upbeat track',
      imagePrompt: `Day in the life montage at ${n}, multiple scenes, energetic and authentic`,
    },
    'Product Tutorial': {
      caption: `Here's how to get the most out of it. 🎯\n\nWe see a lot of people using it the basic way. This is how we do it. Try it and let us know.\n\n${handle}`,
      shortCaption: `How to use ${n}'s product the right way.`,
      captureNote: 'Tutorial Reel · step-by-step · clear close-ups · 30–60s',
      imagePrompt: `Product tutorial graphic for ${n}, step-by-step visual, clean and instructional`,
    },
    'Quote Post': {
      caption: `"${idea.hook}"\n\nThis is what ${n} is built on. Share if it resonates.\n\n${handle}`,
      shortCaption: `A quote that captures what ${n} stands for.`,
      designTemplate: 'bold',
      imagePrompt: `Inspirational quote graphic for ${n}, bold typography, clean background, brand identity`,
    },
    'Flash Sale': {
      caption: `24 hours only. ⚡\n\nWe're making it easy for you. This offer disappears at midnight — we're not bringing it back.\n\nTag someone who needs to see this.\n\n${handle}`,
      shortCaption: `A 24-hour offer at ${n} that ends tonight.`,
      designTemplate: 'vivid',
      imagePrompt: `Flash sale announcement graphic for ${n}, urgency and excitement, bold typography, countdown feeling`,
    },
    'This or That Poll': {
      caption: `Help us settle this. 🗳️\n\nLeft or right? Option A or B? You tell us — drop your vote in the comments.\n\n${handle}`,
      shortCaption: `${n} wants your opinion — this or that?`,
      designTemplate: 'light',
      imagePrompt: `This or that poll graphic for ${n}, two clear options, engaging design, split layout`,
    },
    'New Arrival': {
      caption: `It's finally here. 🆕\n\nWe've been waiting to show you this. Come see it in person — you'll understand why we're excited.\n\n${handle}`,
      shortCaption: `Something new just arrived at ${n}.`,
      captureNote: 'New product reveal · dramatic light · clean background · close-up first',
      imagePrompt: `New product reveal for ${n}, exciting and fresh, clean presentation, product hero shot`,
    },
    'Ask Me Anything': {
      caption: `We're answering everything. 🙋\n\nDrop your question about ${n} in the comments — no question too big or too weird. We're here all day.\n\n${handle}`,
      shortCaption: `Ask ${n} anything — they're answering in the comments.`,
      designTemplate: 'bold',
      imagePrompt: `Ask Me Anything graphic for ${n}, inviting and open design, question mark motif, friendly feel`,
    },
    'Milestone Post': {
      caption: `We hit a milestone and couldn't not share it. 🏆\n\nNone of this happens without ${aud}. Genuinely — thank you. The next chapter is going to be even better.\n\n${handle}`,
      shortCaption: `${n} just hit a milestone worth celebrating.`,
      designTemplate: 'vivid',
      imagePrompt: `Milestone celebration graphic for ${n}, achievement focused, celebratory design, numbers prominent`,
    },
    'Industry Insight': {
      caption: `Something most people get wrong about this industry. 📊\n\nWe've been in this long enough to have opinions. Here's ours.\n\nAgree or disagree? Let's talk.\n\n${handle}`,
      shortCaption: `${n}'s take on what the industry gets wrong.`,
      designTemplate: 'light',
      imagePrompt: `Industry insight infographic for ${n}, data-driven design, professional and authoritative`,
    },
    'Community Spotlight': {
      caption: `We see you. 🌟\n\nWanting to shine a light on someone in our community today. These are the people that make ${n} worth showing up for.\n\n${handle}`,
      shortCaption: `${n} spotlights someone from their community.`,
      captureNote: 'Portrait or candid · warm environment · genuine moment',
      imagePrompt: `Community spotlight at ${n}, person-focused, warm and authentic, connection-driven`,
    },
    'User Generated': {
      caption: `You made our week. 📸\n\nWe love when you share your ${n} moments. This one stopped us mid-scroll. Keep tagging us — we're always watching.\n\n${handle}`,
      shortCaption: `A customer moment at ${n} that made the team smile.`,
      captureNote: 'Repost customer photo/video with permission · add minimal branded overlay',
      imagePrompt: `User generated content repost for ${n}, authentic and relatable, community feel`,
    },
    'Before / After': {
      caption: `The transformation. 🔄\n\nLeft: before. Right: after. Some things just speak for themselves.\n\n${handle}`,
      shortCaption: `Before and after — the ${n} difference.`,
      captureNote: 'Two photos side-by-side · same angle · consistent lighting · clear contrast',
      imagePrompt: `Before and after comparison for ${n}, clear transformation, side by side layout, dramatic difference`,
    },
  }

  const c = captions[idea.type] ?? {
    caption: `${idea.hook}\n\n${n} — come see for yourself.\n\n${handle}`,
    shortCaption: idea.title,
    designTemplate: 'bold' as const,
    imagePrompt: `Instagram post for ${n} about ${idea.type}, professional photography, brand-aligned`,
  }

  const brandTag = `#${tag}`
  const defaultTags = [brandTag, '#localbusiness', '#shoplocal', '#smallbiz', '#community', `#${tag}life`]

  return {
    id: crypto.randomUUID(),
    businessId: business.id,
    status: 'draft',
    ideaType: idea.type,
    postType: idea.postType,
    contentCategory: idea.contentCategory,
    designTemplate: idea.contentCategory === 'design' ? (c.designTemplate ?? 'bold') : undefined,
    emoji: idea.emoji,
    title: idea.title,
    caption: c.caption,
    shortCaption: c.shortCaption,
    captureNote: c.captureNote,
    imagePrompt: c.imagePrompt,
    hashtags: defaultTags,
    createdAt: new Date().toISOString(),
  }
}
