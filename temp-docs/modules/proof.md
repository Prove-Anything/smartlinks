## Table of contents

### Functions

- [get](proof.md#get)
- [list](proof.md#list)

## Functions

### get

▸ **get**(`collectionId`, `proofId`): `Promise`\<[`ProofResponse`](../interfaces/ProofResponse.md)\>

Retrieves a single Proof by Collection ID and Proof ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | – Identifier of the parent collection |
| `proofId` | `string` | – Identifier of the proof |

#### Returns

`Promise`\<[`ProofResponse`](../interfaces/ProofResponse.md)\>

Promise resolving to a ProofResponse object

**`Throws`**

ErrorResponse if the request fails

#### Defined in

[api/proof.ts:13](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/proof.ts#L13)

___

### list

▸ **list**(`collectionId`): `Promise`\<[`ProofResponse`](../interfaces/ProofResponse.md)[]\>

List all Proofs for a Collection.

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |

#### Returns

`Promise`\<[`ProofResponse`](../interfaces/ProofResponse.md)[]\>

#### Defined in

[api/proof.ts:26](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/proof.ts#L26)
