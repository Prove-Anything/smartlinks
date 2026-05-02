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
     * POST /admin/collection/:collectionId/interactions/query
     * Flexible query for interaction events with optional includes.
     */
    async function query(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/query`;
        return post(path, body);
    }
    interactions.query = query;
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
     * POST /admin/collection/:collectionId/interactions/aggregate
     * Returns grouped numeric aggregates (sum, avg, min, max, count).
     */
    async function aggregate(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/aggregate`;
        return post(path, body);
    }
    interactions.aggregate = aggregate;
    /**
     * Legacy-friendly alias for aggregate().
     */
    async function aggregateByOutcome(collectionId, body) {
        return aggregate(collectionId, body);
    }
    interactions.aggregateByOutcome = aggregateByOutcome;
    // Deprecated endpoint removed: actorIdsByInteraction
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
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/events/update`;
        return post(path, body);
    }
    interactions.updateEvent = updateEvent;
    /**
       * POST /api/v1/public/collection/:collectionId/interactions/submit
       *
       * Submits an interaction event from a public/client-side context.
       * When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor
       * `contactId` is required. Pass `anonId` inside `metadata` to enable
       * device-level deduplication via `uniquePerAnonId`.
       */
    async function submitPublicEvent(collectionId, body) {
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
    // Public: list interaction definitions (Postgres)
    async function publicList(collectionId, query = {}) {
        const qs = encodeQuery(query);
        const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/${qs}`;
        return request(path);
    }
    interactions.publicList = publicList;
    // Public: get a single interaction definition (Postgres)
    async function publicGet(collectionId, id) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/${encodeURIComponent(id)}`;
        return request(path);
    }
    interactions.publicGet = publicGet;
})(interactions || (interactions = {}));
