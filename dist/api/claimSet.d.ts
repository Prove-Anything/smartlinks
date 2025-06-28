export declare namespace claimSet {
    /**
     * Assign claims to a claim set.
     * @param collectionId – The collection identifier
     * @param data – The claims data to assign
     */
    function assignClaims(collectionId: string, data: any): Promise<any>;
    /**
     * Update claim data for a collection.
     * @param collectionId – The collection identifier
     * @param data – The claim data to update
     */
    function updateClaimData(collectionId: string, data: any): Promise<any>;
}
