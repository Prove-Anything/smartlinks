// src/api/tags.ts
import { request, post, put, del } from "../http.js";
import { listQuery } from "../list.js";
/**
 * Tag Management API
 *
 * Manages mappings between physical tag identifiers (NFC UIDs, QR codes, barcodes,
 * etc.) and products, proofs, or any polymorphic object in the platform.
 *
 * ### Two-tier architecture
 * - **Per-org shard** (`tags` table) — full tag data; used for all collection-scoped
 *   queries.
 * - **Shared shard** (`tag_index` table) — `tagId → collectionId` routing only; used
 *   when the collection is not yet known.
 *
 * 99% of callers will know the collection and should use collection-scoped endpoints
 * directly.  Use `resolveTag` only when you have a raw `tagId` and no collection context.
 */
export var tags;
(function (tags) {
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
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags`;
        return post(path, data);
    }
    tags.create = create;
    /**
     * Batch-create tags (admin).
     *
     * Tags with `productId` but no `proofId` automatically get serial numbers.
     * Serial number generation is grouped by `(productId, variantId, batchId)` for
     * efficiency.  Partial success is possible — check `results` for individual outcomes.
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
    async function createBatch(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/batch`;
        return post(path, data);
    }
    tags.createBatch = createBatch;
    /**
     * Get a single tag by `tagId` (admin).
     *
     * @param collectionId - Collection context
     * @param tagId - Physical tag identifier
     * @returns Full `Tag` record
     */
    async function get(collectionId, tagId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}`;
        return request(path);
    }
    tags.get = get;
    /**
     * Update a tag (admin).
     *
     * Partial update — only provided fields are changed.  `metadata` is
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
    async function update(collectionId, tagId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}`;
        return put(path, data);
    }
    tags.update = update;
    /**
     * Delete a tag (admin).
     *
     * Permanently removes the tag from the per-org shard and the shared index.
     *
     * @param collectionId - Collection context
     * @param tagId - Physical tag identifier
     * @returns `{ success: true }`
     */
    async function remove(collectionId, tagId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}`;
        return del(path);
    }
    tags.remove = remove;
    /**
     * List tags with optional filters, a page at a time (admin).
     *
     * @param collectionId - Collection context
     * @param params - Optional filters, plus `limit` and `cursor`
     * @returns `{ items: Tag[], nextCursor: string | null }`
     *
     * @example
     * ```typescript
     * // Tags for a product, page by page
     * let page = await tags.list('coll_123', { productId: 'prod_456', limit: 100 })
     * while (page.nextCursor) {
     *   page = await tags.list('coll_123', { productId: 'prod_456', limit: 100, cursor: page.nextCursor })
     * }
     *
     * // Tags linked to a container
     * const { items: linked } = await tags.list('coll_123', {
     *   refType: 'container',
     *   refId:   'container-uuid',
     * })
     * ```
     */
    async function list(collectionId, params) {
        const qs = listQuery({
            limit: (params === null || params === void 0 ? void 0 : params.limit) || undefined,
            cursor: params === null || params === void 0 ? void 0 : params.cursor,
            productId: params === null || params === void 0 ? void 0 : params.productId,
            variantId: params === null || params === void 0 ? void 0 : params.variantId,
            batchId: params === null || params === void 0 ? void 0 : params.batchId,
            refType: params === null || params === void 0 ? void 0 : params.refType,
            refId: params === null || params === void 0 ? void 0 : params.refId,
        });
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags${qs}`;
        return request(path);
    }
    tags.list = list;
    /**
     * Reverse lookup — find all tags linked to a given object (admin).
     *
     * Uses a compound index on `(orgId, refType, refId)` on the per-org shard.
     * No embed support on the admin side.
     *
     * @param collectionId - Collection context
     * @param params - `refType` and `refId` are required; plus `limit` (default 50) and `cursor`
     * @returns `{ items: Tag[], nextCursor: string | null }`: the linked tags, a page at a time
     *
     * @example
     * ```typescript
     * let page = await tags.byRef('coll_123', { refType: 'container', refId: 'container-uuid', limit: 50 })
     * while (page.nextCursor) {
     *   page = await tags.byRef('coll_123', { refType: 'container', refId: 'container-uuid', limit: 50, cursor: page.nextCursor })
     * }
     * ```
     */
    async function byRef(collectionId, params) {
        const qs = listQuery({ refType: params.refType, refId: params.refId, limit: params.limit, cursor: params.cursor });
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/tags/by-ref${qs}`;
        return request(path);
    }
    tags.byRef = byRef;
    // ============================================================================
    // Public Endpoints — global resolve (collection unknown)
    // ============================================================================
    /**
     * Global tag resolve — returns `{ tagId, collectionId }` only.
     *
     * Use this **only** when you have a raw `tagId` and do not yet know which
     * collection it belongs to.  Queries the shared `tag_index` shard.
     * Once `collectionId` is resolved, call `publicGetByCollection` for full data.
     *
     * > The global `/public/tags/by-ref` endpoint has been removed.
     * > Use the collection-scoped `publicByRef` instead.
     *
     * @param tagId - Physical tag identifier
     * @returns `{ tagId, collectionId }` — routing info only, no full tag data
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
    async function resolveTag(tagId) {
        const path = `/public/tags/${encodeURIComponent(tagId)}`;
        return request(path);
    }
    tags.resolveTag = resolveTag;
    // ============================================================================
    // Public Endpoints — collection-scoped
    // ============================================================================
    /**
     * Single tag lookup with optional embedded data (public).
     *
     * `GET /public/collection/:collectionId/tags/:tagId?embed=product,proof,container,ref`
     *
     * Supported `embed` values: `'product'`, `'proof'`, `'container'`, `'ref'`
     * (`'collection'` is not supported — the collection is already known from the URL).
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
    async function publicGetByCollection(collectionId, tagId, embed) {
        const q = new URLSearchParams();
        if (embed)
            q.append('embed', embed);
        const qs = q.toString();
        const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/${encodeURIComponent(tagId)}${qs ? `?${qs}` : ''}`;
        return request(path);
    }
    tags.publicGetByCollection = publicGetByCollection;
    /**
     * Batch tag lookup via POST (public).
     *
     * `POST /public/collection/:collectionId/tags/lookup`
     *
     * Tags not belonging to this collection are filtered out silently.
     * Returns deduplicated embedded objects alongside the tag array.
     *
     * @param collectionId - Collection context
     * @param data - `{ tagIds: string[], embed?: string }`, plus `limit` (default 50) and `cursor`
     * @returns `{ items: Tag[], nextCursor: string | null, count: number, embedded: TagEmbedded }`:
     *   the tags found, a page at a time
     *
     * @example
     * ```typescript
     * const tagIds = ['NFC-001', 'NFC-002', 'NFC-003']
     * // Every tag found comes back in the one answer: a look-up is never paged.
     * const { items, embedded } = await tags.lookupTags('coll_123', { tagIds, embed: 'product,proof' })
     * ```
     */
    async function lookupTags(collectionId, data) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/lookup`;
        return post(path, data);
    }
    tags.lookupTags = lookupTags;
    /**
     * Batch tag lookup via GET (public).
     *
     * `GET /public/collection/:collectionId/tags/lookup?tagIds=NFC-001,NFC-002&embed=product`
     *
     * @param collectionId - Collection context
     * @param params - `tagIds` is comma-separated; `embed` is optional; plus `limit` (default 50) and `cursor`
     * @returns `{ items: Tag[], nextCursor: string | null, count: number, embedded: TagEmbedded }`:
     *   the tags found, a page at a time
     *
     * @example
     * ```typescript
     * const { items, embedded } = await tags.lookupTagsQuery('coll_123', {
     *   tagIds: 'NFC-001,NFC-002',
     *   embed:  'product',
     * })
     * ```
     */
    async function lookupTagsQuery(collectionId, params) {
        const qs = listQuery({ tagIds: String(params.tagIds), embed: params.embed });
        const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/lookup${qs}`;
        return request(path);
    }
    tags.lookupTagsQuery = lookupTagsQuery;
    /**
     * Reverse lookup by ref via GET (public).
     *
     * `GET /public/collection/:collectionId/tags/by-ref?refType=container&refId=<uuid>&embed=ref`
     *
     * @param collectionId - Collection context
     * @param params - `refType` and `refId` are required; `embed` is optional; plus `limit` (default 50) and `cursor`
     * @returns `{ items: Tag[], nextCursor: string | null, embedded: TagEmbedded }`: the linked tags, a page at a time
     *
     * @example
     * ```typescript
     * const { items: linked, embedded, nextCursor } = await tags.publicByRef('coll_123', {
     *   refType: 'container',
     *   refId:   'container-uuid',
     *   embed:   'container',
     *   limit:   50,
     * })
     * const container = embedded.containers?.[containerId]
     * ```
     */
    async function publicByRef(collectionId, params) {
        const qs = listQuery({ refType: params.refType, refId: params.refId, embed: params.embed, limit: params.limit, cursor: params.cursor });
        const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/by-ref${qs}`;
        return request(path);
    }
    tags.publicByRef = publicByRef;
    /**
     * Reverse lookup by ref via POST (public).
     *
     * `POST /public/collection/:collectionId/tags/by-ref`
     *
     * @param collectionId - Collection context
     * @param data - `{ refType, refId, embed? }`, plus `limit` (default 50) and `cursor`
     * @returns `{ items: Tag[], nextCursor: string | null, embedded: TagEmbedded }`: the linked tags, a page at a time
     *
     * @example
     * ```typescript
     * const { items: linked, embedded, nextCursor } = await tags.publicByRefPost('coll_123', {
     *   refType: 'container',
     *   refId:   'container-uuid',
     *   embed:   'container',
     *   limit:   50,
     * })
     * ```
     */
    async function publicByRefPost(collectionId, data) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/tags/by-ref`;
        return post(path, data);
    }
    tags.publicByRefPost = publicByRefPost;
})(tags || (tags = {}));
