## Table of contents

### Functions

- [create](attestation.md#create)
- [get](attestation.md#get)
- [list](attestation.md#list)
- [remove](attestation.md#remove)
- [update](attestation.md#update)

## Functions

### create

▸ **create**(`collectionId`, `productId`, `proofId`, `data`): `Promise`\<[`AttestationResponse`](../interfaces/AttestationResponse.md)\>

Create a new attestation for a proof.

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productId` | `string` |
| `proofId` | `string` |
| `data` | [`AttestationCreateRequest`](../interfaces/AttestationCreateRequest.md) |

#### Returns

`Promise`\<[`AttestationResponse`](../interfaces/AttestationResponse.md)\>

#### Defined in

[api/attestation.ts:33](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L33)

___

### get

▸ **get**(`collectionId`, `productId`, `proofId`, `attestationId`): `Promise`\<[`AttestationResponse`](../interfaces/AttestationResponse.md)\>

Get a single attestation by ID.

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productId` | `string` |
| `proofId` | `string` |
| `attestationId` | `string` |

#### Returns

`Promise`\<[`AttestationResponse`](../interfaces/AttestationResponse.md)\>

#### Defined in

[api/attestation.ts:20](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L20)

___

### list

▸ **list**(`collectionId`, `productId`, `proofId`): `Promise`\<[`AttestationResponse`](../interfaces/AttestationResponse.md)[]\>

List all attestations for a proof.

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productId` | `string` |
| `proofId` | `string` |

#### Returns

`Promise`\<[`AttestationResponse`](../interfaces/AttestationResponse.md)[]\>

#### Defined in

[api/attestation.ts:8](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L8)

___

### remove

▸ **remove**(`collectionId`, `productId`, `proofId`, `attestationId`): `Promise`\<`void`\>

Delete an attestation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productId` | `string` |
| `proofId` | `string` |
| `attestationId` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[api/attestation.ts:60](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L60)

___

### update

▸ **update**(`collectionId`, `productId`, `proofId`, `attestationId`, `data`): `Promise`\<[`AttestationResponse`](../interfaces/AttestationResponse.md)\>

Update an attestation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productId` | `string` |
| `proofId` | `string` |
| `attestationId` | `string` |
| `data` | [`AttestationUpdateRequest`](../interfaces/AttestationUpdateRequest.md) |

#### Returns

`Promise`\<[`AttestationResponse`](../interfaces/AttestationResponse.md)\>

#### Defined in

[api/attestation.ts:46](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L46)
