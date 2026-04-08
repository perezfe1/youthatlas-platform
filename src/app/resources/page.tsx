import Link from 'next/link';
import type { Metadata } from 'next';

import { RESOURCE_CATEGORIES } from '@/data/resources';


export const metadata: Metadata = {
  title: 'Resources | YouthAtlas',
  description:
    'Free guides on interviews, applications, job searching, digital skills, and more. Written for students and young professionals.',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function ResourcesHero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-violet-50 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-[#1A1A2E] sm:text-5xl">
          Don&apos;t just find opportunities.{' '}
          <span className="text-primary">Win them.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
          Actionable guides on interviews, applications, networking, and more —
          written for students and young professionals.
        </p>

        {/* Stats bar */}
        <div className="mx-auto mt-8 flex max-w-sm justify-center gap-8 sm:max-w-md sm:gap-12">
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-[#1A1A2E]">6</p>
            <p className="text-sm text-text-secondary">Categories</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-[#1A1A2E]">24+</p>
            <p className="text-sm text-text-secondary">Guides</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-[#1A1A2E]">5 min</p>
            <p className="text-sm text-text-secondary">Avg. Read</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  slug,
  emoji,
  title,
  description,
  guideCount,
}: {
  slug: string;
  emoji: string;
  title: string;
  description: string;
  guideCount: number;
}) {
  return (
    <Link
      href={`/resources/${slug}`}
      className="group flex flex-col rounded-lg border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="text-3xl">{emoji}</span>
      <h2 className="font-display mt-3 text-lg font-semibold text-[#1A1A2E] group-hover:text-primary transition-colors">
        {title}
      </h2>
      <p className="mt-1 flex-1 text-sm text-text-secondary leading-relaxed">
        {description}
      </p>
      <p className="mt-4 text-sm font-medium text-primary">
        {guideCount} guides →
      </p>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  return (
    <div>
      <ResourcesHero />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCE_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.slug}
              slug={cat.slug}
              emoji={cat.emoji}
              title={cat.title}
              description={cat.description}
              guideCount={cat.guideCount}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
