## Table of contents

### Functions

- [create](crate.md#create)
- [get](crate.md#get)
- [list](crate.md#list)
- [remove](crate.md#remove)
- [update](crate.md#update)

## Functions

### create

▸ **create**(`collectionId`, `data`): `Promise`\<`any`\>

Create a new crate for a collection (admin only).

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `data` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

api/crate.ts:23

___

### get

▸ **get**(`collectionId`, `crateId`): `Promise`\<`any`\>

Get a single crate by ID for a collection (admin only).

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `crateId` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

api/crate.ts:7

___

### list

▸ **list**(`collectionId`): `Promise`\<`any`[]\>

List all crates for a collection (admin only).

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

api/crate.ts:15

___

### remove

▸ **remove**(`collectionId`, `crateId`): `Promise`\<`void`\>

Delete a crate for a collection (admin only).

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `crateId` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

api/crate.ts:39

___

### update

▸ **update**(`collectionId`, `crateId`, `data`): `Promise`\<`any`\>

Update a crate for a collection (admin only).

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `crateId` | `string` |
| `data` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

api/crate.ts:31
