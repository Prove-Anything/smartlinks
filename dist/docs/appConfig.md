# `appConfig` — collection settings contract

**Settings group:** `appConfig` (a.k.a. `settings/appConfig`, app id `appConfig`)
**Owner:** platform (`entitlements-reconcile` edge function is the sole authority for the `system` block)
**Written by:** wizard signup, admin tools, module installer, add-on toggles, `entitlements-reconcile`
**Read by:** every microapp that needs to know "what is installed / entitled / metered" for a collection

This document is the source of truth for the shape and semantics of the
`appConfig` settings document, and for the SDK helpers microapps should use
to read it — in particular `appConfiguration.isFeatureEnabled()`, the
standard way for a subapp to check whether a feature flag is on for a
collection.

---

## 0. TypeScript definition

The SDK exports this as `AppConfigSettings` (see `src/types/appConfiguration.ts`).
The document also carries a `systemPrivate` block (admin-only overrides and
internal metadata) that's stripped by the API for non-admin callers — see §5.
Its shape is intentionally not part of this SDK's public type surface, so it
doesn't appear below; treat it as opaque and never rely on it from client code.

```ts
/** Full appConfig settings document for a SmartLinks collection. */
export interface AppConfigSettings {
  id: 'appConfig';

  // ── USER-OWNED (client may PATCH freely) ──────────────────────────
  /** Installed modules — the customer's chosen surface. */
  apps: AppEntry[];
  /** Optional mirror of add-on keys the customer has toggled. */
  addOns?: string[];
  /** Wizard hint — which base plan the customer picked pre-checkout. */
  requestedBasePlanId?: string;

  /** How the account handles individual physical items. */
  itemRecordMode?: 'registered' | 'owned' | null;
  virtualItemsEnabled?: boolean;

  // ── SYSTEM-OWNED, PUBLIC (reconcile writes; client read-only) ─────
  /** Resolved entitlement truth. Read this to gate features. */
  system?: SystemBlock;

  // Also carries a `systemPrivate` block, stripped for non-admin reads.
  // Not part of the public SDK contract — see §5.
}

/** One installed module instance on this collection. */
export interface AppEntry {
  id: string;                     // instance id (typically === uniqueName)
  uniqueName: string;             // module id from the module catalog
  customName?: string;            // display name, overrideable
  active: boolean;                // user toggle
  all?: boolean;                  // legacy scope flag
  live?: boolean;                 // legacy flag
  faIcon?: string;                // optional FA icon override
  versionChannel?: 'stable' | 'beta' | 'dev';
  /** Set by reconcile when app category is not in entitledAppGroups. */
  reason?: 'not_entitled';
  [k: string]: unknown;           // per-module inline settings preserved
}

/** Resolved entitlements — safe for every client to read. */
export interface SystemBlock {
  basePlanId?: string;
  addOnKeys?: string[];
  apps?: string[];                       // apps unlocked by add-ons
  features?: Record<string, boolean>;    // explicit overrides only — see §4.4 for absent-key resolution
  meters?: Record<string, MeterEntry>;
  entitledAppGroups?: string[];          // lowercased category names
  /** 'enterprise' flips every feature flag's default to on unless explicitly false — see §4.4/§4.7. */
  accountType?: 'enterprise' | 'standard';
  syncedAt?: string;                     // ISO-8601 UTC
  syncedFromSubscriptionId?: string;
  /** Diagnostic: which override keys reconcile applied on this pass. */
  appliedOverrides?: AppliedOverridesSummary;
}

export interface MeterEntry {
  included: number;
  stripePriceId?: string;
  stripeMeterId?: string;
}

export interface AppliedOverridesSummary {
  features?: string[];
  meters?: string[];
  entitledAppGroups?: string[];
  addOnKeys?: string[];
  apps?: string[];
  accountType?: boolean;
  note?: string;
}
```

`systemPrivate`'s shape is deliberately omitted here — see §5.

---

## 1. Where it lives

Per SmartLinks collection, in the `appConfig` settings group — but for
public (non-admin) reads, **don't call the settings-group endpoint
directly.** As of 2026-07-18, `/public/collection/:id/app/config`
(`collection.getAppsConfig()`) returns the same entitlements data merged
into its response alongside the app catalog, so one call gets both:

