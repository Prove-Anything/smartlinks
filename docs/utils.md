# Utility Functions

The smartlinks SDK includes utilities for common tasks like building portal URLs and validating conditional rendering logic.

> **See also:** [API Summary](API_SUMMARY.md) for the complete SDK reference.

## Installation

```typescript
import { utils } from '@proveanything/smartlinks'
```

## Path Builder Utility

Builds full portal URLs by default. Pass in objects (collection, product, batch, etc.) and the function extracts what it needs. Uses `collection.portalUrl` as the domain, or defaults to `https://zt.smartlinks.io`.

### Basic Usage

```typescript
import { utils } from '@proveanything/smartlinks'

// Returns full URL by default (uses collection.portalUrl)
const url = utils.buildPortalPath({
  collection: myCollection,  // uses collection.portalUrl or default domain
  product: myProduct  // ownGtin is read from product, not overridden
})
// Returns: https://portal.smartlinks.io/c/abc123/prod123

// Return just the path (no domain)
const path = utils.buildPortalPath({
  collection: { shortId: 'abc123' },
  productId: 'prod1',
  pathOnly: true  // Set to true for path only
})
// Returns: /c/abc123/prod1

// Or just IDs if you don't have full objects
const url2 = utils.buildPortalPath({
  collection: { shortId: 'abc123' },
  productId: 'prod1'
})
// Returns: https://zt.smartlinks.io/c/abc123/prod1 (default domain)
```

## Path Builder Function

### `buildPortalPath(params)`

Builds a full portal URL based on the provided parameters. Returns full URL by default using `collection.portalUrl` or `https://zt.smartlinks.io`.

**Parameters:**

- `collection` (required) - Collection object or `{ shortId: string, portalUrl?: string }`  
  Extracts: `shortId` and optional `portalUrl` for base domain
  
- `product` (optional) - Full product object  
  Extracts: `id`, `gtin`, and `ownGtin` (ownGtin is a critical product setting - read only, never overridden)
  
- `productId` (optional) - Just a product ID string  
  Use this if you don't have the full product object
  
- `batch` (optional) - Batch object  
  Extracts: `id` and `expiryDate`
  
- `batchId` (optional) - Just a batch ID string  
  Use this if you don't have the full batch object (no expiry date)
  
- `variant` (optional) - Variant object OR just a variant ID string  
  - If object: extracts `id`
  - If string: uses as variant ID
  
- `proof` (optional) - Proof object OR just a proof ID string  
  - If object: extracts `id`  
  - If string: uses as proof ID
  
- `queryParams` (optional) - Additional query parameters object

- `pathOnly` (optional, default: `false`) - Return only the path without domain  
  Set to `true` to get `/c/abc/prod` instead of `https://domain.com/c/abc/prod`
- `customDomain` (optional) - Override custom-domain detection. When a collection is
  served from its own custom domain, a GS1 link resolves `/01/{gtin}` directly (the host
  identifies the collection), so the `/gc/{shortId}` prefix is dropped. Leave unset to
  auto-detect from `collection.redirectUrl` or a non-platform `portalUrl` host.

**Path Formats:**

- Basic product: `/c/{shortId}/{productId}`
- With proof: `/c/{shortId}/{productId}/{proofId}`
- GTIN (own, or on a custom domain): `/01/{gtin}` — when `product.ownGtin` is set, **or** the
  collection is on its own custom domain (bare `/01/` resolves via the host)
- GTIN (not own, on the shared platform domain): `/gc/{shortId}/01/{gtin}`
- With batch: adds `/10/{batchId}` and optionally `?17={expiryDate}`
- With variant: adds `/22/{variantId}`

**Custom domain behaviour:** On `smartlinks.app`, a non-master GTIN needs the `/gc/{shortId}`
collection prefix so the server can scope it; a master GTIN (`ownGtin`) uses bare `/01/`.
On a collection's **own custom domain**, the host already identifies the collection, so the
generator emits the clean `https://customdomain/01/{gtin}` for any product — no `/gc/` prefix.

## Examples

### Full URL (Default Behavior)

