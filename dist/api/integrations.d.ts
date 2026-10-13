import type { IntegrationFlow, CreateFlowInput, UpdateFlowInput, ListFlowsQuery, FlowList, RunFlowInput, RunFlowResult, RunFlowSummary, RunFlowEnqueued, RecordTypesResponse, FlowRun, ListRunsQuery, RunList, ListRunItemsQuery, RunItemList, LoggingWindow, SetLoggingInput, InstalledConnector, SaveConnectorInstallationInput, ConnectorConsoleStep, FailedRecordList } from "../types/integrations.js";
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
    /** List a flow's runs, newest first. GET /integrations/flows/:id/runs */
    function listRuns(collectionId: string, flowId: string, query?: ListRunsQuery): Promise<RunList>;
    /** Get one run's summary. GET /integrations/flows/:id/runs/:runId */
    function getRun(collectionId: string, flowId: string, runId: string): Promise<FlowRun>;
    /**
     * List a run's per-record items. GET /integrations/flows/:id/runs/:runId/items
     * `request`/`response` are populated only for items captured while enhanced logging
     * was active (and before the 24h body purge).
     */
    function listRunItems(collectionId: string, flowId: string, runId: string, query?: ListRunItemsQuery): Promise<RunItemList>;
    /** Every run touching an entity (e.g. a product), across flows. GET /integrations/runs/entity/:entityId */
    function listEntityRuns(collectionId: string, entityId: string, query?: {
        limit?: number;
    }): Promise<RunList>;
    /** Is enhanced logging active for a connection? GET /integrations/logging/:connectionId */
    function getLogging(collectionId: string, connectionId: string): Promise<{
        window: LoggingWindow | null;
    }>;
    /** Enable enhanced logging. POST /integrations/logging/:connectionId (omit ttlMinutes = until cancelled) */
    function setLogging(collectionId: string, connectionId: string, input?: SetLoggingInput): Promise<{
        window: LoggingWindow;
    }>;
    /** A flow's failed / dead records. GET /integrations/flows/:id/failed */
    function listFailed(collectionId: string, flowId: string, query?: {
        status?: 'failed' | 'dead';
        limit?: number;
        cursor?: string;
    }): Promise<FailedRecordList>;
    /** Retry failed / dead records now (all of them when `ids` is omitted). POST /integrations/flows/:id/failed/retry */
    function retryFailed(collectionId: string, flowId: string, ids?: string[]): Promise<{
        retrying: number;
    }>;
    /** Resume a flow that paused itself (circuit open): held records go out now. POST /integrations/flows/:id/resume */
    function resumeFlow(collectionId: string, flowId: string): Promise<{
        resumed: boolean;
    }>;
    /** Cancel enhanced logging now. DELETE /integrations/logging/:connectionId */
    function cancelLogging(collectionId: string, connectionId: string): Promise<{
        canceled: boolean;
    }>;
    /** The collection's installed connector apps. GET /integrations/connectors */
    function listConnectors(collectionId: string): Promise<{
        connectors: InstalledConnector[];
    }>;
    /** Save a connector's non-secret Connect-form values and/or settings. PUT /integrations/connectors/:appId/installation */
    function saveConnectorInstallation(collectionId: string, appId: string, input: SaveConnectorInstallationInput): Promise<{
        installation: {
            connection: Record<string, unknown>;
            settings: Record<string, unknown>;
        };
    }>;
    /**
     * Run a connector step from the console: `testConnection` → ConnectorTestResult, `describeTarget` →
     * ConnectorTargetSchema, `sample` → ConnectorRecords, and dry runs of `shape` ({ records }) →
     * ConnectorShapeResult and `serialize` ({ documents }) → ConnectorSerializeResult.
     * The server adds the installation; pass `flowId` to layer that flow's settings.
     * POST /integrations/connectors/:appId/steps/:step
     */
    function runConnectorStep<T = unknown>(collectionId: string, appId: string, step: ConnectorConsoleStep, input?: Record<string, unknown> & {
        flowId?: string;
    }): Promise<T>;
}
