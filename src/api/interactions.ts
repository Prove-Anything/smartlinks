// src/api/interactions.ts
import { request, post, patch, del } from "../http"
import type {
  // Admin/public analytics
  AdminInteractionsCountsByOutcomeRequest,
  AdminInteractionsQueryRequest,
  AdminInteractionsAggregateRequest,
  AdminInteractionsAggregateResponse,
  AppendInteractionBody,
  UpdateInteractionBody,
  OutcomeCount,
  InteractionEventRow,
  PublicInteractionsCountsByOutcomeRequest,
  PublicInteractionsByUserRequest,
  // Public submit responses
  SubmitInteractionResponse,
  SubmitInteractionError,
  // CRUD
  CreateInteractionTypeBody,
  EnsureInteractionTypeInput,
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
   * POST /admin/collection/:collectionId/interactions/query
   * Flexible query for interaction events with optional includes.
   */
  export async function query(
    collectionId: string,
    body: AdminInteractionsQueryRequest
  ): Promise<InteractionEventRow[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/query`
    return post<InteractionEventRow[]>(path, body)
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
   * POST /admin/collection/:collectionId/interactions/aggregate
   * Returns grouped numeric aggregates (sum, avg, min, max, count).
   */
  export async function aggregate(
    collectionId: string,
    body: AdminInteractionsAggregateRequest
  ): Promise<AdminInteractionsAggregateResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/aggregate`
    return post<AdminInteractionsAggregateResponse>(path, body)
  }

  /**
   * Legacy-friendly alias for aggregate().
   */
  export async function aggregateByOutcome(
    collectionId: string,
    body: AdminInteractionsAggregateRequest
  ): Promise<AdminInteractionsAggregateResponse> {
    return aggregate(collectionId, body)
  }

  // Deprecated endpoint removed: actorIdsByInteraction

  /**
   * POST /admin/collection/:collectionId/interactions/append
    * Appends one interaction event.
    *
    * `interactionId` must reference an existing interaction type definition.
    * This endpoint does not create interaction definitions.
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
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/events/update`
    return post<{ success: true }>(path, body)
  }

  /**
   * POST /api/v1/public/collection/:collectionId/interactions/submit
   *
   * Submits an interaction event from a public/client-side context.
  * `interactionId` must reference an existing interaction type definition.
  * This endpoint does not create interaction definitions.
   * When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor
   * `contactId` is required. Pass `anonId` inside `metadata` to enable
   * device-level deduplication via `uniquePerAnonId`.
   */
  export async function submitPublicEvent(
    collectionId: string,
    body: AppendInteractionBody
  ): Promise<SubmitInteractionResponse | SubmitInteractionError> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/submit`
    return post<SubmitInteractionResponse | SubmitInteractionError>(path, body)
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

  /**
   * Find this app's interaction type by its readable `key` (data.interactionType), or create it.
   * Returns the type record — its `id` is the server-minted UUID every event must use.
   * ADMIN only (run it in your admin/setup screen), then store the id in your app config so
   * public code can read it: `interactionIds: { vote: type.id }`. Safe to run on every setup.
   *
   * @example
   * const vote = await SL.interactions.ensureType(collectionId, {
   *   appId: 'my-app', key: 'vote', permissions: { allowPublicSubmit: true, uniquePerUser: true },
   * })
   * // vote.id → '52bab6fa-…' — store it in config; never hardcode 'vote' as an interactionId
   */
  export async function ensureType(
    collectionId: string,
    input: EnsureInteractionTypeInput
  ): Promise<InteractionTypeRecord> {
    const { appId, key, permissions, display, data } = input
    if (!appId || !key) throw new Error('interactions.ensureType: appId and key are required')
    for (let offset = 0; ; offset += 200) {
      const page = await list(collectionId, { appId, limit: 200, offset })
      const found = (page.items || []).find((t) => t.data && t.data.interactionType === key)
      if (found) return found
      if (!page.items || page.items.length < 200) break
    }
    return create(collectionId, {
      appId,
      ...(permissions ? { permissions } : {}),
      data: { ...(data || {}), interactionType: key, ...(display ? { display } : {}) },
    })
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

  // Public: list interaction definitions (Postgres)
  export async function publicList(
    collectionId: string,
    query: ListInteractionTypesQuery = {}
  ): Promise<InteractionTypeList> {
    const qs = encodeQuery(query as any)
    const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/${qs}`
    return request<InteractionTypeList>(path)
  }

  // Public: get a single interaction definition (Postgres)
  export async function publicGet(
    collectionId: string,
    id: string
  ): Promise<InteractionTypeRecord> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/${encodeURIComponent(id)}`
    return request<InteractionTypeRecord>(path)
  }
}
