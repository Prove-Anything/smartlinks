/**
 * Product domain model.
 */
export interface Product {
    /** Unique identifier for the product */
    id: string;
    /** Name of the product */
    name: string;
    /** Unique identifier for the product's collection */
    collectionId: string;
    /** Detailed description of the product */
    description: string;
    /** A product GTIN (Global Trade Item Number) */
    gtin?: string;
    /** An optional product type from the standard smartlinks types */
    type?: string;
    /**
     * Hero image asset object.
     * When creating/updating, you can pass either:
     * - A full asset object with url and thumbnails
     * - A string URL - the system will automatically fetch and store the image
     */
    heroImage: {
        /** URL to the asset */
        url: string;
        /** Thumbnail URLs in different sizes */
        thumbnails: {
            x100: string;
            x200: string;
            x512: string;
        };
    };
    /** Flexible map of tags with true/false values */
    tags: {
        [tagName: string]: boolean;
    };
    /** Flexible key/value data map */
    data: {
        [key: string]: any;
    };
    /** Admin-only configuration */
    admin?: {
        /** Allow users to claim this product without providing a proof ID (overrides collection setting) */
        allowAutoGenerateClaims?: boolean;
        /** Last generated serial ID for auto-claim functionality */
        lastSerialId?: number;
        [key: string]: any;
    };
}
export type ProductResponse = Product;
export type ProductCreateRequest = Omit<Product, 'id' | 'collectionId'> & {
    heroImage?: Product['heroImage'] | string;
};
export type ProductUpdateRequest = Partial<Omit<Product, 'id' | 'collectionId'>> & {
    heroImage?: Product['heroImage'] | string;
};
