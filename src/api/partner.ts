import { request, post } from "../http";
import { Partner, PartnerClaimSet, CreatePartnerClaimSetRequest, PartnerTagHit, ClientErrorEvent } from "../types";

/**
 * Partners: organisations above collections (FanConnect, Zenith Coins, …) that own NFC claim sets and
 * assign their tags into collections their people administer. Partners and their members are set up by
 * SmartLinks staff; these calls are what a partner's people use. Ranges inside a partner's sets:
 * claimSet.ranges.* with scope { partnerId }.
 */
export namespace partner {
  /** The partners you belong to, with your role in each. Empty for everyone else. */
  export async function list(): Promise<Partner[]> {
    return request<Partner[]>(`/admin/partner`)
  }

  /** One partner (owners also see its members). */
  export async function get(partnerId: string): Promise<Partner> {
    return request<Partner>(`/admin/partner/${encodeURIComponent(partnerId)}`)
  }

  /** The partner's claim sets. */
  export async function claimSets(partnerId: string): Promise<PartnerClaimSet[]> {
    return request<PartnerClaimSet[]>(`/admin/partner/${encodeURIComponent(partnerId)}/claimSet`)
  }

  /** One of the partner's claim sets. */
  export async function getClaimSet(partnerId: string, claimSetId: string): Promise<PartnerClaimSet> {
    return request<PartnerClaimSet>(`/admin/partner/${encodeURIComponent(partnerId)}/claimSet/${encodeURIComponent(claimSetId)}`)
  }

  /** A new claim set for the partner, on one of its tap domains (owners and admins). */
  export async function createClaimSet(partnerId: string, params: CreatePartnerClaimSetRequest): Promise<PartnerClaimSet> {
    return post<PartnerClaimSet>(`/admin/partner/${encodeURIComponent(partnerId)}/claimSet`, params)
  }

  /** Find a tag across the partner's sets by its chip UID (8 or 14 hex) or its code (printed or bare). Never returns keys. */
  export async function lookupTags(partnerId: string, query: { uid?: string; code?: string }): Promise<PartnerTagHit[]> {
    const q = new URLSearchParams()
    if (query.uid) q.set('uid', query.uid)
    if (query.code) q.set('code', query.code)
    return request<PartnerTagHit[]>(`/admin/partner/${encodeURIComponent(partnerId)}/tags/lookup?${q}`)
  }

  /**
   * What phones reported about one chip (errors.report with entityType 'tag'), newest first: a tag that
   * failed to program or register, with the host's NFC log in context. For a chip in the partner's sets,
   * or attempts that named one of them.
   */
  export async function tagAttempts(partnerId: string, uid: string): Promise<ClientErrorEvent[]> {
    return request<ClientErrorEvent[]>(`/admin/partner/${encodeURIComponent(partnerId)}/tags/attempts?uid=${encodeURIComponent(uid)}`)
  }
}
