"use client";

import { useEffect, useState } from "react";

import { PriorityBadge } from "./priority-badge";
import { IssueEditor } from "./issue-editor";
import { StatusBadge } from "./status-badge";
import { deleteIssue } from "@/lib/api";
import { shortId, type PriorityFilter } from "@/lib/issues";
import type { Issue } from "@/lib/types";

const CONFIRM_WINDOW_MS = 4000;

export interface IssueRowProps {
  issue: Issue;
  isEditing: boolean;
  activePriority: PriorityFilter;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaved: (issue: Issue) => void;
  onDeleted: (id: string) => void;
  onError: (message: string) => void;
}

export function IssueRow({
  issue,
  isEditing,
  activePriority,
  onEdit,
  onCancelEdit,
  onSaved,
  onDeleted,
  onError,
}: IssueRowProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // An armed delete is destructive and irreversible, so it disarms itself.
  useEffect(() => {
    if (!confirmingDelete) return;
    const timer = setTimeout(() => setConfirmingDelete(false), CONFIRM_WINDOW_MS);
    return () => clearTimeout(timer);
  }, [confirmingDelete]);

  async function handleDelete(): Promise<void> {
    if (deleting) return;
    setDeleting(true);
    const result = await deleteIssue(issue.id);

    if (result.ok) {
      onDeleted(issue.id);
      return;
    }

    setDeleting(false);
    setConfirmingDelete(false);
    onError(result.error.message);
  }

  return (
    <li className="panel p-5 transition-colors hover:bg-raised/40">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium break-words text-ink">
            {issue.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed break-words text-muted">
            {issue.description}
          </p>
          <p className="mt-3 font-mono text-xs text-faint" title={issue.id}>
            #{shortId(issue.id)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <StatusBadge status={issue.status} />
          <PriorityBadge
            priority={issue.priority}
            active={activePriority === issue.priority}
          />
        </div>
      </div>

      {isEditing ? (
        <IssueEditor
          issue={issue}
          onSaved={onSaved}
          onCancel={onCancelEdit}
          onError={onError}
        />
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-raised"
          >
            Edit
          </button>

          {confirmingDelete ? (
            <>
              <span className="text-xs text-muted">Delete permanently?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Confirm"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
                className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-raised disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/10"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </li>
  );
}
