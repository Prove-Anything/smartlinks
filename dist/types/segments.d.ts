export interface InteractionFilterValue {
    interactionId: string;
    scope?: string;
    outcome?: string;
    from?: string;
    to?: string;
}
export type CustomFieldOperator = 'equals' | 'exists' | 'gt' | 'gte' | 'lt' | 'lte' | 'before' | 'after' | 'within_days' | 'older_than_days';
export type OwnershipAttributeOperator = 'equals' | 'exists' | 'gt' | 'gte' | 'lt' | 'lte';
export interface OwnershipAttributePredicate {
    path: string;
    operator: OwnershipAttributeOperator;
    /** Operand: a number for gt/gte/lt/lte, a string for equals; omitted for exists. */
    value?: string | number;
}
export interface OwnershipFacetSelector {
    key: string;
    value: string;
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
    type: 'custom_field';
    field: string;
    operator: CustomFieldOperator;
    value?: string | number;
} | {
    type: 'ownership';
    productId?: string;
    facet?: OwnershipFacetSelector;
    attribute?: OwnershipAttributePredicate;
    olderThanDays?: number;
    withinDays?: number;
    includeDeleted?: boolean;
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
