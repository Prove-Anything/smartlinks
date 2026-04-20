// src/utils/conditions.ts

/**
 * Geographic region definitions for country-based conditions
 */
export const REGION_COUNTRIES = {
  // European Union (27 member states as of 2026)
  eu: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
  
  // European Economic Area (EU + EFTA countries in EEA)
  eea: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO'],
  
  // United Kingdom
  uk: ['GB'],
  
  // North America
  northamerica: ['US', 'CA', 'MX'],
  
  // Asia Pacific (major markets)
  asiapacific: ['AU', 'NZ', 'JP', 'KR', 'SG', 'HK', 'TW', 'TH', 'MY', 'PH', 'ID', 'VN', 'IN']
} as const

export type RegionKey = keyof typeof REGION_COUNTRIES

/**
 * Base condition structure
 */
export interface BaseCondition {
  type: string
  contains?: boolean
  passes?: boolean
}

/**
 * Country-based condition
 */
export interface CountryCondition extends BaseCondition {
  type: 'country'
  countries?: string[]
  /** @deprecated Regions are applied automatically when regions is provided. */
  useRegions?: boolean
  regions?: RegionKey[]
  contains: boolean
}

/**
 * Version-based condition
 */
export interface VersionCondition extends BaseCondition {
  type: 'version'
  versions: string[]
  contains: boolean
}

/**
 * Device/platform condition
 */
export interface DeviceCondition extends BaseCondition {
  type: 'device'
  displays: Array<'android' | 'ios' | 'win' | 'mac' | 'desktop' | 'mobile'>
  contains: boolean
}

/**
 * Nested condition reference
 */
export interface NestedCondition extends BaseCondition {
  type: 'condition'
  conditionId: string
  passes: boolean
}

/**
 * User type condition
 */
export interface UserCondition extends BaseCondition {
  type: 'user'
  userType: 'valid' | 'invalid' | 'owner' | 'admin' | 'group'
  groupId?: string
}

/**
 * Product-based condition
 */
export interface ProductCondition extends BaseCondition {
  type: 'product'
  productIds: string[]
  contains: boolean
}

/**
 * Tag-based condition
 */
export interface TagCondition extends BaseCondition {
  type: 'tag'
  tags: string[]
  contains: boolean
}

/**
 * Date-based condition
 */
export interface DateCondition extends BaseCondition {
  type: 'date'
  dateTest: 'before' | 'after' | 'between'
  beforeDate?: string
  afterDate?: string
  rangeDate?: [string, string]
}

/**
 * Geofence condition
 */
export interface GeofenceCondition extends BaseCondition {
  type: 'geofence'
  top: number
  bottom: number
  left: number
  right: number
  contains: boolean
}

/**
 * Value comparison condition
 */
export interface ValueCondition extends BaseCondition {
  type: 'value'
  field: string
  fieldType: 'string' | 'boolean' | 'integer' | 'number'
  validationType: 'equal' | 'not' | 'greater' | 'less'
  value: string | number | boolean
}

/**
 * Item status condition
 */
export interface ItemStatusCondition extends BaseCondition {
  type: 'itemStatus'
  statusType: 'isClaimable' | 'notClaimable' | 'noProof' | 'hasProof' | 'isVirtual' | 'notVirtual'
}

/**
 * Facet-based condition — gates on the facet values assigned to the current product.
 *
 * The `facetKey` identifies which facet dimension to inspect (e.g. `'material'`, `'region'`,
 * `'certifications'`).  The optional `values` array lists the value `key`s to test.
 *
 * ### Match modes (`matchMode`)
 *
 * | Mode | Passes when |
 * |------|-------------|
 * | `'any'` (default) | The product has **at least one** of the listed values on this facet |
 * | `'all'` | The product has **every** listed value (multi-value facets only) |
 * | `'none'` | The product has **none** of the listed values |
 * | `'hasFacet'` | The product has **any** value on this facet (ignores `values`) |
 * | `'notHasFacet'` | The product has **no** values on this facet (ignores `values`) |
 *
 * ### Examples
 *
 * ```typescript
 * // Must carry the 'cotton' or 'linen' value on the 'material' facet
 * { type: 'facet', facetKey: 'material', matchMode: 'any', values: ['cotton', 'linen'] }
 *
 * // Must carry BOTH 'organic' and 'recycled' on the 'certifications' facet
 * { type: 'facet', facetKey: 'certifications', matchMode: 'all', values: ['organic', 'recycled'] }
 *
 * // Must NOT carry 'discontinued' on the 'status' facet
 * { type: 'facet', facetKey: 'status', matchMode: 'none', values: ['discontinued'] }
 *
 * // Product must have at least one value on the 'region' facet
 * { type: 'facet', facetKey: 'region', matchMode: 'hasFacet' }
 * ```
 */
