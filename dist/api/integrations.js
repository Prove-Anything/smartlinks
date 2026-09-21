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
})(integrations || (integrations = {}));
