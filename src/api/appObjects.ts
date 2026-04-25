// src/api/appObjects.ts
import { request, post, patch, del } from '../http'
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
  PaginatedResponse,
  AggregateRequest,
  AggregateResponse,
  RelatedResponse
} from '../types/appObjects'

// ==================== APP NAMESPACE ====================

export namespace app {

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
   */
  export async function list(
    collectionId: string,
    appId: string,
    params?: CaseListQueryParams,
    admin: boolean = false
  ): Promise<PaginatedResponse<AppCase>> {
    const path = basePath(collectionId, appId, admin)
    const queryParams = params ? buildQueryString(params) : ''
    return request<PaginatedResponse<AppCase>>(`${path}${queryParams}`)
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
   */
  export async function list(
    collectionId: string,
    appId: string,
    params?: ThreadListQueryParams,
    admin: boolean = false
  ): Promise<PaginatedResponse<AppThread>> {
    const path = basePath(collectionId, appId, admin)
    const queryParams = params ? buildQueryString(params) : ''
    return request<PaginatedResponse<AppThread>>(`${path}${queryParams}`)
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
   * List records with optional query parameters
   * GET /records
   */
  export async function list(
    collectionId: string,
    appId: string,
    params?: RecordListQueryParams,
    admin: boolean = false
  ): Promise<PaginatedResponse<AppRecord>> {
    const path = basePath(collectionId, appId, admin)
    const queryParams = params ? buildQueryString(params) : ''
    return request<PaginatedResponse<AppRecord>>(`${path}${queryParams}`)
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
   * Returns records whose scope is satisfied by the target,
   * ordered by specificity descending (most specific first).
   * POST /records/match
   *
   * @param admin - false for public endpoint (visibility-filtered), true for admin
   *
   * @example
   * ```ts
   * const { records, best } = await app.records.match(collectionId, appId, {
   *   target: { productId: 'prod_abc', facets: { tier: ['gold'] } },
   *   strategy: 'best',
   *   recordType: 'nutrition',
   * }, true);
   * // best.nutrition → the single highest-specificity nutrition record
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
}

} // end namespace app

// ==================== HELPERS ====================

/**
 * Build a query string from an object of parameters
 */
function buildQueryString(params: Record<string, any>): string {
  const entries = Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
  if (entries.length === 0) return ''

  const queryString = entries
    .map(([key, value]) => {
      const encodedKey = encodeURIComponent(key)
      const encodedValue = encodeURIComponent(String(value))
      return `${encodedKey}=${encodedValue}`
    })
    .join('&')

  return `?${queryString}`
}
