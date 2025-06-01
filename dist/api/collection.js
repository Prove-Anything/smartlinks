// src/api/collection.ts
import { request } from "../http";
export var collection;
(function (collection) {
    /**
     * Retrieves a single Collection by its ID.
     * @param collectionId – Identifier of the collection
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    async function get(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}`;
        return request(path);
    }
    collection.get = get;
})(collection || (collection = {}));
