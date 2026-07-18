import { CollectionResponse, CollectionCreateRequest, CollectionUpdateRequest, AppsConfigResponse, DomainTarget, HubAvailabilityResponse } from "../types/collection";
export declare namespace collection {
    /**
     * Retrieves a single Collection by its ID.
     * @param collectionId – Identifier of the collection
     * @param admin – If true, fetches from the admin endpoint
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    function get(collectionId: string, admin?: boolean): Promise<CollectionResponse>;
    /**
     * Retrieves all Collections.
     * @param admin – If true, fetches from the admin endpoint
     * @returns Promise resolving to an array of CollectionResponse objects
     * @throws ErrorResponse if the request fails
     */
    function list(admin?: boolean): Promise<CollectionResponse[]>;
    /**
     * Retrieve a collection by its shortId (public endpoint).
     * @param shortId – The short identifier of the collection
     * @returns Promise resolving to a CollectionResponse object
     */
    function getShortId(shortId: string): Promise<CollectionResponse>;
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
    function getByHub(): Promise<CollectionResponse>;
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
    function getByDomain(domain: string): Promise<CollectionResponse>;
    /**
     * Check whether a Hub subdomain name is available to claim (admin only).
     * @param collectionId – Identifier of the collection making the request
     * @param name – Proposed subdomain prefix (lowercase letters, numbers, hyphens; max 63 chars)
     * @returns Promise resolving to { available, domain }
     * @throws ErrorResponse (400) if the name fails validation or is reserved
     */
    function checkHubAvailability(collectionId: string, name: string): Promise<HubAvailabilityResponse>;
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
    function claimHub(collectionId: string, hubName: string): Promise<CollectionResponse>;
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
    function registerDomain(collectionId: string, domain: string, target?: DomainTarget): Promise<any>;
    /**
     * Get the managed-certificate status for a collection's custom domain (admin only).
     * @param collectionId – Identifier of the collection
     * @param target – Which domain to check: `"smartlinks"` (default, uses `redirectUrl`)
     *   or `"hub"` (uses `hubCustomDomain`)
     * @returns Promise resolving to the certificate details
     * @throws ErrorResponse (404) if the relevant domain is not set
     */
    function getDomainStatus(collectionId: string, target?: DomainTarget): Promise<any>;
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
    function getSettings(collectionId: string, settingGroup: string, admin?: boolean): Promise<any>;
    /**
     * Retrieve all configured app module definitions for a collection (public endpoint),
     * plus the collection's `appConfig` entitlements data (`system.features`, `system.meters`,
     * `entitledAppGroups`, `itemRecordMode`, etc.) in the same response. See docs/appConfig.md.
     * Prefer `appConfiguration.getAppConfig()` / `isFeatureEnabled()` for entitlement reads —
     * they call this endpoint under the hood and cache the result.
     * @param collectionId – Identifier of the collection
     * @returns Promise resolving to an AppsConfigResponse containing the app catalog and entitlements
     * @throws ErrorResponse if the request fails
     */
    function getAppsConfig(collectionId: string): Promise<AppsConfigResponse>;
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
    function updateSettings(collectionId: string, settingGroup: string, settings: any): Promise<any>;
    /**
     * Create a new collection (admin only).
     * @param data – Collection creation data
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    function create(data: CollectionCreateRequest): Promise<CollectionResponse>;
    /**
     * Update a collection (admin only).
     * @param collectionId – Identifier of the collection
     * @param data – Collection update data
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    function update(collectionId: string, data: CollectionUpdateRequest): Promise<CollectionResponse>;
    /**
     * Delete a collection (admin only).
     * @param collectionId – Identifier of the collection
     * @returns Promise resolving to void
     * @throws ErrorResponse if the request fails
     */
    function remove(collectionId: string): Promise<void>;
    /**
     * Get serial numbers for a collection (admin only).
     * @param collectionId - Identifier of the collection
     * @param startIndex - Starting index for pagination (default: 0)
     * @param count - Number of serial numbers to retrieve (default: 10)
     * @returns Promise resolving to serial number data
     * @throws ErrorResponse if the request fails
     */
    function getSN(collectionId: string, startIndex?: number, count?: number): Promise<any>;
    /**
     * Look up a serial number by code for a collection (admin only).
     * @param collectionId - Identifier of the collection
     * @param codeId - The serial number code to look up
     * @returns Promise resolving to serial number lookup data
     * @throws ErrorResponse if the request fails
     */
    function lookupSN(collectionId: string, codeId: string): Promise<any>;
    /**
     * Assign a value to a serial number for a collection (admin only).
     * @param collectionId - Identifier of the collection
     * @param codeId - The serial number code to assign
     * @param value - The value to assign to the serial number
     * @returns Promise resolving to assignment result
     * @throws ErrorResponse if the request fails
     */
    function assignSN(collectionId: string, codeId: string, value: any): Promise<any>;
}
