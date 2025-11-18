import { ProofResponse } from "../types/proof";
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
    function create(collectionId: string, productId: string, values: any): Promise<ProofResponse>;
    /**
     * Update a proof for a product (admin only).
     * PUT /admin/collection/:collectionId/product/:productId/proof/:proofId
     */
    function update(collectionId: string, productId: string, proofId: string, values: any): Promise<ProofResponse>;
    /**
     * Claim a proof for a product.
     * PUT /public/collection/:collectionId/product/:productId/proof/:proofId
     */
    function claim(collectionId: string, productId: string, proofId: string, values: any): Promise<ProofResponse>;
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
