# youthatlas-platform

The web front-end for **YouthAtlas** — an AI-powered platform that aggregates scholarships, fellowships, internships, grants, conferences, and other opportunities for young people globally.

🌐 **Live:** [youthatlas.com](https://youthatlas.com) &nbsp;|&nbsp; 📬 **Newsletter:** Weekly digest every Monday &nbsp;|&nbsp; 💬 **Telegram:** [@youthatlas1](https://t.me/youthatlas1)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fperezfe1%2Fyouthatlas-platform)

> YouthAtlas is a project of [Prospera Development Foundation](https://youthatlas.com/about), a registered 501(c)(3) nonprofit · EIN: 92-3630661

---

## Features

- **Browse & search** — filter by type, region, funding status, and deadline; full-text + semantic (pgvector) search
- **Personalized recommendations** — matched to user's citizenship, age, regions, and opportunity types
- **Deadline reminders** — email 3 days before a saved opportunity closes
- **Weekly digest** — personalized email every Monday with fresh matches
- **Web Push notifications** — opt-in browser push after each daily scrape
- **Featured listings** — sponsored placements for organizations
- **PWA** — installable, offline-capable, service worker caching
- **SEO pages** — `/scholarships`, `/fellowships`, `/internships`, and type×region combinations
- **Admin dashboard** — pipeline health, scrape stats, featured listing management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 3 |
| Database / Auth | Supabase (Postgres + Auth + pgvector) |
| Transactional email | Resend |
| Newsletter | Kit (ConvertKit) |
| Embeddings | OpenAI `text-embedding-3-small` |
| Error monitoring | Sentry |
| Analytics | Google Analytics 4 |
| Deployment | Vercel Pro |

---

## Project Structure

```
src/
├── app/               # Next.js App Router pages & layouts
│   ├── api/           # API routes (subscribe, push, recommendations, reminders)
│   ├── dashboard/     # Authenticated user dashboard
│   ├── opportunities/ # Browse + detail pages
│   └── [typeSlug]/    # SEO landing pages (/scholarships, /fellowships, etc.)
├── components/
│   ├── ui/            # Primitive UI components (no business logic)
│   ├── features/      # Feature compositions with business logic
│   └── layouts/       # Header, footer, shell wrappers
├── services/          # All Supabase calls (never imported directly in components)
├── lib/               # Supabase clients, validation schemas, rate limiter
├── hooks/             # Custom React hooks
├── types/             # Shared TypeScript types (mirrored with scrapers repo)
├── data/              # Static data (countries, news posts, resources)
└── config/            # Env validation (Zod), site config, constants, SEO maps
```

---

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment variables and fill in your values
cp .env.example .env.local

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Required environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server only) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Web Push VAPID public key |
| `RESEND_API_KEY` | Transactional email (deadline reminders) |
| `KIT_API_SECRET` | Kit/ConvertKit newsletter |
| `OPENAI_API_KEY` | Semantic search embeddings |
| `ADMIN_EMAIL` | Admin dashboard login |
| `ADMIN_PASSWORD` | Admin dashboard login (min 16 chars) |
| `TELEGRAM_BOT_TOKEN` | Admin notifications |
| `TELEGRAM_CHANNEL_ID` | Admin monitoring channel |

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |
| `pnpm start` | Start production server |

> ⚠️ `pnpm build` hangs locally due to Supabase client initialization. Use `pnpm type-check` to verify types instead.

---

## Architecture Notes

- **Services layer** — components never import Supabase directly; all DB calls go through `src/services/`
- **Result\<T\> pattern** — every async service function returns `{ data, error }`, never throws
- **ISR caching** — public pages use `revalidate` (30 min to 24 hr); only auth-gated pages use `force-dynamic`
- **Semantic search** — three-tier: pgvector cosine similarity → full-text search → ilike fallback
- **Bot blocking** — aggressive crawlers blocked at middleware before any serverless invocation
- **Rate limiting** — 30 req/min per IP on all `/api/*` routes via in-memory sliding window

---

## Related

- **Scraper pipeline:** [youthatlas-scrapers](https://github.com/perezfe1/youthatlas-scrapers) — daily ingestion, Telegram distribution, email digests, push notifications

---

Thanks to [Vercel](https://vercel.com) for their support of open-source software.
