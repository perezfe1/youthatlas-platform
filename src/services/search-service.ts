import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SEARCH, PAGINATION } from '@/config/constants';
import type { Opportunity, AppError, Result } from '@/types/opportunity';

type SearchResult = Result<{ opportunities: Opportunity[]; count: number }>;

function dbError(code: string, message: string): { data: null; error: AppError } {
  return { data: null, error: { code, message } };
}

export async function searchOpportunities(query: string, page = 1): Promise<SearchResult> {
  const trimmed = query.trim();

  if (trimmed.length < SEARCH.MIN_QUERY_LENGTH) {
    return { data: { opportunities: [], count: 0 }, error: null };
  }

  const pageSize = PAGINATION.DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = await createServerSupabaseClient();

    // Attempt 1: Postgres full-text search
    const { data: ftsData, error: ftsError, count: ftsCount } = await supabase
      .from('opportunities')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .textSearch('fts', trimmed, { type: 'websearch' })
      .order('deadline', { ascending: true, nullsFirst: false })
      .range(from, to);

    if (!ftsError) {
      return {
        data: { opportunities: (ftsData ?? []) as Opportunity[], count: ftsCount ?? 0 },
        error: null,
      };
    }

    // Attempt 2: ilike fallback when fts column is unavailable
    const safe = trimmed.replace(/'/g, "''");
    const { data, error, count } = await supabase
      .from('opportunities')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .or(`title.ilike.%${safe}%,description.ilike.%${safe}%,organization.ilike.%${safe}%`)
      .order('deadline', { ascending: true, nullsFirst: false })
      .range(from, to);

    if (error) return dbError('DB_ERROR', error.message);
    return {
      data: { opportunities: (data ?? []) as Opportunity[], count: count ?? 0 },
      error: null,
    };
  } catch (err) {
    return dbError('UNEXPECTED', err instanceof Error ? err.message : String(err));
  }
}
