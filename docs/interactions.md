# Interactions: Event Tracking & Analytics

The `interactions` namespace is a **critical pattern** for tracking user engagement. Many apps rely heavily on it for logging events that can trigger journeys, feed analytics dashboards, and drive aggregated results such as vote counts.

If you want generic page analytics, outbound click tracking, QR landing telemetry, or tag scan dashboards, use [analytics.md](analytics.md) instead. `interactions` is for structured business events and outcomes, not general web analytics.

---

## Overview

Interactions have two distinct layers:

| Layer | Purpose |
|-------|---------|
| **Interaction Types** | Definitions stored in the database — configure an interaction's ID, permissions, and display metadata once per collection |
| **Interaction Events** | Individual event records logged each time a user performs that interaction |

Critical rule: event `interactionId` values must reference an existing interaction type definition in that collection. Do not generate random IDs in app code and submit events against them.

```text
┌──────────────────────────────────────────────────────────────────┐
│ Your App                                                         │
│                                                                  │
│  1. Create type once:  interactions.create(collectionId, {       │
│       id: 'vote', permissions: { uniquePerUser: true } })        │
│       -> definition exists in platform                           │
│                                                                  │
│  2. Log events:        interactions.appendEvent(collectionId, {  │
│       interactionId: 'vote', outcome: 'option-a', userId })      │
│       (must match the created definition ID)                     │
│                                                                  │
│  3. Read results:      interactions.countsByOutcome(collectionId, │
│       { interactionId: 'vote' })                                 │
│       → [{ outcome: 'option-a', count: 42 }, ...]               │
└──────────────────────────────────────────────────────────────────┘
```

### Required Workflow (Do Not Invent IDs)

1. Create an interaction type definition (admin endpoint) before recording any events.
2. Reuse that same definition ID for every `appendEvent` / `submitPublicEvent` call.
3. Treat unknown IDs as configuration errors, not as values your app should auto-create.

If your app currently hardcodes strings like `"poll"` or `"entry"`, make sure those IDs are actually created as interaction types during setup.

---

## Common Use Cases

| Use Case | `interactionId` example | `outcome` example |
|----------|-------------------------|-------------------|
| Competition entry | `competition-entry` | `"entered"` |
| Voting / polling | `vote` | `"option-a"` |
| Mailing list signup | `newsletter-signup` | `"subscribed"` |
| Warranty registration | `warranty-registration` | `"activated"` |
| Product scan / view | `product-view` | `"scanned"` |
| Form submission | `registration-form` | `"submitted"` |

---

## Interaction Types (Definitions)

Interaction types are defined once per collection and control permissions, display metadata, and uniqueness constraints.

### Create a Type

```typescript
await SL.interactions.create(collectionId, {
  id: 'vote',
  appId: 'my-app',
  permissions: {
    allowPublicSubmit: true,
    uniquePerUser: true,
    startAt: '2026-06-01T00:00:00Z',
    endAt: '2026-06-30T23:59:59Z',
    allowPublicSummary: true,
  },
  data: {
    display: {
      title: 'Vote',
      description: 'Cast your vote for the competition.',
    },
  },
});
```

### Update / Delete a Type

```typescript
// Update permissions or display
await SL.interactions.update(collectionId, 'vote', {
  permissions: { endAt: '2026-07-15T23:59:59Z' },
});

// Delete the definition (does not delete existing events)
await SL.interactions.remove(collectionId, 'vote');
```

### List / Get Types

```typescript
// Admin: list all types for an app
const { items } = await SL.interactions.list(collectionId, { appId: 'my-app' });

// Admin: get a single type
const type = await SL.interactions.get(collectionId, 'vote');

// Public: list available types (respects permissions)
const { items } = await SL.interactions.publicList(collectionId, { appId: 'my-app' });
```

---

## Logging Events

Before logging events, ensure the referenced interaction type already exists. Event ingestion is not intended to create new interaction definitions.

### Admin Event Append

Use on the server side or in admin flows. Requires `userId` **or** `contactId`.

```typescript
await SL.interactions.appendEvent(collectionId, {
  appId: 'my-app',
  interactionId: 'vote',
  outcome: 'option-a',      // The result / choice — used by countsByOutcome()
  userId: 'user_abc123',    // One of userId or contactId is required
  productId: 'prod_xyz',    // Optional — scope to a specific product
  scope: 'round-1',         // Optional — custom segmentation string
  metadata: { source: 'mobile', region: 'UK' },
});
```

### Public Event Submit

Use in client-side app code. Hits the public endpoint and respects interaction permissions (`allowPublicSubmit`, `allowAnonymousSubmit`, `requireAuth`, etc.).

