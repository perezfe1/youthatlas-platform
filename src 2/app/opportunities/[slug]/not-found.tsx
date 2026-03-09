import Link from 'next/link';

// ── Sub-components ────────────────────────────────────────────────────────────

function NotFoundIllustration() {
  return (
    <div className="mb-6 text-6xl" aria-hidden="true">
      🔍
    </div>
  );
}

function NotFoundActions() {
  return (
    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <Link
        href="/opportunities"
        className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Browse all opportunities →
      </Link>
      <Link
        href="/"
        className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
      >
        Back to home
      </Link>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <NotFoundIllustration />
      <h1 className="font-display text-2xl font-bold text-[#1A1A2E] sm:text-3xl">
        Opportunity not found
      </h1>
      <p className="mt-3 max-w-md text-base text-text-secondary">
        This opportunity may have been removed or the link is incorrect. Try browsing our
        full list of opportunities.
      </p>
      <NotFoundActions />
    </div>
  );
}
