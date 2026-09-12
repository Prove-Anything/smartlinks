# Integrations

An **integration flow** is one input/output pipeline between SmartLinks and an external
system. There are two directions:

- **outbound** — read a SmartLinks entity (v1: a product), transform it with field
  mappings, and send it to an external endpoint.
- **inbound** — fetch from an external system and write a SmartLinks entity. *(Executor is
  outbound-first; inbound lands in a later increment.)*

Flows are triggered three ways, all converging on the same executor:

- **manual** — `integrations.runFlow(...)`, inline (returns a run summary) or enqueued.
- **event** — an outbound flow subscribed to an event type (e.g. `product.updated`) fires
  automatically when that entity changes.
- **schedule** — a flow carrying a cron/interval `schedule` is run by the scan job. *(next)*

Credentials are **never** stored on the flow. The connection holds an opaque
`credentialRef` into the **sealed-secret store** (`secrets` namespace); the value is sealed
at rest and resolved server-side only, at execution.

---

## The flow model

```ts
interface IntegrationFlow {
  id: string
  direction: 'inbound' | 'outbound'
  name: string
  status: 'draft' | 'active' | 'paused' | 'error'  // only 'active' flows fire on events/schedule
  eventTypes: string[]                              // e.g. ['product.updated']
  schedule: string | null                           // cron/interval for scheduled flows
  sourceEntity: string | null                       // outbound source, v1: 'product'
  targetEntity: string | null                       // inbound target
  config: {
    connection?: {
      baseUrl?: string
      sendEndpoint?: string                          // outbound: appended to baseUrl
      defaultHeaders?: Record<string, string>
      auth?: { method: 'api_key' | 'bearer' | 'basic' | ..., headerName?: string, credentialRef?: string }
    }
    fieldMappings?: FieldMapping[]
  }
  // ...run watermark/telemetry: lastRunAt, lastRunStatus, lastRunCount, totalSynced
}
```

### Field mappings (transform)

Each mapping produces one field on the target payload:

| transformType | uses | meaning |
|---|---|---|
| `direct` | `sourcePath` | copy the value at that dot-path |
| `static` | `transformExpression` | a constant |
| `template` | `transformExpression` | a Liquid template rendered against the source record |
| `jsonata` / `ai` | — | recognised but not yet executed; reported as a per-field error |

A single field's failure is collected and the rest continue (partial success) — it never
aborts the whole record.

---

## Secrets (write-only)

The secret store is **write-only from the client**: you can set, rotate, list (refs +
masked hints + metadata) and delete — but a value never comes back over the API.

```ts
import { secrets, integrations } from '@proveanything/smartlinks'

// 1. Store the destination credential — keep the returned ref.
const { ref } = await secrets.set(collectionId, {
  name: 'Acme API key',
  purpose: 'integration',
  value: 'sk_live_…',           // sent once; never retrievable
})

// list shows refs + masked hints only (safe to render)
const { secrets: list } = await secrets.list(collectionId)
// → [{ ref, name: 'Acme API key', hint: '…live_1a2b', purpose, createdAt, ... }]
```

---

## Creating and running a flow

```ts
// 2. Create an outbound flow that pushes products to Acme, authed by the secret above.
const flow = await integrations.createFlow(collectionId, {
  appId: 'my-integration-app',
  direction: 'outbound',
  name: 'Push products to Acme',
  status: 'active',
  eventTypes: ['product.updated'],   // fire whenever a product changes
  sourceEntity: 'product',
  config: {
    connection: {
      baseUrl: 'https://api.acme.example',
      sendEndpoint: '/v1/products',
      auth: { method: 'api_key', headerName: 'X-API-Key', credentialRef: ref },
    },
    fieldMappings: [
      { targetPath: 'sku',   sourcePath: 'sku',  transformType: 'direct' },
      { targetPath: 'name',  sourcePath: 'name', transformType: 'direct' },
      { targetPath: 'label', transformType: 'template', transformExpression: '{{name}} ({{sku}})' },
    ],
  },
})

// 3a. Test it now against one product — inline, returns a summary.
const result = await integrations.runFlow(collectionId, flow.id, { entityId: 'P1045716' })
if (integrations.isRunSummary(result)) {
  console.log(result) // { records: 1, sent: 1, failed: 0, status: 'success' }
}

// 3b. Or enqueue on the worker (returns immediately).
await integrations.runFlow(collectionId, flow.id, { entityId: 'P1045716', async: true })
```

Once `status: 'active'` with `eventTypes: ['product.updated']`, editing that product in the
admin API fires the flow automatically — no manual run needed.

---

## Reference

| Function | HTTP |
|---|---|
| `integrations.listFlows(collectionId, query?)` | `GET /integrations/flows` |
| `integrations.createFlow(collectionId, input)` | `POST /integrations/flows` |
| `integrations.getFlow(collectionId, id)` | `GET /integrations/flows/:id` |
| `integrations.updateFlow(collectionId, id, input)` | `PUT /integrations/flows/:id` |
| `integrations.deleteFlow(collectionId, id)` | `DELETE /integrations/flows/:id` |
| `integrations.runFlow(collectionId, id, opts?)` | `POST /integrations/flows/:id/run` |
| `secrets.list(collectionId, query?)` | `GET /secrets` |
| `secrets.set(collectionId, input)` | `POST /secrets` |
| `secrets.get(collectionId, ref)` | `GET /secrets/:ref` |
| `secrets.rotate(collectionId, ref, input)` | `PUT /secrets/:ref` |
| `secrets.remove(collectionId, ref)` | `DELETE /secrets/:ref` |
