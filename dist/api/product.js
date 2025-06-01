// src/api/product.ts
import { request } from "../http";
export var product;
(function (product) {
    /**
     * Retrieves a single Product Item by Collection ID and Product ID.
     * @param collectionId – Identifier of the parent collection
     * @param productId    – Identifier of the product item
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    async function get(collectionId, productId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product/${encodeURIComponent(productId)}`;
        return request(path);
    }
    product.get = get;
    /**
     * Retrieves all Product Items for a Collection.
     * @param collectionId – Identifier of the parent collection
     * @returns Promise resolving to an array of ProductResponse objects
     * @throws ErrorResponse if the request fails
     */
    async function getAll(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/product`;
        return request(path);
    }
    product.getAll = getAll;
})(product || (product = {}));
