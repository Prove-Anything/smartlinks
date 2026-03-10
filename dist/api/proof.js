// src/api/proof.ts
import { request, post, put, del } from "../http";
export var proof;
(function (proof) {
    /**
     * Retrieves a single Proof by Collection ID, Product ID, and Proof ID.
     * Both public and admin endpoints now include productId in the path.
     */
    async function get(collectionId, productId, proofId, admin, include) {
        const base = admin ? '/admin' : '/public';
        const qp = include && include.length ? `?include=${encodeURIComponent(include.join(','))}` : '';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}${qp}`;
        return request(path);
    }
    proof.get = get;
    /**
     * List all Proofs for a Collection.
     */
    async function list(collectionId, include) {
        const qp = include && include.length ? `?include=${encodeURIComponent(include.join(','))}` : '';
        const path = `/public/collection/${encodeURIComponent(collectionId)}/proof${qp}`;
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
     * Claim a proof for a product using a proof ID (serial number, NFC tag, etc.).
     * PUT /public/collection/:collectionId/product/:productId/proof/:proofId/claim
     */
    async function claim(collectionId, productId, proofId, values) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/claim`;
        return put(path, values);
    }
    proof.claim = claim;
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
    async function claimProduct(collectionId, productId, values) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/claim`;
        return put(path, values || {});
    }
    proof.claimProduct = claimProduct;
    /**
     * Delete a proof for a product (admin only).
     * DELETE /admin/collection/:collectionId/product/:productId/proof/:proofId
     */
    async function remove(collectionId, productId, proofId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}`;
        return del(path);
    }
    proof.remove = remove;
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
    /**
     * Migrate a proof to a different product within the same collection (admin only).
     *
     * Because the Firestore ledger document ID is `{productId}-{proofId}`, a proof
     * cannot simply be re-assigned to another product by updating a field — the
     * document must be re-keyed. This endpoint handles that atomically:
     *
     *   1. Reads the source ledger document (`{sourceProductId}-{proofId}`).
     *   2. Writes a new document (`{targetProductId}-{proofId}`) with `productId`
     *      and `proofGroup` updated. The short `proofId` (nanoid) is unchanged.
     *   3. Writes a migration history entry to the new document's `history`
     *      subcollection (snapshot of the original proof + migration metadata).
     *   4. Copies all subcollections — `assets`, `attestations`, `history` — from
     *      the old document to the new one.
     *   5. Deletes the old subcollections and then the old document.
     *
     * Repeated migrations are safe — each one appends a history record; no
     * migration metadata is stored on the proof document itself.
     *
     * @param collectionId - Identifier of the parent collection
     * @param productId - Current (source) product ID that owns the proof
     * @param proofId - Identifier of the proof to migrate
     * @param data - `{ targetProductId }` — the destination product
     * @returns The migrated proof object (now owned by `targetProductId`)
     *
     * @example
     * ```typescript
     * const migrated = await proof.migrate('coll_123', 'prod_old', 'proof_abc', {
     *   targetProductId: 'prod_new',
     * })
     * console.log(migrated.productId) // 'prod_new'
     * ```
     */
    async function migrate(collectionId, productId, proofId, 
    /** The destination product ID */
    data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/products/${encodeURIComponent(productId)}/proofs/${encodeURIComponent(proofId)}/migrate`;
        return post(path, data);
    }
    proof.migrate = migrate;
})(proof || (proof = {}));