```typescript
// Returns full URL using collection.portalUrl
utils.buildPortalPath({
  collection: myCollection,  // uses collection.portalUrl
  product: myProduct
})
// Returns: https://portal.smartlinks.io/c/abc123/prod123

// Without portalUrl, uses default domain
utils.buildPortalPath({
  collection: { shortId: 'abc123' },
  productId: 'prod1'
})
// Returns: https://zt.smartlinks.io/c/abc123/prod1

// With proof object
utils.buildPortalPath({
  collection: myCollection,
  product: myProduct,
  proof: myProof  // extracts id
})
// Returns: https://portal.smartlinks.io/c/abc123/prod123/proof789
```

### Path Only (No Domain)

```typescript
// Set pathOnly: true to get just the path
utils.buildPortalPath({
  collection: myCollection,
  product: myProduct,
  pathOnly: true
})
// Returns: /c/abc123/prod123

// Useful when you need to build your own full URL
const path = utils.buildPortalPath({
  collection: { shortId: 'abc123' },
  productId: 'prod1',
  pathOnly: true
})
const customUrl = `https://mycustomdomain.com${path}`
// Result: https://mycustomdomain.com/c/abc123/prod1
```

### GTIN Paths

```typescript
// Product owns GTIN (ownGtin read from product.ownGtin)
utils.buildPortalPath({
  collection: myCollection,
  product: myProduct  // if myProduct.ownGtin === true
})
// Returns: https://portal.smartlinks.io/01/1234567890123

// Product doesn't own GTIN (shared/master GTIN)
utils.buildPortalPath({
  collection: myCollection,
  product: myProduct  // if myProduct.ownGtin === false
})
// Returns: https://portal.smartlinks.io/gc/abc123/01/1234567890123
```

### With Batch Object or ID

```typescript
// Batch object includes expiry date
utils.buildPortalPath({
  collection: myCollection,
  product: myProduct,
  batch: myBatch  // extracts id and expiryDate
})
// Returns: https://portal.smartlinks.io/01/1234567890123/10/batch456?17=260630

// Just batch ID (no expiry)
utils.buildPortalPath({
  collection: myCollection,
  product: myProduct,
  batchId: 'batch456'  // just string, no expiry date
})
// Returns: https://portal.smartlinks.io/01/1234567890123/10/batch456
```

### With Variant

```typescript
utils.buildPortalPath({
  collection: myCollection,
  product: myProduct,
  batch: myBatch,
  variant: myVariant  // extracts id
})
// Returns: https://portal.smartlinks.io/01/1234567890123/10/batch456/22/var1?17=260630

// Or just variant ID
utils.buildPortalPath({
  collection: myCollection,
  product: myProduct,
  variant: 'var1'
})
// Returns: https://portal.smartlinks.io/01/1234567890123/22/var1
```

### With Query Parameters

```typescript
utils.buildPortalPath({
  collection: myCollection,
  product: myProduct,
  queryParams: {
    utm_source: 'email',
    utm_campaign: 'launch',
    lang: 'fr'
  }
})
// Returns: https://portal.smartlinks.io/c/abc123/prod123?utm_source=email&utm_campaign=launch&lang=fr
```

## GS1 Digital Links — `buildGs1DigitalLink(params)`

`buildPortalPath` covers portal routing; when you specifically want a **GS1 Digital Link**
with the full range of Application Identifiers (AIs), use `buildGs1DigitalLink`. It emits
path qualifiers in the **canonical GS1 order** — `/01/{gtin}/22/{cpv}/10/{lot}/21/{serial}` —
routes data attributes (expiry, production date, weights, …) to the query string, and applies
the same custom-domain scoping (bare `/01/` on a custom domain or for a master GTIN, `/gc/{shortId}`
otherwise).

**Named inputs** for the common AIs, plus a generic **`ais` map** for anything else:

| Input | AI | Notes |
|-------|----|-------|
| `gtin` / `product.gtin` | 01 | Primary identifier (required) |
| `cpv` | 22 | Real GS1 Consumer Product Variant code (path). Wins over `variant`. |
| `variant` | 22 | Internal variant id, emitted as AI 22 for the SmartLinks resolver. Use `cpv` for a genuine GS1 CPV. |
| `lot` / `batch` | 10 | Batch/lot (path); a batch object also supplies its expiry |
| `serial` | 21 | Specific item — a string, or an object (`serialNumber` ?? `id`, e.g. a proof / serial / virtual id) |
| `expiry` | 17 | Date → `YYMMDD` (query) |
| `ais: { [ai]: value }` | any | Date AIs (11/12/13/15/16/17) formatted `YYMMDD`; qualifier AIs (22/10/21) go in the path; the rest become query attributes |
| `linkType` | — | GS1 `linkType`, added as `?linkType=` |

```typescript
// Variant + lot + serial + expiry, on a custom domain
utils.buildGs1DigitalLink({
  collection,               // portalUrl = https://acme.com
  gtin: '05012345678900',
  variant: 'red',
  lot: 'LOT42',
  serial: proof,            // AI 21 from proof.serialNumber ?? proof.id
  expiry: '2026-06-30',
})
// → https://acme.com/01/05012345678900/22/red/10/LOT42/21/{serial}?17=260630

