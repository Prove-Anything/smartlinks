// src/api/location.ts
import { request, post } from "../http"
import type {
  Location,
  LocationPayload,
  LocationSearchQuery,
  LocationSearchResponse,
} from "../types/location"

function buildQueryString(q: LocationSearchQuery = {}): string {
  const params = new URLSearchParams()
  if (q.q) params.set('q', q.q)
  if (q.category) params.set('category', q.category)
  if (q.countryCode) params.set('countryCode', q.countryCode)
  if (q.countryName) params.set('countryName', q.countryName)
  const limit = Math.min(Math.max(q.limit ?? 20, 1), 100)
  params.set('limit', String(limit))
  const sort = (q.sort ?? 'name') as 'name' | 'countryCode' | 'countryName'
  params.set('sort', sort)
  const s = params.toString()
  return s ? `?${s}` : ''
}

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
   * Admin: Search locations to pick during setup (combines collection + global)
   * GET /admin/collection/:collectionId/location/search
   */
  export async function search(
    collectionId: string,
    query: LocationSearchQuery = {}
  ): Promise<LocationSearchResponse> {
    const qs = buildQueryString(query)
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/location/search${qs}`
    return request<LocationSearchResponse>(path)
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
