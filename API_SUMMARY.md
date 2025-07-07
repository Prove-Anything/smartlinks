# Smartlinks API Summary

This is a concise summary of all available API functions and types.

## Types

### appConfiguration

**AppConfigurationResponse** (interface)
```typescript
interface AppConfigurationResponse {
  id: string;
  name: string;
  settings?: Record<string, any>;
}
```

### asset

**AssetResponse** (interface)
```typescript
interface AssetResponse {
  id: string;
  name: string;
  url: string;
}
```

### attestation

**AttestationResponse** (interface)
```typescript
interface AttestationResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  public: Record<string, any>;
  private: Record<string, any>;
  proof: Record<string, any>;
}
```

**AttestationCreateRequest** (interface)
```typescript
interface AttestationCreateRequest {
  public: Record<string, any>;
  private: Record<string, any>;
  proof: Record<string, any>;
}
```

**AttestationUpdateRequest** (interface)
```typescript
interface AttestationUpdateRequest {
  type?: string;
  data?: Record<string, any>;
}
```

### batch

**BatchResponse** = `any`

**BatchCreateRequest** = `any`

**BatchUpdateRequest** = `any`

### collection

**CollectionResponse** (interface)
```typescript
interface CollectionResponse {
  id: string;
  title: string;
  description: string;
  headerImage?: {
    url: string;
    thumbnails: {
      x100: string;
      x200: string;
      x512: string;
    };
  };
  logoImage?: {
    url: string;
    thumbnails: {
      x100: string;
      x200: string;
      x512: string;
    };
  };
  loaderImage?: {
    overwriteName: string;
    name: string;
    type: string;
    url: string;
  };
  languages?: {
    code: string;
    lang: string;
    supported: boolean;
  };
  roles: {
  };
  groupTags?: string[];
  redirectUrl?: string;
  shortId: string;
  dark?: boolean;
}
```

### error

**ErrorResponse** (interface)
```typescript
interface ErrorResponse {
  code: number;
  message: string;
}
```

### product

**ProductResponse** (interface)
```typescript
interface ProductResponse {
  id: string;
  name: string;
  collectionId: string;
  description: string;
  heroImage: {
    url: string;
    thumbnails: {
      x100: string;
      x200: string;
      x512: string;
    };
  };
  groupTags: {
  };
  data: {
  };
}
```

### proof

**ProofResponse** (interface)
```typescript
interface ProofResponse {
  collectionId: string;
  createdAt: string;
  id: string;
  productId: string;
  tokenId: string;
  userId: string;
  values: Record<string, any>;
}
```

### variant

**VariantResponse** = `any`

**VariantCreateRequest** = `any`

**VariantUpdateRequest** = `any`

## API Functions

### appConfiguration

**getConfig**(opts: AppConfigOptions) → `any`

**setConfig**(opts: AppConfigOptions) → `any`

**deleteConfig**(opts: AppConfigOptions) → `void`

**getData**(opts: AppConfigOptions) → `any[]`

**getDataItem**(opts: AppConfigOptions) → `any`

**setDataItem**(opts: AppConfigOptions) → `any`

**deleteDataItem**(opts: AppConfigOptions) → `void`

### asset

**getForCollection**(collectionId: string, assetId: string) → `AssetResponse`

**listForCollection**(collectionId: string) → `AssetResponse[]`

**getForProduct**(collectionId: string, productId: string, assetId: string) → `AssetResponse`

**listForProduct**(collectionId: string, productId: string) → `AssetResponse[]`

**getForProof**(collectionId: string, productId: string, proofId: string, assetId: string) → `AssetResponse`

**listForProof**(collectionId: string, productId: string, proofId: string, appId?: string) → `AssetResponse[]`

**uploadAsset**(collectionId: string, productId: string, proofId: string, file: File, extraData?: Record<string, any>, onProgress?: (percent: number) => void) → `AssetResponse`
Uploads an asset file to a proof, with optional extraData as JSON. Supports progress reporting via onProgress callback (browser only). @param collectionId - The collection ID @param productId - The product ID @param proofId - The proof ID @param file - The file to upload @param extraData - Arbitrary extra data to include (will be stringified as JSON) @param onProgress - Optional callback for upload progress (0-100) @returns Promise resolving to an AssetResponse object

