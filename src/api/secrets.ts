// src/api/secrets.ts
//
// Sealed-secret store — the credentials that back integration flows and other
// server-side handlers. WRITE-ONLY from the client: you can set, rotate, list
// (refs + masked hints + metadata) and delete, but a value NEVER comes back over the
// API. It is sealed at rest and resolved server-side only, at execution time.
//
// Two kinds:
//   - an APP's own secret (`put` / `listOwn` / `removeOwn`): saved by name from the app's admin
//     screen, read by that app's server functions with ctx.secrets.get('<name>'). Another app's
//     secret of the same name is a different secret.
//   - a collection secret (`set` / `rotate` / ...): `set` returns a generated `ref` to put on an
//     integration flow's config.connection.auth.credentialRef.
//
// Endpoints: /admin/collection/:collectionId/app/:appId/secrets, /admin/collection/:collectionId/secrets

import { request, post, put as put_, del, getAppContext } from "../http"
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

export interface AppSecretOptions {
  /** The app whose secret this is. Defaults to the SDK's app context (`initializeApi({ appId })`). */
  appId?: string
}

export namespace secrets {
  const base = (collectionId: string) => `/admin/collection/${enc(collectionId)}/secrets`
  const appBase = (collectionId: string, opts: AppSecretOptions) => {
    const app = opts.appId ?? getAppContext()
    if (!app) throw new Error("secrets: no app — pass { appId } or initializeApi({ appId })")
    return `/admin/collection/${enc(collectionId)}/app/${enc(app)}/secrets`
  }

  /**
   * Save this app's secret `name` on the collection (create or replace) — what the app's server
   * functions read with `ctx.secrets.get(name)` (declare `secrets:<name>` in the manifest). Call it
   * from your admin screen as a collection admin. Write-only: returns `{ ref: name, hint }`, never
   * the value. PUT /app/:appId/secrets/:name
   */
  export async function put(collectionId: string, name: string, value: string, opts: AppSecretOptions = {}): Promise<SetSecretResult> {
    return put_<SetSecretResult>(`${appBase(collectionId, opts)}/${enc(name)}`, { value })
  }

  /** This app's secrets on the collection: names + masked hints (never values). GET /app/:appId/secrets */
  export async function listOwn(collectionId: string, opts: AppSecretOptions = {}): Promise<SecretList> {
    return request<SecretList>(appBase(collectionId, opts))
  }

  /** Delete this app's secret `name`. DELETE /app/:appId/secrets/:name */
  export async function removeOwn(collectionId: string, name: string, opts: AppSecretOptions = {}): Promise<{ deleted: boolean }> {
    return del<{ deleted: boolean }>(`${appBase(collectionId, opts)}/${enc(name)}`)
  }

  /** List secrets as refs + masked hints + metadata (never values). GET /secrets */
  export async function list(collectionId: string, query: ListSecretsQuery = {}): Promise<SecretList> {
    return request<SecretList>(`${base(collectionId)}${encodeQuery(query as any)}`)
  }

  /**
   * Create a collection secret with a GENERATED ref. POST /secrets → { ref, hint }. Store the ref on a
   * flow. For a secret your app's server functions read by name, use `put` instead.
   */
  export async function set(collectionId: string, input: SetSecretInput): Promise<SetSecretResult> {
    return post<SetSecretResult>(base(collectionId), input)
  }

  /** Metadata for one secret (never the value). GET /secrets/:ref */
  export async function get(collectionId: string, ref: string): Promise<SecretMeta> {
    return request<SecretMeta>(`${base(collectionId)}/${enc(ref)}`)
  }

  /** Rotate/update a secret's value (and optionally name/purpose). PUT /secrets/:ref → { ref, hint } */
  export async function rotate(collectionId: string, ref: string, input: SetSecretInput): Promise<SetSecretResult> {
    return put_<SetSecretResult>(`${base(collectionId)}/${enc(ref)}`, input)
  }

  /** Soft-delete a secret. DELETE /secrets/:ref */
  export async function remove(collectionId: string, ref: string): Promise<{ deleted: boolean }> {
    return del<{ deleted: boolean }>(`${base(collectionId)}/${enc(ref)}`)
  }
}
