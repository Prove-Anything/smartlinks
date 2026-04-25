// src/types/appObjects.ts

/**
 * Visibility levels for app objects
 */
export type Visibility = 'public' | 'owner' | 'admin'

/**
 * Caller role types
 */
export type CallerRole = 'admin' | 'owner' | 'public'

// --- Shared Types ---

/**
 * Paginated response wrapper for list endpoints.
 *
 * All list endpoints return this shape:
 * ```json
 * {
 *   "data": [ ...items ],
 *   "pagination": {
 *     "total":   142,
 *     "limit":   10,
 *     "offset":  0,
 *     "hasMore": true
 *   }
 * }
 * ```
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    /** Total number of matching records in the collection */
    total: number
    /** Maximum number of items returned in this page */
    limit: number
    /** Number of items skipped before this page */
    offset: number
    /** `true` when more pages are available (offset + limit < total) */
    hasMore: boolean
  }
}

/**
 * Request body for aggregate endpoints
 */
export interface AggregateRequest {
  filters?: {
    status?: string
    category?: string // cases only
    record_type?: string // records only
    product_id?: string
    created_at?: { gte?: string; lte?: string }
    closed_at?: '__notnull__' | { gte?: string; lte?: string } // cases only
    expires_at?: { lte?: string } // records only
  }
  groupBy?: string[] // see per-resource allowed values
  metrics?: string[] // see per-resource allowed values below
  timeSeriesField?: string // e.g. 'created_at'
  timeSeriesInterval?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
}

/**
 * Response from aggregate endpoints
 */
export interface AggregateResponse {
  // One of the following depending on request:
  groups?: ({ count: number } & Record<string, unknown>)[]
  timeSeries?: ({ bucket: string; count: number } & Record<string, unknown>)[]
  count?: number
  // Cases scalar extras:
  avg_close_time_seconds?: number
  p50_close_time_seconds?: number
  p95_close_time_seconds?: number
  // Threads scalar extras:
  total_replies?: number
  avg_replies?: number
}

/**
 * Common query parameters for list endpoints
 */
export interface ListQueryParams {
  limit?: number // default 50, max 500
  offset?: number // default 0
  sort?: string // field:asc or field:desc
  includeDeleted?: boolean // admin only
  status?: string // exact or in:a,b,c
  productId?: string
  createdAt?: string // gte:2024-01-01, lte:2024-12-31, or ISO date string
  updatedAt?: string // same format
}

// --- Cases ---

/**
 * App Case object
 */
export interface AppCase {
  id: string
  orgId: string
  collectionId: string
  appId: string
  visibility: Visibility
  ref: string | null
  status: string // 'open' | 'resolved' | 'closed' | custom
  priority: number | null
  category: string | null
  assignedTo: string | null // admin zone / admin callers only
  productId: string | null
  proofId: string | null
  contactId: string | null
  createdAt: string // ISO 8601
  updatedAt: string
  closedAt: string | null
  deletedAt: string | null // admin callers only
  data: Record<string, unknown> // visible to all roles
  owner: Record<string, unknown> // visible to owner + admin
  admin: Record<string, unknown> // visible to admin only
}

/**
 * Input for creating a new case
 */
export interface CreateCaseInput {
  visibility?: Visibility // default 'owner'
  ref?: string
  status?: string // default 'open'
  priority?: number
  category?: string
  assignedTo?: string // admin only
  productId?: string
  proofId?: string
  contactId?: string
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown> // admin only
}

/**
 * Input for updating a case
 */
export interface UpdateCaseInput {
  // Owner-accessible:
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  // Admin-only:
  admin?: Record<string, unknown>
  status?: string
  priority?: number
  category?: string
  assignedTo?: string
  ref?: string
}

/**
 * Input for appending to case history
 */
export interface AppendHistoryInput {
  entry?: Record<string, unknown> // free-form entry object; 'at' is auto-set
  historyTarget?: 'owner' | 'admin' // which zone receives the entry (default 'admin')
  status?: string // optionally update status atomically
  priority?: number
  assignedTo?: string
}

/**
 * Request for case summary
 */
export interface CaseSummaryRequest {
  period?: { from: string; to: string } // ISO 8601 date range
}

/**
 * Response from case summary endpoint
 */
export interface CaseSummaryResponse {
  total: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  trend: { week: string; count: number }[]
}

/**
 * Query parameters for listing cases
 */
export interface CaseListQueryParams extends ListQueryParams {
  category?: string
  priority?: string // gte:N / lte:N
  ref?: string
  proofId?: string
  contactId?: string // admin only
  assignedTo?: string // admin only
  closedAt?: string
}

// --- Threads ---

/**
 * Reply entry in a thread
 */