```ts
import * as SL from '@proveanything/smartlinks';

// Recommended — one request, cached (see §6.0)
const cfg = await SL.appConfiguration.getAppConfig(collectionId);
console.log(cfg.apps);            // app catalog (AppConfig[]) — see §3.1
console.log(cfg.system?.features); // entitlements — see §4

// Equivalent low-level call — getAppConfig() is a thin, cached wrapper over this
const cfgRaw = await SL.collection.getAppsConfig(collectionId);
```

`systemPrivate` (§5) is **never** returned by this endpoint — it's public-only.
If you need it (admin surfaces), call the settings-group endpoint directly:

```ts
const cfgAdmin = await SL.appConfiguration.getConfig({
  collectionId,
  appId: 'appConfig',            // group id
  admin: true,                   // required for systemPrivate
});
```

- Admin writes to `system` / `systemPrivate` MUST go through
  `entitlements-reconcile` (never patch them directly from the client).
- The settings-group endpoint's own `apps` field is shaped differently from
  the combined endpoint's — see §3.1 before assuming they're interchangeable.

## 2. Access tiers

Three tiers, symmetric in-gate / out-gate rules:

| Block            | Client read | Client write | Admin read | Admin write path       |
| ---------------- | ----------- | ------------ | ---------- | ---------------------- |
| user-owned root  | yes         | yes          | yes        | client SDK             |
| `system`         | yes         | no           | yes        | `entitlements-reconcile` only |
| `systemPrivate`  | **stripped** | no           | yes        | `plan-migration` `write_app_config` (super-admin) |

The strip happens at the settings API layer — `systemPrivate` genuinely
does not leave the server for non-admin callers. This convention
generalises to every settings group, not just `appConfig`.

## 3. `apps[]` — installed modules

See `AppEntry` in §0. Notes:

- `id` and `uniqueName` are historically distinct but currently
  identical for new installs. Consumers should key off `uniqueName`.
- `customName` is seeded from the module definition's `name`.
- `active: false` + `reason: "not_entitled"` means reconcile flagged
  this app as outside the current plan's `entitledAppGroups`. UI should
  show it as disabled with an upgrade prompt; do not delete it.
- Unknown extra keys are preserved by reconcile — safe to add per-module
  settings inline.

### 3.1 Two different `apps[]` shapes — don't conflate them

This settings document's own `apps` field is `AppEntry[]` — installed
*instances* (`uniqueName`, `customName`, `active`, `reason`).

`collection.getAppsConfig()` / `appConfiguration.getAppConfig()` (§1, §6.0)
return a **different** `apps` field: `AppConfig[]`, the module *catalog*
definitions (`srcAppId`, `category`, `usage`, iframe/manifest URLs — see
`src/types/collection.ts`), used for resolving which bundle to load. The
entitlements fields (`system`, `addOns`, `itemRecordMode`, etc.) got merged
onto that response; the `AppEntry[]` shape did not replace it.

If you need the installed-instance list (`active`/`reason` per app), fetch
the settings group directly (§1); if you need the catalog + entitlements
together, use `appConfiguration.getAppConfig()`.

## 4. `system` — reconciled truth

Written only by `entitlements-reconcile`. Represents the union of:

- the customer's base plan (`grantsFeatures`, `grantsAppGroups`)
- every add-on line item on their Stripe subscription
- `systemPrivate.overrides` (applied last, always wins)

### 4.1 `basePlanId`

String id of the tier. Sourced from Stripe subscription metadata
(`basePlanId` or legacy `planId`). Examples: `simple_redirect`,
`rich_redirect`, `inform`, `enrich`, `engage`, `hub_inform`,
`hub_enrich`, `hub_engage`.

### 4.2 `addOnKeys[]`

Sorted array of every add-on key currently on the subscription. Matches
`platform-addons` catalog `key` field.

```ts
const hasCustomDomain = cfg.system.addOnKeys.includes('addon_custom_domain');
```

### 4.3 `apps[]` (system-side)

