import { request, post, put, del } from "../http";
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
})(claimSet || (claimSet = {}));
