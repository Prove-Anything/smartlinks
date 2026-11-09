# Entitlements: "can this person do this?" without a mirror of their member base

A brand with twenty million members wants a game only Gold members can play. SmartLinks never copies
the member base to find out. A **gate** says what it needs — a predicate such as `tier>=gold` — and the
platform asks the collection's configured **sources**, in order, stopping at the first that answers.
The brand's system stays the record of truth; every answer says where it came from (`basis`) and how
old it is (`asOf`).

| Source | Data kept here | When it fits |
|---|---|---|
| **claims** | none | the brand's SSO or app issues a short-lived signed token carrying the tier; the caller presents it |
| **lookup** | a hashed key → a small answer, for minutes | the loyalty connector's `lookup` step answers for one person; cached in Valkey under an HMAC of the identity for the TTL the brand sets (default 15 min; "not a member" 5 min); one in-flight lookup per key; the connector's own rate limit applies |
| **contact** | what the contact already holds | `customFields.loyalty` / `loyaltyTier` written by the connector's member webhook (`ctx.sl.members.apply`) |
| **fallback** | — | when nothing answered: `deny` (default), `allow`, or `degrade` (allow, flagged `degraded: true`) |

Every decision is one structured log line — gate, predicate, allowed, basis, age, an identity **hash**
— and never an identifier. A caller sees `attributes` (tier, points, status, member) and never a member
id.

## Predicates

```
'tier>=gold'   'tier=silver'   'tier in gold,platinum'   'points>=500'   'member'
{ tier: { gte: 'gold' } }   { tier: { in: ['gold', 'platinum'] } }   { member: true }
{ attribute: { path: 'status', eq: 'active' } }
{ all: [p1, p2] }   { any: [p1, p2] }   { not: p }
```

Tier comparisons use the collection's ordered `tiers` list (lowest first); a tier the list doesn't know
never satisfies an ordered comparison. A malformed predicate is a configuration error (`BAD_PREDICATE`),
never a silent denial.

## Where gates live

**An interaction type** — the public submit route checks it; the caller may present a claim:

```ts
await SL.interactions.updateInteraction(collectionId, appId, typeId, {
  permissions: { allowPublicSubmit: true, requires: { entitlement: 'tier>=gold', fallback: 'deny' } },
})
// A refused submit: 403 { error: 'FORBIDDEN', reason: 'entitlement_denied' }
// With a claim: body.entitlementToken = '<jwt>'  or header X-SmartLinks-Entitlement: <jwt>
```

**A server function** — for the signed-in caller by default:

```ts
const d = await ctx.sl.entitlements.check('tier>=gold')          // needs sl:entitlements:read
// → { allowed: true, basis: 'lookup-cache', asOf: '2026-11-08T09:00:00.000Z', attributes: { tier: 'gold', points: 1500, member: true } }
if (!d.allowed) return new Response(JSON.stringify({ error: 'gold_only' }), { status: 403 })
// Someone else, or a presented claim:
await ctx.sl.entitlements.check({ points: { gte: 500 } }, { identity: { email }, token, fallback: 'degrade' })
```

## Configuring a collection

The `entitlements` setting group (`settings.set(collectionId, 'entitlements', {...})`):

```jsonc
{
  "sources": ["claims", "lookup", "contact"],        // tried in this order
  "fallback": "deny",
  "tiers": ["bronze", "silver", "gold", "platinum"], // lowest first
  "claims": {
    "secretRef": "sec_brand_sso",                     // HS256 shared secret in the secret store …
    "publicKeyPem": "-----BEGIN PUBLIC KEY-----…",     // … or an RS256 / ES256 public key
    "issuer": "https://login.brand.example", "audience": "smartlinks",
    "tierClaim": "tier", "memberIdClaim": "sub", "attributesClaim": "entitlements", "maxAgeSec": 900
  },
  "lookup": {
    "connectorAppId": "acme-loyalty", "provider": "acme-loyalty",
    "ttlSec": 900, "negativeTtlSec": 300,
    "identity": "raw",                                // what the connector's lookup receives: 'raw' (email/phone) or 'hashed'
    "want": ["tier", "points", "status"]
  }
}
```

The connector side (`lookup`) is one step: one identity in, `{ found, memberId, tier, points, status,
asOf }` out; throw on an outage so the next source is tried — see
[connectors.md](connectors.md#loyalty-and-crm-connectors).

## What a brand can be told

- We never need a copy of your member base: claims and lookups hold nothing, or a minutes-old answer per
  active person.
- Where you want a local copy, it holds no identifiers (the HMAC mirror — on request).
- Your system remains the record of truth: every answer carries `asOf` and `basis`; TTLs are yours to set.
- You see every call: the connector's calls are rate-limited, logged, and leave from a fixed egress IP.
- Nothing leaves without a policy: the envelope's identity policy per flow.