Sorted array of app ids granted by add-ons whose `category === 'apps'`.
Entitlement view — not the same as the top-level installed `apps[]`.
Prefer `entitledAppGroups` for gating.

### 4.4 `features`

Flat map of feature flag → explicit `true`/`false` override.

**A missing key is not "off" — it means "use the accountType default."**
Resolution rule (see `resolveFeature()` / `isFeatureEnabled()`, §6.0):

| `features[flag]` | `accountType: 'enterprise'` | `accountType: 'standard'` / missing |
| ----------------- | ---------------------------- | -------------------------------------- |
| `true` (explicit)  | on                            | on                                      |
| `false` (explicit) | **off**                       | off                                     |
| absent             | **on** (enterprise default)    | off (standard default)                 |

This is why reading `cfg.system.features.custom_domain` directly is wrong
for enterprise accounts — an absent key there does NOT mean disabled:

```ts
// ❌ WRONG for enterprise accounts — absent key silently reads as "off"
if (cfg.system.features.custom_domain) enableCustomDomainUI();

// ✅ CORRECT — applies the enterprise default
if (await appConfiguration.isFeatureEnabled(collectionId, 'custom_domain')) {
  enableCustomDomainUI();
}
```

Feature flag naming: bare snake_case, no `feature_` prefix.

Always resolve flags through `appConfiguration.isFeatureEnabled(collectionId, flag)`
/ `isFeatureEnabledSync()` (§6.0), or `appConfiguration.resolveFeature(cfg.system, flag)`
if you already have a `system` block from elsewhere — never read
`cfg.system.features[flag]` directly.

### 4.5 `meters`

Map keyed by add-on key. Apps reporting usage should call the
metered-usage endpoint using `stripeMeterId` (see
`platform-metered-usage-endpoint.md`).

### 4.6 `entitledAppGroups[]`

Sorted, lowercased category names the customer's plan unlocks. Match
against a module's `category` (see `src/config/app-categories.ts`):

```
"authenticity" | "documentation" | "digital-product-passports" |
"commerce" | "engagement" | "ai" | "integration" | "other"
```

**Empty array = permissive.** Reconcile treats an empty array as "no
gating configured yet" and does not flag any apps.

### 4.7 `accountType`

Explicit account tier. `"enterprise"` flips the default for **every**
feature flag to on — not just a curated "everything on" baseline — so an
app that has never heard of a given flag still reads it as enabled for an
enterprise account. See §4.4 for the exact resolution rule. Sourced
from `systemPrivate.overrides.accountType` and copied here by reconcile
so the client never has to peek at private data. Missing = standard
(every flag defaults off unless explicitly `true`).

### 4.8 `syncedAt` / `syncedFromSubscriptionId`

Diagnostic. `syncedAt` is ISO-8601 UTC. `syncedFromSubscriptionId`
absent means "no subscription on file, defaults applied".

### 4.9 `appliedOverrides`

Diagnostic — records which keys came from `systemPrivate.overrides`
this reconcile pass, so admins can see comp-driven flips vs
Stripe-derived truth without opening the private block.

## 5. `systemPrivate` — admin-only overrides & metadata

Super-admin-owned block for enterprise / custom deals and internal
metadata, applied by `entitlements-reconcile` after Stripe derivation
(§4) so it always wins. Its shape is intentionally **not documented
here or in the SDK types** — it's internal to the platform, not part of
the public `appConfig` contract.

- Stripped from every non-admin response at the API boundary (§2).
- Edited only via the `plan-migration` action `write_app_config` (admin) —
  the account detail page has a dedicated editor card.
- Client apps should NEVER attempt to read or depend on `systemPrivate`;
  the SDK's public types don't expose it, and the API strips it anyway.
- What it feeds into `system` (which client apps DO read) is documented
  where it lands: `system.accountType` (§4.7) and `system.appliedOverrides`
  (§4.9).

## 6. Consumer patterns

### 6.0 Feature gate — recommended: `isFeatureEnabled()`

This is the standard way for a subapp to check whether a feature is on for
a collection. It fetches (and caches) the whole `appConfig` document the
first time it's called for a collection, then reads through that cache on
every subsequent call — so calling it once per component, or once per
render, doesn't cause repeat network requests.

