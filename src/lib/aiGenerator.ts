import type { GeneratedContent, GeneratedDay, InputProfile } from '../types'

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined

export async function generateContent(profile: InputProfile): Promise<GeneratedContent> {
  if (N8N_WEBHOOK_URL) {
    try {
      return await callN8nWebhook(profile)
    } catch (error) {
      console.warn('n8n webhook failed, using local generation:', error)
    }
  }
  return generateLocalContent(profile)
}

async function callN8nWebhook(profile: InputProfile): Promise<GeneratedContent> {
  const response = await fetch(N8N_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })

  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const raw = await response.json()
  // Handle different n8n response shapes
  const data = raw?.output ?? raw?.result ?? raw?.data ?? raw

  return {
    businessName: data.businessName ?? domainFromUrl(profile.websiteUrl),
    days: Array.isArray(data.days) ? data.days : [],
    tone: data.tone ?? 'Professional',
    offer: data.offer ?? '',
    targetAudience: data.targetAudience ?? 'Local customers',
    isAiGenerated: true,
  }
}

export function generateLocalContent(profile: InputProfile): GeneratedContent {
  const name = domainFromUrl(profile.websiteUrl)
  const handle = profile.instagramHandle.replace('@', '')
  const locTag = handle || name.replace(/[^a-z0-9]/g, '')

  const days: GeneratedDay[] = [
    {
      day: 'Monday',
      postType: 'Post',
      title: 'Why locals choose us',
      description: `Open the week by highlighting what makes this business stand out. Lead with the most compelling aspect from the website.`,
      cta: 'Visit us this week',
      caption: `Starting the week strong. 🌿 If you've been meaning to check us out, this is your sign. Come experience what we're all about.`,
      shortCaption: `${name} — your week starts here.`,
      hashtags: [`#${locTag}`, '#localbusiness', '#supportlocal', '#community', '#smallbusiness', '#shoplocal'],
      storyText: `New week, fresh energy. Come visit us today 👋`,
    },
    {
      day: 'Tuesday',
      postType: 'Carousel',
      title: 'Behind the scenes',
      description: `Show the craft and care that goes into what this business delivers every day.`,
      cta: 'Swipe to see how we do it',
      caption: `Behind the scenes 👀 We believe the process is just as beautiful as the result. Swipe through to see the details that make us different.`,
      shortCaption: `The making of ${name} — behind the scenes.`,
      hashtags: [`#${locTag}`, '#behindthescenes', '#process', '#craftsmanship', '#local', '#authentic'],
      storyText: `See how we do it — tap through 👀`,
    },
    {
      day: 'Wednesday',
      postType: 'Post',
      title: 'A word from our guests',
      description: `Turn a real customer experience into a trust post. Highlight what guests consistently appreciate.`,
      cta: 'Share your experience',
      caption: `The best thing about what we do? You. 💚 Hearing from our community is what keeps us going. Drop a comment and tell us your experience — we read every one.`,
      shortCaption: `You're the reason we do this. Thank you. — ${name}`,
      hashtags: [`#${locTag}community`, '#customerreview', '#grateful', '#localbusiness', '#realpeople', '#supportlocal'],
      storyText: `Your feedback means everything 💚`,
    },
    {
      day: 'Thursday',
      postType: 'Reel',
      title: '15-second tour',
      description: `A quick visual walkthrough that gives potential visitors a feel for the space, the product, and the energy.`,
      cta: 'Come see it in person',
      caption: `15 seconds of what we do. 🎥 Everything you see is real and waiting for you. Hit follow so you never miss what we're up to next.`,
      shortCaption: `A quick look at ${name}.`,
      hashtags: [`#${locTag}`, '#reel', '#insidelook', '#visit', '#local', '#reelsofinstagram'],
      storyText: `Watch our latest and come visit 🎥`,
    },
    {
      day: 'Friday',
      postType: 'Post',
      title: 'Friday offer or invite',
      description: `Welcome the weekend with something worth sharing — a special, an invite, or a reason to visit.`,
      cta: 'See you this weekend',
      caption: `Friday is here. 🎉 If you've been waiting for a reason to visit, this is it. We're ready for your weekend. Come say hello.`,
      shortCaption: `Weekend ready at ${name}. 🎉`,
      hashtags: [`#${locTag}`, '#fridayfeeling', '#weekend', '#localbusiness', '#treat', '#weekendplans'],
      storyText: `Happy Friday! See you this weekend 🎉`,
    },
    {
      day: 'Saturday',
      postType: 'Carousel',
      title: 'Week in highlights',
      description: `Round up the best moments and products from the week in a swipeable carousel.`,
      cta: 'Which was your favorite?',
      caption: `Our week in pictures. 📸 Another great one — swipe through our top moments and tell us which stood out to you.`,
      shortCaption: `This week at ${name} — our top moments. 📸`,
      hashtags: [`#${locTag}`, '#weeklyrecap', '#highlights', '#saturday', '#localbusiness', '#community'],
      storyText: `Our week in highlights — swipe through 📸`,
    },
    {
      day: 'Sunday',
      postType: 'Story',
      title: 'Community close',
      description: `End the week with a warm post that thanks the community and teases something for next week.`,
      cta: 'Follow for next week',
      caption: `Sunday. 💛 A moment to thank every person who chose us this week. You're the reason we show up. Follow along — next week is going to be good.`,
      shortCaption: `Thank you. See you next week. — ${name} 💛`,
      hashtags: [`#${locTag}`, '#sundayvibes', '#community', '#grateful', '#local', '#seeyounextweek'],
      storyText: `Thank you for an amazing week! 💛 See you Monday.`,
    },
  ]

  return {
    businessName: name,
    days,
    tone: 'Warm and professional',
    offer: `Content generated from ${profile.websiteUrl}`,
    targetAudience: 'Local customers and followers',
    isAiGenerated: false,
  }
}

function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '').split('.')[0]
  } catch {
    return url.replace(/https?:\/\/(www\.)?/, '').split('/')[0].split('.')[0] || 'Business'
  }
}
