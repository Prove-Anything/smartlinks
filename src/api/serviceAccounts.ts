// src/api/serviceAccounts.ts
//
// A collection's service accounts: identities for the systems that work with it (an ERP, a warehouse
// system, an agency's integration), each with its own key and access level. A service account is a member of
// ONE collection, like a person on the team, and belongs to the collection — not to whoever made it — so it
// keeps working when people leave. Use its key as the bearer (`initializeApi({ bearerToken: key })` or an
// `Authorization: Bearer <key>` header); it can do what a person with the same access can on that collection
// only. It can't invite people, change anyone's access, make keys or other service accounts, make
// collections or hand the collection over.
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
} from "../types/serviceAccounts"

function enc(v: string) { return encodeURIComponent(v) }

export namespace serviceAccounts {
  const base = (collectionId: string) => `/admin/collection/${enc(collectionId)}/service-accounts`

  /** The collection's service accounts (never their keys) and the access levels that can be given. GET /service-accounts */
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

  /** Rename it and/or change its access. PUT /service-accounts/:id */
  export async function update(collectionId: string, id: string, input: UpdateServiceAccountInput): Promise<ServiceAccount> {
    const out = await put<{ serviceAccount: ServiceAccount }>(`${base(collectionId)}/${enc(id)}`, input)
    return out.serviceAccount
  }

  /** Give it a new key → `{ key }` (shown once); the old key stops working within a minute. POST /service-accounts/:id/key */
  export async function newKey(collectionId: string, id: string): Promise<ServiceAccountKeyResult> {
    return post<ServiceAccountKeyResult>(`${base(collectionId)}/${enc(id)}/key`, {})
  }

  /** Delete it: its key stops working and its access is removed. DELETE /service-accounts/:id */
  export async function remove(collectionId: string, id: string): Promise<{ ok: true }> {
    return del<{ ok: true }>(`${base(collectionId)}/${enc(id)}`)
  }
}
