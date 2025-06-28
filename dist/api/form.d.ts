export declare namespace form {
    /**
     * Get a single form by ID for a collection.
     * @param collectionId – The collection identifier
     * @param formId – The form identifier
     * @param admin – If true, use admin endpoint; otherwise, use public
     */
    function get(collectionId: string, formId: string, admin?: boolean): Promise<any>;
    /**
     * List all forms for a collection.
     * @param collectionId – The collection identifier
     * @param admin – If true, use admin endpoint; otherwise, use public
     */
    function list(collectionId: string, admin?: boolean): Promise<any[]>;
    /**
     * Create a new form for a collection (admin only).
     * @param collectionId – The collection identifier
     * @param data – The form data
     */
    function create(collectionId: string, data: any): Promise<any>;
    /**
     * Update a form for a collection (admin only).
     * @param collectionId – The collection identifier
     * @param formId – The form identifier
     * @param data – The form data
     */
    function update(collectionId: string, formId: string, data: any): Promise<any>;
    /**
     * Delete a form for a collection (admin only).
     * @param collectionId – The collection identifier
     * @param formId – The form identifier
     */
    function remove(collectionId: string, formId: string): Promise<void>;
}
