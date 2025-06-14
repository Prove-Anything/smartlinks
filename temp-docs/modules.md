## Table of contents

### Namespaces

- [appConfiguration](modules/appConfiguration.md)
- [asset](modules/asset.md)
- [attestation](modules/attestation.md)
- [auth](modules/auth.md)
- [collection](modules/collection.md)
- [product](modules/product.md)
- [proof](modules/proof.md)

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
- [LoginResponse](modules.md#loginresponse)
- [VerifyTokenResponse](modules.md#verifytokenresponse)

### Functions

- [initializeApi](modules.md#initializeapi)
- [request](modules.md#request)

## Type Aliases

### AccountInfoResponse

Ƭ **AccountInfoResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `Record`\<`string`, `any`\> |
| `location` | `Record`\<`string`, `any`\> |
| `owner` | `Record`\<`string`, `any`\> |
| `user` | `Record`\<`string`, `any`\> |

#### Defined in

[api/auth.ts:19](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L19)

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

[api/appConfiguration.ts:4](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L4)

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

[api/auth.ts:3](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L3)

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

[api/auth.ts:11](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L11)

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

[http.ts:20](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L20)

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

[http.ts:96](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L96)
