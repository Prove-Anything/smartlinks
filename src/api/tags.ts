// src/api/tags.ts
import { request, post, put, del } from "../http"
import type {
  Tag,
  TagIndexEntry,
  CreateTagRequest,
  CreateTagResponse,
  BatchCreateTagRequest,
  BatchCreateResult,
  UpdateTagRequest,
  UpdateTagResponse,
  DeleteTagResponse,
  GetTagResponse,
  ListTagsRequest,
  ListTagsResponse,
  LookupTagsRequest,
  LookupTagsQueryRequest,
  TagLookupResponse,
  PublicGetTagResponse,
  ByRefRequest,
  ByRefResponse,
  ReverseTagLookupParams,
  ReverseTagLookupResponse,
} from "../types/tags"

/**
 * Tag Management API
 *
 * Manages mappings between physical tag identifiers (NFC UIDs, QR codes, barcodes,
 * etc.) and products, proofs, or any polymorphic object in the platform.
 *
 * ### Two-tier architecture
 * - **Per-org shard** (`tags` table) â€” full tag data; used for all collection-scoped
 *   queries.
 * - **Shared shard** (`tag_index` table) â€” `tagId â†’ collectionId` routing only; used
 *   when the collection is not yet known.
 *
 * 99% of callers will know the collection and should use collection-scoped endpoints
 * directly.  Use `resolveTag` only when you have a raw `tagId` and no collection context.
 */
export namespace tags {

  // ============================================================================
  // Admin Endpoints
  // ============================================================================

