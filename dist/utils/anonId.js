// src/utils/anonId.ts
const ANON_ID_KEY = '_pa_anon_id';
/**
 * Returns a stable anonymous device ID stored in `localStorage`.
 *
 * On first call a random UUID is generated and persisted. All subsequent calls
 * from the same browser return the same value. Returns `null` during SSR or in
 * any environment without `window` (safe to call universally).
 *
 * The value is scoped to the browser's `localStorage` and is cleared if the
 * user clears site data. It does **not** create any contact or user record on
 * the server.
 *
 * Pass the result in `metadata.anonId` when submitting interactions to enable
 * device-level deduplication via `uniquePerAnonId`.
 *
 * @example
 * ```ts
 * import { utils } from '@proveanything/smartlinks'
 *
 * const response = await interactions.submitPublicEvent(collectionId, {
 *   appId: 'my-app',
 *   interactionId: 'nps-score',
 *   outcome: '9',
 *   metadata: { anonId: utils.getAnonId() },
 * })
 * ```
 */
export function getAnonId() {
    if (typeof window === 'undefined')
        return null;
    let id = window.localStorage.getItem(ANON_ID_KEY);
    if (!id) {
        id = crypto.randomUUID();
        window.localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
}
