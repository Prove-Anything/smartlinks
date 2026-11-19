import type { AblyTokenRequest, RealtimeTokenRequest, RealtimeChangeEvent, RealtimeChangeFilter, RealtimeMessage, RealtimeScope } from "../types/realtime.js";
/**
 * One of your app's declared channels (manifest `realtime.channels`).
 *
 * ```ts
 * const draw = realtime.channel({ collectionId, appId }, "draw")
 * const off = draw.subscribe("status", (m) => setStatus(m.data))
 * await draw.publish("status", { phase: "spinning" }) // if the channel lets this viewer publish
 * ```
 */
export declare function channel(scope: RealtimeScope & {
    appId: string;
}, name: string): {
    /** Listen for an event (or "*" for every event). Returns a function that stops listening. */
    subscribe(event: string, onMessage: (msg: RealtimeMessage) => void): () => void;
    /** Send a message. Refused (403) unless the channel's `publish` rule allows this viewer. */
    publish(event: string, data?: unknown): Promise<{
        ok: true;
    }>;
};
/**
 * Something changed: refetch it. IDs only — never data.
 *
 * Admins of the collection see every change; everyone else sees changes to public things (public app
 * records, products). Filter by `type` ('product' | 'proof' | 'asset' | 'record' | 'collection' |
 * 'collection.apps' | 'settings'), `id`, `appId`, `recordType`, `productId`, `proofId`.
 *
 * ```ts
 * const off = realtime.onChange({ collectionId }, { type: "record", appId, recordType: "entry" }, () => refetch())
 * ```
 */
export declare function onChange(scope: RealtimeScope, filter: RealtimeChangeFilter, onChangeFn: (change: RealtimeChangeEvent) => void): () => void;
/**
 * Something this APP works on changed: one of its work orders, a container or stock it moved, or one of
 * its own records.
 * For the people who use the app, admins or not: someone hears these when they are in one of the app's
 * user groups (the ones its server functions are limited to, or `realtime.staff` in its manifest), and
 * so does a collection admin. IDs only — refetch through your own API.
 *
 * Types: 'workOrder' (`id`, `appId`), 'container' (`id`, `kind` = its container type), 'stock' (`id` =
 * the container, `productId`), 'record' (`id`, `recordType`). Filter as with `onChange`; an empty filter
 * hears them all.
 *
 * ```ts
 * // A production app's screens refetch when anything on the floor changes.
 * useEffect(() => realtime.onStaffChange({ collectionId, appId }, {}, () => queryClient.invalidateQueries()), [collectionId, appId])
 * ```
 */
export declare function onStaffChange(scope: RealtimeScope & {
    appId: string;
}, filter: RealtimeChangeFilter, onChangeFn: (change: RealtimeChangeEvent) => void): () => void;
/**
 * Messages for the signed-in person only (e.g. "scan" — a tag they just scanned on another device).
 */
export declare function onMine(scope: RealtimeScope, onMessage: (msg: RealtimeMessage) => void): () => void;
/**
 * @deprecated Use `realtime.channel()` / `realtime.onChange()`. Returns a raw Ably TokenRequest for
 * `collection:{collectionId}:*` (subscribe; publish only for the collection's admins).
 */
export declare function getPublicToken(params: RealtimeTokenRequest): Promise<AblyTokenRequest>;
/**
 * @deprecated Use `realtime.onMine()`. Returns a raw Ably TokenRequest for `interaction:{userId}`
 * (subscribe only).
 */
export declare function getAdminToken(): Promise<AblyTokenRequest>;
