import { request, post, put, del } from "../http.js";
import { listQuery } from "../list.js";
/**
 * @deprecated Legacy Firestore-backed attestation API.
 *
 * These endpoints store attestation data against a specific proof in Firestore
 * (`/product/:productId/proof/:proofId/attestations`). They remain active for
 * backward-compatibility but **should not be used in new integrations**.
 *
 * Use the new `attestations` namespace instead, which provides:
 * - Polymorphic subjects (container, proof, product, tag, …)
 * - Three data-visibility zones (public / owner / admin)
 * - Cryptographic hash-chain integrity
 * - Time-series summary and tree-rollup queries
 *
 * @see {@link attestations} for the replacement API
 */
export var attestation;
(function (attestation) {
    /**
     * List the attestations for a proof: `{ items, nextCursor, count }`, 50 at a time unless you give a
     * `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that
     * was the last one.
     * @deprecated Use `attestations.list()` with `subjectType='proof'` instead.
     *
     * @example
     * ```typescript
     * let page = await attestation.list('coll_123', 'prod_abc', 'proof_1', { limit: 100 })
     * while (page.nextCursor) page = await attestation.list('coll_123', 'prod_abc', 'proof_1', { limit: 100, cursor: page.nextCursor })
     * ```
     */
    async function list(collectionId, productId, proofId, options = {}) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation${listQuery({ limit: options.limit, cursor: options.cursor })}`;
        return request(path);
    }
    attestation.list = list;
    /**
     * Get a single attestation by ID.
     * @deprecated Use `attestations.list()` with `subjectType='proof'` and filter by ID instead.
     */
    async function get(collectionId, productId, proofId, attestationId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`;
        return request(path);
    }
    attestation.get = get;
    /**
     * Create a new attestation for a proof.
     * @deprecated Use `attestations.create()` with `subjectType='proof'` instead.
     */
    async function create(collectionId, productId, proofId, data) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation`;
        return post(path, data);
    }
    attestation.create = create;
    /**
     * Update an attestation.
     * @deprecated The new attestation system is append-only. Append a corrective record
     * via `attestations.create()` with a note in `metadata` instead.
     */
    async function update(collectionId, productId, proofId, attestationId, data) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`;
        return put(path, data);
    }
    attestation.update = update;
    /**
     * Delete an attestation.
     * @deprecated The new attestation system is append-only; deletions are not supported.
     * Use `attestations.create()` to append a corrective/superseding record instead.
     */
    async function remove(collectionId, productId, proofId, attestationId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`;
        return del(path);
    }
    attestation.remove = remove;
})(attestation || (attestation = {}));
