import Link from 'next/link';

import { OpportunityCard } from '@/components/features/opportunity-card';
import { FilterSidebar } from '@/components/features/filter-sidebar';
import { MobileFilterToggle } from '@/components/features/mobile-filter-toggle';
import { SearchInput } from '@/components/features/search-input';
import { FeaturedCard } from '@/components/features/featured-card';
import { getOpportunities, getOpportunityTypes } from '@/services/opportunity-service';
import { getActiveFeaturedListings } from '@/services/featured-service';
import { PAGINATION } from '@/config/constants';
import { buildPageUrl } from '@/lib/filter-urls';
import type { OpportunityFilters } from '@/types/opportunity';

// ISR: rebuild at most once every 30 minutes.
//
// This page has NO searchParams and NO auth — it serves the default
// opportunity grid (page 1, no filters, no personalization).
// Bots and cold visitors land here and get a CDN-cached response.
// Data changes once daily (4 AM scrape), so 30 min is plenty fresh.
//
// Any filtering or searching navigates to /opportunities/search (dynamic).
export const revalidate = 1800;

// ── Sub-components ────────────────────────────────────────────────────────────

function PageHeader({ count }: { count: number }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#1A1A2E] sm:text-3xl">
        Browse Opportunities
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Showing {count.toLocaleString()} opportunities · Sorted by deadline
      </p>
    </div>
  );
}

function Pagination({ totalCount }: { totalCount: number }) {
  const totalPages = Math.ceil(totalCount / PAGINATION.DEFAULT_PAGE_SIZE);
  if (totalPages <= 1) return null;

  // Page 1 is this ISR page — "Next" goes to /search?page=2 (dynamic).
  const emptyFilters: OpportunityFilters = {};
  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      <span className="rounded-lg border border-slate-100 px-4 py-2.5 text-sm font-medium text-slate-300">
        ← Previous
      </span>
      <span className="text-sm text-text-secondary">Page 1 of {totalPages}</span>
      <Link
        href={buildPageUrl(emptyFilters, 2)}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A2E] transition-colors hover:bg-slate-50"
      >
        Next →
      </Link>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function OpportunitiesPage() {
  const [result, typesResult, featuredResult] = await Promise.all([
    getOpportunities({}),
    getOpportunityTypes(),
    getActiveFeaturedListings(),
  ]);

  const opportunities = result.data?.opportunities ?? [];
  const totalCount = result.data?.count ?? 0;
  const featuredListings = featuredResult.data ?? [];

  const typeCounts: Record<string, number> = {};
  for (const { type, count } of typesResult.data ?? []) {
    typeCounts[type] = count;
  }

  // Empty filters — filter sidebar shows all unchecked.
  // Clicking any filter navigates to /opportunities/search?...
  const emptyFilters: OpportunityFilters = {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 lg:hidden">
        <MobileFilterToggle activeFilterCount={0}>
          <FilterSidebar currentFilters={emptyFilters} typeCounts={typeCounts} />
        </MobileFilterToggle>
      </div>

      <div className="lg:flex lg:gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterSidebar currentFilters={emptyFilters} typeCounts={typeCounts} />
        </aside>

        <div className="min-w-0 flex-1">
          <PageHeader count={totalCount} />
          <div className="mt-4">
            <SearchInput placeholder="Search opportunities..." />
          </div>

          {featuredListings.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-semibold text-[#1A1A2E]">
                ⭐ Featured Opportunities
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {featuredListings.map((listing) => (
                  <FeaturedCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}

          {opportunities.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {opportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-lg text-text-secondary">No opportunities found.</p>
            </div>
          )}

          <Pagination totalCount={totalCount} />
        </div>
      </div>
    </div>
  );
}
