export interface SegmentRecord {
    id: string;
    collectionId: string;
    appId?: string;
    name: string;
    filterType: 'dynamic' | 'static';
    estimatedCount?: number;
    lastCalculatedAt?: string;
    createdAt: string;
    data?: {
        filterRules: any[];
        description?: string;
        staticContactIds?: string[];
        [key: string]: unknown;
    };
}
export interface ListSegmentsQuery {
    appId?: string;
    filterType?: 'dynamic' | 'static';
    limit?: number;
    offset?: number;
}
export interface SegmentList {
    items: SegmentRecord[];
    limit: number;
    offset: number;
}
export interface SegmentCalculateResult {
    scheduled: true;
    lastCalculatedAt?: string;
    estimatedCount?: number | null;
    note?: string;
}
export interface SegmentRecipientsResponse {
    items: string[];
    limit: number;
    offset: number;
    total: number;
    note?: string;
}
