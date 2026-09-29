// src/api/integrations.ts
//
// Integration flow management + execution. Flows model input/output pipelines
// (inbound: fetch external -> write entity; outbound: read entity -> transform ->
// send). Credentials live in the secret store (see the `secrets` namespace); a flow
// only carries an opaque credentialRef in config.connection.auth.
//
// Endpoints: /admin/collection/:collectionId/integrations/flows

import { request, post, put, del } from "../http"
import type {
  IntegrationFlow,
  CreateFlowInput,
  UpdateFlowInput,
  ListFlowsQuery,
  FlowList,
  RunFlowInput,
  RunFlowResult,
  RunFlowSummary,
  RunFlowEnqueued,
  RecordTypesResponse,
  FlowRun,
  ListRunsQuery,
  RunList,
  ListRunItemsQuery,
  RunItemList,
  LoggingWindow,
  SetLoggingInput,
} from "../types/integrations"

function enc(v: string) { return encodeURIComponent(v) }
function encodeQuery(params: Record<string, any> = {}): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue
    search.set(key, typeof value === "boolean" ? (value ? "true" : "false") : String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export namespace integrations {
  const base = (collectionId: string) =>
    `/admin/collection/${enc(collectionId)}/integrations/flows`

  /** List flows in a collection. GET /integrations/flows */
  export async function listFlows(collectionId: string, query: ListFlowsQuery = {}): Promise<FlowList> {
    return request<FlowList>(`${base(collectionId)}${encodeQuery(query as any)}`)
  }

  /**
   * Discover the app-record types present in a collection + which app owns each
   * (introspected), for picking a sub-record source/trigger.
   * GET /integrations/record-types
   */
  export async function listRecordTypes(collectionId: string): Promise<RecordTypesResponse> {
    return request<RecordTypesResponse>(`/admin/collection/${enc(collectionId)}/integrations/record-types`)
  }

  /** Create a flow. POST /integrations/flows */
  export async function createFlow(collectionId: string, input: CreateFlowInput): Promise<IntegrationFlow> {
    return post<IntegrationFlow>(base(collectionId), input)
  }

  /** Get one flow. GET /integrations/flows/:id */
  export async function getFlow(collectionId: string, id: string): Promise<IntegrationFlow> {
    return request<IntegrationFlow>(`${base(collectionId)}/${enc(id)}`)
  }

  /** Update whitelisted fields. PUT /integrations/flows/:id */
  export async function updateFlow(collectionId: string, id: string, input: UpdateFlowInput): Promise<IntegrationFlow> {
    return put<IntegrationFlow>(`${base(collectionId)}/${enc(id)}`, input)
  }

  /** Soft-delete a flow. DELETE /integrations/flows/:id */
  export async function deleteFlow(collectionId: string, id: string): Promise<{ deleted: boolean }> {
    return del<{ deleted: boolean }>(`${base(collectionId)}/${enc(id)}`)
  }

  /**
   * Run a flow now. POST /integrations/flows/:id/run
   *   - inline (default): resolves and returns the run summary.
   *   - options.async: enqueue on the worker, returns { enqueued: true }.
   * Pass options.entityId to run for a single source entity.
   */
  export async function runFlow(
    collectionId: string,
    id: string,
    options: RunFlowInput & { async?: boolean } = {}
  ): Promise<RunFlowResult> {
    const { async: runAsync, ...body } = options
    const qs = runAsync ? "?async=true" : ""
    return post<RunFlowResult>(`${base(collectionId)}/${enc(id)}/run${qs}`, body)
  }

  /** Type guard: the run executed inline and returned a summary. */
  export function isRunSummary(r: RunFlowResult): r is RunFlowSummary {
    return (r as RunFlowSummary).status !== undefined
  }

  /** Type guard: the run was enqueued (async). */
  export function isRunEnqueued(r: RunFlowResult): r is RunFlowEnqueued {
    return (r as RunFlowEnqueued).enqueued === true
  }

  // --- Run logs -----------------------------------------------------------
  // A run row is written for every execution (manual, event, scheduled, test). Per-record
  // request/response detail is captured only while enhanced logging is active for the
  // connection (see setLogging); otherwise runs carry metadata only.

  /** List a flow's runs, newest first. GET /integrations/flows/:id/runs */
  export async function listRuns(collectionId: string, flowId: string, query: ListRunsQuery = {}): Promise<RunList> {
    return request<RunList>(`${base(collectionId)}/${enc(flowId)}/runs${encodeQuery(query as any)}`)
  }

  /** Get one run's summary. GET /integrations/flows/:id/runs/:runId */
  export async function getRun(collectionId: string, flowId: string, runId: string): Promise<FlowRun> {
    return request<FlowRun>(`${base(collectionId)}/${enc(flowId)}/runs/${enc(runId)}`)
  }

  /**
   * List a run's per-record items. GET /integrations/flows/:id/runs/:runId/items
   * `request`/`response` are populated only for items captured while enhanced logging
   * was active (and before the 24h body purge).
   */
  export async function listRunItems(
    collectionId: string, flowId: string, runId: string, query: ListRunItemsQuery = {}
  ): Promise<RunItemList> {
    return request<RunItemList>(`${base(collectionId)}/${enc(flowId)}/runs/${enc(runId)}/items${encodeQuery(query as any)}`)
  }

  /** Every run touching an entity (e.g. a product), across flows. GET /integrations/runs/entity/:entityId */
  export async function listEntityRuns(collectionId: string, entityId: string, query: { limit?: number } = {}): Promise<RunList> {
    return request<RunList>(`/admin/collection/${enc(collectionId)}/integrations/runs/entity/${enc(entityId)}${encodeQuery(query as any)}`)
  }

  // --- Enhanced logging window (per connection) ---------------------------
  // Full request/response capture is off by default. Turn it on for a connection while
  // debugging; it applies to every flow on that connection and auto-expires (or runs until
  // cancelled). Bodies are redacted at capture and purged after 24h.

  /** Is enhanced logging active for a connection? GET /integrations/logging/:connectionId */
  export async function getLogging(collectionId: string, connectionId: string): Promise<{ window: LoggingWindow | null }> {
    return request<{ window: LoggingWindow | null }>(
      `/admin/collection/${enc(collectionId)}/integrations/logging/${enc(connectionId)}`
    )
  }

  /** Enable enhanced logging. POST /integrations/logging/:connectionId (omit ttlMinutes = until cancelled) */
  export async function setLogging(collectionId: string, connectionId: string, input: SetLoggingInput = {}): Promise<{ window: LoggingWindow }> {
    return post<{ window: LoggingWindow }>(
      `/admin/collection/${enc(collectionId)}/integrations/logging/${enc(connectionId)}`, input
    )
  }

  /** Cancel enhanced logging now. DELETE /integrations/logging/:connectionId */
  export async function cancelLogging(collectionId: string, connectionId: string): Promise<{ canceled: boolean }> {
    return del<{ canceled: boolean }>(
      `/admin/collection/${enc(collectionId)}/integrations/logging/${enc(connectionId)}`
    )
  }
}
