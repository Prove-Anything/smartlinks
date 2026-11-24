---
title: Lists
description: Every list in the SDK returns the same shape and pages the same way. Learn it once.
category: Platform
---

# Lists

Every function that returns a list returns the same thing and pages the same way, whatever it lists:

```typescript
interface ListResult<T> {
  items: T[]                  // the list
  nextCursor: string | null   // pass back as `cursor` for the next page; null on the last page
  count?: number              // the total, where the server knows it
}
```

```typescript
import { tags } from '@proveanything/smartlinks'

const { items, nextCursor } = await tags.list('coll_123', { limit: 100 })
```

## Paging

Two options, the same on every list: `limit` (how many) and `cursor` (where to carry on). A list returns
50 items unless you ask for another number, and each list has its own maximum.

```typescript
let cursor: string | undefined
do {
  const page = await contact.list('coll_123', { limit: 100, cursor })
  for (const c of page.items) console.log(c.email)
  cursor = page.nextCursor ?? undefined
} while (cursor)
```

- A cursor is opaque. Don't build one, read one, or keep one for later: use the one the last page gave you.
- A cursor that isn't one the list gave out is refused with `400 INVALID_CURSOR`.
- **`items` is one page, not everything.** If you need them all, follow `nextCursor` or use `all` (below).
- The one exception is a small fixed set: a page's widgets, the facet definitions, config fields, the
  connectors that exist. Those always come back whole. Their functions take no `limit` or `cursor`, and
  `nextCursor` is always `null`.

### Walking every page

`each` gives you every item, fetching pages as it goes. `all` collects them into one array.

```typescript
import { each, all, contact, tags } from '@proveanything/smartlinks'

for await (const c of each((cursor) => contact.list('coll_123', { limit: 100, cursor }))) {
  console.log(c.email)
}

const everyTag = await all((cursor) => tags.list('coll_123', { cursor }))
const variants = await all((cursor) => variant.list('coll_123', 'prod_1', { limit: 200, cursor }))
```

A bigger `limit` means fewer round trips when you want everything.

`all` stops at 10,000 items so a mistake can't fetch a whole database. Raise it on purpose when you mean
to: `all(page, { max: 50000 })`.

## `count`

`count` is the total number of items that match, not the number on this page. Most lists give it. It is
absent where counting would cost a scan, and on a list that only ever returns "the newest N".

```typescript
const { items, count } = await app.records.list('coll_123', 'my-app', { limit: 20 })
console.log(`showing ${items.length} of ${count}`)
```

When you need a count and the list doesn't give one, use the [standard query](standard-query.md) with
`count: true`.

## Other fields beside the list

A few lists say more than the list, and those fields sit beside `items`:

```typescript
const { items, mode } = await knowledge.search('coll_123', { q: 'how do I descale' })
const { items: pairs, scanned } = await contact.findDuplicates('coll_123')
```

Each function's return type names them.

## The same words on every list

Where a list can search, sort, filter by date or bring related things along, it uses the same option as
every other list that can. Each function's options say which of these it has.

| To | Option | Example |
|---|---|---|
| Search | `q` | `{ q: 'oak' }` |
| Sort | `orderBy` | `{ orderBy: [{ createdAt: 'desc' }, { name: 'asc' }] }` |
| Filter on a date field | the field, with `gte` and `lte` | `{ createdAt: { gte: '2026-11-01T00:00:00Z', lte: new Date() } }` |
| Give the time window of a log or a schedule | `from`, `to` | `{ from: '2026-11-01T00:00:00Z', to: '2026-12-01T00:00:00Z' }` |
| Bring related things along | `expand` | `{ expand: ['items'] }` |

```typescript
import { app, contact, order } from '@proveanything/smartlinks'

const open = await app.cases.list('coll_123', 'support', {
  status: 'open',
  orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
  createdAt: { gte: '2026-11-01T00:00:00Z' },
})
const recent = await contact.search({ collectionId: 'coll_123', q: 'jo', createdAt: { gte: lastWeek } })
const withItems = await order.list('coll_123', { expand: ['items'] })
```

- **Dates** are a full date and time (ISO 8601) or a `Date`. A date with no time means midnight UTC at the
  start of that day, so for "to the end of the 30th" give the 30th at 23:59:59, or the 1st with `from`/`to`.
- **`gte` and `lte` include the moment you give.**
- **`from` and `to`** belong to lists that are a log or a schedule (events, messages sent, jobs, bookings
  and slots): one time window for the whole list, not a filter on a named field.
- **Sorting** is by the fields the list names. Asking for another is refused, with the ones it has.

## What a list can't do, it says

Nothing is silently ignored. A list answers `400` and says what it does take when you send:

- an option it doesn't read (`UNKNOWN_PARAMETER`, with the options that exist and the nearest match);
- the older spelling of one of the words above (`UNKNOWN_PARAMETER`: `This list has no "search" parameter. Use "q".`);
- a field it can't sort by, a related thing it doesn't know, or a value that isn't a date (`INVALID_PARAMETER`);
- `limit` or `cursor` on a fixed set (`UNKNOWN_PARAMETER`: `This list is always returned whole`);
- an admin-only option on a public list (for example `includeDeleted`).

So a mistyped filter is an error you see, not a filter that silently does nothing.

## Filtering, sorting and counting beyond that

Lists take the few filters each one always took. For anything richer (several conditions, sorting on any
field, counts, totals, following links to related records) use the [standard query](standard-query.md):
one request body, the same on every resource that takes it, and it answers in this same list shape.

## Without the SDK

Send `SmartLinks-Version: 2027-01` (see [API versions](api-versions.md)) and every list route answers this
way:

```
GET /api/v1/admin/collection/abc/tags?limit=100&cursor=eyJvIjoxMDB9
SmartLinks-Version: 2027-01

{ "items": [ … ], "nextCursor": "eyJvIjoyMDB9", "count": 1240 }
```

For a list that is a `POST` (a search or a query), `limit`, `cursor` and the words above go at the top level
of the body. In an address the words are written like this:

```
?q=oak&orderBy=createdAt:desc,name:asc&createdAt[gte]=2026-11-01T00:00:00Z&expand=items,facets
```
