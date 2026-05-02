import type { AdminInteractionsCountsByOutcomeRequest, AdminInteractionsQueryRequest, AdminInteractionsAggregateRequest, AdminInteractionsAggregateResponse, AppendInteractionBody, UpdateInteractionBody, OutcomeCount, InteractionEventRow, PublicInteractionsCountsByOutcomeRequest, PublicInteractionsByUserRequest, SubmitInteractionResponse, SubmitInteractionError, CreateInteractionTypeBody, UpdateInteractionTypeBody, ListInteractionTypesQuery, InteractionTypeRecord, InteractionTypeList } from "../types/interaction";
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
       * When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor
       * `contactId` is required. Pass `anonId` inside `metadata` to enable
       * device-level deduplication via `uniquePerAnonId`.
       */
    function submitPublicEvent(collectionId: string, body: AppendInteractionBody): Promise<SubmitInteractionResponse | SubmitInteractionError>;
    function create(collectionId: string, body: CreateInteractionTypeBody): Promise<InteractionTypeRecord>;
    function list(collectionId: string, query?: ListInteractionTypesQuery): Promise<InteractionTypeList>;
    function get(collectionId: string, id: string): Promise<InteractionTypeRecord>;
    function update(collectionId: string, id: string, patchBody: UpdateInteractionTypeBody): Promise<InteractionTypeRecord>;
    function remove(collectionId: string, id: string): Promise<void>;
    function publicCountsByOutcome(collectionId: string, body: PublicInteractionsCountsByOutcomeRequest, authToken?: string): Promise<OutcomeCount[]>;
    function publicMyInteractions(collectionId: string, body: PublicInteractionsByUserRequest, authToken?: string): Promise<InteractionEventRow[]>;
    function publicList(collectionId: string, query?: ListInteractionTypesQuery): Promise<InteractionTypeList>;
    function publicGet(collectionId: string, id: string): Promise<InteractionTypeRecord>;
}
