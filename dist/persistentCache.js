// src/persistentCache.ts
// IndexedDB-backed L2 cache for the SDK's HTTP layer.
//
// Every exported function is Node-safe: all IDB access is guarded by
// isIdbAvailable() and wrapped in try/catch so that failures in private-
// browsing, quota-exceeded situations, or server-side environments are always
// silent — they never propagate errors to the caller.
const DB_NAME = 'smartlinks-sdk-cache';
const STORE_NAME = 'responses';
const DB_VERSION = 1;
let dbPromise = null;
/**
 * Returns true only in environments where IndexedDB is genuinely available.
 * False in Node.js, and in some private-browsing contexts that stub indexedDB
 * but throw on open.
 */
export function isIdbAvailable() {
    try {
        return typeof indexedDB !== 'undefined' && indexedDB !== null;
    }
    catch (_a) {
        return false;
    }
}
function openDb() {
    if (dbPromise)
        return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
        try {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
            req.onsuccess = (event) => {
                resolve(event.target.result);
            };
            req.onerror = () => {
                dbPromise = null;
                reject(req.error);
            };
            req.onblocked = () => {
                dbPromise = null;
                reject(new Error('[smartlinks] IndexedDB open blocked'));
            };
        }
        catch (err) {
            dbPromise = null;
            reject(err);
        }
    });
    return dbPromise;
}
/**
 * Read an entry from IndexedDB.
 * Returns `null` when IDB is unavailable, the key doesn't exist, or on any error.
 * Safe to call in Node.js — returns null immediately.
 */
export async function idbGet(key) {
    if (!isIdbAvailable())
        return null;
    try {
        const db = await openDb();
        return new Promise((resolve) => {
            try {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const req = tx.objectStore(STORE_NAME).get(key);
                req.onsuccess = () => { var _a; return resolve((_a = req.result) !== null && _a !== void 0 ? _a : null); };
                req.onerror = () => resolve(null);
            }
            catch (_a) {
                resolve(null);
            }
        });
    }
    catch (_a) {
        return null;
    }
}
/**
 * Write an entry to IndexedDB.
 * Fails silently on quota exceeded, private browsing, or any other error.
 * Safe to call in Node.js — no-ops immediately.
 */
export async function idbSet(key, entry) {
    if (!isIdbAvailable())
        return;
    try {
        const db = await openDb();
        await new Promise((resolve) => {
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put(entry, key);
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve(); // quota exceeded etc — fail silently
                tx.onabort = () => resolve();
            }
            catch (_a) {
                resolve();
            }
        });
    }
    catch (_a) {
        // Fail silently — IDB persistence is best-effort
    }
}
/**
 * Delete a single entry from IndexedDB.
 * Safe to call in Node.js — no-ops immediately.
 */
export async function idbDelete(key) {
    if (!isIdbAvailable())
        return;
    try {
        const db = await openDb();
        await new Promise((resolve) => {
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).delete(key);
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
                tx.onabort = () => resolve();
            }
            catch (_a) {
                resolve();
            }
        });
    }
    catch (_a) { }
}
/**
 * Clear all IDB entries, or only those whose key contains `pattern`.
 * Safe to call in Node.js — no-ops immediately.
 */
export async function idbClear(pattern) {
    if (!isIdbAvailable())
        return;
    try {
        const db = await openDb();
        if (!pattern) {
            await new Promise((resolve) => {
                try {
                    const tx = db.transaction(STORE_NAME, 'readwrite');
                    tx.objectStore(STORE_NAME).clear();
                    tx.oncomplete = () => resolve();
                    tx.onerror = () => resolve();
                    tx.onabort = () => resolve();
                }
                catch (_a) {
                    resolve();
                }
            });
            return;
        }
        // Pattern-based: enumerate all keys and delete matching ones.
        await new Promise((resolve) => {
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const req = store.getAllKeys();
                req.onsuccess = () => {
                    for (const key of req.result) {
                        if (key.includes(pattern))
                            store.delete(key);
                    }
                    resolve();
                };
                req.onerror = () => resolve();
            }
            catch (_a) {
                resolve();
            }
        });
    }
    catch (_a) { }
}