export interface FacetCondition extends BaseCondition {
  type: 'facet'
  /** The facet dimension key to inspect (e.g. `'material'`, `'region'`) */
  facetKey: string
  /**
   * How to match against `values`.
   * - `'any'` — pass if the product has at least one of the listed values (default)
   * - `'all'` — pass if the product has every listed value
   * - `'none'` — pass if the product has none of the listed values
   * - `'hasFacet'` — pass if the product has any value on this facet (ignores `values`)
   * - `'notHasFacet'` — pass if the product has no values on this facet (ignores `values`)
   */
  matchMode?: 'any' | 'all' | 'none' | 'hasFacet' | 'notHasFacet'
  /**
   * Facet value keys to test against.
   * Required for `'any'`, `'all'`, and `'none'` match modes.
   * Ignored for `'hasFacet'` and `'notHasFacet'`.
   */
  values?: string[]
}

/**
 * Union of all condition types
 */
export type Condition = 
  | CountryCondition
  | VersionCondition
  | DeviceCondition
  | NestedCondition
  | UserCondition
  | ProductCondition
  | TagCondition
  | FacetCondition
  | DateCondition
  | GeofenceCondition
  | ValueCondition
  | ItemStatusCondition

/**
 * Condition set that combines multiple conditions
 */
export interface ConditionSet {
  id?: string
  type?: 'and' | 'or'
  conditions?: Condition[]
}

/**
 * User location information
 */
export interface UserLocation {
  country?: string
  latitude?: number
  longitude?: number
}

/**
 * Platform detection information
 */
export interface PlatformInfo {
  android?: boolean
  ios?: boolean
  win?: boolean
  mac?: boolean
}

/**
 * Statistics/tracking information
 */
export interface StatsInfo {
  version?: string | null
  platform?: PlatformInfo
  mobile?: boolean
}

/**
 * User information for condition validation
 */
export interface UserInfo {
  valid: boolean
  uid?: string
  location?: UserLocation
  groups?: string[]
}

/**
 * Product information for condition validation
 */
export interface ProductInfo {
  id: string
  tags?: Record<string, any>
  /**
   * Facet values assigned to this product.
   * Shape mirrors `ProductFacetMap`: a map of facet key → array of value objects.
   * Each value object must have at minimum a `key` string property.
   *
   * @example
   * ```ts
   * {
   *   material: [{ key: 'cotton', name: 'Cotton' }],
   *   certifications: [{ key: 'organic', name: 'Organic' }, { key: 'recycled', name: 'Recycled' }]
   * }
   * ```
   */
  facets?: Record<string, Array<{ key: string; [k: string]: unknown }>>
}

/**
 * Proof information for condition validation
 */
export interface ProofInfo {
  id?: string
  userId?: string
  claimable?: boolean
  virtual?: boolean
}

/**
 * Collection information for condition validation
 */
export interface CollectionInfo {
  id: string
  roles?: Record<string, any>
}

/**
 * Parameters for condition validation
 */
export interface ConditionParams {
  /** The condition set to validate (if not using conditionId) */
  condition?: ConditionSet
  /** ID of a condition to load and validate */
  conditionId?: string
  /** Stack to prevent infinite recursion in nested conditions */
  conditionStack?: string[]
  /** User information */
  user?: UserInfo
  /** Product information */
  product?: ProductInfo
  /** Proof information */
  proof?: ProofInfo
  /** Collection information */
  collection?: CollectionInfo
  /** Statistics/tracking information */
  stats?: StatsInfo
  /** Function to fetch conditions by ID (optional) */
  fetchCondition?: (collectionId: string, conditionId: string) => Promise<ConditionSet | null>
  /** Function to get user's current location (optional) */
  getLocation?: () => Promise<{ latitude: number; longitude: number }>
  /** Enable verbose condition evaluation logging for this invocation */
  debugConditions?: boolean | ConditionDebugOptions
  /** Any additional custom fields for value-based conditions */
  [key: string]: any
}

export type ConditionDebugLogger = (...args: any[]) => void

export interface ConditionDebugOptions {
  enabled?: boolean
  logger?: ConditionDebugLogger
  label?: string
}

type ConditionCheckResult = {
  passed: boolean
  detail?: string
  context?: Record<string, unknown>
}

type ConditionDebugState = {
  depth: number
  logger: ConditionDebugLogger
  label?: string
}

type InternalConditionParams = ConditionParams & {
  __conditionDebugState?: ConditionDebugState
}

