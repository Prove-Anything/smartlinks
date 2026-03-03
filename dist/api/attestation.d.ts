import type { AttestationResponse, AttestationCreateRequest, AttestationUpdateRequest } from "../types/attestation";
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
export declare namespace attestation {
    /**
     * List all attestations for a proof.
     * @deprecated Use `attestations.list()` with `subjectType='proof'` instead.
     */
    function list(collectionId: string, productId: string, proofId: string): Promise<AttestationResponse[]>;
    /**
     * Get a single attestation by ID.
     * @deprecated Use `attestations.list()` with `subjectType='proof'` and filter by ID instead.
     */
    function get(collectionId: string, productId: string, proofId: string, attestationId: string): Promise<AttestationResponse>;
    /**
     * Create a new attestation for a proof.
     * @deprecated Use `attestations.create()` with `subjectType='proof'` instead.
     */
    function create(collectionId: string, productId: string, proofId: string, data: AttestationCreateRequest): Promise<AttestationResponse>;
    /**
     * Update an attestation.
     * @deprecated The new attestation system is append-only. Append a corrective record
     * via `attestations.create()` with a note in `metadata` instead.
     */
    function update(collectionId: string, productId: string, proofId: string, attestationId: string, data: AttestationUpdateRequest): Promise<AttestationResponse>;
    /**
     * Delete an attestation.
     * @deprecated The new attestation system is append-only; deletions are not supported.
     * Use `attestations.create()` to append a corrective/superseding record instead.
     */
    function remove(collectionId: string, productId: string, proofId: string, attestationId: string): Promise<void>;
}
