# Bookings: slots, bookings and allocations

Generic booking objects for **any** booking app: event tickets, classes, tours, table reservations,
one-to-one appointments, room and equipment hire. The platform gives you the objects and the
guarantees. Your app owns the rest: schedule, policy, pricing, payment and UI.

```ts
import { bookings, utils } from '@proveanything/smartlinks'
```

---

## What the platform guarantees (and what it doesn't)

| The platform | Your app |
|---|---|
| **No double-booking** of a person / room / table, however many requests arrive at once | The schedule (opening hours) and its UI |
| **No overselling** a slot's capacity | Booking policy: notice, durations, who may book |
| **Atomic** writes: a booking with several parts (a stylist *and* a chair) succeeds whole or not at all | Pricing, ticket types, payment or credits, refunds |
| **Idempotent** creates (`idempotencyKey`): a retried request never books twice | Queues, waiting rooms, throttling for high-demand sales |
| **Holds** that expire and give the place back | Confirmation / reminder content (flows on booking events) |
| Who may book publicly, by **per-app rules** (like records / cases) | |

---

## The three objects

- **Slot** — a time window with a **capacity**: an event performance, a class, a tour at 2pm. Seats
  are counted (`booked`, `remaining`).
- **Booking** — the customer's reservation and its lifecycle. This is what "my bookings" lists.
- **Allocation** — what a booking actually claims: seats on a slot (`mode: 'capacity'`) or
  exclusive time on a resource (`mode: 'exclusive'`). Most apps never touch these directly: they're
  returned on `booking.allocations`.

**Resources are not a new object.** Staff, rooms, tables and equipment are whatever you already use —
app records, contacts, products — referenced by type + id: `{ resourceType: 'record', resourceId: 'staff-sam' }`.

### Booking statuses

| Status | Holds a place? | Meaning |
|---|---|---|
| `held` | yes, until `holdExpiresAt` | Claimed while the customer pays / confirms; expires automatically |
| `pending` | yes | Claimed, waiting for the business to approve |
| `confirmed` | yes | Booked |
| `completed` / `no_show` | yes (the time was used) | Outcome after the event (admin) |
| `cancelled` | no | `cancelReason`: `admin`, `owner`, `hold_expired` or your own |
| `waitlisted` | no | Waiting; confirming it claims the place if one is free |

---

## Events and classes — slots

```ts
// Admin (Studio, or your app's server function): publish the sessions
const slot = await bookings.slots.create(collectionId, appId, {
  startsAt: '2026-11-14T19:30:00Z', endsAt: '2026-11-14T21:00:00Z',
  capacity: 200,
  perContactLimit: 4,          // max 4 seats per person on this slot, enforced atomically
  data: { title: 'Autumn concert' },
})

// A class that also needs its instructor free: the slot blocks the instructor's time too
await bookings.slots.create(collectionId, appId, {
  startsAt, endsAt, capacity: 12,
  resourceType: 'record', resourceId: 'instructor-ana', blockResource: true,
})

// A series, all-or-nothing (max 500)
await bookings.slots.createMany(collectionId, appId, sessions, { seriesId })

// Public: open slots with places left
const { data } = await bookings.slots.list(collectionId, appId, { from, to, available: true })
data[0].remaining
```

Book seats:

```ts
const booking = await bookings.create(collectionId, appId, { slotId: slot.id, quantity: 2, idempotencyKey })
```

Recurring events are **expanded into concrete slots** (`seriesId`); there's no recurrence rule
stored on a slot.

---

## Appointments — exclusive time on a resource

```ts
await bookings.create(collectionId, appId, {
  resourceType: 'record', resourceId: 'staff-sam',
  startsAt: '2026-11-03T10:00:00Z', endsAt: '2026-11-03T10:30:00Z',
  bufferAfter: 15,             // admin: blocks 10:30–10:45 too (clean-up); the booking still shows 10:00–10:30
}, true)
```

Several resources at once — all-or-nothing:

```ts
await bookings.create(collectionId, appId, {
  startsAt, endsAt,
  allocations: [
    { resourceType: 'record', resourceId: 'stylist-jo' },
    { resourceType: 'record', resourceId: 'chair-2' },
  ],
}, true)
```

A pool with no fixed times (3 kayaks, bookable any time) is three resources; your app picks a free one.

### Blocked time

```ts
await bookings.blocks.create(collectionId, appId, { resourceType: 'record', resourceId: 'staff-sam', startsAt, endsAt, data: { reason: 'training' } })
```

Planned time off usually belongs in your schedule (an override); blocks are for ad-hoc blocked time.

---

## Schedules and free times

**Your app owns the schedule.** Store it however you like — usually an app record. For the time maths,
the SDK ships a pure helper:

