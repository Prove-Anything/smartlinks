export interface InteractionFilterValue {
    interactionId: string;
    scope?: string;
    outcome?: string;
    from?: string;
    to?: string;
}
export type SegmentFilterRule = {
    field: 'interaction';
    op: 'had' | 'exists';
    value: InteractionFilterValue;
} | {
    field: 'tags';
    op: 'hasSome';
    value: string[];
} | {
    field: 'locale';
    op: 'equals';
    value: string;
} | {
    field: 'source';
    op: 'equals';
    value: string;
} | {
    field: 'createdAt';
    op: 'between';
    value: {
        from?: string;
        to?: string;
    };
} | {
    type: 'interaction';
    interactionId: string;
    scope?: string;
    outcome?: string;
    from?: string;
    to?: string;
};
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
        filterRules: SegmentFilterRule[];
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
    scheduled: boolean;
    lastCalculatedAt?: string;
    estimatedCount?: number | null;
    note?: string;
}
export interface SegmentRecipientsResponse {
    items: import('./comms').Recipient[];
    limit: number;
    offset: number;
    total: number;
    note?: string;
}
