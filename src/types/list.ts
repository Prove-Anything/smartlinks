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

/** The paging options every list takes. */
export interface ListOptions {
  /** How many to return. Each list has its own default and maximum. */
  limit?: number
  /** A `nextCursor` from the previous page. */
  cursor?: string
}
