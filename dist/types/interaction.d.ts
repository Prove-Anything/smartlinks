import type { IdField } from './common';
export interface AdminInteractionsQueryRequest {
    userId?: string;
    contactId?: string;
    appId?: string;
    interactionId?: string;
    scope?: string;
    interactionIds?: string[];
    broadcastId?: string;
    outcome?: string | null;
    from?: string;
    to?: string;
    limit?: number;
    includeDeleted?: boolean;
    latestPerEventId?: boolean;
    order?: 'ASC' | 'DESC';
    include?: Array<'interaction'>;
}
export interface AdminInteractionsCountsByOutcomeRequest {
    appId?: string;
    interactionId?: string;
    scope?: string;
    from?: string;
    to?: string;
    limit?: number;
    dedupeLatest?: boolean;
    idField?: IdField;
}
export interface AdminInteractionsAggregateRequest {
    appId?: string;
    interactionId?: string;
    interactionIds?: string[];
    scope?: string;
    outcome?: string | null;
    from?: string;
    to?: string;
    limit?: number;
    dedupeLatest?: boolean;
    groupBy: string;
    aggregate: {
        field: string;
        ops: Array<'count' | 'sum' | 'avg' | 'min' | 'max'>;
    };
}
export interface AdminInteractionsAggregateResponse {
    groupBy: string;
    aggregate: {
        field: string;
        ops: Array<'count' | 'sum' | 'avg' | 'min' | 'max'>;
        dedupeLatest?: boolean;
    };
    rows: AdminInteractionsAggregateRow[];
}
export interface AdminInteractionsAggregateRow {
    groupValue: string | null;
    eventCount: number;
    count?: number;
    sum?: number;
    avg?: number;
    min?: number;
    max?: number;
}
export interface PublicInteractionsCountsByOutcomeRequest {
    appId: string;
    interactionId: string;
    scope?: string;
    from?: string;
    to?: string;
    limit?: number;
}
export interface PublicInteractionsByUserRequest {
    appId?: string;
    interactionId?: string;
    scope?: string;
    from?: string;
    to?: string;
    limit?: number;
}
export interface InteractionEventRow {
    orgId: string;
    collectionId: string;
    timestamp: string;
    appId?: string;
    interactionId?: string;
    scope?: string;
    broadcastId?: string;
    userId?: string;
    contactId?: string;
    outcome?: string | null;
    metadata?: Record<string, unknown>;
    [k: string]: unknown;
}
export interface OutcomeCount {
    outcome: string | null;
    count: number;
}
export interface InteractionEventBase {
    collectionId: string;
    orgId?: string;
    userId?: string;
    contactId?: string;
    interactionId: string;
    scope?: string;
    appId?: string;
    broadcastId?: string;
    journeyId?: string;
    productId?: string;
    proofId?: string;
    variantId?: string;
    batchId?: string;
    source?: string;
    eventType?: string;
    outcome?: string;
    timestamp?: string;
    metadata?: Record<string, unknown>;
    [k: string]: any;
}
export interface AppendInteractionBody extends InteractionEventBase {
}
export interface UpdateInteractionBody extends InteractionEventBase {
    eventId: string;
    status?: 'active' | 'deleted';
}
/**
 * InteractionPermissions: configuration for public + authenticated interaction behavior.
 *
 * Stored under the `permissions` JSON for an interaction definition (Postgres `interactions` table).
 * These keys control whether submissions are allowed, visibility of summaries, and guardrails.
 */
