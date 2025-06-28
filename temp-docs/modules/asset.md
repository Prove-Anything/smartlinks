## Table of contents

### Functions

- [getForCollection](asset.md#getforcollection)
- [getForProduct](asset.md#getforproduct)
- [getForProof](asset.md#getforproof)
- [listForCollection](asset.md#listforcollection)
- [listForProduct](asset.md#listforproduct)
- [listForProof](asset.md#listforproof)
- [uploadAsset](asset.md#uploadasset)

## Functions

### getForCollection

▸ **getForCollection**(`collectionId`, `assetId`): `Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `assetId` | `string` |

#### Returns

`Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)\>

#### Defined in

[api/asset.ts:6](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/asset.ts#L6)

___

### getForProduct

▸ **getForProduct**(`collectionId`, `productId`, `assetId`): `Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productId` | `string` |
| `assetId` | `string` |

#### Returns

`Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)\>

#### Defined in

[api/asset.ts:22](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/asset.ts#L22)

___

### getForProof

▸ **getForProof**(`collectionId`, `productId`, `proofId`, `assetId`): `Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productId` | `string` |
| `proofId` | `string` |
| `assetId` | `string` |

#### Returns

`Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)\>

#### Defined in

[api/asset.ts:40](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/asset.ts#L40)

___

### listForCollection

▸ **listForCollection**(`collectionId`): `Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |

#### Returns

`Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)[]\>

#### Defined in

[api/asset.ts:14](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/asset.ts#L14)

___

### listForProduct

▸ **listForProduct**(`collectionId`, `productId`): `Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productId` | `string` |

#### Returns

`Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)[]\>

#### Defined in

[api/asset.ts:31](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/asset.ts#L31)

___

### listForProof

▸ **listForProof**(`collectionId`, `productId`, `proofId`, `appId?`): `Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `productId` | `string` |
| `proofId` | `string` |
| `appId?` | `string` |

#### Returns

`Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)[]\>

#### Defined in

[api/asset.ts:50](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/asset.ts#L50)

___

### uploadAsset

▸ **uploadAsset**(`collectionId`, `productId`, `proofId`, `file`, `extraData?`, `onProgress?`): `Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)\>

Uploads an asset file to a proof, with optional extraData as JSON.
Supports progress reporting via onProgress callback (browser only).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collectionId` | `string` | The collection ID |
| `productId` | `string` | The product ID |
| `proofId` | `string` | The proof ID |
| `file` | `File` | The file to upload |
| `extraData?` | `Record`\<`string`, `any`\> | Arbitrary extra data to include (will be stringified as JSON) |
| `onProgress?` | (`percent`: `number`) => `void` | Optional callback for upload progress (0-100) |

#### Returns

`Promise`\<[`AssetResponse`](../interfaces/AssetResponse.md)\>

Promise resolving to an AssetResponse object

#### Defined in

[api/asset.ts:74](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/asset.ts#L74)
