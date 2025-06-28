import { post } from "../http";

export namespace claimSet {
  /**
   * Assign claims to a claim set.
   * @param collectionId – The collection identifier
   * @param data – The claims data to assign
   */
  export async function assignClaims(collectionId: string, data: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/${encodeURIComponent(data.id)}/assignClaims`;
    return post<any>(path, data);
  }

  /**
   * Update claim data for a collection.
   * @param collectionId – The collection identifier
   * @param data – The claim data to update
   */
  export async function updateClaimData(collectionId: string, data: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/claimSet/updateClaimData`;
    return post<any>(path, data);
  }
}
