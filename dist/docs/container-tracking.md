# Container Tracking

> Physical or logical groupings with hierarchical nesting, item membership, and attestation history.

---

## Table of Contents

- [Overview](#overview)
- [TypeScript Interfaces](#typescript-interfaces)
- [SDK Usage](#sdk-usage)
  - [Admin — Containers](#admin--containers)
  - [Admin — Item Membership](#admin--item-membership)
  - [Public — Read-Only](#public--read-only)
- [REST API Reference](#rest-api-reference)
- [Attestations on Containers](#attestations-on-containers)
- [Cold-Chain Tracking Example](#cold-chain-tracking-example)
- [Design Notes](#design-notes)

---

## Overview

A **container** is any physical or logical grouping that can hold items and accumulate a history.  Examples:

| `containerType` | What it represents |
|---|---|
| `'pallet'` | A pallet of goods |
| `'fridge'` | A refrigerated unit |
| `'cask'` | A whiskey cask |
| `'shipping_container'` | A maritime shipping container |
| `'warehouse'` | A storage facility |
| `'ship'` | A vessel carrying other containers |

Containers support:

- **Hierarchical nesting** — a ship can contain shipping containers, which contain pallets, which contain individual items.
- **Item membership** — any `tag`, `proof`, `serial`, `order_item`, or nested `container` can be placed in and removed from a container.  Membership is tracked with timestamps so the full history is available.
- **Attestations** — measurements and facts (temperature readings, ABV checks, condition reports, etc.) can be appended to any container using the `attestations` namespace.
- **Soft-delete** — deleting a container only sets `deletedAt`; the record and full item history are preserved.

---

## TypeScript Interfaces

```typescript
type ContainerStatus   = 'active' | 'archived' | string
type ContainerItemType = 'tag' | 'proof' | 'serial' | 'order_item' | 'container'

interface Container {
  id:                 string
  orgId:              string
  collectionId:       string
  containerType:      string           // 'pallet' | 'fridge' | 'cask' | …
  ref?:               string           // Human-readable identifier / barcode
  name?:              string
  description?:       string
  status:             ContainerStatus  // default 'active'
  metadata?:          Record<string, any>
  parentContainerId?: string           // null = top-level
  children?:          Container[]      // Populated when ?tree=true
  items?:             ContainerItem[]  // Populated when ?includeContents=true
  createdAt:          string
  updatedAt:          string
  deletedAt?:         string
}

interface ContainerItem {
  id:           string
  orgId:        string
  containerId:  string
  collectionId?: string
  itemType:     ContainerItemType
  itemId:       string
  productId?:   string
  proofId?:     string
  addedAt:      string
  removedAt?:   string   // null = currently inside; present in history view
  metadata?:    Record<string, any>
}

interface CreateContainerInput {
  containerType:      string        // required
  ref?:               string
  name?:              string
  description?:       string
  status?:            ContainerStatus
  metadata?:          Record<string, any>
  parentContainerId?: string
}

interface UpdateContainerInput {
  containerType?:     string
  ref?:               string
  name?:              string
  description?:       string
  status?:            ContainerStatus
  metadata?:          Record<string, any>
  parentContainerId?: string | null  // null promotes to top-level
}

interface AddContainerItemsInput {
  items: Array<{
    itemType:  ContainerItemType  // required
    itemId:    string             // required
    productId?: string
    proofId?:  string
    metadata?: Record<string, any>
  }>
}

interface RemoveContainerItemsInput {
  ids: string[]   // ContainerItem UUIDs to soft-remove
}
```

---

## SDK Usage

Import via the top-level SDK export:

```typescript
import { containers } from '@proveanything/smartlinks'
```

### Admin — Containers

#### Create a container

```typescript
const cask = await containers.create('coll_123', {
  containerType: 'cask',
  ref:           'CASK-0042',
  name:          'Cask 42 — Single Malt',
  metadata:      { distilleryYear: 2019, capacityLitres: 200 },
})
```

#### List containers

```typescript
// All active pallets
const { containers: pallets } = await containers.list('coll_123', {
  containerType: 'pallet',
  status:        'active',
  limit:         50,
})

// Top-level containers only (no parent)
const { containers: roots } = await containers.list('coll_123', { topLevel: true })
```

#### Get a container — flat, tree, or with contents

```typescript
// Flat (default)
const cask = await containers.get('coll_123', 'cask-uuid')

// Full hierarchy tree (3 levels deep) with current contents
const tree = await containers.get('coll_123', 'warehouse-uuid', {
  tree:            true,
  treeDepth:       3,
  includeContents: true,
})
```

#### Find containers currently holding an item

```typescript
const { containers: holding } = await containers.findForItem('coll_123', {
  itemType: 'proof',
  itemId:   'proof-uuid',
})
```

#### Update a container

```typescript
const updated = await containers.update('coll_123', 'cask-uuid', {
  status:   'archived',
  metadata: { bottledAt: '2025-04-01' },
})

// Promote to top-level (remove parent)
await containers.update('coll_123', 'cask-uuid', { parentContainerId: null })
```

#### Delete (soft) a container

```typescript
await containers.remove('coll_123', 'cask-uuid')
// deletedAt is set; record remains queryable by admins
```

### Admin — Item Membership

#### List current contents

```typescript
const { items } = await containers.listItems('coll_123', 'pallet-uuid')
```

#### List full membership history (including removed items)

```typescript
const { items: history } = await containers.listItems('coll_123', 'pallet-uuid', {
  history: true,
})
// history includes items with removedAt !== null
```

#### Add items to a container

```typescript
const { items } = await containers.addItems('coll_123', 'pallet-uuid', {
  items: [
    { itemType: 'tag',       itemId: 'NFC-00AABBCC' },
    { itemType: 'proof',     itemId: 'proof-uuid',      productId: 'product-id' },
    { itemType: 'container', itemId: 'inner-crate-uuid' },
  ],
})
```

#### Remove items from a container (soft)

```typescript
const result = await containers.removeItems('coll_123', 'pallet-uuid', {
  ids: ['container-item-uuid-1', 'container-item-uuid-2'],
})
console.log(`Removed ${result.removedCount} items`)
```

### Public — Read-Only

```typescript
// List (excludes soft-deleted and non-public containers)
const { containers: list } = await containers.publicList('coll_123', {
  containerType: 'cask',
})

// Get with tree
const tree = await containers.publicGet('coll_123', 'warehouse-uuid', {
  tree: true,
})

// Current contents only (no history on public side)
const { items } = await containers.publicListItems('coll_123', 'cask-uuid')
```

---

## REST API Reference

### Admin endpoints

```
POST   /api/v1/admin/collection/:collectionId/containers
GET    /api/v1/admin/collection/:collectionId/containers
GET    /api/v1/admin/collection/:collectionId/containers/find-for-item
GET    /api/v1/admin/collection/:collectionId/containers/:containerId
PATCH  /api/v1/admin/collection/:collectionId/containers/:containerId
DELETE /api/v1/admin/collection/:collectionId/containers/:containerId
GET    /api/v1/admin/collection/:collectionId/containers/:containerId/items
POST   /api/v1/admin/collection/:collectionId/containers/:containerId/items
DELETE /api/v1/admin/collection/:collectionId/containers/:containerId/items
```

#### GET /containers query parameters

| Parameter | Description |
|---|---|
| `containerType` | Filter by type string |
| `status` | Filter by status |
| `ref` | Filter by reference |
| `parentContainerId` | Filter by parent UUID |
| `topLevel` | `true` to return only root containers |
| `limit` | Default `100` |
| `offset` | Default `0` |

#### GET /containers/:id query parameters

| Parameter | Description |
|---|---|
| `tree` | `true` to recursively embed child containers |
| `treeDepth` | Max nesting depth (default: unlimited) |
| `includeContents` | `true` to embed current items |

#### GET /containers/:id/items query parameters

| Parameter | Description |
|---|---|
| `history` | `true` to include removed items |
| `limit` | Default `100` |
| `offset` | Default `0` |

#### POST /containers/:id/items body

```json
{
  "items": [
    { "itemType": "tag",   "itemId": "NFC-00AABBCC" },
    { "itemType": "proof", "itemId": "proof-uuid",   "productId": "product-id" }
  ]
}
```

#### DELETE /containers/:id/items body

```json
{ "ids": ["container-item-uuid-1", "container-item-uuid-2"] }
```

### Public endpoints

```
GET    /api/v1/public/collection/:collectionId/containers
GET    /api/v1/public/collection/:collectionId/containers/:containerId
GET    /api/v1/public/collection/:collectionId/containers/:containerId/items
```

Same query parameters as admin (minus `history`).  Soft-deleted containers and containers with `metadata.publicListing === false` are excluded from list results.

---

## Attestations on Containers

Attestations (sensor readings, condition reports, etc.) are managed via the `attestations` namespace.  The admin router does **not** expose attestation sub-routes — use the standalone `/admin/.../attestations` router for all admin attestation access.

```typescript
import { attestations } from '@proveanything/smartlinks'

// Record a temperature reading against a cask
await attestations.create('coll_123', {
  subjectType:     'container',
  subjectId:       'cask-uuid',
  attestationType: 'temperature',
  recordedAt:      new Date().toISOString(),
  value:           { celsius: 12.4 },
  unit:            '°C',
})

// Latest readings on all attestation types
const { latest } = await attestations.latest('coll_123', {
  subjectType: 'container',
  subjectId:   'cask-uuid',
})
```

Public shortcuts pre-scoped to a container are also available:

```typescript
const { latest } = await attestations.publicContainerLatest('coll_123', 'cask-uuid')
const { summary } = await attestations.publicContainerSummary('coll_123', 'cask-uuid', {
  attestationType: 'temperature',
  valueField:      'celsius',
  groupBy:         'hour',
})
```

---

## Cold-Chain Tracking Example

**Goal:** determine whether a refrigerated item was inside a fridge when the temperature exceeded a threshold.

```typescript
import { containers, attestations } from '@proveanything/smartlinks'

const collectionId = 'coll_123'
const fridgeId     = 'fridge-uuid'
const proofId      = 'bottle-proof-uuid'
const threshold    = 8  // °C

// 1. Get the full item membership history for the fridge
const { items: history } = await containers.listItems(collectionId, fridgeId, {
  history: true,
})

// 2. Find the window(s) when our bottle was inside the fridge
const bottleIntervals = history
  .filter(item => item.itemType === 'proof' && item.itemId === proofId)
  .map(item => ({
    addedAt:   new Date(item.addedAt),
    removedAt: item.removedAt ? new Date(item.removedAt) : new Date(),
  }))

// 3. Get temperature attestations for the fridge
const { attestations: temps } = await attestations.list(collectionId, {
  subjectType:     'container',
  subjectId:       fridgeId,
  attestationType: 'temperature',
  limit:           1000,
})

// 4. Cross-reference
const excursions = temps.filter(a => {
  const celsius  = a.value?.celsius as number
  const recorded = new Date(a.recordedAt)
  if (celsius <= threshold) return false
  return bottleIntervals.some(
    ({ addedAt, removedAt }) => recorded >= addedAt && recorded <= removedAt
  )
})

if (excursions.length > 0) {
  console.warn(
    `⚠️  ${excursions.length} temperature excursion(s) recorded while the bottle was in the fridge.`
  )
} else {
  console.log('✅  No temperature excursions during the bottle\'s time in the fridge.')
}
```

---

## Design Notes

### Soft-delete

`DELETE /containers/:id` only sets `deletedAt`.  The container and its full item history remain queryable by admins.  The public API automatically excludes deleted containers from all responses.

### Membership history

`ContainerItem` records are never deleted.  When an item is removed, `removedAt` is set.  This means you always have a full audit trail of what was in a container and when, which is essential for provenance and compliance use-cases.

### Public visibility

Containers with `metadata.publicListing === false` are excluded from public list endpoints but remain accessible by direct ID if the caller knows the UUID.  Use this to hide containers from general browsing while still allowing deep-link access.

### Nesting

Containers can be nested arbitrarily.  A container with `containerType='container'` in the `items` list is a child container.  The `findForItem` endpoint performs a flat lookup across all containers — it does not traverse the hierarchy.

### Attestation ownership for containers

Owner elevation on attestation public endpoints resolves ownership via `container.metadata.proofId`.  If you want individual users to receive owner-tier attestation data for a container, set `metadata.proofId` to a proof they own.
