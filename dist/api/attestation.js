import { request, post, put, del } from "../http";
export var attestation;
(function (attestation) {
    /**
     * Get all attestations for a proof.
     */
    async function getAll(collectionId, productId, proofId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation`;
        return request(path);
    }
    attestation.getAll = getAll;
    /**
     * Get a single attestation by ID.
     */
    async function get(collectionId, productId, proofId, attestationId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`;
        return request(path);
    }
    attestation.get = get;
    /**
     * Create a new attestation for a proof.
     */
    async function create(collectionId, productId, proofId, data) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation`;
        return post(path, data);
    }
    attestation.create = create;
    /**
     * Update an attestation.
     */
    async function update(collectionId, productId, proofId, attestationId, data) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`;
        return put(path, data);
    }
    attestation.update = update;
    /**
     * Delete an attestation.
     */
    async function remove(collectionId, productId, proofId, attestationId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`;
        return del(path);
    }
    attestation.remove = remove;
})(attestation || (attestation = {}));
