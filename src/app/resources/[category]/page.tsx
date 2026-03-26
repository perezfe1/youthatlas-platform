import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getCategoryBySlug, getGuidesByCategory } from '@/data/resources';

export const dynamic = 'force-dynamic';

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
              <h2 className="font-display font-semibold text-[#1A1A2E] group-hover:text-primary transition-colors">
                {guide.title}
              </h2>
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
    </div>
  );
}
