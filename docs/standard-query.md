# The standard query

One request body to **filter, sort, page, count, total and follow links**, the same on every resource
that takes it. Learn it once.

| Resource | Function | Call |
|---|---|---|
| Proofs | `proof.query(collectionId, body)` | `POST /admin/collection/:id/proof/query` |
| Contacts | `contact.query(collectionId, body)` | `POST /admin/collection/:id/contacts/query` |
| Products | `products.standardQuery(collectionId, body)` | `POST /admin/collection/:id/products/standard/query` |
| App records | `app.records.query(collectionId, appId, body)` | `POST /admin/collection/:id/app/:appId/records/query` |

All are admin calls and read-only. Products also keep `products.query`, whose own body is unchanged;
`standardQuery` sits beside it.

Each resource says what its query can use: `proof.queryFields`, `contact.queryFields`,
`products.standardQueryFields`, `app.records.queryFields` (a `GET` on the same address). It returns the
fields, what each can be used for, and the links.

## The body

Everything is optional. An empty body returns the first page.

```typescript
interface StandardQuery {
  where?: QueryWhere
  orderBy?: Array<Record<string, 'asc' | 'desc'>>
  limit?: number          // rows: 1–200 (default 50); groups: 1–500
  cursor?: string | null  // nextCursor from the previous page
  select?: string[]
  count?: boolean
  groupBy?: string[]
  aggregates?: Record<string, QueryAggregate>
  expand?: string[] | Record<string, string[] | true>
}
```

It answers in one of two shapes:

```typescript
{ items: [...], nextCursor: string | null, count?: number }   // rows
{ groups: [...], more: boolean }                               // with groupBy and/or aggregates
```

## Filtering: `where`

`field: value` means "equal to". `field: { op: value }` uses a comparison. Every entry must hold.

