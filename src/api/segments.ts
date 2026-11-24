// src/api/segments.ts
import { request, post, patch, del } from "../http"
import type {
  SegmentRecord,
  ListSegmentsQuery,
  SegmentCalculateResult,
  SegmentRecipientsResponse,
} from "../types/segments"
import type { ListResult, ListOptions } from "../types/list"

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

  /**
   * The collection's segments, a page at a time. Filter by the app that owns them (`appId`) or by
   * `filterType`.
   *
   * @example
   * ```typescript
   * let page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50 })
   * page.items // SegmentRecord[]
   * while (page.nextCursor) page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50, cursor: page.nextCursor })
   * ```
   */
  export async function list(
    collectionId: string,
    query: ListSegmentsQuery = {}
  ): Promise<ListResult<SegmentRecord>> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeQuery(query as any)}`
    return request<ListResult<SegmentRecord>>(path)
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

  /**
   * The contacts in a segment, a page at a time. `count` is how many there are in all.
   *
   * @example
   * ```typescript
   * const page = await segments.recipients('coll_123', 'seg_1', { limit: 100 })
   * page.items      // Recipient[]
   * page.count      // total in the segment
   * page.nextCursor // pass back as `cursor` for the next page; null on the last
   * ```
   */
  export async function recipients(
    collectionId: string,
    id: string,
    query: ListOptions = {}
  ): Promise<SegmentRecipientsResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/segments/${encodeURIComponent(id)}/recipients${encodeQuery(query as any)}`
    return request<SegmentRecipientsResponse>(path)
  }
}
