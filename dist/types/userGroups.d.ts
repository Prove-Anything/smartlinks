/**
 * User groups: named lists of people in a collection ("QC Controllers", "Warehouse", "Approved
 * partners"), used to say who may do what. See docs/user-groups.md.
 */
/** A user group. Apps may keep extra fields on it; the ones below are the platform's. */
export interface UserGroup {
    /** Random id. Never changes. */
    id: string;
    collectionId?: string;
    /**
     * The short stable name code uses: `'qc-controller'`. Lowercase letters, digits and hyphens, unique in
     * the collection. Set when the user group is created and kept through a rename. A user group made
     * before keys existed has none until it is next saved.
     */
    key?: string;
    /** What people see. Free to change. */
    name: string;
    description?: string;
    /** User ids of the people in it. */
    members?: string[];
    createdAt?: string;
    updatedAt?: string;
    deleted?: boolean;
    deletedAt?: string | null;
    [extra: string]: any;
}
export interface CreateUserGroupRequest {
    name: string;
    /** Optional. Made from the name when absent ("QC Controllers" → `qc-controllers`). */
    key?: string;
    description?: string;
    members?: string[];
    [extra: string]: any;
}
/** Any fields to change. `key` can't be changed once set. */
export interface UpdateUserGroupRequest {
    name?: string;
    description?: string;
    members?: string[];
    [extra: string]: any;
}
/** One member, as the admin member list shows them. */
export interface UserGroupMember {
    uid: string;
    name?: string | null;
    email?: string | null;
}
/** Who to add: an existing user id, or an email (found in the collection's logins, or added to them). */
export type AddUserGroupMemberRequest = {
    userId: string;
} | {
    email: string;
    name?: string;
};
/** A user group a person is in, as `userGroups.ofUser` lists it. */
export interface UserGroupRef {
    id: string;
    key: string | null;
    name: string | null;
}
/** What a signed-in person learns about their own membership (`userGroups.mine`). */
export interface MyUserGroups {
    /** Keys of the user groups they are in. Use these in code. */
    userGroups: string[];
    /** Ids of the same user groups (older saved conditions refer to ids). */
    userGroupIds: string[];
}
/** What kind of change a history entry records. */
export type UserGroupChangeType = 'usergroup.created' | 'usergroup.renamed' | 'usergroup.deleted' | 'usergroup.member-added' | 'usergroup.member-removed';
/** One recorded change to a user group (`userGroups.history`). Ids only: no names or emails of people. */
export interface UserGroupChange {
    id: string;
    /** When it happened (ISO 8601). */
    at: string;
    type: UserGroupChangeType;
    /** The user group's id. */
    entityId: string | null;
    data: {
        userGroupId: string;
        key: string | null;
        name: string | null;
        /** `member-added` / `member-removed`: the person. */
        userId?: string;
        /** `renamed`: what it was called before. */
        previousName?: string | null;
        /** `deleted`: who was in it at the time. */
        members?: string[];
    };
    actorType: string | null;
    /** The admin who made the change, when known. */
    actorId: string | null;
}
export interface UserGroupHistoryParams {
    /** Only this user group. */
    userGroupId?: string;
    /** Only changes about this person. */
    userId?: string;
    /** ISO dates. Default: the last 30 days. At most 400 days apart. */
    from?: string;
    to?: string;
    /** Default 100, at most 1000. */
    limit?: number;
}
