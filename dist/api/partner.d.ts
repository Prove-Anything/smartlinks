import { Partner, PartnerClaimSet, CreatePartnerClaimSetRequest } from "../types/index.js";
/**
 * Partners: organisations above collections (FanConnect, Zenith Coins, …) that own NFC claim sets and
 * assign their tags into collections their people administer. Partners and their members are set up by
 * SmartLinks staff; these calls are what a partner's people use. Ranges inside a partner's sets:
 * claimSet.ranges.* with scope { partnerId }.
 */
export declare namespace partner {
    /** The partners you belong to, with your role in each. Empty for everyone else. */
    function list(): Promise<Partner[]>;
    /** One partner (owners also see its members). */
    function get(partnerId: string): Promise<Partner>;
    /** The partner's claim sets. */
    function claimSets(partnerId: string): Promise<PartnerClaimSet[]>;
    /** One of the partner's claim sets. */
    function getClaimSet(partnerId: string, claimSetId: string): Promise<PartnerClaimSet>;
    /** A new claim set for the partner, on one of its tap domains (owners and admins). */
    function createClaimSet(partnerId: string, params: CreatePartnerClaimSetRequest): Promise<PartnerClaimSet>;
}
