// src/api/secrets.ts
//
// Sealed-secret store — the credentials that back integration flows and other
// server-side handlers. WRITE-ONLY from the client: you can set, rotate, list
// (refs + masked hints + metadata) and delete, but a value NEVER comes back over the
// API. It is sealed at rest and resolved server-side only, at execution time.
//
// Typical use: `set` a credential, take the returned `ref`, and put it on a flow's
// config.connection.auth.credentialRef.
//
// Endpoints: /admin/collection/:collectionId/secrets

import { request, post, put, del } from "../http"
import type {
  SecretMeta,
  SecretList,
  SetSecretInput,
  SetSecretResult,
  ListSecretsQuery,
} from "../types/integrations"

function enc(v: string) { return encodeURIComponent(v) }
function encodeQuery(params: Record<string, any> = {}): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export namespace secrets {
  const base = (collectionId: string) => `/admin/collection/${enc(collectionId)}/secrets`

  /** List secrets as refs + masked hints + metadata (never values). GET /secrets */
  export async function list(collectionId: string, query: ListSecretsQuery = {}): Promise<SecretList> {
    return request<SecretList>(`${base(collectionId)}${encodeQuery(query as any)}`)
  }

  /** Create a secret. POST /secrets → { ref, hint }. Store the ref on a flow. */
  export async function set(collectionId: string, input: SetSecretInput): Promise<SetSecretResult> {
    return post<SetSecretResult>(base(collectionId), input)
  }

  /** Metadata for one secret (never the value). GET /secrets/:ref */
  export async function get(collectionId: string, ref: string): Promise<SecretMeta> {
    return request<SecretMeta>(`${base(collectionId)}/${enc(ref)}`)
  }

  /** Rotate/update a secret's value (and optionally name/purpose). PUT /secrets/:ref → { ref, hint } */
  export async function rotate(collectionId: string, ref: string, input: SetSecretInput): Promise<SetSecretResult> {
    return put<SetSecretResult>(`${base(collectionId)}/${enc(ref)}`, input)
  }

  /** Soft-delete a secret. DELETE /secrets/:ref */
  export async function remove(collectionId: string, ref: string): Promise<{ deleted: boolean }> {
    return del<{ deleted: boolean }>(`${base(collectionId)}/${enc(ref)}`)
  }
}
