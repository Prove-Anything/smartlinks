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
 * Invalidate a cached key.
 */
export declare function invalidate(key: string): void;
/**
 * Clear all cached data.
 */
export declare function clear(): void;
