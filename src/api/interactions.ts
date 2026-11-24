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
} from "../types/interaction"
import type { ListResult } from "../types/list"
import { listQuery } from "../list"

export namespace interactions {
  /**
   * POST /admin/collection/:collectionId/interactions/query
   * Flexible query for interaction events, a page at a time (`limit` and `cursor` in the body). The
   * time window is `from` / `to`. Sort with `orderBy: [{ timestamp: 'asc' }]`; bring each event's
   * interaction type along with `expand: ['interaction']`.
   *
   * @example
   * ```typescript
   * const query = { appId: 'my-app', interactionId: voteTypeId, from: '2026-11-01T00:00:00Z', limit: 500 }
   * let page = await interactions.query('coll_123', { ...query, orderBy: [{ timestamp: 'desc' }], expand: ['interaction'] })
   * while (page.nextCursor) page = await interactions.query('coll_123', { ...query, cursor: page.nextCursor })
   * ```
   */
  export async function query(
    collectionId: string,
    body: AdminInteractionsQueryRequest
  ): Promise<ListResult<InteractionEventRow>> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/query`
    return post<ListResult<InteractionEventRow>>(path, body)
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

  /**
   * List the collection's interaction types (admin), optionally only one app's.
   * GET /admin/collection/:collectionId/interactions
   *
   * @example
   * ```typescript
   * let page = await interactions.list('coll_123', { appId: 'my-app', limit: 100 })
   * while (page.nextCursor) page = await interactions.list('coll_123', { appId: 'my-app', limit: 100, cursor: page.nextCursor })
   * ```
   */
  export async function list(
    collectionId: string,
    query: ListInteractionTypesQuery = {}
  ): Promise<ListResult<InteractionTypeRecord>> {
    const qs = listQuery(query)
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/${qs}`
    return request<ListResult<InteractionTypeRecord>>(path)
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
   *   display: { title: 'Cast a vote', description: 'Someone voted in the poll' },
   * })
   * // vote.id → '52bab6fa-…' — store it in config; never hardcode 'vote' as an interactionId
   * // Always give display.title: it's the name staff see in the CRM, on activity and when choosing
   * // "everyone who voted" for a segment. (Without one the platform names it from the key.)
   */
  export async function ensureType(
    collectionId: string,
    input: EnsureInteractionTypeInput
  ): Promise<InteractionTypeRecord> {
    const { appId, key, permissions, display, data } = input
    if (!appId || !key) throw new Error('interactions.ensureType: appId and key are required')
    let cursor: string | undefined
    for (;;) {
      const page = await list(collectionId, { appId, limit: 200, cursor })
      const found = (page.items || []).find((t) => t.data && t.data.interactionType === key)
      if (found) return found
      if (!page.nextCursor) break
      cursor = page.nextCursor
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

  /**
   * The signed-in person's own interaction events (where the type allows it), a page at a time
   * (`limit` and `cursor` in the body). The time window is `from` / `to`.
   * POST /public/collection/:collectionId/interactions/by-user
   *
   * @example
   * ```typescript
   * const query = { appId: 'my-app', interactionId: voteTypeId, limit: 50 }
   * let page = await interactions.publicMyInteractions('coll_123', query)
   * while (page.nextCursor) page = await interactions.publicMyInteractions('coll_123', { ...query, cursor: page.nextCursor })
   * ```
   */
  export async function publicMyInteractions(
    collectionId: string,
    body: PublicInteractionsByUserRequest,
    authToken?: string
  ): Promise<ListResult<InteractionEventRow>> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/by-user`
    const headers = authToken ? { AUTHORIZATION: `Bearer ${authToken}` } : undefined
    return post<ListResult<InteractionEventRow>>(path, body, headers)
  }

  /**
   * Public: list the collection's interaction types, optionally only one app's.
   * GET /public/collection/:collectionId/interactions
   *
   * @example
   * ```typescript
   * const { items, nextCursor } = await interactions.publicList('coll_123', { appId: 'my-app', limit: 50 })
   * ```
   */
  export async function publicList(
    collectionId: string,
    query: ListInteractionTypesQuery = {}
  ): Promise<ListResult<InteractionTypeRecord>> {
    const qs = listQuery(query)
    const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/${qs}`
    return request<ListResult<InteractionTypeRecord>>(path)
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
