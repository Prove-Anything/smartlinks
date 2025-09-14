# @proveanything/smartlinks

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
      "id": 88,
      "name": "AppConfigOptions",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "type": {
        "type": "reflection",
        "declaration": {
          "id": 89,
          "name": "__type",
          "variant": "declaration",
          "kind": 65536,
          "flags": {},
          "children": [
            {
              "id": 90,
              "name": "appId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 91,
              "name": "collectionId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 92,
              "name": "productId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 93,
              "name": "variantId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 94,
              "name": "batchId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 95,
              "name": "itemId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 96,
              "name": "user",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "boolean"
              }
            },
            {
              "id": 97,
              "name": "userData",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "boolean"
              }
            },
            {
              "id": 98,
              "name": "admin",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "boolean"
              }
            },
            {
              "id": 99,
              "name": "config",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "any"
              }
            },
            {
              "id": 100,
              "name": "data",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "any"
              }
            }
          ],
          "groups": [
            {
              "title": "Properties",
              "children": [
                90,
                91,
                92,
                93,
                94,
                95,
                96,
                97,
                98,
                99,
                100
              ]
            }
          ]
        }
      }
    },
    {
      "id": 206,
      "name": "appConfiguration",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 207,
          "name": "getConfig",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 208,
              "name": "getConfig",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 209,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 88,
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
          "id": 210,
          "name": "setConfig",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 211,
              "name": "setConfig",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 212,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 88,
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
          "id": 213,
          "name": "deleteConfig",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 214,
              "name": "deleteConfig",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 215,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 88,
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
          "id": 216,
          "name": "getData",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 217,
              "name": "getData",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 218,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 88,
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
          "id": 219,
          "name": "getDataItem",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 220,
              "name": "getDataItem",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 221,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 88,
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
          "id": 222,
          "name": "setDataItem",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 223,
              "name": "setDataItem",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 224,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 88,
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
          "id": 225,
          "name": "deleteDataItem",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 226,
              "name": "deleteDataItem",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 227,
                  "name": "opts",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 88,
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
        }
      ],
      "groups": [
        {
          "title": "Functions",
          "children": [
            207,
            210,
            213,
            216,
            219,
            222,
            225
          ]
        }
      ]
    },
    {
      "id": 228,
      "name": "appRecord",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 229,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 230,
              "name": "get",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 231,
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
                  "id": 232,
                  "name": "appId",
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
          "id": 233,
          "name": "create",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 234,
              "name": "create",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 235,
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
                  "id": 236,
                  "name": "appId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 237,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
          "id": 238,
          "name": "update",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 239,
              "name": "update",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 240,
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
                  "id": 241,
                  "name": "appId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 242,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
          "id": 243,
          "name": "remove",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 244,
              "name": "remove",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 245,
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
                  "id": 246,
                  "name": "appId",
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
        }
      ],
      "groups": [
        {
          "title": "Functions",
          "children": [
            229,
            233,
            238,
            243
          ]
        }
      ]
    },
    {
      "id": 247,
      "name": "asset",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 248,
          "name": "getForCollection",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 249,
              "name": "getForCollection",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 250,
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
                  "id": 251,
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
                    "target": 592,
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
          "id": 252,
          "name": "listForCollection",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 253,
              "name": "listForCollection",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 254,
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
                      "target": 592,
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
          "id": 255,
          "name": "getForProduct",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 256,
              "name": "getForProduct",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 257,
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
                  "id": 258,
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
                  "id": 259,
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
                    "target": 592,
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
          "id": 260,
          "name": "listForProduct",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 261,
              "name": "listForProduct",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 262,
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
                  "id": 263,
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
                      "target": 592,
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
          "id": 264,
          "name": "getForProof",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 265,
              "name": "getForProof",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 266,
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
                  "id": 267,
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
                  "id": 268,
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
                  "id": 269,
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
                    "target": 592,
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
          "id": 270,
          "name": "listForProof",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 271,
              "name": "listForProof",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "parameters": [
                {
                  "id": 272,
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
                  "id": 273,
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
                  "id": 274,
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
                  "id": 275,
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
                      "target": 592,
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
          "id": 276,
          "name": "uploadAsset",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 277,
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
              "parameters": [
                {
                  "id": 278,
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
                  "id": 279,
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
                  "id": 280,
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
                  "id": 281,
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
                  "id": 282,
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
                  "id": 283,
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
                      "id": 284,
                      "name": "__type",
                      "variant": "declaration",
                      "kind": 65536,
                      "flags": {},
                      "signatures": [
                        {
                          "id": 285,
                          "name": "__type",
                          "variant": "signature",
                          "kind": 4096,
                          "flags": {},
                          "parameters": [
                            {
                              "id": 286,
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
                    "target": 592,
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
            248,
            252,
            255,
            260,
            264,
            270,
            276
          ]
        }
      ]
    },
    {
      "id": 287,
      "name": "attestation",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 288,
          "name": "list",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 289,
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
              "parameters": [
                {
                  "id": 290,
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
                  "id": 291,
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
                  "id": 292,
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
                      "target": 68,
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
          "id": 293,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 294,
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
              "parameters": [
                {
                  "id": 295,
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
                  "id": 296,
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
                  "id": 297,
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
                  "id": 298,
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
                    "target": 68,
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
          "id": 299,
          "name": "create",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 300,
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
              "parameters": [
                {
                  "id": 301,
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
                  "id": 302,
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
                  "id": 303,
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
                  "id": 304,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 75,
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
                    "target": 68,
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
          "id": 305,
          "name": "update",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 306,
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
              "parameters": [
                {
                  "id": 307,
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
                  "id": 308,
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
                  "id": 309,
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
                  "id": 310,
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
                  "id": 311,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "reference",
                    "target": 79,
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
                    "target": 68,
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
          "id": 312,
          "name": "remove",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 313,
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
              "parameters": [
                {
                  "id": 314,
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
                  "id": 315,
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
                  "id": 316,
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
                  "id": 317,
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
        }
      ],
      "groups": [
        {
          "title": "Functions",
          "children": [
            288,
            293,
            299,
            305,
            312
          ]
        }
      ]
    },
    {
      "id": 18,
      "name": "LoginResponse",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "type": {
        "type": "reflection",
        "declaration": {
          "id": 19,
          "name": "__type",
          "variant": "declaration",
          "kind": 65536,
          "flags": {},
          "children": [
            {
              "id": 20,
              "name": "id",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 21,
              "name": "name",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 22,
              "name": "email",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 23,
              "name": "bearerToken",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 24,
              "name": "account",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
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
                20,
                21,
                22,
                23,
                24
              ]
            }
          ]
        }
      }
    },
    {
      "id": 25,
      "name": "VerifyTokenResponse",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "type": {
        "type": "reflection",
        "declaration": {
          "id": 26,
          "name": "__type",
          "variant": "declaration",
          "kind": 65536,
          "flags": {},
          "children": [
            {
              "id": 27,
              "name": "valid",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "boolean"
              }
            },
            {
              "id": 28,
              "name": "id",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 29,
              "name": "name",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 30,
              "name": "email",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
              },
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 31,
              "name": "account",
              "variant": "declaration",
              "kind": 1024,
              "flags": {
                "isOptional": true
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
            }
          ],
          "groups": [
            {
              "title": "Properties",
              "children": [
                27,
                28,
                29,
                30,
                31
              ]
            }
          ]
        }
      }
    },
    {
      "id": 32,
      "name": "AccountInfoResponse",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "type": {
        "type": "reflection",
        "declaration": {
          "id": 33,
          "name": "__type",
          "variant": "declaration",
          "kind": 65536,
          "flags": {},
          "children": [
            {
              "id": 34,
              "name": "accessType",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 35,
              "name": "analyticsCode",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 36,
              "name": "analyticsId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 37,
              "name": "auth_time",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "number"
              }
            },
            {
              "id": 38,
              "name": "baseCollectionId",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 39,
              "name": "clientType",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 40,
              "name": "email",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 41,
              "name": "email_verified",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "boolean"
              }
            },
            {
              "id": 42,
              "name": "features",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "reflection",
                "declaration": {
                  "id": 43,
                  "name": "__type",
                  "variant": "declaration",
                  "kind": 65536,
                  "flags": {},
                  "children": [
                    {
                      "id": 44,
                      "name": "actionLogger",
                      "variant": "declaration",
                      "kind": 1024,
                      "flags": {},
                      "type": {
                        "type": "intrinsic",
                        "name": "boolean"
                      }
                    },
                    {
                      "id": 45,
                      "name": "adminCollections",
                      "variant": "declaration",
                      "kind": 1024,
                      "flags": {},
                      "type": {
                        "type": "intrinsic",
                        "name": "boolean"
                      }
                    },
                    {
                      "id": 46,
                      "name": "adminApps",
                      "variant": "declaration",
                      "kind": 1024,
                      "flags": {},
                      "type": {
                        "type": "intrinsic",
                        "name": "boolean"
                      }
                    },
                    {
                      "id": 47,
                      "name": "apiKeys",
                      "variant": "declaration",
                      "kind": 1024,
                      "flags": {},
                      "type": {
                        "type": "intrinsic",
                        "name": "boolean"
                      }
                    },
                    {
                      "id": 48,
                      "name": "adminUsers",
                      "variant": "declaration",
                      "kind": 1024,
                      "flags": {},
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
                        44,
                        45,
                        46,
                        47,
                        48
                      ]
                    }
                  ],
                  "indexSignature": {
                    "id": 49,
                    "name": "__index",
                    "variant": "signature",
                    "kind": 8192,
                    "flags": {},
                    "parameters": [
                      {
                        "id": 50,
                        "name": "key",
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
                      "type": "intrinsic",
                      "name": "boolean"
                    }
                  }
                }
              }
            },
            {
              "id": 51,
              "name": "iat",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "number"
              }
            },
            {
              "id": 52,
              "name": "id",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 53,
              "name": "iss",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 54,
              "name": "location",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "union",
                "types": [
                  {
                    "type": "intrinsic",
                    "name": "string"
                  },
                  {
                    "type": "literal",
                    "value": null
                  }
                ]
              }
            },
            {
              "id": 55,
              "name": "name",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 56,
              "name": "picture",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 57,
              "name": "sites",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "reflection",
                "declaration": {
                  "id": 58,
                  "name": "__type",
                  "variant": "declaration",
                  "kind": 65536,
                  "flags": {},
                  "indexSignature": {
                    "id": 59,
                    "name": "__index",
                    "variant": "signature",
                    "kind": 8192,
                    "flags": {},
                    "parameters": [
                      {
                        "id": 60,
                        "name": "siteName",
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
                      "type": "intrinsic",
                      "name": "boolean"
                    }
                  }
                }
              }
            },
            {
              "id": 61,
              "name": "sub",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 62,
              "name": "uid",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 63,
              "name": "user_id",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 64,
              "name": "whitelabel",
              "variant": "declaration",
              "kind": 1024,
              "flags": {},
              "type": {
                "type": "reflection",
                "declaration": {
                  "id": 65,
                  "name": "__type",
                  "variant": "declaration",
                  "kind": 65536,
                  "flags": {},
                  "indexSignature": {
                    "id": 66,
                    "name": "__index",
                    "variant": "signature",
                    "kind": 8192,
                    "flags": {},
                    "parameters": [
                      {
                        "id": 67,
                        "name": "key",
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
                      "type": "intrinsic",
                      "name": "any"
                    }
                  }
                }
              }
            }
          ],
          "groups": [
            {
              "title": "Properties",
              "children": [
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41,
                42,
                51,
                52,
                53,
                54,
                55,
                56,
                57,
                61,
                62,
                63,
                64
              ]
            }
          ]
        }
      }
    },
    {
      "id": 318,
      "name": "auth",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 319,
          "name": "login",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 320,
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
              "parameters": [
                {
                  "id": 321,
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
                  "id": 322,
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
                    "target": 18,
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
          "id": 323,
          "name": "logout",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 324,
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
              "type": {
                "type": "intrinsic",
                "name": "void"
              }
            }
          ]
        },
        {
          "id": 325,
          "name": "verifyToken",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 326,
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
              "parameters": [
                {
                  "id": 327,
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
                    "target": 25,
                    "name": "VerifyTokenResponse",
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
          "id": 328,
          "name": "requestAdminJWT",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 329,
              "name": "requestAdminJWT",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Requests an admin JWT for the current user and a specific collection\r\nReturns JWT if valid."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 330,
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
                    "type": "intrinsic",
                    "name": "string"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 331,
          "name": "requestPublicJWT",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 332,
              "name": "requestPublicJWT",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Requests a JWT for the current user and a specific collection/product/proof\r\nValidates if the user has access to the resource, and returns a JWT"
                  }
                ]
              },
              "parameters": [
                {
                  "id": 333,
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
                  "id": 334,
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
                  "id": 335,
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
                    "type": "intrinsic",
                    "name": "string"
                  }
                ],
                "name": "Promise",
                "package": "typescript"
              }
            }
          ]
        },
        {
          "id": 336,
          "name": "getAccount",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 337,
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
              "type": {
                "type": "reference",
                "target": {
                  "sourceFileName": "node_modules/typescript/lib/lib.es5.d.ts",
                  "qualifiedName": "Promise"
                },
                "typeArguments": [
                  {
                    "type": "reference",
                    "target": 32,
                    "name": "AccountInfoResponse",
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
            319,
            323,
            325,
            328,
            331,
            336
          ]
        }
      ]
    },
    {
      "id": 429,
      "name": "batch",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 430,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 431,
              "name": "get",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get a single batch by ID for a collection and product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a BatchResponse object"
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
              "parameters": [
                {
                  "id": 432,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 433,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 434,
                  "name": "batchId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the batch"
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
                    "target": 82,
                    "name": "BatchResponse",
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
          "id": 435,
          "name": "list",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 436,
              "name": "list",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "List all batches for a collection and product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to an array of BatchResponse objects"
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
              "parameters": [
                {
                  "id": 437,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 438,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
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
                      "target": 82,
                      "name": "BatchResponse",
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
          "id": 439,
          "name": "create",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 440,
              "name": "create",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Create a new batch for a collection and product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a BatchResponse object"
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
              "parameters": [
                {
                  "id": 441,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 442,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 443,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Batch creation data"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
                    "target": 82,
                    "name": "BatchResponse",
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
          "id": 444,
          "name": "update",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 445,
              "name": "update",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Update a batch for a collection and product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a BatchResponse object"
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
              "parameters": [
                {
                  "id": 446,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 447,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 448,
                  "name": "batchId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the batch"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 449,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Batch update data"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
                    "target": 82,
                    "name": "BatchResponse",
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
          "id": 450,
          "name": "remove",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 451,
              "name": "remove",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Delete a batch for a collection and product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to void"
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
              "parameters": [
                {
                  "id": 452,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 453,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 454,
                  "name": "batchId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the batch"
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
          "id": 455,
          "name": "getPublic",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 456,
              "name": "getPublic",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get a single batch by ID for a collection and product (public endpoint)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a BatchResponse object"
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
              "parameters": [
                {
                  "id": 457,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 458,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 459,
                  "name": "batchId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the batch"
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
                    "target": 82,
                    "name": "BatchResponse",
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
          "id": 460,
          "name": "getSN",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 461,
              "name": "getSN",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get serial numbers for a batch (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to serial number data"
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
              "parameters": [
                {
                  "id": 462,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 463,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 464,
                  "name": "batchId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the batch"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 465,
                  "name": "startIndex",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Starting index for pagination (default: 0)"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "number"
                  },
                  "defaultValue": "0"
                },
                {
                  "id": 466,
                  "name": "count",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Number of serial numbers to retrieve (default: 10)"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "number"
                  },
                  "defaultValue": "10"
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
          "id": 467,
          "name": "lookupSN",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 468,
              "name": "lookupSN",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Look up a serial number by code for a batch (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to serial number lookup data"
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
              "parameters": [
                {
                  "id": 469,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 470,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 471,
                  "name": "batchId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the batch"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 472,
                  "name": "codeId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "The serial number code to look up"
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
            430,
            435,
            439,
            444,
            450,
            455,
            460,
            467
          ]
        }
      ]
    },
    {
      "id": 361,
      "name": "claimSet",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 362,
          "name": "getAllForCollection",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 363,
              "name": "getAllForCollection",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get all claim sets for a collection."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to an array of claim sets"
                      }
                    ]
                  }
                ]
              },
              "parameters": [
                {
                  "id": 364,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
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
          "id": 365,
          "name": "getForCollection",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 366,
              "name": "getForCollection",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get a specific claim set for a collection."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a claim set object"
                      }
                    ]
                  }
                ]
              },
              "parameters": [
                {
                  "id": 367,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 368,
                  "name": "claimSetId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The claim set identifier"
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
          "id": 369,
          "name": "getAllTags",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 370,
              "name": "getAllTags",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get all tags for a claim set."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to an array of tags"
                      }
                    ]
                  }
                ]
              },
              "parameters": [
                {
                  "id": 371,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 372,
                  "name": "claimSetId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The claim set identifier"
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
          "id": 373,
          "name": "getReport",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 374,
              "name": "getReport",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get a report for a claim set."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a report object"
                      }
                    ]
                  }
                ]
              },
              "parameters": [
                {
                  "id": 375,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 376,
                  "name": "claimSetId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The claim set identifier"
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
          "id": 377,
          "name": "getAssignedTags",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 378,
              "name": "getAssignedTags",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get assigned tags for a claim set."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to assigned tags"
                      }
                    ]
                  }
                ]
              },
              "parameters": [
                {
                  "id": 379,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 380,
                  "name": "claimSetId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The claim set identifier"
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
          "id": 381,
          "name": "getTagSummary",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 382,
              "name": "getTagSummary",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get tag summary for a collection."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to tag summary"
                      }
                    ]
                  }
                ]
              },
              "parameters": [
                {
                  "id": 383,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
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
          "id": 384,
          "name": "tagQuery",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 385,
              "name": "tagQuery",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Perform a tag query for a collection."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to query results"
                      }
                    ]
                  }
                ]
              },
              "parameters": [
                {
                  "id": 386,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 387,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The query data"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
          "id": 388,
          "name": "createForCollection",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 389,
              "name": "createForCollection",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Create a new claim set for a collection."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to the created claim set"
                      }
                    ]
                  }
                ]
              },
              "parameters": [
                {
                  "id": 390,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 391,
                  "name": "params",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The claim set creation parameters"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
          "id": 392,
          "name": "updateForCollection",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 393,
              "name": "updateForCollection",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Update a claim set for a collection."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to the updated claim set"
                      }
                    ]
                  }
                ]
              },
              "parameters": [
                {
                  "id": 394,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 395,
                  "name": "params",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The claim set update parameters (must include id)"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
          "id": 396,
          "name": "makeClaim",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 397,
              "name": "makeClaim",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Make a claim for a claim set."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to the claim result"
                      }
                    ]
                  }
                ]
              },
              "parameters": [
                {
                  "id": 398,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 399,
                  "name": "params",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The claim parameters (must include id)"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
          "id": 400,
          "name": "assignClaims",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 401,
              "name": "assignClaims",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Assign claims to a claim set."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 402,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 403,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The claims data to assign"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
          "id": 404,
          "name": "updateClaimData",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 405,
              "name": "updateClaimData",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Update claim data for a collection."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 406,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 407,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The claim data to update"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
            362,
            365,
            369,
            373,
            377,
            381,
            384,
            388,
            392,
            396,
            400,
            404
          ]
        }
      ]
    },
    {
      "id": 101,
      "name": "collection",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 102,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 103,
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
              "parameters": [
                {
                  "id": 104,
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
                },
                {
                  "id": 105,
                  "name": "admin",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {
                    "isOptional": true
                  },
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– If true, fetches from the admin endpoint"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "boolean"
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
                    "target": 517,
                    "name": "CollectionResponse",
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
          "id": 106,
          "name": "list",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 107,
              "name": "list",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Retrieves all Collections."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to an array of CollectionResponse objects"
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
              "parameters": [
                {
                  "id": 108,
                  "name": "admin",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {
                    "isOptional": true
                  },
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– If true, fetches from the admin endpoint"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "boolean"
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
                      "target": 517,
                      "name": "CollectionResponse",
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
          "id": 109,
          "name": "create",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 110,
              "name": "create",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Create a new collection (admin only)."
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
              "parameters": [
                {
                  "id": 111,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Collection creation data"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
                    "target": 517,
                    "name": "CollectionResponse",
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
          "id": 112,
          "name": "update",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 113,
              "name": "update",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Update a collection (admin only)."
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
              "parameters": [
                {
                  "id": 114,
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
                },
                {
                  "id": 115,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Collection update data"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
                    "target": 517,
                    "name": "CollectionResponse",
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
          "id": 116,
          "name": "remove",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 117,
              "name": "remove",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Delete a collection (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to void"
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
              "parameters": [
                {
                  "id": 118,
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
          "id": 119,
          "name": "getSN",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 120,
              "name": "getSN",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get serial numbers for a collection (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to serial number data"
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
              "parameters": [
                {
                  "id": 121,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 122,
                  "name": "startIndex",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Starting index for pagination (default: 0)"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "number"
                  },
                  "defaultValue": "0"
                },
                {
                  "id": 123,
                  "name": "count",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Number of serial numbers to retrieve (default: 10)"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "number"
                  },
                  "defaultValue": "10"
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
          "id": 124,
          "name": "lookupSN",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 125,
              "name": "lookupSN",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Look up a serial number by code for a collection (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to serial number lookup data"
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
              "parameters": [
                {
                  "id": 126,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 127,
                  "name": "codeId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "The serial number code to look up"
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
          "id": 128,
          "name": "assignSN",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 129,
              "name": "assignSN",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Assign a value to a serial number for a collection (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to assignment result"
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
              "parameters": [
                {
                  "id": 130,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 131,
                  "name": "codeId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "The serial number code to assign"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 132,
                  "name": "value",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "The value to assign to the serial number"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
            102,
            106,
            109,
            112,
            116,
            119,
            124,
            128
          ]
        }
      ]
    },
    {
      "id": 408,
      "name": "crate",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 409,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 410,
              "name": "get",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get a single crate by ID for a collection (admin only)."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 411,
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
                  "id": 412,
                  "name": "crateId",
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
          "id": 413,
          "name": "list",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 414,
              "name": "list",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "List all crates for a collection (admin only)."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 415,
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
          "id": 416,
          "name": "create",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 417,
              "name": "create",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Create a new crate for a collection (admin only)."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 418,
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
                  "id": 419,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
          "id": 420,
          "name": "update",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 421,
              "name": "update",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Update a crate for a collection (admin only)."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 422,
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
                  "id": 423,
                  "name": "crateId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 424,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
          "id": 425,
          "name": "remove",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 426,
              "name": "remove",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Delete a crate for a collection (admin only)."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 427,
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
                  "id": 428,
                  "name": "crateId",
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
        }
      ],
      "groups": [
        {
          "title": "Functions",
          "children": [
            409,
            413,
            416,
            420,
            425
          ]
        }
      ]
    },
    {
      "id": 338,
      "name": "form",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 339,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 340,
              "name": "get",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get a single form by ID for a collection."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 341,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 342,
                  "name": "formId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The form identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 343,
                  "name": "admin",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {
                    "isOptional": true
                  },
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– If true, use admin endpoint; otherwise, use public"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "boolean"
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
          "id": 344,
          "name": "list",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 345,
              "name": "list",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "List all forms for a collection."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 346,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 347,
                  "name": "admin",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {
                    "isOptional": true
                  },
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– If true, use admin endpoint; otherwise, use public"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "boolean"
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
          "id": 348,
          "name": "create",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 349,
              "name": "create",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Create a new form for a collection (admin only)."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 350,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 351,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The form data"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
          "id": 352,
          "name": "update",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 353,
              "name": "update",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Update a form for a collection (admin only)."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 354,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 355,
                  "name": "formId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The form identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 356,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The form data"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
          "id": 357,
          "name": "remove",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 358,
              "name": "remove",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Delete a form for a collection (admin only)."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 359,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The collection identifier"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 360,
                  "name": "formId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– The form identifier"
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
                    "type": "intrinsic",
                    "name": "void"
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
            339,
            344,
            348,
            352,
            357
          ]
        }
      ]
    },
    {
      "id": 133,
      "name": "product",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 134,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 135,
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
              "parameters": [
                {
                  "id": 136,
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
                  "id": 137,
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
                },
                {
                  "id": 138,
                  "name": "admin",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {
                    "isOptional": true
                  },
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– If true, use admin endpoint; otherwise, use public"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "boolean"
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
                    "target": 556,
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
          "id": 139,
          "name": "list",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 140,
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
              "parameters": [
                {
                  "id": 141,
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
                  "id": 142,
                  "name": "admin",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {
                    "isOptional": true
                  },
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– If true, use admin endpoint; otherwise, use public"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "boolean"
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
                      "target": 556,
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
        },
        {
          "id": 143,
          "name": "create",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 144,
              "name": "create",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Create a new product for a collection (admin only)."
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
              "parameters": [
                {
                  "id": 145,
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
                  "id": 146,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Product creation data"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
                    "target": 556,
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
          "id": 147,
          "name": "update",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 148,
              "name": "update",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Update a product for a collection (admin only)."
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
              "parameters": [
                {
                  "id": 149,
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
                  "id": 150,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Identifier of the product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 151,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Product update data"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
                    "target": 556,
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
          "id": 152,
          "name": "remove",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 153,
              "name": "remove",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Delete a product for a collection (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to void"
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
              "parameters": [
                {
                  "id": 154,
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
                  "id": 155,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "– Identifier of the product"
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
          "id": 156,
          "name": "getSN",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 157,
              "name": "getSN",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get serial numbers for a product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to serial number data"
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
              "parameters": [
                {
                  "id": 158,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 159,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 160,
                  "name": "startIndex",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Starting index for pagination (default: 0)"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "number"
                  },
                  "defaultValue": "0"
                },
                {
                  "id": 161,
                  "name": "count",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Number of serial numbers to retrieve (default: 10)"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "number"
                  },
                  "defaultValue": "10"
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
          "id": 162,
          "name": "lookupSN",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 163,
              "name": "lookupSN",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Look up a serial number by code for a product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to serial number lookup data"
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
              "parameters": [
                {
                  "id": 164,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 165,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 166,
                  "name": "codeId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "The serial number code to look up"
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
            134,
            139,
            143,
            147,
            152,
            156,
            162
          ]
        }
      ]
    },
    {
      "id": 167,
      "name": "proof",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 168,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 169,
              "name": "get",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Retrieves a single Proof by Collection ID, Product ID, and Proof ID.\nBoth public and admin endpoints now include productId in the path."
                  }
                ]
              },
              "parameters": [
                {
                  "id": 170,
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
                  "id": 171,
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
                  "id": 172,
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
                  "id": 173,
                  "name": "admin",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {
                    "isOptional": true
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "boolean"
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
                    "target": 577,
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
          "id": 174,
          "name": "list",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 175,
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
              "parameters": [
                {
                  "id": 176,
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
                      "target": 577,
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
        },
        {
          "id": 177,
          "name": "create",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 178,
              "name": "create",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Create a proof for a product (admin only).\nPOST /admin/collection/:collectionId/product/:productId/proof"
                  }
                ]
              },
              "parameters": [
                {
                  "id": 179,
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
                  "id": 180,
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
                  "id": 181,
                  "name": "values",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
                    "target": 577,
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
          "id": 182,
          "name": "update",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 183,
              "name": "update",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Update a proof for a product (admin only).\nPUT /admin/collection/:collectionId/product/:productId/proof/:proofId"
                  }
                ]
              },
              "parameters": [
                {
                  "id": 184,
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
                  "id": 185,
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
                  "id": 186,
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
                  "id": 187,
                  "name": "values",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
                    "target": 577,
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
          "id": 188,
          "name": "getByUser",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 189,
              "name": "getByUser",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get proofs for a user in a collection (admin only).\nGET /admin/collection/:collectionId/proof/findByUser/:userId"
                  }
                ]
              },
              "parameters": [
                {
                  "id": 190,
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
                  "id": 191,
                  "name": "userId",
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
                      "target": 577,
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
        },
        {
          "id": 192,
          "name": "getByProduct",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 193,
              "name": "getByProduct",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get proofs for a product (admin only).\nGET /admin/collection/:collectionId/product/:productId/proof"
                  }
                ]
              },
              "parameters": [
                {
                  "id": 194,
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
                  "id": 195,
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
                      "target": 577,
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
        },
        {
          "id": 196,
          "name": "findByProduct",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 197,
              "name": "findByProduct",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Find proofs for a product (admin only).\nPOST /admin/collection/:collectionId/product/:productId/proof/find"
                  }
                ]
              },
              "parameters": [
                {
                  "id": 198,
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
                  "id": 199,
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
                  "id": 200,
                  "name": "query",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
                      "target": 577,
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
        },
        {
          "id": 201,
          "name": "getByBatch",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 202,
              "name": "getByBatch",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get proofs for a batch (admin only).\nGET /admin/collection/:collectionId/product/:productId/batch/:batchId/proof"
                  }
                ]
              },
              "parameters": [
                {
                  "id": 203,
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
                  "id": 204,
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
                  "id": 205,
                  "name": "batchId",
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
                      "target": 577,
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
            168,
            174,
            177,
            182,
            188,
            192,
            196,
            201
          ]
        }
      ]
    },
    {
      "id": 473,
      "name": "variant",
      "variant": "declaration",
      "kind": 4,
      "flags": {},
      "children": [
        {
          "id": 474,
          "name": "get",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 475,
              "name": "get",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get a single variant by ID for a collection and product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a VariantResponse object"
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
              "parameters": [
                {
                  "id": 476,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 477,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 478,
                  "name": "variantId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the variant"
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
                    "target": 85,
                    "name": "VariantResponse",
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
          "id": 479,
          "name": "list",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 480,
              "name": "list",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "List all variants for a collection and product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to an array of VariantResponse objects"
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
              "parameters": [
                {
                  "id": 481,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 482,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
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
                      "target": 85,
                      "name": "VariantResponse",
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
          "id": 483,
          "name": "create",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 484,
              "name": "create",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Create a new variant for a collection and product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a VariantResponse object"
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
              "parameters": [
                {
                  "id": 485,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 486,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 487,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Variant creation data"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
                    "target": 85,
                    "name": "VariantResponse",
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
          "id": 488,
          "name": "update",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 489,
              "name": "update",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Update a variant for a collection and product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a VariantResponse object"
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
              "parameters": [
                {
                  "id": 490,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 491,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 492,
                  "name": "variantId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the variant"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 493,
                  "name": "data",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Variant update data"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "any"
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
                    "target": 85,
                    "name": "VariantResponse",
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
          "id": 494,
          "name": "remove",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 495,
              "name": "remove",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Delete a variant for a collection and product (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to void"
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
              "parameters": [
                {
                  "id": 496,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 497,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 498,
                  "name": "variantId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the variant"
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
          "id": 499,
          "name": "getPublic",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 500,
              "name": "getPublic",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get a single variant by ID for a collection and product (public endpoint)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to a VariantResponse object"
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
              "parameters": [
                {
                  "id": 501,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 502,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 503,
                  "name": "variantId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the variant"
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
                    "target": 85,
                    "name": "VariantResponse",
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
          "id": 504,
          "name": "getSN",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 505,
              "name": "getSN",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Get serial numbers for a variant (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to serial number data"
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
              "parameters": [
                {
                  "id": 506,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 507,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 508,
                  "name": "variantId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the variant"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 509,
                  "name": "startIndex",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Starting index for pagination (default: 0)"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "number"
                  },
                  "defaultValue": "0"
                },
                {
                  "id": 510,
                  "name": "count",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Number of serial numbers to retrieve (default: 10)"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "number"
                  },
                  "defaultValue": "10"
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
          "id": 511,
          "name": "lookupSN",
          "variant": "declaration",
          "kind": 64,
          "flags": {},
          "signatures": [
            {
              "id": 512,
              "name": "lookupSN",
              "variant": "signature",
              "kind": 4096,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "Look up a serial number by code for a variant (admin only)."
                  }
                ],
                "blockTags": [
                  {
                    "tag": "@returns",
                    "content": [
                      {
                        "kind": "text",
                        "text": "Promise resolving to serial number lookup data"
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
              "parameters": [
                {
                  "id": 513,
                  "name": "collectionId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent collection"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 514,
                  "name": "productId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the parent product"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 515,
                  "name": "variantId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Identifier of the variant"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 516,
                  "name": "codeId",
                  "variant": "param",
                  "kind": 32768,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "The serial number code to look up"
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
            474,
            479,
            483,
            488,
            494,
            499,
            504,
            511
          ]
        }
      ]
    },
    {
      "id": 1,
      "name": "initializeApi",
      "variant": "declaration",
      "kind": 64,
      "flags": {},
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
                      "id": 5,
                      "name": "baseURL",
                      "variant": "declaration",
                      "kind": 1024,
                      "flags": {},
                      "type": {
                        "type": "intrinsic",
                        "name": "string"
                      }
                    },
                    {
                      "id": 6,
                      "name": "apiKey",
                      "variant": "declaration",
                      "kind": 1024,
                      "flags": {
                        "isOptional": true
                      },
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
                        5,
                        6,
                        7,
                        8
                      ]
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
    },
    {
      "id": 13,
      "name": "sendCustomProxyMessage",
      "variant": "declaration",
      "kind": 64,
      "flags": {},
      "signatures": [
        {
          "id": 14,
          "name": "sendCustomProxyMessage",
          "variant": "signature",
          "kind": 4096,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Sends a custom proxy message to the parent Smartlinks application when running in an iframe.\nThis function is used to communicate with the parent window when the SDK is embedded in an iframe\nand proxyMode is enabled. It sends a message to the parent and waits for a response."
              }
            ],
            "blockTags": [
              {
                "tag": "@returns",
                "content": [
                  {
                    "kind": "text",
                    "text": "The data from the proxy response"
                  }
                ]
              }
            ]
          },
          "typeParameter": [
            {
              "id": 15,
              "name": "T",
              "variant": "typeParam",
              "kind": 131072,
              "flags": {},
              "default": {
                "type": "intrinsic",
                "name": "any"
              }
            }
          ],
          "parameters": [
            {
              "id": 16,
              "name": "request",
              "variant": "param",
              "kind": 32768,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "The request type string to identify the message type"
                  }
                ]
              },
              "type": {
                "type": "intrinsic",
                "name": "string"
              }
            },
            {
              "id": 17,
              "name": "params",
              "variant": "param",
              "kind": 32768,
              "flags": {},
              "comment": {
                "summary": [
                  {
                    "kind": "text",
                    "text": "The parameters object containing data to send to the parent"
                  }
                ]
              },
              "type": {
                "type": "intrinsic",
                "name": "any"
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
                "target": 15,
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
    },
    {
      "id": 585,
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
          "id": 586,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 587,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 588,
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
            586,
            587,
            588
          ]
        }
      ]
    },
    {
      "id": 592,
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
          "id": 593,
          "name": "id",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 594,
          "name": "name",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 595,
          "name": "url",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
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
            593,
            594,
            595
          ]
        }
      ]
    },
    {
      "id": 68,
      "name": "AttestationResponse",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "children": [
        {
          "id": 69,
          "name": "id",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 70,
          "name": "createdAt",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 71,
          "name": "updatedAt",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 72,
          "name": "public",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
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
          "id": 73,
          "name": "private",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
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
          "id": 74,
          "name": "proof",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
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
            69,
            70,
            71,
            72,
            73,
            74
          ]
        }
      ]
    },
    {
      "id": 75,
      "name": "AttestationCreateRequest",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "children": [
        {
          "id": 76,
          "name": "public",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
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
          "id": 77,
          "name": "private",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
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
          "id": 78,
          "name": "proof",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
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
            76,
            77,
            78
          ]
        }
      ]
    },
    {
      "id": 79,
      "name": "AttestationUpdateRequest",
      "variant": "declaration",
      "kind": 256,
      "flags": {},
      "children": [
        {
          "id": 80,
          "name": "type",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
          },
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 81,
          "name": "data",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
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
        }
      ],
      "groups": [
        {
          "title": "Properties",
          "children": [
            80,
            81
          ]
        }
      ]
    },
    {
      "id": 82,
      "name": "BatchResponse",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Represents a Batch object."
          }
        ]
      },
      "type": {
        "type": "intrinsic",
        "name": "any"
      }
    },
    {
      "id": 83,
      "name": "BatchCreateRequest",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Request payload for creating a new batch."
          }
        ]
      },
      "type": {
        "type": "intrinsic",
        "name": "any"
      }
    },
    {
      "id": 84,
      "name": "BatchUpdateRequest",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Request payload for updating an existing batch."
          }
        ]
      },
      "type": {
        "type": "intrinsic",
        "name": "any"
      }
    },
    {
      "id": 517,
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
          "id": 518,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 519,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 520,
          "name": "description",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Description of collection"
              }
            ]
          },
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 521,
          "name": "headerImage",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
          },
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "URL to the collection's larger header/hero image"
              }
            ]
          },
          "type": {
            "type": "reflection",
            "declaration": {
              "id": 522,
              "name": "__type",
              "variant": "declaration",
              "kind": 65536,
              "flags": {},
              "children": [
                {
                  "id": 523,
                  "name": "url",
                  "variant": "declaration",
                  "kind": 1024,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "URL to the asset"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 524,
                  "name": "thumbnails",
                  "variant": "declaration",
                  "kind": 1024,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Thumbnail URLs in different sizes"
                      }
                    ]
                  },
                  "type": {
                    "type": "reflection",
                    "declaration": {
                      "id": 525,
                      "name": "__type",
                      "variant": "declaration",
                      "kind": 65536,
                      "flags": {},
                      "children": [
                        {
                          "id": 526,
                          "name": "x100",
                          "variant": "declaration",
                          "kind": 1024,
                          "flags": {},
                          "type": {
                            "type": "intrinsic",
                            "name": "string"
                          }
                        },
                        {
                          "id": 527,
                          "name": "x200",
                          "variant": "declaration",
                          "kind": 1024,
                          "flags": {},
                          "type": {
                            "type": "intrinsic",
                            "name": "string"
                          }
                        },
                        {
                          "id": 528,
                          "name": "x512",
                          "variant": "declaration",
                          "kind": 1024,
                          "flags": {},
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
                            526,
                            527,
                            528
                          ]
                        }
                      ]
                    }
                  }
                }
              ],
              "groups": [
                {
                  "title": "Properties",
                  "children": [
                    523,
                    524
                  ]
                }
              ]
            }
          }
        },
        {
          "id": 529,
          "name": "logoImage",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
          },
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "URL to the collection's logo image"
              }
            ]
          },
          "type": {
            "type": "reflection",
            "declaration": {
              "id": 530,
              "name": "__type",
              "variant": "declaration",
              "kind": 65536,
              "flags": {},
              "children": [
                {
                  "id": 531,
                  "name": "url",
                  "variant": "declaration",
                  "kind": 1024,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "URL to the asset"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 532,
                  "name": "thumbnails",
                  "variant": "declaration",
                  "kind": 1024,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Thumbnail URLs in different sizes"
                      }
                    ]
                  },
                  "type": {
                    "type": "reflection",
                    "declaration": {
                      "id": 533,
                      "name": "__type",
                      "variant": "declaration",
                      "kind": 65536,
                      "flags": {},
                      "children": [
                        {
                          "id": 534,
                          "name": "x100",
                          "variant": "declaration",
                          "kind": 1024,
                          "flags": {},
                          "type": {
                            "type": "intrinsic",
                            "name": "string"
                          }
                        },
                        {
                          "id": 535,
                          "name": "x200",
                          "variant": "declaration",
                          "kind": 1024,
                          "flags": {},
                          "type": {
                            "type": "intrinsic",
                            "name": "string"
                          }
                        },
                        {
                          "id": 536,
                          "name": "x512",
                          "variant": "declaration",
                          "kind": 1024,
                          "flags": {},
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
                            534,
                            535,
                            536
                          ]
                        }
                      ]
                    }
                  }
                }
              ],
              "groups": [
                {
                  "title": "Properties",
                  "children": [
                    531,
                    532
                  ]
                }
              ]
            }
          }
        },
        {
          "id": 537,
          "name": "loaderImage",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
          },
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Collection's loader image"
              }
            ]
          },
          "type": {
            "type": "reflection",
            "declaration": {
              "id": 538,
              "name": "__type",
              "variant": "declaration",
              "kind": 65536,
              "flags": {},
              "children": [
                {
                  "id": 539,
                  "name": "overwriteName",
                  "variant": "declaration",
                  "kind": 1024,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Override name for the file"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 540,
                  "name": "name",
                  "variant": "declaration",
                  "kind": 1024,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Name of the asset"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 541,
                  "name": "type",
                  "variant": "declaration",
                  "kind": 1024,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "File type/extension"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 542,
                  "name": "url",
                  "variant": "declaration",
                  "kind": 1024,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "URL to the asset"
                      }
                    ]
                  },
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
                    539,
                    540,
                    541,
                    542
                  ]
                }
              ]
            }
          }
        },
        {
          "id": 543,
          "name": "languages",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
          },
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Array of supported languages"
              }
            ]
          },
          "type": {
            "type": "array",
            "elementType": {
              "type": "reflection",
              "declaration": {
                "id": 544,
                "name": "__type",
                "variant": "declaration",
                "kind": 65536,
                "flags": {},
                "children": [
                  {
                    "id": 545,
                    "name": "code",
                    "variant": "declaration",
                    "kind": 1024,
                    "flags": {},
                    "comment": {
                      "summary": [
                        {
                          "kind": "text",
                          "text": "Language code (e.g., \"fr\", \"it\", \"es\")"
                        }
                      ]
                    },
                    "type": {
                      "type": "intrinsic",
                      "name": "string"
                    }
                  },
                  {
                    "id": 546,
                    "name": "lang",
                    "variant": "declaration",
                    "kind": 1024,
                    "flags": {},
                    "comment": {
                      "summary": [
                        {
                          "kind": "text",
                          "text": "Human-readable language name (e.g., \"French\", \"Italian\")"
                        }
                      ]
                    },
                    "type": {
                      "type": "intrinsic",
                      "name": "string"
                    }
                  },
                  {
                    "id": 547,
                    "name": "supported",
                    "variant": "declaration",
                    "kind": 1024,
                    "flags": {},
                    "comment": {
                      "summary": [
                        {
                          "kind": "text",
                          "text": "Whether this language is supported"
                        }
                      ]
                    },
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
                      545,
                      546,
                      547
                    ]
                  }
                ]
              }
            }
          }
        },
        {
          "id": 548,
          "name": "roles",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "User roles mapping with user IDs as keys and role names as values"
              }
            ]
          },
          "type": {
            "type": "reflection",
            "declaration": {
              "id": 549,
              "name": "__type",
              "variant": "declaration",
              "kind": 65536,
              "flags": {},
              "indexSignature": {
                "id": 550,
                "name": "__index",
                "variant": "signature",
                "kind": 8192,
                "flags": {},
                "parameters": [
                  {
                    "id": 551,
                    "name": "userId",
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
                  "type": "intrinsic",
                  "name": "string"
                }
              }
            }
          }
        },
        {
          "id": 552,
          "name": "groupTags",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
          },
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Array of group tag names"
              }
            ]
          },
          "type": {
            "type": "array",
            "elementType": {
              "type": "intrinsic",
              "name": "string"
            }
          }
        },
        {
          "id": 553,
          "name": "redirectUrl",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
          },
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Whether the collection has a custom domain"
              }
            ]
          },
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 554,
          "name": "shortId",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "The shortId of this collection"
              }
            ]
          },
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 555,
          "name": "dark",
          "variant": "declaration",
          "kind": 1024,
          "flags": {
            "isOptional": true
          },
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "if dark mode is enabled for this collection"
              }
            ]
          },
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
            518,
            519,
            520,
            521,
            529,
            537,
            543,
            548,
            552,
            553,
            554,
            555
          ]
        }
      ]
    },
    {
      "id": 589,
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
          "id": 590,
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
          "type": {
            "type": "intrinsic",
            "name": "number"
          }
        },
        {
          "id": 591,
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
            590,
            591
          ]
        }
      ]
    },
    {
      "id": 556,
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
          "id": 557,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 558,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 559,
          "name": "collectionId",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Unique identifier for the product's collection"
              }
            ]
          },
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 560,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 561,
          "name": "heroImage",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Hero image asset object"
              }
            ]
          },
          "type": {
            "type": "reflection",
            "declaration": {
              "id": 562,
              "name": "__type",
              "variant": "declaration",
              "kind": 65536,
              "flags": {},
              "children": [
                {
                  "id": 563,
                  "name": "url",
                  "variant": "declaration",
                  "kind": 1024,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "URL to the asset"
                      }
                    ]
                  },
                  "type": {
                    "type": "intrinsic",
                    "name": "string"
                  }
                },
                {
                  "id": 564,
                  "name": "thumbnails",
                  "variant": "declaration",
                  "kind": 1024,
                  "flags": {},
                  "comment": {
                    "summary": [
                      {
                        "kind": "text",
                        "text": "Thumbnail URLs in different sizes"
                      }
                    ]
                  },
                  "type": {
                    "type": "reflection",
                    "declaration": {
                      "id": 565,
                      "name": "__type",
                      "variant": "declaration",
                      "kind": 65536,
                      "flags": {},
                      "children": [
                        {
                          "id": 566,
                          "name": "x100",
                          "variant": "declaration",
                          "kind": 1024,
                          "flags": {},
                          "type": {
                            "type": "intrinsic",
                            "name": "string"
                          }
                        },
                        {
                          "id": 567,
                          "name": "x200",
                          "variant": "declaration",
                          "kind": 1024,
                          "flags": {},
                          "type": {
                            "type": "intrinsic",
                            "name": "string"
                          }
                        },
                        {
                          "id": 568,
                          "name": "x512",
                          "variant": "declaration",
                          "kind": 1024,
                          "flags": {},
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
                            566,
                            567,
                            568
                          ]
                        }
                      ]
                    }
                  }
                }
              ],
              "groups": [
                {
                  "title": "Properties",
                  "children": [
                    563,
                    564
                  ]
                }
              ]
            }
          }
        },
        {
          "id": 569,
          "name": "groupTags",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Flexible map of tags with true/false values"
              }
            ]
          },
          "type": {
            "type": "reflection",
            "declaration": {
              "id": 570,
              "name": "__type",
              "variant": "declaration",
              "kind": 65536,
              "flags": {},
              "indexSignature": {
                "id": 571,
                "name": "__index",
                "variant": "signature",
                "kind": 8192,
                "flags": {},
                "parameters": [
                  {
                    "id": 572,
                    "name": "tagName",
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
                  "type": "intrinsic",
                  "name": "boolean"
                }
              }
            }
          }
        },
        {
          "id": 573,
          "name": "data",
          "variant": "declaration",
          "kind": 1024,
          "flags": {},
          "comment": {
            "summary": [
              {
                "kind": "text",
                "text": "Flexible key/value data map"
              }
            ]
          },
          "type": {
            "type": "reflection",
            "declaration": {
              "id": 574,
              "name": "__type",
              "variant": "declaration",
              "kind": 65536,
              "flags": {},
              "indexSignature": {
                "id": 575,
                "name": "__index",
                "variant": "signature",
                "kind": 8192,
                "flags": {},
                "parameters": [
                  {
                    "id": 576,
                    "name": "key",
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
                  "type": "intrinsic",
                  "name": "any"
                }
              }
            }
          }
        }
      ],
      "groups": [
        {
          "title": "Properties",
          "children": [
            557,
            558,
            559,
            560,
            561,
            569,
            573
          ]
        }
      ]
    },
    {
      "id": 577,
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
          "id": 578,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 579,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 580,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 581,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 582,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 583,
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
          "type": {
            "type": "intrinsic",
            "name": "string"
          }
        },
        {
          "id": 584,
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
            578,
            579,
            580,
            581,
            582,
            583,
            584
          ]
        }
      ]
    },
    {
      "id": 85,
      "name": "VariantResponse",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Represents a Variant object."
          }
        ]
      },
      "type": {
        "type": "intrinsic",
        "name": "any"
      }
    },
    {
      "id": 86,
      "name": "VariantCreateRequest",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Request payload for creating a new variant."
          }
        ]
      },
      "type": {
        "type": "intrinsic",
        "name": "any"
      }
    },
    {
      "id": 87,
      "name": "VariantUpdateRequest",
      "variant": "declaration",
      "kind": 2097152,
      "flags": {},
      "comment": {
        "summary": [
          {
            "kind": "text",
            "text": "Request payload for updating an existing variant."
          }
        ]
      },
      "type": {
        "type": "intrinsic",
        "name": "any"
      }
    }
  ],
  "groups": [
    {
      "title": "Namespaces",
      "children": [
        206,
        228,
        247,
        287,
        318,
        429,
        361,
        101,
        408,
        338,
        133,
        167,
        473
      ]
    },
    {
      "title": "Interfaces",
      "children": [
        585,
        592,
        68,
        75,
        79,
        517,
        589,
        556,
        577
      ]
    },
    {
      "title": "Type Aliases",
      "children": [
        88,
        18,
        25,
        32,
        82,
        83,
        84,
        85,
        86,
        87
      ]
    },
    {
      "title": "Functions",
      "children": [
        1,
        9,
        13
      ]
    }
  ],
  "packageName": "@proveanything/smartlinks",
  "readme": [
    {
      "kind": "text",
      "text": "# @proveanything/smartlinks\n\nThis README is auto-generated from the TypeScript API documentation.\n\n## API Reference\n\n"
    },
    {
      "kind": "code",
      "text": "```json\n{\n  \"id\": 0,\n  \"name\": \"@proveanything/smartlinks\",\n  \"variant\": \"project\",\n  \"kind\": 1,\n  \"flags\": {},\n  \"children\": [\n    {\n      \"id\": 90,\n      \"name\": \"AppConfigOptions\",\n      \"variant\": \"declaration\",\n      \"kind\": 2097152,\n      \"flags\": {},\n      \"type\": {\n        \"type\": \"reflection\",\n        \"declaration\": {\n          \"id\": 91,\n          \"name\": \"__type\",\n          \"variant\": \"declaration\",\n          \"kind\": 65536,\n          \"flags\": {},\n          \"children\": [\n            {\n              \"id\": 92,\n              \"name\": \"appId\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 93,\n              \"name\": \"collectionId\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 94,\n              \"name\": \"productId\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 95,\n              \"name\": \"variantId\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 96,\n              \"name\": \"batchId\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 97,\n              \"name\": \"itemId\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 98,\n              \"name\": \"user\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"boolean\"\n              }\n            },\n            {\n              \"id\": 99,\n              \"name\": \"userData\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"boolean\"\n              }\n            },\n            {\n              \"id\": 100,\n              \"name\": \"admin\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"boolean\"\n              }\n            },\n            {\n              \"id\": 101,\n              \"name\": \"config\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            },\n            {\n              \"id\": 102,\n              \"name\": \"data\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            }\n          ],\n          \"groups\": [\n            {\n              \"title\": \"Properties\",\n              \"children\": [\n                92,\n                93,\n                94,\n                95,\n                96,\n                97,\n                98,\n                99,\n                100,\n                101,\n                102\n              ]\n            }\n          ]\n        }\n      }\n    },\n    {\n      \"id\": 177,\n      \"name\": \"appConfiguration\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 178,\n          \"name\": \"getConfig\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 179,\n              \"name\": \"getConfig\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 180,\n                  \"name\": \"opts\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"reference\",\n                    \"target\": 90,\n                    \"name\": \"AppConfigOptions\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 181,\n          \"name\": \"setConfig\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 182,\n              \"name\": \"setConfig\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 183,\n                  \"name\": \"opts\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"reference\",\n                    \"target\": 90,\n                    \"name\": \"AppConfigOptions\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 184,\n          \"name\": \"deleteConfig\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 185,\n              \"name\": \"deleteConfig\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 186,\n                  \"name\": \"opts\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"reference\",\n                    \"target\": 90,\n                    \"name\": \"AppConfigOptions\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"void\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 187,\n          \"name\": \"getData\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 188,\n              \"name\": \"getData\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 189,\n                  \"name\": \"opts\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"reference\",\n                    \"target\": 90,\n                    \"name\": \"AppConfigOptions\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"any\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 190,\n          \"name\": \"getDataItem\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 191,\n              \"name\": \"getDataItem\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 192,\n                  \"name\": \"opts\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"reference\",\n                    \"target\": 90,\n                    \"name\": \"AppConfigOptions\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 193,\n          \"name\": \"setDataItem\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 194,\n              \"name\": \"setDataItem\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 195,\n                  \"name\": \"opts\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"reference\",\n                    \"target\": 90,\n                    \"name\": \"AppConfigOptions\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 196,\n          \"name\": \"deleteDataItem\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 197,\n              \"name\": \"deleteDataItem\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 198,\n                  \"name\": \"opts\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"reference\",\n                    \"target\": 90,\n                    \"name\": \"AppConfigOptions\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"void\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            178,\n            181,\n            184,\n            187,\n            190,\n            193,\n            196\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 199,\n      \"name\": \"appRecord\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 200,\n          \"name\": \"get\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 201,\n              \"name\": \"get\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 202,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 203,\n                  \"name\": \"appId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 204,\n          \"name\": \"create\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 205,\n              \"name\": \"create\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 206,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 207,\n                  \"name\": \"appId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 208,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 209,\n          \"name\": \"update\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 210,\n              \"name\": \"update\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 211,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 212,\n                  \"name\": \"appId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 213,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 214,\n          \"name\": \"remove\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 215,\n              \"name\": \"remove\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 216,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 217,\n                  \"name\": \"appId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"void\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            200,\n            204,\n            209,\n            214\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 218,\n      \"name\": \"asset\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 219,\n          \"name\": \"getForCollection\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 220,\n              \"name\": \"getForCollection\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 221,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 222,\n                  \"name\": \"assetId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 555,\n                    \"name\": \"AssetResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 223,\n          \"name\": \"listForCollection\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 224,\n              \"name\": \"listForCollection\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 225,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"reference\",\n                      \"target\": 555,\n                      \"name\": \"AssetResponse\",\n                      \"package\": \"@proveanything/smartlinks\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 226,\n          \"name\": \"getForProduct\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 227,\n              \"name\": \"getForProduct\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 228,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 229,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 230,\n                  \"name\": \"assetId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 555,\n                    \"name\": \"AssetResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 231,\n          \"name\": \"listForProduct\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 232,\n              \"name\": \"listForProduct\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 233,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 234,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"reference\",\n                      \"target\": 555,\n                      \"name\": \"AssetResponse\",\n                      \"package\": \"@proveanything/smartlinks\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 235,\n          \"name\": \"getForProof\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 236,\n              \"name\": \"getForProof\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 237,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 238,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 239,\n                  \"name\": \"proofId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 240,\n                  \"name\": \"assetId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 555,\n                    \"name\": \"AssetResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 241,\n          \"name\": \"listForProof\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 242,\n              \"name\": \"listForProof\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"parameters\": [\n                {\n                  \"id\": 243,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 244,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 245,\n                  \"name\": \"proofId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 246,\n                  \"name\": \"appId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {\n                    \"isOptional\": true\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"reference\",\n                      \"target\": 555,\n                      \"name\": \"AssetResponse\",\n                      \"package\": \"@proveanything/smartlinks\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 247,\n          \"name\": \"uploadAsset\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 248,\n              \"name\": \"uploadAsset\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Uploads an asset file to a proof, with optional extraData as JSON.\\r\\nSupports progress reporting via onProgress callback (browser only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to an AssetResponse object\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 249,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"The collection ID\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 250,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"The product ID\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 251,\n                  \"name\": \"proofId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"The proof ID\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 252,\n                  \"name\": \"file\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"The file to upload\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"reference\",\n                    \"target\": {\n                      \"sourceFileName\": \"node_modules/typescript/lib/lib.dom.d.ts\",\n                      \"qualifiedName\": \"File\"\n                    },\n                    \"name\": \"File\",\n                    \"package\": \"typescript\"\n                  }\n                },\n                {\n                  \"id\": 253,\n                  \"name\": \"extraData\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {\n                    \"isOptional\": true\n                  },\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Arbitrary extra data to include (will be stringified as JSON)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"reference\",\n                    \"target\": {\n                      \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                      \"qualifiedName\": \"Record\"\n                    },\n                    \"typeArguments\": [\n                      {\n                        \"type\": \"intrinsic\",\n                        \"name\": \"string\"\n                      },\n                      {\n                        \"type\": \"intrinsic\",\n                        \"name\": \"any\"\n                      }\n                    ],\n                    \"name\": \"Record\",\n                    \"package\": \"typescript\"\n                  }\n                },\n                {\n                  \"id\": 254,\n                  \"name\": \"onProgress\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {\n                    \"isOptional\": true\n                  },\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Optional callback for upload progress (0-100)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"reflection\",\n                    \"declaration\": {\n                      \"id\": 255,\n                      \"name\": \"__type\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 65536,\n                      \"flags\": {},\n                      \"signatures\": [\n                        {\n                          \"id\": 256,\n                          \"name\": \"__type\",\n                          \"variant\": \"signature\",\n                          \"kind\": 4096,\n                          \"flags\": {},\n                          \"parameters\": [\n                            {\n                              \"id\": 257,\n                              \"name\": \"percent\",\n                              \"variant\": \"param\",\n                              \"kind\": 32768,\n                              \"flags\": {},\n                              \"type\": {\n                                \"type\": \"intrinsic\",\n                                \"name\": \"number\"\n                              }\n                            }\n                          ],\n                          \"type\": {\n                            \"type\": \"intrinsic\",\n                            \"name\": \"void\"\n                          }\n                        }\n                      ]\n                    }\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 555,\n                    \"name\": \"AssetResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            219,\n            223,\n            226,\n            231,\n            235,\n            241,\n            247\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 258,\n      \"name\": \"attestation\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 259,\n          \"name\": \"list\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 260,\n              \"name\": \"list\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"List all attestations for a proof.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 261,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 262,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 263,\n                  \"name\": \"proofId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"reference\",\n                      \"target\": 70,\n                      \"name\": \"AttestationResponse\",\n                      \"package\": \"@proveanything/smartlinks\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 264,\n          \"name\": \"get\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 265,\n              \"name\": \"get\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get a single attestation by ID.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 266,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 267,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 268,\n                  \"name\": \"proofId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 269,\n                  \"name\": \"attestationId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 70,\n                    \"name\": \"AttestationResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 270,\n          \"name\": \"create\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 271,\n              \"name\": \"create\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Create a new attestation for a proof.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 272,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 273,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 274,\n                  \"name\": \"proofId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 275,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"reference\",\n                    \"target\": 77,\n                    \"name\": \"AttestationCreateRequest\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 70,\n                    \"name\": \"AttestationResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 276,\n          \"name\": \"update\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 277,\n              \"name\": \"update\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Update an attestation.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 278,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 279,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 280,\n                  \"name\": \"proofId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 281,\n                  \"name\": \"attestationId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 282,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"reference\",\n                    \"target\": 81,\n                    \"name\": \"AttestationUpdateRequest\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 70,\n                    \"name\": \"AttestationResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 283,\n          \"name\": \"remove\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 284,\n              \"name\": \"remove\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Delete an attestation.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 285,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 286,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 287,\n                  \"name\": \"proofId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 288,\n                  \"name\": \"attestationId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"void\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            259,\n            264,\n            270,\n            276,\n            283\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 18,\n      \"name\": \"LoginResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 2097152,\n      \"flags\": {},\n      \"type\": {\n        \"type\": \"reflection\",\n        \"declaration\": {\n          \"id\": 19,\n          \"name\": \"__type\",\n          \"variant\": \"declaration\",\n          \"kind\": 65536,\n          \"flags\": {},\n          \"children\": [\n            {\n              \"id\": 20,\n              \"name\": \"id\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 21,\n              \"name\": \"name\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 22,\n              \"name\": \"email\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 23,\n              \"name\": \"bearerToken\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 24,\n              \"name\": \"account\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Record\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  },\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Record\",\n                \"package\": \"typescript\"\n              }\n            }\n          ],\n          \"groups\": [\n            {\n              \"title\": \"Properties\",\n              \"children\": [\n                20,\n                21,\n                22,\n                23,\n                24\n              ]\n            }\n          ]\n        }\n      }\n    },\n    {\n      \"id\": 25,\n      \"name\": \"VerifyTokenResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 2097152,\n      \"flags\": {},\n      \"type\": {\n        \"type\": \"reflection\",\n        \"declaration\": {\n          \"id\": 26,\n          \"name\": \"__type\",\n          \"variant\": \"declaration\",\n          \"kind\": 65536,\n          \"flags\": {},\n          \"children\": [\n            {\n              \"id\": 27,\n              \"name\": \"valid\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"boolean\"\n              }\n            },\n            {\n              \"id\": 28,\n              \"name\": \"id\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 29,\n              \"name\": \"name\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 30,\n              \"name\": \"email\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 31,\n              \"name\": \"account\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {\n                \"isOptional\": true\n              },\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Record\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  },\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Record\",\n                \"package\": \"typescript\"\n              }\n            }\n          ],\n          \"groups\": [\n            {\n              \"title\": \"Properties\",\n              \"children\": [\n                27,\n                28,\n                29,\n                30,\n                31\n              ]\n            }\n          ]\n        }\n      }\n    },\n    {\n      \"id\": 32,\n      \"name\": \"AccountInfoResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 2097152,\n      \"flags\": {},\n      \"type\": {\n        \"type\": \"reflection\",\n        \"declaration\": {\n          \"id\": 33,\n          \"name\": \"__type\",\n          \"variant\": \"declaration\",\n          \"kind\": 65536,\n          \"flags\": {},\n          \"children\": [\n            {\n              \"id\": 34,\n              \"name\": \"jwtToken\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 35,\n              \"name\": \"jwtExpiry\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"number\"\n              }\n            },\n            {\n              \"id\": 36,\n              \"name\": \"accessType\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 37,\n              \"name\": \"analyticsCode\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 38,\n              \"name\": \"analyticsId\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 39,\n              \"name\": \"auth_time\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"number\"\n              }\n            },\n            {\n              \"id\": 40,\n              \"name\": \"baseCollectionId\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 41,\n              \"name\": \"clientType\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 42,\n              \"name\": \"email\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 43,\n              \"name\": \"email_verified\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"boolean\"\n              }\n            },\n            {\n              \"id\": 44,\n              \"name\": \"features\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"reflection\",\n                \"declaration\": {\n                  \"id\": 45,\n                  \"name\": \"__type\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 65536,\n                  \"flags\": {},\n                  \"children\": [\n                    {\n                      \"id\": 46,\n                      \"name\": \"actionLogger\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 1024,\n                      \"flags\": {},\n                      \"type\": {\n                        \"type\": \"intrinsic\",\n                        \"name\": \"boolean\"\n                      }\n                    },\n                    {\n                      \"id\": 47,\n                      \"name\": \"adminCollections\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 1024,\n                      \"flags\": {},\n                      \"type\": {\n                        \"type\": \"intrinsic\",\n                        \"name\": \"boolean\"\n                      }\n                    },\n                    {\n                      \"id\": 48,\n                      \"name\": \"adminApps\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 1024,\n                      \"flags\": {},\n                      \"type\": {\n                        \"type\": \"intrinsic\",\n                        \"name\": \"boolean\"\n                      }\n                    },\n                    {\n                      \"id\": 49,\n                      \"name\": \"apiKeys\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 1024,\n                      \"flags\": {},\n                      \"type\": {\n                        \"type\": \"intrinsic\",\n                        \"name\": \"boolean\"\n                      }\n                    },\n                    {\n                      \"id\": 50,\n                      \"name\": \"adminUsers\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 1024,\n                      \"flags\": {},\n                      \"type\": {\n                        \"type\": \"intrinsic\",\n                        \"name\": \"boolean\"\n                      }\n                    }\n                  ],\n                  \"groups\": [\n                    {\n                      \"title\": \"Properties\",\n                      \"children\": [\n                        46,\n                        47,\n                        48,\n                        49,\n                        50\n                      ]\n                    }\n                  ],\n                  \"indexSignature\": {\n                    \"id\": 51,\n                    \"name\": \"__index\",\n                    \"variant\": \"signature\",\n                    \"kind\": 8192,\n                    \"flags\": {},\n                    \"parameters\": [\n                      {\n                        \"id\": 52,\n                        \"name\": \"key\",\n                        \"variant\": \"param\",\n                        \"kind\": 32768,\n                        \"flags\": {},\n                        \"type\": {\n                          \"type\": \"intrinsic\",\n                          \"name\": \"string\"\n                        }\n                      }\n                    ],\n                    \"type\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"boolean\"\n                    }\n                  }\n                }\n              }\n            },\n            {\n              \"id\": 53,\n              \"name\": \"iat\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"number\"\n              }\n            },\n            {\n              \"id\": 54,\n              \"name\": \"id\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 55,\n              \"name\": \"iss\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 56,\n              \"name\": \"location\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"union\",\n                \"types\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  },\n                  {\n                    \"type\": \"literal\",\n                    \"value\": null\n                  }\n                ]\n              }\n            },\n            {\n              \"id\": 57,\n              \"name\": \"name\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 58,\n              \"name\": \"picture\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 59,\n              \"name\": \"sites\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"reflection\",\n                \"declaration\": {\n                  \"id\": 60,\n                  \"name\": \"__type\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 65536,\n                  \"flags\": {},\n                  \"indexSignature\": {\n                    \"id\": 61,\n                    \"name\": \"__index\",\n                    \"variant\": \"signature\",\n                    \"kind\": 8192,\n                    \"flags\": {},\n                    \"parameters\": [\n                      {\n                        \"id\": 62,\n                        \"name\": \"siteName\",\n                        \"variant\": \"param\",\n                        \"kind\": 32768,\n                        \"flags\": {},\n                        \"type\": {\n                          \"type\": \"intrinsic\",\n                          \"name\": \"string\"\n                        }\n                      }\n                    ],\n                    \"type\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"boolean\"\n                    }\n                  }\n                }\n              }\n            },\n            {\n              \"id\": 63,\n              \"name\": \"sub\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 64,\n              \"name\": \"uid\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 65,\n              \"name\": \"user_id\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 66,\n              \"name\": \"whitelabel\",\n              \"variant\": \"declaration\",\n              \"kind\": 1024,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"reflection\",\n                \"declaration\": {\n                  \"id\": 67,\n                  \"name\": \"__type\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 65536,\n                  \"flags\": {},\n                  \"indexSignature\": {\n                    \"id\": 68,\n                    \"name\": \"__index\",\n                    \"variant\": \"signature\",\n                    \"kind\": 8192,\n                    \"flags\": {},\n                    \"parameters\": [\n                      {\n                        \"id\": 69,\n                        \"name\": \"key\",\n                        \"variant\": \"param\",\n                        \"kind\": 32768,\n                        \"flags\": {},\n                        \"type\": {\n                          \"type\": \"intrinsic\",\n                          \"name\": \"string\"\n                        }\n                      }\n                    ],\n                    \"type\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"any\"\n                    }\n                  }\n                }\n              }\n            }\n          ],\n          \"groups\": [\n            {\n              \"title\": \"Properties\",\n              \"children\": [\n                34,\n                35,\n                36,\n                37,\n                38,\n                39,\n                40,\n                41,\n                42,\n                43,\n                44,\n                53,\n                54,\n                55,\n                56,\n                57,\n                58,\n                59,\n                63,\n                64,\n                65,\n                66\n              ]\n            }\n          ]\n        }\n      }\n    },\n    {\n      \"id\": 289,\n      \"name\": \"auth\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 290,\n          \"name\": \"login\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 291,\n              \"name\": \"login\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Login with email and password.\\r\\nSets the bearerToken for subsequent API calls.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 292,\n                  \"name\": \"email\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 293,\n                  \"name\": \"password\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 18,\n                    \"name\": \"LoginResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 294,\n          \"name\": \"logout\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 295,\n              \"name\": \"logout\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Logout (clears bearerToken for future API calls).\"\n                  }\n                ]\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"void\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 296,\n          \"name\": \"verifyToken\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 297,\n              \"name\": \"verifyToken\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Verifies the current bearerToken (or a provided token).\\r\\nReturns user/account info if valid.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 298,\n                  \"name\": \"token\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {\n                    \"isOptional\": true\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 25,\n                    \"name\": \"VerifyTokenResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 299,\n          \"name\": \"getAccount\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 300,\n              \"name\": \"getAccount\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Gets current account information for the logged in user.\\r\\nReturns user, owner, account, and location objects.\"\n                  }\n                ]\n              },\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 32,\n                    \"name\": \"AccountInfoResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            290,\n            294,\n            296,\n            299\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 392,\n      \"name\": \"batch\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 393,\n          \"name\": \"get\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 394,\n              \"name\": \"get\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get a single batch by ID for a collection and product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a BatchResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 395,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 396,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 397,\n                  \"name\": \"batchId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the batch\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 84,\n                    \"name\": \"BatchResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 398,\n          \"name\": \"list\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 399,\n              \"name\": \"list\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"List all batches for a collection and product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to an array of BatchResponse objects\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 400,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 401,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"reference\",\n                      \"target\": 84,\n                      \"name\": \"BatchResponse\",\n                      \"package\": \"@proveanything/smartlinks\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 402,\n          \"name\": \"create\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 403,\n              \"name\": \"create\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Create a new batch for a collection and product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a BatchResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 404,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 405,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 406,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Batch creation data\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 84,\n                    \"name\": \"BatchResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 407,\n          \"name\": \"update\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 408,\n              \"name\": \"update\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Update a batch for a collection and product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a BatchResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 409,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 410,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 411,\n                  \"name\": \"batchId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the batch\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 412,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Batch update data\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 84,\n                    \"name\": \"BatchResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 413,\n          \"name\": \"remove\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 414,\n              \"name\": \"remove\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Delete a batch for a collection and product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to void\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 415,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 416,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 417,\n                  \"name\": \"batchId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the batch\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"void\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 418,\n          \"name\": \"getPublic\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 419,\n              \"name\": \"getPublic\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get a single batch by ID for a collection and product (public endpoint).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a BatchResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 420,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 421,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 422,\n                  \"name\": \"batchId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the batch\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 84,\n                    \"name\": \"BatchResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 423,\n          \"name\": \"getSN\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 424,\n              \"name\": \"getSN\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get serial numbers for a batch (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to serial number data\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 425,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 426,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 427,\n                  \"name\": \"batchId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the batch\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 428,\n                  \"name\": \"startIndex\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Starting index for pagination (default: 0)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"number\"\n                  },\n                  \"defaultValue\": \"0\"\n                },\n                {\n                  \"id\": 429,\n                  \"name\": \"count\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Number of serial numbers to retrieve (default: 10)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"number\"\n                  },\n                  \"defaultValue\": \"10\"\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 430,\n          \"name\": \"lookupSN\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 431,\n              \"name\": \"lookupSN\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Look up a serial number by code for a batch (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to serial number lookup data\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 432,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 433,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 434,\n                  \"name\": \"batchId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the batch\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 435,\n                  \"name\": \"codeId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"The serial number code to look up\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            393,\n            398,\n            402,\n            407,\n            413,\n            418,\n            423,\n            430\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 324,\n      \"name\": \"claimSet\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 325,\n          \"name\": \"getAllForCollection\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 326,\n              \"name\": \"getAllForCollection\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get all claim sets for a collection.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to an array of claim sets\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 327,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"any\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 328,\n          \"name\": \"getForCollection\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 329,\n              \"name\": \"getForCollection\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get a specific claim set for a collection.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a claim set object\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 330,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 331,\n                  \"name\": \"claimSetId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The claim set identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 332,\n          \"name\": \"getAllTags\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 333,\n              \"name\": \"getAllTags\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get all tags for a claim set.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to an array of tags\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 334,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 335,\n                  \"name\": \"claimSetId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The claim set identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"any\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 336,\n          \"name\": \"getReport\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 337,\n              \"name\": \"getReport\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get a report for a claim set.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a report object\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 338,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 339,\n                  \"name\": \"claimSetId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The claim set identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 340,\n          \"name\": \"getAssignedTags\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 341,\n              \"name\": \"getAssignedTags\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get assigned tags for a claim set.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to assigned tags\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 342,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 343,\n                  \"name\": \"claimSetId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The claim set identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 344,\n          \"name\": \"getTagSummary\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 345,\n              \"name\": \"getTagSummary\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get tag summary for a collection.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to tag summary\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 346,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 347,\n          \"name\": \"tagQuery\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 348,\n              \"name\": \"tagQuery\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Perform a tag query for a collection.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to query results\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 349,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 350,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The query data\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 351,\n          \"name\": \"createForCollection\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 352,\n              \"name\": \"createForCollection\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Create a new claim set for a collection.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to the created claim set\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 353,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 354,\n                  \"name\": \"params\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The claim set creation parameters\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 355,\n          \"name\": \"updateForCollection\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 356,\n              \"name\": \"updateForCollection\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Update a claim set for a collection.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to the updated claim set\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 357,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 358,\n                  \"name\": \"params\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The claim set update parameters (must include id)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 359,\n          \"name\": \"makeClaim\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 360,\n              \"name\": \"makeClaim\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Make a claim for a claim set.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to the claim result\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 361,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 362,\n                  \"name\": \"params\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The claim parameters (must include id)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 363,\n          \"name\": \"assignClaims\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 364,\n              \"name\": \"assignClaims\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Assign claims to a claim set.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 365,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 366,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The claims data to assign\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 367,\n          \"name\": \"updateClaimData\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 368,\n              \"name\": \"updateClaimData\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Update claim data for a collection.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 369,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 370,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The claim data to update\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            325,\n            328,\n            332,\n            336,\n            340,\n            344,\n            347,\n            351,\n            355,\n            359,\n            363,\n            367\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 103,\n      \"name\": \"collection\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 104,\n          \"name\": \"get\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 105,\n              \"name\": \"get\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Retrieves a single Collection by its ID.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a CollectionResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 106,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 107,\n                  \"name\": \"admin\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {\n                    \"isOptional\": true\n                  },\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– If true, fetches from the admin endpoint\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"boolean\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 480,\n                    \"name\": \"CollectionResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 108,\n          \"name\": \"list\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 109,\n              \"name\": \"list\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Retrieves all Collections.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to an array of CollectionResponse objects\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 110,\n                  \"name\": \"admin\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {\n                    \"isOptional\": true\n                  },\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– If true, fetches from the admin endpoint\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"boolean\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"reference\",\n                      \"target\": 480,\n                      \"name\": \"CollectionResponse\",\n                      \"package\": \"@proveanything/smartlinks\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 111,\n          \"name\": \"create\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 112,\n              \"name\": \"create\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Create a new collection (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a CollectionResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 113,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Collection creation data\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 480,\n                    \"name\": \"CollectionResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 114,\n          \"name\": \"update\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 115,\n              \"name\": \"update\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Update a collection (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a CollectionResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 116,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 117,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Collection update data\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 480,\n                    \"name\": \"CollectionResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 118,\n          \"name\": \"remove\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 119,\n              \"name\": \"remove\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Delete a collection (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to void\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 120,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"void\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 121,\n          \"name\": \"getSN\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 122,\n              \"name\": \"getSN\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get serial numbers for a collection (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to serial number data\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 123,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 124,\n                  \"name\": \"startIndex\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Starting index for pagination (default: 0)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"number\"\n                  },\n                  \"defaultValue\": \"0\"\n                },\n                {\n                  \"id\": 125,\n                  \"name\": \"count\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Number of serial numbers to retrieve (default: 10)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"number\"\n                  },\n                  \"defaultValue\": \"10\"\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 126,\n          \"name\": \"lookupSN\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 127,\n              \"name\": \"lookupSN\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Look up a serial number by code for a collection (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to serial number lookup data\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 128,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 129,\n                  \"name\": \"codeId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"The serial number code to look up\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 130,\n          \"name\": \"assignSN\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 131,\n              \"name\": \"assignSN\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Assign a value to a serial number for a collection (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to assignment result\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 132,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 133,\n                  \"name\": \"codeId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"The serial number code to assign\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 134,\n                  \"name\": \"value\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"The value to assign to the serial number\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            104,\n            108,\n            111,\n            114,\n            118,\n            121,\n            126,\n            130\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 371,\n      \"name\": \"crate\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 372,\n          \"name\": \"get\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 373,\n              \"name\": \"get\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get a single crate by ID for a collection (admin only).\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 374,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 375,\n                  \"name\": \"crateId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 376,\n          \"name\": \"list\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 377,\n              \"name\": \"list\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"List all crates for a collection (admin only).\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 378,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"any\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 379,\n          \"name\": \"create\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 380,\n              \"name\": \"create\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Create a new crate for a collection (admin only).\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 381,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 382,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 383,\n          \"name\": \"update\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 384,\n              \"name\": \"update\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Update a crate for a collection (admin only).\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 385,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 386,\n                  \"name\": \"crateId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 387,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 388,\n          \"name\": \"remove\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 389,\n              \"name\": \"remove\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Delete a crate for a collection (admin only).\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 390,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 391,\n                  \"name\": \"crateId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"void\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            372,\n            376,\n            379,\n            383,\n            388\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 301,\n      \"name\": \"form\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 302,\n          \"name\": \"get\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 303,\n              \"name\": \"get\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get a single form by ID for a collection.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 304,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 305,\n                  \"name\": \"formId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The form identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 306,\n                  \"name\": \"admin\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {\n                    \"isOptional\": true\n                  },\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– If true, use admin endpoint; otherwise, use public\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"boolean\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 307,\n          \"name\": \"list\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 308,\n              \"name\": \"list\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"List all forms for a collection.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 309,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 310,\n                  \"name\": \"admin\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {\n                    \"isOptional\": true\n                  },\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– If true, use admin endpoint; otherwise, use public\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"boolean\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"any\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 311,\n          \"name\": \"create\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 312,\n              \"name\": \"create\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Create a new form for a collection (admin only).\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 313,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 314,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The form data\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 315,\n          \"name\": \"update\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 316,\n              \"name\": \"update\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Update a form for a collection (admin only).\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 317,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 318,\n                  \"name\": \"formId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The form identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 319,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The form data\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 320,\n          \"name\": \"remove\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 321,\n              \"name\": \"remove\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Delete a form for a collection (admin only).\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 322,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The collection identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 323,\n                  \"name\": \"formId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– The form identifier\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"void\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            302,\n            307,\n            311,\n            315,\n            320\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 135,\n      \"name\": \"product\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 136,\n          \"name\": \"get\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 137,\n              \"name\": \"get\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Retrieves a single Product Item by Collection ID and Product ID.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a ProductResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 138,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 139,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the product item\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 140,\n                  \"name\": \"admin\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {\n                    \"isOptional\": true\n                  },\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– If true, use admin endpoint; otherwise, use public\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"boolean\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 519,\n                    \"name\": \"ProductResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 141,\n          \"name\": \"list\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 142,\n              \"name\": \"list\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"List all Product Items for a Collection.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to an array of ProductResponse objects\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 143,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 144,\n                  \"name\": \"admin\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {\n                    \"isOptional\": true\n                  },\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– If true, use admin endpoint; otherwise, use public\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"boolean\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"reference\",\n                      \"target\": 519,\n                      \"name\": \"ProductResponse\",\n                      \"package\": \"@proveanything/smartlinks\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 145,\n          \"name\": \"create\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 146,\n              \"name\": \"create\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Create a new product for a collection (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a ProductResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 147,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 148,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Product creation data\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 519,\n                    \"name\": \"ProductResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 149,\n          \"name\": \"update\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 150,\n              \"name\": \"update\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Update a product for a collection (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a ProductResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 151,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 152,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 153,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Product update data\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 519,\n                    \"name\": \"ProductResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 154,\n          \"name\": \"remove\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 155,\n              \"name\": \"remove\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Delete a product for a collection (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to void\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 156,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 157,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"void\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 158,\n          \"name\": \"getSN\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 159,\n              \"name\": \"getSN\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get serial numbers for a product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to serial number data\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 160,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 161,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 162,\n                  \"name\": \"startIndex\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Starting index for pagination (default: 0)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"number\"\n                  },\n                  \"defaultValue\": \"0\"\n                },\n                {\n                  \"id\": 163,\n                  \"name\": \"count\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Number of serial numbers to retrieve (default: 10)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"number\"\n                  },\n                  \"defaultValue\": \"10\"\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 164,\n          \"name\": \"lookupSN\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 165,\n              \"name\": \"lookupSN\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Look up a serial number by code for a product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to serial number lookup data\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 166,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 167,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 168,\n                  \"name\": \"codeId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"The serial number code to look up\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            136,\n            141,\n            145,\n            149,\n            154,\n            158,\n            164\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 169,\n      \"name\": \"proof\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 170,\n          \"name\": \"get\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 171,\n              \"name\": \"get\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Retrieves a single Proof by Collection ID and Proof ID.\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a ProofResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 172,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 173,\n                  \"name\": \"proofId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"– Identifier of the proof\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 540,\n                    \"name\": \"ProofResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 174,\n          \"name\": \"list\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 175,\n              \"name\": \"list\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"List all Proofs for a Collection.\"\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 176,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"reference\",\n                      \"target\": 540,\n                      \"name\": \"ProofResponse\",\n                      \"package\": \"@proveanything/smartlinks\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            170,\n            174\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 436,\n      \"name\": \"variant\",\n      \"variant\": \"declaration\",\n      \"kind\": 4,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 437,\n          \"name\": \"get\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 438,\n              \"name\": \"get\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get a single variant by ID for a collection and product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a VariantResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 439,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 440,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 441,\n                  \"name\": \"variantId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the variant\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 87,\n                    \"name\": \"VariantResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 442,\n          \"name\": \"list\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 443,\n              \"name\": \"list\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"List all variants for a collection and product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to an array of VariantResponse objects\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 444,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 445,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"array\",\n                    \"elementType\": {\n                      \"type\": \"reference\",\n                      \"target\": 87,\n                      \"name\": \"VariantResponse\",\n                      \"package\": \"@proveanything/smartlinks\"\n                    }\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 446,\n          \"name\": \"create\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 447,\n              \"name\": \"create\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Create a new variant for a collection and product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a VariantResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 448,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 449,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 450,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Variant creation data\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 87,\n                    \"name\": \"VariantResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 451,\n          \"name\": \"update\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 452,\n              \"name\": \"update\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Update a variant for a collection and product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a VariantResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 453,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 454,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 455,\n                  \"name\": \"variantId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the variant\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 456,\n                  \"name\": \"data\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Variant update data\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 87,\n                    \"name\": \"VariantResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 457,\n          \"name\": \"remove\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 458,\n              \"name\": \"remove\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Delete a variant for a collection and product (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to void\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 459,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 460,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 461,\n                  \"name\": \"variantId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the variant\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"void\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 462,\n          \"name\": \"getPublic\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 463,\n              \"name\": \"getPublic\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get a single variant by ID for a collection and product (public endpoint).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to a VariantResponse object\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 464,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 465,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 466,\n                  \"name\": \"variantId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the variant\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"reference\",\n                    \"target\": 87,\n                    \"name\": \"VariantResponse\",\n                    \"package\": \"@proveanything/smartlinks\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 467,\n          \"name\": \"getSN\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 468,\n              \"name\": \"getSN\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Get serial numbers for a variant (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to serial number data\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 469,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 470,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 471,\n                  \"name\": \"variantId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the variant\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 472,\n                  \"name\": \"startIndex\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Starting index for pagination (default: 0)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"number\"\n                  },\n                  \"defaultValue\": \"0\"\n                },\n                {\n                  \"id\": 473,\n                  \"name\": \"count\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Number of serial numbers to retrieve (default: 10)\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"number\"\n                  },\n                  \"defaultValue\": \"10\"\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        },\n        {\n          \"id\": 474,\n          \"name\": \"lookupSN\",\n          \"variant\": \"declaration\",\n          \"kind\": 64,\n          \"flags\": {},\n          \"signatures\": [\n            {\n              \"id\": 475,\n              \"name\": \"lookupSN\",\n              \"variant\": \"signature\",\n              \"kind\": 4096,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Look up a serial number by code for a variant (admin only).\"\n                  }\n                ],\n                \"blockTags\": [\n                  {\n                    \"tag\": \"@returns\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Promise resolving to serial number lookup data\"\n                      }\n                    ]\n                  },\n                  {\n                    \"tag\": \"@throws\",\n                    \"content\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"ErrorResponse if the request fails\"\n                      }\n                    ]\n                  }\n                ]\n              },\n              \"parameters\": [\n                {\n                  \"id\": 476,\n                  \"name\": \"collectionId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent collection\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 477,\n                  \"name\": \"productId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the parent product\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 478,\n                  \"name\": \"variantId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Identifier of the variant\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 479,\n                  \"name\": \"codeId\",\n                  \"variant\": \"param\",\n                  \"kind\": 32768,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"The serial number code to look up\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"type\": {\n                \"type\": \"reference\",\n                \"target\": {\n                  \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n                  \"qualifiedName\": \"Promise\"\n                },\n                \"typeArguments\": [\n                  {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"any\"\n                  }\n                ],\n                \"name\": \"Promise\",\n                \"package\": \"typescript\"\n              }\n            }\n          ]\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Functions\",\n          \"children\": [\n            437,\n            442,\n            446,\n            451,\n            457,\n            462,\n            467,\n            474\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 1,\n      \"name\": \"initializeApi\",\n      \"variant\": \"declaration\",\n      \"kind\": 64,\n      \"flags\": {},\n      \"signatures\": [\n        {\n          \"id\": 2,\n          \"name\": \"initializeApi\",\n          \"variant\": \"signature\",\n          \"kind\": 4096,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Call this once (e.g. at app startup) to configure baseURL/auth.\"\n              }\n            ]\n          },\n          \"parameters\": [\n            {\n              \"id\": 3,\n              \"name\": \"options\",\n              \"variant\": \"param\",\n              \"kind\": 32768,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"Configuration options\"\n                  }\n                ]\n              },\n              \"type\": {\n                \"type\": \"reflection\",\n                \"declaration\": {\n                  \"id\": 4,\n                  \"name\": \"__type\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 65536,\n                  \"flags\": {},\n                  \"children\": [\n                    {\n                      \"id\": 5,\n                      \"name\": \"baseURL\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 1024,\n                      \"flags\": {},\n                      \"type\": {\n                        \"type\": \"intrinsic\",\n                        \"name\": \"string\"\n                      }\n                    },\n                    {\n                      \"id\": 6,\n                      \"name\": \"apiKey\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 1024,\n                      \"flags\": {\n                        \"isOptional\": true\n                      },\n                      \"type\": {\n                        \"type\": \"intrinsic\",\n                        \"name\": \"string\"\n                      }\n                    },\n                    {\n                      \"id\": 7,\n                      \"name\": \"bearerToken\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 1024,\n                      \"flags\": {\n                        \"isOptional\": true\n                      },\n                      \"type\": {\n                        \"type\": \"intrinsic\",\n                        \"name\": \"string\"\n                      }\n                    },\n                    {\n                      \"id\": 8,\n                      \"name\": \"proxyMode\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 1024,\n                      \"flags\": {\n                        \"isOptional\": true\n                      },\n                      \"type\": {\n                        \"type\": \"intrinsic\",\n                        \"name\": \"boolean\"\n                      }\n                    }\n                  ],\n                  \"groups\": [\n                    {\n                      \"title\": \"Properties\",\n                      \"children\": [\n                        5,\n                        6,\n                        7,\n                        8\n                      ]\n                    }\n                  ]\n                }\n              }\n            }\n          ],\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"void\"\n          }\n        }\n      ]\n    },\n    {\n      \"id\": 9,\n      \"name\": \"request\",\n      \"variant\": \"declaration\",\n      \"kind\": 64,\n      \"flags\": {},\n      \"signatures\": [\n        {\n          \"id\": 10,\n          \"name\": \"request\",\n          \"variant\": \"signature\",\n          \"kind\": 4096,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Internal helper that performs a GET request to `\\\\${baseURL}\\\\${path}`, \\ninjecting headers for apiKey or bearerToken if present. \\nReturns the parsed JSON as T, or throws an Error.\"\n              }\n            ]\n          },\n          \"typeParameter\": [\n            {\n              \"id\": 11,\n              \"name\": \"T\",\n              \"variant\": \"typeParam\",\n              \"kind\": 131072,\n              \"flags\": {}\n            }\n          ],\n          \"parameters\": [\n            {\n              \"id\": 12,\n              \"name\": \"path\",\n              \"variant\": \"param\",\n              \"kind\": 32768,\n              \"flags\": {},\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            }\n          ],\n          \"type\": {\n            \"type\": \"reference\",\n            \"target\": {\n              \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n              \"qualifiedName\": \"Promise\"\n            },\n            \"typeArguments\": [\n              {\n                \"type\": \"reference\",\n                \"target\": 11,\n                \"name\": \"T\",\n                \"package\": \"@proveanything/smartlinks\",\n                \"refersToTypeParameter\": true\n              }\n            ],\n            \"name\": \"Promise\",\n            \"package\": \"typescript\"\n          }\n        }\n      ]\n    },\n    {\n      \"id\": 13,\n      \"name\": \"sendCustomProxyMessage\",\n      \"variant\": \"declaration\",\n      \"kind\": 64,\n      \"flags\": {},\n      \"signatures\": [\n        {\n          \"id\": 14,\n          \"name\": \"sendCustomProxyMessage\",\n          \"variant\": \"signature\",\n          \"kind\": 4096,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Sends a custom proxy message to the parent Smartlinks application when running in an iframe.\\nThis function is used to communicate with the parent window when the SDK is embedded in an iframe\\nand proxyMode is enabled. It sends a message to the parent and waits for a response.\"\n              }\n            ],\n            \"blockTags\": [\n              {\n                \"tag\": \"@returns\",\n                \"content\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"The data from the proxy response\"\n                  }\n                ]\n              }\n            ]\n          },\n          \"typeParameter\": [\n            {\n              \"id\": 15,\n              \"name\": \"T\",\n              \"variant\": \"typeParam\",\n              \"kind\": 131072,\n              \"flags\": {},\n              \"default\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            }\n          ],\n          \"parameters\": [\n            {\n              \"id\": 16,\n              \"name\": \"request\",\n              \"variant\": \"param\",\n              \"kind\": 32768,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"The request type string to identify the message type\"\n                  }\n                ]\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              }\n            },\n            {\n              \"id\": 17,\n              \"name\": \"params\",\n              \"variant\": \"param\",\n              \"kind\": 32768,\n              \"flags\": {},\n              \"comment\": {\n                \"summary\": [\n                  {\n                    \"kind\": \"text\",\n                    \"text\": \"The parameters object containing data to send to the parent\"\n                  }\n                ]\n              },\n              \"type\": {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            }\n          ],\n          \"type\": {\n            \"type\": \"reference\",\n            \"target\": {\n              \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n              \"qualifiedName\": \"Promise\"\n            },\n            \"typeArguments\": [\n              {\n                \"type\": \"reference\",\n                \"target\": 15,\n                \"name\": \"T\",\n                \"package\": \"@proveanything/smartlinks\",\n                \"refersToTypeParameter\": true\n              }\n            ],\n            \"name\": \"Promise\",\n            \"package\": \"typescript\"\n          }\n        }\n      ]\n    },\n    {\n      \"id\": 548,\n      \"name\": \"AppConfigurationResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 256,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Represents an App Configuration object.\"\n          }\n        ]\n      },\n      \"children\": [\n        {\n          \"id\": 549,\n          \"name\": \"id\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Unique identifier for the app configuration\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 550,\n          \"name\": \"name\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Name of the app configuration\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 551,\n          \"name\": \"settings\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {\n            \"isOptional\": true\n          },\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Key-value pairs representing configuration settings\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"reference\",\n            \"target\": {\n              \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n              \"qualifiedName\": \"Record\"\n            },\n            \"typeArguments\": [\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              },\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            ],\n            \"name\": \"Record\",\n            \"package\": \"typescript\"\n          }\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Properties\",\n          \"children\": [\n            549,\n            550,\n            551\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 555,\n      \"name\": \"AssetResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 256,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Represents an Asset object.\"\n          }\n        ]\n      },\n      \"children\": [\n        {\n          \"id\": 556,\n          \"name\": \"id\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 557,\n          \"name\": \"name\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 558,\n          \"name\": \"url\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Properties\",\n          \"children\": [\n            556,\n            557,\n            558\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 70,\n      \"name\": \"AttestationResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 256,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 71,\n          \"name\": \"id\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 72,\n          \"name\": \"createdAt\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 73,\n          \"name\": \"updatedAt\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 74,\n          \"name\": \"public\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"reference\",\n            \"target\": {\n              \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n              \"qualifiedName\": \"Record\"\n            },\n            \"typeArguments\": [\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              },\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            ],\n            \"name\": \"Record\",\n            \"package\": \"typescript\"\n          }\n        },\n        {\n          \"id\": 75,\n          \"name\": \"private\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"reference\",\n            \"target\": {\n              \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n              \"qualifiedName\": \"Record\"\n            },\n            \"typeArguments\": [\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              },\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            ],\n            \"name\": \"Record\",\n            \"package\": \"typescript\"\n          }\n        },\n        {\n          \"id\": 76,\n          \"name\": \"proof\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"reference\",\n            \"target\": {\n              \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n              \"qualifiedName\": \"Record\"\n            },\n            \"typeArguments\": [\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              },\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            ],\n            \"name\": \"Record\",\n            \"package\": \"typescript\"\n          }\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Properties\",\n          \"children\": [\n            71,\n            72,\n            73,\n            74,\n            75,\n            76\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 77,\n      \"name\": \"AttestationCreateRequest\",\n      \"variant\": \"declaration\",\n      \"kind\": 256,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 78,\n          \"name\": \"public\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"reference\",\n            \"target\": {\n              \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n              \"qualifiedName\": \"Record\"\n            },\n            \"typeArguments\": [\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              },\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            ],\n            \"name\": \"Record\",\n            \"package\": \"typescript\"\n          }\n        },\n        {\n          \"id\": 79,\n          \"name\": \"private\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"reference\",\n            \"target\": {\n              \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n              \"qualifiedName\": \"Record\"\n            },\n            \"typeArguments\": [\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              },\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            ],\n            \"name\": \"Record\",\n            \"package\": \"typescript\"\n          }\n        },\n        {\n          \"id\": 80,\n          \"name\": \"proof\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"type\": {\n            \"type\": \"reference\",\n            \"target\": {\n              \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n              \"qualifiedName\": \"Record\"\n            },\n            \"typeArguments\": [\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              },\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            ],\n            \"name\": \"Record\",\n            \"package\": \"typescript\"\n          }\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Properties\",\n          \"children\": [\n            78,\n            79,\n            80\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 81,\n      \"name\": \"AttestationUpdateRequest\",\n      \"variant\": \"declaration\",\n      \"kind\": 256,\n      \"flags\": {},\n      \"children\": [\n        {\n          \"id\": 82,\n          \"name\": \"type\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {\n            \"isOptional\": true\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 83,\n          \"name\": \"data\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {\n            \"isOptional\": true\n          },\n          \"type\": {\n            \"type\": \"reference\",\n            \"target\": {\n              \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n              \"qualifiedName\": \"Record\"\n            },\n            \"typeArguments\": [\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              },\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            ],\n            \"name\": \"Record\",\n            \"package\": \"typescript\"\n          }\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Properties\",\n          \"children\": [\n            82,\n            83\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 84,\n      \"name\": \"BatchResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 2097152,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Represents a Batch object.\"\n          }\n        ]\n      },\n      \"type\": {\n        \"type\": \"intrinsic\",\n        \"name\": \"any\"\n      }\n    },\n    {\n      \"id\": 85,\n      \"name\": \"BatchCreateRequest\",\n      \"variant\": \"declaration\",\n      \"kind\": 2097152,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Request payload for creating a new batch.\"\n          }\n        ]\n      },\n      \"type\": {\n        \"type\": \"intrinsic\",\n        \"name\": \"any\"\n      }\n    },\n    {\n      \"id\": 86,\n      \"name\": \"BatchUpdateRequest\",\n      \"variant\": \"declaration\",\n      \"kind\": 2097152,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Request payload for updating an existing batch.\"\n          }\n        ]\n      },\n      \"type\": {\n        \"type\": \"intrinsic\",\n        \"name\": \"any\"\n      }\n    },\n    {\n      \"id\": 480,\n      \"name\": \"CollectionResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 256,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Represents a Collection object.\"\n          }\n        ]\n      },\n      \"children\": [\n        {\n          \"id\": 481,\n          \"name\": \"id\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Unique identifier for the collection\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 482,\n          \"name\": \"title\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Human-readable title of the collection\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 483,\n          \"name\": \"description\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Description of collection\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 484,\n          \"name\": \"headerImage\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {\n            \"isOptional\": true\n          },\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"URL to the collection's larger header/hero image\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"reflection\",\n            \"declaration\": {\n              \"id\": 485,\n              \"name\": \"__type\",\n              \"variant\": \"declaration\",\n              \"kind\": 65536,\n              \"flags\": {},\n              \"children\": [\n                {\n                  \"id\": 486,\n                  \"name\": \"url\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 1024,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"URL to the asset\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 487,\n                  \"name\": \"thumbnails\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 1024,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Thumbnail URLs in different sizes\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"reflection\",\n                    \"declaration\": {\n                      \"id\": 488,\n                      \"name\": \"__type\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 65536,\n                      \"flags\": {},\n                      \"children\": [\n                        {\n                          \"id\": 489,\n                          \"name\": \"x100\",\n                          \"variant\": \"declaration\",\n                          \"kind\": 1024,\n                          \"flags\": {},\n                          \"type\": {\n                            \"type\": \"intrinsic\",\n                            \"name\": \"string\"\n                          }\n                        },\n                        {\n                          \"id\": 490,\n                          \"name\": \"x200\",\n                          \"variant\": \"declaration\",\n                          \"kind\": 1024,\n                          \"flags\": {},\n                          \"type\": {\n                            \"type\": \"intrinsic\",\n                            \"name\": \"string\"\n                          }\n                        },\n                        {\n                          \"id\": 491,\n                          \"name\": \"x512\",\n                          \"variant\": \"declaration\",\n                          \"kind\": 1024,\n                          \"flags\": {},\n                          \"type\": {\n                            \"type\": \"intrinsic\",\n                            \"name\": \"string\"\n                          }\n                        }\n                      ],\n                      \"groups\": [\n                        {\n                          \"title\": \"Properties\",\n                          \"children\": [\n                            489,\n                            490,\n                            491\n                          ]\n                        }\n                      ]\n                    }\n                  }\n                }\n              ],\n              \"groups\": [\n                {\n                  \"title\": \"Properties\",\n                  \"children\": [\n                    486,\n                    487\n                  ]\n                }\n              ]\n            }\n          }\n        },\n        {\n          \"id\": 492,\n          \"name\": \"logoImage\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {\n            \"isOptional\": true\n          },\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"URL to the collection's logo image\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"reflection\",\n            \"declaration\": {\n              \"id\": 493,\n              \"name\": \"__type\",\n              \"variant\": \"declaration\",\n              \"kind\": 65536,\n              \"flags\": {},\n              \"children\": [\n                {\n                  \"id\": 494,\n                  \"name\": \"url\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 1024,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"URL to the asset\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 495,\n                  \"name\": \"thumbnails\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 1024,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Thumbnail URLs in different sizes\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"reflection\",\n                    \"declaration\": {\n                      \"id\": 496,\n                      \"name\": \"__type\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 65536,\n                      \"flags\": {},\n                      \"children\": [\n                        {\n                          \"id\": 497,\n                          \"name\": \"x100\",\n                          \"variant\": \"declaration\",\n                          \"kind\": 1024,\n                          \"flags\": {},\n                          \"type\": {\n                            \"type\": \"intrinsic\",\n                            \"name\": \"string\"\n                          }\n                        },\n                        {\n                          \"id\": 498,\n                          \"name\": \"x200\",\n                          \"variant\": \"declaration\",\n                          \"kind\": 1024,\n                          \"flags\": {},\n                          \"type\": {\n                            \"type\": \"intrinsic\",\n                            \"name\": \"string\"\n                          }\n                        },\n                        {\n                          \"id\": 499,\n                          \"name\": \"x512\",\n                          \"variant\": \"declaration\",\n                          \"kind\": 1024,\n                          \"flags\": {},\n                          \"type\": {\n                            \"type\": \"intrinsic\",\n                            \"name\": \"string\"\n                          }\n                        }\n                      ],\n                      \"groups\": [\n                        {\n                          \"title\": \"Properties\",\n                          \"children\": [\n                            497,\n                            498,\n                            499\n                          ]\n                        }\n                      ]\n                    }\n                  }\n                }\n              ],\n              \"groups\": [\n                {\n                  \"title\": \"Properties\",\n                  \"children\": [\n                    494,\n                    495\n                  ]\n                }\n              ]\n            }\n          }\n        },\n        {\n          \"id\": 500,\n          \"name\": \"loaderImage\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {\n            \"isOptional\": true\n          },\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Collection's loader image\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"reflection\",\n            \"declaration\": {\n              \"id\": 501,\n              \"name\": \"__type\",\n              \"variant\": \"declaration\",\n              \"kind\": 65536,\n              \"flags\": {},\n              \"children\": [\n                {\n                  \"id\": 502,\n                  \"name\": \"overwriteName\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 1024,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Override name for the file\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 503,\n                  \"name\": \"name\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 1024,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Name of the asset\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 504,\n                  \"name\": \"type\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 1024,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"File type/extension\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 505,\n                  \"name\": \"url\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 1024,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"URL to the asset\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                }\n              ],\n              \"groups\": [\n                {\n                  \"title\": \"Properties\",\n                  \"children\": [\n                    502,\n                    503,\n                    504,\n                    505\n                  ]\n                }\n              ]\n            }\n          }\n        },\n        {\n          \"id\": 506,\n          \"name\": \"languages\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {\n            \"isOptional\": true\n          },\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Array of supported languages\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"array\",\n            \"elementType\": {\n              \"type\": \"reflection\",\n              \"declaration\": {\n                \"id\": 507,\n                \"name\": \"__type\",\n                \"variant\": \"declaration\",\n                \"kind\": 65536,\n                \"flags\": {},\n                \"children\": [\n                  {\n                    \"id\": 508,\n                    \"name\": \"code\",\n                    \"variant\": \"declaration\",\n                    \"kind\": 1024,\n                    \"flags\": {},\n                    \"comment\": {\n                      \"summary\": [\n                        {\n                          \"kind\": \"text\",\n                          \"text\": \"Language code (e.g., \\\"fr\\\", \\\"it\\\", \\\"es\\\")\"\n                        }\n                      ]\n                    },\n                    \"type\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"string\"\n                    }\n                  },\n                  {\n                    \"id\": 509,\n                    \"name\": \"lang\",\n                    \"variant\": \"declaration\",\n                    \"kind\": 1024,\n                    \"flags\": {},\n                    \"comment\": {\n                      \"summary\": [\n                        {\n                          \"kind\": \"text\",\n                          \"text\": \"Human-readable language name (e.g., \\\"French\\\", \\\"Italian\\\")\"\n                        }\n                      ]\n                    },\n                    \"type\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"string\"\n                    }\n                  },\n                  {\n                    \"id\": 510,\n                    \"name\": \"supported\",\n                    \"variant\": \"declaration\",\n                    \"kind\": 1024,\n                    \"flags\": {},\n                    \"comment\": {\n                      \"summary\": [\n                        {\n                          \"kind\": \"text\",\n                          \"text\": \"Whether this language is supported\"\n                        }\n                      ]\n                    },\n                    \"type\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"boolean\"\n                    }\n                  }\n                ],\n                \"groups\": [\n                  {\n                    \"title\": \"Properties\",\n                    \"children\": [\n                      508,\n                      509,\n                      510\n                    ]\n                  }\n                ]\n              }\n            }\n          }\n        },\n        {\n          \"id\": 511,\n          \"name\": \"roles\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"User roles mapping with user IDs as keys and role names as values\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"reflection\",\n            \"declaration\": {\n              \"id\": 512,\n              \"name\": \"__type\",\n              \"variant\": \"declaration\",\n              \"kind\": 65536,\n              \"flags\": {},\n              \"indexSignature\": {\n                \"id\": 513,\n                \"name\": \"__index\",\n                \"variant\": \"signature\",\n                \"kind\": 8192,\n                \"flags\": {},\n                \"parameters\": [\n                  {\n                    \"id\": 514,\n                    \"name\": \"userId\",\n                    \"variant\": \"param\",\n                    \"kind\": 32768,\n                    \"flags\": {},\n                    \"type\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"string\"\n                    }\n                  }\n                ],\n                \"type\": {\n                  \"type\": \"intrinsic\",\n                  \"name\": \"string\"\n                }\n              }\n            }\n          }\n        },\n        {\n          \"id\": 515,\n          \"name\": \"groupTags\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {\n            \"isOptional\": true\n          },\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Array of group tag names\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"array\",\n            \"elementType\": {\n              \"type\": \"intrinsic\",\n              \"name\": \"string\"\n            }\n          }\n        },\n        {\n          \"id\": 516,\n          \"name\": \"redirectUrl\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {\n            \"isOptional\": true\n          },\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Whether the collection has a custom domain\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 517,\n          \"name\": \"shortId\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"The shortId of this collection\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 518,\n          \"name\": \"dark\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {\n            \"isOptional\": true\n          },\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"if dark mode is enabled for this collection\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"boolean\"\n          }\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Properties\",\n          \"children\": [\n            481,\n            482,\n            483,\n            484,\n            492,\n            500,\n            506,\n            511,\n            515,\n            516,\n            517,\n            518\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 552,\n      \"name\": \"ErrorResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 256,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Represents a standardized error response.\"\n          }\n        ]\n      },\n      \"children\": [\n        {\n          \"id\": 553,\n          \"name\": \"code\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Numeric error code\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"number\"\n          }\n        },\n        {\n          \"id\": 554,\n          \"name\": \"message\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Human-readable error message\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Properties\",\n          \"children\": [\n            553,\n            554\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 519,\n      \"name\": \"ProductResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 256,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Represents a Product Item object.\"\n          }\n        ]\n      },\n      \"children\": [\n        {\n          \"id\": 520,\n          \"name\": \"id\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Unique identifier for the product\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 521,\n          \"name\": \"name\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Name of the product\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 522,\n          \"name\": \"collectionId\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Unique identifier for the product's collection\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 523,\n          \"name\": \"description\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Detailed description of the product\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 524,\n          \"name\": \"heroImage\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Hero image asset object\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"reflection\",\n            \"declaration\": {\n              \"id\": 525,\n              \"name\": \"__type\",\n              \"variant\": \"declaration\",\n              \"kind\": 65536,\n              \"flags\": {},\n              \"children\": [\n                {\n                  \"id\": 526,\n                  \"name\": \"url\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 1024,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"URL to the asset\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"intrinsic\",\n                    \"name\": \"string\"\n                  }\n                },\n                {\n                  \"id\": 527,\n                  \"name\": \"thumbnails\",\n                  \"variant\": \"declaration\",\n                  \"kind\": 1024,\n                  \"flags\": {},\n                  \"comment\": {\n                    \"summary\": [\n                      {\n                        \"kind\": \"text\",\n                        \"text\": \"Thumbnail URLs in different sizes\"\n                      }\n                    ]\n                  },\n                  \"type\": {\n                    \"type\": \"reflection\",\n                    \"declaration\": {\n                      \"id\": 528,\n                      \"name\": \"__type\",\n                      \"variant\": \"declaration\",\n                      \"kind\": 65536,\n                      \"flags\": {},\n                      \"children\": [\n                        {\n                          \"id\": 529,\n                          \"name\": \"x100\",\n                          \"variant\": \"declaration\",\n                          \"kind\": 1024,\n                          \"flags\": {},\n                          \"type\": {\n                            \"type\": \"intrinsic\",\n                            \"name\": \"string\"\n                          }\n                        },\n                        {\n                          \"id\": 530,\n                          \"name\": \"x200\",\n                          \"variant\": \"declaration\",\n                          \"kind\": 1024,\n                          \"flags\": {},\n                          \"type\": {\n                            \"type\": \"intrinsic\",\n                            \"name\": \"string\"\n                          }\n                        },\n                        {\n                          \"id\": 531,\n                          \"name\": \"x512\",\n                          \"variant\": \"declaration\",\n                          \"kind\": 1024,\n                          \"flags\": {},\n                          \"type\": {\n                            \"type\": \"intrinsic\",\n                            \"name\": \"string\"\n                          }\n                        }\n                      ],\n                      \"groups\": [\n                        {\n                          \"title\": \"Properties\",\n                          \"children\": [\n                            529,\n                            530,\n                            531\n                          ]\n                        }\n                      ]\n                    }\n                  }\n                }\n              ],\n              \"groups\": [\n                {\n                  \"title\": \"Properties\",\n                  \"children\": [\n                    526,\n                    527\n                  ]\n                }\n              ]\n            }\n          }\n        },\n        {\n          \"id\": 532,\n          \"name\": \"groupTags\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Flexible map of tags with true/false values\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"reflection\",\n            \"declaration\": {\n              \"id\": 533,\n              \"name\": \"__type\",\n              \"variant\": \"declaration\",\n              \"kind\": 65536,\n              \"flags\": {},\n              \"indexSignature\": {\n                \"id\": 534,\n                \"name\": \"__index\",\n                \"variant\": \"signature\",\n                \"kind\": 8192,\n                \"flags\": {},\n                \"parameters\": [\n                  {\n                    \"id\": 535,\n                    \"name\": \"tagName\",\n                    \"variant\": \"param\",\n                    \"kind\": 32768,\n                    \"flags\": {},\n                    \"type\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"string\"\n                    }\n                  }\n                ],\n                \"type\": {\n                  \"type\": \"intrinsic\",\n                  \"name\": \"boolean\"\n                }\n              }\n            }\n          }\n        },\n        {\n          \"id\": 536,\n          \"name\": \"data\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Flexible key/value data map\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"reflection\",\n            \"declaration\": {\n              \"id\": 537,\n              \"name\": \"__type\",\n              \"variant\": \"declaration\",\n              \"kind\": 65536,\n              \"flags\": {},\n              \"indexSignature\": {\n                \"id\": 538,\n                \"name\": \"__index\",\n                \"variant\": \"signature\",\n                \"kind\": 8192,\n                \"flags\": {},\n                \"parameters\": [\n                  {\n                    \"id\": 539,\n                    \"name\": \"key\",\n                    \"variant\": \"param\",\n                    \"kind\": 32768,\n                    \"flags\": {},\n                    \"type\": {\n                      \"type\": \"intrinsic\",\n                      \"name\": \"string\"\n                    }\n                  }\n                ],\n                \"type\": {\n                  \"type\": \"intrinsic\",\n                  \"name\": \"any\"\n                }\n              }\n            }\n          }\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Properties\",\n          \"children\": [\n            520,\n            521,\n            522,\n            523,\n            524,\n            532,\n            536\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 540,\n      \"name\": \"ProofResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 256,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Represents a Proof object.\"\n          }\n        ]\n      },\n      \"children\": [\n        {\n          \"id\": 541,\n          \"name\": \"collectionId\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Unique identifier for the collection\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 542,\n          \"name\": \"createdAt\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Creation timestamp\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 543,\n          \"name\": \"id\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Unique identifier for the proof\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 544,\n          \"name\": \"productId\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Unique identifier for the product\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 545,\n          \"name\": \"tokenId\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Unique identifier for the token\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 546,\n          \"name\": \"userId\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Unique identifier for the user\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"intrinsic\",\n            \"name\": \"string\"\n          }\n        },\n        {\n          \"id\": 547,\n          \"name\": \"values\",\n          \"variant\": \"declaration\",\n          \"kind\": 1024,\n          \"flags\": {},\n          \"comment\": {\n            \"summary\": [\n              {\n                \"kind\": \"text\",\n                \"text\": \"Arbitrary key-value pairs for proof values\"\n              }\n            ]\n          },\n          \"type\": {\n            \"type\": \"reference\",\n            \"target\": {\n              \"sourceFileName\": \"node_modules/typescript/lib/lib.es5.d.ts\",\n              \"qualifiedName\": \"Record\"\n            },\n            \"typeArguments\": [\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"string\"\n              },\n              {\n                \"type\": \"intrinsic\",\n                \"name\": \"any\"\n              }\n            ],\n            \"name\": \"Record\",\n            \"package\": \"typescript\"\n          }\n        }\n      ],\n      \"groups\": [\n        {\n          \"title\": \"Properties\",\n          \"children\": [\n            541,\n            542,\n            543,\n            544,\n            545,\n            546,\n            547\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": 87,\n      \"name\": \"VariantResponse\",\n      \"variant\": \"declaration\",\n      \"kind\": 2097152,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Represents a Variant object.\"\n          }\n        ]\n      },\n      \"type\": {\n        \"type\": \"intrinsic\",\n        \"name\": \"any\"\n      }\n    },\n    {\n      \"id\": 88,\n      \"name\": \"VariantCreateRequest\",\n      \"variant\": \"declaration\",\n      \"kind\": 2097152,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Request payload for creating a new variant.\"\n          }\n        ]\n      },\n      \"type\": {\n        \"type\": \"intrinsic\",\n        \"name\": \"any\"\n      }\n    },\n    {\n      \"id\": 89,\n      \"name\": \"VariantUpdateRequest\",\n      \"variant\": \"declaration\",\n      \"kind\": 2097152,\n      \"flags\": {},\n      \"comment\": {\n        \"summary\": [\n          {\n            \"kind\": \"text\",\n            \"text\": \"Request payload for updating an existing variant.\"\n          }\n        ]\n      },\n      \"type\": {\n        \"type\": \"intrinsic\",\n        \"name\": \"any\"\n      }\n    }\n  ],\n  \"groups\": [\n    {\n      \"title\": \"Namespaces\",\n      \"children\": [\n        177,\n        199,\n        218,\n        258,\n        289,\n        392,\n        324,\n        103,\n        371,\n        301,\n        135,\n        169,\n        436\n      ]\n    },\n    {\n      \"title\": \"Interfaces\",\n      \"children\": [\n        548,\n        555,\n        70,\n        77,\n        81,\n        480,\n        552,\n        519,\n        540\n      ]\n    },\n    {\n      \"title\": \"Type Aliases\",\n      \"children\": [\n        90,\n        18,\n        25,\n        32,\n        84,\n        85,\n        86,\n        87,\n        88,\n        89\n      ]\n    },\n    {\n      \"title\": \"Functions\",\n      \"children\": [\n        1,\n        9,\n        13\n      ]\n    }\n  ],\n  \"packageName\": \"@proveanything/smartlinks\",\n  \"readme\": [\n    {\n      \"kind\": \"text\",\n      \"text\": \"# Smartlinks SDK\\r\\n\\r\\nOfficial JavaScript/TypeScript SDK for the Smartlinks API - enabling digital product authentication, traceability, and engagement.\\r\\n\\r\\n## Installation\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "bash\\r\\nnpm install @proveanything/smartlinks\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Quick Start\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { initializeApi, auth, collection, product } from '@proveanything/smartlinks'\\r\\n\\r\\n// Initialize the SDK\\r\\ninitializeApi({\\r\\n  baseURL: 'https://smartlinks.app/api/v1'\\r\\n})\\r\\n\\r\\n// Login\\r\\nconst loginResponse = await auth.login('email@example.com', 'password')\\r\\n\\r\\n// Get collections\\r\\nconst collections = await collection.list(true) // admin endpoint\\r\\n\\r\\n// Get products in a collection\\r\\nconst products = await product.list('collection-id', true)\\r\\n\\r\\n// Get a specific product\\r\\nconst productDetail = await product.get('collection-id', 'product-id')\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Configuration\\r\\n\\r\\n### Basic Setup\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { initializeApi } from '@proveanything/smartlinks'\\r\\n\\r\\n// Initialize with base URL\\r\\ninitializeApi({\\r\\n  baseURL: 'https://smartlinks.app/api/v1'\\r\\n})\\r\\n\\r\\n// Or with API key for server-side usage\\r\\ninitializeApi({\\r\\n  baseURL: 'https://smartlinks.app/api/v1',\\r\\n  apiKey: 'your-api-key'\\r\\n})\\r\\n\\r\\n// For iframe/embedded usage\\r\\ninitializeApi({\\r\\n  baseURL: 'https://smartlinks.app/api/v1',\\r\\n  proxyMode: true\\r\\n})\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n### Runtime Token Management\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { setBearerToken } from '@proveanything/smartlinks'\\r\\n\\r\\n// Set token after login\\r\\nsetBearerToken('your-bearer-token')\\r\\n\\r\\n// Clear token on logout\\r\\nsetBearerToken(undefined)\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Authentication\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { auth } from '@proveanything/smartlinks'\\r\\n\\r\\n// Login with email/password\\r\\nconst response = await auth.login('user@example.com', 'password')\\r\\nconsole.log(response.bearerToken) // Token is automatically set for future calls\\r\\n\\r\\n// Verify current token\\r\\nconst userInfo = await auth.verifyToken()\\r\\n\\r\\n// Get account information\\r\\nconst account = await auth.getAccount()\\r\\n\\r\\n// Logout (clears token)\\r\\nauth.logout()\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Working with Collections\\r\\n\\r\\nCollections are the top-level containers for organizing products.\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { collection } from '@proveanything/smartlinks'\\r\\n\\r\\n// Get all collections (public)\\r\\nconst publicCollections = await collection.list(false)\\r\\n\\r\\n// Get all collections (admin - requires authentication)\\r\\nconst adminCollections = await collection.list(true)\\r\\n\\r\\n// Get specific collection\\r\\nconst col = await collection.get('collection-id', true)\\r\\n\\r\\n// Create collection (admin only)\\r\\nconst newCollection = await collection.create({\\r\\n  title: 'New Collection',\\r\\n  description: 'Collection description'\\r\\n})\\r\\n\\r\\n// Update collection (admin only) \\r\\nawait collection.update('collection-id', { \\r\\n  title: 'Updated Title' \\r\\n})\\r\\n\\r\\n// Delete collection (admin only)\\r\\nawait collection.remove('collection-id')\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n### Serial Number Management\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\n// Get serial numbers for a collection\\r\\nconst serialNumbers = await collection.getSN('collection-id', 0, 10)\\r\\n\\r\\n// Look up a specific serial number\\r\\nconst lookupResult = await collection.lookupSN('collection-id', 'serial-code')\\r\\n\\r\\n// Assign a value to a serial number\\r\\nawait collection.assignSN('collection-id', 'serial-code', 'assigned-value')\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Working with Products\\r\\n\\r\\nProducts represent individual items within collections.\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { product } from '@proveanything/smartlinks'\\r\\n\\r\\n// List products in collection (public)\\r\\nconst publicProducts = await product.list('collection-id', false)\\r\\n\\r\\n// List products in collection (admin)\\r\\nconst adminProducts = await product.list('collection-id', true)\\r\\n\\r\\n// Get specific product\\r\\nconst prod = await product.get('collection-id', 'product-id')\\r\\n\\r\\n// Create product (admin only)\\r\\nconst newProduct = await product.create('collection-id', {\\r\\n  name: 'New Product',\\r\\n  description: 'Product description',\\r\\n  data: {\\r\\n    custom: 'properties'\\r\\n  }\\r\\n})\\r\\n\\r\\n// Update product (admin only)\\r\\nawait product.update('collection-id', 'product-id', { \\r\\n  name: 'Updated Name' \\r\\n})\\r\\n\\r\\n// Delete product (admin only)\\r\\nawait product.remove('collection-id', 'product-id')\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n### Product Serial Numbers\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\n// Get serial numbers for a product\\r\\nconst serialNumbers = await product.getSN('collection-id', 'product-id', 0, 10)\\r\\n\\r\\n// Look up a serial number for a product\\r\\nconst lookupResult = await product.lookupSN('collection-id', 'product-id', 'serial-code')\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Variants and Batches\\r\\n\\r\\nManage product variants and production batches:\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { variant, batch } from '@proveanything/smartlinks'\\r\\n\\r\\n// Work with variants\\r\\nconst variants = await variant.list('collection-id', 'product-id')\\r\\nconst newVariant = await variant.create('collection-id', 'product-id', {\\r\\n  name: 'Size Large',\\r\\n  properties: { size: 'L', color: 'blue' }\\r\\n})\\r\\n\\r\\n// Work with batches  \\r\\nconst batches = await batch.list('collection-id', 'product-id')\\r\\nconst newBatch = await batch.create('collection-id', 'product-id', {\\r\\n  name: 'Batch 001',\\r\\n  quantity: 100\\r\\n})\\r\\n\\r\\n// Serial numbers for variants/batches\\r\\nconst variantSerials = await variant.getSN('collection-id', 'product-id', 'variant-id')\\r\\nconst batchSerials = await batch.getSN('collection-id', 'product-id', 'batch-id')\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Asset Management\\r\\n\\r\\nUpload and manage files associated with collections, products, and proofs:\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { asset } from '@proveanything/smartlinks'\\r\\n\\r\\n// Upload asset to a proof\\r\\nconst file = document.getElementById('fileInput').files[0]\\r\\nconst uploadResult = await asset.uploadAsset(\\r\\n  'collection-id', \\r\\n  'product-id', \\r\\n  'proof-id', \\r\\n  file,\\r\\n  { description: 'Product image' }, // Optional extra data\\r\\n  (percent) => console.log("
    },
    {
      "kind": "code",
      "text": "`Upload: ${percent}%`"
    },
    {
      "kind": "text",
      "text": ") // Progress callback\\r\\n)\\r\\n\\r\\n// Get asset information\\r\\nconst assetInfo = await asset.getForProof('collection-id', 'product-id', 'proof-id', 'asset-id')\\r\\n\\r\\n// List all assets for a proof\\r\\nconst proofAssets = await asset.listForProof('collection-id', 'product-id', 'proof-id')\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Attestations and Claims\\r\\n\\r\\nManage digital attestations and claim verification:\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { attestation, claimSet } from '@proveanything/smartlinks'\\r\\n\\r\\n// Work with attestations\\r\\nconst attestations = await attestation.list('collection-id', 'product-id', 'proof-id')\\r\\nconst newAttestation = await attestation.create('collection-id', 'product-id', 'proof-id', {\\r\\n  public: { verified: true },\\r\\n  private: { inspector: 'John Doe' },\\r\\n  proof: { signature: 'abc123' }\\r\\n})\\r\\n\\r\\n// Work with claim sets\\r\\nconst claimSets = await claimSet.getAllForCollection('collection-id')\\r\\nconst claimResult = await claimSet.makeClaim('collection-id', {\\r\\n  productId: 'product-id',\\r\\n  claimType: 'ownership'\\r\\n})\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Proofs\\r\\n\\r\\nRetrieve and validate product proofs:\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { proof } from '@proveanything/smartlinks'\\r\\n\\r\\n// Get all proofs for a collection\\r\\nconst proofs = await proof.list('collection-id')\\r\\n\\r\\n// Get specific proof\\r\\nconst proofDetail = await proof.get('collection-id', 'proof-id')\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Forms\\r\\n\\r\\nDynamic form creation and management:\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { form } from '@proveanything/smartlinks'\\r\\n\\r\\n// List forms (public)\\r\\nconst publicForms = await form.list('collection-id', false)\\r\\n\\r\\n// List forms (admin)\\r\\nconst adminForms = await form.list('collection-id', true)\\r\\n\\r\\n// Create form (admin only)\\r\\nconst newForm = await form.create('collection-id', {\\r\\n  name: 'Product Registration',\\r\\n  fields: [\\r\\n    { name: 'email', type: 'email', required: true },\\r\\n    { name: 'name', type: 'text', required: true }\\r\\n  ]\\r\\n})\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Advanced Usage\\r\\n\\r\\n### Proxy Mode (iframe Communication)\\r\\n\\r\\nWhen running in an iframe, use proxy mode to communicate with the parent window:\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { initializeApi, sendCustomProxyMessage } from '@proveanything/smartlinks'\\r\\n\\r\\n// Initialize in proxy mode\\r\\ninitializeApi({\\r\\n  baseURL: 'https://smartlinks.app/api/v1',\\r\\n  proxyMode: true\\r\\n})\\r\\n\\r\\n// Send custom messages to parent window\\r\\nconst response = await sendCustomProxyMessage('custom-action', {\\r\\n  data: 'any-data'\\r\\n})\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n### Custom Configuration\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { appConfiguration } from '@proveanything/smartlinks'\\r\\n\\r\\n// Get configuration\\r\\nconst config = await appConfiguration.getConfig({ key: 'setting-name' })\\r\\n\\r\\n// Set configuration\\r\\nawait appConfiguration.setConfig({ \\r\\n  key: 'setting-name', \\r\\n  value: 'setting-value' \\r\\n})\\r\\n\\r\\n// Work with configuration data\\r\\nconst data = await appConfiguration.getData({ category: 'user-preferences' })\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Error Handling\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { ErrorResponse } from '@proveanything/smartlinks'\\r\\n\\r\\ntry {\\r\\n  const result = await product.get('collection-id', 'product-id')\\r\\n} catch (error) {\\r\\n  if (error instanceof ErrorResponse) {\\r\\n    console.error('API Error:', error.message)\\r\\n    console.error('Status Code:', error.code)\\r\\n  } else {\\r\\n    console.error('Unexpected error:', error)\\r\\n  }\\r\\n}\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## TypeScript Support\\r\\n\\r\\nThe SDK is written in TypeScript and includes full type definitions:\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\nimport { \\r\\n  ProductResponse, \\r\\n  CollectionResponse, \\r\\n  AttestationCreateRequest \\r\\n} from '@proveanything/smartlinks'\\r\\n\\r\\nconst product: ProductResponse = await product.get('col-id', 'prod-id')\\r\\nconst collection: CollectionResponse = await collection.get('col-id')\\r\\n\\r\\nconst attestationData: AttestationCreateRequest = {\\r\\n  public: { verified: true },\\r\\n  private: { notes: 'Internal notes' },\\r\\n  proof: { signature: 'digital-signature' }\\r\\n}\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Admin vs Public Endpoints\\r\\n\\r\\nMany functions support both admin and public access modes:\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "typescript\\r\\n// Public access (limited data, no authentication required)\\r\\nconst publicCollections = await collection.list(false)\\r\\nconst publicProducts = await product.list('collection-id', false)\\r\\n\\r\\n// Admin access (full data + management capabilities, authentication required)  \\r\\nconst adminCollections = await collection.list(true)\\r\\nconst adminProducts = await product.list('collection-id', true)\\r\\n\\r\\n// Create/Update/Delete operations are admin-only\\r\\nawait collection.create(data) // Requires authentication\\r\\nawait product.update('col-id', 'prod-id', data) // Requires authentication\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Browser vs Node.js\\r\\n\\r\\nThe SDK works in both browser and Node.js environments:\\r\\n\\r\\n### Browser Usage\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "html\\r\\n<script type=\\\"module\\\">\\r\\n  import { initializeApi, auth } from '@proveanything/smartlinks'\\r\\n  \\r\\n  initializeApi({ baseURL: 'https://smartlinks.app/api/v1' })\\r\\n  // Use the SDK...\\r\\n</script>\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n### Node.js Usage\\r\\n\\r\\n\"\n    },\n    {\n      \"kind\": \"code\",\n      \"text\": \"```"
    },
    {
      "kind": "text",
      "text": "javascript\\r\\nconst { initializeApi, auth } = require('@proveanything/smartlinks')\\r\\n\\r\\ninitializeApi({ \\r\\n  baseURL: 'https://smartlinks.app/api/v1',\\r\\n  apiKey: process.env.SMARTLINKS_API_KEY \\r\\n})\\r\\n"
    },
    {
      "kind": "code",
      "text": "```\"\n    },\n    {\n      \"kind\": \"text\",\n      \"text\": \"\\r\\n\\r\\n## Examples\\r\\n\\r\\nCheck out the [examples](./examples/) directory for complete implementation examples:\\r\\n\\r\\n- [Node.js Demo](./examples/node-demo.ts) - Server-side usage examples\\r\\n- [Browser Demo](./examples/browser-demo.html) - Frontend integration examples\\r\\n- [React Demo](./examples/react-demo.tsx) - React component examples\\r\\n\\r\\n## API Reference\\r\\n\\r\\nFor complete API documentation including all functions and types, see [API_SUMMARY.md](./API_SUMMARY.md).\\r\\n\\r\\n## Support\\r\\n\\r\\n- **Documentation**: [API Reference](./API_SUMMARY.md)\\r\\n- **Issues**: [GitHub Issues](https://github.com/Prove-Anything/smartlinks/issues)\\r\\n- **Website**: [smartlinks.app](https://smartlinks.app)\\r\\n\\r\\n## License\\r\\n\\r\\nMIT License - see [LICENSE](./LICENSE) for details.\"\n    }\n  ],\n  \"symbolIdMap\": {\n    \"0\": {\n      \"sourceFileName\": \"src/index.ts\",\n      \"qualifiedName\": \"\"\n    },\n    \"1\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"initializeApi\"\n    },\n    \"2\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"initializeApi\"\n    },\n    \"3\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"options\"\n    },\n    \"4\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"5\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"__type.baseURL\"\n    },\n    \"6\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"__type.apiKey\"\n    },\n    \"7\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"__type.bearerToken\"\n    },\n    \"8\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"__type.proxyMode\"\n    },\n    \"9\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"request\"\n    },\n    \"10\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"request\"\n    },\n    \"11\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"T\"\n    },\n    \"12\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"path\"\n    },\n    \"13\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"sendCustomProxyMessage\"\n    },\n    \"14\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"sendCustomProxyMessage\"\n    },\n    \"15\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"T\"\n    },\n    \"16\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"request\"\n    },\n    \"17\": {\n      \"sourceFileName\": \"src/http.ts\",\n      \"qualifiedName\": \"params\"\n    },\n    \"18\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"LoginResponse\"\n    },\n    \"19\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"20\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.id\"\n    },\n    \"21\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.name\"\n    },\n    \"22\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.email\"\n    },\n    \"23\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.bearerToken\"\n    },\n    \"24\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.account\"\n    },\n    \"25\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"VerifyTokenResponse\"\n    },\n    \"26\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"27\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.valid\"\n    },\n    \"28\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.id\"\n    },\n    \"29\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.name\"\n    },\n    \"30\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.email\"\n    },\n    \"31\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.account\"\n    },\n    \"32\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"AccountInfoResponse\"\n    },\n    \"33\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"34\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.jwtToken\"\n    },\n    \"35\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.jwtExpiry\"\n    },\n    \"36\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.accessType\"\n    },\n    \"37\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.analyticsCode\"\n    },\n    \"38\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.analyticsId\"\n    },\n    \"39\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.auth_time\"\n    },\n    \"40\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.baseCollectionId\"\n    },\n    \"41\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.clientType\"\n    },\n    \"42\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.email\"\n    },\n    \"43\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.email_verified\"\n    },\n    \"44\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.features\"\n    },\n    \"45\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"46\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.actionLogger\"\n    },\n    \"47\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.adminCollections\"\n    },\n    \"48\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.adminApps\"\n    },\n    \"49\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.apiKeys\"\n    },\n    \"50\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.adminUsers\"\n    },\n    \"51\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.__index\"\n    },\n    \"53\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.iat\"\n    },\n    \"54\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.id\"\n    },\n    \"55\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.iss\"\n    },\n    \"56\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.location\"\n    },\n    \"57\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.name\"\n    },\n    \"58\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.picture\"\n    },\n    \"59\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.sites\"\n    },\n    \"60\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"61\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.__index\"\n    },\n    \"63\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.sub\"\n    },\n    \"64\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.uid\"\n    },\n    \"65\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.user_id\"\n    },\n    \"66\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.whitelabel\"\n    },\n    \"67\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"68\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"__type.__index\"\n    },\n    \"70\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationResponse\"\n    },\n    \"71\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationResponse.id\"\n    },\n    \"72\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationResponse.createdAt\"\n    },\n    \"73\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationResponse.updatedAt\"\n    },\n    \"74\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationResponse.public\"\n    },\n    \"75\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationResponse.private\"\n    },\n    \"76\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationResponse.proof\"\n    },\n    \"77\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationCreateRequest\"\n    },\n    \"78\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationCreateRequest.public\"\n    },\n    \"79\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationCreateRequest.private\"\n    },\n    \"80\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationCreateRequest.proof\"\n    },\n    \"81\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationUpdateRequest\"\n    },\n    \"82\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationUpdateRequest.type\"\n    },\n    \"83\": {\n      \"sourceFileName\": \"src/types/attestation.ts\",\n      \"qualifiedName\": \"AttestationUpdateRequest.data\"\n    },\n    \"84\": {\n      \"sourceFileName\": \"src/types/batch.ts\",\n      \"qualifiedName\": \"BatchResponse\"\n    },\n    \"85\": {\n      \"sourceFileName\": \"src/types/batch.ts\",\n      \"qualifiedName\": \"BatchCreateRequest\"\n    },\n    \"86\": {\n      \"sourceFileName\": \"src/types/batch.ts\",\n      \"qualifiedName\": \"BatchUpdateRequest\"\n    },\n    \"87\": {\n      \"sourceFileName\": \"src/types/variant.ts\",\n      \"qualifiedName\": \"VariantResponse\"\n    },\n    \"88\": {\n      \"sourceFileName\": \"src/types/variant.ts\",\n      \"qualifiedName\": \"VariantCreateRequest\"\n    },\n    \"89\": {\n      \"sourceFileName\": \"src/types/variant.ts\",\n      \"qualifiedName\": \"VariantUpdateRequest\"\n    },\n    \"90\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"AppConfigOptions\"\n    },\n    \"91\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"92\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type.appId\"\n    },\n    \"93\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type.collectionId\"\n    },\n    \"94\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type.productId\"\n    },\n    \"95\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type.variantId\"\n    },\n    \"96\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type.batchId\"\n    },\n    \"97\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type.itemId\"\n    },\n    \"98\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type.user\"\n    },\n    \"99\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type.userData\"\n    },\n    \"100\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type.admin\"\n    },\n    \"101\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type.config\"\n    },\n    \"102\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"__type.data\"\n    },\n    \"103\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection\"\n    },\n    \"104\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.get\"\n    },\n    \"105\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.get\"\n    },\n    \"106\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"107\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"admin\"\n    },\n    \"108\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.list\"\n    },\n    \"109\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.list\"\n    },\n    \"110\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"admin\"\n    },\n    \"111\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.create\"\n    },\n    \"112\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.create\"\n    },\n    \"113\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"114\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.update\"\n    },\n    \"115\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.update\"\n    },\n    \"116\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"117\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"118\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.remove\"\n    },\n    \"119\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.remove\"\n    },\n    \"120\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"121\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.getSN\"\n    },\n    \"122\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.getSN\"\n    },\n    \"123\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"124\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"startIndex\"\n    },\n    \"125\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"count\"\n    },\n    \"126\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.lookupSN\"\n    },\n    \"127\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.lookupSN\"\n    },\n    \"128\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"129\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"codeId\"\n    },\n    \"130\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.assignSN\"\n    },\n    \"131\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collection.assignSN\"\n    },\n    \"132\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"133\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"codeId\"\n    },\n    \"134\": {\n      \"sourceFileName\": \"src/api/collection.ts\",\n      \"qualifiedName\": \"value\"\n    },\n    \"135\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product\"\n    },\n    \"136\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.get\"\n    },\n    \"137\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.get\"\n    },\n    \"138\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"139\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"140\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"admin\"\n    },\n    \"141\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.list\"\n    },\n    \"142\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.list\"\n    },\n    \"143\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"144\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"admin\"\n    },\n    \"145\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.create\"\n    },\n    \"146\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.create\"\n    },\n    \"147\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"148\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"149\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.update\"\n    },\n    \"150\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.update\"\n    },\n    \"151\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"152\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"153\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"154\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.remove\"\n    },\n    \"155\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.remove\"\n    },\n    \"156\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"157\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"158\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.getSN\"\n    },\n    \"159\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.getSN\"\n    },\n    \"160\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"161\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"162\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"startIndex\"\n    },\n    \"163\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"count\"\n    },\n    \"164\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.lookupSN\"\n    },\n    \"165\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"product.lookupSN\"\n    },\n    \"166\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"167\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"168\": {\n      \"sourceFileName\": \"src/api/product.ts\",\n      \"qualifiedName\": \"codeId\"\n    },\n    \"169\": {\n      \"sourceFileName\": \"src/api/proof.ts\",\n      \"qualifiedName\": \"proof\"\n    },\n    \"170\": {\n      \"sourceFileName\": \"src/api/proof.ts\",\n      \"qualifiedName\": \"proof.get\"\n    },\n    \"171\": {\n      \"sourceFileName\": \"src/api/proof.ts\",\n      \"qualifiedName\": \"proof.get\"\n    },\n    \"172\": {\n      \"sourceFileName\": \"src/api/proof.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"173\": {\n      \"sourceFileName\": \"src/api/proof.ts\",\n      \"qualifiedName\": \"proofId\"\n    },\n    \"174\": {\n      \"sourceFileName\": \"src/api/proof.ts\",\n      \"qualifiedName\": \"proof.list\"\n    },\n    \"175\": {\n      \"sourceFileName\": \"src/api/proof.ts\",\n      \"qualifiedName\": \"proof.list\"\n    },\n    \"176\": {\n      \"sourceFileName\": \"src/api/proof.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"177\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration\"\n    },\n    \"178\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.getConfig\"\n    },\n    \"179\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.getConfig\"\n    },\n    \"180\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"opts\"\n    },\n    \"181\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.setConfig\"\n    },\n    \"182\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.setConfig\"\n    },\n    \"183\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"opts\"\n    },\n    \"184\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.deleteConfig\"\n    },\n    \"185\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.deleteConfig\"\n    },\n    \"186\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"opts\"\n    },\n    \"187\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.getData\"\n    },\n    \"188\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.getData\"\n    },\n    \"189\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"opts\"\n    },\n    \"190\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.getDataItem\"\n    },\n    \"191\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.getDataItem\"\n    },\n    \"192\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"opts\"\n    },\n    \"193\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.setDataItem\"\n    },\n    \"194\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.setDataItem\"\n    },\n    \"195\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"opts\"\n    },\n    \"196\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.deleteDataItem\"\n    },\n    \"197\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"appConfiguration.deleteDataItem\"\n    },\n    \"198\": {\n      \"sourceFileName\": \"src/api/appConfiguration.ts\",\n      \"qualifiedName\": \"opts\"\n    },\n    \"199\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appRecord\"\n    },\n    \"200\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appRecord.get\"\n    },\n    \"201\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appRecord.get\"\n    },\n    \"202\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"203\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appId\"\n    },\n    \"204\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appRecord.create\"\n    },\n    \"205\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appRecord.create\"\n    },\n    \"206\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"207\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appId\"\n    },\n    \"208\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"209\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appRecord.update\"\n    },\n    \"210\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appRecord.update\"\n    },\n    \"211\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"212\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appId\"\n    },\n    \"213\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"214\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appRecord.remove\"\n    },\n    \"215\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appRecord.remove\"\n    },\n    \"216\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"217\": {\n      \"sourceFileName\": \"src/api/appRecord.ts\",\n      \"qualifiedName\": \"appId\"\n    },\n    \"218\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset\"\n    },\n    \"219\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.getForCollection\"\n    },\n    \"220\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.getForCollection\"\n    },\n    \"221\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"222\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"assetId\"\n    },\n    \"223\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.listForCollection\"\n    },\n    \"224\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.listForCollection\"\n    },\n    \"225\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"226\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.getForProduct\"\n    },\n    \"227\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.getForProduct\"\n    },\n    \"228\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"229\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"230\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"assetId\"\n    },\n    \"231\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.listForProduct\"\n    },\n    \"232\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.listForProduct\"\n    },\n    \"233\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"234\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"235\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.getForProof\"\n    },\n    \"236\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.getForProof\"\n    },\n    \"237\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"238\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"239\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"proofId\"\n    },\n    \"240\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"assetId\"\n    },\n    \"241\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.listForProof\"\n    },\n    \"242\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.listForProof\"\n    },\n    \"243\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"244\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"245\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"proofId\"\n    },\n    \"246\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"appId\"\n    },\n    \"247\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.uploadAsset\"\n    },\n    \"248\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"asset.uploadAsset\"\n    },\n    \"249\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"250\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"251\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"proofId\"\n    },\n    \"252\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"file\"\n    },\n    \"253\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"extraData\"\n    },\n    \"254\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"onProgress\"\n    },\n    \"255\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"256\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"257\": {\n      \"sourceFileName\": \"src/api/asset.ts\",\n      \"qualifiedName\": \"percent\"\n    },\n    \"258\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestation\"\n    },\n    \"259\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestation.list\"\n    },\n    \"260\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestation.list\"\n    },\n    \"261\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"262\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"263\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"proofId\"\n    },\n    \"264\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestation.get\"\n    },\n    \"265\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestation.get\"\n    },\n    \"266\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"267\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"268\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"proofId\"\n    },\n    \"269\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestationId\"\n    },\n    \"270\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestation.create\"\n    },\n    \"271\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestation.create\"\n    },\n    \"272\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"273\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"274\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"proofId\"\n    },\n    \"275\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"276\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestation.update\"\n    },\n    \"277\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestation.update\"\n    },\n    \"278\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"279\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"280\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"proofId\"\n    },\n    \"281\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestationId\"\n    },\n    \"282\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"283\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestation.remove\"\n    },\n    \"284\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestation.remove\"\n    },\n    \"285\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"286\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"287\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"proofId\"\n    },\n    \"288\": {\n      \"sourceFileName\": \"src/api/attestation.ts\",\n      \"qualifiedName\": \"attestationId\"\n    },\n    \"289\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"auth\"\n    },\n    \"290\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"auth.login\"\n    },\n    \"291\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"auth.login\"\n    },\n    \"292\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"email\"\n    },\n    \"293\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"password\"\n    },\n    \"294\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"auth.logout\"\n    },\n    \"295\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"auth.logout\"\n    },\n    \"296\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"auth.verifyToken\"\n    },\n    \"297\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"auth.verifyToken\"\n    },\n    \"298\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"token\"\n    },\n    \"299\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"auth.getAccount\"\n    },\n    \"300\": {\n      \"sourceFileName\": \"src/api/auth.ts\",\n      \"qualifiedName\": \"auth.getAccount\"\n    },\n    \"301\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"form\"\n    },\n    \"302\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"form.get\"\n    },\n    \"303\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"form.get\"\n    },\n    \"304\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"305\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"formId\"\n    },\n    \"306\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"admin\"\n    },\n    \"307\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"form.list\"\n    },\n    \"308\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"form.list\"\n    },\n    \"309\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"310\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"admin\"\n    },\n    \"311\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"form.create\"\n    },\n    \"312\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"form.create\"\n    },\n    \"313\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"314\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"315\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"form.update\"\n    },\n    \"316\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"form.update\"\n    },\n    \"317\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"318\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"formId\"\n    },\n    \"319\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"320\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"form.remove\"\n    },\n    \"321\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"form.remove\"\n    },\n    \"322\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"323\": {\n      \"sourceFileName\": \"src/api/form.ts\",\n      \"qualifiedName\": \"formId\"\n    },\n    \"324\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet\"\n    },\n    \"325\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getAllForCollection\"\n    },\n    \"326\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getAllForCollection\"\n    },\n    \"327\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"328\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getForCollection\"\n    },\n    \"329\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getForCollection\"\n    },\n    \"330\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"331\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSetId\"\n    },\n    \"332\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getAllTags\"\n    },\n    \"333\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getAllTags\"\n    },\n    \"334\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"335\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSetId\"\n    },\n    \"336\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getReport\"\n    },\n    \"337\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getReport\"\n    },\n    \"338\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"339\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSetId\"\n    },\n    \"340\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getAssignedTags\"\n    },\n    \"341\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getAssignedTags\"\n    },\n    \"342\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"343\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSetId\"\n    },\n    \"344\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getTagSummary\"\n    },\n    \"345\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.getTagSummary\"\n    },\n    \"346\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"347\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.tagQuery\"\n    },\n    \"348\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.tagQuery\"\n    },\n    \"349\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"350\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"351\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.createForCollection\"\n    },\n    \"352\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.createForCollection\"\n    },\n    \"353\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"354\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"params\"\n    },\n    \"355\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.updateForCollection\"\n    },\n    \"356\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.updateForCollection\"\n    },\n    \"357\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"358\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"params\"\n    },\n    \"359\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.makeClaim\"\n    },\n    \"360\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.makeClaim\"\n    },\n    \"361\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"362\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"params\"\n    },\n    \"363\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.assignClaims\"\n    },\n    \"364\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.assignClaims\"\n    },\n    \"365\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"366\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"367\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.updateClaimData\"\n    },\n    \"368\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"claimSet.updateClaimData\"\n    },\n    \"369\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"370\": {\n      \"sourceFileName\": \"src/api/claimSet.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"371\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crate\"\n    },\n    \"372\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crate.get\"\n    },\n    \"373\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crate.get\"\n    },\n    \"374\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"375\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crateId\"\n    },\n    \"376\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crate.list\"\n    },\n    \"377\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crate.list\"\n    },\n    \"378\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"379\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crate.create\"\n    },\n    \"380\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crate.create\"\n    },\n    \"381\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"382\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"383\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crate.update\"\n    },\n    \"384\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crate.update\"\n    },\n    \"385\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"386\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crateId\"\n    },\n    \"387\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"388\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crate.remove\"\n    },\n    \"389\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crate.remove\"\n    },\n    \"390\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"391\": {\n      \"sourceFileName\": \"src/api/crate.ts\",\n      \"qualifiedName\": \"crateId\"\n    },\n    \"392\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch\"\n    },\n    \"393\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.get\"\n    },\n    \"394\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.get\"\n    },\n    \"395\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"396\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"397\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batchId\"\n    },\n    \"398\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.list\"\n    },\n    \"399\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.list\"\n    },\n    \"400\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"401\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"402\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.create\"\n    },\n    \"403\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.create\"\n    },\n    \"404\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"405\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"406\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"407\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.update\"\n    },\n    \"408\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.update\"\n    },\n    \"409\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"410\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"411\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batchId\"\n    },\n    \"412\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"413\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.remove\"\n    },\n    \"414\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.remove\"\n    },\n    \"415\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"416\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"417\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batchId\"\n    },\n    \"418\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.getPublic\"\n    },\n    \"419\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.getPublic\"\n    },\n    \"420\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"421\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"422\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batchId\"\n    },\n    \"423\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.getSN\"\n    },\n    \"424\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.getSN\"\n    },\n    \"425\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"426\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"427\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batchId\"\n    },\n    \"428\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"startIndex\"\n    },\n    \"429\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"count\"\n    },\n    \"430\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.lookupSN\"\n    },\n    \"431\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batch.lookupSN\"\n    },\n    \"432\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"433\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"434\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"batchId\"\n    },\n    \"435\": {\n      \"sourceFileName\": \"src/api/batch.ts\",\n      \"qualifiedName\": \"codeId\"\n    },\n    \"436\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant\"\n    },\n    \"437\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.get\"\n    },\n    \"438\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.get\"\n    },\n    \"439\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"440\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"441\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variantId\"\n    },\n    \"442\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.list\"\n    },\n    \"443\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.list\"\n    },\n    \"444\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"445\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"446\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.create\"\n    },\n    \"447\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.create\"\n    },\n    \"448\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"449\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"450\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"451\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.update\"\n    },\n    \"452\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.update\"\n    },\n    \"453\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"454\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"455\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variantId\"\n    },\n    \"456\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"data\"\n    },\n    \"457\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.remove\"\n    },\n    \"458\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.remove\"\n    },\n    \"459\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"460\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"461\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variantId\"\n    },\n    \"462\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.getPublic\"\n    },\n    \"463\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.getPublic\"\n    },\n    \"464\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"465\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"466\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variantId\"\n    },\n    \"467\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.getSN\"\n    },\n    \"468\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.getSN\"\n    },\n    \"469\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"470\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"471\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variantId\"\n    },\n    \"472\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"startIndex\"\n    },\n    \"473\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"count\"\n    },\n    \"474\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.lookupSN\"\n    },\n    \"475\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variant.lookupSN\"\n    },\n    \"476\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"collectionId\"\n    },\n    \"477\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"productId\"\n    },\n    \"478\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"variantId\"\n    },\n    \"479\": {\n      \"sourceFileName\": \"src/api/variant.ts\",\n      \"qualifiedName\": \"codeId\"\n    },\n    \"480\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse\"\n    },\n    \"481\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.id\"\n    },\n    \"482\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.title\"\n    },\n    \"483\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.description\"\n    },\n    \"484\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.headerImage\"\n    },\n    \"485\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"486\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.url\"\n    },\n    \"487\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.thumbnails\"\n    },\n    \"488\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"489\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.x100\"\n    },\n    \"490\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.x200\"\n    },\n    \"491\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.x512\"\n    },\n    \"492\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.logoImage\"\n    },\n    \"493\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"494\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.url\"\n    },\n    \"495\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.thumbnails\"\n    },\n    \"496\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"497\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.x100\"\n    },\n    \"498\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.x200\"\n    },\n    \"499\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.x512\"\n    },\n    \"500\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.loaderImage\"\n    },\n    \"501\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"502\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.overwriteName\"\n    },\n    \"503\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.name\"\n    },\n    \"504\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.type\"\n    },\n    \"505\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.url\"\n    },\n    \"506\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.languages\"\n    },\n    \"507\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"508\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.code\"\n    },\n    \"509\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.lang\"\n    },\n    \"510\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.supported\"\n    },\n    \"511\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.roles\"\n    },\n    \"512\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"513\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"__type.__index\"\n    },\n    \"515\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.groupTags\"\n    },\n    \"516\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.redirectUrl\"\n    },\n    \"517\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.shortId\"\n    },\n    \"518\": {\n      \"sourceFileName\": \"src/types/collection.ts\",\n      \"qualifiedName\": \"CollectionResponse.dark\"\n    },\n    \"519\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"ProductResponse\"\n    },\n    \"520\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"ProductResponse.id\"\n    },\n    \"521\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"ProductResponse.name\"\n    },\n    \"522\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"ProductResponse.collectionId\"\n    },\n    \"523\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"ProductResponse.description\"\n    },\n    \"524\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"ProductResponse.heroImage\"\n    },\n    \"525\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"526\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"__type.url\"\n    },\n    \"527\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"__type.thumbnails\"\n    },\n    \"528\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"529\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"__type.x100\"\n    },\n    \"530\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"__type.x200\"\n    },\n    \"531\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"__type.x512\"\n    },\n    \"532\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"ProductResponse.groupTags\"\n    },\n    \"533\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"534\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"__type.__index\"\n    },\n    \"536\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"ProductResponse.data\"\n    },\n    \"537\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"__type\"\n    },\n    \"538\": {\n      \"sourceFileName\": \"src/types/product.ts\",\n      \"qualifiedName\": \"__type.__index\"\n    },\n    \"540\": {\n      \"sourceFileName\": \"src/types/proof.ts\",\n      \"qualifiedName\": \"ProofResponse\"\n    },\n    \"541\": {\n      \"sourceFileName\": \"src/types/proof.ts\",\n      \"qualifiedName\": \"ProofResponse.collectionId\"\n    },\n    \"542\": {\n      \"sourceFileName\": \"src/types/proof.ts\",\n      \"qualifiedName\": \"ProofResponse.createdAt\"\n    },\n    \"543\": {\n      \"sourceFileName\": \"src/types/proof.ts\",\n      \"qualifiedName\": \"ProofResponse.id\"\n    },\n    \"544\": {\n      \"sourceFileName\": \"src/types/proof.ts\",\n      \"qualifiedName\": \"ProofResponse.productId\"\n    },\n    \"545\": {\n      \"sourceFileName\": \"src/types/proof.ts\",\n      \"qualifiedName\": \"ProofResponse.tokenId\"\n    },\n    \"546\": {\n      \"sourceFileName\": \"src/types/proof.ts\",\n      \"qualifiedName\": \"ProofResponse.userId\"\n    },\n    \"547\": {\n      \"sourceFileName\": \"src/types/proof.ts\",\n      \"qualifiedName\": \"ProofResponse.values\"\n    },\n    \"548\": {\n      \"sourceFileName\": \"src/types/appConfiguration.ts\",\n      \"qualifiedName\": \"AppConfigurationResponse\"\n    },\n    \"549\": {\n      \"sourceFileName\": \"src/types/appConfiguration.ts\",\n      \"qualifiedName\": \"AppConfigurationResponse.id\"\n    },\n    \"550\": {\n      \"sourceFileName\": \"src/types/appConfiguration.ts\",\n      \"qualifiedName\": \"AppConfigurationResponse.name\"\n    },\n    \"551\": {\n      \"sourceFileName\": \"src/types/appConfiguration.ts\",\n      \"qualifiedName\": \"AppConfigurationResponse.settings\"\n    },\n    \"552\": {\n      \"sourceFileName\": \"src/types/error.ts\",\n      \"qualifiedName\": \"ErrorResponse\"\n    },\n    \"553\": {\n      \"sourceFileName\": \"src/types/error.ts\",\n      \"qualifiedName\": \"ErrorResponse.code\"\n    },\n    \"554\": {\n      \"sourceFileName\": \"src/types/error.ts\",\n      \"qualifiedName\": \"ErrorResponse.message\"\n    },\n    \"555\": {\n      \"sourceFileName\": \"src/types/asset.ts\",\n      \"qualifiedName\": \"AssetResponse\"\n    },\n    \"556\": {\n      \"sourceFileName\": \"src/types/asset.ts\",\n      \"qualifiedName\": \"AssetResponse.id\"\n    },\n    \"557\": {\n      \"sourceFileName\": \"src/types/asset.ts\",\n      \"qualifiedName\": \"AssetResponse.name\"\n    },\n    \"558\": {\n      \"sourceFileName\": \"src/types/asset.ts\",\n      \"qualifiedName\": \"AssetResponse.url\"\n    }\n  }\n}\n```"
    },
    {
      "kind": "text",
      "text": "\n\n_Replace this with a full markdown generator for production use._"
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
      "sourceFileName": "src/http.ts",
      "qualifiedName": "sendCustomProxyMessage"
    },
    "14": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "sendCustomProxyMessage"
    },
    "15": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "T"
    },
    "16": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "request"
    },
    "17": {
      "sourceFileName": "src/http.ts",
      "qualifiedName": "params"
    },
    "18": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "LoginResponse"
    },
    "19": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type"
    },
    "20": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.id"
    },
    "21": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.name"
    },
    "22": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.email"
    },
    "23": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.bearerToken"
    },
    "24": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.account"
    },
    "25": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "VerifyTokenResponse"
    },
    "26": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type"
    },
    "27": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.valid"
    },
    "28": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.id"
    },
    "29": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.name"
    },
    "30": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.email"
    },
    "31": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.account"
    },
    "32": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "AccountInfoResponse"
    },
    "33": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type"
    },
    "34": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.accessType"
    },
    "35": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.analyticsCode"
    },
    "36": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.analyticsId"
    },
    "37": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.auth_time"
    },
    "38": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.baseCollectionId"
    },
    "39": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.clientType"
    },
    "40": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.email"
    },
    "41": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.email_verified"
    },
    "42": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.features"
    },
    "43": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type"
    },
    "44": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.actionLogger"
    },
    "45": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.adminCollections"
    },
    "46": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.adminApps"
    },
    "47": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.apiKeys"
    },
    "48": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.adminUsers"
    },
    "49": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.__index"
    },
    "51": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.iat"
    },
    "52": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.id"
    },
    "53": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.iss"
    },
    "54": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.location"
    },
    "55": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.name"
    },
    "56": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.picture"
    },
    "57": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.sites"
    },
    "58": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type"
    },
    "59": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.__index"
    },
    "61": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.sub"
    },
    "62": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.uid"
    },
    "63": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.user_id"
    },
    "64": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.whitelabel"
    },
    "65": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type"
    },
    "66": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "__type.__index"
    },
    "68": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse"
    },
    "69": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.id"
    },
    "70": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.createdAt"
    },
    "71": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.updatedAt"
    },
    "72": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.public"
    },
    "73": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.private"
    },
    "74": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationResponse.proof"
    },
    "75": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationCreateRequest"
    },
    "76": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationCreateRequest.public"
    },
    "77": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationCreateRequest.private"
    },
    "78": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationCreateRequest.proof"
    },
    "79": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationUpdateRequest"
    },
    "80": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationUpdateRequest.type"
    },
    "81": {
      "sourceFileName": "src/types/attestation.ts",
      "qualifiedName": "AttestationUpdateRequest.data"
    },
    "82": {
      "sourceFileName": "src/types/batch.ts",
      "qualifiedName": "BatchResponse"
    },
    "83": {
      "sourceFileName": "src/types/batch.ts",
      "qualifiedName": "BatchCreateRequest"
    },
    "84": {
      "sourceFileName": "src/types/batch.ts",
      "qualifiedName": "BatchUpdateRequest"
    },
    "85": {
      "sourceFileName": "src/types/variant.ts",
      "qualifiedName": "VariantResponse"
    },
    "86": {
      "sourceFileName": "src/types/variant.ts",
      "qualifiedName": "VariantCreateRequest"
    },
    "87": {
      "sourceFileName": "src/types/variant.ts",
      "qualifiedName": "VariantUpdateRequest"
    },
    "88": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "AppConfigOptions"
    },
    "89": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type"
    },
    "90": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.appId"
    },
    "91": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.collectionId"
    },
    "92": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.productId"
    },
    "93": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.variantId"
    },
    "94": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.batchId"
    },
    "95": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.itemId"
    },
    "96": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.user"
    },
    "97": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.userData"
    },
    "98": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.admin"
    },
    "99": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.config"
    },
    "100": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "__type.data"
    },
    "101": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection"
    },
    "102": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.get"
    },
    "103": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.get"
    },
    "104": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collectionId"
    },
    "105": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "admin"
    },
    "106": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.list"
    },
    "107": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.list"
    },
    "108": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "admin"
    },
    "109": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.create"
    },
    "110": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.create"
    },
    "111": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "data"
    },
    "112": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.update"
    },
    "113": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.update"
    },
    "114": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collectionId"
    },
    "115": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "data"
    },
    "116": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.remove"
    },
    "117": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.remove"
    },
    "118": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collectionId"
    },
    "119": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.getSN"
    },
    "120": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.getSN"
    },
    "121": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collectionId"
    },
    "122": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "startIndex"
    },
    "123": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "count"
    },
    "124": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.lookupSN"
    },
    "125": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.lookupSN"
    },
    "126": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collectionId"
    },
    "127": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "codeId"
    },
    "128": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.assignSN"
    },
    "129": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collection.assignSN"
    },
    "130": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "collectionId"
    },
    "131": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "codeId"
    },
    "132": {
      "sourceFileName": "src/api/collection.ts",
      "qualifiedName": "value"
    },
    "133": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product"
    },
    "134": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.get"
    },
    "135": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.get"
    },
    "136": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "collectionId"
    },
    "137": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "productId"
    },
    "138": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "admin"
    },
    "139": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.list"
    },
    "140": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.list"
    },
    "141": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "collectionId"
    },
    "142": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "admin"
    },
    "143": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.create"
    },
    "144": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.create"
    },
    "145": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "collectionId"
    },
    "146": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "data"
    },
    "147": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.update"
    },
    "148": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.update"
    },
    "149": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "collectionId"
    },
    "150": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "productId"
    },
    "151": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "data"
    },
    "152": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.remove"
    },
    "153": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.remove"
    },
    "154": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "collectionId"
    },
    "155": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "productId"
    },
    "156": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.getSN"
    },
    "157": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.getSN"
    },
    "158": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "collectionId"
    },
    "159": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "productId"
    },
    "160": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "startIndex"
    },
    "161": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "count"
    },
    "162": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.lookupSN"
    },
    "163": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "product.lookupSN"
    },
    "164": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "collectionId"
    },
    "165": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "productId"
    },
    "166": {
      "sourceFileName": "src/api/product.ts",
      "qualifiedName": "codeId"
    },
    "167": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof"
    },
    "168": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.get"
    },
    "169": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.get"
    },
    "170": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "collectionId"
    },
    "171": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "productId"
    },
    "172": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proofId"
    },
    "173": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "admin"
    },
    "174": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.list"
    },
    "175": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.list"
    },
    "176": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "collectionId"
    },
    "177": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.create"
    },
    "178": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.create"
    },
    "179": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "collectionId"
    },
    "180": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "productId"
    },
    "181": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "values"
    },
    "182": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.update"
    },
    "183": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.update"
    },
    "184": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "collectionId"
    },
    "185": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "productId"
    },
    "186": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proofId"
    },
    "187": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "values"
    },
    "188": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.getByUser"
    },
    "189": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.getByUser"
    },
    "190": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "collectionId"
    },
    "191": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "userId"
    },
    "192": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.getByProduct"
    },
    "193": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.getByProduct"
    },
    "194": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "collectionId"
    },
    "195": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "productId"
    },
    "196": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.findByProduct"
    },
    "197": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.findByProduct"
    },
    "198": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "collectionId"
    },
    "199": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "productId"
    },
    "200": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "query"
    },
    "201": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.getByBatch"
    },
    "202": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "proof.getByBatch"
    },
    "203": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "collectionId"
    },
    "204": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "productId"
    },
    "205": {
      "sourceFileName": "src/api/proof.ts",
      "qualifiedName": "batchId"
    },
    "206": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration"
    },
    "207": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getConfig"
    },
    "208": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getConfig"
    },
    "209": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "210": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.setConfig"
    },
    "211": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.setConfig"
    },
    "212": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "213": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.deleteConfig"
    },
    "214": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.deleteConfig"
    },
    "215": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "216": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getData"
    },
    "217": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getData"
    },
    "218": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "219": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getDataItem"
    },
    "220": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.getDataItem"
    },
    "221": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "222": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.setDataItem"
    },
    "223": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.setDataItem"
    },
    "224": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "225": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.deleteDataItem"
    },
    "226": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "appConfiguration.deleteDataItem"
    },
    "227": {
      "sourceFileName": "src/api/appConfiguration.ts",
      "qualifiedName": "opts"
    },
    "228": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appRecord"
    },
    "229": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appRecord.get"
    },
    "230": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appRecord.get"
    },
    "231": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "collectionId"
    },
    "232": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appId"
    },
    "233": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appRecord.create"
    },
    "234": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appRecord.create"
    },
    "235": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "collectionId"
    },
    "236": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appId"
    },
    "237": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "data"
    },
    "238": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appRecord.update"
    },
    "239": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appRecord.update"
    },
    "240": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "collectionId"
    },
    "241": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appId"
    },
    "242": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "data"
    },
    "243": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appRecord.remove"
    },
    "244": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appRecord.remove"
    },
    "245": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "collectionId"
    },
    "246": {
      "sourceFileName": "src/api/appRecord.ts",
      "qualifiedName": "appId"
    },
    "247": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset"
    },
    "248": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForCollection"
    },
    "249": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForCollection"
    },
    "250": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "251": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "assetId"
    },
    "252": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForCollection"
    },
    "253": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForCollection"
    },
    "254": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "255": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForProduct"
    },
    "256": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForProduct"
    },
    "257": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "258": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "productId"
    },
    "259": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "assetId"
    },
    "260": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForProduct"
    },
    "261": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForProduct"
    },
    "262": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "263": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "productId"
    },
    "264": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForProof"
    },
    "265": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.getForProof"
    },
    "266": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "267": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "productId"
    },
    "268": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "proofId"
    },
    "269": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "assetId"
    },
    "270": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForProof"
    },
    "271": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.listForProof"
    },
    "272": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "273": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "productId"
    },
    "274": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "proofId"
    },
    "275": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "appId"
    },
    "276": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.uploadAsset"
    },
    "277": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "asset.uploadAsset"
    },
    "278": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "collectionId"
    },
    "279": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "productId"
    },
    "280": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "proofId"
    },
    "281": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "file"
    },
    "282": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "extraData"
    },
    "283": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "onProgress"
    },
    "284": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "__type"
    },
    "285": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "__type"
    },
    "286": {
      "sourceFileName": "src/api/asset.ts",
      "qualifiedName": "percent"
    },
    "287": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation"
    },
    "288": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.list"
    },
    "289": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.list"
    },
    "290": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "collectionId"
    },
    "291": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "productId"
    },
    "292": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "proofId"
    },
    "293": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.get"
    },
    "294": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.get"
    },
    "295": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "collectionId"
    },
    "296": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "productId"
    },
    "297": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "proofId"
    },
    "298": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestationId"
    },
    "299": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.create"
    },
    "300": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.create"
    },
    "301": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "collectionId"
    },
    "302": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "productId"
    },
    "303": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "proofId"
    },
    "304": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "data"
    },
    "305": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.update"
    },
    "306": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.update"
    },
    "307": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "collectionId"
    },
    "308": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "productId"
    },
    "309": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "proofId"
    },
    "310": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestationId"
    },
    "311": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "data"
    },
    "312": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.remove"
    },
    "313": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestation.remove"
    },
    "314": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "collectionId"
    },
    "315": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "productId"
    },
    "316": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "proofId"
    },
    "317": {
      "sourceFileName": "src/api/attestation.ts",
      "qualifiedName": "attestationId"
    },
    "318": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth"
    },
    "319": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.login"
    },
    "320": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.login"
    },
    "321": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "email"
    },
    "322": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "password"
    },
    "323": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.logout"
    },
    "324": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.logout"
    },
    "325": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.verifyToken"
    },
    "326": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.verifyToken"
    },
    "327": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "token"
    },
    "328": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.requestAdminJWT"
    },
    "329": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.requestAdminJWT"
    },
    "330": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "collectionId"
    },
    "331": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.requestPublicJWT"
    },
    "332": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.requestPublicJWT"
    },
    "333": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "collectionId"
    },
    "334": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "productId"
    },
    "335": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "proofId"
    },
    "336": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.getAccount"
    },
    "337": {
      "sourceFileName": "src/api/auth.ts",
      "qualifiedName": "auth.getAccount"
    },
    "338": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "form"
    },
    "339": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "form.get"
    },
    "340": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "form.get"
    },
    "341": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "collectionId"
    },
    "342": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "formId"
    },
    "343": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "admin"
    },
    "344": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "form.list"
    },
    "345": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "form.list"
    },
    "346": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "collectionId"
    },
    "347": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "admin"
    },
    "348": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "form.create"
    },
    "349": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "form.create"
    },
    "350": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "collectionId"
    },
    "351": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "data"
    },
    "352": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "form.update"
    },
    "353": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "form.update"
    },
    "354": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "collectionId"
    },
    "355": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "formId"
    },
    "356": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "data"
    },
    "357": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "form.remove"
    },
    "358": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "form.remove"
    },
    "359": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "collectionId"
    },
    "360": {
      "sourceFileName": "src/api/form.ts",
      "qualifiedName": "formId"
    },
    "361": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet"
    },
    "362": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getAllForCollection"
    },
    "363": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getAllForCollection"
    },
    "364": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "365": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getForCollection"
    },
    "366": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getForCollection"
    },
    "367": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "368": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSetId"
    },
    "369": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getAllTags"
    },
    "370": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getAllTags"
    },
    "371": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "372": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSetId"
    },
    "373": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getReport"
    },
    "374": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getReport"
    },
    "375": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "376": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSetId"
    },
    "377": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getAssignedTags"
    },
    "378": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getAssignedTags"
    },
    "379": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "380": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSetId"
    },
    "381": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getTagSummary"
    },
    "382": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.getTagSummary"
    },
    "383": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "384": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.tagQuery"
    },
    "385": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.tagQuery"
    },
    "386": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "387": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "data"
    },
    "388": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.createForCollection"
    },
    "389": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.createForCollection"
    },
    "390": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "391": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "params"
    },
    "392": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.updateForCollection"
    },
    "393": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.updateForCollection"
    },
    "394": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "395": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "params"
    },
    "396": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.makeClaim"
    },
    "397": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.makeClaim"
    },
    "398": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "399": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "params"
    },
    "400": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.assignClaims"
    },
    "401": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.assignClaims"
    },
    "402": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "403": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "data"
    },
    "404": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.updateClaimData"
    },
    "405": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "claimSet.updateClaimData"
    },
    "406": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "collectionId"
    },
    "407": {
      "sourceFileName": "src/api/claimSet.ts",
      "qualifiedName": "data"
    },
    "408": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crate"
    },
    "409": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crate.get"
    },
    "410": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crate.get"
    },
    "411": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "collectionId"
    },
    "412": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crateId"
    },
    "413": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crate.list"
    },
    "414": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crate.list"
    },
    "415": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "collectionId"
    },
    "416": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crate.create"
    },
    "417": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crate.create"
    },
    "418": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "collectionId"
    },
    "419": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "data"
    },
    "420": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crate.update"
    },
    "421": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crate.update"
    },
    "422": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "collectionId"
    },
    "423": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crateId"
    },
    "424": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "data"
    },
    "425": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crate.remove"
    },
    "426": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crate.remove"
    },
    "427": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "collectionId"
    },
    "428": {
      "sourceFileName": "src/api/crate.ts",
      "qualifiedName": "crateId"
    },
    "429": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch"
    },
    "430": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.get"
    },
    "431": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.get"
    },
    "432": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "collectionId"
    },
    "433": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "productId"
    },
    "434": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batchId"
    },
    "435": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.list"
    },
    "436": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.list"
    },
    "437": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "collectionId"
    },
    "438": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "productId"
    },
    "439": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.create"
    },
    "440": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.create"
    },
    "441": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "collectionId"
    },
    "442": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "productId"
    },
    "443": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "data"
    },
    "444": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.update"
    },
    "445": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.update"
    },
    "446": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "collectionId"
    },
    "447": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "productId"
    },
    "448": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batchId"
    },
    "449": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "data"
    },
    "450": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.remove"
    },
    "451": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.remove"
    },
    "452": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "collectionId"
    },
    "453": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "productId"
    },
    "454": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batchId"
    },
    "455": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.getPublic"
    },
    "456": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.getPublic"
    },
    "457": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "collectionId"
    },
    "458": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "productId"
    },
    "459": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batchId"
    },
    "460": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.getSN"
    },
    "461": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.getSN"
    },
    "462": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "collectionId"
    },
    "463": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "productId"
    },
    "464": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batchId"
    },
    "465": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "startIndex"
    },
    "466": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "count"
    },
    "467": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.lookupSN"
    },
    "468": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batch.lookupSN"
    },
    "469": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "collectionId"
    },
    "470": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "productId"
    },
    "471": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "batchId"
    },
    "472": {
      "sourceFileName": "src/api/batch.ts",
      "qualifiedName": "codeId"
    },
    "473": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant"
    },
    "474": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.get"
    },
    "475": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.get"
    },
    "476": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "collectionId"
    },
    "477": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "productId"
    },
    "478": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variantId"
    },
    "479": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.list"
    },
    "480": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.list"
    },
    "481": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "collectionId"
    },
    "482": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "productId"
    },
    "483": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.create"
    },
    "484": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.create"
    },
    "485": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "collectionId"
    },
    "486": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "productId"
    },
    "487": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "data"
    },
    "488": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.update"
    },
    "489": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.update"
    },
    "490": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "collectionId"
    },
    "491": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "productId"
    },
    "492": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variantId"
    },
    "493": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "data"
    },
    "494": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.remove"
    },
    "495": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.remove"
    },
    "496": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "collectionId"
    },
    "497": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "productId"
    },
    "498": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variantId"
    },
    "499": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.getPublic"
    },
    "500": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.getPublic"
    },
    "501": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "collectionId"
    },
    "502": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "productId"
    },
    "503": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variantId"
    },
    "504": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.getSN"
    },
    "505": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.getSN"
    },
    "506": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "collectionId"
    },
    "507": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "productId"
    },
    "508": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variantId"
    },
    "509": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "startIndex"
    },
    "510": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "count"
    },
    "511": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.lookupSN"
    },
    "512": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variant.lookupSN"
    },
    "513": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "collectionId"
    },
    "514": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "productId"
    },
    "515": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "variantId"
    },
    "516": {
      "sourceFileName": "src/api/variant.ts",
      "qualifiedName": "codeId"
    },
    "517": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse"
    },
    "518": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.id"
    },
    "519": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.title"
    },
    "520": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.description"
    },
    "521": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.headerImage"
    },
    "522": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type"
    },
    "523": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.url"
    },
    "524": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.thumbnails"
    },
    "525": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type"
    },
    "526": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.x100"
    },
    "527": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.x200"
    },
    "528": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.x512"
    },
    "529": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.logoImage"
    },
    "530": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type"
    },
    "531": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.url"
    },
    "532": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.thumbnails"
    },
    "533": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type"
    },
    "534": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.x100"
    },
    "535": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.x200"
    },
    "536": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.x512"
    },
    "537": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.loaderImage"
    },
    "538": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type"
    },
    "539": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.overwriteName"
    },
    "540": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.name"
    },
    "541": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.type"
    },
    "542": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.url"
    },
    "543": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.languages"
    },
    "544": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type"
    },
    "545": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.code"
    },
    "546": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.lang"
    },
    "547": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.supported"
    },
    "548": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.roles"
    },
    "549": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type"
    },
    "550": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "__type.__index"
    },
    "552": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.groupTags"
    },
    "553": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.redirectUrl"
    },
    "554": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.shortId"
    },
    "555": {
      "sourceFileName": "src/types/collection.ts",
      "qualifiedName": "CollectionResponse.dark"
    },
    "556": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse"
    },
    "557": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse.id"
    },
    "558": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse.name"
    },
    "559": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse.collectionId"
    },
    "560": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse.description"
    },
    "561": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse.heroImage"
    },
    "562": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "__type"
    },
    "563": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "__type.url"
    },
    "564": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "__type.thumbnails"
    },
    "565": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "__type"
    },
    "566": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "__type.x100"
    },
    "567": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "__type.x200"
    },
    "568": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "__type.x512"
    },
    "569": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse.groupTags"
    },
    "570": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "__type"
    },
    "571": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "__type.__index"
    },
    "573": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "ProductResponse.data"
    },
    "574": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "__type"
    },
    "575": {
      "sourceFileName": "src/types/product.ts",
      "qualifiedName": "__type.__index"
    },
    "577": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse"
    },
    "578": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.collectionId"
    },
    "579": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.createdAt"
    },
    "580": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.id"
    },
    "581": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.productId"
    },
    "582": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.tokenId"
    },
    "583": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.userId"
    },
    "584": {
      "sourceFileName": "src/types/proof.ts",
      "qualifiedName": "ProofResponse.values"
    },
    "585": {
      "sourceFileName": "src/types/appConfiguration.ts",
      "qualifiedName": "AppConfigurationResponse"
    },
    "586": {
      "sourceFileName": "src/types/appConfiguration.ts",
      "qualifiedName": "AppConfigurationResponse.id"
    },
    "587": {
      "sourceFileName": "src/types/appConfiguration.ts",
      "qualifiedName": "AppConfigurationResponse.name"
    },
    "588": {
      "sourceFileName": "src/types/appConfiguration.ts",
      "qualifiedName": "AppConfigurationResponse.settings"
    },
    "589": {
      "sourceFileName": "src/types/error.ts",
      "qualifiedName": "ErrorResponse"
    },
    "590": {
      "sourceFileName": "src/types/error.ts",
      "qualifiedName": "ErrorResponse.code"
    },
    "591": {
      "sourceFileName": "src/types/error.ts",
      "qualifiedName": "ErrorResponse.message"
    },
    "592": {
      "sourceFileName": "src/types/asset.ts",
      "qualifiedName": "AssetResponse"
    },
    "593": {
      "sourceFileName": "src/types/asset.ts",
      "qualifiedName": "AssetResponse.id"
    },
    "594": {
      "sourceFileName": "src/types/asset.ts",
      "qualifiedName": "AssetResponse.name"
    },
    "595": {
      "sourceFileName": "src/types/asset.ts",
      "qualifiedName": "AssetResponse.url"
    }
  }
}
```

_Replace this with a full markdown generator for production use._