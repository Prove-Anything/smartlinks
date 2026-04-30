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
 * A single clause in a FacetRule. Tests one facet key against one or more values (OR semantics).
 */
export interface FacetRuleClause {
  /**
   * Facet key this clause tests, e.g. "brand", "type", "bread-type".
   * Must reference a defined facet on the collection.
   */
  facetKey: string
  /**
   * One or more facet value keys that satisfy the clause (OR semantics).
   * At least one value required. Server deduplicates and sorts.
   */
  anyOf: string[]
}

/**
 * Multi-clause boolean facet rule: AND across clauses, OR within each clause's anyOf.
 * Mutually exclusive with `scope` on a record.
 */
export interface FacetRule {
  /**
   * All clauses must be satisfied (AND semantics).
   * Must be non-empty; no duplicate facetKey entries.
   */
  all: FacetRuleClause[]
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
   * Facet assignments for the product (e.g. `{ brand: ['samsung'], type: ['tv'] }`).
   * Used exclusively to match FacetRule records via GIN-indexed containment check.
   * Does NOT filter legacy scope.facets arrays (that system is removed in SDK 1.12).
   * Omit to exclude rule records from results.
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
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  startsAt?: string | null
  expiresAt?: string | null
  status?: string | null
  data?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  /** Facet rule (rule records only). Mutually exclusive with anchor IDs. */
  facetRule?: FacetRule | null
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
  | { scope: { productId?: string; variantId?: string; batchId?: string; proofId?: string }; recordType?: string; refs?: never }

/**
 * Which resolution tier caused a record to be selected in `match()` or `resolveAll()`.
 * Precedence (highest first): rule > proof > batch > variant > product > facet > collection > universal.
 */
export type MatchedAt =
  | 'rule'        // matched via facetRule evaluation (highest precedence over anchors)
  | 'proof'
  | 'batch'
  | 'variant'
  | 'product'
  | 'facet'       // legacy: record has a ref starting with "facet:" (pre-1.10 data)
  | 'collection'  // record has ref === 'default' (explicit collection default)
  | 'universal'   // record has no anchors, no rule, no default ref

/**
 * Entry in `match()` results — the record fields plus resolution metadata.
 * Extends AppRecord so all record fields are directly accessible.
 */
export interface MatchEntry extends AppRecord {
  /** Which resolution tier caused this record to be selected. */
  matchedAt: MatchedAt
  /** The rule that fired. Present only when matchedAt === 'rule'. */
  matchedRule?: FacetRule
  /** Number of clauses in the rule that fired. Present only when matchedAt === 'rule'. */
  matchedClauseCount?: number
}

/**
 * Response from the match endpoint.
 */
export interface MatchResult {
  /** Matched records ordered by specificity descending (most specific first) */
  data: MatchEntry[]
  /** Total count of matched records */
  total: number
  /** Strategy used for this result */
  strategy: 'all' | 'best'
}

/**
 * Request body for the upsert endpoint.
 */
export interface UpsertRecordInput {
  /** Required — used as the lookup key */
  ref: string
  recordType?: string
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  startsAt?: string | null
  expiresAt?: string | null
  status?: string | null
  data?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  /** Facet rule (rule records only). Mutually exclusive with anchor IDs. */
  facetRule?: FacetRule | null
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
  scopeType: string | null
  scopeId: string | null
  customId: string | null
  customIdNormalized: string | null
  sourceSystem: string | null
  status: string | null
  /** Flat anchor IDs. null = wildcard (matches any value). */
  productId: string | null
  /** Flat anchor ID, promoted from scope.variantId in SDK 1.12. */
  variantId: string | null
  /** Flat anchor ID, promoted from scope.batchId in SDK 1.12. */
  batchId: string | null
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
   * Numeric specificity score. Server-computed from anchor IDs and facetRule.
   * Higher = more specific. 0 = universal (no anchors, no rule).
   */
  specificity: number
  /**
   * Facet rule for rule records (ref starts with "rule:").
   * null on all other record types. Mutually exclusive with anchor IDs.
   */
  facetRule: FacetRule | null
  /** Singleton cardinality key. Server-assigned; opaque to clients. SDK 1.11. */
  singletonKey: string | null
  data: Record<string, unknown>
  owner: Record<string, unknown>
  admin: Record<string, unknown> // admin only
  metadata: Record<string, unknown> | null
}

/**
 * Input for creating a new record
 */
export interface CreateRecordInput {
  recordType?: string
  visibility?: Visibility
  ref?: string
  status?: string
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  contactId?: string
  authorId?: string
  authorType?: string
  parentType?: string
  parentId?: string
  startsAt?: string | null
  expiresAt?: string | null
  scopeType?: string | null
  scopeId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  /**
   * Opt-in singleton cardinality. When set, the server upserts rather than
   * inserting a duplicate. Values: 'collection' | 'product' | 'variant' | 'batch' | 'proof'
   */
  singletonPer?: string
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown>
  metadata?: Record<string, unknown>
  /** Facet rule (rule records only). Mutually exclusive with anchor IDs. */
  facetRule?: FacetRule | null
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
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  startsAt?: string | null
  expiresAt?: string | null
  scopeType?: string | null
  scopeId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  metadata?: Record<string, unknown>
  /** Set/clear facet rule. Send null to remove. */
  facetRule?: FacetRule | null
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
  /** Filter by variantId (indexed flat column) */
  variantId?: string
  /** Filter by batchId (indexed flat column) */
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

/**
 * Request body for the resolve-all endpoint.
 * Returns every applicable record for a product context across all tiers.
 */
export interface ResolveAllParams {
  /** Product context to evaluate records against. */
  context: {
    productId?: string
    variantId?: string
    batchId?: string
    proofId?: string
    /**
     * Facet assignments for the product — used for both legacy facet-ref matching
     * and facetRule evaluation.
     * e.g. { "brand": "samsung", "type": ["tv", "laptop"] }
     */
    facets?: Record<string, string | string[]>
  }
  /** Limit to a specific record type. Omit to return all types. */
  recordType?: string
  /** Only return records belonging to these tiers. */
  tiers?: Array<'proof' | 'batch' | 'variant' | 'product' | 'rule' | 'facet' | 'collection'>
  /** Safety cap. Default 500, max 5000. */
  limit?: number
  /** Point-in-time for scheduling evaluation (ISO 8601). Defaults to now. */
  at?: string
  /** Include records whose startsAt is in the future. Default false. */
  includeScheduled?: boolean
  /** Include records whose expiresAt is in the past. Default false. */
  includeExpired?: boolean
}

/**
 * Response from the resolve-all endpoint.
 */
export interface ResolveAllResult {
  /** Every applicable record sorted by precedence (most-specific first). Each appears at most once. */
  records: ResolveAllEntry[]
  /** Total count of returned records. */
  total: number
  /** The context echoed back from the request (for verification). */
  context: ResolveAllContext
  /** true if the result was capped at the safety limit. */
  truncated: boolean
}

export interface ResolveAllEntry {
  record: AppRecord
  matchedAt: MatchedAt
  specificity: number
  matchedRule?: FacetRule
  matchedClauseCount?: number
}

export interface ResolveAllContext {
  productId?: string
  variantId?: string
  batchId?: string
  proofId?: string
  facets?: Record<string, string[]>
}

/**
 * Request body for the preview-rule endpoint.
 */
export interface PreviewRuleParams {
  /** The facet rule to evaluate (same validation as on record create). */
  facetRule: FacetRule
  /** Filter to a specific record type for context. */
  recordType?: string
  /** Max matching products to return in sample. Default 50, max 200. */
  limit?: number
}

/**
 * Response from the preview-rule endpoint.
 */
export interface PreviewRuleResult {
  /** Sample of products whose facet assignments satisfy the rule. */
  matchingProducts: Array<{ productId: string; name?: string; facets: Record<string, string[]> }>
  /** Total products in the collection matching the rule. */
  total: number
  /** Server-canonicalized rule (sorted keys, deduped values) — for display. */
  rule: FacetRule
}

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
