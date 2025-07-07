import { ProductResponse } from "../types/product";
export declare namespace product {
    /**
     * Retrieves a single Product Item by Collection ID and Product ID.
     * @param collectionId – Identifier of the parent collection
     * @param productId    – Identifier of the product item
     * @param admin        – If true, use admin endpoint; otherwise, use public
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    function get(collectionId: string, productId: string, admin?: boolean): Promise<ProductResponse>;
    /**
     * List all Product Items for a Collection.
     * @param collectionId – Identifier of the parent collection
     * @param admin        – If true, use admin endpoint; otherwise, use public
     * @returns Promise resolving to an array of ProductResponse objects
     * @throws ErrorResponse if the request fails
     */
    function list(collectionId: string, admin?: boolean): Promise<ProductResponse[]>;
    /**
     * Create a new product for a collection (admin only).
     * @param collectionId – Identifier of the parent collection
     * @param data – Product creation data
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    function create(collectionId: string, data: any): Promise<ProductResponse>;
    /**
     * Update a product for a collection (admin only).
     * @param collectionId – Identifier of the parent collection
     * @param productId – Identifier of the product
     * @param data – Product update data
     * @returns Promise resolving to a ProductResponse object
     * @throws ErrorResponse if the request fails
     */
    function update(collectionId: string, productId: string, data: any): Promise<ProductResponse>;
    /**
     * Delete a product for a collection (admin only).
     * @param collectionId – Identifier of the parent collection
     * @param productId – Identifier of the product
     * @returns Promise resolving to void
     * @throws ErrorResponse if the request fails
     */
    function remove(collectionId: string, productId: string): Promise<void>;
    /**
     * Get serial numbers for a product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the product
     * @param startIndex - Starting index for pagination (default: 0)
     * @param count - Number of serial numbers to retrieve (default: 10)
     * @returns Promise resolving to serial number data
     * @throws ErrorResponse if the request fails
     */
    function getSN(collectionId: string, productId: string, startIndex?: number, count?: number): Promise<any>;
    /**
     * Look up a serial number by code for a product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the product
     * @param codeId - The serial number code to look up
     * @returns Promise resolving to serial number lookup data
     * @throws ErrorResponse if the request fails
     */
    function lookupSN(collectionId: string, productId: string, codeId: string): Promise<any>;
}
