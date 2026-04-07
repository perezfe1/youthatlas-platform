import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const VALID_TYPES = [
  'scholarship', 'fellowship', 'grant', 'internship',
  'conference', 'competition', 'training',
] as const;

type OpportunityType = typeof VALID_TYPES[number];

// ── GET /api/preferences/quick-set?type=scholarship&userId=xxx ────────────────
// One-click preference setter linked from onboarding emails.
// Uses service key because the user may not have an active browser session.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as OpportunityType | null;
  const userId = searchParams.get('userId');

  const dashboardUrl = new URL('/dashboard', request.url);

  // Silently redirect if params invalid — never error-page the user
  if (!type || !VALID_TYPES.includes(type) || !userId) {
    return NextResponse.redirect(dashboardUrl);
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );

    // Fetch existing preferences to avoid overwriting other types
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('types_of_interest')
      .eq('id', userId)
      .single();

    const existing = (profile?.types_of_interest as string[]) ?? [];

    // Only update if not already set
    if (!existing.includes(type)) {
      await supabase
        .from('user_profiles')
        .update({ types_of_interest: [...existing, type] })
        .eq('id', userId);
    }
  } catch {
    // Non-fatal — still redirect to dashboard
  }

  // Redirect with confirmation param so dashboard can show a toast
  dashboardUrl.searchParams.set('pref_set', type);
  return NextResponse.redirect(dashboardUrl);
}