| Comparison | Meaning |
|---|---|
| `eq`, `ne` | equal, not equal |
| `gt`, `gte`, `lt`, `lte` | more / less than (numbers, dates, text) |
| `in`, `nin` | one of / none of a list (1–100 values) |
| `contains`, `startsWith` | text, in any letter case |
| `isNull` | `true`: empty; `false`: has a value |
| `has`, `hasAny`, `hasAll` | a list field (a contact's `tags`) holds one / any / all |

Combine with `and`, `or` and `not`, nested up to 4 levels:

```typescript
await proof.query(collectionId, {
  where: {
    createdAt: { gte: '2026-01-01', lt: '2026-02-01' },
    or: [{ productId: 'toaster' }, { and: [{ productId: 'kettle' }, { claimable: true }] }],
  },
})
```

Dates are ISO 8601 text (`"2026-01-31"` or `"2026-01-31T09:00:00Z"`).

### Product facets

A product's `facets` are filtered by key. Name the facet by its key or its name, and the value by its
key or its name, in any letter case. Every facet given must match.

```typescript
await products.standardQuery(collectionId, {
  where: { facets: { brand: 'Breville', category: { in: ['Toasters', 'Kettles'] } } },
})
```

### An app's own fields: paths into a record

An app record keeps the app's own fields inside `data` (and `owner`, `admin`). Reach one by path, as a
field name:

```typescript
await app.records.query(collectionId, appId, {
  where: { recordType: 'work_order', 'data.status': 'released', 'data.qty': { gt: 10 } },
  select: ['ref', 'data.status', 'data.line.name'],
})
```

- A path can be filtered, selected, grouped and totalled. It cannot be sorted on.
- It reads as text. Compared with a **number** (`gt`, `gte`, `lt`, `lte`), and in `sum`, `avg`, `min`
  and `max`, it is read as a number; a value that is not a number is left out, it does not fail the
  query.
- A path follows named fields, up to 4 deep. It does not reach into lists.
- The documents themselves (`data`, `owner`, `admin`) are returned only when selected.

## Sorting and paging

`orderBy` takes up to 3 `{ field: 'asc' | 'desc' }`, on the fields that can sort (ask `queryFields`: their
`can` includes `sort`). A few of them can be empty, such as an app record's `startsAt` and `expiresAt`:
the rows without one come **last**, whichever way you sort, and paging carries on through them. Pass the
answer's `nextCursor` as `cursor` for the next page, with the **same** `where` and `orderBy`; a cursor from
a different query is refused.

```typescript
// An app's events, latest first; any without a date at the end
await app.records.query(collectionId, appId, { where: { recordType: 'event' }, orderBy: [{ startsAt: 'desc' }], limit: 100 })
```

A page holds at most 200 rows (`limit` 1–200). To read more, follow `nextCursor`.

```typescript
let cursor: string | null = null
do {
  const page = await contact.query(collectionId, { orderBy: [{ createdAt: 'asc' }], limit: 200, cursor })
  if (!('items' in page)) break
  // …use page.items
  cursor = page.nextCursor
} while (cursor)
```

`count: true` adds how many rows match `where` in all, not just on this page.

## Totals: `groupBy` and `aggregates`

```typescript
// How many people own each product, and when the latest was registered
await proof.query(collectionId, {
  where: { userId: { isNull: false } },
  groupBy: ['productId'],
  aggregates: { owners: { countDistinct: 'userId' }, latest: { max: 'createdAt' } },
})
// → { groups: [{ productId: 'kettle', owners: 2, latest: '2026-01-06T12:00:00.000Z' }, …], more: false }
```

- A total is one of `{ count: true }`, `{ countDistinct: field }`, `{ sum | avg | min | max: field }`.
- `aggregates` without `groupBy` gives one group: the totals over everything matched.
- Groups come ordered by the first total, largest first, unless `orderBy` names a group field or a
  total. `more: true` means there were more groups than `limit`.
- A grouped query has no pages, no `select` and no `expand`.

## Following a link: `expand`

`expand` returns the thing a row points at, inside the row, under the link's name.

```typescript
await proof.query(collectionId, {
  where: { productId: 'toaster' },
  select: ['id'],
  expand: { product: ['name', 'sku'], owner: ['firstName', 'email'] },
})
// → items: [{ id: 'p1', product: { name: 'Breville Toaster', sku: '…' }, owner: { firstName: 'Ana', email: '…' } }]
```

| Resource | Links |
|---|---|
| Proofs | `product`, `owner` (the contact with the owner's login id) |
| App records | `product`, `contact` |

`expand: ['product']` returns the linked thing's usual fields. A link is null when there is nothing
linked, and also when the linked thing would not be returned by its own query (a deleted product, an
erased contact). Up to 3 links, one level deep, rows only.

## What is refused

A query that asks for something a resource does not offer is refused with status 400 and a plain
message saying what is allowed:

```json
{ "errorCode": "INVALID_QUERY", "errorText": "There is no field \"colour\" on proofs. Fields: id, productId, …", "at": "where.colour" }
```

That includes a field that is not offered (anywhere: filter, sort, group or select), an unknown
comparison, a value of the wrong type, too many rows or values, and nesting that is too deep. A query
that runs for more than 5 seconds is stopped with `QUERY_TOO_SLOW`: narrow `where`.

## A question across resources

"How many people own a Breville toaster, and who registered one most recently?"

```typescript
const found = await products.standardQuery(collectionId, {
  where: { facets: { brand: 'Breville', category: 'Toasters' } }, select: ['id'],
})
const ids = 'items' in found ? found.items.map((p) => String(p.id)) : []
const where = { productId: { in: ids }, userId: { isNull: false } }

const owners = await proof.query(collectionId, { where, aggregates: { owners: { countDistinct: 'userId' } } })
const latest = await proof.query(collectionId, {
  where, orderBy: [{ createdAt: 'desc' }], limit: 1, expand: { owner: ['firstName', 'lastName'] },
})
```
