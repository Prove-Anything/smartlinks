// src/api/appConfiguration.ts
import { request, post, del } from "../http";
function buildAppPath(opts, type) {
    if (opts.user) {
        // /public/auth/app/:appId
        let path = `/public/auth/app/${encodeURIComponent(opts.appId)}`;
        if (type === "data")
            path += "/data";
        if (type === "dataItem" && opts.itemId)
            path += `/data/${encodeURIComponent(opts.itemId)}`;
        return path;
    }
    if (opts.userData) {
        // /public/auth/app/:appId/data or /public/auth/app/:appId/data/:itemId
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
    // Get config (app, collection, product, variant, batch, user)
    async function getConfig(opts) {
        const path = buildAppPath(opts, "config");
        return request(path);
    }
    appConfiguration.getConfig = getConfig;
    // Set config (app, collection, product, variant, batch, user)
    async function setConfig(opts) {
        const path = buildAppPath(opts, "config");
        return post(path, opts.config);
    }
    appConfiguration.setConfig = setConfig;
    // Delete config (user only)
    async function deleteConfig(opts) {
        const path = buildAppPath(opts, "config");
        return del(path);
    }
    appConfiguration.deleteConfig = deleteConfig;
    // Get all data items (app, collection, product, variant, batch, userData)
    async function getData(opts) {
        const path = buildAppPath(opts, "data");
        return request(path);
    }
    appConfiguration.getData = getData;
    // Get a single data item (app, collection, product, variant, batch, userData)
    async function getDataItem(opts) {
        if (!opts.itemId)
            throw new Error("itemId is required for getDataItem");
        const path = buildAppPath(opts, "dataItem");
        return request(path);
    }
    appConfiguration.getDataItem = getDataItem;
    // Set a data item (app, collection, product, variant, batch, userData)
    async function setDataItem(opts) {
        const path = buildAppPath(opts, "data");
        return post(path, opts.data);
    }
    appConfiguration.setDataItem = setDataItem;
    // Delete a data item (app, collection, product, variant, batch, userData)
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
