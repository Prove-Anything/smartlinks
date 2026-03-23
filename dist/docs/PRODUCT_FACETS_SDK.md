# Product Facets SDK Reference

Simple SDK-facing reference for the facet API.

This document covers:

- admin facet endpoints
- public facet endpoints
- collection-level facet routes
- TypeScript interfaces for facet definitions, values, and aggregation queries

## Current route model

The facet API stays under `/api/v1`.

Facets are mounted directly under the collection.

### Admin base

```ts
/api/v1/admin/collection/:collectionId/facets
```

### Public base

```ts
/api/v1/public/collection/:collectionId/facets
```

## Admin endpoints

### List facet definitions

```ts
GET /api/v1/admin/collection/:collectionId/facets
```

Optional query params:

```ts
includeValues?: boolean
includeDeleted?: boolean
kind?: 'system' | 'custom'
reserved?: boolean
```

### Create facet definition

```ts
POST /api/v1/admin/collection/:collectionId/facets
```

### Get facet definition

```ts
GET /api/v1/admin/collection/:collectionId/facets/:facetKey
```

Optional query params:

```ts
includeValues?: boolean
includeDeleted?: boolean
```

### Update facet definition

```ts
PUT /api/v1/admin/collection/:collectionId/facets/:facetKey
```

### Delete facet definition

```ts
DELETE /api/v1/admin/collection/:collectionId/facets/:facetKey
```

Current behavior:

- reserved facet definitions cannot be deleted
- facet definitions with product assignments cannot be deleted

### List facet values

```ts
GET /api/v1/admin/collection/:collectionId/facets/:facetKey/values
```

Optional query params:

```ts
includeDeleted?: boolean
```

### Create facet value

```ts
POST /api/v1/admin/collection/:collectionId/facets/:facetKey/values
```

### Get facet value

```ts
GET /api/v1/admin/collection/:collectionId/facets/:facetKey/values/:valueKey
```

Optional query params:

```ts
includeDeleted?: boolean
```

### Update facet value

```ts
PUT /api/v1/admin/collection/:collectionId/facets/:facetKey/values/:valueKey
```

### Delete facet value

```ts
DELETE /api/v1/admin/collection/:collectionId/facets/:facetKey/values/:valueKey
```

Current behavior:

- deleting a facet value removes its product assignments
- affected product `facets` summaries are synchronized after the delete

### Query facet counts

```ts
POST /api/v1/admin/collection/:collectionId/facets/query
```

Supported query filters now:

- `search`
- `status`
- `schemaType`
- `type`
- `productIds`
- `sku`
- `gtin`
- `category`
- `tags`
- `facetEquals`

## Public endpoints

### List facet definitions

```ts
GET /api/v1/public/collection/:collectionId/facets
```

Optional query params:

```ts
includeValues?: boolean
```

### Get facet definition

```ts
GET /api/v1/public/collection/:collectionId/facets/:facetKey
```

Optional query params:

```ts
includeValues?: boolean
```

### List facet values

```ts
GET /api/v1/public/collection/:collectionId/facets/:facetKey/values
```

### Get facet value

```ts
GET /api/v1/public/collection/:collectionId/facets/:facetKey/values/:valueKey
```

### Query facet counts

```ts
POST /api/v1/public/collection/:collectionId/facets/query
```

Public endpoints are read-only.

## TypeScript interfaces

## Core JSON types

```ts
export type JsonPrimitive = string | number | boolean | null

export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue }
```

## Facet definition types

```ts
export interface FacetDefinition {
  id: string
  orgId: string
  collectionId: string
  key: string
  name: string
  description?: string | null
  cardinality: 'single' | 'multi'
  kind: 'system' | 'custom'
  hierarchical: boolean
  reserved: boolean
  config: Record<string, JsonValue>
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  values?: FacetValue[]
}

export interface FacetDefinitionWriteInput {
  key?: string
  name: string
  description?: string | null
  cardinality?: 'single' | 'multi'
  kind?: 'system' | 'custom'
  hierarchical?: boolean
  reserved?: boolean
  config?: Record<string, JsonValue>
}
```

## Facet value types

```ts
export interface FacetValue {
  id: string
  orgId: string
  collectionId: string
  facetDefinitionId: string
  facetKey?: string
  key: string
  slug?: string | null
  name: string
  shortName?: string | null
  description?: string | null
  color?: string | null
  icon?: string | null
  image?: Record<string, JsonValue> | null
  metadata: Record<string, JsonValue>
  sortOrder: number
  parentValueId?: string | null
  parentValueKey?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  count?: number
}

export interface FacetValueWriteInput {
  key?: string
  slug?: string | null
  name: string
  shortName?: string | null
  description?: string | null
  color?: string | null
  icon?: string | null
  image?: Record<string, JsonValue> | null
  metadata?: Record<string, JsonValue>
  sortOrder?: number
  parentValueKey?: string | null
}
```

## List response types

```ts
export interface FacetListResponse {
  items: FacetDefinition[]
}

export interface FacetValueListResponse {
  facet: FacetDefinition
  items: FacetValue[]
}

export interface FacetValueResponse {
  facet: FacetDefinition
  item: FacetValue
}
```

## Query types

```ts
export interface FacetQueryRequest {
  facetKeys?: string[]
  includeEmpty?: boolean
  includeDeleted?: boolean
  query?: {
    search?: string
    status?: string[]
    schemaType?: string[]
    type?: string[]
    productIds?: string[]
    sku?: string
    gtin?: string
    category?: string[]
    tags?: string[]
    facetEquals?: Record<string, JsonValue | JsonValue[]>
  }
}

export interface FacetBucket {
  facetKey: string
  valueKey: string
  name?: string
  count: number
}

export interface FacetQueryResponse {
  items: Array<{
    facet: FacetDefinition
    values: FacetValue[]
  }>
  buckets: FacetBucket[]
  meta?: {
    source?: 'postgres'
    matchedProducts?: number
  }
}
```

## Notes for SDK implementers

- treat facet definitions and facet values as collection-scoped resources
- use the facet API to manage definitions and values
- use product read/write routes to assign facet data onto products
- treat `label` and `category` as reserved system facets when present