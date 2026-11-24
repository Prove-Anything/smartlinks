// src/api/appObjects.ts
import type { StandardQuery, QueryResult, QueryDescription } from "../types/query"
import type { ListResult, ListOptions } from "../types/list"
import { request, post, patch, del, put } from '../http'
import { listQuery } from '../list'
import type {
  AppCase,
  CreateCaseInput,
  UpdateCaseInput,
  AppendHistoryInput,
  CaseSummaryRequest,
  CaseSummaryResponse,
  CaseListQueryParams,
  AppThread,
  CreateThreadInput,
  UpdateThreadInput,
  ReplyInput,
  ThreadListQueryParams,
  AppRecord,
  CreateRecordInput,
  CreateRecordResponse,
  UpdateRecordInput,
  UpsertRecordInput,
  UpsertRecordResponse,
  MatchRecordsInput,
  MatchResult,
  BulkUpsertItem,
  BulkUpsertResult,
  BulkDeleteResult,
  BulkDeleteInput,
  RecordListQueryParams,
  ResolveAllParams,
  ResolveAllResult,
  PreviewRuleParams,
  PreviewRuleResult,
  AggregateRequest,
  AggregateResponse,
  RelatedResponse
} from '../types/appObjects'

// ==================== APP NAMESPACE ====================

export namespace app {

// ==================== OPTIONS (pickers) ====================

/**
 * Pickers: the small, cached list behind "pick a machine" or "pick a hold reason".
 * docs/admin-lists-and-pickers.md
 */
export namespace options {
  /**
   * `source` = `type:<record type or declared type id>` | `list:<list id>`. Admins (`admin: true`)
   * see every entry; the public API lists public records and lists the app declares public. Hold on
   * to `version` and pass it back to get `{ unchanged: true }` when nothing changed.
   *
   * Returns `{ items, nextCursor, count?, version, mode }`: the entries are in `items`, already sorted,
   * 50 at a time unless you give a `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the
   * next page; `null` means that was the last one. `q` searches the entries.
   *
   * @example
   * ```typescript
   * const res = await app.options.get(collectionId, appId, 'type:machine', { admin: true, limit: 200 })
   * if (!res.unchanged) { options = res.items; version = res.version }
   *
   * // A type too large to send whole: search it
   * const found = await app.options.get(collectionId, appId, 'type:machine', { q: 'mix', limit: 20 })
   * ```
   */
  export async function get(
    collectionId: string,
    appId: string,
    source: string,
    opts: ListOptions & { q?: string; version?: string; admin?: boolean } = {},
  ): Promise<import('../types/appOptions').AppOptionsList> {
    const zone = opts.admin ? 'admin' : 'public'
    const query = listQuery({ q: opts.q, version: opts.version, limit: opts.limit, cursor: opts.cursor })
    return request(`/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/options/${encodeURIComponent(source)}${query}`)
  }

  /**
   * Save a value list's values, in order (admins). Codes never change and are never lost: a value left
   * out stays, switched off, at the end. → the list as saved.
   */
  export async function saveList(
    collectionId: string,
    appId: string,
    listId: string,
    values: import('../types/appOptions').AppOptionValueInput[],
  ): Promise<import('../types/appOptions').AppOptionsResponse> {
    return put(`/admin/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/options/${encodeURIComponent(`list:${listId}`)}`, { values })
  }
}

// ==================== CASES ====================

export namespace cases {
  /**
   * Build the base path for cases endpoints
   */
  function basePath(collectionId: string, appId: string, admin: boolean = false): string {
    const zone = admin ? 'admin' : 'public'
    return `/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/cases`
  }

  /**
   * Create a new case
   * POST /cases
   */
  export async function create(
    collectionId: string,
    appId: string,
    input: CreateCaseInput,
    admin: boolean = false
  ): Promise<AppCase> {
    const path = basePath(collectionId, appId, admin)
    return post<AppCase>(path, input)
  }

