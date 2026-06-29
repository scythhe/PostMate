# PostMate

AI-powered Instagram content generator for local businesses.

PostMate solves a real problem: local business owners (restaurants, cafés, salons, gyms) know they need to post on Instagram but don't have time, budget, or copywriting skills to do it consistently. PostMate turns a 2-sentence business description into a full 7-day content plan with captions, hashtags, and a branded post preview — in seconds.

## Live Demo

[Add your Vercel link here after deploying]

---

## AI Agent / Workflow

PostMate uses an **n8n webhook workflow** as its AI backbone:

```
User input (business name + description)
        ↓
POST → n8n Webhook
        ↓
OpenAI GPT node (generates 7-day plan as JSON)
        ↓
Edit Fields node (formats response)
        ↓
Respond to Webhook
        ↓
Website displays generated content
```

Set the webhook URL in your `.env` file:

```
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/postmate
```

If no webhook is configured, PostMate falls back to local template-based generation so the app always works during demos.

### n8n System Prompt (OpenAI node)

> You are PostMate, an Instagram content expert for local businesses. Generate a 7-day content plan as valid JSON with fields: `days` (array of 7), `tone`, `offer`, `targetAudience`. Each day object must have: `day`, `postType`, `title`, `description`, `cta`, `caption`, `shortCaption`, `hashtags` (array of 6), `storyText`.

---

## Features

- **One-step setup** — describe your business in a textarea, click generate
- **7-day Instagram plan** — post type, title, and content direction for each day
- **Full captions** — main caption, short version, and story text for every day
- **Hashtag sets** — 6 targeted local hashtags per post
- **Branded post preview** — Instagram-style square creative using your brand colors
- **PNG export** — download a print-ready 1800×1800 post
- **Save posts** — bookmark favorite days to local history
- **Copy to clipboard** — one-click copy for any caption or hashtag set
- **AI integration** — n8n → OpenAI; falls back gracefully if unavailable

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| AI Workflow | n8n + OpenAI GPT |
| Image export | html-to-image |
| Deployment | Vercel |

---

## Getting Started

```bash
# Install dependencies
npm install

# (Optional) Add your n8n webhook — app works without it
echo "VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook/postmate" > .env

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
    LandingPage.tsx           # Marketing homepage
    QuickSetup.tsx            # Business description form
    Dashboard.tsx             # 7-day plan + captions + preview
    InstagramPostPreview.tsx  # Branded square post visual
    SavedPosts.tsx            # Post history
    Navbar.tsx                # Navigation
  lib/
    aiGenerator.ts            # n8n webhook integration + local fallback
    mockGenerator.ts          # Template-based fallback generator
  types/
    index.ts                  # TypeScript type definitions
```

---

## How the AI Agent Works

**Input** (from website form):
```json
{
  "businessName": "Maison Marani",
  "description": "A luxury Georgian restaurant offering supra tasting menus...",
  "location": "Tbilisi, Georgia",
  "primaryColor": "#1F352D",
  "secondaryColor": "#C9A45C"
}
```

**Process** (n8n workflow):
1. Webhook node receives POST from the website
2. OpenAI node generates a structured 7-day content plan
3. Edit Fields node formats and validates the JSON response
4. Respond to Webhook returns the content to the browser

**Output** (displayed in dashboard):
- 7-day plan with captions, hashtags, story text
- Branded Instagram post preview
- PNG export ready to post

---

## Author

Nikoloz Berdznishvili — BTU Final Project, June 2026
