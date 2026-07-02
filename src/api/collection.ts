// src/api/collection.ts
import { request, post, put, del } from "../http"
import {
  CollectionResponse,
  CollectionCreateRequest,
  CollectionUpdateRequest,
  AppsConfigResponse,
  DomainTarget,
  HubAvailabilityResponse
} from "../types/collection"

export namespace collection {
  /**
   * Retrieves a single Collection by its ID.
   * @param collectionId – Identifier of the collection
   * @param admin – If true, fetches from the admin endpoint
   * @returns Promise resolving to a CollectionResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function get(collectionId: string, admin?: boolean): Promise<CollectionResponse> {
    const base = admin ? '/admin/collection' : '/public/collection';
    const path = `${base}/${encodeURIComponent(collectionId)}`;
    return request<CollectionResponse>(path);
  }

  /**
   * Retrieves all Collections.
   * @param admin – If true, fetches from the admin endpoint
   * @returns Promise resolving to an array of CollectionResponse objects
   * @throws ErrorResponse if the request fails
   */
  export async function list(admin?: boolean): Promise<CollectionResponse[]> {
    const base = admin ? '/admin/collection' : '/public/collection';
    const path = `${base}`;
    return request<CollectionResponse[]>(path);
  }

  /**
   * Retrieve a collection by its shortId (public endpoint).
   * @param shortId – The short identifier of the collection
   * @returns Promise resolving to a CollectionResponse object
   */
  export async function getShortId(shortId: string): Promise<CollectionResponse> {
    const path = `/public/collection/getShortId/${encodeURIComponent(shortId)}`
    return request<CollectionResponse>(path)
  }

  /**
   * Resolve the collection for the current Hub domain (public endpoint).
   *
   * The server derives the requesting domain from the request headers
   * (`X-Source-Domain` / `X-Forwarded-Host` / `Host`), so no identifier is
   * passed — this is the call a Hub frontend makes on load to find out which
   * collection it is serving, whether it's reached via `{brand}.mysmartlinks.app`
   * or a bring-your-own custom domain (e.g. `hub.acme.com`).
   *
   * @returns Promise resolving to the CollectionResponse mapped to the domain
   * @throws ErrorResponse (404) if no collection is mapped to the domain
   */
  export async function getByHub(): Promise<CollectionResponse> {
    const path = `/public/collection/getByHub`
    return request<CollectionResponse>(path)
  }

  /**
   * Resolve the collection for an explicit Hub domain (public endpoint).
   *
   * Unlike {@link getByHub}, the domain is passed explicitly rather than derived
   * from request headers — use this for raw/cross-origin calls where the Hub
   * frontend knows its own hostname (e.g. "erbauer.mysmartlinks.app").
   *
   * @param domain – The Hub domain to resolve (custom domain or {brand}.mysmartlinks.app)
   * @returns Promise resolving to the CollectionResponse mapped to the domain
   * @throws ErrorResponse (404) if no collection is mapped to the domain
   */
  export async function getByDomain(domain: string): Promise<CollectionResponse> {
    const path = `/public/collection/by-domain/${encodeURIComponent(domain)}`
    return request<CollectionResponse>(path)
  }

  /**
   * Check whether a Hub subdomain name is available to claim (admin only).
   * @param collectionId – Identifier of the collection making the request
   * @param name – Proposed subdomain prefix (lowercase letters, numbers, hyphens; max 63 chars)
   * @returns Promise resolving to { available, domain }
   * @throws ErrorResponse (400) if the name fails validation or is reserved
   */
  export async function checkHubAvailability(collectionId: string, name: string): Promise<HubAvailabilityResponse> {
    const queryParams = new URLSearchParams({ name })
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/hub/available?${queryParams}`
    return request<HubAvailabilityResponse>(path)
  }

  /**
   * Claim or rename the Hub subdomain for a collection (admin only).
   *
   * Maps `{hubName}.mysmartlinks.app` to the collection. If the collection
   * already had a different hub name, the previous subdomain is released
   * automatically.
   *
   * @param collectionId – Identifier of the collection
   * @param hubName – The subdomain prefix to claim (e.g. "acme")
   * @returns Promise resolving to the updated CollectionResponse (with hubName set)
   * @throws ErrorResponse (400) on invalid/reserved name, (409) if already taken by another collection
   */
  export async function claimHub(collectionId: string, hubName: string): Promise<CollectionResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/hub`
    return post<CollectionResponse>(path, { hubName })
  }

