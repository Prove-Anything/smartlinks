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
}
