// src/api/broadcasts.ts
import { request, post, patch, del } from "../http"
import type {
  ListBroadcastsQuery,
  BroadcastRecord,
  BroadcastRecipientsResponse,
  BroadcastPreviewRequest,
  BroadcastPreviewResponse,
  BroadcastSendTestRequest,
  BroadcastSendTestResponse,
  BroadcastSendManualRequest,
  BroadcastSendManualResponse,
  BroadcastAppendEventBody,
  BroadcastAppendBulkBody,
  BroadcastChannel,
  BroadcastSendRequest,
} from "../types/broadcasts"
import type { AppendResult, AppendBulkResult } from "../types/comms"
import type { ListResult, ListOptions } from "../types/list"
import { listQuery } from "../list"

export namespace broadcasts {
  // CRUD: Create broadcast
  export async function create(
    collectionId: string,
    body: Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>
  ): Promise<BroadcastRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/`
    return post<BroadcastRecord>(path, body)
  }

  /**
   * The collection's broadcasts, a page at a time. Filter by the app that owns them (`appId`).
   *
   * @example
   * ```typescript
   * let page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50 })
   * page.items // BroadcastRecord[]
   * while (page.nextCursor) page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50, cursor: page.nextCursor })
   * ```
   */
  export async function list(
    collectionId: string,
    query: ListBroadcastsQuery = {}
  ): Promise<ListResult<BroadcastRecord>> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${listQuery(query)}`
    return request<ListResult<BroadcastRecord>>(path)
  }

  // CRUD: Get a single broadcast
  export async function get(
    collectionId: string,
    id: string
  ): Promise<BroadcastRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}`
    return request<BroadcastRecord>(path)
  }

  // CRUD: Update a broadcast
  export async function update(
    collectionId: string,
    id: string,
    body: Partial<Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>>
  ): Promise<BroadcastRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}`
    return patch<BroadcastRecord>(path, body)
  }

  // CRUD: Delete a broadcast
  export async function remove(
    collectionId: string,
    id: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}`
    return del<void>(path)
  }

  /**
   * The contacts a broadcast goes to (its segment), a page at a time. `count` is how many there are in
   * all. A broadcast with no segment answers an empty page with a `note`.
   *
   * @example
   * ```typescript
   * const page = await broadcasts.recipients('coll_123', 'broadcast_1', { limit: 50 })
   * page.items      // Recipient[]
   * page.count      // how many in all
   * page.nextCursor // pass back as `cursor` for the next page; null on the last
   * ```
   */
  export async function recipients(
    collectionId: string,
    id: string,
    query: ListOptions = {}
  ): Promise<BroadcastRecipientsResponse> {
    const qs = listQuery(query)
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}/recipients${qs}`
    return request<BroadcastRecipientsResponse>(path)
  }

  // Preview a broadcast template/email
  export async function preview(
    collectionId: string,
    id: string,
    body: BroadcastPreviewRequest
  ): Promise<BroadcastPreviewResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}/preview`
    return post<BroadcastPreviewResponse>(path, body)
  }

  // Enqueue send for a broadcast (202 Accepted)
  export async function send(
    collectionId: string,
    id: string,
    body: BroadcastSendRequest = {}
  ): Promise<{ ok: true; enqueued: true }> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}/send`
    return post<{ ok: true; enqueued: true }>(path, body)
  }

  // Alias for clarity with docs naming
  export const sendBroadcast = send

  // Send a single test email
  export async function sendTest(
    collectionId: string,
    id: string,
    body: BroadcastSendTestRequest
  ): Promise<BroadcastSendTestResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}/send/test`
    return post<BroadcastSendTestResponse>(path, body)
  }

  // Manually send a page of emails
  export async function sendManual(
    collectionId: string,
    id: string,
    body: BroadcastSendManualRequest
  ): Promise<BroadcastSendManualResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeURIComponent(id)}/send/manual`
    return post<BroadcastSendManualResponse>(path, body)
  }

  // Append a single broadcast event
  export async function append(
    collectionId: string,
    body: BroadcastAppendEventBody
  ): Promise<AppendResult> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/append`
    return post<AppendResult>(path, body)
  }

  // Append many broadcast events
  export async function appendBulk(
    collectionId: string,
    body: BroadcastAppendBulkBody
  ): Promise<AppendBulkResult> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/append/bulk`
    return post<AppendBulkResult>(path, body)
  }
}
