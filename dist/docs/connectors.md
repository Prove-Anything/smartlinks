# Integration connectors

A **connector** is an app that knows one external provider (a PIM, a content network, a shop
platform…). It is installed on a collection like any app, versioned and released like any app, and
it adds a manifest `connector` block plus a handful of [server functions](server-functions.md) the
integration engine and the integrations console call by convention.

Three layers, each with one job:

| Layer | Holds |
|---|---|
| **Engine** (the API) | [Integration flows](integrations.md), runs and their logs, triggers (events, schedule, Run now), the secret store, **the mapping** (each customer's field mappings and rules), generic transports (HTTP, Event Hub). No provider code. |
| **Integrations console** (a core app) | The one admin screen: installed connectors, connect forms, settings, the mapper with AI assist, flows, runs. |
| **Connector apps** | One per provider: an **adapter**. Talks to the provider and converts between its format and a clean, provider-neutral document. |

**A connector adapts; core maps.** A connector never holds a customer's mapping. It turns the
provider's records into provider-neutral documents (`shape`), or provider-ready payloads out of
documents core has already mapped (`serialize`). Every customer's mapping, routing and rules live in
core, so they work the same for every provider and can be replayed and traced. This is the line
SnapLogic (endpoint Snaps vs the Mapper), MuleSoft and Airbyte all draw.

A flow that only posts JSON to a webhook or an Event Hub needs no connector; it uses the engine's
generic transports (see [integrations.md](integrations.md)).

**No AI at run time.** The AI helps an admin *author* a mapping in the console (from the connector's
target schema plus real sample records); a person approves it, and it is saved as data and runs
deterministically. A connector's `shape` and `serialize` must be deterministic too.

---

## The manifest block

```jsonc
// app.manifest.json
"connector": {
  "provider": "oneworldsync",
  "title": "1WorldSync",
  "directions": ["inbound"],
  "entities": ["product"],
  "connection": {
    "fields": [
      // Optional: SmartLinks' own credentials are the default; a customer may enter theirs.
      { "name": "appId",     "label": "App ID",     "secret": "oneworldsync-app-id" },
      { "name": "secretKey", "label": "Secret key", "secret": "oneworldsync-secret-key" },
      { "name": "gln", "label": "GLN", "required": true },
      { "name": "environment", "label": "Environment", "type": "select",
        "options": [ { "value": "preprod", "label": "Pre-production" }, { "value": "production", "label": "Production" } ] }
    ]
  },
  "settings": {                       // JSON Schema → a form in the console
    "type": "object",
    "properties": { "targetMarket": { "type": "string", "default": "GB" } }
  },
  "presets": [
    { "id": "import-products", "title": "Import products", "direction": "inbound", "entity": "product",
      "flow": { "config": { "fieldMappings": [ /* a suggested mapping the customer can edit */ ] } } }
  ],
  "functions": {                      // names of this app's server functions
    "testConnection": "testConnection",
    "describeTarget": "describeTarget",
    "sample": "sample",
    "shape": "shape",
    "fetch": "fetch"
  },
  "panels": [ { "id": "explorer", "title": "Explorer", "component": "Explorer" } ],
  "aiGuide": "connector-ai-guide.md"
},
"functions": {
  "files": { "js": { "umd": "dist/functions.umd.js" } },
  "definitions": [
    { "name": "testConnection", "trigger": { "type": "http", "method": "POST" },
      "visibility": "admin", "authority": "collection",
      "capabilities": ["network:content1-api.1worldsync.com", "secrets:oneworldsync-app-id", "secrets:oneworldsync-secret-key"] }
    // …one definition per function named above
  ]
}
```

Types: `AppConnectorDeclaration` and friends in `@proveanything/smartlinks` (`src/types/appManifest.ts`).

| Field | Meaning |
|---|---|
| `provider` | Stable provider key (`syndigo`, `oneworldsync`). |
| `title` | Provider display name; defaults to the app name. |
| `directions` | `inbound` (provider → SmartLinks), `outbound` (SmartLinks → provider), or both. |
| `entities` | SmartLinks entities it maps, e.g. `["product"]`. |
| `connection.fields[]` | The console's **Connect** form. A field with `secret` is stored as this app's secret of that name on the collection (write-only; never returned to the browser). Other fields are saved in the installation's connection settings. |
| `settings` | JSON Schema for installation settings; the console renders it as a form. |
| `presets[]` | Ready-made flows ("Products → provider"). A preset's `flow.config.fieldMappings` is a **suggested** mapping: the connector's knowledge of the provider, which the customer accepts or edits in core. |
| `functions` | Which of this app's server functions implement each step (below). Fill in only what applies. |
| `panels[]` | Provider-specific screens the console mounts (an API explorer, a status page). |
| `aiGuide` | A guide the mapping assistant reads: the provider's quirks, required fields, good defaults. |
| `recordId` | Path of the provider's own id in a fetched record (e.g. `gtin`). Inbound records are landed and matched by it, so a re-import updates the same product instead of creating another. Default `id`; a flow can override it (`config.upsert.externalIdPath`). |
| `limits` | `{ requestsPerSecond }` toward the provider, enforced across every SmartLinks worker. |

---

## The functions

Each step names one of the app's server functions. Declare them as **http POST, `visibility:
"admin"`, `authority: "collection"`**: the engine calls them with no signed-in user (a product edit, a
schedule), and the console calls the same functions while an admin configures the flow. The input
arrives as `event.body`; return the result as JSON. Capabilities still cap what each one can do:
declare the provider's hosts (`network:<host>`) and the secrets it reads (`secrets:<name>`).

| Step | Called by | Input (`event.body`) | Returns |
|---|---|---|---|
| `testConnection` | Connect form, **Test** | `{ installation }` | `ConnectorTestResult` `{ ok, message }` |
| `describeTarget` | Mapper opens | `{ installation }` | `ConnectorTargetSchema` `{ fields: [{ path, label, type, required, enum }] }`: the provider's fields *for this customer*. Outbound mappings target these paths. |
| `sample` | Mapper, AI assist, dry run | `{ installation, limit }` | `ConnectorRecords` `{ records }`: real provider records |
| `fetch` | Every inbound run | `ConnectorFetchInput` `{ installation, cursor, limit }` | `ConnectorRecords` `{ records, nextCursor }`: one page per call |
| `shape` | Every inbound run (and sample dry runs) | `ConnectorShapeInput` `{ installation, records }` | `ConnectorShapeResult` `{ documents, skipped }`: one provider-neutral document per record, same order; `null` skips one |
| `serialize` | Every outbound run | `ConnectorSerializeInput` `{ installation, documents, eventType? }`: documents core mapped to `describeTarget` paths; a deletion arrives as `{ id, _deleted: true }` | `ConnectorSerializeResult` `{ payloads, skipped }`: one provider payload per document, same order; `null` skips one |
| `send` | Every outbound run | `ConnectorSendInput` `{ installation, payloads }` | `ConnectorSendResult` `{ results: [{ index, ok, status, error, externalId }] }` |

**How a run flows:**
- **Inbound:** `fetch` (paged; every record is landed as received) → `shape` → core maps the documents
  with the flow's mapping → upsert, matched by `recordId`. Unchanged records aren't processed again; a
  changed flow configuration replays the landed records without fetching.
- **Outbound:** gather the SmartLinks records → core maps them to the provider's fields → `serialize`
  → `send` (or a generic transport). A record identical to its last successful delivery isn't sent again.
- Large runs are processed in short slices that resume after an interruption; there's no record cap.

**What happens when a step is left out:**
- **No `shape`:** core maps the provider records as they come.
- **No `serialize`:** the mapped documents are sent as they are.
- **No `send`:** the flow's own transport is used: HTTP (`config.connection`), or Azure Event Hub with
  `config.transport: 'eventhub'` and `config.eventHub`.
- **No `describeTarget`:** the mapper offers free-text target paths.

**What `shape` should produce:** plain, predictable JSON a person can map without reading the
provider's documentation. Flatten the provider's envelopes, name things plainly, keep codes alongside
their meanings, and put repeated sections (ingredients, allergens, nutrients, images) in arrays. The
same provider record always gives the same document.

### `installation`

Every step receives the installation it serves:

```ts
interface ConnectorInstallation {
  collectionId: string
  appId: string             // the connector app
  flowId?: string | null    // when called for a flow
  connection: Record<string, unknown>   // non-secret Connect-form fields
  settings: Record<string, unknown>     // installation settings, with the flow's overrides on top
}
```

Secrets are never in it. Read them in the function with `ctx.secrets.get('<name>')`, which needs the
matching `secrets:<name>` capability. A secret the customer set on their collection wins; otherwise the
connector's own app-level secret of that name (set in Forge) is used, so a connector can ship with
SmartLinks' credentials as the default.

### Example: `fetch` and `shape`

```ts
// src/functions/index.ts (the app's functions bundle)
import type { ConnectorFetchInput, ConnectorRecords, ConnectorShapeInput, ConnectorShapeResult } from '@proveanything/smartlinks'

export async function fetch(ctx: any, event: any): Promise<ConnectorRecords> {
  const { installation, cursor, limit = 50 } = event.body as ConnectorFetchInput
  const appId = await ctx.secrets.get('provider-app-id')
  const key = await ctx.secrets.get('provider-secret-key')
  const res = await ctx.fetch(buildSignedUrl(installation, { cursor, limit }, appId, key))
  const page = await res.json()
  return { records: page.items, nextCursor: page.next ?? null }
}

export async function shape(_ctx: any, event: any): Promise<ConnectorShapeResult> {
  const { records } = event.body as ConnectorShapeInput
  return {
    documents: records.map((r: any) => ({
      gtin: r.item?.gtin,
      name: r.item?.tradeItemDescription?.[0]?.value,
      brand: r.item?.brandName,
      ingredients: (r.item?.ingredients ?? []).map((i: any) => ({ name: i.name, percent: i.percentage })),
    })),
  }
}
```

---

## Where configuration lives

| What | Where |
|---|---|
| Connect-form values (non-secret), installation settings | The connector app's config on the collection, in its admin-only zone (`admin.connector.connection`, `admin.connector.settings`). |
| Credentials | The connector app's secrets, by the names its fields declare (the customer's on their collection, else the connector's default). |
| One flow's use of the connector | The flow: `config.connector = { appId, preset?, settings? }` (per-flow settings override the installation's), plus `config.fieldMappings`, which core runs. |

```ts
await integrations.createFlow(collectionId, {
  appId: 'core-integrations',
  direction: 'inbound',
  name: 'Import products from 1WorldSync',
  status: 'active',
  schedule: '0 * * * *',
  targetEntity: 'product',
  config: {
    connector: { appId: 'oneworldsync', preset: 'import-products' },
    // Maps the connector's shaped documents (not the raw provider records) onto the product.
    fieldMappings: [ { targetPath: 'name', sourcePath: 'name', transformType: 'direct' } ],
  },
})
```

---

## From the console

```ts
import { integrations, secrets } from '@proveanything/smartlinks'

const { connectors } = await integrations.listConnectors(collectionId)
// → [{ appId, name, version, connector, installation: { connection, settings }, secrets: { 'provider-key': { set, hint } } }]

await secrets.put(collectionId, 'provider-key', value, { appId })              // a secret field
await integrations.saveConnectorInstallation(collectionId, appId, { connection: { environment: 'production' } })
const test = await integrations.runConnectorStep(collectionId, appId, 'testConnection')
const target = await integrations.runConnectorStep(collectionId, appId, 'describeTarget')
const { records } = await integrations.runConnectorStep(collectionId, appId, 'sample', { limit: 5 })
const shaped = await integrations.runConnectorStep(collectionId, appId, 'shape', { records })      // dry run
const wire = await integrations.runConnectorStep(collectionId, appId, 'serialize', { documents })  // dry run
```

`send` and `fetch` only run inside a flow. A flow run's summary carries `sent` (outbound) or
`created` / `updated` / `skipped` (inbound), and every run, inbound or outbound, is in the run history.

---

## Panels

A connector can contribute screens to the integrations console (an API explorer, say). Each
`panels[]` entry names a component exported from the app's widgets bundle; the console mounts it
host-side and passes it the collection and the installation. Panels are admin-only and call the
connector's own functions.

---

## Who can build connectors

First-party connectors run in-process, like any app server function. Third-party connectors will run
in the isolated runner (see [server-functions.md](server-functions.md)) once that opens up; the contract
does not change.
