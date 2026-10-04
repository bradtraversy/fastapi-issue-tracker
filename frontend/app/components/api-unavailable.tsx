"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { ApiError } from "@/lib/types";

/**
 * Shown when the server fetch failed. Retrying re-runs the Server Component
 * rather than fetching from the browser, so the dashboard recovers from a
 * single source of truth.
 */
export function ApiUnavailable({ error }: { error: ApiError }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [retrying, setRetrying] = useState(false);

  const busy = pending || retrying;

  function retry() {
    setRetrying(true);
    startTransition(() => {
      router.refresh();
      setRetrying(false);
    });
  }

  return (
    <section
      id="dashboard"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pb-12 sm:px-6"
    >
      <div className="panel border-rose-400/25 bg-rose-500/5 p-8 text-center">
        <div className="mx-auto grid size-11 place-items-center rounded-full border border-rose-400/30 bg-rose-400/10">
          <span aria-hidden="true" className="text-lg text-rose-300">
            !
          </span>
        </div>

        <h2 className="mt-4 text-lg font-semibold text-ink">
          Cannot reach the Issue Tracker API
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          {error.message}
        </p>

        <div className="mt-5 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={retry}
            disabled={busy}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Retrying…" : "Retry"}
          </button>

          <p className="font-mono text-xs text-faint">
            Start the backend with{" "}
            <span className="text-muted">fastapi dev main.py</span> in{" "}
            <span className="text-muted">backend/</span>
          </p>
        </div>
      </div>
    </section>
  );
}
