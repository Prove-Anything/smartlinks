## Table of contents

### Functions

- [create](batch.md#create)
- [get](batch.md#get)
- [getPublic](batch.md#getpublic)
- [list](batch.md#list)
- [remove](batch.md#remove)
- [update](batch.md#update)

## Functions

### create

▸ **create**(`collectionId`, `productId`, `data`): `Promise`\<[`BatchResponse`](../modules.md#batchresponse)\>

Create a new batch for a collection and product (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |
| `data` | `any` | Batch creation data |

#### Returns

`Promise`\<[`BatchResponse`](../modules.md#batchresponse)\>

Promise resolving to a BatchResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/batch.ts:53

___

### get

▸ **get**(`collectionId`, `productId`, `batchId`): `Promise`\<[`BatchResponse`](../modules.md#batchresponse)\>

Get a single batch by ID for a collection and product (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |
| `batchId` | `string` | Identifier of the batch |

#### Returns

`Promise`\<[`BatchResponse`](../modules.md#batchresponse)\>

Promise resolving to a BatchResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/batch.ts:15

___

### getPublic

▸ **getPublic**(`collectionId`, `productId`, `batchId`): `Promise`\<[`BatchResponse`](../modules.md#batchresponse)\>

Get a single batch by ID for a collection and product (public endpoint).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |
| `batchId` | `string` | Identifier of the batch |

#### Returns

`Promise`\<[`BatchResponse`](../modules.md#batchresponse)\>

Promise resolving to a BatchResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/batch.ts:117

___

### list

▸ **list**(`collectionId`, `productId`): `Promise`\<[`BatchResponse`](../modules.md#batchresponse)[]\>

List all batches for a collection and product (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |

#### Returns

`Promise`\<[`BatchResponse`](../modules.md#batchresponse)[]\>

Promise resolving to an array of BatchResponse objects

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/batch.ts:35

___

### remove

▸ **remove**(`collectionId`, `productId`, `batchId`): `Promise`\<`void`\>

Delete a batch for a collection and product (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |
| `batchId` | `string` | Identifier of the batch |

#### Returns

`Promise`\<`void`\>

Promise resolving to void

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/batch.ts:95

___

### update

▸ **update**(`collectionId`, `productId`, `batchId`, `data`): `Promise`\<[`BatchResponse`](../modules.md#batchresponse)\>

Update a batch for a collection and product (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | Identifier of the parent collection |
| `productId` | `string` | Identifier of the parent product |
| `batchId` | `string` | Identifier of the batch |
| `data` | `any` | Batch update data |

#### Returns

`Promise`\<[`BatchResponse`](../modules.md#batchresponse)\>

Promise resolving to a BatchResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

api/batch.ts:73
