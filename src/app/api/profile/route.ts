import { type NextRequest, NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateProfile } from '@/services/profile-service';
import { REGIONS, OPPORTUNITY_TYPES } from '@/types/opportunity';
import { validateOrigin, corsHeaders, withCors } from '@/lib/api-security';

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

  try {
    // Verify auth
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

    // Parse body
    const body = await request.json().catch(() => ({})) as {
      display_name?: string | null;
      regions_of_interest?: unknown;
      types_of_interest?: unknown;
    };

    // Validate and sanitise array fields
    const validatedRegions = Array.isArray(body.regions_of_interest)
      ? (body.regions_of_interest as string[]).filter((r) =>
          REGIONS.includes(r as (typeof REGIONS)[number]),
        )
      : undefined;

    const validatedTypes = Array.isArray(body.types_of_interest)
      ? (body.types_of_interest as string[]).filter((t) =>
          OPPORTUNITY_TYPES.includes(t as (typeof OPPORTUNITY_TYPES)[number]),
        )
      : undefined;

    const result = await updateProfile(user.id, {
      ...(body.display_name !== undefined ? { display_name: body.display_name } : {}),
      ...(validatedRegions !== undefined ? { regions_of_interest: validatedRegions } : {}),
      ...(validatedTypes !== undefined ? { types_of_interest: validatedTypes } : {}),
    });

    if (result.error) {
      return withCors(
        NextResponse.json({ error: result.error.message }, { status: 500 }),
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
