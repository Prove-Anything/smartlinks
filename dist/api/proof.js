// src/api/proof.ts
import { request } from "../http";
export var proof;
(function (proof) {
    /**
     * Retrieves a single Proof by Collection ID and Proof ID.
     * @param collectionId – Identifier of the parent collection
     * @param proofId      – Identifier of the proof
     * @returns Promise resolving to a ProofResponse object
     * @throws ErrorResponse if the request fails
     */
    async function get(collectionId, proofId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/proof/${encodeURIComponent(proofId)}`;
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
})(proof || (proof = {}));
