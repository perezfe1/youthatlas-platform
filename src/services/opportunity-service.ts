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
