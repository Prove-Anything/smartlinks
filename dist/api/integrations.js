// src/api/integrations.ts
//
// Integration flow management + execution. Flows model input/output pipelines
// (inbound: fetch external -> write entity; outbound: read entity -> transform ->
// send). Credentials live in the secret store (see the `secrets` namespace); a flow
// only carries an opaque credentialRef in config.connection.auth.
//
// Endpoints: /admin/collection/:collectionId/integrations/flows
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { request, post, put, del } from "../http.js";
function enc(v) { return encodeURIComponent(v); }
function encodeQuery(params = {}) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "")
            continue;
        search.set(key, typeof value === "boolean" ? (value ? "true" : "false") : String(value));
    }
    const qs = search.toString();
    return qs ? `?${qs}` : "";
}
export var integrations;
(function (integrations) {
    const base = (collectionId) => `/admin/collection/${enc(collectionId)}/integrations/flows`;
    /** List flows in a collection. GET /integrations/flows */
    async function listFlows(collectionId, query = {}) {
        return request(`${base(collectionId)}${encodeQuery(query)}`);
    }
    integrations.listFlows = listFlows;
    /**
     * Discover the app-record types present in a collection + which app owns each
     * (introspected), for picking a sub-record source/trigger.
     * GET /integrations/record-types
     */
    async function listRecordTypes(collectionId) {
        return request(`/admin/collection/${enc(collectionId)}/integrations/record-types`);
    }
    integrations.listRecordTypes = listRecordTypes;
    /** Create a flow. POST /integrations/flows */
    async function createFlow(collectionId, input) {
        return post(base(collectionId), input);
    }
    integrations.createFlow = createFlow;
    /** Get one flow. GET /integrations/flows/:id */
    async function getFlow(collectionId, id) {
        return request(`${base(collectionId)}/${enc(id)}`);
    }
    integrations.getFlow = getFlow;
    /** Update whitelisted fields. PUT /integrations/flows/:id */
    async function updateFlow(collectionId, id, input) {
        return put(`${base(collectionId)}/${enc(id)}`, input);
    }
    integrations.updateFlow = updateFlow;
    /** Soft-delete a flow. DELETE /integrations/flows/:id */
    async function deleteFlow(collectionId, id) {
        return del(`${base(collectionId)}/${enc(id)}`);
    }
    integrations.deleteFlow = deleteFlow;
    /**
     * Run a flow now. POST /integrations/flows/:id/run
     *   - inline (default): resolves and returns the run summary.
     *   - options.async: enqueue on the worker, returns { enqueued: true }.
     * Pass options.entityId to run for a single source entity.
     */
    async function runFlow(collectionId, id, options = {}) {
        const { async: runAsync } = options, body = __rest(options, ["async"]);
        const qs = runAsync ? "?async=true" : "";
        return post(`${base(collectionId)}/${enc(id)}/run${qs}`, body);
    }
    integrations.runFlow = runFlow;
    /** Type guard: the run executed inline and returned a summary. */
    function isRunSummary(r) {
        return r.status !== undefined;
    }
    integrations.isRunSummary = isRunSummary;
    /** Type guard: the run was enqueued (async). */
    function isRunEnqueued(r) {
        return r.enqueued === true;
    }
    integrations.isRunEnqueued = isRunEnqueued;
    // --- Run logs -----------------------------------------------------------
    // A run row is written for every execution (manual, event, scheduled, test). Per-record
    // request/response detail is captured only while enhanced logging is active for the
    // connection (see setLogging); otherwise runs carry metadata only.
    /** List a flow's runs, newest first. GET /integrations/flows/:id/runs */
    async function listRuns(collectionId, flowId, query = {}) {
        return request(`${base(collectionId)}/${enc(flowId)}/runs${encodeQuery(query)}`);
    }
    integrations.listRuns = listRuns;
    /** Get one run's summary. GET /integrations/flows/:id/runs/:runId */
    async function getRun(collectionId, flowId, runId) {
        return request(`${base(collectionId)}/${enc(flowId)}/runs/${enc(runId)}`);
    }
    integrations.getRun = getRun;
    /**
     * List a run's per-record items. GET /integrations/flows/:id/runs/:runId/items
     * `request`/`response` are populated only for items captured while enhanced logging
     * was active (and before the 24h body purge).
     */
    async function listRunItems(collectionId, flowId, runId, query = {}) {
        return request(`${base(collectionId)}/${enc(flowId)}/runs/${enc(runId)}/items${encodeQuery(query)}`);
    }
    integrations.listRunItems = listRunItems;
    /** Every run touching an entity (e.g. a product), across flows. GET /integrations/runs/entity/:entityId */
    async function listEntityRuns(collectionId, entityId, query = {}) {
        return request(`/admin/collection/${enc(collectionId)}/integrations/runs/entity/${enc(entityId)}${encodeQuery(query)}`);
    }
    integrations.listEntityRuns = listEntityRuns;
    // --- Enhanced logging window (per connection) ---------------------------
    // Full request/response capture is off by default. Turn it on for a connection while
    // debugging; it applies to every flow on that connection and auto-expires (or runs until
    // cancelled). Bodies are redacted at capture and purged after 24h.
    /** Is enhanced logging active for a connection? GET /integrations/logging/:connectionId */
    async function getLogging(collectionId, connectionId) {
        return request(`/admin/collection/${enc(collectionId)}/integrations/logging/${enc(connectionId)}`);
    }
    integrations.getLogging = getLogging;
    /** Enable enhanced logging. POST /integrations/logging/:connectionId (omit ttlMinutes = until cancelled) */
    async function setLogging(collectionId, connectionId, input = {}) {
        return post(`/admin/collection/${enc(collectionId)}/integrations/logging/${enc(connectionId)}`, input);
    }
    integrations.setLogging = setLogging;
    // --- Failed records + resume -----------------------------------------------
    // A failed record is retried on its own with backoff; a permanent failure, or one out of attempts, is
    // 'dead' and waits for someone to retry it (or for the record to change).
    /** A flow's failed / dead records. GET /integrations/flows/:id/failed */
    async function listFailed(collectionId, flowId, query = {}) {
        return request(`${base(collectionId)}/${enc(flowId)}/failed${encodeQuery(query)}`);
    }
    integrations.listFailed = listFailed;
    /** Retry failed / dead records now (all of them when `ids` is omitted). POST /integrations/flows/:id/failed/retry */
    async function retryFailed(collectionId, flowId, ids) {
        return post(`${base(collectionId)}/${enc(flowId)}/failed/retry`, ids ? { ids } : {});
    }
    integrations.retryFailed = retryFailed;
    /** Resume a flow that paused itself (circuit open): held records go out now. POST /integrations/flows/:id/resume */
    async function resumeFlow(collectionId, flowId) {
        return post(`${base(collectionId)}/${enc(flowId)}/resume`, {});
    }
    integrations.resumeFlow = resumeFlow;
    /** Cancel enhanced logging now. DELETE /integrations/logging/:connectionId */
    async function cancelLogging(collectionId, connectionId) {
        return del(`/admin/collection/${enc(collectionId)}/integrations/logging/${enc(connectionId)}`);
    }
    integrations.cancelLogging = cancelLogging;
    // --- Connectors (docs/connectors.md) ------------------------------------
    // Connector apps installed on the collection: their declared contract, the installation's
    // non-secret settings, and which secrets are set. Secrets themselves go through
    // `secrets.put(collectionId, name, value, { appId })` for the connector's appId.
    const connectorsBase = (collectionId) => `/admin/collection/${enc(collectionId)}/integrations/connectors`;
    /** The collection's installed connector apps. GET /integrations/connectors */
    async function listConnectors(collectionId) {
        return request(connectorsBase(collectionId));
    }
    integrations.listConnectors = listConnectors;
    /** Save a connector's non-secret Connect-form values and/or settings. PUT /integrations/connectors/:appId/installation */
    async function saveConnectorInstallation(collectionId, appId, input) {
        return put(`${connectorsBase(collectionId)}/${enc(appId)}/installation`, input);
    }
    integrations.saveConnectorInstallation = saveConnectorInstallation;
    /**
     * Run a connector step from the console: `testConnection` → ConnectorTestResult, `describeTarget` →
     * ConnectorTargetSchema, `sample` → ConnectorRecords, and dry runs of `shape` ({ records }) →
     * ConnectorShapeResult and `serialize` ({ documents }) → ConnectorSerializeResult.
     * The server adds the installation; pass `flowId` to layer that flow's settings.
     * POST /integrations/connectors/:appId/steps/:step
     */
    async function runConnectorStep(collectionId, appId, step, input = {}) {
        return post(`${connectorsBase(collectionId)}/${enc(appId)}/steps/${enc(step)}`, input);
    }
    integrations.runConnectorStep = runConnectorStep;
})(integrations || (integrations = {}));
