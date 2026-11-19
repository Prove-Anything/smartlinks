// src/types/query.ts
//
// The STANDARD QUERY: one request body for filtering, sorting, paging, counting and totalling, the same
// on every resource that takes it (proofs, contacts, products, app records). See docs/standard-query.md.

/** A value a field can be compared with. Dates are ISO 8601 strings. */
export type QueryValue = string | number | boolean

/** How one field is tested. Several tests on one field must all hold. */
export interface QueryFieldTest {
  eq?: QueryValue
  ne?: QueryValue
  gt?: QueryValue
  gte?: QueryValue
  lt?: QueryValue
  lte?: QueryValue
  /** One of these values (1 to 100). */
  in?: QueryValue[]
  /** None of these values (1 to 100). */
  nin?: QueryValue[]
  /** Text containing this, in any case. */
  contains?: string
  /** Text starting with this, in any case. */
  startsWith?: string
  /** true: the field is empty. false: it has a value. */
  isNull?: boolean
  /** A list field (e.g. a contact's tags) holds this value. */
  has?: string
  /** A list field holds at least one of these. */
  hasAny?: string[]
  /** A list field holds all of these. */
  hasAll?: string[]
}

/**
 * A keyed field (e.g. a product's `facets`) is filtered key by key: `{ brand: "Breville" }` or
 * `{ category: { in: ["Toasters", "Kettles"] } }`. Every key must match.
 */
export type QueryKeyedTest = Record<string, QueryValue | { eq?: QueryValue; in?: QueryValue[] }>

/**
 * What to match. Each entry is `field: value` (equal to) or `field: { op: value }`; all entries must
 * hold. `and`, `or` and `not` combine further conditions (nested up to 4 levels).
 *
 * A document field (an app record's `data`) is reached by path, as a field name: `"data.status"`.
 */
export interface QueryWhere {
  and?: QueryWhere[]
  or?: QueryWhere[]
  not?: QueryWhere
  [field: string]: QueryValue | QueryFieldTest | QueryKeyedTest | QueryWhere | QueryWhere[] | undefined
}

/** One total. `count` counts rows; the others take a field (or a path into a document). */
export type QueryAggregate =
  | { count: true }
  | { countDistinct: string }
  | { sum: string }
  | { avg: string }
  | { min: string }
  | { max: string }

/** The standard query body. Everything is optional: an empty query returns the first page. */
export interface StandardQuery {
  where?: QueryWhere
  /** e.g. `[{ createdAt: "desc" }]`. Only fields that can be sorted on (never an empty-able one). */
  orderBy?: Array<Record<string, 'asc' | 'desc'>>
  /** Rows per page (1 to 200, default 50), or groups (1 to 500) with groupBy / aggregates. */
  limit?: number
  /** `nextCursor` from the previous page, with the same `where` and `orderBy`. */
  cursor?: string | null
  /** Which fields to return. A path into a document can be selected: `"data.status"`. */
  select?: string[]
  /** Also return how many rows match `where` in all (not just this page). */
  count?: boolean
  /** Group rows by up to 3 fields (or document paths). Returns groups, not rows. */
  groupBy?: string[]
  /** Named totals, e.g. `{ owners: { countDistinct: "userId" } }`. Returns groups, not rows. */
  aggregates?: Record<string, QueryAggregate>
  /**
   * Follow a link and return the linked thing inside each row: `["product", "owner"]`, or with the
   * fields wanted `{ owner: ["firstName", "email"] }`. Rows only. Null where there is nothing linked.
   */
  expand?: string[] | Record<string, string[] | true>
}

/** A page of rows. */
export interface QueryRows<T = Record<string, unknown>> {
  items: T[]
  /** Pass as `cursor` for the next page; null on the last page. */
  nextCursor: string | null
  /** Present when the query asked for `count: true`. */
  count?: number
}

/** The answer to a query with `groupBy` and/or `aggregates`. */
export interface QueryGroups<G = Record<string, unknown>> {
  groups: G[]
  /** True when there were more groups than `limit`. */
  more: boolean
}

export type QueryResult<T = Record<string, unknown>, G = Record<string, unknown>> = QueryRows<T> | QueryGroups<G>

/** What a resource's query can use (from `GET …/query`). */
export interface QueryDescription {
  name: string
  fields: Record<string, { type: 'string' | 'number' | 'boolean' | 'date' | 'list' | 'keyed' | 'json'; about?: string; can: string[] }>
  count: boolean
  aggregates: boolean
  links: Record<string, { to: string; by: string; about?: string }>
  limits: { limit: number; groups: number }
  /** The query shape in a few lines of plain words. */
  shape: string
}
