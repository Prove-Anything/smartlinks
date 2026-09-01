# Lots

A **Lot** is a collection-scoped production grouping that spans one or more products
(SKUs) — a single identifier applied across many SKUs and/or many production runs. It's
the right tool when a manufacturer wants one lot number (e.g. `LOT-2026-09`) across a whole
range, rather than a per-product **batch** (a single run of a single product).

Lots are a first-class entity (not app records): cross-app readable, admin-written, with a
real lifecycle. They are **never fanned out into batches** — the lot is the single source of
truth for its shared data.

---

## Concepts

- **Selector** — how member products are matched. Two modes:
  - `{ mode: 'facets', rules: [{ key, values }] }` — AND across rules, OR within a rule's values (resolved against the facet index, so it scales to thousands of SKUs).
  - `{ mode: 'products', productIds: [...] }` — an explicit list.
- **`productIds` / `productCount`** — the materialised snapshot of resolved members (re-resolved on create, on selector change, and on demand via `resolve`).
- **`payload`** — shared lot data (dates, supplier ref, custom fields). Lives only on the lot.
- **`status`** — `open` → `closed` → `recalled` → `archived`. A live lifecycle state, distinct from deletion.
- **`destination`** — optional lot-level redirect; wins over the product's on a lot-scoped scan.

### Archive vs delete

Two separate ideas — mirroring the platform's `deletedAt` convention:

| | `archive` (`status: 'archived'`) | `remove` (soft-delete, `deletedAt`) |
|---|---|---|
| Record | stays **live** & visible | **hidden** from reads unless `includeDeleted: true` |
| `lotNumber` | **stays reserved** | **freed** for reuse by a new lot |
| AI(10) scan | not resolved (excluded) | not resolved |
| Reversible | change status back | `restore` (409 if the number was taken by a live lot) |

Nothing is ever hard-deleted (joins/history stay intact). Use **archive** for "this run is done, keep it around"; use **remove** for "this was a mistake, and I want the number back."

---

## SDK — `SL.lots.*`

Writes and admin reads hit `/admin/collection/:cid/lots`; the `public*` reads hit
`/public/collection/:cid/lots` for cross-app consumers (auth is the ambient bearer token —
there's no `admin` flag).

```ts
import { lots } from '@proveanything/smartlinks'

// Create — facet-targeted lot
const lot = await lots.create(collectionId, {
  lotNumber: 'LOT-2026-09',
  name: 'September Oak run',
  selector: { mode: 'facets', rules: [
    { key: 'supplier', values: ['Acme Timber'] },
    { key: 'range',    values: ['Oslo', 'Bergen'] },
  ]},
  payload: { manufacturedAt: '2026-09-01', custom: { supplierBatchRef: 'ACM-7741' } },
})

const list       = await lots.list(collectionId, { status: 'open' })
const byId        = await lots.get(collectionId, lot.id)
const byNumber    = await lots.getByNumber(collectionId, 'LOT-2026-09')  // case-insensitive
const containing  = await lots.list(collectionId, { productId: 'prd_abc' }) // reverse lookup
const updated     = await lots.update(collectionId, lot.id, { status: 'closed' })
const { diff }    = await lots.resolve(collectionId, lot.id)               // { added, removed }
const members     = await lots.listProducts(collectionId, lot.id, { page: 1, limit: 50 })

await lots.archive(collectionId, lot.id)                       // live, keeps its number
await lots.remove(collectionId, lot.id)                        // soft-delete, frees the number
const withDeleted = await lots.list(collectionId, { includeDeleted: true })
const restored    = await lots.restore(collectionId, lot.id)   // undo a soft-delete

// Cross-app reads
const publicLots  = await lots.publicList(collectionId)
```

Exported types: `Lot`, `LotStatus`, `LotSelector`, `LotPayload`, `LotCreateInput`,
`LotUpdateInput`, `ListLotsParams`, `ResolveLotResponse`, `ListLotProductsResponse`,
`LotResolutionResult`.

---

## GS1 Digital Link resolution — AI(10)

GS1 gives batch and lot a **single** slot: AI(10) ("Batch or Lot Number"), in a Digital Link
as `/01/{gtin}/10/{value}`. A physical code carries exactly one value there, so the server
decides which namespace it belongs to, driven by two **feature flags** — `batches` and `lots`
— in the platform feature-flag system (`appConfig.system.features`), resolved the standard way
(`appConfiguration.isFeatureEnabled(collectionId, 'lots')`):

- Explicit `true`/`false` in `system.features` wins; otherwise **enterprise** accounts default
  a flag on and everyone else defaults off. So AI(10) batch/lot resolution is opt-in — no
  existing scan changes until `batches`/`lots` is enabled for the collection.

Resolution order — **batch first, then lot** (a hierarchy, not a collision):

1. **Batch** is the narrowest scope (one product). If the scanned product has a batch whose id
   or name matches the AI(10) value, it wins — a batch is a **specific-SKU override**.
2. **Lot** is broad (many products). If no batch matches and the value is a lot number *and the
   scanned product is a member*, the lot resolves.
3. Otherwise it resolves at the product level.

This means a range can share one lot code, and a single SKU can be given richer/overriding
detail by creating a batch with the **same** identifier — the batch simply takes precedence for
that SKU. A recalled lot (`status: 'recalled'`) still resolves so the destination page can show
a recall notice (a `&recall=1` context param is added).

The server returns a typed shape ({@link LotResolutionResult}); the front end renders it — clients
should not implement their own fallback.

See also [proof-product-data-scoping.md](proof-product-data-scoping.md) and the GS1 link
generator in [utils.md](utils.md) (`buildGs1DigitalLink`).
