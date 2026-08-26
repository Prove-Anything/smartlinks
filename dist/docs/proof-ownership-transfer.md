# Proof Ownership Transfer

Every proof has exactly **one owner** (`proof.userId`). A *transfer* moves that
owner from A to B — for a resale, a gift, or handing an item on. Ownership carries
the owner-scoped data with it and voids the previous owner's private access.

This covers **push (owner-initiated) transfers** — the current owner consents to the
move. Contested pull-claims and dispute resolution (where a holder claims ownership
the owner never released) are a later addition; the state machine below already
reserves states for them.

---

## Two ways to push

| Mode | How | Who completes it |
|------|-----|------------------|
| **Directed** | Owner names a recipient (`toEmail` / `toUserId`). The proof is earmarked for them (`claimUserId`) and they're emailed a link. | The named recipient calls `acceptTransfer`. |
| **Open release** | Owner marks the proof `claimable`. | Anyone claims it via the normal claim flow. |

Only the current owner (or a collection admin) can start a transfer. A proof can
have **one active transfer at a time**.

### What completion does

When a directed transfer is accepted (or an admin resolves one), the move is
authoritative and atomic:

- `proof.userId` becomes the new owner; `claimable` is cleared.
- The **previous owner's private zones are removed** — `values.owner`,
  `values.personal[oldOwner]`, and their `roles` entry.
- Every **share grant auto-voids** (grants are bound to the owner at issue), so
  stale "I own this" links stop resolving.
- An append-only **`ownership_transfer` attestation** records `from → to`, so the
  chain of custody is verifiable.

---

## Owner flow

```ts
import { proof } from '@proveanything/smartlinks'

// Directed — hand it to a named buyer (they must accept)
const { transfer } = await proof.transfer(collectionId, productId, proofId, {
  toEmail: 'buyer@example.com',
  message: 'Enjoy the watch!',
})

// …or an open release — anyone can now claim it
await proof.transfer(collectionId, productId, proofId, { release: true })

// Check status at any time
const { transfer: active } = await proof.getTransfer(collectionId, productId, proofId)

// Change your mind before it's accepted
await proof.cancelTransfer(collectionId, productId, proofId)
```

## Recipient flow (directed)

```ts
// Only the named recipient can accept — a third party is rejected.
const { proof: mine } = await proof.acceptTransfer(collectionId, productId, proofId)
```

The recipient sees the pending transfer on their account (a pending claim) and via
the email link. Until they accept, the proof still belongs to the seller.

---

## State machine

```
              transfer({toEmail})                accept
 (owned) ────────────────────────▶ pending ─────────────▶ completed
    │                                 │
    │        transfer({release})      │  cancel
    └────────────────────────────────▶├─────────────────▶ cancelled
                                       │
                                       │  (later: dispute / escalation)
                                       └─────────▶ disputed / escalated / rejected
```

- `pending` — a transfer is in flight (directed earmark or open release).
- `completed` — ownership moved.
- `cancelled` — the owner withdrew it before acceptance.
- `expired` / `disputed` / `escalated` / `rejected` — reserved for contested
  claims + dispute resolution (later).

---

## Security notes

- **Directed accept is access-controlled.** Only the earmarked recipient
  (`transfer.toUserId`) can accept; the claim endpoint also rejects anyone whose
  id ≠ `claimUserId` while a directed transfer is pending. A directed transfer
  can't be grabbed by a bystander.
- **Ownership only moves one way** — through completion. There is no path that
  silently strips an active owner without their consent (contested claims, when
  added, are dispute-protected and never auto-transfer by default).
- **Every state change is audited** as an append-only attestation on the proof.

## API

| Method | Endpoint |
|--------|----------|
| `proof.transfer(c, p, id, opts)` | `POST …/proof/:id/transfer` |
| `proof.acceptTransfer(c, p, id)` | `POST …/proof/:id/transfer/accept` |
| `proof.cancelTransfer(c, p, id)` | `POST …/proof/:id/transfer/cancel` |
| `proof.getTransfer(c, p, id)` | `GET …/proof/:id/transfer` |

See also [Proof Share Grants](./proof-share-grants.md) and
[Proof Claiming Methods](./proof-claiming-methods.md).
