import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getProfile } from '@/services/profile-service';
import { getSavedOpportunities, DASHBOARD_PAGE_SIZE } from '@/services/saved-service-server';
import { getRecommendedOpportunities } from '@/services/opportunity-service';
import { OpportunityCard } from '@/components/features/opportunity-card';
import { SaveButtonBulk } from '@/components/features/save-button-bulk';
import { ProfileMatchingForm, type ProfileMatchingData } from '@/components/features/profile-matching-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard — YouthAtlas',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function parsePage(sp: Record<string, string | string[] | undefined>): number {
  return typeof sp.page === 'string' ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DashboardPagination({ page, totalCount }: { page: number; totalCount: number }) {
  const totalPages = Math.ceil(totalCount / DASHBOARD_PAGE_SIZE);
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      {hasPrev ? (
        <Link
          href={`/dashboard?page=${page - 1}`}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A2E] transition-colors hover:bg-slate-50"
        >
          ← Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-slate-100 px-4 py-2.5 text-sm font-medium text-slate-300">
          ← Previous
        </span>
      )}
      <span className="text-sm text-text-secondary">
        Page {page} of {totalPages}
      </span>
      {hasNext ? (
        <Link
          href={`/dashboard?page=${page + 1}`}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A2E] transition-colors hover:bg-slate-50"
        >
          Next →
        </Link>
      ) : (
        <span className="rounded-lg border border-slate-100 px-4 py-2.5 text-sm font-medium text-slate-300">
          Next →
        </span>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const page = parsePage(searchParams);

  const [profileResult, savedResult] = await Promise.all([
    getProfile(user.id),
    getSavedOpportunities(user.id, page),
  ]);

  const profile = profileResult.data ?? {
    id: user.id,
    email: user.email ?? '',
    display_name: null,
    regions_of_interest: [] as string[],
    types_of_interest: [] as string[],
    created_at: '',
    updated_at: '',
  };

  const { data: prefData } = await supabase
    .from('user_profiles')
    .select('display_name, date_of_birth, country_of_citizenship, country_of_citizenship_2, digest_frequency, digest_keywords, types_of_interest, regions_of_interest')
    .eq('id', user.id)
    .single();

  const profileMatchingData: ProfileMatchingData = {
    display_name:           (prefData?.display_name as string)             ?? null,
    date_of_birth:          (prefData?.date_of_birth as string)            ?? null,
    country_of_citizenship: (prefData?.country_of_citizenship as string)   ?? null,
    country_of_citizenship_2: (prefData?.country_of_citizenship_2 as string) ?? null,
    types_of_interest:      (prefData?.types_of_interest as string[])      ?? [],
    regions_of_interest:    (prefData?.regions_of_interest as string[])    ?? [],
    digest_keywords:        (prefData?.digest_keywords as string[])        ?? [],
    digest_frequency:       ((prefData?.digest_frequency as 'weekly' | 'biweekly') ?? 'weekly'),
  };

  const savedOpps = savedResult.data?.data ?? [];
  const savedCount = savedResult.data?.count ?? 0;

  const savedIds = savedResult.data?.data.map((opp) => opp.id) ?? [];
  const { data: recommended } = await getRecommendedOpportunities(
    profile.regions_of_interest,
    profile.types_of_interest,
    savedIds,
    6,
  );

  const hasPreferences =
    profile.regions_of_interest.length > 0 || profile.types_of_interest.length > 0;

  const prefSet = typeof searchParams.pref_set === 'string' ? searchParams.pref_set : null;
  const prefLabels: Record<string, string> = {
    scholarship: 'Scholarships', fellowship: 'Fellowships', grant: 'Grants',
    internship: 'Internships', conference: 'Conferences', competition: 'Competitions', training: 'Training',
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[#1A1A2E] sm:text-3xl">Dashboard</h1>
      </div>

      {/* ── Pref-set confirmation banner (from onboarding email click) ────── */}
      {prefSet && prefLabels[prefSet] && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span className="text-base">✅</span>
          <span>
            <strong>{prefLabels[prefSet]}</strong> added to your interests — your weekly digest will now include matching opportunities.
          </span>
        </div>
      )}

      {/* ── Recommended for You ──────────────────────────────────────────── */}
      <section className="mt-10">
        {!hasPreferences ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <h2 className="font-display text-xl font-semibold text-[#1A1A2E]">
              Get Personalized Recommendations
            </h2>
            <p className="mt-2 text-text-secondary">
              Set your interests in your profile below to see opportunities matched to you.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-3">
              <h2 className="font-display text-xl font-semibold text-[#1A1A2E]">
                Recommended for You
              </h2>
              <span className="text-sm text-text-secondary">Based on your interests</span>
            </div>

            {recommended && recommended.length > 0 ? (
              <SaveButtonBulk>
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {recommended.map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                  ))}
                </div>
              </SaveButtonBulk>
            ) : (
              <p className="mt-4 text-text-secondary">
                No new matches right now. We&apos;ll keep looking!
              </p>
            )}
          </>
        )}
      </section>

      {/* ── Saved Opportunities ──────────────────────────────────────────── */}
      <section className="mt-10">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-semibold text-[#1A1A2E]">
            Saved Opportunities
          </h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
            {savedCount}
          </span>
        </div>

        {savedOpps.length === 0 ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-text-secondary">
              You haven&apos;t saved any opportunities yet.
            </p>
            <Link
              href="/opportunities"
              className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary-dark"
            >
              Browse opportunities to find ones you like →
            </Link>
          </div>
        ) : (
          <>
            <SaveButtonBulk>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedOpps.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            </SaveButtonBulk>
            <DashboardPagination page={page} totalCount={savedCount} />
          </>
        )}
      </section>

      {/* ── Profile & Matching Settings ──────────────────────────────────── */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold text-[#1A1A2E]">
            Profile & Matching
          </h2>
          <span className="text-xs text-slate-400">Changes apply to your next digest</span>
        </div>
        <div className="mt-6">
          <ProfileMatchingForm initial={profileMatchingData} />
        </div>
      </section>
    </div>
  );
}
