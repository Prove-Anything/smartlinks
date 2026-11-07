import { request, post, put, patch, del } from "../http.js";
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
     * Get all claim sets.
     * When collectionId is provided, returns claim sets for that collection.
     * When omitted, returns all claim sets owned by the authenticated user.
     * @param collectionId – Optional collection identifier
     */
    async function getAll(collectionId) {
        return request(base(collectionId));
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
     * Get all tags for a claim set (including data).
     * @param claimSetId – The claim set identifier
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    async function getAllTags(claimSetId, collectionId) {
        return request(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/tags`);
    }
    claimSet.getAllTags = getAllTags;
    /**
     * Get assigned tags for a claim set — tags soft-assigned to a collection or product.
     * @param claimSetId – The claim set identifier
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    async function getAssignedTags(claimSetId, collectionId) {
        return request(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/assignedTags`);
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
        /** The ranges in a set, lowest index first. */
        async function list(scope, claimSetId) {
            return request(rangesBase(scope, claimSetId));
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
        /** The range's tags in index order, a page at a time (keys: owners/admins only). */
        async function tags(scope, claimSetId, rangeId, options = {}) {
            const q = new URLSearchParams();
            if (options.from !== undefined)
                q.set('from', String(options.from));
            if (options.limit !== undefined)
                q.set('limit', String(options.limit));
            if (options.keys)
                q.set('keys', '1');
            const qs = q.toString();
            return request(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/tags${qs ? `?${qs}` : ''}`);
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
        /** The printer file (CSV text in `csv`). Carries the tags' keys: don't keep it around. */
        async function exportFile(scope, claimSetId, rangeId) {
            return request(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/export?as=json`);
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
