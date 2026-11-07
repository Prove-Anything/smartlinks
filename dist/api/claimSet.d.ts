import { ClaimSetScope, ClaimSetRange, CreateClaimSetRangeRequest, UpdateClaimSetRangeRequest, ClaimSetRangeTagsPage, ClaimSetRangeTag, ClaimSetRangeNextTag, ImportClaimSetRangeUidsRequest, ImportClaimSetRangeUidsResponse, AssignClaimSetRangeRequest, AssignClaimSetRangeResponse, ClaimSetRangeFile, UpdateClaimDataRequest, AssignClaimsRequest, CreateClaimSetTagRequest, CreateClaimSetTagResponse, CreateClaimSetRequest, ImportClaimSetTagsRequest, ImportClaimSetTagsResponse } from "../types/index.js";
export declare namespace claimSet {
    /**
     * Get all claim sets.
     * When collectionId is provided, returns claim sets for that collection.
     * When omitted, returns all claim sets owned by the authenticated user.
     * @param collectionId – Optional collection identifier
     */
    function getAll(collectionId?: string): Promise<any[]>;
    /**
     * Get a specific claim set by ID.
     * @param claimSetId – The claim set identifier
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    function get(claimSetId: string, collectionId?: string): Promise<any>;
    /**
     * Create a new claim set.
     * When collectionId is provided, creates it scoped to that collection.
     * When omitted, creates a global user-owned claim set.
     * @param params – Claim set creation parameters
     * @param collectionId – Optional collection identifier
     */
    function create(params: CreateClaimSetRequest, collectionId?: string): Promise<any>;
    /**
     * Update a claim set.
     * @param claimSetId – The claim set identifier
     * @param params – Fields to update
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    function update(claimSetId: string, params: any, collectionId?: string): Promise<any>;
    /**
     * Delete (soft-delete) a claim set.
     * @param claimSetId – The claim set identifier
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    function remove(claimSetId: string, collectionId?: string): Promise<any>;
    /**
     * Get all tags for a claim set (including data).
     * @param claimSetId – The claim set identifier
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    function getAllTags(claimSetId: string, collectionId?: string): Promise<any>;
    /**
     * Get assigned tags for a claim set — tags soft-assigned to a collection or product.
     * @param claimSetId – The claim set identifier
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    function getAssignedTags(claimSetId: string, collectionId?: string): Promise<any>;
    /**
     * Create a single tag inside a claim set.
     * @param claimSetId – The claim set identifier
     * @param data – Tag creation parameters
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    function createTag(claimSetId: string, data: CreateClaimSetTagRequest, collectionId?: string): Promise<CreateClaimSetTagResponse>;
    /**
     * Bulk import tags into a claim set.
     * @param claimSetId – The claim set identifier
     * @param data – Import parameters: tags array and optional mode ("upsert" | "replace")
     * @param collectionId – Optional collection identifier; omit for user-scoped access
     */
    function importTags(claimSetId: string, data: ImportClaimSetTagsRequest, collectionId?: string): Promise<ImportClaimSetTagsResponse>;
    /**
     * Get a report for a claim set (collection-scoped).
     * @param collectionId – The collection identifier
     * @param claimSetId – The claim set identifier
     */
    function getReport(collectionId: string, claimSetId: string): Promise<any>;
    /**
     * Get tag summary for a collection.
     * @param collectionId – The collection identifier
     */
    function getTagSummary(collectionId: string): Promise<any>;
    /**
     * Perform a tag query for a collection.
     * @param collectionId – The collection identifier
     * @param data – The query data
     */
    function tagQuery(collectionId: string, data: any): Promise<any>;
    /**
     * Make a claim against a claim set (collection-scoped).
     * @param collectionId – The collection identifier
     * @param params – Claim parameters (must include id)
     */
    function makeClaim(collectionId: string, params: any): Promise<any>;
    /**
     * Assign claims to codes or ranges within a collection.
     * @param collectionId – The collection identifier
     * @param data – Claims assignment data
     */
    function assignClaims(collectionId: string, data: AssignClaimsRequest): Promise<any>;
    /**
     * Update claim data for a claim set (collection-scoped).
     * @param collectionId – The collection identifier
     * @param data – Claim data to update
     */
    function updateClaimData(collectionId: string, data: UpdateClaimDataRequest): Promise<any>;
    namespace ranges {
        /** The ranges in a set, lowest index first. */
        function list(scope: ClaimSetScope, claimSetId: string): Promise<ClaimSetRange[]>;
        /** Reserve the set's next indexes and mint a code (and, for NTAG 424, a key) for each. */
        function create(scope: ClaimSetScope, claimSetId: string, params: CreateClaimSetRangeRequest): Promise<ClaimSetRange>;
        /** One range, with its counts refreshed. */
        function get(scope: ClaimSetScope, claimSetId: string, rangeId: string): Promise<ClaimSetRange>;
        /** Name, notes, order details, or a stage move (sent to the printer, received). */
        function update(scope: ClaimSetScope, claimSetId: string, rangeId: string, params: UpdateClaimSetRangeRequest): Promise<ClaimSetRange>;
        /** Finish minting a range that was interrupted. */
        function resume(scope: ClaimSetScope, claimSetId: string, rangeId: string): Promise<ClaimSetRange>;
        /** The range's tags in index order, a page at a time (keys: owners/admins only). */
        function tags(scope: ClaimSetScope, claimSetId: string, rangeId: string, options?: {
            from?: number;
            limit?: number;
            keys?: boolean;
        }): Promise<ClaimSetRangeTagsPage>;
        /** The next tag to program on a phone (lowest index without a chip), with its URL and key. */
        function next(scope: ClaimSetScope, claimSetId: string, rangeId: string): Promise<ClaimSetRangeNextTag>;
        /** Record the chip a phone just programmed with this code. */
        function recordTag(scope: ClaimSetScope, claimSetId: string, rangeId: string, code: string, params: {
            uid: string;
            data?: Record<string, unknown>;
        }): Promise<{
            tag: ClaimSetRangeTag;
            range: ClaimSetRange;
        }>;
        /** The printer file (CSV text in `csv`). Carries the tags' keys: don't keep it around. */
        function exportFile(scope: ClaimSetScope, claimSetId: string, rangeId: string): Promise<ClaimSetRangeFile>;
        /** The manufacturer's instruction sheet: PDF (base64) or Markdown. */
        function instructions(scope: ClaimSetScope, claimSetId: string, rangeId: string, format?: 'pdf' | 'md'): Promise<ClaimSetRangeFile>;
        /** The manufacturer's file back: check it (commit false), then write the chip UIDs (commit true). */
        function importUids(scope: ClaimSetScope, claimSetId: string, rangeId: string, params: ImportClaimSetRangeUidsRequest): Promise<ImportClaimSetRangeUidsResponse>;
        /** Point the range (or from–to within it) at a collection / product / batch, or clear it. */
        function assign(scope: ClaimSetScope, claimSetId: string, rangeId: string, params: AssignClaimSetRangeRequest): Promise<AssignClaimSetRangeResponse>;
    }
}
