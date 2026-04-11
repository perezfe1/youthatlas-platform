import type { OpportunityFilters, OpportunityType, Region } from '@/types/opportunity';

/** Build a /opportunities URL from filter state. Always resets page to 1. */
export function buildFilterUrl(f: OpportunityFilters): string {
  const p = new URLSearchParams();
  if (f.types?.length) p.set('type', f.types.join(','));
  if (f.regions?.length) p.set('region', f.regions.join(','));
  if (f.is_fully_funded) p.set('funded', 'true');
  if (f.show_expired) p.set('expired', 'true');
  if (f.deadline_days) p.set('deadline_days', String(f.deadline_days));
  if (f.posted_days) p.set('posted_days', String(f.posted_days));
  if (f.search_query) p.set('search', f.search_query);
  const qs = p.toString();
  return qs ? `/opportunities?${qs}` : '/opportunities';
}

/** Build a /opportunities URL preserving all filters at a specific page. */
export function buildPageUrl(filters: OpportunityFilters, page: number): string {
  const p = new URLSearchParams();
  if (filters.types?.length) p.set('type', filters.types.join(','));
  if (filters.regions?.length) p.set('region', filters.regions.join(','));
  if (filters.is_fully_funded) p.set('funded', 'true');
  if (filters.show_expired) p.set('expired', 'true');
  if (filters.deadline_days) p.set('deadline_days', String(filters.deadline_days));
  if (filters.posted_days) p.set('posted_days', String(filters.posted_days));
  if (filters.search_query) p.set('search', filters.search_query);
  p.set('page', String(page));
  return `/opportunities?${p.toString()}`;
}

/** Toggle a type value in/out of the types array, reset to page 1. */
export function toggleType(filters: OpportunityFilters, type: OpportunityType): string {
  const current = filters.types ?? [];
  const next = current.includes(type)
    ? current.filter((t) => t !== type)
    : [...current, type];
  return buildFilterUrl({ ...filters, types: next });
}

/** Toggle a region value in/out of the regions array, reset to page 1. */
export function toggleRegion(filters: OpportunityFilters, region: Region): string {
  const current = filters.regions ?? [];
  const next = current.includes(region)
    ? current.filter((r) => r !== region)
    : [...current, region];
  return buildFilterUrl({ ...filters, regions: next });
}

/** Toggle the is_fully_funded flag, reset to page 1. */
export function toggleFunded(filters: OpportunityFilters): string {
  return buildFilterUrl({ ...filters, is_fully_funded: filters.is_fully_funded ? undefined : true });
}

/** Toggle the show_expired flag, reset to page 1. */
export function toggleExpired(filters: OpportunityFilters): string {
  return buildFilterUrl({ ...filters, show_expired: filters.show_expired ? undefined : true });
}

/** Set the deadline_days filter (or clear if same value is selected). */
export function setDeadlineDays(filters: OpportunityFilters, days: number | undefined): string {
  return buildFilterUrl({
    ...filters,
    deadline_days: filters.deadline_days === days ? undefined : days,
  });
}

/** Set the posted_days filter (or clear if same value is selected). */
export function setPostedDays(filters: OpportunityFilters, days: number | undefined): string {
  return buildFilterUrl({
    ...filters,
    posted_days: filters.posted_days === days ? undefined : days,
  });
}

/** Count total active filter values (for the mobile toggle badge). */
export function countActiveFilters(filters: OpportunityFilters): number {
  return (
    (filters.types?.length ?? 0) +
    (filters.regions?.length ?? 0) +
    (filters.is_fully_funded ? 1 : 0) +
    (filters.deadline_days ? 1 : 0) +
    (filters.posted_days ? 1 : 0)
  );
}
