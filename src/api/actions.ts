// src/api/actions.ts
import { request, post, patch, del } from "../http"
import type {
  // Admin/public analytics
  ActionQueryByUser,
  ActionCountsQuery,
  ActorIdsByActionQuery,
  AppendActionBody,
  OutcomeCount,
  ActorId,
  ActorWithOutcome,
  ActionEventRow,
  AdminByUserRequest,
  AdminCountsByOutcomeRequest,
  AdminActorIdsByActionRequest,
  PublicCountsByOutcomeRequest,
  PublicByUserRequest,
  // CRUD
  CreateActionBody,
  UpdateActionBody,
  ListActionsQuery,
  ActionRecord,
  ActionList,
} from "../types/actions"

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

export namespace actions {
  /**
   * POST /admin/collection/:collectionId/actions/by-user
   * Returns BigQuery action rows, newest first.
   */
  export async function byUser(
    collectionId: string,
    query: AdminByUserRequest | ActionQueryByUser = {}
  ): Promise<ActionEventRow[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/by-user`
    return post<ActionEventRow[]>(path, query)
  }

  /**
   * POST /admin/collection/:collectionId/actions/counts-by-outcome
   * Returns array of { outcome, count }.
   */
  export async function countsByOutcome(
    collectionId: string,
    query: AdminCountsByOutcomeRequest | ActionCountsQuery = {}
  ): Promise<OutcomeCount[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/counts-by-outcome`
    return post<OutcomeCount[]>(path, query)
  }

  /**
   * POST /admin/collection/:collectionId/actions/actor-ids/by-action
   * Returns list of IDs, optionally with outcome when includeOutcome=true.
   */
  export async function actorIdsByAction(
    collectionId: string,
    query: AdminActorIdsByActionRequest | ActorIdsByActionQuery
  ): Promise<ActorId[] | ActorWithOutcome[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/actor-ids/by-action`
    return post<ActorId[] | ActorWithOutcome[]>(path, query)
  }

  /**
   * POST /admin/collection/:collectionId/actions/append
   * Appends one action event.
   */
  export async function append(
    collectionId: string,
    body: AppendActionBody
  ): Promise<{ success: true }> {
    if (!body.userId && !body.contactId) {
      throw new Error("AppendActionBody must include one of userId or contactId")
    }
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/append`
    return post<{ success: true }>(path, body)
  }

  // CRUD: Actions (Postgres)
  export async function create(
    collectionId: string,
    body: CreateActionBody
  ): Promise<ActionRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/`
    return post<ActionRecord>(path, body)
  }

  export async function list(
    collectionId: string,
    query: ListActionsQuery = {}
  ): Promise<ActionList> {
    const qs = encodeQuery(query as any)
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/${qs}`
    return request<ActionList>(path)
  }

  export async function get(
    collectionId: string,
    id: string
  ): Promise<ActionRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/${encodeURIComponent(id)}`
    return request<ActionRecord>(path)
  }

  export async function update(
    collectionId: string,
    id: string,
    patchBody: UpdateActionBody
  ): Promise<ActionRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/${encodeURIComponent(id)}`
    return patch<ActionRecord>(path, patchBody)
  }

  export async function remove(
    collectionId: string,
    id: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/${encodeURIComponent(id)}`
    return del<void>(path)
  }

  // Public endpoints (permission-aware)
  export async function publicCountsByOutcome(
    collectionId: string,
    body: PublicCountsByOutcomeRequest,
    authToken?: string
  ): Promise<OutcomeCount[]> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/actions/counts-by-outcome`
    const headers = authToken ? { AUTHORIZATION: `Bearer ${authToken}` } : undefined
    return post<OutcomeCount[]>(path, body, headers)
  }

  export async function publicMyActions(
    collectionId: string,
    body: PublicByUserRequest,
    authToken?: string
  ): Promise<ActionEventRow[]> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/actions/by-user`
    const headers = authToken ? { AUTHORIZATION: `Bearer ${authToken}` } : undefined
    return post<ActionEventRow[]>(path, body, headers)
  }
}
