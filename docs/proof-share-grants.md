# Proof Share Grants

Delegated, scoped, **revocable** bearer access to a single proof — the middle tier
between "public" (everyone) and "owner" (only the signed-in owner).

A grant lets an owner hand out a link that lets specific recipients **see or do
specific things on one proof for a limited time**, without those recipients needing
a SmartLinks account or a proof claim. Typical uses: sharing a private photo album,
letting guests comment on it, or publishing a verifiable "I own this" assertion.

---

## Concepts

A **grant** is a row issued by the proof owner (or a collection admin) and redeemed
by a bearer holding an opaque token. Every data request that touches the proof
re-checks the grant **server-side** against the database, so revocation is immediate.

### Scopes — what a grant authorises

| Scope | Grants the bearer… |
|-------|--------------------|
| `read` | read owner-tier data on the proof (attestations, threads, records, cases) |
| `comment` | create threads/replies on the proof (guest comments) |
| `admin` | read owner-tier data (reserved for elevated share cases; never exposes the platform admin zone) |
| `verify_owner` | redeem a shareable ownership **assertion** (not the account) |

A grant can carry several scopes, e.g. `['read', 'comment']` for a shareable,
commentable album.

### Security & lifecycle

- The token is opaque, unguessable, and returned to the issuer **exactly once** (on `createGrant`). It is never returned by `listGrants`.
- **Revocation is immediate** — the grant is re-checked on every request, so `revokeGrant` invalidates a token across all clients at once.
- **Auto-invalidation on transfer** — every grant is voided the moment the proof's `ownerId` changes (e.g. a resale/re-claim), so a stale "I own this" link cannot keep resolving.
- A grant is scoped to **one proof**; it can never widen access to other proofs or collection-level data.

---

## Owner flow — create, list, revoke

```typescript
import { proof } from '@proveanything/smartlinks'

// Create a read+comment grant that expires in 7 days.
const grant = await proof.createGrant(collectionId, productId, proofId, {
  scope: ['read', 'comment'],
  audience: { kind: 'public_link' },
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
})

// `grant.token` is available ONLY here — embed it in your share link now.
const shareUrl = `https://app.example.com/album?proofId=${proofId}&shareToken=${grant.token}`

// List active + past grants (tokens are never included).
const grants = await proof.listGrants(collectionId, productId, proofId)

// Stop sharing — takes effect on the very next request from any client.
await proof.revokeGrant(collectionId, productId, proofId, grant.grantId)
```

`createGrant` / `listGrants` / `revokeGrant` require the caller to be the **proof
owner** (or a collection admin) — i.e. a signed-in user whose `bearerToken` is set.

---

## Recipient flow — redeem, then carry the token

A recipient opens the share link, redeems the token once, then sets it as the
active grant token. From then on **every** SDK request carries the token
(`X-Grant-Token`), so all proof reads/writes are evaluated against the grant.

```typescript
import { proof, setGrantToken } from '@proveanything/smartlinks'

const shareToken = new URLSearchParams(location.search).get('shareToken')!

// Redeem once (anonymous or signed-in). Records the redemption; optionally names the guest.
await proof.redeemGrant(collectionId, productId, proofId, shareToken, {
  guestName: 'Sam',            // stamped on guest activity when not signed in
})

// Attach the token to every subsequent request.
setGrantToken(shareToken)

// Now grant-tier reads succeed — e.g. owner-visibility memories on the proof:
const { attestations } = await attestation.publicList(collectionId, {
  subjectType: 'proof', subjectId: proofId,
})

// Clear it when leaving the shared view:
setGrantToken(undefined)
```

> **Persisting across reloads.** `setGrantToken` holds the token in memory. To keep a
> shared session across reloads, persist `shareToken` yourself (e.g. in `localStorage`)
> and call `setGrantToken` again on load.

---

## Guest commenting

With a `comment` scope grant, a bearer can post comments even when they are not
signed in. The app must enable the **grant branch** of the thread create policy
(see [App config](#app-config)); comments are then created at `visibility: 'owner'`
(private to the proof) and stamped `authorType: 'guest'`.

```typescript
import { app } from '@proveanything/smartlinks'
// setGrantToken(shareToken) has already been called.

