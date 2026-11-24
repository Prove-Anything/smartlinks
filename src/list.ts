// Walking a list: every list in SDK 3 returns { items, nextCursor, count? } (see types/list.ts).
import type { ListResult } from "./types/list"

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
export async function* each<T>(page: (cursor?: string) => Promise<ListResult<T>>): AsyncGenerator<T, void, void> {
  let cursor: string | undefined
  for (;;) {
    const res = await page(cursor)
    for (const item of res.items) yield item
    if (!res.nextCursor) return
    cursor = res.nextCursor
  }
}

/**
 * Every item of a list in one array. Stops at `max` items (default 10,000) so a mistake can't fetch
 * a whole database: raise it on purpose when you mean to.
 *
 * @example
 * ```typescript
 * const tags = await all((cursor) => tags.list('coll_123', { cursor }))
 * ```
 */
export async function all<T>(page: (cursor?: string) => Promise<ListResult<T>>, opts: { max?: number } = {}): Promise<T[]> {
  const max = opts.max ?? 10000
  const out: T[] = []
  for await (const item of each(page)) {
    out.push(item)
    if (out.length >= max) break
  }
  return out
}
