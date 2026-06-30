# PostMate

AI-powered Instagram content planner for local businesses.

PostMate solves a real problem: local business owners (restaurants, cafés, salons, gyms) know they need to post on Instagram consistently but don't have the time, budget, or copywriting skill to do it. PostMate turns your business info into a complete 7-day content plan — with captions, story ideas, hashtags, and a detailed footage guide — in seconds.

## Live Demo

[Add your Vercel link here after deploying]

---

## AI Agent / Workflow

PostMate uses **two n8n webhook workflows** as its AI backbone:

### Workflow 1 — Website scraper

```
User pastes website URL
        ↓
POST → n8n Webhook (VITE_N8N_SCRAPE_URL)  body: { websiteUrl }
        ↓
HTTP Request node → fetch business website (GET websiteUrl)
        ↓
Code node → strip HTML tags, extract readable text (max 3000 chars)
        ↓
OpenAI node `gpt-4.1-nano` (system prompt below) → extract structured info
        ↓
Respond to Webhook → { businessName, description, instagramHandle }
        ↓
Website shows extracted info, user reviews and edits before saving
```

**n8n OpenAI System Prompt (scraper):**
```
Extract business info from the following website text.

Return ONLY valid JSON:
{
  "businessName": "the business name",
  "description": "2-4 sentence description of what they do, who they serve, and what makes them different",
  "instagramHandle": "@handle if found, otherwise empty string"
}

Website text:
{{$json.websiteText}}
```

### Workflow 2 — Content generator

```
User clicks "Generate 7-day plan"
        ↓
POST → n8n Webhook (VITE_N8N_GENERATE_URL)
        ↓
Payload includes: businessName, description, deals, events,
                  preferences, previousTitles (last 28 posts for anti-repeat)
        ↓
OpenAI node `gpt-4.1-nano` → generate 7-day content plan as JSON
        ↓
Respond to Webhook → { posts: [...] }
        ↓
Website displays 7 post cards (no image preview)
```

Configure webhook URLs in your `.env`:

```env
VITE_N8N_SCRAPE_URL=https://your-n8n.com/webhook/postmate-scrape
VITE_N8N_GENERATE_URL=https://your-n8n.com/webhook/postmate-generate
```

If no webhooks are configured, PostMate falls back to high-quality local template generation — the app always works during demos.

### n8n OpenAI System Prompt (content generator)

```
You are PostMate, an Instagram content strategist for local businesses.

You have been given:
- businessName and description of the business
- deals: active promotions/offers
- events: upcoming events
- preferences: what the user wants this week (may be empty)
- previousTitles: last 28 post titles — DO NOT repeat any of these

Generate a 7-day Instagram content plan (Monday–Sunday). Rules:
- Vary post types: Post, Reel, Story, Carousel
- For each post decide contentCategory:
    "design" = can be created as a digital graphic (announcement, quote, deal poster, question, tip) — no camera needed
    "capture" = needs a real photo or video (product shot, behind the scenes, atmosphere, reel)
- Mix: aim for 3 design posts and 4 capture posts per week
- If deals or events exist, dedicate one post to each
- Never repeat a title from previousTitles
- Captions must feel human, punchy, brand-aware — NOT generic

Return ONLY valid JSON, no markdown:
{
  "posts": [
    {
      "day": "Monday",
      "postType": "Post|Reel|Story|Carousel",
      "contentCategory": "design|capture",
      "designTemplate": "bold|light|vivid",
      "emoji": "single emoji that represents this post",
      "title": "Short hook (max 7 words)",
      "caption": "Full Instagram caption — 2-4 sentences, 1-2 emojis, ends with handle",
      "shortCaption": "One punchy sentence",
      "captureNote": "For capture posts only: one line on what to film/photograph (format, lighting, length)",
      "hashtags": ["#six", "#relevant", "#hashtags"]
    }
  ]
}

designTemplate guide:
- "bold": dark background (brand primary color), white text — use for announcements, gratitude, strong CTA
- "light": white background, brand color accents — use for tips, community, storytelling
- "vivid": gradient (primary→secondary) — use for deals, events, FOMO, excitement

Generate exactly 7 days. Return nothing except the JSON object.
```

---

## Features

- **Optional website import** — paste URL to auto-fill business info, or enter manually
- **Editable description** — review and refine AI-extracted info before saving
- **localStorage auth** — sign up / sign in, one account per device
- **Deals & events** — add ongoing promotions and upcoming events; AI factors them into content
- **7-day content plan** — idea, caption, short caption, story idea, hashtags, and footage guide per day
- **Footage manual** — specific, actionable instructions on what to film or photograph for each post
- **Anti-repeat engine** — tracks the last 28 generated post titles; AI avoids repeating content
- **4 generations per month** — enforced per business with a visual counter
- **Copy to clipboard** — one-click copy for captions, short captions, and hashtag sets
- **Past sessions** — access every previously generated content plan from the dashboard
- **AI integration** — n8n → OpenAI; falls back gracefully to local templates if unavailable

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Auth & storage | localStorage (prototype) |
| AI Workflow | n8n + OpenAI GPT |
| Deployment | Vercel |

---

## Getting Started

```bash
# Install dependencies
npm install

# (Optional) Add your n8n webhooks — app works without them
echo "VITE_N8N_SCRAPE_URL=https://your-n8n.com/webhook/postmate-scrape" >> .env
echo "VITE_N8N_GENERATE_URL=https://your-n8n.com/webhook/postmate-generate" >> .env

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
src/
  components/
    LandingPage.tsx        # Marketing homepage
    Auth.tsx               # Sign in / sign up (localStorage)
    Onboarding.tsx         # Business setup: URL import or manual entry
    Dashboard.tsx          # Main dashboard: business info, deals, events, history
    GenerateWizard.tsx     # Pre-generation: preferences + usage counter
    GenerationResult.tsx   # 7 post cards with all content fields
    Navbar.tsx             # Brand logo component
  lib/
    aiGenerator.ts         # n8n webhook calls + local fallback generator
    storage.ts             # localStorage CRUD: users, businesses, sessions
  types/
    index.ts               # TypeScript type definitions
```

---

## User Flow

```
Landing → Sign up → Business setup (URL import or manual)
        ↓
Dashboard (business info, deals, events, generation history)
        ↓
Generate wizard (preferences, usage counter showing X/4 remaining)
        ↓
7-day content plan (ideas, captions, story ideas, footage guides, hashtags)
        ↓
Return to dashboard → view past plans anytime
```

---

## Generation Limits & Anti-Repeat

Each business can generate **4 content plans per calendar month**. The limit resets on the 1st of each month.

The last 28 post titles (4 plans × 7 posts) are stored and sent to the AI as `previousTitles`. The OpenAI prompt instructs the model to avoid repeating them, keeping content fresh across the full month.

---

## Author

Nikoloz Berdznishvili — BTU Final Project, June 2026
