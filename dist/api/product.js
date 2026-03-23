// src/api/product.ts
import { request, post, put, del } from "../http";
export var product;
(function (product) {
    /**
    * @deprecated Use `products.get(...)`.
     * Retrieves a single Product Item by Collection ID and Product ID.
     * @param collectionId – Identifier of the parent collection
     * @param productId    – Identifier of the product item
     * @param admin        – If true, use admin endpoint; otherwise, use public
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    async function get(collectionId, productId, admin) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}`;
        return request(path);
    }
    product.get = get;
    /**
     * @deprecated Use `products.list(...)`.
     * List all Product Items for a Collection.
     * @param collectionId – Identifier of the parent collection
     * @param admin        – If true, use admin endpoint; otherwise, use public
     * @returns Promise resolving to an array of ProductResponse objects
     * @throws ErrorResponse if the request fails
     */
    async function list(collectionId, admin) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/product`;
        return request(path);
    }
    product.list = list;
    /**
     * @deprecated Use `products.create(...)`.
     * Create a new product for a collection (admin only).
     * The `data` payload follows the same shape as ProductResponse minus `id` and `collectionId`.
     *
     * **Hero Image Auto-Fetch:**
     * You can pass `heroImage` as either:
     * - A full asset object: `{ url: '...', thumbnails: {...} }`
     * - A string URL: The system automatically fetches and stores the image
     *
     * @example
     * ```typescript
     * // Using a URL - auto-fetched and stored
     * const product = await product.create(collectionId, {
     *   name: 'Wine Bottle',
     *   description: 'Premium red wine',
     *   heroImage: 'https://example.com/wine.jpg', // Auto-fetched!
     *   data: {}
     * });
     * ```
     *
     * @param collectionId – Identifier of the parent collection
     * @param data – Product creation data (see ProductCreateRequest)
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product`;
        return post(path, data);
    }
    product.create = create;
    /**
     * @deprecated Use `products.update(...)`.
     * Update a product for a collection (admin only).
     * The `data` payload is a partial of ProductResponse minus `id` and `collectionId`.
     *
     * **Hero Image Auto-Fetch:**
     * You can pass `heroImage` as either:
     * - A full asset object: `{ url: '...', thumbnails: {...} }`
     * - A string URL: The system automatically fetches and stores the image
     *
     * @example
     * ```typescript
     * // Update with new URL - auto-fetched and stored
     * const product = await product.update(collectionId, productId, {
     *   heroImage: 'https://example.com/new-wine.jpg' // Auto-fetched!
     * });
     * ```
     *
     * @param collectionId – Identifier of the parent collection
     * @param productId – Identifier of the product
     * @param data – Product update data (see ProductUpdateRequest)
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    async function update(collectionId, productId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}`;
        return put(path, data);
    }
    product.update = update;
    /**
     * @deprecated Use `products.remove(...)`.
     * Delete a product for a collection (admin only).
     * @param collectionId – Identifier of the parent collection
     * @param productId – Identifier of the product
     * @returns Promise resolving to void
     * @throws ErrorResponse if the request fails
     */
    async function remove(collectionId, productId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}`;
        return del(path);
    }
    product.remove = remove;
    /**
     * @deprecated Legacy compatibility endpoint only. Use `products.query(...)` for new integrations.
     */
    async function find(collectionId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/find`;
        return post(path, body);
    }
    product.find = find;
    /**
     * @deprecated Legacy compatibility endpoint only. Use `products.get(...)` when the product id is known.
     */
    async function publicFind(collectionId, params) {
        const searchParams = new URLSearchParams();
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value === undefined || value === null)
                    continue;
                if (Array.isArray(value)) {
                    for (const item of value)
                        searchParams.append(key, String(item));
                }
                else {
                    searchParams.set(key, String(value));
                }
            }
        }
        const query = searchParams.toString();
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/find${query ? `?${query}` : ''}`;
        return request(path);
    }
    product.publicFind = publicFind;
    /**
     * @deprecated Use `products.clone(...)`.
     */
    async function clone(collectionId, productId, body = {}) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/clone`;
        return post(path, body);
    }
    product.clone = clone;
    /**
     * @deprecated Use `products.listAssets(...)`.
     */
    async function listAssets(collectionId, productId, admin) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/asset`;
        return request(path);
    }
    product.listAssets = listAssets;
    /**
     * @deprecated Use `products.createClaimWindow(...)`.
     */
    async function createClaimWindow(collectionId, productId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/claimWindow`;
        return post(path, body);
    }
    product.createClaimWindow = createClaimWindow;
    /**
     * @deprecated Use `products.updateClaimWindow(...)`.
     */
    async function updateClaimWindow(collectionId, productId, claimId, body) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/claimWindow/${encodeURIComponent(claimId)}`;
        return put(path, body);
    }
    product.updateClaimWindow = updateClaimWindow;
    /**
     * @deprecated Use `products.refresh(...)`.
     */
    async function refresh(collectionId, productId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/refresh`;
        return request(path);
    }
    product.refresh = refresh;
    /**
     * @deprecated Use `products.getSN(...)`.
     * Get serial numbers for a product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the product
     * @param startIndex - Starting index for pagination (default: 0)
     * @param count - Number of serial numbers to retrieve (default: 10)
     * @returns Promise resolving to serial number data
     * @throws ErrorResponse if the request fails
     */
    async function getSN(collectionId, productId, startIndex = 0, count = 10) {
        const queryParams = new URLSearchParams({
            startIndex: startIndex.toString(),
            count: count.toString()
        });
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/getSN?${queryParams}`;
        return request(path);
    }
    product.getSN = getSN;
    /**
     * @deprecated Use `products.lookupSN(...)`.
     * Look up a serial number by code for a product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the product
     * @param codeId - The serial number code to look up
     * @returns Promise resolving to serial number lookup data
     * @throws ErrorResponse if the request fails
     */
    async function lookupSN(collectionId, productId, codeId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/lookupSN/${encodeURIComponent(codeId)}`;
        return request(path);
    }
    product.lookupSN = lookupSN;
    /**
     * @deprecated Use `products.publicLookupClaim(...)`.
     */
    async function publicLookupClaim(collectionId, productId, claimId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/lookupClaim/${encodeURIComponent(claimId)}`;
        return request(path);
    }
    product.publicLookupClaim = publicLookupClaim;
    /**
     * @deprecated Use `products.publicCreateClaim(...)`.
     */
    async function publicCreateClaim(collectionId, productId, body) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/createClaim`;
        return post(path, body);
    }
    product.publicCreateClaim = publicCreateClaim;
})(product || (product = {}));
