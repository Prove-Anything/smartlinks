export interface NfcTagInfo {
    id: string;
    tagId: string;
    claimSetId: string;
    collectionId?: string;
    productId?: string;
    batchId?: string;
    variantId?: string;
    proofId?: string;
    index?: number;
    data?: Record<string, any>;
}
export interface NfcValidateRequest {
    claimSetId: string;
    codeId: string;
    mirror?: string;
    userId?: string;
}
export interface NfcValidateResponse {
    claimSetId: string;
    codeId: string;
    tagId: string;
    index?: number;
    isAdmin: boolean;
    path?: string;
    collectionId?: string;
    collection?: Record<string, any>;
    count: number;
    previousCount: number;
    data?: Record<string, any>;
    productId?: string;
    product?: Record<string, any>;
    batchId?: string;
    variantId?: string;
    proofId?: string;
}
export interface NfcClaimTagRequest {
    claimSetId: string;
    codeId: string;
    data: Record<string, any>;
}
