export declare namespace crate {
    /**
     * Get a single crate by ID for a collection (admin only).
     */
    function get(collectionId: string, crateId: string): Promise<any>;
    /**
     * List all crates for a collection (admin only).
     */
    function list(collectionId: string): Promise<any[]>;
    /**
     * Create a new crate for a collection (admin only).
     */
    function create(collectionId: string, data: any): Promise<any>;
    /**
     * Update a crate for a collection (admin only).
     */
    function update(collectionId: string, crateId: string, data: any): Promise<any>;
    /**
     * Delete a crate for a collection (admin only).
     */
    function remove(collectionId: string, crateId: string): Promise<void>;
}
