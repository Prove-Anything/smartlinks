import { CollectionResponse } from "../types/collection";
export declare namespace collection {
    /**
     * Retrieves a single Collection by its ID.
     * @param collectionId – Identifier of the collection
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    function get(collectionId: string): Promise<CollectionResponse>;
}
