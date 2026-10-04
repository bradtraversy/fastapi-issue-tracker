export function SiteFooter({ docsUrl }: { docsUrl: string }) {
  return (
    <footer className="mt-auto border-t border-line/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          IssueTrack — a home page built against the FastAPI Issue Tracker API.
        </p>
        <a
          href={docsUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium transition-colors hover:text-muted"
        >
          Interactive API reference ↗
        </a>
      </div>
    </footer>
  );
}
