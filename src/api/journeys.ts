// src/api/journeys.ts
import { request, post, patch, del } from "../http"
import type {
  JourneyRecord,
  JourneyList,
  ListJourneysQuery,
  CreateJourneyBody,
  UpdateJourneyBody,
} from "../types/journeys"

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

  // List
  export async function list(
    collectionId: string,
    query: ListJourneysQuery = {}
  ): Promise<JourneyList> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/journeys/${encodeQuery(query as any)}`
    return request<JourneyList>(path)
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
