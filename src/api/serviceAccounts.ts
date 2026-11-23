// src/api/serviceAccounts.ts
//
// A collection's service accounts: identities for the systems that work with it (an ERP, a warehouse
// system, an agency's integration), each with its own key and access level. A service account is a member of
// its HOME collection, like a person on the team, and optionally of other collections too ("also works on"),
// each with its own access. It belongs to its home collection — not to whoever made it — so it keeps working
// when people leave. (A personal API key is different: it IS its person, with everything they can do.) Use its key as the bearer (`initializeApi({ bearerToken: key })` or an
// `Authorization: Bearer <key>` header); it can do what a person with the same access can on that collection
// it works on only. It can't invite people, change anyone's access, make keys or other service accounts, make
// collections or hand a collection over.
//
// Only the home collection renames it, gives it a new key, deletes it (everywhere) or adds it to another
// collection — and adding needs you to be an admin of that collection too. A collection it also works on can
// change its access there or remove it from there.
//
// Managed by the collection's admins (Studio → Team → Service accounts). The key is shown ONCE, when the
// account is made or given a new key; only its hash is kept.
//
// Endpoints: /admin/collection/:collectionId/service-accounts

import { request, post, put, del } from "../http"
import type {
  ServiceAccount,
  ServiceAccountList,
  CreateServiceAccountInput,
  CreateServiceAccountResult,
  UpdateServiceAccountInput,
  ServiceAccountKeyResult,
  AddServiceAccountToCollectionInput,
} from "../types/serviceAccounts"

function enc(v: string) { return encodeURIComponent(v) }

export namespace serviceAccounts {
  const base = (collectionId: string) => `/admin/collection/${enc(collectionId)}/service-accounts`

  /**
   * The service accounts that work on this collection — its own (`home: true`, with `alsoOn`) and other
   * collections' (`home: false`, with `homeCollection`) — never their keys, and the access levels that can be
   * given. GET /service-accounts
   */
  export async function list(collectionId: string): Promise<ServiceAccountList> {
    return request<ServiceAccountList>(base(collectionId))
  }

  /**
   * Make a service account → `{ serviceAccount, key }`. Show the key once — it can't be read again. You can't
   * give it more access than you have. POST /service-accounts
   */
  export async function create(collectionId: string, input: CreateServiceAccountInput): Promise<CreateServiceAccountResult> {
    return post<CreateServiceAccountResult>(base(collectionId), input)
  }

  /** Rename it (home collection only) and/or change its access on this collection. PUT /service-accounts/:id */
  export async function update(collectionId: string, id: string, input: UpdateServiceAccountInput): Promise<ServiceAccount> {
    const out = await put<{ serviceAccount: ServiceAccount }>(`${base(collectionId)}/${enc(id)}`, input)
    return out.serviceAccount
  }

  /** Give it a new key → `{ key }` (shown once; home collection only); the old key stops working within a minute. POST /service-accounts/:id/key */
  export async function newKey(collectionId: string, id: string): Promise<ServiceAccountKeyResult> {
    return post<ServiceAccountKeyResult>(`${base(collectionId)}/${enc(id)}/key`, {})
  }

  /**
   * Let it work on another collection too, or change its access there. Call on its home collection; you must
   * be an admin of `input.collectionId` as well, and can't give more access than you have there.
   * POST /service-accounts/:id/collections
   */
  export async function addTo(collectionId: string, id: string, input: AddServiceAccountToCollectionInput): Promise<ServiceAccount> {
    const out = await post<{ serviceAccount: ServiceAccount }>(`${base(collectionId)}/${enc(id)}/collections`, input)
    return out.serviceAccount
  }

  /** Stop it working on `otherCollectionId` (call on its home collection). DELETE /service-accounts/:id/collections/:otherId */
  export async function removeFrom(collectionId: string, id: string, otherCollectionId: string): Promise<{ ok: true }> {
    return del<{ ok: true }>(`${base(collectionId)}/${enc(id)}/collections/${enc(otherCollectionId)}`)
  }

  /**
   * On its home collection: delete it — its key stops working and its access is removed everywhere. On another
   * collection it works on: remove it from that collection only. DELETE /service-accounts/:id
   */
  export async function remove(collectionId: string, id: string): Promise<{ ok: true }> {
    return del<{ ok: true }>(`${base(collectionId)}/${enc(id)}`)
  }
}
