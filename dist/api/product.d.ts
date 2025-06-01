import { ProductResponse } from "../types/product";
export declare namespace product {
    /**
     * Retrieves a single Product Item by Collection ID and Product ID.
     * @param collectionId – Identifier of the parent collection
     * @param productId    – Identifier of the product item
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    function get(collectionId: string, productId: string): Promise<ProductResponse>;
    /**
     * Retrieves all Product Items for a Collection.
     * @param collectionId – Identifier of the parent collection
     * @returns Promise resolving to an array of ProductResponse objects
     * @throws ErrorResponse if the request fails
     */
    function getAll(collectionId: string): Promise<ProductResponse[]>;
}
