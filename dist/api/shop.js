// src/api/shop.ts
// Basic commerce — see docs/shop.md. A shop front (any page, any site) uses the public calls; the Shop app and
// Studio use `shop.admin`. Prices, totals and "paid" are never taken from the browser: the server prices the
// basket, and only Stripe's webhook marks an order paid.
import { request, post, put, patch, del } from '../http.js';
import { formatMinor } from '../utils/money.js';
const pub = (collectionId) => `/public/collection/${encodeURIComponent(collectionId)}/shop`;
const adm = (collectionId) => `/admin/collection/${encodeURIComponent(collectionId)}/shop`;
function qs(params) {
    if (!params)
        return '';
    const parts = [];
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === '')
            continue;
        parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(Array.isArray(v) ? v.join(',') : String(v))}`);
    }
    return parts.length ? `?${parts.join('&')}` : '';
}
export var shop;
(function (shop) {
    /**
     * What a shop front shows: currency, the seller's details (UK law: shown before paying), shipping rates,
     * policies, and `ready` (false until the shop can take payments).
     */
    async function config(collectionId) {
        return request(`${pub(collectionId)}/config`);
    }
    shop.config = config;
    /**
     * What is for sale, in the shop's currency, with stock (`inStock`, `available`) and whether the buyer must
     * sign in first (`needsSignIn`: a proof or access goes to an account).
     *
     * @example
     * ```typescript
     * const { items } = await shop.products(collectionId)
     * items.map((p) => `${p.name}: ${formatMoney(p.amount, p.currency)}${p.inStock ? '' : ' (sold out)'}`)
     * ```
     */
    async function products(collectionId, params) {
        return request(`${pub(collectionId)}/products${qs({ productIds: params === null || params === void 0 ? void 0 : params.productIds })}`);
    }
    shop.products = products;
    /**
     * Start paying: the server prices the basket, holds the stock and returns Stripe's checkout page. Send the
     * buyer to `checkoutUrl`. Signed-in buyers' orders are theirs (`shop.myOrders`).
     *
     * @example
     * ```typescript
     * const { checkoutUrl } = await shop.checkout(collectionId, {
     *   lines: [{ productId: 'soap', quantity: 2 }],
     *   shippingRateId: 'std',
     *   successUrl: `${location.origin}/thanks`,   // ?session_id= is added
     *   cancelUrl: `${location.origin}/basket`,
     * })
     * location.href = checkoutUrl
     * ```
     * @throws `SHOP_NOT_READY`, `NOT_FOR_SALE`, `OUT_OF_STOCK`, `SHIPPING_REQUIRED`, `SIGN_IN_REQUIRED`,
     *   `DIGITAL_CONSENT_REQUIRED`, `INVALID_INPUT` (e.g. a return page on another site), `PAYMENT_UNAVAILABLE` (nothing was charged)
     */
    async function checkout(collectionId, input) {
        return post(`${pub(collectionId)}/checkout`, input);
    }
    shop.checkout = checkout;
    /**
     * The thank-you page: the order a Stripe checkout paid for, from the `session_id` on the success URL.
     * Its `status` is `pending-payment` for a moment while the payment is confirmed: check again shortly.
     * `downloads` has links for bought files once it's paid.
     */
    async function orderBySession(collectionId, sessionId) {
        return request(`${pub(collectionId)}/orders/by-session/${encodeURIComponent(sessionId)}`);
    }
    shop.orderBySession = orderBySession;
    /** The signed-in buyer's orders, newest first, with their download links. @throws `SIGN_IN_REQUIRED` */
    async function myOrders(collectionId, params) {
        return request(`${pub(collectionId)}/orders/mine${qs(params)}`);
    }
    shop.myOrders = myOrders;
    /**
     * Format minor units as money, in the page's language unless `locale` says otherwise:
     * `formatMoney(1299, 'EUR')` → "€12.99" in English, "12,99 €" in German. Zero-decimal currencies
     * (JPY, KRW) are whole units: `formatMoney(1299, 'JPY')` → "¥1,299".
     */
    function formatMoney(amount, currency, locale) {
        return formatMinor(amount, currency, locale);
    }
    shop.formatMoney = formatMoney;
    /** The seller's side: settings, Stripe, prices and orders (collection admins). */
    let admin;
    (function (admin) {
        /** The settings, what's still needed to take payments (`readiness`), and what SmartLinks takes (`fee`, read-only). */
        async function settings(collectionId) {
            return request(`${adm(collectionId)}/settings`);
        }
        admin.settings = settings;
        /** Change settings: merged into what's stored; `shipping.rates` is replaced as a whole. */
        async function updateSettings(collectionId, patch) {
            return put(`${adm(collectionId)}/settings`, patch);
        }
        admin.updateSettings = updateSettings;
        /**
         * Connect the seller's Stripe account (a new one, set up on Stripe's own pages). Send the seller to `url`;
         * Stripe brings them back to `returnUrl` (done or not: check `connectStatus`) or `refreshUrl` (the link ran out).
         */
        async function connect(collectionId, input) {
            return post(`${adm(collectionId)}/connect`, input);
        }
        admin.connect = connect;
        /** Whether Stripe is connected, and whether it can take payments and pay out yet. */
        async function connectStatus(collectionId) {
            return request(`${adm(collectionId)}/connect/status`);
        }
        admin.connectStatus = connectStatus;
        async function listPrices(collectionId, params) {
            return request(`${adm(collectionId)}/prices${qs(params)}`);
        }
        admin.listPrices = listPrices;
        /**
         * Put a product (or variant) on sale, or change its price in that currency (one price per product per
         * currency). @throws `INVALID_INPUT`, `APP_NOT_INSTALLED`
         */
        async function setPrice(collectionId, input) {
            return post(`${adm(collectionId)}/prices`, input);
        }
        admin.setPrice = setPrice;
        async function updatePrice(collectionId, priceId, changes) {
            return patch(`${adm(collectionId)}/prices/${encodeURIComponent(priceId)}`, changes);
        }
        admin.updatePrice = updatePrice;
        /** Take it off sale for good (or set `active: false` to pause). */
        async function removePrice(collectionId, priceId) {
            return del(`${adm(collectionId)}/prices/${encodeURIComponent(priceId)}`);
        }
        admin.removePrice = removePrice;
        /** Shop orders, newest first. Unpaid and expired checkouts are left out unless asked for. */
        async function listOrders(collectionId, params) {
            return request(`${adm(collectionId)}/orders${qs(params)}`);
        }
        admin.listOrders = listOrders;
        async function getOrder(collectionId, orderId) {
            return request(`${adm(collectionId)}/orders/${encodeURIComponent(orderId)}`);
        }
        admin.getOrder = getOrder;
        /**
         * Send some or all of what's left, with tracking. The held stock leaves; the buyer's "shipped" email
         * goes out if the shop has one. @throws `NOT_SHIPPABLE`, `NOTHING_TO_SHIP`
         */
        async function ship(collectionId, orderId, input = {}) {
            return post(`${adm(collectionId)}/orders/${encodeURIComponent(orderId)}/ship`, input);
        }
        admin.ship = ship;
        /**
         * Refund through Stripe: lines, shipping, a goodwill amount, or everything left. Unsent stock goes back;
         * digital delivery is withdrawn. @throws `NOT_REFUNDABLE`, `NOTHING_TO_REFUND`
         */
        async function refund(collectionId, orderId, input = {}) {
            return post(`${adm(collectionId)}/orders/${encodeURIComponent(orderId)}/refund`, input);
        }
        admin.refund = refund;
        /** An app that delivers a line itself (`deliveryConfig.kind: 'app'`) says it's done. */
        async function markDelivered(collectionId, orderId, itemId, input = {}) {
            return post(`${adm(collectionId)}/orders/${encodeURIComponent(orderId)}/lines/${encodeURIComponent(itemId)}/delivered`, input);
        }
        admin.markDelivered = markDelivered;
        /** Cancel a checkout that hasn't been paid (its stock is released). @throws `NOT_PENDING` */
        async function cancelCheckout(collectionId, orderId) {
            return post(`${adm(collectionId)}/orders/${encodeURIComponent(orderId)}/expire`, {});
        }
        admin.cancelCheckout = cancelCheckout;
    })(admin = shop.admin || (shop.admin = {}));
})(shop || (shop = {}));
