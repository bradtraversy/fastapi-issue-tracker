"use client";

import { useEffect } from "react";

/**
 * Catches render-time errors below this segment. Note the prop is `retry`,
 * not `reset` — Next.js 16 renamed it.
 */
export default function HomeError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="panel w-full max-w-md p-8 text-center">
        <div className="mx-auto grid size-11 place-items-center rounded-full border border-rose-400/30 bg-rose-400/10">
          <span aria-hidden="true" className="text-lg text-rose-300">
            !
          </span>
        </div>

        <h1 className="mt-4 text-lg font-semibold text-ink">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The home page failed to render. Retrying will re-run the server
          fetch.
        </p>

        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-faint">
            Reference: {error.digest}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => retry()}
          className="mt-6 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
