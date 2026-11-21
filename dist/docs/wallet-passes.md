# Wallet passes

Put an **event ticket**, a **booking**, a **membership card** or a **loyalty card** in the person's Apple Wallet or
Google Wallet. SmartLinks is the issuer and signs the passes. Each pass is branded from your site's name, logo and
colour, and your app decides what it says.

- **Who gets one:** only someone the business knows. A pass is issued to the signed-in owner of what it's for, or
  by your app's own server function.
- **What the phone does:** the pass shows its QR code offline, appears near the time (and place, if you give
  `venue.lat` / `lng`), and updates when you change it.
- **Bookings look after themselves:** when a booking is moved its pass shows the new time, and when it's cancelled
  the pass is voided.

## In a page: "Add to Wallet"

```typescript
import { wallet } from '@proveanything/smartlinks'

// The signed-in person's booking, membership card, or a pass your app issued them
const { pass } = await wallet.addLinks(collectionId, { type: 'booking', id: booking.id })
// pass.links.apple  → opens the .pkpass on an iPhone
// pass.links.google → opens Google's "Save to Google Wallet" page
```

- `{ type: 'booking', id }` and `{ type: 'contact', id: 'me' }` are made on first ask:
  - a booking pass, from the booking's date and time
  - a membership card, from the person's `level` and `memberUntil` fields
- For anything else (an event ticket with your own title, a loyalty card with points), issue the pass in your server
  function first. `addLinks` then returns that pass for its owner.
- Show the official "Add to Apple Wallet" and "Add to Google Wallet" badges, and only the one that suits the
  device. A wallet that isn't set up yet is left out of `links`.
- `wallet.mine(collectionId)` lists the person's passes.

## In a server function: issue, change, void, message

Declare `sl:wallet:write` in the function's capabilities.

```typescript
// An event ticket
const pass = await ctx.sl.wallet.issue({
  ref: { type: 'booking', id: booking.id },     // what it's for; issuing again changes the same pass
  pass: {
    kind: 'event',
    title: 'Jazz on the Terrace',
    start: '2026-12-24T19:00:00Z', end: '2026-12-24T22:00:00Z', timezone: 'Europe/London',
    venue: { name: 'The Terrace', address: '1 High St, Bath', lat: 51.38, lng: -2.36 },
    holder: 'Sam Lee', number: 'T-0042',
    fields: [{ label: 'Seat', value: 'Table 6' }],
  },
})
return { links: pass.links }                     // hand these to the page

// A loyalty card, kept up to date
await ctx.sl.wallet.issue({ ref: { type: 'loyalty', id: accountId }, pass: { kind: 'loyalty', title: 'Bloom Rewards', points: 120, holder: 'Sam' } })
await ctx.sl.wallet.update(passId, { points: 145 })

await ctx.sl.wallet.void(passId, 'refunded')
await ctx.sl.wallet.message(passId, { header: 'Doors open', body: 'Doors open at 7pm. See you soon!' })
// Everyone holding a ticket for this event
await ctx.sl.wallet.messageAll({ type: 'event', id: eventId }, { header: 'Running late', body: 'We start at 7:30 tonight.' })
```

- **Contact:** `contactId` defaults to the caller's contact.
- **Reading:** `ctx.sl.wallet.get(passId)`, `forRef(ref)`, `byCode(code)` and `mine()` need only `sl:wallet:read`.
- **Messages:** you can also send a message to wallet with `ctx.sl.messages` and `channel: 'wallet'`. It goes to the
  person's passes about the message's `about`, otherwise to your app's own passes for them. It's worded from the
  template's push version.

## Knowing who added it

Every pass belongs to a known person, so you can tell who has actually put it in their wallet:

- **Apple:** the phone registers the pass with SmartLinks when it's added, and unregisters it when it's removed.
- **Google:** Google sends a signed "saved" or "deleted" notice.

The pass's `inWallet` shows `{ apple: { saved, savedAt }, google: { saved, savedAt } }`. Each change raises an
event for the pass holder, so a flow in your app's blueprint can react, for example by sending a "see you there"
email when someone adds their ticket:

| Event | When |
|---|---|
| `wallet.pass_added` | the person added the pass to Apple or Google Wallet |
| `wallet.pass_removed` | they removed it |

Google's notices are best-effort, so treat them as a good signal rather than a guarantee.

## Checking a pass at the door

The QR holds the pass's own code, never an id. Scan it, then:

```typescript
const { pass, valid } = await wallet.byCode(collectionId, scanned)     // admin
// or in a function: await ctx.sl.wallet.byCode(scanned)
```

## What a pass can show

| Field | Use |
|---|---|
| `kind` | `event`, `booking`, `membership` or `loyalty` |
| `title` / `subtitle` | the main line and a second line |
| `start` / `end` / `timezone` | when; the pass surfaces near `start` |
| `venue` | `name`, `address`, and `lat` / `lng` for the lock screen nearby |
| `holder`, `number`, `level`, `points`, `validUntil` | the person, a reference or member number, a level, a balance, an end date |
| `fields` (up to 4), `back` | extra lines on the front and the back |
| `image`, `url` | https only: a picture, a link back to your site |
| `barcode` | your own QR value, instead of the pass's code |
