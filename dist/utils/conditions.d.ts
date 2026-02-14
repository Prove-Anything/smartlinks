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
 * Union of all condition types
 */
export type Condition = CountryCondition | VersionCondition | DeviceCondition | NestedCondition | UserCondition | ProductCondition | TagCondition | DateCondition | GeofenceCondition | ValueCondition | ItemStatusCondition;
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
    /** Any additional custom fields for value-based conditions */
    [key: string]: any;
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
export declare function validateCondition(params: ConditionParams): Promise<boolean>;
/**
 * Clear the condition cache
 */
export declare function clearConditionCache(): void;
