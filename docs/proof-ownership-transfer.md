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
| **Directed** | Owner names a recipient (`toEmail` / `toUserId`). The proof is earmarked for them (`claimUserId`); you notify them with a comms trigger. | The named recipient calls `acceptTransfer`. |
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

// Directed — hand it to a named buyer (they must accept). Notify each party with a
// comms trigger naming a template you authored (see Comms Triggers below).
const { transfer } = await proof.transfer(collectionId, productId, proofId, {
  toEmail: 'buyer@example.com',
  comms: {
    recipient: { templateId: 'transfer-incoming', props: { note: 'Enjoy the watch!' } },
    sender:    { templateId: 'transfer-sent' },
  },
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
// Only the named recipient can accept — a third party is rejected. Optionally
// send completion comms to both parties.
const { proof: mine } = await proof.acceptTransfer(collectionId, productId, proofId, {
  comms: {
    recipient: { templateId: 'transfer-complete-owner' },     // the new owner
    sender:    { templateId: 'transfer-complete-previous' },  // the previous owner
  },
})
```

The recipient sees the pending transfer on their account (a pending claim) and via
the notification you sent. Until they accept, the proof still belongs to the seller.

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

## Comms

Every transfer action takes an optional `comms` map (role → comms trigger) that
sends a transactional message once the action's write is durable. Roles:

| Action | Roles |
|--------|-------|
| `transfer` (directed) | `recipient`, `sender` |
| `transfer` (`release: true`) | `owner` |
| `acceptTransfer` | `recipient` (new owner), `sender` (previous owner) |
| `cancelTransfer` | `owner`, `recipient` (directed only) |

You author each template; the server owns who each role resolves to and hydrates
`{{ proof }}` / `{{ product }}` / `{{ contact }}` / `{{ proofUrl }}`. Pass
`notify: false` on a role (or omit `comms`) to send nothing. Full detail:
[Comms Triggers](./proof-comms-triggers.md).

## API

| Method | Endpoint |
|--------|----------|
| `proof.transfer(c, p, id, opts)` | `POST …/proof/:id/transfer` |
| `proof.acceptTransfer(c, p, id, opts?)` | `POST …/proof/:id/transfer/accept` |
| `proof.cancelTransfer(c, p, id, opts?)` | `POST …/proof/:id/transfer/cancel` |
| `proof.getTransfer(c, p, id)` | `GET …/proof/:id/transfer` |

`opts` on transfer/accept/cancel carries the `comms` map (and `notify`).

See also [Comms Triggers](./proof-comms-triggers.md),
[Proof Share Grants](./proof-share-grants.md) and
[Proof Claiming Methods](./proof-claiming-methods.md).