  /**
   * List cases with optional query parameters
   * GET /cases
   *
   * Returns `{ items, nextCursor, count }`: the cases are in `items`, `count` is how many match in
   * all, and `nextCursor` is `null` on the last page. Page with `limit` and `cursor`.
   * Sort with `orderBy`. A date field (`createdAt`, `updatedAt`, `closedAt`) takes a range: `{ gte, lte }`.
   * `includeDeleted`, `contactId` and `assignedTo` are for admin calls (`admin = true`) only: the
   * public list refuses a parameter it does not read.
   *
   * @example
   * ```typescript
   * let page = await app.cases.list(collectionId, appId, { status: 'open', limit: 50 })
   * console.log(page.items, page.count)
   * while (page.nextCursor) {
   *   page = await app.cases.list(collectionId, appId, { status: 'open', limit: 50, cursor: page.nextCursor })
   * }
   *
   * // This month's cases, most urgent first
   * await app.cases.list(collectionId, appId, {
   *   createdAt: { gte: '2026-11-01T00:00:00Z', lte: '2026-11-30T23:59:59Z' },
   *   orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
   * })
   * ```
   */
  export async function list(
    collectionId: string,
    appId: string,
    params?: CaseListQueryParams,
    admin: boolean = false
  ): Promise<ListResult<AppCase>> {
    const path = basePath(collectionId, appId, admin)
    return request<ListResult<AppCase>>(`${path}${appListQuery(params)}`)
  }

  /**
   * Get a single case by ID
   * GET /cases/:caseId
   */
  export async function get(
    collectionId: string,
    appId: string,
    caseId: string,
    admin: boolean = false
  ): Promise<AppCase> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(caseId)}`
    return request<AppCase>(path)
  }

  /**
   * Update a case
   * PATCH /cases/:caseId
   * Admin can update any field, public (owner) can only update data and owner zones
   */
  export async function update(
    collectionId: string,
    appId: string,
    caseId: string,
    input: UpdateCaseInput,
    admin: boolean = false
  ): Promise<AppCase> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(caseId)}`
    return patch<AppCase>(path, input)
  }

  /**
   * Soft delete a case
   * DELETE /cases/:caseId
   */
  export async function remove(
    collectionId: string,
    appId: string,
    caseId: string,
    admin: boolean = false
  ): Promise<{ success: boolean }> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(caseId)}`
    return del<{ success: boolean }>(path)
  }

  /**
   * Get aggregate statistics for cases
   * POST /cases/aggregate
   */
  export async function aggregate(
    collectionId: string,
    appId: string,
    request: AggregateRequest,
    admin: boolean = false
  ): Promise<AggregateResponse> {
    const path = `${basePath(collectionId, appId, admin)}/aggregate`
    return post<AggregateResponse>(path, request)
  }

  /**
   * Get case summary (admin only)
   * POST /cases/summary
   */
  export async function summary(
    collectionId: string,
    appId: string,
    request?: CaseSummaryRequest
  ): Promise<CaseSummaryResponse> {
    const path = `${basePath(collectionId, appId, true)}/summary`
    return post<CaseSummaryResponse>(path, request || {})
  }

  /**
   * Append an entry to case history (admin only)
   * POST /cases/:caseId/history
   */
  export async function appendHistory(
    collectionId: string,
    appId: string,
    caseId: string,
    input: AppendHistoryInput
  ): Promise<AppCase> {
    const path = `${basePath(collectionId, appId, true)}/${encodeURIComponent(caseId)}/history`
    return post<AppCase>(path, input)
  }

  /**
   * Get related threads and records for a case (admin only)
   * GET /cases/:caseId/related
   */
  export async function related(
    collectionId: string,
    appId: string,
    caseId: string
  ): Promise<RelatedResponse> {
    const path = `${basePath(collectionId, appId, true)}/${encodeURIComponent(caseId)}/related`
    return request<RelatedResponse>(path)
  }
}

// ==================== THREADS ====================

export namespace threads {
  /**
   * Build the base path for threads endpoints
   */
  function basePath(collectionId: string, appId: string, admin: boolean = false): string {
    const zone = admin ? 'admin' : 'public'
    return `/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/threads`
  }

  /**
   * Create a new thread
   * POST /threads
   */
  export async function create(
    collectionId: string,
    appId: string,
    input: CreateThreadInput,
    admin: boolean = false
  ): Promise<AppThread> {
    const path = basePath(collectionId, appId, admin)
    return post<AppThread>(path, input)
  }

  /**
   * List threads with optional query parameters
   * GET /threads
   *
   * Returns `{ items, nextCursor, count }`: the threads are in `items`, `count` is how many match in
   * all, and `nextCursor` is `null` on the last page. Page with `limit` and `cursor`.
   * Sort with `orderBy`. A date field (`createdAt`, `updatedAt`) takes a range: `{ gte, lte }`.
   * `includeDeleted` and `contactId` are for admin calls (`admin = true`) only: the public list
   * refuses a parameter it does not read.
   *
   * @example
   * ```typescript
   * let page = await app.threads.list(collectionId, appId, { parentType: 'case', parentId: caseId, limit: 50 })
   * console.log(page.items, page.count)
   * while (page.nextCursor) {
   *   page = await app.threads.list(collectionId, appId, { parentType: 'case', parentId: caseId, limit: 50, cursor: page.nextCursor })
   * }
   *
   * // The threads with the newest replies, started this month
   * await app.threads.list(collectionId, appId, {
   *   createdAt: { gte: '2026-11-01T00:00:00Z' },
   *   orderBy: [{ lastReplyAt: 'desc' }],
   * })
   * ```
   */
  export async function list(
    collectionId: string,
    appId: string,
    params?: ThreadListQueryParams,
    admin: boolean = false
  ): Promise<ListResult<AppThread>> {
    const path = basePath(collectionId, appId, admin)
    return request<ListResult<AppThread>>(`${path}${appListQuery(params)}`)
  }

  /**
   * Get a single thread by ID
   * GET /threads/:threadId
   */
  export async function get(
    collectionId: string,
    appId: string,
    threadId: string,
    admin: boolean = false
  ): Promise<AppThread> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(threadId)}`
    return request<AppThread>(path)
  }

  /**
   * Update a thread
   * PATCH /threads/:threadId
   * Admin can update any field, public (owner) can only update body, tags, data, owner
   */
  export async function update(
    collectionId: string,
    appId: string,
    threadId: string,
    input: UpdateThreadInput,
    admin: boolean = false
  ): Promise<AppThread> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(threadId)}`
    return patch<AppThread>(path, input)
  }

  /**
   * Soft delete a thread
   * DELETE /threads/:threadId
   */
  export async function remove(
    collectionId: string,
    appId: string,
    threadId: string,
    admin: boolean = false
  ): Promise<{ success: boolean }> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(threadId)}`
    return del<{ success: boolean }>(path)
  }

  /**
   * Add a reply to a thread
   * POST /threads/:threadId/reply
   * Atomically appends to replies array, increments replyCount, updates lastReplyAt
   */
  export async function reply(
    collectionId: string,
    appId: string,
    threadId: string,
    input: ReplyInput,
    admin: boolean = false
  ): Promise<AppThread> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(threadId)}/reply`
    return post<AppThread>(path, input)
  }

  /**
   * Delete a single reply from a thread by its reply id (moderation).
   * DELETE /threads/:threadId/reply/:replyId
   * Authorised for the reply's author, the proof owner, or a collection admin.
   */
  export async function deleteReply(
    collectionId: string,
    appId: string,
    threadId: string,
    replyId: string,
    admin: boolean = false
  ): Promise<AppThread> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(threadId)}/reply/${encodeURIComponent(replyId)}`
    return del<AppThread>(path)
  }

  /**
   * Get aggregate statistics for threads
   * POST /threads/aggregate
   */
  export async function aggregate(
    collectionId: string,
    appId: string,
    request: AggregateRequest,
    admin: boolean = false
  ): Promise<AggregateResponse> {
    const path = `${basePath(collectionId, appId, admin)}/aggregate`
    return post<AggregateResponse>(path, request)
  }
}

