function SkeletonCard() {
  return (
    <div className="h-64 animate-pulse rounded-lg border border-slate-100 bg-slate-100" />
  );
}

export default function OpportunitiesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-9 w-64 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-5 w-40 animate-pulse rounded bg-slate-100" />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
