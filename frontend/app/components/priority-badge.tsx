import { PRIORITY_LABELS, type IssuePriority } from "@/lib/issues";

const PRIORITY_STYLES: Record<IssuePriority, string> = {
  low: "border-slate-400/25 bg-slate-400/10 text-slate-300",
  medium: "border-orange-400/30 bg-orange-400/10 text-orange-300",
  high: "border-rose-400/30 bg-rose-400/10 text-rose-300",
};

const PRIORITY_BARS: Record<IssuePriority, string> = {
  low: "bg-slate-400",
  medium: "bg-orange-400",
  high: "bg-rose-400",
};

/**
 * `active` marks a priority that the current filter is narrowing by, so the
 * tile reads as a selected state rather than a static badge.
 */
export function PriorityBadge({
  priority,
  active = false,
}: {
  priority: IssuePriority;
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium transition-opacity ${
        PRIORITY_STYLES[priority]
      } ${active ? "opacity-100 ring-1 ring-current" : "opacity-80"}`}
    >
      <span
        aria-hidden="true"
        className={`h-3 w-0.5 rounded-full ${PRIORITY_BARS[priority]}`}
      />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
