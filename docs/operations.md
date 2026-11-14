# Operations: work orders, stock, what things are made of

For apps that run a factory floor, a warehouse or any place where things are made, stored and moved.
These are platform objects, so every app in a collection shares one picture: one count of the caps,
one list of the jobs.

| Question | Object | Reach it as |
|---|---|---|
| What work is under way? | **Work orders** | `ctx.sl.workOrders` |
| Where is it? | **Containers** (a bin, a rack, a pallet, a drum) | `SL.containers` |
| How much is there? | **Stock**: a quantity of a product in a container | `ctx.sl.stock` |
| What is it made of? | **Bill of materials** (the recipe) and **made from** (what a batch really used) | `ctx.sl.boms`, `ctx.sl.madeFrom` |
| What is wanted, and what is coming? | **Orders**, sales and purchase, with quantities | `SL.order` |
| Will we run short? | A product's **position** | `ctx.sl.stock.position` |

> Don't keep your own stock counts, job tables or component lists in app records. Other apps, the
> reports and the assistant can't see those, and you end up with two answers to "how many do we have".

## Reaching them

**In a server function.** Declare the capability, and run with collection authority:

```jsonc
{
  "name": "finishPick",
  "trigger":    { "type": "http", "methods": ["POST"] },
  "visibility": "public",
  "authority":  "collection",
  "elevated":   true,
  "userGroups": ["warehouse", "manager"],
  "capabilities": ["sl:stock:write", "sl:workorders:write"]
}
```

| Capability | Covers |
|---|---|
| `sl:workorders:read` / `:write` | `ctx.sl.workOrders` |
| `sl:stock:read` / `:write` | `ctx.sl.stock`, including `position` and `short` |
| `sl:boms:read` / `:write` | `ctx.sl.boms` |
| `sl:madefrom:read` / `:write` | `ctx.sl.madeFrom` |

- **`authority: "collection"` is required.** This is the collection's shared operational data, never a
  visitor's own. A function running as the caller gets `NEEDS_COLLECTION_AUTHORITY`, whatever it declares.
- **Say who may call it** with [`userGroups`](user-groups.md). `write` implies `read`.

**From an admin screen.** The same calls, same arguments, same results:

```ts
import { operations } from '@proveanything/smartlinks'

const ops = operations.admin(collectionId, { appId: 'production' })
await ops.stock.position({ productId: 'brass-cap', horizonDays: 90 })
```

**In a site.** A site's server code has all of these on its own cloud: `slServer().stock.move({ … })`.

## Work orders

The shared skeleton of a "job": what is being made, how many, by when, for which order line, and an
ordered list of stages with planned and actual times and quantities done and scrapped.

```ts
const job = await ctx.sl.workOrders.create({
  ref: '19264',                       // the number people use; unique in the collection
  kind: 'decoration-boxing-wrapping', // your own type
  productId, quantity: 900, dueAt: '2026-12-05', priority: 2,
  orderItemId,                        // the order line it fulfils
  stages: ['picking', 'decoration', { key: 'boxing', plannedStart, plannedEnd }, 'wrapping'],
  data: { gmpReference: 'GMP-1', testers: 90 },   // anything else you keep on it
})

await ctx.sl.workOrders.startStage(job.id, 'picking')
await ctx.sl.workOrders.progress(job.id, 'decoration', { done: 50, scrapped: 1 }, { note: 'first box' })
await ctx.sl.workOrders.completeStage(job.id, 'wrapping', { closeWorkOrder: true })
```

**The platform keeps the shape and three rules. Your app keeps the meaning.**

| The platform | Your app |
|---|---|
| A `ref` is unique among live work orders | Which stages exist, and in what order |
| A stage's figures change atomically and never go below zero | What must be true before a stage starts or finishes |
| A work order that isn't `open` is **frozen** | Who may do each thing (`userGroups`) |

- **Nothing starts or finishes by itself.** `progress` adds to the figures; it doesn't complete the
  stage. Your code decides when enough is enough, then calls `completeStage`.
- **Frozen** means: while the status is `on-hold`, `blocked`, `done` or `cancelled`, no stage can start,
  progress or finish, and no stock can be moved for it. The error is `WORK_ORDER_FROZEN` (409) and says
  why. Re-planning a stage is still allowed while it waits.
- `setStatus(id, 'on-hold', { reason })`: `on-hold`, `blocked` and `cancelled` need a reason.
- Changing `quantity` needs `{ reason }`, and taking figures down (`progress` with a negative) does too.
- **Any app can read a work order; only the app that created it can change it** (`NOT_YOURS`).
- A split is a new work order with `parentId`. A `get` takes the id or the ref.
- `list({ status, productId, late: true, dueFrom, dueTo, q, sort: 'due' | 'priority' })`.