### attestation

**list**(collectionId: string, productId: string, proofId: string) → `AttestationResponse[]`
List all attestations for a proof.

**get**(collectionId: string, productId: string, proofId: string, attestationId: string) → `AttestationResponse`
List all attestations for a proof.

**create**(collectionId: string, productId: string, proofId: string, data: AttestationCreateRequest) → `AttestationResponse`
List all attestations for a proof.

**update**(collectionId: string, productId: string, proofId: string, attestationId: string, data: AttestationUpdateRequest) → `AttestationResponse`
List all attestations for a proof.

**remove**(collectionId: string, productId: string, proofId: string, attestationId: string) → `void`
List all attestations for a proof.

### auth

**login**(email: string, password: string) → `LoginResponse`
Login with email and password. Sets the bearerToken for subsequent API calls.

**verifyToken**(token?: string) → `VerifyTokenResponse`
Login with email and password. Sets the bearerToken for subsequent API calls.

**getAccount**() → `AccountInfoResponse`
Login with email and password. Sets the bearerToken for subsequent API calls.

### batch

**get**(collectionId: string, productId: string, batchId: string) → `BatchResponse`
Get a single batch by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param batchId - Identifier of the batch @returns Promise resolving to a BatchResponse object @throws ErrorResponse if the request fails

**list**(collectionId: string, productId: string) → `BatchResponse[]`
Get a single batch by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param batchId - Identifier of the batch @returns Promise resolving to a BatchResponse object @throws ErrorResponse if the request fails

**create**(collectionId: string, productId: string, data: BatchCreateRequest) → `BatchResponse`
Get a single batch by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param batchId - Identifier of the batch @returns Promise resolving to a BatchResponse object @throws ErrorResponse if the request fails

**update**(collectionId: string, productId: string, batchId: string, data: BatchUpdateRequest) → `BatchResponse`
Get a single batch by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param batchId - Identifier of the batch @returns Promise resolving to a BatchResponse object @throws ErrorResponse if the request fails

**remove**(collectionId: string, productId: string, batchId: string) → `void`
Get a single batch by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param batchId - Identifier of the batch @returns Promise resolving to a BatchResponse object @throws ErrorResponse if the request fails

**getPublic**(collectionId: string, productId: string, batchId: string) → `BatchResponse`
Get a single batch by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param batchId - Identifier of the batch @returns Promise resolving to a BatchResponse object @throws ErrorResponse if the request fails

**getSN**(collectionId: string, productId: string, batchId: string, startIndex: number = 0, count: number = 10) → `any`
Get a single batch by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param batchId - Identifier of the batch @returns Promise resolving to a BatchResponse object @throws ErrorResponse if the request fails

**lookupSN**(collectionId: string, productId: string, batchId: string, codeId: string) → `any`
Get a single batch by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param batchId - Identifier of the batch @returns Promise resolving to a BatchResponse object @throws ErrorResponse if the request fails

### claimSet

**getAllForCollection**(collectionId: string) → `any[]`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

**getForCollection**(collectionId: string, claimSetId: string) → `any`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

**getAllTags**(collectionId: string, claimSetId: string) → `any[]`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

**getReport**(collectionId: string, claimSetId: string) → `any`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

**getAssignedTags**(collectionId: string, claimSetId: string) → `any`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

**getTagSummary**(collectionId: string) → `any`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

**tagQuery**(collectionId: string, data: any) → `any`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

**createForCollection**(collectionId: string, params: any) → `any`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

**updateForCollection**(collectionId: string, params: any) → `any`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

**makeClaim**(collectionId: string, params: any) → `any`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

**assignClaims**(collectionId: string, data: any) → `any`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

**updateClaimData**(collectionId: string, data: any) → `any`
Get all claim sets for a collection. @param collectionId – The collection identifier @returns Promise resolving to an array of claim sets

### collection

**get**(collectionId: string, admin?: boolean) → `CollectionResponse`
Retrieves a single Collection by its ID. @param collectionId – Identifier of the collection @param admin – If true, fetches from the admin endpoint @returns Promise resolving to a CollectionResponse object @throws ErrorResponse if the request fails

