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
  /** Any additional custom fields for value-based conditions */
  [key: string]: any
}

// Condition cache
const conditionCache: Record<string, ConditionSet> = {}

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
 *       useRegions: true,
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
  // If no condition specified, pass by default
  if (!params.conditionId && !params.condition) {
    return true
  }

  let cond = params.condition

  // Load condition by ID if specified
  if (params.conditionId) {
    // Check cache first
    if (!conditionCache[params.conditionId]) {
      // Try to fetch if function provided
      if (params.fetchCondition && params.collection) {
        const fetchedCond = await params.fetchCondition(params.collection.id, params.conditionId)
        if (fetchedCond) {
          conditionCache[params.conditionId] = fetchedCond
        }
      }
    }

    if (!conditionCache[params.conditionId]) {
      return true
    }

    // Prevent infinite recursion
    params.conditionStack ??= []
    params.conditionStack.push(params.conditionId)

    cond = conditionCache[params.conditionId]
  }

  if (!cond) {
    return true
  }

  // Default to AND logic
  cond.type ??= 'and'

  // Empty condition set passes
  if (!cond.conditions || cond.conditions.length === 0) {
    return true
  }

  // Evaluate each condition
  for (const c of cond.conditions) {
    let result = false

    switch (c.type) {
      case 'country':
        result = await validateCountry(c as CountryCondition, params)
        break
      case 'version':
        result = await validateVersion(c as VersionCondition, params)
        break
      case 'device':
        result = await validateDevice(c as DeviceCondition, params)
        break
      case 'condition':
        result = await validateNestedCondition(c as NestedCondition, params)
        break
      case 'user':
        result = await validateUser(c as UserCondition, params)
        break
      case 'product':
        result = await validateProduct(c as ProductCondition, params)
        break
      case 'tag':
        result = await validateTag(c as TagCondition, params)
        break
      case 'date':
        result = await validateDate(c as DateCondition, params)
        break
      case 'geofence':
        result = await validateGeofence(c as GeofenceCondition, params)
        break
      case 'value':
        result = await validateValue(c as ValueCondition, params)
        break
      case 'itemStatus':
        result = await validateItemStatus(c as ItemStatusCondition, params)
        break
      default:
        // Unknown condition type, skip
        continue
    }

    // AND logic: if any condition fails, entire set fails
    if (!result && cond.type === 'and') {
      return false
    }

    // OR logic: if any condition passes, entire set passes
    if (result && cond.type === 'or') {
      return true
    }
  }

  // AND: all passed
  if (cond.type === 'and') {
    return true
  }

  // OR: all failed
  return false
}

/**
 * Validate country-based condition
 */
async function validateCountry(condition: CountryCondition, params: ConditionParams): Promise<boolean> {
  const country = params.user?.location?.country

  if (!country) {
    return false
  }

  // Build country list from regions or direct country list
  let countryList = condition.countries || []

  if (condition.useRegions && condition.regions?.length) {
    countryList = []
    for (const region of condition.regions) {
      if (REGION_COUNTRIES[region]) {
        countryList.push(...REGION_COUNTRIES[region])
      }
    }
    // Remove duplicates
    countryList = [...new Set(countryList)]
  }

  if (!countryList.length) {
    return false
  }

  const inList = countryList.includes(country)

  // contains=true: pass if country IS in list
  // contains=false: pass if country is NOT in list
  return condition.contains ? inList : !inList
}

/**
 * Validate version-based condition
 */
async function validateVersion(condition: VersionCondition, params: ConditionParams): Promise<boolean> {
  const version = params.stats?.version ?? null
  const inList = condition.versions.includes(version as string)

  return condition.contains ? inList : !inList
}

/**
 * Validate device/platform condition
 */
async function validateDevice(condition: DeviceCondition, params: ConditionParams): Promise<boolean> {
  const displays = condition.displays
  const platform = params.stats?.platform
  const mobile = params.stats?.mobile

  for (const display of displays) {
    if (display === 'android' && platform?.android) {
      return condition.contains
    }
    if (display === 'ios' && platform?.ios) {
      return condition.contains
    }
    if (display === 'win' && platform?.win) {
      return condition.contains
    }
    if (display === 'mac' && platform?.mac) {
      return condition.contains
    }
    if (display === 'desktop' && !mobile) {
      return condition.contains
    }
    if (display === 'mobile' && mobile) {
      return condition.contains
    }
  }

  return !condition.contains
}

/**
 * Validate nested condition reference
 */
