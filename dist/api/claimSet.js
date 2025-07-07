import { request, post, put } from "../http";
export var claimSet;
(function (claimSet) {
    /**
     * Get all claim sets for a collection.
     * @param collectionId – The collection identifier
     * @returns Promise resolving to an array of claim sets
     */
    async function getAllForCollection(collectionId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet`;
        return request(path);
    }
    claimSet.getAllForCollection = getAllForCollection;
    /**
     * Get a specific claim set for a collection.
     * @param collectionId – The collection identifier
     * @param claimSetId – The claim set identifier
     * @returns Promise resolving to a claim set object
     */
    async function getForCollection(collectionId, claimSetId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(claimSetId)}`;
        return request(path);
    }
    claimSet.getForCollection = getForCollection;
    /**
     * Get all tags for a claim set.
     * @param collectionId – The collection identifier
     * @param claimSetId – The claim set identifier
     * @returns Promise resolving to an array of tags
     */
    async function getAllTags(collectionId, claimSetId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(claimSetId)}/tags`;
        return request(path);
    }
    claimSet.getAllTags = getAllTags;
    /**
     * Get a report for a claim set.
     * @param collectionId – The collection identifier
     * @param claimSetId – The claim set identifier
     * @returns Promise resolving to a report object
     */
    async function getReport(collectionId, claimSetId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(claimSetId)}/report`;
        return request(path);
    }
    claimSet.getReport = getReport;
    /**
     * Get assigned tags for a claim set.
     * @param collectionId – The collection identifier
     * @param claimSetId – The claim set identifier
     * @returns Promise resolving to assigned tags
     */
    async function getAssignedTags(collectionId, claimSetId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(claimSetId)}/assignedTags`;
        return request(path);
    }
    claimSet.getAssignedTags = getAssignedTags;
    /**
     * Get tag summary for a collection.
     * @param collectionId – The collection identifier
     * @returns Promise resolving to tag summary
     */
    async function getTagSummary(collectionId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/tagSummary`;
        return request(path);
    }
    claimSet.getTagSummary = getTagSummary;
    /**
     * Perform a tag query for a collection.
     * @param collectionId – The collection identifier
     * @param data – The query data
     * @returns Promise resolving to query results
     */
    async function tagQuery(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/tagQuery`;
        return post(path, data);
    }
    claimSet.tagQuery = tagQuery;
    /**
     * Create a new claim set for a collection.
     * @param collectionId – The collection identifier
     * @param params – The claim set creation parameters
     * @returns Promise resolving to the created claim set
     */
    async function createForCollection(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet`;
        return post(path, params);
    }
    claimSet.createForCollection = createForCollection;
    /**
     * Update a claim set for a collection.
     * @param collectionId – The collection identifier
     * @param params – The claim set update parameters (must include id)
     * @returns Promise resolving to the updated claim set
     */
    async function updateForCollection(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(params.id)}`;
        return put(path, params);
    }
    claimSet.updateForCollection = updateForCollection;
    /**
     * Make a claim for a claim set.
     * @param collectionId – The collection identifier
     * @param params – The claim parameters (must include id)
     * @returns Promise resolving to the claim result
     */
    async function makeClaim(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(params.id)}/makeClaim`;
        return post(path, params);
    }
    claimSet.makeClaim = makeClaim;
    /**
     * Assign claims to a claim set.
     * @param collectionId – The collection identifier
     * @param data – The claims data to assign
     */
    async function assignClaims(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(data.id)}/assignClaims`;
        return post(path, data);
    }
    claimSet.assignClaims = assignClaims;
    /**
     * Update claim data for a collection.
     * @param collectionId – The collection identifier
     * @param data – The claim data to update
     */
    async function updateClaimData(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/updateClaimData`;
        return post(path, data);
    }
    claimSet.updateClaimData = updateClaimData;
})(claimSet || (claimSet = {}));
