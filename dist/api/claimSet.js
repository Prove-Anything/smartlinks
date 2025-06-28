import { post } from "../http";
export var claimSet;
(function (claimSet) {
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