// Condition cache
const conditionCache: Record<string, ConditionSet> = {}
const CONDITION_DEBUG_GLOBAL_KEY = 'SMARTLINKS_CONDITION_DEBUG'

function defaultConditionDebugLogger(...args: any[]) {
  if (typeof console === 'undefined') return
  if (typeof console.debug === 'function') {
    console.debug(...args)
    return
  }
  if (typeof console.log === 'function') {
    console.log(...args)
  }
}

function getGlobalConditionDebugOptions(): boolean | ConditionDebugOptions | undefined {
  if (typeof globalThis === 'undefined') {
    return undefined
  }

  const value = (globalThis as Record<string, unknown>)[CONDITION_DEBUG_GLOBAL_KEY]
  if (typeof value === 'boolean') {
    return value
  }
  if (value && typeof value === 'object') {
    return value as ConditionDebugOptions
  }
  return undefined
}

function resolveConditionDebugState(params: ConditionParams): ConditionDebugState | undefined {
  const globalOptions = getGlobalConditionDebugOptions()
  const localOptions = params.debugConditions
  const mergedOptions: ConditionDebugOptions = {
    ...(typeof globalOptions === 'object' ? globalOptions : {}),
    ...(typeof localOptions === 'object' ? localOptions : {}),
  }

  let enabled = false
  if (typeof globalOptions === 'boolean') {
    enabled = globalOptions
  } else if (typeof globalOptions === 'object' && globalOptions) {
    enabled = globalOptions.enabled ?? true
  }

  if (typeof localOptions === 'boolean') {
    enabled = localOptions
  } else if (typeof localOptions === 'object' && localOptions) {
    enabled = localOptions.enabled ?? true
  }

  if (!enabled) {
    return undefined
  }

  return {
    depth: 0,
    label: mergedOptions.label,
    logger: mergedOptions.logger ?? defaultConditionDebugLogger,
  }
}

function createChildDebugState(state: ConditionDebugState | undefined): ConditionDebugState | undefined {
  if (!state) {
    return undefined
  }

  return {
    ...state,
    depth: state.depth + 1,
  }
}

function logConditionDebug(state: ConditionDebugState | undefined, message: string, context?: Record<string, unknown>) {
  if (!state) {
    return
  }

  const indent = '  '.repeat(state.depth)
  const prefix = state.label
    ? `[smartlinks:conditions:${state.label}]`
    : '[smartlinks:conditions]'

  if (context) {
    state.logger(`${prefix} ${indent}${message}`, context)
    return
  }

  state.logger(`${prefix} ${indent}${message}`)
}

function summarizeConditionSet(condition: ConditionSet): string {
  return `${condition.type ?? 'and'} (${condition.conditions?.length ?? 0} conditions)`
}

function summarizeCondition(condition: Condition): string {
  switch (condition.type) {
    case 'country':
      return `country regions=${condition.regions?.join(',') || 'none'} countries=${condition.countries?.join(',') || 'none'} contains=${condition.contains}`
    case 'version':
      return `version [${condition.versions.join(', ')}] contains=${condition.contains}`
    case 'device':
      return `device [${condition.displays.join(', ')}] contains=${condition.contains}`
    case 'condition':
      return `condition ref=${condition.conditionId} passes=${condition.passes}`
    case 'user':
      return `user type=${condition.userType}`
    case 'product':
      return `product ids=${condition.productIds.join(', ')} contains=${condition.contains}`
    case 'tag':
      return `tag tags=${condition.tags.join(', ')} contains=${condition.contains}`
    case 'date':
      return `date test=${condition.dateTest}`
    case 'geofence':
      return `geofence contains=${condition.contains}`
    case 'value':
      return `value field=${condition.field} ${condition.validationType} ${String(condition.value)}`
    case 'facet': {
      const mode = condition.matchMode ?? 'any'
      const vals = condition.values?.join(', ') ?? '—'
      return `facet key=${condition.facetKey} mode=${mode} values=[${vals}]`
    }
    case 'itemStatus':
      return `itemStatus ${condition.statusType}`
    default:
      return 'unknown condition'
  }
}

