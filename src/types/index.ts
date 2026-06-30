export type Plan = 'trial' | 'pro'
export type Tone = 'professional' | 'casual' | 'playful' | 'inspiring' | 'educational'
export type PostStatus = 'draft' | 'approved'
export type PostType = 'Post' | 'Reel' | 'Story' | 'Carousel'
export type ContentCategory = 'design' | 'capture'
export type DesignTemplate = 'bold' | 'light' | 'vivid'

export type User = {
  id: string
  name: string
  email: string
  plan: Plan
  trialEndsAt: string
}

export type Deal = { id: string; title: string; description: string; validUntil: string }
export type BusinessEvent = { id: string; title: string; description: string; date: string }

export type Business = {
  id: string
  userId: string
  name: string
  description: string
  instagramHandle: string
  websiteUrl: string
  primaryColor: string
  secondaryColor: string
  industry: string
  targetAudience: string
  tone: Tone
  products: string
  location: string
  brandHashtags: string
  deals: Deal[]
  events: BusinessEvent[]
}

export type ContentIdea = {
  id: string
  type: string
  title: string
  hook: string
  postType: PostType
  contentCategory: ContentCategory
  emoji: string
}

export type Post = {
  id: string
  businessId: string
  status: PostStatus
  ideaType: string
  postType: PostType
  contentCategory: ContentCategory
  designTemplate?: DesignTemplate
  emoji: string
  title: string
  caption: string
  shortCaption: string
  captureNote?: string
  imagePrompt?: string
  hashtags: string[]
  scheduledDate?: string
  createdAt: string
}

export type ScrapedInfo = {
  businessName: string
  description: string
  instagramHandle: string
  industry?: string
  location?: string
}

// Legacy aliases kept for any remaining references
export type GeneratedPost = Post
export type GenerationSession = {
  id: string
  businessId: string
  generatedAt: string
  monthKey: string
  preferences: string
  posts: Post[]
}
export type InputProfile = { websiteUrl: string; instagramHandle: string; recentCaptions: string; primaryColor: string; secondaryColor: string }
