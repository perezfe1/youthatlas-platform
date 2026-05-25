import { NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getProfile } from '@/services/profile-service';
import { getRecommendedOpportunities } from '@/services/opportunity-service';

/**
 * GET /api/recommendations
 *
 * Returns personalized opportunity recommendations for the logged-in user.
 * Called client-side from the homepage so the homepage itself can be ISR-cached.
 * Returns [] for anonymous visitors or users with no profile preferences set.
 */
export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ opportunities: [] });
  }

  const profileResult = await getProfile(user.id);
  if (!profileResult.data) {
    return NextResponse.json({ opportunities: [] });
  }

  const { regions_of_interest, types_of_interest } = profileResult.data;
  if (regions_of_interest.length === 0 && types_of_interest.length === 0) {
    return NextResponse.json({ opportunities: [] });
  }

  const recResult = await getRecommendedOpportunities(
    regions_of_interest,
    types_of_interest,
    [],
    6,
  );

  return NextResponse.json(
    { opportunities: recResult.data ?? [] },
    { headers: { 'Cache-Control': 'private, max-age=300' } },
  );
}
