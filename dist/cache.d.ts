export interface CacheOptions {
    /** TTL in milliseconds (default: 5 minutes) */
    ttl?: number;
    /** Storage backend */
    storage?: 'memory' | 'session' | 'local';
}
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
export declare function getOrFetch<T>(key: string, fetcher: () => Promise<T>, options?: CacheOptions): Promise<T>;
/**
 * Synchronously read a cached value without fetching. Returns `undefined` if
 * the key was never cached, or if its TTL has expired.
 *
 * Every write also mirrors into the in-memory store regardless of its
 * `storage` backend, so the default `storage: 'memory'` here finds entries
 * cached via `getOrFetch(..., { storage: 'session' | 'local' })` too, as
 * long as it's the same page load.
 *
 * @example
 * ```typescript
 * // After warming the cache once with getOrFetch(...):
 * const cached = cache.peek<AppConfig>(`appConfig:${collectionId}:public`);
 * if (cached) {
 *   // render synchronously — no await needed
 * }
 * ```
 */
export declare function peek<T>(key: string, storage?: 'memory' | 'session' | 'local'): T | undefined;
/**
 * Invalidate a cached key.
 */
export declare function invalidate(key: string): void;
/**
 * Clear all cached data.
 */
export declare function clear(): void;
