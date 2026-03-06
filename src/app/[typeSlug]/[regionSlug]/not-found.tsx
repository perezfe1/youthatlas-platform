import Link from 'next/link';

export default function RegionNotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="font-display text-6xl font-bold text-slate-200">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-[#1A1A2E]">
        Filter not found
      </h1>
      <p className="mt-3 text-text-secondary">
        This region or filter doesn&apos;t exist. Try the category page instead.
      </p>
      <Link
        href="/opportunities"
        className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Browse all opportunities →
      </Link>
    </div>
  );
}
