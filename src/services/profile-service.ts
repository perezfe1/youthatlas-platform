import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AppError, Result } from '@/types/opportunity';

// ── Types ──────────────────────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  email: string;
  display_name: string | null;
  regions_of_interest: string[];
  types_of_interest: string[];
  country_of_citizenship: string | null;
  country_of_citizenship_2: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdateData = {
  display_name?: string | null;
  regions_of_interest?: string[];
  types_of_interest?: string[];
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function dbError(message: string): { data: null; error: AppError } {
  return { data: null, error: { code: 'DB_ERROR', message } };
}

// ── Exports ───────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Result<UserProfile>> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, display_name, regions_of_interest, types_of_interest, country_of_citizenship, country_of_citizenship_2, date_of_birth, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) return dbError(error.message);
    if (!data) return dbError('Profile not found');
    return { data: data as UserProfile, error: null };
  } catch (err) {
    return dbError(err instanceof Error ? err.message : String(err));
  }
}

export async function updateProfile(
  userId: string,
  updateData: ProfileUpdateData,
): Promise<Result<null>> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('user_profiles')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) return dbError(error.message);
    return { data: null, error: null };
  } catch (err) {
    return dbError(err instanceof Error ? err.message : String(err));
  }
}
