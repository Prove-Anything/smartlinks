import { VariantResponse, VariantCreateRequest, VariantUpdateRequest } from "../types/variant";
export declare namespace variant {
    /**
     * Get a single variant by ID for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param variantId - Identifier of the variant
     * @returns Promise resolving to a VariantResponse object
     * @throws ErrorResponse if the request fails
     */
    function get(collectionId: string, productId: string, variantId: string): Promise<VariantResponse>;
    /**
     * List all variants for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @returns Promise resolving to an array of VariantResponse objects
     * @throws ErrorResponse if the request fails
     */
    function list(collectionId: string, productId: string): Promise<VariantResponse[]>;
    /**
     * Create a new variant for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param data - Variant creation data
     * @returns Promise resolving to a VariantResponse object
     * @throws ErrorResponse if the request fails
     */
    function create(collectionId: string, productId: string, data: VariantCreateRequest): Promise<VariantResponse>;
    /**
     * Update a variant for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param variantId - Identifier of the variant
     * @param data - Variant update data
     * @returns Promise resolving to a VariantResponse object
     * @throws ErrorResponse if the request fails
     */
    function update(collectionId: string, productId: string, variantId: string, data: VariantUpdateRequest): Promise<VariantResponse>;
    /**
     * Delete a variant for a collection and product (admin only).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param variantId - Identifier of the variant
     * @returns Promise resolving to void
     * @throws ErrorResponse if the request fails
     */
    function remove(collectionId: string, productId: string, variantId: string): Promise<void>;
    /**
     * Get a single variant by ID for a collection and product (public endpoint).
     * @param collectionId - Identifier of the parent collection
     * @param productId - Identifier of the parent product
     * @param variantId - Identifier of the variant
     * @returns Promise resolving to a VariantResponse object
     * @throws ErrorResponse if the request fails
     */
    function getPublic(collectionId: string, productId: string, variantId: string): Promise<VariantResponse>;
}
