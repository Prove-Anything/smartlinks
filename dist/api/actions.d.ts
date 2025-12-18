import type { ActionQueryByUser, ActionCountsQuery, ActorIdsByActionQuery, AppendActionBody, OutcomeCount, ActorId, ActorWithOutcome, ActionEventRow, AdminByUserRequest, AdminCountsByOutcomeRequest, AdminActorIdsByActionRequest, PublicCountsByOutcomeRequest, PublicByUserRequest, CreateActionBody, UpdateActionBody, ListActionsQuery, ActionRecord, ActionList } from "../types/actions";
export declare namespace actions {
    /**
     * POST /admin/collection/:collectionId/actions/by-user
     * Returns BigQuery action rows, newest first.
     */
    function byUser(collectionId: string, query?: AdminByUserRequest | ActionQueryByUser): Promise<ActionEventRow[]>;
    /**
     * POST /admin/collection/:collectionId/actions/counts-by-outcome
     * Returns array of { outcome, count }.
     */
    function countsByOutcome(collectionId: string, query?: AdminCountsByOutcomeRequest | ActionCountsQuery): Promise<OutcomeCount[]>;
    /**
     * POST /admin/collection/:collectionId/actions/actor-ids/by-action
     * Returns list of IDs, optionally with outcome when includeOutcome=true.
     */
    function actorIdsByAction(collectionId: string, query: AdminActorIdsByActionRequest | ActorIdsByActionQuery): Promise<ActorId[] | ActorWithOutcome[]>;
    /**
     * POST /admin/collection/:collectionId/actions/append
     * Appends one action event.
     */
    function append(collectionId: string, body: AppendActionBody): Promise<{
        success: true;
    }>;
    function create(collectionId: string, body: CreateActionBody): Promise<ActionRecord>;
    function list(collectionId: string, query?: ListActionsQuery): Promise<ActionList>;
    function get(collectionId: string, id: string): Promise<ActionRecord>;
    function update(collectionId: string, id: string, patchBody: UpdateActionBody): Promise<ActionRecord>;
    function remove(collectionId: string, id: string): Promise<void>;
    function publicCountsByOutcome(collectionId: string, body: PublicCountsByOutcomeRequest, authToken?: string): Promise<OutcomeCount[]>;
    function publicMyActions(collectionId: string, body: PublicByUserRequest, authToken?: string): Promise<ActionEventRow[]>;
}
