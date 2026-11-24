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

Two options, the same on every list that pages: `limit` (how many) and `cursor` (where to carry on).

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
- A list that isn't paged returns everything, with `nextCursor: null`. Its function takes no `limit` or
  `cursor`.

### Walking every page

`each` gives you every item, fetching pages as it goes. `all` collects them into one array.

```typescript
import { each, all, contact, tags } from '@proveanything/smartlinks'

for await (const c of each((cursor) => contact.list('coll_123', { limit: 100, cursor }))) {
  console.log(c.email)
}

const everyTag = await all((cursor) => tags.list('coll_123', { cursor }))
```

`all` stops at 10,000 items so a mistake can't fetch a whole database. Raise it on purpose when you mean
to: `all(page, { max: 50000 })`.

## `count`

`count` is the total number of items that match, not the number on this page. It's there where the server
already knows it, and absent where counting would cost a scan.

```typescript
const { items, count } = await app.records.list('coll_123', 'my-app', { limit: 20 })
console.log(`showing ${items.length} of ${count}`)
```

When you need a count and the list doesn't give one, use the [standard query](standard-query.md) with
`count: true`.

## Other fields beside the list

A few lists say more than the list, and those fields sit beside `items`:

```typescript
const { items, mode } = await knowledge.search('coll_123', { query: 'how do I descale' })
const { items: pairs, scanned } = await contact.findDuplicates('coll_123')
```

Each function's return type names them.

## Options a list doesn't read are refused

A list refuses a query option it doesn't read, with `400 UNKNOWN_PARAMETER`, the options that do exist,
and the nearest match:

```
This list has no "serach" parameter. Did you mean "search"?
```

So a mistyped filter is an error you see, not a filter that silently does nothing. The same applies to an
admin-only option passed on a public list (for example `includeDeleted`).

## Filtering, sorting and counting

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

For a list that is a `POST` (a search or a query), `limit` and `cursor` go at the top level of the body.
