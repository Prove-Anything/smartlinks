// src/api/subscriptions.ts
// Memberships — see docs/memberships.md. A site's join page and "my membership" use the public calls (signed in
// to join or manage); the Memberships app and Studio use `subscriptions.admin`. Prices and "paid" are never
// taken from the browser: Stripe's webhook makes the membership, and the platform applies what it grants
// (the member's `level` and user groups).
import { request, post, put, patch, del } from '../http'
import type {
  PublicPlan,
  MySubscription,
  SubscriptionStartInput,
  SubscriptionStartResult,
  PlanWithPrices,
  Plan,
  PlanInput,
  PlanUpdate,
  PlanPrice,
  PlanPriceInput,
  Membership,
  SubscriptionListParams,
  SubscriptionGrantInput,
  SubscriptionPage,
  PlanGrants,
} from '../types/subscriptions'

const pub = (collectionId: string) => `/public/collection/${encodeURIComponent(collectionId)}/memberships`
const adm = (collectionId: string) => `/admin/collection/${encodeURIComponent(collectionId)}/memberships`

function qs(params?: Record<string, any>): string {
  if (!params) return ''
  const parts: string[] = []
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
  }
  return parts.length ? `?${parts.join('&')}` : ''
}

export namespace subscriptions {
  /** Plans open to new members, each with its prices (monthly, yearly, one-off). */
  export async function plans(collectionId: string): Promise<PublicPlan[]> {
    return request<PublicPlan[]>(`${pub(collectionId)}/plans`)
  }

  /**
   * Join a plan: Stripe's checkout page for the chosen price. Send them to `checkoutUrl`. Signed in only (a
   * membership belongs to an account). The membership exists once Stripe confirms the payment.
   *
   * @example
   * ```typescript
   * const plans = await subscriptions.plans(collectionId)
   * const yearly = plans[0].prices.find((p) => p.interval === 'year')
   * const { checkoutUrl } = await subscriptions.start(collectionId, {
   *   priceId: yearly.id,
   *   successUrl: `${location.origin}/welcome`,
   *   cancelUrl: `${location.origin}/join`,
   * })
   * location.href = checkoutUrl
   * ```
   * @throws `SIGN_IN_REQUIRED`, `ALREADY_MEMBER`, `NOT_FOUND` (closed plan or price), `PAYMENTS_NOT_READY`, `INVALID_INPUT`
   */
  export async function start(collectionId: string, input: SubscriptionStartInput): Promise<SubscriptionStartResult> {
    return post<SubscriptionStartResult>(`${pub(collectionId)}/start`, input)
  }

  /** The signed-in member's memberships, newest first (ended ones too: check `live`). */
  export async function mine(collectionId: string): Promise<MySubscription[]> {
    return request<MySubscription[]>(`${pub(collectionId)}/mine`)
  }

  /**
   * Cancel: it ends at the end of the paid period, and access stays until then. A one-off plan or a staff
   * grant ends now. Undo with `resume` before the period ends.
   */
  export async function cancel(collectionId: string, subscriptionId: string): Promise<MySubscription> {
    return post<MySubscription>(`${pub(collectionId)}/${encodeURIComponent(subscriptionId)}/cancel`, {})
  }

  /** Undo a cancel before the period ends. @throws `NOT_CANCELLING` */
  export async function resume(collectionId: string, subscriptionId: string): Promise<MySubscription> {
    return post<MySubscription>(`${pub(collectionId)}/${encodeURIComponent(subscriptionId)}/resume`, {})
  }

  /**
   * Move to another plan's price. Up (a higher-ranked or dearer plan): at once, charging the difference.
   * Down: from the next renewal (`pendingPriceId` until then). @throws `CANNOT_CHANGE`, `NOT_FOUND`
   */
  export async function change(collectionId: string, subscriptionId: string, priceId: string): Promise<MySubscription> {
    return post<MySubscription>(`${pub(collectionId)}/${encodeURIComponent(subscriptionId)}/change`, { priceId })
  }

  /** Stripe's page for the member's card, invoices and cancelling. Send them to `url`. @throws `NO_BILLING` */
  export async function billingLink(collectionId: string, subscriptionId: string, returnUrl: string): Promise<{ url: string }> {
    return post<{ url: string }>(`${pub(collectionId)}/${encodeURIComponent(subscriptionId)}/billing`, { returnUrl })
  }

