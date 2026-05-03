# App Objects: Cases, Threads, and Records

This guide covers the three generic app-scoped object types that apps can use as flexible building blocks for different use cases: **Cases**, **Threads**, and **Records**.

---

## Overview

SmartLinks provides three generic data models scoped to your app that can be adapted for countless scenarios. Think of them as configurable primitives that you shape to fit your needs:

- **Cases** — Track issues, requests, or tasks that need resolution
- **Threads** — Manage discussions, comments, or any reply-based content
- **Records** — Store structured data with flexible lifecycles

Each object type supports:
- **JSONB zones** (`data`, `owner`, `admin`) for granular access control
- **Visibility levels** (`public`, `owner`, `admin`) for content exposure
- **Flexible schemas** — store any JSON in the zone fields
- **Admin and public endpoints** for different caller contexts
- **Rich querying** with filters, sorting, pagination, and aggregations

```text
┌─────────────────────────────────────────────────────────────────┐
│ Your SmartLinks App                                             │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│  │   Cases     │   │   Threads   │   │   Records   │           │
│  │             │   │             │   │             │           │
│  │ • Support   │   │ • Comments  │   │ • Bookings  │           │
│  │ • Warranty  │   │ • Q&A       │   │ • Licenses  │           │
│  │ • Feedback  │   │ • Reviews   │   │ • Visits    │           │
│  │ • RMA       │   │ • Forum     │   │ • Events    │           │
│  └─────────────┘   └─────────────┘   └─────────────┘           │
│                                                                 │
│  All scoped to: /collection/:cId/app/:appId                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## The JSONB Zone Model

All three object types use a three-tier access model with JSONB fields:

| Zone    | Visible to        | Writable by       | Use Case                          |
|---------|-------------------|-------------------|-----------------------------------|
| `data`  | public, owner, admin | public, owner, admin | Shared public information      |
| `owner` | owner, admin      | owner, admin      | User-specific private data        |
| `admin` | admin             | admin             | Internal notes, sensitive data    |

### How Zones Work

Zones are **automatically filtered** based on the caller's role:

```typescript
// Public endpoint caller sees:
{
  id: 'case_123',
  status: 'open',
  data: { issue: 'Screen cracked', photos: [...] },
  // owner and admin zones stripped
}

// Owner (authenticated contact) sees:
{
  id: 'case_123',
  status: 'open',
  data: { issue: 'Screen cracked', photos: [...] },
  owner: { shippingAddress: '...', preference: 'email' },
  // admin zone stripped
}

// Admin sees everything:
{
  id: 'case_123',
  status: 'open',
  data: { issue: 'Screen cracked', photos: [...] },
  owner: { shippingAddress: '...', preference: 'email' },
  admin: { internalNotes: 'Escalate to tier 2', cost: 45.00 }
}
```

**Key insight:** The server strips zones before returning objects. You don't need to worry about accidentally leaking `admin` data — it's never sent to non-admin callers.

### Zone Writing Rules

- **Non-admin callers** attempting to write to the `admin` zone are silently ignored
- **Authenticated record owners** can write to `data` and `owner` by default; individual keys can be restricted via the `ownerEdit` app config policy (see [Owner Edit Policy](#owner-edit-policy) below)
- **Public callers** can write to `data` and `owner` (if visibility allows)
- **Admins** can write to all three zones

---

## Visibility Levels

Each object has a `visibility` field that controls who can access it on **public endpoints**:

| Visibility | Public Endpoint Behavior                          |
|------------|--------------------------------------------------|
| `public`   | Anyone can read (even anonymous)                 |
| `owner`    | Only the owning contact can read                 |
| `admin`    | Never visible on public endpoints (404)          |

**Admin endpoints** always return all objects regardless of visibility.

### Typical Patterns

```typescript
// Public discussion thread
await app.threads.create(collectionId, appId, {
  visibility: 'public',
  title: 'How do I clean this product?',
  body: { text: 'Looking for cleaning instructions...' }
});

// Private support case
await app.cases.create(collectionId, appId, {
  visibility: 'owner',  // Only this contact can see it
  category: 'warranty',
  data: { issue: 'Defective unit' },
  owner: { serialNumber: 'ABC123' }
});

