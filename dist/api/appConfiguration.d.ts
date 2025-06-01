import { AppConfigurationResponse } from "../types/appConfiguration";
export declare namespace appConfiguration {
    /**
     * Retrieves a single App Configuration by Collection ID and App ID.
     * @param collectionId – Identifier of the parent collection
     * @param appId        – Identifier of the app configuration
     * @returns Promise resolving to an AppConfigurationResponse object
     * @throws ErrorResponse if the request fails
     */
    function get(collectionId: string, appId: string): Promise<AppConfigurationResponse>;
}
