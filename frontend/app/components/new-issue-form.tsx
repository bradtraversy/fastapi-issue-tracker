"use client";

import { useState, type FormEvent } from "react";

import { createIssue, toFieldErrors } from "@/lib/api";
import { ISSUE_LIMITS, type Issue, type IssuePriority } from "@/lib/types";

const PRIORITY_OPTIONS: { value: IssuePriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const INPUT_CLASS =
  "w-full rounded-lg border border-line bg-surface/70 px-3 py-2.5 text-sm text-ink placeholder:text-faint transition-colors hover:border-faint/60 focus:border-accent focus:outline-none aria-invalid:border-rose-400/60";

export interface NewIssueFormProps {
  onCreated: (issue: Issue) => void;
}

export function NewIssueForm({ onCreated }: NewIssueFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("medium");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (submitting) return;

    setFieldErrors({});
    setFormError(null);
    setNotice(null);
    setSubmitting(true);

    const result = await createIssue({ title, description, priority });

    if (result.ok) {
      onCreated(result.data);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setNotice(`Created "${result.data.title}".`);
      setSubmitting(false);
      return;
    }

    // A 422 carries per-field messages; anything else is a general failure.
    const fieldLevel = toFieldErrors(result.error);
    if (fieldLevel.length > 0) {
      setFieldErrors(
        Object.fromEntries(fieldLevel.map(({ field, message }) => [field, message])),
      );
    } else {
      setFormError(result.error.message);
    }
    setSubmitting(false);
  }

  return (
    <section
      id="report"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pb-16 sm:px-6"
    >
      <div className="panel p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Report an issue
            </h2>
            <p className="mt-1 text-sm text-muted">
              Posts straight to{" "}
              <code className="font-mono text-xs text-indigo-300">
                POST /api/v1/issues
              </code>
              . New issues are always created as{" "}
              <span className="text-sky-300">Open</span>.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="issue-title"
                className="text-sm font-medium text-ink"
              >
                Title
              </label>
              <span
                className={`font-mono text-xs tabular-nums ${
                  title.trim().length > ISSUE_LIMITS.title.max
                    ? "text-rose-300"
                    : "text-faint"
                }`}
              >
                {title.trim().length}/{ISSUE_LIMITS.title.max}
              </span>
            </div>
            <input
              id="issue-title"
              name="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={fieldErrors.title ? "issue-title-error" : undefined}
              placeholder="Users cannot log in with special characters in password"
              className={`mt-1.5 ${INPUT_CLASS}`}
            />
            {fieldErrors.title ? (
              <p
                id="issue-title-error"
                className="mt-1.5 text-xs text-rose-300"
              >
                {fieldErrors.title}
              </p>
            ) : null}
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="issue-description"
                className="text-sm font-medium text-ink"
              >
                Description
              </label>
              <span
                className={`font-mono text-xs tabular-nums ${
                  description.trim().length > ISSUE_LIMITS.description.max
                    ? "text-rose-300"
                    : "text-faint"
                }`}
              >
                {description.trim().length}/{ISSUE_LIMITS.description.max}
              </span>
            </div>
            <textarea
              id="issue-description"
              name="description"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              aria-invalid={Boolean(fieldErrors.description)}
              aria-describedby={
                fieldErrors.description ? "issue-description-error" : undefined
              }
              placeholder="Describe what went wrong, what you expected, and how to reproduce it."
              className={`mt-1.5 resize-y ${INPUT_CLASS}`}
            />
            {fieldErrors.description ? (
              <p
                id="issue-description-error"
                className="mt-1.5 text-xs text-rose-300"
              >
                {fieldErrors.description}
              </p>
            ) : null}
          </div>

          <div className="max-w-48">
            <label
              htmlFor="issue-priority"
              className="text-sm font-medium text-ink"
            >
              Priority
            </label>
            <select
              id="issue-priority"
              name="priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as IssuePriority)
              }
              className={`mt-1.5 ${INPUT_CLASS}`}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {formError ? (
            <p
              role="alert"
              className="rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-200"
            >
              {formError}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating…" : "Create issue"}
            </button>

            <p aria-live="polite" className="text-sm">
              {notice ? <span className="text-emerald-300">{notice}</span> : null}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
