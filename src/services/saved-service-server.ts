import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Opportunity, AppError, Result } from '@/types/opportunity';
import { OPPORTUNITY_COLUMNS } from '@/services/opportunity-service';

// ── Constants ─────────────────────────────────────────────────────────────────

export const DASHBOARD_PAGE_SIZE = 12;

// ── Helpers ────────────────────────────────────────────────────────────────────

function dbError(message: string): { data: null; error: AppError } {
  return { data: null, error: { code: 'DB_ERROR', message } };
}

// ── Exports ───────────────────────────────────────────────────────────────────

/**
 * Fetch full Opportunity objects saved by a user, ordered by saved_at DESC.
 * Uses two queries to avoid PostgREST join ambiguity and preserve sort order.
 */
export async function getSavedOpportunities(
  userId: string,
  page = 1,
): Promise<Result<{ data: Opportunity[]; count: number }>> {
  try {
    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * DASHBOARD_PAGE_SIZE;
    const to = from + DASHBOARD_PAGE_SIZE - 1;

    // Step 1: paginate saved IDs ordered by saved_at DESC
    const { data: savedRows, error: savedError, count } = await supabase
      .from('saved_opportunities')
      .select('opportunity_id', { count: 'exact' })
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })
      .range(from, to);

    if (savedError) return dbError(savedError.message);
    if (!savedRows || savedRows.length === 0) {
      return { data: { data: [], count: count ?? 0 }, error: null };
    }

    const ids = savedRows.map((r) => (r as { opportunity_id: string }).opportunity_id);

    // Step 2: fetch full opportunity records for those IDs
    const { data: opps, error: oppsError } = await supabase
      .from('opportunities')
      .select(OPPORTUNITY_COLUMNS)
      .in('id', ids);

    if (oppsError) return dbError(oppsError.message);

    // Re-sort to match saved_at order from step 1
    const oppMap = new Map(
      (opps ?? []).map((o) => [(o as Opportunity).id, o as Opportunity]),
    );
    const ordered = ids
      .map((id) => oppMap.get(id))
      .filter((o): o is Opportunity => o !== undefined);

    return { data: { data: ordered, count: count ?? 0 }, error: null };
  } catch (err) {
    return dbError(err instanceof Error ? err.message : String(err));
  }
}