async function evaluateConditionEntry(condition: Condition, params: InternalConditionParams): Promise<ConditionCheckResult | undefined> {
  switch (condition.type) {
    case 'country':
      return validateCountry(condition as CountryCondition, params)
    case 'version':
      return validateVersion(condition as VersionCondition, params)
    case 'device':
      return validateDevice(condition as DeviceCondition, params)
    case 'condition':
      return validateNestedCondition(condition as NestedCondition, params)
    case 'user':
      return validateUser(condition as UserCondition, params)
    case 'product':
      return validateProduct(condition as ProductCondition, params)
    case 'tag':
      return validateTag(condition as TagCondition, params)
    case 'date':
      return validateDate(condition as DateCondition, params)
    case 'geofence':
      return validateGeofence(condition as GeofenceCondition, params)
    case 'value':
      return validateValue(condition as ValueCondition, params)
    case 'facet':
      return validateFacet(condition as FacetCondition, params)
    case 'itemStatus':
      return validateItemStatus(condition as ItemStatusCondition, params)
    default:
      return undefined
  }
}

/**
 * Validates if a condition set passes based on the provided parameters.
 * 
 * Conditions are commonly used for controlling page rendering, content visibility,
 * and feature access based on various criteria like geography, device type, user status, etc.
 * 
 * Supports multiple condition types:
 * - **country** - Geographic restrictions (countries or regions like EU, EEA)
 * - **version** - Version-based display (e.g., A/B testing)
 * - **device** - Platform/device targeting (iOS, Android, desktop, mobile)
 * - **user** - User authentication status (logged in, owner, admin)
 * - **product** - Product-specific conditions
 * - **tag** - Product tag-based conditions
 * - **facet** - Product facet-based conditions (any/all/none of specific facet values)
 * - **date** - Time-based conditions (before, after, between dates)
 * - **geofence** - Location-based restrictions
 * - **value** - Custom field comparisons
 * - **itemStatus** - Proof/item status checks (claimable, virtual, etc.)
 * - **condition** - Nested condition references
 * 
 * Conditions can be combined with AND or OR logic.
 * 
 * @param params - Validation parameters including condition and context
 * @returns Promise that resolves to true if condition passes, false otherwise
 * 
 * @example
 * ```typescript
 * import { validateCondition } from '@proveanything/smartlinks'
 * 
 * // Simple country check
 * const canShow = await validateCondition({
 *   condition: {
 *     type: 'and',
 *     conditions: [{
 *       type: 'country',
 *       regions: ['eu'],
 *       contains: true
 *     }]
 *   },
 *   user: { valid: true, location: { country: 'DE' } }
 * })
 * 
 * // Multiple conditions with AND logic
 * const result = await validateCondition({
 *   condition: {
 *     type: 'and',
 *     conditions: [
 *       { type: 'user', userType: 'valid' },
 *       { type: 'device', displays: ['mobile'], contains: true }
 *     ]
 *   },
 *   user: { valid: true },
 *   stats: { mobile: true }
 * })
 * 
 * // Date-based condition
 * const isActive = await validateCondition({
 *   condition: {
 *     type: 'and',
 *     conditions: [{
 *       type: 'date',
 *       dateTest: 'between',
 *       rangeDate: ['2026-01-01', '2026-12-31']
 *     }]
 *   }
 * })
 * ```
 */
export async function validateCondition(params: ConditionParams): Promise<boolean> {
  const internalParams = params as InternalConditionParams
  internalParams.__conditionDebugState ??= resolveConditionDebugState(params)
  const debugState = internalParams.__conditionDebugState

  // If no condition specified, pass by default
  if (!params.conditionId && !params.condition) {
    logConditionDebug(debugState, 'No condition supplied; passing by default.')
    return true
  }

  let cond = params.condition

  // Load condition by ID if specified
  if (params.conditionId) {
    // Check cache first
    if (!conditionCache[params.conditionId]) {
      logConditionDebug(debugState, 'Condition cache miss.', { conditionId: params.conditionId })
      // Try to fetch if function provided
      if (params.fetchCondition && params.collection) {
        const fetchedCond = await params.fetchCondition(params.collection.id, params.conditionId)
        if (fetchedCond) {
          conditionCache[params.conditionId] = fetchedCond
          logConditionDebug(debugState, 'Fetched condition into cache.', {
            conditionId: params.conditionId,
            conditionSet: summarizeConditionSet(fetchedCond),
          })
        }
      }
    }

    if (!conditionCache[params.conditionId]) {
      logConditionDebug(debugState, 'Condition not found; passing by default.', { conditionId: params.conditionId })
      return true
    }

    // Prevent infinite recursion
    params.conditionStack ??= []
    params.conditionStack.push(params.conditionId)

    cond = conditionCache[params.conditionId]
  } else {
    logConditionDebug(debugState, 'Evaluating inline condition set.', {
      conditionSet: cond ? summarizeConditionSet(cond) : 'none',
    })
  }

  if (!cond) {
    logConditionDebug(debugState, 'Resolved condition set is empty; passing by default.')
    return true
  }

  // Default to AND logic
  const conditionType = cond.type ?? 'and'

  // Empty condition set passes
  if (!cond.conditions || cond.conditions.length === 0) {
    logConditionDebug(debugState, 'Condition set has no entries; passing by default.', {
      conditionSet: summarizeConditionSet(cond),
    })
    return true
  }

  logConditionDebug(debugState, 'Condition set start.', {
    logic: conditionType,
    conditionCount: cond.conditions.length,
    conditionId: params.conditionId,
  })

  // Evaluate each condition
  for (const [index, c] of cond.conditions.entries()) {
    logConditionDebug(debugState, `Condition ${index + 1}/${cond.conditions.length} start: ${summarizeCondition(c)}`)
    const evaluation = await evaluateConditionEntry(c, internalParams)

    if (!evaluation) {
      logConditionDebug(debugState, `Condition ${index + 1} skipped: unknown type.`, { type: c.type })
      continue
    }

    logConditionDebug(debugState, `Condition ${index + 1} result: ${evaluation.passed ? 'PASS' : 'FAIL'}`, {
      type: c.type,
      detail: evaluation.detail,
      ...evaluation.context,
    })

    // AND logic: if any condition fails, entire set fails
    if (!evaluation.passed && conditionType === 'and') {
      logConditionDebug(debugState, 'Condition set short-circuited to FAIL (AND logic).')
      return false
    }

    // OR logic: if any condition passes, entire set passes
    if (evaluation.passed && conditionType === 'or') {
      logConditionDebug(debugState, 'Condition set short-circuited to PASS (OR logic).')
      return true
    }
  }

  // AND: all passed
  if (conditionType === 'and') {
    logConditionDebug(debugState, 'Condition set result: PASS.')
    return true
  }

  // OR: all failed
  logConditionDebug(debugState, 'Condition set result: FAIL.')
  return false
}

