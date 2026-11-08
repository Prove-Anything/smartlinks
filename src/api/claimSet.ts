import { request, post, put, patch, del } from "../http";
import {
  ClaimSetScope,
  ClaimSetRange,
  CreateClaimSetRangeRequest,
  UpdateClaimSetRangeRequest,
  ClaimSetRangeTagsPage,
  ClaimSetRangeTag,
  ClaimSetRangeNextTag,
  ImportClaimSetRangeUidsRequest,
  ImportClaimSetRangeUidsResponse,
  AssignClaimSetRangeRequest,
  AssignClaimSetRangeResponse,
  ClaimSetRangeFile,
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

/** The range API's base for a scope: a collection's own sets, or a partner's sets. */
function rangesBase(scope: ClaimSetScope, claimSetId: string): string {
  const root = 'partnerId' in scope
    ? `/admin/partner/${encodeURIComponent(scope.partnerId)}/claimSet`
    : base(scope.collectionId)
  return `${root}/${encodeURIComponent(claimSetId)}/ranges`
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

  // ─── Ranges: mint, print, receive, assign ──────────────────────────────────────────────────────
  // A range is a named, contiguous block of tags in one claim set. Scope: { collectionId } for a
  // collection's own sets, { partnerId } for a partner's sets (see partner.*). Owners and admins mint,
  // export, import and program; assigners assign. Responses are never cached (they carry keys).
  export namespace ranges {
    /** The ranges in a set, lowest index first. */
    export async function list(scope: ClaimSetScope, claimSetId: string): Promise<ClaimSetRange[]> {
      return request<ClaimSetRange[]>(rangesBase(scope, claimSetId))
    }

    /** Reserve the set's next indexes and mint a code (and, for NTAG 424, a key) for each. */
    export async function create(scope: ClaimSetScope, claimSetId: string, params: CreateClaimSetRangeRequest): Promise<ClaimSetRange> {
      return post<ClaimSetRange>(rangesBase(scope, claimSetId), params)
    }

    /** One range, with its counts refreshed. */
    export async function get(scope: ClaimSetScope, claimSetId: string, rangeId: string): Promise<ClaimSetRange> {
      return request<ClaimSetRange>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}`)
    }

    /** Name, notes, order details, or a stage move (sent to the printer, received). */
    export async function update(scope: ClaimSetScope, claimSetId: string, rangeId: string, params: UpdateClaimSetRangeRequest): Promise<ClaimSetRange> {
      return patch<ClaimSetRange>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}`, params)
    }

    /** Finish minting a range that was interrupted. */
    export async function resume(scope: ClaimSetScope, claimSetId: string, rangeId: string): Promise<ClaimSetRange> {
      return post<ClaimSetRange>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/resume`, {})
    }

    /** The range's tags in index order, a page at a time (keys: owners/admins only). */
    export async function tags(
      scope: ClaimSetScope, claimSetId: string, rangeId: string,
      options: { from?: number; limit?: number; keys?: boolean } = {}
    ): Promise<ClaimSetRangeTagsPage> {
      const q = new URLSearchParams()
      if (options.from !== undefined) q.set('from', String(options.from))
      if (options.limit !== undefined) q.set('limit', String(options.limit))
      if (options.keys) q.set('keys', '1')
      const qs = q.toString()
      return request<ClaimSetRangeTagsPage>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/tags${qs ? `?${qs}` : ''}`)
    }

    /** The next tag to program on a phone (lowest index without a chip), with its URL and key. */
    export async function next(scope: ClaimSetScope, claimSetId: string, rangeId: string): Promise<ClaimSetRangeNextTag> {
      return request<ClaimSetRangeNextTag>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/next`)
    }

    /** Record the chip a phone just programmed with this code. */
    export async function recordTag(
      scope: ClaimSetScope, claimSetId: string, rangeId: string, code: string,
      params: { uid: string; data?: Record<string, unknown>; /** A plain (NTAG 21x) tag's write password, kept with the tag */ password?: string }
    ): Promise<{ tag: ClaimSetRangeTag; range: ClaimSetRange }> {
      return put<{ tag: ClaimSetRangeTag; range: ClaimSetRange }>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/tags/${encodeURIComponent(code)}`, params)
    }

    /** The printer file (CSV text in `csv`). Carries the tags' keys: don't keep it around. */
    export async function exportFile(scope: ClaimSetScope, claimSetId: string, rangeId: string): Promise<ClaimSetRangeFile> {
      return request<ClaimSetRangeFile>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/export?as=json`)
    }

    /** The manufacturer's instruction sheet: PDF (base64) or Markdown. */
    export async function instructions(scope: ClaimSetScope, claimSetId: string, rangeId: string, format: 'pdf' | 'md' = 'pdf'): Promise<ClaimSetRangeFile> {
      return request<ClaimSetRangeFile>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/instructions?format=${format}&as=json`)
    }

    /** The manufacturer's file back: check it (commit false), then write the chip UIDs (commit true). */
    export async function importUids(scope: ClaimSetScope, claimSetId: string, rangeId: string, params: ImportClaimSetRangeUidsRequest): Promise<ImportClaimSetRangeUidsResponse> {
      return post<ImportClaimSetRangeUidsResponse>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/import`, params)
    }

    /** Point the range (or from–to within it) at a collection / product / batch, or clear it. */
    export async function assign(scope: ClaimSetScope, claimSetId: string, rangeId: string, params: AssignClaimSetRangeRequest): Promise<AssignClaimSetRangeResponse> {
      return post<AssignClaimSetRangeResponse>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/assign`, params)
    }
  }
}


