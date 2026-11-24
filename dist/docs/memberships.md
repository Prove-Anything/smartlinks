# Memberships: paid plans that keep a member's level

A gym, a club, a wine club, a members' area with a monthly fee. People pay for a **plan**, monthly,
yearly or once, and while they are paid up the platform keeps their **level** and their **user groups**
switched on. When it ends, it switches them off.

It builds on what's already there:

| Piece | Where |
|---|---|
| What a member is: a contact with `customFields.level` | [members.md](members.md) |
| Members-only content and screens | [user-groups.md](user-groups.md), server functions |
| Taking money: the seller's own Stripe account | [shop.md](shop.md) (memberships use the shop's Stripe set-up) |
| The membership card in Apple / Google Wallet | [wallet-passes.md](wallet-passes.md) |

The contract in members.md still holds: **whoever manages membership writes the member's `level`**. A
plan does that for you, from Stripe's own confirmation, never from the browser.

---

## The pieces

**A plan** is what members pay for. It is never a product, and never shows in the shop.

```typescript
{
  name: 'Gold',
  term: 'recurring',                         // or 'fixed': one payment, lasts `length`
  grants: { level: 'gold', groups: ['ug_cellar'], rank: 2 },
  includes: { items: [{ productId: 'red-2024', quantity: 3 }] },   // sent each period (optional)
}
```

- `grants.level` goes in the member's `customFields.level`, with `memberUntil` (the paid-until date).
- `grants.groups` are user groups the member joins (members-only pages, screens).
- `grants.rank`: someone holding two plans gets the highest-ranked plan's level.

**A plan's prices**: one per currency and billing period. A recurring plan has `interval` `month` or
`year` (every `intervalCount` of them) and can start with `trialDays`. A fixed plan has one price,
paid once.

**A membership** (`Membership`, the API calls it a subscription) is one person on one plan:

| `status` | Meaning | Access |
|---|---|---|
| `trialing` | free trial | yes |
| `active` | paid up | yes |
| `past_due` | a payment failed; Stripe is retrying | yes, until Stripe gives up |
| `cancelling` | ends at the end of the paid period | yes, until then |
| `ended` | over | no |

`source` is `stripe` (paid) or `manual` (granted by staff: free, honorary, paid in cash).

---

## A join page

```typescript
import { subscriptions } from '@proveanything/smartlinks'

const { items: plans } = await subscriptions.plans(collectionId)
// plans: [{ id, name, description, level, prices: [{ id, amount, currency, interval, intervalCount, trialDays }] }]

plans.forEach((plan) => plan.prices.forEach((p) => console.log(plan.name, subscriptions.describePrice(p))))
// "Gold £15 a month", "Gold £150 a year"

// Signed in only: a membership belongs to an account.
const { checkoutUrl } = await subscriptions.start(collectionId, {
  priceId,
  successUrl: `${location.origin}/welcome`,
  cancelUrl: `${location.origin}/join`,
})
location.href = checkoutUrl
```

The membership exists once Stripe confirms the payment (a few seconds). The welcome page can poll
`subscriptions.mine()` until it shows `live: true`.

Errors: `SIGN_IN_REQUIRED`, `ALREADY_MEMBER`, `NOT_FOUND` (closed plan), `PAYMENTS_NOT_READY` (the
business hasn't connected Stripe), `INVALID_INPUT` (return pages must be https on your site).

## "My membership"

```typescript
const { items: mine } = await subscriptions.mine(collectionId)   // newest first; check `live`
await subscriptions.cancel(collectionId, id)                 // ends at the period end; access kept until then
await subscriptions.resume(collectionId, id)                 // undo, before the period ends
await subscriptions.change(collectionId, id, otherPriceId)   // up: at once (the difference charged); down: at renewal
const { url } = await subscriptions.billingLink(collectionId, id, location.href)  // Stripe's page: card, invoices
location.href = url
```

## Members-only content

Check in a **server function**, never in the browser. Either read the level (members.md), or ask:

```javascript
// capabilities: ["sl:subscriptions:read"], authority: "caller"
export default async function (event, ctx) {
  const { member, level } = await ctx.sl.subscriptions.memberOf()   // the signed-in caller
  if (!member) return { status: 403, body: { error: 'MEMBERS_ONLY' } }
  return { body: await loadContentFor(level) }
}
```

A members-only screen can instead be gated by the plan's user group (`userGroups` on the function).

## Server functions: `ctx.sl.subscriptions`

| Call | Capability |
|---|---|
| `plans()`, `list(params)`, `get(id)`, `mine()`, `memberOf({ contactId \| userId }?)` | `sl:subscriptions:read` |
| `grant({ planId, contactId?, userId?, endsAt?, note? })`, `end(id)`, `cancel(id, { atPeriodEnd })`, `reapply({ contactId \| userId })` | `sl:subscriptions:write` |

Joining with a payment is always the member's own Stripe checkout (`subscriptions.start` in the
browser), never a server function.

## The business's side: `subscriptions.admin`

For the Memberships app and Studio (collection admins):

```typescript
const gold = await subscriptions.admin.createPlan(collectionId, { name: 'Gold', grants: { level: 'gold', groups: ['ug_cellar'], rank: 2 } })
await subscriptions.admin.setPrice(collectionId, gold.id, { amount: 1500, interval: 'month', trialDays: 14 })
await subscriptions.admin.setPrice(collectionId, gold.id, { amount: 15000, interval: 'year' })

const { items, nextCursor, count } = await subscriptions.admin.list(collectionId, { live: true, planId: gold.id })
// next page: subscriptions.admin.list(collectionId, { live: true, planId: gold.id, cursor: nextCursor })
await subscriptions.admin.grant(collectionId, { planId: gold.id, contactId, note: 'Founding member' })
await subscriptions.admin.end(collectionId, membershipId)   // a paid one is stopped in Stripe at once
```

- A plan's term can't change once it has prices; make a new plan instead.
- A plan someone has held can't be deleted: close it with `active: false`. The same for a price
  members pay.
- Changing a plan's grants reaches members when their membership next changes, or at once with
  `admin.reapply`.

## Events

`subscription.started`, `.renewed`, `.changed`, `.payment_failed`, `.cancelling`, `.ended` go to the
business's flows (app `memberships`): the welcome email, a renewal reminder, "we're sorry to see you
go", a staff alert. `subscription.renewed` carries the plan's `includes`, for whatever sends the
quarterly case.

## Rules

- Never decide membership in the browser. The browser asks; Stripe's webhook and the platform decide.
- Never take a price from the browser: `start` takes a price id, and the server reads the amount.
- Tell people the price, how often it renews and how to cancel before they pay (UK law).
