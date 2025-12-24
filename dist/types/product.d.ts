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
    /** Hero image asset object */
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
}
export type ProductResponse = Product;
export type ProductCreateRequest = Omit<Product, 'id' | 'collectionId'>;
export type ProductUpdateRequest = Partial<Omit<Product, 'id' | 'collectionId'>>;