// ==================== RECORDS ====================

export namespace records {
  /**
   * Build the base path for records endpoints
   */
  function basePath(collectionId: string, appId: string, admin: boolean = false): string {
    const zone = admin ? 'admin' : 'public'
    return `/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/records`
  }

  /**
   * Create a new record
   * POST /records
   *
   * When called on the public endpoint (admin = false) with an anonymous
   * caller, and the app's `publicCreate.records.anonymous.edit.editToken`
   * policy is enabled, the response includes a one-time `editToken` string.
   * Store it immediately — it is never returned again.
   *
   * @see {@link updateWithToken} — use the edit token for a follow-up amendment
   */
  export async function create(
    collectionId: string,
    appId: string,
    input: CreateRecordInput,
    admin: boolean = false
  ): Promise<CreateRecordResponse> {
    const path = basePath(collectionId, appId, admin)
    return post<CreateRecordResponse>(path, input)
  }

  /**
   * The standard query on an app's records (admin only): filter, sort, page, count and total in one
   * call, reaching into a record's own fields by path, and following a record to its `product` and
   * its `contact`.
   * POST /admin/collection/:collectionId/app/:appId/records/query
   *
   * Fields: id, recordType, ref, status, visibility, customId, productId, variantId, batchId, proofId,
   * contactId, authorId, parentType, parentId, createdAt, updatedAt, startsAt, expiresAt, and the
   * documents data, owner and admin, reached by path: `"data.status"`, `"data.line.name"`.
   *
   * ```typescript
   * // How many work orders by status, and how many units on each
   * await app.records.query(collectionId, appId, {
   *   where: { recordType: 'work_order' },
   *   groupBy: ['data.status'],
   *   aggregates: { orders: { count: true }, units: { sum: 'data.qty' } },
   * })
   * ```
   */
  export async function query(
    collectionId: string,
    appId: string,
    body: StandardQuery = {}
  ): Promise<QueryResult> {
    return post<QueryResult>(`${basePath(collectionId, appId, true)}/query`, body)
  }

