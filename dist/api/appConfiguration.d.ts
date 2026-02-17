import { CollectionWidgetsResponse, GetCollectionWidgetsOptions } from "../types/appManifest";
/**
 * Options for app configuration API calls.
 *
 * There are two distinct use cases:
 *
 * 1. **User-specific data** (userData or user flags):
 *    - Data is stored per user+app, shared across ALL collections
 *    - DO NOT provide collectionId or productId
 *    - Use for user preferences, personal settings, etc.
 *    - Example: User's allergies in an allergy app, garden layout in a garden app
 *
 * 2. **Collection/Product-scoped data** (admin or public):
 *    - Data is scoped to specific collection/product/variant/batch
 *    - Requires collectionId (and optionally productId, variantId, batchId)
 *    - Use for app configuration set by collection admins
 */
export type AppConfigOptions = {
    /** The app ID */
    appId: string;
    /** Collection ID - only for collection/product-scoped data, NOT for user data */
    collectionId?: string;
    /** Product ID - only for product-scoped data */
    productId?: string;
    /** Variant ID - only for variant-scoped data */
    variantId?: string;
    /** Batch ID - only for batch-scoped data */
    batchId?: string;
    /** For user's single config blob at /public/auth/app/:appId */
    user?: boolean;
    /** For user's multiple keyed data items at /public/auth/app/:appId/data */
    userData?: boolean;
    /** Item ID - required for getDataItem/deleteDataItem */
    itemId?: string;
    /** Use admin endpoints instead of public */
    admin?: boolean;
    /** Configuration object for setConfig */
    config?: any;
    /** Data object for setDataItem */
    data?: any;
};
export declare namespace appConfiguration {
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
    function getConfig(opts: AppConfigOptions): Promise<any>;
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
    function setConfig(opts: AppConfigOptions): Promise<any>;
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
    function deleteConfig(opts: AppConfigOptions): Promise<void>;
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
    function getData(opts: AppConfigOptions): Promise<any[]>;
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
    function getDataItem(opts: AppConfigOptions): Promise<any>;
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
    function setDataItem(opts: AppConfigOptions): Promise<any>;
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