**list**(admin?: boolean) → `CollectionResponse[]`
Retrieves a single Collection by its ID. @param collectionId – Identifier of the collection @param admin – If true, fetches from the admin endpoint @returns Promise resolving to a CollectionResponse object @throws ErrorResponse if the request fails

**create**(data: any) → `CollectionResponse`
Retrieves a single Collection by its ID. @param collectionId – Identifier of the collection @param admin – If true, fetches from the admin endpoint @returns Promise resolving to a CollectionResponse object @throws ErrorResponse if the request fails

**update**(collectionId: string, data: any) → `CollectionResponse`
Retrieves a single Collection by its ID. @param collectionId – Identifier of the collection @param admin – If true, fetches from the admin endpoint @returns Promise resolving to a CollectionResponse object @throws ErrorResponse if the request fails

**remove**(collectionId: string) → `void`
Retrieves a single Collection by its ID. @param collectionId – Identifier of the collection @param admin – If true, fetches from the admin endpoint @returns Promise resolving to a CollectionResponse object @throws ErrorResponse if the request fails

**getSN**(collectionId: string, startIndex: number = 0, count: number = 10) → `any`
Retrieves a single Collection by its ID. @param collectionId – Identifier of the collection @param admin – If true, fetches from the admin endpoint @returns Promise resolving to a CollectionResponse object @throws ErrorResponse if the request fails

**lookupSN**(collectionId: string, codeId: string) → `any`
Retrieves a single Collection by its ID. @param collectionId – Identifier of the collection @param admin – If true, fetches from the admin endpoint @returns Promise resolving to a CollectionResponse object @throws ErrorResponse if the request fails

**assignSN**(collectionId: string, codeId: string, value: any) → `any`
Retrieves a single Collection by its ID. @param collectionId – Identifier of the collection @param admin – If true, fetches from the admin endpoint @returns Promise resolving to a CollectionResponse object @throws ErrorResponse if the request fails

### crate

**get**(collectionId: string, crateId: string) → `any`
Get a single crate by ID for a collection (admin only).

**list**(collectionId: string) → `any[]`
Get a single crate by ID for a collection (admin only).

**create**(collectionId: string, data: any) → `any`
Get a single crate by ID for a collection (admin only).

**update**(collectionId: string, crateId: string, data: any) → `any`
Get a single crate by ID for a collection (admin only).

**remove**(collectionId: string, crateId: string) → `void`
Get a single crate by ID for a collection (admin only).

### form

**get**(collectionId: string, formId: string, admin?: boolean) → `any`
Get a single form by ID for a collection. @param collectionId – The collection identifier @param formId – The form identifier @param admin – If true, use admin endpoint; otherwise, use public

**list**(collectionId: string, admin?: boolean) → `any[]`
Get a single form by ID for a collection. @param collectionId – The collection identifier @param formId – The form identifier @param admin – If true, use admin endpoint; otherwise, use public

**create**(collectionId: string, data: any) → `any`
Get a single form by ID for a collection. @param collectionId – The collection identifier @param formId – The form identifier @param admin – If true, use admin endpoint; otherwise, use public

**update**(collectionId: string, formId: string, data: any) → `any`
Get a single form by ID for a collection. @param collectionId – The collection identifier @param formId – The form identifier @param admin – If true, use admin endpoint; otherwise, use public

**remove**(collectionId: string, formId: string) → `void`
Get a single form by ID for a collection. @param collectionId – The collection identifier @param formId – The form identifier @param admin – If true, use admin endpoint; otherwise, use public

### product

**get**(collectionId: string, productId: string, admin?: boolean) → `ProductResponse`
Retrieves a single Product Item by Collection ID and Product ID. @param collectionId – Identifier of the parent collection @param productId    – Identifier of the product item @param admin        – If true, use admin endpoint; otherwise, use public @returns Promise resolving to a ProductResponse object @throws ErrorResponse if the request fails

**list**(collectionId: string, admin?: boolean) → `ProductResponse[]`
Retrieves a single Product Item by Collection ID and Product ID. @param collectionId – Identifier of the parent collection @param productId    – Identifier of the product item @param admin        – If true, use admin endpoint; otherwise, use public @returns Promise resolving to a ProductResponse object @throws ErrorResponse if the request fails

