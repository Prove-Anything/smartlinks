# Contact Search

Admin-scoped endpoint for querying contacts within a collection. Supports
free-text search, type-ahead, identity lookup, structured filters, and JSONB
field queries. All parameters are optional and composable.

**Base path:** `GET /api/admin/:collectionId/contacts/search`

---

## Quick examples

```ts
// Type-ahead while user types "joh" into a search box
await contact.search({ collectionId, q: "joh", typeahead: true })

// Find contacts by partial email
await contact.search({ collectionId, email: "acme.com" })

// Exact contact by UUID
await contact.search({ collectionId, id: "uuid-here" })

// All contacts tagged "vip" created this year
await contact.search({
  collectionId,
  tags: ["vip"],
  createdFrom: "2026-01-01",
})

// Find by external ID (e.g. Shopify customer ID)
await contact.search({
  collectionId,
  externalIdKey: "shopify_id",
  externalIdValue: "123456",
})
```

---

## Parameters

### Free-text

| Param | Type | Description |
|---|---|---|
| `q` | `string` | General search term. Searches `first_name`, `last_name`, `display_name`, `company`, and all identity values (`email`, `phone`). When the value contains `@` only email identities are searched; when it matches a phone pattern only phone identities are searched. |
| `typeahead` | `boolean` | When `true`, uses prefix (`startsWith`) operators instead of substring (`contains`). Significantly cheaper per keystroke. Default limit becomes `10`; minimum `q` length is 2 characters. Use this for live search-as-you-type UIs. |

### Identity filters

| Param | Type | Description |
|---|---|---|
| `email` | `string` | Partial match against normalised email identity values. Case-insensitive. |
| `phone` | `string` | Partial match against normalised phone identity values. |

### Exact lookups

These short-circuit all text/filter logic and return at most one contact.

| Param | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | Contact primary key. |
| `userId` | `string` | Firebase auth UID linked to the contact. |

### Structured filters

All filters are ANDed with each other and with any text search.

| Param | Type | Description |
|---|---|---|
| `tags` | `string \| string[]` | Comma-separated string or repeated param. Contacts must have **any** of these tags. |
| `tagsAll` | `string \| string[]` | Contacts must have **all** of these tags. |
| `source` | `string` | Exact match on the `source` field. |
| `locale` | `string` | Exact match on the `locale` field (e.g. `"en-US"`). |
| `createdFrom` | `string` (ISO-8601) | Lower bound on `created_at`. |
| `createdTo` | `string` (ISO-8601) | Upper bound on `created_at`. |

### JSONB field filters

Searches inside the `external_ids` or `custom_fields` JSONB columns by
key/value pair. Both params in a pair must be supplied together.

| Param | Type | Description |
|---|---|---|
| `externalIdKey` | `string` | Top-level key in `externalIds` (e.g. `"shopify_id"`). |
| `externalIdValue` | `string` | Expected value at that key. |
| `customFieldKey` | `string` | Top-level key in `customFields`. |
| `customFieldValue` | `string` | Expected value at that key. |

### Pagination

| Param | Type | Default | Max |
|---|---|---|---|
| `limit` | `number` | `20` (`10` in typeahead mode) | `100` (`10` in typeahead mode) |
| `offset` | `number` | `0` | — |

---

## Response

```ts
{
  items: Contact[],
  limit: number,
  offset: number,
}
```

Each `Contact` item follows the shape defined in `src/types/contact.ts`.

---

## SDK usage

```ts
import { contact } from '@proveanything/smartlinks'

const results = await contact.search({
  collectionId: "my-collection",
  q: "jane",
  tags: ["vip"],
  limit: 20,
})

for (const c of results.items) {
  console.log(c.displayName, c.email)
}
```

---

## Performance notes

The search endpoint is backed by **PostgreSQL trigram GIN indexes** via the
`pg_trgm` extension (migration `20260519000001`). This makes `ILIKE '%query%'`
scans fast even with millions of contacts per org.

**What is a trigram?** PostgreSQL decomposes every string into overlapping
3-character windows ("trigrams") and stores them in an inverted index. A query
for `"acme"` is converted into trigrams `" ac", "acm", "cme", "me "` and the
index returns only rows containing those windows — so Postgres never scans rows
that can't match, regardless of whether the query is a prefix, suffix, or
middle-of-word substring.

**Type-ahead mode** (`typeahead: true`) is the recommended pattern for
keystroke-by-keystroke UI. It emits `LIKE 'query%'` (prefix) operators instead
of `LIKE '%query%'` (substring). Prefix scans are cheaper because they require
fewer trigram lookups, making them safe to call on every keypress. Minimum query
length is enforced at 2 characters server-side to prevent over-broad scans.

**Future scale path:** At very high volumes, routing `search` through
Elasticsearch would add typo-tolerance and relevance ranking. The API surface is
intentionally implementation-agnostic so the backing engine can be swapped
without client changes.

---

## Error codes

| Code | HTTP | Meaning |
|---|---|---|
| `SEARCH_REQUIRED` | 400 | No searchable parameter was provided. |
