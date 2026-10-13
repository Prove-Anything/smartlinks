// src/api/adminCards.ts
//
// Admin cards — a collection's dashboard, built from cards its installed apps contribute (plus the
// platform's own: products, contacts, visitors). See docs/admin-cards.md.
//
// One call loads the whole dashboard, served from a cache; stale cards are recomputed in the
// background and announced over SmartLinks Realtime as a `cards` change event:
//
//   const { cards } = await adminCards.list(collectionId)
//   realtime.onChange({ collectionId }, { type: 'cards' }, () => reload())
//
// Endpoints: /admin/collection/:collectionId/cards

import { request, post, put } from "../http"
import type { AdminCard, AdminCardsResponse, StudioHomeLayout } from "../types/adminCards"

const base = (collectionId: string) => `/admin/collection/${encodeURIComponent(collectionId)}/cards`

export namespace adminCards {
  /**
   * The collection's dashboard: every card, in display order, with its cached payload and how fresh
   * it is (`state`). Never waits on slow cards — those come back `stale` / `pending` and arrive later
   * as a realtime `cards` change.
   */
  export async function list(collectionId: string): Promise<AdminCardsResponse> {
    return request<AdminCardsResponse>(base(collectionId))
  }

  /** Recompute one card now (the card's "refresh" button). Rate-limited per card. */
  export async function refresh(collectionId: string, appId: string, cardId: string): Promise<AdminCard> {
    return post<AdminCard>(`${base(collectionId)}/${encodeURIComponent(appId)}/${encodeURIComponent(cardId)}/refresh`, {})
  }

  /** Save the collection's dashboard layout (order, sizes, hidden cards) — every admin sees it. */
  export async function saveLayout(collectionId: string, layout: StudioHomeLayout): Promise<StudioHomeLayout> {
    return put<StudioHomeLayout>(`${base(collectionId)}/layout`, layout)
  }
}
