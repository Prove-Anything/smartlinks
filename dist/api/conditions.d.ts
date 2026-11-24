import type { ConditionSet } from "../utils/conditions.js";
import type { ListResult, ListOptions } from "../types/list.js";
/** A saved condition: a named rule set pages, Hub blocks and apps refer to by id. */
export interface SavedCondition extends ConditionSet {
    id: string;
    /** What admins call it, e.g. "In the stadium". */
    title: string;
    /** Switched off: it passes for everyone. */
    disabled?: boolean;
    /** Removed (kept, marked deleted). Lists leave these out. */
    deleted?: boolean;
    [key: string]: any;
}
export type SaveConditionRequest = Omit<SavedCondition, "id" | "deleted">;
/**
 * Saved conditions: named rule sets kept per collection (e.g. "UK only", "In the stadium"), so the same rule can be
 * reused by id. They're checked on the device with `utils.validateCondition({ conditionId, collection })`, which
 * loads a saved condition through `conditions.get` by itself.
 *
 * - Anyone can read a collection's saved conditions (`list`, `get`): they decide what a page shows.
 * - Admins create and change them (`create`, `update`, `remove`).
 */
export declare namespace conditions {
    /**
     * The collection's saved conditions (removed ones left out), a page at a time. Page with `limit`
     * (50 unless you say) and `cursor`.
     *
     * @example
     * ```typescript
     * let page = await conditions.list('coll_123')
     * page.items.map(c => c.title) // ["UK only", "In the stadium"]
     * while (page.nextCursor) page = await conditions.list('coll_123', false, { cursor: page.nextCursor })
     * ```
     */
    function list(collectionId: string, admin?: boolean, options?: ListOptions): Promise<ListResult<SavedCondition>>;
    /**
     * One saved condition. Public reads 404 for a removed one; an admin read returns it with `deleted: true`.
     *
     * @example
     * ```typescript
     * const ukOnly = await conditions.get('coll_123', 'nfCmuWDY')
     * ```
     */
    function get(collectionId: string, conditionId: string, admin?: boolean): Promise<SavedCondition>;
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
    function create(collectionId: string, data: SaveConditionRequest): Promise<SavedCondition>;
    /** Change a saved condition (admin). Send the fields to change; `conditions` is replaced whole. */
    function update(collectionId: string, conditionId: string, data: Partial<SaveConditionRequest>): Promise<SavedCondition>;
    /** Remove a saved condition (admin). It's kept, marked deleted, and passes for everyone from then on. */
    function remove(collectionId: string, conditionId: string): Promise<SavedCondition>;
}
