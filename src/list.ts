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
export function listQuery(params?: Record<string, any> | null): string {
  if (!params) return ''
  const out = new URLSearchParams()
  const text = (v: any) => (v instanceof Date ? v.toISOString() : String(v))
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    if (key === 'orderBy') {
      const keys: string[] = []
      for (const part of Array.isArray(value) ? value : [value]) {
        if (typeof part === 'string') { if (part) keys.push(part) }
        else if (part && typeof part === 'object') for (const [f, d] of Object.entries(part)) if (d) keys.push(`${f}:${d}`)
      }
      if (keys.length) out.set('orderBy', keys.join(','))
    } else if (key === 'expand') {
      const names = (Array.isArray(value) ? value : [value]).filter(Boolean)
      if (names.length) out.set('expand', names.join(','))
    } else if (Array.isArray(value)) {
      for (const v of value) if (v !== undefined && v !== null && v !== '') out.append(key, text(v))
    } else if (value instanceof Date) {
      out.set(key, value.toISOString())
    } else if (typeof value === 'object') {
      for (const [op, v] of Object.entries(value)) if (v !== undefined && v !== null && v !== '') out.set(`${key}[${op}]`, text(v))
    } else {
      out.set(key, String(value))
    }
  }
  const qs = out.toString()
  return qs ? `?${qs}` : ''
}
