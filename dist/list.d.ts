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
