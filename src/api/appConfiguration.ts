// src/api/appConfiguration.ts
import { request, post, del } from "../http"
import { 
  CollectionWidgetsResponse, 
  GetCollectionWidgetsOptions 
} from "../types/appManifest"

export type AppConfigOptions = {
  appId: string
  collectionId?: string
  productId?: string
  variantId?: string
  batchId?: string
  itemId?: string
  user?: boolean
  userData?: boolean
  admin?: boolean
  config?: any
  data?: any
}

function buildAppPath(opts: AppConfigOptions, type: "config" | "data" | "dataItem"): string {
  if (opts.user) {
    // /public/auth/app/:appId
    let path = `/public/auth/app/${encodeURIComponent(opts.appId)}`
    if (type === "data") path += "/data"
    if (type === "dataItem" && opts.itemId) path += `/data/${encodeURIComponent(opts.itemId)}`
    return path
  }
  if (opts.userData) {
    // /public/auth/app/:appId/data or /public/auth/app/:appId/data/:itemId
    let path = `/public/auth/app/${encodeURIComponent(opts.appId)}/data`
    if (type === "dataItem" && opts.itemId) path += `/${encodeURIComponent(opts.itemId)}`
    return path
  }

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

export namespace appConfiguration {
  // Get config (app, collection, product, variant, batch, user)
  export async function getConfig(opts: AppConfigOptions): Promise<any> {
    const path = buildAppPath(opts, "config")
    return request<any>(path)
  }

  // Set config (app, collection, product, variant, batch, user)
  export async function setConfig(opts: AppConfigOptions): Promise<any> {
    const path = buildAppPath(opts, "config")
    return post<any>(path, opts.config)
  }

  // Delete config (user only)
  export async function deleteConfig(opts: AppConfigOptions): Promise<void> {
    const path = buildAppPath(opts, "config")
    return del<void>(path)
  }

  // Get all data items (app, collection, product, variant, batch, userData)
  export async function getData(opts: AppConfigOptions): Promise<any[]> {
    const path = buildAppPath(opts, "data")
    return request<any[]>(path)
  }

  // Get a single data item (app, collection, product, variant, batch, userData)
  export async function getDataItem(opts: AppConfigOptions): Promise<any> {
    if (!opts.itemId) throw new Error("itemId is required for getDataItem")
    const path = buildAppPath(opts, "dataItem")
    return request<any>(path)
  }

  // Set a data item (app, collection, product, variant, batch, userData)
  export async function setDataItem(opts: AppConfigOptions): Promise<any> {
    const path = buildAppPath(opts, "data")
    return post<any>(path, opts.data)
  }

  // Delete a data item (app, collection, product, variant, batch, userData)
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
