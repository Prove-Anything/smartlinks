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
};
// Condition cache
const conditionCache = {};
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
export async function validateCondition(params) {
    var _a, _b;
    // If no condition specified, pass by default
    if (!params.conditionId && !params.condition) {
        return true;
    }
    let cond = params.condition;
    // Load condition by ID if specified
    if (params.conditionId) {
        // Check cache first
        if (!conditionCache[params.conditionId]) {
            // Try to fetch if function provided
            if (params.fetchCondition && params.collection) {
                const fetchedCond = await params.fetchCondition(params.collection.id, params.conditionId);
                if (fetchedCond) {
                    conditionCache[params.conditionId] = fetchedCond;
                }
            }
        }
        if (!conditionCache[params.conditionId]) {
            return true;
        }
        // Prevent infinite recursion
        (_a = params.conditionStack) !== null && _a !== void 0 ? _a : (params.conditionStack = []);
        params.conditionStack.push(params.conditionId);
        cond = conditionCache[params.conditionId];
    }
    if (!cond) {
        return true;
    }
    // Default to AND logic
    (_b = cond.type) !== null && _b !== void 0 ? _b : (cond.type = 'and');
    // Empty condition set passes
    if (!cond.conditions || cond.conditions.length === 0) {
        return true;
    }
    // Evaluate each condition
    for (const c of cond.conditions) {
        let result = false;
        switch (c.type) {
            case 'country':
                result = await validateCountry(c, params);
                break;
            case 'version':
                result = await validateVersion(c, params);
                break;
            case 'device':
                result = await validateDevice(c, params);
                break;
            case 'condition':
                result = await validateNestedCondition(c, params);
                break;
            case 'user':
                result = await validateUser(c, params);
                break;
            case 'product':
                result = await validateProduct(c, params);
                break;
            case 'tag':
                result = await validateTag(c, params);
                break;
            case 'date':
                result = await validateDate(c, params);
                break;
            case 'geofence':
                result = await validateGeofence(c, params);
                break;
            case 'value':
                result = await validateValue(c, params);
                break;
            case 'itemStatus':
                result = await validateItemStatus(c, params);
                break;
            default:
                // Unknown condition type, skip
                continue;
        }
        // AND logic: if any condition fails, entire set fails
        if (!result && cond.type === 'and') {
            return false;
        }
        // OR logic: if any condition passes, entire set passes
        if (result && cond.type === 'or') {
            return true;
        }
    }
    // AND: all passed
    if (cond.type === 'and') {
        return true;
    }
    // OR: all failed
    return false;
}
/**
 * Validate country-based condition
 */
