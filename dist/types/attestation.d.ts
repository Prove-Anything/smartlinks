/**
 * @deprecated Legacy Firestore-backed attestation response.
 * Use {@link Attestation} from `attestations.ts` for new integrations.
 */
export interface AttestationResponse {
    /** Attestation id */
    id: string;
    /** Creation timestamp */
    createdAt: string;
    /** Last updated timestamp */
    updatedAt: string;
    /** Public attestation data */
    public: Record<string, any>;
    /** Private attestation data */
    private: Record<string, any>;
    /** Associated proof reference/data */
    proof: Record<string, any>;
}
/**
 * @deprecated Legacy Firestore attestation create request.
 * Use {@link CreateAttestationInput} from `attestations.ts` for new integrations.
 */
export interface AttestationCreateRequest {
    /** Public attestation payload */
    public: Record<string, any>;
    /** Private attestation payload */
    private: Record<string, any>;
    /** Proof linkage or payload */
    proof: Record<string, any>;
}
/**
 * @deprecated The new attestation system is append-only; updates are not supported.
 * Append a corrective record via {@link CreateAttestationInput} instead.
 */
export interface AttestationUpdateRequest {
    /** Update operation/type */
    type?: string;
    /** Partial attestation data */
    data?: Record<string, any>;
}
