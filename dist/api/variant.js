// src/api/variant.ts
import { request, post, put, del } from "../http";
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
     * List all variants for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @returns Promise resolving to an array of VariantResponse objects
     * @throws ErrorResponse if the request fails
     */
    async function list(collectionId, productId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}/variant`;
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
})(variant || (variant = {}));
