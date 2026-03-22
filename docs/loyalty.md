# Loyalty: Points, Members & Earning Rules

The `loyalty` namespace lets you build loyalty programmes on top of any collection. Contacts earn points for doing things — registering products, voting, entering competitions, engaging with content — and you track their balance, lifetime points, and full transaction history.

Loyalty is designed to be **decoupled from your app logic**. You configure earning rules that say "this interaction earns N points under these conditions", and the platform awards points automatically whenever that interaction event fires. Your app just logs interactions as normal.

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Scheme** | A named loyalty programme within a collection (e.g. "Brand Rewards"). A collection can have multiple schemes. |
| **Member** | A contact's enrolment in a scheme. Created automatically the first time they earn points. Holds their current `balance` and `lifetimePoints`. |
| **Transaction** | An append-only ledger entry. Signed integer — positive = earn, negative = spend/deduct. Every point change goes through a transaction. |
| **Earning Rule** | Links an Interaction definition to a point award. When an interaction event fires that matches the rule's conditions, points are awarded automatically. |

```text
┌─────────────────────────────────────────────────────────────────────┐
│ User registers a product                                            │
│         ↓                                                           │
│ interactions.appendEvent(collectionId, {                            │
│   interactionId: 'product-registration',                            │
│   outcome: 'activated',                                             │
│   contactId: '...'                                                  │
│ })                                                                  │
│         ↓                                                           │
│ Platform evaluates earning rules for 'product-registration'         │
│         ↓                                                           │
│ Rule matches → contact awarded 50 points automatically              │
│         ↓                                                           │
│ loyalty.publicGetMe(collectionId) → balance: 50                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Schemes

### Create a Scheme

```typescript
const scheme = await SL.loyalty.create(collectionId, {
  name: 'Brand Rewards',
  type: 'points',
  data: {
    pointName: 'Star',       // Display name for one point
    pointNamePlural: 'Stars',
    currencySymbol: '⭐',
  },
});
```

### List & Get

```typescript
// Admin: all schemes including inactive/deleted
const schemes = await SL.loyalty.list(collectionId);
const scheme  = await SL.loyalty.get(collectionId, schemeId);

// Public: active schemes only (no admin/owner data blocks)
const schemes = await SL.loyalty.publicList(collectionId);
const scheme  = await SL.loyalty.publicGet(collectionId, schemeId);
```

### Update & Delete

```typescript
await SL.loyalty.update(collectionId, schemeId, { active: false });
await SL.loyalty.remove(collectionId, schemeId); // soft-delete
```

---

## Getting a User's Loyalty Status

### The one-call pattern

`publicGetMe` is the primary entry point for any loyalty UI. It returns all active schemes with the caller's membership embedded — one request, everything you need.

```typescript
const schemes = await SL.loyalty.publicGetMe(collectionId);

// schemes[0] looks like:
// {
//   id: 'abc-123',
//   name: 'Brand Rewards',
//   type: 'points',
//   data: { pointName: 'Star', ... },
//   member: {
//     balance: 350,
//     lifetimePoints: 820,
//     contactId: '...',
//     createdAt: '...',
//     ...
//   }
// }
//
// member is null if the user hasn't earned any points yet in that scheme
```

Unauthenticated callers get `member: null` on every scheme — useful for previewing the programme before sign-in.

### Scheme-specific membership

```typescript
// Current balance + lifetime points
const member = await SL.loyalty.publicGetMine(collectionId, schemeId);

// Transaction history (newest first, paginated)
const { items } = await SL.loyalty.publicGetMineHistory(collectionId, schemeId, {
  limit: 20,
  offset: 0,
});
```

---

## Earning Rules

Earning rules are the control plane that connects interactions to point awards. The server evaluates them automatically — your app never sets a point value directly.

### Create a Rule

```typescript
// Award 50 points when a product is registered
await SL.loyalty.createEarningRule(collectionId, schemeId, {
  interactionId: 'product-registration',
  points: 50,
  conditions: { outcome: 'activated' },  // only fires on this outcome
  maxPerContact: 1,                       // once per contact lifetime
});

// Award 1 point for any vote, no limit, 24-hour cooldown
await SL.loyalty.createEarningRule(collectionId, schemeId, {
  interactionId: 'competition-vote',
  points: 1,
  cooldownHours: 24,
});

// Award 10 points for winning — conditions match event fields
await SL.loyalty.createEarningRule(collectionId, schemeId, {
  interactionId: 'spin-to-win',
  points: 10,
  conditions: { outcome: 'win' },
});

// Award 2 points for entering — same interaction, different rule
await SL.loyalty.createEarningRule(collectionId, schemeId, {
  interactionId: 'spin-to-win',
  points: 2,
  conditions: { outcome: 'entered' },
  cooldownHours: 24,
});
```

Multiple rules can reference the same `interactionId`. All matching rules fire — so an event can earn points from several rules simultaneously if you design them that way.

### Conditions

Conditions are key-value pairs matched against the interaction event before a rule fires. An empty `conditions` object means the rule always fires for any event on that interaction.

| Condition key | What it matches |
|---------------|-----------------|
| `outcome` | `event.outcome` |
| `scope` | `event.scope` |
| `status` | `event.status` |
| `eventType` | `event.eventType` |
| `metadata.tier` | `event.metadata.tier` |
| `metadata.region` | `event.metadata.region` |

```typescript
// Only award points to gold-tier members in UK events
await SL.loyalty.createEarningRule(collectionId, schemeId, {
  interactionId: 'competition-entry',
  points: 5,
  conditions: {
    outcome: 'entered',
    'metadata.tier': 'gold',
    'metadata.region': 'UK',
  },
});
```

### Rate Limiting

| Field | Effect |
|-------|--------|
| `maxPerContact` | Caps the total lifetime number of times this rule can fire per contact. `null` = unlimited. |
| `cooldownHours` | Minimum gap between triggers for the same contact. `null` = no cooldown. |

### List, Update & Delete Rules

```typescript
// List rules (admin)
const rules = await SL.loyalty.listEarningRules(collectionId, schemeId);

