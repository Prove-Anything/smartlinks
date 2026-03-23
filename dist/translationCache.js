const DB_NAME = 'smartlinks-sdk-translations';
const STORE_NAME = 'translations';
const DB_VERSION = 1;
const DEFAULT_LOCAL_TRANSLATION_TTL_MS = 90 * 24 * 60 * 60000;
let dbPromise = null;
const memoryTranslationCache = new Map();
export function getDefaultTranslationCacheTtlMs() {
    return DEFAULT_LOCAL_TRANSLATION_TTL_MS;
}
function isIndexedDbAvailable() {
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
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.onerror = () => {
                dbPromise = null;
                reject(request.error);
            };
            request.onblocked = () => {
                dbPromise = null;
                reject(new Error('[smartlinks] Translation IndexedDB open blocked'));
            };
        }
        catch (error) {
            dbPromise = null;
            reject(error);
        }
    });
    return dbPromise;
}
function stableContextKey(context) {
    if (!context)
        return null;
    const entries = Object.entries(context)
        .filter(([, value]) => value !== undefined)
        .sort(([left], [right]) => left.localeCompare(right));
    if (entries.length === 0)
        return null;
    if (typeof context.surface === 'string' && typeof context.field === 'string') {
        return `${context.surface}:${context.field}`;
    }
    return entries
        .map(([key, value]) => `${key}=${String(value)}`)
        .join('|');
}
export function deriveTranslationContextKey(context) {
    return stableContextKey(context);
}
export function normalizeTranslationText(text, options = {}) {
    const { trim = true, collapseWhitespace = false, unicodeNormalization = 'NFC', } = options;
    let normalized = text.replace(/\r\n?/g, '\n');
    if (trim) {
        normalized = normalized.trim();
    }
    if (collapseWhitespace) {
        normalized = normalized.replace(/[\t\f\v ]+/g, ' ');
    }
    if (unicodeNormalization) {
        normalized = normalized.normalize(unicodeNormalization);
    }
    return normalized;
}
function toHex(buffer) {
    const bytes = new Uint8Array(buffer);
    let output = '';
    for (const byte of bytes) {
        output += byte.toString(16).padStart(2, '0');
    }
    return output;
}
export async function hashTranslationText(text, options = {}) {
    var _a;
    const normalized = normalizeTranslationText(text, options);
    const subtle = (_a = globalThis.crypto) === null || _a === void 0 ? void 0 : _a.subtle;
    if (!subtle) {
        throw new Error('[smartlinks] Web Crypto is required for translation hashing');
    }
    const encoded = new TextEncoder().encode(normalized);
    const digest = await subtle.digest('SHA-256', encoded);
    return `sha256:${toHex(digest)}`;
}
function buildLocalCacheKey(params) {
    var _a;
    return [
        params.collectionId,
        params.sourceLanguage,
        params.targetLanguage,
        params.contentType,
        (_a = params.contextKey) !== null && _a !== void 0 ? _a : '',
        params.hash,
    ].join('::');
}
function isExpired(entry) {
    return entry.expiresAt <= Date.now();
}
async function getEntry(key) {
    const memoryEntry = memoryTranslationCache.get(key);
    if (memoryEntry) {
        if (isExpired(memoryEntry)) {
            memoryTranslationCache.delete(key);
            return null;
        }
        return memoryEntry;
    }
    if (!isIndexedDbAvailable())
        return null;
    try {
        const db = await openDb();
        return await new Promise((resolve) => {
            try {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const request = tx.objectStore(STORE_NAME).get(key);
                request.onsuccess = () => {
                    var _a;
                    const result = (_a = request.result) !== null && _a !== void 0 ? _a : null;
                    if (!result) {
                        resolve(null);
                        return;
                    }
                    if (isExpired(result)) {
                        memoryTranslationCache.delete(key);
                        void deleteEntries([key]);
                        resolve(null);
                        return;
                    }
                    memoryTranslationCache.set(key, result);
                    resolve(result);
                };
                request.onerror = () => resolve(null);
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
export async function getCachedTranslations(params) {
    const entries = await Promise.all(params.hashes.map(async (hash) => {
        const key = buildLocalCacheKey(Object.assign(Object.assign({}, params), { hash }));
        const entry = await getEntry(key);
        return entry ? [hash, entry] : null;
    }));
    return new Map(entries.filter((entry) => entry !== null));
}
async function setEntries(entries) {
    for (const [key, entry] of entries) {
        memoryTranslationCache.set(key, entry);
    }
    if (!isIndexedDbAvailable())
        return;
    try {
        const db = await openDb();
        await new Promise((resolve) => {
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                for (const [key, entry] of entries) {
                    store.put(entry, key);
                }
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
                tx.onabort = () => resolve();
            }
            catch (_a) {
                resolve();
            }
        });
    }
    catch (_a) {
        // Best-effort persistence only.
    }
}
export async function setCachedTranslations(params) {
    var _a;
    const ttlMs = (_a = params.ttlMs) !== null && _a !== void 0 ? _a : DEFAULT_LOCAL_TRANSLATION_TTL_MS;
    const now = Date.now();
    const entries = params.items.map(({ hash, item }) => {
        const key = buildLocalCacheKey({
            collectionId: params.collectionId,
            sourceLanguage: params.sourceLanguage,
            targetLanguage: params.targetLanguage,
            contentType: params.contentType,
            contextKey: params.contextKey,
            hash,
        });
        const entry = {
            collectionId: params.collectionId,
            sourceLanguage: params.sourceLanguage,
            targetLanguage: params.targetLanguage,
            contentType: params.contentType,
            contextKey: params.contextKey,
            hash,
            item: Object.assign(Object.assign({}, item), { expiresAt: now + ttlMs }),
            cachedAt: now,
            expiresAt: now + ttlMs,
        };
        return [key, entry];
    });
    await setEntries(entries);
}
async function deleteEntries(keys) {
    for (const key of keys) {
        memoryTranslationCache.delete(key);
    }
    if (!isIndexedDbAvailable() || keys.length === 0)
        return;
    try {
        const db = await openDb();
        await new Promise((resolve) => {
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                for (const key of keys) {
                    store.delete(key);
                }
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
                tx.onabort = () => resolve();
            }
            catch (_a) {
                resolve();
            }
        });
    }
    catch (_a) {
        // Ignore deletion failures.
    }
}
export async function clearCachedTranslations(collectionId) {
    const memoryKeys = Array.from(memoryTranslationCache.keys());
    const keysToDelete = collectionId
        ? memoryKeys.filter((key) => key.startsWith(`${collectionId}::`))
        : memoryKeys;
    await deleteEntries(keysToDelete);
    if (!isIndexedDbAvailable())
        return;
    try {
        const db = await openDb();
        if (!collectionId) {
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
        await new Promise((resolve) => {
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const request = store.getAllKeys();
                request.onsuccess = () => {
                    for (const key of request.result) {
                        if (key.startsWith(`${collectionId}::`)) {
                            store.delete(key);
                        }
                    }
                    resolve();
                };
                request.onerror = () => resolve();
            }
            catch (_a) {
                resolve();
            }
        });
    }
    catch (_a) {
        // Ignore deletion failures.
    }
}
