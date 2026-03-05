import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getServerEnv } from '@/config/env';

/**
 * POST /api/auth/profile
 *
 * Called by the login form after successful OTP verification.
 * Upserts a row in user_profiles for the authenticated user.
 * Uses the service role key to bypass RLS on first insert.
 */
export async function POST() {
  try {
    // Verify the request comes from an authenticated user
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use service role to bypass RLS — safe because we verified the JWT above
    const env = getServerEnv();
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      env.SUPABASE_SERVICE_KEY,
    );

    const { error } = await serviceClient
      .from('user_profiles')
      .upsert(
        { id: user.id, email: user.email ?? '' },
        { onConflict: 'id', ignoreDuplicates: true },
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 },
    );
  }
}