```typescript
// Authenticated submission
await SL.interactions.submitPublicEvent(collectionId, {
  appId: 'my-app',
  interactionId: 'competition-entry',
  outcome: 'entered',
  contactId: currentUser.contactId,
  metadata: { answer: 'Paris' },
});

// Anonymous submission (interaction must have allowAnonymousSubmit: true)
const response = await SL.interactions.submitPublicEvent(collectionId, {
  appId: 'my-app',
  interactionId: 'nps-score',
  outcome: '9',
  metadata: {
    anonId: SL.utils.getAnonId(),  // device-level dedup signal
  },
});

if (!response.success) {
  if (response.reason === 'duplicate_anon') {
    // this device has already submitted
  }
}
```

> **Anonymous submissions** — when `allowAnonymousSubmit: true` is set on the interaction, neither `userId` nor `contactId` is required. Use `utils.getAnonId()` to generate a stable browser-local UUID and pass it as `metadata.anonId`; the server will enforce `uniquePerAnonId` if configured.

### Update an Existing Event

```typescript
await SL.interactions.updateEvent(collectionId, {
  eventId: 'evt_abc123',    // Required — the event to update
  interactionId: 'vote',
  userId: 'user_abc123',
  outcome: 'option-b',      // Override the outcome
  status: 'deleted',        // Soft-delete the event
});
```

### Event Body Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `interactionId` | string | ✅ | Existing interaction type ID (must already be defined in this collection) |
| `userId` or `contactId` | string | ✅ (one of) | The actor. `appendEvent` / `updateEvent` require one of these |
| `appId` | string | ❌ | Scopes the event to your app |
| `outcome` | string | ❌ | The result or choice — what `countsByOutcome()` aggregates |
| `scope` | string | ❌ | Custom segmentation (e.g., `"round-1"`, `"region-uk"`) |
| `productId` | string | ❌ | Scope to a product |
| `proofId` | string | ❌ | Scope to a proof |
| `broadcastId` | string | ❌ | Links the event to a broadcast campaign |
| `journeyId` | string | ❌ | Links the event to a journey run |
| `metadata` | object | ❌ | Arbitrary extra data stored with the event |
| `timestamp` | string | ❌ | ISO datetime override (defaults to server time) |
| `source` | string | ❌ | Free-text source tag (e.g., `"mobile"`, `"email-link"`) |

---

## Reading Results

### Counts by Outcome (Aggregations)

The primary analytics function — returns how many times each outcome was recorded:

```typescript
// Admin (full access, deduplication options)
const results = await SL.interactions.countsByOutcome(collectionId, {
  appId: 'my-app',
  interactionId: 'vote',
  scope: 'round-1',       // Optional — filter by scope
  from: '2026-06-01',     // Optional — date range
  to: '2026-06-30',
  dedupeLatest: true,     // Count only the latest event per user (for re-votes)
});
// Returns: [{ outcome: 'option-a', count: 42 }, { outcome: 'option-b', count: 37 }]

// Public (respects allowPublicSummary permission)
const results = await SL.interactions.publicCountsByOutcome(
  collectionId,
  { appId: 'my-app', interactionId: 'vote' },
  authToken     // Optional — pass if user is authenticated
);
```

### Query Event History

Flexible admin query for raw interaction events:

```typescript
const events = await SL.interactions.query(collectionId, {
  appId: 'my-app',
  interactionId: 'vote',
  userId: 'user_abc123',      // Filter by user
  outcome: 'option-a',        // Filter by outcome
  from: '2026-06-01T00:00Z',
  to: '2026-06-30T23:59Z',
  limit: 100,
  order: 'DESC',
  latestPerEventId: true,     // Deduplicate: one row per interactionId per user
  include: ['interaction'],   // Embed the interaction type definition in each row
});
```

### Public: User's Own History

Lets authenticated users see their own events:

```typescript
const myEvents = await SL.interactions.publicMyInteractions(
  collectionId,
  { appId: 'my-app', interactionId: 'vote' },
  authToken
);
```

---

## Permissions Reference

Set on the interaction type definition via `permissions`:

| Permission | Type | Description |
|------------|------|-------------|
| `enabled` | boolean | Master on/off switch for submissions (default: enabled) |
| `allowPublicSubmit` | boolean | Allow unauthenticated / public submissions |
| `allowAnonymousSubmit` | boolean | Allow submissions without any session |
| `requireAuth` | boolean | Block submissions unless user is authenticated |
| `allowedOrigins` | string[] | Restrict to specific site domains (substring match) |
| `startAt` | string (ISO) | Earliest time submissions are accepted |
| `endAt` | string (ISO) | Latest time submissions are accepted |
| `uniquePerUser` | boolean | Prevent duplicate submissions per user |
| `uniquePerUserWindowSeconds` | number | Time window for uniqueness (e.g., `86400` = 1 day) |
| `uniqueOutcome` | string | Outcome tag to check for duplicates (e.g., `"submitted"`) |
| `uniquePerAnonId` | boolean | Reject a second submission that carries the same `anonId` in metadata |
| `uniquePerAnonIdWindowSeconds` | number | Time window for `uniquePerAnonId` enforcement; `0` or omitted = all-time |
| `allowPublicSummary` | boolean | Show counts/aggregates to unauthenticated users |
| `allowAuthenticatedSummary` | boolean | Show counts/aggregates to authenticated users |
| `allowOwnRead` | boolean | Let users read their own event history via public API |

---

## Integration with Journeys

Interactions are the primary bridge between user actions and automated workflows:

```text
User submits interaction event
        ↓
Platform emits event to Journey trigger
        ↓
Journey step runs: send confirmation email, update CRM, award points, etc.
```

When defining a journey trigger, reference the `interactionId` that should fire it. The interaction `outcome` and `metadata` are available as variables in journey steps.

---

## Interaction Effects

**Interaction effects** are automatic side-effects that fire immediately after an interaction event is recorded. They are defined directly on the interaction definition (`data.effects`) and run inline, fire-and-forget — they never block or fail the interaction response.

Common use cases: send a confirmation email, post a webhook to a CRM, tag the contact, award loyalty points, create an app record, or add the contact to a segment.

### How It Works

1. Event is logged to BigQuery
2. Interaction definition is loaded
3. Each configured effect runs **in order**, fire-and-forget
4. Response is returned to the caller immediately

A failure in one effect is logged and swallowed; subsequent effects still run.

> **Note:** `transactional` and `webhook` effects currently run inline. They are planned to move to background jobs for retry-on-failure support once the jobs infrastructure is fully operational.

### Configuring Effects

Pass `data.effects` when creating or updating an interaction type:

```typescript
await SL.interactions.create(collectionId, {
  id: 'donation',
  appId: 'my-app',
  permissions: { allowPublicSubmit: true },
  data: {
    effects: [
      {
        type: 'transactional',
        config: {
          templateId: 'tmpl_donation_receipt',
          channel: 'email',
          props: {
            donationAmount: '{{metadata.amount}}',
            campaignName: '{{metadata.campaign}}',
          },
        },
      },
      {
        type: 'tag',
        config: { tags: ['donor'] },
      },
    ],
  },
});
```

### Token Interpolation

All effect `config` values support `{{token}}` interpolation resolved from the event context at runtime. Nested paths using dot notation are supported (e.g. `{{metadata.amount}}`).

| Token | Description |
|---|---|
| `{{eventId}}` | BigQuery event UUID |
| `{{collectionId}}` | Collection / brand ID |
| `{{appId}}` | App ID that submitted the event |
| `{{interactionId}}` | Interaction definition ID |
| `{{contactId}}` | Contact UUID (if resolved) |
| `{{userId}}` | Firebase UID (if authenticated) |
| `{{productId}}` | Product ID (if provided with event) |
| `{{proofId}}` | Proof ID (if provided with event) |
| `{{variantId}}` | Variant ID (if provided with event) |
| `{{batchId}}` | Batch ID (if provided with event) |
| `{{outcome}}` | Event outcome (e.g. `"submitted"`) |
| `{{eventType}}` | Event type string |
| `{{source}}` | Event source string |
| `{{timestamp}}` | ISO 8601 event timestamp |
| `{{metadata.*}}` | Any key from the event `metadata` object |

Tokens that resolve to `null` or `undefined` become an empty string.

### Effect Types

#### `loyalty`

Awards loyalty points by evaluating `LoyaltyEarningRule` records configured against this interaction. Earning rules are managed separately via the Loyalty API. If no rules are configured, this effect is a no-op.

```json
{ "type": "loyalty", "config": {} }
```

#### `transactional`

Sends a message to the contact using a comms template. Supports all channels with full Liquid template hydration.

```json
{
  "type": "transactional",
  "config": {
    "templateId": "tmpl_donation_receipt",
    "channel": "email",
    "props": {
      "donationAmount": "{{metadata.amount}}"
    }
  }
}
```

`channel` defaults to `"preferred"` — auto-selects the contact's best available channel respecting consent, suppression, and template availability. Optionally pass `include` to hydrate product/proof/user context, and `props` for additional Liquid variables.

#### `webhook`