// Arbitrary AIs via the generic map
utils.buildGs1DigitalLink({
  collection,
  gtin: '05012345678900',
  ais: { '11': new Date(2025, 0, 1), '3103': '000500' }, // production date + net weight
  linkType: 'gs1:pip',
})
// → https://.../01/05012345678900?11=250101&3103=000500&linkType=gs1%3Apip
```

`buildPortalPath` delegates its GTIN paths to this function, so both stay in sync (and both now
emit qualifiers in canonical `22 → 10 → 21` order).

## Use Cases

### QR Code Generation

```typescript
const qrUrl = utils.buildPortalPath({
  collection: myCollection,
  product: myProduct,  // ownGtin read from product
  batch: currentBatch,  // includes expiry date
  queryParams: { source: 'qr' }
})
// Use qrUrl to generate QR code
```

### Email Campaign Links

```typescript
const emailLink = utils.buildPortalPath({
  collection: myCollection,
  product: featuredProduct,
  queryParams: {
    utm_source: 'newsletter',
    utm_medium: 'email',
    utm_campaign: 'product-launch'
  }
})
```

### NFC Tag Programming

```typescript
const nfcUrl = utils.buildPortalPath({
  collection: myCollection,
  product: myProduct,
  queryParams: { nfc: '1' }
})
// Program NFC tag with nfcUrl
```

### Dynamic Navigation

```typescript
function getProductUrl(product: Product, collection: Collection) {
  return utils.buildPortalPath({
    collection,
    product,  // ownGtin automatically read from product
    batch: product.currentBatch
  })
}
```

## TypeScript Support

The utility function is fully typed:

```typescript
import type { PortalPathParams } from '@evrythng/smartlinks'
import type { Product, Collection } from '@evrythng/smartlinks'

const params: PortalPathParams = {
  collection: myCollection,
  product: myProduct
}

const path = utils.buildPortalPath(params)
```

## Condition Validation Utility

The `validateCondition` function helps determine if content should be shown or hidden based on various criteria like geography, device type, user status, dates, and more.

Enable verbose tracing per invocation with `debugConditions`, or set `globalThis.SMARTLINKS_CONDITION_DEBUG = true` in a browser/devtools session to trace every evaluation.

### Basic Usage

```typescript
import { utils } from '@proveanything/smartlinks'

// Check if user is in EU
const canShow = await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'country',
      regions: ['eu'],
      contains: true
    }]
  },
  user: { 
    valid: true, 
    location: { country: 'DE' } 
  }
})

// Multiple conditions with AND logic
const showFeature = await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [
      { type: 'user', userType: 'valid' },
      { type: 'device', displays: ['mobile'], contains: true },
      { type: 'date', dateTest: 'after', afterDate: '2026-01-01' }
    ]
  },
  user: { valid: true },
  stats: { mobile: true }
})
```

### Supported Condition Types

#### Country-Based Conditions
Filter by country codes or predefined regions (EU, EEA, UK, North America, Asia Pacific):

```typescript
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'country',
      regions: ['eu', 'uk'],
      contains: true  // true = show IN these regions, false = hide IN these regions
    }]
  },
  user: { valid: true, location: { country: 'FR' } }
})

// Regions and explicit countries can be combined
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'country',
      regions: ['eu'],
      countries: ['CH'],
      contains: true
    }]
  },
  user: { valid: true, location: { country: 'CH' } }
})

