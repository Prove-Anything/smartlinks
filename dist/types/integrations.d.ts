export type FlowDirection = 'inbound' | 'outbound';
export type FlowStatus = 'draft' | 'active' | 'paused' | 'error';
export type RunStatus = 'success' | 'partial' | 'error';
/** How one source field maps to one target field during transform. */
export type TransformType = 'direct' | 'static' | 'template' | 'jsonata' | 'ai';
export interface FieldMapping {
    /** Dot-path in the produced target object (required). */
    targetPath: string;
    /** Dot-path in the source record. Used by `direct`. */
    sourcePath?: string;
    transformType: TransformType;
    /** Constant (`static`) or Liquid template (`template`), etc. */
    transformExpression?: string;
}
export type FlowAuthMethod = 'api_key' | 'bearer' | 'basic' | 'webhook' | 'oauth2' | 'none';
export interface FlowConnectionAuth {
    method: FlowAuthMethod;
    /** Header name for `api_key` (defaults server-side to X-API-Key). */
    headerName?: string;
    /** Opaque reference into the secret store; resolved server-side at execution. */
    credentialRef?: string;
}
export interface FlowConnection {
    baseUrl?: string;
    /** Outbound: path appended to baseUrl for sends. */
    sendEndpoint?: string;
    /** Inbound: path appended to baseUrl for fetches. */
    fetchEndpoint?: string;
    defaultHeaders?: Record<string, string>;
    auth?: FlowConnectionAuth;
}
export interface IntegrationFlowConfig {
    connection?: FlowConnection;
    fieldMappings?: FieldMapping[];
    [key: string]: any;
}
export interface IntegrationFlow {
    id: string;
    orgId: string;
    collectionId: string;
    appId: string;
    direction: FlowDirection;
    name: string;
    status: FlowStatus;
    /** Event types this flow subscribes to, e.g. ['product.updated']. */
    eventTypes: string[];
    /** Cron/interval string for scheduled flows, or null. */
    schedule: string | null;
    sourceEntity: string | null;
    targetEntity: string | null;
    config: IntegrationFlowConfig;
    createdBy: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    lastRunAt?: string | null;
    lastRunStatus?: string | null;
    lastRunError?: string | null;
    lastRunCount?: number | null;
    lastPollAt?: string | null;
    lastCursor?: string | null;
    totalSynced?: number | null;
}
export interface CreateFlowInput {
    appId: string;
    direction: FlowDirection;
    name: string;
    status?: FlowStatus;
    eventTypes?: string[];
    schedule?: string | null;
    sourceEntity?: string | null;
    targetEntity?: string | null;
    config?: IntegrationFlowConfig;
}
export type UpdateFlowInput = Partial<Omit<CreateFlowInput, 'direction'>> & {
    status?: FlowStatus;
};
export interface ListFlowsQuery {
    direction?: FlowDirection;
    status?: FlowStatus;
    appId?: string;
}
export interface FlowList {
    flows: IntegrationFlow[];
}
/** Options for a manual flow run. */
export interface RunFlowInput {
    /** Run for a single source entity; omit for the flow's scheduled gather. */
    entityId?: string;
    /** Trigger label recorded on the run (e.g. 'test' for a test send). Default 'manual'. */
    trigger?: RunTrigger;
}
/** Inline (synchronous) run summary. */
export interface RunFlowSummary {
    flowId: string;
    direction: FlowDirection;
    records: number;
    sent: number;
    failed: number;
    status: RunStatus;
    /** Id of the persisted run row (deep-link into its detail). */
    runId?: string;
}
export type RunTrigger = 'manual' | 'event' | 'schedule' | 'test';
export type FlowRunStatus = 'running' | 'success' | 'partial' | 'failed' | 'skipped';
export type FlowRunItemStatus = 'sent' | 'failed' | 'skipped';
export type CaptureLevel = 'metadata' | 'errors_only' | 'full';
/** A redacted outbound request as captured in a run item (secrets masked, body size-capped). */
export interface CapturedRequest {
    transport: string;
    method: string;
    url: string;
    headers: Record<string, string>;
    partitionKey?: string;
    body: unknown;
    bodyBytes: number;
    truncated: boolean;
}
/** A redacted response as captured in a run item. */
export interface CapturedResponse {
    status: number | null;
    ok: boolean | null;
    headers: Record<string, string>;
    body: unknown;
    bodyBytes: number;
    truncated: boolean;
    error: string | null;
}
/** One run of a flow. */
export interface FlowRun {
    id: string;
    flowId: string;
    connectionId?: string | null;
    trigger: RunTrigger;
    triggerEvent?: string | null;
    triggerEntityId?: string | null;
    status: FlowRunStatus;
    records: number;
    sent: number;
    failed: number;
    error?: string | null;
    correlationId?: string | null;
    captureLevel: CaptureLevel;
    bodiesPurged: boolean;
    startedAt: string;
    completedAt?: string | null;
    durationMs?: number | null;
}
/** One record's attempt within a run (request/response present only when captured at 'full'). */
export interface FlowRunItem {
    id: string;
    runId: string;
    entityType: string;
    entityId?: string | null;
    entityLabel?: string | null;
    status: FlowRunItemStatus;
    skipReason?: string | null;
    request?: CapturedRequest | null;
    response?: CapturedResponse | null;
    attempt: number;
    durationMs?: number | null;
    createdAt: string;
}
export interface ListRunsQuery {
    status?: FlowRunStatus;
    trigger?: RunTrigger;
    entityId?: string;
    limit?: number;
    cursor?: string;
}
export interface RunList {
    runs: FlowRun[];
    nextCursor?: string;
}
export interface ListRunItemsQuery {
    status?: FlowRunItemStatus;
    limit?: number;
    cursor?: string;
}
export interface RunItemList {
    items: FlowRunItem[];
    nextCursor?: string;
}
/** A per-connection enhanced-logging window (full capture) while active. */
export interface LoggingWindow {
    id: string;
    connectionId: string;
    level: CaptureLevel;
    enabledBy?: string | null;
    enabledAt: string;
    expiresAt?: string | null;
    canceledAt?: string | null;
}
export interface SetLoggingInput {
    /** Minutes until the window auto-expires; omit for on-until-cancelled. */
    ttlMinutes?: number;
    /** Capture level while active (default 'full'). */
    level?: 'full' | 'errors_only';
}
/** Response when a run is enqueued (?async=true). */
export interface RunFlowEnqueued {
    enqueued: true;
    flowId: string;
    entityId: string | null;
}
export type RunFlowResult = RunFlowSummary | RunFlowEnqueued;
/** Metadata for a stored secret. NEVER includes the value or ciphertext. */
export interface SecretMeta {
    ref: string;
    name: string | null;
    purpose: string;
    /** Masked hint (e.g. last few chars) — safe to display. */
    hint: string;
    keyVersion: number;
    createdBy: string | null;
    createdAt: string;
    updatedAt: string;
    rotatedAt?: string | null;
}
export interface SecretList {
    secrets: SecretMeta[];
}
export interface SetSecretInput {
    value: string;
    name?: string;
    /** Grouping/scoping label, defaults to 'integration' server-side. */
    purpose?: string;
}
/** Result of set/rotate — the ref to store on a flow's connection, plus a hint. */
export interface SetSecretResult {
    ref: string;
    hint: string;
}
export interface ListSecretsQuery {
    purpose?: string;
}
export interface RecordTypeInfo {
    appId: string;
    recordType: string;
    count: number;
}
export interface RecordTypesResponse {
    recordTypes: RecordTypeInfo[];
}
