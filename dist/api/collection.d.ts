import { CollectionResponse, CollectionCreateRequest, CollectionUpdateRequest } from "../types/collection";
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
     * Retrieve a collection by its shortId (public endpoint).
     * @param shortId – The short identifier of the collection
     * @returns Promise resolving to a CollectionResponse object
     */
    function getShortId(shortId: string): Promise<CollectionResponse>;
    /**
     * Retrieve a specific settings group for a collection (public endpoint).
     * @param collectionId – Identifier of the collection
     * @param settingGroup – The settings group name
     * @returns Promise resolving to the settings object
     */
    function getSettings(collectionId: string, settingGroup: string, admin?: boolean): Promise<any>;
    /**
     * Update a specific settings group for a collection (admin endpoint).
     * @param collectionId – Identifier of the collection
     * @param settingGroup – The settings group name
     * @param settings – The settings payload to persist
     * @returns Promise resolving to the updated settings
     */
    function updateSettings(collectionId: string, settingGroup: string, settings: any): Promise<any>;
    /**
     * Create a new collection (admin only).
     * @param data – Collection creation data
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    function create(data: CollectionCreateRequest): Promise<CollectionResponse>;
    /**
     * Update a collection (admin only).
     * @param collectionId – Identifier of the collection
     * @param data – Collection update data
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    function update(collectionId: string, data: CollectionUpdateRequest): Promise<CollectionResponse>;
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
