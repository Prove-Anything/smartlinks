# Comms Triggers

The standard way to send a **transactional message** as a side-effect of a proof
action — a claim confirmation, a "you've received a transfer" email, a
cancellation notice. You pass a **comms trigger** into the action; the server
sends it once the action's write is durable.

This replaces the old fixed SendGrid proof emails (`createProof` / `transferProof`).
Instead of a hardcoded template baked into the backend, **you author the template**
(in the template editor) and **name it per action**. The copy, branding, channel,
and merge fields are yours.

---

## The shape

An action takes a `comms` object: a **role → `CommsTrigger`** map.

```ts
interface CommsTrigger {
  templateId: string        // the template to render + send (you author it)
  channel?: 'preferred' | 'email' | 'sms' | 'push' | 'wallet' | 'whatsapp'
  props?: Record<string, any>   // merge data: a note, a message, custom fields
  notify?: boolean          // false → do the action, send nothing for this role
  appId?: string            // your app id, recorded in comms history
}

// role → trigger
type CommsTriggerMap = Record<string, CommsTrigger>
```

Each action documents the **roles** it exposes (who can be messaged). You supply a
trigger only for the roles you want to notify.

---

## What you control vs what the server owns

You name a template and supply soft data. The server owns everything that decides
**who** receives it and **what context** the template can see. A caller can never
redirect a message to a contact of its choosing.

| You supply (per role) | The server injects |
|---|---|
| `templateId` | which contact the role resolves to (recipient / sender / claimer / owner) |
| `props` (note, message, custom) | `{{ proof }}`, `{{ product }}`, `{{ contact }}` hydration |
| `channel`, `notify`, `appId` | the proof/product ids, the portal URL (`{{ proofUrl }}`) |

Templates are rendered with **Liquid**, so a template body can read
`{{ proof.values.owner.name }}`, `{{ product.title }}`, `{{ contact.firstName }}`,
`{{ proofUrl }}`, and any `props` you passed (`{{ note }}`). See
[Liquid Templates](./liquid-templates.md) and [Comms](./comms.md) for the template
model and channel resolution.

> This is a **1:1 transactional** send. It goes straight through the transactional
> comms path — it does **not** touch the interactions → segments → broadcasts
> (marketing/audience) pipeline. Recording a CRM interaction or awarding loyalty is
> a separate, independent concern; don't route those through the comms trigger.

---

## Roles by action

| Action | Roles | Fired when |
|--------|-------|-----------|
| `claim` / `claimProduct` | `claimer` | after the proof is committed to the ledger |
| `transfer` (directed) | `recipient`, `sender` | on initiation |
| `transfer` (`release: true`) | `owner` | on initiation |
| `acceptTransfer` | `recipient` (new owner), `sender` (previous owner) | after the ownership move completes |
| `cancelTransfer` | `owner` (canceller), `recipient` (earmarked, directed only) | after the transfer is cancelled |

Timing is deliberate: comms fire **only after the durable write** (the ledger
commit for a claim, the ownership move for an accept). A failed action sends
nothing; a comms failure never breaks the action (best-effort).

---

## Examples

Directed transfer — notify the buyer, confirm to the seller:

```ts
await proof.transfer(collectionId, productId, proofId, {
  toEmail: 'buyer@example.com',
  comms: {
    recipient: { templateId: 'transfer-incoming', props: { note: 'Enjoy the watch!' } },
    sender:    { templateId: 'transfer-sent' },
  },
})
```

Claim — confirm to the claimer:

```ts
await proof.claim(collectionId, productId, proofId, {
  data: { purchaseStore: 'Regent St' },
  comms: {
    claimer: { templateId: 'welcome-owner', channel: 'preferred' },
  },
})
```

Accept — completion confirmation to both parties:

```ts
await proof.acceptTransfer(collectionId, productId, proofId, {
  comms: {
    recipient: { templateId: 'transfer-complete-owner' },
    sender:    { templateId: 'transfer-complete-previous' },
  },
})
```

Suppress comms for one role while still messaging another:

```ts
comms: {
  recipient: { templateId: 'transfer-incoming' },
  sender:    { notify: false },   // do the transfer, don't email the seller
}
```

Omit `comms` entirely and nothing is sent — comms are **opt-in**.

---

## Notes

- **Email-only recipients work.** A directed transfer to a `toEmail` that isn't a
  contact yet resolves/creates a contact before sending.
- **Consent + suppression apply.** Transactional sends still respect the contact's
  channel consent and suppression list; a template's `topic` governs this.
- **Delivery is logged** to comms history (with your `appId` and a `ref`), so sends
  are auditable per contact.

See also [Proof Ownership Transfer](./proof-ownership-transfer.md),
[Proof Claiming Methods](./proof-claiming-methods.md), and [Comms](./comms.md).