```ts
const schedule = {
  timezone: 'Europe/London',
  weekly: { mon: [{ start: '09:00', end: '12:30' }, { start: '13:30', end: '17:00' }], tue: [{ start: '09:00', end: '17:00' }] },
  overrides: [{ from: '2026-12-24', to: '2026-12-28', hours: [] }, { date: '2026-11-07', hours: [{ start: '10:00', end: '13:00' }] }],
}

const fb = await bookings.freebusy(collectionId, appId, { resources: ['record:staff-sam'], from, to }, true)
const times = utils.freeTimes({
  hours: schedule, busy: fb.resources[0].busy,
  from, to, duration: 30, step: 30, bufferAfter: 15, minNotice: 240,
})
// → [{ start, end }, …] in UTC; render in the booker's timezone
```

- Times are **local wall-clock** in `timezone`, so "9 to 5" stays 9 to 5 across daylight-saving changes.
- A missing day is closed; hours never cross midnight (split them); `end` may be `'24:00'`.
- `overrides` win over `weekly` (`hours: []` = closed).
- Also exported: `utils.withinSchedule`, `utils.openIntervals`, `utils.subtractIntervals`, `utils.validateSchedule`.

`freebusy` returns busy intervals only (bookings, blocks, slots that block a resource) — never who
booked. It's collection-wide: a resource is busy whichever app booked it.

---

## Who can book — per-app rules

Exactly like records, cases and threads:

- **Admin calls are unconditional** — Studio users, and **your app's own server functions** (they call
  the admin routes with your app's authority). Pass `admin = true`.
- **Public calls** (`admin = false`, the default for `create`) follow your app's config in
  `sites/{collectionId}/apps/{appId}` (`POST /admin/collection/:cId/apps/:appId`). With no config,
  **public booking is refused** — only admins (and your functions) can book.

Pick a mode per app:

| Mode | Config | Suits |
|---|---|---|
| **Public booking** | `publicCreate.bookings` allows anonymous and/or signed-in callers | "Book an appointment with me", simple events — no server code |
| **Admin-only booking** | no `publicCreate.bookings` | Extra validation, queues, payment-first, high demand: book through your server function |

### `publicCreate.bookings`

```json
{
  "publicCreate": {
    "bookings": {
      "anonymous": {
        "allow": true,
        "enforce": { "status": "held" },
        "limits": { "maxQuantity": 4, "holdMinutes": 15 },
        "rules": { "targets": ["slots"], "minNoticeMinutes": 60, "horizonDays": 90 },
        "edit": { "editToken": true }
      },
      "authenticated": {
        "allow": true,
        "enforce": { "status": "confirmed", "visibility": "owner" },
        "rules": {
          "targets": ["slots", "resources"],
          "schedule": true,
          "resourceTypes": ["record"],
          "durations": [30, 60],
          "minNoticeMinutes": 240,
          "bufferAfter": 15
        }
      }
    }
  }
}
```

