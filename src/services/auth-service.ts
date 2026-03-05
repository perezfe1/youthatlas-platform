import type { User, Session } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/client';
import type { AppError, Result } from '@/types/opportunity';

// ── Helpers ───────────────────────────────────────────────────────────────────

function authError(message: string): { data: null; error: AppError } {
  return { data: null, error: { code: 'AUTH_ERROR', message } };
}

// ── Exports ───────────────────────────────────────────────────────────────────

/** Send a magic-link / OTP email. Creates user on first send. */
export async function signInWithOtp(email: string): Promise<Result<{ message: string }>> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) return authError(error.message);
    return { data: { message: 'Check your email for the login code.' }, error: null };
  } catch (err) {
    return authError(err instanceof Error ? err.message : String(err));
  }
}

/** Verify the 6-digit OTP and exchange it for a session. */
export async function verifyOtp(email: string, token: string): Promise<Result<{ user: User }>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) return authError(error.message);
    if (!data.user) return authError('Verification failed — no user returned.');
    return { data: { user: data.user }, error: null };
  } catch (err) {
    return authError(err instanceof Error ? err.message : String(err));
  }
}

/** Read the current session from local storage (browser only). */
export async function getSession(): Promise<Result<{ session: Session | null }>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) return authError(error.message);
    return { data: { session: data.session }, error: null };
  } catch (err) {
    return authError(err instanceof Error ? err.message : String(err));
  }
}

/** Get the current user (verifies JWT with Supabase Auth server). */
export async function getUser(): Promise<Result<{ user: User | null }>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return authError(error.message);
    return { data: { user: data.user }, error: null };
  } catch (err) {
    return authError(err instanceof Error ? err.message : String(err));
  }
}

/** Sign the current user out and clear their session. */
export async function signOut(): Promise<Result<null>> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) return authError(error.message);
    return { data: null, error: null };
  } catch (err) {
    return authError(err instanceof Error ? err.message : String(err));
  }
}