**create**(collectionId: string, data: any) → `ProductResponse`
Retrieves a single Product Item by Collection ID and Product ID. @param collectionId – Identifier of the parent collection @param productId    – Identifier of the product item @param admin        – If true, use admin endpoint; otherwise, use public @returns Promise resolving to a ProductResponse object @throws ErrorResponse if the request fails

**update**(collectionId: string, productId: string, data: any) → `ProductResponse`
Retrieves a single Product Item by Collection ID and Product ID. @param collectionId – Identifier of the parent collection @param productId    – Identifier of the product item @param admin        – If true, use admin endpoint; otherwise, use public @returns Promise resolving to a ProductResponse object @throws ErrorResponse if the request fails

**remove**(collectionId: string, productId: string) → `void`
Retrieves a single Product Item by Collection ID and Product ID. @param collectionId – Identifier of the parent collection @param productId    – Identifier of the product item @param admin        – If true, use admin endpoint; otherwise, use public @returns Promise resolving to a ProductResponse object @throws ErrorResponse if the request fails

**getSN**(collectionId: string, productId: string, startIndex: number = 0, count: number = 10) → `any`
Retrieves a single Product Item by Collection ID and Product ID. @param collectionId – Identifier of the parent collection @param productId    – Identifier of the product item @param admin        – If true, use admin endpoint; otherwise, use public @returns Promise resolving to a ProductResponse object @throws ErrorResponse if the request fails

**lookupSN**(collectionId: string, productId: string, codeId: string) → `any`
Retrieves a single Product Item by Collection ID and Product ID. @param collectionId – Identifier of the parent collection @param productId    – Identifier of the product item @param admin        – If true, use admin endpoint; otherwise, use public @returns Promise resolving to a ProductResponse object @throws ErrorResponse if the request fails

### proof

**get**(collectionId: string, proofId: string) → `ProofResponse`
Retrieves a single Proof by Collection ID and Proof ID. @param collectionId – Identifier of the parent collection @param proofId      – Identifier of the proof @returns Promise resolving to a ProofResponse object @throws ErrorResponse if the request fails

**list**(collectionId: string) → `ProofResponse[]`
Retrieves a single Proof by Collection ID and Proof ID. @param collectionId – Identifier of the parent collection @param proofId      – Identifier of the proof @returns Promise resolving to a ProofResponse object @throws ErrorResponse if the request fails

### variant

**get**(collectionId: string, productId: string, variantId: string) → `VariantResponse`
Get a single variant by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param variantId - Identifier of the variant @returns Promise resolving to a VariantResponse object @throws ErrorResponse if the request fails

**list**(collectionId: string, productId: string) → `VariantResponse[]`
Get a single variant by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param variantId - Identifier of the variant @returns Promise resolving to a VariantResponse object @throws ErrorResponse if the request fails

**create**(collectionId: string, productId: string, data: VariantCreateRequest) → `VariantResponse`
Get a single variant by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param variantId - Identifier of the variant @returns Promise resolving to a VariantResponse object @throws ErrorResponse if the request fails

**update**(collectionId: string, productId: string, variantId: string, data: VariantUpdateRequest) → `VariantResponse`
Get a single variant by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param variantId - Identifier of the variant @returns Promise resolving to a VariantResponse object @throws ErrorResponse if the request fails

**remove**(collectionId: string, productId: string, variantId: string) → `void`
Get a single variant by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param variantId - Identifier of the variant @returns Promise resolving to a VariantResponse object @throws ErrorResponse if the request fails

**getPublic**(collectionId: string, productId: string, variantId: string) → `VariantResponse`
Get a single variant by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param variantId - Identifier of the variant @returns Promise resolving to a VariantResponse object @throws ErrorResponse if the request fails

**getSN**(collectionId: string, productId: string, variantId: string, startIndex: number = 0, count: number = 10) → `any`
Get a single variant by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param variantId - Identifier of the variant @returns Promise resolving to a VariantResponse object @throws ErrorResponse if the request fails

**lookupSN**(collectionId: string, productId: string, variantId: string, codeId: string) → `any`
Get a single variant by ID for a collection and product (admin only). @param collectionId - Identifier of the parent collection @param productId - Identifier of the parent product @param variantId - Identifier of the variant @returns Promise resolving to a VariantResponse object @throws ErrorResponse if the request fails

