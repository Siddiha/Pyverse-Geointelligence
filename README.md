# Pyverse GeoIntelligence

**Real-time global news • AI-powered analysis • Interactive 3D globe**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-0.158-orange?style=flat-square)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## Overview

Pyverse GeoIntelligence is a full-stack news recommendation and geopolitical intelligence platform. It features an interactive 3D globe where you can click any country to load live news for that region, an AI chat assistant for geopolitical analysis, and a voice assistant for hands-free queries.

---

## Features

- **Interactive 3D Globe** — Drag, zoom, and click countries to load region-specific news
- **Live News Feed** — Fetches real articles from NewsAPI or The Guardian API with automatic fallback to mock data
- **Category Filters** — Filter news by General, Technology, Business, Science, Health, Sports, Entertainment
- **Breaking / Trending filters** — Quickly surface the most important stories
- **AI Chat Assistant** — Powered by Cohere (`command-r`) with OpenAI fallback for geopolitical briefings
- **Voice Assistant** — Browser-native speech recognition + text-to-speech, queries the AI chat API
- **Dark professional UI** — Framer Motion animations, responsive layout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| 3D Rendering | Three.js + React Three Fiber |
| Styling | Tailwind CSS + Framer Motion |
| AI | Cohere API (`command-r`) / OpenAI GPT-3.5 |
| News | NewsAPI.org / The Guardian API |
| Deployment | Vercel / any Node.js host |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Main page layout
│   ├── layout.tsx                # Root layout
│   ├── globals.css
│   └── api/
│       ├── ai/chat/route.ts      # AI chat endpoint (POST)
│       └── news/route.ts         # News fetch endpoint (GET)
├── components/
│   ├── globe-3d.tsx              # Three.js interactive globe
│   ├── news-panel.tsx            # News sidebar with filters
│   ├── ai-chat.tsx               # AI chat modal
│   └── voice-assistant.tsx       # Voice input/output modal
├── hooks/
│   ├── use-news.ts               # Fetches /api/news
│   ├── use-ai-chat.ts            # Fetches /api/ai/chat
│   └── use-globe.ts              # Globe state management
├── lib/
│   ├── news-api.ts               # NewsAPI + Guardian API + mock fallback
│   ├── ai-clients.ts             # AI API helpers
│   └── utils.ts
└── types/
    ├── news.ts
    ├── ai.ts
    └── globe.ts
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

```env
# Required for AI chat
COHERE_API_KEY=your_cohere_key_here

# Optional — enables real news (falls back to mock data without these)
NEWS_API_KEY=your_newsapi_key_here
GUARDIAN_API_KEY=your_guardian_key_here

# Optional fallback AI
OPENAI_API_KEY=your_openai_key_here
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Keys

| Service | Free tier | Where to get |
|---|---|---|
| **NewsAPI** | 100 req/day (dev) | [newsapi.org](https://newsapi.org/) |
| **The Guardian** | Unlimited (open) | [open-platform.theguardian.com](https://open-platform.theguardian.com/) |
| **Cohere** | 100 req/day | [dashboard.cohere.ai](https://dashboard.cohere.ai/) |
| **OpenAI** | Pay-per-use | [platform.openai.com](https://platform.openai.com/api-keys) |

> The app works fully in demo mode without any API keys — mock data is shown as fallback.

---

## API Endpoints

### `GET /api/news`

Fetch news articles, optionally filtered by country and category.

| Query param | Example | Description |
|---|---|---|
| `country` | `Japan` | Full country name |
| `category` | `Technology` | One of: General, Technology, Business, Science, Health, Sports, Entertainment |

```
GET /api/news?country=Japan&category=Technology
```

**Response:**
```json
{
  "success": true,
  "data": [ { "id": "...", "title": "...", "summary": "...", ... } ],
  "count": 20
}
```

---

### `POST /api/ai/chat`

Send a message to the AI intelligence assistant.

**Body:**
```json
{
  "message": "What's the current situation in the Middle East?",
  "country": "Israel",
  "context": "Optional additional context"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "...",
    "usingFallback": false,
    "timestamp": "2026-03-20T12:00:00.000Z"
  }
}
```

---

## Usage

### Globe
- **Drag** to rotate
- **Scroll** to zoom
- **Click a country** to load its news in the right panel

### News Panel
- Use the **All / Breaking / Trending** tabs to filter by urgency
- Use the **category buttons** (Technology, Business, etc.) to filter by topic
- Click the **refresh button** to reload news
- Click any article card to open the full article in a new tab

### AI Chat
- Click the **chat icon** in the header
- Type a question or pick a quick query
- Press **Enter** or the send button

### Voice Assistant
- Click the **microphone icon** in the header
- Press **Start Recording** and speak
- The assistant transcribes your speech, queries the AI, and reads the response aloud

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## License

See [docs/LICENSE.md](docs/LICENSE.md).