async function validateCountry(condition, params) {
    var _a, _b, _c;
    const country = (_b = (_a = params.user) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.country;
    if (!country) {
        return false;
    }
    // Build country list from regions or direct country list
    let countryList = condition.countries || [];
    if (condition.useRegions && ((_c = condition.regions) === null || _c === void 0 ? void 0 : _c.length)) {
        countryList = [];
        for (const region of condition.regions) {
            if (REGION_COUNTRIES[region]) {
                countryList.push(...REGION_COUNTRIES[region]);
            }
        }
        // Remove duplicates
        countryList = [...new Set(countryList)];
    }
    if (!countryList.length) {
        return false;
    }
    const inList = countryList.includes(country);
    // contains=true: pass if country IS in list
    // contains=false: pass if country is NOT in list
    return condition.contains ? inList : !inList;
}
/**
 * Validate version-based condition
 */
async function validateVersion(condition, params) {
    var _a, _b;
    const version = (_b = (_a = params.stats) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : null;
    const inList = condition.versions.includes(version);
    return condition.contains ? inList : !inList;
}
/**
 * Validate device/platform condition
 */
async function validateDevice(condition, params) {
    var _a, _b;
    const displays = condition.displays;
    const platform = (_a = params.stats) === null || _a === void 0 ? void 0 : _a.platform;
    const mobile = (_b = params.stats) === null || _b === void 0 ? void 0 : _b.mobile;
    for (const display of displays) {
        if (display === 'android' && (platform === null || platform === void 0 ? void 0 : platform.android)) {
            return condition.contains;
        }
        if (display === 'ios' && (platform === null || platform === void 0 ? void 0 : platform.ios)) {
            return condition.contains;
        }
        if (display === 'win' && (platform === null || platform === void 0 ? void 0 : platform.win)) {
            return condition.contains;
        }
        if (display === 'mac' && (platform === null || platform === void 0 ? void 0 : platform.mac)) {
            return condition.contains;
        }
        if (display === 'desktop' && !mobile) {
            return condition.contains;
        }
        if (display === 'mobile' && mobile) {
            return condition.contains;
        }
    }
    return !condition.contains;
}
/**
 * Validate nested condition reference
 */
async function validateNestedCondition(condition, params) {
    const newParams = Object.assign({}, params);
    newParams.conditionId = condition.conditionId;
    // Prevent infinite recursion
    newParams.conditionStack = [...(newParams.conditionStack || [])];
    if (newParams.conditionStack.includes(condition.conditionId)) {
        return true;
    }
    const result = await validateCondition(newParams);
    return condition.passes ? result : !result;
}
/**
 * Validate user-based condition
 */
async function validateUser(condition, params) {
    var _a, _b, _c, _d, _e, _f, _g;
    const userType = condition.userType;
    switch (userType) {
        case 'valid':
            // User is logged in
            return (_b = (_a = params.user) === null || _a === void 0 ? void 0 : _a.valid) !== null && _b !== void 0 ? _b : false;
        case 'invalid':
            // User is not logged in
            return !((_d = (_c = params.user) === null || _c === void 0 ? void 0 : _c.valid) !== null && _d !== void 0 ? _d : false);
        case 'owner':
            // User owns the proof
            return !!(params.proof &&
                ((_e = params.user) === null || _e === void 0 ? void 0 : _e.valid) &&
                params.user.uid &&
                params.user.uid === params.proof.userId);
        case 'admin':
            // User is admin of the collection
            return !!(params.collection &&
                ((_f = params.user) === null || _f === void 0 ? void 0 : _f.valid) &&
                params.user.uid &&
                params.collection.roles &&
                params.collection.roles[params.user.uid]);
        case 'group':
            // User is member of specific group
            // TODO: Implement group membership check
            return !!(params.collection &&
                ((_g = params.user) === null || _g === void 0 ? void 0 : _g.valid) &&
                params.user.groups);
        default:
            return true;
    }
}
/**
 * Validate product-based condition
 */
async function validateProduct(condition, params) {
    var _a;
    const productId = (_a = params.product) === null || _a === void 0 ? void 0 : _a.id;
    // No product ID available
    if (!productId) {
        return !condition.contains;
    }
    const inList = condition.productIds.includes(productId);
    return condition.contains ? inList : !inList;
}
/**
 * Validate tag-based condition
 */
async function validateTag(condition, params) {
    var _a, _b;
    const productId = (_a = params.product) === null || _a === void 0 ? void 0 : _a.id;
    // No product
    if (!productId) {
        return !condition.contains;
    }
    // No tags on product
    if (!((_b = params.product) === null || _b === void 0 ? void 0 : _b.tags)) {
        return !condition.contains;
    }
    // Check if any condition tag exists on product
    for (const tag of condition.tags) {
        if (params.product.tags[tag]) {
            return condition.contains;
        }
    }
    return !condition.contains;
}
/**
 * Validate date-based condition
 */
async function validateDate(condition, params) {
    const now = Date.now();
    switch (condition.dateTest) {
        case 'before':
            if (!condition.beforeDate)
                return false;
            return now < Date.parse(condition.beforeDate);
        case 'after':
            if (!condition.afterDate)
                return false;
            return now > Date.parse(condition.afterDate);
        case 'between':
            if (!condition.rangeDate || condition.rangeDate.length !== 2)
                return false;
            const start = Date.parse(condition.rangeDate[0]);
            const end = Date.parse(condition.rangeDate[1]);
            return now > start && now < end;
        default:
            return false;
    }
}
/**
 * Validate geofence-based condition
 */
async function validateGeofence(condition, params) {
    var _a;
    let lat;
    let lng;
    // Try to get location from params first
    if ((_a = params.user) === null || _a === void 0 ? void 0 : _a.location) {
        lat = params.user.location.latitude;
        lng = params.user.location.longitude;
    }
    // If not available and getLocation function provided, fetch it
    if ((lat === undefined || lng === undefined) && params.getLocation) {
        try {
            const location = await params.getLocation();
            lat = location.latitude;
            lng = location.longitude;
        }
        catch (error) {
            return false;
        }
    }
    if (lat === undefined || lng === undefined) {
        return false;
    }
    // Check if outside bounding box
    const outside = lat > condition.top ||
        lat < condition.bottom ||
        lng < condition.left ||
        lng > condition.right;
    return condition.contains ? !outside : outside;
}
/**
 * Validate value comparison condition
 */
async function validateValue(condition, params) {
    // Navigate to field value using dot notation
    const fieldPath = condition.field.split('.');
    let base = params;
    for (const field of fieldPath) {
        if (base && typeof base === 'object' && field in base && typeof base[field] !== 'undefined') {
            base = base[field];
        }
        else {
            return false;
        }
    }
    // Convert value to correct type
    let val = condition.value;
    if (typeof val === 'string' && condition.fieldType === 'boolean') {
        val = val.toLowerCase() === 'true';
    }
    else if (typeof val === 'string' && condition.fieldType === 'integer') {
        val = parseInt(val, 10);
    }
    // Perform comparison
    switch (condition.validationType) {
        case 'equal':
            return base == val;
        case 'not':
            return base != val;
        case 'greater':
            return base > val;
        case 'less':
            return base < val;
        default:
            return false;
    }
}
/**
 * Validate item status condition
 */
async function validateItemStatus(condition, params) {
    switch (condition.statusType) {
        case 'isClaimable':
            return !!(params.proof && params.proof.claimable);
        case 'notClaimable':
            return !!(params.proof && !params.proof.claimable);
        case 'noProof':
            return !params.proof;
        case 'hasProof':
            return !!params.proof;
        case 'isVirtual':
            return !!(params.proof && params.proof.virtual);
        case 'notVirtual':
            return !!(params.proof && !params.proof.virtual);
        default:
            return false;
    }
}
/**
 * Clear the condition cache
 */
export function clearConditionCache() {
    Object.keys(conditionCache).forEach(key => delete conditionCache[key]);
}
