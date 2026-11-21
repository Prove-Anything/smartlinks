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
/** Another app's screen to open: by its admin view (and params), or by a hash path. */
export interface OpenAppRequest {
    /** The installed app's id in this collection (`'crm'`, `'messages'`, `'appointment-booking'`). */
    appId: string;
    view?: string;
    params?: Record<string, string>;
    path?: string;
}
/**
 * Ask the host (Studio) to open ANOTHER app at one of its screens: a contact in the CRM, a booking in
 * the booking app, a person's messages in Messages. The host reads that app's manifest `adminViews`,
 * turns the view into its address and opens it, so it works whichever SDK the other app is on. Posts
 * `{ type: 'smartlinks:open-app', payload: { appId, view?, params?, path? } }` to the parent. No-op
 * outside a frame.
 *
 * @example
 *   SL.adminViews.openApp({ appId: 'crm', view: 'contact', params: { contactId } })
 */
export declare function openApp(req: OpenAppRequest): void;
/** One destination: its name, the params it needs, and what it opens. */
export interface DestinationInfo {
    name: string;
    /** Params that must be given. */
    required: string[];
    /** Params that may be given. */
    optional?: string[];
    /** What it opens, in a few words. */
    description: string;
}
/** The platform's screens any admin screen can open by name. */
export declare const DESTINATIONS: DestinationInfo[];
/** A destination name. Any string is accepted, so a newer host's names work on an older SDK. */
export type Destination = 'contacts' | 'contact' | 'contact.messages' | 'contact.conversations' | 'conversation' | 'segment' | 'loyalty.scheme' | 'message.compose' | 'message.log' | 'campaign.new' | 'campaign' | 'templates' | 'template' | 'product' | 'proof' | 'interaction.type' | 'batch' | 'variant' | 'lot' | 'tags' | 'print' | 'form' | 'assets' | 'asset' | 'asset.history' | 'places' | 'settings.billing' | 'settings.integrations' | 'settings.guide' | 'settings.translationRules' | 'settings' | 'settings.address' | 'settings.domain' | 'settings.languages' | 'settings.translations' | 'settings.email' | 'settings.team' | 'settings.userGroups' | 'settings.setupLists' | 'settings.portal' | 'settings.hub' | 'settings.signIn' | 'media' | 'app' | (string & {});
/** What a message is about (the same shape as `comms.sendTransactional`'s `about`). Ids only. */
export interface DestinationAbout {
    appId?: string;
    type: string;
    id: string;
    view?: string;
    params?: Record<string, string>;
    label?: string;
}
/** Params for `open`: ids as strings, plus `about` (messages) and `params` (`app`). */
export interface OpenParams {
    contactId?: string;
    conversationId?: string;
    segmentId?: string;
    campaignId?: string;
    templateId?: string;
    productId?: string;
    proofId?: string;
    interactionId?: string;
    batchId?: string;
    variantId?: string;
    lotId?: string;
    formId?: string;
    schemeId?: string;
    appId?: string;
    view?: string;
    /** `message.compose` / `message.log`: the record the message is about, so it is logged against it. */
    about?: DestinationAbout;
    /** `app`: that app's view params. */
    params?: Record<string, string>;
    [key: string]: string | DestinationAbout | Record<string, string> | undefined;
}
export interface OpenResult {
    ok: boolean;
    /** `no-host` (not inside Studio) · `unknown` · `not-here` (its app isn't on) · `missing-param` · `preview`. */
    reason?: string;
}
/**
 * The destinations this host can open here: `['contact', 'message.compose', 'settings.domain', …]`.
 * Leaves out a screen whose app isn't on in this collection. `[]` with no host (the admin page opened
 * on its own), after a short wait.
 */
export declare function available(): Promise<string[]>;
/**
 * Whether `open(name)` will open something here. Ask before showing a button: false when the screen's
 * app isn't on (Messages not switched on) or there is no host. Then hide the button, or say what to
 * switch on. Build your own only when the platform has nothing.
 *
 * @example
 *   const canMessage = await SL.adminViews.canOpen('message.compose')
 */
export declare function canOpen(name: Destination): Promise<boolean>;
/**
 * Open one of the platform's screens by name: a contact, the Messages composer, a person's messages, a
 * template, a product, a settings page. The host (Studio) decides which app or page that is today, so
 * the app never hard-codes another app's address or builds its own copy. Resolves with whether it
 * opened (`{ ok: false, reason: 'no-host' }` outside Studio).
 *
 * @example
 *   // Message this parent, tied to their booking (it is logged against the booking and links back)
 *   SL.adminViews.open('message.compose', {
 *     contactId,
 *     about: { type: 'booking', id: bookingId, view: 'booking', params: { bookingId }, label: 'Sat 3pm' },
 *   })
 *   SL.adminViews.open('contact', { contactId })
 *   SL.adminViews.open('settings.domain')
 */
export declare function open(to: Destination, params?: OpenParams): Promise<OpenResult>;
/**
 * Ask an embedded app to open a screen. Post this only once the app has said it follows navigate
 * (`smartlinks:navigable`); otherwise reload the frame at the new path as before.
 */
export declare function postNavigate(target: Window | null | undefined, req: NavigateRequest, targetOrigin?: string): void;
/** Tell an embedded app which destinations it can open here (on load, on request, and when it changes). */
export declare function postDestinations(target: Window | null | undefined, availableNames: string[], targetOrigin?: string): void;
/** Answer an app's `smartlinks:open`. */
export declare function postOpenResult(target: Window | null | undefined, result: {
    id: string;
    to: string;
    ok: boolean;
    reason?: string;
}, targetOrigin?: string): void;
