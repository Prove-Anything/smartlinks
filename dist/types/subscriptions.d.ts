import type { ListOptions } from './list.js';
/** `recurring` renews until cancelled; `fixed` is one payment that lasts `length`, then ends. */
export type PlanTerm = 'recurring' | 'fixed';
export interface PlanLength {
    unit: 'month' | 'year';
    count: number;
}
/** What a live subscription to the plan gives. `rank`: when someone holds two plans, the highest sets the level. */
export interface PlanGrants {
    level?: string;
    /** User group ids the member joins (members-only content, screens). */
    groups?: string[];
    rank?: number;
}
/** Products sent each period (a wine club's quarterly case). */
export interface PlanIncludes {
    items?: Array<{
        productId: string;
        variantId?: string;
        quantity: number;
    }>;
}
/** A plan as the business manages it. */
export interface Plan {
    id: string;
    collectionId: string;
    name: string;
    description: string | null;
    image: string | null;
    term: PlanTerm;
    length: PlanLength | null;
    grants: PlanGrants;
    includes: PlanIncludes;
    /** Open to new members. */
    active: boolean;
    sort: number;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
export interface PlanInput {
    name: string;
    description?: string | null;
    image?: string | null;
    term?: PlanTerm;
    /** Required for a `fixed` plan. */
    length?: PlanLength;
    grants?: PlanGrants;
    includes?: PlanIncludes;
    active?: boolean;
    sort?: number;
    metadata?: Record<string, any>;
}
export type PlanUpdate = Partial<PlanInput>;
/** One of a plan's prices: a currency and a billing period (`interval` null = paid once, for a fixed plan). */
export interface PlanPrice {
    id: string;
    planId: string;
    currency: string;
    amount: number;
    compareAtAmount: number | null;
    /** `month` or `year`, every `intervalCount` of them (every 3 months = month, 3). Null for a fixed plan. */
    interval: 'month' | 'year' | null;
    intervalCount: number;
    /** Free days before the first payment (recurring plans only). */
    trialDays: number | null;
    active: boolean;
    sort: number;
}
export interface PlanPriceInput {
    /** Defaults to the shop's currency. */
    currency?: string;
    amount: number;
    compareAtAmount?: number | null;
    /** Required for a recurring plan; not allowed for a fixed one. */
    interval?: 'month' | 'year';
    intervalCount?: number;
    trialDays?: number | null;
    active?: boolean;
    sort?: number;
}
/** A plan with its prices, as the admin lists it. */
export interface PlanWithPrices extends Plan {
    prices: PlanPrice[];
    /** Live members (on `admin.getPlan`). */
    members?: number;
}
/** A plan as a join page shows it: no private fields. */
export interface PublicPlan {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    term: PlanTerm;
    length: PlanLength | null;
    level: string | null;
    prices: Array<Pick<PlanPrice, 'id' | 'currency' | 'amount' | 'compareAtAmount' | 'interval' | 'intervalCount' | 'trialDays'>>;
}
/**
 * - `trialing`    in a free trial
 * - `active`      paid up
 * - `past_due`    a payment failed and Stripe is retrying; access is kept meanwhile
 * - `cancelling`  ends at the end of the paid period; access is kept until then
 * - `ended`
 */
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelling' | 'ended';
/** `stripe`: paid. `manual`: granted by staff (free, honorary, paid another way). */
export type SubscriptionSource = 'stripe' | 'manual';
export interface Membership {
    id: string;
    collectionId: string;
    contactId: string | null;
    userId: string | null;
    planId: string;
    priceId: string | null;
    source: SubscriptionSource;
    status: SubscriptionStatus;
    /** trialing, active, past_due or cancelling: the plan's grants apply. */
    live: boolean;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    /** When it ends (a fixed plan, a grant with an end, a cancelled one). */
    endsAt: string | null;
    endedAt: string | null;
    cancelReason: 'member' | 'staff' | 'payment_failed' | 'expired' | string | null;
    cancelledBy: string | null;
    /** A downgrade waiting for the next renewal. */
    pendingPriceId: string | null;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    plan?: {
        id: string;
        name: string;
        grants: PlanGrants;
        term: PlanTerm;
    };
}
/** A member's own membership, as `subscriptions.mine` returns it. */
export interface MySubscription {
    id: string;
    planId: string;
    priceId: string | null;
    status: SubscriptionStatus;
    live: boolean;
    source: SubscriptionSource;
    currentPeriodEnd: string | null;
    endsAt: string | null;
    pendingPriceId: string | null;
    plan: {
        id: string;
        name: string;
        level: string | null;
    } | null;
}
export interface SubscriptionStartInput {
    priceId: string;
    /** Where Stripe sends them after paying, and if they turn back. https, on your site. Default: the shop's. */
    successUrl?: string;
    cancelUrl?: string;
}
export interface SubscriptionStartResult {
    checkoutUrl: string;
    sessionId: string;
}
/** `subscriptions.admin.list` options: the filters, plus `limit` and `cursor`. */
export interface SubscriptionListOptions extends ListOptions {
    status?: SubscriptionStatus;
    /** Only live ones (trialing, active, past_due, cancelling). */
    live?: boolean;
    planId?: string;
    contactId?: string;
    userId?: string;
}
/**
 * What `ctx.sl.subscriptions.list` takes in a server function (it pages by `limit` and `offset`). In the
 * browser, `subscriptions.admin.list` takes `SubscriptionListOptions`.
 */
export interface SubscriptionListParams {
    status?: SubscriptionStatus;
    /** Only live ones (trialing, active, past_due, cancelling). */
    live?: boolean;
    planId?: string;
    contactId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
}
/** Staff give someone a plan, no payment. */
export interface SubscriptionGrantInput {
    planId: string;
    contactId?: string;
    userId?: string;
    /** ISO date; never ends if left out. */
    endsAt?: string;
    note?: string;
}
/**
 * What `ctx.sl.subscriptions.list` returns in a server function. In the browser, `subscriptions.admin.list`
 * and `subscriptions.admin.listPlans` return `ListResult<T>`.
 */
export interface SubscriptionPage<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
}
/** Someone's live memberships and the level they give (server functions: `ctx.sl.subscriptions.memberOf`). */
export interface MembershipStatus {
    member: boolean;
    level: string | null;
    subscriptions: Membership[];
}
