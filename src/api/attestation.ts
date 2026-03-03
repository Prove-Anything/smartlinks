import { request, post, put, del } from "../http"
import type { AttestationResponse, AttestationCreateRequest, AttestationUpdateRequest } from "../types/attestation"

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
export namespace attestation {
  /**
   * List all attestations for a proof.
   * @deprecated Use `attestations.list()` with `subjectType='proof'` instead.
   */
  export async function list(
    collectionId: string,
    productId: string,
    proofId: string
  ): Promise<AttestationResponse[]> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation`
    return request<AttestationResponse[]>(path)
  }

  /**
   * Get a single attestation by ID.
   * @deprecated Use `attestations.list()` with `subjectType='proof'` and filter by ID instead.
   */
  export async function get(
    collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string
  ): Promise<AttestationResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`
    return request<AttestationResponse>(path)
  }

  /**
   * Create a new attestation for a proof.
   * @deprecated Use `attestations.create()` with `subjectType='proof'` instead.
   */
  export async function create(
    collectionId: string,
    productId: string,
    proofId: string,
    data: AttestationCreateRequest
  ): Promise<AttestationResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation`
    return post<AttestationResponse>(path, data)
  }

  /**
   * Update an attestation.
   * @deprecated The new attestation system is append-only. Append a corrective record
   * via `attestations.create()` with a note in `metadata` instead.
   */
  export async function update(
    collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string,
    data: AttestationUpdateRequest
  ): Promise<AttestationResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`
    return put<AttestationResponse>(path, data)
  }

  /**
   * Delete an attestation.
   * @deprecated The new attestation system is append-only; deletions are not supported.
   * Use `attestations.create()` to append a corrective/superseding record instead.
   */
  export async function remove(
    collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string
  ): Promise<void> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation/${encodeURIComponent(attestationId)}`
    return del<void>(path)
  }
}
