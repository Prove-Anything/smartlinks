import type { ListBroadcastsQuery, BroadcastRecord, BroadcastList, BroadcastRecipientsResponse, BroadcastPreviewRequest, BroadcastPreviewResponse, BroadcastSendTestRequest, BroadcastSendTestResponse, BroadcastSendManualRequest, BroadcastSendManualResponse, BroadcastAppendEventBody, BroadcastAppendBulkBody } from "../types/broadcasts";
import type { AppendResult, AppendBulkResult } from "../types/comms";
export declare namespace broadcasts {
    function create(collectionId: string, body: Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>): Promise<BroadcastRecord>;
    function list(collectionId: string, query?: ListBroadcastsQuery): Promise<BroadcastList>;
    function get(collectionId: string, id: string): Promise<BroadcastRecord>;
    function update(collectionId: string, id: string, body: Partial<Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>>): Promise<BroadcastRecord>;
    function remove(collectionId: string, id: string): Promise<void>;
    function recipients(collectionId: string, id: string, query?: {
        limit?: number;
        offset?: number;
    }): Promise<BroadcastRecipientsResponse>;
    function preview(collectionId: string, id: string, body: BroadcastPreviewRequest): Promise<BroadcastPreviewResponse>;
    function sendTest(collectionId: string, id: string, body: BroadcastSendTestRequest): Promise<BroadcastSendTestResponse>;
    function sendManual(collectionId: string, id: string, body: BroadcastSendManualRequest): Promise<BroadcastSendManualResponse>;
    function append(collectionId: string, body: BroadcastAppendEventBody): Promise<AppendResult>;
    function appendBulk(collectionId: string, body: BroadcastAppendBulkBody): Promise<AppendBulkResult>;
}
