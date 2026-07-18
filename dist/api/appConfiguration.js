var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// src/api/appConfiguration.ts
import { request, post, del } from "../http";
import * as cache from "../cache";
import { collection as collectionApi } from "./collection";
function getWidgetsMap(config) {
    if (!config || typeof config !== 'object' || Array.isArray(config))
        return {};
    const widgets = config.widgets;
    if (!widgets || typeof widgets !== 'object' || Array.isArray(widgets))
        return {};
    return widgets;
}
function buildAppPath(opts, type) {
    const base = opts.admin ? "admin" : "public";
    let path = `/${base}`;
    if (opts.collectionId) {
        path += `/collection/${encodeURIComponent(opts.collectionId)}`;
        if (opts.productId) {
            path += `/product/${encodeURIComponent(opts.productId)}`;
            if (opts.variantId) {
                path += `/variant/${encodeURIComponent(opts.variantId)}`;
            }
            else if (opts.batchId) {
                path += `/batch/${encodeURIComponent(opts.batchId)}`;
            }
        }
    }
    path += `/app/${encodeURIComponent(opts.appId)}`;
    if (type === "data" || type === "dataItem") {
        path += "/data";
        if (type === "dataItem" && opts.itemId) {
            path += `/${encodeURIComponent(opts.itemId)}`;
        }
    }
    return path;
}
/**
 * User-specific app data storage.
 * This data is global per user+app and shared across all collections.
 * Perfect for personal preferences, settings, and user-generated content.
 *
 * @example
 * ```typescript
 * // Store user's garden bed layout
 * await userAppData.set('garden-planner', {
 *   id: 'bed-1',
 *   name: 'Vegetable Bed',
 *   plants: ['tomatoes', 'peppers']
 * });
 *
 * // Get all user's data for this app
 * const beds = await userAppData.list('garden-planner');
 *
 * // Get specific item
 * const bed = await userAppData.get('garden-planner', 'bed-1');
 *
 * // Remove item
 * await userAppData.remove('garden-planner', 'bed-1');
 * ```
 */
