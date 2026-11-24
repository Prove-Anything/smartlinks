import { request, post, put, patch, del } from "../http";
import {
  ClaimSetScope,
  ClaimSetRange,
  CreateClaimSetRangeRequest,
  UpdateClaimSetRangeRequest,
  ClaimSetRangeTag,
  ClaimSetRangeNextTag,
  ImportClaimSetRangeUidsRequest,
  ImportClaimSetRangeUidsResponse,
  AssignClaimSetRangeRequest,
  AddClaimSetRangeMemberRequest,
  AddClaimSetRangeMemberResponse,
  CloseClaimSetRangeResponse,
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
import type { ListResult, ListOptions } from "../types/list";
import { listQuery } from "../list";

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
   * Get all claim sets, a page at a time. Returns `{ items, nextCursor }`: the claim sets are in `items`;
   * pass `nextCursor` back as `cursor` for the next page (`null` means that was the last one).
   * When collectionId is provided, returns claim sets for that collection.
   * When omitted, returns all claim sets owned by the authenticated user.
   * @param collectionId – Optional collection identifier
   * @param options – `limit` (default 50) and `cursor`
   *
   * @example
   * ```typescript
   * let page = await claimSet.getAll('coll_123', { limit: 50 })
   * while (page.nextCursor) page = await claimSet.getAll('coll_123', { limit: 50, cursor: page.nextCursor })
   *
   * // Your own claim sets (no collection)
   * const { items } = await claimSet.getAll(undefined, { limit: 50 })
   * ```
   */
  export async function getAll(collectionId?: string, options: ListOptions = {}): Promise<ListResult<any>> {
    return request<ListResult<any>>(`${base(collectionId)}${listQuery({ limit: options.limit, cursor: options.cursor })}`);
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
   * Get all tags for a claim set (including data). This is not one of the SDK 3 lists: the answer is the
   * claim set itself with its tags inside. Without a collectionId (your own claim set) they are in `tags`;
   * with one they are in `codes` (the tag ids), or in `codeMap` (id → key) for a secure set.
   * @param claimSetId – The claim set identifier
   * @param collectionId – Optional collection identifier; omit for user-scoped access
   */
  export async function getAllTags(claimSetId: string, collectionId?: string): Promise<any> {
    return request<any>(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/tags`);
  }

  /**
   * Get assigned tags for a claim set — tags soft-assigned to a collection or product. Returns
   * `{ items, nextCursor }` with the claim set's own fields (`id`, `name`, …) beside them: the tags are
   * in `items`, a page at a time. Pass `nextCursor` back as `cursor` for the next page (`null` means that
   * was the last one).
   * @param claimSetId – The claim set identifier
   * @param collectionId – Optional collection identifier; omit for user-scoped access
   * @param options – `limit` (default 50) and `cursor`
   *
   * @example
   * ```typescript
   * let page = await claimSet.getAssignedTags('12', 'coll_123', { limit: 50 })
   * console.log(`Assigned tags of ${page.name}:`, page.items)
   * while (page.nextCursor) {
   *   page = await claimSet.getAssignedTags('12', 'coll_123', { limit: 50, cursor: page.nextCursor })
   * }
   * ```
   */
  export async function getAssignedTags(claimSetId: string, collectionId?: string, options: ListOptions = {}): Promise<ListResult<any> & Record<string, any>> {
    return request<ListResult<any> & Record<string, any>>(`${base(collectionId)}/${encodeURIComponent(claimSetId)}/assignedTags${listQuery({ limit: options.limit, cursor: options.cursor })}`);
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
    /**
     * The ranges in a set, lowest index first, a page at a time (50 unless you give a `limit`). Returns
     * `{ items, nextCursor }`: the ranges are in `items`; pass `nextCursor` back as `cursor` for the next
     * page (`null` means that was the last one).
     *
     * @example
     * ```typescript
     * let page = await claimSet.ranges.list({ collectionId: 'coll_123' }, '12', { limit: 50 })
     * while (page.nextCursor) {
     *   page = await claimSet.ranges.list({ collectionId: 'coll_123' }, '12', { limit: 50, cursor: page.nextCursor })
     * }
     * ```
     */
    export async function list(scope: ClaimSetScope, claimSetId: string, options: ListOptions = {}): Promise<ListResult<ClaimSetRange>> {
      return request<ListResult<ClaimSetRange>>(`${rangesBase(scope, claimSetId)}${listQuery({ limit: options.limit, cursor: options.cursor })}`)
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

    /** Close an open range: it becomes a range with the quantity it reached (removed if nothing was minted). */
    export async function close(scope: ClaimSetScope, claimSetId: string, rangeId: string): Promise<CloseClaimSetRangeResponse> {
      return post<CloseClaimSetRangeResponse>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/close`, {})
    }

    /** Put an existing tag of the set into a group (by code or chip UID), assigning it if a collection is given. */
    export async function addMember(scope: ClaimSetScope, claimSetId: string, groupId: string, params: AddClaimSetRangeMemberRequest): Promise<AddClaimSetRangeMemberResponse> {
      return post<AddClaimSetRangeMemberResponse>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(groupId)}/members`, params)
    }

    /** Take a tag out of a group. Its assignment is left as it is. */
    export async function removeMember(scope: ClaimSetScope, claimSetId: string, groupId: string, code: string): Promise<{ range: ClaimSetRange }> {
      return del<{ range: ClaimSetRange }>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(groupId)}/members/${encodeURIComponent(code)}`)
    }

    /**
     * The range's tags in index order, a page at a time (200 unless you give a `limit`, at most 1000).
     * Returns `{ items, nextCursor }`: pass `nextCursor` back as `cursor` for the next page; `null` means
     * that was the last one. `keys: true` includes each tag's key (owners and admins only).
     *
     * @example
     * ```typescript
     * let page = await claimSet.ranges.tags(scope, '12', rangeId, { limit: 500 })
     * while (page.nextCursor) {
     *   page = await claimSet.ranges.tags(scope, '12', rangeId, { limit: 500, cursor: page.nextCursor })
     * }
     * ```
     */
    export async function tags(
      scope: ClaimSetScope, claimSetId: string, rangeId: string,
      options: ListOptions & { keys?: boolean } = {}
    ): Promise<ListResult<ClaimSetRangeTag>> {
      const qs = listQuery({ limit: options.limit, cursor: options.cursor, keys: options.keys ? '1' : undefined })
      return request<ListResult<ClaimSetRangeTag>>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/tags${qs}`)
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

    /**
     * The printer file (CSV text in `csv`). Carries the tags' keys: don't keep it around. A computed set's
     * run downloads in parts: `from` / `to` are indexes inside the range, up to 200,000 tags a file.
     */
    export async function exportFile(scope: ClaimSetScope, claimSetId: string, rangeId: string, part?: { from?: number; to?: number }): Promise<ClaimSetRangeFile> {
      const q = new URLSearchParams({ as: 'json' })
      if (part && part.from !== undefined) q.set('from', String(part.from))
      if (part && part.to !== undefined) q.set('to', String(part.to))
      return request<ClaimSetRangeFile>(`${rangesBase(scope, claimSetId)}/${encodeURIComponent(rangeId)}/export?${q.toString()}`)
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


