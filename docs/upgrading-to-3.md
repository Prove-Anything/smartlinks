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
const { items }              = await products.list(collectionId)
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

A list that was never paged still isn't: it returns everything in `items` with `nextCursor: null`, and
its function takes no `limit` or `cursor`. More in [Lists](lists.md).

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
- If you read the SDK from the window global rather than an import, it is `window.SL3` (SDK 2 stays
  `window.SL`).
- UI packages that use the SDK (`@proveanything/smartlinks-auth-ui`, `@proveanything/smartlinks-utils-ui`)
  need their SDK 3 versions.

## What the compiler won't catch

Search for these by hand (or let the Forge step do it):

- `errorCode` compared with a dotted or camel-case string, and any test on error message text.
- A list result typed `any` (JavaScript files, `as any`, untyped hooks): `.length`, `.map`, `.filter`
  on the result itself instead of on `.items`.
- React Query (or other) caches keyed on `offset` or `page`: key on the cursor.
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
| `adminCards.list` | `{ cards, hidden, layout }` | `ListResult<AdminCard> & { hidden, layout }` |  |
| `ai.agent.listTools` | `AgentToolsResponse { tools }` | `ListResult<AgentToolDefinition>` |  |
| `ai.skills.list` | `SkillsListResponse { skills }` | `ListResult<SkillDescriptor>` |  |
| `analytics.admin.events` | `{ source, limit, offset, sort, count, rows }` | `ListResult<Record<string, any>> & { source, sort }` | no `offset`; now `cursor` |
| `app.cases.list` | `{ data, pagination: { total, limit, offset, hasMore } }` | `ListResult<AppCase>` | no `offset`; now `cursor` |
| `app.options.get` | `{ items, version, mode, total? } | { unchanged: true, version }` | `(ListResult<AppOption> & { version, mode }) | { unchanged: true, version }` |  |
| `app.records.list` | `{ data, pagination: { total, limit, offset, hasMore } }` | `ListResult<AppRecord>` | no `offset`; now `cursor` |
| `app.records.match` | `{ data, total, strategy }` | `ListResult<MatchEntry> & { strategy }` |  |
| `app.records.resolveAll` | `{ records, total, context, truncated }` | `ListResult<ResolveAllEntry> & { context, truncated }` |  |
| `app.threads.list` | `{ data, pagination: { total, limit, offset, hasMore } }` | `ListResult<AppThread>` | no `offset`; now `cursor` |
| `appConfiguration.getData` | `any[]` | `ListResult<any>` |  |
| `appConfiguration.getWidgets` | `{ apps }` | `ListResult<CollectionAppWidget>` |  |
| `asset.list` | `Asset[]` | `ListResult<Asset>` | no `offset` |
| `asset.listAdmin` | `AdminListAssetsResponse { data, total, limit, offset }` | `ListResult<Asset>` | no `offset`; now `cursor` |
| `asset.listForCollection` | `Asset[]` | `ListResult<Asset>` |  |
| `asset.listForProduct` | `Asset[]` | `ListResult<Asset>` |  |
| `asset.listForProof` | `Asset[]` | `ListResult<Asset>` |  |
| `attestation.list` | `AttestationResponse[]` | `ListResult<AttestationResponse>` |  |
| `attestations.list` | `{ attestations }` | `ListResult<Attestation>` | no `offset`; now `cursor` |
| `attestations.publicContainerList` | `{ attestations, audience }` | `ListResult<Attestation> & { audience }` | no `offset`; now `cursor` |
| `attestations.publicList` | `{ attestations, audience }` | `ListResult<Attestation> & { audience }` | no `offset`; now `cursor` |
| `authKit.list` | `AuthKitConfig[]` | `ListResult<AuthKitConfig>` |  |
| `authKit.listTrustedDevices` | `{ devices: TrustedDevice[] }` | `ListResult<TrustedDevice>` |  |
| `batch.getBatchTags` | `BatchTag[]` | `ListResult<BatchTag>` |  |
| `batch.list` | `BatchResponse[]` | `ListResult<BatchResponse>` |  |
| `batch.searchInCollection` | `BatchResponse[]` | `ListResult<BatchResponse>` |  |
| `bookings.blocks.list` | `PaginatedResponse<BookingAllocation>` | `ListResult<BookingAllocation> (with count)` | no `offset`; now `cursor` |
| `bookings.list` | `PaginatedResponse<Booking> = { data, pagination: { total, limit, offset, hasMore } }` | `ListResult<Booking> (with count)` | no `offset`; now `cursor` |
| `bookings.mine` | `PaginatedResponse<Booking>` | `ListResult<Booking> (with count)` | no `offset`; now `cursor` |
| `bookings.slots.list` | `PaginatedResponse<BookingSlot>` | `ListResult<BookingSlot> (with count)` | no `offset`; now `cursor` |
| `broadcasts.list` | `BroadcastList = { items, limit, offset }` | `ListResult<BroadcastRecord>` | no `offset`; now `cursor` |
| `broadcasts.recipients` | `{ items, total, limit, offset, note? }` | `ListResult<Recipient> & { note?: string } (with count)` | no `offset`; now `cursor` |
| `claimSet.getAll` | `any[]` | `ListResult<any>` |  |
| `claimSet.getAssignedTags` | `any (the claim set with its tags in tags)` | `ListResult<any> & Record<string, any>` |  |
| `claimSet.ranges.list` | `ClaimSetRange[]` | `ListResult<ClaimSetRange>` |  |
| `claimSet.ranges.tags` | `ClaimSetRangeTagsPage { tags, next }` | `ListResult<ClaimSetRangeTag>` | no `from`; now `cursor` |
| `collection.getUsers` | `CollectionUser[]` | `ListResult<CollectionUser>` |  |
| `collection.list` | `CollectionResponse[]` | `ListResult<CollectionResponse>` |  |
| `comms.listMethods` | `{ ok: true, methods: CommMethod[] }` | `ListResult<CommMethod>` |  |
| `comms.queryByUser` | `CommunicationEvent[]` | `ListResult<CommunicationEvent>` |  |
| `comms.queryRecipientIds` | `RecipientId[]` | `ListResult<RecipientId>` |  |
| `conditions.list` | `SavedCondition[]` | `ListResult<SavedCondition>` |  |
| `config.getFields` | `FieldDefinition[]` | `ListResult<FieldDefinition>` |  |
| `config.getProofTypes` | `ProofTypeDefinition[]` | `ListResult<ProofTypeDefinition>` |  |
| `contact.findDuplicates` | `{ pairs, scanned, more }` | `ListResult<ContactDuplicatePair> & { scanned: number }` | no `offset`; now `cursor` |
| `contact.list` | `ContactListResponse = { items, limit, offset }` | `ListResult<Contact>` | no `offset`; now `cursor` |
| `contact.search` | `ContactSearchResponse = { items, limit, offset }` | `ListResult<Contact>` | no `offset`; now `cursor` |
| `containers.findForItem` | `{ items: ContainerItem[], containers: Container[] }` | `ListResult<ContainerItem> & { containers: Container[] }` |  |
| `containers.list` | `ListContainersResponse = { containers, limit, offset }` | `ListResult<Container>` | no `offset`; now `cursor` |
| `containers.listItems` | `ContainerItemsResponse = { items, limit, offset }` | `ListResult<ContainerItem>` | no `offset`; now `cursor` |
| `containers.publicList` | `PublicListContainersResponse = { containers }` | `ListResult<Container>` | no `offset`; now `cursor` |
| `containers.publicListItems` | `ContainerItemsResponse = { items, limit, offset }` | `ListResult<ContainerItem>` | no `limit`, `offset` |
| `crate.list` | `ListCratesResponse = { items, hasMore, lastId }` | `ListResult<Crate>` | no `startAfter`; now `cursor` |
| `dpp.groups` | `DppGroup[] (the function unwrapped { groups })` | `ListResult<DppGroup>` |  |
| `dpp.passports.list` | `DppPassport[] (unwrapped { passports })` | `ListResult<DppPassport>` | no `offset`; now `cursor` |
| `dpp.passports.versions` | `DppPassportVersion[] (unwrapped { versions })` | `ListResult<DppPassportVersion>` |  |
| `dpp.registry.list` | `DppRegistry[] (unwrapped { registries })` | `ListResult<DppRegistry>` |  |
| `dpp.tasks.list` | `DppTask[] (unwrapped { tasks })` | `ListResult<DppTask>` |  |
| `facets.list` | `FacetListResponse = { items }` | `ListResult<FacetDefinition>` |  |
| `facets.listValues` | `FacetValueListResponse = { facet, items }` | `ListResult<FacetValue> & { facet: FacetDefinition }` |  |
| `facets.namespaces` | `FacetNamespaceListResponse = { namespaces: string[] }` | `ListResult<string>` |  |
| `facets.publicList` | `FacetListResponse = { items }` | `ListResult<FacetDefinition>` |  |
| `facets.publicListValues` | `FacetValueListResponse = { facet, items }` | `ListResult<FacetValue> & { facet: FacetDefinition }` |  |
| `facets.publicNamespaces` | `FacetNamespaceListResponse = { namespaces: string[] }` | `ListResult<string>` |  |
| `facets.publicQuery` | `FacetQueryResponse = { items, buckets, meta? }` | `ListResult<{ facet, values }> & { buckets: FacetBucket[], meta? }` |  |
| `facets.query` | `FacetQueryResponse = { items, buckets, meta? }` | `ListResult<{ facet, values }> & { buckets: FacetBucket[], meta? }` |  |
| `files.list` | `{ ok: true, files: FileRecord[] }` | `ListResult<FileRecord>` |  |
| `form.list` | `any[]` | `ListResult<any>` |  |
| `integrations.listConnectorActions` | `{ actions }` | `ListResult<{ name, title, description?, visibility, input?, output? }>` |  |
| `integrations.listConnectors` | `{ connectors }` | `ListResult<InstalledConnector>` |  |
| `integrations.listEntityRuns` | `{ runs, nextCursor? }` | `ListResult<FlowRun>` |  |
| `integrations.listFailed` | `{ direction, items, nextCursor }` | `ListResult<FailedRecord> & { direction: FlowDirection }` |  |
| `integrations.listFlows` | `{ flows }` | `ListResult<IntegrationFlow>` |  |
| `integrations.listRecordTypes` | `{ recordTypes }` | `ListResult<RecordTypeInfo>` |  |
| `integrations.listRunItems` | `{ items, nextCursor? }` | `ListResult<FlowRunItem>` |  |
| `integrations.listRuns` | `{ runs, nextCursor? }` | `ListResult<FlowRun>` |  |
| `interactions.list` | `{ items, limit, offset }` | `ListResult<InteractionTypeRecord>` | no `offset`; now `cursor` |
| `interactions.publicList` | `{ items, limit, offset }` | `ListResult<InteractionTypeRecord>` | no `offset`; now `cursor` |
| `interactions.publicMyInteractions` | `InteractionEventRow[]` | `ListResult<InteractionEventRow>` |  |
| `interactions.query` | `InteractionEventRow[]` | `ListResult<InteractionEventRow>` |  |
| `jobs.listJobs` | `{ items, limit, offset }` | `ListResult<Job>` | no `offset`; now `cursor` |
| `journeys.list` | `{ items, limit, offset }` | `ListResult<JourneyRecord>` | no `offset`; now `cursor` |
| `journeysAnalytics.recipients` | `string[]` | `ListResult<string>` |  |
| `knowledge.listSets` | `KnowledgeSet[]` | `ListResult<KnowledgeSet>` |  |
| `knowledge.listSources` | `KnowledgeSource[]` | `ListResult<KnowledgeSource>` |  |
| `knowledge.publicSearch` | `KnowledgeSearchResponse { query, results, mode }` | `ListResult<KnowledgeSearchResult> & Pick<KnowledgeSearchResponse, 'query' | 'mode'>` |  |
| `knowledge.search` | `{ query, results, mode }` | `ListResult<KnowledgeSearchResult> & { query, mode }` |  |
| `location.search` | `{ items, count }` | `ListResult<Location>` |  |
| `lots.list` | `Lot[] (the SDK unwrapped { lots })` | `ListResult<Lot>` |  |
| `lots.listProducts` | `{ products, total, page, limit }` | `ListResult<LotProductSummary>` | no `page`; now `cursor` |
| `lots.publicList` | `Lot[] (the SDK unwrapped { lots })` | `ListResult<Lot>` |  |
| `lots.publicListProducts` | `{ products, total, page, limit }` | `ListResult<LotProductSummary>` | no `page`; now `cursor` |
| `loyalty.getMemberHistory` | `{ items, limit, offset }` | `ListResult<LoyaltyTransaction>` | no `offset`; now `cursor` |
| `loyalty.list` | `LoyaltyScheme[]` | `ListResult<LoyaltyScheme>` |  |
| `loyalty.listEarningRules` | `LoyaltyEarningRule[]` | `ListResult<LoyaltyEarningRule>` |  |
| `loyalty.listMembers` | `{ items, limit, offset }` | `ListResult<LoyaltyMember>` | no `offset`; now `cursor` |
| `loyalty.publicGetMe` | `LoyaltySchemeWithMembership[]` | `ListResult<LoyaltySchemeWithMembership>` |  |
| `loyalty.publicGetMineHistory` | `{ items, limit, offset }` | `ListResult<LoyaltyTransaction>` | no `offset`; now `cursor` |
| `loyalty.publicList` | `LoyaltyScheme[]` | `ListResult<LoyaltyScheme>` |  |
| `loyalty.publicListEarningRules` | `LoyaltyEarningRule[]` | `ListResult<LoyaltyEarningRule>` |  |
| `nfc.lookupTag` | `NfcTagInfo[]` | `ListResult<NfcTagInfo>` |  |
| `order.getItems` | `{ items, limit, offset }` | `ListResult<OrderItem>` | no `offset`; now `cursor` |
| `order.getLocationHistory` | `{ orderRef, orderId, locations, count }` | `ListResult<LocationScan> & { orderRef: string; orderId: string }` |  |
| `order.getTimeline` | `{ orderRef, orderId, timeline, count }` | `ListResult<TagScanEvent> & { orderRef: string; orderId: string }` |  |
| `order.list` | `{ orders, limit, offset }` | `ListResult<Order>` | no `offset`; now `cursor` |
| `order.query` | `{ orders, limit, offset }` | `ListResult<Order>` | no `offset`; now `cursor` |
| `partner.claimSets` | `PartnerClaimSet[]` | `ListResult<PartnerClaimSet>` |  |
| `partner.list` | `Partner[]` | `ListResult<Partner>` |  |
| `partner.lookupTags` | `PartnerTagHit[]` | `ListResult<PartnerTagHit>` |  |
| `partner.tagAttempts` | `ClientErrorEvent[]` | `ListResult<ClientErrorEvent>` |  |
| `products.list` | `ProductResponse[]` | `ListResult<ProductResponse>` |  |
| `products.listAssets` | `unknown` | `ListResult<AssetResponse>` |  |
| `products.query` | `{ items, page: { limit, offset, returned, total, hasMore, nextCursor }, meta }` | `ListResult<ProductResponse> & { meta?: ProductQueryMeta }` | no `page.limit`, `page.offset`, `page.cursor`; now `limit`, `cursor` |
| `proof.findByProduct` | `ProofResponse[]` | `ListResult<ProofResponse>` | no `lastCursor`, `page`, `perPage`; now `limit` |
| `proof.getByBatch` | `ProofResponse[]` | `ListResult<ProofResponse>` |  |
| `proof.getByProduct` | `ProofResponse[]` | `ListResult<ProofResponse>` |  |
| `proof.getByUser` | `ProofResponse[]` | `ListResult<ProofResponse>` |  |
| `proof.list` | `ProofResponse[]` | `ListResult<ProofResponse>` |  |
| `proof.listGrants` | `ProofGrant[]` | `ListResult<ProofGrant>` |  |
| `secrets.list` | `SecretList { secrets }` | `ListResult<SecretMeta>` |  |
| `secrets.listOwn` | `SecretList { secrets }` | `ListResult<SecretMeta>` |  |
| `segments.list` | `{ items, limit, offset }` | `ListResult<SegmentRecord>` | no `offset`; now `cursor` |
| `segments.recipients` | `{ items, limit, offset, total, note? }` | `ListResult<Recipient> & { note?: string }` | no `offset`; now `cursor` |
| `serviceAccounts.list` | `{ serviceAccounts, access }` | `ListResult<ServiceAccount> & { access: ServiceAccountAccess[] }` |  |
| `shop.admin.listOrders` | `{ items, total, limit, offset }` | `ListResult<ShopAdminOrder>` | no `offset`; now `cursor` |
| `shop.admin.listPrices` | `{ items, total, limit, offset }` | `ListResult<ShopPrice>` | no `offset`; now `cursor` |
| `shop.myOrders` | `{ items, total, limit, offset }` | `ListResult<ShopBuyerOrder>` | no `offset`; now `cursor` |
| `shop.products` | `{ currency, items }` | `ListResult<ShopProduct> & { currency: string }` |  |
| `subscriptions.admin.list` | `{ items, total, limit, offset }` | `ListResult<Membership>` | no `offset`; now `cursor` |
| `subscriptions.admin.listPlans` | `{ items, total, limit, offset }` | `ListResult<PlanWithPrices>` | no `offset`; now `cursor` |
| `subscriptions.mine` | `MySubscription[]` | `ListResult<MySubscription>` |  |
| `subscriptions.plans` | `PublicPlan[]` | `ListResult<PublicPlan>` |  |
| `tags.byRef` | `{ tags }` | `ListResult<Tag>` |  |
| `tags.list` | `{ tags, limit, offset }` | `ListResult<Tag>` | no `offset`; now `cursor` |
| `tags.lookupTags` | `{ count, tags, embedded }` | `ListResult<Tag> & { count: number; embedded: TagEmbedded }` |  |
| `tags.lookupTagsQuery` | `{ count, tags, embedded }` | `ListResult<Tag> & { count: number; embedded: TagEmbedded }` |  |
| `tags.publicByRef` | `{ tags, embedded }` | `ListResult<Tag> & { embedded: TagEmbedded }` |  |
| `tags.publicByRefPost` | `{ tags, embedded }` | `ListResult<Tag> & { embedded: TagEmbedded }` |  |
| `template.getAll` | `Template[]` | `ListResult<Template>` |  |
| `template.getAllowed` | `TemplatePublic[]` | `ListResult<TemplatePublic>` |  |
| `template.getAllowedGlobal` | `TemplatePublic[]` | `ListResult<TemplatePublic>` |  |
| `translations.list` | `{ items, total?, limit?, offset? }` | `ListResult<TranslationRecord>` | no `offset`; now `cursor` |
| `userAppData.list` | `any[]` | `ListResult<any>` |  |
| `userGroups.history` | `UserGroupChange[]` | `ListResult<UserGroupChange>` |  |
| `userGroups.list` | `UserGroup[]` | `ListResult<UserGroup>` |  |
| `userGroups.members` | `UserGroupMember[]` | `ListResult<UserGroupMember>` |  |
| `userGroups.ofUser` | `UserGroupRef[]` | `ListResult<UserGroupRef>` |  |
| `variant.list` | `VariantResponse[]` | `ListResult<VariantResponse>` |  |
| `wallet.list` | `{ ok: true, passes }` | `ListResult<WalletPass>` |  |
| `wallet.mine` | `{ ok: true, passes }` | `ListResult<WalletPassSummary>` |  |
<!-- upgrade-table:lists:end -->