/**
 * Validate country-based condition
 */
async function validateCountry(condition: CountryCondition, params: ConditionParams): Promise<ConditionCheckResult> {
  const country = params.user?.location?.country

  if (!country) {
    return {
      passed: false,
      detail: 'User country was not available.',
    }
  }

  // Build country list from direct countries and any configured regions.
  const countryList = [...(condition.countries || [])]

  if (condition.regions?.length) {
    for (const region of condition.regions) {
      if (REGION_COUNTRIES[region]) {
        countryList.push(...REGION_COUNTRIES[region])
      }
    }
  }

  const normalizedCountryList = [...new Set(countryList)]

  if (!normalizedCountryList.length) {
    return {
      passed: false,
      detail: 'No countries or regions were configured on the condition.',
    }
  }

  const inList = normalizedCountryList.includes(country)

  // contains=true: pass if country IS in list
  // contains=false: pass if country is NOT in list
  return {
    passed: condition.contains ? inList : !inList,
    detail: condition.contains
      ? `Country ${country} ${inList ? 'matched' : 'did not match'} the allowed list.`
      : `Country ${country} ${inList ? 'matched' : 'did not match'} the blocked list.`,
    context: {
      country,
      regions: condition.regions,
      countryList: normalizedCountryList,
      contains: condition.contains,
    },
  }
}

/**
 * Validate version-based condition
 */
async function validateVersion(condition: VersionCondition, params: ConditionParams): Promise<ConditionCheckResult> {
  const version = params.stats?.version ?? null
  const inList = condition.versions.includes(version as string)

  return {
    passed: condition.contains ? inList : !inList,
    detail: `Version ${version ?? 'null'} ${inList ? 'matched' : 'did not match'} the configured list.`,
    context: {
      version,
      versions: condition.versions,
      contains: condition.contains,
    },
  }
}

/**
 * Validate device/platform condition
 */
async function validateDevice(condition: DeviceCondition, params: ConditionParams): Promise<ConditionCheckResult> {
  const displays = condition.displays
  const platform = params.stats?.platform
  const mobile = params.stats?.mobile

  for (const display of displays) {
    if (display === 'android' && platform?.android) {
      return {
        passed: condition.contains,
        detail: 'Matched android platform.',
        context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
      }
    }
    if (display === 'ios' && platform?.ios) {
      return {
        passed: condition.contains,
        detail: 'Matched ios platform.',
        context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
      }
    }
    if (display === 'win' && platform?.win) {
      return {
        passed: condition.contains,
        detail: 'Matched win platform.',
        context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
      }
    }
    if (display === 'mac' && platform?.mac) {
      return {
        passed: condition.contains,
        detail: 'Matched mac platform.',
        context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
      }
    }
    if (display === 'desktop' && !mobile) {
      return {
        passed: condition.contains,
        detail: 'Matched desktop device mode.',
        context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
      }
    }
    if (display === 'mobile' && mobile) {
      return {
        passed: condition.contains,
        detail: 'Matched mobile device mode.',
        context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
      }
    }
  }

  return {
    passed: !condition.contains,
    detail: 'No configured display matched the current platform/device.',
    context: { displays, contains: condition.contains, platform, mobile },
  }
}

