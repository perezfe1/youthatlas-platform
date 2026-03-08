import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getServerEnv } from '@/config/env';
import { validateOrigin, corsHeaders, withCors } from '@/lib/api-security';

/**
 * POST /api/auth/profile
 *
 * Called by the login form after successful OTP verification.
 * Upserts a row in user_profiles for the authenticated user.
 * Uses the service role key to bypass RLS on first insert.
 */

// ── OPTIONS /api/auth/profile — CORS preflight ────────────────────────────────

export function OPTIONS(request: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin') ?? undefined),
  });
}

// ── POST /api/auth/profile ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Origin validation
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Verify the request comes from an authenticated user
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return withCors(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        request,
      );
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
      return withCors(
        NextResponse.json({ error: error.message }, { status: 500 }),
        request,
      );
    }

    return withCors(NextResponse.json({ ok: true }), request);
  } catch (err) {
    return withCors(
      NextResponse.json(
        { error: err instanceof Error ? err.message : 'Unexpected error' },
        { status: 500 },
      ),
      request,
    );
  }
}
