import { CollectionWidgetsResponse, GetCollectionWidgetsOptions } from "../types/appManifest";
import type { GetWidgetInstanceOptions, WidgetInstance, WidgetInstanceSummary } from "../types/appConfiguration";
/**
 * Options for collection/product-scoped app configuration.
 * This data is set by admins and applies to all users within the scope.
 */
export type AppConfigOptions = {
    /** The app ID */
    appId: string;
    /** Collection ID (required for most operations) */
    collectionId?: string;
    /** Product ID (optional - for product-scoped config) */
    productId?: string;
    /** Variant ID (optional - for variant-scoped config) */
    variantId?: string;
    /** Batch ID (optional - for batch-scoped config) */
    batchId?: string;
    /** Item ID - required for getDataItem/deleteDataItem */
    itemId?: string;
    /** Use admin endpoints instead of public */
    admin?: boolean;
    /** Configuration object for setConfig */
    config?: any;
    /** Data object for setDataItem. Best for small keyed scoped documents rather than richer app domain objects. */
    data?: any;
};
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
export declare namespace userAppData {
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
    function getConfig(appId: string): Promise<any>;
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
    function setConfig(appId: string, config: any): Promise<any>;
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
    function deleteConfig(appId: string): Promise<void>;
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
    function list(appId: string): Promise<any[]>;
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
    function get(appId: string, itemId: string): Promise<any>;
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
    function set(appId: string, item: any): Promise<any>;
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
    function remove(appId: string, itemId: string): Promise<void>;
}
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
export declare namespace appConfiguration {
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
    function getConfig(opts: AppConfigOptions): Promise<any>;
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
    function getWidgetInstance<TWidget = any>(opts: GetWidgetInstanceOptions): Promise<WidgetInstance<TWidget>>;
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
    function listWidgetInstances(opts: Omit<GetWidgetInstanceOptions, 'widgetId'>): Promise<WidgetInstanceSummary[]>;
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
    function setConfig(opts: AppConfigOptions): Promise<any>;
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
    function deleteConfig(opts: AppConfigOptions): Promise<void>;
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
    function getData(opts: AppConfigOptions): Promise<any[]>;
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
    function getDataItem(opts: AppConfigOptions): Promise<any>;
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
    function setDataItem(opts: AppConfigOptions): Promise<any>;
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