/**
 * Validate nested condition reference
 */
async function validateNestedCondition(condition: NestedCondition, params: InternalConditionParams): Promise<ConditionCheckResult> {
  const newParams: InternalConditionParams = { ...params }
  newParams.conditionId = condition.conditionId
  newParams.__conditionDebugState = createChildDebugState(params.__conditionDebugState)

  // Prevent infinite recursion
  newParams.conditionStack = [...(newParams.conditionStack || [])]
  if (newParams.conditionStack.includes(condition.conditionId)) {
    return {
      passed: true,
      detail: `Nested condition ${condition.conditionId} skipped to avoid recursion.`,
      context: { conditionId: condition.conditionId, conditionStack: newParams.conditionStack },
    }
  }

  const result = await validateCondition(newParams)
  return {
    passed: condition.passes ? result : !result,
    detail: `Nested condition ${condition.conditionId} ${result ? 'passed' : 'failed'} and passes=${condition.passes}.`,
    context: { conditionId: condition.conditionId, nestedResult: result, passes: condition.passes },
  }
}

/**
 * Validate user-based condition
 */
async function validateUser(condition: UserCondition, params: ConditionParams): Promise<ConditionCheckResult> {
  const userType = condition.userType

  switch (userType) {
    case 'valid':
      // User is logged in
      return {
        passed: params.user?.valid ?? false,
        detail: `User valid flag is ${params.user?.valid ?? false}.`,
      }

    case 'invalid':
      // User is not logged in
      return {
        passed: !(params.user?.valid ?? false),
        detail: `User valid flag is ${params.user?.valid ?? false}.`,
      }

    case 'owner':
      // User owns the proof
      return {
        passed: !!(
        params.proof &&
        params.user?.valid &&
        params.user.uid &&
        params.user.uid === params.proof.userId
        ),
        detail: 'Owner check compares user.uid with proof.userId.',
        context: {
          userId: params.user?.uid,
          proofUserId: params.proof?.userId,
          userValid: params.user?.valid ?? false,
        },
      }

    case 'admin':
      // User is admin of the collection
      return {
        passed: !!(
        params.collection &&
        params.user?.valid &&
        params.user.uid &&
        params.collection.roles &&
        params.collection.roles[params.user.uid]
        ),
        detail: 'Admin check looks for a role entry on collection.roles.',
        context: {
          userId: params.user?.uid,
          userValid: params.user?.valid ?? false,
          hasRoles: !!params.collection?.roles,
        },
      }

    case 'group':
      // User is member of specific group
      // TODO: Implement group membership check
      return {
        passed: !!(
        params.collection &&
        params.user?.valid &&
        params.user.groups
        ),
        detail: 'Group condition currently checks only that groups are present on the user.',
        context: {
          groupId: condition.groupId,
          groups: params.user?.groups,
          userValid: params.user?.valid ?? false,
        },
      }

    default:
      return {
        passed: true,
        detail: `Unknown userType ${userType}; passing by default.`,
      }
  }
}

/**
 * Validate product-based condition
 */
async function validateProduct(condition: ProductCondition, params: ConditionParams): Promise<ConditionCheckResult> {
  const productId = params.product?.id

  // No product ID available
  if (!productId) {
    return {
      passed: !condition.contains,
      detail: 'Product ID was not available.',
      context: { contains: condition.contains, productIds: condition.productIds },
    }
  }

  const inList = condition.productIds.includes(productId)
  return {
    passed: condition.contains ? inList : !inList,
    detail: `Product ${productId} ${inList ? 'matched' : 'did not match'} the configured list.`,
    context: { productId, productIds: condition.productIds, contains: condition.contains },
  }
}

/**
 * Validate tag-based condition
 */
async function validateTag(condition: TagCondition, params: ConditionParams): Promise<ConditionCheckResult> {
  const productId = params.product?.id

  // No product
  if (!productId) {
    return {
      passed: !condition.contains,
      detail: 'Product ID was not available.',
      context: { contains: condition.contains, tags: condition.tags },
    }
  }

  // No tags on product
  if (!params.product?.tags) {
    return {
      passed: !condition.contains,
      detail: 'Product tags were not available.',
      context: { productId, contains: condition.contains, tags: condition.tags },
    }
  }

  // Check if any condition tag exists on product
  for (const tag of condition.tags) {
    if (params.product.tags[tag]) {
      return {
        passed: condition.contains,
        detail: `Product ${productId} matched tag ${tag}.`,
        context: { productId, matchedTag: tag, contains: condition.contains },
      }
    }
  }

  return {
    passed: !condition.contains,
    detail: `Product ${productId} did not match any configured tag.`,
    context: { productId, tags: condition.tags, contains: condition.contains },
  }
}

