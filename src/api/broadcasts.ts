// src/api/broadcasts.ts
import { request, post, patch, del } from "../http"
import type {
  BroadcastQueryByUser,
  RecipientIdsQuery,
  RecipientsWithoutActionQuery,
  RecipientsWithActionQuery,
  AppendBroadcastBody,
  AppendBroadcastBulkBody,
  BroadcastEvent,
  RecipientId,
  RecipientWithOutcome,
  AppendResult,
  AppendBulkResult,
  CreateBroadcastBody,
  UpdateBroadcastBody,
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
  /**
   * POST /admin/collection/:collectionId/broadcasts/by-user
   * Returns broadcast events array, newest first.
   */
  export async function byUser(
    collectionId: string,
    query: BroadcastQueryByUser = {}
  ): Promise<BroadcastEvent[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/by-user`
    return post<BroadcastEvent[]>(path, query)
  }

  /**
   * POST /admin/collection/:collectionId/broadcasts/recipient-ids
   * Returns recipient IDs for a broadcast.
   */
  export async function recipientIds(
    collectionId: string,
    query: RecipientIdsQuery
  ): Promise<RecipientId[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/recipient-ids`
    return post<RecipientId[]>(path, query)
  }

  /**
   * POST /admin/collection/:collectionId/broadcasts/recipients/without-action
   * Returns IDs who received the broadcast but did not perform an action.
   */
  export async function recipientsWithoutAction(
    collectionId: string,
    query: RecipientsWithoutActionQuery
  ): Promise<RecipientId[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/recipients/without-action`
    return post<RecipientId[]>(path, query)
  }

  /**
   * POST /admin/collection/:collectionId/broadcasts/recipients/with-action
   * Returns IDs who received the broadcast and performed an action; optionally includes outcome.
   */
  export async function recipientsWithAction(
    collectionId: string,
    query: RecipientsWithActionQuery
  ): Promise<RecipientId[] | RecipientWithOutcome[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/recipients/with-action`
    return post<RecipientId[] | RecipientWithOutcome[]>(path, query)
  }

  /**
   * POST /admin/collection/:collectionId/broadcasts/append
   * Appends one broadcast event.
   */
  export async function append(
    collectionId: string,
    body: AppendBroadcastBody
  ): Promise<AppendResult> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/append`
    return post<AppendResult>(path, body)
  }

  /**
   * POST /admin/collection/:collectionId/broadcasts/append/bulk
   * Appends many broadcast recipients.
   * Accepts preferred body shape with params + ids, and legacy flat shape.
   */
  export async function appendBulk(
    collectionId: string,
    body: AppendBroadcastBulkBody | ({ broadcastId: string; ids: string[]; idField?: 'userId'|'contactId'; [k: string]: any })
  ): Promise<AppendBulkResult> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/broadcasts/append/bulk`
    return post<AppendBulkResult>(path, body)
  }

  // CRUD: Create broadcast
  export async function create(
    collectionId: string,
    body: CreateBroadcastBody
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
    body: UpdateBroadcastBody
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
