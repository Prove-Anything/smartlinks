export interface AttestationResponse {
  /** Attestation id */
  id: string
  /** Creation timestamp */
  createdAt: string
  /** Last updated timestamp */
  updatedAt: string
  /** Public attestation data */
  public: Record<string, any>
  /** Private attestation data */
  private: Record<string, any>
  /** Associated proof reference/data */
  proof: Record<string, any>
}

export interface AttestationCreateRequest {
  /** Public attestation payload */
  public: Record<string, any>
  /** Private attestation payload */
  private: Record<string, any>
  /** Proof linkage or payload */
  proof: Record<string, any>
}

export interface AttestationUpdateRequest {
  /** Update operation/type */
  type?: string
  /** Partial attestation data */
  data?: Record<string, any>
}
