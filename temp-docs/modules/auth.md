## Table of contents

### Functions

- [getAccount](auth.md#getaccount)
- [login](auth.md#login)
- [logout](auth.md#logout)
- [verifyToken](auth.md#verifytoken)

## Functions

### getAccount

▸ **getAccount**(): `Promise`\<[`AccountInfoResponse`](../modules.md#accountinforesponse)\>

Gets current account information for the logged in user.
Returns user, owner, account, and location objects.

#### Returns

`Promise`\<[`AccountInfoResponse`](../modules.md#accountinforesponse)\>

#### Defined in

[api/auth.ts:65](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L65)

___

### login

▸ **login**(`email`, `password`): `Promise`\<[`LoginResponse`](../modules.md#loginresponse)\>

Login with email and password.
Sets the bearerToken for subsequent API calls.

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |
| `password` | `string` |

#### Returns

`Promise`\<[`LoginResponse`](../modules.md#loginresponse)\>

#### Defined in

[api/auth.ts:31](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L31)

___

### logout

▸ **logout**(): `void`

Logout (clears bearerToken for future API calls).

#### Returns

`void`

#### Defined in

[api/auth.ts:40](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L40)

___

### verifyToken

▸ **verifyToken**(`token?`): `Promise`\<[`VerifyTokenResponse`](../modules.md#verifytokenresponse)\>

Verifies the current bearerToken (or a provided token).
Returns user/account info if valid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `token?` | `string` |

#### Returns

`Promise`\<[`VerifyTokenResponse`](../modules.md#verifytokenresponse)\>

#### Defined in

[api/auth.ts:48](https://github.com/Prove-Anything/smartlinks/blob/54a929dabe2ef3c5f4a5a559c656ea584231138a/src/api/auth.ts#L48)
