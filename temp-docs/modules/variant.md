## Table of contents

### Functions

- [create](variant.md#create)
- [get](variant.md#get)
- [getPublic](variant.md#getpublic)
- [list](variant.md#list)
- [remove](variant.md#remove)
- [update](variant.md#update)

## Functions

### create

▸ **create**(`collectionId`, `productId`, `data`): `Promise`\<[`VariantResponse`](../modules.md#variantresponse)\>

Create a new variant for a collection and product (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |
| `data` | `any` | Variant creation data |

#### Returns

`Promise`\<[`VariantResponse`](../modules.md#variantresponse)\>

Promise resolving to a VariantResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/variant.ts:53

___

### get

▸ **get**(`collectionId`, `productId`, `variantId`): `Promise`\<[`VariantResponse`](../modules.md#variantresponse)\>

Get a single variant by ID for a collection and product (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |
| `variantId` | `string` | Identifier of the variant |

#### Returns

`Promise`\<[`VariantResponse`](../modules.md#variantresponse)\>

Promise resolving to a VariantResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/variant.ts:15

___

### getPublic

▸ **getPublic**(`collectionId`, `productId`, `variantId`): `Promise`\<[`VariantResponse`](../modules.md#variantresponse)\>

Get a single variant by ID for a collection and product (public endpoint).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |
| `variantId` | `string` | Identifier of the variant |

#### Returns

`Promise`\<[`VariantResponse`](../modules.md#variantresponse)\>

Promise resolving to a VariantResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/variant.ts:117

___

### list

▸ **list**(`collectionId`, `productId`): `Promise`\<[`VariantResponse`](../modules.md#variantresponse)[]\>

List all variants for a collection and product (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |

#### Returns

`Promise`\<[`VariantResponse`](../modules.md#variantresponse)[]\>

Promise resolving to an array of VariantResponse objects

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/variant.ts:35

___

### remove

▸ **remove**(`collectionId`, `productId`, `variantId`): `Promise`\<`void`\>

Delete a variant for a collection and product (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |
| `variantId` | `string` | Identifier of the variant |

#### Returns

`Promise`\<`void`\>

Promise resolving to void

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/variant.ts:95

___

### update

▸ **update**(`collectionId`, `productId`, `variantId`, `data`): `Promise`\<[`VariantResponse`](../modules.md#variantresponse)\>

Update a variant for a collection and product (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |
| `variantId` | `string` | Identifier of the variant |
| `data` | `any` | Variant update data |

#### Returns

`Promise`\<[`VariantResponse`](../modules.md#variantresponse)\>

Promise resolving to a VariantResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/variant.ts:73
