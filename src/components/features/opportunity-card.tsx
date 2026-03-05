import Link from 'next/link';

import { OpportunityBadge } from '@/components/ui/badge';
import { DeadlineBadge } from '@/components/ui/deadline-badge';
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
    <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-3">
      <RegionPills regions={regions} />
      {isFullyFunded && (
        <span className="ml-auto whitespace-nowrap text-xs font-medium text-emerald-600">
          ✓ Fully Funded
        </span>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type OpportunityCardProps = {
  opportunity: Opportunity;
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { slug, title, type, deadline, organization, summary, regions, is_fully_funded } = opportunity;

  return (
    <Link
      href={`/opportunities/${slug}`}
      className="flex min-h-[220px] flex-col rounded-lg border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <OpportunityBadge label={type} variant={type} />
        <DeadlineBadge deadline={deadline} />
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

      <CardBottom regions={regions} isFullyFunded={is_fully_funded} />
    </Link>
  );
}
