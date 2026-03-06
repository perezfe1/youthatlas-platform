import Link from 'next/link';

export default function TypeNotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="font-display text-6xl font-bold text-slate-200">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-[#1A1A2E]">
        Category not found
      </h1>
      <p className="mt-3 text-text-secondary">
        This opportunity category doesn&apos;t exist. Try browsing all opportunities instead.
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
