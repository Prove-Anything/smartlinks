import type { SegmentRecord, ListSegmentsQuery, SegmentList, SegmentCalculateResult, SegmentRecipientsResponse } from "../types/segments";
export declare namespace segments {
    function create(collectionId: string, body: Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>): Promise<SegmentRecord>;
    function list(collectionId: string, query?: ListSegmentsQuery): Promise<SegmentList>;
    function get(collectionId: string, id: string): Promise<SegmentRecord>;
    function update(collectionId: string, id: string, body: Partial<Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>>): Promise<SegmentRecord>;
    function remove(collectionId: string, id: string): Promise<void>;
    function calculate(collectionId: string, id: string): Promise<SegmentCalculateResult>;
    function recipients(collectionId: string, id: string, query?: {
        limit?: number;
        offset?: number;
    }): Promise<SegmentRecipientsResponse>;
}
