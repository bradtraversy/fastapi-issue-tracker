"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { toFieldErrors, updateIssue } from "@/lib/api";
import { validateDescription, validateTitle } from "@/lib/issues";
import {
  ISSUE_LIMITS,
  type Issue,
  type IssuePriority,
  type IssueStatus,
} from "@/lib/types";

const PRIORITY_OPTIONS: { value: IssuePriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const STATUS_OPTIONS: { value: IssueStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "closed", label: "Closed" },
];

const INPUT_CLASS =
  "w-full rounded-lg border border-line bg-surface/70 px-3 py-2 text-sm text-ink placeholder:text-faint transition-colors hover:border-faint/60 focus:border-accent focus:outline-none aria-invalid:border-rose-400/60";

const LABEL_CLASS = "block text-xs font-medium tracking-wide text-muted";

export interface IssueEditorProps {
  issue: Issue;
  onSaved: (issue: Issue) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}

export function IssueEditor({
  issue,
  onSaved,
  onCancel,
  onError,
}: IssueEditorProps) {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [priority, setPriority] = useState<IssuePriority>(issue.priority);
  const [status, setStatus] = useState<IssueStatus>(issue.status);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  // Move focus into the editor so keyboard users land where they expect.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const unchanged =
    title.trim() === issue.title &&
    description.trim() === issue.description &&
    priority === issue.priority &&
    status === issue.status;

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (saving) return;

    const titleError = validateTitle(title);
    const descriptionError = validateDescription(description);
    if (titleError || descriptionError) {
      setFieldErrors({
        ...(titleError ? { title: titleError } : {}),
        ...(descriptionError ? { description: descriptionError } : {}),
      });
      return;
    }

    setFieldErrors({});
    setSaving(true);

    // Only the changed keys are sent; the backend ignores anything omitted.
    const payload: Record<string, string> = {};
    if (title.trim() !== issue.title) payload.title = title.trim();
    if (description.trim() !== issue.description) {
      payload.description = description.trim();
    }
    if (priority !== issue.priority) payload.priority = priority;
    if (status !== issue.status) payload.status = status;

    const result = await updateIssue(issue.id, payload);

    if (result.ok) {
      onSaved(result.data);
      return;
    }

    const fieldLevel = toFieldErrors(result.error);
    if (fieldLevel.length > 0) {
      setFieldErrors(
        Object.fromEntries(
          fieldLevel.map(({ field, message }) => [field, message]),
        ),
      );
    } else {
      onError(result.error.message);
    }
    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-4 space-y-4 border-t border-line pt-4"
      aria-label={`Edit issue ${issue.title}`}
    >
      <div>
        <label htmlFor={`edit-title-${issue.id}`} className={LABEL_CLASS}>
          Title
        </label>
        <input
          id={`edit-title-${issue.id}`}
          ref={titleRef}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={Boolean(fieldErrors.title)}
          className={`mt-1.5 ${INPUT_CLASS}`}
        />
        <div className="mt-1 flex items-start justify-between gap-3">
          {fieldErrors.title ? (
            <p className="text-xs text-rose-300">{fieldErrors.title}</p>
          ) : (
            <span />
          )}
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
      </div>

      <div>
        <label
          htmlFor={`edit-description-${issue.id}`}
          className={LABEL_CLASS}
        >
          Description
        </label>
        <textarea
          id={`edit-description-${issue.id}`}
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          aria-invalid={Boolean(fieldErrors.description)}
          className={`mt-1.5 resize-y ${INPUT_CLASS}`}
        />
        <div className="mt-1 flex items-start justify-between gap-3">
          {fieldErrors.description ? (
            <p className="text-xs text-rose-300">{fieldErrors.description}</p>
          ) : (
            <span />
          )}
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`edit-priority-${issue.id}`}
            className={LABEL_CLASS}
          >
            Priority
          </label>
          <select
            id={`edit-priority-${issue.id}`}
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

        <div>
          <label htmlFor={`edit-status-${issue.id}`} className={LABEL_CLASS}>
            Status
          </label>
          <select
            id={`edit-status-${issue.id}`}
            value={status}
            onChange={(event) => setStatus(event.target.value as IssueStatus)}
            className={`mt-1.5 ${INPUT_CLASS}`}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={saving || unchanged}
          className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-raised disabled:opacity-50"
        >
          Cancel
        </button>
        {unchanged && !saving ? (
          <p className="text-xs text-faint">No changes yet</p>
        ) : null}
      </div>
    </form>
  );
}
