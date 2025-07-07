// src/api/product.ts
import { request, post, put, del } from "../http";
export var product;
(function (product) {
    /**
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
     * Create a new product for a collection (admin only).
     * @param collectionId – Identifier of the parent collection
     * @param data – Product creation data
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product`;
        return post(path, data);
    }
    product.create = create;
    /**
     * Update a product for a collection (admin only).
     * @param collectionId – Identifier of the parent collection
     * @param productId – Identifier of the product
     * @param data – Product update data
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    async function update(collectionId, productId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}`;
        return put(path, data);
    }
    product.update = update;
    /**
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
})(product || (product = {}));
