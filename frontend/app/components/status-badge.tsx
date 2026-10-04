import { STATUS_LABELS, type IssueStatus } from "@/lib/issues";

const STATUS_STYLES: Record<IssueStatus, string> = {
  open: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  in_progress: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  closed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
};

const STATUS_DOTS: Record<IssueStatus, string> = {
  open: "bg-sky-400",
  in_progress: "bg-amber-400",
  closed: "bg-emerald-400",
};

export function StatusBadge({ status }: { status: IssueStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${STATUS_DOTS[status]}`}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