  /**
   * Register a custom domain for a collection and provision its managed
   * certificate (admin only).
   *
   * @param collectionId – Identifier of the collection
   * @param domain – The fully-qualified domain to register (e.g. "hub.acme.com")
   * @param target – Which load balancer / certificate map to use. Defaults to
   *   `"smartlinks"` (the id.smartlinks.app load balancer). Pass `"hub"` to
   *   register a bring-your-own Hub domain.
   * @returns Promise resolving when registration has been initiated
   * @throws ErrorResponse if the request fails
   */
  export async function registerDomain(collectionId: string, domain: string, target: DomainTarget = "smartlinks"): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/domain`
    return post<any>(path, { domain, target })
  }

  /**
   * Get the managed-certificate status for a collection's custom domain (admin only).
   * @param collectionId – Identifier of the collection
   * @param target – Which domain to check: `"smartlinks"` (default, uses `redirectUrl`)
   *   or `"hub"` (uses `hubCustomDomain`)
   * @returns Promise resolving to the certificate details
   * @throws ErrorResponse (404) if the relevant domain is not set
   */
  export async function getDomainStatus(collectionId: string, target: DomainTarget = "smartlinks"): Promise<any> {
    const queryParams = new URLSearchParams({ target })
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/domain?${queryParams}`
    return request<any>(path)
  }

  /**
   * Retrieve a specific settings group for a collection.
   * Public reads return the public view of the settings group. If the stored payload contains
   * a top-level `admin` object, that block is omitted from public responses and included when
   * `admin === true`.
   * @param collectionId – Identifier of the collection
   * @param settingGroup – The settings group name
   * @param admin – If true, use the admin endpoint and include the admin-only settings block
   * @returns Promise resolving to the settings object
   */
  export async function getSettings(collectionId: string, settingGroup: string, admin?: boolean): Promise<any> {
    const base = admin ? '/admin/collection' : '/public/collection'
    const path = `${base}/${encodeURIComponent(collectionId)}/settings/${encodeURIComponent(settingGroup)}`
    return request<any>(path)
  }

  /**
   * Retrieve all configured app module definitions for a collection (public endpoint).
   * @param collectionId – Identifier of the collection
   * @returns Promise resolving to an AppsConfigResponse containing all app configurations
   * @throws ErrorResponse if the request fails
   */
  export async function getAppsConfig(collectionId: string): Promise<AppsConfigResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}/app/config`
    return request<AppsConfigResponse>(path)
  }

  /**
   * Update a specific settings group for a collection (admin endpoint).
   * This writes through the admin endpoint, but root-level fields are still part of the public
   * settings payload. Put confidential values under `settings.admin` if they should only be
   * returned on admin reads.
   * @param collectionId – Identifier of the collection
   * @param settingGroup – The settings group name
   * @param settings – The settings payload to persist
   * @returns Promise resolving to the updated settings
   */
  export async function updateSettings(collectionId: string, settingGroup: string, settings: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/settings/${encodeURIComponent(settingGroup)}`
    return post<any>(path, settings)
  }

  /**
   * Create a new collection (admin only).
   * @param data – Collection creation data
   * @returns Promise resolving to a CollectionResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function create(data: CollectionCreateRequest): Promise<CollectionResponse> {
    const path = `/admin/collection`;
    return post<CollectionResponse>(path, data);
  }

  /**
   * Update a collection (admin only).
   * @param collectionId – Identifier of the collection
   * @param data – Collection update data
   * @returns Promise resolving to a CollectionResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function update(collectionId: string, data: CollectionUpdateRequest): Promise<CollectionResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}`;
    return put<CollectionResponse>(path, data);
  }

  /**
   * Delete a collection (admin only).
   * @param collectionId – Identifier of the collection
   * @returns Promise resolving to void
   * @throws ErrorResponse if the request fails
   */
  export async function remove(collectionId: string): Promise<void> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}`;
    return del<void>(path);
  }

  /**
   * Get serial numbers for a collection (admin only).
   * @param collectionId - Identifier of the collection
   * @param startIndex - Starting index for pagination (default: 0)
   * @param count - Number of serial numbers to retrieve (default: 10)
   * @returns Promise resolving to serial number data
   * @throws ErrorResponse if the request fails
   */
  export async function getSN(
    collectionId: string,
    startIndex: number = 0,
    count: number = 10
  ): Promise<any> {
    const queryParams = new URLSearchParams({
      startIndex: startIndex.toString(),
      count: count.toString()
    })
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/getSN?${queryParams}`
    return request<any>(path)
  }

  /**
   * Look up a serial number by code for a collection (admin only).
   * @param collectionId - Identifier of the collection
   * @param codeId - The serial number code to look up
   * @returns Promise resolving to serial number lookup data
   * @throws ErrorResponse if the request fails
   */
  export async function lookupSN(
    collectionId: string,
    codeId: string
  ): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/lookupSN/${encodeURIComponent(codeId)}`
    return request<any>(path)
  }

  /**
   * Assign a value to a serial number for a collection (admin only).
   * @param collectionId - Identifier of the collection
   * @param codeId - The serial number code to assign
   * @param value - The value to assign to the serial number
   * @returns Promise resolving to assignment result
   * @throws ErrorResponse if the request fails
   */
  export async function assignSN(
    collectionId: string,
    codeId: string,
    value: any
  ): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/assignSN/${encodeURIComponent(codeId)}`
    return post<any>(path, { value })
  }
}
