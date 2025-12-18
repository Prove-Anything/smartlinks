// src/api/actions.ts
import { request, post, patch, del } from "../http";
function encodeQuery(params) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "")
            continue;
        if (typeof value === "boolean") {
            search.set(key, value ? "true" : "false");
        }
        else {
            search.set(key, String(value));
        }
    }
    const qs = search.toString();
    return qs ? `?${qs}` : "";
}
export var actions;
(function (actions) {
    /**
     * POST /admin/collection/:collectionId/actions/by-user
     * Returns BigQuery action rows, newest first.
     */
    async function byUser(collectionId, query = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/by-user`;
        return post(path, query);
    }
    actions.byUser = byUser;
    /**
     * POST /admin/collection/:collectionId/actions/counts-by-outcome
     * Returns array of { outcome, count }.
     */
    async function countsByOutcome(collectionId, query = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/counts-by-outcome`;
        return post(path, query);
    }
    actions.countsByOutcome = countsByOutcome;
    /**
     * POST /admin/collection/:collectionId/actions/actor-ids/by-action
     * Returns list of IDs, optionally with outcome when includeOutcome=true.
     */
    async function actorIdsByAction(collectionId, query) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/actor-ids/by-action`;
        return post(path, query);
    }
    actions.actorIdsByAction = actorIdsByAction;
    /**
     * POST /admin/collection/:collectionId/actions/append
     * Appends one action event.
     */
    async function append(collectionId, body) {
        if (!body.userId && !body.contactId) {
            throw new Error("AppendActionBody must include one of userId or contactId");
        }
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/append`;
        return post(path, body);
    }
    actions.append = append;
    // CRUD: Actions (Postgres)
    async function create(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/`;
        return post(path, body);
    }
    actions.create = create;
    async function list(collectionId, query = {}) {
        const qs = encodeQuery(query);
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/${qs}`;
        return request(path);
    }
    actions.list = list;
    async function get(collectionId, id) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/${encodeURIComponent(id)}`;
        return request(path);
    }
    actions.get = get;
    async function update(collectionId, id, patchBody) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/${encodeURIComponent(id)}`;
        return patch(path, patchBody);
    }
    actions.update = update;
    async function remove(collectionId, id) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/actions/${encodeURIComponent(id)}`;
        return del(path);
    }
    actions.remove = remove;
    // Public endpoints (permission-aware)
    async function publicCountsByOutcome(collectionId, body, authToken) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/actions/counts-by-outcome`;
        const headers = authToken ? { AUTHORIZATION: `Bearer ${authToken}` } : undefined;
        return post(path, body, headers);
    }
    actions.publicCountsByOutcome = publicCountsByOutcome;
    async function publicMyActions(collectionId, body, authToken) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/actions/by-user`;
        const headers = authToken ? { AUTHORIZATION: `Bearer ${authToken}` } : undefined;
        return post(path, body, headers);
    }
    actions.publicMyActions = publicMyActions;
})(actions || (actions = {}));