| Field | Meaning |
|---|---|
| `enforce.status` | `confirmed` (instant), `pending` (business approves), `held` (pay / confirm next). Default `pending`. The caller can't override it. |
| `enforce.visibility` | Default: `owner` for signed-in, `admin` for anonymous |
| `limits.maxQuantity` | Max seats / claims per booking |
| `limits.holdMinutes` | Hold length for public `held` bookings (default 15, max 60) |
| `rules.targets` | `slots` (only your published slots) and/or `resources` (free-form time). Default `['slots']` |
| `rules.schedule` | **Required for `resources`.** The platform checks the requested time against the resource's schedule: an app record of **your app** with `recordType: 'availability'`, `parentType` / `parentId` = the resource, `data` in the standard shape above |
| `rules.resourceTypes` | Which resource types the public may book |
| `rules.durations` | Allowed lengths in minutes |
| `rules.minNoticeMinutes`, `rules.horizonDays` | How soon / how far ahead |
| `rules.bufferBefore`, `rules.bufferAfter` | Applied to every public booking (the caller can't set buffers) |
| `edit.editToken` | Anonymous only: the create response carries `editToken` **once** — store it so the guest can manage the booking. `edit.windowMinutes` limits how long it works |

Public callers can't set `contactId` (signed-in callers get their own contact; guests none), the
admin zone, buffers, `customId` or `sourceSystem`.

### `ownerActions.bookings` — what the booker may do afterwards

```json
{
  "ownerActions": {
    "bookings": {
      "cancel":  { "allow": true, "cutoffMinutes": 1440 },
      "move":    { "allow": true, "cutoffMinutes": 1440 },
      "confirm": { "allow": true }
    }
  }
}
```

Default: nothing. `cutoffMinutes` = not within that time of the start (`CUTOFF_PASSED`). `move`
re-checks the create rules for the new time. `confirm` turns the booker's own **held** booking into
`confirmed` — only for apps that take no payment; `pending` and `waitlisted` are the business's to
confirm.

```ts
// Signed-in booker
await bookings.cancel(collectionId, appId, bookingId)
const mine = await bookings.mine(collectionId, appId, { from: new Date() })

// Guest, with the token from create
const b = await bookings.get(collectionId, appId, bookingId, false, { editToken })
await bookings.move(collectionId, appId, bookingId, { slotId: other.id }, false, { editToken })
```

### `publicRead.bookings.freebusy`

`{ "publicRead": { "bookings": { "freebusy": true } } }` lets public pages call `bookings.freebusy`.
Off by default — most apps serve free times through their own function.

---

## Payments and high-demand sales

The platform takes no payments. It gives you what a payment or credits flow needs:

1. Create the booking **`held`** (claims the place; `holdMinutes`).
2. Take payment. Slow step? `bookings.extendHold(…, minutes)` (admin; capped at 24h from creation).
3. **Confirm after payment** — from your function or payment webhook handler. Confirm is idempotent, so
   a repeated webhook is harmless. A run-out hold fails with `HOLD_EXPIRED`.
4. If it's never confirmed, the hold expires within a minute: the booking becomes `cancelled`
   (`cancelReason: 'hold_expired'`) and the place goes back. Void the payment intent on the
   `booking.hold_expired` event.

Keep payment references, amounts, credits and refunds in the booking's `admin` / `owner` zones.

**High demand** (queues, lotteries, bot checks): turn public booking **off** so the only way in is
your server function; it checks the queue token / per-person limit / throttle, then creates a short
`held` booking. The platform guarantees nothing is oversold however many requests arrive.

---

## Errors

Booking calls fail with HTTP 409 and an `errorCode` you can show or act on:

| Code | When |
|---|---|
| `SLOT_FULL` | Not enough places left (`details.remaining`) |
| `SLOT_CLOSED` | The slot isn't open |
| `RESOURCE_TAKEN` | The time isn't free on that resource (`details` names it) |
| `PER_CONTACT_LIMIT` / `QUANTITY_LIMIT` | Per-person / per-booking limit |
| `HOLD_EXPIRED` | The hold ran out before confirm / move |
| `INVALID_STATE` | e.g. confirming a cancelled booking |
| `SLOT_OVERBOOKED` / `SLOT_HAS_BOOKINGS` | Lowering capacity below what's booked / changing a booked slot's time or deleting it |
| `TOO_SOON` / `TOO_FAR_AHEAD` / `IN_THE_PAST` / `DURATION_NOT_ALLOWED` | Public time rules |
| `OUTSIDE_SCHEDULE` / `NO_SCHEDULE` / `SCHEDULE_INVALID` | Public schedule check |
| `CUTOFF_PASSED` | Owner action inside its cutoff |

`403 FORBIDDEN` when the app's rules don't allow the call; `404` for unknown ids.

---

## Events

Recorded after each write commits, for flows and app functions (`trigger: { type: 'event', eventTypes: [...] }`):

`booking.created`, `booking.confirmed`, `booking.cancelled`, `booking.moved`, `booking.completed`,
`booking.no_show`, `booking.hold_expired`, `slot.full`, `slot.place_freed` (for waitlist promotion).
Context: `{ appId, status, slotIds }` (bookings) / `{ appId, remaining }` (slots).

Reminders before a booking (`booking.starts_in`) are coming; until then, use a cron function that lists
upcoming bookings.

---

## API reference

All take `(collectionId, appId, …)`; `admin` is the last parameter where both exist.

| Call | Admin | Public |
|---|---|---|
| `bookings.create(input, admin?)` | any status, any field | per `publicCreate.bookings` |
| `bookings.list(params?)` | ✓ | — (use `mine`) |
| `bookings.mine(params?)` | — | signed-in booker |
| `bookings.get(id, admin?, { editToken }?)` | ✓ | booker / token |
| `bookings.update(id, input)` | ✓ | — |
| `bookings.confirm / cancel / move(…, admin?, { editToken }?)` | ✓ | per `ownerActions.bookings` |
| `bookings.extendHold / complete / noShow` | ✓ | — |
| `bookings.freebusy(q, admin?)` | ✓ | if `publicRead.bookings.freebusy` |
| `bookings.slots.create / createMany / update / remove` | ✓ | — |
| `bookings.slots.list / get(…, admin?)` | ✓ | open, public slots |
| `bookings.blocks.create / list / remove` | ✓ | — |
| `utils.freeTimes / withinSchedule / openIntervals / subtractIntervals / validateSchedule` | pure helpers | |

REST: `/{admin|public}/collection/:cId/app/:appId/bookings[/slots|/blocks|/freebusy|/mine|/:id[/confirm|/cancel|/move|/extend-hold|/complete|/no-show]]`.