/**
 * Validate date-based condition
 */
async function validateDate(condition: DateCondition, params: ConditionParams): Promise<ConditionCheckResult> {
  const now = Date.now()

  switch (condition.dateTest) {
    case 'before':
      if (!condition.beforeDate) {
        return { passed: false, detail: 'beforeDate was not provided.' }
      }
      return {
        passed: now < Date.parse(condition.beforeDate),
        detail: `Current time is ${now < Date.parse(condition.beforeDate) ? 'before' : 'not before'} ${condition.beforeDate}.`,
        context: { now, beforeDate: condition.beforeDate },
      }

    case 'after':
      if (!condition.afterDate) {
        return { passed: false, detail: 'afterDate was not provided.' }
      }
      return {
        passed: now > Date.parse(condition.afterDate),
        detail: `Current time is ${now > Date.parse(condition.afterDate) ? 'after' : 'not after'} ${condition.afterDate}.`,
        context: { now, afterDate: condition.afterDate },
      }

    case 'between':
      if (!condition.rangeDate || condition.rangeDate.length !== 2) {
        return { passed: false, detail: 'rangeDate must contain exactly two entries.' }
      }
      const start = Date.parse(condition.rangeDate[0])
      const end = Date.parse(condition.rangeDate[1])
      return {
        passed: now > start && now < end,
        detail: `Current time is ${now > start && now < end ? 'within' : 'outside'} the configured date range.`,
        context: { now, start, end, rangeDate: condition.rangeDate },
      }

    default:
      return {
        passed: false,
        detail: `Unsupported dateTest ${condition.dateTest}.`,
      }
  }
}

/**
 * Validate geofence-based condition
 */
async function validateGeofence(condition: GeofenceCondition, params: ConditionParams): Promise<ConditionCheckResult> {
  let lat: number | undefined
  let lng: number | undefined

  // Try to get location from params first
  if (params.user?.location) {
    lat = params.user.location.latitude
    lng = params.user.location.longitude
  }

  // If not available and getLocation function provided, fetch it
  if ((lat === undefined || lng === undefined) && params.getLocation) {
    try {
      const location = await params.getLocation()
      lat = location.latitude
      lng = location.longitude
    } catch (error) {
      return {
        passed: false,
        detail: 'getLocation threw while resolving user coordinates.',
        context: { error },
      }
    }
  }

  if (lat === undefined || lng === undefined) {
    return {
      passed: false,
      detail: 'Latitude/longitude were not available.',
    }
  }

  // Check if outside bounding box
  const outside = 
    lat > condition.top ||
    lat < condition.bottom ||
    lng < condition.left ||
    lng > condition.right

  return {
    passed: condition.contains ? !outside : outside,
    detail: `Coordinates are ${outside ? 'outside' : 'inside'} the configured geofence.`,
    context: {
      latitude: lat,
      longitude: lng,
      contains: condition.contains,
      bounds: {
        top: condition.top,
        bottom: condition.bottom,
        left: condition.left,
        right: condition.right,
      },
    },
  }
}

/**
 * Validate value comparison condition
 */
async function validateValue(condition: ValueCondition, params: ConditionParams): Promise<ConditionCheckResult> {
  // Navigate to field value using dot notation
  const fieldPath = condition.field.split('.')
  let base: any = params

  for (const field of fieldPath) {
    if (base && typeof base === 'object' && field in base && typeof base[field] !== 'undefined') {
      base = base[field]
    } else {
      return {
        passed: false,
        detail: `Field ${condition.field} was not found in the provided params.`,
      }
    }
  }

  // Convert value to correct type
  let val: any = condition.value

  if (typeof val === 'string' && condition.fieldType === 'boolean') {
    val = val.toLowerCase() === 'true'
  } else if (typeof val === 'string' && condition.fieldType === 'integer') {
    val = parseInt(val, 10)
  }

  // Perform comparison
  let passed = false
  switch (condition.validationType) {
    case 'equal':
      passed = base == val
      break
    case 'not':
      passed = base != val
      break
    case 'greater':
      passed = base > val
      break
    case 'less':
      passed = base < val
      break
    default:
      return {
        passed: false,
        detail: `Unsupported validationType ${condition.validationType}.`,
      }
  }

  return {
    passed,
    detail: `Compared field ${condition.field} (${String(base)}) with ${String(val)} using ${condition.validationType}.`,
    context: {
      field: condition.field,
      fieldValue: base,
      comparisonValue: val,
      fieldType: condition.fieldType,
      validationType: condition.validationType,
    },
  }
}

