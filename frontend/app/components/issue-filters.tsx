"use client";

import {
  DEFAULT_FILTERS,
  ISSUE_SORTS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  countActiveFilters,
  type IssueFilters,
  type IssueSort,
  type PriorityFilter,
  type StatusFilter,
} from "@/lib/issues";
import { ISSUE_PRIORITIES, ISSUE_STATUSES } from "@/lib/types";

const CONTROL_CLASS =
  "h-10 rounded-lg border border-line bg-surface/70 px-3 text-sm text-ink transition-colors hover:border-faint/60 focus:border-accent focus:outline-none";

export interface IssueFiltersProps {
  filters: IssueFilters;
  sort: IssueSort;
  onFiltersChange: (filters: IssueFilters) => void;
  onSortChange: (sort: IssueSort) => void;
  resultCount: number;
  totalCount: number;
}

export function IssueFilters({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  resultCount,
  totalCount,
}: IssueFiltersProps) {
  const activeCount = countActiveFilters(filters);

  function set<K extends keyof IssueFilters>(
    key: K,
    value: IssueFilters[K],
  ): void {
    onFiltersChange({ ...filters, [key]: value });
  }

  return (
    <div className="panel mt-4 flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <label htmlFor="issue-search" className="sr-only">
          Search issues
        </label>
        <input
          id="issue-search"
          type="search"
          value={filters.query}
          onChange={(event) => set("query", event.target.value)}
          placeholder="Search titles and descriptions…"
          className={`${CONTROL_CLASS} w-full pl-9 placeholder:text-faint`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="status-filter" className="sr-only">
          Filter by status
        </label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(event) => set("status", event.target.value as StatusFilter)}
          className={CONTROL_CLASS}
        >
          <option value="all">All statuses</option>
          {ISSUE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <label htmlFor="priority-filter" className="sr-only">
          Filter by priority
        </label>
        <select
          id="priority-filter"
          value={filters.priority}
          onChange={(event) =>
            set("priority", event.target.value as PriorityFilter)
          }
          className={CONTROL_CLASS}
        >
          <option value="all">All priorities</option>
          {ISSUE_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>

        <label htmlFor="sort-issues" className="sr-only">
          Sort issues
        </label>
        <select
          id="sort-issues"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as IssueSort)}
          className={CONTROL_CLASS}
        >
          {ISSUE_SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {activeCount > 0 ? (
          <button
            type="button"
            onClick={() => onFiltersChange(DEFAULT_FILTERS)}
            className="h-10 rounded-lg border border-line px-3 text-sm font-medium text-muted transition-colors hover:border-faint/60 hover:text-ink"
          >
            Clear ({activeCount})
          </button>
        ) : null}
      </div>

      <p
        aria-live="polite"
        className="shrink-0 px-1 font-mono text-xs tabular-nums text-faint lg:ml-auto"
      >
        {resultCount === totalCount
          ? `${totalCount} total`
          : `${resultCount} of ${totalCount}`}
      </p>
    </div>
  );
}