// Admin-only internal record
await app.records.create(collectionId, appId, {
  visibility: 'admin',  // Never appears on public endpoints
  recordType: 'audit_log',
  admin: { action: 'manual_refund', amount: 50.00 }
}, true); // admin = true
```

---

## Paginated List Responses

Every `.list()` call returns a **`PaginatedResponse<T>`** object. The items are in the `data` array and all page-level metadata lives in a nested `pagination` object:

```json
{
  "data": [
    {
      "id": "7ac44316-c227-4c39-bf99-a287bc08c6f5",
      "collectionId": "veho-demo",
      "appId": "knowledgeBase",
      "visibility": "public",
      "recordType": "article",
      "status": "published",
      "createdAt": "2026-02-25T22:13:14.310Z",
      "updatedAt": "2026-02-25T22:47:36.712Z",
      "data": {
        "title": "Getting Started",
        "slug": "getting-started",
        "body": "..."
      }
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### Pagination fields

| Field | Type | Description |
|---|---|---|
| `data` | `T[]` | The page of items returned |
| `pagination.total` | `number` | Total number of matching records across **all** pages |
| `pagination.limit` | `number` | The `limit` that was applied to this request (default `50`, max `500`) |
| `pagination.offset` | `number` | The `offset` that was applied to this request |
| `pagination.hasMore` | `boolean` | `true` when more pages exist — use this instead of computing `offset + limit < total` yourself |

> **Note:** The items are always in `response.data`, **not** at the top level. A common mistake is reading `response.total` — the correct path is `response.pagination.total`.

### Fetching all pages

```typescript
import { app, PaginatedResponse, AppRecord } from '@proveanything/smartlinks';

async function fetchAllRecords(collectionId: string, appId: string) {
  const results: AppRecord[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const page: PaginatedResponse<AppRecord> = await app.records.list(
      collectionId,
      appId,
      { limit, offset, sort: 'createdAt:desc' }
    );

    results.push(...page.data);

    if (!page.pagination.hasMore) break;  // no more pages
    offset += limit;
  }

  console.log(`Fetched ${results.length} of ${/* saved from first page */ 0} total`);
  return results;
}
```

### Reading the count and checking for more

```typescript
const page = await app.cases.list(collectionId, appId, { status: 'open', limit: 10 });

console.log(page.data);                   // array of AppCase objects
console.log(page.pagination.total);       // e.g. 142  — total open cases
console.log(page.pagination.hasMore);     // true / false
console.log(page.pagination.offset);      // current page start
console.log(page.pagination.limit);       // items per page
```

---

## Cases

**Cases** represent trackable issues, requests, or tasks that move through states and require resolution.

### When to Use Cases

- **Customer support tickets** — track issues from creation to resolution
- **Warranty claims** — manage claims with status, priority, and assignment
- **Feature requests** — collect and triage user feedback
- **RMA (Return Merchandise Authorization)** — handle product returns
- **Bug reports** — track defects from user submissions
- **Service requests** — manage appointments, repairs, installations

### Key Features

- **Status lifecycle** — `'open'` → `'in-progress'` → `'resolved'` → `'closed'` (or custom statuses)
- **Priority levels** — numerical priority for sorting/escalation
- **Categories** — group cases by type (warranty, bug, feature, etc.)
- **Assignment** — `assignedTo` field for routing to team members
- **History tracking** — append timestamped entries to `admin.history` or `owner.history`
- **Closing metrics** — track `closedAt` to measure resolution time

### Example: Warranty Claims

```typescript
import { app } from '@proveanything/smartlinks';

// Customer submits a warranty claim (public endpoint)
const claim = await app.cases.create(collectionId, appId, {
  visibility: 'owner',
  category: 'warranty',
  status: 'open',
  priority: 2,
  productId: product.id,
  proofId: proof.id,
  contactId: user.contactId,
  data: {
    issue: 'Screen flickering after 3 months',
    photos: ['https://...', 'https://...']
  },
  owner: {
    purchaseDate: '2025-11-15',
    serialNumber: 'SN-7738291',
    preferredContact: 'email'
  }
});

// Admin reviews and assigns (admin endpoint)
await app.cases.update(collectionId, appId, claim.id, {
  assignedTo: 'user_jane_support',
  priority: 3, // escalate
  admin: {
    internalNotes: 'Likely hardware defect, approve replacement'
  }
}, true); // admin = true

// Admin appends to history
await app.cases.appendHistory(collectionId, appId, claim.id, {
  entry: {
    action: 'approved_replacement',
    agent: 'Jane',
    tracking: 'UPS-123456789'
  },
  historyTarget: 'owner', // visible to customer
  status: 'resolved'
});

// Get case summary stats (admin)
const summary = await app.cases.summary(collectionId, appId, {
  period: { from: '2026-01-01', to: '2026-02-28' }
});
// Returns: { total: 142, byStatus: { open: 12, resolved: 130 }, ... }
```

### Use Case: Support Dashboard

Build a live support dashboard showing open cases by priority:

```typescript
const openCases = await app.cases.list(collectionId, appId, {
  status: 'open',
  sort: 'priority:desc',
  limit: 50
}, true);

// Aggregate by category
const stats = await app.cases.aggregate(collectionId, appId, {
  filters: { status: 'open' },
  groupBy: ['category', 'priority'],
  metrics: ['count']
}, true);

// Time series: cases created per week
const trend = await app.cases.aggregate(collectionId, appId, {
  timeSeriesField: 'created_at',
  timeSeriesInterval: 'week',
  metrics: ['count']
}, true);
```

---

## Threads

**Threads** represent discussions, comments, or any content that accumulates replies over time.

### When to Use Threads

- **Product Q&A** — questions and answers about products
- **Community forums** — discussions grouped by topic
- **Comments** — on products, proofs, or other resources
- **Review discussions** — follow-up questions on reviews
- **Feedback threads** — ongoing conversations about features
- **Support chat** — lightweight message threads

### Key Features

- **Reply tracking** — `replies` array with timestamped entries
- **Reply count** — auto-incremented `replyCount` and `lastReplyAt`
- **Slugs** — optional URL-friendly slug for pretty URLs
- **Tags** — JSONB array of tags for categorization
- **Parent linking** — `parentType` + `parentId` to attach to products, proofs, etc.
- **Author metadata** — track `authorId` and `authorType`

### Example: Product Q&A

```typescript
import { app } from '@proveanything/smartlinks';

// Customer asks a question (public endpoint)
const question = await app.threads.create(collectionId, appId, {
  visibility: 'public',
  slug: 'how-to-clean-leather',
  title: 'How do I clean leather without damaging it?',
  status: 'open',
  authorId: user.contactId,
  authorType: 'customer',
  productId: product.id,
  body: {
    text: 'I spilled coffee on my leather bag. What cleaner is safe to use?'
  },
  tags: ['cleaning', 'leather', 'care']
});

// Another customer replies
await app.threads.reply(collectionId, appId, question.id, {
  authorId: otherUser.contactId,
  authorType: 'customer',
  text: 'I use a mild soap and water solution. Works great!'
});

// Admin (brand expert) replies
await app.threads.reply(collectionId, appId, question.id, {
  authorId: 'user_expert_sarah',
  authorType: 'brand_expert',
  text: 'Our official leather care kit is perfect for this. Avoid harsh chemicals.',
  productLink: 'prod_leather_care_kit'
}, true); // admin endpoint

// Admin marks as resolved
await app.threads.update(collectionId, appId, question.id, {
  status: 'resolved'
}, true);
```

### Use Case: Forum-Style Discussions

List recent discussions with reply counts:

```typescript
// Get active threads
const activeThreads = await app.threads.list(collectionId, appId, {
  status: 'open',
  sort: 'lastReplyAt:desc',
  limit: 20
});

// Filter by tag
const cleaningThreads = await app.threads.list(collectionId, appId, {
  tag: 'cleaning'
});

// Aggregate: most active discussion topics
const topicStats = await app.threads.aggregate(collectionId, appId, {
  groupBy: ['status'],
  metrics: ['count', 'reply_count']
});
```

### Use Case: Product Comments

Attach comments to a specific product:

```typescript
// Create a comment thread for a product
await app.threads.create(collectionId, appId, {
  visibility: 'public',
  parentType: 'product',
  parentId: product.id,
  authorId: user.contactId,
  body: { text: 'Love this product! Best purchase ever.' },
  tags: ['positive']
});

// List all comments for a product
const productComments = await app.threads.list(collectionId, appId, {
  parentType: 'product',
  parentId: product.id,
  sort: 'createdAt:desc'
});
```

---

## Records

**Records** are the most flexible object type — use them for structured data with time-based lifecycles, hierarchies, or custom schemas. Records also support **structured targeting** — each record can declare which products, variants, batches, or proofs it applies to (via anchor fields), or which product attributes match (via `facetRule`), and the platform can match records against a runtime context.

### When to Use Records

- **Bookings/Reservations** — track appointments with start/end times
- **Licenses** — manage software licenses with expiration
- **Subscriptions** — track subscription status and renewal
- **Certifications** — store certifications with expiry dates
- **Events** — track event registrations and attendance
- **Usage logs** — record product usage metrics
- **Audit trails** — immutable logs of actions
- **Loyalty points** — track points earned/redeemed
- **Per-product / per-facet configuration** — scoped data that varies by product axis (see [app-records-pattern.md](app-records-pattern.md))

### Key Features

- **Record types** — `recordType` field for categorization (required)
- **Time windows** — `startsAt` and `expiresAt` for time-based data
- **Anchor fields** — `productId`, `variantId`, `batchId`, `proofId` restrict which context the record applies to
- **Facet rules** — `facetRule` matches records to products based on attribute values
- **Specificity scoring** — `specificity` enables "best match" resolution across multiple targeted records
- **Parent linking** — attach to products, proofs, contacts, etc.
- **Author tracking** — `authorId` + `authorType`
- **Status lifecycle** — custom statuses (default `'active'`)
- **References** — optional `ref` field for external IDs; auto-derived from anchor fields if omitted

### Targeted Records

Records use flat anchor fields to declare what context they apply to. A record with no anchor fields is universal — it applies everywhere. Populated anchor fields restrict the context to a specific product, variant, batch, or proof.

```typescript
import { app } from '@proveanything/smartlinks';

// A nutrition record anchored to a specific product
await app.records.create(collectionId, appId, {
  recordType: 'nutrition',
  productId: 'prod_abc',
  data: { calories: 250, protein: 12.5 },
}, true);

// A nutrition record for a specific variant, overriding the product-level record
await app.records.create(collectionId, appId, {
  recordType: 'nutrition',
  productId: 'prod_abc',
  variantId: 'var_500ml',
  data: { calories: 260, protein: 12.5 },
}, true);

// A record matching products by facet rule (applies to all products with tier=gold)
await app.records.create(collectionId, appId, {
  recordType: 'loyalty_promo',
  facetRule: {
    all: [{ facetKey: 'tier', anyOf: ['gold', 'platinum'] }],
  },
  data: { discountPercent: 15 },
}, true);
```

The `ref` field is derived automatically from anchor fields when omitted:

```
productId: 'prod_abc'                               → ref: 'product:prod_abc'
productId: 'prod_abc', variantId: 'var_x'          → ref: 'product:prod_abc/variant:var_x'
(no anchor fields)                                  → ref: '' (collection-level catch-all)
facetRule: { ... }                                  → ref: 'rule:<ulid>'
```

#### Specificity scores

When multiple scoped records match a context, they are ordered by `specificity`. Higher = more specific:

| Field / element | Points |
|-----------------|--------|
| `proofId` | +1000 |
| `batchId` | +500 |
| `variantId` | +250 |
| `productId` | +100 |
| Per `facetRule` clause | +50 |
| Per `anyOf` value | +1 |
| No anchors / no rule | 0 |

### Resolution order

When the public side of a records-based app needs "the data that applies to this product context", the platform walks a canonical chain from most-specific to least-specific:

```
proof  →  batch  →  variant  →  product  →  rule(*)  →  facet(*)  →  collection
```

- `rule(*)` — `facetRule`-targeted records are scored by **specificity** (number of clauses + number of constrained values). The most specific rule wins at its tier.
- `facet(*)` — legacy single-facet anchors, walked alphabetically. Prefer `facetRule` for new work.
- `collection` — the top of the chain and the catch-all for any record with no anchor fields. **There is no `'global'` tier above collection.**

For a **singleton** record type (one answer wins), use `useResolvedRecord` — it performs this walk server-side and returns the first match plus a `matchedAt` tag. For a **collection** record type (every match is shown), use `useCollectedRecords`. See [app-records-pattern.md §2](app-records-pattern.md#2-resolution-order-one-canonical-chain) for the full guide.

### Singleton Cardinality

By default, `create` always inserts a new row — calling it twice produces two records with identical anchor fields. **Singleton cardinality** changes that: pass `singletonPer` on creation and the server will **upsert** instead, ensuring at most one record of a given `recordType` exists per scope boundary.

```typescript
// Ensure only one active registration record per product per contact
await app.records.create(collectionId, appId, {
  recordType: 'product_registration',
  visibility: 'owner',
  contactId: user.contactId,
  productId: product.id,
  singletonPer: 'product',   // one per (appId + recordType + contactId + productId)
  data: { registeredAt: new Date().toISOString() },
});
```

`singletonPer` values and the scope they enforce:

| Value | De-duplicates across |
|-------|---------------------|
| `'collection'` | entire app (one record of this type per app) |
| `'product'` | `productId` |
| `'variant'` | `variantId` |
| `'batch'` | `batchId` |
| `'proof'` | `proofId` |

The server assigns a **`singletonKey`** to each record that is governed by this rule — an opaque, stable string that acts as the upsert key. If a record with the same key already exists the server updates it in place (clearing `deletedAt` if it was soft-deleted) and returns the existing `id`. `singletonKey` is read-only and exposed on `AppRecord` for debugging but has no meaning to clients.

**When to use `singletonPer`:**
- One loyalty card per contact per product
- One registration per proof scan
- One active subscription record per variant
- Any "find-or-create" pattern where calling `create` twice should be idempotent

### Matching Records Against a Context

Use `app.records.match()` to find records whose scope is satisfied by a runtime target:

```typescript
// Find all nutrition records that apply for this product + facet context
const { data } = await app.records.match(collectionId, appId, {
  target: {
    productId: 'prod_abc',
    facets: { tier: ['gold'] },
  },
  recordType: 'nutrition',
}, true);
// data is ordered by specificity descending — most specific first
// each entry carries a `matchedAt` field indicating which dimension matched

// Use strategy: 'best' to get only the single winner per recordType
const { data: best } = await app.records.match(collectionId, appId, {
  target: { productId: 'prod_abc', variantId: 'var_500ml' },
  strategy: 'best',
}, true);
// best[0] → the highest-specificity record for this context
```

Facet matching rules:
- Multiple `facets` clauses are **ANDed** — all must be satisfied
- Values within a single clause are **ORed** — any matching value satisfies it
- A record with no facet clauses is satisfied by any target

#### `matchedAt` — match attribution

Every record in the response includes a `matchedAt` field indicating **which matching dimension caused the match**. Use it to render attribution labels:

```typescript
const { data } = await app.records.match(collectionId, appId, { target, recordType: 'nutrition' }, true);

for (const entry of data) {
  switch (entry.matchedAt) {
    case 'rule':       /* "Matches rule" */           break;
    case 'proof':      /* "Scan-specific" */          break;
    case 'batch':      /* "Batch-specific" */         break;
    case 'variant':    /* "Size-specific" */          break;
    case 'product':    /* "Inherited from product" */ break;
    case 'facet':      /* "Tier-specific" */          break;
    case 'collection': /* "Collection default" */     break;
  }
}
```

Precedence follows: `proof > batch > variant > product > rule > facet > collection`. There is no scope above `collection` — a record with no anchor fields is a collection-level catch-all.

#### React — `useResolvedRecord`

For React consumers, the `useResolvedRecord` hook in `@proveanything/smartlinks-utils-ui` wraps `records.match()` and returns the best-matching record with loading and error states. The raw `records.match()` API exists for non-React consumers and custom resolution logic.

### Facet-Rule Records

A record can declare a **multi-clause boolean rule** (`facetRule`) describing which products it applies to, instead of a single `scope.facets` entry. The rule is AND across facet keys, OR within values of each key:

```typescript
// Create a record that matches all Samsung TVs and laptops
await app.records.create(collectionId, appId, {
  recordType: 'warranty',
  facetRule: {
    all: [
      { facetKey: 'brand', anyOf: ['samsung'] },
      { facetKey: 'type',  anyOf: ['tv', 'laptop'] },
    ],
  },
  data: { warrantyYears: 2 },
}, true);
```

`facetRule` and anchor fields (`productId`, `variantId`, etc.) are mutually exclusive. A record uses either anchor-based targeting or a facetRule, never both. The server assigns `ref: 'rule:<ulid>'` automatically.

Specificity for rule records: `Σ (50 + clause.anyOf.length)` across all clauses. A 2-clause rule with 1 value each scores `(50+1)+(50+1) = 102`, which ranks above a plain product-scoped record (100) in `resolveAll()` results.

Use `records.previewRule()` to see which products a rule would match before creating it:

```typescript
const { matchingProducts, total } = await app.records.previewRule(collectionId, appId, {
  facetRule: {
    all: [{ facetKey: 'brand', anyOf: ['samsung'] }],
  },
});
// total: 42, matchingProducts: [{ productId: 'prod_001', facets: {...} }, ...]
```

### Resolve All

Use `app.records.resolveAll()` to fetch **every applicable record for a product context** in one request—across all tiers (proof, batch, variant, product, rule, facet, collection defaults), deduplicated and sorted by specificity:

```typescript
// All records that apply to this product context (admin)
const { records, total, truncated } = await app.records.resolveAll(collectionId, appId, {
  context: {
    productId: 'prod_001',
    facets: { brand: 'samsung', type: 'tv' },
  },
  recordType: 'warranty',
}, true);

for (const entry of records) {
  console.log(entry.matchedAt, entry.specificity, entry.record.id);
  if (entry.matchedAt === 'rule') {
    console.log('rule fired:', entry.matchedRule, 'clauses:', entry.matchedClauseCount);
  }
}

// Public endpoint — visibility-filtered (admin records excluded)
const { records: publicRecords } = await app.records.resolveAll(collectionId, appId, {
  context: { productId: 'prod_001', facets: { brand: 'samsung' } },
}, false);

// Filter to specific tiers
const { records: ruleRecords } = await app.records.resolveAll(collectionId, appId, {
  context: { productId: 'prod_001', facets: { brand: 'samsung', type: 'tv' } },
  tiers: ['product', 'rule', 'collection'],
}, true);
```

`truncated: true` means the result hit the safety cap (default 500). Raise it with `limit` (max 5000).

### Upsert

Create-or-update a record by `ref` in a single call:

```typescript
const { created } = await app.records.upsert(collectionId, appId, {
  ref: 'product:prod_abc',
  recordType: 'nutrition',
  productId: 'prod_abc',
  data: { calories: 250, protein: 12.5 },
});
// created: true if new, false if updated
```

### Bulk Operations

Upsert or delete large sets of records efficiently:

```typescript
// Bulk upsert up to 500 records in one transaction
const result = await app.records.bulkUpsert(collectionId, appId, [
  { ref: 'product:prod_abc', recordType: 'nutrition', productId: 'prod_abc', data: { calories: 250 } },
  { ref: 'product:prod_xyz', recordType: 'nutrition', productId: 'prod_xyz', data: { calories: 180 } },
]);
// result: { saved: 2, failed: 0, results: [...] }

// Bulk delete by explicit refs
await app.records.bulkDelete(collectionId, appId, {
  refs: ['product:prod_abc', 'product:prod_xyz'],
  recordType: 'nutrition',
});

// Bulk delete by anchor (all records under a product)
await app.records.bulkDelete(collectionId, appId, {
  scope: { productId: 'prod_abc' },
});
```

### Soft-Delete Semantics

`delete` and `bulkDelete` **soft-delete** records: the row is retained with a non-null `deletedAt` and excluded from all queries by default. Records are **recoverable indefinitely** — there is no expiry on `deletedAt`.

```typescript
// Single-record restore
const restored = await app.records.restore(collectionId, appId, recordId);

// List including deleted records (admin only)
const all = await app.records.list(collectionId, appId, {
  recordType: 'nutrition',
  includeDeleted: true,
}, true);
// all.data includes records with non-null deletedAt
```

`bulkDelete` is fully reversible: rows survive with their IDs intact. Restore individually via `restore`, or re-write via `bulkUpsert` (which will find the existing row by `ref` and update it, clearing `deletedAt` in the process).

### Text Search

The `q` parameter on `GET /records` performs a **case-insensitive substring match** (`ILIKE`) on `data->>'label'`. It works on both admin and public list endpoints today:

```typescript
const results = await app.records.list(collectionId, appId, {
  recordType: 'product',
  q: 'premium',
}, true);
// returns records where data.label contains 'premium' (case-insensitive)
```

> `q` is not a full-text index and does not return ranked results. For ranked relevance search over large corpora, use the Elasticsearch integration.

### External ID / ETL Workflow

`customId` and `sourceSystem` provide a stable external key pair for loading records from external systems (CMS, ERP, PIM, etc.):

- Both fields are **indexed** via a composite index on `(sourceSystem, customIdNormalized)`.
- `customId` is **filterable** on `GET /records?customId=x&sourceSystem=y`.
- The pair is **not unique** — the same external ID can exist across different `recordType` values by design (a CMS slug can appear in both a `content` and a `nutrition` record).
- `upsert` currently keys on `ref`, not `customId`. The recommended ETL pattern is to derive a stable `ref` from the external ID and pass `customId` alongside:

```typescript
// Idiomatic ETL upsert: ref is derived from the external key, customId carries it too
await app.records.upsert(collectionId, appId, {
  ref: `cms:${slug}`,          // stable find-or-create key
  customId: slug,
  sourceSystem: 'contentful',
  recordType: 'content_page',
  productId,
  data: { title, body },
});
// upsert finds-or-creates by ref deterministically,
// customId is stored for later reverse-lookup via ?customId=&sourceSystem=
```

### Counts by Record Type

`aggregate()` returns counts grouped by `record_type` in a single round-trip — no separate endpoint needed:

```typescript
const stats = await app.records.aggregate(collectionId, appId, {
  groupBy: ['record_type'],
  metrics: ['count'],
  // Optionally narrow the corpus:
  filters: { status: 'active' },
}, true);
// stats.groups → [{ record_type: 'nutrition', count: 42 }, { record_type: 'loyalty_promo', count: 7 }, ...]
// Ordered by count descending
```

You can also combine with other filters:

```typescript
// Counts per type for a specific product
await app.records.aggregate(collectionId, appId, {
  groupBy: ['record_type'],
  metrics: ['count'],
  filters: { product_id: 'prod_abc' },
}, true);
```

### Canonical Ref Format

The `ref` field is **server-derived** when anchor fields are provided and `ref` is omitted. Clients should never construct ref strings manually. The authoritative grammar is slash-joined:

```
[product:{productId}/][variant:{variantId}/][batch:{batchId}/][proof:{proofId}]
```

Examples:

| Anchor fields | Derived ref |
|---------------|-------------|
| `productId: 'prod_abc'` | `product:prod_abc` |
| `productId: 'prod_abc', variantId: 'var_500ml'` | `product:prod_abc/variant:var_500ml` |
| `batchId: 'batch_q1'` | `batch:batch_q1` |
| `facetRule: { ... }` | `rule:<ulid>` |
| *(no anchor fields)* | `''` (collection-level catch-all) |

`parseRef` / `buildRef` in `data/refs.ts` should be used for **display and URL round-tripping only**, never as upsert keys. For ETL use cases, set an explicit `ref` using a stable external key (see [External ID / ETL Workflow](#external-id--etl-workflow)).

`startsAt` and `expiresAt` control record active windows. The list and match endpoints respect scheduling by default (only returning currently-active records). Override with:

```typescript
// Include future records and expired records
await app.records.list(collectionId, appId, {
  includeScheduled: true,
  includeExpired: true,
}, true);

// Preview what records will be active at a future point in time
await app.records.match(collectionId, appId, {
  target: { productId: 'prod_abc' },
  at: '2026-06-01T00:00:00Z',
}, true);
```

### Example: Product Registration

```typescript
import { app } from '@proveanything/smartlinks';

// Customer registers a product
const registration = await app.records.create(collectionId, appId, {
  recordType: 'product_registration',
  visibility: 'owner',
  status: 'active',
  productId: product.id,
  proofId: proof.id,
  contactId: user.contactId,
  authorId: user.contactId,
  authorType: 'customer',
  startsAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 365*24*60*60*1000).toISOString(), // 1 year warranty
  data: {
    registrationNumber: 'REG-2026-1234',
    purchaseDate: '2026-02-15',
    retailer: 'Best Electronics'
  },
  owner: {
    serialNumber: 'SN-9922736',
    installDate: '2026-02-20',
    location: 'Home office'
  }
});

// List active registrations for a customer
const activeRegistrations = await app.records.list(collectionId, appId, {
  contactId: user.contactId,
  recordType: 'product_registration',
  status: 'active'
});

// Find expiring registrations (admin)
const expiringSoon = await app.records.list(collectionId, appId, {
  recordType: 'product_registration',
  expiresAt: `lte:${new Date(Date.now() + 30*24*60*60*1000).toISOString()}` // next 30 days
}, true);
```

### Example: Appointment Booking

```typescript
// Customer books a service appointment
const booking = await app.records.create(collectionId, appId, {
  recordType: 'service_appointment',
  visibility: 'owner',
  contactId: user.contactId,
  startsAt: '2026-03-15T10:00:00Z',
  expiresAt: '2026-03-15T11:00:00Z', // 1-hour appointment
  data: {
    serviceType: 'installation',
    location: 'Customer site',
    technician: null // assigned later
  },
  owner: {
    address: '123 Main St',
    phone: '555-1234',
    notes: 'Call before arrival'
  }
});

// Admin assigns technician
await app.records.update(collectionId, appId, booking.id, {
  data: {
    serviceType: 'installation',
    location: 'Customer site',
    technician: 'tech_john'
  },
  admin: {
    cost: 150.00,
    travelTime: 30
  }
}, true);

// List today's appointments
const today = new Date().toISOString().split('T')[0];
const todaysAppointments = await app.records.list(collectionId, appId, {
  recordType: 'service_appointment',
  startsAt: `gte:${today}T00:00:00Z`,
  sort: 'startsAt:asc'
}, true);
```

### Example: Usage Tracking

```typescript
// Log product usage (could be triggered by IoT device)
await app.records.create(collectionId, appId, {
  recordType: 'usage_log',
  visibility: 'admin',
  productId: product.id,
  proofId: proof.id,
  startsAt: new Date().toISOString(),
  data: {
    metric: 'power_on',
    duration: 3600, // seconds
    location: 'geo:37.7749,-122.4194'
  }
}, true);

// Aggregate usage metrics
const usageStats = await app.records.aggregate(collectionId, appId, {
  filters: {
    record_type: 'usage_log',
    created_at: {
      gte: '2026-02-01',
      lte: '2026-02-28'
    }
  },
  groupBy: ['product_id'],
  metrics: ['count']
}, true);
```

---

## Public Create Policies

Control who can create objects on **public endpoints** by setting a `publicCreate` policy on your app's config document (identified by `appId` within your collection).

Set the policy via:
```
POST /api/v1/admin/collection/:collectionId/apps/:appId
```

The server reads this document at request time — no cache invalidation or service restart is required.

### Policy Structure

Each object type (`cases`, `threads`, `records`) has **independent branches** for anonymous and authenticated callers. Each branch carries its own `allow` flag, optional field overrides (`enforce`), and — for records — optional edit-token config (`edit`).

```typescript
interface PublicCreatePolicy {
  cases?:   PublicCreateObjectRule
  threads?: PublicCreateObjectRule
  records?: PublicCreateObjectRule
}

interface PublicCreateObjectRule {
  anonymous?:     PublicCreateBranch
  authenticated?: PublicCreateBranch
}

interface PublicCreateBranch {
  /** Whether creation is permitted for this caller class */
  allow: boolean

  /**
   * Hard overrides merged over the caller's body before writing.
   * Lock down visibility and status regardless of what clients send.
   */
  enforce?: {
    visibility?: 'public' | 'owner' | 'admin'
    status?:     string
  }

  /**
   * Anonymous edit-token config — records only.
   * See "Anonymous Edit Tokens" section below.
   */
  edit?: {
    editToken:      boolean
    windowMinutes?: number  // omit for no expiry
  }
}
```

#### Visibility enforcement guard-rails

The server silently corrects misconfigured visibility values:

| Caller type     | `enforce.visibility` supplied | Server overrides to |
|-----------------|-------------------------------|---------------------|
| `anonymous`     | `'owner'`                     | `'admin'`           |
| `authenticated` | `'public'`                    | `'owner'`           |

These guards exist because anonymous callers have no identity to own a record, and `'public'` visibility on authenticated-only objects would be a misconfiguration.

### Example Policies

**Support tickets from anyone:**

```json
{
  "publicCreate": {
    "cases": {
      "anonymous": {
        "allow": true,
        "enforce": { "visibility": "public", "status": "open" }
      },
      "authenticated": {
        "allow": true,
        "enforce": { "visibility": "owner", "status": "open" }
      }
    }
  }
}
```

**Public Q&A threads, authenticated only:**

```json
{
  "publicCreate": {
    "threads": {
      "anonymous":     { "allow": false },
      "authenticated": {
        "allow": true,
        "enforce": { "visibility": "public", "status": "open" }
      }
    }
  }
}
```

**Anonymous record creation with edit token (30-minute window):**

```json
{
  "publicCreate": {
    "records": {
      "anonymous": {
        "allow": true,
        "enforce": { "visibility": "public", "status": "pending" },
        "edit": {
          "editToken": true,
          "windowMinutes": 30
        }
      },
      "authenticated": {
        "allow": true,
        "enforce": { "visibility": "owner", "status": "pending" }
      }
    }
  }
}
```

**No public record creation:**

```json
{
  "publicCreate": {
    "records": {
      "anonymous":     { "allow": false },
      "authenticated": { "allow": false }
    }
  }
}
```

The `enforce` values are **merged over** the caller's request body, so you can lock down fields like `visibility` and `status` regardless of what clients send.

---

## Owner Edit Policy

Gives per-zone, field-level control over what an **authenticated record owner** can update via `PATCH /api/v1/public/collection/:collectionId/app/:appId/records/:recordId`.

Set the policy in the same app config document used for `publicCreate` (stored at `sites/{collectionId}/apps/{appId}`):

```json
{
  "ownerEdit": {
    "records": {
      "data":  { "allow": ["paypalEmail"] },
      "owner": { "allow": ["paypalEmail", "paypalEmailUpdatedAt"] }
    }
  }
}
```

### Zone visibility and write access

| Zone    | Who can read           | Who can write (owner)                                    |
|---------|------------------------|----------------------------------------------------------|
| `data`  | public                 | Allow-listed keys only (if policy set); all keys if not  |
| `owner` | owner + admin          | Allow-listed keys only (if policy set); all keys if not  |
| `admin` | admin                  | Never — admin zone is always immutable to owners         |

### Allow-list semantics

| Config                     | Behaviour                                                                     |
|----------------------------|-------------------------------------------------------------------------------|
| No `ownerEdit` key         | Default-allow — both zones fully writable (no change to existing behaviour)   |
| `allow` array with keys    | Only the listed keys are accepted from the PATCH body; the rest are silently ignored and their existing values preserved |
| `allow: []` (empty array)  | Zone is effectively read-only for the owner                                   |

Accepted keys are **merged** onto the existing zone blob — you do not need to re-send unchanged values.

### Example: commission record with protected fields

An app that lets owners update their payout email but not their commission total:

```json
{
  "ownerEdit": {
    "records": {
      "owner": { "allow": ["paypalEmail", "paypalEmailUpdatedAt"] }
    }
  }
}
```

A PATCH body of `{ "owner": { "paypalEmail": "x@y.com", "totalCommission": 99 } }` will update `paypalEmail` only. `totalCommission` is silently ignored and its existing value is preserved.

> **App design note:** If your app creates records with sensitive fields that owners should never modify (e.g. computed totals, server-assigned fields), add an `ownerEdit` policy from the start. It is significantly easier to relax restrictions later than to tighten them after data has been mutated.

---

## Anonymous Edit Tokens

Enables an anonymous caller to amend a record they just created — without authentication — by presenting a short-lived secret token.

Designed for flows where a client needs to make a follow-up update before a server-side process locks the record. Common examples: payment + confirmation, multi-step forms, IoT device registration.

### How It Works

```
1. Configure — set publicCreate.records.anonymous.edit.editToken: true in app config
2. Create    — anonymous POST /records returns { ...record, editToken: "3f8a2c1e..." }
               Token is stored in record's admin zone; never visible again
3. Amend     — PATCH /records/:recordId with X-Edit-Token header
               Only the data zone may be modified
4. Expiry    — if windowMinutes is set, token is rejected after that many minutes
```

### SDK Usage

```typescript
import { app } from '@proveanything/smartlinks';

// Step 1: Create the record (anonymous caller — no auth token)
const response = await app.records.create(collectionId, appId, {
  recordType: 'payment',
  visibility: 'public',
  data: { amount: 9900, currency: 'USD' },
})

// editToken is present only when the policy has editToken: true
const { editToken } = response  // ⚠️ store immediately — returned once only

// Step 2: After external confirmation (e.g. payment gateway callback)
const updated = await app.records.updateWithToken(
  collectionId,
  appId,
  response.id,
  { amount: 9900, currency: 'USD', transactionId: 'txn_abc123' },
  editToken,
)
```

`app.records.updateWithToken()` sends the token as the `X-Edit-Token` request header on the public PATCH endpoint — no auth token needed.

### Creation Response Shape

```typescript
interface CreateRecordResponse extends AppRecord {
  /**
   * Present only on anonymous creation when editToken policy is enabled.
   * Returned ONCE — store it client-side immediately.
   */
  editToken?: string
}
```

Example creation response:

```json
{
  "id": "a1b2c3d4-...",
  "recordType": "payment",
  "status": "pending",
  "visibility": "public",
  "data": { "amount": 9900, "currency": "USD" },
  "createdAt": "2026-04-16T12:00:00.000Z",
  "editToken": "3f8a2c1e..."
}
```

### Amendment Scope

Anonymous token updates may only modify the **`data` zone**. The following are immutable via this path:

- `owner`, `admin` zones
- `status`, `visibility`
- All indexed fields (`recordType`, `ref`, `startsAt`, `expiresAt`, etc.)

### Error Codes

| HTTP | `errorCode`            | Meaning                                          |
|------|------------------------|--------------------------------------------------|
| 401  | `UNAUTHORIZED`         | No auth token and no `X-Edit-Token` header       |
| 403  | `FORBIDDEN`            | `editToken` policy not enabled for this app      |
| 403  | `FORBIDDEN`            | Token does not match                             |
| 403  | `EDIT_WINDOW_EXPIRED`  | `windowMinutes` elapsed since record creation    |
| 404  | `NOT_FOUND`            | Record does not exist                            |

### Security Notes

- The token is stored in `admin.editToken` and is **always stripped** from public and owner responses — it cannot be read back after creation.
- Token comparison uses `crypto.timingSafeEqual` to prevent timing-based oracle attacks.
- The token is a 32-byte (`crypto.randomBytes(32)`) hex string — 256 bits of entropy.
- For sensitive flows, combine `windowMinutes` with a server-side process that removes or overwrites the token once the record is confirmed.

---

## Aggregations and Analytics

All three object types support powerful aggregation queries for dashboards and reports.

### Aggregation Capabilities

```typescript
interface AggregateRequest {
  filters?: {
    status?: string
    category?: string          // cases only
    record_type?: string       // records only
    product_id?: string
    created_at?: { gte?: string; lte?: string }
    closed_at?: '__notnull__' | { gte?: string; lte?: string }  // cases
    expires_at?: { lte?: string }  // records
  }
  groupBy?: string[]    // dimension breakdown
  metrics?: string[]    // calculated values
  timeSeriesField?: string
  timeSeriesInterval?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
}
```

### Cases Aggregations

**Group by dimensions:**  
`status`, `priority`, `category`, `assigned_to`, `product_id`, `contact_id`

**Metrics:**  
`count`, `avg_close_time`, `p50_close_time`, `p95_close_time`

```typescript
// Average resolution time by category
const metrics = await app.cases.aggregate(collectionId, appId, {
  filters: {
    closed_at: '__notnull__'
  },
  groupBy: ['category'],
  metrics: ['count', 'avg_close_time', 'p95_close_time']
}, true);

// Result:
// {
//   groups: [
//     { category: 'warranty', count: 45, avg_close_time_seconds: 7200, p95_close_time_seconds: 14400 },
//     { category: 'support', count: 89, avg_close_time_seconds: 3600, p95_close_time_seconds: 10800 }
//   ]
// }
```

### Threads Aggregations

**Group by dimensions:**  
`status`, `author_type`, `product_id`, `visibility`, `contact_id`

**Metrics:**  
`count`, `reply_count`

```typescript
// Most active discussion authors
const authorStats = await app.threads.aggregate(collectionId, appId, {
  groupBy: ['author_type'],
  metrics: ['count', 'reply_count']
});
```

### Records Aggregations

**Group by dimensions:**  
`status`, `record_type`, `product_id`, `author_type`, `visibility`, `contact_id`

**Metrics:**  
`count`

```typescript
// Bookings by status
const bookingStats = await app.records.aggregate(collectionId, appId, {
  filters: {
    record_type: 'service_appointment'
  },
  groupBy: ['status'],
  metrics: ['count']
}, true);
```

### Time Series

Generate time-based charts:

```typescript
// Cases created per week
const casesTrend = await app.cases.aggregate(collectionId, appId, {
  timeSeriesField: 'created_at',
  timeSeriesInterval: 'week',
  metrics: ['count']
}, true);

// Result:
// {
//   timeSeries: [
//     { bucket: '2026-W07', count: 23 },
//     { bucket: '2026-W08', count: 31 },
//     { bucket: '2026-W09', count: 28 }
//   ]
// }
```

---

## Common Patterns

### Pattern: Related Data

Cases have a built-in `related()` endpoint to fetch associated threads and records:

```typescript
// Get all related content for a case
const related = await app.cases.related(collectionId, appId, caseId);
// Returns: { threads: [...], records: [...] }
```

For threads and records, use parent linking:

```typescript
// Create a thread about a case
await app.threads.create(collectionId, appId, {
  parentType: 'case',
  parentId: caseId,
  body: { text: 'Follow-up discussion about this case' }
});

// List all threads for a case
const caseThreads = await app.threads.list(collectionId, appId, {
  parentType: 'case',
  parentId: caseId
});
```

### Pattern: Hierarchical Records

Use `parentType` and `parentId` to build hierarchies:

```typescript
// Parent record: subscription
const subscription = await app.records.create(collectionId, appId, {
  recordType: 'subscription',
  data: { plan: 'premium', billingCycle: 'monthly' }
});

// Child records: invoices
await app.records.create(collectionId, appId, {
  recordType: 'invoice',
  parentType: 'subscription',
  parentId: subscription.id,
  data: { amount: 29.99, period: '2026-02' }
});

// List all invoices for a subscription
const invoices = await app.records.list(collectionId, appId, {
  recordType: 'invoice',
  parentType: 'subscription',
  parentId: subscription.id
});
```

### Pattern: Audit Trails

Use admin-only records to log changes:

```typescript
async function auditLog(action: string, details: any) {
  await app.records.create(collectionId, appId, {
    recordType: 'audit_log',
    visibility: 'admin',
    authorId: currentUser.id,
    authorType: 'admin',
    data: {
      action,
      timestamp: new Date().toISOString(),
      ...details
    }
  }, true);
}

// Usage
await auditLog('case_reassigned', {
  caseId: 'case_123',
  from: 'user_jane',
  to: 'user_bob'
});
```

### Pattern: Notifications

Combine with the realtime API to notify users of changes:

```typescript
import { app, realtime } from '@proveanything/smartlinks';

// When a case is updated
await app.cases.update(collectionId, appId, caseId, { status: 'resolved' }, true);

// Notify the contact
await realtime.publish(collectionId, `contact:${contactId}`, {
  type: 'case_resolved',
  caseId,
  message: 'Your support case has been resolved'
});
```

---

## Best Practices

### Use the Right Object Type

| Need | Use |
|------|-----|
| Track something that needs resolution | **Cases** |
| Build a discussion or comment system | **Threads** |
| Store time-sensitive or hierarchical data | **Records** |

### Zone Allocation Strategy

- **`data`** — Put information that's safe for anyone to see (even if `visibility` is `owner`)
- **`owner`** — Store user-specific preferences, addresses, contact info
- **`admin`** — Keep internal notes, costs, sensitive metadata

### Visibility Defaults

- **User-facing content** → `visibility: 'public'` (Q&A, reviews, forums)
- **Private user data** → `visibility: 'owner'` (support cases, bookings)
- **Internal data** → `visibility: 'admin'` (audit logs, analytics)

### Indexing and Performance

For high-volume queries, consider:
- Filter by `status`, `recordType`, or `category` to reduce result sets
- Use `limit` and `offset` for pagination (max 500 per page)
- Use aggregations instead of fetching all records and counting client-side
- Index commonly filtered fields if you add custom indexes

### Status Conventions

While statuses are free-form strings, consider standard conventions:

**Cases:** `open`, `in_progress`, `waiting_customer`, `resolved`, `closed`  
**Threads:** `open`, `closed`, `locked`, `archived`  
**Records:** `active`, `inactive`, `expired`, `cancelled`

---

## Example: Complete Support System

Here's a full workflow combining all three object types:

```typescript
import { app } from '@proveanything/smartlinks';

// 1. Customer submits a warranty claim (case)
const claim = await app.cases.create(collectionId, appId, {
  visibility: 'owner',
  category: 'warranty',
  status: 'open',
  priority: 2,
  productId,
  proofId,
  contactId,
  data: { issue: 'Defective battery' },
  owner: { serialNumber: 'SN-123' }
});

// 2. Customer starts a discussion about the claim (thread)
const discussion = await app.threads.create(collectionId, appId, {
  visibility: 'owner',
  parentType: 'case',
  parentId: claim.id,
  title: 'Questions about my warranty claim',
  body: { text: 'How long will the replacement take?' }
});

// 3. Admin replies to the discussion
await app.threads.reply(collectionId, appId, discussion.id, {
  authorId: 'admin_sarah',
  authorType: 'support_agent',
  text: 'We'll ship a replacement within 2 business days'
}, true);

// 4. Admin approves and creates a shipping record
const shipment = await app.records.create(collectionId, appId, {
  recordType: 'shipment',
  parentType: 'case',
  parentId: claim.id,
  data: {
    carrier: 'UPS',
    tracking: 'UPS-123456789',
    estimatedDelivery: '2026-02-28'
  },
  owner: {
    shippingAddress: '123 Main St'
  },
  admin: {
    cost: 25.00,
    warehouse: 'CA-01'
  }
}, true);

// 5. Admin updates case with history
await app.cases.appendHistory(collectionId, appId, claim.id, {
  entry: {
    action: 'replacement_shipped',
    tracking: 'UPS-123456789'
  },
  historyTarget: 'owner',
  status: 'in_progress'
});

// 6. Customer receives item, admin closes case
await app.cases.update(collectionId, appId, claim.id, {
  status: 'resolved',
  admin: { resolvedBy: 'admin_sarah', satisfactionScore: 5 }
}, true);

// 7. Generate analytics
const monthlyReport = await app.cases.summary(collectionId, appId, {
  period: { from: '2026-02-01', to: '2026-02-28' }
});
```

---

## TypeScript Usage

Import types and functions:

```typescript
import {
  app,
  AppCase, AppThread, AppRecord,
  CreateCaseInput, CreateThreadInput, CreateRecordInput,
  PaginatedResponse, AggregateResponse
} from '@proveanything/smartlinks';

// Fully typed
const newCase: AppCase = await app.cases.create(collectionId, appId, {
  category: 'support',
  data: { issue: 'Login problem' }
});

const threadList: PaginatedResponse<AppThread> = await app.threads.list(
  collectionId,
  appId,
  { limit: 50, sort: 'createdAt:desc' }
);
```

---

## API Reference

For complete endpoint documentation, query parameters, and response schemas, see:

- [API_SUMMARY.md](./API_SUMMARY.md) — Full REST API reference
- [TypeScript source](../src/types/appObjects.ts) — Type definitions
- [API wrappers](../src/api/appObjects.ts) — Implementation

---

## Questions?

These three object types are incredibly flexible building blocks. If you're unsure which to use for your use case, ask yourself:

- Does it need tracking to closure? → **Case**
- Is it a conversation or discussion? → **Thread**
- Is it data with a lifecycle or hierarchy? → **Record**

When in doubt, start with **Records** — they're the most generic and can be shaped to fit almost anything.
