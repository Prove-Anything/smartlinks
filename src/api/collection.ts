// src/api/collection.ts
import { request } from "../http"
import { CollectionResponse } from "../types/collection"

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
}
