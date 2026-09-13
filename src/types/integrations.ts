// src/types/integrations.ts
//
// Integration flows + the sealed-secret store that backs their credentials.
//
// A flow is one input/output pipeline: an inbound flow fetches from an external
// system and writes a SmartLinks entity; an outbound flow reads a SmartLinks entity,
// transforms it, and sends it out. Credentials are never stored on the flow — the
// connection carries a `credentialRef` into the secret store, resolved server-side
// only, at execution.

export type FlowDirection = 'inbound' | 'outbound'
export type FlowStatus = 'draft' | 'active' | 'paused' | 'error'
export type RunStatus = 'success' | 'partial' | 'error'

/** How one source field maps to one target field during transform. */
export type TransformType = 'direct' | 'static' | 'template' | 'jsonata' | 'ai'

export interface FieldMapping {
  /** Dot-path in the produced target object (required). */
  targetPath: string
  /** Dot-path in the source record. Used by `direct`. */
  sourcePath?: string
  transformType: TransformType
  /** Constant (`static`) or Liquid template (`template`), etc. */
  transformExpression?: string
}

export type FlowAuthMethod = 'api_key' | 'bearer' | 'basic' | 'webhook' | 'oauth2' | 'none'

export interface FlowConnectionAuth {
  method: FlowAuthMethod
  /** Header name for `api_key` (defaults server-side to X-API-Key). */
  headerName?: string
  /** Opaque reference into the secret store; resolved server-side at execution. */
  credentialRef?: string
}

export interface FlowConnection {
  baseUrl?: string
  /** Outbound: path appended to baseUrl for sends. */
  sendEndpoint?: string
  /** Inbound: path appended to baseUrl for fetches. */
  fetchEndpoint?: string
  defaultHeaders?: Record<string, string>
  auth?: FlowConnectionAuth
}

export interface IntegrationFlowConfig {
  connection?: FlowConnection
  fieldMappings?: FieldMapping[]
  [key: string]: any
}

export interface IntegrationFlow {
  id: string
  orgId: string
  collectionId: string
  appId: string
  direction: FlowDirection
  name: string
  status: FlowStatus
  /** Event types this flow subscribes to, e.g. ['product.updated']. */
  eventTypes: string[]
  /** Cron/interval string for scheduled flows, or null. */
  schedule: string | null
  sourceEntity: string | null
  targetEntity: string | null
  config: IntegrationFlowConfig
  createdBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  // Run watermark / last-run telemetry (written by the executor).
  lastRunAt?: string | null
  lastRunStatus?: string | null
  lastRunError?: string | null
  lastRunCount?: number | null
  lastPollAt?: string | null
  lastCursor?: string | null
  totalSynced?: number | null
}

export interface CreateFlowInput {
  appId: string
  direction: FlowDirection
  name: string
  status?: FlowStatus
  eventTypes?: string[]
  schedule?: string | null
  sourceEntity?: string | null
  targetEntity?: string | null
  config?: IntegrationFlowConfig
}

export type UpdateFlowInput = Partial<Omit<CreateFlowInput, 'direction'>> & {
  status?: FlowStatus
}

export interface ListFlowsQuery {
  direction?: FlowDirection
  status?: FlowStatus
  appId?: string
}

export interface FlowList {
  flows: IntegrationFlow[]
}

/** Options for a manual flow run. */
export interface RunFlowInput {
  /** Run for a single source entity; omit for the flow's scheduled gather. */
  entityId?: string
}

/** Inline (synchronous) run summary. */
export interface RunFlowSummary {
  flowId: string
  direction: FlowDirection
  records: number
  sent: number
  failed: number
  status: RunStatus
}

/** Response when a run is enqueued (?async=true). */
export interface RunFlowEnqueued {
  enqueued: true
  flowId: string
  entityId: string | null
}

export type RunFlowResult = RunFlowSummary | RunFlowEnqueued

// ---------------------------------------------------------------------------
// Secret store — write-only from the client; values never come back.
// ---------------------------------------------------------------------------

/** Metadata for a stored secret. NEVER includes the value or ciphertext. */
export interface SecretMeta {
  ref: string
  name: string | null
  purpose: string
  /** Masked hint (e.g. last few chars) — safe to display. */
  hint: string
  keyVersion: number
  createdBy: string | null
  createdAt: string
  updatedAt: string
  rotatedAt?: string | null
}

export interface SecretList {
  secrets: SecretMeta[]
}

export interface SetSecretInput {
  value: string
  name?: string
  /** Grouping/scoping label, defaults to 'integration' server-side. */
  purpose?: string
}

/** Result of set/rotate — the ref to store on a flow's connection, plus a hint. */
export interface SetSecretResult {
  ref: string
  hint: string
}

export interface ListSecretsQuery {
  purpose?: string
}

// ---------------------------------------------------------------------------
// Record-type discovery (for choosing a sub-record source/trigger)
// ---------------------------------------------------------------------------

export interface RecordTypeInfo {
  appId: string
  recordType: string
  count: number
}

export interface RecordTypesResponse {
  recordTypes: RecordTypeInfo[]
}
