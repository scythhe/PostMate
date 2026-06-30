# PostMate — AI Instagram Content Generator for Local Businesses

**Live site:** https://scythhe.github.io/PostMate/

PostMate helps local businesses create Instagram content in minutes. Paste your website URL, get 20 AI-generated content ideas tailored to your brand, pick one, and receive a full ready-to-post caption, hashtags, image prompt, and graphic preview — in your brand colors.

---

## The Problem

Local businesses know they should post on Instagram consistently, but writing captions, coming up with ideas, and maintaining a content calendar takes hours every week — time they don't have.

## The Solution

PostMate automates the entire Instagram content pipeline:

1. **Import your brand** — paste your website URL, AI reads it and fills your entire business profile automatically (name, industry, audience, tone, products, hashtags)
2. **Get 20 ideas** — AI generates tailored content ideas specific to your business
3. **Generate a post** — pick an idea, get a full caption, hashtags, image prompt, and branded graphic preview
4. **Approve & schedule** — set a publish date; it appears on your content calendar

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS v4 |
| Backend / Auth | Supabase (PostgreSQL + Row-Level Security) |
| AI Workflows | n8n (Docker) + OpenAI GPT-4.1-nano |
| Deployment | GitHub Pages via GitHub Actions |

---

## AI Agent / Workflow

Built with **n8n** (self-hosted via Docker). Single webhook endpoint `/webhook/generate` handles two modes via a Switch node:

```
POST /webhook/generate
        │
        ├─ mode: "ideas"
        │       └─ OpenAI GPT-4.1-nano
        │               └─ Returns 20 content ideas (type, title, hook, postType, emoji)
        │
        └─ mode: "post"
                └─ OpenAI GPT-4.1-nano
                        └─ Returns full post (caption, hashtags, imagePrompt, designTemplate)

POST /webhook/scrape
        └─ HTTP Request → fetch website HTML
                └─ OpenAI GPT-4.1-nano → extract full brand profile
```

**Input → Process → Output:**
- **Input:** business profile (name, industry, audience, tone, products, deals, events)
- **Process:** GPT-4.1-nano generates structured JSON via n8n
- **Output:** 20 ideas or 1 complete post ready for Instagram

All AI features fall back to local generation if n8n is unavailable — the app always works.

---

## Features

- Website scraper — AI reads your site and fills the entire brand profile
- 20 AI content ideas per session, saved locally for instant return visits
- Full post generation: caption, short caption, hashtags, image prompt
- Graphic preview with brand colors (Bold / Light / Vivid design templates)
- Shoot notes for photo/video content
- Content calendar with month navigation
- Draft management — re-open and approve saved drafts
- Deals & Events manager (fed into AI content generation)
- Supabase auth + localStorage fallback

---

## Running Locally

```bash
npm install
npm run dev
```

### Environment variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_N8N_SCRAPE_URL=http://localhost:5678/webhook/scrape
VITE_N8N_GENERATE_URL=http://localhost:5678/webhook/generate
```

---

## Project Structure

```
src/
  components/
    LandingPage.tsx     # Marketing page with pricing
    Auth.tsx            # Sign up / sign in
    Onboarding.tsx      # 3-step brand setup with website scraper
    IdeasBoard.tsx      # 20 AI content ideas grid
    PostEditor.tsx      # Post generation, preview, approve
    Dashboard.tsx       # Calendar, drafts, promotions
    PostPreview.tsx     # Branded graphic preview component
  lib/
    aiGenerator.ts      # n8n integration + local fallbacks
    storage.ts          # Supabase + localStorage data layer
    supabase.ts         # Supabase client
  types/index.ts
```

---

## User Flow

```
Landing → Sign up → Onboarding (paste URL → AI fills profile)
        ↓
Dashboard (calendar, drafts, deals & events)
        ↓
Get ideas → 20 AI content ideas
        ↓
Pick idea → Full post generated (caption + graphic preview)
        ↓
Approve + set date → Post appears on calendar
```

---

*BTU Final Project — Nikoloz Berdznishvili, June 2026*
