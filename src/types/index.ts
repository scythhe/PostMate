import type { LucideIcon } from 'lucide-react'

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

export type GeneratedDay = {
  day: string
  postType: string
  title: string
  description: string
  cta: string
  caption: string
  shortCaption: string
  hashtags: string[]
  storyText: string
}

export type GeneratedContent = {
  days: GeneratedDay[]
  businessName: string
  tone: string
  offer: string
  targetAudience: string
  isAiGenerated: boolean
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

// Legacy types kept for old components still in the repo
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
