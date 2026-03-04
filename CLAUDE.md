# YouthAtlas Platform — Claude Code Context

## What This Is

User-facing Next.js app for browsing youth opportunities (scholarships, fellowships, internships, grants, etc.). Part of a 3-system architecture:

1. **This repo** — website users see
2. **youthatlas-scrapers** — automated ingestion pipeline (separate repo)
3. **Distribution** — Telegram bot + email (lives in scrapers repo)

## Tech Stack

- Next.js 14 (App Router) / TypeScript (strict) / Tailwind CSS
- Supabase (Postgres + Auth + Edge Functions)
- Deployed on Vercel

## Architecture Rules — FOLLOW THESE ALWAYS

1. **Components never import Supabase directly.** All DB calls go through `src/services/`.
2. **Every async service function returns `Result<T>`** (see `src/types/opportunity.ts`). Never throw.
3. **No stringly-typed values.** Use the const arrays and union types in `src/types/opportunity.ts`.
4. **Named exports only** (except `page.tsx` and `layout.tsx` which Next.js requires as default).
5. **Env vars are validated via Zod** in `src/config/env.ts`. Never use raw `process.env`.
6. **One concern per file.** If a file does 2+ things, split it.

## No-Touch Files (never modify without explicit instruction)

- `src/lib/supabase/middleware.ts`
- `src/config/env.ts`
- `src/types/database.generated.ts` (when it exists)

## Import Order Convention

1. react / next
2. External libraries
3. `@/` aliases
4. Relative imports

(Blank line between each group)

## File Naming

- Components: PascalCase (`OpportunityCard.tsx`)
- Everything else: camelCase (`opportunityService.ts`)

## Key Types

The `Opportunity` interface and all enum types live in `src/types/opportunity.ts`. This is the source of truth shared with the scrapers repo. If you change types here, they must be mirrored there.