export interface ReplyEntry {
  at: string // ISO 8601, auto-set
  authorId?: string
  authorType?: string
  [key: string]: unknown
}

/**
 * App Thread object
 */
export interface AppThread {
  id: string
  orgId: string
  collectionId: string
  appId: string
  visibility: Visibility
  slug: string | null
  title: string | null
  status: string // 'open' | 'closed' | custom
  authorId: string | null
  authorType: string // default 'user'
  productId: string | null
  proofId: string | null
  contactId: string | null
  parentType: string | null
  parentId: string | null
  replyCount: number
  lastReplyAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null // admin only
  body: Record<string, unknown>
  replies: ReplyEntry[]
  tags: string[]
  data: Record<string, unknown>
  owner: Record<string, unknown>
  admin: Record<string, unknown> // admin only
}

/**
 * Input for creating a new thread
 */
export interface CreateThreadInput {
  visibility?: Visibility // default 'owner'
  slug?: string
  title?: string
  status?: string // default 'open'
  authorId?: string
  authorType?: string
  productId?: string
  proofId?: string
  contactId?: string
  parentType?: string
  parentId?: string
  body?: Record<string, unknown>
  tags?: string[]
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown> // admin only
}

/**
 * Input for updating a thread
 */
export interface UpdateThreadInput {
  // Owner-accessible:
  body?: Record<string, unknown>
  tags?: string[]
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  // Admin-only:
  admin?: Record<string, unknown>
  title?: string
  slug?: string
  status?: string
  visibility?: Visibility
}

/**
 * Input for adding a reply to a thread
 */
export interface ReplyInput {
  authorId?: string
  authorType?: string
  [key: string]: unknown // any extra fields stored on the reply object
}

/**
 * Query parameters for listing threads
 */
export interface ThreadListQueryParams extends ListQueryParams {
  slug?: string
  authorId?: string
  parentType?: string
  parentId?: string
  tag?: string // JSONB array contains
  contactId?: string // admin only
}

// --- Records ---

/**
 * Facet clause within a RecordScope.
 * Values within a single clause are ORed; multiple clauses are ANDed.
 */
export interface ScopeFacetClause {
  /** Facet key, e.g. "tier", "region" */
  key: string
  /** One or more values that satisfy this clause (OR semantics) */
  valueKeys: string[]
}

/**
 * Structured scope definition for a record.
 * Describes the audience/context the record applies to.
 * An empty object `{}` means universal (no restrictions).
 */
export interface RecordScope {
  productId?: string
  variantId?: string
  proofId?: string
  batchId?: string
  /**
   * Arbitrary facet clauses.
   * Clauses are ANDed together; valueKeys within a clause are ORed.
   */
  facets?: ScopeFacetClause[]
}

/**
 * Runtime context passed to the match endpoint.
 * Describes the caller or item being evaluated against record scopes.
 */
export interface RecordTarget {
  productId?: string
  variantId?: string
  proofId?: string
  batchId?: string
  /**
   * Facet values the caller possesses, keyed by facet key.
   * A scope clause is satisfied if ANY of the clause's valueKeys appears here.
   */
  facets?: Record<string, string[]>
}

/**
 * Request body for the bulk-upsert endpoint.
 */
export interface BulkUpsertItem {
  /** Required — logical identifier used as the upsert key */
  ref: string
  recordType?: string
  customId?: string
  sourceSystem?: string
  startsAt?: string | null
  expiresAt?: string | null
  status?: string | null
  scope?: RecordScope
  data?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
}

/**
 * Response from the bulk-upsert endpoint.
 */
export interface BulkUpsertResult {
  saved: number
  failed: number
  results: Array<
    | { index: number; status: 'created'; id: string; ref: string; created: true }
    | { index: number; status: 'updated'; id: string; ref: string; created: false }
    | { index: number; status: 'error'; error: string }
  >
}

/**
 * Response from the bulk-delete endpoint.
 */
export interface BulkDeleteResult {
  deleted: number
}

/**
 * Input for the bulk-delete endpoint.
 * Use **refs mode** to delete explicit records by ref,
 * or **scope mode** to delete all records anchored to a scope.
 */
export type BulkDeleteInput =
  | { refs: string[]; recordType?: string; scope?: never }
  | { scope: Omit<RecordScope, 'facets'>; recordType?: string; refs?: never }

/**
 * Indicates which scope dimension caused a record to match during `match()`.
 * Follows specificity order: proof > batch > variant > product > facet > universal.
 */
export type MatchedAtLevel =
  | 'proof'
  | 'batch'
  | 'variant'
  | 'product'
  | 'facet'
  | 'universal'

/**
 * An AppRecord augmented with `matchedAt` — present only on records returned
 * by the `match` endpoint. Use this to display attribution such as
 * "Inherited from product" or "Batch-specific" without inspecting scope fields.
 */
