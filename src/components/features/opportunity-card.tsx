import Link from 'next/link';

import { OpportunityBadge } from '@/components/ui/badge';
import { DeadlineBadge } from '@/components/ui/deadline-badge';
import { SaveButton } from '@/components/features/save-button';
import type { Opportunity } from '@/types/opportunity';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRegion(region: string): string {
  return region
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RegionPills({ regions }: { regions: string[] }) {
  if (regions.length === 0) return null;
  const visible = regions.slice(0, 2);
  const extra = regions.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((r) => (
        <span key={r} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          {formatRegion(r)}
        </span>
      ))}
      {extra > 0 && (
        <span className="text-xs text-slate-400">+{extra}</span>
      )}
    </div>
  );
}

function CardBottom({ regions, isFullyFunded }: { regions: string[]; isFullyFunded: boolean }) {
  if (regions.length === 0 && !isFullyFunded) return null;

  return (
    <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
      <RegionPills regions={regions} />
      {isFullyFunded && (
        <span className="ml-auto whitespace-nowrap text-xs font-medium text-emerald-600">
          ✓ Fully Funded
        </span>
      )}
    </div>
  );
}

// ── Freshness helper ──────────────────────────────────────────────────────────

function freshnessLabel(createdAt: string): string | null {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Added today';
  if (days === 1) return 'Added yesterday';
  if (days <= 7) return `Added ${days} days ago`;
  if (days <= 14) return 'Added last week';
  if (days <= 30) {
    const weeks = Math.floor(days / 7);
    return `Added ${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  return null; // Don't show for listings older than 30 days
}

// ── Main component ────────────────────────────────────────────────────────────

type OpportunityCardProps = {
  opportunity: Opportunity;
  /** Show a "Matches you" tag when the opportunity aligns with the user's profile */
  matchesProfile?: boolean;
};

export function OpportunityCard({ opportunity, matchesProfile }: OpportunityCardProps) {
  const { id, slug, title, type, deadline, organization, summary, regions, is_fully_funded, created_at } =
    opportunity;
  const freshness = freshnessLabel(created_at);

  return (
    <div className="relative">
      <div className="absolute right-3 top-3 z-10">
        <SaveButton opportunityId={id} size="sm" />
      </div>
      <Link
        href={`/opportunities/${slug}`}
        className="flex min-h-[220px] flex-col rounded-lg border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex flex-wrap items-start gap-2 pr-8">
          <OpportunityBadge label={type} variant={type} />
          <DeadlineBadge deadline={deadline} />
          {matchesProfile && (
            <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
              ✦ Matches you
            </span>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 font-display text-lg font-semibold text-[#1A1A2E]">
          {title}
        </h3>

        {organization && (
          <p className="mt-1 text-sm text-text-secondary">{organization}</p>
        )}

        {summary && (
          <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{summary}</p>
        )}

        {/* Push bottom section to card bottom */}
        <div className="mt-auto">
          {freshness && (
            <p className="mb-2 text-xs text-slate-400">{freshness}</p>
          )}
          <CardBottom regions={regions} isFullyFunded={is_fully_funded} />
        </div>
      </Link>
    </div>
  );
}
