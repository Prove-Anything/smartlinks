// src/api/broadcasts.ts
import { request, post, patch, del } from "../http"
import type {
  ListBroadcastsQuery,
  BroadcastRecord,
  BroadcastList,
} from "../types/broadcasts"

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
}
