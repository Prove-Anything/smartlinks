// src/api/collection.ts
import { request, post, put, del } from "../http.js";
export var collection;
(function (collection) {
    /**
     * Retrieves a single Collection by its ID.
     * @param collectionId – Identifier of the collection
     * @param admin – If true, fetches from the admin endpoint
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    async function get(collectionId, admin) {
        const base = admin ? '/admin/collection' : '/public/collection';
        const path = `${base}/${encodeURIComponent(collectionId)}`;
        return request(path);
    }
    collection.get = get;
    /**
     * Retrieves all Collections.
     * @param admin – If true, fetches from the admin endpoint
     * @returns Promise resolving to an array of CollectionResponse objects
     * @throws ErrorResponse if the request fails
     */
    async function list(admin) {
        const base = admin ? '/admin/collection' : '/public/collection';
        const path = `${base}`;
        return request(path);
    }
    collection.list = list;
    /**
     * Retrieve a collection by its shortId (public endpoint).
     * @param shortId – The short identifier of the collection
     * @returns Promise resolving to a CollectionResponse object
     */
    async function getShortId(shortId) {
        const path = `/public/collection/getShortId/${encodeURIComponent(shortId)}`;
        return request(path);
    }
    collection.getShortId = getShortId;
    /**
     * Resolve the collection for the current Hub domain (public endpoint).
     *
     * The server derives the requesting domain from the request headers
     * (`X-Source-Domain` / `X-Forwarded-Host` / `Host`), so no identifier is
     * passed — this is the call a Hub frontend makes on load to find out which
     * collection it is serving, whether it's reached via `{brand}.smartlinks.host`
     * or a bring-your-own custom domain (e.g. `hub.acme.com`).
     *
     * @returns Promise resolving to the CollectionResponse mapped to the domain
     * @throws ErrorResponse (404) if no collection is mapped to the domain
     */
    async function getByHub() {
        const path = `/public/collection/getByHub`;
        return request(path);
    }
    collection.getByHub = getByHub;
    /**
     * Resolve the collection for an explicit Hub domain (public endpoint).
     *
     * Unlike {@link getByHub}, the domain is passed explicitly rather than derived
     * from request headers — use this for raw/cross-origin calls where the Hub
     * frontend knows its own hostname (e.g. "erbauer.smartlinks.host").
     *
     * @param domain – The Hub domain to resolve (custom domain or {brand}.smartlinks.host)
     * @returns Promise resolving to the CollectionResponse mapped to the domain
     * @throws ErrorResponse (404) if no collection is mapped to the domain
     */
    async function getByDomain(domain) {
        const path = `/public/collection/by-domain/${encodeURIComponent(domain)}`;
        return request(path);
    }
    collection.getByDomain = getByDomain;
    /**
     * Check whether a Hub subdomain name is available to claim (admin only).
     * @param collectionId – Identifier of the collection making the request
     * @param name – Proposed subdomain prefix (lowercase letters, numbers, hyphens; max 63 chars)
     * @returns Promise resolving to { available, domain }
     * @throws ErrorResponse (400) if the name fails validation or is reserved
     */
    async function checkHubAvailability(collectionId, name) {
        const queryParams = new URLSearchParams({ name });
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/hub/available?${queryParams}`;
        return request(path);
    }
    collection.checkHubAvailability = checkHubAvailability;
    /**
     * Claim or rename the Hub subdomain for a collection (admin only).
     *
     * Maps `{hubName}.smartlinks.host` to the collection. If the collection
     * already had a different hub name, the previous subdomain is released
     * automatically.
     *
     * @param collectionId – Identifier of the collection
     * @param hubName – The subdomain prefix to claim (e.g. "acme")
     * @returns Promise resolving to the updated CollectionResponse (with hubName set)
     * @throws ErrorResponse (400) on invalid/reserved name, (409) if already taken by another collection
     */
    async function claimHub(collectionId, hubName) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/hub`;
        return post(path, { hubName });
    }
    collection.claimHub = claimHub;
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
    async function registerDomain(collectionId, domain, target = "smartlinks") {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/domain`;
        return post(path, { domain, target });
    }
    collection.registerDomain = registerDomain;
    /**
     * Get the managed-certificate status for a collection's custom domain (admin only).
     * @param collectionId – Identifier of the collection
     * @param target – Which domain to check: `"smartlinks"` (default, uses `redirectUrl`)
     *   or `"hub"` (uses `hubCustomDomain`)
     * @returns Promise resolving to the certificate details
     * @throws ErrorResponse (404) if the relevant domain is not set
     */
    async function getDomainStatus(collectionId, target = "smartlinks") {
        const queryParams = new URLSearchParams({ target });
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/domain?${queryParams}`;
        return request(path);
    }
    collection.getDomainStatus = getDomainStatus;
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
    async function getSettings(collectionId, settingGroup, admin) {
        const base = admin ? '/admin/collection' : '/public/collection';
        const path = `${base}/${encodeURIComponent(collectionId)}/settings/${encodeURIComponent(settingGroup)}`;
        return request(path);
    }
    collection.getSettings = getSettings;
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
    async function getAppsConfig(collectionId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/app/config`;
        return request(path);
    }
    collection.getAppsConfig = getAppsConfig;
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
    async function updateSettings(collectionId, settingGroup, settings) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/settings/${encodeURIComponent(settingGroup)}`;
        return post(path, settings);
    }
    collection.updateSettings = updateSettings;
    /**
     * Create a new collection (admin only).
     * @param data – Collection creation data
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    async function create(data) {
        const path = `/admin/collection`;
        return post(path, data);
    }
    collection.create = create;
    /**
     * Update a collection (admin only).
     * @param collectionId – Identifier of the collection
     * @param data – Collection update data
     * @returns Promise resolving to a CollectionResponse object
     * @throws ErrorResponse if the request fails
     */
    async function update(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}`;
        return put(path, data);
    }
    collection.update = update;
    /**
     * Delete a collection (admin only).
     * @param collectionId – Identifier of the collection
     * @returns Promise resolving to void
     * @throws ErrorResponse if the request fails
     */
    async function remove(collectionId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}`;
        return del(path);
    }
    collection.remove = remove;
    /**
     * Get serial numbers for a collection (admin only).
     * @param collectionId - Identifier of the collection
     * @param startIndex - Starting index for pagination (default: 0)
     * @param count - Number of serial numbers to retrieve (default: 10)
     * @returns Promise resolving to serial number data
     * @throws ErrorResponse if the request fails
     */
    async function getSN(collectionId, startIndex = 0, count = 10) {
        const queryParams = new URLSearchParams({
            startIndex: startIndex.toString(),
            count: count.toString()
        });
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/getSN?${queryParams}`;
        return request(path);
    }
    collection.getSN = getSN;
    /**
     * Look up a serial number by code for a collection (admin only).
     * @param collectionId - Identifier of the collection
     * @param codeId - The serial number code to look up
     * @returns Promise resolving to serial number lookup data
     * @throws ErrorResponse if the request fails
     */
    async function lookupSN(collectionId, codeId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/lookupSN/${encodeURIComponent(codeId)}`;
        return request(path);
    }
    collection.lookupSN = lookupSN;
    /**
     * Assign a value to a serial number for a collection (admin only).
     * @param collectionId - Identifier of the collection
     * @param codeId - The serial number code to assign
     * @param value - The value to assign to the serial number
     * @returns Promise resolving to assignment result
     * @throws ErrorResponse if the request fails
     */
    async function assignSN(collectionId, codeId, value) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/assignSN/${encodeURIComponent(codeId)}`;
        return post(path, { value });
    }
    collection.assignSN = assignSN;
    /**
     * List the users with access to a collection, each with their access level (admin only). Access is
     * stored in the collection's `roles` map (userId → level); this resolves each to name/email.
     * GET /admin/collection/:collectionId/getUsers
     * @param collectionId - Identifier of the collection
     * @returns Promise resolving to the collection's users
     */
    async function getUsers(collectionId) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/getUsers`);
    }
    collection.getUsers = getUsers;
    /**
     * Grant, change, or remove a user's access level on a collection (admin only). Pass `null` or
     * `'None'` to remove access. The server enforces privilege-escalation rules — you cannot grant an
     * access level above your own, nor change a user whose level is above yours.
     * POST /admin/collection/:collectionId/updateUserAccess
     * @param collectionId - Identifier of the collection
     * @param userId - The user (auth uid) whose access to change
     * @param access - The new access level, or `null` to remove access
     */
    async function setUserAccess(collectionId, userId, access) {
        await post(`/admin/collection/${encodeURIComponent(collectionId)}/updateUserAccess`, {
            userId,
            access: access !== null && access !== void 0 ? access : 'None'
        });
    }
    collection.setUserAccess = setUserAccess;
    /**
     * Invite a user to a collection by email (admin only). Creates or links their account in the login /
     * auth-kit collection (`loginCollectionId`, default `'global'`) and emails them an invite (new account)
     * or an added-to-collection notice (existing account); returns their `uid`. This does NOT grant access
     * on its own — follow with {@link setUserAccess} to set their level (this mirrors the console flow).
     * POST /user/inviteUser
     * @param collectionId - The collection the user is being added to (the invite's target)
     * @param input - Invite details (email, optional name, access level, login collection, origin)
     * @returns Promise resolving to the invited user's `{ uid }`
     */
    async function inviteUser(collectionId, input) {
        var _a, _b;
        const consoleOrigin = (_a = input.consoleOrigin) !== null && _a !== void 0 ? _a : (typeof window !== 'undefined' ? window.location.origin : undefined);
        return post(`/user/inviteUser`, {
            email: input.email.trim(),
            name: input.name,
            collectionId: (_b = input.loginCollectionId) !== null && _b !== void 0 ? _b : 'global',
            targetCollectionId: collectionId,
            accessLevel: input.access,
            consoleOrigin
        });
    }
    collection.inviteUser = inviteUser;
})(collection || (collection = {}));
