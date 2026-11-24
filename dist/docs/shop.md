# Shop (basic commerce)

Sell products from any site: physical goods that ship, and digital ones (a file, a proof of ownership, access to
a members' group, or something your app delivers). Buyers pay on Stripe's own checkout page into the **seller's**
Stripe account. SmartLinks prices the basket, holds the stock, records the order, sends the emails your app sets up
and tells integrations.

- **Money is in minor units** (pence, cents): `1299` is £12.99. Prices include VAT.
- **The browser never decides an amount.** The server prices the basket from the shop's prices, and only Stripe's
  webhook marks an order paid.
- **What's for sale:** a product (or variant) with an active price. One price per product per currency.
- **Stock:** with `trackStock`, the shop sells only what stock says is available and holds it while the buyer pays
  (see `docs/operations.md`). An unpaid checkout lets go of its stock when it runs out (30 minutes by default).

## A shop front

```typescript
import { shop } from '@proveanything/smartlinks'

const config = await shop.config(collectionId)            // seller details, shipping rates, policies, ready
const { items } = await shop.products(collectionId)       // what's for sale, with stock and prices

for (const p of items) {
  console.log(p.name, shop.formatMoney(p.amount, p.currency), p.inStock ? '' : 'sold out')
}

// Pay
const { checkoutUrl } = await shop.checkout(collectionId, {
  lines: [{ productId: 'soap', quantity: 2 }],
  shippingRateId: 'std',                                  // needed for physical items when there are several rates
  successUrl: `${location.origin}/thanks`,                // Stripe adds ?session_id=…
  cancelUrl: `${location.origin}/basket`,
})
location.href = checkoutUrl
```

The basket is yours to keep: in the page's state or local storage. `shop.checkout` only needs the lines.

**Before paying, show** (UK consumer law, and it's what `config` is for):
- the seller's name, address and email
- the returns policy (`config.policies.returns`)
- delivery costs and times

Leave the buy button off while `config.ready` is false.

**Digital items** end the buyer's 14-day right to cancel once delivered, so ask for agreement: a checkbox that sends
`acceptances: { digitalImmediate: true }`. Without it, checkout refuses with `DIGITAL_CONSENT_REQUIRED`.

**Signing in:** guests can buy physical goods and downloads. A **proof** or **access** goes to an account, so those
items have `needsSignIn: true`. Ask the person to sign in first, or checkout refuses with `SIGN_IN_REQUIRED`.

### The thank-you page

```typescript
const sessionId = new URLSearchParams(location.search).get('session_id')
let order = await shop.orderBySession(collectionId, sessionId!)
// Stripe's message can take a moment: 'pending-payment' means "check again in a second or two"
if (order.status === 'pending-payment') { /* wait and ask again */ }
order.downloads   // [{ name, url }] for bought files, once paid
```

### My orders

```typescript
const { items, nextCursor } = await shop.myOrders(collectionId)   // signed in: their orders, newest first, with downloads
// more: shop.myOrders(collectionId, { cursor: nextCursor }) until nextCursor is null
```

### Errors

`checkout` fails plainly, with nothing charged:

| Code | Meaning |
|---|---|
| `SHOP_NOT_READY` | The seller hasn't finished setting up (details, returns policy, Stripe) |
| `NOT_FOR_SALE` | No active price for an item |
| `OUT_OF_STOCK` | Not enough available; `details` says which |
| `SHIPPING_REQUIRED` | Choose a shipping rate |
| `SIGN_IN_REQUIRED` | A proof or access item needs a signed-in buyer |
| `DIGITAL_CONSENT_REQUIRED` | Digital items need `acceptances.digitalImmediate` |
| `INVALID_INPUT` | For example, a return page on another site |
| `PAYMENT_UNAVAILABLE` | Stripe couldn't be reached; try again |

## The seller's side (`shop.admin`)

For the Shop app and Studio (collection admins).

```typescript
// Set up
const s = await shop.admin.settings(collectionId)   // s.readiness.missing: what's still needed; s.fee: SmartLinks' rate
await shop.admin.updateSettings(collectionId, {
  seller: { name: 'Hill Farm Soaps', address: '1 High St, Bath', email: 'hello@hillfarm.test' },
  policies: { returns: 'Return unused items within 30 days.' },
  shipping: { rates: [{ id: 'std', label: 'Standard', amount: 395, days: '2-3 working days' }], freeOver: 5000 },
  checkout: { successUrl: 'https://hillfarm.smartlinks.host/thanks', cancelUrl: 'https://hillfarm.smartlinks.host/basket' },
})
const { url } = await shop.admin.connect(collectionId, { returnUrl, refreshUrl })  // the seller finishes on Stripe
await shop.admin.connectStatus(collectionId)       // { connected, chargesEnabled, payoutsEnabled }

// Put things on sale
await shop.admin.setPrice(collectionId, { productId: 'soap', amount: 1200, trackStock: true })
await shop.admin.setPrice(collectionId, {
  productId: 'soap-book', amount: 800, delivery: 'digital',
  deliveryConfig: { kind: 'download', assetIds: ['asset_1'], maxDownloads: 5 },
})
await shop.admin.setPrice(collectionId, { productId: 'founder-cert', amount: 2500, delivery: 'digital', deliveryConfig: { kind: 'proof' } })

// Orders
const { items, nextCursor, count } = await shop.admin.listOrders(collectionId, { status: 'paid', limit: 50 })
// next page: shop.admin.listOrders(collectionId, { status: 'paid', limit: 50, cursor: nextCursor })
await shop.admin.ship(collectionId, orderId, { carrier: 'Royal Mail', trackingNumber: 'AB123456789GB' })
await shop.admin.refund(collectionId, orderId, { lines: [{ itemId, quantity: 1 }], reason: 'Arrived damaged' })
```

**An order's life:**

| Status | Meaning |
|---|---|
| `pending-payment` | At Stripe's checkout. Stock is held. |
| `expired` | Not paid in time, or cancelled. Stock released. |
| `paid` | Paid. Digital lines are delivered at once; physical ones wait to be shipped. |
| `fulfilled` | Everything sent or delivered. |
| `partly-refunded` / `refunded` | Money given back through Stripe. |

Anything that needs a look is in `order.attention`, for example a payment that didn't match (`AMOUNT_MISMATCH`)
or stock that sold out while the buyer was paying late (`STOCK_SHORT`).

**Delivery kinds** (`deliveryConfig.kind` on a digital price):

| Kind | What the buyer gets |
|---|---|
| `download` | Links to the files, by email and on the thank-you page (signed, 7 days; `maxDownloads` per file) |
| `proof` | A proof of ownership per unit, minted for their account |
| `access` | Membership of a user group (`userGroupId`), for members-only content |
| `app` | Your app delivers it on `order.paid`, then calls `shop.admin.markDelivered` |

## Emails, flows and integrations

Nothing is emailed by default. The selling app (the shop's `appId`, `shop` unless set) decides what goes out, in
flows on order events, with templates the business can reword in Studio. They're set up the same way as booking
emails (`docs/bookings.md`, "Confirmations and messages"): a site's `cloud/flows.json`, or
`POST /admin/collection/:cId/blueprint/apply` with `{ appId, blueprint: { templates, flows } }`.

```json
{
  "templates": {
    "order-confirmed": { "name": "Order confirmation", "email": { "subject": "Order {{ order.reference }}: thank you", "body": "<p>Thanks {{ contact.firstName }}. Total {{ order.total }}.</p>{% for f in order.downloads %}<p><a href=\"{{ f.url }}\">{{ f.name }}</a></p>{% endfor %}" } },
    "order-shipped": { "name": "On its way", "email": { "subject": "Your order is on its way", "body": "<p>{{ order.tracking.carrier }} {{ order.tracking.number }}</p>" } },
    "staff-new-order": { "name": "New order", "email": { "subject": "New order {{ order.reference }}: {{ order.total }}", "body": "<p>{{ order.shippingMethod }}</p>" } }
  },
  "flows": [
    { "when": { "event": "order.paid" }, "do": [{ "send": "order-confirmed", "to": "contact" }, { "send": "staff-new-order", "to": "team" }] },
    { "when": { "event": "order.shipped" }, "do": [{ "send": "order-shipped", "to": "contact" }] }
  ]
}
```

- **Events:** `order.paid`, `order.shipped`, `order.fulfilled`, `order.refunded`, `order.expired`,
  `order.needs_attention`. `when.status` narrows to the order's status; `when.delivery` (`physical` /
  `digital`) to orders with a line delivered that way.
- **`{{ order }}`:** `reference`, `status`, `placedAt`, `subtotal`, `shipping`, `shippingMethod`, `vat`, `total`,
  `refunded` (all formatted, such as "£12.99"), `lines[]` (`name`, `quantity`, `unitPrice`, `total`, `delivery`),
  `shippingAddress`, `tracking` (`carrier`, `number`, `url`), `seller`, `hasDigital`, `hasPhysical`, and
  `downloads[]` (`name`, `url`). Download links go only to the buyer.
- **Integrations:** `order` is a flow source, so an order can go to a courier, a finance system or a fulfilment
  partner. The delivery address leaves only under the `raw` identity policy; otherwise just the country.
- **Interactions:** set `interaction.interactionId` in the settings to record a purchase interaction when an order
  is paid.

## SmartLinks' fee

SmartLinks may take a small fee per sale, as Stripe's application fee. SmartLinks sets it per app, and sometimes per
business; sellers can't change it. Each price records the app that put it on sale (`appId`, `shop` by default),
and the fee follows that app. It's never charged on shipping. The seller sees their rate in
`shop.admin.settings().fee`.

Another app can sell through the same calls by passing its own `appId` on `setPrice`. It must be installed in the
collection. Its order emails come from its own flows when it's the shop's `appId`.
