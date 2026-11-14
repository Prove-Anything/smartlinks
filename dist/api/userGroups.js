import { request, post, put, del } from "../http.js";
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
    /** Every user group in the collection (admin). */
    async function list(collectionId) {
        return request(base(collectionId));
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
    /** The people in a user group, with name and email (admin). */
    async function members(collectionId, userGroupId) {
        return request(`${base(collectionId)}/${encodeURIComponent(userGroupId)}/users`);
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
     *
     * @example
     * ```typescript
     * const who = await userGroups.history('coll_123', { userId: 'uid_1' })
     * // [{ at, type: 'usergroup.member-added', actorId: 'uid_admin', data: { key: 'qc-controllers', userId: 'uid_1', … } }]
     * ```
     */
    async function history(collectionId, params = {}) {
        const q = new URLSearchParams();
        if (params.userId)
            q.append('userId', params.userId);
        if (params.from)
            q.append('from', params.from);
        if (params.to)
            q.append('to', params.to);
        if (params.limit)
            q.append('limit', String(params.limit));
        const qs = q.toString();
        const path = params.userGroupId ? `${base(collectionId)}/${encodeURIComponent(params.userGroupId)}/history` : `${base(collectionId)}/history`;
        return request(`${path}${qs ? `?${qs}` : ''}`);
    }
    userGroups.history = history;
    /** The user groups one person is in (admin). */
    async function ofUser(collectionId, userId) {
        return request(`${base(collectionId)}/of/${encodeURIComponent(userId)}`);
    }
    userGroups.ofUser = ofUser;
})(userGroups || (userGroups = {}));
