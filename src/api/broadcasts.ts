// src/api/broadcasts.ts
import { request, post, patch, del } from "../http"
import type {
  ListBroadcastsQuery,
  BroadcastRecord,
  BroadcastList,
  BroadcastRecipientsResponse,
  BroadcastPreviewRequest,
  BroadcastPreviewResponse,
  BroadcastSendTestRequest,
  BroadcastSendTestResponse,
  BroadcastSendManualRequest,
  BroadcastSendManualResponse,
  BroadcastAppendEventBody,
  BroadcastAppendBulkBody,
} from "../types/broadcasts"
import type { AppendResult, AppendBulkResult } from "../types/comms"

function encodeQuery(params: Record<string, any>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue
    if (typeof value === "boolean") {
      search.set(key, value ? "true" : "false")
    } else {
      search.set(key, String(value))
    }
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export namespace broadcasts {
  // CRUD: Create broadcast
  export async function create(
    collectionId: string,
    body: Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>
  ): Promise<BroadcastRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/`
    return post<BroadcastRecord>(path, body)
  }

  // CRUD: List broadcasts (GET with query)
  export async function list(
    collectionId: string,
    query: ListBroadcastsQuery = {}
  ): Promise<BroadcastList> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/${encodeQuery(query as any)}`
    return request<BroadcastList>(path)
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

  // Recipients listing for a broadcast
  export async function recipients(
    collectionId: string,
    id: string,
    query: { limit?: number; offset?: number } = {}
  ): Promise<BroadcastRecipientsResponse> {
    const qs = encodeQuery(query as any)
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
    body: { pageSize?: number; maxPages?: number; sharedContext?: Record<string, any>; subject?: string } = {}
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
