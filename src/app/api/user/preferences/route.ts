import { type NextRequest, NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { validateOrigin, corsHeaders, withCors } from '@/lib/api-security';
import { profileLimit, rateLimitHeaders } from '@/lib/rate-limiter';
import { digestPreferencesSchema, validateBody } from '@/lib/validation';

export const dynamic = 'force-dynamic';

// ── OPTIONS — CORS preflight ──────────────────────────────────────────────────

export function OPTIONS(request: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin') ?? undefined),
  });
}

// ── GET /api/user/preferences ─────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('types_of_interest, regions_of_interest, digest_frequency, digest_keywords, country_of_citizenship')
      .eq('id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? {});
  } catch (err) {
    console.error('[preferences] GET error:', err);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

// ── PATCH /api/user/preferences ───────────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rl = profileLimit.check(ip);
  const rlHeaders = rateLimitHeaders(rl);

  if (!rl.allowed) {
    return withCors(
      NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: rlHeaders }),
      request,
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return withCors(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: rlHeaders }),
        request,
      );
    }

    const validation = await validateBody(request, digestPreferencesSchema);
    if (validation.error) {
      return withCors(
        NextResponse.json({ error: validation.error.message }, { status: 400, headers: rlHeaders }),
        request,
      );
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ ...validation.data, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      return withCors(
        NextResponse.json({ error: error.message }, { status: 500, headers: rlHeaders }),
        request,
      );
    }

    return withCors(
      NextResponse.json({ ok: true }, { headers: rlHeaders }),
      request,
    );
  } catch (err) {
    console.error('[preferences] PATCH error:', err);
    return withCors(
      NextResponse.json({ error: 'An error occurred' }, { status: 500 }),
      request,
    );
  }
}
