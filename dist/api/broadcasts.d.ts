import type { ListBroadcastsQuery, BroadcastRecord, BroadcastRecipientsResponse, BroadcastPreviewRequest, BroadcastPreviewResponse, BroadcastSendTestRequest, BroadcastSendTestResponse, BroadcastSendManualRequest, BroadcastSendManualResponse, BroadcastAppendEventBody, BroadcastAppendBulkBody, BroadcastSendRequest } from "../types/broadcasts.js";
import type { AppendResult, AppendBulkResult } from "../types/comms.js";
import type { ListResult, ListOptions } from "../types/list.js";
export declare namespace broadcasts {
    function create(collectionId: string, body: Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>): Promise<BroadcastRecord>;
    /**
     * The collection's broadcasts, a page at a time. Filter by the app that owns them (`appId`).
     *
     * @example
     * ```typescript
     * let page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50 })
     * page.items // BroadcastRecord[]
     * while (page.nextCursor) page = await broadcasts.list('coll_123', { appId: 'newsletter', limit: 50, cursor: page.nextCursor })
     * ```
     */
    function list(collectionId: string, query?: ListBroadcastsQuery): Promise<ListResult<BroadcastRecord>>;
    function get(collectionId: string, id: string): Promise<BroadcastRecord>;
    function update(collectionId: string, id: string, body: Partial<Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>>): Promise<BroadcastRecord>;
    function remove(collectionId: string, id: string): Promise<void>;
    /**
     * The contacts a broadcast goes to (its segment), a page at a time. `count` is how many there are in
     * all. A broadcast with no segment answers an empty page with a `note`.
     *
     * @example
     * ```typescript
     * const page = await broadcasts.recipients('coll_123', 'broadcast_1', { limit: 50 })
     * page.items      // Recipient[]
     * page.count      // how many in all
     * page.nextCursor // pass back as `cursor` for the next page; null on the last
     * ```
     */
    function recipients(collectionId: string, id: string, query?: ListOptions): Promise<BroadcastRecipientsResponse>;
    function preview(collectionId: string, id: string, body: BroadcastPreviewRequest): Promise<BroadcastPreviewResponse>;
    function send(collectionId: string, id: string, body?: BroadcastSendRequest): Promise<{
        ok: true;
        enqueued: true;
    }>;
    const sendBroadcast: typeof send;
    function sendTest(collectionId: string, id: string, body: BroadcastSendTestRequest): Promise<BroadcastSendTestResponse>;
    function sendManual(collectionId: string, id: string, body: BroadcastSendManualRequest): Promise<BroadcastSendManualResponse>;
    function append(collectionId: string, body: BroadcastAppendEventBody): Promise<AppendResult>;
    function appendBulk(collectionId: string, body: BroadcastAppendBulkBody): Promise<AppendBulkResult>;
}
