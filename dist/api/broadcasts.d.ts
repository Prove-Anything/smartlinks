import type { BroadcastQueryByUser, RecipientIdsQuery, RecipientsWithoutActionQuery, RecipientsWithActionQuery, AppendBroadcastBody, AppendBroadcastBulkBody, BroadcastEvent, RecipientId, RecipientWithOutcome, AppendResult, AppendBulkResult, CreateBroadcastBody, UpdateBroadcastBody, ListBroadcastsQuery, BroadcastRecord, BroadcastList } from "../types/broadcasts";
export declare namespace broadcasts {
    /**
     * POST /admin/collection/:collectionId/broadcasts/by-user
     * Returns broadcast events array, newest first.
     */
    function byUser(collectionId: string, query?: BroadcastQueryByUser): Promise<BroadcastEvent[]>;
    /**
     * POST /admin/collection/:collectionId/broadcasts/recipient-ids
     * Returns recipient IDs for a broadcast.
     */
    function recipientIds(collectionId: string, query: RecipientIdsQuery): Promise<RecipientId[]>;
    /**
     * POST /admin/collection/:collectionId/broadcasts/recipients/without-action
     * Returns IDs who received the broadcast but did not perform an action.
     */
    function recipientsWithoutAction(collectionId: string, query: RecipientsWithoutActionQuery): Promise<RecipientId[]>;
    /**
     * POST /admin/collection/:collectionId/broadcasts/recipients/with-action
     * Returns IDs who received the broadcast and performed an action; optionally includes outcome.
     */
    function recipientsWithAction(collectionId: string, query: RecipientsWithActionQuery): Promise<RecipientId[] | RecipientWithOutcome[]>;
    /**
     * POST /admin/collection/:collectionId/broadcasts/append
     * Appends one broadcast event.
     */
    function append(collectionId: string, body: AppendBroadcastBody): Promise<AppendResult>;
    /**
     * POST /admin/collection/:collectionId/broadcasts/append/bulk
     * Appends many broadcast recipients.
     * Accepts preferred body shape with params + ids, and legacy flat shape.
     */
    function appendBulk(collectionId: string, body: AppendBroadcastBulkBody | ({
        broadcastId: string;
        ids: string[];
        idField?: 'userId' | 'contactId';
        [k: string]: any;
    })): Promise<AppendBulkResult>;
    function create(collectionId: string, body: CreateBroadcastBody): Promise<BroadcastRecord>;
    function list(collectionId: string, query?: ListBroadcastsQuery): Promise<BroadcastList>;
    function get(collectionId: string, id: string): Promise<BroadcastRecord>;
    function update(collectionId: string, id: string, body: UpdateBroadcastBody): Promise<BroadcastRecord>;
    function remove(collectionId: string, id: string): Promise<void>;
}
