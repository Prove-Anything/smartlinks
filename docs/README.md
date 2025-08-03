# Smartlinks SDK Documentation

## Table of contents

### Namespaces

- [appConfiguration](modules/appConfiguration.md)
- [appRecord](modules/appRecord.md)
- [asset](modules/asset.md)
- [attestation](modules/attestation.md)
- [auth](modules/auth.md)
- [batch](modules/batch.md)
- [claimSet](modules/claimSet.md)
- [collection](modules/collection.md)
- [crate](modules/crate.md)
- [form](modules/form.md)
- [product](modules/product.md)
- [proof](modules/proof.md)
- [variant](modules/variant.md)

### Interfaces

- [AppConfigurationResponse](interfaces/AppConfigurationResponse.md)
- [AssetResponse](interfaces/AssetResponse.md)
- [AttestationResponse](interfaces/AttestationResponse.md)
- [AttestationCreateRequest](interfaces/AttestationCreateRequest.md)
- [AttestationUpdateRequest](interfaces/AttestationUpdateRequest.md)
- [CollectionResponse](interfaces/CollectionResponse.md)
- [ErrorResponse](interfaces/ErrorResponse.md)
- [ProductResponse](interfaces/ProductResponse.md)
- [ProofResponse](interfaces/ProofResponse.md)

### Type Aliases

