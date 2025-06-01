// src/api/collection.ts
import { request } from "../http"
import { CollectionResponse } from "../types/collection"

export namespace collection {
  /**
   * Retrieves a single Collection by its ID.
   * @param collectionId – Identifier of the collection
   * @returns Promise resolving to a CollectionResponse object
   * @throws ErrorResponse if the request fails
   */
  export async function get(collectionId: string): Promise<CollectionResponse> {
    const path = `/public/collection/${encodeURIComponent(collectionId)}`
    return request<CollectionResponse>(path)
  }
}
