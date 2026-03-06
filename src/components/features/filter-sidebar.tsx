import Link from 'next/link';

import { OPPORTUNITY_TYPES, REGIONS } from '@/types/opportunity';
import type { OpportunityFilters, OpportunityType, Region } from '@/types/opportunity';
import { toggleType, toggleRegion, toggleFunded, toggleExpired } from '@/lib/filter-urls';

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  currentFilters: OpportunityFilters;
  typeCounts?: Record<string, number>;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatLabel(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </h3>
  );
}

type CheckRowProps = {
  href: string;
  label: string;
  count?: number;
  checked: boolean;
};

function CheckRow({ href, label, count, checked }: CheckRowProps) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-2 rounded px-2 py-2 text-sm transition-colors hover:bg-slate-50 ${
        checked ? 'font-semibold text-text-primary' : 'text-text-secondary'
      }`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
            checked ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
          }`}
          aria-hidden="true"
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4l3 3 5-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-slate-400">{count}</span>
      )}
    </Link>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function FilterSidebar({ currentFilters, typeCounts }: Props) {
  const activeTypes: OpportunityType[] = currentFilters.types ?? [];
  const activeRegions: Region[] = currentFilters.regions ?? [];
  const hasAnyFilter =
    activeTypes.length > 0 || activeRegions.length > 0 || !!currentFilters.is_fully_funded;

  return (
    <div className="space-y-6">
      {/* Clear All */}
      {hasAnyFilter && (
        <Link
          href="/opportunities"
          className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          Clear all filters
        </Link>
      )}

      {/* Type */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <SectionHeading>Type</SectionHeading>
        <div className="space-y-0.5">
          {OPPORTUNITY_TYPES.map((type) => (
            <CheckRow
              key={type}
              href={toggleType(currentFilters, type)}
              label={formatLabel(type)}
              count={typeCounts?.[type]}
              checked={activeTypes.includes(type)}
            />
          ))}
        </div>
      </div>

      {/* Funding */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <SectionHeading>Funding</SectionHeading>
        <CheckRow
          href={toggleFunded(currentFilters)}
          label="Fully Funded Only"
          checked={!!currentFilters.is_fully_funded}
        />
      </div>

      {/* Region */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <SectionHeading>Region</SectionHeading>
        <div className="space-y-0.5">
          {REGIONS.map((region) => (
            <CheckRow
              key={region}
              href={toggleRegion(currentFilters, region)}
              label={formatLabel(region)}
              checked={activeRegions.includes(region)}
            />
          ))}
        </div>
      </div>

      {/* Deadline */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <SectionHeading>Deadline</SectionHeading>
        <CheckRow
          href={toggleExpired(currentFilters)}
          label="Show Expired"
          checked={!!currentFilters.show_expired}
        />
      </div>
    </div>
  );
}