- [AppConfigOptions](modules.md#appconfigoptions)
- [LoginResponse](modules.md#loginresponse)
- [VerifyTokenResponse](modules.md#verifytokenresponse)
- [AccountInfoResponse](modules.md#accountinforesponse)
- [BatchResponse](modules.md#batchresponse)
- [BatchCreateRequest](modules.md#batchcreaterequest)
- [BatchUpdateRequest](modules.md#batchupdaterequest)
- [VariantResponse](modules.md#variantresponse)
- [VariantCreateRequest](modules.md#variantcreaterequest)
- [VariantUpdateRequest](modules.md#variantupdaterequest)

### Functions

- [initializeApi](modules.md#initializeapi)
- [request](modules.md#request)
- [sendCustomProxyMessage](modules.md#sendcustomproxymessage)

## Type Aliases

### AppConfigOptions

Ƭ **AppConfigOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `appId` | `string` |
| `collectionId?` | `string` |
| `productId?` | `string` |
| `variantId?` | `string` |
| `batchId?` | `string` |
| `itemId?` | `string` |
| `user?` | `boolean` |
| `userData?` | `boolean` |
| `admin?` | `boolean` |
| `config?` | `any` |
| `data?` | `any` |

___

### LoginResponse

Ƭ **LoginResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `name` | `string` |
| `email` | `string` |
| `bearerToken` | `string` |
| `account` | `Record`\<`string`, `any`\> |

___

### VerifyTokenResponse

Ƭ **VerifyTokenResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `valid` | `boolean` |
| `id?` | `string` |
| `name?` | `string` |
| `email?` | `string` |
| `account?` | `Record`\<`string`, `any`\> |

___

### AccountInfoResponse

Ƭ **AccountInfoResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `jwtToken` | `string` |
| `jwtExpiry` | `number` |
| `accessType` | `string` |
| `analyticsCode` | `string` |
| `analyticsId` | `string` |
| `auth_time` | `number` |
| `baseCollectionId` | `string` |
| `clientType` | `string` |
| `email` | `string` |
| `email_verified` | `boolean` |
| `features` | \{ `[key: string]`: `boolean`; `actionLogger`: `boolean` ; `adminCollections`: `boolean` ; `adminApps`: `boolean` ; `apiKeys`: `boolean` ; `adminUsers`: `boolean`  } |
| `features.actionLogger` | `boolean` |
| `features.adminCollections` | `boolean` |
| `features.adminApps` | `boolean` |
| `features.apiKeys` | `boolean` |
| `features.adminUsers` | `boolean` |
| `iat` | `number` |
| `id` | `string` |
| `iss` | `string` |
| `location` | `string` \| ``null`` |
| `name` | `string` |
| `picture` | `string` |
| `sites` | \{ `[siteName: string]`: `boolean`;  } |
| `sub` | `string` |
| `uid` | `string` |
| `user_id` | `string` |
| `whitelabel` | \{ `[key: string]`: `any`;  } |

___

### BatchResponse

Ƭ **BatchResponse**: `any`

Represents a Batch object.

___

### BatchCreateRequest

Ƭ **BatchCreateRequest**: `any`

Request payload for creating a new batch.

___

### BatchUpdateRequest

Ƭ **BatchUpdateRequest**: `any`

Request payload for updating an existing batch.

___

### VariantResponse

Ƭ **VariantResponse**: `any`

Represents a Variant object.

___

### VariantCreateRequest

Ƭ **VariantCreateRequest**: `any`

Request payload for creating a new variant.

___

### VariantUpdateRequest

Ƭ **VariantUpdateRequest**: `any`

Request payload for updating an existing variant.

## Functions

### initializeApi

▸ **initializeApi**(`options`): `void`

Call this once (e.g. at app startup) to configure baseURL/auth.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | Configuration options |
| `options.baseURL` | `string` | - |
| `options.apiKey?` | `string` | - |
| `options.bearerToken?` | `string` | - |
| `options.proxyMode?` | `boolean` | - |

#### Returns

`void`

___

### request

▸ **request**\<`T`\>(`path`): `Promise`\<`T`\>

Internal helper that performs a GET request to `\${baseURL}\${path}`, 
injecting headers for apiKey or bearerToken if present. 
Returns the parsed JSON as T, or throws an Error.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`\<`T`\>

___

### sendCustomProxyMessage

▸ **sendCustomProxyMessage**\<`T`\>(`request`, `params`): `Promise`\<`T`\>

Sends a custom proxy message to the parent Smartlinks application when running in an iframe.
This function is used to communicate with the parent window when the SDK is embedded in an iframe
and proxyMode is enabled. It sends a message to the parent and waits for a response.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | `string` | The request type string to identify the message type |
| `params` | `any` | The parameters object containing data to send to the parent |

#### Returns

`Promise`\<`T`\>

The data from the proxy response



Official JavaScript/TypeScript SDK for the Smartlinks API - enabling digital product authentication, traceability, and engagement.

## Installation

```bash
npm install @proveanything/smartlinks
```

## Quick Start

```typescript
import { initializeApi, auth, collection, product } from '@proveanything/smartlinks'

// Initialize the SDK
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1'
})

// Login
const loginResponse = await auth.login('email@example.com', 'password')

// Get collections
const collections = await collection.list(true) // admin endpoint

// Get products in a collection
const products = await product.list('collection-id', true)

// Get a specific product
const productDetail = await product.get('collection-id', 'product-id')
```

## Configuration

### Basic Setup

```typescript
import { initializeApi } from '@proveanything/smartlinks'

// Initialize with base URL
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1'
})

// Or with API key for server-side usage
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  apiKey: 'your-api-key'
})

// For iframe/embedded usage
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  proxyMode: true
})
```

### Runtime Token Management

```typescript
import { setBearerToken } from '@proveanything/smartlinks'

// Set token after login
setBearerToken('your-bearer-token')

// Clear token on logout
setBearerToken(undefined)
```

## Authentication

```typescript
import { auth } from '@proveanything/smartlinks'

// Login with email/password
const response = await auth.login('user@example.com', 'password')
console.log(response.bearerToken) // Token is automatically set for future calls

// Verify current token
const userInfo = await auth.verifyToken()

// Get account information
const account = await auth.getAccount()

// Logout (clears token)
auth.logout()
```

## Working with Collections

Collections are the top-level containers for organizing products.

```typescript
import { collection } from '@proveanything/smartlinks'

// Get all collections (public)
const publicCollections = await collection.list(false)

// Get all collections (admin - requires authentication)
const adminCollections = await collection.list(true)

// Get specific collection
const col = await collection.get('collection-id', true)

// Create collection (admin only)
const newCollection = await collection.create({
  title: 'New Collection',
  description: 'Collection description'
})

// Update collection (admin only) 
await collection.update('collection-id', { 
  title: 'Updated Title' 
})

// Delete collection (admin only)
await collection.remove('collection-id')
```

### Serial Number Management

```typescript
// Get serial numbers for a collection
const serialNumbers = await collection.getSN('collection-id', 0, 10)

// Look up a specific serial number
const lookupResult = await collection.lookupSN('collection-id', 'serial-code')

// Assign a value to a serial number
await collection.assignSN('collection-id', 'serial-code', 'assigned-value')
```

## Working with Products

Products represent individual items within collections.

```typescript
import { product } from '@proveanything/smartlinks'

// List products in collection (public)
const publicProducts = await product.list('collection-id', false)

// List products in collection (admin)
const adminProducts = await product.list('collection-id', true)

// Get specific product
const prod = await product.get('collection-id', 'product-id')

// Create product (admin only)
const newProduct = await product.create('collection-id', {
  name: 'New Product',
  description: 'Product description',
  data: {
    custom: 'properties'
  }
})

// Update product (admin only)
await product.update('collection-id', 'product-id', { 
  name: 'Updated Name' 
})

// Delete product (admin only)
await product.remove('collection-id', 'product-id')
```

### Product Serial Numbers

```typescript
// Get serial numbers for a product
const serialNumbers = await product.getSN('collection-id', 'product-id', 0, 10)

// Look up a serial number for a product
const lookupResult = await product.lookupSN('collection-id', 'product-id', 'serial-code')
```

## Variants and Batches

Manage product variants and production batches:

```typescript
import { variant, batch } from '@proveanything/smartlinks'

// Work with variants
const variants = await variant.list('collection-id', 'product-id')
const newVariant = await variant.create('collection-id', 'product-id', {
  name: 'Size Large',
  properties: { size: 'L', color: 'blue' }
})

// Work with batches  
const batches = await batch.list('collection-id', 'product-id')
const newBatch = await batch.create('collection-id', 'product-id', {
  name: 'Batch 001',
  quantity: 100
})

// Serial numbers for variants/batches
const variantSerials = await variant.getSN('collection-id', 'product-id', 'variant-id')
const batchSerials = await batch.getSN('collection-id', 'product-id', 'batch-id')
```

## Asset Management

Upload and manage files associated with collections, products, and proofs:

```typescript
import { asset } from '@proveanything/smartlinks'

// Upload asset to a proof
const file = document.getElementById('fileInput').files[0]
const uploadResult = await asset.uploadAsset(
  'collection-id', 
  'product-id', 
  'proof-id', 
  file,
  { description: 'Product image' }, // Optional extra data
  (percent) => console.log(`Upload: ${percent}%`) // Progress callback
)

// Get asset information
const assetInfo = await asset.getForProof('collection-id', 'product-id', 'proof-id', 'asset-id')

// List all assets for a proof
const proofAssets = await asset.listForProof('collection-id', 'product-id', 'proof-id')
```

## Attestations and Claims

Manage digital attestations and claim verification:

```typescript
import { attestation, claimSet } from '@proveanything/smartlinks'

// Work with attestations
const attestations = await attestation.list('collection-id', 'product-id', 'proof-id')
const newAttestation = await attestation.create('collection-id', 'product-id', 'proof-id', {
  public: { verified: true },
  private: { inspector: 'John Doe' },
  proof: { signature: 'abc123' }
})

// Work with claim sets
const claimSets = await claimSet.getAllForCollection('collection-id')
const claimResult = await claimSet.makeClaim('collection-id', {
  productId: 'product-id',
  claimType: 'ownership'
})
```

## Proofs

Retrieve and validate product proofs:

```typescript
import { proof } from '@proveanything/smartlinks'

// Get all proofs for a collection
const proofs = await proof.list('collection-id')

// Get specific proof
const proofDetail = await proof.get('collection-id', 'proof-id')
```

## Forms

Dynamic form creation and management:

```typescript
import { form } from '@proveanything/smartlinks'

// List forms (public)
const publicForms = await form.list('collection-id', false)

// List forms (admin)
const adminForms = await form.list('collection-id', true)

// Create form (admin only)
const newForm = await form.create('collection-id', {
  name: 'Product Registration',
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'name', type: 'text', required: true }
  ]
})
```

## Advanced Usage

### Proxy Mode (iframe Communication)

When running in an iframe, use proxy mode to communicate with the parent window:

```typescript
import { initializeApi, sendCustomProxyMessage } from '@proveanything/smartlinks'

// Initialize in proxy mode
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  proxyMode: true
})

// Send custom messages to parent window
const response = await sendCustomProxyMessage('custom-action', {
  data: 'any-data'
})
```

### Custom Configuration

```typescript
import { appConfiguration } from '@proveanything/smartlinks'

// Get configuration
const config = await appConfiguration.getConfig({ key: 'setting-name' })

// Set configuration
await appConfiguration.setConfig({ 
  key: 'setting-name', 
  value: 'setting-value' 
})

// Work with configuration data
const data = await appConfiguration.getData({ category: 'user-preferences' })
```

## Error Handling

```typescript
import { ErrorResponse } from '@proveanything/smartlinks'

try {
  const result = await product.get('collection-id', 'product-id')
} catch (error) {
  if (error instanceof ErrorResponse) {
    console.error('API Error:', error.message)
    console.error('Status Code:', error.code)
  } else {
    console.error('Unexpected error:', error)
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions:

```typescript
import { 
  ProductResponse, 
  CollectionResponse, 
  AttestationCreateRequest 
} from '@proveanything/smartlinks'

const product: ProductResponse = await product.get('col-id', 'prod-id')
const collection: CollectionResponse = await collection.get('col-id')

const attestationData: AttestationCreateRequest = {
  public: { verified: true },
  private: { notes: 'Internal notes' },
  proof: { signature: 'digital-signature' }
}
```

## Admin vs Public Endpoints

Many functions support both admin and public access modes:

```typescript
// Public access (limited data, no authentication required)
const publicCollections = await collection.list(false)
const publicProducts = await product.list('collection-id', false)

// Admin access (full data + management capabilities, authentication required)  
const adminCollections = await collection.list(true)
const adminProducts = await product.list('collection-id', true)

// Create/Update/Delete operations are admin-only
await collection.create(data) // Requires authentication
await product.update('col-id', 'prod-id', data) // Requires authentication
```

## Browser vs Node.js

The SDK works in both browser and Node.js environments:

### Browser Usage

```html
<script type="module">
  import { initializeApi, auth } from '@proveanything/smartlinks'
  
  initializeApi({ baseURL: 'https://smartlinks.app/api/v1' })
  // Use the SDK...
</script>
```

### Node.js Usage

```javascript
const { initializeApi, auth } = require('@proveanything/smartlinks')

initializeApi({ 
  baseURL: 'https://smartlinks.app/api/v1',
  apiKey: process.env.SMARTLINKS_API_KEY 
})
```

## Examples

Check out the [examples](./examples/) directory for complete implementation examples:

- [Node.js Demo](./examples/node-demo.ts) - Server-side usage examples
- [Browser Demo](./examples/browser-demo.html) - Frontend integration examples
- [React Demo](./examples/react-demo.tsx) - React component examples

## API Reference

For complete API documentation including all functions and types, see [API_SUMMARY.md](./API_SUMMARY.md).

## Support

- **Documentation**: [API Reference](./API_SUMMARY.md)
- **Issues**: [GitHub Issues](https://github.com/Prove-Anything/smartlinks/issues)
- **Website**: [smartlinks.app](https://smartlinks.app)

## License

MIT License - see [LICENSE](./LICENSE) for details.


