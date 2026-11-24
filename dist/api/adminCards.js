// src/api/adminCards.ts
//
// Admin cards — a collection's dashboard, built from cards its installed apps contribute (plus the
// platform's own: products, contacts, visitors). See docs/admin-cards.md.
//
// One call loads the whole dashboard, served from a cache; stale cards are recomputed in the
// background and announced over SmartLinks Realtime as a `cards` change event:
//
//   const { items: cards } = await adminCards.list(collectionId)
//   realtime.onChange({ collectionId }, { type: 'cards' }, () => reload())
//
// Endpoints: /admin/collection/:collectionId/cards
import { request, post, put } from "../http.js";
const base = (collectionId) => `/admin/collection/${encodeURIComponent(collectionId)}/cards`;
export var adminCards;
(function (adminCards) {
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
    async function list(collectionId) {
        return request(base(collectionId));
    }
    adminCards.list = list;
    /** Recompute one card now (the card's "refresh" button). Rate-limited per card. */
    async function refresh(collectionId, appId, cardId) {
        return post(`${base(collectionId)}/${encodeURIComponent(appId)}/${encodeURIComponent(cardId)}/refresh`, {});
    }
    adminCards.refresh = refresh;
    /** Save the collection's dashboard layout (order, sizes, hidden cards) — every admin sees it. */
    async function saveLayout(collectionId, layout) {
        return put(`${base(collectionId)}/layout`, layout);
    }
    adminCards.saveLayout = saveLayout;
})(adminCards || (adminCards = {}));
