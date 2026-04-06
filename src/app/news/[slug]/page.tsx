import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { NEWS_POSTS } from '@/data/news-posts';

export const dynamic = 'force-dynamic';

// ── Metadata ─────────────────────────────────────────────────────────────────

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = NEWS_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Not Found | YouthAtlas' };

  return {
    title: `${post.title} | YouthAtlas`,
    description: post.excerpt,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewsPostPage({ params }: { params: { slug: string } }) {
  const post = NEWS_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/news"
        className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
      >
        &larr; News
      </Link>

      <h1 className="font-display mt-6 text-3xl font-bold text-[#1A1A2E]">{post.title}</h1>
      <p className="mt-2 text-sm text-slate-500">{post.date}</p>

      <div className="mt-8 space-y-4 text-slate-600 leading-relaxed">
        {post.body.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