## Stock

**A stock line is a quantity of one product, in one container, in one state.** A container holds as
many lines as it has different things. A product's total is a sum, worked out when you ask.

States: `available`, `allocated` (set aside for something), `held`, `quarantine`.

A quantity changes only through a **movement**:

```ts
await ctx.sl.stock.receive({ containerId: bin, productId: 'brass-cap', quantity: 5000, note: 'PO-2041' })
await ctx.sl.stock.allocate({ containerId: bin, productId: 'brass-cap', quantity: 900, to: { type: 'workOrder', id: job.id } })
await ctx.sl.stock.move({ from: bin, to: cage, productId: 'brass-cap', quantity: 900, allocatedTo: { type: 'workOrder', id: job.id } })
await ctx.sl.stock.consume({ containerId: cage, productId: 'brass-cap', quantity: 880, allocatedTo: { type: 'workOrder', id: job.id } })
await ctx.sl.stock.release({ containerId: cage, productId: 'brass-cap', quantity: 20, from: { type: 'workOrder', id: job.id } })
await ctx.sl.stock.produce({ containerId: pallet, productId, batchId: '26-1001', quantity: 880, workOrderId: job.id })
await ctx.sl.stock.hold({ containerId: drum, productId: 'juice', batchId: 'B-77', quantity: 200, state: 'quarantine', reason: 'Smell test failed' })
await ctx.sl.stock.adjust({ containerId: bin, productId: 'brass-cap', by: -3, reason: 'Counted 4097' })
```

| Movement | From → to | Needs |
|---|---|---|
| `receive`, `produce` | nowhere → a container | |
| `consume` | a container → nowhere | |
| `move` | container → container, same state | |
| `allocate` / `release` | available ↔ allocated to something | `to` / `from`: `{ type, id }` |
| `hold` / `unhold` | available ↔ `held` or `quarantine` | a `reason` |
| `adjust` | a correction, `by` + or − | a `reason` |

- **It never goes below zero.** Taking more than a line holds is `INSUFFICIENT_STOCK` (409), with what
  is there in `details`. Twenty people taking one from a bin of ten: ten succeed.
- **One unit per product** in a collection (`each`, `kg`, `l`): the first stock of a product sets it,
  and another unit is `UNIT_MISMATCH`.
- **A movement for a work order is refused while that work order is frozen.**
- **A scanner that retries:** pass `{ idempotencyKey }` as the second argument. The same key again
  moves nothing and returns `replayed: true`.
- Putting a pallet away is not a stock movement: move the container (`containers.update(id, { parentContainerId })`).
- Every movement is recorded with who, when, from, to and why.

### Several writes at once

All or nothing, across stock, work orders, bills of materials and made-from:

```ts
await ctx.sl.operations.transaction([
  { op: 'stock.move', args: [{ from: bin, to: cage, productId: 'brass-cap', quantity: 900 }] },
  { op: 'stock.move', args: [{ from: bin2, to: cage, productId: 'pump', quantity: 900 }] },
  { op: 'workOrders.completeStage', args: [job.id, 'picking'] },
])
```

A failing step undoes them all; the error's `details.step` says which. Up to 50 steps, writes only.

### Reading

```ts
await ctx.sl.stock.totals({ productId: 'brass-cap' })
// { available: 4100, allocated: 900, held: 0, quarantine: 0, total: 5000, unit: 'each' }

await ctx.sl.stock.where({ productId: 'brass-cap' })
// [{ quantity: 4100, state: 'available', path: ['Warehouse A', 'Rack 3', 'Bin 12'], place: { name: 'Bin 12', … } }, …]

await ctx.sl.stock.lines({ containerId: bin })      // what is in this bin
```

### Containers as places

A container with `fixed: true` is a place (a site, a rack, a bin); without it, something carried (a
pallet, a cage, a drum). `where` reports the first fixed container above each line as its `place`.
Suggested `containerType` names, so apps agree: `site`, `zone`, `rack`, `bin`, `pallet`, `cage`,
`drum`, `tank`.

## The position: will we run short?

One answer with fixed fields, for a screen, a report or an assistant:

```ts
const p = await ctx.sl.stock.position({ productId: 'brass-cap', horizonDays: 90 })

p.onHand      // { available: 400, allocated: 100, held: 0, quarantine: 40, total: 540, unit: 'each' }
p.where       // each line, with its path
p.onOrder     // { total: 60, lines: [{ orderRef: 'PO-1', supplier, quantity: 60, dueAt }] }
p.beingMade   // open work orders that make it, and how many each still has to finish
p.needed      // { total: 600, lines: [{ why: 'work order', ref: 'J-1', quantity: 200, neededBy }, { why: 'order, not yet in production', … }] }
p.projected   // [{ date: '2026-11-14', balance: 400 }, { date: '2026-11-24', balance: 200 }, …]
p.shortfall   // { quantity: 140, firstShortOn: '2026-12-14' }   or null
p.asOf, p.sources
```

