'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { OpportunityCard } from '@/components/features/opportunity-card';
import { SaveButtonBulk } from '@/components/features/save-button-bulk';
import type { Opportunity } from '@/types/opportunity';

/**
 * Client-side "Opportunities for You" section.
 *
 * Fetches personalized recommendations from /api/recommendations after mount.
 * Renders nothing for anonymous visitors or users with no preferences — no
 * layout shift, no loading spinner visible to most users.
 *
 * This keeps the homepage ISR-cacheable (no server-side auth call needed).
 */
export function ForYouClient() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Skip API call for anonymous visitors (>90% of traffic).
    // Supabase auth cookie has a 'sb-' prefix and ends in '-auth-token'.
    const hasAuthCookie = document.cookie
      .split('; ')
      .some((c) => c.startsWith('sb-') && c.includes('-auth-token'));

    if (!hasAuthCookie) {
      setLoaded(true);
      return;
    }

    fetch('/api/recommendations')
      .then((r) => r.json())
      .then((data: { opportunities: Opportunity[] }) => {
        setOpportunities(data.opportunities ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || opportunities.length === 0) return null;

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold text-[#1A1A2E]">
            Opportunities for You
          </h2>
          <p className="mt-2 text-text-secondary">
            Based on your profile preferences
          </p>
        </div>
        <SaveButtonBulk>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} matchesProfile />
            ))}
          </div>
        </SaveButtonBulk>
        <div className="mt-10 text-center">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            Browse all opportunities →
          </Link>
        </div>
      </div>
    </section>
  );
}
