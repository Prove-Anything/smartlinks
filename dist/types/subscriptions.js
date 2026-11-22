// src/types/subscriptions.ts
// Memberships: plans, their prices, and subscriptions — see docs/memberships.md.
//
// A PLAN is what members pay for (never a product). A SUBSCRIPTION is one person's membership of a plan,
// paid through Stripe or granted by staff. While it is live, the platform applies the plan's grants: the
// contact's `level` and `memberUntil` (customFields) and the plan's user groups.
//
// Money is always a whole number of MINOR units (pence, cents): 1299 = £12.99. Prices include VAT.
export {};
