// src/api/appConfiguration.ts
import { request, post, del } from "../http";
function buildAppPath(opts, type) {
    // User-specific data is NEVER scoped to collection/product - it's global per user+app
    if (opts.user || opts.userData) {
        if (opts.collectionId || opts.productId) {
            throw new Error("User data endpoints do not accept collectionId or productId. User data is shared across all collections for a given app.");
        }
        if (opts.user) {
            // Single config blob: /public/auth/app/:appId
            let path = `/public/auth/app/${encodeURIComponent(opts.appId)}`;
            if (type === "data")
                path += "/data";
            if (type === "dataItem" && opts.itemId)
                path += `/data/${encodeURIComponent(opts.itemId)}`;
            return path;
        }
        // Multiple keyed data items: /public/auth/app/:appId/data or /public/auth/app/:appId/data/:itemId
        let path = `/public/auth/app/${encodeURIComponent(opts.appId)}/data`;
        if (type === "dataItem" && opts.itemId)
            path += `/${encodeURIComponent(opts.itemId)}`;
        return path;
    }
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
export var appConfiguration;
(function (appConfiguration) {
    /**
     * Get app configuration.
     *
     * Supports two types of configuration:
     * 1. **Collection/Product-scoped config** (set by admins): Provide `collectionId` and optionally `productId`
     * 2. **User-scoped config** (set by individual users): Set `user: true` - DO NOT provide collectionId
     *
     * @example
     * // Get user's personal app config (shared across all collections)
     * const userConfig = await appConfiguration.getConfig({
     *   appId: 'garden-planner',
     *   user: true
     * });
     *
     * @example
     * // Get collection-level app config (set by admins)
     * const collectionConfig = await appConfiguration.getConfig({
     *   appId: 'garden-planner',
     *   collectionId: 'my-collection'
     * });
     */
    async function getConfig(opts) {
        const path = buildAppPath(opts, "config");
        return request(path);
    }
    appConfiguration.getConfig = getConfig;
    /**
     * Set app configuration.
     *
     * Supports two types of configuration:
     * 1. **Collection/Product-scoped config** (set by admins): Provide `collectionId` and optionally `productId`
     * 2. **User-scoped config** (set by individual users): Set `user: true` - DO NOT provide collectionId
     *
     * @example
     * // Save user's personal app config (shared across all collections)
     * await appConfiguration.setConfig({
     *   appId: 'allergy-tracker',
     *   user: true,
     *   config: { allergies: ['peanuts', 'shellfish'] }
     * });
     */
    async function setConfig(opts) {
        const path = buildAppPath(opts, "config");
        return post(path, opts.config);
    }
    appConfiguration.setConfig = setConfig;
    /**
     * Delete app configuration.
     * Only supports user-scoped config deletion.
     *
     * @example
     * // Delete user's personal app config
     * await appConfiguration.deleteConfig({
     *   appId: 'garden-planner',
     *   user: true
     * });
     */
    async function deleteConfig(opts) {
        const path = buildAppPath(opts, "config");
        return del(path);
    }
    appConfiguration.deleteConfig = deleteConfig;
    /**
     * Get all data items for an app.
     *
     * Supports two types of data storage:
     * 1. **Collection/Product-scoped data** (managed by admins): Provide `collectionId` and optionally `productId`
     * 2. **User-scoped data** (managed by individual users): Set `userData: true` - DO NOT provide collectionId
     *
     * @example
     * // Get all user's personal data items (shared across all collections)
     * const userItems = await appConfiguration.getData({
     *   appId: 'garden-planner',
     *   userData: true
     * });
     * // Returns: [{ id: 'bed-1', ... }, { id: 'bed-2', ... }]
     */
    async function getData(opts) {
        const path = buildAppPath(opts, "data");
        return request(path);
    }
    appConfiguration.getData = getData;
    /**
     * Get a single data item by ID.
     *
     * Supports two types of data storage:
     * 1. **Collection/Product-scoped data** (managed by admins): Provide `collectionId` and optionally `productId`
     * 2. **User-scoped data** (managed by individual users): Set `userData: true` - DO NOT provide collectionId
     *
     * @example
     * // Get user's personal data item (shared across all collections)
     * const bed = await appConfiguration.getDataItem({
     *   appId: 'garden-planner',
     *   userData: true,
     *   itemId: 'bed-1'
     * });
     */
    async function getDataItem(opts) {
        if (!opts.itemId)
            throw new Error("itemId is required for getDataItem");
        const path = buildAppPath(opts, "dataItem");
        return request(path);
    }
    appConfiguration.getDataItem = getDataItem;
    /**
     * Set/create a data item.
     *
     * Supports two types of data storage:
     * 1. **Collection/Product-scoped data** (managed by admins): Provide `collectionId` and optionally `productId`
     * 2. **User-scoped data** (managed by individual users): Set `userData: true` - DO NOT provide collectionId
     *
     * @example
     * // Save user's personal data item (shared across all collections)
     * await appConfiguration.setDataItem({
     *   appId: 'garden-planner',
     *   userData: true,
     *   data: {
     *     id: 'bed-1',
     *     name: 'Vegetable Bed',
     *     plants: ['tomatoes', 'peppers']
     *   }
     * });
     */
    async function setDataItem(opts) {
        const path = buildAppPath(opts, "data");
        return post(path, opts.data);
    }
    appConfiguration.setDataItem = setDataItem;
    /**
     * Delete a data item by ID.
     *
     * Supports two types of data storage:
     * 1. **Collection/Product-scoped data** (managed by admins): Provide `collectionId` and optionally `productId`
     * 2. **User-scoped data** (managed by individual users): Set `userData: true` - DO NOT provide collectionId
     *
     * @example
     * // Delete user's personal data item
     * await appConfiguration.deleteDataItem({
     *   appId: 'garden-planner',
     *   userData: true,
     *   itemId: 'bed-1'
     * });
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
