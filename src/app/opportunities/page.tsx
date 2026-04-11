import Link from 'next/link';

import { OpportunityCard } from '@/components/features/opportunity-card';
import { SaveButtonBulk } from '@/components/features/save-button-bulk';
import { FilterSidebar } from '@/components/features/filter-sidebar';
import { ActiveFilters } from '@/components/features/active-filters';
import { MobileFilterToggle } from '@/components/features/mobile-filter-toggle';
import { SearchInput } from '@/components/features/search-input';
import { SearchResultsHeader } from '@/components/features/search-results-header';
import { FeaturedCard } from '@/components/features/featured-card';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getOpportunities, getOpportunityTypes } from '@/services/opportunity-service';
import { getActiveFeaturedListings } from '@/services/featured-service';
import { getProfile } from '@/services/profile-service';
import {
  OPPORTUNITY_TYPES,
  REGIONS,
  type OpportunityType,
  type Region,
  type OpportunityFilters,
} from '@/types/opportunity';
import { PAGINATION } from '@/config/constants';
import { buildPageUrl, countActiveFilters } from '@/lib/filter-urls';

export const dynamic = 'force-dynamic';

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseSearchParams(
  sp: Record<string, string | string[] | undefined>,
): OpportunityFilters {
  const typeRaw = typeof sp.type === 'string' ? sp.type : '';
  const types = typeRaw
    .split(',')
    .map((s) => s.trim())
    .filter((t): t is OpportunityType =>
      OPPORTUNITY_TYPES.includes(t as OpportunityType),
    );

  const regionRaw = typeof sp.region === 'string' ? sp.region : '';
  const regions = regionRaw
    .split(',')
    .map((s) => s.trim())
    .filter((r): r is Region => REGIONS.includes(r as Region));

  const is_fully_funded = sp.funded === 'true' ? true : undefined;
  const show_expired = sp.expired === 'true' ? true : undefined;
  const search_query =
    typeof sp.search === 'string' && sp.search ? sp.search : undefined;
  const page =
    typeof sp.page === 'string' ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;

  const deadline_days =
    typeof sp.deadline_days === 'string'
      ? [7, 30, 90].includes(Number(sp.deadline_days)) ? Number(sp.deadline_days) : undefined
      : undefined;
  const posted_days =
    typeof sp.posted_days === 'string'
      ? [1, 7, 30].includes(Number(sp.posted_days)) ? Number(sp.posted_days) : undefined
      : undefined;

  return {
    types: types.length > 0 ? types : undefined,
    regions: regions.length > 0 ? regions : undefined,
    is_fully_funded,
    show_expired,
    deadline_days,
    posted_days,
    search_query,
    page,
  };
}

function buildPageTitle(filters: OpportunityFilters): string {
  if (filters.types?.length === 1) {
    const t = filters.types[0]!;
    return t.charAt(0).toUpperCase() + t.slice(1) + 's';
  }
  return 'Browse Opportunities';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PageHeader({ title, count }: { title: string; count: number }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#1A1A2E] sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Showing {count.toLocaleString()}{' '}
        {count === 1 ? 'opportunity' : 'opportunities'} · Sorted by deadline
      </p>
    </div>
  );
}

