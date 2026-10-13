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
/** Grid widths on a 12-column dashboard: small 3, medium 6, wide 8, full 12. One column on phones. */
export type AdminCardSize = 'small' | 'medium' | 'wide' | 'full';
/**
 * What a card's data depends on — a change of this kind marks it stale. `records` / `records:<type>`
 * are THIS app's records; the rest are the collection's.
 */
export type AdminCardRefreshOn = 'records' | `records:${string}` | 'products' | 'proofs' | 'assets' | 'apps' | 'collection' | 'settings' | `settings:${string}`;
export interface AdminCardRefresh {
    /** Recompute when any of these change. Leave out only for data that changes without an event. */
    on?: AdminCardRefreshOn[];
    /**
     * The longest a payload is shown before it's recomputed anyway: seconds, or "30m" / "6h" / "2d".
     * Default 6h; minimum 1m. Use it for data with no change event (visits, time-based counts).
     */
    maxAge?: number | string;
}
/** One card an app contributes — `app.manifest.json` → `adminCards.cards[]`. */
export interface AdminCardDeclaration {
    /** Unique within the app: letters, digits, `-` and `_`, up to 40. */
    id: string;
    /** Shown as the card's heading (the payload may override it). */
    title: string;
    /** One line for the "add a card" picker. */
    description?: string;
    /** `data` (default) or `component`. */
    kind?: 'data' | 'component';
    /**
     * The ADMIN http server function that returns this card's {@link AdminCardPayload} (a function
     * declared in `functions.definitions` with `visibility: "admin"`). Required for `data` cards;
     * optional for `component` cards, whose component then gets the payload as `data`.
     */
    function?: string;
    /** `component` cards: the export name in the `adminCards` bundle. */
    component?: string;
    /** Sizes the card supports; the first is its default. Default `["medium"]`. */
    sizes?: AdminCardSize[];
    /** Lower comes first when the collection hasn't arranged its dashboard. Default 100. */
    priority?: number;
    /** Where the card can appear. Only `collection` (the dashboard) today. */
    levels?: Array<'collection'>;
    refresh?: AdminCardRefresh;
}
/** `app.manifest.json` → `adminCards`. */
export interface AppManifestAdminCards {
    cards: AdminCardDeclaration[];
    /** The `adminCards` bundle — only when the app has `component` cards. */
    files?: {
        js: {
            umd: string;
            esm?: string;
        };
        css?: string;
    };
}
/** A link from a card into the app's admin (`path`, e.g. "/enquiries?status=new") or elsewhere (`url`). */
export interface AdminCardAction {
    label: string;
    /** A path inside this app's admin. */
    path?: string;
    /** An absolute https URL (opens in a new tab). */
    url?: string;
}
/**
 * What a card's function returns. Every field is optional — return the ones the card needs. Studio
 * draws them in a fixed, consistent layout; there's no HTML or styling. Max ~8KB as JSON.
 */
export interface AdminCardPayload {
    /** Overrides the declared title (e.g. "3 new enquiries"). */
    title?: string;
    /** The headline number or short value. */
    value?: number | string;
    /** Shown after/under the value ("enquiries this week"). */
    label?: string;
    unit?: string;
    /** Change against a previous period. `good` says whether this direction is good news (for colour). */
    trend?: {
        direction: 'up' | 'down' | 'flat';
        label?: string;
        good?: boolean;
    };
    /** One status line. `attention` and `error` also surface in the To do strip. */
    status?: {
        tone: 'ok' | 'attention' | 'neutral' | 'error';
        text: string;
    };
    /** Setup or completion progress ("4 of 6 steps"). */
    progress?: {
        done: number;
        total: number;
        label?: string;
    };
    /** A short list — at most 5 are shown. */
    items?: Array<{
        title: string;
        subtitle?: string;
        meta?: string;
        path?: string;
    }>;
    /** Things that need doing — collected into the dashboard's To do strip. */
    todo?: Array<{
        text: string;
        action?: AdminCardAction;
    }>;
    /** At most two buttons. */
    actions?: AdminCardAction[];
    /** Shown instead of the body when there's nothing yet ("No enquiries yet"). */
    empty?: {
        text: string;
        action?: AdminCardAction;
    };
}
/** How fresh a card's payload is. */
export type AdminCardState = 
/** Up to date. */
'fresh'
/** The last payload, being recomputed in the background (a newer one arrives by realtime). */
 | 'stale'
/** Never computed yet, and not ready in time — it arrives by realtime. */
 | 'pending'
/** The last attempt failed; `payload` is the last good one, if any. */
 | 'error';
/** One card on the dashboard, as `adminCards.list` returns it — in display order. */
export interface AdminCard {
    /** `<appId>:<cardId>` — the key used in the layout. */
    key: string;
    /** The contributing app, or `platform` for Studio's own cards (products, contacts, visitors). */
    appId: string;
    cardId: string;
    title: string;
    description?: string;
    kind: 'data' | 'component';
    sizes: AdminCardSize[];
    /** The size to draw it at (the layout's choice, else the card's default). */
    size: AdminCardSize;
    priority: number;
    state: AdminCardState;
    payload: AdminCardPayload | null;
    /** When `payload` was computed (ms since epoch). */
    computedAt: number | null;
    /** Why the last attempt failed (state `error`). */
    error?: string;
    /** `component` cards: the bundle to load and the export to mount. */
    component?: {
        name: string;
        files: NonNullable<AppManifestAdminCards['files']>;
    };
}
/**
 * A collection's dashboard layout — the `studioHome` settings group. Owned by the collection (every
 * admin sees the same dashboard). Cards not listed follow, by priority; installed apps' new cards
 * appear on their own; cards of uninstalled apps drop out.
 */
export interface StudioHomeLayout {
    version: 1;
    cards: Array<{
        key: string;
        size?: AdminCardSize;
        hidden?: boolean;
    }>;
}
/** `adminCards.list` → the whole dashboard in one call. */
export interface AdminCardsResponse {
    cards: AdminCard[];
    /** Cards the layout hides (for the "add a card" picker). */
    hidden: AdminCard[];
    layout: StudioHomeLayout | null;
}
