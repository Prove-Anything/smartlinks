// src/api/collection.ts
import { request, post, put, del } from "../http";
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
     * Retrieve a specific settings group for a collection (public endpoint).
     * @param collectionId – Identifier of the collection
     * @param settingGroup – The settings group name
     * @returns Promise resolving to the settings object
     */
    async function getSettings(collectionId, settingGroup, admin) {
        const base = admin ? '/admin/collection' : '/public/collection';
        const path = `${base}/${encodeURIComponent(collectionId)}/settings/${encodeURIComponent(settingGroup)}`;
        return request(path);
    }
    collection.getSettings = getSettings;
    /**
     * Update a specific settings group for a collection (admin endpoint).
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
})(collection || (collection = {}));
