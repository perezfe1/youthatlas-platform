import Link from 'next/link';

import type { OpportunityFilters } from '@/types/opportunity';
import { toggleType, toggleRegion, toggleFunded, setDeadlineDays, setPostedDays } from '@/lib/filter-urls';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatLabel(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterPill({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
    >
      {label}
      <span aria-hidden="true" className="text-blue-400">
        ✕
      </span>
    </Link>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Props = { currentFilters: OpportunityFilters };

export function ActiveFilters({ currentFilters }: Props) {
  const types = currentFilters.types ?? [];
  const regions = currentFilters.regions ?? [];
  const funded = !!currentFilters.is_fully_funded;
  const deadlineDays = currentFilters.deadline_days;
  const postedDays = currentFilters.posted_days;

  if (types.length === 0 && regions.length === 0 && !funded && !deadlineDays && !postedDays) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-slate-500">Active:</span>
      {types.map((type) => (
        <FilterPill
          key={`type-${type}`}
          href={toggleType(currentFilters, type)}
          label={formatLabel(type)}
        />
      ))}
      {regions.map((region) => (
        <FilterPill
          key={`region-${region}`}
          href={toggleRegion(currentFilters, region)}
          label={formatLabel(region)}
        />
      ))}
      {funded && (
        <FilterPill
          href={toggleFunded(currentFilters)}
          label="Fully Funded"
        />
      )}
      {deadlineDays && (
        <FilterPill
          href={setDeadlineDays(currentFilters, undefined)}
          label={`Closing in ${deadlineDays}d`}
        />
      )}
      {postedDays && (
        <FilterPill
          href={setPostedDays(currentFilters, undefined)}
          label={postedDays === 1 ? 'Last 24h' : `Last ${postedDays}d`}
        />
      )}
    </div>
  );
}
