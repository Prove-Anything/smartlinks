import { GetCrateResponse, CreateCrateRequest, CreateCrateResponse, UpdateCrateRequest, UpdateCrateResponse, DeleteCrateResponse, ListCratesRequest, ListCratesResponse } from "../types/crate";
/**
 * Crate Management API
 *
 * Manage crates (containers for tags/products) within collections.
 */
export declare namespace crate {
    /**
     * List crates for a collection with pagination support.
     * Returns crates in pages, with support for soft-deleted crates.
     *
     * @param collectionId - Identifier of the parent collection
     * @param params - Optional query parameters for pagination and filtering
     * @returns Promise resolving to a ListCratesResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Get first page
     * const page1 = await crate.list('coll_123', { limit: 100 })
     * console.log(`Found ${page1.items.length} crates`)
     *
     * // Get next page
     * if (page1.hasMore) {
     *   const page2 = await crate.list('coll_123', {
     *     limit: 100,
     *     startAfter: page1.lastId
     *   })
     * }
     *
     * // Include soft-deleted crates
     * const withDeleted = await crate.list('coll_123', {
     *   includeDeleted: true
     * })
     * ```
     */
    function list(collectionId: string, params?: ListCratesRequest): Promise<ListCratesResponse>;
    /**
     * Get a single crate by ID for a collection (admin only).
     *
     * @param collectionId - Identifier of the parent collection
     * @param crateId - Crate ID
     * @returns Promise resolving to a GetCrateResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const crate = await crate.get('coll_123', 'crate_abc123')
     * console.log(`Crate has ${crate.items?.length ?? 0} items`)
     * ```
     */
    function get(collectionId: string, crateId: string): Promise<GetCrateResponse>;
    /**
     * Create a new crate for a collection (admin only).
     *
     * @param collectionId - Identifier of the parent collection
     * @param data - Crate creation data
     * @returns Promise resolving to a CreateCrateResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const newCrate = await crate.create('coll_123', {
     *   items: [
     *     {
     *       id: 'tag_001',
     *       codeId: 'ABC123',
     *       productId: 'prod_1',
     *       productName: 'Product Name'
     *     }
     *   ]
     * })
     * console.log(`Created crate ${newCrate.id}`)
     * ```
     */
    function create(collectionId: string, data: CreateCrateRequest): Promise<CreateCrateResponse>;
    /**
     * Update a crate for a collection (admin only).
     *
     * @param collectionId - Identifier of the parent collection
     * @param crateId - Crate ID
     * @param data - Update data
     * @returns Promise resolving to an UpdateCrateResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const updated = await crate.update('coll_123', 'crate_abc123', {
     *   items: [
     *     { id: 'tag_002', codeId: 'XYZ789', productId: 'prod_2' }
     *   ]
     * })
     * ```
     */
    function update(collectionId: string, crateId: string, data: UpdateCrateRequest): Promise<UpdateCrateResponse>;
    /**
     * Delete a crate for a collection (admin only).
     * This performs a soft delete.
     *
     * @param collectionId - Identifier of the parent collection
     * @param crateId - Crate ID
     * @returns Promise resolving to a DeleteCrateResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * await crate.remove('coll_123', 'crate_abc123')
     * ```
     */
    function remove(collectionId: string, crateId: string): Promise<DeleteCrateResponse>;
}
