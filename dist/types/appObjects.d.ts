/**
 * Visibility levels for app objects
 */
export type Visibility = 'public' | 'owner' | 'admin';
/**
 * Caller role types
 */
export type CallerRole = 'admin' | 'owner' | 'public';
/**
 * Paginated response wrapper for list endpoints.
 *
 * All list endpoints return this shape:
 * ```json
 * {
 *   "data": [ ...items ],
 *   "pagination": {
 *     "total":   142,
 *     "limit":   10,
 *     "offset":  0,
 *     "hasMore": true
 *   }
 * }
 * ```
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        /** Total number of matching records in the collection */
        total: number;
        /** Maximum number of items returned in this page */
        limit: number;
        /** Number of items skipped before this page */
        offset: number;
        /** `true` when more pages are available (offset + limit < total) */
        hasMore: boolean;
    };
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
 * Top-level public-create policy stored under the `publicCreate` key of an
 * app config document.  Controls which caller types may create objects on
 * **public** App Objects endpoints.
 *
 * Set via `POST /api/v1/admin/collection/:collectionId/apps/:appId` with the
 * policy as the request body (merged over any existing config).
 *
 * The server reads this document at request time — no cache invalidation or
 * service restart is required after changing it.
 */
export interface PublicCreatePolicy {
    cases?: PublicCreateObjectRule;
    threads?: PublicCreateObjectRule;
    records?: PublicCreateObjectRule;
}
/**
 * Per-object-type rule within a {@link PublicCreatePolicy}.
 * Each caller class (`anonymous`, `authenticated`) has its own independent
 * branch so you can apply different enforcement for each.
 */
export interface PublicCreateObjectRule {
    /** Rules for unauthenticated (anonymous) callers */
    anonymous?: PublicCreateBranch;
    /** Rules for authenticated (signed-in contact) callers */
    authenticated?: PublicCreateBranch;
}
/**
 * Policy branch for a single caller class.
 *
 * ### Visibility enforcement guard-rails
 *
 * The server silently corrects misconfigured visibility values:
 *
 * | Caller type     | `enforce.visibility` supplied | Server overrides to  |
 * |-----------------|-------------------------------|----------------------|
 * | `anonymous`     | `'owner'`                     | `'admin'`            |
 * | `authenticated` | `'public'`                    | `'owner'`            |
 *
 * These guards exist because anonymous callers have no identity to own a
 * record, and `'public'` visibility for authenticated-only objects would be
 * a misconfiguration.
 */
export interface PublicCreateBranch {
    /** Whether creation is permitted for this caller class */
    allow: boolean;
    /**
     * Field values merged **over** the caller's request body before writing.
     * Use this to lock down `visibility` and `status` regardless of what the
     * client sends.
     */
    enforce?: {
        visibility?: 'public' | 'owner' | 'admin';
        status?: string;
    };
    /**
     * Anonymous edit-token configuration.
     * **Records only** — ignored for cases and threads.
     *
     * When `editToken: true`, the server generates a one-time 256-bit hex token
     * on anonymous record creation, stores it in `admin.editToken` (never
     * exposed to public / owner responses), and returns it **once** in the
     * creation response under the `editToken` key.
     *
     * The client can then pass that token as the `X-Edit-Token` header on
     * `PATCH /records/:recordId` to amend the `data` zone without
     * authentication.
     *
     * @see {@link CreateRecordResponse} — creation response shape
     * @see {@link records.updateWithToken} — SDK method for the amendment call
     */
    edit?: {
        /** Enable edit-token generation on anonymous record creation */
        editToken: boolean;
        /**
         * Optional expiry window in minutes from `createdAt`.
         * After this many minutes the token is rejected with HTTP 403
         * `EDIT_WINDOW_EXPIRED`.  Omit for no expiry.
         */
        windowMinutes?: number;
    };
}
/**
 * Response from `app.records.create()` when the caller is anonymous and the
 * app's `publicCreate.records.anonymous.edit.editToken` policy is `true`.
 *
 * The `editToken` field is present **only on the creation response** — it is
 * stored in the record's `admin` zone and never returned again.  Store it
 * client-side immediately.
 *
 * Use `app.records.updateWithToken()` to amend the record's `data` zone with
 * this token.
 *
 * @example
 * ```ts
 * const response = await app.records.create(collectionId, appId, {
 *   recordType: 'payment',
 *   visibility: 'public',
 *   data: { amount: 9900, currency: 'USD' },
 * })
 * // response.editToken is present when the policy has editToken: true
 * const editToken = response.editToken
 * ```
 */
export interface CreateRecordResponse extends AppRecord {
    /**
     * Short-lived edit token.  Present only when:
     * 1. The caller is anonymous, AND
     * 2. The app policy has `publicCreate.records.anonymous.edit.editToken: true`
     *
     * This value is returned **once** and cannot be retrieved again.
     */
    editToken?: string;
}
