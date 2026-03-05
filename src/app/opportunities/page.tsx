import Link from 'next/link';

import { OpportunityCard } from '@/components/features/opportunity-card';
import { getOpportunities } from '@/services/opportunity-service';
import { OPPORTUNITY_TYPES, type OpportunityType, type OpportunityFilters } from '@/types/opportunity';
import { PAGINATION } from '@/config/constants';

export const dynamic = 'force-dynamic';

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseSearchParams(sp: Record<string, string | string[] | undefined>): OpportunityFilters {
  const type = typeof sp.type === 'string' && OPPORTUNITY_TYPES.includes(sp.type as OpportunityType)
    ? (sp.type as OpportunityType)
    : undefined;
  const search = typeof sp.search === 'string' ? sp.search : undefined;
  const page = typeof sp.page === 'string' ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;

  return { type, search_query: search, page };
}

function buildPageTitle(filters: OpportunityFilters): string {
  if (filters.type) {
    return filters.type.charAt(0).toUpperCase() + filters.type.slice(1) + 's';
  }
  return 'Browse Opportunities';
}

function buildPageUrl(base: OpportunityFilters, page: number): string {
  const params = new URLSearchParams();
  if (base.type) params.set('type', base.type);
  if (base.search_query) params.set('search', base.search_query);
  params.set('page', String(page));
  return `/opportunities?${params.toString()}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PageHeader({ title, count }: { title: string; count: number }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-[#1A1A2E]">{title}</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Showing {count.toLocaleString()} {count === 1 ? 'opportunity' : 'opportunities'}
      </p>
    </div>
  );
}

function Pagination({ page, totalCount, filters }: { page: number; totalCount: number; filters: OpportunityFilters }) {
  const totalPages = Math.ceil(totalCount / PAGINATION.DEFAULT_PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      {hasPrev ? (
        <Link
          href={buildPageUrl(filters, page - 1)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1A1A2E] transition-colors hover:bg-slate-50"
        >
          ← Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-slate-100 px-4 py-2 text-sm font-medium text-slate-300">
          ← Previous
        </span>
      )}

      <span className="text-sm text-text-secondary">
        Page {page} of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={buildPageUrl(filters, page + 1)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1A1A2E] transition-colors hover:bg-slate-50"
        >
          Next →
        </Link>
      ) : (
        <span className="rounded-lg border border-slate-100 px-4 py-2 text-sm font-medium text-slate-300">
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
  const result = await getOpportunities(filters);

  const opportunities = result.data?.opportunities ?? [];
  const totalCount = result.data?.count ?? 0;
  const title = buildPageTitle(filters);
  const page = filters.page ?? 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader title={title} count={totalCount} />

      {opportunities.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-text-secondary">No opportunities found.</p>
          <Link href="/opportunities" className="mt-4 inline-block text-sm text-primary hover:text-primary-dark">
            Clear filters →
          </Link>
        </div>
      )}

      {totalCount > PAGINATION.DEFAULT_PAGE_SIZE && (
        <Pagination page={page} totalCount={totalCount} filters={filters} />
      )}
    </div>
  );
}
