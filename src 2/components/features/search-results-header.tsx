import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────────

type Props = {
  query: string;
  totalCount: number;
};

// ── Component ──────────────────────────────────────────────────────────────────

export function SearchResultsHeader({ query, totalCount }: Props) {
  if (totalCount === 0) {
    return (
      <p className="mt-2 text-sm text-slate-600">
        No results found for{' '}
        <span className="font-medium text-slate-900">&ldquo;{query}&rdquo;</span>. Try different
        keywords or{' '}
        <Link href="/opportunities" className="text-primary underline hover:text-primary-dark">
          browse all opportunities
        </Link>
        .
      </p>
    );
  }

  return (
    <p className="mt-2 text-sm text-slate-600">
      Showing {totalCount.toLocaleString()} results for{' '}
      <span className="font-medium text-slate-900">&ldquo;{query}&rdquo;</span>
    </p>
  );
}
