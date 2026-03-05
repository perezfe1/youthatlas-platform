import { NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { updateProfile } from '@/services/profile-service';
import { REGIONS, OPPORTUNITY_TYPES } from '@/types/opportunity';

export async function POST(request: Request) {
  try {
    // Verify auth
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 },
    );
  }
}
