export interface PersistentCacheEntry {
    /** The cached response data. */
    data: any;
    /** Unix ms timestamp of when the data was originally fetched from the network. */
    timestamp: number;
    /** Unix ms timestamp of when this entry was written to IndexedDB. */
    persistedAt: number;
}
/**
 * Returns true only in environments where IndexedDB is genuinely available.
 * False in Node.js, and in some private-browsing contexts that stub indexedDB
 * but throw on open.
 */
export declare function isIdbAvailable(): boolean;
/**
 * Read an entry from IndexedDB.
 * Returns `null` when IDB is unavailable, the key doesn't exist, or on any error.
 * Safe to call in Node.js — returns null immediately.
 */
export declare function idbGet(key: string): Promise<PersistentCacheEntry | null>;
/**
 * Write an entry to IndexedDB.
 * Fails silently on quota exceeded, private browsing, or any other error.
 * Safe to call in Node.js — no-ops immediately.
 */
export declare function idbSet(key: string, entry: PersistentCacheEntry): Promise<void>;
/**
 * Delete a single entry from IndexedDB.
 * Safe to call in Node.js — no-ops immediately.
 */
export declare function idbDelete(key: string): Promise<void>;
/**
 * Clear all IDB entries, or only those whose key contains `pattern`.
 * Safe to call in Node.js — no-ops immediately.
 */
export declare function idbClear(pattern?: string): Promise<void>;
