# Smartlinks SDK Documentation

## Table of contents

### Namespaces

- [appConfiguration](modules/appConfiguration.md)
- [asset](modules/asset.md)
- [attestation](modules/attestation.md)
- [auth](modules/auth.md)
- [collection](modules/collection.md)
- [product](modules/product.md)
- [proof](modules/proof.md)

### Interfaces

- [AppConfigurationResponse](interfaces/AppConfigurationResponse.md)
- [AssetResponse](interfaces/AssetResponse.md)
- [AttestationCreateRequest](interfaces/AttestationCreateRequest.md)
- [AttestationResponse](interfaces/AttestationResponse.md)
- [AttestationUpdateRequest](interfaces/AttestationUpdateRequest.md)
- [CollectionResponse](interfaces/CollectionResponse.md)
- [ErrorResponse](interfaces/ErrorResponse.md)
- [ProductResponse](interfaces/ProductResponse.md)
- [ProofResponse](interfaces/ProofResponse.md)

### Type Aliases

- [AccountInfoResponse](modules.md#accountinforesponse)
- [AppConfigOptions](modules.md#appconfigoptions)
- [LoginResponse](modules.md#loginresponse)
- [VerifyTokenResponse](modules.md#verifytokenresponse)

### Functions

- [initializeApi](modules.md#initializeapi)
- [request](modules.md#request)

## Type Aliases

### AccountInfoResponse

Ƭ **AccountInfoResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `Record`\<`string`, `any`\> |
| `location` | `Record`\<`string`, `any`\> |
| `owner` | `Record`\<`string`, `any`\> |
| `user` | `Record`\<`string`, `any`\> |

#### Defined in

[api/auth.ts:19](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L19)

___

### AppConfigOptions

Ƭ **AppConfigOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `admin?` | `boolean` |
| `appId` | `string` |
| `batchId?` | `string` |
| `collectionId?` | `string` |
| `config?` | `any` |
| `data?` | `any` |
| `itemId?` | `string` |
| `productId?` | `string` |
| `user?` | `boolean` |
| `userData?` | `boolean` |
| `variantId?` | `string` |

#### Defined in

[api/appConfiguration.ts:4](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L4)

___

### LoginResponse

Ƭ **LoginResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `Record`\<`string`, `any`\> |
| `bearerToken` | `string` |
| `email` | `string` |
| `id` | `string` |
| `name` | `string` |

#### Defined in

[api/auth.ts:3](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L3)

___

### VerifyTokenResponse

Ƭ **VerifyTokenResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account?` | `Record`\<`string`, `any`\> |
| `email?` | `string` |
| `id?` | `string` |
| `name?` | `string` |
| `valid` | `boolean` |

#### Defined in

[api/auth.ts:11](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L11)

## Functions

### initializeApi

▸ **initializeApi**(`options`): `void`

Call this once (e.g. at app startup) to configure baseURL/auth.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | Configuration options |
| `options.apiKey?` | `string` | - |
| `options.baseURL` | `string` | - |
| `options.bearerToken?` | `string` | - |
| `options.proxyMode?` | `boolean` | - |

#### Returns

`void`

#### Defined in

[http.ts:20](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L20)

___

### request

▸ **request**\<`T`\>(`path`): `Promise`\<`T`\>

Internal helper that performs a GET request to `\${baseURL}\${path}`, 
injecting headers for apiKey or bearerToken if present. 
Returns the parsed JSON as T, or throws an Error.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`\<`T`\>

#### Defined in

[http.ts:96](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L96)



This README is auto-generated from the TypeScript API documentation.

## API Reference

```json
{
  "id": 0,
  "name": "@proveanything/smartlinks",
  "variant": "project",
  "kind": 1,
  "flags": {},
  "children": [
    {
      "id": 80,
      "name": "appConfiguration",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 87,
          "name": "deleteConfig",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/appConfiguration.ts",
              "line": 74,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L74"
            }
          ],
          "signatures": [
            {
              "id": 88,
              "name": "deleteConfig",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 74,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L74"
                }
              ],
              "parameters": [
                {
                  "id": 89,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 47,
                    "name": "AppConfigOptions",
                    "package": "@proveanything/smartlinks"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "void"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 99,
          "name": "deleteDataItem",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/appConfiguration.ts",
              "line": 99,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L99"
            }
          ],
          "signatures": [
            {
              "id": 100,
              "name": "deleteDataItem",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 99,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L99"
                }
              ],
              "parameters": [
                {
                  "id": 101,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 47,
                    "name": "AppConfigOptions",
                    "package": "@proveanything/smartlinks"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "void"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 81,
          "name": "getConfig",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/appConfiguration.ts",
              "line": 62,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L62"
            }
          ],
          "signatures": [
            {
              "id": 82,
              "name": "getConfig",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 62,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L62"
                }
              ],
              "parameters": [
                {
                  "id": 83,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 47,
                    "name": "AppConfigOptions",
                    "package": "@proveanything/smartlinks"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "any"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 90,
          "name": "getData",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/appConfiguration.ts",
              "line": 80,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L80"
            }
          ],
          "signatures": [
            {
              "id": 91,
              "name": "getData",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 80,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L80"
                }
              ],
              "parameters": [
                {
                  "id": 92,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 47,
                    "name": "AppConfigOptions",
                    "package": "@proveanything/smartlinks"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "array",
                    "elementType": {
                      "type": "intrinsic",
                      "name": "any"
                    }
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 93,
          "name": "getDataItem",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/appConfiguration.ts",
              "line": 86,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L86"
            }
          ],
          "signatures": [
            {
              "id": 94,
              "name": "getDataItem",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 86,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L86"
                }
              ],
              "parameters": [
                {
                  "id": 95,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 47,
                    "name": "AppConfigOptions",
                    "package": "@proveanything/smartlinks"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "any"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 84,
          "name": "setConfig",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/appConfiguration.ts",
              "line": 68,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L68"
            }
          ],
          "signatures": [
            {
              "id": 85,
              "name": "setConfig",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 68,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L68"
                }
              ],
              "parameters": [
                {
                  "id": 86,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 47,
                    "name": "AppConfigOptions",
                    "package": "@proveanything/smartlinks"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "any"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 96,
          "name": "setDataItem",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/appConfiguration.ts",
              "line": 93,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L93"
            }
          ],
          "signatures": [
            {
              "id": 97,
              "name": "setDataItem",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 93,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L93"
                }
              ],
              "parameters": [
                {
                  "id": 98,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 47,
                    "name": "AppConfigOptions",
                    "package": "@proveanything/smartlinks"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "any"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        }
      ],
      "groups": [
        {
          "title": "Functions",
          "children": [
            87,
            99,
            81,
            90,
            93,
            84,
            96
          ]
        }
      ],
      "sources": [
        {
          "fileName": "api/appConfiguration.ts",
          "line": 60,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L60"
        }
      ]
    },
    {
      "id": 102,
      "name": "asset",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 103,
          "name": "getForCollection",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/asset.ts",
              "line": 6,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L6"
            }
          ],
          "signatures": [
            {
              "id": 104,
              "name": "getForCollection",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/asset.ts",
                  "line": 6,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L6"
                }
              ],
              "parameters": [
                {
                  "id": 105,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 106,
                  "name": "assetId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 210,
                    "name": "AssetResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 110,
          "name": "getForProduct",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/asset.ts",
              "line": 22,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L22"
            }
          ],
          "signatures": [
            {
              "id": 111,
              "name": "getForProduct",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/asset.ts",
                  "line": 22,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L22"
                }
              ],
              "parameters": [
                {
                  "id": 112,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 113,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 114,
                  "name": "assetId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 210,
                    "name": "AssetResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 119,
          "name": "getForProof",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/asset.ts",
              "line": 40,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L40"
            }
          ],
          "signatures": [
            {
              "id": 120,
              "name": "getForProof",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/asset.ts",
                  "line": 40,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L40"
                }
              ],
              "parameters": [
                {
                  "id": 121,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 122,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 123,
                  "name": "proofId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 124,
                  "name": "assetId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 210,
                    "name": "AssetResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 107,
          "name": "listForCollection",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/asset.ts",
              "line": 14,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L14"
            }
          ],
          "signatures": [
            {
              "id": 108,
              "name": "listForCollection",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/asset.ts",
                  "line": 14,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L14"
                }
              ],
              "parameters": [
                {
                  "id": 109,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "array",
                    "elementType": {
                      "type": "reference",
                      "target": 210,
                      "name": "AssetResponse",
                      "package": "@proveanything/smartlinks"
                    }
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 115,
          "name": "listForProduct",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/asset.ts",
              "line": 31,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L31"
            }
          ],
          "signatures": [
            {
              "id": 116,
              "name": "listForProduct",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/asset.ts",
                  "line": 31,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L31"
                }
              ],
              "parameters": [
                {
                  "id": 117,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 118,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "array",
                    "elementType": {
                      "type": "reference",
                      "target": 210,
                      "name": "AssetResponse",
                      "package": "@proveanything/smartlinks"
                    }
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 125,
          "name": "listForProof",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/asset.ts",
              "line": 50,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L50"
            }
          ],
          "signatures": [
            {
              "id": 126,
              "name": "listForProof",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/asset.ts",
                  "line": 50,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L50"
                }
              ],
              "parameters": [
                {
                  "id": 127,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 128,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 129,
                  "name": "proofId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 130,
                  "name": "appId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {
                    "isOptional": true
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "array",
                    "elementType": {
                      "type": "reference",
                      "target": 210,
                      "name": "AssetResponse",
                      "package": "@proveanything/smartlinks"
                    }
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 131,
          "name": "uploadAsset",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/asset.ts",
              "line": 74,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L74"
            }
          ],
          "signatures": [
            {
              "id": 132,
              "name": "uploadAsset",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Uploads an asset file to a proof, with optional extraData as JSON.\r\nSupports progress reporting via onProgress callback (browser only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to an AssetResponse object"
                      }
                    ]
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/asset.ts",
                  "line": 74,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L74"
                }
              ],
              "parameters": [
                {
                  "id": 133,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "The collection ID"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 134,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "The product ID"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 135,
                  "name": "proofId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "The proof ID"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 136,
                  "name": "file",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "The file to upload"
                      }
                    ]
                  },
                  "type": {
                    "type": "reference",
                    "target": {
                      "sourceFileName": "node_modules/typescript/lib/lib.dom.d.ts",
                      "qualifiedName": "File"
                    },
                    "name": "File",
                    "package": "typescript"
                  }
                },
                {
                  "id": 137,
                  "name": "extraData",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {
                    "isOptional": true
                  },
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Arbitrary extra data to include (will be stringified as JSON)"
                      }
                    ]
                  },
                  "type": {
                    "type": "reference",
                    "target": {
                      "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                      "qualifiedName": "Record"
                    },
                    "typeArguments": [
                      {
                        "type": "intrinsic",
                        "name": "string"
                      },
                      {
                        "type": "intrinsic",
                        "name": "any"
                      }
                    ],
                    "name": "Record",
                    "package": "typescript"
                  }
                },
                {
                  "id": 138,
                  "name": "onProgress",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {
                    "isOptional": true
                  },
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Optional callback for upload progress (0-100)"
                      }
                    ]
                  },
                  "type": {
                    "type": "reflection",
                    "declaration": {
                      "id": 139,
                      "name": "__type",
                      "variant": "declaration",
                      "kind": 65536,
                      "flags": {},
                      "sources": [
                        {
                          "fileName": "api/asset.ts",
                          "line": 80,
                          "character": 17,
                          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L80"
                        }
                      ],
                      "signatures": [
                        {
                          "id": 140,
                          "name": "__type",
                          "variant": "signature",
                          "kind": 4096,
                          "flags": {},
                          "sources": [
                            {
                              "fileName": "api/asset.ts",
                              "line": 80,
                              "character": 17,
                              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L80"
                            }
                          ],
                          "parameters": [
                            {
                              "id": 141,
                              "name": "percent",
                              "variant": "param",
                              "kind": 32768,
                              "flags": {},
                              "type": {
                                "type": "intrinsic",
                                "name": "number"
                              }
                            }
                          ],
                          "type": {
                            "type": "intrinsic",
                            "name": "void"
                          }
                        }
                      ]
                    }
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 210,
                    "name": "AssetResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        }
      ],
      "groups": [
        {
          "title": "Functions",
          "children": [
            103,
            110,
            119,
            107,
            115,
            125,
            131
          ]
        }
      ],
      "sources": [
        {
          "fileName": "api/asset.ts",
          "line": 4,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/asset.ts#L4"
        }
      ]
    },
    {
      "id": 142,
      "name": "attestation",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 154,
          "name": "create",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/attestation.ts",
              "line": 33,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L33"
            }
          ],
          "signatures": [
            {
              "id": 155,
              "name": "create",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Create a new attestation for a proof."
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/attestation.ts",
                  "line": 33,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L33"
                }
              ],
              "parameters": [
                {
                  "id": 156,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 157,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 158,
                  "name": "proofId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 159,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 40,
                    "name": "AttestationCreateRequest",
                    "package": "@proveanything/smartlinks"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 33,
                    "name": "AttestationResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 148,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/attestation.ts",
              "line": 20,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L20"
            }
          ],
          "signatures": [
            {
              "id": 149,
              "name": "get",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get a single attestation by ID."
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/attestation.ts",
                  "line": 20,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L20"
                }
              ],
              "parameters": [
                {
                  "id": 150,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 151,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 152,
                  "name": "proofId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 153,
                  "name": "attestationId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 33,
                    "name": "AttestationResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 143,
          "name": "list",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/attestation.ts",
              "line": 8,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L8"
            }
          ],
          "signatures": [
            {
              "id": 144,
              "name": "list",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "List all attestations for a proof."
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/attestation.ts",
                  "line": 8,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L8"
                }
              ],
              "parameters": [
                {
                  "id": 145,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 146,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 147,
                  "name": "proofId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "array",
                    "elementType": {
                      "type": "reference",
                      "target": 33,
                      "name": "AttestationResponse",
                      "package": "@proveanything/smartlinks"
                    }
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 167,
          "name": "remove",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/attestation.ts",
              "line": 60,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L60"
            }
          ],
          "signatures": [
            {
              "id": 168,
              "name": "remove",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Delete an attestation."
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/attestation.ts",
                  "line": 60,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L60"
                }
              ],
              "parameters": [
                {
                  "id": 169,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 170,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 171,
                  "name": "proofId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 172,
                  "name": "attestationId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "void"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 160,
          "name": "update",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/attestation.ts",
              "line": 46,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L46"
            }
          ],
          "signatures": [
            {
              "id": 161,
              "name": "update",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Update an attestation."
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/attestation.ts",
                  "line": 46,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L46"
                }
              ],
              "parameters": [
                {
                  "id": 162,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 163,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 164,
                  "name": "proofId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 165,
                  "name": "attestationId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 166,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 44,
                    "name": "AttestationUpdateRequest",
                    "package": "@proveanything/smartlinks"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 33,
                    "name": "AttestationResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        }
      ],
      "groups": [
        {
          "title": "Functions",
          "children": [
            154,
            148,
            143,
            167,
            160
          ]
        }
      ],
      "sources": [
        {
          "fileName": "api/attestation.ts",
          "line": 4,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/attestation.ts#L4"
        }
      ]
    },
    {
      "id": 173,
      "name": "auth",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 183,
          "name": "getAccount",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/auth.ts",
              "line": 65,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L65"
            }
          ],
          "signatures": [
            {
              "id": 184,
              "name": "getAccount",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Gets current account information for the logged in user.\r\nReturns user, owner, account, and location objects."
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 65,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L65"
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 27,
                    "name": "AccountInfoResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 174,
          "name": "login",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/auth.ts",
              "line": 31,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L31"
            }
          ],
          "signatures": [
            {
              "id": 175,
              "name": "login",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Login with email and password.\r\nSets the bearerToken for subsequent API calls."
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 31,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L31"
                }
              ],
              "parameters": [
                {
                  "id": 176,
                  "name": "email",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 177,
                  "name": "password",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 13,
                    "name": "LoginResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 178,
          "name": "logout",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/auth.ts",
              "line": 40,
              "character": 18,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L40"
            }
          ],
          "signatures": [
            {
              "id": 179,
              "name": "logout",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Logout (clears bearerToken for future API calls)."
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 40,
                  "character": 18,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L40"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "void"
              }
            }
          ]
        },
        {
          "id": 180,
          "name": "verifyToken",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/auth.ts",
              "line": 48,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L48"
            }
          ],
          "signatures": [
            {
              "id": 181,
              "name": "verifyToken",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Verifies the current bearerToken (or a provided token).\r\nReturns user/account info if valid."
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 48,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L48"
                }
              ],
              "parameters": [
                {
                  "id": 182,
                  "name": "token",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {
                    "isOptional": true
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 20,
                    "name": "VerifyTokenResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        }
      ],
      "groups": [
        {
          "title": "Functions",
          "children": [
            183,
            174,
            178,
            180
          ]
        }
      ],
      "sources": [
        {
          "fileName": "api/auth.ts",
          "line": 26,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L26"
        }
      ]
    },
    {
      "id": 60,
      "name": "collection",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 61,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/collection.ts",
              "line": 12,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/collection.ts#L12"
            }
          ],
          "signatures": [
            {
              "id": 62,
              "name": "get",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Retrieves a single Collection by its ID."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a CollectionResponse object"
                      }
                    ]
                  },
                  {
                    "tag": "@throws",
                    "content": [
                      {
                        "kind": "text",
                        "text": "ErrorResponse if the request fails"
                      }
                    ]
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/collection.ts",
                  "line": 12,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/collection.ts#L12"
                }
              ],
              "parameters": [
                {
                  "id": 63,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Identifier of the collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 185,
                    "name": "CollectionResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        }
      ],
      "groups": [
        {
          "title": "Functions",
          "children": [
            61
          ]
        }
      ],
      "sources": [
        {
          "fileName": "api/collection.ts",
          "line": 5,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/collection.ts#L5"
        }
      ]
    },
    {
      "id": 64,
      "name": "product",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 65,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/product.ts",
              "line": 13,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/product.ts#L13"
            }
          ],
          "signatures": [
            {
              "id": 66,
              "name": "get",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Retrieves a single Product Item by Collection ID and Product ID."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a ProductResponse object"
                      }
                    ]
                  },
                  {
                    "tag": "@throws",
                    "content": [
                      {
                        "kind": "text",
                        "text": "ErrorResponse if the request fails"
                      }
                    ]
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/product.ts",
                  "line": 13,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/product.ts#L13"
                }
              ],
              "parameters": [
                {
                  "id": 67,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 68,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Identifier of the product item"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 190,
                    "name": "ProductResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 69,
          "name": "list",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/product.ts",
              "line": 29,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/product.ts#L29"
            }
          ],
          "signatures": [
            {
              "id": 70,
              "name": "list",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "List all Product Items for a Collection."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to an array of ProductResponse objects"
                      }
                    ]
                  },
                  {
                    "tag": "@throws",
                    "content": [
                      {
                        "kind": "text",
                        "text": "ErrorResponse if the request fails"
                      }
                    ]
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/product.ts",
                  "line": 29,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/product.ts#L29"
                }
              ],
              "parameters": [
                {
                  "id": 71,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "array",
                    "elementType": {
                      "type": "reference",
                      "target": 190,
                      "name": "ProductResponse",
                      "package": "@proveanything/smartlinks"
                    }
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        }
      ],
      "groups": [
        {
          "title": "Functions",
          "children": [
            65,
            69
          ]
        }
      ],
      "sources": [
        {
          "fileName": "api/product.ts",
          "line": 5,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/product.ts#L5"
        }
      ]
    },
    {
      "id": 72,
      "name": "proof",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 73,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/proof.ts",
              "line": 13,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/proof.ts#L13"
            }
          ],
          "signatures": [
            {
              "id": 74,
              "name": "get",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Retrieves a single Proof by Collection ID and Proof ID."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a ProofResponse object"
                      }
                    ]
                  },
                  {
                    "tag": "@throws",
                    "content": [
                      {
                        "kind": "text",
                        "text": "ErrorResponse if the request fails"
                      }
                    ]
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/proof.ts",
                  "line": 13,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/proof.ts#L13"
                }
              ],
              "parameters": [
                {
                  "id": 75,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 76,
                  "name": "proofId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Identifier of the proof"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 195,
                    "name": "ProofResponse",
                    "package": "@proveanything/smartlinks"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 77,
          "name": "list",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "sources": [
            {
              "fileName": "api/proof.ts",
              "line": 26,
              "character": 24,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/proof.ts#L26"
            }
          ],
          "signatures": [
            {
              "id": 78,
              "name": "list",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "List all Proofs for a Collection."
                  }
                ]
              },
              "sources": [
                {
                  "fileName": "api/proof.ts",
                  "line": 26,
                  "character": 24,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/proof.ts#L26"
                }
              ],
              "parameters": [
                {
                  "id": 79,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "array",
                    "elementType": {
                      "type": "reference",
                      "target": 195,
                      "name": "ProofResponse",
                      "package": "@proveanything/smartlinks"
                    }
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        }
      ],
      "groups": [
        {
          "title": "Functions",
          "children": [
            73,
            77
          ]
        }
      ],
      "sources": [
        {
          "fileName": "api/proof.ts",
          "line": 5,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/proof.ts#L5"
        }
      ]
    },
    {
      "id": 203,
      "name": "AppConfigurationResponse",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Represents an App Configuration object."
          }
        ]
      },
      "children": [
        {
          "id": 204,
          "name": "id",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Unique identifier for the app configuration"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/appConfiguration.ts",
              "line": 7,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/appConfiguration.ts#L7"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 205,
          "name": "name",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Name of the app configuration"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/appConfiguration.ts",
              "line": 9,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/appConfiguration.ts#L9"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 206,
          "name": "settings",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
          },
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Key-value pairs representing configuration settings"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/appConfiguration.ts",
              "line": 11,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/appConfiguration.ts#L11"
            }
          ],
          "type": {
            "type": "reference",
            "target": {
              "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
              "qualifiedName": "Record"
            },
            "typeArguments": [
              {
                "type": "intrinsic",
                "name": "string"
              },
              {
                "type": "intrinsic",
                "name": "any"
              }
            ],
            "name": "Record",
            "package": "typescript"
          }
        }
      ],
      "groups": [
        {
          "title": "Properties",
          "children": [
            204,
            205,
            206
          ]
        }
      ],
      "sources": [
        {
          "fileName": "types/appConfiguration.ts",
          "line": 5,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/appConfiguration.ts#L5"
        }
      ]
    },
    {
      "id": 210,
      "name": "AssetResponse",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Represents an Asset object."
          }
        ]
      },
      "children": [
        {
          "id": 211,
          "name": "id",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/asset.ts",
              "line": 5,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/asset.ts#L5"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 212,
          "name": "name",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/asset.ts",
              "line": 6,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/asset.ts#L6"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 213,
          "name": "url",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/asset.ts",
              "line": 7,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/asset.ts#L7"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        }
      ],
      "groups": [
        {
          "title": "Properties",
          "children": [
            211,
            212,
            213
          ]
        }
      ],
      "sources": [
        {
          "fileName": "types/asset.ts",
          "line": 4,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/asset.ts#L4"
        }
      ]
    },
    {
      "id": 40,
      "name": "AttestationCreateRequest",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "children": [
        {
          "id": 42,
          "name": "private",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/attestation.ts",
              "line": 12,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L12"
            }
          ],
          "type": {
            "type": "reference",
            "target": {
              "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
              "qualifiedName": "Record"
            },
            "typeArguments": [
              {
                "type": "intrinsic",
                "name": "string"
              },
              {
                "type": "intrinsic",
                "name": "any"
              }
            ],
            "name": "Record",
            "package": "typescript"
          }
        },
        {
          "id": 43,
          "name": "proof",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/attestation.ts",
              "line": 13,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L13"
            }
          ],
          "type": {
            "type": "reference",
            "target": {
              "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
              "qualifiedName": "Record"
            },
            "typeArguments": [
              {
                "type": "intrinsic",
                "name": "string"
              },
              {
                "type": "intrinsic",
                "name": "any"
              }
            ],
            "name": "Record",
            "package": "typescript"
          }
        },
        {
          "id": 41,
          "name": "public",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/attestation.ts",
              "line": 11,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L11"
            }
          ],
          "type": {
            "type": "reference",
            "target": {
              "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
              "qualifiedName": "Record"
            },
            "typeArguments": [
              {
                "type": "intrinsic",
                "name": "string"
              },
              {
                "type": "intrinsic",
                "name": "any"
              }
            ],
            "name": "Record",
            "package": "typescript"
          }
        }
      ],
      "groups": [
        {
          "title": "Properties",
          "children": [
            42,
            43,
            41
          ]
        }
      ],
      "sources": [
        {
          "fileName": "types/attestation.ts",
          "line": 10,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L10"
        }
      ]
    },
    {
      "id": 33,
      "name": "AttestationResponse",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "children": [
        {
          "id": 35,
          "name": "createdAt",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/attestation.ts",
              "line": 3,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L3"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 34,
          "name": "id",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/attestation.ts",
              "line": 2,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L2"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 38,
          "name": "private",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/attestation.ts",
              "line": 6,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L6"
            }
          ],
          "type": {
            "type": "reference",
            "target": {
              "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
              "qualifiedName": "Record"
            },
            "typeArguments": [
              {
                "type": "intrinsic",
                "name": "string"
              },
              {
                "type": "intrinsic",
                "name": "any"
              }
            ],
            "name": "Record",
            "package": "typescript"
          }
        },
        {
          "id": 39,
          "name": "proof",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/attestation.ts",
              "line": 7,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L7"
            }
          ],
          "type": {
            "type": "reference",
            "target": {
              "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
              "qualifiedName": "Record"
            },
            "typeArguments": [
              {
                "type": "intrinsic",
                "name": "string"
              },
              {
                "type": "intrinsic",
                "name": "any"
              }
            ],
            "name": "Record",
            "package": "typescript"
          }
        },
        {
          "id": 37,
          "name": "public",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/attestation.ts",
              "line": 5,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L5"
            }
          ],
          "type": {
            "type": "reference",
            "target": {
              "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
              "qualifiedName": "Record"
            },
            "typeArguments": [
              {
                "type": "intrinsic",
                "name": "string"
              },
              {
                "type": "intrinsic",
                "name": "any"
              }
            ],
            "name": "Record",
            "package": "typescript"
          }
        },
        {
          "id": 36,
          "name": "updatedAt",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "sources": [
            {
              "fileName": "types/attestation.ts",
              "line": 4,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L4"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        }
      ],
      "groups": [
        {
          "title": "Properties",
          "children": [
            35,
            34,
            38,
            39,
            37,
            36
          ]
        }
      ],
      "sources": [
        {
          "fileName": "types/attestation.ts",
          "line": 1,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L1"
        }
      ]
    },
    {
      "id": 44,
      "name": "AttestationUpdateRequest",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "children": [
        {
          "id": 46,
          "name": "data",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
          },
          "sources": [
            {
              "fileName": "types/attestation.ts",
              "line": 18,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L18"
            }
          ],
          "type": {
            "type": "reference",
            "target": {
              "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
              "qualifiedName": "Record"
            },
            "typeArguments": [
              {
                "type": "intrinsic",
                "name": "string"
              },
              {
                "type": "intrinsic",
                "name": "any"
              }
            ],
            "name": "Record",
            "package": "typescript"
          }
        },
        {
          "id": 45,
          "name": "type",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
          },
          "sources": [
            {
              "fileName": "types/attestation.ts",
              "line": 17,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L17"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        }
      ],
      "groups": [
        {
          "title": "Properties",
          "children": [
            46,
            45
          ]
        }
      ],
      "sources": [
        {
          "fileName": "types/attestation.ts",
          "line": 16,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/attestation.ts#L16"
        }
      ]
    },
    {
      "id": 185,
      "name": "CollectionResponse",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Represents a Collection object."
          }
        ]
      },
      "children": [
        {
          "id": 186,
          "name": "id",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Unique identifier for the collection"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/collection.ts",
              "line": 7,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/collection.ts#L7"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 189,
          "name": "logoImage",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "URL to the collection’s logo image"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/collection.ts",
              "line": 13,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/collection.ts#L13"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 187,
          "name": "name",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Machine-readable name of the collection"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/collection.ts",
              "line": 9,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/collection.ts#L9"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 188,
          "name": "title",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Human-readable title of the collection"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/collection.ts",
              "line": 11,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/collection.ts#L11"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        }
      ],
      "groups": [
        {
          "title": "Properties",
          "children": [
            186,
            189,
            187,
            188
          ]
        }
      ],
      "sources": [
        {
          "fileName": "types/collection.ts",
          "line": 5,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/collection.ts#L5"
        }
      ]
    },
    {
      "id": 207,
      "name": "ErrorResponse",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Represents a standardized error response."
          }
        ]
      },
      "children": [
        {
          "id": 208,
          "name": "code",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Numeric error code"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/error.ts",
              "line": 7,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/error.ts#L7"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "number"
          }
        },
        {
          "id": 209,
          "name": "message",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Human-readable error message"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/error.ts",
              "line": 9,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/error.ts#L9"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        }
      ],
      "groups": [
        {
          "title": "Properties",
          "children": [
            208,
            209
          ]
        }
      ],
      "sources": [
        {
          "fileName": "types/error.ts",
          "line": 5,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/error.ts#L5"
        }
      ]
    },
    {
      "id": 190,
      "name": "ProductResponse",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Represents a Product Item object."
          }
        ]
      },
      "children": [
        {
          "id": 193,
          "name": "description",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Detailed description of the product"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/product.ts",
              "line": 11,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/product.ts#L11"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 194,
          "name": "heroImage",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "URL to the product’s hero image"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/product.ts",
              "line": 13,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/product.ts#L13"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 191,
          "name": "id",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Unique identifier for the product"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/product.ts",
              "line": 7,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/product.ts#L7"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 192,
          "name": "name",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Name of the product"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/product.ts",
              "line": 9,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/product.ts#L9"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        }
      ],
      "groups": [
        {
          "title": "Properties",
          "children": [
            193,
            194,
            191,
            192
          ]
        }
      ],
      "sources": [
        {
          "fileName": "types/product.ts",
          "line": 5,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/product.ts#L5"
        }
      ]
    },
    {
      "id": 195,
      "name": "ProofResponse",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Represents a Proof object."
          }
        ]
      },
      "children": [
        {
          "id": 196,
          "name": "collectionId",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Unique identifier for the collection"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/proof.ts",
              "line": 7,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/proof.ts#L7"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 197,
          "name": "createdAt",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Creation timestamp"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/proof.ts",
              "line": 9,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/proof.ts#L9"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 198,
          "name": "id",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Unique identifier for the proof"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/proof.ts",
              "line": 11,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/proof.ts#L11"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 199,
          "name": "productId",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Unique identifier for the product"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/proof.ts",
              "line": 13,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/proof.ts#L13"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 200,
          "name": "tokenId",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Unique identifier for the token"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/proof.ts",
              "line": 15,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/proof.ts#L15"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 201,
          "name": "userId",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Unique identifier for the user"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/proof.ts",
              "line": 17,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/proof.ts#L17"
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 202,
          "name": "values",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Arbitrary key-value pairs for proof values"
              }
            ]
          },
          "sources": [
            {
              "fileName": "types/proof.ts",
              "line": 19,
              "character": 2,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/proof.ts#L19"
            }
          ],
          "type": {
            "type": "reference",
            "target": {
              "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
              "qualifiedName": "Record"
            },
            "typeArguments": [
              {
                "type": "intrinsic",
                "name": "string"
              },
              {
                "type": "intrinsic",
                "name": "any"
              }
            ],
            "name": "Record",
            "package": "typescript"
          }
        }
      ],
      "groups": [
        {
          "title": "Properties",
          "children": [
            196,
            197,
            198,
            199,
            200,
            201,
            202
          ]
        }
      ],
      "sources": [
        {
          "fileName": "types/proof.ts",
          "line": 5,
          "character": 17,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/types/proof.ts#L5"
        }
      ]
    },
    {
      "id": 27,
      "name": "AccountInfoResponse",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "sources": [
        {
          "fileName": "api/auth.ts",
          "line": 19,
          "character": 12,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L19"
        }
      ],
      "type": {
        "type": "reflection",
        "declaration": {
          "id": 28,
          "name": "__type",
          "variant": "declaration",
          "kind": 65536,
          "flags": {},
          "children": [
            {
              "id": 31,
              "name": "account",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 22,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L22"
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Record"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "string"
                  },
                  {
                    "type": "intrinsic",
                    "name": "any"
                  }
                ],
                "name": "Record",
                "package": "typescript"
              }
            },
            {
              "id": 32,
              "name": "location",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 23,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L23"
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Record"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "string"
                  },
                  {
                    "type": "intrinsic",
                    "name": "any"
                  }
                ],
                "name": "Record",
                "package": "typescript"
              }
            },
            {
              "id": 30,
              "name": "owner",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 21,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L21"
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Record"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "string"
                  },
                  {
                    "type": "intrinsic",
                    "name": "any"
                  }
                ],
                "name": "Record",
                "package": "typescript"
              }
            },
            {
              "id": 29,
              "name": "user",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 20,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L20"
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Record"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "string"
                  },
                  {
                    "type": "intrinsic",
                    "name": "any"
                  }
                ],
                "name": "Record",
                "package": "typescript"
              }
            }
          ],
          "groups": [
            {
              "title": "Properties",
              "children": [
                31,
                32,
                30,
                29
              ]
            }
          ],
          "sources": [
            {
              "fileName": "api/auth.ts",
              "line": 19,
              "character": 34,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L19"
            }
          ]
        }
      }
    },
    {
      "id": 47,
      "name": "AppConfigOptions",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "sources": [
        {
          "fileName": "api/appConfiguration.ts",
          "line": 4,
          "character": 12,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L4"
        }
      ],
      "type": {
        "type": "reflection",
        "declaration": {
          "id": 48,
          "name": "__type",
          "variant": "declaration",
          "kind": 65536,
          "flags": {},
          "children": [
            {
              "id": 57,
              "name": "admin",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 13,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L13"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "boolean"
              }
            },
            {
              "id": 49,
              "name": "appId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 5,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L5"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 53,
              "name": "batchId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 9,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L9"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 50,
              "name": "collectionId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 6,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L6"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 58,
              "name": "config",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 14,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L14"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "any"
              }
            },
            {
              "id": 59,
              "name": "data",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 15,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L15"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "any"
              }
            },
            {
              "id": 54,
              "name": "itemId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 10,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L10"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 51,
              "name": "productId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 7,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L7"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 55,
              "name": "user",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 11,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L11"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "boolean"
              }
            },
            {
              "id": 56,
              "name": "userData",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 12,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L12"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "boolean"
              }
            },
            {
              "id": 52,
              "name": "variantId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/appConfiguration.ts",
                  "line": 8,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L8"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            }
          ],
          "groups": [
            {
              "title": "Properties",
              "children": [
                57,
                49,
                53,
                50,
                58,
                59,
                54,
                51,
                55,
                56,
                52
              ]
            }
          ],
          "sources": [
            {
              "fileName": "api/appConfiguration.ts",
              "line": 4,
              "character": 31,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/appConfiguration.ts#L4"
            }
          ]
        }
      }
    },
    {
      "id": 13,
      "name": "LoginResponse",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "sources": [
        {
          "fileName": "api/auth.ts",
          "line": 3,
          "character": 12,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L3"
        }
      ],
      "type": {
        "type": "reflection",
        "declaration": {
          "id": 14,
          "name": "__type",
          "variant": "declaration",
          "kind": 65536,
          "flags": {},
          "children": [
            {
              "id": 19,
              "name": "account",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 8,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L8"
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Record"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "string"
                  },
                  {
                    "type": "intrinsic",
                    "name": "any"
                  }
                ],
                "name": "Record",
                "package": "typescript"
              }
            },
            {
              "id": 18,
              "name": "bearerToken",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 7,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L7"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 17,
              "name": "email",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 6,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L6"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 15,
              "name": "id",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 4,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L4"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 16,
              "name": "name",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 5,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L5"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            }
          ],
          "groups": [
            {
              "title": "Properties",
              "children": [
                19,
                18,
                17,
                15,
                16
              ]
            }
          ],
          "sources": [
            {
              "fileName": "api/auth.ts",
              "line": 3,
              "character": 28,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L3"
            }
          ]
        }
      }
    },
    {
      "id": 20,
      "name": "VerifyTokenResponse",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "sources": [
        {
          "fileName": "api/auth.ts",
          "line": 11,
          "character": 12,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L11"
        }
      ],
      "type": {
        "type": "reflection",
        "declaration": {
          "id": 21,
          "name": "__type",
          "variant": "declaration",
          "kind": 65536,
          "flags": {},
          "children": [
            {
              "id": 26,
              "name": "account",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 16,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L16"
                }
              ],
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Record"
                },
                "typeArguments": [
                  {
                    "type": "intrinsic",
                    "name": "string"
                  },
                  {
                    "type": "intrinsic",
                    "name": "any"
                  }
                ],
                "name": "Record",
                "package": "typescript"
              }
            },
            {
              "id": 25,
              "name": "email",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 15,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L15"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 23,
              "name": "id",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 13,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L13"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 24,
              "name": "name",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 14,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L14"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 22,
              "name": "valid",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "sources": [
                {
                  "fileName": "api/auth.ts",
                  "line": 12,
                  "character": 2,
                  "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L12"
                }
              ],
              "type": {
                "type": "intrinsic",
                "name": "boolean"
              }
            }
          ],
          "groups": [
            {
              "title": "Properties",
              "children": [
                26,
                25,
                23,
                24,
                22
              ]
            }
          ],
          "sources": [
            {
              "fileName": "api/auth.ts",
              "line": 11,
              "character": 34,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L11"
            }
          ]
        }
      }
    },
    {
      "id": 1,
      "name": "initializeApi",
      "variant": "declaration",
      "kind": 64,
      "flags": {},
      "sources": [
        {
          "fileName": "http.ts",
          "line": 20,
          "character": 16,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L20"
        }
      ],
      "signatures": [
        {
          "id": 2,
          "name": "initializeApi",
          "variant": "signature",
          "kind": 4096,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Call this once (e.g. at app startup) to configure baseURL/auth."
              }
            ]
          },
          "sources": [
            {
              "fileName": "http.ts",
              "line": 20,
              "character": 16,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L20"
            }
          ],
          "parameters": [
            {
              "id": 3,
              "name": "options",
              "variant": "param",
              "kind": 32768,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Configuration options"
                  }
                ]
              },
              "type": {
                "type": "reflection",
                "declaration": {
                  "id": 4,
                  "name": "__type",
                  "variant": "declaration",
                  "kind": 65536,
                  "flags": {},
                  "children": [
                    {
                      "id": 6,
                      "name": "apiKey",
                      "variant": "declaration",
                      "kind": 1024,
                      "flags": {
                        "isOptional": true
                      },
                      "sources": [
                        {
                          "fileName": "http.ts",
                          "line": 22,
                          "character": 2,
                          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L22"
                        }
                      ],
                      "type": {
                        "type": "intrinsic",
                        "name": "string"
                      }
                    },
                    {
                      "id": 5,
                      "name": "baseURL",
                      "variant": "declaration",
                      "kind": 1024,
                      "flags": {},
                      "sources": [
                        {
                          "fileName": "http.ts",
                          "line": 21,
                          "character": 2,
                          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L21"
                        }
                      ],
                      "type": {
                        "type": "intrinsic",
                        "name": "string"
                      }
                    },
                    {
                      "id": 7,
                      "name": "bearerToken",
                      "variant": "declaration",
                      "kind": 1024,
                      "flags": {
                        "isOptional": true
                      },
                      "sources": [
                        {
                          "fileName": "http.ts",
                          "line": 23,
                          "character": 2,
                          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L23"
                        }
                      ],
                      "type": {
                        "type": "intrinsic",
                        "name": "string"
                      }
                    },
                    {
                      "id": 8,
                      "name": "proxyMode",
                      "variant": "declaration",
                      "kind": 1024,
                      "flags": {
                        "isOptional": true
                      },
                      "sources": [
                        {
                          "fileName": "http.ts",
                          "line": 24,
                          "character": 2,
                          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L24"
                        }
                      ],
                      "type": {
                        "type": "intrinsic",
                        "name": "boolean"
                      }
                    }
                  ],
                  "groups": [
                    {
                      "title": "Properties",
                      "children": [
                        6,
                        5,
                        7,
                        8
                      ]
                    }
                  ],
                  "sources": [
                    {
                      "fileName": "http.ts",
                      "line": 20,
                      "character": 39,
                      "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L20"
                    }
                  ]
                }
              }
            }
          ],
          "type": {
            "type": "intrinsic",
            "name": "void"
          }
        }
      ]
    },
    {
      "id": 9,
      "name": "request",
      "variant": "declaration",
      "kind": 64,
      "flags": {},
      "sources": [
        {
          "fileName": "http.ts",
          "line": 96,
          "character": 22,
          "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L96"
        }
      ],
      "signatures": [
        {
          "id": 10,
          "name": "request",
          "variant": "signature",
          "kind": 4096,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Internal helper that performs a GET request to `\\${baseURL}\\${path}`, \ninjecting headers for apiKey or bearerToken if present. \nReturns the parsed JSON as T, or throws an Error."
              }
            ]
          },
          "sources": [
            {
              "fileName": "http.ts",
              "line": 96,
              "character": 22,
              "url": "https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/http.ts#L96"
            }
          ],
          "typeParameter": [
            {
              "id": 11,
              "name": "T",
              "variant": "typeParam",
              "kind": 131072,
              "flags": {}
            }
          ],
          "parameters": [
            {
              "id": 12,
              "name": "path",
              "variant": "param",
              "kind": 32768,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            }
          ],
          "type": {
            "type": "reference",
            "target": {
              "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
              "qualifiedName": "Promise"
            },
            "typeArguments": [
              {
                "type": "reference",
                "target": 11,
                "name": "T",
                "package": "@proveanything/smartlinks",
                "refersToTypeParameter": true
              }
            ],
            "name": "Promise",
            "package": "typescript"
          }
        }
      ]
    }
  ],
  "groups": [
    {
      "title": "Namespaces",
      "children": [
        80,
        102,
        142,
        173,
        60,
        64,
        72
      ]
    },
    {
      "title": "Interfaces",
      "children": [
        203,
        210,
        40,
        33,
        44,
        185,
        207,
        190,
        195
      ]
    },
    {
      "title": "Type Aliases",
      "children": [
        27,
        47,
        13,
        20
      ]
    },
    {
      "title": "Functions",
      "children": [
        1,
        9
      ]
    }
  ],
  "packageName": "@proveanything/smartlinks",
  "readme": [
    {
      "kind": "text",
      "text": "# @proveanything/smartlinks\n\nAn official JavaScript/TypeScript client SDK for the Smartlinks API. This package provides simple, namespaced functions to fetch Collection, Product, Proof, App Configuration, Asset, Attestation, and Auth data in both browser and Node.js environments.\n\n---\n\n## Installation\n\n"
    },
    {
      "kind": "code",
      "text": "```bash\nnpm install @proveanything/smartlinks\n# or\nyarn add @proveanything/smartlinks\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n## Quickstart\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\nimport {\n  initializeApi,\n  collection,\n  product,\n  proof,\n  appConfiguration,\n  asset,\n  attestation,\n  auth,\n} from \"@proveanything/smartlinks\";\n\nasync function main() {\n  initializeApi({\n    baseURL: \"https://smartlinks.app/api/v1\",\n    apiKey: \"YOUR_API_KEY_HERE\",       // optional\n    bearerToken: \"YOUR_BEARER_TOKEN\",  // optional\n    proxyMode: false                   // optional, set true if running in iframe via parent proxy\n  });\n\n  const coll = await collection.get(\"abc123\");\n  const prod = await product.get(\"abc123\", \"prod789\");\n  const prf = await proof.get(\"abc123\", \"proof456\");\n  const cfg = await appConfiguration.get(\"abc123\", \"app789\");\n  // ...other calls as needed\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n## API Reference\n\n### initializeApi\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\nfunction initializeApi(options: {\n  baseURL: string;\n  apiKey?: string;\n  bearerToken?: string;\n  proxyMode?: boolean;\n}): void\n```"
    },
    {
      "kind": "text",
      "text": "\nConfigures the SDK with the API base URL and authentication. Call once at app startup.\n\n---\n\n## Namespaces & Functions\n\n### collection\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\nnamespace collection {\n  function get(collectionId: string): Promise<CollectionResponse>\n  function list(): Promise<CollectionResponse[]>\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n- "
    },
    {
      "kind": "code",
      "text": "`get`"
    },
    {
      "kind": "text",
      "text": ": Fetch a collection by ID.\n- "
    },
    {
      "kind": "code",
      "text": "`list`"
    },
    {
      "kind": "text",
      "text": ": List all collections.\n\n---\n\n### product\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\nnamespace product {\n  function get(collectionId: string, productId: string): Promise<ProductResponse>\n  function list(collectionId: string): Promise<ProductResponse[]>\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n- "
    },
    {
      "kind": "code",
      "text": "`get`"
    },
    {
      "kind": "text",
      "text": ": Fetch a product by collection and product ID.\n- "
    },
    {
      "kind": "code",
      "text": "`list`"
    },
    {
      "kind": "text",
      "text": ": List all products for a collection.\n\n---\n\n### proof\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\nnamespace proof {\n  function get(collectionId: string, proofId: string): Promise<ProofResponse>\n  function list(collectionId: string): Promise<ProofResponse[]>\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n- "
    },
    {
      "kind": "code",
      "text": "`get`"
    },
    {
      "kind": "text",
      "text": ": Fetch a proof by collection and proof ID.\n- "
    },
    {
      "kind": "code",
      "text": "`list`"
    },
    {
      "kind": "text",
      "text": ": List all proofs for a collection.\n\n---\n\n### appConfiguration\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\nnamespace appConfiguration {\n  function get(collectionId: string, appId: string): Promise<AppConfigurationResponse>\n  function list(collectionId: string): Promise<AppConfigurationResponse[]>\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n- "
    },
    {
      "kind": "code",
      "text": "`get`"
    },
    {
      "kind": "text",
      "text": ": Fetch an app configuration by collection and app ID.\n- "
    },
    {
      "kind": "code",
      "text": "`list`"
    },
    {
      "kind": "text",
      "text": ": List all app configurations for a collection.\n\n---\n\n### asset\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\nnamespace asset {\n  function getForCollection(collectionId: string, assetId: string): Promise<AssetResponse>\n  function listForCollection(collectionId: string): Promise<AssetResponse[]>\n  function getForProduct(collectionId: string, productId: string, assetId: string): Promise<AssetResponse>\n  function listForProduct(collectionId: string, productId: string): Promise<AssetResponse[]>\n  function getForProof(collectionId: string, productId: string, proofId: string, assetId: string): Promise<AssetResponse>\n  function listForProof(collectionId: string, productId: string, proofId: string, appId?: string): Promise<AssetResponse[]>\n  function uploadAsset(\n    collectionId: string,\n    productId: string,\n    proofId: string,\n    file: File,\n    extraData?: Record<string, any>,\n    onProgress?: (percent: number) => void\n  ): Promise<AssetResponse>\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n- Asset retrieval and upload for collections, products, and proofs.\n\n---\n\n### attestation\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\nnamespace attestation {\n  function create(data: AttestationCreateRequest): Promise<AttestationResponse>\n  function update(attestationId: string, data: AttestationUpdateRequest): Promise<AttestationResponse>\n  function get(attestationId: string): Promise<AttestationResponse>\n  function list(): Promise<AttestationResponse[]>\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n- Create, update, fetch, and list attestations.\n\n---\n\n### auth\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\nnamespace auth {\n  function login(email: string, password: string): Promise<LoginResponse>\n  function verifyToken(token: string): Promise<VerifyTokenResponse>\n  function getAccountInfo(): Promise<AccountInfoResponse>\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n- Authentication and account info utilities.\n\n---\n\n## Types\n\n### CollectionResponse\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface CollectionResponse {\n  id: string\n  name: string\n  description?: string\n  // ...other fields\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### ProductResponse\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface ProductResponse {\n  id: string\n  collectionId: string\n  name: string\n  // ...other fields\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### ProofResponse\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface ProofResponse {\n  id: string\n  collectionId: string\n  productId: string\n  // ...other fields\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### AppConfigurationResponse\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface AppConfigurationResponse {\n  id: string\n  collectionId: string\n  appId: string\n  config: any\n  // ...other fields\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### AssetResponse\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface AssetResponse {\n  id: string\n  url: string\n  type: string\n  // ...other fields\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### AttestationCreateRequest\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface AttestationCreateRequest {\n  // ...fields for creating an attestation\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### AttestationUpdateRequest\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface AttestationUpdateRequest {\n  // ...fields for updating an attestation\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### AttestationResponse\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface AttestationResponse {\n  id: string\n  // ...other fields\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### ErrorResponse\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface ErrorResponse {\n  code: string\n  message: string\n  details?: any\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### LoginResponse\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface LoginResponse {\n  account: Record<string, any>\n  bearerToken: string\n  email: string\n  id: string\n  name: string\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### VerifyTokenResponse\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface VerifyTokenResponse {\n  account?: Record<string, any>\n  email?: string\n  id?: string\n  name?: string\n  valid: boolean\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### AccountInfoResponse\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface AccountInfoResponse {\n  account: Record<string, any>\n  location: Record<string, any>\n  owner: Record<string, any>\n  user: Record<string, any>\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n### AppConfigOptions\n\n"
    },
    {
      "kind": "code",
      "text": "```ts\ninterface AppConfigOptions {\n  admin?: boolean\n  appId: string\n  batchId?: string\n  collectionId?: string\n  config?: any\n  data?: any\n  itemId?: string\n  productId?: string\n  user?: boolean\n  userData?: boolean\n  variantId?: string\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n---\n\n## Error Handling\n\nAll API functions throw an "
    },
    {
      "kind": "code",
      "text": "`Error`"
    },
    {
      "kind": "text",
      "text": " or "
    },
    {
      "kind": "code",
      "text": "`ErrorResponse`"
    },
    {
      "kind": "text",
      "text": " on failure.\n\n---\n\n## Changelog\n\n### 1.0.0\n\n- Initial release with all namespaces, types, and error handling."
    }
  ],
  "symbolIdMap": {
    "0": {
      "sourceFileName": "src/index.ts",
      "qualifiedName": ""
    },
    "1": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "initializeApi"
    },
    "2": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "initializeApi"
    },
    "3": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "options"
    },
    "4": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "__type"
    },
    "5": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "__type.baseURL"
    },
    "6": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "__type.apiKey"
    },
    "7": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "__type.bearerToken"
    },
    "8": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "__type.proxyMode"
    },
    "9": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "request"
    },
    "10": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "request"
    },
    "11": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "T"
    },
    "12": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "path"
    },
    "13": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "LoginResponse"
    },
    "14": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type"
    },
    "15": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.id"
    },
    "16": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.name"
    },
    "17": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.email"
    },
    "18": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.bearerToken"
    },
    "19": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.account"
    },
    "20": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "VerifyTokenResponse"
    },
    "21": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type"
    },
    "22": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.valid"
    },
    "23": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.id"
    },
    "24": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.name"
    },
    "25": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.email"
    },
    "26": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.account"
    },
    "27": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "AccountInfoResponse"
    },
    "28": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type"
    },
    "29": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.user"
    },
    "30": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.owner"
    },
    "31": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.account"
    },
    "32": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.location"
    },
    "33": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse"
    },
    "34": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.id"
    },
    "35": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.createdAt"
    },
    "36": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.updatedAt"
    },
    "37": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.public"
    },
    "38": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.private"
    },
    "39": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.proof"
    },
    "40": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationCreateRequest"
    },
    "41": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationCreateRequest.public"
    },
    "42": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationCreateRequest.private"
    },
    "43": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationCreateRequest.proof"
    },
    "44": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationUpdateRequest"
    },
    "45": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationUpdateRequest.type"
    },
    "46": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationUpdateRequest.data"
    },
    "47": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "AppConfigOptions"
    },
    "48": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type"
    },
    "49": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.appId"
    },
    "50": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.collectionId"
    },
    "51": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.productId"
    },
    "52": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.variantId"
    },
    "53": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.batchId"
    },
    "54": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.itemId"
    },
    "55": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.user"
    },
    "56": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.userData"
    },
    "57": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.admin"
    },
    "58": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.config"
    },
    "59": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.data"
    },
    "60": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection"
    },
    "61": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.get"
    },
    "62": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.get"
    },
    "63": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collectionId"
    },
    "64": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product"
    },
    "65": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.get"
    },
    "66": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.get"
    },
    "67": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "collectionId"
    },
    "68": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "productId"
    },
    "69": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.list"
    },
    "70": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.list"
    },
    "71": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "collectionId"
    },
    "72": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof"
    },
    "73": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.get"
    },
    "74": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.get"
    },
    "75": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "collectionId"
    },
    "76": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proofId"
    },
    "77": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.list"
    },
    "78": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.list"
    },
    "79": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "collectionId"
    },
    "80": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration"
    },
    "81": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getConfig"
    },
    "82": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getConfig"
    },
    "83": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "84": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.setConfig"
    },
    "85": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.setConfig"
    },
    "86": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "87": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.deleteConfig"
    },
    "88": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.deleteConfig"
    },
    "89": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "90": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getData"
    },
    "91": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getData"
    },
    "92": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "93": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getDataItem"
    },
    "94": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getDataItem"
    },
    "95": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "96": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.setDataItem"
    },
    "97": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.setDataItem"
    },
    "98": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "99": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.deleteDataItem"
    },
    "100": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.deleteDataItem"
    },
    "101": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "102": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset"
    },
    "103": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForCollection"
    },
    "104": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForCollection"
    },
    "105": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "106": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "assetId"
    },
    "107": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForCollection"
    },
    "108": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForCollection"
    },
    "109": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "110": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForProduct"
    },
    "111": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForProduct"
    },
    "112": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "113": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "productId"
    },
    "114": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "assetId"
    },
    "115": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForProduct"
    },
    "116": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForProduct"
    },
    "117": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "118": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "productId"
    },
    "119": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForProof"
    },
    "120": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForProof"
    },
    "121": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "122": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "productId"
    },
    "123": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "proofId"
    },
    "124": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "assetId"
    },
    "125": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForProof"
    },
    "126": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForProof"
    },
    "127": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "128": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "productId"
    },
    "129": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "proofId"
    },
    "130": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "appId"
    },
    "131": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.uploadAsset"
    },
    "132": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.uploadAsset"
    },
    "133": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "134": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "productId"
    },
    "135": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "proofId"
    },
    "136": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "file"
    },
    "137": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "extraData"
    },
    "138": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "onProgress"
    },
    "139": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "__type"
    },
    "140": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "__type"
    },
    "141": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "percent"
    },
    "142": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation"
    },
    "143": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.list"
    },
    "144": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.list"
    },
    "145": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "collectionId"
    },
    "146": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "productId"
    },
    "147": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "proofId"
    },
    "148": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.get"
    },
    "149": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.get"
    },
    "150": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "collectionId"
    },
    "151": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "productId"
    },
    "152": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "proofId"
    },
    "153": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestationId"
    },
    "154": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.create"
    },
    "155": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.create"
    },
    "156": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "collectionId"
    },
    "157": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "productId"
    },
    "158": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "proofId"
    },
    "159": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "data"
    },
    "160": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.update"
    },
    "161": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.update"
    },
    "162": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "collectionId"
    },
    "163": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "productId"
    },
    "164": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "proofId"
    },
    "165": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestationId"
    },
    "166": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "data"
    },
    "167": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.remove"
    },
    "168": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.remove"
    },
    "169": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "collectionId"
    },
    "170": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "productId"
    },
    "171": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "proofId"
    },
    "172": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestationId"
    },
    "173": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth"
    },
    "174": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.login"
    },
    "175": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.login"
    },
    "176": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "email"
    },
    "177": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "password"
    },
    "178": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.logout"
    },
    "179": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.logout"
    },
    "180": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.verifyToken"
    },
    "181": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.verifyToken"
    },
    "182": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "token"
    },
    "183": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.getAccount"
    },
    "184": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.getAccount"
    },
    "185": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse"
    },
    "186": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.id"
    },
    "187": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.name"
    },
    "188": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.title"
    },
    "189": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.logoImage"
    },
    "190": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse"
    },
    "191": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse.id"
    },
    "192": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse.name"
    },
    "193": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse.description"
    },
    "194": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse.heroImage"
    },
    "195": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse"
    },
    "196": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.collectionId"
    },
    "197": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.createdAt"
    },
    "198": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.id"
    },
    "199": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.productId"
    },
    "200": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.tokenId"
    },
    "201": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.userId"
    },
    "202": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.values"
    },
    "203": {
      "sourceFileName": "src/types/appConfiguration.ts",
      "qualifiedName": "AppConfigurationResponse"
    },
    "204": {
      "sourceFileName": "src/types/appConfiguration.ts",
      "qualifiedName": "AppConfigurationResponse.id"
    },
    "205": {
      "sourceFileName": "src/types/appConfiguration.ts",
      "qualifiedName": "AppConfigurationResponse.name"
    },
    "206": {
      "sourceFileName": "src/types/appConfiguration.ts",
      "qualifiedName": "AppConfigurationResponse.settings"
    },
    "207": {
      "sourceFileName": "src/types/error.ts",
      "qualifiedName": "ErrorResponse"
    },
    "208": {
      "sourceFileName": "src/types/error.ts",
      "qualifiedName": "ErrorResponse.code"
    },
    "209": {
      "sourceFileName": "src/types/error.ts",
      "qualifiedName": "ErrorResponse.message"
    },
    "210": {
      "sourceFileName": "src/types/asset.ts",
      "qualifiedName": "AssetResponse"
    },
    "211": {
      "sourceFileName": "src/types/asset.ts",
      "qualifiedName": "AssetResponse.id"
    },
    "212": {
      "sourceFileName": "src/types/asset.ts",
      "qualifiedName": "AssetResponse.name"
    },
    "213": {
      "sourceFileName": "src/types/asset.ts",
      "qualifiedName": "AssetResponse.url"
    }
  }
}
```

_Replace this with a full markdown generator for production use._


