import { Partner, PartnerClaimSet, CreatePartnerClaimSetRequest, PartnerTagHit, ClientErrorEvent } from "../types/index.js";
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
    /** Find a tag across the partner's sets by its chip UID (8 or 14 hex) or its code (printed or bare). Never returns keys. */
    function lookupTags(partnerId: string, query: {
        uid?: string;
        code?: string;
    }): Promise<PartnerTagHit[]>;
    /**
     * What phones reported about one chip (errors.report with entityType 'tag'), newest first: a tag that
     * failed to program or register, with the host's NFC log in context. For a chip in the partner's sets,
     * or attempts that named one of them.
     */
    function tagAttempts(partnerId: string, uid: string): Promise<ClientErrorEvent[]>;
}
