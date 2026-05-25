import Link from 'next/link';

import { OpportunityCard } from '@/components/features/opportunity-card';
import { EmailSignup } from '@/components/features/email-signup';
import { ForYouClient } from '@/components/features/for-you-client';
import { getOpportunityCount, getFeaturedOpportunities, getOpportunityTypes } from '@/services/opportunity-service';
import type { Opportunity } from '@/types/opportunity';

// ISR: rebuild at most once per hour. Personalization is handled client-side
// via /api/recommendations so anonymous visitors (the vast majority) are
// served this cached page from the CDN — zero serverless invocations.
export const revalidate = 3600;

// ── Constants ─────────────────────────────────────────────────────────────────

const TYPE_EMOJI: Record<string, string> = {
  scholarship: '🎓', fellowship: '🤝', grant: '💰', internship: '💼',
  conference: '🎤', competition: '🏆', training: '📚',
};

const TYPE_SLUG: Record<string, string> = {
  scholarship: '/scholarships',
  fellowship: '/fellowships',
  grant: '/grants',
  internship: '/internships',
  conference: '/conferences',
  competition: '/competitions',
  training: '/training',
};

// ── Section: Hero ─────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function HeroSection({ displayCount }: { displayCount: string }) {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-violet-50 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-[#1A1A2E] sm:text-5xl lg:text-6xl">
          Discover opportunities that<br className="hidden sm:inline" /> change your life
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:text-xl">
          Scholarships, fellowships, grants, internships and more — aggregated from 50+ sources worldwide.
        </p>
        <p className="mt-3 text-xs text-text-secondary">
          A free service by{' '}
          <a href="/about" className="underline underline-offset-2 hover:text-primary">
            Prospera Development Foundation
          </a>
          , a registered 501(c)(3) nonprofit · EIN: 92-3630661
        </p>
        <p className="mt-6 text-sm text-text-secondary">
          Browse {displayCount} opportunities updated daily. Get notified via{' '}
          <a
            href="https://t.me/youthatlas1"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary"
          >
            Telegram
          </a>{' '}
          or email.
        </p>
        <HeroSearch />
      </div>
    </section>
  );
}

function HeroSearch() {
  return (
    <form action="/opportunities" method="get" className="mx-auto mt-8 max-w-xl">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <SearchIcon />
        </div>
        <input
          type="text"
          name="search"
          placeholder="Search scholarships, fellowships, grants..."
          className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-5 text-base shadow-sm placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </form>
  );
}

// ── Section: Browse by Type ───────────────────────────────────────────────────

function TypeTile({ type, count }: { type: string; count: number }) {
  const emoji = TYPE_EMOJI[type] ?? '📋';
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  const href = TYPE_SLUG[type] ?? `/opportunities?type=${type}`;

  return (
    <Link
      href={href}
      className="rounded-lg border border-slate-200 bg-white p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="text-2xl">{emoji}</span>
      <p className="mt-2 font-display text-sm font-semibold text-[#1A1A2E]">{label}</p>
      <p className="mt-0.5 text-xs text-text-secondary">{count} opportunities</p>
    </Link>
  );
}

function TypeGridSection({ types }: { types: { type: string; count: number }[] }) {
  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-2xl font-semibold text-[#1A1A2E]">
          Browse by Type
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {types.map((t) => (
            <TypeTile key={t.type} type={t.type} count={t.count} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Featured Opportunities ───────────────────────────────────────────

function FeaturedGrid({ opportunities }: { opportunities: Opportunity[] }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {opportunities.map((opp) => (
        <OpportunityCard key={opp.id} opportunity={opp} />
      ))}
    </div>
  );
}

function FeaturedSection({ opportunities }: { opportunities: Opportunity[] }) {
  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold text-[#1A1A2E]">
            Featured Opportunities
          </h2>
          <p className="mt-2 text-text-secondary">
            Handpicked high-quality listings
          </p>
        </div>

        <FeaturedGrid opportunities={opportunities} />

        <div className="mt-10 text-center">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            View all opportunities →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Section: Newsletter ───────────────────────────────────────────────────────

function NewsletterSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-violet-50 py-12 px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold text-[#1A1A2E]">
          Never Miss an Opportunity
        </h2>
        <p className="mt-3 text-slate-600">
          Get the best scholarships, fellowships, and grants delivered to your inbox weekly.
        </p>
        <div className="mt-6">
          <EmailSignup variant="hero" />
        </div>
        <p className="mt-6 text-sm text-slate-500">
          YouthAtlas is free, forever.{' '}
          <a
            href="https://www.zeffy.com/en-US/donation-form/help-young-people-find-life-changing-opportunities"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-dark"
          >
            Support our mission →
          </a>
        </p>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [countResult, typesResult, featuredResult] = await Promise.all([
    getOpportunityCount(),
    getOpportunityTypes(),
    getFeaturedOpportunities(6),
  ]);

  const rawCount = countResult.data ?? 0;
  const displayCount = rawCount > 0
    ? `${(Math.floor(rawCount / 50) * 50).toLocaleString()}+`
    : 'thousands of';
  const types = (typesResult.data ?? []).filter((t) => t.type !== 'job');
  const featured = featuredResult.data ?? [];

  return (
    <>
      <HeroSection displayCount={displayCount} />
      <TypeGridSection types={types} />
      {/* ForYouClient fetches /api/recommendations after mount — invisible to
          anonymous visitors, no SSR auth call needed here */}
      <ForYouClient />
      <FeaturedSection opportunities={featured} />
      <NewsletterSection />
    </>
  );
}
