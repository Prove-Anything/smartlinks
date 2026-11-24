import { request, post, put, patch, del } from "../http.js";
import { listQuery } from "../list.js";
/**
 * Returns the base path for claim set endpoints.
 * When collectionId is provided, routes to the collection-scoped admin API.
 * When omitted, routes to the user-scoped admin API (global claim sets).
 */
function base(collectionId) {
    return collectionId
        ? `/admin/collection/${encodeURIComponent(collectionId)}/claimSet`
        : `/admin/claimSet`;
}
/** The range API's base for a scope: a collection's own sets, or a partner's sets. */
function rangesBase(scope, claimSetId) {
    const root = 'partnerId' in scope
        ? `/admin/partner/${encodeURIComponent(scope.partnerId)}/claimSet`
        : base(scope.collectionId);
    return `${root}/${encodeURIComponent(claimSetId)}/ranges`;
}
export var claimSet;
(function (claimSet) {
    /**
     * Get all claim sets, a page at a time. Returns `{ items, nextCursor }`: the claim sets are in `items`;
     * pass `nextCursor` back as `cursor` for the next page (`null` means that was the last one).
     * When collectionId is provided, returns claim sets for that collection.
     * When omitted, returns all claim sets owned by the authenticated user.
     * @param collectionId – Optional collection identifier
     * @param options – `limit` (default 50) and `cursor`
     *
     * @example
     * ```typescript
     * let page = await claimSet.getAll('coll_123', { limit: 50 })
     * while (page.nextCursor) page = await claimSet.getAll('coll_123', { limit: 50, cursor: page.nextCursor })
     *
     * // Your own claim sets (no collection)
     * const { items } = await claimSet.getAll(undefined, { limit: 50 })
     * ```
     */
    async function getAll(collectionId, options = {}) {
        return request(`${base(collectionId)}${listQuery({ limit: options.limit, cursor: options.cursor })}`);
    }
    claimSet.getAll = getAll;
    /**
     * Get a specific claim set by ID.
     * @param claimSetId – The claim set identifier
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    async function get(claimSetId, collectionId) {
        return request(`${base(collectionId)}/${encodeURIComponent(claimSetId)}`);
    }
    claimSet.get = get;
    /**
     * Create a new claim set.
     * When collectionId is provided, creates it scoped to that collection.
     * When omitted, creates a global user-owned claim set.
     * @param params – Claim set creation parameters
     * @param collectionId – Optional collection identifier
     */
    async function create(params, collectionId) {
        return post(base(collectionId), params);
    }
    claimSet.create = create;
    /**
     * Update a claim set.
     * @param claimSetId – The claim set identifier
     * @param params – Fields to update
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    async function update(claimSetId, params, collectionId) {
        return put(`${base(collectionId)}/${encodeURIComponent(claimSetId)}`, params);
    }
    claimSet.update = update;
    /**
     * Delete (soft-delete) a claim set.
     * @param claimSetId – The claim set identifier
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    async function remove(claimSetId, collectionId) {
        return del(`${base(collectionId)}/${encodeURIComponent(claimSetId)}`);
    }
    claimSet.remove = remove;
    /**
     * Get all tags for a claim set (including data). This is not one of the SDK 3 lists: the answer is the
     * claim set itself with its tags inside. Without a collectionId (your own claim set) they are in `tags`;
     * with one they are in `codes` (the tag ids), or in `codeMap` (id → key) for a secure set.
     * @param claimSetId – The claim set identifier
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    async function getAllTags(claimSetId, collectionId) {
        return request(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/tags`);
    }
    claimSet.getAllTags = getAllTags;
    /**
     * Get assigned tags for a claim set — tags soft-assigned to a collection or product. Returns
     * `{ items, nextCursor }` with the claim set's own fields (`id`, `name`, …) beside them: the tags are
     * in `items`, a page at a time. Pass `nextCursor` back as `cursor` for the next page (`null` means that
     * was the last one).
     * @param claimSetId – The claim set identifier
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     * @param options – `limit` (default 50) and `cursor`
     *
     * @example
     * ```typescript
     * let page = await claimSet.getAssignedTags('12', 'coll_123', { limit: 50 })
     * console.log(`Assigned tags of ${page.name}:`, page.items)
     * while (page.nextCursor) {
     *   page = await claimSet.getAssignedTags('12', 'coll_123', { limit: 50, cursor: page.nextCursor })
     * }
     * ```
     */
    async function getAssignedTags(claimSetId, collectionId, options = {}) {
        return request(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/assignedTags${listQuery({ limit: options.limit, cursor: options.cursor })}`);
    }
    claimSet.getAssignedTags = getAssignedTags;
    /**
     * Create a single tag inside a claim set.
     * @param claimSetId – The claim set identifier
     * @param data – Tag creation parameters
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    async function createTag(claimSetId, data, collectionId) {
        return post(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/createTag`, data);
    }
    claimSet.createTag = createTag;
    /**
     * Bulk import tags into a claim set.
     * @param claimSetId – The claim set identifier
     * @param data – Import parameters: tags array and optional mode ("upsert" | "replace")
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    async function importTags(claimSetId, data, collectionId) {
        return post(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/importTags`, data);
    }
    claimSet.importTags = importTags;
    // ─── Collection-scoped-only operations ──────────────────────────────────────
    /**
     * Get a report for a claim set (collection-scoped).
     * @param collectionId – The collection identifier
     * @param claimSetId – The claim set identifier
     */
    async function getReport(collectionId, claimSetId) {
        return request(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/report`);
    }
    claimSet.getReport = getReport;
    /**
     * Get tag summary for a collection.
     * @param collectionId – The collection identifier
     */
    async function getTagSummary(collectionId) {
        return request(`${base(collectionId)}/tagSummary`);
    }
    claimSet.getTagSummary = getTagSummary;
    /**
     * Perform a tag query for a collection.
     * @param collectionId – The collection identifier
     * @param data – The query data
     */
    async function tagQuery(collectionId, data) {
        return post(`${base(collectionId)}/tagQuery`, data);
    }
    claimSet.tagQuery = tagQuery;
    /**
     * Make a claim against a claim set (collection-scoped).
     * @param collectionId – The collection identifier
     * @param params – Claim parameters (must include id)
     */
    async function makeClaim(collectionId, params) {
        return post(`${base(collectionId)}/${encodeURIComponent(params.id)}/makeClaim`, params);
    }
    claimSet.makeClaim = makeClaim;
    /**
     * Assign claims to codes or ranges within a collection.
     * @param collectionId – The collection identifier
     * @param data – Claims assignment data
     */
    async function assignClaims(collectionId, data) {
        return post(`${base(collectionId)}/${encodeURIComponent(data.id)}/assignClaims`, data);
    }
    claimSet.assignClaims = assignClaims;
    /**
     * Update claim data for a claim set (collection-scoped).
     * @param collectionId – The collection identifier
     * @param data – Claim data to update
     */
    async function updateClaimData(collectionId, data) {
        return post(`${base(collectionId)}/updateClaimData`, data);
    }
    claimSet.updateClaimData = updateClaimData;
    // ─── Ranges: mint, print, receive, assign ──────────────────────────────────────────────────────
    // A range is a named, contiguous block of tags in one claim set. Scope: { collectionId } for a
    // collection's own sets, { partnerId } for a partner's sets (see partner.*). Owners and admins mint,
    // export, import and program; assigners assign. Responses are never cached (they carry keys).
    let ranges;
    (function (ranges) {
        /**
         * The ranges in a set, lowest index first, a page at a time (50 unless you give a `limit`). Returns
         * `{ items, nextCursor }`: the ranges are in `items`; pass `nextCursor` back as `cursor` for the next
         * page (`null` means that was the last one).
         *
         * @example
         * ```typescript
         * let page = await claimSet.ranges.list({ collectionId: 'coll_123' }, '12', { limit: 50 })
         * while (page.nextCursor) {
         *   page = await claimSet.ranges.list({ collectionId: 'coll_123' }, '12', { limit: 50, cursor: page.nextCursor })
         * }
         * ```
         */
        async function list(scope, claimSetId, options = {}) {
            return request(`${rangesBase(scope, claimSetId)}${listQuery({ limit: options.limit, cursor: options.cursor })}`);
        }
        ranges.list = list;
        /** Reserve the set's next indexes and mint a code (and, for NTAG 424, a key) for each. */
        async function create(scope, claimSetId, params) {
            return post(rangesBase(scope, claimSetId), params);
        }
        ranges.create = create;
        /** One range, with its counts refreshed. */
        async function get(scope, claimSetId, rangeId) {
            return request(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}`);
        }
        ranges.get = get;
        /** Name, notes, order details, or a stage move (sent to the printer, received). */
        async function update(scope, claimSetId, rangeId, params) {
            return patch(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}`, params);
        }
        ranges.update = update;
        /** Finish minting a range that was interrupted. */
        async function resume(scope, claimSetId, rangeId) {
            return post(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/resume`, {});
        }
        ranges.resume = resume;
        /** Close an open range: it becomes a range with the quantity it reached (removed if nothing was minted). */
        async function close(scope, claimSetId, rangeId) {
            return post(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/close`, {});
        }
        ranges.close = close;
        /** Put an existing tag of the set into a group (by code or chip UID), assigning it if a collection is given. */
        async function addMember(scope, claimSetId, groupId, params) {
            return post(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(groupId)}/members`, params);
        }
        ranges.addMember = addMember;
        /** Take a tag out of a group. Its assignment is left as it is. */
        async function removeMember(scope, claimSetId, groupId, code) {
            return del(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(groupId)}/members/${encodeURIComponent(code)}`);
        }
        ranges.removeMember = removeMember;
        /**
         * The range's tags in index order, a page at a time (200 unless you give a `limit`, at most 1000).
         * Returns `{ items, nextCursor }`: pass `nextCursor` back as `cursor` for the next page; `null` means
         * that was the last one. `keys: true` includes each tag's key (owners and admins only).
         *
         * @example
         * ```typescript
         * let page = await claimSet.ranges.tags(scope, '12', rangeId, { limit: 500 })
         * while (page.nextCursor) {
         *   page = await claimSet.ranges.tags(scope, '12', rangeId, { limit: 500, cursor: page.nextCursor })
         * }
         * ```
         */
        async function tags(scope, claimSetId, rangeId, options = {}) {
            const qs = listQuery({ limit: options.limit, cursor: options.cursor, keys: options.keys ? '1' : undefined });
            return request(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/tags${qs}`);
        }
        ranges.tags = tags;
        /** The next tag to program on a phone (lowest index without a chip), with its URL and key. */
        async function next(scope, claimSetId, rangeId) {
            return request(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/next`);
        }
        ranges.next = next;
        /** Record the chip a phone just programmed with this code. */
        async function recordTag(scope, claimSetId, rangeId, code, params) {
            return put(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/tags/${encodeURIComponent(code)}`, params);
        }
        ranges.recordTag = recordTag;
        /**
         * The printer file (CSV text in `csv`). Carries the tags' keys: don't keep it around. A computed set's
         * run downloads in parts: `from` / `to` are indexes inside the range, up to 200,000 tags a file.
         */
        async function exportFile(scope, claimSetId, rangeId, part) {
            const q = new URLSearchParams({ as: 'json' });
            if (part && part.from !== undefined)
                q.set('from', String(part.from));
            if (part && part.to !== undefined)
                q.set('to', String(part.to));
            return request(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/export?${q.toString()}`);
        }
        ranges.exportFile = exportFile;
        /** The manufacturer's instruction sheet: PDF (base64) or Markdown. */
        async function instructions(scope, claimSetId, rangeId, format = 'pdf') {
            return request(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/instructions?format=${format}&as=json`);
        }
        ranges.instructions = instructions;
        /** The manufacturer's file back: check it (commit false), then write the chip UIDs (commit true). */
        async function importUids(scope, claimSetId, rangeId, params) {
            return post(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/import`, params);
        }
        ranges.importUids = importUids;
        /** Point the range (or from–to within it) at a collection / product / batch, or clear it. */
        async function assign(scope, claimSetId, rangeId, params) {
            return post(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/assign`, params);
        }
        ranges.assign = assign;
    })(ranges = claimSet.ranges || (claimSet.ranges = {}));
})(claimSet || (claimSet = {}));
