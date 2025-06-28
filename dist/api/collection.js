// src/api/collection.ts
import { request } from "../http";
export var collection;
(function (collection) {
    /**
     * Retrieves a single Collection by its ID.
     * @param collectionId – Identifier of the collection
     * @param admin – If true, fetches from the admin endpoint
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    async function get(collectionId, admin) {
        const base = admin ? '/admin/collection' : '/public/collection';
        const path = `${base}/${encodeURIComponent(collectionId)}`;
        return request(path);
    }
    collection.get = get;
    /**
     * Retrieves all Collections.
     * @param admin – If true, fetches from the admin endpoint
     * @returns Promise resolving to an array of CollectionResponse objects
     * @throws ErrorResponse if the request fails
     */
    async function list(admin) {
        const base = admin ? '/admin/collection' : '/public/collection';
        const path = `${base}`;
        return request(path);
    }
    collection.list = list;
})(collection || (collection = {}));
