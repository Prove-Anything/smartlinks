import { CollectionResponse } from "../types/collection";
export declare namespace collection {
    /**
     * Retrieves a single Collection by its ID.
     * @param collectionId – Identifier of the collection
     * @param admin – If true, fetches from the admin endpoint
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    function get(collectionId: string, admin?: boolean): Promise<CollectionResponse>;
    /**
     * Retrieves all Collections.
     * @param admin – If true, fetches from the admin endpoint
     * @returns Promise resolving to an array of CollectionResponse objects
     * @throws ErrorResponse if the request fails
     */
    function list(admin?: boolean): Promise<CollectionResponse[]>;
    /**
     * Create a new collection (admin only).
     * @param data – Collection creation data
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    function create(data: any): Promise<CollectionResponse>;
    /**
     * Update a collection (admin only).
     * @param collectionId – Identifier of the collection
     * @param data – Collection update data
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    function update(collectionId: string, data: any): Promise<CollectionResponse>;
    /**
     * Delete a collection (admin only).
     * @param collectionId – Identifier of the collection
     * @returns Promise resolving to void
     * @throws ErrorResponse if the request fails
     */
    function remove(collectionId: string): Promise<void>;
    /**
     * Get serial numbers for a collection (admin only).
     * @param collectionId - Identifier of the collection
     * @param startIndex - Starting index for pagination (default: 0)
     * @param count - Number of serial numbers to retrieve (default: 10)
     * @returns Promise resolving to serial number data
     * @throws ErrorResponse if the request fails
     */
    function getSN(collectionId: string, startIndex?: number, count?: number): Promise<any>;
    /**
     * Look up a serial number by code for a collection (admin only).
     * @param collectionId - Identifier of the collection
     * @param codeId - The serial number code to look up
     * @returns Promise resolving to serial number lookup data
     * @throws ErrorResponse if the request fails
     */
    function lookupSN(collectionId: string, codeId: string): Promise<any>;
    /**
     * Assign a value to a serial number for a collection (admin only).
     * @param collectionId - Identifier of the collection
     * @param codeId - The serial number code to assign
     * @param value - The value to assign to the serial number
     * @returns Promise resolving to assignment result
     * @throws ErrorResponse if the request fails
     */
    function assignSN(collectionId: string, codeId: string, value: any): Promise<any>;
}
