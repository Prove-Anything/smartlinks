// src/api/variant.ts
import { request, post, put, del } from "../http.js";
import { listQuery } from "../list.js";
export var variant;
(function (variant) {
    // Admin CRUD operations
    /**
     * Get a single variant by ID for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param variantId - Identifier of the variant
     * @returns Promise resolving to a VariantResponse object
     * @throws ErrorResponse if the request fails
     */
    async function get(collectionId, productId, variantId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/variant/${encodeURIComponent(variantId)}`;
        return request(path);
    }
    variant.get = get;
    /**
     * List the variants for a collection and product (admin only), 50 at a time unless you give a
     * `limit` (at most 1000). Pass `nextCursor` back as `cursor` for the next page; `null` means that
     * was the last one.
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param options - Paging: `limit` and `cursor`
     * @returns Promise resolving to `{ items: VariantResponse[], nextCursor, count }`
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * let page = await variant.list('coll_123', 'prod_456', { limit: 100 })
     * page.items.map((v) => v.name)
     * while (page.nextCursor) page = await variant.list('coll_123', 'prod_456', { limit: 100, cursor: page.nextCursor })
     * ```
     */
    async function list(collectionId, productId, options = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/variant${listQuery({ limit: options.limit, cursor: options.cursor })}`;
        return request(path);
    }
    variant.list = list;
    /**
     * Create a new variant for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param data - Variant creation data
     * @returns Promise resolving to a VariantResponse object
     * @throws ErrorResponse if the request fails
     */
    async function create(collectionId, productId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/variant`;
        return post(path, data);
    }
    variant.create = create;
    /**
     * Update a variant for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param variantId - Identifier of the variant
     * @param data - Variant update data
     * @returns Promise resolving to a VariantResponse object
     * @throws ErrorResponse if the request fails
     */
    async function update(collectionId, productId, variantId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/variant/${encodeURIComponent(variantId)}`;
        return put(path, data);
    }
    variant.update = update;
    /**
     * Delete a variant for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param variantId - Identifier of the variant
     * @returns Promise resolving to void
     * @throws ErrorResponse if the request fails
     */
    async function remove(collectionId, productId, variantId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/variant/${encodeURIComponent(variantId)}`;
        return del(path);
    }
    variant.remove = remove;
    // Public read-only operation
    /**
     * Get a single variant by ID for a collection and product (public endpoint).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param variantId - Identifier of the variant
     * @returns Promise resolving to a VariantResponse object
     * @throws ErrorResponse if the request fails
     */
    async function getPublic(collectionId, productId, variantId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/variant/${encodeURIComponent(variantId)}`;
        return request(path);
    }
    variant.getPublic = getPublic;
    /**
     * Get serial numbers for a variant (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param variantId - Identifier of the variant
     * @param startIndex - Starting index for pagination (default: 0)
     * @param count - Number of serial numbers to retrieve (default: 10)
     * @returns Promise resolving to serial number data
     * @throws ErrorResponse if the request fails
     */
    async function getSN(collectionId, productId, variantId, startIndex = 0, count = 10) {
        const queryParams = new URLSearchParams({
            startIndex: startIndex.toString(),
            count: count.toString()
        });
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/variant/${encodeURIComponent(variantId)}/getSN?${queryParams}`;
        return request(path);
    }
    variant.getSN = getSN;
    /**
     * Look up a serial number by code for a variant (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param variantId - Identifier of the variant
     * @param codeId - The serial number code to look up
     * @returns Promise resolving to serial number lookup data
     * @throws ErrorResponse if the request fails
     */
    async function lookupSN(collectionId, productId, variantId, codeId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/variant/${encodeURIComponent(variantId)}/lookupSN/${encodeURIComponent(codeId)}`;
        return request(path);
    }
    variant.lookupSN = lookupSN;
})(variant || (variant = {}));
