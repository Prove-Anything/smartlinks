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
})(appConfiguration || (appConfiguration = {}));
