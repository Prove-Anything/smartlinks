import { request, post } from "../http.js";
/**
 * Partners: organisations above collections (FanConnect, Zenith Coins, …) that own NFC claim sets and
 * assign their tags into collections their people administer. Partners and their members are set up by
 * SmartLinks staff; these calls are what a partner's people use. Ranges inside a partner's sets:
 * claimSet.ranges.* with scope { partnerId }.
 */
export var partner;
(function (partner) {
    /** The partners you belong to, with your role in each. Empty for everyone else. */
    async function list() {
        return request(`/admin/partner`);
    }
    partner.list = list;
    /** One partner (owners also see its members). */
    async function get(partnerId) {
        return request(`/admin/partner/${encodeURIComponent(partnerId)}`);
    }
    partner.get = get;
    /** The partner's claim sets. */
    async function claimSets(partnerId) {
        return request(`/admin/partner/${encodeURIComponent(partnerId)}/claimSet`);
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
    /** Find a tag across the partner's sets by its chip UID (8 or 14 hex) or its code (printed or bare). Never returns keys. */
    async function lookupTags(partnerId, query) {
        const q = new URLSearchParams();
        if (query.uid)
            q.set('uid', query.uid);
        if (query.code)
            q.set('code', query.code);
        return request(`/admin/partner/${encodeURIComponent(partnerId)}/tags/lookup?${q}`);
    }
    partner.lookupTags = lookupTags;
})(partner || (partner = {}));
