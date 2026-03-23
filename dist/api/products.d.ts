import { JsonValue, ProductClaimCreateRequestBody, ProductCreateRequest, ProductQueryRequest, ProductQueryResponse, ProductResponse, ProductUpdateRequest } from "../types/product";
export declare namespace products {
    function get(collectionId: string, productId: string, admin?: boolean): Promise<ProductResponse>;
    function list(collectionId: string, admin?: boolean): Promise<ProductResponse[]>;
    function create(collectionId: string, data: ProductCreateRequest): Promise<ProductResponse>;
    function update(collectionId: string, productId: string, data: ProductUpdateRequest): Promise<ProductResponse>;
    function remove(collectionId: string, productId: string): Promise<void>;
    function query(collectionId: string, body: ProductQueryRequest): Promise<ProductQueryResponse>;
    function clone(collectionId: string, productId: string, body?: Record<string, JsonValue>): Promise<ProductResponse>;
    function listAssets(collectionId: string, productId: string, admin?: boolean): Promise<unknown>;
    function createClaimWindow(collectionId: string, productId: string, body: Record<string, JsonValue>): Promise<unknown>;
    function updateClaimWindow(collectionId: string, productId: string, claimId: string, body: Record<string, JsonValue>): Promise<unknown>;
    function refresh(collectionId: string, productId: string): Promise<ProductResponse>;
    function getSN(collectionId: string, productId: string, startIndex?: number, count?: number): Promise<unknown>;
    function lookupSN(collectionId: string, productId: string, codeId: string): Promise<unknown>;
    function publicLookupClaim(collectionId: string, productId: string, claimId: string): Promise<unknown>;
    function publicCreateClaim(collectionId: string, productId: string, body: ProductClaimCreateRequestBody): Promise<unknown>;
}
