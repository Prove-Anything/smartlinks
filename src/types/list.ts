// The one shape every list has in SDK 3 (API version 2027-01).

/**
 * What every list returns: the items, a cursor for the next page (null when there are no more), and the
 * total where the list knows it.
 *
 * @example
 * ```typescript
 * let page = await contact.list('coll_123', { limit: 50 })
 * while (page.nextCursor) page = await contact.list('coll_123', { limit: 50, cursor: page.nextCursor })
 * ```
 */
export interface ListResult<T> {
  items: T[]
  /** Pass as `cursor` to get the next page. `null` = this was the last page. Opaque: never build or read one. */
  nextCursor: string | null
  /** How many there are in all, where the list knows (not every list counts). */
  count?: number
}

/**
 * The paging options every list takes. The exception is a small fixed set (a page's widgets, the facet
 * definitions, config fields): it always comes back whole, so its function takes no options.
 */
export interface ListOptions {
  /** How many to return. 50 unless the list says otherwise; each list has its own maximum. */
  limit?: number
  /** A `nextCursor` from the previous page. */
  cursor?: string
}

/** Which way to sort. */
export type SortDirection = 'asc' | 'desc'

/**
 * What to sort a list by: one `{ field: direction }` per sort key, most important first. Each list's
 * options say which fields it sorts by.
 *
 * @example
 * ```typescript
 * await app.cases.list('coll_123', 'support', { orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }] })
 * ```
 */
export type OrderBy<Field extends string = string> = Array<Partial<Record<Field, SortDirection>>>

/**
 * A range on one of a record's date fields: on or after `gte`, on or before `lte`. Give a full date and
 * time; a date with no time means midnight UTC at the start of that day.
 *
 * @example
 * ```typescript
 * await contact.search({ collectionId, createdAt: { gte: '2026-11-01T00:00:00Z', lte: new Date() } })
 * ```
 */
export interface DateRange {
  gte?: string | Date
  lte?: string | Date
}
