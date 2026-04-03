import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFBF5] px-4">
      <p className="font-display text-8xl font-bold text-blue-500">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-[#1A1A2E]">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-2 text-center text-text-secondary">
        The opportunity you&apos;re looking for may have expired or moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/opportunities"
          className="rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          Browse Opportunities
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-[#1A1A2E] transition-colors hover:bg-slate-50"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
