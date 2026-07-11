import { type NextRequest, NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const VALID_TYPES = [
  'scholarship', 'fellowship', 'grant', 'internship',
  'conference', 'competition', 'training',
] as const;

type OpportunityType = typeof VALID_TYPES[number];

// ── GET /api/preferences/quick-set?type=scholarship ───────────────────────────
// One-click preference setter linked from onboarding emails. The target user
// is ALWAYS resolved from the authenticated session — never from a client-
// supplied userId. (Previously this trusted a ?userId= param and wrote with the
// service role, which let anyone edit any user's preferences.) A logged-out
// visitor is redirected to login and bounced back here afterwards.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as OpportunityType | null;

  const dashboardUrl = new URL('/dashboard', request.url);

  // Silently redirect if the type is invalid — never error-page the user.
  if (!type || !VALID_TYPES.includes(type)) {
    return NextResponse.redirect(dashboardUrl);
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Not signed in → send to login, preserving this link as the post-login next.
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `/api/preferences/quick-set?type=${type}`);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Read the session user's own profile (RLS: auth.uid() = id).
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('types_of_interest')
      .eq('id', user.id)
      .single();

    const existing = (profile?.types_of_interest as string[]) ?? [];

    if (!existing.includes(type)) {
      // Update runs as the authenticated user; RLS enforces auth.uid() = id,
      // so a user can only ever modify their own preferences.
      await supabase
        .from('user_profiles')
        .update({ types_of_interest: [...existing, type] })
        .eq('id', user.id);
    }
  } catch {
    // Non-fatal — still redirect to dashboard.
  }

  dashboardUrl.searchParams.set('pref_set', type);
  return NextResponse.redirect(dashboardUrl);
}
