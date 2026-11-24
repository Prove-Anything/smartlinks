import type { ListResult } from "./types/list.js";
/**
 * Every item of a list, page by page, as an async iterator. Give it a function that fetches one page.
 *
 * @example
 * ```typescript
 * for await (const c of each((cursor) => contact.list('coll_123', { limit: 100, cursor }))) {
 *   console.log(c.email)
 * }
 * ```
 */
export declare function each<T>(page: (cursor?: string) => Promise<ListResult<T>>): AsyncGenerator<T, void, void>;
/**
 * Every item of a list in one array. Stops at `max` items (default 10,000) so a mistake can't fetch
 * a whole database: raise it on purpose when you mean to.
 *
 * @example
 * ```typescript
 * const tags = await all((cursor) => tags.list('coll_123', { cursor }))
 * ```
 */
export declare function all<T>(page: (cursor?: string) => Promise<ListResult<T>>, opts?: {
    max?: number;
}): Promise<T[]>;
/**
 * The query string for a list: `?limit=…&cursor=…` plus the list's own filters, with the standard words
 * written the one way the API reads them (API version 2027-01):
 *
 * - `orderBy: [{ createdAt: 'desc' }, { name: 'asc' }]` → `orderBy=createdAt:desc,name:asc`
 * - a date range `createdAt: { gte, lte }` → `createdAt[gte]=…&createdAt[lte]=…` (a Date becomes ISO)
 * - `expand: ['items', 'facets']` → `expand=items,facets`
 * - any other array → the parameter repeated (`tags=a&tags=b`); a Date → ISO; undefined, null and '' are left out
 *
 * Returns '' when there is nothing to send. SDK-internal: every list function with options uses it.
 */
export declare function listQuery(params?: Record<string, any> | null): string;
