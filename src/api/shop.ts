// src/api/shop.ts
// Basic commerce — see docs/shop.md. A shop front (any page, any site) uses the public calls; the Shop app and
// Studio use `shop.admin`. Prices, totals and "paid" are never taken from the browser: the server prices the
// basket, and only Stripe's webhook marks an order paid.
import { request, post, put, patch, del } from '../http'
import { formatMinor } from '../utils/money'
import type {
  ShopPublicConfig,
  ShopProduct,
  ShopCheckoutInput,
  ShopCheckoutResult,
  ShopBuyerOrder,
  ShopSettingsView,
  ShopSettingsPatch,
  ShopConnectStatus,
  ShopPrice,
  ShopPriceInput,
  ShopPriceUpdate,
  ShopPriceListParams,
  ShopAdminOrder,
  ShopOrderListParams,
  ShopShipInput,
  ShopRefundInput,
} from '../types/shop'
import type { ListResult, ListOptions } from '../types/list'

const pub = (collectionId: string) => `/public/collection/${encodeURIComponent(collectionId)}/shop`
const adm = (collectionId: string) => `/admin/collection/${encodeURIComponent(collectionId)}/shop`

function qs(params?: Record<string, any>): string {
  if (!params) return ''
  const parts: string[] = []
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(Array.isArray(v) ? v.join(',') : String(v))}`)
  }
  return parts.length ? `?${parts.join('&')}` : ''
}

export namespace shop {
  /**
   * What a shop front shows: currency, the seller's details (UK law: shown before paying), shipping rates,
   * policies, and `ready` (false until the shop can take payments).
   */
  export async function config(collectionId: string): Promise<ShopPublicConfig> {
    return request<ShopPublicConfig>(`${pub(collectionId)}/config`)
  }

  /**
   * What is for sale, in the shop's currency, with stock (`inStock`, `available`) and whether the buyer must
   * sign in first (`needsSignIn`: a proof or access goes to an account). Everything for sale comes in one
   * answer (`nextCursor` is always null), with the shop's `currency` beside the list.
   *
   * @example
   * ```typescript
   * const { items, currency } = await shop.products(collectionId)
   * items.map((p) => `${p.name}: ${formatMoney(p.amount, p.currency)}${p.inStock ? '' : ' (sold out)'}`)
   * ```
   */
  export async function products(collectionId: string, params?: { productIds?: string[] }): Promise<ListResult<ShopProduct> & { currency: string }> {
    return request(`${pub(collectionId)}/products${qs({ productIds: params?.productIds })}`)
  }

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
  export async function checkout(collectionId: string, input: ShopCheckoutInput): Promise<ShopCheckoutResult> {
    return post<ShopCheckoutResult>(`${pub(collectionId)}/checkout`, input)
  }

  /**
   * The thank-you page: the order a Stripe checkout paid for, from the `session_id` on the success URL.
   * Its `status` is `pending-payment` for a moment while the payment is confirmed: check again shortly.
   * `downloads` has links for bought files once it's paid.
   */
  export async function orderBySession(collectionId: string, sessionId: string): Promise<ShopBuyerOrder> {
    return request<ShopBuyerOrder>(`${pub(collectionId)}/orders/by-session/${encodeURIComponent(sessionId)}`)
  }

  /**
   * The signed-in buyer's orders, newest first, with their download links, a page at a time. `count` is how
   * many they have in all.
   *
   * @example
   * ```typescript
   * let page = await shop.myOrders(collectionId, { limit: 20 })
   * page.items // ShopBuyerOrder[]
   * if (page.nextCursor) page = await shop.myOrders(collectionId, { limit: 20, cursor: page.nextCursor })
   * ```
   * @throws `SIGN_IN_REQUIRED`
   */
  export async function myOrders(collectionId: string, params?: ListOptions): Promise<ListResult<ShopBuyerOrder>> {
    return request(`${pub(collectionId)}/orders/mine${qs(params)}`)
  }

  /**
   * Format minor units as money, in the page's language unless `locale` says otherwise:
   * `formatMoney(1299, 'EUR')` → "€12.99" in English, "12,99 €" in German. Zero-decimal currencies
   * (JPY, KRW) are whole units: `formatMoney(1299, 'JPY')` → "¥1,299".
   */
  export function formatMoney(amount: number, currency: string, locale?: string): string {
    return formatMinor(amount, currency, locale)
  }

  /** The seller's side: settings, Stripe, prices and orders (collection admins). */
  export namespace admin {
    /** The settings, what's still needed to take payments (`readiness`), and what SmartLinks takes (`fee`, read-only). */
    export async function settings(collectionId: string): Promise<ShopSettingsView> {
      return request<ShopSettingsView>(`${adm(collectionId)}/settings`)
    }

    /** Change settings: merged into what's stored; `shipping.rates` is replaced as a whole. */
    export async function updateSettings(collectionId: string, patch: ShopSettingsPatch): Promise<ShopSettingsView> {
      return put<ShopSettingsView>(`${adm(collectionId)}/settings`, patch)
    }

    /**
     * Connect the seller's Stripe account (a new one, set up on Stripe's own pages). Send the seller to `url`;
     * Stripe brings them back to `returnUrl` (done or not: check `connectStatus`) or `refreshUrl` (the link ran out).
     */
    export async function connect(collectionId: string, input: { returnUrl: string; refreshUrl: string }): Promise<{ url: string; expiresAt: string }> {
      return post(`${adm(collectionId)}/connect`, input)
    }

    /** Whether Stripe is connected, and whether it can take payments and pay out yet. */
    export async function connectStatus(collectionId: string): Promise<ShopConnectStatus> {
      return request<ShopConnectStatus>(`${adm(collectionId)}/connect/status`)
    }

    /**
     * The shop's prices, a page at a time. Filter by product, currency, app, or whether it is on sale
     * (`active`). `count` is how many match in all.
     *
     * @example
     * ```typescript
     * const { items, nextCursor, count } = await shop.admin.listPrices(collectionId, { productId: 'soap', active: true })
     * ```
     */
    export async function listPrices(collectionId: string, params?: ShopPriceListParams): Promise<ListResult<ShopPrice>> {
      return request(`${adm(collectionId)}/prices${qs(params)}`)
    }

    /**
     * Put a product (or variant) on sale, or change its price in that currency (one price per product per
     * currency). @throws `INVALID_INPUT`, `APP_NOT_INSTALLED`
     */
    export async function setPrice(collectionId: string, input: ShopPriceInput): Promise<ShopPrice> {
      return post<ShopPrice>(`${adm(collectionId)}/prices`, input)
    }

    export async function updatePrice(collectionId: string, priceId: string, changes: ShopPriceUpdate): Promise<ShopPrice> {
      return patch<ShopPrice>(`${adm(collectionId)}/prices/${encodeURIComponent(priceId)}`, changes)
    }

    /** Take it off sale for good (or set `active: false` to pause). */
    export async function removePrice(collectionId: string, priceId: string): Promise<{ deleted: true }> {
      return del(`${adm(collectionId)}/prices/${encodeURIComponent(priceId)}`)
    }

    /**
     * Shop orders, newest first, a page at a time. Unpaid and expired checkouts are left out unless asked
     * for. `count` is how many match in all.
     *
     * @example
     * ```typescript
     * let page = await shop.admin.listOrders(collectionId, { status: 'paid', limit: 50 })
     * page.items // ShopAdminOrder[]
     * while (page.nextCursor) page = await shop.admin.listOrders(collectionId, { status: 'paid', limit: 50, cursor: page.nextCursor })
     * ```
     */
    export async function listOrders(collectionId: string, params?: ShopOrderListParams): Promise<ListResult<ShopAdminOrder>> {
      return request(`${adm(collectionId)}/orders${qs(params)}`)
    }

    export async function getOrder(collectionId: string, orderId: string): Promise<ShopAdminOrder> {
      return request<ShopAdminOrder>(`${adm(collectionId)}/orders/${encodeURIComponent(orderId)}`)
    }

    /**
     * Send some or all of what's left, with tracking. The held stock leaves; the buyer's "shipped" email
     * goes out if the shop has one. @throws `NOT_SHIPPABLE`, `NOTHING_TO_SHIP`
     */
    export async function ship(collectionId: string, orderId: string, input: ShopShipInput = {}): Promise<ShopAdminOrder> {
      return post<ShopAdminOrder>(`${adm(collectionId)}/orders/${encodeURIComponent(orderId)}/ship`, input)
    }

    /**
     * Refund through Stripe: lines, shipping, a goodwill amount, or everything left. Unsent stock goes back;
     * digital delivery is withdrawn. @throws `NOT_REFUNDABLE`, `NOTHING_TO_REFUND`
     */
    export async function refund(collectionId: string, orderId: string, input: ShopRefundInput = {}): Promise<ShopAdminOrder> {
      return post<ShopAdminOrder>(`${adm(collectionId)}/orders/${encodeURIComponent(orderId)}/refund`, input)
    }

    /** An app that delivers a line itself (`deliveryConfig.kind: 'app'`) says it's done. */
    export async function markDelivered(collectionId: string, orderId: string, itemId: string, input: { note?: string; reference?: string } = {}): Promise<ShopAdminOrder> {
      return post<ShopAdminOrder>(`${adm(collectionId)}/orders/${encodeURIComponent(orderId)}/lines/${encodeURIComponent(itemId)}/delivered`, input)
    }

    /** Cancel a checkout that hasn't been paid (its stock is released). @throws `NOT_PENDING` */
    export async function cancelCheckout(collectionId: string, orderId: string): Promise<ShopAdminOrder> {
      return post<ShopAdminOrder>(`${adm(collectionId)}/orders/${encodeURIComponent(orderId)}/expire`, {})
    }
  }
}
