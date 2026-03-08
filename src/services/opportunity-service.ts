import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PAGINATION } from '@/config/constants';
import type { Opportunity, OpportunityFilters, AppError, Result } from '@/types/opportunity';

// ── Shared types ──────────────────────────────────────────────────────────────

type OpportunitiesResult = Result<{ opportunities: Opportunity[]; count: number }>;
type TypeCount = { type: string; count: number };

// ── Helpers ───────────────────────────────────────────────────────────────────

function dbError(code: string, message: string): { data: null; error: AppError } {
  return { data: null, error: { code, message } };
}

function toRange(page: number, pageSize: number): [number, number] {
  const from = (page - 1) * pageSize;
  return [from, from + pageSize - 1];
}

// ── Exports ───────────────────────────────────────────────────────────────────

export async function getOpportunities(
  filters?: OpportunityFilters,
): Promise<OpportunitiesResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const page = filters?.page ?? 1;
    const pageSize = filters?.page_size ?? PAGINATION.DEFAULT_PAGE_SIZE;
    const [from, to] = toRange(page, pageSize);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase
      .from('opportunities')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    // Hide expired by default — only show upcoming or rolling deadlines
    if (!filters?.show_expired) {
      const today = new Date().toISOString().split('T')[0]!;
      q = q.or(`deadline.is.null,deadline.gte.${today}`);
    }

    if (filters?.types?.length) q = q.in('type', filters.types);
    else if (filters?.type) q = q.eq('type', filters.type);
    if (filters?.regions?.length) q = q.overlaps('regions', filters.regions);
    else if (filters?.region) q = q.contains('regions', [filters.region]);
    if (filters?.field) q = q.contains('fields', [filters.field]);
    if (filters?.education_level) q = q.contains('target_audience', [filters.education_level]);
    if (filters?.is_fully_funded) q = q.eq('is_fully_funded', true);
    if (filters?.deadline_before) q = q.lte('deadline', filters.deadline_before);
    if (filters?.search_query) q = q.textSearch('fts', filters.search_query, { type: 'websearch' });

    const { data, error, count } = await q
      .order('deadline', { ascending: true, nullsFirst: false })
      .order('completeness_score', { ascending: false })
      .range(from, to);

    if (error) {
      if (filters?.search_query) return getOpportunitiesIlikeFallback(filters);
      return dbError('DB_ERROR', error.message);
    }

    return { data: { opportunities: (data ?? []) as Opportunity[], count: count ?? 0 }, error: null };
  } catch (err) {
    return dbError('UNEXPECTED', err instanceof Error ? err.message : String(err));
  }
}

/** FTS fallback when the fts column is unavailable — uses ilike on title. */
async function getOpportunitiesIlikeFallback(filters: OpportunityFilters): Promise<OpportunitiesResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const page = filters.page ?? 1;
    const pageSize = filters.page_size ?? PAGINATION.DEFAULT_PAGE_SIZE;
    const [from, to] = toRange(page, pageSize);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase
      .from('opportunities')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .ilike('title', `%${filters.search_query ?? ''}%`);

    // Hide expired by default — only show upcoming or rolling deadlines
    if (!filters.show_expired) {
      const today = new Date().toISOString().split('T')[0]!;
      q = q.or(`deadline.is.null,deadline.gte.${today}`);
    }

    if (filters.types?.length) q = q.in('type', filters.types);
    else if (filters.type) q = q.eq('type', filters.type);
    if (filters.regions?.length) q = q.overlaps('regions', filters.regions);
    else if (filters.region) q = q.contains('regions', [filters.region]);
    if (filters.field) q = q.contains('fields', [filters.field]);
    if (filters.education_level) q = q.contains('target_audience', [filters.education_level]);
    if (filters.is_fully_funded) q = q.eq('is_fully_funded', true);
    if (filters.deadline_before) q = q.lte('deadline', filters.deadline_before);

    const { data, error, count } = await q
      .order('deadline', { ascending: true, nullsFirst: false })
      .order('completeness_score', { ascending: false })
      .range(from, to);

    if (error) return dbError('DB_ERROR', error.message);
    return { data: { opportunities: (data ?? []) as Opportunity[], count: count ?? 0 }, error: null };
  } catch (err) {
    return dbError('UNEXPECTED', err instanceof Error ? err.message : String(err));
  }
}

export async function getOpportunityBySlug(slug: string): Promise<Result<Opportunity>> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    if (error) return dbError('DB_ERROR', error.message);
    if (!data) return dbError('NOT_FOUND', `Opportunity not found: ${slug}`);
    return { data: data as Opportunity, error: null };
  } catch (err) {
    return dbError('UNEXPECTED', err instanceof Error ? err.message : String(err));
  }
}

export async function getFeaturedOpportunities(limit = 6): Promise<Result<Opportunity[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    const today = new Date().toISOString().split('T')[0]!;

    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('status', 'active')
      .gte('deadline', today)
      .order('completeness_score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return dbError('DB_ERROR', error.message);
    return { data: (data ?? []) as Opportunity[], error: null };
  } catch (err) {
    return dbError('UNEXPECTED', err instanceof Error ? err.message : String(err));
  }
}

export async function getRecommendedOpportunities(
  regions: string[],
  types: string[],
  savedIds: string[],
  limit = 6,
): Promise<Result<Opportunity[]>> {
  if (regions.length === 0 && types.length === 0) {
    return { data: [], error: null };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const today = new Date().toISOString().split('T')[0]!;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase
      .from('opportunities')
      .select('*')
      .eq('status', 'active')
      .or(`deadline.is.null,deadline.gte.${today}`);

    // Match EITHER a preferred type OR a preferred region
    if (types.length > 0 && regions.length > 0) {
      const formatRegions = `{${regions.join(',')}}`;
      q = q.or(`type.in.(${types.join(',')}),regions.ov.(${formatRegions})`);
    } else if (types.length > 0) {
      q = q.in('type', types);
    } else {
      q = q.overlaps('regions', regions);
    }

    if (savedIds.length > 0) {
      q = q.not('id', 'in', `(${savedIds.join(',')})`);
    }

    const { data, error } = await q
      .order('completeness_score', { ascending: false })
      .order('deadline', { ascending: true, nullsFirst: false })
      .limit(limit);

    if (error) return dbError('DB_ERROR', error.message);
    return { data: (data ?? []) as Opportunity[], error: null };
  } catch (err) {
    return dbError('UNEXPECTED', err instanceof Error ? err.message : String(err));
  }
}

export async function getOpportunityTypes(): Promise<Result<TypeCount[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('opportunities')
      .select('type')
      .eq('status', 'active');

    if (error) return dbError('DB_ERROR', error.message);

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      const t = (row as { type: string }).type;
      counts[t] = (counts[t] ?? 0) + 1;
    }

    return {
      data: Object.entries(counts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      error: null,
    };
  } catch (err) {
    return dbError('UNEXPECTED', err instanceof Error ? err.message : String(err));
  }
}
