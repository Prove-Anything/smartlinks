// src/api/appConfiguration.ts
import { request } from "../http"
import { AppConfigurationResponse } from "../types/appConfiguration"

export namespace appConfiguration {
  /**
   * Retrieves a single App Configuration by Collection ID and App ID.
   * @param collectionId – Identifier of the parent collection
   * @param appId        – Identifier of the app configuration
   * @returns Promise resolving to an AppConfigurationResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function get(
    collectionId: string,
    appId: string
  ): Promise<AppConfigurationResponse> {
    const path = `/public/collection/${encodeURIComponent(
      collectionId
    )}/app/${encodeURIComponent(appId)}`
    return request<AppConfigurationResponse>(path)
  }
}
