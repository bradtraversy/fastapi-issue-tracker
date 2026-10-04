"use client";

import { useMemo, useState } from "react";

import { IssueFilters as FilterBar } from "./issue-filters";
import { IssueList } from "./issue-list";
import { NewIssueForm } from "./new-issue-form";
import { StatCard } from "./stat-card";
import {
  DEFAULT_FILTERS,
  computeStats,
  filterIssues,
  sortIssues,
  type IssueFilters,
  type IssueSort,
} from "@/lib/issues";
import type { Issue } from "@/lib/types";

export interface DashboardProps {
  initialIssues: Issue[];
}

interface Notice {
  kind: "ok" | "error";
  text: string;
}

export function Dashboard({ initialIssues }: DashboardProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [filters, setFilters] = useState<IssueFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<IssueSort>("newest");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const visible = useMemo(
    () => sortIssues(filterIssues(issues, filters), sort),
    [issues, filters, sort],
  );

  // Stats describe what is currently on screen, so the tiles stay truthful
  // whenever the filters narrow the list.
  const stats = useMemo(() => computeStats(visible), [visible]);
  const total = useMemo(() => computeStats(issues), [issues]);

  function handleCreated(issue: Issue): void {
    setIssues((current) => [...current, issue]);
    setNotice({ kind: "ok", text: `Created "${issue.title}".` });
  }

  /** The server returns the stored row, so it replaces local state outright. */
  function handleSaved(updated: Issue): void {
    setIssues((current) =>
      current.map((issue) => (issue.id === updated.id ? updated : issue)),
    );
    setEditingId(null);
    setNotice({ kind: "ok", text: `Updated "${updated.title}".` });
  }

  function handleDeleted(id: string): void {
    setIssues((current) => current.filter((issue) => issue.id !== id));
    // The deleted row may have been the one open in the editor.
    setEditingId((current) => (current === id ? null : current));
    setNotice({ kind: "ok", text: "Issue deleted." });
  }

  function handleError(message: string): void {
    setNotice({ kind: "error", text: message });
  }

  return (
    <>
      <section
        id="dashboard"
        className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pb-12 sm:px-6"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Live board
            </h2>
            <p className="mt-1 text-sm text-muted">
              Computed in the browser — the API has no aggregates endpoint.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            label="Showing"
            value={stats.total}
            hint={`of ${total.total} tracked`}
            accent="indigo"
          />
          <StatCard label="Open" value={stats.open} accent="sky" />
          <StatCard label="In progress" value={stats.inProgress} accent="amber" />
          <StatCard label="Closed" value={stats.closed} accent="emerald" />
          <StatCard label="High priority" value={stats.high} accent="rose" />
          <StatCard
            label="Open rate"
            value={`${stats.openRate}%`}
            hint="open / showing"
          />
        </div>

        <FilterBar
          filters={filters}
          sort={sort}
          onFiltersChange={setFilters}
          onSortChange={setSort}
          resultCount={visible.length}
          totalCount={issues.length}
        />

        <IssueList
          issues={visible}
          activePriority={filters.priority}
          editingId={editingId}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          onEdit={setEditingId}
          onCancelEdit={() => setEditingId(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
          onError={handleError}
        />

        <p
          aria-live="polite"
          className={`mt-3 min-h-5 text-sm ${
            notice?.kind === "error" ? "text-rose-300" : "text-emerald-300"
          }`}
        >
          {notice?.text}
        </p>
      </section>

      <NewIssueForm onCreated={handleCreated} />
    </>
  );
}
