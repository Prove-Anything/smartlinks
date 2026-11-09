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
/** A flow driven by a connector app (docs/connectors.md). */
export interface FlowConnectorRef {
    /** The connector app (manifest `connector` block), installed on the collection. */
    appId: string;
    /** The preset the flow was created from, if any. */
    preset?: string;
    /** Per-flow settings, layered over the installation's. */
    settings?: Record<string, unknown>;
}
import type { ConnectorInstallation } from './appManifest.js';
/** What about a person an event-sourced flow lets leave. Default 'hashed'. */
export type IdentityPolicy = 'externalIds' | 'hashed' | 'raw';
/**
 * Many SmartLinks events → the provider's few registered event names. Rules are tried in order; the
 * first match names the provider event and renders its attributes (a literal, a Liquid template over
 * the envelope, or `{ path, default }`). An unmatched event is skipped (recorded as such) unless
 * `unmatched: 'passthrough'`. Validated against the connector's `describeEvents` when the flow is saved.
 */
export interface EventMappingRule {
    id?: string;
    match?: {
        types?: string[];
        interactionIds?: string[];
        outcomes?: string[];
        appIds?: string[];
    };
    /** The provider's registered event name. */
    event: string;
    attributes?: Record<string, string | number | boolean | {
        path: string;
        default?: unknown;
    } | {
        value: unknown;
    }>;
}
export interface EventMapping {
    rules: EventMappingRule[];
    unmatched?: 'skip' | 'passthrough';
}
/** What an outbound flow reads: the product that changed, or ONE spine event as the envelope. */
export type FlowSourceEntity = 'product' | 'interaction' | 'contact' | 'event';
/** What an inbound flow writes. */
export type FlowTargetEntity = 'product' | 'contact';
export interface IntegrationFlowConfig {
    /**
     * Signed deliveries: X-SmartLinks-Signature `t=<unix>,v1=<hex HMAC-SHA256(secret, t + '.' + body)>`
     * over the exact bytes sent. `previousCredentialRef` keeps the old secret signing during a rotation.
     */
    signing?: {
        credentialRef: string;
        previousCredentialRef?: string;
    };
    /**
     * Event-sourced flows: what about the person leaves (default 'hashed': ids + HMAC hashes of email and
     * phone, never the values). `hashKeyCredentialRef` names the brand's own hash key, so hashes match a
     * mirror they built; otherwise a per-collection platform key is used.
     */
    identity?: {
        policy?: IdentityPolicy;
        hashKeyCredentialRef?: string;
    };
    /** Event-sourced flows: fold SmartLinks events into the provider's registered events. */
    eventMapping?: EventMapping;
    /**
     * Wrap each delivered body as a CloudEvents 1.0 structured event
     * ({ specversion, id, type, source, subject, time, datacontenttype, dataschema, data }) — the shape
     * event buses, lakes and serverless tools consume without custom code.
     */
    envelopeFormat?: 'cloudevents';
    connection?: FlowConnection;
    fieldMappings?: FieldMapping[];
    /** Run this flow through a connector app's functions instead of the built-in mapper/transport. */
    connector?: FlowConnectorRef;
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
    /** Outbound: what the flow reads (product | interaction | contact | event). */
    sourceEntity: FlowSourceEntity | string | null;
    /** Inbound: what the flow writes (product | contact). */
    targetEntity: FlowTargetEntity | string | null;
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
    /**
     * Circuit breaker: set while the flow has paused itself because its destination / provider keeps
     * failing. Nothing is sent or fetched (edits are held as retries) until a probe gets through —
     * `circuitProbeAt` is the next one — or someone resumes it (`integrations.resumeFlow`).
     */
    circuitOpenedAt?: string | null;
    circuitProbeAt?: string | null;
    circuitReason?: string | null;
}
/** A record that failed: retried on its own with backoff ('failed'), or given up on ('dead'). */
export interface FailedRecord {
    /** Outbound: the SmartLinks entity id. Inbound: the landed record's id (pass it to retryFailed). */
    id: string;
    entityId?: string | null;
    /** Inbound: the provider's id for the record. */
    externalId?: string;
    status: 'failed' | 'dead';
    attempts: number;
    nextAttemptAt?: string | null;
    lastError?: string | null;
    updatedAt?: string;
}
/** How one flow is doing (GET /integrations/flows/:id/health). */
export interface FlowHealth {
    flowId: string;
    name: string;
    direction: FlowDirection;
    status: FlowStatus;
    /** Set while the flow has paused itself (its destination / provider keeps failing). */
    paused: {
        since: string;
        nextCheckAt: string | null;
        reason: string | null;
    } | null;
    /** The sweep in progress, if any (progress counts grow as it goes). */
    running: {
        runId: string;
        startedAt: string;
        heartbeatAt: string | null;
        trigger: string;
        progress: Record<string, number | string>;
    } | null;
    lastRun: {
        at: string | null;
        status: string | null;
        error: string | null;
    };
    last24h: {
        runs: number;
        byStatus: Record<string, number>;
        records: number;
        /** Outbound: sent; inbound: created + updated. */
        delivered: number;
        failed: number;
        /** failed / records, 0..1 */
        failureRate: number;
        avgRunMs: number | null;
        recordsPerSecond: number | null;
    };
    /** Inbound: landed / waiting / oldestWaitingSince / retrying / retriesDue / gaveUp. Outbound: delivered / retrying / retriesDue / gaveUp. */
    backlog: {
        landed?: number;
        waiting?: number;
        oldestWaitingSince?: string | null;
        delivered?: number;
        retrying: number;
        retriesDue: number;
        gaveUp: number;
    };
}
/** Every flow in the collection (GET /integrations/health). */
export interface IntegrationHealth {
    flows: FlowHealth[];
    summary: {
        flows: number;
        active: number;
        paused: number;
        running: number;
        failedLast24h: number;
        gaveUp: number;
    };
}
/** Where a product's data came from and where it went (GET /integrations/lineage/product/:id). */
export interface ProductLineage {
    productId: string;
    sources: Array<{
        /** 'connector:<appId>' or 'flow:<flowId>' */
        source: string;
        /** The provider's id for the record. */
        externalId: string;
        flow: {
            id: string;
            name: string;
        };
        fetchedAt: string;
        processedAt: string | null;
        processedRunId: string | null;
        status: string;
        lastError: string | null;
        /** Written with the flow's current mapping and settings (false: an earlier version). */
        currentMapping: boolean;
        mapping: FieldMapping[];
        /** The provider record as received (with `payload: true`). */
        payload?: unknown;
    }>;
    deliveries: Array<{
        flow: {
            id: string;
            name: string;
        };
        status: 'sent' | 'failed' | 'dead';
        lastSentAt: string | null;
        attempts: number;
        nextAttemptAt: string | null;
        lastError: string | null;
        lastRunId: string | null;
    }>;
    recentRuns: FlowRun[];
}
export interface FailedRecordList {
    direction: FlowDirection;
    items: FailedRecord[];
    nextCursor: string | null;
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
    /** Outbound: records delivered. */
    sent?: number;
    failed: number;
    /** Inbound: products created / updated, and records the connector skipped (outbound: unchanged). */
    created?: number;
    updated?: number;
    skipped?: number;
    /** Outbound: changes held because the destination is paused (circuit open); sent after it recovers. */
    held?: number;
    status: RunStatus;
    /** Id of the persisted run row (deep-link into its detail). */
    runId?: string;
}
/** One installed connector app, as the integrations console sees it. */
export interface InstalledConnector {
    appId: string;
    name: string;
    /** The release channel installed on this collection. */
    channel: string;
    version: string | null;
    connector: import('./appManifest.js').AppConnectorDeclaration;
    /** Non-secret Connect-form values + installation settings. */
    installation: {
        connection: Record<string, unknown>;
        settings: Record<string, unknown>;
    };
    /** Each secret the Connect form declares: whether it is set (+ masked hint). Never a value. */
    secrets: Record<string, {
        set: boolean;
        hint?: string | null;
    }>;
}
export interface SaveConnectorInstallationInput {
    /** Non-secret fields only; secret fields are set with `secrets.put` for the connector's appId. */
    connection?: Record<string, unknown>;
    settings?: Record<string, unknown>;
}
/** Steps the console may run directly (send and fetch only run inside a flow; shape/serialize as dry runs). */
export type ConnectorConsoleStep = 'testConnection' | 'describeTarget' | 'sample' | 'shape' | 'serialize' | 'describeEvents' | 'lookup';
/** `describeEvents` → what the provider has registered for this installation (loyalty / engagement). */
export interface ConnectorEventsSchema {
    events: Array<{
        name: string;
        title?: string;
        attributes?: Array<{
            name: string;
            type?: string;
            required?: boolean;
        }>;
    }>;
    limits?: {
        maxEvents?: number;
        maxAttributes?: number;
    };
}
/** `lookup` input: one identity, as the collection's lookup policy sends it (raw, or hashed). */
export interface ConnectorLookupInput {
    installation: ConnectorInstallation;
    identity: {
        externalId?: string | null;
        email?: string | null;
        phone?: string | null;
        emailHash?: string | null;
        phoneHash?: string | null;
        contactId?: string | null;
    };
    /** Attribute names the gate wants, e.g. ['tier', 'points', 'status']. */
    want?: string[];
}
/** `lookup` result. Throw (or return non-2xx) for an outage — never `found: false`. */
export interface ConnectorLookupResult {
    found: boolean;
    memberId?: string | null;
    tier?: string | null;
    points?: number | null;
    status?: string | null;
    attributes?: Record<string, unknown>;
    /** When the provider's answer is from (ISO). */
    asOf?: string | null;
}
/**
 * The one shape a SmartLinks event has when it leaves the platform — what event-sourced flows hand a
 * connector's `serialize` / `send`, after the flow's identity policy and event mapping.
 */
