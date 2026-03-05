// ── Skeleton helpers ──────────────────────────────────────────────────────────

function SkeletonLine({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className ?? ''}`} />;
}

function SidebarSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {/* Apply button placeholder */}
      <SkeletonLine className="h-11 w-full rounded-lg" />
      {/* Key details */}
      <div className="mt-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonLine className="h-4 w-4 shrink-0 rounded" />
            <SkeletonLine className="h-4 w-3/4" />
          </div>
        ))}
      </div>
      {/* Share section */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <SkeletonLine className="h-4 w-1/2" />
        <SkeletonLine className="mt-2 h-4 w-1/3" />
      </div>
    </div>
  );
}

function MainSkeleton() {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <SkeletonLine className="h-4 w-48" />
      {/* Title */}
      <SkeletonLine className="mt-4 h-9 w-3/4" />
      <SkeletonLine className="h-9 w-1/2" />
      {/* Organization */}
      <SkeletonLine className="h-5 w-40" />
      {/* Badges */}
      <div className="mt-4 flex gap-2">
        <SkeletonLine className="h-6 w-24 rounded-full" />
        <SkeletonLine className="h-6 w-20 rounded-full" />
        <SkeletonLine className="h-6 w-28 rounded-full" />
      </div>
      {/* Description block */}
      <div className="mt-8 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonLine
            key={i}
            className={`h-4 ${i % 5 === 4 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonLine
            key={i}
            className={`h-4 ${i % 4 === 3 ? 'w-1/2' : 'w-full'}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Loading page ──────────────────────────────────────────────────────────────

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <MainSkeleton />
        </div>
        <aside className="mt-8 hidden lg:mt-0 lg:block">
          <SidebarSkeleton />
        </aside>
      </div>
    </div>
  );
}
