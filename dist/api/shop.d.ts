import type { ShopPublicConfig, ShopProduct, ShopCheckoutInput, ShopCheckoutResult, ShopBuyerOrder, ShopPage, ShopSettingsView, ShopSettingsPatch, ShopConnectStatus, ShopPrice, ShopPriceInput, ShopPriceUpdate, ShopPriceListParams, ShopAdminOrder, ShopOrderListParams, ShopShipInput, ShopRefundInput } from '../types/shop.js';
export declare namespace shop {
    /**
     * What a shop front shows: currency, the seller's details (UK law: shown before paying), shipping rates,
     * policies, and `ready` (false until the shop can take payments).
     */
    function config(collectionId: string): Promise<ShopPublicConfig>;
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
    function products(collectionId: string, params?: {
        productIds?: string[];
    }): Promise<{
        currency: string;
        items: ShopProduct[];
    }>;
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
    function checkout(collectionId: string, input: ShopCheckoutInput): Promise<ShopCheckoutResult>;
    /**
     * The thank-you page: the order a Stripe checkout paid for, from the `session_id` on the success URL.
     * Its `status` is `pending-payment` for a moment while the payment is confirmed: check again shortly.
     * `downloads` has links for bought files once it's paid.
     */
    function orderBySession(collectionId: string, sessionId: string): Promise<ShopBuyerOrder>;
    /** The signed-in buyer's orders, newest first, with their download links. @throws `SIGN_IN_REQUIRED` */
    function myOrders(collectionId: string, params?: {
        limit?: number;
        offset?: number;
    }): Promise<ShopPage<ShopBuyerOrder>>;
    /**
     * Format minor units as money, in the page's language unless `locale` says otherwise:
     * `formatMoney(1299, 'EUR')` → "€12.99" in English, "12,99 €" in German. Zero-decimal currencies
     * (JPY, KRW) are whole units: `formatMoney(1299, 'JPY')` → "¥1,299".
     */
    function formatMoney(amount: number, currency: string, locale?: string): string;
    /** The seller's side: settings, Stripe, prices and orders (collection admins). */
    namespace admin {
        /** The settings, what's still needed to take payments (`readiness`), and what SmartLinks takes (`fee`, read-only). */
        function settings(collectionId: string): Promise<ShopSettingsView>;
        /** Change settings: merged into what's stored; `shipping.rates` is replaced as a whole. */
        function updateSettings(collectionId: string, patch: ShopSettingsPatch): Promise<ShopSettingsView>;
        /**
         * Connect the seller's Stripe account (a new one, set up on Stripe's own pages). Send the seller to `url`;
         * Stripe brings them back to `returnUrl` (done or not: check `connectStatus`) or `refreshUrl` (the link ran out).
         */
        function connect(collectionId: string, input: {
            returnUrl: string;
            refreshUrl: string;
        }): Promise<{
            url: string;
            expiresAt: string;
        }>;
        /** Whether Stripe is connected, and whether it can take payments and pay out yet. */
        function connectStatus(collectionId: string): Promise<ShopConnectStatus>;
        function listPrices(collectionId: string, params?: ShopPriceListParams): Promise<ShopPage<ShopPrice>>;
        /**
         * Put a product (or variant) on sale, or change its price in that currency (one price per product per
         * currency). @throws `INVALID_INPUT`, `APP_NOT_INSTALLED`
         */
        function setPrice(collectionId: string, input: ShopPriceInput): Promise<ShopPrice>;
        function updatePrice(collectionId: string, priceId: string, changes: ShopPriceUpdate): Promise<ShopPrice>;
        /** Take it off sale for good (or set `active: false` to pause). */
        function removePrice(collectionId: string, priceId: string): Promise<{
            deleted: true;
        }>;
        /** Shop orders, newest first. Unpaid and expired checkouts are left out unless asked for. */
        function listOrders(collectionId: string, params?: ShopOrderListParams): Promise<ShopPage<ShopAdminOrder>>;
        function getOrder(collectionId: string, orderId: string): Promise<ShopAdminOrder>;
        /**
         * Send some or all of what's left, with tracking. The held stock leaves; the buyer's "shipped" email
         * goes out if the shop has one. @throws `NOT_SHIPPABLE`, `NOTHING_TO_SHIP`
         */
        function ship(collectionId: string, orderId: string, input?: ShopShipInput): Promise<ShopAdminOrder>;
        /**
         * Refund through Stripe: lines, shipping, a goodwill amount, or everything left. Unsent stock goes back;
         * digital delivery is withdrawn. @throws `NOT_REFUNDABLE`, `NOTHING_TO_REFUND`
         */
        function refund(collectionId: string, orderId: string, input?: ShopRefundInput): Promise<ShopAdminOrder>;
        /** An app that delivers a line itself (`deliveryConfig.kind: 'app'`) says it's done. */
        function markDelivered(collectionId: string, orderId: string, itemId: string, input?: {
            note?: string;
            reference?: string;
        }): Promise<ShopAdminOrder>;
        /** Cancel a checkout that hasn't been paid (its stock is released). @throws `NOT_PENDING` */
        function cancelCheckout(collectionId: string, orderId: string): Promise<ShopAdminOrder>;
    }
}
