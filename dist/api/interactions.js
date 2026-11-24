// src/api/interactions.ts
import { request, post, patch, del } from "../http.js";
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
     * Flexible query for interaction events with optional includes. One list, no pages: `limit` in the
     * body says how many events to return.
     *
     * @example
     * ```typescript
     * const { items } = await interactions.query('coll_123', { appId: 'my-app', interactionId: voteTypeId, limit: 500 })
     * ```
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
      *
      * `interactionId` must reference an existing interaction type definition.
      * This endpoint does not create interaction definitions.
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
    * `interactionId` must reference an existing interaction type definition.
    * This endpoint does not create interaction definitions.
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
    /**
     * List the collection's interaction types (admin), optionally only one app's.
     * GET /admin/collection/:collectionId/interactions
     *
     * @example
     * ```typescript
     * let page = await interactions.list('coll_123', { appId: 'my-app', limit: 100 })
     * while (page.nextCursor) page = await interactions.list('coll_123', { appId: 'my-app', limit: 100, cursor: page.nextCursor })
     * ```
     */
    async function list(collectionId, query = {}) {
        const qs = encodeQuery(query);
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/interactions/${qs}`;
        return request(path);
    }
    interactions.list = list;
    /**
     * Find this app's interaction type by its readable `key` (data.interactionType), or create it.
     * Returns the type record — its `id` is the server-minted UUID every event must use.
     * ADMIN only (run it in your admin/setup screen), then store the id in your app config so
     * public code can read it: `interactionIds: { vote: type.id }`. Safe to run on every setup.
     *
     * @example
     * const vote = await SL.interactions.ensureType(collectionId, {
     *   appId: 'my-app', key: 'vote', permissions: { allowPublicSubmit: true, uniquePerUser: true },
     *   display: { title: 'Cast a vote', description: 'Someone voted in the poll' },
     * })
     * // vote.id → '52bab6fa-…' — store it in config; never hardcode 'vote' as an interactionId
     * // Always give display.title: it's the name staff see in the CRM, on activity and when choosing
     * // "everyone who voted" for a segment. (Without one the platform names it from the key.)
     */
    async function ensureType(collectionId, input) {
        const { appId, key, permissions, display, data } = input;
        if (!appId || !key)
            throw new Error('interactions.ensureType: appId and key are required');
        let cursor;
        for (;;) {
            const page = await list(collectionId, { appId, limit: 200, cursor });
            const found = (page.items || []).find((t) => t.data && t.data.interactionType === key);
            if (found)
                return found;
            if (!page.nextCursor)
                break;
            cursor = page.nextCursor;
        }
        return create(collectionId, Object.assign(Object.assign({ appId }, (permissions ? { permissions } : {})), { data: Object.assign(Object.assign(Object.assign({}, (data || {})), { interactionType: key }), (display ? { display } : {})) }));
    }
    interactions.ensureType = ensureType;
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
    /**
     * The signed-in person's own interaction events (where the type allows it). One list, no pages:
     * `limit` in the body says how many.
     * POST /public/collection/:collectionId/interactions/by-user
     *
     * @example
     * ```typescript
     * const { items } = await interactions.publicMyInteractions('coll_123', { appId: 'my-app', interactionId: voteTypeId })
     * ```
     */
    async function publicMyInteractions(collectionId, body, authToken) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/interactions/by-user`;
        const headers = authToken ? { AUTHORIZATION: `Bearer ${authToken}` } : undefined;
        return post(path, body, headers);
    }
    interactions.publicMyInteractions = publicMyInteractions;
    /**
     * Public: list the collection's interaction types, optionally only one app's.
     * GET /public/collection/:collectionId/interactions
     *
     * @example
     * ```typescript
     * const { items, nextCursor } = await interactions.publicList('coll_123', { appId: 'my-app', limit: 50 })
     * ```
     */
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