Posts a JSON payload to an HTTP endpoint. All config values support `{{token}}` interpolation.

```json
{
  "type": "webhook",
  "config": {
    "url": "https://crm.example.com/api/events",
    "headers": { "Authorization": "Bearer sk_live_abc123" },
    "body": {
      "contactId": "{{contactId}}",
      "amount": "{{metadata.amount}}"
    },
    "timeout": 8000
  }
}
```

When `body` is omitted, a standard payload is sent containing `eventId`, `collectionId`, `appId`, `interactionId`, `contactId`, `userId`, `productId`, `proofId`, `outcome`, `eventType`, `metadata`, and `timestamp`.

#### `tag`

Adds or removes string tags on the contact record. Skipped if there is no `contactId` on the event.

```json
{
  "type": "tag",
  "config": {
    "tags": ["donor", "tier-{{metadata.tier}}"],
    "action": "add"
  }
}
```

`action` defaults to `"add"`. Duplicate adds are no-ops; removing a tag not present is a no-op.

#### `appRecord`

Creates or upserts an app record scoped to the event context. Use `singletonPer` for cardinality control — if a matching singleton already exists it is updated rather than duplicated.

```json
{
  "type": "appRecord",
  "config": {
    "recordType": "participation",
    "singletonPer": "contact",
    "data": {
      "participatedAt": "{{timestamp}}",
      "outcome": "{{outcome}}"
    }
  }
}
```

Common `singletonPer` values: `"contact"`, `"product"`, `"proof"`, `"global"`.

#### `segment`

Adds or removes the contact from a **static** segment. Skipped if there is no `contactId` on the event.

```json
{
  "type": "segment",
  "config": {
    "segmentId": "seg_donors_2026",
    "action": "add"
  }
}
```

The segment must already exist and be of `filterType: 'static'`.

### Effects Error Handling

| Scenario | Behaviour |
|---|---|
| Effect throws (e.g. template not found, webhook 500) | Error logged server-side; next effect continues |
| Contact has no email, `transactional` channel = `email` | Effect throws, logged, skipped |
| `contactId` absent on anonymous event | `tag`, `appRecord`, `segment` log a warning and skip |
| Unknown `type` value | Warning logged, effect skipped |
| `loyalty` — no earning rules configured | Silent no-op |
| Interaction has no `data.effects` | No effects run, no overhead |

Effects do **not** propagate errors back to the API caller.

---

## TypeScript Types

```typescript
import type {
  AppendInteractionBody,          // Event body for appendEvent and submitPublicEvent
  UpdateInteractionBody,          // Event body for updateEvent
  SubmitInteractionResponse,      // { success: true; eventId: string }
  SubmitInteractionError,         // { error: 'FORBIDDEN'; reason: string }
  InteractionEventRow,            // Raw event record returned by query()
  OutcomeCount,                   // { outcome: string | null; count: number }
  InteractionPermissions,         // Full permissions config shape
  InteractionTypeRecord,          // Definition record from create() / get()
  InteractionTypeList,            // { items, limit, offset }
  CreateInteractionTypeBody,      // Body for create()
  UpdateInteractionTypeBody,      // Body for update()
  AdminInteractionsQueryRequest,  // query() filter options
  AdminInteractionsCountsByOutcomeRequest,
  PublicInteractionsCountsByOutcomeRequest,
  PublicInteractionsByUserRequest,
  // Effects
  InteractionEffect,              // Single effect entry { type, config? }
  EffectType,                     // 'loyalty' | 'transactional' | 'webhook' | 'tag' | 'appRecord' | 'segment'
  EffectConfig,                   // Union of all effect config shapes
  LoyaltyEffectConfig,
  TransactionalEffectConfig,
  WebhookEffectConfig,
  TagEffectConfig,
  AppRecordEffectConfig,
  SegmentEffectConfig,
  InteractionEventContext,        // Token interpolation context shape
} from '@proveanything/smartlinks';
```

---

## Best Practices

- Use descriptive `interactionId` values: `warranty-registration`, `competition-entry`, `newsletter-vote`
- Use `outcome` to capture the choice — it's the key field that `countsByOutcome()` aggregates on
- Include `metadata` for richer analytics and debugging (`source`, `device`, `region`, etc.)
- Use `uniquePerUser: true` for actions that should only happen once (votes, registrations)
- Set `startAt`/`endAt` on the type definition — don't enforce time limits in app code
- Use `scope` to segment a single interaction type across multiple rounds, regions, or variants
- Prefer `submitPublicEvent` in client-side widget code; use `appendEvent` in server-side / admin flows
- Keep `getSEO()` and `getLLMContent()` calls separate from interaction submission paths
