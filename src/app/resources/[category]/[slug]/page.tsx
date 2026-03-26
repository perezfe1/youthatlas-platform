import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';

import {
  RESOURCE_CATEGORIES,
  RESOURCE_GUIDES,
  getCategoryBySlug,
  getGuideBySlug,
  getPrevNextGuides,
} from '@/data/resources';
import { getGuideContent } from '@/lib/mdx';
import { FeedbackWidget } from '@/components/resources/feedback-widget';

export const dynamic = 'force-dynamic';

// ── Static params ──────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return RESOURCE_GUIDES.map((g) => ({
    category: g.category,
    slug: g.slug,
  }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  const guide = getGuideBySlug(params.category, params.slug);
  if (!guide) return { title: 'Not Found | YouthAtlas' };

  return {
    title: `${guide.title} | Resources | YouthAtlas`,
    description: guide.description,
  };
}

// ── MDX prose styles ─────────────────────────────────────────────────────────

const mdxComponents = {};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GuidePage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const category = getCategoryBySlug(params.category);
  const guide = getGuideBySlug(params.category, params.slug);

  if (!category || !guide) notFound();

  const guideContent = getGuideContent(params.category, params.slug);
  const { prev, next } = getPrevNextGuides(params.category, params.slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-secondary">
        <Link href="/resources" className="hover:text-primary transition-colors">
          Resources
        </Link>
        <span>/</span>
        <Link
          href={`/resources/${params.category}`}
          className="hover:text-primary transition-colors"
        >
          {category.title}
        </Link>
        <span>/</span>
        <span className="text-[#1A1A2E]">{guide.title}</span>
      </nav>

      {/* Guide header */}
      <div className="mb-8 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>{category.emoji}</span>
          <span>{category.title}</span>
          <span>·</span>
          <span>{guide.readingMinutes} min read</span>
          {guide.tag && (
            <>
              <span>·</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  guide.tag === 'Essential'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-violet-50 text-violet-700'
                }`}
              >
                {guide.tag}
              </span>
            </>
          )}
        </div>
        <h1 className="font-display mt-3 text-3xl font-bold text-[#1A1A2E]">
          {guide.title}
        </h1>
        <p className="mt-3 text-lg text-text-secondary leading-relaxed">
          {guide.description}
        </p>
      </div>

      {/* Guide content */}
      {guideContent ? (
        <article className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-[#1A1A2E] prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1A1A2E]">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore — next-mdx-remote RSC is an async server component; TS rejects Promise<ReactElement> in JSX position */}
          <MDXRemote source={guideContent.content} components={mdxComponents} />
        </article>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-2xl">✍️</p>
          <p className="mt-3 font-display font-semibold text-[#1A1A2E]">
            Guide coming soon
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            This guide is being written. Check back soon or{' '}
            <a
              href="https://t.me/youthatlas1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary-dark"
            >
              follow us on Telegram
            </a>{' '}
            to be notified when it&apos;s published.
          </p>
        </div>
      )}

      {/* Feedback widget */}
      {guideContent && (
        <div className="mt-10">
          <FeedbackWidget />
        </div>
      )}

      {/* Related opportunities placeholder */}
      <div className="mt-10 rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-violet-50 p-6">
        <p className="text-sm font-semibold text-[#1A1A2E]">
          Ready to put this into practice?
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Browse open opportunities that match this guide&apos;s topic.
        </p>
        <Link
          href="/opportunities"
          className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Browse Opportunities →
        </Link>
      </div>

      {/* Prev / Next navigation */}
      {(prev || next) && (
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-slate-200 pt-8">
          {prev ? (
            <Link
              href={`/resources/${params.category}/${prev.slug}`}
              className="group flex max-w-[45%] flex-col"
            >
              <span className="text-xs text-text-secondary">← Previous</span>
              <span className="mt-1 text-sm font-medium text-[#1A1A2E] group-hover:text-primary transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/resources/${params.category}/${next.slug}`}
              className="group flex max-w-[45%] flex-col text-right"
            >
              <span className="text-xs text-text-secondary">Next →</span>
              <span className="mt-1 text-sm font-medium text-[#1A1A2E] group-hover:text-primary transition-colors">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}

      {/* Back link */}
      <div className="mt-8">
        <Link
          href={`/resources/${params.category}`}
          className="text-sm text-primary hover:text-primary-dark transition-colors"
        >
          ← Back to {category.title}
        </Link>
      </div>
    </div>
  );
}
