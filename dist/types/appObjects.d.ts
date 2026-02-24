/**
 * Visibility levels for app objects
 */
export type Visibility = 'public' | 'owner' | 'admin';
/**
 * Caller role types
 */
export type CallerRole = 'admin' | 'owner' | 'public';
/**
 * Paginated response wrapper for list endpoints
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
}
/**
 * Request body for aggregate endpoints
 */
export interface AggregateRequest {
    filters?: {
        status?: string;
        category?: string;
        record_type?: string;
        product_id?: string;
        created_at?: {
            gte?: string;
            lte?: string;
        };
        closed_at?: '__notnull__' | {
            gte?: string;
            lte?: string;
        };
        expires_at?: {
            lte?: string;
        };
    };
    groupBy?: string[];
    metrics?: string[];
    timeSeriesField?: string;
    timeSeriesInterval?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
}
/**
 * Response from aggregate endpoints
 */
export interface AggregateResponse {
    groups?: ({
        count: number;
    } & Record<string, unknown>)[];
    timeSeries?: ({
        bucket: string;
        count: number;
    } & Record<string, unknown>)[];
    count?: number;
    avg_close_time_seconds?: number;
    p50_close_time_seconds?: number;
    p95_close_time_seconds?: number;
    total_replies?: number;
    avg_replies?: number;
}
/**
 * Common query parameters for list endpoints
 */
export interface ListQueryParams {
    limit?: number;
    offset?: number;
    sort?: string;
    includeDeleted?: boolean;
    status?: string;
    productId?: string;
    createdAt?: string;
    updatedAt?: string;
}
/**
 * App Case object
 */
export interface AppCase {
    id: string;
    orgId: string;
    collectionId: string;
    appId: string;
    visibility: Visibility;
    ref: string | null;
    status: string;
    priority: number | null;
    category: string | null;
    assignedTo: string | null;
    productId: string | null;
    proofId: string | null;
    contactId: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
    deletedAt: string | null;
    data: Record<string, unknown>;
    owner: Record<string, unknown>;
    admin: Record<string, unknown>;
}
/**
 * Input for creating a new case
 */
export interface CreateCaseInput {
    visibility?: Visibility;
    ref?: string;
    status?: string;
    priority?: number;
    category?: string;
    assignedTo?: string;
    productId?: string;
    proofId?: string;
    contactId?: string;
    data?: Record<string, unknown>;
    owner?: Record<string, unknown>;
    admin?: Record<string, unknown>;
}
/**
 * Input for updating a case
 */
export interface UpdateCaseInput {
    data?: Record<string, unknown>;
    owner?: Record<string, unknown>;
    admin?: Record<string, unknown>;
    status?: string;
    priority?: number;
    category?: string;
    assignedTo?: string;
    ref?: string;
}
/**
 * Input for appending to case history
 */
export interface AppendHistoryInput {
    entry?: Record<string, unknown>;
    historyTarget?: 'owner' | 'admin';
    status?: string;
    priority?: number;
    assignedTo?: string;
}
/**
 * Request for case summary
 */
export interface CaseSummaryRequest {
    period?: {
        from: string;
        to: string;
    };
}
/**
 * Response from case summary endpoint
 */
export interface CaseSummaryResponse {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    trend: {
        week: string;
        count: number;
    }[];
}
/**
 * Query parameters for listing cases
 */
export interface CaseListQueryParams extends ListQueryParams {
    category?: string;
    priority?: string;
    ref?: string;
    proofId?: string;
    contactId?: string;
    assignedTo?: string;
    closedAt?: string;
}
/**
 * Reply entry in a thread
 */
export interface ReplyEntry {
    at: string;
    authorId?: string;
    authorType?: string;
    [key: string]: unknown;
}
/**
 * App Thread object
 */
