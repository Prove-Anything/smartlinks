import { request, post } from "../http";
import { Partner, PartnerClaimSet, CreatePartnerClaimSetRequest, PartnerTagHit, ClientErrorEvent } from "../types";
import type { ListResult, ListOptions } from "../types/list";
import { listQuery } from "../list";

/**
 * Partners: organisations above collections (FanConnect, Zenith Coins, …) that own NFC claim sets and
 * assign their tags into collections their people administer. Partners and their members are set up by
 * SmartLinks staff; these calls are what a partner's people use. Ranges inside a partner's sets:
 * claimSet.ranges.* with scope { partnerId }.
 */
export namespace partner {
  /**
   * The partners you belong to, with your role in each. Returns `{ items, nextCursor }`: the partners are
   * in `items` (empty for everyone else). A page at a time (`limit` and `cursor`; 50 unless you say
   * otherwise).
   *
   * @example
   * ```typescript
   * let page = await partner.list()
   * while (page.nextCursor) page = await partner.list({ cursor: page.nextCursor })
   * ```
   */
  export async function list(options: ListOptions = {}): Promise<ListResult<Partner>> {
    return request<ListResult<Partner>>(`/admin/partner${listQuery(options)}`)
  }

  /** One partner (owners also see its members). */
  export async function get(partnerId: string): Promise<Partner> {
    return request<Partner>(`/admin/partner/${encodeURIComponent(partnerId)}`)
  }

  /**
   * The partner's claim sets. Returns `{ items, nextCursor }`: the sets are in `items`. A page at a time
   * (`limit` and `cursor`; 50 unless you say otherwise).
   *
   * @example
   * ```typescript
   * let page = await partner.claimSets(partnerId)
   * while (page.nextCursor) page = await partner.claimSets(partnerId, { cursor: page.nextCursor })
   * ```
   */
  export async function claimSets(partnerId: string, options: ListOptions = {}): Promise<ListResult<PartnerClaimSet>> {
    return request<ListResult<PartnerClaimSet>>(`/admin/partner/${encodeURIComponent(partnerId)}/claimSet${listQuery(options)}`)
  }

  /** One of the partner's claim sets. */
  export async function getClaimSet(partnerId: string, claimSetId: string): Promise<PartnerClaimSet> {
    return request<PartnerClaimSet>(`/admin/partner/${encodeURIComponent(partnerId)}/claimSet/${encodeURIComponent(claimSetId)}`)
  }

  /** A new claim set for the partner, on one of its tap domains (owners and admins). */
  export async function createClaimSet(partnerId: string, params: CreatePartnerClaimSetRequest): Promise<PartnerClaimSet> {
    return post<PartnerClaimSet>(`/admin/partner/${encodeURIComponent(partnerId)}/claimSet`, params)
  }

  /**
   * Find a tag across the partner's sets by its chip UID (8 or 14 hex) or its code (printed or bare).
   * Returns `{ items, nextCursor }`: `items` has one hit for each of the partner's sets the tag is in
   * (usually one; none if the tag isn't the partner's). Never returns keys. A look-up is never paged: every
   * hit comes back in the one answer.
   *
   * @example
   * ```typescript
   * const { items: hits } = await partner.lookupTags(partnerId, { uid: '04A1B2C3D4E5F6' })
   * ```
   */
  export async function lookupTags(partnerId: string, query: { uid?: string; code?: string }): Promise<ListResult<PartnerTagHit>> {
    return request<ListResult<PartnerTagHit>>(`/admin/partner/${encodeURIComponent(partnerId)}/tags/lookup${listQuery(query)}`)
  }

  /**
   * What phones reported about one chip (errors.report with entityType 'tag'), newest first: a tag that
   * failed to program or register, with the host's NFC log in context. For a chip in the partner's sets,
   * or attempts that named one of them. Returns `{ items, nextCursor }`: the latest reports are in
   * `items` (ten unless `limit` says otherwise); `cursor` is the previous page's `nextCursor`.
   *
   * @example
   * ```typescript
   * const { items: attempts } = await partner.tagAttempts(partnerId, '04A1B2C3D4E5F6', { limit: 20 })
   * ```
   */
  export async function tagAttempts(partnerId: string, uid: string, options: ListOptions = {}): Promise<ListResult<ClientErrorEvent>> {
    return request<ListResult<ClientErrorEvent>>(`/admin/partner/${encodeURIComponent(partnerId)}/tags/attempts${listQuery({ uid, ...options })}`)
  }
}
