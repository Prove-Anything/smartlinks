// src/api/appConfiguration.ts
import { request } from "../http";
export var appConfiguration;
(function (appConfiguration) {
    /**
     * Retrieves a single App Configuration by Collection ID and App ID.
     * @param collectionId – Identifier of the parent collection
     * @param appId        – Identifier of the app configuration
     * @returns Promise resolving to an AppConfigurationResponse object
     * @throws ErrorResponse if the request fails
     */
    async function get(collectionId, appId) {
        const path = `/public/collection/${encodeURIComponent(collectionId)}/app/${encodeURIComponent(appId)}`;
        return request(path);
    }
    appConfiguration.get = get;
})(appConfiguration || (appConfiguration = {}));
