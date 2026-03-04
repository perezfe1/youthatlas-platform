# youthatlas-platform

The web front-end for **YouthAtlas** — an AI-powered platform that aggregates scholarships, fellowships, internships, grants, and other opportunities for young people.

## Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Framework     | Next.js 14 (App Router)           |
| Language      | TypeScript (strict mode)          |
| Styling       | Tailwind CSS 3                    |
| Backend/Auth  | Supabase (Postgres + Auth + Storage) |
| Deployment    | Vercel                            |

## Project Structure

```
src/
├── app/               # Next.js App Router pages & layouts
├── components/
│   ├── ui/            # Primitive UI components (no business logic)
│   ├── features/      # Feature compositions with business logic
│   └── layouts/       # Shell, nav, and footer wrappers
├── services/          # All Supabase calls (never in components)
├── lib/supabase/      # Supabase client, server, and middleware helpers
├── hooks/             # Custom React hooks
├── types/             # Shared TypeScript types
└── config/            # Env validation, site config, constants
```

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

## Available Scripts

| Command             | Description                          |
|---------------------|--------------------------------------|
| `pnpm dev`          | Start development server             |
| `pnpm build`        | Build for production                 |
| `pnpm start`        | Start production server              |
| `pnpm lint`         | Run ESLint                           |
| `pnpm type-check`   | Run TypeScript type checking         |

## Related

- **Scraper pipeline**: [youthatlas-scrapers](https://github.com/perezfe1/youthatlas-scrapers)
