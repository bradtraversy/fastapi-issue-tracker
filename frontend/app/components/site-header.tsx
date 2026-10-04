import Link from "next/link";

export function SiteHeader({ docsUrl }: { docsUrl: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-md bg-accent font-mono text-sm font-bold text-white"
          >
            {"</>"}
          </span>
          <span className="text-sm font-semibold tracking-tight text-ink">
            IssueTrack
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <a
            href={docsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-1.5 font-medium text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            API docs
          </a>
          <Link
            href="/#report"
            className="rounded-md px-3 py-1.5 font-medium text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            Report issue
          </Link>
        </nav>
      </div>
    </header>
  );
}