  /**
   * Format a plan price for people: "£15 a month", "£150 a year", "£40 every 3 months", "£99 once".
   */
  export function describePrice(p: { amount: number; currency: string; interval: 'month' | 'year' | null; intervalCount?: number }, locale?: string): string {
    let money: string
    try {
      money = new Intl.NumberFormat(locale, { style: 'currency', currency: p.currency, minimumFractionDigits: p.amount % 100 ? 2 : 0 }).format(p.amount / 100)
    } catch {
      money = `${(p.amount / 100).toFixed(2)} ${p.currency}`
    }
    if (!p.interval) return `${money} once`
    const n = p.intervalCount || 1
    return n === 1 ? `${money} a ${p.interval}` : `${money} every ${n} ${p.interval}s`
  }

  /** The business's side: plans, prices and members (collection admins). Payments use the shop's Stripe set-up. */
  export namespace admin {
    export async function listPlans(collectionId: string, params?: { active?: boolean; limit?: number; offset?: number }): Promise<SubscriptionPage<PlanWithPrices>> {
      return request(`${adm(collectionId)}/plans${qs(params)}`)
    }

    /** A plan with its prices and how many live members it has. */
    export async function getPlan(collectionId: string, planId: string): Promise<PlanWithPrices> {
      return request<PlanWithPrices>(`${adm(collectionId)}/plans/${encodeURIComponent(planId)}`)
    }

    /** @throws `INVALID_INPUT` */
    export async function createPlan(collectionId: string, input: PlanInput): Promise<Plan> {
      return post<Plan>(`${adm(collectionId)}/plans`, input)
    }

    /**
     * Change a plan. Its term can't change once it has prices. Changed grants reach members when their
     * membership next changes, or at once with `reapply`. @throws `PLAN_HAS_PRICES`
     */
    export async function updatePlan(collectionId: string, planId: string, changes: PlanUpdate): Promise<Plan> {
      return patch<Plan>(`${adm(collectionId)}/plans/${encodeURIComponent(planId)}`, changes)
    }

    /** Only a plan nobody has held; otherwise close it to new members (`active: false`). @throws `PLAN_HAS_MEMBERS` */
    export async function removePlan(collectionId: string, planId: string): Promise<{ ok: true }> {
      return del(`${adm(collectionId)}/plans/${encodeURIComponent(planId)}`)
    }

    /** Set a plan's price for a currency and billing period (one each): replaces it if there is one. */
    export async function setPrice(collectionId: string, planId: string, input: PlanPriceInput): Promise<PlanPrice> {
      return put<PlanPrice>(`${adm(collectionId)}/plans/${encodeURIComponent(planId)}/prices`, input)
    }

    export async function updatePrice(collectionId: string, priceId: string, changes: Partial<PlanPriceInput>): Promise<PlanPrice> {
      return patch<PlanPrice>(`${adm(collectionId)}/prices/${encodeURIComponent(priceId)}`, changes)
    }

    /** A price nobody pays. One that members pay is kept: close it with `active: false`. @throws `PRICE_IN_USE` */
    export async function removePrice(collectionId: string, priceId: string): Promise<{ ok: true }> {
      return del(`${adm(collectionId)}/prices/${encodeURIComponent(priceId)}`)
    }

    /** Memberships, newest first, with each one's plan. */
    export async function list(collectionId: string, params?: SubscriptionListParams): Promise<SubscriptionPage<Membership>> {
      return request(`${adm(collectionId)}/subscriptions${qs(params)}`)
    }

    export async function get(collectionId: string, subscriptionId: string): Promise<Membership> {
      return request<Membership>(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}`)
    }

    /** Give someone a plan without payment (free, honorary, paid in cash). Its grants apply at once. */
    export async function grant(collectionId: string, input: SubscriptionGrantInput): Promise<Membership> {
      return post<Membership>(`${adm(collectionId)}/subscriptions`, input)
    }

    /** Cancel at the end of the paid period (default), or now with `atPeriodEnd: false`. */
    export async function cancel(collectionId: string, subscriptionId: string, opts: { atPeriodEnd?: boolean } = {}): Promise<Membership> {
      return post<Membership>(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, opts)
    }

    export async function resume(collectionId: string, subscriptionId: string): Promise<Membership> {
      return post<Membership>(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}/resume`, {})
    }

    export async function change(collectionId: string, subscriptionId: string, priceId: string): Promise<Membership> {
      return post<Membership>(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}/change`, { priceId })
    }

    /** End now. A paid one is stopped in Stripe at once (no refund is made here). */
    export async function end(collectionId: string, subscriptionId: string): Promise<Membership> {
      return post<Membership>(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}/end`, {})
    }

    /** Re-apply what the plan grants now (after the plan's grants were changed). */
    export async function reapply(collectionId: string, subscriptionId: string): Promise<{ level?: string | null; groups: string[] }> {
      return post(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}/reapply`, {})
    }
  }
}

export type { PlanGrants }
