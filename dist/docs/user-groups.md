# User groups

A **user group** is a named list of people in a collection: "QC Controllers", "Warehouse", "Approved
partners". Use them to say who may do what, for staff who aren't collection admins and for third
parties alike.

> There is no separate "roles" object. A role is a user group: "Sam has the QC role" and "Sam is in
> the QC Controllers user group" are the same fact.

## The three things you do with them

| You want to… | Use |
|---|---|
| **Protect** an action, so only some people can do it | `userGroups` on the server function's declaration |
| **Decide** something finer inside a function | `ctx.caller.userGroups` |
| **Show or hide** a button or a screen | `userGroups.mine(collectionId)`, or a `group` condition |

Only the first two protect anything. Hiding a button doesn't stop someone calling the function behind
it, so limit the function as well.

## A user group

```ts
{
  id: 'k3Jd…',                 // random, never changes
  key: 'qc-controller',        // the name code uses; set once, kept through a rename
  name: 'QC Controllers',      // what people see; free to change
  description: 'Sign off finished batches',
  members: ['uid_1', 'uid_2']  // user ids
}
```

- **Refer to user groups by `key`** in code and manifests, never by name or id.
- A key is lowercase letters, digits and hyphens. It's made from the name when you don't give one
  ("QC Controllers" → `qc-controllers`), and it's unique in the collection.
- Members are people who sign in: on the site's own login, or with a SmartLinks account.
- Collection admins pass every user group check. They don't need adding.

## Limit a server function

In the manifest (see [server-functions.md](server-functions.md)):

```jsonc
{
  "name": "releaseBatch",
  "trigger":    { "type": "http", "methods": ["POST"] },
  "visibility": "public",
  "authority":  "collection",
  "elevated":   true,
  "userGroups": ["qc-controller", "manager"],   // in at least ONE of these
  "capabilities": ["sl:records:write"]
}
```

The platform checks this before any of your code runs:

| Caller | Result |
|---|---|
| In one of the user groups, or a collection admin | The function runs |
| Signed in, in none of them | `403 { error: 'NOT_IN_USER_GROUP' }` |
| Not signed in | `401 { error: 'SIGN_IN_REQUIRED' }` |

- `http` functions only: `event` and `cron` functions have no caller.
- `userGroups` doesn't replace `elevated: true` on a `public` + `collection` function. Declare both.

## Decide inside a function

Every function sees the caller's keys:

```ts
export async function adjustQuantity(ctx, event) {
  const isManager = ctx.caller.userGroups.includes('manager')
  if (event.body.delta > 100 && !isManager) {
    return new Response(JSON.stringify({ error: 'Over 100 needs a manager' }), { status: 403 })
  }
  // …
}
```

`ctx.caller.userGroups` is `[]` when nobody is signed in, and for `event` / `cron` runs.

## Show or hide in a screen

```ts
import { userGroups } from '@proveanything/smartlinks'

const { userGroups: mine } = await userGroups.mine(collectionId)
const showReleaseButton = mine.includes('qc-controller')
```

- `mine()` returns `{ userGroups: string[], userGroupIds: string[] }`: keys for code, and ids for
  older saved conditions. Both are empty when nobody is signed in.
- It is never cached, so a change an admin makes shows on the next call.
- A person can only ask about themselves.

With conditions (see [utils.md](utils.md)):

```ts
const { userGroups: keys, userGroupIds } = await userGroups.mine(collectionId)

await utils.validateCondition({
  condition: { type: 'and', conditions: [{ type: 'user', userType: 'group', groupIds: ['qc-controller'] }] },
  user: { valid: true, uid, groups: [...keys, ...userGroupIds] },
})
```

## Manage them (admin)

```ts
const qc = await userGroups.create(collectionId, { name: 'QC Controllers' })   // key: 'qc-controllers'

await userGroups.addMember(collectionId, qc.id, { email: 'sam@example.com', name: 'Sam' })
await userGroups.addMember(collectionId, qc.id, { userId: 'uid_2' })
await userGroups.removeMember(collectionId, qc.id, 'uid_2')

await userGroups.members(collectionId, qc.id)   // [{ uid, name, email }]
await userGroups.ofUser(collectionId, 'uid_1')  // [{ id, key, name }]
await userGroups.list(collectionId)
await userGroups.update(collectionId, qc.id, { name: 'Quality control' })   // key stays 'qc-controllers'
await userGroups.remove(collectionId, qc.id)
```

- **Add and remove one person at a time** with `addMember` / `removeMember`. Saving a whole `members`
  list through `update` can overwrite a change someone else made at the same moment.
- Adding by email finds the person in the collection's logins, or adds them. No welcome email is sent.
- A change takes up to a minute to reach function checks.

Errors: `KEY_INVALID`, `KEY_TAKEN` (409), `KEY_FIXED` (409, a key can't be changed once set),
`MISSING_FIELDS`, `NOT_FOUND`.

## Who changed what

Every change is recorded: a user group created, renamed or deleted, and each person added or removed,
with the admin who did it and when.

```ts
await userGroups.history(collectionId, { userGroupId: qc.id })   // one user group
await userGroups.history(collectionId, { userId: 'uid_1' })      // everything about one person
// [{ at, type: 'usergroup.member-added', actorId: 'uid_admin', data: { key: 'qc-controllers', userId: 'uid_1', … } }]
```

It covers the last 30 days unless you pass `from` / `to` (up to 400 days), and takes about a second.
Entries hold ids only, never names or emails.

## In a site

It works the same way. A site's functions run in the site's own worker, and the site's function
runtime applies `userGroups` from `public/app.manifest.json` before your handler runs, with the same
`401` / `403` answers. `ctx.caller.userId` and `ctx.caller.userGroups` are filled in for a signed-in
visitor.

A site made before this existed has no `src/site/lib/fn-access.ts`. There, `userGroups` in the
manifest is ignored until the site is updated.

## Testing

```ts
import { createFunctionTestContext } from '@proveanything/smartlinks/testing'

const ctx = createFunctionTestContext({
  def: { trigger: { type: 'http' }, capabilities: ['sl:records:write'] },
  caller: { userId: 'sam', userGroups: ['qc-controller'] },
})
ctx.caller.userGroups   // ['qc-controller']
```

The test context gives your handler the caller you describe. It doesn't apply the declaration's
`userGroups` limit: that check happens on the platform before your handler is called.
