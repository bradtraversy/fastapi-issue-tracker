"use client";

import { IssueRow } from "./issue-row";
import type { PriorityFilter } from "@/lib/issues";
import type { Issue } from "@/lib/types";

export interface IssueListProps {
  issues: Issue[];
  activePriority: PriorityFilter;
  editingId: string | null;
  onClear: () => void;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSaved: (issue: Issue) => void;
  onDeleted: (id: string) => void;
  onError: (message: string) => void;
}

export function IssueList({
  issues,
  activePriority,
  editingId,
  onClear,
  onEdit,
  onCancelEdit,
  onSaved,
  onDeleted,
  onError,
}: IssueListProps) {
  if (issues.length === 0) {
    return (
      <div className="panel mt-4 px-6 py-16 text-center">
        <p className="text-sm font-medium text-ink">No issues match</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
          Adjust the search or filters to see more results.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-raised"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-3">
      {issues.map((issue) => (
        <IssueRow
          key={issue.id}
          issue={issue}
          isEditing={editingId === issue.id}
          activePriority={activePriority}
          onEdit={() => onEdit(issue.id)}
          onCancelEdit={onCancelEdit}
          onSaved={onSaved}
          onDeleted={onDeleted}
          onError={onError}
        />
      ))}
    </ul>
  );
}
