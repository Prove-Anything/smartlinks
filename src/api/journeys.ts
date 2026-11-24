// src/api/journeys.ts
import { request, post, patch, del } from "../http"
import type {
  JourneyRecord,
  ListJourneysQuery,
  CreateJourneyBody,
  UpdateJourneyBody,
} from "../types/journeys"
import type { ListResult } from "../types/list"

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

export namespace journeys {
  // Create
  export async function create(
    collectionId: string,
    body: CreateJourneyBody
  ): Promise<JourneyRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys/`
    return post<JourneyRecord>(path, body)
  }

  /**
   * List the collection's journeys (admin).
   * GET /admin/collection/:collectionId/journeys
   *
   * @example
   * ```typescript
   * let page = await journeys.list('coll_123', { active: true, limit: 50 })
   * while (page.nextCursor) page = await journeys.list('coll_123', { active: true, limit: 50, cursor: page.nextCursor })
   * ```
   */
  export async function list(
    collectionId: string,
    query: ListJourneysQuery = {}
  ): Promise<ListResult<JourneyRecord>> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys/${encodeQuery(query as any)}`
    return request<ListResult<JourneyRecord>>(path)
  }

  // Get
  export async function get(
    collectionId: string,
    id: string
  ): Promise<JourneyRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys/${encodeURIComponent(id)}`
    return request<JourneyRecord>(path)
  }

  // Update
  export async function update(
    collectionId: string,
    id: string,
    body: UpdateJourneyBody
  ): Promise<JourneyRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys/${encodeURIComponent(id)}`
    return patch<JourneyRecord>(path, body)
  }

  // Delete
  export async function remove(
    collectionId: string,
    id: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys/${encodeURIComponent(id)}`
    return del<void>(path)
  }
}
