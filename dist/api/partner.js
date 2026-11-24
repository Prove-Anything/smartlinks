import { request, post } from "../http.js";
import { listQuery } from "../list.js";
/**
 * Partners: organisations above collections (FanConnect, Zenith Coins, …) that own NFC claim sets and
 * assign their tags into collections their people administer. Partners and their members are set up by
 * SmartLinks staff; these calls are what a partner's people use. Ranges inside a partner's sets:
 * claimSet.ranges.* with scope { partnerId }.
 */
export var partner;
(function (partner) {
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
    async function list(options = {}) {
        return request(`/admin/partner${listQuery(options)}`);
    }
    partner.list = list;
    /** One partner (owners also see its members). */
    async function get(partnerId) {
        return request(`/admin/partner/${encodeURIComponent(partnerId)}`);
    }
    partner.get = get;
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
    async function claimSets(partnerId, options = {}) {
        return request(`/admin/partner/${encodeURIComponent(partnerId)}/claimSet${listQuery(options)}`);
    }
    partner.claimSets = claimSets;
    /** One of the partner's claim sets. */
    async function getClaimSet(partnerId, claimSetId) {
        return request(`/admin/partner/${encodeURIComponent(partnerId)}/claimSet/${encodeURIComponent(claimSetId)}`);
    }
    partner.getClaimSet = getClaimSet;
    /** A new claim set for the partner, on one of its tap domains (owners and admins). */
    async function createClaimSet(partnerId, params) {
        return post(`/admin/partner/${encodeURIComponent(partnerId)}/claimSet`, params);
    }
    partner.createClaimSet = createClaimSet;
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
    async function lookupTags(partnerId, query) {
        return request(`/admin/partner/${encodeURIComponent(partnerId)}/tags/lookup${listQuery(query)}`);
    }
    partner.lookupTags = lookupTags;
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
    async function tagAttempts(partnerId, uid, options = {}) {
        return request(`/admin/partner/${encodeURIComponent(partnerId)}/tags/attempts${listQuery(Object.assign({ uid }, options))}`);
    }
    partner.tagAttempts = tagAttempts;
})(partner || (partner = {}));
