# YouthAtlas Platform — Claude Code Context

## What This Is

User-facing Next.js app for browsing youth opportunities (scholarships, fellowships, internships, grants, etc.). Part of a 3-system architecture:

1. **This repo** — website users see
2. **youthatlas-scrapers** — automated ingestion pipeline (separate repo)
3. **Distribution** — Telegram bot + email (lives in scrapers repo)

## Project Status

### All Phases Complete (as of April 7, 2026)
- Phase 0: Database & Infrastructure
- Phase 1: Scraper Pipeline (5 scrapers, Gemini extraction)
- Phase 2: Web Platform (services, pages, auth, search, SEO)
- Phase 3: Distribution (Telegram, email digest, Kit)
- Phase 4: Launch Prep (security, rate limiting, legal pages)
- Phase 5: Post-Launch Features (pgvector search, deadline reminders, OG images, featured listings, admin dashboard, GA4, Sentry)
- Phase 6: Google Ad Grants Compliance (contact page, news page, EIN/nonprofit content, nav updates)
- Phase 7: Personalization, PWA & Push Notifications (personalized digest, WhatsApp share, PWA manifest, service worker, Web Push end-to-end)

## Tech Stack

- Next.js 14.2.35 (App Router) / TypeScript (strict) / Tailwind CSS
- Supabase (Postgres + Auth + pgvector)
- Kit (ConvertKit) — email newsletter (API v3 broadcasts, API v4 subscribers)
- Resend — transactional email (deadline reminders)
- OpenAI — embeddings only (`text-embedding-3-small`, 1536 dims)
- Deployed on Vercel Pro

## Distribution Channels

