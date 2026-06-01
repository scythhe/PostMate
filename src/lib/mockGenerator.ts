import type { BusinessAssets, BusinessProfile, CaptionPackage, ContentIdea } from '../types'

export const defaultBusiness: BusinessProfile = {
  businessName: 'Maison Marani',
  industry: 'Luxury Georgian restaurant',
  location: 'Tbilisi, Georgia',
  tone: 'Elegant, warm, and quietly indulgent',
  targetAudience: 'Affluent locals, visiting food lovers, wine enthusiasts, and boutique hotel guests',
  offer: 'Chef-led supra tasting menu with rare Kakheti wine pairings',
  primaryColor: '#1F352D',
  secondaryColor: '#C9A45C',
}

export const demoBusinessAssets: BusinessAssets = {
  menuItems: [
    {
      id: 'demo-menu-1',
      name: 'Adjara black truffle khachapuri',
      category: 'Signature dish',
      description: 'A refined tableside take on Georgian comfort with aged cheese, cultured butter, and black truffle.',
      price: 'GEL 42',
      isFeatured: true,
    },
    {
      id: 'demo-menu-2',
      name: 'Kakheti amber wine flight',
      category: 'Drinks',
      description: 'Three rare amber wines selected to pair with the chef-led supra tasting menu.',
      price: 'GEL 58',
      isFeatured: false,
    },
    {
      id: 'demo-menu-3',
      name: 'Pomegranate glazed duck mtsvadi',
      category: 'Main course',
      description: 'Charcoal-grilled duck with pomegranate glaze, walnut herbs, and seasonal greens.',
      price: 'GEL 64',
      isFeatured: false,
    },
  ],
  photos: [
    {
      id: 'demo-photo-1',
      category: 'interior',
      fileName: 'demo-interior-placeholder.svg',
      previewUrl: createDemoPhoto('interior', '#1F352D', '#C9A45C'),
    },
    {
      id: 'demo-photo-2',
      category: 'food',
      fileName: 'demo-food-placeholder.svg',
      previewUrl: createDemoPhoto('food', '#4B2F22', '#E1B866'),
    },
    {
      id: 'demo-photo-3',
      category: 'drinks',
      fileName: 'demo-drinks-placeholder.svg',
      previewUrl: createDemoPhoto('drinks', '#142F2A', '#D8C08B'),
    },
    {
      id: 'demo-photo-4',
      category: 'ambience',
      fileName: 'demo-ambience-placeholder.svg',
      previewUrl: createDemoPhoto('ambience', '#211B17', '#B98B4E'),
    },
  ],
  reviews: [
    {
      id: 'demo-review-1',
      text: 'The most elegant Georgian dinner we had in Tbilisi. Every course felt personal.',
      author: 'Nino K.',
    },
    {
      id: 'demo-review-2',
      text: 'A beautiful room, confident service, and wine pairings we are still talking about.',
      author: 'Luka M.',
    },
  ],
  events: ['Friday cellar dinner with rare Kakheti wine pairings', 'Weekend supra tasting menu for two'],
}

