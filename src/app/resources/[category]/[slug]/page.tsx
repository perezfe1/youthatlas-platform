import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getCategoryBySlug, getGuideBySlug } from '@/data/resources';

export const dynamic = 'force-dynamic';

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GuidePage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const category = getCategoryBySlug(params.category);
  const guide = getGuideBySlug(params.category, params.slug);

  if (!category || !guide) notFound();

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
        </div>
        <h1 className="font-display mt-3 text-3xl font-bold text-[#1A1A2E]">
          {guide.title}
        </h1>
        <p className="mt-3 text-lg text-text-secondary leading-relaxed">
          {guide.description}
        </p>
      </div>

      {/* Placeholder content */}
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
