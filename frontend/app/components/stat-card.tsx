import type { ReactNode } from "react";

const ACCENTS = {
  neutral: "from-slate-400/60",
  sky: "from-sky-400/80",
  amber: "from-amber-400/80",
  emerald: "from-emerald-400/80",
  rose: "from-rose-400/80",
  indigo: "from-indigo-400/80",
} as const;

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: keyof typeof ACCENTS;
}

export function StatCard({
  label,
  value,
  hint,
  accent = "neutral",
}: StatCardProps) {
  return (
    <div className="panel relative overflow-hidden p-4">
      {/* Coloured rule across the top edge identifies the metric at a glance. */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${ACCENTS[accent]} to-transparent`}
      />
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </p>
      <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-ink">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-faint">{hint}</p> : null}
    </div>
  );
}
