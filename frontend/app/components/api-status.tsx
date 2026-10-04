export type ApiState = "live" | "unreachable";

const STYLES = {
  live: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    label: "API live",
    title: "API connected",
  },
  unreachable: {
    dot: "bg-rose-400",
    text: "text-rose-300",
    label: "API offline",
    title: "API unreachable",
  },
} as const;

/**
 * Reflects the server-rendered health check. It deliberately does not poll:
 * retrying re-runs the server fetch, which passes a fresh state back down.
 */
export function ApiStatus({ state }: { state: ApiState }) {
  const style = STYLES[state];

  return (
    <span
      title={style.title}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-2.5 py-1 text-xs font-medium"
    >
      <span aria-hidden="true" className="relative flex size-2">
        <span
          className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${style.dot}`}
        />
        <span className={`relative inline-flex size-2 rounded-full ${style.dot}`} />
      </span>
      <span className={style.text}>{style.label}</span>
    </span>
  );
}
