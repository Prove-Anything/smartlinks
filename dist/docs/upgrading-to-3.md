---
title: Upgrading to SDK 3
description: What changed between SDK 2 and SDK 3, and how to move each call. The same changes are in upgrade/3.json as data.
category: Platform
---

# Upgrading to SDK 3

SDK 3 is SDK 2 with three things made the same everywhere:

1. **Every list returns one shape and pages one way.** `{ items, nextCursor, count? }`, with `limit` and
   `cursor`. SDK 2 had nine list shapes and six ways to page.
2. **Every error has one shape**, with one style of code.
3. **What was marked deprecated in SDK 2 is gone.**

Nothing is renamed for its own sake. A call that isn't a list and wasn't deprecated is the same call.

SDK 3 asks the API for version `2027-01` ([API versions](api-versions.md)). **SDK 2 keeps working**: it
asks for `2026-11`, and the API keeps answering it as it always has. Move when you're ready, one app at a
time.

The changes below are also in `upgrade/3.json` in this package, as data: one entry for each renamed or
removed name, each list whose shape changed and each option that went. Scripts and AI agents should read
that file; this page explains it.

## How to move an app

1. Set the dependency to `^3` and install. Update `@proveanything/smartlinks-utils-ui` and
   `@proveanything/smartlinks-auth-ui` to their SDK 3 versions if the app uses them.
2. Run `npx smartlinks-upgrade`. It shows what it can change by itself and lists every other place that
   needs changing, with file and line. `npx smartlinks-upgrade --write` makes the mechanical changes.
3. Work through its list with the sections below.
4. Type-check. What's left is a compile error: a removed name, a list used as an array, an option that
   no longer exists.