  /**
   * Create a single tag mapping (admin).
   *
   * If `productId` is set without `proofId`, a serial number is auto-generated
   * unless `useSerialNumber: true` is explicitly passed.
   * `refType` and `refId` can be set independently of or alongside product/proof.
   *
   * @param collectionId - Collection context
   * @param data - Tag creation payload; `tagId` is required
   * @returns The created tag (`wasUpdated: true` when `force=true` triggered an update)
   *
   * @example
   * ```typescript
   * // Auto-generate serial number
   * const tag = await tags.create('coll_123', {
   *   tagId:     'NFC-001',
   *   productId: 'prod_456',
   *   batchId:   'batch_2026_01',
   * })
   *
   * // Explicit proof + polymorphic ref
   * const tag2 = await tags.create('coll_123', {
   *   tagId:   'NFC-002',
   *   refType: 'container',
   *   refId:   'container-uuid',
   * })
   * ```
   */
  export async function create(
    collectionId: string,
    data: CreateTagRequest
  ): Promise<CreateTagResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags`
    return post<CreateTagResponse>(path, data)
  }

  /**
   * Batch-create tags (admin).
   *
   * Tags with `productId` but no `proofId` automatically get serial numbers.
   * Serial number generation is grouped by `(productId, variantId, batchId)` for
   * efficiency.  Partial success is possible â€” check `results` for individual outcomes.
   *
   * @param collectionId - Collection context
   * @param data - Batch payload; `force` applies to all tags in the batch
   * @returns `BatchCreateResult` with summary and per-tag outcomes
   *
   * @example
   * ```typescript
   * const result = await tags.createBatch('coll_123', {
   *   tags: [
   *     { tagId: 'NFC-001', productId: 'prod_456', batchId: 'batch_2026_01' },
   *     { tagId: 'NFC-002', productId: 'prod_456', batchId: 'batch_2026_01' },
   *   ],
   * })
   * console.log(`Created: ${result.summary.created}, Conflicts: ${result.summary.conflicts}`)
   * ```
   */
  export async function createBatch(
    collectionId: string,
    data: BatchCreateTagRequest
  ): Promise<BatchCreateResult> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/batch`
    return post<BatchCreateResult>(path, data)
  }

  /**
   * Get a single tag by `tagId` (admin).
   *
   * @param collectionId - Collection context
   * @param tagId - Physical tag identifier
   * @returns Full `Tag` record
   */
  export async function get(
    collectionId: string,
    tagId: string
  ): Promise<GetTagResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}`
    return request<GetTagResponse>(path)
  }

  /**
   * Update a tag (admin).
   *
   * Partial update â€” only provided fields are changed.  `metadata` is
   * deep-merged with the existing value.  Pass `refType: null, refId: null`
   * to clear the polymorphic ref.
   *
   * @param collectionId - Collection context
   * @param tagId - Physical tag identifier
   * @param data - Fields to update
   * @returns Updated `Tag`
   *
   * @example
   * ```typescript
   * const updated = await tags.update('coll_123', 'NFC-001', {
   *   variantId: 'var_premium',
   *   metadata:  { notes: 'Updated to premium variant' },
   * })
   *
   * // Clear polymorphic ref
   * await tags.update('coll_123', 'NFC-001', { refType: null, refId: null })
   * ```
   */
  export async function update(
    collectionId: string,
    tagId: string,
    data: UpdateTagRequest
  ): Promise<UpdateTagResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}`
    return put<UpdateTagResponse>(path, data)
  }

  /**
   * Delete a tag (admin).
   *
   * Permanently removes the tag from the per-org shard and the shared index.
   *
   * @param collectionId - Collection context
   * @param tagId - Physical tag identifier
   * @returns `{ success: true }`
   */
  export async function remove(
    collectionId: string,
    tagId: string
  ): Promise<DeleteTagResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}`
    return del<DeleteTagResponse>(path)
  }

  /**
   * List tags with optional filters and pagination (admin).
   *
   * @param collectionId - Collection context
   * @param params - Optional filter and pagination params
   * @returns `{ tags: Tag[], limit: number, offset: number }`
   *
   * @example
   * ```typescript
   * // All tags for a product
   * const { tags: list } = await tags.list('coll_123', { productId: 'prod_456' })
   *
   * // All tags linked to a container
   * const { tags: linked } = await tags.list('coll_123', {
   *   refType: 'container',
   *   refId:   'container-uuid',
   * })
   * ```
   */
  export async function list(
    collectionId: string,
    params?: ListTagsRequest
  ): Promise<ListTagsResponse> {
    const q = new URLSearchParams()
    if (params?.limit)     q.append('limit', params.limit.toString())
    if (params?.offset)    q.append('offset', params.offset.toString())
    if (params?.productId) q.append('productId', params.productId)
    if (params?.variantId) q.append('variantId', params.variantId)
    if (params?.batchId)   q.append('batchId', params.batchId)
    if (params?.refType)   q.append('refType', params.refType)
    if (params?.refId)     q.append('refId', params.refId)

    const qs = q.toString()
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags${qs ? `?${qs}` : ''}`
    return request<ListTagsResponse>(path)
  }

  /**
   * Reverse lookup â€” find all tags linked to a given object (admin).
   *
   * Uses a compound index on `(orgId, refType, refId)` on the per-org shard.
   * No embed support on the admin side.
   *
   * @param collectionId - Collection context
   * @param params - `refType` and `refId` are required
   * @returns `{ tags: Tag[] }`
   *
   * @example
   * ```typescript
   * const { tags: linked } = await tags.byRef('coll_123', {
   *   refType: 'container',
   *   refId:   'container-uuid',
   * })
   * ```
   */
  export async function byRef(
    collectionId: string,
    params: ReverseTagLookupParams
  ): Promise<ReverseTagLookupResponse> {
    const q = new URLSearchParams()
    q.append('refType', params.refType)
    q.append('refId', params.refId)
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/by-ref?${q.toString()}`
    return request<ReverseTagLookupResponse>(path)
  }

  // ============================================================================
  // Public Endpoints â€” global resolve (collection unknown)
  // ============================================================================

  /**
   * Global tag resolve â€” returns `{ tagId, collectionId }` only.
   *
   * Use this **only** when you have a raw `tagId` and do not yet know which
   * collection it belongs to.  Queries the shared `tag_index` shard.
   * Once `collectionId` is resolved, call `publicGetByCollection` for full data.
   *
   * > The global `/public/tags/by-ref` endpoint has been removed.
   * > Use the collection-scoped `publicByRef` instead.
   *
   * @param tagId - Physical tag identifier
   * @returns `{ tagId, collectionId }` â€” routing info only, no full tag data
   *
   * @example
   * ```typescript
   * // Step 1: resolve collection
   * const { collectionId } = await tags.resolveTag('NFC-001')
   *
   * // Step 2: full lookup with embedded data
   * const { tag, embedded } = await tags.publicGetByCollection(
   *   collectionId, 'NFC-001', 'product,proof'
   * )
   * ```
   */
  export async function resolveTag(tagId: string): Promise<TagIndexEntry> {
    const path = `/public/tags/${encodeURIComponent(tagId)}`
    return request<TagIndexEntry>(path)
  }

  // ============================================================================
  // Public Endpoints â€” collection-scoped
  // ============================================================================

  /**
   * Single tag lookup with optional embedded data (public).
   *
   * `GET /public/collection/:collectionId/tags/:tagId?embed=product,proof,container,ref`
   *
   * Supported `embed` values: `'product'`, `'proof'`, `'container'`, `'ref'`
   * (`'collection'` is not supported â€” the collection is already known from the URL).
   *
   * @param collectionId - Collection context
   * @param tagId - Physical tag identifier
   * @param embed - Optional comma-separated embed string
   * @returns `{ tag: Tag, embedded: TagEmbedded }`
   *
   * @example
   * ```typescript
   * const { tag, embedded } = await tags.publicGetByCollection(
   *   'coll_123', 'NFC-001', 'product,proof'
   * )
   * const product = embedded.products?.[tag.productId!]
   * const proof   = embedded.proofs?.[tag.proofId!]
   * ```
   */
  export async function publicGetByCollection(
    collectionId: string,
    tagId: string,
    embed?: string
  ): Promise<PublicGetTagResponse> {
    const q = new URLSearchParams()
    if (embed) q.append('embed', embed)
    const qs = q.toString()
    const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}${qs ? `?${qs}` : ''}`
    return request<PublicGetTagResponse>(path)
  }

  /**
   * Batch tag lookup via POST (public).
   *
   * `POST /public/collection/:collectionId/tags/lookup`
   *
   * Tags not belonging to this collection are filtered out silently.
   * Returns deduplicated embedded objects alongside the tag array.
   *
   * @param collectionId - Collection context
   * @param data - `{ tagIds: string[], embed?: string }`
   * @returns `{ count: number, tags: Tag[], embedded: TagEmbedded }`
   *
   * @example
   * ```typescript
   * const { count, tags: list, embedded } = await tags.lookupTags('coll_123', {
   *   tagIds: ['NFC-001', 'NFC-002', 'NFC-003'],
   *   embed:  'product,proof',
   * })
   * ```
   */
  export async function lookupTags(
    collectionId: string,
    data: LookupTagsRequest
  ): Promise<TagLookupResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/lookup`
    return post<TagLookupResponse>(path, data)
  }

  /**
   * Batch tag lookup via GET (public).
   *
   * `GET /public/collection/:collectionId/tags/lookup?tagIds=NFC-001,NFC-002&embed=product`
   *
   * @param collectionId - Collection context
   * @param params - `tagIds` is comma-separated; `embed` is optional
   * @returns `{ count: number, tags: Tag[], embedded: TagEmbedded }`
   */
  export async function lookupTagsQuery(
    collectionId: string,
    params: LookupTagsQueryRequest
  ): Promise<TagLookupResponse> {
    const q = new URLSearchParams()
    q.append('tagIds', params.tagIds)
    if (params.embed) q.append('embed', params.embed)
    const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/lookup?${q.toString()}`
    return request<TagLookupResponse>(path)
  }

  /**
   * Reverse lookup by ref via GET (public).
   *
   * `GET /public/collection/:collectionId/tags/by-ref?refType=container&refId=<uuid>&embed=ref`
   *
   * @param collectionId - Collection context
   * @param params - `refType` and `refId` are required; `embed` is optional
   * @returns `{ tags: Tag[], embedded: TagEmbedded }`
   *
   * @example
   * ```typescript
   * const { tags: linked, embedded } = await tags.publicByRef('coll_123', {
   *   refType: 'container',
   *   refId:   'container-uuid',
   *   embed:   'container',
   * })
   * const container = embedded.containers?.[containerId]
   * ```
   */
  export async function publicByRef(
    collectionId: string,
    params: ReverseTagLookupParams
  ): Promise<ByRefResponse> {
    const q = new URLSearchParams()
    q.append('refType', params.refType)
    q.append('refId', params.refId)
    if (params.embed) q.append('embed', params.embed)
    const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/by-ref?${q.toString()}`
    return request<ByRefResponse>(path)
  }

  /**
   * Reverse lookup by ref via POST (public).
   *
   * `POST /public/collection/:collectionId/tags/by-ref`
   *
   * @param collectionId - Collection context
   * @param data - `{ refType, refId, embed? }`
   * @returns `{ tags: Tag[], embedded: TagEmbedded }`
   */
  export async function publicByRefPost(
    collectionId: string,
    data: ByRefRequest
  ): Promise<ByRefResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/by-ref`
    return post<ByRefResponse>(path, data)
  }
}
