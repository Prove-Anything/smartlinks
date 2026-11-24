import type { SegmentRecord, ListSegmentsQuery, SegmentCalculateResult, SegmentRecipientsResponse } from "../types/segments.js";
import type { ListResult, ListOptions } from "../types/list.js";
export declare namespace segments {
    function create(collectionId: string, body: Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>): Promise<SegmentRecord>;
    /**
     * The collection's segments, a page at a time. Filter by the app that owns them (`appId`) or by
     * `filterType`.
     *
     * @example
     * ```typescript
     * let page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50 })
     * page.items // SegmentRecord[]
     * while (page.nextCursor) page = await segments.list('coll_123', { filterType: 'dynamic', limit: 50, cursor: page.nextCursor })
     * ```
     */
    function list(collectionId: string, query?: ListSegmentsQuery): Promise<ListResult<SegmentRecord>>;
    function get(collectionId: string, id: string): Promise<SegmentRecord>;
    function update(collectionId: string, id: string, body: Partial<Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>>): Promise<SegmentRecord>;
    function remove(collectionId: string, id: string): Promise<void>;
    function calculate(collectionId: string, id: string): Promise<SegmentCalculateResult>;
    /**
     * The contacts in a segment, a page at a time. `count` is how many there are in all.
     *
     * @example
     * ```typescript
     * const page = await segments.recipients('coll_123', 'seg_1', { limit: 100 })
     * page.items      // Recipient[]
     * page.count      // total in the segment
     * page.nextCursor // pass back as `cursor` for the next page; null on the last
     * ```
     */
    function recipients(collectionId: string, id: string, query?: ListOptions): Promise<SegmentRecipientsResponse>;
}
