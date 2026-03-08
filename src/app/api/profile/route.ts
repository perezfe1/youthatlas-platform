import { type NextRequest, NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateProfile } from '@/services/profile-service';
import { validateOrigin, corsHeaders, withCors } from '@/lib/api-security';
import { profileLimit, rateLimitHeaders } from '@/lib/rate-limiter';
import { profileUpdateSchema, validateBody } from '@/lib/validation';

// ── OPTIONS /api/profile — CORS preflight ──────────────────────────────────────

export function OPTIONS(request: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin') ?? undefined),
  });
}

// ── POST /api/profile ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Origin validation
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Rate limit by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rl = profileLimit.check(ip);
  const rlHeaders = rateLimitHeaders(rl);

  if (!rl.allowed) {
    return withCors(
      NextResponse.json(
        { error: 'Too many requests. Try again later.' },
        { status: 429, headers: rlHeaders },
      ),
      request,
    );
  }

  try {
    // Verify auth
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return withCors(
        NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401, headers: rlHeaders },
        ),
        request,
      );
    }

    // Validate body
    const validation = await validateBody(request, profileUpdateSchema);
    if (validation.error) {
      return withCors(
        NextResponse.json(
          { error: validation.error.message },
          { status: 400, headers: rlHeaders },
        ),
        request,
      );
    }

    const { display_name, regions_of_interest, types_of_interest } =
      validation.data;

    const result = await updateProfile(user.id, {
      ...(display_name !== undefined ? { display_name } : {}),
      ...(regions_of_interest !== undefined ? { regions_of_interest } : {}),
      ...(types_of_interest !== undefined ? { types_of_interest } : {}),
    });

    if (result.error) {
      console.error('[profile] updateProfile error:', result.error);
      return withCors(
        NextResponse.json(
          { error: 'An error occurred. Please try again.' },
          { status: 500, headers: rlHeaders },
        ),
        request,
      );
    }

    return withCors(
      NextResponse.json({ ok: true }, { headers: rlHeaders }),
      request,
    );
  } catch (err) {
    console.error('[profile] Unexpected error:', err);
    return withCors(
      NextResponse.json(
        { error: 'An error occurred. Please try again.' },
        { status: 500, headers: rlHeaders },
      ),
      request,
    );
  }
}
