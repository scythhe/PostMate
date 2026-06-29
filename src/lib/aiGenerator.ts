import type { GeneratedContent, GeneratedDay, QuickProfile } from '../types'

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined

export async function generateContent(profile: QuickProfile): Promise<GeneratedContent> {
  if (N8N_WEBHOOK_URL) {
    try {
      return await callN8nWebhook(profile)
    } catch (error) {
      console.warn('n8n webhook failed, using local generation:', error)
    }
  }
  return generateLocalContent(profile)
}

async function callN8nWebhook(profile: QuickProfile): Promise<GeneratedContent> {
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
    days: Array.isArray(data.days) ? data.days : [],
    tone: data.tone ?? 'Professional',
    offer: data.offer ?? profile.description,
    targetAudience: data.targetAudience ?? 'Local customers',
    isAiGenerated: true,
  }
}

export function generateLocalContent(profile: QuickProfile): GeneratedContent {
  const name = profile.businessName
  const loc = profile.location.split(',')[0] || profile.location
  const locTag = loc.toLowerCase().replace(/[^a-z0-9]/g, '')
  const desc = profile.description
  const shortDesc = desc.length > 100 ? `${desc.slice(0, 97)}...` : desc

  const days: GeneratedDay[] = [
    {
      day: 'Monday',
      postType: 'Post',
      title: 'Why locals choose us',
      description: `Feature what makes ${name} the go-to choice in ${loc}. Lead with the most compelling aspect of the offer.`,
      cta: 'Visit us this week',
      caption: `Starting the week strong at ${name}. 🌿 ${shortDesc} Come find us in ${loc} and experience the difference for yourself.`,
      shortCaption: `${name} in ${loc} — your week starts here.`,
      hashtags: [`#${locTag}`, '#localbusiness', '#supportlocal', '#community', '#smallbusiness', '#shoplocal'],
      storyText: `New week, fresh energy. Come visit ${name} today 👋`,
    },
    {
      day: 'Tuesday',
      postType: 'Carousel',
      title: 'Behind the scenes',
      description: `Show the craft, the people, and the care that goes into what ${name} delivers every day.`,
      cta: 'Swipe to see how we do it',
      caption: `Behind the scenes at ${name} 👀 We believe the process is just as beautiful as the result. Swipe through to see the details that make us different in ${loc}.`,
      shortCaption: `The making of ${name} — behind the scenes.`,
      hashtags: [`#${locTag}`, '#behindthescenes', '#process', '#craftsmanship', '#local', '#authentic'],
      storyText: `See how we do it at ${name} — tap through 👀`,
    },
    {
      day: 'Wednesday',
      postType: 'Post',
      title: 'A word from our guests',
      description: `Turn a real customer experience into a trust post. Highlight what guests consistently say about ${name}.`,
      cta: 'Share your experience',
      caption: `The best thing about ${name}? You. 💚 Hearing from our guests in ${loc} is what keeps us going every day. Drop a comment and tell us your experience — we read every one.`,
      shortCaption: `You're the reason we do this. Thank you, ${loc}. — ${name}`,
      hashtags: [`#${locTag}community`, '#customerreview', '#grateful', '#localbusiness', '#realpeople', '#supportlocal'],
      storyText: `Your feedback means everything at ${name} 💚`,
    },
    {
      day: 'Thursday',
      postType: 'Reel',
      title: '15-second tour',
      description: `A quick visual walkthrough that gives potential visitors a feel for ${name} — the space, the product, the energy.`,
      cta: 'Come see it in person',
      caption: `15 seconds of ${name}. 🎥 Everything you see is real and waiting for you in ${loc}. Hit follow so you never miss what we're up to next.`,
      shortCaption: `A quick look at ${name} in ${loc}.`,
      hashtags: [`#${locTag}`, '#reel', '#insidelook', '#visit', '#local', '#reelsofinstagram'],
      storyText: `Watch our latest and come visit ${name} 🎥`,
    },
    {
      day: 'Friday',
      postType: 'Post',
      title: 'Friday offer or invite',
      description: `Welcome the weekend with something worth sharing — a special, an invite, or a reason to visit ${name}.`,
      cta: 'See you this weekend',
      caption: `Friday is here. 🎉 If you've been meaning to visit ${name}, this is your sign. We're here in ${loc} and ready for your weekend. Come say hello.`,
      shortCaption: `Weekend ready at ${name}, ${loc}. 🎉`,
      hashtags: [`#${locTag}`, '#fridayfeeling', '#weekend', '#localbusiness', '#treat', '#weekendplans'],
      storyText: `Happy Friday from ${name}! See you this weekend 🎉`,
    },
    {
      day: 'Saturday',
      postType: 'Carousel',
      title: 'Week in highlights',
      description: `Round up the best moments, products, or interactions from the week in a swipeable carousel.`,
      cta: 'Which was your favorite?',
      caption: `Our week in pictures. 📸 ${name} had another great one in ${loc} — swipe through our top moments and tell us which one stood out to you.`,
      shortCaption: `This week at ${name} — our top moments. 📸`,
      hashtags: [`#${locTag}`, '#weeklyrecap', '#highlights', '#saturday', '#localbusiness', '#community'],
      storyText: `Our week in highlights — swipe through at ${name} 📸`,
    },
    {
      day: 'Sunday',
      postType: 'Story',
      title: 'Community close',
      description: `End the week with a warm post that thanks the community and teases something for next week.`,
      cta: 'Follow for next week',
      caption: `Sunday at ${name}. 💛 A moment to thank every person who chose us this week in ${loc}. You're the reason we show up. Follow along — next week is going to be good.`,
      shortCaption: `Thank you, ${loc}. See you next week. — ${name} 💛`,
      hashtags: [`#${locTag}`, '#sundayvibes', '#community', '#grateful', '#local', '#seeyounextweek'],
      storyText: `Thank you for an amazing week, ${loc}! 💛 See you Monday.`,
    },
  ]

  return {
    days,
    tone: 'Warm and professional',
    offer: shortDesc,
    targetAudience: `Locals in ${loc}`,
    isAiGenerated: false,
  }
}