```ts
if (await SL.appConfiguration.isFeatureEnabled(collectionId, 'custom_domain')) {
  enableCustomDomainUI();
}
```

It's always `async` — the very first call for a collection has nothing
cached yet, so there's no way to answer without an `await`. If you need a
synchronous read (e.g. inside a render function that can't await), warm the
cache once during app init and use the sync variant afterwards:

```ts
// Once, e.g. in a top-level effect or before first render:
useEffect(() => {
  SL.appConfiguration.isFeatureEnabled(collectionId, 'custom_domain')
}, [collectionId]);

// Anywhere else, read synchronously — no await:
const enabled = SL.appConfiguration.isFeatureEnabledSync(collectionId, 'custom_domain');
if (enabled === undefined) {
  // not warmed yet this page load — treat as "not yet known", not "off"
}
```

`isFeatureEnabledSync` returns `boolean | undefined`: `undefined` means the
cache hasn't been warmed yet for this collection, not that the flag is off.
Don't treat `undefined` as `false`.

The cache TTL is 5 minutes (in-memory + sessionStorage, cleared on full
page reload). Pass `{ force: true }` to `getAppConfig` / `isFeatureEnabled`
to bypass it — e.g. immediately after your own code calls
`entitlements-reconcile` and the flags may have changed:

```ts
await SL.appConfiguration.isFeatureEnabled(collectionId, 'custom_domain', { force: true });
```

### 6.1 Reading the raw config

If you need more than one flag, or other parts of the document, fetch the
whole thing once and resolve multiple flags off it with `resolveFeature()`
— still cached, still one network request. **Do not** read
`cfg.system.features[flag]` directly (`Boolean(...)`/truthiness checks); an
absent key means "use the accountType default" (§4.4), not "off":

```ts
const cfg = await SL.appConfiguration.getAppConfig(collectionId);
const enabled = SL.appConfiguration.resolveFeature(cfg?.system, flag);
```

### 6.2 App entitlement gate

```ts
const cfg = await SL.appConfiguration.getAppConfig(collectionId);
const groups = new Set(cfg?.system?.entitledAppGroups ?? []);
const canInstall = groups.size === 0 || groups.has(myModuleCategory.toLowerCase());
```

### 6.3 Enterprise detection

```ts
const cfg = await SL.appConfiguration.getAppConfig(collectionId);
const isEnterprise = cfg?.system?.accountType === 'enterprise';
```

### 6.4 Meter lookup

```ts
const cfg = await SL.appConfiguration.getAppConfig(collectionId);
const meter = cfg?.system?.meters?.[addOnKey];
if (meter) reportUsage(meter.stripeMeterId, quantity);
```

### 6.5 Reacting to changes

`appConfig` is not push-based today — read it on load and after any
subscription mutation you initiate. Client code that changes
entitlements MUST call `entitlements-reconcile` afterwards, then re-read
with `{ force: true }` (§6.0) rather than trusting the cache or merging
with a stale local copy.

## 7. Write paths

| Actor                       | Endpoint                                                                     | Writes                    |
| --------------------------- | ---------------------------------------------------------------------------- | ------------------------- |
| Wizard signup               | `stripe-wizard-webhook` → `entitlements-reconcile`                           | full doc                  |
| Add-on toggle (client)      | `entitlements-reconcile` (`changes[]`)                                       | full doc                  |
| Module install / uninstall  | client `setConfig` on `apps[]`, then `entitlements-reconcile` (no changes)   | `apps[]` + `system`       |
| Admin migration             | `plan-migration` action `apply`                                              | full doc                  |
| Admin manual edit           | `plan-migration` action `write_app_config`                                   | full doc verbatim (incl. `systemPrivate`) |
| Stripe webhook              | `entitlements-reconcile`                                                     | `system` block            |

Clients MUST NOT write directly to `system` or `systemPrivate`.
`entitlements-reconcile` merges user-owned fields through untouched.

## 8. Item handling (`itemRecordMode`, `virtualItemsEnabled`)

Two **independent** root-level, user-owned keys describing how the
account treats individual physical items. Reconcile never touches
them.

Three axes (do NOT conflate):

1. **Virtual items** — `virtualItemsEnabled: boolean`. Algorithmic
   IDs, no per-item row. Battery serials, scan-to-collect points,
   bulk QR sheets. Can be on with `itemRecordMode` off.
2. **Item records** — `itemRecordMode`. Materialise a persistent row
   per physical item. `null` / missing = **disabled** (no separate
   `"none"` enum — reads collapse to `mode === "off"` via the
   `useItemRecordMode()` hook).
   - `"registered"` — tag row, no owner. Authenticity / warranty /
     provenance without a customer relationship.
   - `"owned"` — tag row + owner + interaction history. Requires
     `basePlanId >= "engage"`. Enables claim / transfer / CRM.
3. **CRM** — downstream consequence of `owned`; not a peer flag.

**Billing:** the usage ledger stamps `tier` at event time from
`itemRecordMode`. Writes with `mode === null` MUST be rejected. Mode
changes are forward-only per record — existing items keep their tier.

**UI:** rendered as a single "Item handling" section at the top of
the customer add-ons page (`src/components/pricing/ItemHandlingSection`)
because these settings change the whole UX shape (claim, ownership,
CRM visibility), not just a capability flag.

## 9. Migration notes

- Legacy `entitlements` settings group is deprecated. Everything moved
  into `appConfig.system`.
- `appConfig.apps[]` is the master install list. Old split between
  `entitlements.apps` and `settings.apps` is gone.
- Empty `system.features` is legitimate for base plans that grant no
  features yet.
- `systemOverrides` (old root-level key) → `systemPrivate.overrides`.
  One-off backfill moves the block and re-runs reconcile.

## 10. Change log

- **2026-07-17**: Initial contract published; `appConfig.system` becomes
  canonical entitlements source of truth. `entitlements` group deprecated.
- **2026-07-17**: Added `systemOverrides` for additive comps; reconcile
  records `system.appliedOverrides`.
- **2026-07-18**: Renamed `systemOverrides` → `systemPrivate.overrides`
  and formalised the three-tier access model (user / system /
  systemPrivate). API strips `systemPrivate` for non-admin readers.
  Added `system.accountType` derived from
  `systemPrivate.overrides.accountType`. Added top-of-doc TypeScript
  definition.
- **2026-07-18**: Added SDK helpers `appConfiguration.getAppConfig()`
  (typed + cached), `isFeatureEnabled()` (async, cache-backed feature
  gate), and `isFeatureEnabledSync()` (cache-only, for callers that can't
  await). Renamed the exported TypeScript type to `AppConfigSettings`
  to avoid a name collision with the existing per-module `AppConfig`
  type in `src/types/collection.ts`.
- **2026-07-18**: `/public/collection/:id/app/config` (`collection.getAppsConfig()`)
  now returns the `appConfig` entitlements data (`system`, `addOns`,
  `requestedBasePlanId`, `itemRecordMode`, `virtualItemsEnabled`) merged
  alongside its existing app-catalog `apps[]`. `appConfiguration.getAppConfig()`
  was repointed at this endpoint (dropping its `admin` option — this endpoint
  is public-only); the settings-group endpoint (`appConfiguration.getConfig({ appId: 'appConfig' })`)
  is still the only way to reach `systemPrivate`. See §3.1 for why the two
  endpoints' `apps[]` fields are shaped differently and shouldn't be conflated.
- **2026-07-18**: `system.features` changed from "only truthy flags appear"
  to explicit `Record<string, boolean>` overrides. Added the `accountType`
  default rule (§4.4): enterprise accounts default every flag to on unless
  explicitly `false`; standard accounts default off unless explicitly `true`.
  Added `appConfiguration.resolveFeature(system, flag)` — the pure resolver
  behind `isFeatureEnabled()`/`isFeatureEnabledSync()`, exposed only for the
  rare case of already holding a `system` block from somewhere other than
  `getAppConfig()`. There is no separate admin feature-check path — `system`
  is public data on every read, so admin surfaces should call
  `isFeatureEnabled()` like everything else. Reading `cfg.system.features[flag]`
  directly is no longer correct for enterprise accounts — always resolve
  through one of these three.
