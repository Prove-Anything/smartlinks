// src/api/interactions.ts
import { request, post, patch, del } from "../http"
import type {
  // Admin/public analytics
  AdminInteractionsByUserRequest,
  AdminInteractionsCountsByOutcomeRequest,
  AdminActorIdsByInteractionRequest,
  AppendInteractionBody,
  UpdateInteractionBody,
  OutcomeCount,
  ActorId,
  ActorWithOutcome,
  InteractionEventRow,
  PublicInteractionsCountsByOutcomeRequest,
  PublicInteractionsByUserRequest,
  // CRUD
  CreateInteractionTypeBody,
  UpdateInteractionTypeBody,
  ListInteractionTypesQuery,
  InteractionTypeRecord,
  InteractionTypeList,
} from "../types/interaction"

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

export namespace interactions {
  /**
   * POST /admin/collection/:collectionId/interactions/by-user
   * Returns BigQuery interaction rows, newest first.
   */
  export async function byUser(
    collectionId: string,
    query: AdminInteractionsByUserRequest = {}
  ): Promise<InteractionEventRow[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/by-user`
    return post<InteractionEventRow[]>(path, query)
  }

  /**
   * POST /admin/collection/:collectionId/interactions/counts-by-outcome
   * Returns array of { outcome, count }.
   */
  export async function countsByOutcome(
    collectionId: string,
    query: AdminInteractionsCountsByOutcomeRequest = {}
  ): Promise<OutcomeCount[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/counts-by-outcome`
    return post<OutcomeCount[]>(path, query)
  }

  /**
   * POST /admin/collection/:collectionId/interactions/actor-ids/by-interaction
   * Returns list of IDs, optionally with outcome when includeOutcome=true.
   */
  export async function actorIdsByInteraction(
    collectionId: string,
    query: AdminActorIdsByInteractionRequest
  ): Promise<ActorId[] | ActorWithOutcome[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/actor-ids/by-interaction`
    return post<ActorId[] | ActorWithOutcome[]>(path, query)
  }

  /**
   * POST /admin/collection/:collectionId/interactions/append
   * Appends one interaction event.
   */
  export async function appendEvent(
    collectionId: string,
    body: AppendInteractionBody
  ): Promise<{ success: true }> {
    if (!body.userId && !body.contactId) {
      throw new Error("AppendInteractionBody must include one of userId or contactId")
    }
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/append`
    return post<{ success: true }>(path, body)
  }

  export async function updateEvent(
    collectionId: string,
    body: UpdateInteractionBody
  ): Promise<{ success: true }> {
    if (!body.userId && !body.contactId) {
      throw new Error("AppendInteractionBody must include one of userId or contactId")
    }
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/append`
    return post<{ success: true }>(path, body)
  }

/**
   * Appends one interaction event from a public source.
   */
  export async function submitPublicEvent(
    collectionId: string,
    body: AppendInteractionBody
  ): Promise<{ success: true }> {
    if (!body.userId && !body.contactId) {
      throw new Error("AppendInteractionBody must include one of userId or contactId")
    }
    const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/submit`
    return post<{ success: true }>(path, body)
  }


  // CRUD: Interaction Types (Postgres)
  export async function create(
    collectionId: string,
    body: CreateInteractionTypeBody
  ): Promise<InteractionTypeRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/`
    return post<InteractionTypeRecord>(path, body)
  }

  export async function list(
    collectionId: string,
    query: ListInteractionTypesQuery = {}
  ): Promise<InteractionTypeList> {
    const qs = encodeQuery(query as any)
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/${qs}`
    return request<InteractionTypeList>(path)
  }

  export async function get(
    collectionId: string,
    id: string
  ): Promise<InteractionTypeRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/${encodeURIComponent(id)}`
    return request<InteractionTypeRecord>(path)
  }

  export async function update(
    collectionId: string,
    id: string,
    patchBody: UpdateInteractionTypeBody
  ): Promise<InteractionTypeRecord> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/${encodeURIComponent(id)}`
    return patch<InteractionTypeRecord>(path, patchBody)
  }

  export async function remove(
    collectionId: string,
    id: string
  ): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/${encodeURIComponent(id)}`
    return del<void>(path)
  }

  // Public endpoints (permission-aware)
  export async function publicCountsByOutcome(
    collectionId: string,
    body: PublicInteractionsCountsByOutcomeRequest,
    authToken?: string
  ): Promise<OutcomeCount[]> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/counts-by-outcome`
    const headers = authToken ? { AUTHORIZATION: `Bearer ${authToken}` } : undefined
    return post<OutcomeCount[]>(path, body, headers)
  }

  export async function publicMyInteractions(
    collectionId: string,
    body: PublicInteractionsByUserRequest,
    authToken?: string
  ): Promise<InteractionEventRow[]> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/by-user`
    const headers = authToken ? { AUTHORIZATION: `Bearer ${authToken}` } : undefined
    return post<InteractionEventRow[]>(path, body, headers)
  }
}
