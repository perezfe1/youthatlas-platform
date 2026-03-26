import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PAGINATION } from '@/config/constants';
import type { Opportunity, OpportunityFilters, AppError, Result } from '@/types/opportunity';

// ── Column list ───────────────────────────────────────────────────────────────
// Never select('*') on opportunities — the embedding column is vector(1536) ≈ 6 KB/row.
// Import this constant in other service files that query the opportunities table.
export const OPPORTUNITY_COLUMNS = [
  'id',
  'slug',
  'title',
  'description',
  'summary',
  'type',
  'organization',
  'regions',
  'target_audience',
  'is_fully_funded',
  'deadline',
  'apply_url',
  'source_url',
  'completeness_score',
  'status',
  'source_site',
  'scraped_at',
  'created_at',
  'updated_at',
  'fts',
].join(',');

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
      .select(OPPORTUNITY_COLUMNS, { count: 'exact' })
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
      .select(OPPORTUNITY_COLUMNS, { count: 'exact' })
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
      .select(OPPORTUNITY_COLUMNS)
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
      .select(OPPORTUNITY_COLUMNS)
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
      .select(OPPORTUNITY_COLUMNS)
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

// Shape of rows returned by the search_opportunities_semantic RPC
type SemanticRow = { id: string; slug: string; similarity: number };

/**
 * Find opportunities similar to the one identified by `slug` using pgvector.
 * Fetches the opportunity's embedding, calls the semantic RPC, excludes the
 * source opportunity, and returns full records sorted by similarity.
 * Never throws — returns empty array on any failure so the detail page is unaffected.
 */
export async function getSimilarOpportunities(
  slug: string,
  limit = 4,
): Promise<Result<Opportunity[]>> {
  try {
    const supabase = await createServerSupabaseClient();

    // Step 1: Fetch this opportunity's embedding vector
    const { data: row, error: fetchErr } = await supabase
      .from('opportunities')
      .select('id, embedding')
      .eq('slug', slug)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    if (fetchErr || !row) return { data: [], error: null };

    const embedding = (row as Record<string, unknown>).embedding;
    if (!embedding) return { data: [], error: null };

    // Embedding may come as a string from PostgREST — parse if needed
    const embeddingArray: number[] =
      typeof embedding === 'string' ? JSON.parse(embedding) : (embedding as number[]);

    // Step 2: Find similar via pgvector RPC
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rpcRaw, error: rpcError } = (await (supabase.rpc(
      'search_opportunities_semantic',
      { query_embedding: embeddingArray, match_threshold: 0.4, match_count: limit + 1 },
    ) as any)) as { data: SemanticRow[] | null; error: { message: string } | null };

    if (rpcError || !rpcRaw || rpcRaw.length === 0) return { data: [], error: null };

    // Filter out the source opportunity and limit results
    const slugs = rpcRaw
      .filter((r) => r.slug !== slug)
      .slice(0, limit)
      .map((r) => r.slug);

    if (slugs.length === 0) return { data: [], error: null };

    // Step 3: Fetch full opportunity records
    const { data: opps, error: oppsErr } = await supabase
      .from('opportunities')
      .select(OPPORTUNITY_COLUMNS)
      .in('slug', slugs)
      .eq('status', 'active');

    if (oppsErr) return { data: [], error: null };

    // Re-sort by similarity (slug fetch doesn't preserve RPC order)
    const simMap = new Map(rpcRaw.map((r) => [r.slug, r.similarity]));
    const sorted = [...(opps ?? [])].sort((a, b) => {
      const aSlug = (a as { slug: string }).slug;
      const bSlug = (b as { slug: string }).slug;
      return (simMap.get(bSlug) ?? 0) - (simMap.get(aSlug) ?? 0);
    });

    return { data: sorted as Opportunity[], error: null };
  } catch {
    // Never break the detail page — graceful empty fallback
    return { data: [], error: null };
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