- **Needed** counts the product ordered by customers, and, as a component, what open work orders and
  orders not yet in production still need, worked through the bill of materials. An order line that a
  work order already fulfils is counted once, through the work order.
- **Nothing is stored.** It is worked out when you ask, and says when (`asOf`).
- `ctx.sl.stock.short({ horizonDays })` lists everything that will run short, soonest first.

## Bill of materials

The recipe. A component is a product, and can have a recipe of its own.

```ts
await ctx.sl.boms.set({
  productId: 'perfume-100',
  lines: [
    { componentProductId: 'bottle-100', quantity: 1 },
    { componentProductId: 'brass-cap', quantity: 1 },
    { componentProductId: 'juice', quantity: 0.1, unit: 'kg' },
    { componentProductId: 'gift-ribbon', quantity: 1, optional: true },
  ],
})

const need = await ctx.sl.boms.explode({ productId: 'perfume-100', quantity: 500 })
need.materials   // [{ productId: 'bottle-100', quantity: 500, unit: 'each' }, …, { productId: 'juice', quantity: 50, unit: 'kg' }]
```

- **Never edited.** `set` writes a new version that takes over from `validFrom` (now by default); the
  one before ends then. `current({ productId, at })` answers for any date, which a product passport needs.
- `yields`: how many the recipe makes (`100` for a batch recipe).
- A variant's own recipe wins; a variant without one uses the product's.
- A recipe that leads back to its own product is refused (`BOM_LOOP`).
- `whereUsed({ componentProductId })`: which products use this.

## Made from

What a batch, or one item, was **really** made from. The bill of materials is the recipe; this is the record.

```ts
await ctx.sl.madeFrom.record({
  subject: { type: 'batch', id: '26-1001' },
  sources: [
    { type: 'batch', id: 'JUICE-7', productId: 'juice', quantity: 50, unit: 'kg' },
    { type: 'batch', id: 'CAP-LOT-9', productId: 'brass-cap', quantity: 500 },
  ],
  workOrderId: job.id,
})

await ctx.sl.madeFrom.trace({ type: 'batch', id: '26-1001' })     // back through every level
await ctx.sl.madeFrom.usedIn({ type: 'batch', id: 'CAP-LOT-9' })  // everything that used this lot
```

- `subject` is a `batch` or a `proof` (one item: "this boat has engine 123").
- **Append-only.** A part swapped later: `end(id, { reason })` the old entry and `record` the new one.
  `of(subject, { at })` still answers for the earlier date.

## Orders with quantities

An order has a `direction`: `sales` (someone wants it from us, the default) or `purchase` (we want it
from a supplier, `partyId`). A line can be a quantity of a product:

```ts
await SL.order.create(collectionId, {
  direction: 'purchase', partyId: 'tagworks', orderRef: 'PO-2041',
  items: [{ productId: 'brass-cap', quantity: 5000, dueAt: '2026-12-01' }],
})
await SL.order.lineDone(collectionId, orderId, lineId, 2000)   // 2,000 arrived
```

Open sales lines are what is wanted; open purchase lines are what is coming. Both feed the position.

## Errors

| Code | Status | Meaning |
|---|---|---|
| `INSUFFICIENT_STOCK` | 409 | The line doesn't hold that much (`details.available`) |
| `WORK_ORDER_FROZEN` | 409 | The work order isn't open (`details.status`, `details.reason`) |
| `UNIT_MISMATCH` | 409 | The product is held in another unit |
| `REF_TAKEN` | 409 | Another live work order has that ref |
| `NOT_YOURS` | 403 | Another app owns this work order |
| `NEEDS_COLLECTION_AUTHORITY` | 403 | The function runs as the caller |
| `REASON_REQUIRED` | 400 | This change needs a reason |
| `BELOW_ZERO`, `STAGE_CLOSED`, `STAGE_IN_USE`, `NO_SUCH_STAGE` | 409 / 404 | Stage changes |
| `BOM_LOOP` | 409 | The recipe leads back to itself |

## Testing

```ts
import { createFunctionTestContext } from '@proveanything/smartlinks/testing'

const ctx = createFunctionTestContext({
  def: { trigger: { type: 'http' }, authority: 'collection', capabilities: ['sl:stock:write'] },
  sl: { stock: { move: async (input) => ({ movementId: 'm1', kind: 'move', productId: input.productId, quantity: input.quantity, unit: 'each', replayed: false }) } },
})
```

The test context enforces the capability and collection authority, as the platform does. It has no
in-memory stock or work orders: give stand-ins for the calls your function makes, and any other call
returns a stub echo.
