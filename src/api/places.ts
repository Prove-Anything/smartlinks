import { post } from "../http"
import { PlaceMoveItem, PlaceMoveResult } from "../types"

/**
 * Moving things between places (docs/tag-codes.md, "Moving things"). The one way every app moves things, so a move
 * made in one shows in all. Admin only.
 */
export namespace places {
  /**
   * Move items (by membership), chips without an item (by membership) or containers (re-parented) into `to`, or out
   * of every place with `to: null`. Each move leaves a history line on what moved. Up to 500 at a time.
   */
  export async function move(collectionId: string, params: { to: string | null; items: PlaceMoveItem[]; note?: string }): Promise<PlaceMoveResult> {
    return post<PlaceMoveResult>(`/admin/collection/${encodeURIComponent(collectionId)}/places/move`, params)
  }
}
