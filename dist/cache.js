// =============================================================================
// Cache Utilities - TTL-based caching for browser and Node environments
// =============================================================================
// In-memory cache store
const memoryCache = new Map();
/**
 * Get cached value or fetch fresh.
 *
 * @param key - Cache key
 * @param fetcher - Async function to fetch fresh data
 * @param options - Cache options
 * @returns Cached or fresh value
 *
 * @example
 * ```typescript
 * const apps = await cache.getOrFetch(
 *   `apps:${collectionId}`,
 *   () => collection.getApps(collectionId),
 *   { ttl: 5 * 60 * 1000, storage: 'session' }
 * );
 * ```
 */
export async function getOrFetch(key, fetcher, options = {}) {
    const { ttl = 5 * 60 * 1000, storage = 'memory' } = options;
    const now = Date.now();
    // Try to get from cache
    const cached = getFromStorage(key, storage);
    if (cached && cached.expiresAt > now) {
        return cached.value;
    }
    // Fetch fresh data
    const value = await fetcher();
    // Store in cache
    const entry = {
        value,
        expiresAt: now + ttl,
    };
    setToStorage(key, entry, storage);
    return value;
}
/**
 * Invalidate a cached key.
 */
export function invalidate(key) {
    // Remove from all storage backends
    memoryCache.delete(key);
    try {
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem(`smartlinks:cache:${key}`);
        }
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(`smartlinks:cache:${key}`);
        }
    }
    catch (_a) {
        // Storage may not be available
    }
}
/**
 * Clear all cached data.
 */
export function clear() {
    memoryCache.clear();
    try {
        if (typeof sessionStorage !== 'undefined') {
            // Clear only smartlinks cache keys
            const sessionKeys = Object.keys(sessionStorage).filter(k => k.startsWith('smartlinks:cache:'));
            sessionKeys.forEach(k => sessionStorage.removeItem(k));
        }
        if (typeof localStorage !== 'undefined') {
            const localKeys = Object.keys(localStorage).filter(k => k.startsWith('smartlinks:cache:'));
            localKeys.forEach(k => localStorage.removeItem(k));
        }
    }
    catch (_a) {
        // Storage may not be available
    }
}
// =============================================================================
// Internal Helpers
// =============================================================================
function getFromStorage(key, storage) {
    try {
        if (storage === 'memory') {
            return memoryCache.get(key) || null;
        }
        const storageKey = `smartlinks:cache:${key}`;
        let stored = null;
        if (storage === 'session' && typeof sessionStorage !== 'undefined') {
            stored = sessionStorage.getItem(storageKey);
        }
        else if (storage === 'local' && typeof localStorage !== 'undefined') {
            stored = localStorage.getItem(storageKey);
        }
        if (stored) {
            return JSON.parse(stored);
        }
    }
    catch (_a) {
        // Storage errors - return null
    }
    return null;
}
function setToStorage(key, entry, storage) {
    try {
        if (storage === 'memory') {
            memoryCache.set(key, entry);
            return;
        }
        const storageKey = `smartlinks:cache:${key}`;
        const serialized = JSON.stringify(entry);
        if (storage === 'session' && typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(storageKey, serialized);
        }
        else if (storage === 'local' && typeof localStorage !== 'undefined') {
            localStorage.setItem(storageKey, serialized);
        }
        // Also keep in memory for faster access
        memoryCache.set(key, entry);
    }
    catch (_a) {
        // Storage quota exceeded or not available - keep in memory only
        memoryCache.set(key, entry);
    }
}
