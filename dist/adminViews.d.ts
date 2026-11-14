import type { AdminView } from './types/appManifest.js';
export type { AdminView };
/** What the host asks for. Either a declared `view` (with its params) or a raw hash `path`. */
export interface NavigateRequest {
    view?: string;
    path?: string;
    params?: Record<string, string>;
    /** Something on the screen to point at: an id the app understands (a row, a field). Optional. */
    highlight?: string;
}
/** What the app's handler is given: the resolved hash path (query included) to hand to its router. */
export interface NavigateTarget {
    /** Hash route, with any optional params as a query string: `/campaigns/c_1?tab=results`. */
    path: string;
    /** The declared view, when the host named one or the path matches one. */
    view?: AdminView;
    params: Record<string, string>;
    highlight?: string;
}
/**
 * The hash path for a view: `{name}` placeholders filled from `params` (required — null when one is
 * missing or empty), every other param appended as a query string.
 *
 * @example pathFor({ id: 'campaign', title: 'Campaign', path: '/campaigns/{campaignId}' }, { campaignId: 'c_1' })
 *          // → '/campaigns/c_1'
 */
export declare function pathFor(view: Pick<AdminView, 'path'>, params?: Record<string, string | undefined>): string | null;
/**
 * Which declared view a hash path is (with its params), or null. When several match, the one with the
 * most fixed segments wins (`/campaigns/new` over `/campaigns/{campaignId}`).
 */
export declare function match(views: AdminView[], path: string): {
    view: AdminView;
    params: Record<string, string>;
} | null;
/** The side menu: areas in declared order, and Settings for the bottom. Record views are left out. */
export declare function menu(views: AdminView[]): {
    main: AdminView[];
    settings: AdminView[];
};
/**
 * The chain from a top-level area down to `id`: `['campaigns', 'campaign', 'campaign.results']`.
 * The first entry is the menu item to show as current; for a record view, the record's first view
 * is `chain[1]`.
 */
export declare function trail(views: AdminView[], id: string): AdminView[];
/**
 * The swapped menu while one record is open: `back` is the area to return to ("← All campaigns"),
 * `items` the record's first view followed by the views within it. Null when `id` isn't a record view.
 */
export declare function recordMenu(views: AdminView[], id: string): {
    back?: AdminView;
    record: AdminView;
    items: AdminView[];
} | null;
/**
 * Resolve a host's request against the app's views: a named view becomes its path; a raw path is
 * matched to a view where it can be. Null when the view is unknown, a required param is missing, or
 * the path isn't a hash route of this app (`/…`, no scheme, no `//`).
 */
export declare function resolve(views: AdminView[], req: NavigateRequest): NavigateTarget | null;
/**
 * `'none'` when the host opened this page with `chrome=none`: the host's own menu carries this app's
 * views, so the app hides its side menu (and the bar with its toggle) and shows only the content.
 * Read from the address the page was first opened at.
 */
export declare function hostChrome(): 'none' | 'full';
/**
 * Follow the host's `smartlinks:navigate`: the handler gets the resolved hash path and hands it to the
 * app's router (no reload). Registering tells the host this page follows navigate, so it stops
 * reloading the frame to change screens. Only messages from the parent window are taken. Returns a
 * function that stops listening.
 *
 * @example
 *   // React Router, with the views from the app's own manifest
 *   import manifest from '../public/app.manifest.json'
 *   const navigate = useNavigate()
 *   useEffect(() => SL.adminViews.onNavigate(manifest.adminViews, (to) => navigate(to.path)), [navigate])
 */
export declare function onNavigate(views: AdminView[] | undefined | null, handler: (to: NavigateTarget) => void): () => void;
/**
 * Ask an embedded app to open a screen. Post this only once the app has said it follows navigate
 * (`smartlinks:navigable`); otherwise reload the frame at the new path as before.
 */
export declare function postNavigate(target: Window | null | undefined, req: NavigateRequest, targetOrigin?: string): void;
