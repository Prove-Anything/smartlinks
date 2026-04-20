/**
 * Geographic region definitions for country-based conditions
 */
export declare const REGION_COUNTRIES: {
    readonly eu: readonly ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE"];
    readonly eea: readonly ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO"];
    readonly uk: readonly ["GB"];
    readonly northamerica: readonly ["US", "CA", "MX"];
    readonly asiapacific: readonly ["AU", "NZ", "JP", "KR", "SG", "HK", "TW", "TH", "MY", "PH", "ID", "VN", "IN"];
};
export type RegionKey = keyof typeof REGION_COUNTRIES;
/**
 * Base condition structure
 */
export interface BaseCondition {
    type: string;
    contains?: boolean;
    passes?: boolean;
}
/**
 * Country-based condition
 */
export interface CountryCondition extends BaseCondition {
    type: 'country';
    countries?: string[];
    /** @deprecated Regions are applied automatically when regions is provided. */
    useRegions?: boolean;
    regions?: RegionKey[];
    contains: boolean;
}
/**
 * Version-based condition
 */
export interface VersionCondition extends BaseCondition {
    type: 'version';
    versions: string[];
    contains: boolean;
}
/**
 * Device/platform condition
 */
export interface DeviceCondition extends BaseCondition {
    type: 'device';
    displays: Array<'android' | 'ios' | 'win' | 'mac' | 'desktop' | 'mobile'>;
    contains: boolean;
}
/**
 * Nested condition reference
 */
export interface NestedCondition extends BaseCondition {
    type: 'condition';
    conditionId: string;
    passes: boolean;
}
/**
 * User type condition
 */
export interface UserCondition extends BaseCondition {
    type: 'user';
    userType: 'valid' | 'invalid' | 'owner' | 'admin' | 'group';
    groupId?: string;
}
/**
 * Product-based condition
 */
export interface ProductCondition extends BaseCondition {
    type: 'product';
    productIds: string[];
    contains: boolean;
}
/**
 * Tag-based condition
 */
export interface TagCondition extends BaseCondition {
    type: 'tag';
    tags: string[];
    contains: boolean;
}
/**
 * Date-based condition
 */
export interface DateCondition extends BaseCondition {
    type: 'date';
    dateTest: 'before' | 'after' | 'between';
    beforeDate?: string;
    afterDate?: string;
    rangeDate?: [string, string];
}
/**
 * Geofence condition
 */
export interface GeofenceCondition extends BaseCondition {
    type: 'geofence';
    top: number;
    bottom: number;
    left: number;
    right: number;
    contains: boolean;
}
/**
 * Value comparison condition
 */
export interface ValueCondition extends BaseCondition {
    type: 'value';
    field: string;
    fieldType: 'string' | 'boolean' | 'integer' | 'number';
    validationType: 'equal' | 'not' | 'greater' | 'less';
    value: string | number | boolean;
}
/**
 * Item status condition
 */
export interface ItemStatusCondition extends BaseCondition {
    type: 'itemStatus';
    statusType: 'isClaimable' | 'notClaimable' | 'noProof' | 'hasProof' | 'isVirtual' | 'notVirtual';
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
    type: 'facet';
    /** The facet dimension key to inspect (e.g. `'material'`, `'region'`) */
    facetKey: string;
    /**
     * How to match against `values`.
     * - `'any'` — pass if the product has at least one of the listed values (default)
     * - `'all'` — pass if the product has every listed value
     * - `'none'` — pass if the product has none of the listed values
     * - `'hasFacet'` — pass if the product has any value on this facet (ignores `values`)
     * - `'notHasFacet'` — pass if the product has no values on this facet (ignores `values`)
     */
    matchMode?: 'any' | 'all' | 'none' | 'hasFacet' | 'notHasFacet';
    /**
     * Facet value keys to test against.
     * Required for `'any'`, `'all'`, and `'none'` match modes.
     * Ignored for `'hasFacet'` and `'notHasFacet'`.
     */
    values?: string[];
}
/**
 * Union of all condition types
 */
export type Condition = CountryCondition | VersionCondition | DeviceCondition | NestedCondition | UserCondition | ProductCondition | TagCondition | FacetCondition | DateCondition | GeofenceCondition | ValueCondition | ItemStatusCondition;
/**
 * Condition set that combines multiple conditions
 */
export interface ConditionSet {
    id?: string;
    type?: 'and' | 'or';
    conditions?: Condition[];
}
/**
 * User location information
 */
export interface UserLocation {
    country?: string;
    latitude?: number;
    longitude?: number;
}
/**
 * Platform detection information
 */
export interface PlatformInfo {
    android?: boolean;
    ios?: boolean;
    win?: boolean;
    mac?: boolean;
}
/**
 * Statistics/tracking information
 */
export interface StatsInfo {
    version?: string | null;
    platform?: PlatformInfo;
    mobile?: boolean;
}
/**
 * User information for condition validation
 */
export interface UserInfo {
    valid: boolean;
    uid?: string;
    location?: UserLocation;
    groups?: string[];
}
/**
 * Product information for condition validation
 */
export interface ProductInfo {
    id: string;
    tags?: Record<string, any>;
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
    facets?: Record<string, Array<{
        key: string;
        [k: string]: unknown;
    }>>;
}
/**
 * Proof information for condition validation
 */
export interface ProofInfo {
    id?: string;
    userId?: string;
    claimable?: boolean;
    virtual?: boolean;
}
/**
 * Collection information for condition validation
 */
export interface CollectionInfo {
    id: string;
    roles?: Record<string, any>;
}
/**
 * Parameters for condition validation
 */
export interface ConditionParams {
    /** The condition set to validate (if not using conditionId) */
    condition?: ConditionSet;
    /** ID of a condition to load and validate */
    conditionId?: string;
    /** Stack to prevent infinite recursion in nested conditions */
    conditionStack?: string[];
    /** User information */
    user?: UserInfo;
    /** Product information */
    product?: ProductInfo;
    /** Proof information */
    proof?: ProofInfo;
    /** Collection information */
    collection?: CollectionInfo;
    /** Statistics/tracking information */
    stats?: StatsInfo;
    /** Function to fetch conditions by ID (optional) */
    fetchCondition?: (collectionId: string, conditionId: string) => Promise<ConditionSet | null>;
    /** Function to get user's current location (optional) */
    getLocation?: () => Promise<{
        latitude: number;
        longitude: number;
    }>;
    /** Enable verbose condition evaluation logging for this invocation */
    debugConditions?: boolean | ConditionDebugOptions;
    /** Any additional custom fields for value-based conditions */
    [key: string]: any;
}
export type ConditionDebugLogger = (...args: any[]) => void;
export interface ConditionDebugOptions {
    enabled?: boolean;
    logger?: ConditionDebugLogger;
    label?: string;
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
export declare function validateCondition(params: ConditionParams): Promise<boolean>;
/**
 * Clear the condition cache
 */
export declare function clearConditionCache(): void;