5. Search for the things neither can see (see [What the compiler won't catch](#what-the-compiler-wont-catch)).
6. Build, run `npx smartlinks-doctor`, and try each screen that lists something.

Apps built in Forge move with the **Move to SDK 3** upgrade step, which follows these steps.

### What `smartlinks-upgrade` does

It reads `upgrade/3.json` and your source, and finds SDK calls by what a name is bound to, not by how
it's spelled: `product.get(…)` only counts where `product` is the SDK's (an import, `SL.product`, or a
name taken from one of those). A variable of your own called `product` is never touched.

| It changes (with `--write`) | It lists for you |
|---|---|
| Calls that only changed name: `product.get` → `products.get`, with the import | Every call to a list whose result changed, and whether it passes `offset` or `page` |
| Renamed types, with their imports | Every removed call, with what replaces it |
| The argument that went from `collection.list` and `authKit.list` | Options that went |
| `sharedDependencies` in the manifest, to `v8` | Error codes compared with a dotted or camel-case string |
| | Old `attestation` writes, to leave alone |

Where the new name is already a variable in a file (`const products = await product.list(…)` is
common), it imports the SDK's under another name: `products as productsApi`. Running it twice changes
nothing the second time. It never installs, builds, commits or releases.

## Lists

Every function that lists returns a `ListResult<T>`:

```typescript
// SDK 2: each list had its own shape
const tagList   = await tags.list(collectionId)                    // { tags, limit, offset }
const { orders } = await order.list(collectionId, { offset: 50 })  // { orders, limit, offset }
const all        = await products.list(collectionId)               // [...]
const page       = await app.records.list(collectionId, appId)     // { data, pagination: { total, hasMore, … } }

// SDK 3: one shape
const { items }              = await tags.list(collectionId)
const { items, nextCursor }  = await order.list(collectionId, { limit: 50 })
const { items, nextCursor }  = await products.list(collectionId)        // the first 50, not all of them
const { items, count }       = await app.records.list(collectionId, appId)
```

What to change at each call:

| SDK 2 | SDK 3 |
|---|---|
| The list itself (`const xs = await x.list()`), or under its own name (`.tags`, `.orders`, `.data`, `.results`, …) | `.items` |
| `total`, `pagination.total`, `page.total` | `count` (the total; absent where the server doesn't know it) |
| `hasMore`, `pagination.hasMore`, `more` | `nextCursor !== null` |
| `offset`, `page`, `startAfter`, `lastId`, `from` used as a place to carry on | `cursor`: pass the last page's `nextCursor` |
| `pageSize`, `perPage` | `limit` |
| `limit` and `offset` echoed back in the answer | gone: you already know what you asked for |
| Other fields beside the list (`meta`, `mode`, `scanned`, …) | still there, beside `items` |

Paging by offset is gone, so "jump to page 7" is gone with it. Page forward with the cursor; for a
numbered pager, use the [standard query](standard-query.md), which counts and sorts.

To fetch everything, don't loop by hand:

```typescript
import { all, each, tags } from '@proveanything/smartlinks'

const everyTag = await all((cursor) => tags.list(collectionId, { cursor }))
for await (const t of each((cursor) => tags.list(collectionId, { cursor }))) { /* … */ }
```

### A list is one page now, even where it used to be everything

This is the change most likely to break an app quietly. In SDK 2 many lists returned everything in one
answer: products, variants, batches, the proofs of a product, forms, templates, lots, claim sets, the
members of a group, an app's config items. In SDK 3 every list returns **50 items unless you pass
`limit`**, and `nextCursor` says whether there are more.

```typescript
// SDK 2: every variant of the product
const variants = await variant.list(collectionId, productId)

// SDK 3, when you need them all (to filter, count, look one up, fill a picker)
const variants = await all((cursor) => variant.list(collectionId, productId, { limit: 200, cursor }))

// SDK 3, when you show a page
const { items, nextCursor } = await variant.list(collectionId, productId, { limit: 20 })
```

The upgrade report marks every such call **"used to return everything"**, and the table at the end of
this guide marks them "one page now". Code that only reads `.items` compiles and runs, and is wrong
once there are more than 50.

The exception is a small fixed set: a page's widgets, the facet definitions, config fields, the
connectors that exist, a look-up by ids. Those always come back whole, with `nextCursor: null`, and
their functions take no `limit` or `cursor` (the API refuses them). More in [Lists](lists.md).

### One word for search, sort, dates and related things

Where a list can do one of these, it now says it the same way as every other list. The older spelling
is gone from the types, and the API refuses it by name (`This list has no "search" parameter. Use "q".`).

| To | SDK 2 (varied by list) | SDK 3 |
|---|---|---|
| Search | `search`, `query`, `query.search` | `q` |
| Sort | `sort: 'createdAt:desc'`, `sort` + `order`, `sortBy` + `sortOrder`, `order: 'ASC'` | `orderBy: [{ createdAt: 'desc' }]` |
| Filter on a date field | `createdFrom` / `createdTo`, `recordedAfter` / `recordedBefore`, `query.createdAfter` / `Before`, `createdAt: 'gte:…'` | `createdAt: { gte, lte }` (the field's own name) |
| Bring related things along | `includeItems: true`, `expandFacets`, `includes: ['assets']`, `include` | `expand: ['items']` |
| Time window of a log or schedule | `from` / `to` (`since` on the error log) | `from` / `to` |

```typescript
// SDK 2
await app.cases.list(c, appId, { sort: '-createdAt', createdAt: 'gte:2026-11-01' })
await products.query(c, { query: { search: 'oak', updatedAfter: since }, sort: [{ field: 'name', direction: 'asc' }] })
await order.list(c, { includeItems: true })
await knowledge.publicSearch(c, { query: 'descale', k: 3 })

// SDK 3
await app.cases.list(c, appId, { orderBy: [{ createdAt: 'desc' }], createdAt: { gte: '2026-11-01T00:00:00Z' } })
await products.query(c, { q: 'oak', updatedAt: { gte: since }, orderBy: [{ name: 'asc' }] })
await order.list(c, { expand: ['items'] })
await knowledge.publicSearch(c, { q: 'descale', limit: 3 })
```

Three things to watch:

- **A bare sort field used to mean descending** on app records, cases, threads and bookings
  (`sort: 'createdAt'` was newest first). `orderBy` always says the direction.
- **A date is a full date and time.** A plain date, a `gte:` prefix or an operator the list doesn't have
  used to be ignored without a word; now it is refused. `gte` and `lte` include the moment you give.
- **A list sorts by the fields it names** and brings along the things it names; anything else is refused,
  with the ones it has. The option types list them.

**A common pattern to fix while you're here:** fetching a whole list and filtering or counting it in the
browser. That worked on small collections and falls over on large ones. Ask the server instead, with the
[standard query](standard-query.md).

## Renamed and removed

Everything marked `@deprecated` in SDK 2 is removed, except the old `attestation` namespace (see
[What hasn't changed](#what-hasnt-changed)).

<!-- upgrade-table:names:start -->
**Renamed** (the same call under a new name):

| SDK 2 | SDK 3 | Note |
|---|---|---|
| `ContactSchema` | `ContactSchemaResponse` |  |
| `MobileAdminBundleManifest` | `AdminMobileBundleManifest` |  |
| `MobileAdminComponentManifest` | `AdminMobileComponentManifest` |  |
| `product.clone` | `products.clone` |  |
| `product.create` | `products.create` |  |
| `product.createClaimWindow` | `products.createClaimWindow` |  |
| `product.get` | `products.get` | The whole `product` namespace (singular) is gone: use `products`. |
| `product.getSN` | `products.getSN` |  |
| `product.list` | `products.list` | Then treat it as a list: `products.list` returns ListResult<ProductResponse>. |
| `product.listAssets` | `products.listAssets` | Then treat it as a list: `products.listAssets` returns ListResult<AssetResponse>. |
| `product.lookupSN` | `products.lookupSN` |  |
| `product.publicCreateClaim` | `products.publicCreateClaim` |  |
| `product.publicLookupClaim` | `products.publicLookupClaim` |  |
| `product.refresh` | `products.refresh` |  |
| `product.remove` | `products.remove` |  |
| `product.update` | `products.update` |  |
| `product.updateClaimWindow` | `products.updateClaimWindow` |  |
| `ScannerEventSubscriber` | `AdminMobileEventCallback` |  |
| `async.enqueueAsyncJob` | `jobs.enqueue` | The `async` namespace is gone: starting and following a job live in `jobs` with listing them. |
| `async.getAsyncJobStatus` | `jobs.status` |  |
| `jobs.listJobs` | `jobs.list` | Then treat it as a list: `jobs.list` returns ListResult<Job>. |
| `jobs.getJob` | `jobs.get` |  |

**Removed** (no like-for-like call):

| SDK 2 | Do this instead |
|---|---|
| `ai.generateContent` | Use `ai.chat.completions.create`. A different call: it takes chat messages, not `contents`, and answers in the chat-completions shape (`choices[0].message.content`). `ai.chat.completions.create(collectionId, { messages: [{ role: "user", content }] })`. |
| `Asset.thumbnails` | Use `Asset.thumbnail`. One thumbnail address (`string \| null`), not a map of sizes. |
| `asset.uploadAsset` | Use `asset.upload`. Takes one options object: `asset.upload({ file, scope, … })` (type UploadAssetOptions). |
| `BatchCreateRequest.id` | The server generates the batch id. Don't send one. |
| `comms.queryRecipientsWithAction` | Use `comms.queryRecipientsWithInteraction`. It posted to an address the API never had, so it never worked. The real call takes `interactionId` (not `actionId`) and returns a list of ids, or of `{ id, outcome }` with `includeOutcome: true`. |
| `comms.queryRecipientsWithoutAction` | Use `comms.queryRecipientsWithoutInteraction`. It posted to an address the API never had, so it never worked. The real call takes `interactionId` (not `actionId`) and returns a list of ids. |
| `CommsRecipientsWithActionQuery` | Use `CommsRecipientsWithInteractionQuery`. `actionId` is `interactionId`. |
| `CommsRecipientsWithoutActionQuery` | Use `CommsRecipientsWithoutInteractionQuery`. `actionId` is `interactionId`. |
| `evaluateCondition` | Use `evaluateConditions`. Takes the field's whole condition list: `evaluateConditions(property.conditions, property.showWhen, values)`. |
| `FirebaseTimestamp` | Dates are ISO 8601 strings or a Date: `BatchCreateRequest.expiryDate` and `BatchUpdateRequest.expiryDate` are `string \| Date`. |
| `order.findByProduct` | Use `order.query`. The API never had this address, so the call could only fail. Use `order.query(collectionId, { query: { productId } })`. |
| `order.findItemsByProduct` | Use `order.query`. The API never had this address, so the call could only fail. Use `order.query(collectionId, { query: { productId }, includeItems: true })` and read each order's items. |
| `order.findOrdersByProduct` | Use `order.query`. The API never had this address, so the call could only fail. Use `order.query(collectionId, { query: { productId } })`. |
| `order.getOrderIdsByAttribute` | Use `order.query`. The API never had this address, so the call could only fail. Use `order.query` with `productId`, `batchId` or `variantId` in `query`, and read the ids from `items`. |
| `order.lookup` | Use `order.query`. The API never had this address, so the call could only fail. Find the orders that hold items with `order.query(collectionId, { query: { items: [{ itemType, itemId }] } })`. |
| `product.find` | Use `products.query`. A different body (type ProductQueryRequest). Returns a list and pages with `limit` + `cursor`. |
| `product.publicFind` | Use `products.get` when you know the id, `products.query` to search. The server retired this route some time ago. |
| `realtime.getAdminToken` | Use `realtime.onMine`. The SDK gets its own tokens. Subscribe with `realtime.onMine(scope, onMessage)`. |
| `realtime.getPublicToken` | The SDK gets its own tokens. Subscribe with `realtime.channel(scope, name)` or `realtime.onChange(scope, filter, onChange)`. |
| `site.ready` | Sites are server-rendered and nothing waits for the signal. Delete the call. |
| `VariantCreateRequest.id` | The server generates the variant id. Don't send one. |

<!-- upgrade-table:names:end -->

## Options that went

These options were accepted by SDK 2 and did nothing, or only worked for an admin. SDK 3's types no
longer have them.

<!-- upgrade-table:options:start -->
| Function | Option | Why, and what to do |
|---|---|---|
| `asset.list` | `mimeTypePrefix` | No asset list ever read it, so it never filtered anything. Filter the items you get back (`a.mimeType?.startsWith('image/')`), or as an admin use `asset.listAdmin` with `assetType`. |
| `authKit.list` | `admin (the argument)` | There is no public list of AuthKit configs, so the call without `true` always failed. Call `authKit.list(collectionId)`. |
| `bookings.mine` | `contactId` | `mine` is always the caller's own bookings. To list a contact's bookings as an admin use `bookings.list`. |
| `collection.list` | `admin (the argument)` | There is no public list of collections, so `collection.list(false)` always failed. Call `collection.list()`: it lists the collections the signed-in user can work on. |
| `comms.queryRecipientIds` | `journeyStepId` | The server never read it. For one journey step's recipients use `journeysAnalytics.recipients`. |
| `containers.publicList` | `status` | The public list is always the active containers. |
| `containers.publicList` | `ref` | The public list never filtered by ref. |
| `facets.list` | `includeValues` | The list never read it: a facet list has no values. Read one facet with `facets.get(…, { includeValues: true })`, or its values with `facets.listValues`. |
| `facets.publicList` | `includeValues` | The list never read it. Read a facet's values with `facets.publicListValues`. |
| `interactions.publicMyInteractions` | `scope` | The server never read it. |
| `lots.publicList` | `includeDeleted` | Admin only: use `lots.list`. |
| `attestations.summary` | `recordedAfter` | Now `recordedAt: { gte: … }`, the same range the attestation lists take. |
| `attestations.summary` | `recordedBefore` | Now `recordedAt: { lte: … }`, the same range the attestation lists take. |
| `attestations.publicSummary` | `recordedAfter` | Now `recordedAt: { gte: … }`, the same range the attestation lists take. |
| `attestations.publicSummary` | `recordedBefore` | Now `recordedAt: { lte: … }`, the same range the attestation lists take. |
| `attestations.treeSummary` | `recordedAfter` | Now `recordedAt: { gte: … }`, the same range the attestation lists take. |
| `attestations.treeSummary` | `recordedBefore` | Now `recordedAt: { lte: … }`, the same range the attestation lists take. |
| `attestations.publicTreeSummary` | `recordedAfter` | Now `recordedAt: { gte: … }`, the same range the attestation lists take. |
| `attestations.publicTreeSummary` | `recordedBefore` | Now `recordedAt: { lte: … }`, the same range the attestation lists take. |
| `attestations.publicContainerSummary` | `recordedAfter` | Now `recordedAt: { gte: … }`, the same range the attestation lists take. |
| `attestations.publicContainerSummary` | `recordedBefore` | Now `recordedAt: { lte: … }`, the same range the attestation lists take. |
| `attestations.publicContainerTreeSummary` | `recordedAfter` | Now `recordedAt: { gte: … }`, the same range the attestation lists take. |
| `attestations.publicContainerTreeSummary` | `recordedBefore` | Now `recordedAt: { lte: … }`, the same range the attestation lists take. |
<!-- upgrade-table:options:end -->

## Errors

Every error from the API is now `{ error: { code, message, details, requestId } }`. The SDK still throws
`SmartlinksApiError`, so `try`/`catch` code keeps its structure. What changes is what's inside:

```typescript
try {
  await products.get(collectionId, productId)
} catch (e) {
  if (e instanceof SmartlinksApiError) {
    e.statusCode   // 404
    e.errorCode    // 'NOT_FOUND'  ← check this in code
    e.message      // for people; may change
    e.details      // extra facts, e.g. { unknown: ['serach'], allowed: [...] }
    e.requestId    // quote this when reporting a problem
  }
}
```

- **Codes are all `UPPER_SNAKE`.** A code that was dotted or camel-case in SDK 2 changes spelling:
  `segments.list.failed` is `SEGMENTS_LIST_FAILED`. Search your app for string comparisons against
  `errorCode`, `details.errorCode` and `details.error`.
- **Two statuses are corrected.** "Not signed in" used to arrive from some routes as `400`; it is `401`.
  "Signed in but not allowed" used to arrive from some routes as `401`; it is `403`. `isAuthError()`
  covers both.
- **Don't match on message text.** Messages are for people and are being rewritten. Use `errorCode`.
- **An address that doesn't exist** answers `404 ROUTE_NOT_FOUND` with what was wrong and the nearest
  real addresses.
- **A `429`** carries `Retry-After` when the server knows when to try again.

Not changed: answers from an app's own server functions, and the OpenAI-compatible AI routes, which keep
their own error shapes.

## A list refuses options it doesn't read

In SDK 2 a mistyped or unsupported query option was silently ignored. Now a list answers
`400 UNKNOWN_PARAMETER`, naming the options it does read. Two things this catches in existing apps:

- one options object shared between an admin call and a public call, carrying an admin-only option
  (`includeDeleted`, `status` on public app records, `contactId`, `assignedTo`);
- an option that never existed on that list.

Pass each list only the options its type has. The types now say which are admin-only.

## API version

`initializeApi({ apiVersion })` can ask for a **newer** version than the SDK was built for. An older one
is ignored: SDK 3's functions return `2027-01` shapes. To stay on `2026-11`, stay on SDK 2.

## Apps that run inside the Portal or Hub

A component doesn't bundle the SDK: it uses the host's copy. So that SDK 2 apps and SDK 3 apps can run
side by side, the shared-dependency contract goes to **v8** with SDK 3
([host-dependency-contract.md](host-dependency-contract.md)):

- Build with `SHARED_DEPENDENCY_SPECIFIERS` from SDK 3 as your externals, as before. Your manifest then
  says `sharedDependencies: "v8"` and the host gives you SDK 3.
- An older build of your app, and other apps still on SDK 2, keep getting SDK 2. Nothing changes for them.
- The `SL` prop the host hands your component is SDK 3 too. If you read the SDK from the window
  global rather than an import, it is `window.SL3` (`window.SL` stays SDK 2).
- Keep building both formats (`moduleFormat: "dual"`). For now the host loads the UMD build of an app
  on SDK 3.
- The sign-in UI (`@proveanything/smartlinks-auth-ui`) is the host's one copy, as before.
- `@proveanything/smartlinks-utils-ui` is bundled into your app and calls the SDK itself, so it must be
  a version that works on SDK 3.

## What the compiler won't catch

Search for these by hand (or let the Forge step do it):

- `errorCode` compared with a dotted or camel-case string, and any test on error message text.
- A list result typed `any` (JavaScript files, `as any`, untyped hooks): `.length`, `.map`, `.filter`
  on the result itself instead of on `.items`.
- React Query (or other) caches keyed on `offset` or `page`: key on the cursor.
- A list that used to return everything, read as if it still does (`const { items } = await x.list(…)`
  with no `limit`, `cursor` or `all`). It compiles. The upgrade report marks each one.
- An options object passed to both the admin and the public form of a list.
- `window.SL` used directly in a v8 build.

## What hasn't changed

- **The old `attestation` namespace** (singular) is still there, still deprecated. Its data hasn't been
  moved to the new `attestations` yet, so apps that write with it can't move yet. It goes in a later
  release, once the data has moved.
- **Server functions.** `ctx.sl.*` inside an app's server function runs on the server, not through the
  SDK, and keeps the shapes it has.
- **The standard query** (`proof.query`, `contact.query`, `products.standardQuery`, `app.records.query`)
  already returned `{ items, nextCursor, count? }`.
- **Everything that isn't a list**: get, create, update, delete, actions.

## Every list that changed

<!-- upgrade-table:lists:start -->
150 functions. `ListResult<T>` is `{ items: T[], nextCursor, count? }`.

| Function | SDK 2 returned | SDK 3 returns | Options |
|---|---|---|---|
| `adminCards.list` | `{ cards, hidden, layout }` | `ListResult<AdminCard> & { hidden, layout }` | always whole |
| `ai.agent.listTools` | `AgentToolsResponse { tools }` | `ListResult<AgentToolDefinition>` | always whole |
| `ai.skills.list` | `SkillsListResponse { skills }` | `ListResult<SkillDescriptor>` | always whole |
| `analytics.admin.events` | `{ source, limit, offset, sort, count, rows }` | `ListResult<Record<string, any>> & { source, sort }` | no `offset`, `sort`; now `cursor`, `orderBy` |
| `app.cases.list` | `{ data, pagination: { total, limit, offset, hasMore } }` | `ListResult<AppCase>` | no `offset`, `sort`; now `cursor`, `orderBy` |
| `app.options.get` | `{ items, version, mode, total? } | { unchanged: true, version }` | `(ListResult<AppOption> & { version, mode }) | { unchanged: true, version }` | now `limit`, `cursor`; **one page now** |
| `app.records.list` | `{ data, pagination: { total, limit, offset, hasMore } }` | `ListResult<AppRecord>` | no `offset`, `sort`; now `cursor`, `orderBy` |
| `app.records.match` | `{ data, total, strategy }` | `ListResult<MatchEntry> & { strategy }` | now `cursor`, `limit` |
| `app.records.resolveAll` | `{ records, total, context, truncated }` | `ListResult<ResolveAllEntry> & { context, truncated }` | now `cursor`, `limit` |
| `app.threads.list` | `{ data, pagination: { total, limit, offset, hasMore } }` | `ListResult<AppThread>` | no `offset`, `sort`; now `cursor`, `orderBy` |
| `appConfiguration.getData` | `any[]` | `ListResult<any>` | now `limit`, `cursor`; **one page now** |
| `appConfiguration.getWidgets` | `{ apps }` | `ListResult<CollectionAppWidget>` | always whole |
| `asset.list` | `Asset[]` | `ListResult<Asset>` | no `offset`; now `cursor`, `limit`; **one page now** |
| `asset.listAdmin` | `AdminListAssetsResponse { data, total, limit, offset }` | `ListResult<Asset>` | no `offset`, `sort`, `order`; now `cursor`, `orderBy` |
| `asset.listForCollection` | `Asset[]` | `ListResult<Asset>` | now `limit`, `cursor`; **one page now** |
| `asset.listForProduct` | `Asset[]` | `ListResult<Asset>` | now `limit`, `cursor`; **one page now** |
| `asset.listForProof` | `Asset[]` | `ListResult<Asset>` | now `limit`, `cursor`; **one page now** |
| `attestation.list` | `AttestationResponse[]` | `ListResult<AttestationResponse>` | now `limit`, `cursor`; **one page now** |
| `attestations.list` | `{ attestations }` | `ListResult<Attestation>` | no `offset`, `recordedAfter`, `recordedBefore`; now `cursor`, `recordedAt` |
| `attestations.publicContainerList` | `{ attestations, audience }` | `ListResult<Attestation> & { audience }` | no `offset`, `recordedAfter`, `recordedBefore`; now `cursor`, `recordedAt` |
| `attestations.publicList` | `{ attestations, audience }` | `ListResult<Attestation> & { audience }` | no `offset`, `recordedAfter`, `recordedBefore`; now `cursor`, `recordedAt` |
| `authKit.list` | `AuthKitConfig[]` | `ListResult<AuthKitConfig>` | now `limit`, `cursor`; **one page now** |
| `authKit.listTrustedDevices` | `{ devices: TrustedDevice[] }` | `ListResult<TrustedDevice>` | now `limit`, `cursor`; **one page now** |
| `batch.getBatchTags` | `BatchTag[]` | `ListResult<BatchTag>` | now `limit`, `cursor`; **one page now** |
| `batch.list` | `BatchResponse[]` | `ListResult<BatchResponse>` | now `limit`, `cursor`; **one page now** |
| `batch.searchInCollection` | `BatchResponse[]` | `ListResult<BatchResponse>` | no `search`; now `q`, `cursor`, `limit` |
| `bookings.blocks.list` | `PaginatedResponse<BookingAllocation>` | `ListResult<BookingAllocation> (with count)` | no `offset`; now `cursor` |
| `bookings.list` | `PaginatedResponse<Booking> = { data, pagination: { total, limit, offset, hasMore } }` | `ListResult<Booking> (with count)` | no `offset`, `sort`; now `cursor`, `orderBy` |
| `bookings.mine` | `PaginatedResponse<Booking>` | `ListResult<Booking> (with count)` | no `offset`, `sort`; now `cursor`, `orderBy` |
| `bookings.slots.list` | `PaginatedResponse<BookingSlot>` | `ListResult<BookingSlot> (with count)` | no `offset`, `sort`; now `cursor`, `orderBy` |
| `broadcasts.list` | `BroadcastList = { items, limit, offset }` | `ListResult<BroadcastRecord>` | no `offset`; now `cursor` |
| `broadcasts.recipients` | `{ items, total, limit, offset, note? }` | `ListResult<Recipient> & { note?: string } (with count)` | no `offset`; now `cursor` |
| `claimSet.getAll` | `any[]` | `ListResult<any>` | now `limit`, `cursor`; **one page now** |
| `claimSet.getAssignedTags` | `any (the claim set with its tags in tags)` | `ListResult<any> & Record<string, any>` | now `limit`, `cursor`; **one page now** |
| `claimSet.ranges.list` | `ClaimSetRange[]` | `ListResult<ClaimSetRange>` | now `limit`, `cursor`; **one page now** |
| `claimSet.ranges.tags` | `ClaimSetRangeTagsPage { tags, next }` | `ListResult<ClaimSetRangeTag>` | no `from`; now `cursor` |
| `collection.getUsers` | `CollectionUser[]` | `ListResult<CollectionUser>` | now `limit`, `cursor`; **one page now** |
| `collection.list` | `CollectionResponse[]` | `ListResult<CollectionResponse>` | now `limit`, `cursor`; **one page now** |
| `comms.listMethods` | `{ ok: true, methods: CommMethod[] }` | `ListResult<CommMethod>` | always whole |
| `comms.queryByUser` | `CommunicationEvent[]` | `ListResult<CommunicationEvent>` | now `cursor`, `limit` |
| `comms.queryRecipientIds` | `RecipientId[]` | `ListResult<RecipientId>` | now `cursor`, `limit` |
| `conditions.list` | `SavedCondition[]` | `ListResult<SavedCondition>` | now `limit`, `cursor`; **one page now** |
| `config.getFields` | `FieldDefinition[]` | `ListResult<FieldDefinition>` | always whole |
| `config.getProofTypes` | `ProofTypeDefinition[]` | `ListResult<ProofTypeDefinition>` | always whole |
| `contact.findDuplicates` | `{ pairs, scanned, more }` | `ListResult<ContactDuplicatePair> & { scanned: number }` | no `offset`; now `cursor` |
| `contact.list` | `ContactListResponse = { items, limit, offset }` | `ListResult<Contact>` | no `offset`; now `cursor` |
| `contact.search` | `ContactSearchResponse = { items, limit, offset }` | `ListResult<Contact>` | no `offset`, `createdFrom`, `createdTo`; now `cursor`, `createdAt` |
| `containers.findForItem` | `{ items: ContainerItem[], containers: Container[] }` | `ListResult<ContainerItem> & { containers: Container[] }` | now `limit`, `cursor`; **one page now** |
| `containers.list` | `ListContainersResponse = { containers, limit, offset }` | `ListResult<Container>` | no `offset`; now `cursor` |
| `containers.listItems` | `ContainerItemsResponse = { items, limit, offset }` | `ListResult<ContainerItem>` | no `offset`; now `cursor` |
| `containers.publicList` | `PublicListContainersResponse = { containers }` | `ListResult<Container>` | no `offset`; now `cursor` |
| `containers.publicListItems` | `ContainerItemsResponse = { items, limit, offset }` | `ListResult<ContainerItem>` | no `limit`, `offset`; now `limit`, `cursor`; **one page now** |
| `crate.list` | `ListCratesResponse = { items, hasMore, lastId }` | `ListResult<Crate>` | no `startAfter`; now `cursor` |
| `dpp.groups` | `DppGroup[] (the function unwrapped { groups })` | `ListResult<DppGroup>` | always whole |
| `dpp.passports.list` | `DppPassport[] (unwrapped { passports })` | `ListResult<DppPassport>` | no `offset`; now `cursor` |
| `dpp.passports.versions` | `DppPassportVersion[] (unwrapped { versions })` | `ListResult<DppPassportVersion>` | now `limit`, `cursor`; **one page now** |
| `dpp.registry.list` | `DppRegistry[] (unwrapped { registries })` | `ListResult<DppRegistry>` | always whole |
| `dpp.tasks.list` | `DppTask[] (unwrapped { tasks })` | `ListResult<DppTask>` | now `limit`, `cursor`; **one page now** |
| `facets.list` | `FacetListResponse = { items }` | `ListResult<FacetDefinition>` | always whole |
| `facets.listValues` | `FacetValueListResponse = { facet, items }` | `ListResult<FacetValue> & { facet: FacetDefinition }` | now `limit`, `cursor`; **one page now** |
| `facets.namespaces` | `FacetNamespaceListResponse = { namespaces: string[] }` | `ListResult<string>` | always whole |
| `facets.publicList` | `FacetListResponse = { items }` | `ListResult<FacetDefinition>` | always whole |
| `facets.publicListValues` | `FacetValueListResponse = { facet, items }` | `ListResult<FacetValue> & { facet: FacetDefinition }` | now `limit`, `cursor`; **one page now** |
| `facets.publicNamespaces` | `FacetNamespaceListResponse = { namespaces: string[] }` | `ListResult<string>` | always whole |
| `facets.publicQuery` | `FacetQueryResponse = { items, buckets, meta? }` | `ListResult<{ facet, values }> & { buckets: FacetBucket[], meta? }` | no `query.search`, `query.createdAfter`, `query.createdBefore`, `query.updatedAfter`, `query.updatedBefore`; now `q`, `createdAt`, `updatedAt`; always whole |
| `facets.query` | `FacetQueryResponse = { items, buckets, meta? }` | `ListResult<{ facet, values }> & { buckets: FacetBucket[], meta? }` | no `query.search`, `query.createdAfter`, `query.createdBefore`, `query.updatedAfter`, `query.updatedBefore`; now `q`, `createdAt`, `updatedAt`; always whole |
| `files.list` | `{ ok: true, files: FileRecord[] }` | `ListResult<FileRecord>` | now `cursor`, `limit` |
| `form.list` | `any[]` | `ListResult<any>` | now `limit`, `cursor`; **one page now** |
| `integrations.listConnectorActions` | `{ actions }` | `ListResult<{ name, title, description?, visibility, input?, output? }>` | always whole |
| `integrations.listConnectors` | `{ connectors }` | `ListResult<InstalledConnector>` | always whole |
| `integrations.listEntityRuns` | `{ runs, nextCursor? }` | `ListResult<FlowRun>` | now `cursor`, `limit` |
| `integrations.listFailed` | `{ direction, items, nextCursor }` | `ListResult<FailedRecord> & { direction: FlowDirection }` |  |
| `integrations.listFlows` | `{ flows }` | `ListResult<IntegrationFlow>` | now `limit`, `cursor`; **one page now** |
| `integrations.listRecordTypes` | `{ recordTypes }` | `ListResult<RecordTypeInfo>` | always whole |
| `integrations.listRunItems` | `{ items, nextCursor? }` | `ListResult<FlowRunItem>` |  |
| `integrations.listRuns` | `{ runs, nextCursor? }` | `ListResult<FlowRun>` |  |
| `interactions.list` | `{ items, limit, offset }` | `ListResult<InteractionTypeRecord>` | no `offset`; now `cursor` |
| `interactions.publicList` | `{ items, limit, offset }` | `ListResult<InteractionTypeRecord>` | no `offset`; now `cursor` |
| `interactions.publicMyInteractions` | `InteractionEventRow[]` | `ListResult<InteractionEventRow>` | now `cursor`, `limit` |
| `interactions.query` | `InteractionEventRow[]` | `ListResult<InteractionEventRow>` | no `order`, `include`; now `cursor`, `orderBy`, `expand`, `limit` |
| `jobs.list` | `{ items, limit, offset }` | `ListResult<Job>` | no `offset`; now `cursor` |
| `journeys.list` | `{ items, limit, offset }` | `ListResult<JourneyRecord>` | no `offset`; now `cursor` |
| `journeysAnalytics.recipients` | `string[]` | `ListResult<string>` | now `cursor`, `limit` |
| `knowledge.listSets` | `KnowledgeSet[]` | `ListResult<KnowledgeSet>` | now `limit`, `cursor`; **one page now** |
| `knowledge.listSources` | `KnowledgeSource[]` | `ListResult<KnowledgeSource>` | now `limit`, `cursor`; **one page now** |
| `knowledge.publicSearch` | `KnowledgeSearchResponse { query, results, mode }` | `ListResult<KnowledgeSearchResult> & Pick<KnowledgeSearchResponse, 'query' | 'mode'>` | no `query`, `k`; now `q`, `limit`, `cursor` |
| `knowledge.search` | `{ query, results, mode }` | `ListResult<KnowledgeSearchResult> & { query, mode }` | no `query`, `k`; now `q`, `limit`, `cursor` |
| `location.search` | `{ items, count }` | `ListResult<Location>` | no `sort`; now `cursor`, `orderBy`, `limit` |
| `lots.list` | `Lot[] (the SDK unwrapped { lots })` | `ListResult<Lot>` | no `search`; now `limit`, `cursor`, `q`; **one page now** |
| `lots.listProducts` | `{ products, total, page, limit }` | `ListResult<LotProductSummary>` | no `page`; now `cursor` |
| `lots.publicList` | `Lot[] (the SDK unwrapped { lots })` | `ListResult<Lot>` | no `search`; now `limit`, `cursor`, `q`; **one page now** |
| `lots.publicListProducts` | `{ products, total, page, limit }` | `ListResult<LotProductSummary>` | no `page`; now `cursor` |
| `loyalty.getMemberHistory` | `{ items, limit, offset }` | `ListResult<LoyaltyTransaction>` | no `offset`; now `cursor` |
| `loyalty.list` | `LoyaltyScheme[]` | `ListResult<LoyaltyScheme>` | now `limit`, `cursor`; **one page now** |
| `loyalty.listEarningRules` | `LoyaltyEarningRule[]` | `ListResult<LoyaltyEarningRule>` | now `limit`, `cursor`; **one page now** |
| `loyalty.listMembers` | `{ items, limit, offset }` | `ListResult<LoyaltyMember>` | no `offset`; now `cursor` |
| `loyalty.publicGetMe` | `LoyaltySchemeWithMembership[]` | `ListResult<LoyaltySchemeWithMembership>` | now `limit`, `cursor`; **one page now** |
| `loyalty.publicGetMineHistory` | `{ items, limit, offset }` | `ListResult<LoyaltyTransaction>` | no `offset`; now `cursor` |
| `loyalty.publicList` | `LoyaltyScheme[]` | `ListResult<LoyaltyScheme>` | now `limit`, `cursor`; **one page now** |
| `loyalty.publicListEarningRules` | `LoyaltyEarningRule[]` | `ListResult<LoyaltyEarningRule>` | now `limit`, `cursor`; **one page now** |
| `nfc.lookupTag` | `NfcTagInfo[]` | `ListResult<NfcTagInfo>` | always whole |
| `order.getItems` | `{ items, limit, offset }` | `ListResult<OrderItem>` | no `offset`; now `cursor` |
| `order.getLocationHistory` | `{ orderRef, orderId, locations, count }` | `ListResult<LocationScan> & { orderRef: string; orderId: string }` | now `cursor`, `limit` |
| `order.getTimeline` | `{ orderRef, orderId, timeline, count }` | `ListResult<TagScanEvent> & { orderRef: string; orderId: string }` | now `cursor`, `limit` |
| `order.list` | `{ orders, limit, offset }` | `ListResult<Order>` | no `offset`, `includeItems`; now `cursor`, `expand` |
| `order.query` | `{ orders, limit, offset }` | `ListResult<Order>` | no `offset`, `query.sortBy`, `query.sortOrder`, `query.createdAfter`, `query.createdBefore`, `query.updatedAfter`, `query.updatedBefore`, `includeItems`; now `cursor`, `orderBy`, `createdAt`, `updatedAt`, `expand` |
| `partner.claimSets` | `PartnerClaimSet[]` | `ListResult<PartnerClaimSet>` | now `limit`, `cursor`; **one page now** |
| `partner.list` | `Partner[]` | `ListResult<Partner>` | now `limit`, `cursor`; **one page now** |
| `partner.lookupTags` | `PartnerTagHit[]` | `ListResult<PartnerTagHit>` | always whole |
| `partner.tagAttempts` | `ClientErrorEvent[]` | `ListResult<ClientErrorEvent>` | now `limit`, `cursor` |
| `products.list` | `ProductResponse[]` | `ListResult<ProductResponse>` | now `limit`, `cursor`, `expand`; **one page now** |
| `products.listAssets` | `unknown` | `ListResult<AssetResponse>` | now `limit`, `cursor`; **one page now** |
| `products.query` | `{ items, page: { limit, offset, returned, total, hasMore, nextCursor }, meta }` | `ListResult<ProductResponse> & { meta?: ProductQueryMeta }` | no `page.limit`, `page.offset`, `page.cursor`, `query.search`, `sort`, `query.createdAfter`, `query.createdBefore`, `query.updatedAfter`, `query.updatedBefore`; now `limit`, `cursor`, `q`, `orderBy`, `createdAt`, `updatedAt`, `expand` |
| `proof.findByProduct` | `ProofResponse[]` | `ListResult<ProofResponse>` | no `lastCursor`, `page`, `perPage`, `includes`; now `limit`, `cursor`, `expand` |
| `proof.getByBatch` | `ProofResponse[]` | `ListResult<ProofResponse>` | now `limit`, `cursor`; **one page now** |
| `proof.getByProduct` | `ProofResponse[]` | `ListResult<ProofResponse>` | now `limit`, `cursor`; **one page now** |
| `proof.getByUser` | `ProofResponse[]` | `ListResult<ProofResponse>` | now `limit`, `cursor`; **one page now** |
| `proof.list` | `ProofResponse[]` | `ListResult<ProofResponse>` | no `include`; now `limit`, `cursor`, `expand`; **one page now** |
| `proof.listGrants` | `ProofGrant[]` | `ListResult<ProofGrant>` | now `limit`, `cursor`; **one page now** |
| `secrets.list` | `SecretList { secrets }` | `ListResult<SecretMeta>` | always whole |
| `secrets.listOwn` | `SecretList { secrets }` | `ListResult<SecretMeta>` | always whole |
| `segments.list` | `{ items, limit, offset }` | `ListResult<SegmentRecord>` | no `offset`; now `cursor` |
| `segments.recipients` | `{ items, limit, offset, total, note? }` | `ListResult<Recipient> & { note?: string }` | no `offset`; now `cursor` |
| `serviceAccounts.list` | `{ serviceAccounts, access }` | `ListResult<ServiceAccount> & { access: ServiceAccountAccess[] }` | now `limit`, `cursor`; **one page now** |
| `shop.admin.listOrders` | `{ items, total, limit, offset }` | `ListResult<ShopAdminOrder>` | no `offset`; now `cursor` |
| `shop.admin.listPrices` | `{ items, total, limit, offset }` | `ListResult<ShopPrice>` | no `offset`; now `cursor` |
| `shop.myOrders` | `{ items, total, limit, offset }` | `ListResult<ShopBuyerOrder>` | no `offset`; now `cursor` |
| `shop.products` | `{ currency, items }` | `ListResult<ShopProduct> & { currency: string }` | now `limit`, `cursor`; **one page now** |
| `subscriptions.admin.list` | `{ items, total, limit, offset }` | `ListResult<Membership>` | no `offset`; now `cursor` |
| `subscriptions.admin.listPlans` | `{ items, total, limit, offset }` | `ListResult<PlanWithPrices>` | no `offset`; now `cursor` |
| `subscriptions.mine` | `MySubscription[]` | `ListResult<MySubscription>` | now `limit`, `cursor`; **one page now** |
| `subscriptions.plans` | `PublicPlan[]` | `ListResult<PublicPlan>` | now `limit`, `cursor`; **one page now** |
| `tags.byRef` | `{ tags }` | `ListResult<Tag>` | now `limit`, `cursor`; **one page now** |
| `tags.list` | `{ tags, limit, offset }` | `ListResult<Tag>` | no `offset`; now `cursor` |
| `tags.lookupTags` | `{ count, tags, embedded }` | `ListResult<Tag> & { count: number; embedded: TagEmbedded }` | always whole |
| `tags.lookupTagsQuery` | `{ count, tags, embedded }` | `ListResult<Tag> & { count: number; embedded: TagEmbedded }` | always whole |
| `tags.publicByRef` | `{ tags, embedded }` | `ListResult<Tag> & { embedded: TagEmbedded }` | now `limit`, `cursor`; **one page now** |
| `tags.publicByRefPost` | `{ tags, embedded }` | `ListResult<Tag> & { embedded: TagEmbedded }` | now `limit`, `cursor`; **one page now** |
| `template.getAll` | `Template[]` | `ListResult<Template>` | now `limit`, `cursor`; **one page now** |
| `template.getAllowed` | `TemplatePublic[]` | `ListResult<TemplatePublic>` | now `limit`, `cursor`; **one page now** |
| `template.getAllowedGlobal` | `TemplatePublic[]` | `ListResult<TemplatePublic>` | now `limit`, `cursor`; **one page now** |
| `translations.list` | `{ items, total?, limit?, offset? }` | `ListResult<TranslationRecord>` | no `offset`; now `cursor` |
| `userAppData.list` | `any[]` | `ListResult<any>` | now `limit`, `cursor`; **one page now** |
| `userGroups.history` | `UserGroupChange[]` | `ListResult<UserGroupChange>` | now `cursor`, `limit` |
| `userGroups.list` | `UserGroup[]` | `ListResult<UserGroup>` | now `limit`, `cursor`; **one page now** |
| `userGroups.members` | `UserGroupMember[]` | `ListResult<UserGroupMember>` | now `limit`, `cursor`; **one page now** |
| `userGroups.ofUser` | `UserGroupRef[]` | `ListResult<UserGroupRef>` | now `limit`, `cursor`; **one page now** |
| `variant.list` | `VariantResponse[]` | `ListResult<VariantResponse>` | now `limit`, `cursor`; **one page now** |
| `wallet.list` | `{ ok: true, passes }` | `ListResult<WalletPass>` | now `limit`, `cursor`; **one page now** |
| `wallet.mine` | `{ ok: true, passes }` | `ListResult<WalletPassSummary>` | now `limit`, `cursor`; **one page now** |
<!-- upgrade-table:lists:end -->
