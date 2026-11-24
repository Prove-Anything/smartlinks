// src/api/location.ts
import { request, post } from "../http"
import type {
  Location,
  LocationPayload,
  LocationSearchQuery,
} from "../types/location"
import type { ListResult } from "../types/list"
import { listQuery } from "../list"

export namespace location {
  /**
   * Platform: Create a global location (super admin; requires features.adminApps)
   * POST /platform/location
   */
  export async function createGlobal(params: LocationPayload): Promise<Location> {
    const path = `/platform/location`
    return post<Location>(path, params)
  }

  /**
   * Admin: Create a collection-scoped location
   * POST /admin/collection/:collectionId/location
   */
  export async function create(collectionId: string, params: LocationPayload): Promise<Location> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/location`
    return post<Location>(path, params)
  }

  /**
   * Admin: Search locations to pick during setup (combines collection + global). `q` is the search
   * text. `limit` says how many (default 20, at most 100) and `cursor` is the previous page's
   * `nextCursor`. `orderBy` sorts by one field: `name` (the default), `countryCode` or `countryName`.
   * GET /admin/collection/:collectionId/location/search
   *
   * @example
   * ```typescript
   * const { items, nextCursor } = await location.search('coll_123', {
   *   q: 'distillery', countryCode: 'GB', limit: 10, orderBy: [{ countryName: 'asc' }],
   * })
   * ```
   */
  export async function search(
    collectionId: string,
    query: LocationSearchQuery = {}
  ): Promise<ListResult<Location>> {
    const qs = listQuery(query)
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/location/search${qs}`
    return request<ListResult<Location>>(path)
  }

  /**
   * Public: Fetch a global location by ID
   * GET /public/location/:locationId
   */
  export async function getPublic(locationId: string): Promise<Location> {
    const path = `/public/location/${encodeURIComponent(locationId)}`
    return request<Location>(path)
  }

  /**
   * Public: Fetch a location for a collection; returns either a collection-owned or global fallback
   * GET /public/collection/:collectionId/location/:locationId
   */
  export async function getPublicForCollection(
    collectionId: string,
    locationId: string
  ): Promise<Location> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/location/${encodeURIComponent(locationId)}`
    return request<Location>(path)
  }
}
