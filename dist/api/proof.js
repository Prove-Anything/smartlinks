// src/api/proof.ts
import { request, post, put, del } from "../http.js";
import { listQuery } from "../list.js";
export var proof;
(function (proof) {
    /**
     * The standard query on proofs (admin only): filter, sort, page, count and total a collection's proofs
     * in one call, and follow a proof to its `product` and its `owner` (the owner's contact).
     * POST /admin/collection/:collectionId/proof/query
     *
     * Fields: id, productId, userId (the owner's login id), batchId, variantId, lotId, status, claimable,
     * createdAt, updatedAt. A proof's own values are not returned by this call.
     *
     * ```typescript
     * // How many people own each product
     * await proof.query(collectionId, {
     *   where: { userId: { isNull: false } },
     *   groupBy: ['productId'],
     *   aggregates: { owners: { countDistinct: 'userId' } },
     * })
     * // The most recent owner of a product, with their name
     * await proof.query(collectionId, {
     *   where: { productId: 'toaster', userId: { isNull: false } },
     *   orderBy: [{ createdAt: 'desc' }], limit: 1,
     *   expand: { owner: ['firstName', 'lastName', 'email'] },
     * })
     * ```
     */
    async function query(collectionId, body = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/proof/query`;
        return post(path, body);
    }
    proof.query = query;
    /**
     * What a proofs query can use: its fields, what each can filter, sort, group or total, and its links.
     * GET /admin/collection/:collectionId/proof/query
     */
    async function queryFields(collectionId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/proof/query`;
        return request(path);
    }
    proof.queryFields = queryFields;
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
     * List all Proofs for a Collection, a page at a time.
     * GET /public/collection/:collectionId/proof
     *
     * @param collectionId - Identifier of the collection
     * @param options - `limit` (default 50) and `cursor`; `expand: ['product']` brings each proof's product along
     *
     * @example
     * ```typescript
     * let page = await proof.list(collectionId, { limit: 50, expand: ['product'] })
     * while (page.nextCursor) {
     *   page = await proof.list(collectionId, { limit: 50, expand: ['product'], cursor: page.nextCursor })
     * }
     * ```
     */
    async function list(collectionId, options = {}) {
        const qp = listQuery({ limit: options.limit, cursor: options.cursor, expand: options.expand });
        const path = `/public/collection/${encodeURIComponent(collectionId)}/proof${qp}`;
        return request(path);
    }
    proof.list = list;
    // -------------------- Admin functions (legacy parity) --------------------
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
    async function create(collectionId, productId, request) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof`;
        return post(path, request);
    }
    proof.create = create;
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
    async function update(collectionId, productId, proofId, values) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}`;
        return put(path, values);
    }
    proof.update = update;
    /**
     * Owner self-service update of a proof's owner-writable data.
     * PUT /public/collection/:collectionId/product/:productId/proof/:proofId/values
     *
     * The public counterpart to admin `update` — the current OWNER (or a collection
     * admin) editing their own proof, no admin credentials required. Only owner-writable
     * zones are honoured (see {@link ProofValuesUpdateRequest}):
     * ```ts
     * proof.updateValues(collectionId, productId, proofId, {
     *   colour:   'blue',            // → proof.values.colour   (public)
     *   owner:    { warranty: '2y' }, // → proof.values.owner    (owner-scoped)
     *   personal: { nickname: 'Bo' }, // → proof.values.personal[callerUid] (private, own slot only)
     * })
     * ```
     * `personal` always targets the caller's OWN slot — you cannot write another
     * user's personal data, even as an admin. Object zones deep-merge (owner/personal
     * merge field-by-field), so you can change one field without wiping the rest.
     * Business-only zones (`data`/`admin`/`private`) are not writable here — use the
     * admin `update` for those.
     */
    async function updateValues(collectionId, productId, proofId, values) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/values`;
        return put(path, values);
    }
    proof.updateValues = updateValues;
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
     * Get proofs for a user in a collection (admin only), a page at a time.
     * GET /admin/collection/:collectionId/proof/findByUser/:userId
     *
     * @param options - `limit` (default 50) and `cursor`
     *
     * @example
     * ```typescript
     * let page = await proof.getByUser(collectionId, userId, { limit: 50 })
     * while (page.nextCursor) page = await proof.getByUser(collectionId, userId, { limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function getByUser(collectionId, userId, options = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/proof/findByUser/${encodeURIComponent(userId)}${listQuery({ limit: options.limit, cursor: options.cursor })}`;
        return request(path);
    }
    proof.getByUser = getByUser;
    /**
     * Get proofs for a product (admin only), a page at a time.
     * GET /admin/collection/:collectionId/product/:productId/proof
     *
     * @param options - `limit` (default 50) and `cursor`
     *
     * @example
     * ```typescript
     * let page = await proof.getByProduct(collectionId, productId, { limit: 50 })
     * while (page.nextCursor) page = await proof.getByProduct(collectionId, productId, { limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function getByProduct(collectionId, productId, options = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof${listQuery({ limit: options.limit, cursor: options.cursor })}`;
        return request(path);
    }
    proof.getByProduct = getByProduct;
    /**
     * Find proofs for a product (admin only): the newest ones, `limit` at a time (default 100), or the
     * proofs matching `filterBy`. `expand: ['assets']` attaches each proof's assets. Pass `nextCursor` back
     * as `cursor` for the next page. For counting and sorting a collection's proofs use `proof.query`.
     * POST /admin/collection/:collectionId/product/:productId/proof/find
     *
     * @example
     * ```typescript
     * const { items, nextCursor } = await proof.findByProduct(collectionId, productId, { limit: 50, expand: ['assets'] })
     * const red = await proof.findByProduct(collectionId, productId, { filterBy: [{ field: 'values.colour', value: 'red' }] })
     * ```
     */
    async function findByProduct(collectionId, productId, query = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/find`;
        return post(path, query);
    }
    proof.findByProduct = findByProduct;
    /**
     * Get proofs for a batch (admin only), a page at a time.
     * GET /admin/collection/:collectionId/product/:productId/batch/:batchId/proof
     *
     * @param options - `limit` (default 50) and `cursor`
     *
     * @example
     * ```typescript
     * let page = await proof.getByBatch(collectionId, productId, batchId, { limit: 50 })
     * while (page.nextCursor) {
     *   page = await proof.getByBatch(collectionId, productId, batchId, { limit: 50, cursor: page.nextCursor })
     * }
     * ```
     */
    async function getByBatch(collectionId, productId, batchId, options = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/batch/${encodeURIComponent(batchId)}/proof${listQuery({ limit: options.limit, cursor: options.cursor })}`;
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
    // ---------------------------------------------------------------------------
    // Share grants — delegated, scoped, revocable bearer access to this proof
    // ---------------------------------------------------------------------------
    function grantBase(collectionId, productId, proofId) {
        return `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/grant`;
    }
    /**
     * Create a share grant on a proof (owner / collection admin only). The returned
     * grant includes `token` — the opaque bearer secret, available ONLY on this
     * response. Embed it in a share link and hand recipients {@link redeemGrant} /
     * {@link setGrantToken}.
     */
    async function createGrant(collectionId, productId, proofId, options) {
        const body = { scope: options.scope };
        if (options.audience)
            body.audience = options.audience;
        if (options.expiresAt)
            body.expiresAt = options.expiresAt instanceof Date ? options.expiresAt.toISOString() : options.expiresAt;
        // Only applied server-side when scope includes 'contribute'.
        if (options.moderate !== undefined)
            body.moderate = options.moderate;
        return post(grantBase(collectionId, productId, proofId), body);
    }
    proof.createGrant = createGrant;
    /**
     * List the active + past grants on a proof (owner / collection admin only), a page at a time.
     * Tokens are never returned here.
     *
     * @param options - `limit` (default 50) and `cursor`
     *
     * @example
     * ```typescript
     * const { items, nextCursor } = await proof.listGrants(collectionId, productId, proofId, { limit: 50 })
     * ```
     */
    async function listGrants(collectionId, productId, proofId, options = {}) {
        return request(`${grantBase(collectionId, productId, proofId)}${listQuery({ limit: options.limit, cursor: options.cursor })}`);
    }
    proof.listGrants = listGrants;
    /** Revoke a grant by id (owner / collection admin only). Takes effect immediately. */
    async function revokeGrant(collectionId, productId, proofId, grantId) {
        return del(`${grantBase(collectionId, productId, proofId)}/${encodeURIComponent(grantId)}`);
    }
    proof.revokeGrant = revokeGrant;
    /**
     * Redeem a grant token (anonymous or signed-in). Records the redemption and
     * returns the granted scope, or — for a `verify_owner` grant — an ownership
     * assertion (never the account). After redeeming, call
     * {@link setGrantToken} so subsequent data requests carry the token.
     */
    async function redeemGrant(collectionId, productId, proofId, token, options) {
        const body = { token };
        if (options === null || options === void 0 ? void 0 : options.guestName)
            body.guestName = options.guestName;
        return post(`${grantBase(collectionId, productId, proofId)}/redeem`, body);
    }
    proof.redeemGrant = redeemGrant;
    // ---------------------------------------------------------------------------
    // Ownership transfer — moving a proof's single owner from A to B
    //
    // A proof always has exactly one owner (`proof.userId`). A transfer moves that
    // owner with the current owner's consent: either DIRECTED to a named recipient
    // (who accepts) or an OPEN RELEASE (the proof becomes claimable by anyone).
    // Contested pull-claims + dispute resolution are a later addition.
    // ---------------------------------------------------------------------------
    function transferBase(collectionId, productId, proofId) {
        return `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/transfer`;
    }
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
     * Send comms by naming templates per role (server decides who receives each):
     * ```ts
     * await proof.transfer(collectionId, productId, proofId, {
     *   toEmail: 'buyer@example.com',
     *   comms: {
     *     recipient: { templateId: 'transfer-incoming', props: { note: 'Enjoy!' } },
     *     sender:    { templateId: 'transfer-sent' },
     *   },
     * })
     * ```
     * Direct to an SMS recipient by phone (E.164) and notify them by text:
     * ```ts
     * await proof.transfer(collectionId, productId, proofId, {
     *   toPhone: '+14155551234',
     *   comms: { recipient: { templateId: 'transfer-incoming', channel: 'sms' } },
     * })
     * ```
     */
    async function transfer(collectionId, productId, proofId, options) {
        return post(transferBase(collectionId, productId, proofId), Object.assign({}, options));
    }
    proof.transfer = transfer;
    /**
     * Accept a directed transfer (the named recipient only). Completes the ownership
     * move — the proof's `userId` becomes the caller and the previous owner's private
     * data and share grants are cleared/voided.
     */
    async function acceptTransfer(collectionId, productId, proofId, options = {}) {
        return post(`${transferBase(collectionId, productId, proofId)}/accept`, Object.assign({}, options));
    }
    proof.acceptTransfer = acceptTransfer;
    /** Cancel a pending push transfer (current owner / collection admin only). */
    async function cancelTransfer(collectionId, productId, proofId, options = {}) {
        return post(`${transferBase(collectionId, productId, proofId)}/cancel`, Object.assign({}, options));
    }
    proof.cancelTransfer = cancelTransfer;
    /**
     * Get the active transfer/status for a proof (owner, collection admin, or the
     * named recipient). Returns `{ transfer: null }` when nothing is in flight.
     */
    async function getTransfer(collectionId, productId, proofId) {
        return request(transferBase(collectionId, productId, proofId));
    }
    proof.getTransfer = getTransfer;
})(proof || (proof = {}));
