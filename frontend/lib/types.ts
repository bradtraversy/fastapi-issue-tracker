/**
 * Types mirroring the Pydantic schemas in `backend/app/schemas.py`.
 * Keep these in sync with the backend whenever it changes.
 */

export const ISSUE_PRIORITIES = ["low", "medium", "high"] as const;
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];

export const ISSUE_STATUSES = ["open", "in_progress", "closed"] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

/** `IssueOut` — the response shape of every issue endpoint. */
export interface Issue {
  id: string;
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
}

/** `IssueCreate` — POST /api/v1/issues. `status` is forced to "open" server side. */
export interface IssueCreate {
  title: string;
  description: string;
  priority?: IssuePriority;
}

/** `IssueUpdate` — PUT /api/v1/issues/{id}. Omitted fields are left unchanged. */
export interface IssueUpdate {
  title?: string;
  description?: string;
  priority?: IssuePriority;
  status?: IssueStatus;
}

/** A single `ValidationError` entry from a FastAPI 422 response. */
export interface ApiValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

/**
 * FastAPI reports failures in two shapes: `detail` is a plain string for
 * HTTPException (404, 405) and an array of validation errors for 422.
 */
export type ApiErrorDetail = string | ApiValidationError[];

export interface ApiError {
  status: number;
  detail: ApiErrorDetail;
  message: string;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export const ISSUE_LIMITS = {
  title: { min: 3, max: 100 },
  description: { min: 5, max: 2000 },
} as const;
