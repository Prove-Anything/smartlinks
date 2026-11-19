import { request, post, put, del } from "../http.js";
/**
 * Saved conditions: named rule sets kept per collection (e.g. "UK only", "In the stadium"), so the same rule can be
 * reused by id. They're checked on the device with `utils.validateCondition({ conditionId, collection })`, which
 * loads a saved condition through `conditions.get` by itself.
 *
 * - Anyone can read a collection's saved conditions (`list`, `get`): they decide what a page shows.
 * - Admins create and change them (`create`, `update`, `remove`).
 */
export var conditions;
(function (conditions) {
    const pub = (collectionId) => `/public/collection/${encodeURIComponent(collectionId)}/condition`;
    const adm = (collectionId) => `/admin/collection/${encodeURIComponent(collectionId)}/condition`;
    /** Every saved condition in the collection (removed ones left out). */
    async function list(collectionId, admin = false) {
        return request(admin ? adm(collectionId) : pub(collectionId));
    }
    conditions.list = list;
    /**
     * One saved condition. Public reads 404 for a removed one; an admin read returns it with `deleted: true`.
     *
     * @example
     * ```typescript
     * const ukOnly = await conditions.get('coll_123', 'nfCmuWDY')
     * ```
     */
    async function get(collectionId, conditionId, admin = false) {
        return request(`${admin ? adm(collectionId) : pub(collectionId)}/${encodeURIComponent(conditionId)}`);
    }
    conditions.get = get;
    /**
     * Save a new condition (admin).
     *
     * @example
     * ```typescript
     * const c = await conditions.create('coll_123', {
     *   title: 'UK only',
     *   type: 'and',
     *   conditions: [{ type: 'country', countries: ['GB'], contains: true }],
     * })
     * ```
     */
    async function create(collectionId, data) {
        return post(adm(collectionId), data);
    }
    conditions.create = create;
    /** Change a saved condition (admin). Send the fields to change; `conditions` is replaced whole. */
    async function update(collectionId, conditionId, data) {
        return put(`${adm(collectionId)}/${encodeURIComponent(conditionId)}`, data);
    }
    conditions.update = update;
    /** Remove a saved condition (admin). It's kept, marked deleted, and passes for everyone from then on. */
    async function remove(collectionId, conditionId) {
        return del(`${adm(collectionId)}/${encodeURIComponent(conditionId)}`);
    }
    conditions.remove = remove;
})(conditions || (conditions = {}));
