import { Partner, PartnerClaimSet, CreatePartnerClaimSetRequest, PartnerTagHit, ClientErrorEvent } from "../types/index.js";
import type { ListResult } from "../types/list.js";
/**
 * Partners: organisations above collections (FanConnect, Zenith Coins, …) that own NFC claim sets and
 * assign their tags into collections their people administer. Partners and their members are set up by
 * SmartLinks staff; these calls are what a partner's people use. Ranges inside a partner's sets:
 * claimSet.ranges.* with scope { partnerId }.
 */
export declare namespace partner {
    /**
     * The partners you belong to, with your role in each. Returns `{ items, nextCursor }`: the partners are
     * in `items` (empty for everyone else). The list is not paged, so `nextCursor` is always `null`.
     *
     * @example
     * ```typescript
     * const { items: partners } = await partner.list()
     * ```
     */
    function list(): Promise<ListResult<Partner>>;
    /** One partner (owners also see its members). */
    function get(partnerId: string): Promise<Partner>;
    /**
     * The partner's claim sets. Returns `{ items, nextCursor }`: the sets are in `items`. The list is not
     * paged, so `nextCursor` is always `null`.
     *
     * @example
     * ```typescript
     * const { items: sets } = await partner.claimSets(partnerId)
     * ```
     */
    function claimSets(partnerId: string): Promise<ListResult<PartnerClaimSet>>;
    /** One of the partner's claim sets. */
    function getClaimSet(partnerId: string, claimSetId: string): Promise<PartnerClaimSet>;
    /** A new claim set for the partner, on one of its tap domains (owners and admins). */
    function createClaimSet(partnerId: string, params: CreatePartnerClaimSetRequest): Promise<PartnerClaimSet>;
    /**
     * Find a tag across the partner's sets by its chip UID (8 or 14 hex) or its code (printed or bare).
     * Returns `{ items, nextCursor }`: `items` has one hit for each of the partner's sets the tag is in
     * (usually one; none if the tag isn't the partner's). Never returns keys. The list is not paged, so
     * `nextCursor` is always `null`.
     *
     * @example
     * ```typescript
     * const { items: hits } = await partner.lookupTags(partnerId, { uid: '04A1B2C3D4E5F6' })
     * ```
     */
    function lookupTags(partnerId: string, query: {
        uid?: string;
        code?: string;
    }): Promise<ListResult<PartnerTagHit>>;
    /**
     * What phones reported about one chip (errors.report with entityType 'tag'), newest first: a tag that
     * failed to program or register, with the host's NFC log in context. For a chip in the partner's sets,
     * or attempts that named one of them. Returns `{ items, nextCursor }`: the ten latest reports are in
     * `items`. The list is not paged, so `nextCursor` is always `null`.
     *
     * @example
     * ```typescript
     * const { items: attempts } = await partner.tagAttempts(partnerId, '04A1B2C3D4E5F6')
     * ```
     */
    function tagAttempts(partnerId: string, uid: string): Promise<ListResult<ClientErrorEvent>>;
}
