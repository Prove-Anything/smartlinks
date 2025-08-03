# Smartlinks API Summary

This is a concise summary of all available API functions and types.

## API Namespaces

The Smartlinks SDK is organized into the following namespaces:

- **appConfiguration** - Application configuration and settings management
- **appRecord** - Functions for appRecord operations
- **asset** - File upload and asset management for collections, products, and proofs
- **attestation** - Digital attestations and verification for products
- **auth** - Authentication, login, and user account management
- **batch** - Product batch management and tracking
- **claimSet** - Claim creation, management, and verification
- **collection** - Collection CRUD operations and management
- **crate** - Container/crate management for organizing products
- **form** - Dynamic form creation and submission
- **product** - Product CRUD operations and management within collections
- **proof** - Product proof retrieval and validation
- **serialNumber** - Functions for serialNumber operations
- **variant** - Product variant management and tracking

## HTTP Utilities

Core HTTP functions for API configuration and communication:

**initializeApi**(options: {
  baseURL: string
  apiKey?: string
  bearerToken?: string
  proxyMode?: boolean
}) → `void`
Call this once (e.g. at app startup) to configure baseURL/auth.

**setBearerToken**(token: string | undefined) → `void`
Allows setting the bearerToken at runtime (e.g. after login/logout).

**request**(path: string) → `Promise<T>`
Internal helper that performs a GET request to \`\${baseURL}\${path}\`, injecting headers for apiKey or bearerToken if present. Returns the parsed JSON as T, or throws an Error.

**post**(path: string,
  body: any,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a POST request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. If body is FormData, Content-Type is not set. Returns the parsed JSON as T, or throws an Error.

**put**(path: string,
  body: any,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a PUT request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. If body is FormData, Content-Type is not set. Returns the parsed JSON as T, or throws an Error.

**requestWithOptions**(path: string,
  options: RequestInit) → `Promise<T>`
Internal helper that performs a request to `${baseURL}${path}` with custom options, injecting headers for apiKey or bearerToken if present. Returns the parsed JSON as T, or throws an Error.

**del**(path: string,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a DELETE request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. Returns the parsed JSON as T, or throws an Error.

**getApiHeaders**() → `Record<string, string>`
Returns the common headers used for API requests, including apiKey and bearerToken if set.

**sendCustomProxyMessage**(request: string, params: any) → `Promise<T>`
Sends a custom proxy message to the parent Smartlinks application when running in an iframe. This function is used to communicate with the parent window when the SDK is embedded in an iframe and proxyMode is enabled. It sends a message to the parent and waits for a response.

## Types

### appConfiguration

**AppConfigurationResponse** (interface)
```typescript
interface AppConfigurationResponse {
  id: string
  name: string
  settings?: Record<string, any>
}
```

### asset

**AssetResponse** (interface)
```typescript
interface AssetResponse {
  id: string
  name: string
  url: string
}
```

### attestation

**AttestationResponse** (interface)
```typescript
interface AttestationResponse {
  id: string
  createdAt: string
  updatedAt: string
  public: Record<string, any>
  private: Record<string, any>
  proof: Record<string, any>
}
```

**AttestationCreateRequest** (interface)
```typescript
interface AttestationCreateRequest {
  public: Record<string, any>
  private: Record<string, any>
  proof: Record<string, any>
}
```

**AttestationUpdateRequest** (interface)
```typescript
interface AttestationUpdateRequest {
  type?: string
  data?: Record<string, any>
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
  id: string
  title: string
  description: string
  headerImage?: {
  url: string
  thumbnails: {
  x100: string
  x200: string
  x512: string
  }
  }
  logoImage?: {
  url: string
  thumbnails: {
  x100: string
  x200: string
  x512: string
  }
  }
  loaderImage?: {
  overwriteName: string
  name: string
  type: string
  url: string
  }
  languages?: {
  code: string
  lang: string
  supported: boolean
  }[],
  roles: {
  [userId: string]: string
  }
  groupTags?: string[]
  redirectUrl?: string
  shortId: string,
  dark?: boolean
}
```

### error

**ErrorResponse** (interface)
```typescript
interface ErrorResponse {
  code: number
  message: string
}
```

### product

**ProductResponse** (interface)
```typescript
interface ProductResponse {
  id: string
  name: string
  collectionId: string
  description: string
  heroImage: {
  url: string
  thumbnails: {
  x100: string
  x200: string
  x512: string
  }
  }
  groupTags: {
  [tagName: string]: boolean
  }
  data: {
  [key: string]: any
  }
}
```

### proof

**ProofResponse** (interface)
```typescript
interface ProofResponse {
  collectionId: string
  createdAt: string
  id: string
  productId: string
  tokenId: string
  userId: string
  values: Record<string, any>
}
```

### variant

**VariantResponse** = `any`

**VariantCreateRequest** = `any`

**VariantUpdateRequest** = `any`

**AppConfigOptions** = `{
  appId: string
  collectionId?: string
  productId?: string
  variantId?: string
  batchId?: string
  itemId?: string
  user?: boolean
  userData?: boolean
  admin?: boolean
  config?: any
  data?: any
}`

### auth

**LoginResponse** = `{
  id: string
  name: string
  email: string
  bearerToken: string
  account: Record<string, any>
}`

**VerifyTokenResponse** = `{
  valid: boolean
  id?: string
  name?: string
  email?: string
  account?: Record<string, any>
}`

**AccountInfoResponse** = `{
  accessType: string;
  analyticsCode: string;
  analyticsId: string;
  auth_time: number;
  baseCollectionId: string;
  clientType: string;
  email: string;
  email_verified: boolean;
  features: {
    actionLogger: boolean;
    adminCollections: boolean;
    adminApps: boolean;
    apiKeys: boolean;
    adminUsers: boolean;
    [key: string]: boolean;
  };
  iat: number;
  id: string;
  iss: string;
  location: string | null;
  name: string;
  picture: string;
  sites: {
    [siteName: string]: boolean;
  };
  sub: string;
  uid: string;
  user_id: string;
  whitelabel: {
    [key: string]: any;
  }
}`

## API Functions

### appConfiguration

**getConfig**(opts: AppConfigOptions) → `Promise<any>`

**setConfig**(opts: AppConfigOptions) → `Promise<any>`

**deleteConfig**(opts: AppConfigOptions) → `Promise<void>`

**getData**(opts: AppConfigOptions) → `Promise<any[]>`

**getDataItem**(opts: AppConfigOptions) → `Promise<any>`

**setDataItem**(opts: AppConfigOptions) → `Promise<any>`

**deleteDataItem**(opts: AppConfigOptions) → `Promise<void>`

**getConfig**(opts: AppConfigOptions) → `Promise<any>`

**setConfig**(opts: AppConfigOptions) → `Promise<any>`

**deleteConfig**(opts: AppConfigOptions) → `Promise<void>`

**getData**(opts: AppConfigOptions) → `Promise<any[]>`

**getDataItem**(opts: AppConfigOptions) → `Promise<any>`

**setDataItem**(opts: AppConfigOptions) → `Promise<any>`

**deleteDataItem**(opts: AppConfigOptions) → `Promise<void>`

### appRecord

**get**(collectionId: string, appId: string) → `Promise<any>`

**create**(collectionId: string, appId: string, data: any) → `Promise<any>`

**update**(collectionId: string, appId: string, data: any) → `Promise<any>`

**remove**(collectionId: string, appId: string) → `Promise<void>`

**get**(collectionId: string, appId: string) → `Promise<any>`

**create**(collectionId: string, appId: string, data: any) → `Promise<any>`

**update**(collectionId: string, appId: string, data: any) → `Promise<any>`

**remove**(collectionId: string, appId: string) → `Promise<void>`

### asset

**getForCollection**(collectionId: string,
    assetId: string) → `Promise<AssetResponse>`

**listForCollection**(collectionId: string) → `Promise<AssetResponse[]>`

**getForProduct**(collectionId: string,
    productId: string,
    assetId: string) → `Promise<AssetResponse>`

**listForProduct**(collectionId: string,
    productId: string) → `Promise<AssetResponse[]>`

**getForProof**(collectionId: string,
    productId: string,
    proofId: string,
    assetId: string) → `Promise<AssetResponse>`

**listForProof**(collectionId: string,
    productId: string,
    proofId: string,
    appId?: string) → `Promise<AssetResponse[]>`

**uploadAsset**(collectionId: string,
    productId: string,
    proofId: string,
    file: File,
    extraData?: Record<string, any>,
    onProgress?: (percent: number) → `void`
Uploads an asset file to a proof, with optional extraData as JSON. Supports progress reporting via onProgress callback (browser only).

**getForCollection**(collectionId: string,
    assetId: string) → `Promise<AssetResponse>`

**listForCollection**(collectionId: string) → `Promise<AssetResponse[]>`

**getForProduct**(collectionId: string,
    productId: string,
    assetId: string) → `Promise<AssetResponse>`

**listForProduct**(collectionId: string,
    productId: string) → `Promise<AssetResponse[]>`

**getForProof**(collectionId: string,
    productId: string,
    proofId: string,
    assetId: string) → `Promise<AssetResponse>`

**listForProof**(collectionId: string,
    productId: string,
    proofId: string,
    appId?: string) → `Promise<AssetResponse[]>`

**uploadAsset**(collectionId: string,
    productId: string,
    proofId: string,
    file: File,
    extraData?: Record<string, any>,
    onProgress?: (percent: number) → `void`
Uploads an asset file to a proof, with optional extraData as JSON. Supports progress reporting via onProgress callback (browser only).

### attestation

**list**(collectionId: string,
    productId: string,
    proofId: string) → `Promise<AttestationResponse[]>`
List all attestations for a proof.

**get**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string) → `Promise<AttestationResponse>`
Get a single attestation by ID.

**create**(collectionId: string,
    productId: string,
    proofId: string,
    data: AttestationCreateRequest) → `Promise<AttestationResponse>`
Create a new attestation for a proof.

**update**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string,
    data: AttestationUpdateRequest) → `Promise<AttestationResponse>`
Update an attestation.

**remove**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string) → `Promise<void>`
Delete an attestation.

**list**(collectionId: string,
    productId: string,
    proofId: string) → `Promise<AttestationResponse[]>`
List all attestations for a proof.

**get**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string) → `Promise<AttestationResponse>`
Get a single attestation by ID.

**create**(collectionId: string,
    productId: string,
    proofId: string,
    data: AttestationCreateRequest) → `Promise<AttestationResponse>`
Create a new attestation for a proof.

**update**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string,
    data: AttestationUpdateRequest) → `Promise<AttestationResponse>`
Update an attestation.

**remove**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string) → `Promise<void>`
Delete an attestation.

### auth

**login**(email: string, password: string) → `Promise<LoginResponse>`
Login with email and password. Sets the bearerToken for subsequent API calls.

**logout**() → `void`
Logout (clears bearerToken for future API calls).

**verifyToken**(token?: string) → `Promise<VerifyTokenResponse>`
Verifies the current bearerToken (or a provided token). Returns user/account info if valid.

**requestAdminJWT**(collectionId: string) → `Promise<string>`
Requests an admin JWT for the current user and a specific collection Returns JWT if valid.

**requestPublicJWT**(collectionId: string, productId: string, proofId: string) → `Promise<string>`
Requests a JWT for the current user and a specific collection/product/proof Validates if the user has access to the resource, and returns a JWT

**getAccount**() → `Promise<AccountInfoResponse>`
Gets current account information for the logged in user. Returns user, owner, account, and location objects.

**login**(email: string, password: string) → `Promise<LoginResponse>`
Login with email and password. Sets the bearerToken for subsequent API calls.

**logout**() → `void`
Logout (clears bearerToken for future API calls).

**verifyToken**(token?: string) → `Promise<VerifyTokenResponse>`
Verifies the current bearerToken (or a provided token). Returns user/account info if valid.

**requestAdminJWT**(collectionId: string) → `Promise<string>`
Requests an admin JWT for the current user and a specific collection Returns JWT if valid.

**requestPublicJWT**(collectionId: string, productId: string, proofId: string) → `Promise<string>`
Requests a JWT for the current user and a specific collection/product/proof Validates if the user has access to the resource, and returns a JWT

**getAccount**() → `Promise<AccountInfoResponse>`
Gets current account information for the logged in user. Returns user, owner, account, and location objects.

### batch

**get**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<BatchResponse>`
Get a single batch by ID for a collection and product (admin only).

