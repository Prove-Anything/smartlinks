import type { AdminCard, AdminCardsResponse, StudioHomeLayout } from "../types/adminCards.js";
export declare namespace adminCards {
    /**
     * The collection's dashboard: every card, in display order, with its cached payload and how fresh
     * it is (`state`). Never waits on slow cards — those come back `stale` / `pending` and arrive later
     * as a realtime `cards` change.
     *
     * Returns `{ items, nextCursor, hidden, layout }`: the cards to show are in `items`; `hidden` are the
     * cards the layout hides. The dashboard is not paged, so `nextCursor` is always `null`.
     *
     * @example
     * ```typescript
     * const { items: cards, hidden, layout } = await adminCards.list(collectionId)
     * ```
     */
    function list(collectionId: string): Promise<AdminCardsResponse>;
    /** Recompute one card now (the card's "refresh" button). Rate-limited per card. */
    function refresh(collectionId: string, appId: string, cardId: string): Promise<AdminCard>;
    /** Save the collection's dashboard layout (order, sizes, hidden cards) — every admin sees it. */
    function saveLayout(collectionId: string, layout: StudioHomeLayout): Promise<StudioHomeLayout>;
}
