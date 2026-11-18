import { request, post, put, del } from "../http"
import type { ConditionSet } from "../utils/conditions"

/** A saved condition: a named rule set pages, Hub blocks and apps refer to by id. */
export interface SavedCondition extends ConditionSet {
  id: string
  /** What admins call it, e.g. "In the stadium". */
  title: string
  /** Switched off: it passes for everyone. */
  disabled?: boolean
  /** Removed (kept, marked deleted). Lists leave these out. */
  deleted?: boolean
  [key: string]: any
}

export type SaveConditionRequest = Omit<SavedCondition, "id" | "deleted">

/**
 * Saved conditions: named rule sets kept per collection (e.g. "UK only", "In the stadium"), so the same rule can be
 * reused by id. They're checked on the device with `utils.validateCondition({ conditionId, collection })`, which
 * loads a saved condition through `conditions.get` by itself.
 *
 * - Anyone can read a collection's saved conditions (`list`, `get`): they decide what a page shows.
 * - Admins create and change them (`create`, `update`, `remove`).
 */
export namespace conditions {
  const pub = (collectionId: string) => `/public/collection/${encodeURIComponent(collectionId)}/condition`
  const adm = (collectionId: string) => `/admin/collection/${encodeURIComponent(collectionId)}/condition`

  /** Every saved condition in the collection (removed ones left out). */
  export async function list(collectionId: string, admin = false): Promise<SavedCondition[]> {
    return request<SavedCondition[]>(admin ? adm(collectionId) : pub(collectionId))
  }

  /**
   * One saved condition. Public reads 404 for a removed one; an admin read returns it with `deleted: true`.
   *
   * @example
   * ```typescript
   * const ukOnly = await conditions.get('coll_123', 'nfCmuWDY')
   * ```
   */
  export async function get(collectionId: string, conditionId: string, admin = false): Promise<SavedCondition> {
    return request<SavedCondition>(`${admin ? adm(collectionId) : pub(collectionId)}/${encodeURIComponent(conditionId)}`)
  }

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
  export async function create(collectionId: string, data: SaveConditionRequest): Promise<SavedCondition> {
    return post<SavedCondition>(adm(collectionId), data)
  }

  /** Change a saved condition (admin). Send the fields to change; `conditions` is replaced whole. */
  export async function update(collectionId: string, conditionId: string, data: Partial<SaveConditionRequest>): Promise<SavedCondition> {
    return put<SavedCondition>(`${adm(collectionId)}/${encodeURIComponent(conditionId)}`, data)
  }

  /** Remove a saved condition (admin). It's kept, marked deleted, and passes for everyone from then on. */
  export async function remove(collectionId: string, conditionId: string): Promise<SavedCondition> {
    return del<SavedCondition>(`${adm(collectionId)}/${encodeURIComponent(conditionId)}`)
  }
}
