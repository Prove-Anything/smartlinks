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
     * Get all data items for an app within a scope.
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
     * Get a single data item by ID within a scope.
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
     * Set/create a data item within a scope.
     * Requires admin authentication.
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
     * Delete a data item by ID within a scope.
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
})(appConfiguration || (appConfiguration = {}));
