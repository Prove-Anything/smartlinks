# Integrations

An **integration flow** is one input/output pipeline between SmartLinks and an external
system. There are two directions:

- **outbound** — read a SmartLinks **product** that changed, or **one event** (an interaction, a
  contact change, a tag scan — any spine event) as the [envelope](#event-sourced-flows-and-the-envelope),
  transform it with field mappings, and send it to an external endpoint (signed, if you want).
- **inbound** — fetch from an external system and write a SmartLinks **product** or **contact**
  (a provider's view of a person: member id, tier, points — see [Contact as a target](#contact-as-a-target)).

Flows are triggered three ways, all converging on the same executor:

- **manual** — `integrations.runFlow(...)`, inline (returns a run summary) or enqueued.
- **event** — an outbound flow subscribed to an event type (e.g. `product.updated`,
  `interaction.submitted`, `contact.*`, `tag.scanned`, `*`) fires automatically when it happens. See
  [Event names and patterns](#event-names-and-patterns).
- **schedule** — a flow carrying a cron/interval `schedule` is run by the scan job. *(next)*

Provider-specific logic (a provider's payload format, its API, its connect form) lives in a
**connector app**, not in the engine: see **[Connectors](connectors.md)**. A flow uses one with
`config.connector = { appId }`.

**Reliability.** A record that fails is retried on its own with exponential backoff (honouring the
destination's `Retry-After`); a permanent failure (most 4xx) or one out of attempts is **dead** and
waits in `integrations.listFailed` for `integrations.retryFailed`. A destination that keeps failing
**pauses the flow automatically** (`flow.circuitOpenedAt`): edits are held, small probes check for
recovery, and it resumes on its own (or with `integrations.resumeFlow`).

**Observability.** `integrations.getHealth` shows every flow at a glance (paused?, running?, last 24h,
backlog); `getFlowHealth` one flow; `getProductLineage` where a product's data came from and where it
went. Every run and every record is kept in BigQuery (`analytics.integration_runs`,
`analytics.integration_run_items`); the API's run history is a 7-day window. Outbound sends carry
`X-SmartLinks-Run` (the run) and an `Idempotency-Key` (same record, same content → same key).

**Change capture.** Every product and record write is captured where it's saved, whatever made it (the
admin, an import, a server function). A product change *wakes* each subscribed outbound flow, which then
sweeps every product changed since its last sweep (deletions included). A burst of edits, such as a big
import, is one sweep, not one send per product. A reconciliation sweep every 15 minutes catches anything
a wake missed. Events that need one call each (app functions, flows on record events) are recorded
durably and retried until they're delivered.

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
  eventTypes: string[]                              // e.g. ['product.updated'], ['interaction.*'], ['*']
  schedule: string | null                           // cron/interval for scheduled flows
  sourceEntity: 'product' | 'interaction' | 'contact' | 'event' | null   // outbound: what it reads
  targetEntity: 'product' | 'contact' | null        // inbound: what it writes
  config: {
    connection?: {
      baseUrl?: string
      sendEndpoint?: string                          // outbound: appended to baseUrl
      defaultHeaders?: Record<string, string>
      auth?: { method: 'api_key' | 'bearer' | 'basic' | ..., headerName?: string, credentialRef?: string }
      timeoutMs?: number
    }
    signing?: { credentialRef: string, previousCredentialRef?: string }        // X-SmartLinks-Signature (below)
    identity?: { policy?: 'externalIds' | 'hashed' | 'raw', hashKeyCredentialRef?: string }  // event-sourced flows
    eventMapping?: EventMapping                       // event-sourced flows: many events → the provider's few
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

## Event names and patterns

A flow's `eventTypes` (and a server function's `trigger.eventTypes`) name events exactly or by prefix:

| Subscription | Matches |
|---|---|
| `product.updated` | exactly that |
| `interaction.submitted:<typeId>` | one interaction type's submissions |
| `interaction.*` | every interaction event |
| `record.updated:*` | record updates of any type |
| `*` | everything in the collection — a raw event stream |

Events on the spine today: `product.created / updated / deleted`, `record.<verb>[:<recordType>]`,
`interaction.submitted[:<typeId>]`, `contact.created / updated / deleted / erased`,
`tag.scanned[:<eventType>]` (a scan resolves in the redirect, before any page could run a tag),
`proof.created / transferred`, `attestation.created[:type]`, `booking.*`, `slot.*`.

---

## Event-sourced flows and the envelope

A flow with `sourceEntity: 'interaction' | 'contact' | 'event'` sends **one event per run** — not a
product. Every such event is wrapped in the same **envelope**, whatever the destination, and only then
mapped with the flow's field mappings (or handed to a connector's `serialize`):

```jsonc
{
  "specVersion": 1,                            // bumped only when a consumer could break
  "id": "0b2b…",                               // the event's id — stable across retries; use it as the destination's idempotency / transaction id
  "type": "interaction.submitted:quiz-1",
  "entityType": "interaction", "entityId": "0b2b…",
  "occurredAt": "2026-11-08T10:00:00.000Z",
  "collectionId": "…", "orgId": "…", "appId": "quiz",
  "identity": {
    "contactId": "…", "userId": "…",
    "externalIds": { "acme-loyalty": "M-9", "crm": "C-1" },     // ids other systems know this person by
    "anonymousId": "v-77", "sessionId": "s-1",                  // the visitor / device and session, before anyone signed in (every policy)
    "emailHash": "…", "phoneHash": "…", "hashAlgorithm": "hmac-sha256"   // policy 'hashed' (default)
    // "email", "phone": only under policy 'raw'
  },
  "identityPolicy": "hashed",
  "product": { "id": "P1", "name": "Widget", "sku": "W-1", "gtin": "0500…", "variantId": null, "batchId": null },
  "proof": { "id": "…" },
  "consent": { "channels": { "email": "opted_in", "sms": "suppressed", "push": "unknown", "whatsapp": "unknown" }, "topics": { "offers": true }, "updatedAt": "…" },   // null when about nobody we hold
  "subject": { "interactionId": "quiz-1", "outcome": "completed", "metadata": { "score": 9 }, "source": "hub" },
  "event": { "name": "engagement_completed", "attributes": { "kind": "quiz", "score": 9 }, "rule": "quiz" },   // from eventMapping
  "attributes": {}
}
```

Field mappings read envelope paths (`identity.externalIds.acme-loyalty`, `subject.outcome`,
`event.name`, `product.sku`). With no mappings the envelope itself is sent. A failed event delivery
keeps its envelope and is retried from it; a product is re-read instead.

**CloudEvents.** `config.envelopeFormat: 'cloudevents'` wraps each delivered body (mapped or not) as a
CloudEvents 1.0 structured event — `{ specversion: '1.0', id, type, source: 'urn:smartlinks:collection:<id>',
subject, time, datacontenttype, dataschema: 'urn:smartlinks:envelope:v1', data }` — the shape every event
bus, lake and serverless tool already consumes.

```ts
const flow = await integrations.createFlow(collectionId, {
  appId: 'core-integrations', direction: 'outbound', name: 'Engagement → loyalty', status: 'active',
  eventTypes: ['interaction.*', 'tag.scanned:*'],
  sourceEntity: 'event',
  config: {
    connection: { baseUrl: 'https://api.acme.example', sendEndpoint: '/events', auth: { method: 'bearer', credentialRef: ref } },
    signing: { credentialRef: signingRef },
    identity: { policy: 'hashed' },
    eventMapping: {
      rules: [
        { id: 'quiz', match: { interactionIds: ['quiz-1'], outcomes: ['completed'] }, event: 'engagement_completed',
          attributes: { kind: 'quiz', score: '{{ subject.metadata.score }}', sku: { path: 'product.sku' } } },
        { id: 'scan', match: { types: ['tag.scanned:*'] }, event: 'pack_scanned', attributes: { sku: { path: 'product.sku' } } },
      ],
      unmatched: 'skip',
    },
    fieldMappings: [
      { targetPath: 'event_name',     sourcePath: 'event.name', transformType: 'direct' },
      { targetPath: 'external_id',    sourcePath: 'identity.externalIds.acme-loyalty', transformType: 'direct' },
      { targetPath: 'transaction_id', sourcePath: 'id', transformType: 'direct' },
    ],
  },
})
```

### Identity policy

`config.identity.policy` decides what about the person leaves the platform:

| Policy | The envelope's `identity` carries |
|---|---|
| `externalIds` | `contactId`, `userId`, `externalIds` — nothing else |
| `hashed` (default) | the above plus `emailHash` / `phoneHash`: HMAC-SHA256 with a **per-collection** key, or the brand's own key when `identity.hashKeyCredentialRef` names one (so hashes match a mirror the brand built) |
| `raw` | the above plus `email` and `phone` |

No hash key configured on the server → no hashes, never an unkeyed hash.

### Event mapping

Loyalty and engagement platforms accept a small, pre-registered set of event names. `config.eventMapping`
folds our many interaction types into those names: rules in order, first match wins; `match` may name
`types` (exact or patterns), `interactionIds`, `outcomes`, `appIds`; attributes are literals, Liquid
templates over the envelope, or `{ path, default }`. Unmatched events are skipped (and shown as skipped
in the run) unless `unmatched: 'passthrough'`. When the flow has a connector with a `describeEvents`
step, the mapping is **validated when saved** against the provider's registered events and its
`limits` (`maxEvents`, `maxAttributes`): `createFlow` / `updateFlow` answer `400 EVENT_MAPPING_INVALID`
with `problems[]`.

### Signed deliveries

With `config.signing.credentialRef`, every HTTP delivery carries:

```
X-SmartLinks-Signature: t=1730900000,v1=<hex HMAC-SHA256(secret, `${t}.${rawBody}`)>
X-SmartLinks-Delivery:  <uuid, new per attempt>
X-SmartLinks-Event:     interaction.submitted:quiz-1
X-SmartLinks-Run:       <run id>
Idempotency-Key:        <flowId>:<eventId>:<hash of the body>
```

The signature covers the exact bytes of the body. A receiver recomputes it, compares in constant time,
and rejects `t` older than about five minutes. During a rotation `previousCredentialRef` adds a second
`v1=` so a receiver that knows either secret verifies.

Destinations must be **public hosts**: loopback, private ranges and cloud metadata addresses are
refused as a permanent failure. (Local development: `INTEGRATION_ALLOW_PRIVATE_DESTINATIONS=1` on the
server.)

### Contact as a target

An inbound flow with `targetEntity: 'contact'` writes a provider's view of a person. After the
connector's `shape` (or your field mappings) each record is a **member document**:

```jsonc
{
  "identity":    { "externalId": "M-9", "email": "ada@example.com" },      // contactId | externalId | email | phone — at least one
  "contact":     { "firstName": "Ada", "lastName": "Lovelace" },           // fills EMPTY profile fields only
  "externalIds": { "acme-crm": "C-1" },                                    // merged
  "customFields": { "region": "UK" },                                      // merged (never `comms`)
  "tags":        { "add": ["gold"], "remove": ["silver"] },
  "loyalty":     { "memberId": "M-9", "tier": "gold", "points": 1500, "status": "active", "asOf": "…", "attributes": { "since": 2024 } }
}
```

Matching: `contactId` → `externalIds[<provider>]` → email → phone; a new contact is created once however
many workers see the same member. Loyalty lands as `customFields.loyalty` plus flat
`customFields.loyaltyTier / loyaltyPoints / loyaltyMemberId / loyaltyProvider` for segments and comms
targeting. The same document is what a server function applies with `ctx.sl.members.apply(...)` (a
provider's webhook, see [connectors.md](connectors.md#loyalty-and-crm-connectors)).

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
| `secrets.set(collectionId, input)` | `POST /secrets` (generated ref — for flows; an app's server functions use `secrets.put`, see server-functions.md) |
| `secrets.get(collectionId, ref)` | `GET /secrets/:ref` |
| `secrets.rotate(collectionId, ref, input)` | `PUT /secrets/:ref` |
| `secrets.remove(collectionId, ref)` | `DELETE /secrets/:ref` |
