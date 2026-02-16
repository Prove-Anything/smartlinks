import { CollectionWidgetsResponse, GetCollectionWidgetsOptions } from "../types/appManifest";
export type AppConfigOptions = {
    appId: string;
    collectionId?: string;
    productId?: string;
    variantId?: string;
    batchId?: string;
    itemId?: string;
    user?: boolean;
    userData?: boolean;
    admin?: boolean;
    config?: any;
    data?: any;
};
export declare namespace appConfiguration {
    function getConfig(opts: AppConfigOptions): Promise<any>;
    function setConfig(opts: AppConfigOptions): Promise<any>;
    function deleteConfig(opts: AppConfigOptions): Promise<void>;
    function getData(opts: AppConfigOptions): Promise<any[]>;
    function getDataItem(opts: AppConfigOptions): Promise<any>;
    function setDataItem(opts: AppConfigOptions): Promise<any>;
    function deleteDataItem(opts: AppConfigOptions): Promise<void>;
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
    function getWidgets(collectionId: string, options?: GetCollectionWidgetsOptions): Promise<CollectionWidgetsResponse>;
}