async function validateNestedCondition(condition: NestedCondition, params: ConditionParams): Promise<boolean> {
  const newParams = { ...params }
  newParams.conditionId = condition.conditionId

  // Prevent infinite recursion
  newParams.conditionStack = [...(newParams.conditionStack || [])]
  if (newParams.conditionStack.includes(condition.conditionId)) {
    return true
  }

  const result = await validateCondition(newParams)
  return condition.passes ? result : !result
}

/**
 * Validate user-based condition
 */
async function validateUser(condition: UserCondition, params: ConditionParams): Promise<boolean> {
  const userType = condition.userType

  switch (userType) {
    case 'valid':
      // User is logged in
      return params.user?.valid ?? false

    case 'invalid':
      // User is not logged in
      return !(params.user?.valid ?? false)

    case 'owner':
      // User owns the proof
      return !!(
        params.proof &&
        params.user?.valid &&
        params.user.uid &&
        params.user.uid === params.proof.userId
      )

    case 'admin':
      // User is admin of the collection
      return !!(
        params.collection &&
        params.user?.valid &&
        params.user.uid &&
        params.collection.roles &&
        params.collection.roles[params.user.uid]
      )

    case 'group':
      // User is member of specific group
      // TODO: Implement group membership check
      return !!(
        params.collection &&
        params.user?.valid &&
        params.user.groups
      )

    default:
      return true
  }
}

/**
 * Validate product-based condition
 */
async function validateProduct(condition: ProductCondition, params: ConditionParams): Promise<boolean> {
  const productId = params.product?.id

  // No product ID available
  if (!productId) {
    return !condition.contains
  }

  const inList = condition.productIds.includes(productId)
  return condition.contains ? inList : !inList
}

/**
 * Validate tag-based condition
 */
async function validateTag(condition: TagCondition, params: ConditionParams): Promise<boolean> {
  const productId = params.product?.id

  // No product
  if (!productId) {
    return !condition.contains
  }

  // No tags on product
  if (!params.product?.tags) {
    return !condition.contains
  }

  // Check if any condition tag exists on product
  for (const tag of condition.tags) {
    if (params.product.tags[tag]) {
      return condition.contains
    }
  }

  return !condition.contains
}

/**
 * Validate date-based condition
 */
async function validateDate(condition: DateCondition, params: ConditionParams): Promise<boolean> {
  const now = Date.now()

  switch (condition.dateTest) {
    case 'before':
      if (!condition.beforeDate) return false
      return now < Date.parse(condition.beforeDate)

    case 'after':
      if (!condition.afterDate) return false
      return now > Date.parse(condition.afterDate)

    case 'between':
      if (!condition.rangeDate || condition.rangeDate.length !== 2) return false
      const start = Date.parse(condition.rangeDate[0])
      const end = Date.parse(condition.rangeDate[1])
      return now > start && now < end

    default:
      return false
  }
}

/**
 * Validate geofence-based condition
 */
async function validateGeofence(condition: GeofenceCondition, params: ConditionParams): Promise<boolean> {
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
      return false
    }
  }

  if (lat === undefined || lng === undefined) {
    return false
  }

  // Check if outside bounding box
  const outside = 
    lat > condition.top ||
    lat < condition.bottom ||
    lng < condition.left ||
    lng > condition.right

  return condition.contains ? !outside : outside
}

/**
 * Validate value comparison condition
 */
async function validateValue(condition: ValueCondition, params: ConditionParams): Promise<boolean> {
  // Navigate to field value using dot notation
  const fieldPath = condition.field.split('.')
  let base: any = params

  for (const field of fieldPath) {
    if (base && typeof base === 'object' && field in base && typeof base[field] !== 'undefined') {
      base = base[field]
    } else {
      return false
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
  switch (condition.validationType) {
    case 'equal':
      return base == val
    case 'not':
      return base != val
    case 'greater':
      return base > val
    case 'less':
      return base < val
    default:
      return false
  }
}

/**
 * Validate item status condition
 */
async function validateItemStatus(condition: ItemStatusCondition, params: ConditionParams): Promise<boolean> {
  switch (condition.statusType) {
    case 'isClaimable':
      return !!(params.proof && params.proof.claimable)

    case 'notClaimable':
      return !!(params.proof && !params.proof.claimable)

    case 'noProof':
      return !params.proof

    case 'hasProof':
      return !!params.proof

    case 'isVirtual':
      return !!(params.proof && params.proof.virtual)

    case 'notVirtual':
      return !!(params.proof && !params.proof.virtual)

    default:
      return false
  }
}

/**
 * Clear the condition cache
 */
export function clearConditionCache(): void {
  Object.keys(conditionCache).forEach(key => delete conditionCache[key])
}
