// src/api/appConfiguration.ts
import { request, post, del } from "../http"
import { 
  CollectionWidgetsResponse, 
  GetCollectionWidgetsOptions 
} from "../types/appManifest"
import type {
  GetWidgetInstanceOptions,
  WidgetInstance,
  WidgetInstanceSummary,
} from "../types/appConfiguration"

/**
 * Options for collection/product-scoped app configuration.
 * This data is set by admins and applies to all users within the scope.
 */
export type AppConfigOptions = {
  /** The app ID */
  appId: string
  
  /** Collection ID (required for most operations) */
  collectionId?: string
  /** Product ID (optional - for product-scoped config) */
  productId?: string
  /** Variant ID (optional - for variant-scoped config) */
  variantId?: string
  /** Batch ID (optional - for batch-scoped config) */
  batchId?: string
  
  /** Item ID - required for getDataItem/deleteDataItem */
  itemId?: string
  
  /** Use admin endpoints instead of public */
  admin?: boolean
  
  /** Configuration object for setConfig */
  config?: any
  /** Data object for setDataItem. Best for small keyed scoped documents rather than richer app domain objects. */
  data?: any
}

function getWidgetsMap(config: any): Record<string, any> {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return {}
  const widgets = config.widgets
  if (!widgets || typeof widgets !== 'object' || Array.isArray(widgets)) return {}
  return widgets as Record<string, any>
}

function buildAppPath(opts: AppConfigOptions, type: "config" | "data" | "dataItem"): string {
  const base = opts.admin ? "admin" : "public"
  let path = `/${base}`

  if (opts.collectionId) {
    path += `/collection/${encodeURIComponent(opts.collectionId)}`
    if (opts.productId) {
      path += `/product/${encodeURIComponent(opts.productId)}`
      if (opts.variantId) {
        path += `/variant/${encodeURIComponent(opts.variantId)}`
      } else if (opts.batchId) {
        path += `/batch/${encodeURIComponent(opts.batchId)}`
      }
    }
  }

  path += `/app/${encodeURIComponent(opts.appId)}`

  if (type === "data" || type === "dataItem") {
    path += "/data"
    if (type === "dataItem" && opts.itemId) {
      path += `/${encodeURIComponent(opts.itemId)}`
    }
  }

  return path
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
export namespace userAppData {
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
  export async function getConfig(appId: string): Promise<any> {
    const path = `/public/auth/app/${encodeURIComponent(appId)}`
    return request<any>(path)
  }

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
  export async function setConfig(appId: string, config: any): Promise<any> {
    const path = `/public/auth/app/${encodeURIComponent(appId)}`
    return post<any>(path, config)
  }

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
  export async function deleteConfig(appId: string): Promise<void> {
    const path = `/public/auth/app/${encodeURIComponent(appId)}`
    return del<void>(path)
  }

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
  export async function list(appId: string): Promise<any[]> {
    const path = `/public/auth/app/${encodeURIComponent(appId)}/data`
    return request<any[]>(path)
  }

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
  export async function get(appId: string, itemId: string): Promise<any> {
    const path = `/public/auth/app/${encodeURIComponent(appId)}/data/${encodeURIComponent(itemId)}`
    return request<any>(path)
  }

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
  export async function set(appId: string, item: any): Promise<any> {
    const path = `/public/auth/app/${encodeURIComponent(appId)}/data`
    return post<any>(path, item)
  }

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
  export async function remove(appId: string, itemId: string): Promise<void> {
    const path = `/public/auth/app/${encodeURIComponent(appId)}/data/${encodeURIComponent(itemId)}`
    return del<void>(path)
  }
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
export namespace appConfiguration {
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
  export async function getConfig(opts: AppConfigOptions): Promise<any> {
    const path = buildAppPath(opts, "config")
    return request<any>(path)
  }

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
  export async function getWidgetInstance<TWidget = any>(
    opts: GetWidgetInstanceOptions
  ): Promise<WidgetInstance<TWidget>> {
    const { widgetId, ...configOpts } = opts
    const config = await getConfig(configOpts)
    const widgets = getWidgetsMap(config)
    const instance = widgets[widgetId]

    if (!instance || typeof instance !== 'object' || Array.isArray(instance)) {
      throw new Error(`Widget instance \"${widgetId}\" not found for app \"${opts.appId}\"`)
    }

    return instance as WidgetInstance<TWidget>
  }

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
  export async function listWidgetInstances(
    opts: Omit<GetWidgetInstanceOptions, 'widgetId'>
  ): Promise<WidgetInstanceSummary[]> {
    const config = await getConfig(opts)
    const widgets = getWidgetsMap(config)

    return Object.entries(widgets).map(([id, instance]) => {
      const widgetInstance = instance && typeof instance === 'object' && !Array.isArray(instance)
        ? instance as Record<string, any>
        : {}
      const resolvedId = typeof widgetInstance.id === 'string' && widgetInstance.id.trim()
        ? widgetInstance.id
        : id

      return {
        ...widgetInstance,
        id: resolvedId,
        name: typeof widgetInstance.name === 'string' && widgetInstance.name.trim()
          ? widgetInstance.name
          : resolvedId,
        type: typeof widgetInstance.widget?.type === 'string'
          ? widgetInstance.widget.type
          : undefined,
      }
    })
  }

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
  export async function setConfig(opts: AppConfigOptions): Promise<any> {
    const path = buildAppPath(opts, "config")
    return post<any>(path, opts.config)
  }

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
  export async function deleteConfig(opts: AppConfigOptions): Promise<void> {
    const path = buildAppPath(opts, "config")
    return del<void>(path)
  }

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
  export async function getData(opts: AppConfigOptions): Promise<any[]> {
    const path = buildAppPath(opts, "data")
    return request<any[]>(path)
  }

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
  export async function getDataItem(opts: AppConfigOptions): Promise<any> {
    if (!opts.itemId) throw new Error("itemId is required for getDataItem")
    const path = buildAppPath(opts, "dataItem")
    return request<any>(path)
  }

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
  export async function setDataItem(opts: AppConfigOptions): Promise<any> {
    const path = buildAppPath(opts, "data")
    return post<any>(path, opts.data)
  }

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
  export async function deleteDataItem(opts: AppConfigOptions): Promise<void> {
    if (!opts.itemId) throw new Error("itemId is required for deleteDataItem")
    const path = buildAppPath(opts, "dataItem")
    return del<void>(path)
  }

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
  export async function getWidgets(
    collectionId: string,
    options?: GetCollectionWidgetsOptions
  ): Promise<CollectionWidgetsResponse> {
    let path = `/public/collection/${encodeURIComponent(collectionId)}/app/widgets`;
    if (options?.force) {
      path += '?force=true';
    }
    return request<CollectionWidgetsResponse>(path);
  }
}