// Or specific countries
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'country',
      countries: ['US', 'CA', 'MX'],
      contains: true
    }]
  },
  user: { valid: true, location: { country: 'US' } }
})
```

#### Device & Platform Conditions
Target specific devices or platforms:

```typescript
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'device',
      displays: ['ios', 'android', 'mobile'],
      contains: true
    }]
  },
  stats: {
    platform: { ios: true },
    mobile: true
  }
})
```

Supported displays: `'android'`, `'ios'`, `'win'`, `'mac'`, `'desktop'`, `'mobile'`

#### User Status Conditions
Check authentication and permissions:

```typescript
// Logged in users only
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{ type: 'user', userType: 'valid' }]
  },
  user: { valid: true, uid: 'user123' }
})

// Collection admins only
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{ type: 'user', userType: 'admin' }]
  },
  user: { valid: true, uid: 'user123' },
  collection: { id: 'col1', roles: { 'user123': 'admin' } }
})

// Proof owners only
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{ type: 'user', userType: 'owner' }]
  },
  user: { valid: true, uid: 'user123' },
  proof: { userId: 'user123' }
})
```

User types: `'valid'`, `'invalid'`, `'owner'`, `'admin'`, `'group'`

#### Date & Time Conditions
Show/hide content based on dates:

```typescript
// Show after specific date
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'date',
      dateTest: 'after',
      afterDate: '2026-06-01'
    }]
  }
})

// Show during date range
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'date',
      dateTest: 'between',
      rangeDate: ['2026-01-01', '2026-12-31']
    }]
  }
})
```

Date tests: `'before'`, `'after'`, `'between'`

#### Product & Tag Conditions
Filter by specific products or product tags:

```typescript
// Specific products
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'product',
      productIds: ['prod1', 'prod2'],
      contains: true
    }]
  },
  product: { id: 'prod1' }
})

// Products with specific tags
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'tag',
      tags: ['premium', 'featured'],
      contains: true
    }]
  },
  product: { id: 'prod1', tags: { premium: true } }
})
```

#### Item Status Conditions
Check proof/item status — claim/ownership state, and authenticity of the
item (proof) the URL points at (via NFC tap or serial proof URL — see
[item-context.md](item-context.md)):

```typescript
// Claim/ownership — unchanged, reads `proof`
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'itemStatus',
      statusType: 'isClaimable'
    }]
  },
  proof: { claimable: true }
})

// Authenticity — reads `itemContext`
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'itemStatus',
      statusType: 'invalidProof'
    }]
  },
  itemContext: { isAuthentic: false, status: 'invalid', source: 'nfc', checkedAt: Date.now() }
})

// Fresh scan vs. duplicate/replayed scan — both authentic, different UX
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'itemStatus',
      statusType: 'isRescan'
    }]
  },
  itemContext: { isAuthentic: true, status: 'rescan', source: 'nfc', checkedAt: Date.now() }
})
```

Status types:
- Claim/ownership (reads `proof`): `'isClaimable'`, `'notClaimable'`, `'isVirtual'`, `'notVirtual'`
- Presence (reads `proof`): `'hasProof'`, `'noProof'` — `noProof` only means *nothing was attempted*, not that an attempt failed
- Authenticity (reads `itemContext`): `'isAuthentic'`, `'notAuthentic'`, `'invalidProof'`, `'isRescan'`
  - `invalidProof` is specifically "an identifier was passed and resolution came back `invalid`/`not-found`", distinct from `noProof`'s "nothing on the URL to check at all"
  - `isAuthentic` is true for both a fresh tap and a rescan. Use `isRescan` (authentic but `status === 'rescan'`) to suppress "first scan" celebration UX without treating the tag as fake

#### Version Conditions
For A/B testing or versioned content:

```typescript
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'version',
      versions: ['v2', 'v3'],
      contains: true
    }]
  },
  stats: { version: 'v2' }
})
```

#### Value Comparison Conditions
Compare custom field values:

```typescript
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'value',
      field: 'product.inventory.quantity',  // dot notation
      fieldType: 'integer',
      validationType: 'greater',
      value: 10
    }]
  },
  product: { inventory: { quantity: 25 } }
})
```

Validation types: `'equal'`, `'not'`, `'greater'`, `'less'`
Field types: `'string'`, `'boolean'`, `'integer'`, `'number'`

#### Geofence Conditions
Location-based restrictions using bounding boxes:

```typescript
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'geofence',
      top: 50.0,
      bottom: 40.0,
      left: -10.0,
      right: 5.0,
      contains: true  // true = inside box, false = outside box
    }]
  },
  user: { 
    valid: true, 
    location: { latitude: 45.0, longitude: 0.0 } 
  }
})
```

#### Nested Conditions
Reference other condition sets for reusability:

```typescript
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{
      type: 'condition',
      conditionId: 'mobile-users-condition',
      passes: true  // true = must pass, false = must fail
    }]
  },
  conditionId: 'mobile-users-condition',
  fetchCondition: async (collectionId, conditionId) => {
    // Your logic to fetch condition by ID
    return { type: 'and', conditions: [...] }
  },
  collection: { id: 'col1' }
})
```

### Combining Conditions (AND/OR Logic)

```typescript
// AND logic (all must pass)
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [
      { type: 'user', userType: 'valid' },
      { type: 'device', displays: ['mobile'], contains: true },
      { type: 'country', regions: ['eu'], contains: true }
    ]
  },
  user: { valid: true, location: { country: 'FR' } },
  stats: { mobile: true }
})

