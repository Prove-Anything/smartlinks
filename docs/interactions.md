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

```text
┌──────────────────────────────────────────────────────────────────┐
│ Your App                                                         │
│                                                                  │
│  1. Create type once:  interactions.create(collectionId, {       │
│       id: 'vote', permissions: { uniquePerUser: true } })        │
│                                                                  │
│  2. Log events:        interactions.appendEvent(collectionId, {  │
│       interactionId: 'vote', outcome: 'option-a', userId })      │
│                                                                  │
│  3. Read results:      interactions.countsByOutcome(collectionId, │
│       { interactionId: 'vote' })                                 │
│       → [{ outcome: 'option-a', count: 42 }, ...]               │
└──────────────────────────────────────────────────────────────────┘
```

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

Use in client-side app code. Same body shape as `appendEvent` but hits the public endpoint (respects interaction permissions like `allowPublicSubmit`, `requireAuth`).

```typescript
await SL.interactions.submitPublicEvent(collectionId, {
  appId: 'my-app',
  interactionId: 'competition-entry',
  outcome: 'entered',
  userId: currentUser.id,
  metadata: { answer: 'Paris' },
});
```

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
| `interactionId` | string | ✅ | Which interaction type this event belongs to |
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

## TypeScript Types

```typescript
import type {
  AppendInteractionBody,          // Event body for appendEvent / submitPublicEvent
  UpdateInteractionBody,          // Event body for updateEvent
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