export interface InteractionPermissions {
    /** Enable/disable submissions globally for this interaction (default: enabled). */
    enabled?: boolean;
    /** Require an authenticated user to submit. If true, anonymous/public submissions are blocked. */
    requireAuth?: boolean;
    /** Allow public (non-auth) submissions in general. */
    allowPublicSubmit?: boolean;
    /** Allow anonymous submissions even without a session (subset of public). */
    allowAnonymousSubmit?: boolean;
    /** Restrict submissions to matching origins (e.g., site domains). Uses substring match. */
    allowedOrigins?: string[];
    /** ISO datetime: submissions allowed at or after this time. */
    startAt?: string;
    /** ISO datetime: submissions allowed up to and including this time. */
    endAt?: string;
    /**
     * Enforce uniqueness per user: prevent duplicate submissions for this interaction.
     * If true, optionally use `uniquePerUserWindowSeconds` to scope the window.
     */
    uniquePerUser?: boolean;
    /** Time window in seconds for uniqueness checks (e.g., 86400 for one day). */
    uniquePerUserWindowSeconds?: number;
    /** Optional outcome tag used when checking duplicates (e.g., "submitted"). */
    uniqueOutcome?: string;
    /**
     * Public summary visibility (counts, aggregates) without auth.
     * If false, summaries require `allowAuthenticatedSummary` + user auth.
     */
    allowPublicSummary?: boolean;
    /**
     * Authenticated summary visibility (counts, aggregates) when user is signed in.
     */
    allowAuthenticatedSummary?: boolean;
    /** Allow an authenticated user to read their own interaction history via the public API. */
    allowOwnRead?: boolean;
    /** Reject a second submission that carries the same `anonId` in metadata. */
    uniquePerAnonId?: boolean;
    /**
     * Time window in seconds for `uniquePerAnonId` enforcement.
     * `0` or omitted means all-time deduplication.
     */
    uniquePerAnonIdWindowSeconds?: number;
}
export interface InteractionDisplay {
    title?: string;
    description?: string;
    icon?: string;
    color?: string;
}
export interface InteractionTypeRecord {
    id?: string;
    collectionId: string;
    appId: string;
    permissions?: InteractionPermissions;
    data?: {
        display?: InteractionDisplay;
        scopes?: Record<string, InteractionDisplay>;
        interactionType?: string;
        effects?: InteractionEffect[];
        [key: string]: unknown;
    };
    createdAt: string;
}
export interface InteractionTypeList {
    items: InteractionTypeRecord[];
    limit: number;
    offset: number;
}
export interface CreateInteractionTypeBody {
    id: string;
    appId: string;
    permissions?: InteractionPermissions;
    data?: Record<string, unknown>;
}
export interface UpdateInteractionTypeBody {
    appId?: string;
    permissions?: InteractionPermissions;
    data?: Record<string, unknown>;
}
export interface ListInteractionTypesQuery {
    appId?: string;
    limit?: number;
    offset?: number;
}
export interface SubmitInteractionResponse {
    success: true;
    eventId: string;
}
export interface SubmitInteractionError {
    error: 'FORBIDDEN';
    reason: 'not_public' | 'auth_required' | 'duplicate' | 'duplicate_anon' | 'disabled' | 'before_start' | 'after_end' | 'origin_forbidden';
}
export type EffectType = 'loyalty' | 'transactional' | 'webhook' | 'tag' | 'appRecord' | 'segment';
export interface InteractionEffect {
    type: EffectType;
    config?: EffectConfig;
}
export type EffectConfig = LoyaltyEffectConfig | TransactionalEffectConfig | WebhookEffectConfig | TagEffectConfig | AppRecordEffectConfig | SegmentEffectConfig;
/** No config required — earning rules are driven by the interactionId */
export interface LoyaltyEffectConfig {
    [key: string]: never;
}
export interface TransactionalEffectConfig {
    /** Required. Firestore template ID */
    templateId: string;
    /**
     * Channel to use.
     * Default: 'preferred' — auto-selects the contact's best available channel.
     */
    channel?: 'email' | 'sms' | 'push' | 'whatsapp' | 'wallet' | 'preferred';
    /** Additional Liquid variables. Supports {{token}} interpolation. */
    props?: Record<string, unknown>;
    /** Hydration directives. productId/proofId default to the event's own values. */
    include?: {
        productId?: string;
        proofId?: string;
        user?: boolean;
        appCase?: string;
        appThread?: string;
        appRecord?: string;
    };
    /** Override the appId logged on the comms event row. */
    appId?: string;
}
export interface WebhookEffectConfig {
    /** Required. Target URL. Supports {{token}} interpolation. */
    url: string;
    /** HTTP verb. Default: 'POST' */
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    /** Additional HTTP headers. Supports {{token}} interpolation on values. */
    headers?: Record<string, string>;
    /** JSON body template. Supports {{token}} interpolation on string values. */
    body?: Record<string, unknown>;
    /** Request timeout in milliseconds. Default: 10000 */
    timeout?: number;
}
export interface TagEffectConfig {
    /** One or more tag strings to add or remove. Supports {{token}} interpolation. */
    tags: string[];
    /** Default: 'add' */
    action?: 'add' | 'remove';
}
export interface AppRecordEffectConfig {
    /** Override the appId for the created record. */
    appId?: string;
    /** Record type identifier. Default: 'default' */
    recordType?: string;
    /**
     * Singleton cardinality key. At most one record per recordType+singletonPer will
     * exist per scope. Common values: 'contact', 'product', 'proof', 'global'
     */
    singletonPer?: string;
    /** Data object stored on the record. Supports {{token}} interpolation. */
    data?: Record<string, unknown>;
    /** Override scope anchors. Defaults to the event's own ids. */
    anchors?: {
        productId?: string;
        proofId?: string;
        variantId?: string;
        batchId?: string;
    };
}
export interface SegmentEffectConfig {
    /** Required. UUID of the static segment to modify */
    segmentId: string;
    /** Default: 'add' */
    action?: 'add' | 'remove';
}
/** Shape of the event context used for {{token}} interpolation in effect configs */
export interface InteractionEventContext {
    eventId: string | null;
    collectionId: string;
    appId: string | null;
    interactionId: string | null;
    contactId: string | null;
    userId: string | null;
    productId: string | null;
    proofId: string | null;
    variantId: string | null;
    batchId: string | null;
    outcome: string | null;
    eventType: string | null;
    source: string | null;
    timestamp: string | null;
    metadata: Record<string, unknown>;
    broadcastId: string | null;
    journeyId: string | null;
}