  /**
   * What a records query can use: its fields, what each can filter, sort, group or total, and its links.
   * GET /admin/collection/:collectionId/app/:appId/records/query
   */
  export async function queryFields(collectionId: string, appId: string): Promise<QueryDescription> {
    return request<QueryDescription>(`${basePath(collectionId, appId, true)}/query`)
  }

  /**
   * List records with optional query parameters
   * GET /records
   *
   * Returns `{ items, nextCursor, count }`: the records are in `items`, `count` is how many match in
   * all, and `nextCursor` is `null` on the last page. Page with `limit` and `cursor`.
   * Search with `q`, sort with `orderBy`. A date field (`createdAt`, `updatedAt`, `startsAt`,
   * `expiresAt`) takes a range: `{ gte, lte }`.
   *
   * Public/owner callers only receive records with `status: "active"`.
   * Admin callers can query all statuses (for example `draft`/`archived`).
   * `qFields`, `dataFilter`, `contactId` and `includeDeleted` are for admin calls (`admin = true`)
   * only: the public list refuses a parameter it does not read.
   *
   * @example
   * ```typescript
   * let page = await app.records.list(collectionId, appId, { recordType: 'tip', limit: 100 })
   * console.log(page.items, page.count)
   * while (page.nextCursor) {
   *   page = await app.records.list(collectionId, appId, { recordType: 'tip', limit: 100, cursor: page.nextCursor })
   * }
   *
   * // Tips about watering, changed this month, newest change first
   * await app.records.list(collectionId, appId, {
   *   recordType: 'tip',
   *   q: 'watering',
   *   updatedAt: { gte: '2026-11-01T00:00:00Z' },
   *   orderBy: [{ updatedAt: 'desc' }],
   * })
   * ```
   */
  export async function list(
    collectionId: string,
    appId: string,
    params?: RecordListQueryParams,
    admin: boolean = false
  ): Promise<ListResult<AppRecord>> {
    const path = basePath(collectionId, appId, admin)
    return request<ListResult<AppRecord>>(`${path}${appListQuery(params)}`)
  }

