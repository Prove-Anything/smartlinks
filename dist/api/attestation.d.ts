import type { AttestationResponse, AttestationCreateRequest, AttestationUpdateRequest } from "../types/attestation";
export declare namespace attestation {
    /**
     * Get all attestations for a proof.
     */
    function getAll(collectionId: string, productId: string, proofId: string): Promise<AttestationResponse[]>;
    /**
     * Get a single attestation by ID.
     */
    function get(collectionId: string, productId: string, proofId: string, attestationId: string): Promise<AttestationResponse>;
    /**
     * Create a new attestation for a proof.
     */
    function create(collectionId: string, productId: string, proofId: string, data: AttestationCreateRequest): Promise<AttestationResponse>;
    /**
     * Update an attestation.
     */
    function update(collectionId: string, productId: string, proofId: string, attestationId: string, data: AttestationUpdateRequest): Promise<AttestationResponse>;
    /**
     * Delete an attestation.
     */
    function remove(collectionId: string, productId: string, proofId: string, attestationId: string): Promise<void>;
}
