import { DashboardSkeleton } from "./components/skeletons";

/**
 * Streams immediately while the Server Component fetches the issue list, so
 * the shell and hero appear without waiting on the API.
 */
export default function Loading() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
        <div className="h-6 w-40 animate-pulse rounded-full bg-raised" />
        <div className="mt-6 h-12 w-3/4 max-w-2xl animate-pulse rounded-lg bg-raised" />
        <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-raised/60" />
        <div className="mt-8 flex gap-3">
          <div className="h-10 w-36 animate-pulse rounded-lg bg-raised" />
          <div className="h-10 w-36 animate-pulse rounded-lg bg-raised" />
        </div>
      </div>

      <DashboardSkeleton />
    </main>
  );
}
