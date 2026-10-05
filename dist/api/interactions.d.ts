import type { AdminInteractionsCountsByOutcomeRequest, AdminInteractionsQueryRequest, AdminInteractionsAggregateRequest, AdminInteractionsAggregateResponse, AppendInteractionBody, UpdateInteractionBody, OutcomeCount, InteractionEventRow, PublicInteractionsCountsByOutcomeRequest, PublicInteractionsByUserRequest, SubmitInteractionResponse, SubmitInteractionError, CreateInteractionTypeBody, EnsureInteractionTypeInput, UpdateInteractionTypeBody, ListInteractionTypesQuery, InteractionTypeRecord, InteractionTypeList } from "../types/interaction.js";
export declare namespace interactions {
    /**
     * POST /admin/collection/:collectionId/interactions/query
     * Flexible query for interaction events with optional includes.
     */
    function query(collectionId: string, body: AdminInteractionsQueryRequest): Promise<InteractionEventRow[]>;
    /**
     * POST /admin/collection/:collectionId/interactions/counts-by-outcome
     * Returns array of { outcome, count }.
     */
    function countsByOutcome(collectionId: string, query?: AdminInteractionsCountsByOutcomeRequest): Promise<OutcomeCount[]>;
    /**
     * POST /admin/collection/:collectionId/interactions/aggregate
     * Returns grouped numeric aggregates (sum, avg, min, max, count).
     */
    function aggregate(collectionId: string, body: AdminInteractionsAggregateRequest): Promise<AdminInteractionsAggregateResponse>;
    /**
     * Legacy-friendly alias for aggregate().
     */
    function aggregateByOutcome(collectionId: string, body: AdminInteractionsAggregateRequest): Promise<AdminInteractionsAggregateResponse>;
    /**
     * POST /admin/collection/:collectionId/interactions/append
      * Appends one interaction event.
      *
      * `interactionId` must reference an existing interaction type definition.
      * This endpoint does not create interaction definitions.
     */
    function appendEvent(collectionId: string, body: AppendInteractionBody): Promise<{
        success: true;
    }>;
    function updateEvent(collectionId: string, body: UpdateInteractionBody): Promise<{
        success: true;
    }>;
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
    function submitPublicEvent(collectionId: string, body: AppendInteractionBody): Promise<SubmitInteractionResponse | SubmitInteractionError>;
    function create(collectionId: string, body: CreateInteractionTypeBody): Promise<InteractionTypeRecord>;
    function list(collectionId: string, query?: ListInteractionTypesQuery): Promise<InteractionTypeList>;
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
    function ensureType(collectionId: string, input: EnsureInteractionTypeInput): Promise<InteractionTypeRecord>;
    function get(collectionId: string, id: string): Promise<InteractionTypeRecord>;
    function update(collectionId: string, id: string, patchBody: UpdateInteractionTypeBody): Promise<InteractionTypeRecord>;
    function remove(collectionId: string, id: string): Promise<void>;
    function publicCountsByOutcome(collectionId: string, body: PublicInteractionsCountsByOutcomeRequest, authToken?: string): Promise<OutcomeCount[]>;
    function publicMyInteractions(collectionId: string, body: PublicInteractionsByUserRequest, authToken?: string): Promise<InteractionEventRow[]>;
    function publicList(collectionId: string, query?: ListInteractionTypesQuery): Promise<InteractionTypeList>;
    function publicGet(collectionId: string, id: string): Promise<InteractionTypeRecord>;
}
