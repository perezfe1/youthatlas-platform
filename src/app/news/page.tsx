import Link from 'next/link';
import type { Metadata } from 'next';

import { NEWS_POSTS } from '@/data/news-posts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'News & Updates | YouthAtlas',
  description:
    'The latest from YouthAtlas and Prospera Development Foundation. Platform updates, opportunity guides, and seasonal picks.',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-[#1A1A2E]">News &amp; Updates</h1>
      <p className="mt-6 text-slate-600 leading-relaxed">
        The latest from YouthAtlas and Prospera Development Foundation.
      </p>

      <div className="mt-10 space-y-6">
        {NEWS_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/news/${post.slug}`}
            className="block rounded-xl border border-slate-100 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="font-display text-xl font-semibold text-[#1A1A2E]">{post.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{post.date}</p>
            <p className="mt-3 text-slate-600 leading-relaxed">{post.excerpt}</p>
            <p className="mt-3 text-sm font-medium text-blue-500">Read more &rarr;</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
