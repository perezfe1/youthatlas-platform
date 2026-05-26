import Link from 'next/link';
import type { Metadata } from 'next';

import { OpportunityCard } from '@/components/features/opportunity-card';
import { getOpportunities } from '@/services/opportunity-service';

// ISR: rebuild at most once every 6 hours.
// Public page — no auth, no searchParams, safe to cache at CDN edge.
export const revalidate = 21600;

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Opportunities for Young Leaders | YouthAtlas',
  description:
    'Curated fellowships, scholarships, conferences and training programs for emerging leaders in Latin America and beyond.',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DreamersAndMakersPage() {
  const result = await getOpportunities({
    types: ['fellowship', 'scholarship', 'conference', 'training'],
    regions: ['latin_america', 'global'],
    show_expired: false,
    page_size: 20,
  });

  const opportunities = result.data?.opportunities ?? [];
  const totalCount = result.data?.count ?? 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF5' }}>
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-[#1A1A2E] sm:text-4xl">
            Opportunities for Young Leaders
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Curated fellowships, scholarships, conferences and training programs for emerging
            leaders in Latin America and beyond.
          </p>
        </div>
      </div>

      {/* Opportunities */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-text-secondary">
          Showing {totalCount.toLocaleString()} opportunities
        </p>

        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-lg text-text-secondary">
            No opportunities found.
          </p>
        )}

        {/* Footer link */}
        <div className="mt-12 text-center">
          <Link
            href="/opportunities"
            className="text-sm font-medium text-[#1A1A2E] underline-offset-4 hover:underline"
          >
            Browse all opportunities →
          </Link>
        </div>
      </div>
    </div>
  );
}
