import { ProofResponse, ProofCreateRequest, ProofUpdateRequest, ProofClaimRequest } from "../types/proof";
export declare namespace proof {
    /**
     * Retrieves a single Proof by Collection ID, Product ID, and Proof ID.
     * Both public and admin endpoints now include productId in the path.
     */
    function get(collectionId: string, productId: string, proofId: string, admin?: boolean, include?: string[]): Promise<ProofResponse>;
    /**
     * List all Proofs for a Collection.
     */
    function list(collectionId: string, include?: string[]): Promise<ProofResponse[]>;
    /**
     * Create a proof for a product (admin only).
     * POST /admin/collection/:collectionId/product/:productId/proof
     */
    function create(collectionId: string, productId: string, values: ProofCreateRequest): Promise<ProofResponse>;
    /**
     * Update a proof for a product (admin only).
     * PUT /admin/collection/:collectionId/product/:productId/proof/:proofId
     */
    function update(collectionId: string, productId: string, proofId: string, values: ProofUpdateRequest): Promise<ProofResponse>;
    /**
     * Claim a proof for a product using a proof ID (serial number, NFC tag, etc.).
     * PUT /public/collection/:collectionId/product/:productId/proof/:proofId/claim
     */
    function claim(collectionId: string, productId: string, proofId: string, values: ProofClaimRequest): Promise<ProofResponse>;
    /**
     * Claim a product without providing a proof ID.
     * System auto-generates a unique serial number on-demand.
     * Requires allowAutoGenerateClaims to be enabled on the collection or product.
     * PUT /public/collection/:collectionId/product/:productId/proof/claim
     *
     * @example
     * ```typescript
     * const proof = await proof.claimProduct(
     *   'beauty-brand',
     *   'moisturizer-pro',
     *   { purchaseDate: '2026-02-17', store: 'Target' }
     * );
     * console.log('Auto-generated ID:', proof.id);
     * ```
     */
    function claimProduct(collectionId: string, productId: string, values?: ProofClaimRequest): Promise<ProofResponse>;
    /**
     * Delete a proof for a product (admin only).
     * DELETE /admin/collection/:collectionId/product/:productId/proof/:proofId
     */
    function remove(collectionId: string, productId: string, proofId: string): Promise<void>;
    /**
     * Get proofs for a user in a collection (admin only).
     * GET /admin/collection/:collectionId/proof/findByUser/:userId
     */
    function getByUser(collectionId: string, userId: string): Promise<ProofResponse[]>;
    /**
     * Get proofs for a product (admin only).
     * GET /admin/collection/:collectionId/product/:productId/proof
     */
    function getByProduct(collectionId: string, productId: string): Promise<ProofResponse[]>;
    /**
     * Find proofs for a product (admin only).
     * POST /admin/collection/:collectionId/product/:productId/proof/find
     */
    function findByProduct(collectionId: string, productId: string, query: any): Promise<ProofResponse[]>;
    /**
     * Get proofs for a batch (admin only).
     * GET /admin/collection/:collectionId/product/:productId/batch/:batchId/proof
     */
    function getByBatch(collectionId: string, productId: string, batchId: string): Promise<ProofResponse[]>;
}
