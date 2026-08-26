import { ProofResponse, ProofCreateRequest, ProofUpdateRequest, ProofClaimRequest, ProofGrant, CreateGrantOptions, RedeemGrantOptions, RedeemGrantResult, ProofTransfer, TransferProofOptions, TransferProofResult } from "../types/proof";
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
     *
     * Pass the proof's content in a `proof` block, keyed by zone (see {@link ProofWrite}):
     * ```ts
     * proof.create(collectionId, productId, {
     *   proof: {
     *     values: { colour: 'red' },   // public + owner readable, owner + admin writable
     *     data:   { serialNo: 1001 },  // public + owner readable, ADMIN-only writable
     *     admin:  { costPrice: 4.20 }, // admin-only
     *   },
     *   claimable: true,
     * })
     * ```
     * Note: a top-level `data`/`admin` on the request body is legacy — top-level
     * `data` gets folded into the values bag, so use `proof.data` for `proof.data`.
     */
    function create(collectionId: string, productId: string, request: ProofCreateRequest): Promise<ProofResponse>;
    /**
     * Update a proof for a product (admin only).
     * PUT /admin/collection/:collectionId/product/:productId/proof/:proofId
     *
     * Pass the fields to change **at the root**, keyed by zone (see {@link ProofWrite}):
     * ```ts
     * proof.update(collectionId, productId, proofId, {
     *   data:   { serialNo: 1002 },   // → proof.data (admin-only writable)
     *   values: { colour: 'blue' },   // → proof.values
     * })
     * ```
     * Object zones deep-merge, so you can change one field without wiping the rest.
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
    function migrate(collectionId: string, productId: string, proofId: string, 
    /** The destination product ID */
    data: {
        targetProductId: string;
    }): Promise<ProofResponse>;
    /**
     * Create a share grant on a proof (owner / collection admin only). The returned
     * grant includes `token` — the opaque bearer secret, available ONLY on this
     * response. Embed it in a share link and hand recipients {@link redeemGrant} /
     * {@link setGrantToken}.
     */
    function createGrant(collectionId: string, productId: string, proofId: string, options: CreateGrantOptions): Promise<ProofGrant>;
    /** List the active + past grants on a proof (owner / collection admin only). Tokens are never returned here. */
    function listGrants(collectionId: string, productId: string, proofId: string): Promise<ProofGrant[]>;
    /** Revoke a grant by id (owner / collection admin only). Takes effect immediately. */
    function revokeGrant(collectionId: string, productId: string, proofId: string, grantId: string): Promise<void>;
    /**
     * Redeem a grant token (anonymous or signed-in). Records the redemption and
     * returns the granted scope, or — for a `verify_owner` grant — an ownership
     * assertion (never the account). After redeeming, call
     * {@link setGrantToken} so subsequent data requests carry the token.
     */
    function redeemGrant(collectionId: string, productId: string, proofId: string, token: string, options?: RedeemGrantOptions): Promise<RedeemGrantResult>;
    /**
     * Start a push transfer of a proof (current owner / collection admin only).
     *
     * Directed — hand it to a named recipient who then calls {@link acceptTransfer}:
     * ```ts
     * await proof.transfer(collectionId, productId, proofId, { toEmail: 'buyer@example.com' })
     * ```
     * Open release — make the proof claimable by anyone:
     * ```ts
     * await proof.transfer(collectionId, productId, proofId, { release: true })
     * ```
     */
    function transfer(collectionId: string, productId: string, proofId: string, options: TransferProofOptions): Promise<TransferProofResult>;
    /**
     * Accept a directed transfer (the named recipient only). Completes the ownership
     * move — the proof's `userId` becomes the caller and the previous owner's private
     * data and share grants are cleared/voided.
     */
    function acceptTransfer(collectionId: string, productId: string, proofId: string): Promise<{
        ok: boolean;
        proof: ProofResponse;
    }>;
    /** Cancel a pending push transfer (current owner / collection admin only). */
    function cancelTransfer(collectionId: string, productId: string, proofId: string): Promise<{
        ok: boolean;
    }>;
    /**
     * Get the active transfer/status for a proof (owner, collection admin, or the
     * named recipient). Returns `{ transfer: null }` when nothing is in flight.
     */
    function getTransfer(collectionId: string, productId: string, proofId: string): Promise<{
        transfer: ProofTransfer | null;
    }>;
}
