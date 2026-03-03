import { request, post, put, del } from "../http";
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
     * List all attestations for a proof.
     * @deprecated Use `attestations.list()` with `subjectType='proof'` instead.
     */
    async function list(collectionId, productId, proofId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation`;
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
