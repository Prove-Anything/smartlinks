## Table of contents

### Functions

- [get](product.md#get)
- [list](product.md#list)

## Functions

### get

▸ **get**(`collectionId`, `productId`): `Promise`\<[`ProductResponse`](../interfaces/ProductResponse.md)\>

Retrieves a single Product Item by Collection ID and Product ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | – Identifier of the parent collection |
| `productId` | `string` | – Identifier of the product item |

#### Returns

`Promise`\<[`ProductResponse`](../interfaces/ProductResponse.md)\>

Promise resolving to a ProductResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

[api/product.ts:13](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/product.ts#L13)

___

### list

▸ **list**(`collectionId`): `Promise`\<[`ProductResponse`](../interfaces/ProductResponse.md)[]\>

List all Product Items for a Collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | – Identifier of the parent collection |

#### Returns

`Promise`\<[`ProductResponse`](../interfaces/ProductResponse.md)[]\>

Promise resolving to an array of ProductResponse objects

**`Throws`**

ErrorResponse if the request fails

#### Defined in

[api/product.ts:29](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/product.ts#L29)