function createDemoPhoto(label: string, primary: string, secondary: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${primary}"/><stop offset="1" stop-color="${secondary}"/></linearGradient></defs><rect width="640" height="640" fill="url(#g)"/><circle cx="500" cy="120" r="120" fill="rgba(255,255,255,0.14)"/><rect x="70" y="380" width="500" height="110" rx="28" fill="rgba(0,0,0,0.22)"/><text x="88" y="448" fill="white" font-family="Arial, sans-serif" font-size="46" font-weight="700">${label}</text><text x="90" y="498" fill="rgba(255,255,255,0.72)" font-family="Arial, sans-serif" font-size="22">PostMate demo placeholder</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export function generateContentPlan(profile: BusinessProfile, assets?: BusinessAssets): ContentIdea[] {
  const industry = profile.industry.toLowerCase()
  const tone = profile.tone.toLowerCase()
  const isRestaurant = industry.includes('restaurant') || industry.includes('cafe') || industry.includes('food')
  const isLuxury = tone.includes('luxury') || tone.includes('elegant') || tone.includes('premium') || tone.includes('indulgent')
  const voice = isLuxury ? 'polished and atmospheric' : tone.includes('playful') ? 'bright and conversational' : 'warm and practical'
  const localAngle = profile.location.split(',')[0]
  const featuredItem = assets?.menuItems.find((item) => item.isFeatured) ?? assets?.menuItems[0]
  const hasPhotoCategory = (category: string) => assets?.photos.some((photo) => photo.category === category)
  const interiorPhoto = hasPhotoCategory('interior') || hasPhotoCategory('ambience')
  const drinksPhoto = hasPhotoCategory('drinks')
  const review = assets?.reviews[0]
  const event = assets?.events[0] ?? profile.offer
  const spotlightName = featuredItem?.name ?? (isRestaurant ? 'chef signature dish' : 'featured offer')
  const spotlightDescription = featuredItem
    ? `${featuredItem.description}${featuredItem.price ? ` Highlight the ${featuredItem.price} price point as a premium detail.` : ''}`
    : `Use the strongest ${voice} product moment to make the offer tangible.`

  return [
    {
      day: 'Monday',
      postType: 'Post',
      title: `${spotlightName} spotlight`,
      description: `Feature the menu item as the hero. ${spotlightDescription} Connect it back to ${profile.targetAudience.toLowerCase()} with a ${voice} caption.`,
      cta: featuredItem ? 'Reserve a table to try it' : 'Save this for your next visit',
    },
    {
      day: 'Tuesday',
      postType: interiorPhoto ? 'Carousel' : 'Reel',
      title: `${localAngle} atmosphere tour`,
      description: interiorPhoto
        ? `Use interior and ambience photos to show the room, lighting, textures, and table details that make ${profile.businessName} feel distinct.`
        : `Create an atmosphere post describing the space and service style until more interior photos are uploaded.`,
      cta: 'Save this for your next night out',
    },
    {
      day: 'Wednesday',
      postType: 'Post',
      title: review ? `Guest words: ${review.author || 'recent visitor'}` : 'Guest favorite moment',
      description: review
        ? `Turn this review into a trust-building post: "${review.text}" Pair it with a refined brand response and a soft booking CTA.`
        : `Create a review-style post using a likely guest reaction for ${profile.industry.toLowerCase()}, then ask for testimonials after service.`,
      cta: 'Read what guests are saying',
    },
    {
      day: 'Thursday',
      postType: 'Story',
      title: drinksPhoto ? 'Cocktail and wine pairing story' : `${localAngle} story prompt`,
      description: drinksPhoto
        ? `Use drinks photos for a story sequence: first pour, pairing note, and a question sticker about the ideal table companion.`
        : `Use a poll or question sticker around where to spend an elevated night out in ${localAngle}.`,
      cta: 'Vote in stories',
    },
    {
      day: 'Friday',
      postType: 'Reel',
      title: 'Weekend offer push',
      description: `Turn "${event}" into a polished weekend post with urgency, table visuals, and a clear reason to book before service fills.`,
      cta: 'Reserve for this weekend',
    },
    {
      day: 'Saturday',
      postType: 'Carousel',
      title: event === profile.offer ? 'Signature experience guide' : 'Event announcement',
      description: `Build a swipeable announcement around "${event}" with who it is for, what is included, and why it fits ${profile.businessName}.`,
      cta: event === profile.offer ? 'Send this to your dinner plans' : 'Claim your spot',
    },
    {
      day: 'Sunday',
      postType: 'Post',
      title: 'Next week story idea',
      description: `Close the week with a light story-style prompt: ask followers which ${featuredItem?.category.toLowerCase() ?? 'experience'} they want to see next, then tease ${profile.offer.toLowerCase()}.`,
      cta: 'Follow for next week',
    },
  ]
}

export function generateCaptionPackage(profile: BusinessProfile, idea: ContentIdea): CaptionPackage {
  const location = profile.location.split(',')[0]
  const industry = profile.industry.toLowerCase()
  const tone = profile.tone.toLowerCase()
  const isRestaurant = industry.includes('restaurant') || industry.includes('cafe') || industry.includes('food')
  const isElegant = tone.includes('elegant') || tone.includes('luxury') || tone.includes('premium') || tone.includes('indulgent')
  const sensoryDetail = isRestaurant ? 'the first pour, the plated details, and the quiet glow of the room' : 'the details, the people, and the finished experience'
  const toneLine = isElegant ? 'quietly refined, warm, and intentional' : tone.includes('playful') ? 'light, lively, and easy to share' : 'clear, welcoming, and useful'
  const localTag = location.toLowerCase().replace(/[^a-z0-9]+/g, '')
  const industryTag = profile.industry
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 2)
    .join('')

  return {
    caption: `${idea.title} at ${profile.businessName}. For ${profile.targetAudience.toLowerCase()}, this ${idea.postType.toLowerCase()} should feel ${toneLine}: ${idea.description} ${profile.offer} is the reason to visit, but ${sensoryDetail} are what make it memorable in ${location}.`,
    shortCaption: `${profile.businessName} in ${location}: ${idea.title}. ${profile.offer}.`,
    hashtags: [`#${localTag}`, `#${industryTag}`, '#instagramcontent', '#localbusiness', '#visitlocal', '#contentplan'],
    storyText: `${idea.day} idea: ${idea.title}. ${profile.offer}. Tap through and tell us who you would bring.`,
    cta: idea.cta,
  }
}
