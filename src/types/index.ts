import type { LucideIcon } from 'lucide-react'

// === AUTH ===
export type Plan = 'trial' | 'pro'

export type User = {
  id: string
  name: string
  email: string
  plan: Plan
  trialEndsAt: string  // ISO date
}

// === BUSINESS ===
export type Deal = {
  id: string
  title: string
  description: string
  validUntil: string
}

export type BusinessEvent = {
  id: string
  title: string
  description: string
  date: string
}

export type Business = {
  id: string
  userId: string
  name: string
  description: string
  instagramHandle: string
  websiteUrl: string
  primaryColor: string
  secondaryColor: string
  deals: Deal[]
  events: BusinessEvent[]
}

// === GENERATION ===
export type PostType = 'Post' | 'Reel' | 'Story' | 'Carousel'

// 'design' = digital graphic, no camera needed → can show a preview
// 'capture' = needs real photo/video → shows a 1-line shoot note
export type ContentCategory = 'design' | 'capture'

export type DesignTemplate = 'bold' | 'light' | 'vivid'

export type GeneratedPost = {
  id: string
  day: string
  postType: PostType
  contentCategory: ContentCategory
  designTemplate?: DesignTemplate
  emoji?: string
  title: string
  caption: string
  shortCaption: string
  captureNote?: string  // 1-line brief for photo/video posts only
  hashtags: string[]
  // legacy fields kept for old sessions in localStorage
  idea?: string
  storyIdea?: string
  footageManual?: string
}

export type GenerationSession = {
  id: string
  businessId: string
  generatedAt: string
  monthKey: string
  preferences: string
  posts: GeneratedPost[]
}

export type ScrapedInfo = {
  businessName: string
  description: string
  instagramHandle: string
}

// === LEGACY (kept for old components still in repo) ===
export type InputProfile = {
  websiteUrl: string
  instagramHandle: string
  recentCaptions: string
  primaryColor: string
  secondaryColor: string
}


export type BusinessProfile = {
  businessName: string
  industry: string
  location: string
  tone: string
  targetAudience: string
  offer: string
  primaryColor: string
  secondaryColor: string
}

export type ContentIdea = {
  day: string
  postType: string
  title: string
  description: string
  cta: string
}

export type CaptionPackage = {
  caption: string
  shortCaption: string
  hashtags: string[]
  storyText: string
  cta: string
}

export type SavedPost = {
  id: string
  idea: ContentIdea
  captionPackage: CaptionPackage
  createdAt: string
}

export type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

export type AuthUser = {
  name: string
  email: string
  password: string
}

export type PostMateUserData = {
  businessProfile: BusinessProfile | null
  businessAssets: BusinessAssets | null
  savedPosts: SavedPost[]
}

export type PhotoCategory = 'interior' | 'food' | 'drinks' | 'exterior' | 'ambience' | 'team'

export type MenuItem = {
  id: string
  name: string
  category: string
  description: string
  price: string
  isFeatured: boolean
}

export type BusinessPhoto = {
  id: string
  category: PhotoCategory
  fileName: string
  previewUrl: string
}

export type CustomerReview = {
  id: string
  text: string
  author: string
}

export type BusinessAssets = {
  menuItems: MenuItem[]
  photos: BusinessPhoto[]
  reviews: CustomerReview[]
  events: string[]
}

export type Step = {
  label: string
  title: string
  description: string
}