export interface MatchedRecord extends AppRecord {
  /**
   * The most specific scope dimension that caused this record to match.
   * 'universal' means the record has an empty scope and matches all contexts.
   */
  matchedAt: MatchedAtLevel
}

/**
 * Response from the match endpoint.
 */
export interface MatchResult {
  /** Matched records ordered by specificity descending (most specific first) */
  records: MatchedRecord[]
  /**
   * Only present when strategy is 'best'.
   * The single highest-specificity record per recordType.
   */
  best?: Record<string, MatchedRecord>
}

/**
 * Request body for the upsert endpoint.
 */
export interface UpsertRecordInput {
  /** Required — used as the lookup key */
  ref: string
  recordType?: string
  customId?: string
  sourceSystem?: string
  startsAt?: string | null
  expiresAt?: string | null
  status?: string | null
  scope?: RecordScope
  data?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
}

/**
 * Response from the upsert endpoint — includes AppRecord plus a created flag.
 */
export interface UpsertRecordResponse extends AppRecord {
  /** true if the record was newly created, false if updated */
  created: boolean
}

/**
 * Request body for the match endpoint.
 */
export interface MatchRecordsInput {
  /** Required — describes the runtime context to match against */
  target: RecordTarget
  /**
   * 'all'  — return all matching records (default)
   * 'best' — return the highest-specificity record per recordType
   */
  strategy?: 'all' | 'best'
  /** Limit to a specific recordType */
  recordType?: string
  /** Maximum records to return. Default 100, max 1000. */
  limit?: number
  /** Include records whose startsAt is in the future. Default false. */
  includeScheduled?: boolean
  /** Include records whose expiresAt is in the past. Default false. */
  includeExpired?: boolean
  /** Evaluate scheduling relative to this ISO 8601 timestamp. Defaults to now. */
  at?: string
}

/**
 * App Record object
 */
export interface AppRecord {
  id: string
  orgId: string
  collectionId: string
  appId: string
  visibility: Visibility
  recordType: string | null
  ref: string | null
  customId: string | null
  sourceSystem: string | null
  status: string | null
  /** @deprecated use scope.productId instead */
  productId: string | null
  /** @deprecated use scope.proofId instead */
  proofId: string | null
  contactId: string | null
  authorId: string | null
  authorType: string
  parentType: string | null
  parentId: string | null
  createdAt: string
  updatedAt: string
  startsAt: string | null
  expiresAt: string | null
  deletedAt: string | null // admin only
  /**
   * Structured scope definition. Empty object means universal.
   * Platform-canonicalized on write (keys sorted, valueKeys deduplicated).
   */
  scope: RecordScope
  /**
   * Numeric specificity score computed from scope.
   * Higher = more specific. 0 = universal scope.
   */
  specificity: number
  data: Record<string, unknown>
  owner: Record<string, unknown>
  admin: Record<string, unknown> // admin only
  metadata: Record<string, unknown> | null
}

/**
 * Input for creating a new record
 */
export interface CreateRecordInput {
  recordType: string
  visibility?: Visibility // default 'owner'
  ref?: string             // derived from scope if omitted and scope provided
  status?: string // default 'active'
  productId?: string
  proofId?: string
  contactId?: string
  authorId?: string
  authorType?: string
  parentType?: string
  parentId?: string
  startsAt?: string // ISO 8601
  expiresAt?: string
  /** Structured scope. Canonicalized on write; ref derived if not supplied. */
  scope?: RecordScope
  customId?: string
  sourceSystem?: string
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown> // admin only
  metadata?: Record<string, unknown>
}

/**
 * Input for updating a record
 */
export interface UpdateRecordInput {
  // Owner-accessible:
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  // Admin-only:
  admin?: Record<string, unknown>
  status?: string
  visibility?: Visibility
  ref?: string
  recordType?: string
  startsAt?: string
  expiresAt?: string
  /** Updating scope recomputes specificity and ref. */
  scope?: RecordScope
  customId?: string
  sourceSystem?: string
  metadata?: Record<string, unknown>
}

/**
 * Query parameters for listing records
 */
export interface RecordListQueryParams extends ListQueryParams {
  recordType?: string
  ref?: string
  /** Filter records whose ref starts with this value */
  refPrefix?: string
  customId?: string
  sourceSystem?: string
  proofId?: string
  /** Filter by scope.variantId (JSONB lookup) */
  variantId?: string
  /** Filter by scope.batchId (JSONB lookup) */
  batchId?: string
  /** Full-text filter on data.label (case-insensitive substring) */
  q?: string
  authorId?: string
  parentType?: string
  parentId?: string
  startsAt?: string
  expiresAt?: string
  /** Include records where startsAt is in the future. Default false. */
  includeScheduled?: boolean
  /** Include records where expiresAt is in the past. Default false. */
  includeExpired?: boolean
  /**
   * Evaluate scheduling relative to this ISO 8601 timestamp.
   * Defaults to now.
   */
  at?: string
  contactId?: string // admin only
  /** Include soft-deleted records (non-null deletedAt). Admin only. Default false. */
  includeDeleted?: boolean
}