function Pagination({
  page,
  totalCount,
  filters,
}: {
  page: number;
  totalCount: number;
  filters: OpportunityFilters;
}) {
  const totalPages = Math.ceil(totalCount / PAGINATION.DEFAULT_PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      {hasPrev ? (
        <Link
          href={buildPageUrl(filters, page - 1)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A2E] transition-colors hover:bg-slate-50"
        >
          ← Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-slate-100 px-4 py-2.5 text-sm font-medium text-slate-300">
          ← Previous
        </span>
      )}

      <span className="text-sm text-text-secondary">
        Page {page} of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={buildPageUrl(filters, page + 1)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A2E] transition-colors hover:bg-slate-50"
        >
          Next →
        </Link>
      ) : (
        <span className="rounded-lg border border-slate-100 px-4 py-2.5 text-sm font-medium text-slate-300">
          Next →
        </span>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function OpportunitiesPage({ searchParams }: PageProps) {
  const filters = parseSearchParams(searchParams);
  const supabase = await createServerSupabaseClient();

  const [result, typesResult, featuredResult, authResult] = await Promise.all([
    getOpportunities(filters),
    getOpportunityTypes(),
    getActiveFeaturedListings(),
    supabase.auth.getUser(),
  ]);

  const opportunities = result.data?.opportunities ?? [];
  const totalCount = result.data?.count ?? 0;
  const featuredListings = featuredResult.data ?? [];
  const title = buildPageTitle(filters);
  const page = filters.page ?? 1;
  const user = authResult.data?.user ?? null;

  // Determine which opportunities match the user's profile (score-based)
  // +1 type match, +1 region match, +1 citizenship eligible, +1 age in range
  // Threshold: score ≥ 2 to show "Matches you" badge
  const matchingIds = new Set<string>();
  if (user) {
    const profileResult = await getProfile(user.id);
    if (profileResult.data) {
      const {
        types_of_interest,
        regions_of_interest,
        country_of_citizenship,
        country_of_citizenship_2,
        date_of_birth,
      } = profileResult.data;

      const citizenships = [country_of_citizenship, country_of_citizenship_2].filter(Boolean) as string[];
      const userAge = date_of_birth
        ? Math.floor((Date.now() - new Date(date_of_birth).getTime()) / 31_557_600_000)
        : null;

      const hasPreferences =
        types_of_interest.length > 0 || regions_of_interest.length > 0 ||
        citizenships.length > 0 || userAge !== null;

      if (hasPreferences) {
        for (const opp of opportunities) {
          let score = 0;

          // +1 if type matches
          if (types_of_interest.length > 0 && types_of_interest.includes(opp.type)) {
            score++;
          }

          // +1 if any region matches
          if (regions_of_interest.length > 0 && opp.regions.some((r) => regions_of_interest.includes(r))) {
            score++;
          }

          // +1 if citizenship is eligible (or no restriction set)
          if (citizenships.length > 0) {
            const eligible = opp.eligible_nationalities ?? [];
            if (eligible.length === 0 || eligible.some((n) => citizenships.includes(n))) {
              score++;
            }
          }

          // +1 if age is within range (or no range set)
          if (userAge !== null) {
            const minOk = opp.min_age == null || userAge >= opp.min_age;
            const maxOk = opp.max_age == null || userAge <= opp.max_age;
            if (minOk && maxOk) score++;
          }

          if (score >= 2) matchingIds.add(opp.id);
        }
      }
    }
  }

  const typeCounts: Record<string, number> = {};
  for (const { type, count } of typesResult.data ?? []) {
    typeCounts[type] = count;
  }

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Mobile: filter toggle button (client) wrapping server-rendered sidebar */}
      <div className="mb-6 lg:hidden">
        <MobileFilterToggle activeFilterCount={activeFilterCount}>
          <FilterSidebar currentFilters={filters} typeCounts={typeCounts} />
        </MobileFilterToggle>
      </div>

      <div className="lg:flex lg:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterSidebar currentFilters={filters} typeCounts={typeCounts} />
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <PageHeader title={title} count={totalCount} />
          <div className="mt-4">
            <SearchInput
              defaultValue={filters.search_query ?? ''}
              placeholder="Search opportunities..."
            />
            {filters.search_query && (
              <SearchResultsHeader query={filters.search_query} totalCount={totalCount} />
            )}
          </div>
          <ActiveFilters currentFilters={filters} />

          {/* Featured listings — pinned at top */}
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
            <SaveButtonBulk>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {opportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    matchesProfile={matchingIds.has(opp.id)}
                  />
                ))}
              </div>
            </SaveButtonBulk>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-lg text-text-secondary">No opportunities found.</p>
              <Link
                href="/opportunities"
                className="mt-4 inline-block text-sm text-primary hover:text-primary-dark"
              >
                Clear filters →
              </Link>
            </div>
          )}

          {totalCount > PAGINATION.DEFAULT_PAGE_SIZE && (
            <Pagination page={page} totalCount={totalCount} filters={filters} />
          )}
        </div>
      </div>
    </div>
  );
}