// One atomic call — no separate create-then-reply round trip.
await app.threads.create(collectionId, 'photo-memory', {
  parentType: 'memory',
  parentId: memoryId,          // text — SmartLinks short ids are fine (not just UUIDs)
  proofId,                     // anchor to the proof so grant readers see it
  firstReply: { text: 'Lovely photo', authorName: 'Sam' },
})
```

Other grant holders (and the owner) see these comments because a `read` grant reveals
`owner`-visibility threads for the proof. See
[App Objects → Threads](app-objects.md#threads) for the full threads API.

---

## Proof of ownership — `verify_owner`

Ownership itself is **not** a grant — it is `proof.ownerId`, established via the
existing [claim flow](proof-claiming-methods.md). A `verify_owner` grant only
publishes a shareable, verifiable **assertion** derived from that ownership, without
handing over the account:

```typescript
const grant = await proof.createGrant(collectionId, productId, proofId, {
  scope: ['verify_owner'],
})

// The recipient redeems it and gets the assertion — never the account:
const result = await proof.redeemGrant(collectionId, productId, proofId, grant.token)
// { proofId, assertsOwnership: true, ownerDisplayName?, issuedAt, expiresAt }
```

Because grants auto-invalidate on transfer, a resale cannot leave a stale
"I own this" link in circulation.

---

## What a grant gates

When a valid grant token is present, these public reads elevate to owner-tier for the
granted proof (and only that proof):

- **Attestations** — `attestation.publicList({ subjectType: 'proof', subjectId })`
- **Threads / Records / Cases** — `app.threads.list`, `app.records.*`, `app.cases.list`, and the single-item GETs, filtered to the granted proof
- **Thread creation / replies** — with a `comment` scope grant (see below)

The token never exposes the platform `admin` zone, and only reveals `owner`-visibility
rows for the granted `proofId`.

---

## App config

Grant-based commenting is opt-in per app, configured on the app's Firestore config
at `sites/{collectionId}/apps/{appId}` — a `grant` branch alongside
`anonymous` / `authenticated`:

```jsonc
{
  "publicCreate": {
    "threads": {
      "grant": {
        "allow": true,
        "requireScope": "comment",
        "enforce": { "visibility": "owner", "status": "open" }
      }
    }
  }
}
```

This enables grant-scoped commenting **without** opening up anonymous creation. The
`enforce.visibility: "owner"` keeps comments private to the proof (visible to the
owner and other grant holders, not the wider public).

---

## API reference

```typescript
namespace proof {
  createGrant(collectionId, productId, proofId, options: CreateGrantOptions): Promise<ProofGrant>
  listGrants(collectionId, productId, proofId): Promise<ProofGrant[]>
  revokeGrant(collectionId, productId, proofId, grantId): Promise<void>
  redeemGrant(collectionId, productId, proofId, token, options?: RedeemGrantOptions): Promise<RedeemGrantResult>
}

// Attach / clear the active grant token (sent as X-Grant-Token on every request).
function setGrantToken(token: string | undefined): void
function getGrantToken(): string | undefined

type GrantScope = 'read' | 'comment' | 'admin' | 'verify_owner'

interface CreateGrantOptions {
  scope: GrantScope[]                                   // at least one
  audience?: { kind: 'public_link' } | { kind: 'named'; email?: string; userId?: string }
  expiresAt?: Date | string
}

interface RedeemGrantOptions { guestName?: string }

type RedeemGrantResult =
  | { scope: GrantScope[]; redeemedAt: string }
  | { proofId: string; assertsOwnership: true; ownerDisplayName?: string; issuedAt?: string; expiresAt?: string }

interface ProofGrant {
  grantId: string
  proofId: string
  productId?: string | null
  scope: GrantScope[]
  audience: { kind: 'public_link' | 'named'; email?: string; userId?: string }
  createdBy: string
  expiresAt?: string | null
  revokedAt?: string | null
  redeemedBy?: { userId?: string; guestName?: string; redeemedAt: string }
  redeemCount: number
  createdAt: string
  updatedAt: string
  token?: string   // present ONLY on the createGrant response
}
```
