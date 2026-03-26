import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import {
  RESOURCE_CATEGORIES,
  getCategoryBySlug,
  getGuidesByCategory,
} from '@/data/resources';

export const dynamic = 'force-dynamic';

// ── Static params ──────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return RESOURCE_CATEGORIES.map((cat) => ({ category: cat.slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  if (!category) return { title: 'Not Found | YouthAtlas' };

  return {
    title: `${category.title} | Resources | YouthAtlas`,
    description: category.description,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const guides = getGuidesByCategory(params.category);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-secondary">
        <Link href="/resources" className="hover:text-primary transition-colors">
          Resources
        </Link>
        <span>/</span>
        <span className="text-[#1A1A2E]">{category.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <span className="text-4xl">{category.emoji}</span>
        <h1 className="font-display mt-3 text-3xl font-bold text-[#1A1A2E]">
          {category.title}
        </h1>
        <p className="mt-2 text-text-secondary">{category.description}</p>
        <p className="mt-1 text-sm text-text-secondary">
          {guides.length} guide{guides.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Guide list */}
      <ul className="space-y-4">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/resources/${params.category}/${guide.slug}`}
              className="group flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display font-semibold text-[#1A1A2E] group-hover:text-primary transition-colors">
                  {guide.title}
                </h2>
                {guide.tag && (
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      guide.tag === 'Essential'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-violet-50 text-violet-700'
                    }`}
                  >
                    {guide.tag}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                {guide.description}
              </p>
              <p className="mt-3 text-xs text-text-secondary">
                {guide.readingMinutes} min read
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {/* More coming note */}
      <p className="mt-8 text-sm text-text-secondary text-center">
        More guides coming soon.{' '}
        <a
          href="https://t.me/youthatlas1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary-dark"
        >
          Follow us on Telegram
        </a>{' '}
        to be notified.
      </p>
    </div>
  );
}
