export declare namespace claimSet {
    /**
     * Get all claim sets for a collection.
     * @param collectionId – The collection identifier
     * @returns Promise resolving to an array of claim sets
     */
    function getAllForCollection(collectionId: string): Promise<any[]>;
    /**
     * Get a specific claim set for a collection.
     * @param collectionId – The collection identifier
     * @param claimSetId – The claim set identifier
     * @returns Promise resolving to a claim set object
     */
    function getForCollection(collectionId: string, claimSetId: string): Promise<any>;
    /**
     * Get all tags for a claim set.
     * @param collectionId – The collection identifier
     * @param claimSetId – The claim set identifier
     * @returns Promise resolving to an array of tags
     */
    function getAllTags(collectionId: string, claimSetId: string): Promise<any[]>;
    /**
     * Get a report for a claim set.
     * @param collectionId – The collection identifier
     * @param claimSetId – The claim set identifier
     * @returns Promise resolving to a report object
     */
    function getReport(collectionId: string, claimSetId: string): Promise<any>;
    /**
     * Get assigned tags for a claim set.
     * @param collectionId – The collection identifier
     * @param claimSetId – The claim set identifier
     * @returns Promise resolving to assigned tags
     */
    function getAssignedTags(collectionId: string, claimSetId: string): Promise<any>;
    /**
     * Get tag summary for a collection.
     * @param collectionId – The collection identifier
     * @returns Promise resolving to tag summary
     */
    function getTagSummary(collectionId: string): Promise<any>;
    /**
     * Perform a tag query for a collection.
     * @param collectionId – The collection identifier
     * @param data – The query data
     * @returns Promise resolving to query results
     */
    function tagQuery(collectionId: string, data: any): Promise<any>;
    /**
     * Create a new claim set for a collection.
     * @param collectionId – The collection identifier
     * @param params – The claim set creation parameters
     * @returns Promise resolving to the created claim set
     */
    function createForCollection(collectionId: string, params: any): Promise<any>;
    /**
     * Update a claim set for a collection.
     * @param collectionId – The collection identifier
     * @param params – The claim set update parameters (must include id)
     * @returns Promise resolving to the updated claim set
     */
    function updateForCollection(collectionId: string, params: any): Promise<any>;
    /**
     * Make a claim for a claim set.
     * @param collectionId – The collection identifier
     * @param params – The claim parameters (must include id)
     * @returns Promise resolving to the claim result
     */
    function makeClaim(collectionId: string, params: any): Promise<any>;
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