export interface EventEnvelope {
    /** Schema version of this envelope. Bumped only when a consumer could break (a field removed or changed). */
    specVersion: number;
    /** The event's id: stable across retries; use it as the provider's transaction / idempotency id. */
    id: string;
    /** Spine event name, e.g. 'interaction.submitted:<typeId>', 'contact.updated', 'tag.scanned:scan_redirect'. */
    type: string;
    entityType: string | null;
    entityId: string | null;
    occurredAt: string;
    collectionId: string;
    orgId: string;
    appId: string | null;
    identity: {
        contactId: string | null;
        userId: string | null;
        /** Ids other systems know this person by, keyed by system (a connector's `provider`). */
        externalIds: Record<string, string>;
        /** The visitor / device id before anyone signed in (an analytics destination stitches on it later). Under every policy. */
        anonymousId: string | null;
        sessionId: string | null;
        emailHash?: string | null;
        phoneHash?: string | null;
        hashAlgorithm?: 'hmac-sha256' | null;
        /** Only under identity policy 'raw'. */
        email?: string | null;
        phone?: string | null;
    };
    identityPolicy: IdentityPolicy;
    product: {
        id: string;
        name?: string | null;
        sku?: string | null;
        gtin?: string | null;
        variantId?: string | null;
        batchId?: string | null;
    } | null;
    proof: {
        id: string;
    } | null;
    /**
     * The person's communication consent, summarised per channel from the contact's comms state; null
     * when the event is about nobody we hold. A CRM or CDP must not act against it.
     */
    consent: {
        channels: Record<'email' | 'sms' | 'push' | 'whatsapp', 'opted_in' | 'opted_out' | 'suppressed' | 'unknown'>;
        topics: Record<string, boolean>;
        updatedAt: string | null;
    } | null;
    /** The event's own fields: an interaction's interactionId / outcome / metadata, a scan's codeId / country, a contact's profile. */
    subject: Record<string, unknown>;
    /** From the flow's event mapping, when it has one. */
    event?: {
        name: string;
        attributes: Record<string, unknown>;
        rule: string | null;
    };
    attributes: Record<string, unknown>;
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
