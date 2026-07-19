// src/types/appConfiguration.ts
/**
 * Represents an App Configuration object.
 */
export interface AppConfigurationResponse {
  /** Unique identifier for the app configuration */
  id: string
  /** Name of the app configuration */
  name: string
  /** Key-value pairs representing configuration settings */
  settings?: Record<string, any>
}

/** Options for resolving a configured widget instance from app config. */
export interface GetWidgetInstanceOptions {
  appId: string
  collectionId?: string
  productId?: string
  variantId?: string
  batchId?: string
  admin?: boolean
  widgetId: string
}

/** A configured widget instance stored in `appConfig.widgets`. */
export interface WidgetInstance<TWidget = any> {
  id: string
  name?: string
  widget?: TWidget
  [key: string]: any
}

/** Minimal summary shape for picker UIs and instance selectors. */
export interface WidgetInstanceSummary {
  id: string
  name: string
  type?: string
  [key: string]: any
}

// ─── `appConfig` settings group ────────────────────────────────────────────
// See docs/appConfig.md for the full contract. `systemPrivate` is stripped
// by the API for non-admin callers — treat it as optional and never rely
// on it in client code.

/** One installed module instance on a collection. */
export interface AppEntry {
  /** Instance id (typically === uniqueName). */
  id: string
  /** Module id from the module catalog. */
  uniqueName: string
  /** Display name, overrideable. */
  customName?: string
  /** User toggle. */
  active: boolean
  /** Legacy scope flag. */
  all?: boolean
  /** Legacy flag. */
  live?: boolean
  /** Optional FA icon override. */
  faIcon?: string
  versionChannel?: 'stable' | 'beta' | 'dev'
  /** Set by reconcile when app category is outside entitledAppGroups. */
  reason?: 'not_entitled'
  /** Per-module inline settings preserved verbatim. */
  [key: string]: unknown
}

export interface MeterEntry {
  included: number
  stripePriceId?: string
  stripeMeterId?: string
}

export interface AppliedOverridesSummary {
  features?: string[]
  meters?: string[]
  entitledAppGroups?: string[]
  addOnKeys?: string[]
  apps?: string[]
  accountType?: boolean
  note?: string
}

/** Resolved entitlements — written only by `entitlements-reconcile`, safe for every client to read. */
export interface SystemBlock {
  basePlanId?: string
  addOnKeys?: string[]
  /** Apps unlocked by add-ons. */
  apps?: string[]
  /**
   * Explicit overrides only — an absent key is NOT "off". Resolve with
   * `resolveFeature()` / `isFeatureEnabled()`, which apply the accountType
   * default: `enterprise` defaults every flag to on unless explicitly
   * `false` here; `standard` defaults every flag to off unless explicitly
   * `true` here.
   */
  features?: Record<string, boolean>
  meters?: Record<string, MeterEntry>
  /** Lowercased category names. */
  entitledAppGroups?: string[]
  /**
   * Explicit account tier. `'enterprise'` flips the default for every
   * feature flag to on (see `features`), not just an "unlimited baseline" —
   * absence of a flag no longer means disabled for enterprise accounts.
   */
  accountType?: 'enterprise' | 'standard'
  /** ISO-8601 UTC. */
  syncedAt?: string
  syncedFromSubscriptionId?: string
  /** Diagnostic: which override keys reconcile applied on this pass. */
  appliedOverrides?: AppliedOverridesSummary
}

/**
 * Full `appConfig` settings document for a SmartLinks collection.
 * Fetch with `appConfiguration.getAppConfig(collectionId)`.
 */
export interface AppConfigSettings {
  id: 'appConfig'

  // ─── USER-OWNED (client may write freely) ────────────────────────────
  /** Installed modules — the customer's chosen surface. */
  apps: AppEntry[]
  /** Optional mirror of add-on keys the customer has toggled. */
  addOns?: string[]
  /** Wizard hint — which base plan the customer picked pre-checkout. */
  requestedBasePlanId?: string

  /** How the account handles individual physical items. */
  itemRecordMode?: 'registered' | 'owned' | null

  // ─── SYSTEM-OWNED, PUBLIC (reconcile writes; client read-only) ───────
  /** Resolved entitlement truth. Read this to gate features. */
  system?: SystemBlock

  // Admin-only overrides/metadata also live on this document under a
  // `systemPrivate` key, stripped for non-admin reads. Intentionally not
  // part of this SDK's public type surface — internal to the platform.
}