// OR logic (any can pass)
await utils.validateCondition({
  condition: {
    type: 'or',
    conditions: [
      { type: 'user', userType: 'admin' },
      { type: 'product', productIds: ['featured1'], contains: true }
    ]
  },
  user: { valid: false },
  product: { id: 'featured1' }
})
```

### Common Use Cases

#### Page Rendering Control
```typescript
const showPremiumContent = await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [
      { type: 'user', userType: 'valid' },
      { type: 'tag', tags: ['premium'], contains: true }
    ]
  },
  user: { valid: true },
  product: { id: 'prod1', tags: { premium: true } }
})

if (showPremiumContent) {
  // Render premium content
}
```

#### Regional Feature Rollout
```typescript
const showNewFeature = await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [
      { type: 'country', regions: ['northamerica'], contains: true },
      { type: 'date', dateTest: 'after', afterDate: '2026-03-01' }
    ]
  },
  user: { valid: true, location: { country: 'US' } }
})

### Debug Logging

Trace which condition is being evaluated, whether it passed, and why:

```typescript
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [
      { type: 'user', userType: 'valid' },
      { type: 'country', regions: ['eu'], contains: true }
    ]
  },
  user: { valid: true, location: { country: 'DE' } },
  debugConditions: true
})

// Or enable globally in the browser console/devtools
globalThis.SMARTLINKS_CONDITION_DEBUG = true
```

If you want to route logs somewhere specific, pass a logger:

```typescript
await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [{ type: 'user', userType: 'valid' }]
  },
  user: { valid: true },
  debugConditions: {
    label: 'checkout-gate',
    logger: (...args) => console.log(...args)
  }
})
```
```

#### Mobile-Only Features
```typescript
const showMobileFeature = await utils.validateCondition({
  condition: {
    type: 'and',
    conditions: [
      { type: 'device', displays: ['mobile'], contains: true }
    ]
  },
  stats: { mobile: true, platform: { ios: true } }
})
```

### Available Regions

Predefined regions for country conditions:
- **eu** - European Union (27 member states)
- **eea** - European Economic Area (EU + EFTA countries)
- **uk** - United Kingdom
- **northamerica** - US, CA, MX
- **asiapacific** - AU, NZ, JP, KR, SG, HK, TW, TH, MY, PH, ID, VN, IN

## More Examples

See [examples/utils-demo.ts](../examples/utils-demo.ts) for comprehensive examples.

## Related Documentation

- **[API Summary](API_SUMMARY.md)** - Complete SDK reference with all namespaces and functions
- **[QR Codes](API_SUMMARY.md#qr)** - QR code lookup functions that work with generated paths
- **[NFC](API_SUMMARY.md#nfc)** - NFC tag claiming and validation
- **[Item Context](item-context.md)** - `itemContext` prop delivered to containers describing the item (proof) the URL points at and whether it's authentic
- **[Collections](API_SUMMARY.md#collection)** - Collection management functions
- **[Products](API_SUMMARY.md#product)** - Product CRUD operations
- **[Batches](API_SUMMARY.md#batch)** - Batch management
- **[Proofs](API_SUMMARY.md#proof)** - Proof creation and claiming
