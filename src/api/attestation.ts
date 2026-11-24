import { request, post, put, del } from "../http"
import type { AttestationResponse, AttestationCreateRequest, AttestationUpdateRequest } from "../types/attestation"
import type { ListResult, ListOptions } from "../types/list"
import { listQuery } from "../list"

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
  export async function list(
    collectionId: string,
    productId: string,
    proofId: string,
    options: ListOptions = {}
  ): Promise<ListResult<AttestationResponse>> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/proof/${encodeURIComponent(proofId)}/attestation${listQuery({ limit: options.limit, cursor: options.cursor })}`
    return request<ListResult<AttestationResponse>>(path)
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
