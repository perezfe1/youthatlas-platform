import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { DeadlineBadge } from '@/components/ui/deadline-badge';
import { OpportunityBadge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';
import { SaveButton } from '@/components/features/save-button';
import { ShareButton } from '@/components/features/share-button';
import { WhatsAppShareButton } from '@/components/features/whatsapp-share-button';
import { OpportunityCard } from '@/components/features/opportunity-card';
import { SaveButtonBulk } from '@/components/features/save-button-bulk';
import { getOpportunityBySlug, getSimilarOpportunities } from '@/services/opportunity-service';
import { formatDate } from '@/lib/utils';
import { safeJsonLd } from '@/components/seo/json-ld';
import type { Opportunity, OpportunityType } from '@/types/opportunity';

export const dynamic = 'force-dynamic';

// ── SEO ───────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await getOpportunityBySlug(params.slug);
  if (result.error) return { title: 'Opportunity | YouthAtlas' };
  const opp = result.data;
  const description = opp.summary || opp.description.slice(0, 160);
  return {
    title: `${opp.title} | YouthAtlas`,
    description,
    openGraph: {
      title: opp.title,
      description,
      images: [`/opportunities/${params.slug}/opengraph-image`],
      type: 'website',
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRegion(region: string): string {
  return region.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatEducationLevel(level: string): string {
  return level.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

// ── Sub-components ────────────────────────────────────────────────────────────

type BreadcrumbProps = { type: OpportunityType; title: string };

function Breadcrumb({ type, title }: BreadcrumbProps) {
  return (
    <nav className="mb-4 flex items-center gap-1.5 text-sm text-text-secondary" aria-label="Breadcrumb">
      <Link href="/opportunities" className="hover:text-text-primary transition-colors">
        Browse
      </Link>
      <span aria-hidden="true">›</span>
      <Link
        href={`/opportunities?type=${type}`}
        className="hover:text-text-primary capitalize transition-colors"
      >
        {type}
      </Link>
      <span aria-hidden="true">›</span>
      <span className="truncate text-text-primary max-w-[200px] sm:max-w-xs">
        {truncate(title, 45)}
      </span>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

type MainContentProps = { opp: Opportunity };

function MainContent({ opp }: MainContentProps) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#1A1A2E] leading-tight sm:text-4xl">
        {opp.title}
      </h1>

      {opp.organization && (
        <p className="mt-2 text-base text-text-secondary sm:text-lg">{opp.organization}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <OpportunityBadge label={opp.type} variant={opp.type} />
        <DeadlineBadge deadline={opp.deadline} />
        {opp.is_fully_funded && (
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            ✓ Fully Funded
          </span>
        )}
      </div>

      <div className="mt-8 text-base leading-relaxed text-text-secondary whitespace-pre-wrap">
        {opp.description || opp.summary || 'No description available.'}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

type KeyDetailsListProps = { opp: Opportunity };

function KeyDetailsList({ opp }: KeyDetailsListProps) {
  return (
    <ul className="mt-6 space-y-4 text-sm">
      {/* Deadline */}
      <li className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-base" aria-hidden="true">📅</span>
        <div>
          <span className="font-medium text-[#1A1A2E]">Deadline</span>
          <p className="text-text-secondary">
            {opp.is_rolling
              ? 'Rolling / No deadline'
              : opp.deadline
                ? formatDate(opp.deadline)
                : 'Rolling / No deadline'}
          </p>
        </div>
      </li>

      {/* Regions */}
      {opp.regions.length > 0 && (
        <li className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 text-base" aria-hidden="true">🌍</span>
          <div>
            <span className="font-medium text-[#1A1A2E]">Regions</span>
            <p className="text-text-secondary">
              {opp.regions.map(formatRegion).join(', ')}
            </p>
          </div>
        </li>
      )}

      {/* Target Audience */}
      {opp.target_audience.length > 0 && (
        <li className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 text-base" aria-hidden="true">👥</span>
          <div>
            <span className="font-medium text-[#1A1A2E]">For</span>
            <p className="text-text-secondary">
              {opp.target_audience.map(formatEducationLevel).join(', ')}
            </p>
          </div>
        </li>
      )}

      {/* Type */}
      <li className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-base" aria-hidden="true">🏷️</span>
        <div>
          <span className="font-medium text-[#1A1A2E]">Type</span>
          <p className="capitalize text-text-secondary">{opp.type}</p>
        </div>
      </li>

    </ul>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

type ApplyButtonProps = { opp: Opportunity; fullWidth?: boolean };

function ApplyButton({ opp, fullWidth }: ApplyButtonProps) {
  const widthClass = fullWidth ? 'w-full' : '';

  if (opp.application_url) {
    return (
      <a
        href={opp.application_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${widthClass} block rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-primary-dark`}
      >
        Apply Now →
      </a>
    );
  }

  if (opp.source_url) {
    return (
      <a
        href={opp.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${widthClass} block rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-primary-dark`}
      >
        Visit Source →
      </a>
    );
  }

  return (
    <button
      disabled
      className={`${widthClass} cursor-not-allowed rounded-lg bg-slate-200 px-6 py-3 text-center font-semibold text-slate-400`}
      type="button"
    >
      No Application Link
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

type ApplyCardProps = { opp: Opportunity };

function ApplyCard({ opp }: ApplyCardProps) {
  const pageUrl = `https://youthatlas.com/opportunities/${opp.slug}`;

  return (
    <div className="sticky top-24 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <ApplyButton opp={opp} fullWidth />
      <ShareButton title={opp.title} slug={opp.slug} />
      <WhatsAppShareButton title={opp.title} slug={opp.slug} />
      <div className="mt-3 flex items-center justify-center">
        <SaveButton opportunityId={opp.id} size="md" />
        <span className="ml-2 text-sm text-slate-500">Save for later</span>
      </div>
      <KeyDetailsList opp={opp} />
      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
          Share this opportunity
        </p>
        <CopyButton text={pageUrl} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

type MobileApplyBarProps = { opp: Opportunity };

function MobileApplyBar({ opp }: MobileApplyBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white p-4 lg:hidden">
      <div className="flex items-center gap-3">
        <ShareButton title={opp.title} slug={opp.slug} variant="compact" />
        <WhatsAppShareButton title={opp.title} slug={opp.slug} variant="compact" />
        <div className="flex-1">
          <ApplyButton opp={opp} fullWidth />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function OpportunityDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch main opportunity + similar in parallel
  const [result, similarResult] = await Promise.all([
    getOpportunityBySlug(params.slug),
    getSimilarOpportunities(params.slug, 4),
  ]);

  if (result.error) notFound();
  const opp = result.data;
  const similarOpps = similarResult.data ?? [];

  const oppUrl = `https://youthatlas.com/opportunities/${opp.slug}`;
  const oppJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Browse', item: 'https://youthatlas.com/opportunities' },
          { '@type': 'ListItem', position: 2, name: opp.type, item: `https://youthatlas.com/opportunities?type=${opp.type}` },
          { '@type': 'ListItem', position: 3, name: opp.title },
        ],
      },
      {
        '@type': 'WebPage',
        name: opp.title,
        description: opp.summary || opp.description.slice(0, 160),
        url: oppUrl,
        about: {
          '@type': 'Thing',
          name: opp.title,
          description: opp.summary || opp.description.slice(0, 300),
          ...(opp.organization && { provider: { '@type': 'Organization', name: opp.organization } }),
          ...(opp.deadline && { temporal: opp.deadline }),
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(oppJsonLd) }}
      />
      <div className="pb-24 lg:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main content — 2/3 width on lg+ */}
            <div className="lg:col-span-2">
              <Breadcrumb type={opp.type} title={opp.title} />
              <MainContent opp={opp} />
            </div>

            {/* Sidebar — 1/3 width, desktop only */}
            <aside className="mt-8 hidden lg:mt-0 lg:block">
              <ApplyCard opp={opp} />
            </aside>
          </div>

          {/* Mobile: inline apply card below content */}
          <div className="mt-8 lg:hidden">
            <ApplyCard opp={opp} />
          </div>
        </div>

        {/* Similar Opportunities */}
        {similarOpps.length > 0 && (
          <section className="border-t border-slate-100 bg-slate-50/50">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
              <h2 className="font-display text-xl font-semibold text-[#1A1A2E]">
                Similar Opportunities
              </h2>
              <SaveButtonBulk>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {similarOpps.map((similar) => (
                    <OpportunityCard key={similar.id} opportunity={similar} />
                  ))}
                </div>
              </SaveButtonBulk>
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile apply bar */}
      <MobileApplyBar opp={opp} />
    </>
  );
}
