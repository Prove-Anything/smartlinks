import { request, post, put } from "../http";
import { UpdateClaimDataRequest, AssignClaimsRequest } from "../types";

export namespace claimSet {
  /**
   * Get all claim sets for a collection.
   * @param collectionId – The collection identifier
   * @returns Promise resolving to an array of claim sets
   */
  export async function getAllForCollection(collectionId: string): Promise<any[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet`;
    return request<any[]>(path);
  }

  /**
   * Get a specific claim set for a collection.
   * @param collectionId – The collection identifier
   * @param claimSetId – The claim set identifier
   * @returns Promise resolving to a claim set object
   */
  export async function getForCollection(collectionId: string, claimSetId: string): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(claimSetId)}`;
    return request<any>(path);
  }

  /**
   * Get all tags for a claim set.
   * @param collectionId – The collection identifier
   * @param claimSetId – The claim set identifier
   * @returns Promise resolving to an array of tags
   */
  export async function getAllTags(collectionId: string, claimSetId: string): Promise<any[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(claimSetId)}/tags`;
    return request<any[]>(path);
  }

  /**
   * Get a report for a claim set.
   * @param collectionId – The collection identifier
   * @param claimSetId – The claim set identifier
   * @returns Promise resolving to a report object
   */
  export async function getReport(collectionId: string, claimSetId: string): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(claimSetId)}/report`;
    return request<any>(path);
  }

  /**
   * Get assigned tags for a claim set.
   * @param collectionId – The collection identifier
   * @param claimSetId – The claim set identifier
   * @returns Promise resolving to assigned tags
   */
  export async function getAssignedTags(collectionId: string, claimSetId: string): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(claimSetId)}/assignedTags`;
    return request<any>(path);
  }

  /**
   * Get tag summary for a collection.
   * @param collectionId – The collection identifier
   * @returns Promise resolving to tag summary
   */
  export async function getTagSummary(collectionId: string): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/tagSummary`;
    return request<any>(path);
  }

  /**
   * Perform a tag query for a collection.
   * @param collectionId – The collection identifier
   * @param data – The query data
   * @returns Promise resolving to query results
   */
  export async function tagQuery(collectionId: string, data: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/tagQuery`;
    return post<any>(path, data);
  }

  /**
   * Create a new claim set for a collection.
   * @param collectionId – The collection identifier
   * @param params – The claim set creation parameters
   * @returns Promise resolving to the created claim set
   */
  export async function createForCollection(collectionId: string, params: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet`;
    return post<any>(path, params);
  }

  /**
   * Update a claim set for a collection.
   * @param collectionId – The collection identifier
   * @param params – The claim set update parameters (must include id)
   * @returns Promise resolving to the updated claim set
   */
  export async function updateForCollection(collectionId: string, params: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(params.id)}`;
    return put<any>(path, params);
  }

  /**
   * Make a claim for a claim set.
   * @param collectionId – The collection identifier
   * @param params – The claim parameters (must include id)
   * @returns Promise resolving to the claim result
   */
  export async function makeClaim(collectionId: string, params: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(params.id)}/makeClaim`;
    return post<any>(path, params);
  }

  /**
   * Assign claims to a claim set.
   * @param collectionId – The collection identifier
   * @param data – The claims data to assign
   *  {
   *    id: string,          // claim set id (required)
   *    collectionId: string,// required
   *    productId: string,   // required
   *    batchId?: string,    // optional
   *    start?: number,      // optional bulk range start
   *    end?: number,        // optional bulk range end
   *    codeId?: string,     // optional single code
   *    data?: { [k: string]: any } // optional claim key/values
   *  }
   */
  export async function assignClaims(collectionId: string, data: AssignClaimsRequest): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(data.id)}/assignClaims`;
    return post<any>(path, data);
  }

  /**
   * Update claim data for a collection.
   * @param collectionId – The collection identifier
   * @param data – The claim data to update
   */
  export async function updateClaimData(collectionId: string, data: UpdateClaimDataRequest): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/updateClaimData`;
    return post<any>(path, data);
  }
}
