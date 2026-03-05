import { createClient } from '@/lib/supabase/client';
import type { AppError, Result } from '@/types/opportunity';

// ── Helpers ───────────────────────────────────────────────────────────────────

function dbError(message: string): { data: null; error: AppError } {
  return { data: null, error: { code: 'DB_ERROR', message } };
}

// ── Exports ───────────────────────────────────────────────────────────────────

/** Fetch all opportunity IDs saved by the current user. */
export async function getSavedOpportunityIds(): Promise<Result<string[]>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('saved_opportunities')
      .select('opportunity_id');

    if (error) return dbError(error.message);

    const ids = (data ?? []).map((row) => (row as { opportunity_id: string }).opportunity_id);
    return { data: ids, error: null };
  } catch (err) {
    return dbError(err instanceof Error ? err.message : String(err));
  }
}

/** Save an opportunity for the current user. */
export async function saveOpportunity(opportunityId: string): Promise<Result<null>> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return dbError('Not authenticated');

    const { error } = await supabase
      .from('saved_opportunities')
      .insert({ opportunity_id: opportunityId, user_id: user.id });

    if (error) return dbError(error.message);
    return { data: null, error: null };
  } catch (err) {
    return dbError(err instanceof Error ? err.message : String(err));
  }
}

/** Remove a saved opportunity for the current user. */
export async function unsaveOpportunity(opportunityId: string): Promise<Result<null>> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('saved_opportunities')
      .delete()
      .eq('opportunity_id', opportunityId);

    if (error) return dbError(error.message);
    return { data: null, error: null };
  } catch (err) {
    return dbError(err instanceof Error ? err.message : String(err));
  }
}

/** Check whether a single opportunity is saved by the current user. */
export async function isOpportunitySaved(opportunityId: string): Promise<Result<boolean>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('saved_opportunities')
      .select('opportunity_id')
      .eq('opportunity_id', opportunityId)
      .maybeSingle();

    if (error) return dbError(error.message);
    return { data: data !== null, error: null };
  } catch (err) {
    return dbError(err instanceof Error ? err.message : String(err));
  }
}
