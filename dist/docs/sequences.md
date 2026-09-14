# Sequences & claim-order allocation

> **Preview — SmartLinks SDK 2.0.0-alpha.** APIs may change before 2.0.0 stable.

A **sequence** hands out a guaranteed-unique, monotonic number — `1, 2, 3, …` — and stamps it
onto a record. It's the primitive behind raffle tickets, "you're the Nth to claim", queue
positions, and limited-edition numbering: cases where you need *the next number*, exactly
once per subject, even with a whole room (or stadium) acting at the same instant.

## The model: allocate, then stamp — and the target is the ledger

Two steps, one call:

1. **Allocate** — get the next number from an **atomic counter**. The counter lives inside
   your **app-config** doc at `data.sequences.<key>`, so it's scoped exactly like your other
   app config (per collection / product / variant / batch) and needs no dedicated storage.
   It's incremented in a single statement, so 250 simultaneous taps each get a distinct
   number in microseconds — never two the same.
2. **Stamp** — write that number onto the **subject's own record** (a claim set, a proof, or
   an app record). **That record is the ledger** — there's no separate bookkeeping table.
   Next time you read the subject, the number is just there.

Because the target is the ledger, allocation is **idempotent**: on a re-tap we read the
subject first and return the number it already has, rather than allocating a second one.

## Guarantees

- **Unique + monotonic** — the counter is an atomic increment, never a read-modify-write, so
  there are no duplicates and no lost updates under load.
- **Idempotent per subject** — one number per subject; a re-tap returns the same number.
- **Concurrency-safe at scale** — the only shared hot spot is the one counter row (Postgres
  serializes it); the stamp is per-subject (its own record), so the model holds from 250 in a
  room to 60,000 in a stadium. A concurrent double-tap on the *same* subject at worst skips
  one number (a harmless gap) — never puts two numbers on one person.

## Scoping

- **Counter scope** — the app-config doc it lives on: collection-wide, or per product /
  variant / batch. All wristbands mapped to one product? Scope the counter to that product.
- **`key`** — a name within that doc (e.g. `raffle:2026-cup`), so one config doc can hold
  several independent sequences.
- **`start`** — the first number (default `1`); use it to reserve a block (start at `51` and
  tell people it's `1`, or just filter `< N` at draw time).

## Idempotency subject — use a *stable* id

The number is deduped by the **subject id** you pass, so it must be the **stable** identity:
- **Claim set id** (the wristband's permanent record) — the right key when people aren't
  logged in. A re-tap resolves to the same claim set → same number.
- The authenticated **user/contact** — if they sign in / claim.

Do **not** key on a value that changes per interaction (e.g. a virtual proof id minted fresh
on each tap) — that would let one person take several numbers.

## Where the number is stored (the sink)

The stamp target is configurable — the number lives wherever you'll read it:

| Target | Use |
|---|---|
| `claimSet` | The Firestore wristband record — fast, no proof mint on the hot path. |
| `proof` | A minted proof (value or attestation) — when the number should travel with the proof. |
| `appRecord` | A structured app record — for queryable, per-app data. |

## Worked example — a free raffle on NFC wristbands

Everyone taps a wristband and hits **Enter the raffle**. Each tap allocates the next number
and writes it onto that wristband's claim set — fast, unique, no proof mint:

```jsonc
// allocate-and-stamp (conceptual shape)
{
  "appId":     "raffle-app",
  "productId": "wristbands-2026",     // the counter's scope
  "key":       "raffle:2026-cup",     // the named sequence
  "start":     1,
  "subjectId": "<claim set id>",      // STABLE identity — re-taps collapse to one number
  "target":    "claimSet",
  "field":     "raffleNumber"
}
// → { "number": 42, "isNew": true }   (re-tap → { "number": 42, "isNew": false })
```

Drawing the winner needs no separate ledger either — query the claim sets (or proofs) where
`raffleNumber` is set; that field is your entry list, in allocation order.

## Status

The allocator + stamping run server-side today. The **public "enter" action** an app widget
calls on tap (and its SDK wrapper) is being wired in the 2.0.0-alpha line — this doc is the
contract it will expose.
