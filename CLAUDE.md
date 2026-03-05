# YouthAtlas Platform — Claude Code Context

## What This Is

User-facing Next.js app for browsing youth opportunities (scholarships, fellowships, internships, grants, etc.). Part of a 3-system architecture:

1. **This repo** — website users see
2. **youthatlas-scrapers** — automated ingestion pipeline (separate repo)
3. **Distribution** — Telegram bot + email (lives in scrapers repo)

## Project Status

### Phase 0 — Database & Infrastructure (COMPLETE)
All 5 modules done: Supabase schema, 10 migrations (tables, indexes, full-text search, RLS, triggers), shared types, env validation.

### Phase 1 — Scraper Pipeline (COMPLETE)
All 9 modules done. 5 scrapers (YouthOp, OFY, OpDesk, AfterSchool, ScholAds) feeding 290+ opportunities into Supabase. Daily automated pipeline via GitHub Actions with Telegram health monitoring.

### Phase 2 — Web Platform (IN PROGRESS)
| Module | Status |
|--------|--------|
| 2.1 Service layer + design system | DONE |
| 2.2 Homepage + browse/list page | DONE |
| 2.3 Filters (type, region, funding) | DONE |
| 2.4 Opportunity detail page | DONE |
| 2.5 Search (debounced, URL-driven) | DONE |
| 2.6 Auth (magic link OTP) | DONE |
| 2.7 Save / bookmarks | DONE |
| 2.8 SEO + metadata | TODO |

## Tech Stack

- Next.js 14 (App Router) / TypeScript (strict) / Tailwind CSS
- Supabase (Postgres + Auth + Edge Functions)
- Deployed on Vercel

## Design System

- **Fonts:** Outfit (display/headings, `font-display`) + Inter (body, `font-body`) — loaded via `next/font/google`
- **Background:** Warm off-white `#FFFBF5` (HSL 40 100% 99%)
- **Color tokens:** Semantic CSS custom properties consumed as `hsl(var(--token))` in `tailwind.config.ts` — `background`, `surface`, `text-primary`, `text-secondary`, `border`, `primary`, `primary-dark`, `accent-warm`, `accent-purple`
- **Dark mode:** `darkMode: 'class'` ready, tokens defined in `globals.css` under `.dark`

## Architecture Rules — FOLLOW THESE ALWAYS

1. **Components never import Supabase directly.** All DB calls go through `src/services/`.
2. **Every async service function returns `Result<T>`** (see `src/types/opportunity.ts`). Never throw.
3. **No stringly-typed values.** Use the const arrays and union types in `src/types/opportunity.ts`.
4. **Named exports only** (except `page.tsx` and `layout.tsx` which Next.js requires as default).
5. **Env vars are validated via Zod** in `src/config/env.ts`. Never use raw `process.env`.
6. **One concern per file.** If a file does 2+ things, split it.

## Gotchas — READ BEFORE CODING

- **`force-dynamic` on all pages.** Every `page.tsx` must export `export const dynamic = 'force-dynamic'` — Supabase queries use cookies/headers which break static generation.
- **Claude model string:** The scrapers use `claude-haiku-4-5-20251001` (the old `claude-3-5-haiku` was retired). Always use this exact model ID.
- **Telegram env var:** The correct env var is `TELEGRAM_CHANNEL_ID`, NOT `TELEGRAM_CHAT_ID`. Using the wrong name silently fails.

## No-Touch Files (never modify without explicit instruction)

- `src/lib/supabase/middleware.ts`
- `src/config/env.ts`
- `src/types/database.generated.ts` (when it exists)

## Key Files

- `src/types/opportunity.ts` — `Opportunity` interface + all enum types (source of truth, shared with scrapers repo)
- `src/services/opportunity-service.ts` — all Supabase queries
- `src/services/search-service.ts` — search/filter logic
- `src/config/constants.ts` — pagination, site-wide constants
- `src/app/globals.css` — CSS custom property definitions (light + dark tokens)
- `tailwind.config.ts` — semantic color + font family extensions

## Import Order Convention

1. react / next
2. External libraries
3. `@/` aliases
4. Relative imports

(Blank line between each group)

## File Naming

- Components: kebab-case (`opportunity-card.tsx`)
- Services/config/types: kebab-case (`opportunity-service.ts`)

## Key Types

The `Opportunity` interface and all enum types live in `src/types/opportunity.ts`. This is the source of truth shared with the scrapers repo. If you change types here, they must be mirrored there.
