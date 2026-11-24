// src/api/subscriptions.ts
// Memberships — see docs/memberships.md. A site's join page and "my membership" use the public calls (signed in
// to join or manage); the Memberships app and Studio use `subscriptions.admin`. Prices and "paid" are never
// taken from the browser: Stripe's webhook makes the membership, and the platform applies what it grants
// (the member's `level` and user groups).
import { request, post, put, patch, del } from '../http.js';
import { describeRecurring } from '../utils/money.js';
const pub = (collectionId) => `/public/collection/${encodeURIComponent(collectionId)}/memberships`;
const adm = (collectionId) => `/admin/collection/${encodeURIComponent(collectionId)}/memberships`;
function qs(params) {
    if (!params)
        return '';
    const parts = [];
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === '')
            continue;
        parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    }
    return parts.length ? `?${parts.join('&')}` : '';
}
export var subscriptions;
(function (subscriptions) {
    /** Plans open to new members, each with its prices (monthly, yearly, one-off). */
    async function plans(collectionId) {
        return request(`${pub(collectionId)}/plans`);
    }
    subscriptions.plans = plans;
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
    async function start(collectionId, input) {
        return post(`${pub(collectionId)}/start`, input);
    }
    subscriptions.start = start;
    /** The signed-in member's memberships, newest first (ended ones too: check `live`). */
    async function mine(collectionId) {
        return request(`${pub(collectionId)}/mine`);
    }
    subscriptions.mine = mine;
    /**
     * Cancel: it ends at the end of the paid period, and access stays until then. A one-off plan or a staff
     * grant ends now. Undo with `resume` before the period ends.
     */
    async function cancel(collectionId, subscriptionId) {
        return post(`${pub(collectionId)}/${encodeURIComponent(subscriptionId)}/cancel`, {});
    }
    subscriptions.cancel = cancel;
    /** Undo a cancel before the period ends. @throws `NOT_CANCELLING` */
    async function resume(collectionId, subscriptionId) {
        return post(`${pub(collectionId)}/${encodeURIComponent(subscriptionId)}/resume`, {});
    }
    subscriptions.resume = resume;
    /**
     * Move to another plan's price. Up (a higher-ranked or dearer plan): at once, charging the difference.
     * Down: from the next renewal (`pendingPriceId` until then). @throws `CANNOT_CHANGE`, `NOT_FOUND`
     */
    async function change(collectionId, subscriptionId, priceId) {
        return post(`${pub(collectionId)}/${encodeURIComponent(subscriptionId)}/change`, { priceId });
    }
    subscriptions.change = change;
    /** Stripe's page for the member's card, invoices and cancelling. Send them to `url`. @throws `NO_BILLING` */
    async function billingLink(collectionId, subscriptionId, returnUrl) {
        return post(`${pub(collectionId)}/${encodeURIComponent(subscriptionId)}/billing`, { returnUrl });
    }
    subscriptions.billingLink = billingLink;
    /**
     * Format a plan price for people, in the page's language unless `locale` says otherwise:
     * "£15 a month", "15 € pro Monat", "40 € tous les 3 mois", "99 € una tantum".
     */
    function describePrice(p, locale) {
        return describeRecurring(p, locale);
    }
    subscriptions.describePrice = describePrice;
    /** The business's side: plans, prices and members (collection admins). Payments use the shop's Stripe set-up. */
    let admin;
    (function (admin) {
        async function listPlans(collectionId, params) {
            return request(`${adm(collectionId)}/plans${qs(params)}`);
        }
        admin.listPlans = listPlans;
        /** A plan with its prices and how many live members it has. */
        async function getPlan(collectionId, planId) {
            return request(`${adm(collectionId)}/plans/${encodeURIComponent(planId)}`);
        }
        admin.getPlan = getPlan;
        /** @throws `INVALID_INPUT` */
        async function createPlan(collectionId, input) {
            return post(`${adm(collectionId)}/plans`, input);
        }
        admin.createPlan = createPlan;
        /**
         * Change a plan. Its term can't change once it has prices. Changed grants reach members when their
         * membership next changes, or at once with `reapply`. @throws `PLAN_HAS_PRICES`
         */
        async function updatePlan(collectionId, planId, changes) {
            return patch(`${adm(collectionId)}/plans/${encodeURIComponent(planId)}`, changes);
        }
        admin.updatePlan = updatePlan;
        /** Only a plan nobody has held; otherwise close it to new members (`active: false`). @throws `PLAN_HAS_MEMBERS` */
        async function removePlan(collectionId, planId) {
            return del(`${adm(collectionId)}/plans/${encodeURIComponent(planId)}`);
        }
        admin.removePlan = removePlan;
        /** Set a plan's price for a currency and billing period (one each): replaces it if there is one. */
        async function setPrice(collectionId, planId, input) {
            return put(`${adm(collectionId)}/plans/${encodeURIComponent(planId)}/prices`, input);
        }
        admin.setPrice = setPrice;
        async function updatePrice(collectionId, priceId, changes) {
            return patch(`${adm(collectionId)}/prices/${encodeURIComponent(priceId)}`, changes);
        }
        admin.updatePrice = updatePrice;
        /** A price nobody pays. One that members pay is kept: close it with `active: false`. @throws `PRICE_IN_USE` */
        async function removePrice(collectionId, priceId) {
            return del(`${adm(collectionId)}/prices/${encodeURIComponent(priceId)}`);
        }
        admin.removePrice = removePrice;
        /** Memberships, newest first, with each one's plan. */
        async function list(collectionId, params) {
            return request(`${adm(collectionId)}/subscriptions${qs(params)}`);
        }
        admin.list = list;
        async function get(collectionId, subscriptionId) {
            return request(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}`);
        }
        admin.get = get;
        /** Give someone a plan without payment (free, honorary, paid in cash). Its grants apply at once. */
        async function grant(collectionId, input) {
            return post(`${adm(collectionId)}/subscriptions`, input);
        }
        admin.grant = grant;
        /** Cancel at the end of the paid period (default), or now with `atPeriodEnd: false`. */
        async function cancel(collectionId, subscriptionId, opts = {}) {
            return post(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, opts);
        }
        admin.cancel = cancel;
        async function resume(collectionId, subscriptionId) {
            return post(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}/resume`, {});
        }
        admin.resume = resume;
        async function change(collectionId, subscriptionId, priceId) {
            return post(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}/change`, { priceId });
        }
        admin.change = change;
        /** End now. A paid one is stopped in Stripe at once (no refund is made here). */
        async function end(collectionId, subscriptionId) {
            return post(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}/end`, {});
        }
        admin.end = end;
        /** Re-apply what the plan grants now (after the plan's grants were changed). */
        async function reapply(collectionId, subscriptionId) {
            return post(`${adm(collectionId)}/subscriptions/${encodeURIComponent(subscriptionId)}/reapply`, {});
        }
        admin.reapply = reapply;
    })(admin = subscriptions.admin || (subscriptions.admin = {}));
})(subscriptions || (subscriptions = {}));
