import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { getOpportunities } from '@/services/opportunity-service';
import { OpportunityCard } from '@/components/features/opportunity-card';
import { SaveButtonBulk } from '@/components/features/save-button-bulk';
import {
  TYPE_SLUG_MAP,
  REGION_SLUG_MAP,
  REGION_DISPLAY,
  getTypeSeoData,
  getComboSeoData,
} from '@/config/seo';
import { safeJsonLd } from '@/components/seo/json-ld';
import { buildPageUrl } from '@/lib/filter-urls';

// ISR: re-render at most once per week. This page must NOT read
// searchParams (a dynamic API) — doing so silently opts it out of static
// serving and every crawler hit burns Fluid CPU. Page 1 renders here;
// pagination hands off to /opportunities/search (dynamic by design).
export const revalidate = 604800;
// Paths not returned by generateStaticParams automatically get 404
export const dynamicParams = false;

const SEO_PAGE_SIZE = 12;

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  const typeSlugs = Object.keys(TYPE_SLUG_MAP);
  const regionSlugs = Object.keys(REGION_SLUG_MAP);
  const params: { typeSlug: string; regionSlug: string }[] = [];

  for (const t of typeSlugs) {
    for (const r of regionSlugs) {
      params.push({ typeSlug: t, regionSlug: r });
    }
    params.push({ typeSlug: t, regionSlug: 'fully-funded' });
  }

  return params;
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  params: { typeSlug: string; regionSlug: string };
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = getComboSeoData(params.typeSlug, params.regionSlug);
  if (!seo) return { title: 'Not Found — YouthAtlas' };

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    openGraph: { title: seo.metaTitle, description: seo.metaDescription },
    // Old ?page=N URLs now serve this same static page — consolidate them.
    alternates: { canonical: `https://youthatlas.com/${params.typeSlug}/${params.regionSlug}` },
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Pagination({ nextUrl, totalCount }: { nextUrl: string; totalCount: number }) {
  const totalPages = Math.ceil(totalCount / SEO_PAGE_SIZE);
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      <span className="text-sm text-text-secondary">
        Page 1 of {totalPages}
      </span>
      <Link
        href={nextUrl}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1A1A2E] transition-colors hover:bg-slate-50"
      >
        Next →
      </Link>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TypeRegionPage({ params }: Props) {
  const { typeSlug, regionSlug } = params;

  // Validate type slug
  const typeValue = TYPE_SLUG_MAP[typeSlug];
  if (!typeValue) notFound();

  // 'fully-funded' is a special sub-path, not a region
  const isFullyFunded = regionSlug === 'fully-funded';
  const regionValue = isFullyFunded ? undefined : REGION_SLUG_MAP[regionSlug];
  if (!isFullyFunded && !(regionSlug in REGION_SLUG_MAP)) notFound();

  const seo = getComboSeoData(typeSlug, regionSlug);
  if (!seo) notFound();

  const typeSeo = getTypeSeoData(typeSlug)!;

  const result = await getOpportunities(
    isFullyFunded
      ? { type: typeValue, is_fully_funded: true, page: 1, page_size: SEO_PAGE_SIZE }
      : { type: typeValue, region: regionValue, page: 1, page_size: SEO_PAGE_SIZE },
  );
  const opportunities = result.data?.opportunities ?? [];
  const totalCount = result.data?.count ?? 0;
  const intro = seo.introTemplate.replace('{count}', totalCount.toLocaleString());

  const crumbLabel = isFullyFunded
    ? 'Fully Funded'
    : (REGION_DISPLAY[regionSlug] ?? regionSlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span aria-hidden="true">›</span>
        <Link href={`/${typeSlug}`} className="hover:text-primary">
          {typeSeo.pluralLabel}
        </Link>
        <span aria-hidden="true">›</span>
        <span className="text-text-primary">{crumbLabel}</span>
      </nav>

      {/* Heading + intro */}
      <h1 className="font-display text-2xl font-bold text-[#1A1A2E] sm:text-3xl">{seo.h1}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{intro}</p>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://youthatlas.com/' },
                  { '@type': 'ListItem', position: 2, name: typeSeo.pluralLabel, item: `https://youthatlas.com/${typeSlug}` },
                  { '@type': 'ListItem', position: 3, name: crumbLabel, item: `https://youthatlas.com/${typeSlug}/${regionSlug}` },
                ],
              },
              {
                '@type': 'CollectionPage',
                name: seo.h1,
                description: seo.metaDescription,
                url: `https://youthatlas.com/${typeSlug}/${regionSlug}`,
              },
            ],
          }),
        }}
      />

      {/* Cards */}
      {opportunities.length > 0 ? (
        <>
          <SaveButtonBulk>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </SaveButtonBulk>
          <Pagination
            nextUrl={buildPageUrl(
              isFullyFunded
                ? { types: [typeValue], is_fully_funded: true }
                : { types: [typeValue], regions: regionValue ? [regionValue] : undefined },
              2,
            )}
            totalCount={totalCount}
          />
        </>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-text-secondary">
            No {typeSeo.pluralLabel.toLowerCase()} found for this filter right now.
          </p>
          <Link
            href={`/${typeSlug}`}
            className="mt-4 inline-block text-sm text-primary hover:text-primary-dark"
          >
            Browse all {typeSeo.pluralLabel.toLowerCase()} →
          </Link>
        </div>
      )}
    </div>
  );
}
