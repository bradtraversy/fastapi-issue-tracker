import {
  ISSUE_LIMITS,
  ISSUE_PRIORITIES,
  ISSUE_STATUSES,
  type Issue,
  type IssuePriority,
  type IssueStatus,
} from "./types";

export type { IssuePriority, IssueStatus } from "./types";

export const STATUS_LABELS: Record<IssueStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
};

export const PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export type StatusFilter = IssueStatus | "all";
export type PriorityFilter = IssuePriority | "all";
export type IssueSort = "newest" | "oldest" | "priority" | "title";

export const ISSUE_SORTS: { value: IssueSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title A-Z" },
];

export interface IssueFilters {
  query: string;
  status: StatusFilter;
  priority: PriorityFilter;
}

export const DEFAULT_FILTERS: IssueFilters = {
  query: "",
  status: "all",
  priority: "all",
};

export interface IssueStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  high: number;
  openRate: number;
}

/**
 * The API exposes no aggregates endpoint, so every figure the dashboard shows
 * is computed here from the full issue list.
 */
export function computeStats(issues: Issue[]): IssueStats {
  const counts: Record<IssueStatus, number> = {
    open: 0,
    in_progress: 0,
    closed: 0,
  };
  let high = 0;

  for (const issue of issues) {
    if (isStatus(issue.status)) counts[issue.status] += 1;
    if (isPriority(issue.priority) && issue.priority === "high") high += 1;
  }

  const total = issues.length;
  return {
    total,
    open: counts.open,
    inProgress: counts.in_progress,
    closed: counts.closed,
    high,
    openRate: total === 0 ? 0 : Math.round((counts.open / total) * 100),
  };
}

const PRIORITY_RANK: Record<IssuePriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

/** Unknown values sort last rather than producing a NaN comparator. */
function priorityRank(priority: IssuePriority): number {
  return isPriority(priority) ? PRIORITY_RANK[priority] : Number.MAX_SAFE_INTEGER;
}

/**
 * The API stores issues in append order and returns no timestamps, so
 * "newest first" means reversing that order.
 */
export function sortIssues(issues: Issue[], sort: IssueSort): Issue[] {
  const sorted = [...issues];
  switch (sort) {
    case "newest":
      return sorted.reverse();
    case "oldest":
      return sorted;
    case "priority":
      return sorted.sort(
        (a, b) =>
          priorityRank(a.priority) - priorityRank(b.priority) ||
          a.title.localeCompare(b.title),
      );
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
}

/** Free-text match across the title and description, case insensitive. */
export function filterIssues(
  issues: Issue[],
  filters: IssueFilters,
): Issue[] {
  const query = filters.query.trim().toLowerCase();

  return issues.filter((issue) => {
    if (filters.status !== "all" && issue.status !== filters.status) return false;
    if (filters.priority !== "all" && issue.priority !== filters.priority) {
      return false;
    }
    if (query.length === 0) return true;
    return (
      issue.title.toLowerCase().includes(query) ||
      issue.description.toLowerCase().includes(query)
    );
  });
}

export function countActiveFilters(filters: IssueFilters): number {
  let active = 0;
  if (filters.query.trim().length > 0) active += 1;
  if (filters.status !== "all") active += 1;
  if (filters.priority !== "all") active += 1;
  return active;
}

/**
 * Mirrors the Pydantic `Field(min_length=..., max_length=...)` constraints so
 * obvious mistakes are caught before a round trip.
 */
export function validateTitle(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return "A title is required.";
  if (trimmed.length < ISSUE_LIMITS.title.min) {
    return `Title must be at least ${ISSUE_LIMITS.title.min} characters.`;
  }
  if (trimmed.length > ISSUE_LIMITS.title.max) {
    return `Title must be at most ${ISSUE_LIMITS.title.max} characters.`;
  }
  return null;
}

export function validateDescription(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return "A description is required.";
  if (trimmed.length < ISSUE_LIMITS.description.min) {
    return `Description must be at least ${ISSUE_LIMITS.description.min} characters.`;
  }
  if (trimmed.length > ISSUE_LIMITS.description.max) {
    return `Description must be at most ${ISSUE_LIMITS.description.max} characters.`;
  }
  return null;
}

/** UUIDs are opaque; the first segment makes a usable short reference. */
export function shortId(id: string): string {
  return id.split("-")[0] ?? id.slice(0, 8);
}

export function isStatus(value: string): value is IssueStatus {
  return (ISSUE_STATUSES as readonly string[]).includes(value);
}

export function isPriority(value: string): value is IssuePriority {
  return (ISSUE_PRIORITIES as readonly string[]).includes(value);
}
