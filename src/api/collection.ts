// src/api/collection.ts
import { request, post, put, del } from "../http"
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
   * Retrieve a specific settings group for a collection (public endpoint).
   * @param collectionId – Identifier of the collection
   * @param settingGroup – The settings group name
   * @returns Promise resolving to the settings object
   */
  export async function getSettings(collectionId: string, settingGroup: string, admin?: boolean): Promise<any> {
    const base = admin ? '/admin/collection' : '/public/collection'
    const path = `${base}/${encodeURIComponent(collectionId)}/settings/${encodeURIComponent(settingGroup)}`
    return request<any>(path)
  }

  /**
   * Update a specific settings group for a collection (admin endpoint).
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
  export async function create(data: any): Promise<CollectionResponse> {
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
  export async function update(collectionId: string, data: any): Promise<CollectionResponse> {
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
