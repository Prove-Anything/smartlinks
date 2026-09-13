import type { IntegrationFlow, CreateFlowInput, UpdateFlowInput, ListFlowsQuery, FlowList, RunFlowInput, RunFlowResult, RunFlowSummary, RunFlowEnqueued, RecordTypesResponse } from "../types/integrations";
export declare namespace integrations {
    /** List flows in a collection. GET /integrations/flows */
    function listFlows(collectionId: string, query?: ListFlowsQuery): Promise<FlowList>;
    /**
     * Discover the app-record types present in a collection + which app owns each
     * (introspected), for picking a sub-record source/trigger.
     * GET /integrations/record-types
     */
    function listRecordTypes(collectionId: string): Promise<RecordTypesResponse>;
    /** Create a flow. POST /integrations/flows */
    function createFlow(collectionId: string, input: CreateFlowInput): Promise<IntegrationFlow>;
    /** Get one flow. GET /integrations/flows/:id */
    function getFlow(collectionId: string, id: string): Promise<IntegrationFlow>;
    /** Update whitelisted fields. PUT /integrations/flows/:id */
    function updateFlow(collectionId: string, id: string, input: UpdateFlowInput): Promise<IntegrationFlow>;
    /** Soft-delete a flow. DELETE /integrations/flows/:id */
    function deleteFlow(collectionId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    /**
     * Run a flow now. POST /integrations/flows/:id/run
     *   - inline (default): resolves and returns the run summary.
     *   - options.async: enqueue on the worker, returns { enqueued: true }.
     * Pass options.entityId to run for a single source entity.
     */
    function runFlow(collectionId: string, id: string, options?: RunFlowInput & {
        async?: boolean;
    }): Promise<RunFlowResult>;
    /** Type guard: the run executed inline and returned a summary. */
    function isRunSummary(r: RunFlowResult): r is RunFlowSummary;
    /** Type guard: the run was enqueued (async). */
    function isRunEnqueued(r: RunFlowResult): r is RunFlowEnqueued;
}
