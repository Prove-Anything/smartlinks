export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | {
    [key: string]: JsonValue;
};
export type ISODateString = string;
export interface ProductKey {
    collectionId: string;
    id: string;
}
export interface ProductImageThumbnails {
    x100?: string;
    x200?: string;
    x512?: string;
}
export interface ProductImage {
    id?: string;
    collectionId?: string;
    productId?: string;
    site?: string;
    name?: string;
    cleanName?: string;
    assetType?: string;
    type?: string;
    url?: string;
    thumbnails?: ProductImageThumbnails;
    contentType?: string;
    size?: string | number;
    hash?: string;
    createdAt?: ISODateString | null;
    updatedAt?: ISODateString | null;
    deletedAt?: ISODateString | null;
}
export interface ProductImageUrlInput {
    url: string;
}
export interface AdditionalGtin {
    gtin: string;
    owner?: boolean | null;
}
export interface ProductFacetValue {
    id?: string;
    key: string;
    slug?: string;
    name: string;
    shortName?: string;
    description?: string;
    color?: string;
    icon?: string;
}
export interface ProductFacetMap {
    [facetKey: string]: ProductFacetValue[];
}
export interface ProductQueryRequest {
    query?: {
        search?: string;
        status?: string[];
        productIds?: string[];
        sku?: string;
        gtin?: string;
        updatedAfter?: ISODateString;
        updatedBefore?: ISODateString;
        createdAfter?: ISODateString;
        createdBefore?: ISODateString;
        facetEquals?: Record<string, JsonValue>;
    };
    sort?: Array<{
        field: string;
        direction: 'asc' | 'desc';
    }>;
    page?: {
        limit?: number;
        offset?: number;
        cursor?: string | null;
    };
    includeDeleted?: boolean;
}
export interface Product extends ProductKey {
    orgId?: string | null;
    name: string;
    description?: string | null;
    gtin?: string | null;
    ownGtin?: boolean | null;
    additionalGtins?: AdditionalGtin[];
    sku?: string | null;
    label?: string | null;
    status?: string | null;
    sortOrder?: number | null;
    heroImage?: ProductImage | null;
    facets?: ProductFacetMap;
    data?: Record<string, JsonValue>;
    admin?: Record<string, JsonValue>;
    extra?: Record<string, JsonValue>;
    validCollections?: string[];
    group?: boolean | null;
    createdAt?: ISODateString | null;
    updatedAt?: ISODateString | null;
    deletedAt?: ISODateString | null;
}
export interface PublicProduct extends Omit<Product, 'admin'> {
    admin?: never;
}
export interface ProductWriteInput {
    id?: string;
    name: string;
    description?: string | null;
    gtin?: string | null;
    ownGtin?: boolean | null;
    additionalGtins?: AdditionalGtin[];
    sku?: string | null;
    label?: string | null;
    status?: string | null;
    sortOrder?: number | null;
    heroImage?: ProductImage | ProductImageUrlInput | string | null;
    facets?: ProductFacetMap;
    data?: Record<string, JsonValue>;
    admin?: Record<string, JsonValue>;
    extra?: Record<string, JsonValue>;
    validCollections?: string[];
}
export interface ProductQueryResponse {
    items: Product[];
    page?: {
        limit?: number;
        offset?: number;
        returned?: number;
        total?: number;
        hasMore?: boolean;
        nextCursor?: string | null;
    };
    meta?: {
        apiVersion?: 'v1';
        mode?: 'canonical-products' | 'legacy-product-compatibility';
        source?: 'postgres' | 'firestore' | 'compatibility-layer';
        queryMode?: 'canonical' | 'compatibility';
        unsupportedFilters?: string[];
        supportedSortFields?: string[];
    };
}
export interface ProductClaimLookupInput extends ProductKey {
    claimId: string;
}
export interface ProductClaimCreateInput extends ProductKey {
    claimId: string;
    email?: string;
    name?: string;
    emailConfirmation?: boolean;
    data?: Record<string, JsonValue>;
    options?: Record<string, JsonValue>;
}
export type ProductClaimCreateRequestBody = Omit<ProductClaimCreateInput, 'collectionId' | 'id'>;
export type ProductResponse = Product;
export type ProductCreateRequest = ProductWriteInput;
export type ProductUpdateRequest = Partial<Omit<ProductWriteInput, 'id'>>;
