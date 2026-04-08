import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DigestPreferencesForm, type DigestPrefs } from '@/components/features/digest-preferences-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Digest Preferences — YouthAtlas',
};

export default async function DigestPreferencesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/preferences');
  }

  // Fetch current preferences
  const { data } = await supabase
    .from('user_profiles')
    .select('types_of_interest, regions_of_interest, digest_frequency, digest_keywords, country_of_citizenship')
    .eq('id', user.id)
    .single();

  const initial: DigestPrefs = {
    digest_frequency: (data?.digest_frequency as 'weekly' | 'biweekly') ?? 'weekly',
    digest_keywords:  (data?.digest_keywords  as string[])              ?? [],
    types_of_interest:   (data?.types_of_interest   as string[])        ?? [],
    regions_of_interest: (data?.regions_of_interest as string[])        ?? [],
    country_of_citizenship: (data?.country_of_citizenship as string) ?? null,
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1A1A2E] transition-colors"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mt-4 mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
          Digest Preferences
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Control what goes into your personalized weekly digest. More signal = better matches.
        </p>
      </div>

      {/* Form */}
      <DigestPreferencesForm initial={initial} />

    </div>
  );
}