export var userAppData;
(function (userAppData) {
    /**
     * Get user's config blob for an app.
     * This is a single JSON object stored per user+app.
     *
     * @param appId - The app ID
     * @returns The user's config object
     *
     * @example
     * ```typescript
     * const config = await userAppData.getConfig('allergy-tracker');
     * // Returns: { allergies: ['peanuts'], notifications: true }
     * ```
     */
    async function getConfig(appId) {
        const path = `/public/auth/app/${encodeURIComponent(appId)}`;
        return request(path);
    }
    userAppData.getConfig = getConfig;
    /**
     * Set user's config blob for an app.
     *
     * @param appId - The app ID
     * @param config - The config object to store
     *
     * @example
     * ```typescript
     * await userAppData.setConfig('allergy-tracker', {
     *   allergies: ['peanuts', 'shellfish'],
     *   notifications: true
     * });
     * ```
     */
    async function setConfig(appId, config) {
        const path = `/public/auth/app/${encodeURIComponent(appId)}`;
        return post(path, config);
    }
    userAppData.setConfig = setConfig;
    /**
     * Delete user's config blob for an app.
     *
     * @param appId - The app ID
     *
     * @example
     * ```typescript
     * await userAppData.deleteConfig('allergy-tracker');
     * ```
     */
    async function deleteConfig(appId) {
        const path = `/public/auth/app/${encodeURIComponent(appId)}`;
        return del(path);
    }
    userAppData.deleteConfig = deleteConfig;
    /**
     * List all user's data items for an app.
     * Returns an array of objects, each with an `id` field.
     *
     * @param appId - The app ID
     * @returns Array of data items
     *
     * @example
     * ```typescript
     * const beds = await userAppData.list('garden-planner');
     * // Returns: [{ id: 'bed-1', name: 'Vegetables', ... }, { id: 'bed-2', ... }]
     * ```
     */
    async function list(appId) {
        const path = `/public/auth/app/${encodeURIComponent(appId)}/data`;
        return request(path);
    }
    userAppData.list = list;
    /**
     * Get a specific user data item by ID.
     *
     * @param appId - The app ID
     * @param itemId - The item ID
     * @returns The data item
     *
     * @example
     * ```typescript
     * const bed = await userAppData.get('garden-planner', 'bed-1');
     * // Returns: { id: 'bed-1', name: 'Vegetable Bed', plants: [...] }
     * ```
     */
    async function get(appId, itemId) {
        const path = `/public/auth/app/${encodeURIComponent(appId)}/data/${encodeURIComponent(itemId)}`;
        return request(path);
    }
    userAppData.get = get;
    /**
     * Create or update a user data item.
     * The item object must include an `id` field.
     *
     * @param appId - The app ID
     * @param item - The data item (must include `id`)
     * @returns The saved item
     *
     * @example
     * ```typescript
     * await userAppData.set('garden-planner', {
     *   id: 'bed-1',
     *   name: 'Vegetable Bed',
     *   plants: ['tomatoes', 'peppers'],
     *   location: { x: 10, y: 20 }
     * });
     * ```
     */
    async function set(appId, item) {
        const path = `/public/auth/app/${encodeURIComponent(appId)}/data`;
        return post(path, item);
    }
    userAppData.set = set;
    /**
     * Delete a user data item by ID.
     *
     * @param appId - The app ID
     * @param itemId - The item ID to delete
     *
     * @example
     * ```typescript
     * await userAppData.remove('garden-planner', 'bed-1');
     * ```
     */
    async function remove(appId, itemId) {
        const path = `/public/auth/app/${encodeURIComponent(appId)}/data/${encodeURIComponent(itemId)}`;
        return del(path);
    }
    userAppData.remove = remove;
})(userAppData || (userAppData = {}));
/**
 * Collection/Product-scoped app configuration.
 * This is admin-managed configuration that applies to all users within the scope.
 * Root-level config fields are typically part of the public view; if you need admin-only
 * values, store them under a top-level `admin` object so public reads can omit them.
 *
 * @example
 * ```typescript
 * // Get collection-level app config
 * const config = await appConfiguration.getConfig({
 *   appId: 'warranty-portal',
 *   collectionId: 'my-collection'
 * });
 *
 * // Set product-level config (admin only)
 * await appConfiguration.setConfig({
 *   appId: 'warranty-portal',
 *   collectionId: 'my-collection',
 *   productId: 'product-123',
 *   admin: true,
 *   config: { warrantyPeriod: 24 }
 * });
 *
 * // List product-level data items
 * const items = await appConfiguration.getData({
 *   appId: 'product-docs',
 *   collectionId: 'my-collection',
 *   productId: 'product-123'
 * });
 * ```
 */