/**
 * Validate facet-based condition
 */
async function validateFacet(condition: FacetCondition, params: ConditionParams): Promise<ConditionCheckResult> {
  const { facetKey, matchMode = 'any', values = [] } = condition
  const facets = params.product?.facets

  // No product
  if (!params.product?.id) {
    return {
      passed: false,
      detail: 'Product ID was not available.',
      context: { facetKey, matchMode },
    }
  }

  const assigned: Array<{ key: string; [k: string]: unknown }> = facets?.[facetKey] ?? []
  const assignedKeys = assigned.map(v => v.key)

  // Presence-only modes — ignore `values`
  if (matchMode === 'hasFacet') {
    return {
      passed: assignedKeys.length > 0,
      detail: `Product ${assigned.length > 0 ? 'has' : 'does not have'} values on facet '${facetKey}'.`,
      context: { facetKey, assignedKeys },
    }
  }

  if (matchMode === 'notHasFacet') {
    return {
      passed: assignedKeys.length === 0,
      detail: `Product ${assigned.length === 0 ? 'has no' : 'has'} values on facet '${facetKey}'.`,
      context: { facetKey, assignedKeys },
    }
  }

  // Value-matching modes require at least one value to test
  if (values.length === 0) {
    return {
      passed: false,
      detail: `Facet condition for '${facetKey}' with matchMode '${matchMode}' requires at least one value.`,
      context: { facetKey, matchMode },
    }
  }

  if (matchMode === 'any') {
    const matched = values.filter(v => assignedKeys.includes(v))
    return {
      passed: matched.length > 0,
      detail: matched.length > 0
        ? `Product matched facet '${facetKey}' value(s): [${matched.join(', ')}].`
        : `Product did not match any of [${values.join(', ')}] on facet '${facetKey}'.`,
      context: { facetKey, matchMode, testedValues: values, matched, assignedKeys },
    }
  }

  if (matchMode === 'all') {
    const missing = values.filter(v => !assignedKeys.includes(v))
    return {
      passed: missing.length === 0,
      detail: missing.length === 0
        ? `Product has all required values on facet '${facetKey}'.`
        : `Product is missing [${missing.join(', ')}] on facet '${facetKey}'.`,
      context: { facetKey, matchMode, testedValues: values, missing, assignedKeys },
    }
  }

  if (matchMode === 'none') {
    const matched = values.filter(v => assignedKeys.includes(v))
    return {
      passed: matched.length === 0,
      detail: matched.length === 0
        ? `Product correctly has none of [${values.join(', ')}] on facet '${facetKey}'.`
        : `Product has forbidden value(s) [${matched.join(', ')}] on facet '${facetKey}'.`,
      context: { facetKey, matchMode, testedValues: values, matched, assignedKeys },
    }
  }

  return {
    passed: false,
    detail: `Unsupported facet matchMode '${matchMode}'.`,
    context: { facetKey, matchMode },
  }
}

/**
 * Validate item status condition
 */
async function validateItemStatus(condition: ItemStatusCondition, params: ConditionParams): Promise<ConditionCheckResult> {
  switch (condition.statusType) {
    case 'isClaimable':
      return {
        passed: !!(params.proof && params.proof.claimable),
        detail: 'Checked proof.claimable for truthiness.',
      }

    case 'notClaimable':
      return {
        passed: !!(params.proof && !params.proof.claimable),
        detail: 'Checked proof.claimable for falsiness.',
      }

    case 'noProof':
      return {
        passed: !params.proof,
        detail: 'Checked that no proof object was provided.',
      }

    case 'hasProof':
      return {
        passed: !!params.proof,
        detail: 'Checked that a proof object was provided.',
      }

    case 'isVirtual':
      return {
        passed: !!(params.proof && params.proof.virtual),
        detail: 'Checked proof.virtual for truthiness.',
      }

    case 'notVirtual':
      return {
        passed: !!(params.proof && !params.proof.virtual),
        detail: 'Checked proof.virtual for falsiness.',
      }

    default:
      return {
        passed: false,
        detail: `Unsupported statusType ${condition.statusType}.`,
      }
  }
}

/**
 * Clear the condition cache
 */
export function clearConditionCache(): void {
  Object.keys(conditionCache).forEach(key => delete conditionCache[key])
}
