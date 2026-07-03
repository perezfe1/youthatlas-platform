import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { NEWS_POSTS } from '@/data/news-posts';

export const revalidate = false; // fully static — data from NEWS_POSTS constant

// ── Metadata ─────────────────────────────────────────────────────────────────

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = NEWS_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Not Found | YouthAtlas' };

  return {
    title: `${post.title} | YouthAtlas`,
    description: post.excerpt,
  };
}

// ── Body rendering ────────────────────────────────────────────────────────────
// Post bodies use a minimal markdown subset: a paragraph fully wrapped in
// `**…**` is a subheading; inline `**…**` spans are bold.

function renderParagraph(paragraph: string, i: number) {
  // A bold-only first line (`**Heading**` alone or followed by body text on
  // the next line) renders as a subheading.
  const heading = paragraph.match(/^\*\*(.+)\*\*(?:\n([\s\S]+))?$/);
  if (heading && !heading[1].includes('**')) {
    return (
      <div key={i}>
        <h2 className="font-display pt-2 text-xl font-semibold text-[#1A1A2E]">
          {heading[1]}
        </h2>
        {heading[2] ? <p className="mt-2">{heading[2]}</p> : null}
      </div>
    );
  }
  const parts = paragraph.split(/\*\*(.+?)\*\*/g);
  return (
    <p key={i}>
      {parts.map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part))}
    </p>
  );
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
        {post.body.split('\n\n').map(renderParagraph)}
      </div>
    </div>
  );
}