export var appConfiguration;
(function (appConfiguration) {
    /**
    * Get app configuration for a collection/product scope.
    * Public reads return the public view of the config. If the stored config contains a
    * top-level `admin` object, that block is omitted from public responses and included
    * when `opts.admin === true`.
     *
     * @param opts - Configuration options including appId and scope (collectionId, productId, etc.)
     * @returns The configuration object
     *
     * @example
     * ```typescript
     * const config = await appConfiguration.getConfig({
     *   appId: 'warranty-portal',
     *   collectionId: 'my-collection'
     * });
     * ```
     */
    async function getConfig(opts) {
        const path = buildAppPath(opts, "config");
        return request(path);
    }
    appConfiguration.getConfig = getConfig;
    /**
     * Resolve a configured widget instance by ID from an app's stored config.
     * This is a thin convenience wrapper over `getConfig()` that reads `config.widgets[widgetId]`.
     *
     * @param opts - Scope options plus the widget instance ID
     * @returns The configured widget instance
     *
     * @example
     * ```typescript
     * const widget = await appConfiguration.getWidgetInstance({
     *   collectionId: 'my-collection',
     *   appId: 'widget-toolkit',
     *   widgetId: 'launch-countdown'
     * })
     * ```
     */
    async function getWidgetInstance(opts) {
        const { widgetId } = opts, configOpts = __rest(opts, ["widgetId"]);
        const config = await getConfig(configOpts);
        const widgets = getWidgetsMap(config);
        const instance = widgets[widgetId];
        if (!instance || typeof instance !== 'object' || Array.isArray(instance)) {
            throw new Error(`Widget instance \"${widgetId}\" not found for app \"${opts.appId}\"`);
        }
        return instance;
    }
    appConfiguration.getWidgetInstance = getWidgetInstance;
    /**
     * List configured widget instances for an app.
     * Useful for picker UIs, setup schemas, and widget-to-widget references.
     *
     * @param opts - App config scope options
     * @returns Array of widget instance summaries
     *
     * @example
     * ```typescript
     * const widgets = await appConfiguration.listWidgetInstances({
     *   collectionId: 'my-collection',
     *   appId: 'widget-toolkit'
     * })
     * ```
     */
    async function listWidgetInstances(opts) {
        const config = await getConfig(opts);
        const widgets = getWidgetsMap(config);
        return Object.entries(widgets).map(([id, instance]) => {
            var _a;
            const widgetInstance = instance && typeof instance === 'object' && !Array.isArray(instance)
                ? instance
                : {};
            const resolvedId = typeof widgetInstance.id === 'string' && widgetInstance.id.trim()
                ? widgetInstance.id
                : id;
            return Object.assign(Object.assign({}, widgetInstance), { id: resolvedId, name: typeof widgetInstance.name === 'string' && widgetInstance.name.trim()
                    ? widgetInstance.name
                    : resolvedId, type: typeof ((_a = widgetInstance.widget) === null || _a === void 0 ? void 0 : _a.type) === 'string'
                    ? widgetInstance.widget.type
                    : undefined });
        });
    }
    appConfiguration.listWidgetInstances = listWidgetInstances;
    /**
    * Set app configuration for a collection/product scope.
    * Requires admin authentication.
    * Writing through the admin endpoint does not make every root-level field private.
    * Use `config.admin` for confidential values that should only be returned on admin reads.
     *
     * @param opts - Configuration options including appId, scope, and config data
     * @returns The saved configuration
     *
     * @example
     * ```typescript
     * await appConfiguration.setConfig({
     *   appId: 'warranty-portal',
     *   collectionId: 'my-collection',
     *   admin: true,
     *   config: { warrantyPeriod: 24, supportEmail: 'support@example.com' }
     * });
     * ```
     */
    async function setConfig(opts) {
        const path = buildAppPath(opts, "config");
        return post(path, opts.config);
    }
    appConfiguration.setConfig = setConfig;
    /**
     * Delete app configuration for a collection/product scope.
     * Requires admin authentication.
     *
     * @param opts - Configuration options including appId and scope
     *
     * @example
     * ```typescript
     * await appConfiguration.deleteConfig({
     *   appId: 'warranty-portal',
     *   collectionId: 'my-collection',
     *   admin: true
     * });
     * ```
     */
    async function deleteConfig(opts) {
        const path = buildAppPath(opts, "config");
        return del(path);
    }
    appConfiguration.deleteConfig = deleteConfig;
    /**
      * Get all keyed data items for an app within a scope.
      * Best for a small set of standalone documents such as FAQs, menus, lookup tables,
      * or content fragments where the caller typically knows the item IDs.
      *
      * If you are modelling richer app entities that need filtering, lifecycle fields,
      * visibility, ownership, or relationships, prefer `app.records`, `app.cases`,
      * or `app.threads` instead.
     *
     * @param opts - Options including appId and scope (collectionId, productId, etc.)
     * @returns Array of data items
     *
     * @example
     * ```typescript
     * const items = await appConfiguration.getData({
     *   appId: 'product-docs',
     *   collectionId: 'my-collection',
     *   productId: 'product-123'
     * });
     * ```
     */
    async function getData(opts) {
        const path = buildAppPath(opts, "data");
        return request(path);
    }
    appConfiguration.getData = getData;
    /**
      * Get a single keyed data item by ID within a scope.
      * This is ideal when you already know the exact ID of a simple scoped document.
      *
      * For richer domain objects that users browse or query, prefer `app.records`,
      * `app.cases`, or `app.threads`.
     *
     * @param opts - Options including appId, scope, and itemId
     * @returns The data item
     *
     * @example
     * ```typescript
     * const item = await appConfiguration.getDataItem({
     *   appId: 'product-docs',
     *   collectionId: 'my-collection',
     *   productId: 'product-123',
     *   itemId: 'manual-1'
     * });
     * ```
     */
    async function getDataItem(opts) {
        if (!opts.itemId)
            throw new Error("itemId is required for getDataItem");
        const path = buildAppPath(opts, "dataItem");
        return request(path);
    }
    appConfiguration.getDataItem = getDataItem;
    /**
      * Set/create a keyed data item within a scope.
     * Requires admin authentication.
      *
      * Use this for simple scoped documents attached to a collection/product/variant/batch,
      * especially when you want a small number of items with stable IDs.
      *
      * Do not treat this as the default write path for every app-owned entity. If the data
      * starts behaving like a real object with lifecycle, filtering, visibility, ownership,
      * history, or relationships, prefer `app.records`, `app.cases`, or `app.threads`.
     *
     * @param opts - Options including appId, scope, and data
     * @returns The saved data item
     *
     * @example
     * ```typescript
     * await appConfiguration.setDataItem({
     *   appId: 'product-docs',
     *   collectionId: 'my-collection',
     *   productId: 'product-123',
     *   admin: true,
     *   data: { id: 'manual-1', title: 'User Manual', url: 'https://...' }
     * });
     * ```
     */
    async function setDataItem(opts) {
        const path = buildAppPath(opts, "data");
        return post(path, opts.data);
    }
    appConfiguration.setDataItem = setDataItem;
    /**
      * Delete a keyed data item by ID within a scope.
     * Requires admin authentication.
     *
     * @param opts - Options including appId, scope, and itemId
     *
     * @example
     * ```typescript
     * await appConfiguration.deleteDataItem({
     *   appId: 'product-docs',
     *   collectionId: 'my-collection',
     *   productId: 'product-123',
     *   admin: true,
     *   itemId: 'manual-1'
     * });
     * ```
     */
    async function deleteDataItem(opts) {
        if (!opts.itemId)
            throw new Error("itemId is required for deleteDataItem");
        const path = buildAppPath(opts, "dataItem");
        return del(path);
    }
    appConfiguration.deleteDataItem = deleteDataItem;
    /**
     * Fetches ALL widget data (manifests + bundle files) for a collection in one call.
     * Returns everything needed to render widgets with zero additional requests.
     *
     * This solves N+1 query problems by fetching manifests, JavaScript bundles,
     * and CSS files in parallel on the server.
     *
     * @param collectionId - The collection ID
     * @param options - Optional settings (force: bypass cache)
     * @returns Promise resolving to collection widgets with manifests and bundle files
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Fetch all widget data for a collection
     * const { apps } = await Api.AppConfiguration.getWidgets(collectionId);
     * // Returns: [{ appId, manifestUrl, manifest, bundleSource, bundleCss }, ...]
     *
     * // Convert bundle source to dynamic imports
     * for (const app of apps) {
     *   const blob = new Blob([app.bundleSource], { type: 'application/javascript' });
     *   const blobUrl = URL.createObjectURL(blob);
     *   const widgetModule = await import(blobUrl);
     *
     *   // Inject CSS if present
     *   if (app.bundleCss) {
     *     const styleTag = document.createElement('style');
     *     styleTag.textContent = app.bundleCss;
     *     document.head.appendChild(styleTag);
     *   }
     * }
     *
     * // Force refresh all widgets
     * const { apps } = await Api.AppConfiguration.getWidgets(collectionId, { force: true });
     * ```
     */
    async function getWidgets(collectionId, options) {
        let path = `/public/collection/${encodeURIComponent(collectionId)}/app/widgets`;
        if (options === null || options === void 0 ? void 0 : options.force) {
            path += '?force=true';
        }
        return request(path);
    }
    appConfiguration.getWidgets = getWidgets;
    const APP_CONFIG_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    function appConfigCacheKey(collectionId) {
        // Same key IframeResponder uses for this endpoint — sharing the cache
        // entry means whichever caller hits it first warms it for the other.
        return `apps:${collectionId}`;
    }
    /**
     * Resolve whether a feature flag is on, applying the `accountType` default:
     * `enterprise` accounts default every flag to **on** unless `features[flag]`
     * is explicitly `false`; `standard` accounts (or missing `accountType`)
     * default every flag to **off** unless `features[flag]` is explicitly `true`.
     * An explicit value always wins over the default either way.
     *
     * This is the same logic `isFeatureEnabled()` / `isFeatureEnabledSync()` use
     * internally — call those instead in normal code. `system.features` and
     * `accountType` are public data (no admin-only feature-check path exists),
     * so there's no reason to fetch differently for an admin surface. This is
     * exposed separately only for the rare case where you already have a
     * `system` block in hand from somewhere other than `getAppConfig()` (e.g.
     * server-rendered props) and want to resolve a flag from it directly.
     *
     * @example
     * ```typescript
     * const enabled = appConfiguration.resolveFeature(someSystemBlock, 'custom_domain');
     * ```
     */
    function resolveFeature(system, flag) {
        var _a;
        const value = (_a = system === null || system === void 0 ? void 0 : system.features) === null || _a === void 0 ? void 0 : _a[flag];
        if (value === true)
            return true;
        if (value === false)
            return false;
        return (system === null || system === void 0 ? void 0 : system.accountType) === 'enterprise';
    }
    appConfiguration.resolveFeature = resolveFeature;
    /**
     * Fetch the collection's app catalog + `appConfig` entitlements data in one
     * call — installed modules (`apps`), resolved entitlements (`system.features`,
     * `system.meters`, etc.), and item-handling settings. This is `/public/collection/:id/app/config`
     * (`collection.getAppsConfig()`), which now carries both; there's no need to
     * separately call `appConfiguration.getConfig({ appId: 'appConfig' })` for
     * public reads. Cached in-memory (and sessionStorage) for `ttl` so repeated
     * calls across a page/session are cheap; pass `force` to bypass the cache
     * after a mutation (e.g. after `entitlements-reconcile`).
     *
     * For admin-only data (`systemPrivate`), use
     * `appConfiguration.getConfig({ collectionId, appId: 'appConfig', admin: true })`
     * directly — this endpoint is public-only and never returns it.
     *
     * See docs/appConfig.md for the full contract.
     *
     * @example
     * ```typescript
     * const cfg = await appConfiguration.getAppConfig(collectionId);
     * console.log(cfg.system?.features);
     * ```
     */
    async function getAppConfig(collectionId, options) {
        const key = appConfigCacheKey(collectionId);
        if (options === null || options === void 0 ? void 0 : options.force)
            cache.invalidate(key);
        return cache.getOrFetch(key, () => collectionApi.getAppsConfig(collectionId), { ttl: APP_CONFIG_CACHE_TTL, storage: 'session' });
    }
    appConfiguration.getAppConfig = getAppConfig;
    /**
     * Check whether a feature flag is enabled for a collection, per
     * `appConfig.system.features` — applying the `accountType` default (see
     * `resolveFeature()`): enterprise accounts default every flag to on unless
     * explicitly set to `false`. This is the standard way for subapps to gate
     * features — it reads through the same cache as `getAppConfig`, so calling
     * it repeatedly (e.g. once per component) does not re-fetch on every call.
     *
     * This is always async because the very first call for a collection has
     * nothing to read yet. If you need a synchronous check (e.g. inside a
     * render function), call this once during app init to warm the cache,
     * then use `isFeatureEnabledSync()` afterwards.
     *
     * @example
     * ```typescript
     * if (await appConfiguration.isFeatureEnabled(collectionId, 'custom_domain')) {
     *   enableCustomDomainUI();
     * }
     * ```
     */
    async function isFeatureEnabled(collectionId, flag, options) {
        const cfg = await getAppConfig(collectionId, options);
        return resolveFeature(cfg === null || cfg === void 0 ? void 0 : cfg.system, flag);
    }
    appConfiguration.isFeatureEnabled = isFeatureEnabled;
    /**
     * Synchronous, cache-only check for a feature flag. Returns `undefined` if
     * `getAppConfig()` / `isFeatureEnabled()` hasn't been called yet for this
     * collection this page load (i.e. nothing to read without an await) — treat
     * `undefined` as "not yet known", not as "disabled".
     *
     * @example
     * ```typescript
     * // Warm the cache once, e.g. in a top-level effect:
     * useEffect(() => { appConfiguration.isFeatureEnabled(collectionId, 'custom_domain') }, [collectionId]);
     *
     * // Elsewhere, read synchronously without an await:
     * const enabled = appConfiguration.isFeatureEnabledSync(collectionId, 'custom_domain');
     * if (enabled === undefined) {
     *   // not warmed yet — fall back to a loading state or the async version
     * }
     * ```
     */
    function isFeatureEnabledSync(collectionId, flag) {
        const cfg = cache.peek(appConfigCacheKey(collectionId));
        if (!cfg)
            return undefined;
        return resolveFeature(cfg.system, flag);
    }
    appConfiguration.isFeatureEnabledSync = isFeatureEnabledSync;
})(appConfiguration || (appConfiguration = {}));
