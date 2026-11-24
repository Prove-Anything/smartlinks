import type { ListResult, ListOptions } from "../types/list.js";
export declare namespace form {
    /**
     * Get a single form by ID for a collection.
     * @param collectionId – The collection identifier
     * @param formId – The form identifier
     * @param admin – If true, use admin endpoint; otherwise, use public
     */
    function get(collectionId: string, formId: string, admin?: boolean): Promise<any>;
    /**
     * List the forms for a collection, 50 at a time unless you give a `limit` (at most 1000). Pass
     * `nextCursor` back as `cursor` for the next page; `null` means that was the last one.
     * @param collectionId – The collection identifier
     * @param admin – If true, use admin endpoint; otherwise, use public
     * @param options – Paging: `limit` and `cursor`
     * @returns Promise resolving to `{ items, nextCursor, count }`, where `items` are the forms
     *
     * @example
     * ```typescript
     * let page = await form.list(collectionId, true, { limit: 100 })
     * while (page.nextCursor) page = await form.list(collectionId, true, { limit: 100, cursor: page.nextCursor })
     * ```
     */
    function list(collectionId: string, admin?: boolean, options?: ListOptions): Promise<ListResult<any>>;
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
