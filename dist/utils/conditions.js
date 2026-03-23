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
const CONDITION_DEBUG_GLOBAL_KEY = 'SMARTLINKS_CONDITION_DEBUG';
function defaultConditionDebugLogger(...args) {
    if (typeof console === 'undefined')
        return;
    if (typeof console.debug === 'function') {
        console.debug(...args);
        return;
    }
    if (typeof console.log === 'function') {
        console.log(...args);
    }
}
function getGlobalConditionDebugOptions() {
    if (typeof globalThis === 'undefined') {
        return undefined;
    }
    const value = globalThis[CONDITION_DEBUG_GLOBAL_KEY];
    if (typeof value === 'boolean') {
        return value;
    }
    if (value && typeof value === 'object') {
        return value;
    }
    return undefined;
}
function resolveConditionDebugState(params) {
    var _a, _b, _c;
    const globalOptions = getGlobalConditionDebugOptions();
    const localOptions = params.debugConditions;
    const mergedOptions = Object.assign(Object.assign({}, (typeof globalOptions === 'object' ? globalOptions : {})), (typeof localOptions === 'object' ? localOptions : {}));
    let enabled = false;
    if (typeof globalOptions === 'boolean') {
        enabled = globalOptions;
    }
    else if (typeof globalOptions === 'object' && globalOptions) {
        enabled = (_a = globalOptions.enabled) !== null && _a !== void 0 ? _a : true;
    }
    if (typeof localOptions === 'boolean') {
        enabled = localOptions;
    }
    else if (typeof localOptions === 'object' && localOptions) {
        enabled = (_b = localOptions.enabled) !== null && _b !== void 0 ? _b : true;
    }
    if (!enabled) {
        return undefined;
    }
    return {
        depth: 0,
        label: mergedOptions.label,
        logger: (_c = mergedOptions.logger) !== null && _c !== void 0 ? _c : defaultConditionDebugLogger,
    };
}
function createChildDebugState(state) {
    if (!state) {
        return undefined;
    }
    return Object.assign(Object.assign({}, state), { depth: state.depth + 1 });
}
function logConditionDebug(state, message, context) {
    if (!state) {
        return;
    }
    const indent = '  '.repeat(state.depth);
    const prefix = state.label
        ? `[smartlinks:conditions:${state.label}]`
        : '[smartlinks:conditions]';
    if (context) {
        state.logger(`${prefix} ${indent}${message}`, context);
        return;
    }
    state.logger(`${prefix} ${indent}${message}`);
}
function summarizeConditionSet(condition) {
    var _a, _b, _c;
    return `${(_a = condition.type) !== null && _a !== void 0 ? _a : 'and'} (${(_c = (_b = condition.conditions) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0} conditions)`;
}
function summarizeCondition(condition) {
    var _a, _b;
    switch (condition.type) {
        case 'country':
            return `country regions=${((_a = condition.regions) === null || _a === void 0 ? void 0 : _a.join(',')) || 'none'} countries=${((_b = condition.countries) === null || _b === void 0 ? void 0 : _b.join(',')) || 'none'} contains=${condition.contains}`;
        case 'version':
            return `version [${condition.versions.join(', ')}] contains=${condition.contains}`;
        case 'device':
            return `device [${condition.displays.join(', ')}] contains=${condition.contains}`;
        case 'condition':
            return `condition ref=${condition.conditionId} passes=${condition.passes}`;
        case 'user':
            return `user type=${condition.userType}`;
        case 'product':
            return `product ids=${condition.productIds.join(', ')} contains=${condition.contains}`;
        case 'tag':
            return `tag tags=${condition.tags.join(', ')} contains=${condition.contains}`;
        case 'date':
            return `date test=${condition.dateTest}`;
        case 'geofence':
            return `geofence contains=${condition.contains}`;
        case 'value':
            return `value field=${condition.field} ${condition.validationType} ${String(condition.value)}`;
        case 'itemStatus':
            return `itemStatus ${condition.statusType}`;
        default:
            return 'unknown condition';
    }
}
async function evaluateConditionEntry(condition, params) {
    switch (condition.type) {
        case 'country':
            return validateCountry(condition, params);
        case 'version':
            return validateVersion(condition, params);
        case 'device':
            return validateDevice(condition, params);
        case 'condition':
            return validateNestedCondition(condition, params);
        case 'user':
            return validateUser(condition, params);
        case 'product':
            return validateProduct(condition, params);
        case 'tag':
            return validateTag(condition, params);
        case 'date':
            return validateDate(condition, params);
        case 'geofence':
            return validateGeofence(condition, params);
        case 'value':
            return validateValue(condition, params);
        case 'itemStatus':
            return validateItemStatus(condition, params);
        default:
            return undefined;
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
export async function validateCondition(params) {
    var _a, _b, _c;
    const internalParams = params;
    (_a = internalParams.__conditionDebugState) !== null && _a !== void 0 ? _a : (internalParams.__conditionDebugState = resolveConditionDebugState(params));
    const debugState = internalParams.__conditionDebugState;
    // If no condition specified, pass by default
    if (!params.conditionId && !params.condition) {
        logConditionDebug(debugState, 'No condition supplied; passing by default.');
        return true;
    }
    let cond = params.condition;
    // Load condition by ID if specified
    if (params.conditionId) {
        // Check cache first
        if (!conditionCache[params.conditionId]) {
            logConditionDebug(debugState, 'Condition cache miss.', { conditionId: params.conditionId });
            // Try to fetch if function provided
            if (params.fetchCondition && params.collection) {
                const fetchedCond = await params.fetchCondition(params.collection.id, params.conditionId);
                if (fetchedCond) {
                    conditionCache[params.conditionId] = fetchedCond;
                    logConditionDebug(debugState, 'Fetched condition into cache.', {
                        conditionId: params.conditionId,
                        conditionSet: summarizeConditionSet(fetchedCond),
                    });
                }
            }
        }
        if (!conditionCache[params.conditionId]) {
            logConditionDebug(debugState, 'Condition not found; passing by default.', { conditionId: params.conditionId });
            return true;
        }
        // Prevent infinite recursion
        (_b = params.conditionStack) !== null && _b !== void 0 ? _b : (params.conditionStack = []);
        params.conditionStack.push(params.conditionId);
        cond = conditionCache[params.conditionId];
    }
    else {
        logConditionDebug(debugState, 'Evaluating inline condition set.', {
            conditionSet: cond ? summarizeConditionSet(cond) : 'none',
        });
    }
    if (!cond) {
        logConditionDebug(debugState, 'Resolved condition set is empty; passing by default.');
        return true;
    }
    // Default to AND logic
    const conditionType = (_c = cond.type) !== null && _c !== void 0 ? _c : 'and';
    // Empty condition set passes
    if (!cond.conditions || cond.conditions.length === 0) {
        logConditionDebug(debugState, 'Condition set has no entries; passing by default.', {
            conditionSet: summarizeConditionSet(cond),
        });
        return true;
    }
    logConditionDebug(debugState, 'Condition set start.', {
        logic: conditionType,
        conditionCount: cond.conditions.length,
        conditionId: params.conditionId,
    });
    // Evaluate each condition
    for (const [index, c] of cond.conditions.entries()) {
        logConditionDebug(debugState, `Condition ${index + 1}/${cond.conditions.length} start: ${summarizeCondition(c)}`);
        const evaluation = await evaluateConditionEntry(c, internalParams);
        if (!evaluation) {
            logConditionDebug(debugState, `Condition ${index + 1} skipped: unknown type.`, { type: c.type });
            continue;
        }
        logConditionDebug(debugState, `Condition ${index + 1} result: ${evaluation.passed ? 'PASS' : 'FAIL'}`, Object.assign({ type: c.type, detail: evaluation.detail }, evaluation.context));
        // AND logic: if any condition fails, entire set fails
        if (!evaluation.passed && conditionType === 'and') {
            logConditionDebug(debugState, 'Condition set short-circuited to FAIL (AND logic).');
            return false;
        }
        // OR logic: if any condition passes, entire set passes
        if (evaluation.passed && conditionType === 'or') {
            logConditionDebug(debugState, 'Condition set short-circuited to PASS (OR logic).');
            return true;
        }
    }
    // AND: all passed
    if (conditionType === 'and') {
        logConditionDebug(debugState, 'Condition set result: PASS.');
        return true;
    }
    // OR: all failed
    logConditionDebug(debugState, 'Condition set result: FAIL.');
    return false;
}
/**
 * Validate country-based condition
 */
async function validateCountry(condition, params) {
    var _a, _b, _c;
    const country = (_b = (_a = params.user) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.country;
    if (!country) {
        return {
            passed: false,
            detail: 'User country was not available.',
        };
    }
    // Build country list from direct countries and any configured regions.
    const countryList = [...(condition.countries || [])];
    if ((_c = condition.regions) === null || _c === void 0 ? void 0 : _c.length) {
        for (const region of condition.regions) {
            if (REGION_COUNTRIES[region]) {
                countryList.push(...REGION_COUNTRIES[region]);
            }
        }
    }
    const normalizedCountryList = [...new Set(countryList)];
    if (!normalizedCountryList.length) {
        return {
            passed: false,
            detail: 'No countries or regions were configured on the condition.',
        };
    }
    const inList = normalizedCountryList.includes(country);
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
    };
}
/**
 * Validate version-based condition
 */
async function validateVersion(condition, params) {
    var _a, _b;
    const version = (_b = (_a = params.stats) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : null;
    const inList = condition.versions.includes(version);
    return {
        passed: condition.contains ? inList : !inList,
        detail: `Version ${version !== null && version !== void 0 ? version : 'null'} ${inList ? 'matched' : 'did not match'} the configured list.`,
        context: {
            version,
            versions: condition.versions,
            contains: condition.contains,
        },
    };
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
            return {
                passed: condition.contains,
                detail: 'Matched android platform.',
                context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
            };
        }
        if (display === 'ios' && (platform === null || platform === void 0 ? void 0 : platform.ios)) {
            return {
                passed: condition.contains,
                detail: 'Matched ios platform.',
                context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
            };
        }
        if (display === 'win' && (platform === null || platform === void 0 ? void 0 : platform.win)) {
            return {
                passed: condition.contains,
                detail: 'Matched win platform.',
                context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
            };
        }
        if (display === 'mac' && (platform === null || platform === void 0 ? void 0 : platform.mac)) {
            return {
                passed: condition.contains,
                detail: 'Matched mac platform.',
                context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
            };
        }
        if (display === 'desktop' && !mobile) {
            return {
                passed: condition.contains,
                detail: 'Matched desktop device mode.',
                context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
            };
        }
        if (display === 'mobile' && mobile) {
            return {
                passed: condition.contains,
                detail: 'Matched mobile device mode.',
                context: { matchedDisplay: display, contains: condition.contains, platform, mobile },
            };
        }
    }
    return {
        passed: !condition.contains,
        detail: 'No configured display matched the current platform/device.',
        context: { displays, contains: condition.contains, platform, mobile },
    };
}
/**
 * Validate nested condition reference
 */
async function validateNestedCondition(condition, params) {
    const newParams = Object.assign({}, params);
    newParams.conditionId = condition.conditionId;
    newParams.__conditionDebugState = createChildDebugState(params.__conditionDebugState);
    // Prevent infinite recursion
    newParams.conditionStack = [...(newParams.conditionStack || [])];
    if (newParams.conditionStack.includes(condition.conditionId)) {
        return {
            passed: true,
            detail: `Nested condition ${condition.conditionId} skipped to avoid recursion.`,
            context: { conditionId: condition.conditionId, conditionStack: newParams.conditionStack },
        };
    }
    const result = await validateCondition(newParams);
    return {
        passed: condition.passes ? result : !result,
        detail: `Nested condition ${condition.conditionId} ${result ? 'passed' : 'failed'} and passes=${condition.passes}.`,
        context: { conditionId: condition.conditionId, nestedResult: result, passes: condition.passes },
    };
}
/**
 * Validate user-based condition
 */
async function validateUser(condition, params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    const userType = condition.userType;
    switch (userType) {
        case 'valid':
            // User is logged in
            return {
                passed: (_b = (_a = params.user) === null || _a === void 0 ? void 0 : _a.valid) !== null && _b !== void 0 ? _b : false,
                detail: `User valid flag is ${(_d = (_c = params.user) === null || _c === void 0 ? void 0 : _c.valid) !== null && _d !== void 0 ? _d : false}.`,
            };
        case 'invalid':
            // User is not logged in
            return {
                passed: !((_f = (_e = params.user) === null || _e === void 0 ? void 0 : _e.valid) !== null && _f !== void 0 ? _f : false),
                detail: `User valid flag is ${(_h = (_g = params.user) === null || _g === void 0 ? void 0 : _g.valid) !== null && _h !== void 0 ? _h : false}.`,
            };
        case 'owner':
            // User owns the proof
            return {
                passed: !!(params.proof &&
                    ((_j = params.user) === null || _j === void 0 ? void 0 : _j.valid) &&
                    params.user.uid &&
                    params.user.uid === params.proof.userId),
                detail: 'Owner check compares user.uid with proof.userId.',
                context: {
                    userId: (_k = params.user) === null || _k === void 0 ? void 0 : _k.uid,
                    proofUserId: (_l = params.proof) === null || _l === void 0 ? void 0 : _l.userId,
                    userValid: (_o = (_m = params.user) === null || _m === void 0 ? void 0 : _m.valid) !== null && _o !== void 0 ? _o : false,
                },
            };
        case 'admin':
            // User is admin of the collection
            return {
                passed: !!(params.collection &&
                    ((_p = params.user) === null || _p === void 0 ? void 0 : _p.valid) &&
                    params.user.uid &&
                    params.collection.roles &&
                    params.collection.roles[params.user.uid]),
                detail: 'Admin check looks for a role entry on collection.roles.',
                context: {
                    userId: (_q = params.user) === null || _q === void 0 ? void 0 : _q.uid,
                    userValid: (_s = (_r = params.user) === null || _r === void 0 ? void 0 : _r.valid) !== null && _s !== void 0 ? _s : false,
                    hasRoles: !!((_t = params.collection) === null || _t === void 0 ? void 0 : _t.roles),
                },
            };
        case 'group':
            // User is member of specific group
            // TODO: Implement group membership check
            return {
                passed: !!(params.collection &&
                    ((_u = params.user) === null || _u === void 0 ? void 0 : _u.valid) &&
                    params.user.groups),
                detail: 'Group condition currently checks only that groups are present on the user.',
                context: {
                    groupId: condition.groupId,
                    groups: (_v = params.user) === null || _v === void 0 ? void 0 : _v.groups,
                    userValid: (_x = (_w = params.user) === null || _w === void 0 ? void 0 : _w.valid) !== null && _x !== void 0 ? _x : false,
                },
            };
        default:
            return {
                passed: true,
                detail: `Unknown userType ${userType}; passing by default.`,
            };
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
        return {
            passed: !condition.contains,
            detail: 'Product ID was not available.',
            context: { contains: condition.contains, productIds: condition.productIds },
        };
    }
    const inList = condition.productIds.includes(productId);
    return {
        passed: condition.contains ? inList : !inList,
        detail: `Product ${productId} ${inList ? 'matched' : 'did not match'} the configured list.`,
        context: { productId, productIds: condition.productIds, contains: condition.contains },
    };
}
/**
 * Validate tag-based condition
 */
async function validateTag(condition, params) {
    var _a, _b;
    const productId = (_a = params.product) === null || _a === void 0 ? void 0 : _a.id;
    // No product
    if (!productId) {
        return {
            passed: !condition.contains,
            detail: 'Product ID was not available.',
            context: { contains: condition.contains, tags: condition.tags },
        };
    }
    // No tags on product
    if (!((_b = params.product) === null || _b === void 0 ? void 0 : _b.tags)) {
        return {
            passed: !condition.contains,
            detail: 'Product tags were not available.',
            context: { productId, contains: condition.contains, tags: condition.tags },
        };
    }
    // Check if any condition tag exists on product
    for (const tag of condition.tags) {
        if (params.product.tags[tag]) {
            return {
                passed: condition.contains,
                detail: `Product ${productId} matched tag ${tag}.`,
                context: { productId, matchedTag: tag, contains: condition.contains },
            };
        }
    }
    return {
        passed: !condition.contains,
        detail: `Product ${productId} did not match any configured tag.`,
        context: { productId, tags: condition.tags, contains: condition.contains },
    };
}
/**
 * Validate date-based condition
 */
async function validateDate(condition, params) {
    const now = Date.now();
    switch (condition.dateTest) {
        case 'before':
            if (!condition.beforeDate) {
                return { passed: false, detail: 'beforeDate was not provided.' };
            }
            return {
                passed: now < Date.parse(condition.beforeDate),
                detail: `Current time is ${now < Date.parse(condition.beforeDate) ? 'before' : 'not before'} ${condition.beforeDate}.`,
                context: { now, beforeDate: condition.beforeDate },
            };
        case 'after':
            if (!condition.afterDate) {
                return { passed: false, detail: 'afterDate was not provided.' };
            }
            return {
                passed: now > Date.parse(condition.afterDate),
                detail: `Current time is ${now > Date.parse(condition.afterDate) ? 'after' : 'not after'} ${condition.afterDate}.`,
                context: { now, afterDate: condition.afterDate },
            };
        case 'between':
            if (!condition.rangeDate || condition.rangeDate.length !== 2) {
                return { passed: false, detail: 'rangeDate must contain exactly two entries.' };
            }
            const start = Date.parse(condition.rangeDate[0]);
            const end = Date.parse(condition.rangeDate[1]);
            return {
                passed: now > start && now < end,
                detail: `Current time is ${now > start && now < end ? 'within' : 'outside'} the configured date range.`,
                context: { now, start, end, rangeDate: condition.rangeDate },
            };
        default:
            return {
                passed: false,
                detail: `Unsupported dateTest ${condition.dateTest}.`,
            };
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
            return {
                passed: false,
                detail: 'getLocation threw while resolving user coordinates.',
                context: { error },
            };
        }
    }
    if (lat === undefined || lng === undefined) {
        return {
            passed: false,
            detail: 'Latitude/longitude were not available.',
        };
    }
    // Check if outside bounding box
    const outside = lat > condition.top ||
        lat < condition.bottom ||
        lng < condition.left ||
        lng > condition.right;
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
    };
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
            return {
                passed: false,
                detail: `Field ${condition.field} was not found in the provided params.`,
            };
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
    let passed = false;
    switch (condition.validationType) {
        case 'equal':
            passed = base == val;
            break;
        case 'not':
            passed = base != val;
            break;
        case 'greater':
            passed = base > val;
            break;
        case 'less':
            passed = base < val;
            break;
        default:
            return {
                passed: false,
                detail: `Unsupported validationType ${condition.validationType}.`,
            };
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
    };
}
/**
 * Validate item status condition
 */
async function validateItemStatus(condition, params) {
    switch (condition.statusType) {
        case 'isClaimable':
            return {
                passed: !!(params.proof && params.proof.claimable),
                detail: 'Checked proof.claimable for truthiness.',
            };
        case 'notClaimable':
            return {
                passed: !!(params.proof && !params.proof.claimable),
                detail: 'Checked proof.claimable for falsiness.',
            };
        case 'noProof':
            return {
                passed: !params.proof,
                detail: 'Checked that no proof object was provided.',
            };
        case 'hasProof':
            return {
                passed: !!params.proof,
                detail: 'Checked that a proof object was provided.',
            };
        case 'isVirtual':
            return {
                passed: !!(params.proof && params.proof.virtual),
                detail: 'Checked proof.virtual for truthiness.',
            };
        case 'notVirtual':
            return {
                passed: !!(params.proof && !params.proof.virtual),
                detail: 'Checked proof.virtual for falsiness.',
            };
        default:
            return {
                passed: false,
                detail: `Unsupported statusType ${condition.statusType}.`,
            };
    }
}
/**
 * Clear the condition cache
 */
export function clearConditionCache() {
    Object.keys(conditionCache).forEach(key => delete conditionCache[key]);
}