// Public: show "how to earn" in UI (active rules only)
const rules = await SL.loyalty.publicListEarningRules(collectionId, schemeId);

// Update
await SL.loyalty.updateEarningRule(collectionId, schemeId, ruleId, {
  points: 75,
  active: false,
});

// Delete
await SL.loyalty.removeEarningRule(collectionId, schemeId, ruleId);
```

---

## Manual Transactions (Admin)

For welcome bonuses, corrections, or admin overrides — points that aren't tied to an interaction event.

```typescript
// Award a welcome bonus
await SL.loyalty.recordTransaction(collectionId, schemeId, contactId, {
  points: 100,
  reason: 'Welcome bonus',
  idempotencyKey: `welcome-${contactId}`,  // prevents double-award on retry
});

// Deduct points (spend)
await SL.loyalty.recordTransaction(collectionId, schemeId, contactId, {
  points: -50,
  reason: 'Redeemed for discount',
  metadata: { redemptionRef: 'DISC-2026-0042' },
});
```

Deducting below zero returns HTTP 422 `INSUFFICIENT_BALANCE`. The transaction is rejected — the balance is never taken negative.

### Idempotency

Supply `idempotencyKey` whenever there is any risk of the request being retried (network failures, client retries, webhook replays). The key is scoped per scheme — reusing it on a different scheme is fine.

```typescript
await SL.loyalty.recordTransaction(collectionId, schemeId, contactId, {
  points: 50,
  reason: 'Referral reward',
  idempotencyKey: `referral-${referrerId}-${refereeId}`,
});
// Calling again with the same key returns 409 — no duplicate transaction created
```

### Viewing Member History (Admin)

```typescript
// All members in a scheme
const { items } = await SL.loyalty.listMembers(collectionId, schemeId, { limit: 50 });

// A specific member
const member = await SL.loyalty.getMember(collectionId, schemeId, contactId);

// Full transaction history for a member
const { items } = await SL.loyalty.getMemberHistory(collectionId, schemeId, contactId, {
  limit: 100,
  offset: 0,
});
```

---

## balance vs lifetimePoints

| Field | What it tracks | Can it decrease? |
|-------|---------------|-----------------|
| `balance` | Current redeemable points | Yes — deducted on spend |
| `lifetimePoints` | Total ever earned | Never — only increases |

Use `lifetimePoints` for tier calculations (Bronze / Silver / Gold). Use `balance` for showing what a contact can currently spend.

---

## Integration with Interactions

Loyalty earning is a side-effect of the interaction system. Your app calls `interactions.appendEvent` exactly as it would without loyalty — the platform handles the rest.

```typescript
// Your app logs an interaction event as normal
await SL.interactions.appendEvent(collectionId, {
  appId: 'my-app',
  interactionId: 'product-registration',
  outcome: 'activated',
  contactId: contact.contactId,
  productId: product.id,
  metadata: { serialNumber: 'SN-12345' },
});

// Behind the scenes (no app code needed):
// 1. Event is logged to BigQuery
// 2. Platform checks earning rules for 'product-registration'
// 3. Matching rules fire → contact's balance updated atomically
// 4. Transaction appended to ledger with ruleId in metadata
```

A loyalty failure never causes the interaction event to fail — errors are caught and logged server-side so your app always gets a clean response.

---

## TypeScript Types

```typescript
import type {
  LoyaltyScheme,                   // Scheme definition
  LoyaltyMember,                   // Contact's enrolment + balance
  LoyaltyTransaction,              // Single ledger entry
  LoyaltyEarningRule,              // Interaction → points mapping
  LoyaltySchemeWithMembership,     // publicGetMe() response shape
  LoyaltyTransactionResult,        // recordTransaction() response
  LoyaltyPaginatedResult,          // { items, limit, offset }
  LoyaltyPaginationParams,         // { limit?, offset? }
  CreateLoyaltySchemeBody,
  UpdateLoyaltySchemeBody,
  CreateLoyaltyEarningRuleBody,
  UpdateLoyaltyEarningRuleBody,
  RecordLoyaltyTransactionBody,
} from '@proveanything/smartlinks';
```

---

## Best Practices

- Use `publicGetMe` as your single loyalty widget data source — one call, all schemes, membership embedded
- Always supply `idempotencyKey` on manual transactions that could be retried
- Use `maxPerContact: 1` on one-time actions (product registration, sign-up bonus)
- Use `cooldownHours` on repeating actions to prevent gaming (daily check-ins, votes)
- Store display config (`pointName`, `currencySymbol`, tier thresholds) in the scheme's `data` block — keeps the UI configurable without code changes
- Use `lifetimePoints` for tier logic, `balance` for spend eligibility
- Let interactions do the validation — don't award points via `recordTransaction` for events that should go through an earning rule; let the server be the arbiter of point values