export interface AppThread {
    id: string;
    orgId: string;
    collectionId: string;
    appId: string;
    visibility: Visibility;
    slug: string | null;
    title: string | null;
    status: string;
    authorId: string | null;
    authorType: string;
    productId: string | null;
    proofId: string | null;
    contactId: string | null;
    parentType: string | null;
    parentId: string | null;
    replyCount: number;
    lastReplyAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    body: Record<string, unknown>;
    replies: ReplyEntry[];
    tags: string[];
    data: Record<string, unknown>;
    owner: Record<string, unknown>;
    admin: Record<string, unknown>;
}
/**
 * Input for creating a new thread
 */
export interface CreateThreadInput {
    visibility?: Visibility;
    slug?: string;
    title?: string;
    status?: string;
    authorId?: string;
    authorType?: string;
    productId?: string;
    proofId?: string;
    contactId?: string;
    parentType?: string;
    parentId?: string;
    body?: Record<string, unknown>;
    tags?: string[];
    data?: Record<string, unknown>;
    owner?: Record<string, unknown>;
    admin?: Record<string, unknown>;
}
/**
 * Input for updating a thread
 */
export interface UpdateThreadInput {
    body?: Record<string, unknown>;
    tags?: string[];
    data?: Record<string, unknown>;
    owner?: Record<string, unknown>;
    admin?: Record<string, unknown>;
    title?: string;
    slug?: string;
    status?: string;
    visibility?: Visibility;
}
/**
 * Input for adding a reply to a thread
 */
export interface ReplyInput {
    authorId?: string;
    authorType?: string;
    [key: string]: unknown;
}
/**
 * Query parameters for listing threads
 */
export interface ThreadListQueryParams extends ListQueryParams {
    slug?: string;
    authorId?: string;
    parentType?: string;
    parentId?: string;
    tag?: string;
    contactId?: string;
}
/**
 * App Record object
 */
export interface AppRecord {
    id: string;
    orgId: string;
    collectionId: string;
    appId: string;
    visibility: Visibility;
    recordType: string;
    ref: string | null;
    status: string;
    productId: string | null;
    proofId: string | null;
    contactId: string | null;
    authorId: string | null;
    authorType: string;
    parentType: string | null;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
    startsAt: string | null;
    expiresAt: string | null;
    deletedAt: string | null;
    data: Record<string, unknown>;
    owner: Record<string, unknown>;
    admin: Record<string, unknown>;
}
/**
 * Input for creating a new record
 */
export interface CreateRecordInput {
    recordType: string;
    visibility?: Visibility;
    ref?: string;
    status?: string;
    productId?: string;
    proofId?: string;
    contactId?: string;
    authorId?: string;
    authorType?: string;
    parentType?: string;
    parentId?: string;
    startsAt?: string;
    expiresAt?: string;
    data?: Record<string, unknown>;
    owner?: Record<string, unknown>;
    admin?: Record<string, unknown>;
}
/**
 * Input for updating a record
 */
export interface UpdateRecordInput {
    data?: Record<string, unknown>;
    owner?: Record<string, unknown>;
    admin?: Record<string, unknown>;
    status?: string;
    visibility?: Visibility;
    ref?: string;
    recordType?: string;
    startsAt?: string;
    expiresAt?: string;
}
/**
 * Query parameters for listing records
 */
export interface RecordListQueryParams extends ListQueryParams {
    recordType?: string;
    ref?: string;
    proofId?: string;
    authorId?: string;
    parentType?: string;
    parentId?: string;
    startsAt?: string;
    expiresAt?: string;
    contactId?: string;
}
/**
 * Response from case related endpoint
 */
export interface RelatedResponse {
    threads: AppThread[];
    records: AppRecord[];
}
/**
 * Public create policy configuration
 */
export interface PublicCreatePolicy {
    cases?: PublicCreateRule;
    threads?: PublicCreateRule;
    records?: PublicCreateRule;
}
/**
 * Rule for public create operations
 */
export interface PublicCreateRule {
    allow: {
        anonymous?: boolean;
        authenticated?: boolean;
    };
    enforce?: {
        anonymous?: Partial<CreateCaseInput | CreateThreadInput | CreateRecordInput>;
        authenticated?: Partial<CreateCaseInput | CreateThreadInput | CreateRecordInput>;
    };
}
