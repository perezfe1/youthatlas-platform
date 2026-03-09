import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { FeaturedListing, FeaturedSubmission } from '@/types/featured';
import type { AppError, Result } from '@/types/opportunity';

// ── Helpers ──────────────────────────────────────────────────────────────────

function dbError(code: string, message: string): { data: null; error: AppError } {
  return { data: null, error: { code, message } };
}

// DB row → camelCase
function toFeaturedListing(row: Record<string, unknown>): FeaturedListing {
  return {
    id: row.id as string,
    orgName: row.org_name as string,
    contactEmail: row.contact_email as string,
    opportunityTitle: row.opportunity_title as string,
    opportunityUrl: row.opportunity_url as string,
    opportunityDescription: (row.opportunity_description as string) ?? null,
    message: (row.message as string) ?? null,
    isActive: row.is_active as boolean,
    activatedAt: (row.activated_at as string) ?? null,
    expiresAt: (row.expires_at as string) ?? null,
    createdAt: row.created_at as string,
  };
}

// ── Exports ──────────────────────────────────────────────────────────────────

export async function getActiveFeaturedListings(): Promise<Result<FeaturedListing[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('featured_listings')
      .select('*')
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('activated_at', { ascending: true });

    if (error) return dbError('DB_ERROR', error.message);
    return { data: (data ?? []).map(toFeaturedListing), error: null };
  } catch (err) {
    return dbError('UNEXPECTED', err instanceof Error ? err.message : String(err));
  }
}

export async function submitFeaturedListing(
  submission: FeaturedSubmission,
): Promise<Result<FeaturedListing>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from('featured_listings')
      .insert({
        org_name: submission.orgName,
        contact_email: submission.contactEmail,
        opportunity_title: submission.opportunityTitle,
        opportunity_url: submission.opportunityUrl,
        opportunity_description: submission.opportunityDescription ?? null,
        message: submission.message ?? null,
      });

    if (error) return dbError('DB_ERROR', error.message);

    // Build a minimal response from input data — no .select() needed,
    // which avoids the RLS SELECT policy requirement for anon inserts.
    const inserted: FeaturedListing = {
      id: 'pending',
      orgName: submission.orgName,
      contactEmail: submission.contactEmail,
      opportunityTitle: submission.opportunityTitle,
      opportunityUrl: submission.opportunityUrl,
      opportunityDescription: submission.opportunityDescription ?? null,
      message: submission.message ?? null,
      isActive: false,
      activatedAt: null,
      expiresAt: null,
      createdAt: new Date().toISOString(),
    };
    return { data: inserted, error: null };
  } catch (err) {
    return dbError('UNEXPECTED', err instanceof Error ? err.message : String(err));
  }
}
