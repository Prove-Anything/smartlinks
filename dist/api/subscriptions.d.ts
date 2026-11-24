import type { PublicPlan, MySubscription, SubscriptionStartInput, SubscriptionStartResult, PlanWithPrices, Plan, PlanInput, PlanUpdate, PlanPrice, PlanPriceInput, Membership, SubscriptionListParams, SubscriptionGrantInput, SubscriptionPage, PlanGrants } from '../types/subscriptions.js';
export declare namespace subscriptions {
    /** Plans open to new members, each with its prices (monthly, yearly, one-off). */
    function plans(collectionId: string): Promise<PublicPlan[]>;
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
    function start(collectionId: string, input: SubscriptionStartInput): Promise<SubscriptionStartResult>;
    /** The signed-in member's memberships, newest first (ended ones too: check `live`). */
    function mine(collectionId: string): Promise<MySubscription[]>;
    /**
     * Cancel: it ends at the end of the paid period, and access stays until then. A one-off plan or a staff
     * grant ends now. Undo with `resume` before the period ends.
     */
    function cancel(collectionId: string, subscriptionId: string): Promise<MySubscription>;
    /** Undo a cancel before the period ends. @throws `NOT_CANCELLING` */
    function resume(collectionId: string, subscriptionId: string): Promise<MySubscription>;
    /**
     * Move to another plan's price. Up (a higher-ranked or dearer plan): at once, charging the difference.
     * Down: from the next renewal (`pendingPriceId` until then). @throws `CANNOT_CHANGE`, `NOT_FOUND`
     */
    function change(collectionId: string, subscriptionId: string, priceId: string): Promise<MySubscription>;
    /** Stripe's page for the member's card, invoices and cancelling. Send them to `url`. @throws `NO_BILLING` */
    function billingLink(collectionId: string, subscriptionId: string, returnUrl: string): Promise<{
        url: string;
    }>;
    /**
     * Format a plan price for people, in the page's language unless `locale` says otherwise:
     * "£15 a month", "15 € pro Monat", "40 € tous les 3 mois", "99 € una tantum".
     */
    function describePrice(p: {
        amount: number;
        currency: string;
        interval: 'month' | 'year' | null;
        intervalCount?: number;
    }, locale?: string): string;
    /** The business's side: plans, prices and members (collection admins). Payments use the shop's Stripe set-up. */
    namespace admin {
        function listPlans(collectionId: string, params?: {
            active?: boolean;
            limit?: number;
            offset?: number;
        }): Promise<SubscriptionPage<PlanWithPrices>>;
        /** A plan with its prices and how many live members it has. */
        function getPlan(collectionId: string, planId: string): Promise<PlanWithPrices>;
        /** @throws `INVALID_INPUT` */
        function createPlan(collectionId: string, input: PlanInput): Promise<Plan>;
        /**
         * Change a plan. Its term can't change once it has prices. Changed grants reach members when their
         * membership next changes, or at once with `reapply`. @throws `PLAN_HAS_PRICES`
         */
        function updatePlan(collectionId: string, planId: string, changes: PlanUpdate): Promise<Plan>;
        /** Only a plan nobody has held; otherwise close it to new members (`active: false`). @throws `PLAN_HAS_MEMBERS` */
        function removePlan(collectionId: string, planId: string): Promise<{
            ok: true;
        }>;
        /** Set a plan's price for a currency and billing period (one each): replaces it if there is one. */
        function setPrice(collectionId: string, planId: string, input: PlanPriceInput): Promise<PlanPrice>;
        function updatePrice(collectionId: string, priceId: string, changes: Partial<PlanPriceInput>): Promise<PlanPrice>;
        /** A price nobody pays. One that members pay is kept: close it with `active: false`. @throws `PRICE_IN_USE` */
        function removePrice(collectionId: string, priceId: string): Promise<{
            ok: true;
        }>;
        /** Memberships, newest first, with each one's plan. */
        function list(collectionId: string, params?: SubscriptionListParams): Promise<SubscriptionPage<Membership>>;
        function get(collectionId: string, subscriptionId: string): Promise<Membership>;
        /** Give someone a plan without payment (free, honorary, paid in cash). Its grants apply at once. */
        function grant(collectionId: string, input: SubscriptionGrantInput): Promise<Membership>;
        /** Cancel at the end of the paid period (default), or now with `atPeriodEnd: false`. */
        function cancel(collectionId: string, subscriptionId: string, opts?: {
            atPeriodEnd?: boolean;
        }): Promise<Membership>;
        function resume(collectionId: string, subscriptionId: string): Promise<Membership>;
        function change(collectionId: string, subscriptionId: string, priceId: string): Promise<Membership>;
        /** End now. A paid one is stopped in Stripe at once (no refund is made here). */
        function end(collectionId: string, subscriptionId: string): Promise<Membership>;
        /** Re-apply what the plan grants now (after the plan's grants were changed). */
        function reapply(collectionId: string, subscriptionId: string): Promise<{
            level?: string | null;
            groups: string[];
        }>;
    }
}
export type { PlanGrants };