  /**
   * Get a single record by ID
   * GET /records/:recordId
   */
  export async function get(
    collectionId: string,
    appId: string,
    recordId: string,
    admin: boolean = false
  ): Promise<AppRecord> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(recordId)}`
    return request<AppRecord>(path)
  }

  /**
   * Update a record
   * PATCH /records/:recordId
   * Admin can update any field, public (owner) can only update data and owner
   */
  export async function update(
    collectionId: string,
    appId: string,
    recordId: string,
    input: UpdateRecordInput,
    admin: boolean = false
  ): Promise<AppRecord> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(recordId)}`
    return patch<AppRecord>(path, input)
  }

  /**
   * Amend the `data` zone of a record using an anonymous edit token.
   * PATCH /records/:recordId  (public endpoint, no auth)
   *
   * This is the follow-up call after an anonymous `create()` that returned an
   * `editToken`.  Present the token via `X-Edit-Token` — the server validates
   * it with a constant-time comparison and, if `windowMinutes` is configured
   * in the policy, checks that the token has not expired.
   *
   * **Scope:** only the `data` zone may be modified via this path.
   * `owner`, `admin`, `status`, `visibility`, and indexed fields are
   * immutable to anonymous token holders.
   *
   * @param collectionId - Collection the record belongs to
   * @param appId        - App the record belongs to
   * @param recordId     - ID of the record to amend
   * @param data         - New (full replacement) value for the `data` zone
   * @param editToken    - Token received from the original `create()` response
   *
   * @example
   * ```ts
   * const record = await app.records.create(collectionId, appId, {
   *   recordType: 'payment',
   *   visibility: 'public',
   *   data: { amount: 9900, currency: 'USD' },
   * })
   * const { editToken } = record  // store this immediately!
   *
   * // Later, once the payment gateway confirms:
   * const updated = await app.records.updateWithToken(
   *   collectionId,
   *   appId,
   *   record.id,
   *   { amount: 9900, currency: 'USD', transactionId: 'txn_abc123' },
   *   editToken,
   * )
   * ```
   *
   * ### Error codes
   * | HTTP | `errorCode`           | Meaning                                           |
   * |------|-----------------------|---------------------------------------------------|
   * | 401  | `UNAUTHORIZED`        | No auth token and no `X-Edit-Token` header        |
   * | 403  | `FORBIDDEN`           | Policy not enabled, or token does not match       |
   * | 403  | `EDIT_WINDOW_EXPIRED` | `windowMinutes` elapsed since record creation     |
   * | 404  | `NOT_FOUND`           | Record does not exist                             |
   */
  export async function updateWithToken(
    collectionId: string,
    appId: string,
    recordId: string,
    data: Record<string, unknown>,
    editToken: string
  ): Promise<AppRecord> {
    const path = `${basePath(collectionId, appId, false)}/${encodeURIComponent(recordId)}`
    return patch<AppRecord>(path, { data }, { 'X-Edit-Token': editToken })
  }

  /**
   * Soft delete a record
   * DELETE /records/:recordId
   */
  export async function remove(
    collectionId: string,
    appId: string,
    recordId: string,
    admin: boolean = false
  ): Promise<{ success: boolean }> {
    const path = `${basePath(collectionId, appId, admin)}/${encodeURIComponent(recordId)}`
    return del<{ success: boolean }>(path)
  }

  /**
   * Get aggregate statistics for records
   * POST /records/aggregate
   */
  export async function aggregate(
    collectionId: string,
    appId: string,
    request: AggregateRequest,
    admin: boolean = false
  ): Promise<AggregateResponse> {
    const path = `${basePath(collectionId, appId, admin)}/aggregate`
    return post<AggregateResponse>(path, request)
  }

  /**
   * Restore a soft-deleted record.
   * POST /records/:recordId/restore (admin only)
   */
  export async function restore(
    collectionId: string,
    appId: string,
    recordId: string
  ): Promise<AppRecord> {
    const path = `${basePath(collectionId, appId, true)}/${encodeURIComponent(recordId)}/restore`
    return post<AppRecord>(path, {})
  }

  /**
   * Upsert a record by ref — creates if no record with that ref exists,
   * otherwise updates. Scope, specificity, and ref are canonicalized on write.
   * POST /records/upsert (admin only)
   */
  export async function upsert(
    collectionId: string,
    appId: string,
    input: UpsertRecordInput
  ): Promise<UpsertRecordResponse> {
    const path = `${basePath(collectionId, appId, true)}/upsert`
    return post<UpsertRecordResponse>(path, input)
  }

  /**
   * Match records against a runtime target scope.
   * Returns `{ items, nextCursor, count, strategy }`: `items` are the records whose scope is satisfied
   * by the target, most specific first, and `count` is how many matched. Without a `limit` it answers
   * up to 100. Give a `limit` (in `input`) to page: when there are more, pass `nextCursor` back as
   * `cursor`.
   * POST /records/match
   *
   * @param admin - false for public endpoint (visibility-filtered, active-only), true for admin
   *
   * @example
   * ```ts
   * const { items } = await app.records.match(collectionId, appId, {
   *   target: { productId: 'prod_abc', facets: { tier: ['gold'] } },
   *   strategy: 'best',
   *   recordType: 'nutrition',
   * }, true);
   * const best = items[0] // the single highest-specificity nutrition record
   *
   * // 50 at a time
   * const target = { productId: 'prod_abc' }
   * let page = await app.records.match(collectionId, appId, { target, limit: 50 })
   * while (page.nextCursor) {
   *   page = await app.records.match(collectionId, appId, { target, limit: 50, cursor: page.nextCursor })
   * }
   * ```
   */
  export async function match(
    collectionId: string,
    appId: string,
    input: MatchRecordsInput,
    admin: boolean = false
  ): Promise<MatchResult> {
    const path = `${basePath(collectionId, appId, admin)}/match`
    return post<MatchResult>(path, input)
  }

  /**
   * Upsert up to 500 records in a single transaction.
   * Each row is individually error-isolated — a failure on one row does not
   * abort the others.
   * POST /records/bulk-upsert (admin only)
   */
  export async function bulkUpsert(
    collectionId: string,
    appId: string,
    records: BulkUpsertItem[]
  ): Promise<BulkUpsertResult> {
    const path = `${basePath(collectionId, appId, true)}/bulk-upsert`
    return post<BulkUpsertResult>(path, { records })
  }

  /**
   * Soft-delete records in bulk.
   * Supports two modes:
   * - **refs mode**: explicit list of refs (max 1000)
   * - **scope mode**: delete by scope anchor (productId / variantId / etc.)
   *
   * POST /records/bulk-delete (admin only)
   *
   * @example
   * ```ts
   * // Refs mode
   * await app.records.bulkDelete(collectionId, appId, {
   *   refs: ['product:prod_abc', 'product:prod_xyz'],
   *   recordType: 'nutrition',
   * });
   *
   * // Scope mode
   * await app.records.bulkDelete(collectionId, appId, {
   *   scope: { productId: 'prod_abc' },
   * });
   * ```
   */
  export async function bulkDelete(
    collectionId: string,
    appId: string,
    input: BulkDeleteInput
  ): Promise<BulkDeleteResult> {
    const path = `${basePath(collectionId, appId, true)}/bulk-delete`
    return post<BulkDeleteResult>(path, input)
  }

  /**
   * Resolve every applicable record for a product context in one call.
   * Returns `{ items, nextCursor, count, context, truncated }`: `items` are the records across all
   * tiers (proof, batch, variant, product, rule, facet, collection), deduplicated and sorted by
   * specificity descending, each as `{ record, matchedAt, specificity }`. Without a `limit` it answers
   * up to 500. Give a `limit` (in `input`) to page: when there are more, pass `nextCursor` back as
   * `cursor`.
   * POST /records/resolve-all
   *
   * @param admin - false for public (visibility-filtered, active-only), true for admin (all statuses)
   *
   * @example
   * ```ts
   * const { items } = await app.records.resolveAll(collectionId, appId, {
   *   context: { productId: 'prod_abc' },
   *   recordType: 'nutrition',
   * })
   * for (const { record, matchedAt } of items) console.log(matchedAt, record.data)
   *
   * // 100 at a time
   * const context = { productId: 'prod_abc' }
   * let page = await app.records.resolveAll(collectionId, appId, { context, limit: 100 })
   * while (page.nextCursor) {
   *   page = await app.records.resolveAll(collectionId, appId, { context, limit: 100, cursor: page.nextCursor })
   * }
   * ```
   */
  export async function resolveAll(
    collectionId: string,
    appId: string,
    input: ResolveAllParams,
    admin: boolean = false
  ): Promise<ResolveAllResult> {
    const path = `${basePath(collectionId, appId, admin)}/resolve-all`
    return post<ResolveAllResult>(path, input)
  }

  /**
   * Preview which products in the collection match a given facetRule.
   * Admin only. Use for live "matches N products" feedback while authoring a rule.
   * POST /records/preview-rule
   */
  export async function previewRule(
    collectionId: string,
    appId: string,
    input: PreviewRuleParams
  ): Promise<PreviewRuleResult> {
    const path = `${basePath(collectionId, appId, true)}/preview-rule`
    return post<PreviewRuleResult>(path, input)
  }
}

} // end namespace app

// ==================== HELPERS ====================

/**
 * The query string of a cases / threads / records list, in the order the options were given. Paging and
 * the standard words (`q`, `orderBy`, a date range) go through `listQuery`. Two filters keep their own
 * spelling: `parentIds` is sent comma-joined, and `dataFilter` as `dataFilter[key]=value` (repeated for
 * an array of values).
 */
function appListQuery(params?: Record<string, any>): string {
  if (!params) return ''
  const parts: string[] = []
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    if (key === 'dataFilter' && typeof value === 'object' && !Array.isArray(value)) {
      for (const [sub, subValue] of Object.entries(value as Record<string, unknown>)) {
        for (const v of Array.isArray(subValue) ? subValue : [subValue]) {
          if (v === undefined || v === null) continue
          parts.push(`${encodeURIComponent(`${key}[${sub}]`)}=${encodeURIComponent(String(v))}`)
        }
      }
      continue
    }
    const one = listQuery({ [key]: key === 'parentIds' && Array.isArray(value) ? value.join(',') : value })
    if (one) parts.push(one.slice(1))
  }
  return parts.length ? `?${parts.join('&')}` : ''
}
