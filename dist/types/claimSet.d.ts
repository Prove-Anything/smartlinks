export interface ClaimCodeRef {
    /** Identifier of the code (e.g., tag or QR code) */
    codeId: string;
    /** Identifier of the claim within the claim set */
    claimId: string;
}
export interface UpdateClaimDataRequest {
    /** Arbitrary key/value pairs for the claim data update */
    data: Record<string, any>;
    /** Array of code+claim references affected by this update */
    codes: ClaimCodeRef[];
}
export interface AssignClaimsRequest {
    /** The claim set ID (required) */
    id: string;
    /** The collection ID (required) */
    collectionId: string;
    /** The product ID (required) */
    productId: string;
    /** Optional batch identifier */
    batchId?: string;
    /** Optional start index for bulk assignment */
    start?: number;
    /** Optional end index for bulk assignment */
    end?: number;
    /** Optional single code identifier for single assignment */
    codeId?: string;
    /** Optional key/value pairs to set on the claim */
    data?: Record<string, any>;
}
