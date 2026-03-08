import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/openai';
import { SEARCH, PAGINATION } from '@/config/constants';
import type { Opportunity, AppError, Result } from '@/types/opportunity';

type SearchResult = Result<{ opportunities: Opportunity[]; count: number }>;

// Shape of rows returned by the search_opportunities_semantic RPC
type SemanticRow = { id: string; slug: string; similarity: number };

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

    // ── Tier 1: Semantic search (pgvector) ───────────────────────────────────
    // Falls through to Tier 2 silently on any embedding or RPC failure,
    // or when 0 semantically similar results are found.

    const embeddingResult = await generateEmbedding(trimmed);

    if (embeddingResult.data) {
      const embedding = embeddingResult.data;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rpcRaw, error: rpcError } = await (supabase.rpc(
        'search_opportunities_semantic',
        { query_embedding: embedding, match_threshold: 0.5, match_count: 20 },
      ) as any) as { data: SemanticRow[] | null; error: { message: string } | null };

      if (!rpcError && rpcRaw && rpcRaw.length > 0) {
        const slugs = rpcRaw.map((r) => r.slug);

        const { data: fullData, error: fullError } = await supabase
          .from('opportunities')
          .select('*')
          .in('slug', slugs)
          .eq('status', 'active');

        if (!fullError && fullData && fullData.length > 0) {
          // Re-sort by similarity score (slug fetch doesn't preserve RPC order)
          const simMap = new Map<string, number>(rpcRaw.map((r) => [r.slug, r.similarity]));
          const sorted = [...fullData].sort((a, b) => {
            const aSlug = (a as { slug: string }).slug;
            const bSlug = (b as { slug: string }).slug;
            return (simMap.get(bSlug) ?? 0) - (simMap.get(aSlug) ?? 0);
          });

          return {
            data: { opportunities: sorted as Opportunity[], count: sorted.length },
            error: null,
          };
        }
      }
    }

    // ── Tier 2: Full-text search (FTS) ────────────────────────────────────────
    // Runs when semantic returns 0 results or embedding generation failed.

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

    // ── Tier 3: ilike fallback ────────────────────────────────────────────────
    // Runs only when the FTS column is unavailable (ftsError is set).

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
