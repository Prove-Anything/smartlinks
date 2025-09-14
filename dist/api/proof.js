// src/api/proof.ts
import { request, post, put } from "../http";
export var proof;
(function (proof) {
    /**
     * Retrieves a single Proof by Collection ID, Product ID, and Proof ID.
     * Both public and admin endpoints now include productId in the path.
     */
    async function get(collectionId, productId, proofId, admin) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}`;
        return request(path);
    }
    proof.get = get;
    /**
     * List all Proofs for a Collection.
     */
    async function list(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/proof`;
        return request(path);
    }
    proof.list = list;
    // -------------------- Admin functions (legacy parity) --------------------
    /**
     * Create a proof for a product (admin only).
     * POST /admin/collection/:collectionId/product/:productId/proof
     */
    async function create(collectionId, productId, values) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof`;
        return post(path, values);
    }
    proof.create = create;
    /**
     * Update a proof for a product (admin only).
     * PUT /admin/collection/:collectionId/product/:productId/proof/:proofId
     */
    async function update(collectionId, productId, proofId, values) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}`;
        return put(path, values);
    }
    proof.update = update;
    /**
     * Get proofs for a user in a collection (admin only).
     * GET /admin/collection/:collectionId/proof/findByUser/:userId
     */
    async function getByUser(collectionId, userId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/proof/findByUser/${encodeURIComponent(userId)}`;
        return request(path);
    }
    proof.getByUser = getByUser;
    /**
     * Get proofs for a product (admin only).
     * GET /admin/collection/:collectionId/product/:productId/proof
     */
    async function getByProduct(collectionId, productId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof`;
        return request(path);
    }
    proof.getByProduct = getByProduct;
    /**
     * Find proofs for a product (admin only).
     * POST /admin/collection/:collectionId/product/:productId/proof/find
     */
    async function findByProduct(collectionId, productId, query) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/find`;
        return post(path, query);
    }
    proof.findByProduct = findByProduct;
    /**
     * Get proofs for a batch (admin only).
     * GET /admin/collection/:collectionId/product/:productId/batch/:batchId/proof
     */
    async function getByBatch(collectionId, productId, batchId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch/${encodeURIComponent(batchId)}/proof`;
        return request(path);
    }
    proof.getByBatch = getByBatch;
})(proof || (proof = {}));
