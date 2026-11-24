import type { SecretMeta, SetSecretInput, SetSecretResult, ListSecretsQuery } from "../types/integrations.js";
import type { ListResult } from "../types/list.js";
export interface AppSecretOptions {
    /** The app whose secret this is. Defaults to the SDK's app context (`initializeApi({ appId })`). */
    appId?: string;
}
export declare namespace secrets {
    /**
     * Save this app's secret `name` on the collection (create or replace) — what the app's server
     * functions read with `ctx.secrets.get(name)` (declare `secrets:<name>` in the manifest). Call it
     * from your admin screen as a collection admin. Write-only: returns `{ ref: name, hint }`, never
     * the value. PUT /app/:appId/secrets/:name
     */
    function put(collectionId: string, name: string, value: string, opts?: AppSecretOptions): Promise<SetSecretResult>;
    /**
     * This app's secrets on the collection: names + masked hints (never values). Returns
     * `{ items, nextCursor }`: the secrets are in `items`, each `ref` being the name you saved it under. The
     * list is not paged, so `nextCursor` is always `null`. GET /app/:appId/secrets
     *
     * @example
     * ```typescript
     * const { items } = await secrets.listOwn('coll_123')
     * // items: [{ ref: 'shop-api-key', hint: '••••1234', ... }]
     * ```
     */
    function listOwn(collectionId: string, opts?: AppSecretOptions): Promise<ListResult<SecretMeta>>;
    /** Delete this app's secret `name`. DELETE /app/:appId/secrets/:name */
    function removeOwn(collectionId: string, name: string, opts?: AppSecretOptions): Promise<{
        deleted: boolean;
    }>;
    /**
     * List secrets as refs + masked hints + metadata (never values). Returns `{ items, nextCursor }`: the
     * secrets are in `items`, newest first. The list is not paged, so `nextCursor` is always `null`.
     * `purpose` narrows it to one purpose. GET /secrets
     *
     * @example
     * ```typescript
     * const { items } = await secrets.list('coll_123', { purpose: 'integration' })
     * ```
     */
    function list(collectionId: string, query?: ListSecretsQuery): Promise<ListResult<SecretMeta>>;
    /**
     * Create a collection secret with a GENERATED ref. POST /secrets → { ref, hint }. Store the ref on a
     * flow. For a secret your app's server functions read by name, use `put` instead.
     */
    function set(collectionId: string, input: SetSecretInput): Promise<SetSecretResult>;
    /** Metadata for one secret (never the value). GET /secrets/:ref */
    function get(collectionId: string, ref: string): Promise<SecretMeta>;
    /** Rotate/update a secret's value (and optionally name/purpose). PUT /secrets/:ref → { ref, hint } */
    function rotate(collectionId: string, ref: string, input: SetSecretInput): Promise<SetSecretResult>;
    /** Soft-delete a secret. DELETE /secrets/:ref */
    function remove(collectionId: string, ref: string): Promise<{
        deleted: boolean;
    }>;
}