// --- Related ---

/**
 * Response from case related endpoint
 */
export interface RelatedResponse {
  threads: AppThread[]
  records: AppRecord[]
}

// --- Public Create Policy ---

/**
 * Top-level public-create policy stored under the `publicCreate` key of an
 * app config document.  Controls which caller types may create objects on
 * **public** App Objects endpoints.
 *
 * Set via `POST /api/v1/admin/collection/:collectionId/apps/:appId` with the
 * policy as the request body (merged over any existing config).
 *
 * The server reads this document at request time — no cache invalidation or
 * service restart is required after changing it.
 */
export interface PublicCreatePolicy {
  cases?:   PublicCreateObjectRule
  threads?: PublicCreateObjectRule
  records?: PublicCreateObjectRule
}

/**
 * Per-object-type rule within a {@link PublicCreatePolicy}.
 * Each caller class (`anonymous`, `authenticated`) has its own independent
 * branch so you can apply different enforcement for each.
 */
export interface PublicCreateObjectRule {
  /** Rules for unauthenticated (anonymous) callers */
  anonymous?:     PublicCreateBranch
  /** Rules for authenticated (signed-in contact) callers */
  authenticated?: PublicCreateBranch
}

/**
 * Policy branch for a single caller class.
 *
 * ### Visibility enforcement guard-rails
 *
 * The server silently corrects misconfigured visibility values:
 *
 * | Caller type     | `enforce.visibility` supplied | Server overrides to  |
 * |-----------------|-------------------------------|----------------------|
 * | `anonymous`     | `'owner'`                     | `'admin'`            |
 * | `authenticated` | `'public'`                    | `'owner'`            |
 *
 * These guards exist because anonymous callers have no identity to own a
 * record, and `'public'` visibility for authenticated-only objects would be
 * a misconfiguration.
 */
export interface PublicCreateBranch {
  /** Whether creation is permitted for this caller class */
  allow: boolean

  /**
   * Field values merged **over** the caller's request body before writing.
   * Use this to lock down `visibility` and `status` regardless of what the
   * client sends.
   */
  enforce?: {
    visibility?: 'public' | 'owner' | 'admin'
    status?:     string
  }

  /**
   * Anonymous edit-token configuration.
   * **Records only** — ignored for cases and threads.
   *
   * When `editToken: true`, the server generates a one-time 256-bit hex token
   * on anonymous record creation, stores it in `admin.editToken` (never
   * exposed to public / owner responses), and returns it **once** in the
   * creation response under the `editToken` key.
   *
   * The client can then pass that token as the `X-Edit-Token` header on
   * `PATCH /records/:recordId` to amend the `data` zone without
   * authentication.
   *
   * @see {@link CreateRecordResponse} — creation response shape
   * @see {@link records.updateWithToken} — SDK method for the amendment call
   */
  edit?: {
    /** Enable edit-token generation on anonymous record creation */
    editToken: boolean
    /**
     * Optional expiry window in minutes from `createdAt`.
     * After this many minutes the token is rejected with HTTP 403
     * `EDIT_WINDOW_EXPIRED`.  Omit for no expiry.
     */
    windowMinutes?: number
  }
}

/**
 * Response from `app.records.create()` when the caller is anonymous and the
 * app's `publicCreate.records.anonymous.edit.editToken` policy is `true`.
 *
 * The `editToken` field is present **only on the creation response** — it is
 * stored in the record's `admin` zone and never returned again.  Store it
 * client-side immediately.
 *
 * Use `app.records.updateWithToken()` to amend the record's `data` zone with
 * this token.
 *
 * @example
 * ```ts
 * const response = await app.records.create(collectionId, appId, {
 *   recordType: 'payment',
 *   visibility: 'public',
 *   data: { amount: 9900, currency: 'USD' },
 * })
 * // response.editToken is present when the policy has editToken: true
 * const editToken = response.editToken
 * ```
 */
export interface CreateRecordResponse extends AppRecord {
  /**
   * Short-lived edit token.  Present only when:
   * 1. The caller is anonymous, AND
   * 2. The app policy has `publicCreate.records.anonymous.edit.editToken: true`
   *
   * This value is returned **once** and cannot be retrieved again.
   */
  editToken?: string
}
