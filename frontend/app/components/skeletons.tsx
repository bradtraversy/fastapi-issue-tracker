export function StatCardSkeleton() {
  return (
    <div className="panel p-4">
      <div className="h-3 w-20 animate-pulse rounded bg-raised" />
      <div className="mt-3 h-8 w-14 animate-pulse rounded bg-raised" />
      <div className="mt-2 h-3 w-24 animate-pulse rounded bg-raised/60" />
    </div>
  );
}

export function IssueRowSkeleton() {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="h-4 w-1/3 animate-pulse rounded bg-raised" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-raised/60" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-raised/60" />
        </div>
        <div className="hidden gap-2 sm:flex">
          <div className="h-6 w-20 animate-pulse rounded-full bg-raised" />
          <div className="h-6 w-16 animate-pulse rounded-md bg-raised" />
        </div>
      </div>
    </div>
  );
}

/** Placeholder rendered by `loading.tsx` while the server fetch is in flight. */
export function DashboardSkeleton() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div className="mt-4 h-11 animate-pulse rounded-lg bg-surface/60" />

      <div className="mt-4 space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <IssueRowSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
