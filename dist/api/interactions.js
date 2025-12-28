// src/api/interactions.ts
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
export var interactions;
(function (interactions) {
    /**
     * POST /admin/collection/:collectionId/interactions/by-user
     * Returns BigQuery interaction rows, newest first.
     */
    async function byUser(collectionId, query = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/by-user`;
        return post(path, query);
    }
    interactions.byUser = byUser;
    /**
     * POST /admin/collection/:collectionId/interactions/counts-by-outcome
     * Returns array of { outcome, count }.
     */
    async function countsByOutcome(collectionId, query = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/counts-by-outcome`;
        return post(path, query);
    }
    interactions.countsByOutcome = countsByOutcome;
    /**
     * POST /admin/collection/:collectionId/interactions/actor-ids/by-interaction
     * Returns list of IDs, optionally with outcome when includeOutcome=true.
     */
    async function actorIdsByInteraction(collectionId, query) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/actor-ids/by-interaction`;
        return post(path, query);
    }
    interactions.actorIdsByInteraction = actorIdsByInteraction;
    /**
     * POST /admin/collection/:collectionId/interactions/append
     * Appends one interaction event.
     */
    async function appendEvent(collectionId, body) {
        if (!body.userId && !body.contactId) {
            throw new Error("AppendInteractionBody must include one of userId or contactId");
        }
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/append`;
        return post(path, body);
    }
    interactions.appendEvent = appendEvent;
    async function updateEvent(collectionId, body) {
        if (!body.userId && !body.contactId) {
            throw new Error("AppendInteractionBody must include one of userId or contactId");
        }
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/append`;
        return post(path, body);
    }
    interactions.updateEvent = updateEvent;
    /**
       * Appends one interaction event from a public source.
       */
    async function submitPublicEvent(collectionId, body) {
        if (!body.userId && !body.contactId) {
            throw new Error("AppendInteractionBody must include one of userId or contactId");
        }
        const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/submit`;
        return post(path, body);
    }
    interactions.submitPublicEvent = submitPublicEvent;
    // CRUD: Interaction Types (Postgres)
    async function create(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/`;
        return post(path, body);
    }
    interactions.create = create;
    async function list(collectionId, query = {}) {
        const qs = encodeQuery(query);
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/${qs}`;
        return request(path);
    }
    interactions.list = list;
    async function get(collectionId, id) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/${encodeURIComponent(id)}`;
        return request(path);
    }
    interactions.get = get;
    async function update(collectionId, id, patchBody) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/${encodeURIComponent(id)}`;
        return patch(path, patchBody);
    }
    interactions.update = update;
    async function remove(collectionId, id) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/${encodeURIComponent(id)}`;
        return del(path);
    }
    interactions.remove = remove;
    // Public endpoints (permission-aware)
    async function publicCountsByOutcome(collectionId, body, authToken) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/counts-by-outcome`;
        const headers = authToken ? { AUTHORIZATION: `Bearer ${authToken}` } : undefined;
        return post(path, body, headers);
    }
    interactions.publicCountsByOutcome = publicCountsByOutcome;
    async function publicMyInteractions(collectionId, body, authToken) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/by-user`;
        const headers = authToken ? { AUTHORIZATION: `Bearer ${authToken}` } : undefined;
        return post(path, body, headers);
    }
    interactions.publicMyInteractions = publicMyInteractions;
})(interactions || (interactions = {}));