**list**(collectionId: string,
    productId: string) → `Promise<BatchResponse[]>`
List all batches for a collection and product (admin only).

**create**(collectionId: string,
    productId: string,
    data: BatchCreateRequest) → `Promise<BatchResponse>`
Create a new batch for a collection and product (admin only).

**update**(collectionId: string,
    productId: string,
    batchId: string,
    data: BatchUpdateRequest) → `Promise<BatchResponse>`
Update a batch for a collection and product (admin only).

**remove**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<void>`
Delete a batch for a collection and product (admin only).

**getPublic**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<BatchResponse>`
Get a single batch by ID for a collection and product (public endpoint).

**getSN**(collectionId: string,
    productId: string,
    batchId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a batch (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    batchId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a batch (admin only).

**get**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<BatchResponse>`
Get a single batch by ID for a collection and product (admin only).

**list**(collectionId: string,
    productId: string) → `Promise<BatchResponse[]>`
List all batches for a collection and product (admin only).

**create**(collectionId: string,
    productId: string,
    data: BatchCreateRequest) → `Promise<BatchResponse>`
Create a new batch for a collection and product (admin only).

**update**(collectionId: string,
    productId: string,
    batchId: string,
    data: BatchUpdateRequest) → `Promise<BatchResponse>`
Update a batch for a collection and product (admin only).

**remove**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<void>`
Delete a batch for a collection and product (admin only).

**getPublic**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<BatchResponse>`
Get a single batch by ID for a collection and product (public endpoint).

**getSN**(collectionId: string,
    productId: string,
    batchId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a batch (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    batchId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a batch (admin only).

### claimSet

**getAllForCollection**(collectionId: string) → `Promise<any[]>`
Get all claim sets for a collection.

**getForCollection**(collectionId: string, claimSetId: string) → `Promise<any>`
Get a specific claim set for a collection.

**getAllTags**(collectionId: string, claimSetId: string) → `Promise<any[]>`
Get all tags for a claim set.

**getReport**(collectionId: string, claimSetId: string) → `Promise<any>`
Get a report for a claim set.

**getAssignedTags**(collectionId: string, claimSetId: string) → `Promise<any>`
Get assigned tags for a claim set.

**getTagSummary**(collectionId: string) → `Promise<any>`
Get tag summary for a collection.

**tagQuery**(collectionId: string, data: any) → `Promise<any>`
Perform a tag query for a collection.

**createForCollection**(collectionId: string, params: any) → `Promise<any>`
Create a new claim set for a collection.

**updateForCollection**(collectionId: string, params: any) → `Promise<any>`
Update a claim set for a collection.

**makeClaim**(collectionId: string, params: any) → `Promise<any>`
Make a claim for a claim set.

**assignClaims**(collectionId: string, data: any) → `Promise<any>`
Assign claims to a claim set.

**updateClaimData**(collectionId: string, data: any) → `Promise<any>`
Update claim data for a collection.

**getAllForCollection**(collectionId: string) → `Promise<any[]>`
Get all claim sets for a collection.

**getForCollection**(collectionId: string, claimSetId: string) → `Promise<any>`
Get a specific claim set for a collection.

**getAllTags**(collectionId: string, claimSetId: string) → `Promise<any[]>`
Get all tags for a claim set.

**getReport**(collectionId: string, claimSetId: string) → `Promise<any>`
Get a report for a claim set.

**getAssignedTags**(collectionId: string, claimSetId: string) → `Promise<any>`
Get assigned tags for a claim set.

**getTagSummary**(collectionId: string) → `Promise<any>`
Get tag summary for a collection.

**tagQuery**(collectionId: string, data: any) → `Promise<any>`
Perform a tag query for a collection.

**createForCollection**(collectionId: string, params: any) → `Promise<any>`
Create a new claim set for a collection.

**updateForCollection**(collectionId: string, params: any) → `Promise<any>`
Update a claim set for a collection.

**makeClaim**(collectionId: string, params: any) → `Promise<any>`
Make a claim for a claim set.

**assignClaims**(collectionId: string, data: any) → `Promise<any>`
Assign claims to a claim set.

**updateClaimData**(collectionId: string, data: any) → `Promise<any>`
Update claim data for a collection.

### collection

**get**(collectionId: string, admin?: boolean) → `Promise<CollectionResponse>`
Retrieves a single Collection by its ID.

**list**(admin?: boolean) → `Promise<CollectionResponse[]>`
Retrieves all Collections.

**create**(data: any) → `Promise<CollectionResponse>`
Create a new collection (admin only).

**update**(collectionId: string, data: any) → `Promise<CollectionResponse>`
Update a collection (admin only).

**remove**(collectionId: string) → `Promise<void>`
Delete a collection (admin only).

**getSN**(collectionId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a collection (admin only).

**lookupSN**(collectionId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a collection (admin only).

**assignSN**(collectionId: string,
    codeId: string,
    value: any) → `Promise<any>`
Assign a value to a serial number for a collection (admin only).

**get**(collectionId: string, admin?: boolean) → `Promise<CollectionResponse>`
Retrieves a single Collection by its ID.

**list**(admin?: boolean) → `Promise<CollectionResponse[]>`
Retrieves all Collections.

**create**(data: any) → `Promise<CollectionResponse>`
Create a new collection (admin only).

**update**(collectionId: string, data: any) → `Promise<CollectionResponse>`
Update a collection (admin only).

**remove**(collectionId: string) → `Promise<void>`
Delete a collection (admin only).

**getSN**(collectionId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a collection (admin only).

**lookupSN**(collectionId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a collection (admin only).

**assignSN**(collectionId: string,
    codeId: string,
    value: any) → `Promise<any>`
Assign a value to a serial number for a collection (admin only).

### crate

**get**(collectionId: string, crateId: string) → `Promise<any>`
Get a single crate by ID for a collection (admin only).

**list**(collectionId: string) → `Promise<any[]>`
List all crates for a collection (admin only).

**create**(collectionId: string, data: any) → `Promise<any>`
Create a new crate for a collection (admin only).

**update**(collectionId: string, crateId: string, data: any) → `Promise<any>`
Update a crate for a collection (admin only).

**remove**(collectionId: string, crateId: string) → `Promise<void>`
Delete a crate for a collection (admin only).

**get**(collectionId: string, crateId: string) → `Promise<any>`
Get a single crate by ID for a collection (admin only).

**list**(collectionId: string) → `Promise<any[]>`
List all crates for a collection (admin only).

**create**(collectionId: string, data: any) → `Promise<any>`
Create a new crate for a collection (admin only).

**update**(collectionId: string, crateId: string, data: any) → `Promise<any>`
Update a crate for a collection (admin only).

**remove**(collectionId: string, crateId: string) → `Promise<void>`
Delete a crate for a collection (admin only).

### form

**get**(collectionId: string, formId: string, admin?: boolean) → `Promise<any>`
Get a single form by ID for a collection.

**list**(collectionId: string, admin?: boolean) → `Promise<any[]>`
List all forms for a collection.

**create**(collectionId: string, data: any) → `Promise<any>`
Create a new form for a collection (admin only).

**update**(collectionId: string, formId: string, data: any) → `Promise<any>`
Update a form for a collection (admin only).

**remove**(collectionId: string, formId: string) → `Promise<void>`
Delete a form for a collection (admin only).

**get**(collectionId: string, formId: string, admin?: boolean) → `Promise<any>`
Get a single form by ID for a collection.

**list**(collectionId: string, admin?: boolean) → `Promise<any[]>`
List all forms for a collection.

**create**(collectionId: string, data: any) → `Promise<any>`
Create a new form for a collection (admin only).

**update**(collectionId: string, formId: string, data: any) → `Promise<any>`
Update a form for a collection (admin only).

**remove**(collectionId: string, formId: string) → `Promise<void>`
Delete a form for a collection (admin only).

### product

**get**(collectionId: string,
    productId: string,
    admin?: boolean) → `Promise<ProductResponse>`
Retrieves a single Product Item by Collection ID and Product ID.

**list**(collectionId: string,
    admin?: boolean) → `Promise<ProductResponse[]>`
List all Product Items for a Collection.

**create**(collectionId: string,
    data: any) → `Promise<ProductResponse>`
Create a new product for a collection (admin only).

**update**(collectionId: string,
    productId: string,
    data: any) → `Promise<ProductResponse>`
Update a product for a collection (admin only).

**remove**(collectionId: string,
    productId: string) → `Promise<void>`
Delete a product for a collection (admin only).

**getSN**(collectionId: string,
    productId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a product (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a product (admin only).

**get**(collectionId: string,
    productId: string,
    admin?: boolean) → `Promise<ProductResponse>`
Retrieves a single Product Item by Collection ID and Product ID.

**list**(collectionId: string,
    admin?: boolean) → `Promise<ProductResponse[]>`
List all Product Items for a Collection.

**create**(collectionId: string,
    data: any) → `Promise<ProductResponse>`
Create a new product for a collection (admin only).

**update**(collectionId: string,
    productId: string,
    data: any) → `Promise<ProductResponse>`
Update a product for a collection (admin only).

**remove**(collectionId: string,
    productId: string) → `Promise<void>`
Delete a product for a collection (admin only).

**getSN**(collectionId: string,
    productId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a product (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a product (admin only).

### proof

**get**(collectionId: string,
    proofId: string) → `Promise<ProofResponse>`
Retrieves a single Proof by Collection ID and Proof ID.

**list**(collectionId: string) → `Promise<ProofResponse[]>`
List all Proofs for a Collection.

**get**(collectionId: string,
    proofId: string) → `Promise<ProofResponse>`
Retrieves a single Proof by Collection ID and Proof ID.

**list**(collectionId: string) → `Promise<ProofResponse[]>`
List all Proofs for a Collection.

### variant

**get**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<VariantResponse>`
Get a single variant by ID for a collection and product (admin only).

**list**(collectionId: string,
    productId: string) → `Promise<VariantResponse[]>`
List all variants for a collection and product (admin only).

**create**(collectionId: string,
    productId: string,
    data: VariantCreateRequest) → `Promise<VariantResponse>`
Create a new variant for a collection and product (admin only).

**update**(collectionId: string,
    productId: string,
    variantId: string,
    data: VariantUpdateRequest) → `Promise<VariantResponse>`
Update a variant for a collection and product (admin only).

**remove**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<void>`
Delete a variant for a collection and product (admin only).

**getPublic**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<VariantResponse>`
Get a single variant by ID for a collection and product (public endpoint).

**getSN**(collectionId: string,
    productId: string,
    variantId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a variant (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    variantId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a variant (admin only).

**get**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<VariantResponse>`
Get a single variant by ID for a collection and product (admin only).

**list**(collectionId: string,
    productId: string) → `Promise<VariantResponse[]>`
List all variants for a collection and product (admin only).

**create**(collectionId: string,
    productId: string,
    data: VariantCreateRequest) → `Promise<VariantResponse>`
Create a new variant for a collection and product (admin only).

**update**(collectionId: string,
    productId: string,
    variantId: string,
    data: VariantUpdateRequest) → `Promise<VariantResponse>`
Update a variant for a collection and product (admin only).

**remove**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<void>`
Delete a variant for a collection and product (admin only).

**getPublic**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<VariantResponse>`
Get a single variant by ID for a collection and product (public endpoint).

**getSN**(collectionId: string,
    productId: string,
    variantId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a variant (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    variantId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a variant (admin only).

