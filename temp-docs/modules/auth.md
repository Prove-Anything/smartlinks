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

[api/auth.ts:100](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/auth.ts#L100)

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

[api/auth.ts:66](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/auth.ts#L66)

___

### logout

▸ **logout**(): `void`

Logout (clears bearerToken for future API calls).

#### Returns

`void`

#### Defined in

[api/auth.ts:75](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/auth.ts#L75)

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

[api/auth.ts:83](https://github.com/Prove-Anything/smartlinks/blob/2322afa091763cbb81ba4db4b90e49b576099120/src/api/auth.ts#L83)
