## Table of contents

### Functions

- [get](collection.md#get)
- [list](collection.md#list)

## Functions

### get

▸ **get**(`collectionId`, `admin?`): `Promise`\<[`CollectionResponse`](../interfaces/CollectionResponse.md)\>

Retrieves a single Collection by its ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | – Identifier of the collection |
| `admin?` | `boolean` | – If true, fetches from the admin endpoint |

#### Returns

`Promise`\<[`CollectionResponse`](../interfaces/CollectionResponse.md)\>

Promise resolving to a CollectionResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

[api/collection.ts:13](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/collection.ts#L13)

___

### list

▸ **list**(`admin?`): `Promise`\<[`CollectionResponse`](../interfaces/CollectionResponse.md)[]\>

Retrieves all Collections.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `admin?` | `boolean` | – If true, fetches from the admin endpoint |

#### Returns

`Promise`\<[`CollectionResponse`](../interfaces/CollectionResponse.md)[]\>

Promise resolving to an array of CollectionResponse objects

**`Throws`**

ErrorResponse if the request fails

#### Defined in

[api/collection.ts:25](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/collection.ts#L25)
