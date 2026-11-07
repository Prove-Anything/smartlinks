import { request, post } from "../http";
import { Partner, PartnerClaimSet, CreatePartnerClaimSetRequest } from "../types";

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
}
