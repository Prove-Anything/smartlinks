var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { request, post, put, del } from "../http.js";
import { listQuery } from "../list.js";
/**
 * User groups: named lists of people in a collection, used to say who may do what.
 *
 * - An admin manages them here (`list`, `create`, `addMember`, …).
 * - A signed-in person asks which ones they are in with `mine()`, so a screen can show or hide things.
 * - A server function is limited to user groups in its manifest declaration (`userGroups: ['manager']`)
 *   and reads the caller's with `ctx.caller.userGroups`. That is where things are actually protected.
 *
 * See docs/user-groups.md.
 */
export var userGroups;
(function (userGroups) {
    const base = (collectionId) => `/admin/collection/${encodeURIComponent(collectionId)}/userGroup`;
    /**
     * The signed-in person's own user groups in this collection. Not signed in → both lists empty.
     * Nobody can ask about anyone else with this.
     *
     * @example
     * ```typescript
     * const { userGroups: mine } = await userGroups.mine('coll_123')
     * const canRelease = mine.includes('qc-controller')
     * ```
     */
    async function mine(collectionId) {
        return request(`/public/collection/${encodeURIComponent(collectionId)}/userGroups/mine`);
    }
    userGroups.mine = mine;
    /**
     * The collection's user groups (admin), a page at a time. Page with `limit` (50 unless you say)
     * and `cursor`.
     *
     * @example
     * ```typescript
     * let page = await userGroups.list('coll_123', { limit: 50 })
     * page.items.map((g) => g.name)
     * while (page.nextCursor) page = await userGroups.list('coll_123', { limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function list(collectionId, options = {}) {
        return request(`${base(collectionId)}${listQuery(options)}`);
    }
    userGroups.list = list;
    /** One user group (admin). */
    async function get(collectionId, userGroupId) {
        return request(`${base(collectionId)}/${encodeURIComponent(userGroupId)}`);
    }
    userGroups.get = get;
    /**
     * Create a user group (admin). Its key is made from the name unless you give one.
     *
     * @example
     * ```typescript
     * const qc = await userGroups.create('coll_123', { name: 'QC Controllers' })
     * qc.key // 'qc-controllers'
     * ```
     * @throws `KEY_INVALID` / `KEY_TAKEN` for a bad or already-used key
     */
    async function create(collectionId, data) {
        return post(base(collectionId), data);
    }
    userGroups.create = create;
    /**
     * Change a user group (admin): its name, description, or anything else you keep on it. The key stays.
     * To change who is in it, prefer `addMember` / `removeMember`: saving a whole `members` list here can
     * overwrite a change someone else made at the same moment.
     *
     * @throws `KEY_FIXED` if you try to change a key that is already set
     */
    async function update(collectionId, userGroupId, data) {
        return put(`${base(collectionId)}/${encodeURIComponent(userGroupId)}`, data);
    }
    userGroups.update = update;
    /** Delete a user group (admin). Its members lose whatever it allowed. */
    async function remove(collectionId, userGroupId) {
        return del(`${base(collectionId)}/${encodeURIComponent(userGroupId)}`);
    }
    userGroups.remove = remove;
    /**
     * The people in a user group, with name and email (admin), a page at a time. Page with `limit`
     * (50 unless you say) and `cursor`.
     *
     * @example
     * ```typescript
     * let page = await userGroups.members('coll_123', qc.id, { limit: 50 })
     * page.items // [{ uid, name, email }]
     * while (page.nextCursor) page = await userGroups.members('coll_123', qc.id, { limit: 50, cursor: page.nextCursor })
     * ```
     */
    async function members(collectionId, userGroupId, options = {}) {
        return request(`${base(collectionId)}/${encodeURIComponent(userGroupId)}/users${listQuery(options)}`);
    }
    userGroups.members = members;
    /**
     * Add one person (admin), by user id or by email. By email, the person is found in the collection's
     * logins or added to them (no welcome email is sent). Adding someone who is already in changes nothing.
     *
     * @example
     * ```typescript
     * await userGroups.addMember('coll_123', qc.id, { email: 'sam@example.com', name: 'Sam' })
     * ```
     */
    async function addMember(collectionId, userGroupId, who) {
        return post(`${base(collectionId)}/${encodeURIComponent(userGroupId)}/members`, who);
    }
    userGroups.addMember = addMember;
    /** Remove one person (admin). */
    async function removeMember(collectionId, userGroupId, userId) {
        return del(`${base(collectionId)}/${encodeURIComponent(userGroupId)}/members/${encodeURIComponent(userId)}`);
    }
    userGroups.removeMember = removeMember;
    /**
     * What changed, newest first (admin): user groups created, renamed and deleted, and every person added
     * or removed, each with the admin who did it (`actorId`) and when (`at`). Give `userGroupId` for one
     * user group, `userId` for everything about one person, or neither for the whole collection.
     * Covers the last 30 days unless you give `from` / `to` (at most 400 days). Takes about a second.
     * A page at a time: `limit` says how many (default 100, at most 1000); pass `nextCursor` back as
     * `cursor` for the next page.
     *
     * @example
     * ```typescript
     * let page = await userGroups.history('coll_123', { userId: 'uid_1', from: '2026-11-01T00:00:00Z' })
     * // page.items: [{ at, type: 'usergroup.member-added', actorId: 'uid_admin', data: { key: 'qc-controllers', userId: 'uid_1', … } }]
     * while (page.nextCursor) {
     *   page = await userGroups.history('coll_123', { userId: 'uid_1', from: '2026-11-01T00:00:00Z', cursor: page.nextCursor })
     * }
     * ```
     */
    async function history(collectionId, params = {}) {
        const { userGroupId } = params, query = __rest(params, ["userGroupId"]);
        const path = userGroupId ? `${base(collectionId)}/${encodeURIComponent(userGroupId)}/history` : `${base(collectionId)}/history`;
        return request(`${path}${listQuery(query)}`);
    }
    userGroups.history = history;
    /**
     * The user groups one person is in (admin), a page at a time. Page with `limit` (50 unless you
     * say) and `cursor`.
     *
     * @example
     * ```typescript
     * let page = await userGroups.ofUser('coll_123', 'uid_1')
     * page.items // [{ id, key, name }]
     * while (page.nextCursor) page = await userGroups.ofUser('coll_123', 'uid_1', { cursor: page.nextCursor })
     * ```
     */
    async function ofUser(collectionId, userId, options = {}) {
        return request(`${base(collectionId)}/of/${encodeURIComponent(userId)}${listQuery(options)}`);
    }
    userGroups.ofUser = ofUser;
})(userGroups || (userGroups = {}));
