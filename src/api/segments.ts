// src/api/segments.ts
import { request, post, patch, del } from "../http"
import type {
  SegmentRecord,
  ListSegmentsQuery,
  SegmentList,
  SegmentCalculateResult,
  SegmentRecipientsResponse,
} from "../types/segments"

function encodeQuery(params: Record<string, any>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue
    if (typeof value === "boolean") search.set(key, value ? "true" : "false")
    else search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export namespace segments {
  // Create
  export async function create(
    collectionId: string,
    body: Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>
  ): Promise<SegmentRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/`
    return post<SegmentRecord>(path, body)
  }

  // List
  export async function list(
    collectionId: string,
    query: ListSegmentsQuery = {}
  ): Promise<SegmentList> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeQuery(query as any)}`
    return request<SegmentList>(path)
  }

  // Get
  export async function get(
    collectionId: string,
    id: string
  ): Promise<SegmentRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}`
    return request<SegmentRecord>(path)
  }

  // Update
  export async function update(
    collectionId: string,
    id: string,
    body: Partial<Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>>
  ): Promise<SegmentRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}`
    return patch<SegmentRecord>(path, body)
  }

  // Delete
  export async function remove(
    collectionId: string,
    id: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}`
    return del<void>(path)
  }

  // Stub: calculate
  export async function calculate(
    collectionId: string,
    id: string
  ): Promise<SegmentCalculateResult> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}/calculate`
    return post<SegmentCalculateResult>(path, {})
  }

  // Stub: recipients
  export async function recipients(
    collectionId: string,
    id: string,
    query: { limit?: number; offset?: number } = {}
  ): Promise<SegmentRecipientsResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}/recipients${encodeQuery(query as any)}`
    return request<SegmentRecipientsResponse>(path)
  }
}
