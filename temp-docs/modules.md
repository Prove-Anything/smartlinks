## Table of contents

### Namespaces

- [appConfiguration](modules/appConfiguration.md)
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
- [AttestationCreateRequest](interfaces/AttestationCreateRequest.md)
- [AttestationResponse](interfaces/AttestationResponse.md)
- [AttestationUpdateRequest](interfaces/AttestationUpdateRequest.md)
- [CollectionResponse](interfaces/CollectionResponse.md)
- [ErrorResponse](interfaces/ErrorResponse.md)
- [ProductResponse](interfaces/ProductResponse.md)
- [ProofResponse](interfaces/ProofResponse.md)

### Type Aliases

- [AccountInfoResponse](modules.md#accountinforesponse)
- [AppConfigOptions](modules.md#appconfigoptions)
- [BatchCreateRequest](modules.md#batchcreaterequest)
- [BatchResponse](modules.md#batchresponse)
- [BatchUpdateRequest](modules.md#batchupdaterequest)
- [LoginResponse](modules.md#loginresponse)
- [VariantCreateRequest](modules.md#variantcreaterequest)
- [VariantResponse](modules.md#variantresponse)
- [VariantUpdateRequest](modules.md#variantupdaterequest)
- [VerifyTokenResponse](modules.md#verifytokenresponse)

### Functions

- [initializeApi](modules.md#initializeapi)
- [request](modules.md#request)
- [sendCustomProxyMessage](modules.md#sendcustomproxymessage)

## Type Aliases

### AccountInfoResponse

Ƭ **AccountInfoResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accessType` | `string` |
| `analyticsCode` | `string` |
| `analyticsId` | `string` |
| `auth_time` | `number` |
| `baseCollectionId` | `string` |
| `clientType` | `string` |
| `email` | `string` |
| `email_verified` | `boolean` |
| `features` | \{ `[key: string]`: `boolean`; `actionLogger`: `boolean` ; `adminApps`: `boolean` ; `adminCollections`: `boolean` ; `adminUsers`: `boolean` ; `apiKeys`: `boolean`  } |
| `features.actionLogger` | `boolean` |
| `features.adminApps` | `boolean` |
| `features.adminCollections` | `boolean` |
| `features.adminUsers` | `boolean` |
| `features.apiKeys` | `boolean` |
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

#### Defined in

[api/auth.ts:19](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/auth.ts#L19)

___

### AppConfigOptions

Ƭ **AppConfigOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `admin?` | `boolean` |
| `appId` | `string` |
| `batchId?` | `string` |
| `collectionId?` | `string` |
| `config?` | `any` |
| `data?` | `any` |
| `itemId?` | `string` |
| `productId?` | `string` |
| `user?` | `boolean` |
| `userData?` | `boolean` |
| `variantId?` | `string` |

#### Defined in

[api/appConfiguration.ts:4](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/appConfiguration.ts#L4)

___

### BatchCreateRequest

Ƭ **BatchCreateRequest**: `any`

Request payload for creating a new batch.

#### Defined in

types/batch.ts:10

___

### BatchResponse

Ƭ **BatchResponse**: `any`

Represents a Batch object.

#### Defined in

types/batch.ts:5

___

### BatchUpdateRequest

Ƭ **BatchUpdateRequest**: `any`

Request payload for updating an existing batch.

#### Defined in

types/batch.ts:15

___

### LoginResponse

Ƭ **LoginResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `Record`\<`string`, `any`\> |
| `bearerToken` | `string` |
| `email` | `string` |
| `id` | `string` |
| `name` | `string` |

#### Defined in

[api/auth.ts:3](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/auth.ts#L3)

___

### VariantCreateRequest

Ƭ **VariantCreateRequest**: `any`

Request payload for creating a new variant.

#### Defined in

types/variant.ts:10

___

### VariantResponse

Ƭ **VariantResponse**: `any`

Represents a Variant object.

#### Defined in

types/variant.ts:5

___

### VariantUpdateRequest

Ƭ **VariantUpdateRequest**: `any`

Request payload for updating an existing variant.

#### Defined in

types/variant.ts:15

___

### VerifyTokenResponse

Ƭ **VerifyTokenResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account?` | `Record`\<`string`, `any`\> |
| `email?` | `string` |
| `id?` | `string` |
| `name?` | `string` |
| `valid` | `boolean` |

#### Defined in

[api/auth.ts:11](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/auth.ts#L11)

## Functions

### initializeApi

▸ **initializeApi**(`options`): `void`

Call this once (e.g. at app startup) to configure baseURL/auth.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | Configuration options |
| `options.apiKey?` | `string` | - |
| `options.baseURL` | `string` | - |
| `options.bearerToken?` | `string` | - |
| `options.proxyMode?` | `boolean` | - |

#### Returns

`void`

#### Defined in

[http.ts:20](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/http.ts#L20)

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

#### Defined in

[http.ts:96](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/http.ts#L96)

___

### sendCustomProxyMessage

▸ **sendCustomProxyMessage**\<`T`\>(`request`, `params`): `Promise`\<`T`\>

Sends a custom proxy message in proxyMode and waits for a matching reply.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | `string` | The request type string |
| `params` | `any` | The parameters object |

#### Returns

`Promise`\<`T`\>

The data from the proxy response

#### Defined in

[http.ts:346](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/http.ts#L346)
