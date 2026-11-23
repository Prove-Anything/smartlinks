# Service accounts

A **service account** is how another system works with a collection: an ERP sending stock levels, a
warehouse system recording shipments, an agency's integration. It's an identity of its own, with its own key
and access level. It is **not** a person's API key.

- It's a member of **one** collection with an access level (`User`, `Reporter`, `Assigner` or `Admin`), just
  like a person on the team. Everything a person with that access can do on that collection, it can do.
  It can reach nothing else.
- It belongs to the collection, not to whoever made it, so it keeps working when people leave the team.
- Its key (`slsvc_<id>.<secret>`) is shown **once**, when it's made or given a new key. Only a hash is kept.
- It **can't** invite people or change anyone's access. It can't make API keys or other service accounts,
  make collections, or hand the collection over. A leaked key can't leave a way back in once it's deleted.

Collection admins manage them in **Studio → Team → Service accounts**, or with `serviceAccounts.*`:

```ts
import { serviceAccounts } from "@proveanything/smartlinks"

// Make one: show the key once, then it's gone.
const { serviceAccount, key } = await serviceAccounts.create(collectionId, { name: "Warehouse system", access: "Assigner" })

await serviceAccounts.list(collectionId)              // { serviceAccounts: [...], access: ["User", "Reporter", "Assigner", "Admin"] }
await serviceAccounts.update(collectionId, serviceAccount.id, { access: "Reporter" })
const { key: replacement } = await serviceAccounts.newKey(collectionId, serviceAccount.id)  // the old key stops within a minute
await serviceAccounts.remove(collectionId, serviceAccount.id)                               // key stops, access removed
```

You can't give a service account more access than you have yourself, and never `Owner`.

## Using the key

The other system sends the key as its bearer token:

```ts
import { initializeApi } from "@proveanything/smartlinks"
initializeApi({ baseURL: "https://smartlinks.app/api/v1", bearerToken: process.env.SMARTLINKS_KEY })
```

or, without the SDK, `Authorization: Bearer slsvc_…` on each request. Keep it in a secret store. To retire
a key, give the account a new one; delete the account when the system no longer needs it.

A list shows `lastUsedAt` (to within a few minutes) so you can see which accounts are still in use.
