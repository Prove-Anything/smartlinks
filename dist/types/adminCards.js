// src/types/adminCards.ts
/**
 * Admin cards — what an app contributes to a collection's dashboard in Studio (docs/admin-cards.md).
 *
 * Two kinds, one contract:
 * - **data** (the default, any publisher): the app declares the card and an ADMIN server function that
 *   returns an {@link AdminCardPayload}; Studio draws it. No app code runs in Studio.
 * - **component** (first-party and approved publishers): a React component from the app's
 *   `adminCards` bundle, given the same cached payload as its `data` prop.
 *
 * Fast by construction: Studio loads every card in ONE request, served from a cache. A card is only
 * recomputed when something it declares in `refresh.on` changed (or `refresh.maxAge` passed), in the
 * background, within a time and size budget — so a dashboard never waits on 20 functions.
 */
export {};
