// src/types/shop.ts
// Basic commerce: prices, the shop's settings, checkout and shop orders — see docs/shop.md.
//
// Money is always a whole number of MINOR units (pence, cents): 1299 = £12.99. Prices include VAT.

/** How a price is delivered: shipped, or delivered when paid. */
export type ShopDelivery = 'physical' | 'digital'

/**
 * How a digital price is delivered:
 * - `proof`     a proof of ownership minted for the buyer (needs a signed-in buyer)
 * - `download`  files from the product's assets
 * - `access`    membership of a user group (needs a signed-in buyer)
 * - `app`       an app delivers it on `order.paid` and marks the line delivered
 */
export type ShopDigitalKind = 'proof' | 'download' | 'access' | 'app'

export type ShopDeliveryConfig =
  | { kind: 'proof'; productId?: string }
  | { kind: 'download'; assetIds: string[]; maxDownloads?: number }
  | { kind: 'access'; userGroupId: string }
  | { kind: 'app'; appId: string }

/** One price: a product (or variant) for sale in one currency. For sale = has an active price. */
export interface ShopPrice {
  id: string
  collectionId: string
  productId: string
  variantId: string | null
  /** The app that put it on sale ('shop' unless another app did). SmartLinks' fee follows it. */
  appId: string
  currency: string
  /** Minor units, VAT included. */
  amount: number
  /** A "was" price to show crossed out. */
  compareAtAmount: number | null
  delivery: ShopDelivery
  deliveryConfig: ShopDeliveryConfig | Record<string, never>
  /** Sell only what stock says is available; it's held while the buyer pays. */
  trackStock: boolean
  active: boolean
  sort: number
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface ShopPriceInput {
  productId: string
  variantId?: string | null
  /** The app putting it on sale. Must be installed in the collection; 'shop' by default. */
  appId?: string
  /** Defaults to the shop's currency. */
  currency?: string
  amount: number
  compareAtAmount?: number | null
  delivery?: ShopDelivery
  deliveryConfig?: ShopDeliveryConfig
  trackStock?: boolean
  active?: boolean
  sort?: number
  metadata?: Record<string, any>
}

export type ShopPriceUpdate = Partial<Omit<ShopPriceInput, 'productId' | 'variantId' | 'currency'>>

export interface ShopPriceListParams {
  productId?: string
  currency?: string
  active?: boolean
  appId?: string
  limit?: number
  offset?: number
}

export interface ShopShippingRate {
  id: string
  label: string
  /** Minor units. */
  amount: number
  /** "2-3 working days" */
  days?: string
}

/** The shop's settings (admin). Nothing here is secret; SmartLinks' own Stripe keys are server-side. */
export interface ShopSettings {
  currency: string
  /** The app whose flows run on order events (emails, staff alerts). */
  appId: string
  /** Shown to buyers before they pay (UK law: name, address, a way to get in touch). */
  seller: { name?: string; address?: string; email?: string; phone?: string; vatNumber?: string }
  vat: { registered: boolean; rate: number }
  shipping: {
    rates: ShopShippingRate[]
    /** Free delivery from this subtotal (minor units). */
    freeOver: number | null
    /** Offer collection in person. */
    collection: { label: string } | null
  }
  policies: { returns?: string; terms?: string; privacy?: string }
  /** Set by connecting Stripe (`shop.admin.connect`), never directly. */
  stripe: { accountId: string | null }
  /** Where shop stock is held (any container with stock when not set). */
  stockContainerId: string | null
  checkout: {
    /** Where Stripe sends the buyer after paying; `?session_id=` is added. */
    successUrl: string | null
    cancelUrl: string | null
    /** How long stock is held for an unpaid checkout: 30 to 1440 minutes. */
    expiresMinutes: number
    /** Other hosts the checkout may return to (beyond smartlinks.app, smartlinks.host and the pages above). */
    allowedHosts: string[]
  }
  digital: { euBuyers: boolean }
  /** Record a purchase interaction when an order is paid. */
  interaction: { interactionId: string | null }
}

/** What's still needed before the shop can take money. */
export interface ShopReadiness {
  ready: boolean
  missing: { key: string; text: string }[]
}

/** GET /shop/settings: the settings, what's missing, and what SmartLinks takes (read-only). */
export interface ShopSettingsView extends ShopSettings {
  readiness: ShopReadiness
  fee: { appId: string; bps: number; percent: number }
}

/** A settings change: merged into what's stored; shipping rates are replaced as a whole. */
export type ShopSettingsPatch = Partial<Omit<ShopSettings, 'stripe' | 'shipping' | 'checkout' | 'vat' | 'seller' | 'digital' | 'interaction'>> & {
  seller?: Partial<ShopSettings['seller']>
  vat?: Partial<ShopSettings['vat']>
  shipping?: Partial<ShopSettings['shipping']>
  checkout?: Partial<ShopSettings['checkout']>
  digital?: Partial<ShopSettings['digital']>
  interaction?: Partial<ShopSettings['interaction']>
}

export interface ShopConnectStatus {
  connected: boolean
  chargesEnabled?: boolean
  detailsSubmitted?: boolean
  payoutsEnabled?: boolean
  id?: string
}

/** What a shop front reads: nothing private. */
export interface ShopPublicConfig {
  currency: string
  seller: { name: string | null; address: string | null; email: string | null; vatNumber?: string }
  vat: { registered: boolean; rate: number }
  shipping: ShopSettings['shipping']
  policies: ShopSettings['policies']
  digital: { euBuyers: boolean }
  /** false until the shop can take payments. */
  ready: boolean
}

/** One thing for sale, as a shop front shows it. */
export interface ShopProduct {
  priceId: string
  productId: string
  variantId: string | null
  name: string
  description: string | null
  heroImage: any
  amount: number
  compareAtAmount: number | null
  currency: string
  delivery: ShopDelivery
  deliveryKind: ShopDigitalKind | null
  /** A proof or access goes to an account: the buyer must sign in before checking out. */
  needsSignIn: boolean
  /** How many can be bought now (tracked stock), or null when stock isn't tracked. */
  available: number | null
  inStock: boolean
}

export interface ShopCheckoutLine {
  productId: string
  variantId?: string | null
  quantity?: number
}

export interface ShopCheckoutInput {
  lines: ShopCheckoutLine[]
  /** Needed for physical items when the shop has several rates (collection is `'collection'`). */
  shippingRateId?: string
  /** Pre-fills Stripe's form; the order's email comes from the payment. */
  email?: string
  /** Defaults to the shop's checkout pages. Must be on an allowed host. */
  successUrl?: string
  cancelUrl?: string
  /** Digital items: the buyer agreed to delivery straight away, ending the 14-day right to cancel. Required for them. */
  acceptances?: { digitalImmediate?: boolean }
}

export interface ShopCheckoutResult {
  orderId: string
  /** Send the buyer here (Stripe's hosted checkout). */
  checkoutUrl: string
  /** The stock is held until then. */
  expiresAt: string
  total: number
  currency: string
}

export type ShopOrderStatus = 'pending-payment' | 'paid' | 'fulfilled' | 'partly-refunded' | 'refunded' | 'expired'

export interface ShopOrderLine {
  id: string
  productId: string
  variantId: string | null
  name: string | null
  quantity: number
  unitAmount: number | null
  lineTotal: number | null
  delivery: ShopDelivery | null
  deliveryKind: ShopDigitalKind | null
  /** Shipped, or delivered. */
  quantityDone: number
  quantityRefunded: number
  priceId: string | null
  appId: string
  /** Asset ids, for a download line. */
  files?: string[]
  /** Admin only: SmartLinks' fee on this line. */
  fee?: { bps: number; amount: number }
}

export interface ShopShipment {
  id: string
  at: string
  lines: { itemId: string; quantity: number }[]
  carrier?: string
  trackingNumber?: string
  trackingUrl?: string
}

export interface ShopOrder {
  id: string
  collectionId: string
  orderRef: string | null
  status: ShopOrderStatus
  source: 'shop'
  contactId: string | null
  currency: string
  subtotal: number | null
  shipping: number | null
  /** VAT inside the total, for the receipt. */
  tax: number | null
  total: number | null
  refunded: number
  paidAt: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  email: string | null
  shippingChoice: ShopShippingRate | null
  shippingAddress: Record<string, any> | null
  shipments: ShopShipment[]
  lines: ShopOrderLine[]
}

/** The seller's view: payment, refunds, anything that needs a look, and SmartLinks' fee. */
export interface ShopAdminOrder extends ShopOrder {
  payment: { provider: 'stripe'; sessionId: string; paymentIntentId: string | null; amount: number; currency: string } | null
  refunds: { id: string; amount: number; at: string; lines: { itemId: string; quantity: number }[]; shipping?: number; restock?: boolean; reason?: string; external?: boolean }[]
  /** AMOUNT_MISMATCH, STOCK_SHORT, DELIVERY_FAILED, PROOF_NOT_WITHDRAWN… */
  attention: { code: string; text: string; itemId?: string }[]
  acceptances: { digitalImmediate?: boolean; at: string } | null
  paymentRef: string | null
  fee: { amount: number }
}

/** The buyer's view, with links for bought files once paid. */
export interface ShopBuyerOrder extends ShopOrder {
  downloads: { name: string; url: string }[]
}

export interface ShopOrderListParams {
  /** One status or several, comma-separated. Unpaid and expired checkouts are left out unless asked for. */
  status?: string
  contactId?: string
  includeExpired?: boolean
  limit?: number
  offset?: number
}

export interface ShopPage<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

export interface ShopShipInput {
  /** Which lines and how many; all that's left when omitted. */
  lines?: { itemId: string; quantity?: number }[]
  carrier?: string
  trackingNumber?: string
  /** https only. */
  trackingUrl?: string
}

export interface ShopRefundInput {
  /** Lines and quantities at the price sold. With no lines and no amount: everything left, shipping included. */
  lines?: { itemId: string; quantity?: number }[]
  /** Refund the shipping too (with `lines`). */
  shipping?: boolean
  /** A goodwill amount instead of lines (minor units). */
  amount?: number
  /** Unsent held stock goes back to available. Default true. */
  restock?: boolean
  reason?: string
}
