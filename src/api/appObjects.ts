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
  UpdateRecordInput,
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
    return `/api/v1/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/cases`
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
    return `/api/v1/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/threads`
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
    return `/api/v1/${zone}/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}/records`
  }

  /**
   * Create a new record
   * POST /records
   */
  export async function create(
    collectionId: string,
    appId: string,
    input: CreateRecordInput,
    admin: boolean = false
  ): Promise<AppRecord> {
    const path = basePath(collectionId, appId, admin)
    return post<AppRecord>(path, input)
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
