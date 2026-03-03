# Attestations

> Postgres-backed, append-only fact log for any object in the system.

The new `attestations` API replaces the legacy Firestore attestation endpoints and adds polymorphic subjects, three-tier data visibility, cryptographic hash-chain integrity, and time-series analytics.

---

## Table of Contents

- [Overview](#overview)
- [Migration from Legacy Attestations](#migration-from-legacy-attestations)
- [TypeScript Interfaces](#typescript-interfaces)
- [Security & Audience Tiers](#security--audience-tiers)
- [SDK Usage](#sdk-usage)
  - [Admin — Write](#admin--write)
  - [Admin — Read](#admin--read)
  - [Public — Read](#public--read)
  - [Container-Scoped Shortcuts](#container-scoped-shortcuts)
- [REST API Reference](#rest-api-reference)
- [Design Notes](#design-notes)

---

## Overview

An **attestation** is an immutable fact record attached to a subject — a container, a proof, a product, a tag, or any other typed entity.  Records are append-only: once written they are never updated or deleted.

Key properties:

| Property | Description |
|---|---|
| **Polymorphic** | One endpoint covers any `subjectType` |
| **Three data zones** | `value` (public), `ownerData` (owner-tier), `adminData` (admin-tier) |
| **Per-record visibility** | Each record carries its own `visibility` flag |
| **Hash-chain integrity** | SHA-256 `contentHash` chains to the previous record for the same `(subjectType, subjectId, attestationType)` tuple |
| **Tree analytics** | Rollup queries aggregate across an entire container subtree via BFS traversal |

---

## Migration from Legacy Attestations

| | Legacy (Firestore) | New (Postgres) |
|---|---|---|
| **Namespace** | `attestation` | `attestations` |
| **Subject scope** | Proof only (`/product/:pid/proof/:id/attestation`) | Any type: `container`, `proof`, `product`, `tag`, … |
| **Mutability** | Supports update & delete | Append-only (by design) |
| **Data zones** | `public`, `private`, `proof` | `value` (public), `ownerData` (owner), `adminData` (admin) |
| **Integrity** | None | SHA-256 hash chain |

The legacy `attestation` namespace (and its types `AttestationResponse`, `AttestationCreateRequest`, `AttestationUpdateRequest`) are marked `@deprecated`.  The underlying Firestore endpoints remain active for backward-compatibility, but all new integrations should use the `attestations` namespace.

**Migrating a proof attestation write:**

```typescript
// Before (legacy)
await attestation.create(collectionId, productId, proofId, {
  public:  { note: 'Temperature OK' },
  private: {},
  proof:   {},
})

// After (new)
await attestations.create(collectionId, {
  subjectType:     'proof',
  subjectId:       proofId,
  attestationType: 'temperature_check',
  value:           { note: 'Temperature OK', celsius: 4.1 },
  unit:            '°C',
})
```

---

## TypeScript Interfaces

```typescript
type AttestationSubjectType = 'container' | 'proof' | 'product' | 'tag' | 'serial' | 'order_item' | string
type AttestationVisibility  = 'public' | 'owner' | 'admin'
type AttestationAudience    = 'public' | 'owner' | 'admin'
type AttestationGroupBy     = 'hour' | 'day' | 'week' | 'month'

interface Attestation {
  id:              string
  orgId:           string
  collectionId:    string
  subjectType:     AttestationSubjectType
  subjectId:       string
  attestationType: string              // e.g. 'temperature', 'abv', 'angel_share'
  recordedAt:      string              // ISO 8601 — when the fact was true
  visibility:      AttestationVisibility
  value?:          Record<string, any> // Public data zone
  ownerData?:      Record<string, any> // Stripped unless audience >= 'owner'
  adminData?:      Record<string, any> // Stripped unless audience === 'admin'
  unit?:           string
  source?:         string
  authorId?:       string
  metadata?:       Record<string, any>
  contentHash:     string              // SHA-256 of this record (incl. prevHash)
  prevHash?:       string              // contentHash of the preceding record
  createdAt:       string              // ISO 8601 — database insertion time
}

interface LatestAttestation {
  attestationType: string
  latest:          Attestation
}

interface AttestationSummaryBucket {
  period:  string              // e.g. "2025-04-01" for groupBy=day
  count:   number
  values?: Record<string, any>
}

interface ChainVerifyResult {
  valid:        boolean
  checkedCount: number
  failedAt?:    string
  message:      string
}

interface CreateAttestationInput {
  subjectType:     AttestationSubjectType  // required
  subjectId:       string                  // required
  attestationType: string                  // required
  recordedAt?:     string
  visibility?:     AttestationVisibility   // default 'public'
  value?:          Record<string, any>
  ownerData?:      Record<string, any>
  adminData?:      Record<string, any>
  unit?:           string
  source?:         string
  authorId?:       string
  metadata?:       Record<string, any>
}
```

---

## Security & Audience Tiers

### Admin endpoints

All admin endpoints are mounted under `/api/v1/admin/collection/:collectionId/attestations` and require a valid admin session or bearer token.  The caller always receives all three data zones.

### Public endpoints

Public endpoints at `/api/v1/public/collection/:collectionId/attestations` are read-only and require no credentials for `audience='public'` data.

**Owner elevation** — supply a Firebase ID token via `Authorization: Bearer <idToken>`:

```
Authorization: Bearer <Firebase ID Token>
```

The middleware resolves the UID and checks ownership:
- `subjectType=proof` → checks `proof.userId` in Firestore
- `subjectType=container` → checks `container.metadata.proofId`

When ownership is confirmed the request is served at `audience='owner'`, which includes `ownerData`.

### Visibility vs audience

`visibility` is a property of an **individual record** set at write time.  `audience` describes the **caller's tier** resolved at read time.  The server applies:

| Audience | Included records | Data zones |
|---|---|---|
| `'public'` | `visibility='public'` only | `value` only |
| `'owner'` | `'public'` and `'owner'` | `value`, `ownerData` |
| `'admin'` | All records | `value`, `ownerData`, `adminData` |

---

## SDK Usage

Import via the top-level SDK export:

```typescript
import { attestations } from '@proveanything/smartlinks'
```

### Admin — Write

#### Create a single attestation

```typescript
const record = await attestations.create('coll_123', {
  subjectType:     'container',
  subjectId:       'cask-uuid',
  attestationType: 'temperature',
  recordedAt:      '2025-04-15T14:30:00Z',
  value:           { celsius: 12.4 },
  ownerData:       { sensorId: 'TEMP-7' },
  unit:            '°C',
  visibility:      'public',
})
```

#### Batch-create attestations

```typescript
const records = await attestations.createBatch('coll_123', [
  { subjectType: 'container', subjectId: 'cask-uuid', attestationType: 'temperature', value: { celsius: 12.4 } },
  { subjectType: 'container', subjectId: 'cask-uuid', attestationType: 'humidity',    value: { rh: 68 } },
])
```

### Admin — Read

#### List attestations

```typescript
const { attestations: records } = await attestations.list('coll_123', {
  subjectType:     'container',
  subjectId:       'cask-uuid',
  attestationType: 'temperature',
  recordedAfter:   '2025-01-01T00:00:00Z',
  limit:           50,
})
```

#### Time-series summary

```typescript
const { summary } = await attestations.summary('coll_123', {
  subjectType:     'container',
  subjectId:       'cask-uuid',
  attestationType: 'temperature',
  valueField:      'celsius',
  groupBy:         'day',
})
// summary[0] = { period: '2025-04-01', count: 24, values: { celsius_avg: 12.1 } }
```

#### Latest snapshot

Returns one entry per `attestationType` — the most recent record for each type:

```typescript
const { latest } = await attestations.latest('coll_123', {
  subjectType: 'container',
  subjectId:   'fridge-uuid',
})
// latest[0].attestationType === 'temperature'
// latest[0].latest.value    === { celsius: 4.1 }
```

#### Verify hash chain

```typescript
const result = await attestations.verify('coll_123', {
  subjectType:     'container',
  subjectId:       'cask-uuid',
  attestationType: 'temperature',
})
if (!result.valid) {
  console.warn('Chain integrity broken at record:', result.failedAt)
}
```

#### Tree time-series summary

Aggregates attestations across an **entire container subtree** (BFS traversal from a root container):

```typescript
const { summary, subjectCount } = await attestations.treeSummary('coll_123', {
  subjectId:       'warehouse-uuid',
  attestationType: 'temperature',
  valueField:      'celsius',
  groupBy:         'hour',
  includeItems:    true,
})
console.log(`Aggregated over ${subjectCount} subjects`)
```

#### Tree latest snapshot

```typescript
const { latest, subjectCount } = await attestations.treeLatest('coll_123', {
  subjectId:    'warehouse-uuid',
  includeItems: true,
})
```

### Public — Read

#### List (with optional owner elevation)

```typescript
const { attestations: records, audience } = await attestations.publicList('coll_123', {
  subjectType: 'proof',
  subjectId:   'proof-uuid',
})
// audience === 'owner' when a valid Firebase token was provided
```

#### Time-series summary (always public)

```typescript
const { summary } = await attestations.publicSummary('coll_123', {
  subjectType:     'container',
  subjectId:       'cask-uuid',
  attestationType: 'temperature',
  groupBy:         'week',
})
```

#### Latest snapshot

```typescript
const { latest, audience } = await attestations.publicLatest('coll_123', {
  subjectType: 'container',
  subjectId:   'cask-uuid',
})
```

#### Tree variants

```typescript
const { summary, subjectCount } = await attestations.publicTreeSummary('coll_123', {
  subjectId:       'warehouse-uuid',
  attestationType: 'temperature',
  groupBy:         'day',
})

const { latest } = await attestations.publicTreeLatest('coll_123', {
  subjectId: 'warehouse-uuid',
})
```

### Container-Scoped Shortcuts

The public containers router re-exposes attestation endpoints pre-scoped to `subjectType=container`.  Use these when you already have a `containerId`:

```typescript
// List attestations for a container
const { attestations: records } = await attestations.publicContainerList(
  'coll_123',
  'cask-uuid',
  { attestationType: 'temperature', limit: 10 }
)

// Latest snapshot
const { latest } = await attestations.publicContainerLatest('coll_123', 'cask-uuid')

// Time-series summary
const { summary } = await attestations.publicContainerSummary('coll_123', 'cask-uuid', {
  attestationType: 'temperature',
  valueField:      'celsius',
  groupBy:         'day',
})

// Tree summary rooted at this container
const { summary: treeSummary } = await attestations.publicContainerTreeSummary('coll_123', 'warehouse-uuid', {
  attestationType: 'temperature',
  groupBy:         'hour',
})

// Tree latest
const { latest: treeLatest } = await attestations.publicContainerTreeLatest('coll_123', 'warehouse-uuid')
```

---

## REST API Reference

### Admin endpoints

```
POST   /api/v1/admin/collection/:collectionId/attestations
GET    /api/v1/admin/collection/:collectionId/attestations
GET    /api/v1/admin/collection/:collectionId/attestations/summary
GET    /api/v1/admin/collection/:collectionId/attestations/latest
GET    /api/v1/admin/collection/:collectionId/attestations/verify
GET    /api/v1/admin/collection/:collectionId/attestations/tree-summary
GET    /api/v1/admin/collection/:collectionId/attestations/tree-latest
```

#### POST body — single record

```json
{
  "subjectType":     "container",
  "subjectId":       "uuid-of-cask",
  "attestationType": "temperature",
  "recordedAt":      "2025-04-15T14:30:00Z",
  "value":           { "celsius": 12.4 },
  "ownerData":       { "sensorId": "TEMP-7" },
  "unit":            "°C",
  "visibility":      "public"
}
```

#### POST body — batch (array)

```json
[
  { "subjectType": "container", "subjectId": "uuid1", "attestationType": "temperature", "value": { "celsius": 12.4 } },
  { "subjectType": "container", "subjectId": "uuid1", "attestationType": "humidity",    "value": { "rh": 68 } }
]
```

#### GET query parameters (list)

| Parameter | Required | Description |
|---|---|---|
| `subjectType` | ✅ | Subject type |
| `subjectId` | ✅ | Subject UUID |
| `attestationType` | — | Filter by type |
| `recordedAfter` | — | ISO 8601 lower bound |
| `recordedBefore` | — | ISO 8601 upper bound |
| `limit` | — | Default `100` |
| `offset` | — | Default `0` |

#### GET query parameters (summary)

| Parameter | Required | Description |
|---|---|---|
| `subjectType` | ✅ | |
| `subjectId` | ✅ | |
| `attestationType` | ✅ | |
| `valueField` | — | Dot-path inside `value` to aggregate |
| `groupBy` | — | `hour` \| `day` \| `week` \| `month` (default `day`) |
| `recordedAfter` | — | ISO 8601 |
| `recordedBefore` | — | ISO 8601 |
| `limit` | — | Max buckets (default `200`) |

#### GET query parameters (tree-summary / tree-latest)

| Parameter | Required | Description |
|---|---|---|
| `subjectType` | ✅ | Must be `container` |
| `subjectId` | ✅ | Root container UUID |
| `attestationType` | ✅ (tree-summary) | |
| `valueField` | — | |
| `groupBy` | — | |
| `recordedAfter` | — | |
| `recordedBefore` | — | |
| `limit` | — | |
| `includeItems` | — | Include container items in BFS traversal (default `true`) |

### Public endpoints

```
GET    /api/v1/public/collection/:collectionId/attestations
GET    /api/v1/public/collection/:collectionId/attestations/summary
GET    /api/v1/public/collection/:collectionId/attestations/latest
GET    /api/v1/public/collection/:collectionId/attestations/tree-summary
GET    /api/v1/public/collection/:collectionId/attestations/tree-latest
```

Same query parameters as admin.  Add `Authorization: Bearer <idToken>` for owner elevation.

### Container-scoped public shortcuts

```
GET    /api/v1/public/collection/:collectionId/containers/:containerId/attestations
GET    /api/v1/public/collection/:collectionId/containers/:containerId/attestations/summary
GET    /api/v1/public/collection/:collectionId/containers/:containerId/attestations/latest
GET    /api/v1/public/collection/:collectionId/containers/:containerId/attestations/tree-summary
GET    /api/v1/public/collection/:collectionId/containers/:containerId/attestations/tree-latest
```

Identical to the polymorphic routes with `subjectType=container&subjectId=:containerId` pre-filled.

---

## Design Notes

### Append-only records

Attestations must **never** be updated or deleted.  The hash chain exists to make tampering detectable.  To correct a recorded fact, append a new attestation record with a note in `metadata`; run `/verify` to confirm chain integrity.

### Hash chain structure

Each record's `contentHash` is computed as:

```
SHA-256(subjectType + subjectId + attestationType + recordedAt + JSON(value) + prevHash)
```

`prevHash` is the `contentHash` of the immediately preceding record for the same `(subjectType, subjectId, attestationType)` tuple.  The first record in a chain has no `prevHash`.

### Tree analytics use case

The tree endpoints enable queries like *"what was the average temperature inside the warehouse (and all sub-containers and their items) over the last 7 days?"*:

```typescript
const { summary } = await attestations.publicTreeSummary('coll_123', {
  subjectId:       'warehouse-uuid',
  attestationType: 'temperature',
  valueField:      'celsius',
  groupBy:         'day',
  recordedAfter:   sevenDaysAgo,
})
```

This also enables the cold-chain use-case: was a particular item inside a container that exceeded a temperature threshold during a given window?  Cross-reference container attestations with container item membership timestamps using `ContainerItem.addedAt` and `ContainerItem.removedAt`.
