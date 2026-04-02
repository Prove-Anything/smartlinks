import { request, post, put, del } from "../http";
import {
  UpdateClaimDataRequest,
  AssignClaimsRequest,
  CreateClaimSetTagRequest,
  CreateClaimSetTagResponse,
  CreateClaimSetRequest,
  ImportClaimSetTagsRequest,
  ImportClaimSetTagsResponse,
} from "../types";

/**
 * Returns the base path for claim set endpoints.
 * When collectionId is provided, routes to the collection-scoped admin API.
 * When omitted, routes to the user-scoped admin API (global claim sets).
 */
function base(collectionId?: string): string {
  return collectionId
    ? `/admin/collection/${encodeURIComponent(collectionId)}/claimSet`
    : `/admin/claimSet`;
}

export namespace claimSet {
  /**
   * Get all claim sets.
   * When collectionId is provided, returns claim sets for that collection.
   * When omitted, returns all claim sets owned by the authenticated user.
   * @param collectionId – Optional collection identifier
   */
  export async function getAll(collectionId?: string): Promise<any[]> {
    return request<any[]>(base(collectionId));
  }

  /**
   * Get a specific claim set by ID.
   * @param claimSetId – The claim set identifier
   * @param collectionId – Optional collection identifier; omit for user-scoped access
   */
  export async function get(claimSetId: string, collectionId?: string): Promise<any> {
    return request<any>(`${base(collectionId)}/${encodeURIComponent(claimSetId)}`);
  }

  /**
   * Create a new claim set.
   * When collectionId is provided, creates it scoped to that collection.
   * When omitted, creates a global user-owned claim set.
   * @param params – Claim set creation parameters
   * @param collectionId – Optional collection identifier
   */
  export async function create(params: CreateClaimSetRequest, collectionId?: string): Promise<any> {
    return post<any>(base(collectionId), params);
  }

  /**
   * Update a claim set.
   * @param claimSetId – The claim set identifier
   * @param params – Fields to update
   * @param collectionId – Optional collection identifier; omit for user-scoped access
   */
  export async function update(claimSetId: string, params: any, collectionId?: string): Promise<any> {
    return put<any>(`${base(collectionId)}/${encodeURIComponent(claimSetId)}`, params);
  }

  /**
   * Delete (soft-delete) a claim set.
   * @param claimSetId – The claim set identifier
   * @param collectionId – Optional collection identifier; omit for user-scoped access
   */
  export async function remove(claimSetId: string, collectionId?: string): Promise<any> {
    return del<any>(`${base(collectionId)}/${encodeURIComponent(claimSetId)}`);
  }

  /**
   * Get all tags for a claim set (including data).
   * @param claimSetId – The claim set identifier
   * @param collectionId – Optional collection identifier; omit for user-scoped access
   */
  export async function getAllTags(claimSetId: string, collectionId?: string): Promise<any> {
    return request<any>(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/tags`);
  }

  /**
   * Get assigned tags for a claim set — tags soft-assigned to a collection or product.
   * @param claimSetId – The claim set identifier
   * @param collectionId – Optional collection identifier; omit for user-scoped access
   */
  export async function getAssignedTags(claimSetId: string, collectionId?: string): Promise<any> {
    return request<any>(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/assignedTags`);
  }

  /**
   * Create a single tag inside a claim set.
   * @param claimSetId – The claim set identifier
   * @param data – Tag creation parameters
   * @param collectionId – Optional collection identifier; omit for user-scoped access
   */
  export async function createTag(
    claimSetId: string,
    data: CreateClaimSetTagRequest,
    collectionId?: string
  ): Promise<CreateClaimSetTagResponse> {
    return post<CreateClaimSetTagResponse>(
      `${base(collectionId)}/${encodeURIComponent(claimSetId)}/createTag`,
      data
    );
  }

  /**
   * Bulk import tags into a claim set.
   * @param claimSetId – The claim set identifier
   * @param data – Import parameters: tags array and optional mode ("upsert" | "replace")
   * @param collectionId – Optional collection identifier; omit for user-scoped access
   */
  export async function importTags(
    claimSetId: string,
    data: ImportClaimSetTagsRequest,
    collectionId?: string
  ): Promise<ImportClaimSetTagsResponse> {
    return post<ImportClaimSetTagsResponse>(
      `${base(collectionId)}/${encodeURIComponent(claimSetId)}/importTags`,
      data
    );
  }

  // ─── Collection-scoped-only operations ──────────────────────────────────────

  /**
   * Get a report for a claim set (collection-scoped).
   * @param collectionId – The collection identifier
   * @param claimSetId – The claim set identifier
   */
  export async function getReport(collectionId: string, claimSetId: string): Promise<any> {
    return request<any>(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/report`);
  }

  /**
   * Get tag summary for a collection.
   * @param collectionId – The collection identifier
   */
  export async function getTagSummary(collectionId: string): Promise<any> {
    return request<any>(`${base(collectionId)}/tagSummary`);
  }

  /**
   * Perform a tag query for a collection.
   * @param collectionId – The collection identifier
   * @param data – The query data
   */
  export async function tagQuery(collectionId: string, data: any): Promise<any> {
    return post<any>(`${base(collectionId)}/tagQuery`, data);
  }

  /**
   * Make a claim against a claim set (collection-scoped).
   * @param collectionId – The collection identifier
   * @param params – Claim parameters (must include id)
   */
  export async function makeClaim(collectionId: string, params: any): Promise<any> {
    return post<any>(`${base(collectionId)}/${encodeURIComponent(params.id)}/makeClaim`, params);
  }

  /**
   * Assign claims to codes or ranges within a collection.
   * @param collectionId – The collection identifier
   * @param data – Claims assignment data
   */
  export async function assignClaims(collectionId: string, data: AssignClaimsRequest): Promise<any> {
    return post<any>(`${base(collectionId)}/${encodeURIComponent(data.id)}/assignClaims`, data);
  }

  /**
   * Update claim data for a claim set (collection-scoped).
   * @param collectionId – The collection identifier
   * @param data – Claim data to update
   */
  export async function updateClaimData(collectionId: string, data: UpdateClaimDataRequest): Promise<any> {
    return post<any>(`${base(collectionId)}/updateClaimData`, data);
  }
}


