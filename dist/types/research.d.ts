export interface ResearchFetchRequest {
    /** Absolute URL to fetch (https). */
    url: string;
    /** schema.org @type filter for the returned JSON-LD, e.g. "Recipe" or "Product". */
    type?: string;
    /** Alias for `type`. */
    schemaType?: string;
    /** Bypass the cache and re-fetch. */
    forceRefresh?: boolean;
}
export interface ResearchFetchResult {
    provider: 'firecrawl' | 'web';
    status: number | null;
    markdown?: string | null;
    html?: string | null;
    metadata?: Record<string, any> | null;
    /** schema.org JSON-LD objects (filtered by `type` when provided). */
    schemas: any[];
    url: string;
    cached: boolean;
    fetchedAt?: string;
}
