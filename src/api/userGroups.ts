import { request, post, put, del } from "../http"
import type {
  UserGroup,
  CreateUserGroupRequest,
  UpdateUserGroupRequest,
  UserGroupMember,
  AddUserGroupMemberRequest,
  UserGroupRef,
  MyUserGroups,
  UserGroupChange,
  UserGroupHistoryParams,
} from "../types/userGroups"

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
export namespace userGroups {
  const base = (collectionId: string) => `/admin/collection/${encodeURIComponent(collectionId)}/userGroup`

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
  export async function mine(collectionId: string): Promise<MyUserGroups> {
    return request<MyUserGroups>(`/public/collection/${encodeURIComponent(collectionId)}/userGroups/mine`)
  }

  /** Every user group in the collection (admin). */
  export async function list(collectionId: string): Promise<UserGroup[]> {
    return request<UserGroup[]>(base(collectionId))
  }

  /** One user group (admin). */
  export async function get(collectionId: string, userGroupId: string): Promise<UserGroup> {
    return request<UserGroup>(`${base(collectionId)}/${encodeURIComponent(userGroupId)}`)
  }

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
  export async function create(collectionId: string, data: CreateUserGroupRequest): Promise<UserGroup> {
    return post<UserGroup>(base(collectionId), data)
  }

  /**
   * Change a user group (admin): its name, description, or anything else you keep on it. The key stays.
   * To change who is in it, prefer `addMember` / `removeMember`: saving a whole `members` list here can
   * overwrite a change someone else made at the same moment.
   *
   * @throws `KEY_FIXED` if you try to change a key that is already set
   */
  export async function update(collectionId: string, userGroupId: string, data: UpdateUserGroupRequest): Promise<UserGroup> {
    return put<UserGroup>(`${base(collectionId)}/${encodeURIComponent(userGroupId)}`, data)
  }

  /** Delete a user group (admin). Its members lose whatever it allowed. */
  export async function remove(collectionId: string, userGroupId: string): Promise<UserGroup> {
    return del<UserGroup>(`${base(collectionId)}/${encodeURIComponent(userGroupId)}`)
  }

  /** The people in a user group, with name and email (admin). */
  export async function members(collectionId: string, userGroupId: string): Promise<UserGroupMember[]> {
    return request<UserGroupMember[]>(`${base(collectionId)}/${encodeURIComponent(userGroupId)}/users`)
  }

  /**
   * Add one person (admin), by user id or by email. By email, the person is found in the collection's
   * logins or added to them (no welcome email is sent). Adding someone who is already in changes nothing.
   *
   * @example
   * ```typescript
   * await userGroups.addMember('coll_123', qc.id, { email: 'sam@example.com', name: 'Sam' })
   * ```
   */
  export async function addMember(collectionId: string, userGroupId: string, who: AddUserGroupMemberRequest): Promise<UserGroup> {
    return post<UserGroup>(`${base(collectionId)}/${encodeURIComponent(userGroupId)}/members`, who)
  }

  /** Remove one person (admin). */
  export async function removeMember(collectionId: string, userGroupId: string, userId: string): Promise<UserGroup> {
    return del<UserGroup>(`${base(collectionId)}/${encodeURIComponent(userGroupId)}/members/${encodeURIComponent(userId)}`)
  }

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
  export async function history(collectionId: string, params: UserGroupHistoryParams = {}): Promise<UserGroupChange[]> {
    const q = new URLSearchParams()
    if (params.userId) q.append('userId', params.userId)
    if (params.from) q.append('from', params.from)
    if (params.to) q.append('to', params.to)
    if (params.limit) q.append('limit', String(params.limit))
    const qs = q.toString()
    const path = params.userGroupId ? `${base(collectionId)}/${encodeURIComponent(params.userGroupId)}/history` : `${base(collectionId)}/history`
    return request<UserGroupChange[]>(`${path}${qs ? `?${qs}` : ''}`)
  }

  /** The user groups one person is in (admin). */
  export async function ofUser(collectionId: string, userId: string): Promise<UserGroupRef[]> {
    return request<UserGroupRef[]>(`${base(collectionId)}/of/${encodeURIComponent(userId)}`)
  }
}
