## Table of contents

### Functions

- [get](collection.md#get)

## Functions

### get

▸ **get**(`collectionId`): `Promise`\<[`CollectionResponse`](../interfaces/CollectionResponse.md)\>

Retrieves a single Collection by its ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | – Identifier of the collection |

#### Returns

`Promise`\<[`CollectionResponse`](../interfaces/CollectionResponse.md)\>

Promise resolving to a CollectionResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

[api/collection.ts:12](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/collection.ts#L12)
