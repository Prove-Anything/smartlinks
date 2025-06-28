## Table of contents

### Functions

- [create](form.md#create)
- [get](form.md#get)
- [list](form.md#list)
- [remove](form.md#remove)
- [update](form.md#update)

## Functions

### create

▸ **create**(`collectionId`, `data`): `Promise`\<`any`\>

Create a new form for a collection (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | – The collection identifier |
| `data` | `any` | – The form data |

#### Returns

`Promise`\<`any`\>

#### Defined in

api/form.ts:32

___

### get

▸ **get**(`collectionId`, `formId`, `admin?`): `Promise`\<`any`\>

Get a single form by ID for a collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | – The collection identifier |
| `formId` | `string` | – The form identifier |
| `admin?` | `boolean` | – If true, use admin endpoint; otherwise, use public |

#### Returns

`Promise`\<`any`\>

#### Defined in

api/form.ts:10

___

### list

▸ **list**(`collectionId`, `admin?`): `Promise`\<`any`[]\>

List all forms for a collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | – The collection identifier |
| `admin?` | `boolean` | – If true, use admin endpoint; otherwise, use public |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

api/form.ts:21

___

### remove

▸ **remove**(`collectionId`, `formId`): `Promise`\<`void`\>

Delete a form for a collection (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | – The collection identifier |
| `formId` | `string` | – The form identifier |

#### Returns

`Promise`\<`void`\>

#### Defined in

api/form.ts:53

___

### update

▸ **update**(`collectionId`, `formId`, `data`): `Promise`\<`any`\>

Update a form for a collection (admin only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | – The collection identifier |
| `formId` | `string` | – The form identifier |
| `data` | `any` | – The form data |

#### Returns

`Promise`\<`any`\>

#### Defined in

api/form.ts:43