- **Telegram:** Public channel [@youthatlas1](https://t.me/youthatlas1) — daily opportunity posts
- **Email:** Weekly digest via Kit/ConvertKit — every Monday 8AM UTC
- **Web:** https://youthatlas.com (Vercel)

## GitHub Actions Workflows (scrapers repo)

| Workflow | Schedule | Purpose |
|----------|----------|---------|
| `ingest.yml` | Daily at 4AM UTC | Scrape + store opportunities (parallel matrix) |
| `distribute-telegram.yml` | After ingest | Post new opportunities to Telegram |
| `weekly-digest.yml` | Monday 8AM UTC | Send Kit broadcast email |
| `deadline-reminders.yml` | Daily 10AM UTC | Email users with upcoming deadlines |
| `personalized-digest.yml` | Monday 8AM UTC | Personalized email per user based on preferences |
| `push-notifications.yml` | After Daily Ingest | Web Push to all `push_subscriptions` subscribers |
| `type-check.yml` | On push/PR | TypeScript validation |

## Design System

- **Fonts:** Outfit (display/headings, `font-display`) + Inter (body, `font-body`) — loaded via `next/font/google`
- **Background:** Warm off-white `#FFFBF5`
- **Color tokens:** Semantic CSS custom properties in `globals.css` — `background`, `surface`, `text-primary`, `text-secondary`, `border`, `primary`, `primary-dark`, `accent-warm`, `accent-purple`
- **Type badges:** scholarship→blue, fellowship→violet, grant→emerald, internship→amber, conference→teal, competition→rose, training→indigo

## Architecture Rules — FOLLOW THESE ALWAYS

1. **Components never import Supabase directly.** All DB calls go through `src/services/`.
2. **Every async service function returns `Result<T>`** (see `src/types/opportunity.ts`). Never throw.
3. **No stringly-typed values.** Use the const arrays and union types in `src/types/opportunity.ts`.
4. **Named exports only** (except `page.tsx` and `layout.tsx` which Next.js requires as default).
5. **Env vars are validated via Zod** in `src/config/env.ts`. Never use raw `process.env`.
6. **One concern per file.** If a file does 2+ things, split it.
7. **Next.js page.tsx can only export specific fields** (default, metadata, dynamic, generateMetadata, generateStaticParams). Shared data must live in `src/data/` files.

## Gotchas — READ BEFORE CODING

- **`force-dynamic` on all pages.** Every `page.tsx` must export `export const dynamic = 'force-dynamic'` — Supabase queries use cookies/headers which break static generation.
- **Never `select('*')` on opportunities table.** The `embedding` column is 6KB/row and `fts` is not selectable via PostgREST (42703 error). Always use explicit column lists.
- **Telegram env var:** `TELEGRAM_CHANNEL_ID` (admin) ≠ `TELEGRAM_PUBLIC_CHANNEL_ID` (public). Using the wrong one silently fails.
- **Kit API versions:** Use v3 (`api.convertkit.com/v3`) for broadcasts. Use v4 (`api.kit.com/v4`) for subscriber listing.
- **Kit broadcast = draft.** `POST /v3/broadcasts` creates a draft only — must publish in Kit dashboard.
- **`pnpm build` hangs locally.** Never run it. Use `force-dynamic` on all data pages.
- **`vercel.json` does not support `rateLimit`.** Rate limiting is handled by Next.js middleware.
- **featured_listings insert:** Do NOT chain `.select().single()` — causes RLS violation.
- **Extraction model:** Google Gemini 2.5 Flash (NOT OpenAI, NOT Claude). OpenAI is embeddings only.
- **'job' type removed.** Do not re-add anywhere. Scrapers auto-map job → internship.
- **Service worker lives in `public/sw.js`** — plain JavaScript, NOT TypeScript. Must be at root of public dir.
- **VAPID key env var:** `NEXT_PUBLIC_VAPID_PUBLIC_KEY` in Vercel. Never regenerate VAPID keys — existing browser subscriptions break.
- **Push opt-in:** `push-dismissed` localStorage key prevents re-showing banner after dismiss.

## No-Touch Files (never modify without explicit instruction)

- `src/lib/supabase/middleware.ts`
- `src/config/env.ts`
- `src/types/database.generated.ts` (when it exists)

## Key Files

### Platform (this repo)
- `src/types/opportunity.ts` — `Opportunity` interface + all enum types (shared with scrapers repo)
- `src/services/opportunity-service.ts` — all Supabase queries
- `src/services/search-service.ts` — search/filter logic
- `src/config/constants.ts` — pagination, site-wide constants
- `src/config/site.ts` — site metadata + nav links (Browse, Resources, Contact, About, News)
- `src/app/globals.css` — CSS custom property definitions (light + dark tokens)
- `tailwind.config.ts` — semantic color + font family extensions
- `src/app/page.tsx` — homepage
- `src/app/opportunities/[slug]/page.tsx` — opportunity detail page
- `src/app/about/page.tsx` — About page (mission, impact stats, nonprofit info)
- `src/app/contact/page.tsx` — Contact page (inquiries, error reports, nonprofit info)
- `src/app/news/page.tsx` — News index page
- `src/app/news/[slug]/page.tsx` — News detail page
- `src/data/news-posts.ts` — Hardcoded news post data (shared between news pages)
- `src/data/resources.ts` — Resource categories data
- `src/app/api/subscribe/route.ts` — newsletter signup endpoint
- `src/app/api/reminders/unsubscribe/route.ts` — deadline reminder unsubscribe
- `src/app/api/push/vapid/route.ts` — GET VAPID public key
- `src/app/api/push/subscribe/route.ts` — POST/DELETE push subscription management
- `public/manifest.json` — PWA manifest (name, icons, display: standalone)
- `public/sw.js` — service worker (cache strategy + push/notificationclick handlers)
- `src/components/features/sw-register.tsx` — registers service worker in production
- `src/components/features/push-opt-in.tsx` — floating opt-in banner, permission flow
- `src/components/features/whatsapp-share-button.tsx` — WhatsApp share via wa.me URL
- `src/components/layouts/header.tsx` — sticky header with mobile nav
- `src/components/layouts/footer.tsx` — footer with Browse, About, Work With Us, Support, Newsletter + EIN line

### Scrapers repo (../youthatlas-scrapers)
- `src/distribution/telegram-distributor.ts` — post new opportunities to Telegram (JS-side dedup, explicit columns)
- `src/distribution/run-email-digest.ts` — CLI entry for weekly digest (explicit columns)
- `src/distribution/kit-client.ts` — Kit API
- `.github/workflows/ingest.yml` — daily scrape + ingest pipeline (parallel matrix)
- `.github/workflows/distribute-telegram.yml` — triggered after ingest
- `.github/workflows/weekly-digest.yml` — Monday 8AM UTC
- `.github/workflows/deadline-reminders.yml` — daily 10AM UTC

## Import Order Convention

1. react / next
2. External libraries
3. `@/` aliases
4. Relative imports

(Blank line between each group)

## File Naming

- Components: kebab-case (`opportunity-card.tsx`)
- Services/config/types: kebab-case (`opportunity-service.ts`)
- Data files: kebab-case in `src/data/` (`news-posts.ts`, `resources.ts`)

## Key Types

The `Opportunity` interface and all enum types live in `src/types/opportunity.ts`. This is the source of truth shared with the scrapers repo. If you change types here, they must be mirrored there.
