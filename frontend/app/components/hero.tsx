import Link from "next/link";

import { ApiStatus, type ApiState } from "./api-status";
import type { IssueStats } from "@/lib/issues";

export interface HeroProps {
  stats: IssueStats;
  apiState: ApiState;
  docsUrl: string;
}

const ENDPOINTS = [
  ["GET", "/api/v1/issues"],
  ["POST", "/api/v1/issues"],
  ["GET", "/api/v1/health"],
] as const;

export function Hero({ stats, apiState, docsUrl }: HeroProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-indigo-300">
          FastAPI · v0.1.0
        </span>
        <ApiStatus state={apiState} />
      </div>

      <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
        Ship issues, not spreadsheets.
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-muted sm:text-lg">
        A minimal, production-shaped issue tracker. Every number on this page is
        derived live from the REST API — no mock data, no cached counters.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/#dashboard"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          View live issues
        </Link>
        <Link
          href="/#report"
          className="rounded-lg border border-line bg-surface/60 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-raised"
        >
          Report an issue
        </Link>
        <a
          href={docsUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          Read the API docs →
        </a>
      </div>

      <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 font-mono text-sm tabular-nums">
        {ENDPOINTS.map(([method, path]) => (
          <div key={`${method} ${path}`} className="flex items-center gap-2">
            <dt className="text-indigo-300">{method}</dt>
            <dd className="text-muted">{path}</dd>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <dt className="text-faint">tracked</dt>
          <dd className="font-semibold text-ink">
            {stats.total} {stats.total === 1 ? "issue" : "issues"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
