import type { ListResult } from "../types/list.js";
export declare namespace form {
    /**
     * Get a single form by ID for a collection.
     * @param collectionId – The collection identifier
     * @param formId – The form identifier
     * @param admin – If true, use admin endpoint; otherwise, use public
     */
    function get(collectionId: string, formId: string, admin?: boolean): Promise<any>;
    /**
     * List all forms for a collection. All of them come back in one answer: `nextCursor` is always null.
     * @param collectionId – The collection identifier
     * @param admin – If true, use admin endpoint; otherwise, use public
     * @returns Promise resolving to `{ items, nextCursor }`, where `items` are the forms
     *
     * @example
     * ```typescript
     * const { items: forms } = await form.list(collectionId, true)
     * ```
     */
    function list(collectionId: string, admin?: boolean): Promise<ListResult<any>>;
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
