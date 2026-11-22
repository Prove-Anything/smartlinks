// src/adminViews.ts
// ADMIN VIEWS — an app's admin screens by name (app.manifest.json#adminViews), and the two runtime
// messages that use them:
//   host → app   { type: 'smartlinks:navigate', view?, path?, params?, highlight? }   open a screen, no reload
//   app → host   'smartlinks:navigable'  (the app follows navigate)   'smartlinks:navigate-result'
//   app → host   'smartlinks:open-app'   { appId, view?, params?, path? }   open ANOTHER app at a screen
//   app → host   'smartlinks:open'       { id, to, params?, about? }   open a platform screen by NAME
//                ('contact', 'message.compose', 'settings.domain'); the host picks the app or page
// plus `chrome=none`: the host carries the app's menu itself, so the app hides its own.
// One list drives the app's own side menu, Studio's workspace menu and the assistant. See
// docs/admin-views.md.
const PLACEHOLDER = /\{([A-Za-z0-9_]+)\}/g;
/**
 * The hash path for a view: `{name}` placeholders filled from `params` (required — null when one is
 * missing or empty), every other param appended as a query string.
 *
 * @example pathFor({ id: 'campaign', title: 'Campaign', path: '/campaigns/{campaignId}' }, { campaignId: 'c_1' })
 *          // → '/campaigns/c_1'
 */
export function pathFor(view, params = {}) {
    const used = new Set();
    let missing = false;
    const filled = view.path.replace(PLACEHOLDER, (_, name) => {
        used.add(name);
        const v = params[name];
        if (v == null || v === '') {
            missing = true;
            return '';
        }
        return encodeURIComponent(v);
    });
    if (missing)
        return null;
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (!used.has(k) && v != null && v !== '')
            q.set(k, v);
    }
    const qs = q.toString();
    return qs ? `${filled}?${qs}` : filled;
}
function splitPath(path) {
    const i = path.indexOf('?');
    return i < 0 ? { pathname: path, query: new URLSearchParams() } : { pathname: path.slice(0, i), query: new URLSearchParams(path.slice(i + 1)) };
}
const trimSlash = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
/**
 * Which declared view a hash path is (with its params), or null. When several match, the one with the
 * most fixed segments wins (`/campaigns/new` over `/campaigns/{campaignId}`).
 */
export function match(views, path) {
    const { pathname, query } = splitPath(path || '/');
    const segs = trimSlash(pathname).split('/');
    let best = null;
    for (const view of views) {
        const tsegs = trimSlash(view.path).split('/');
        if (tsegs.length !== segs.length)
            continue;
        const params = {};
        let fixed = 0;
        let ok = true;
        for (let i = 0; i < tsegs.length; i++) {
            const t = tsegs[i];
            const m = /^\{([A-Za-z0-9_]+)\}$/.exec(t);
            if (m) {
                if (!segs[i]) {
                    ok = false;
                    break;
                }
                try {
                    params[m[1]] = decodeURIComponent(segs[i]);
                }
                catch (_a) {
                    params[m[1]] = segs[i];
                }
            }
            else if (t === segs[i]) {
                fixed++;
            }
            else {
                ok = false;
                break;
            }
        }
        if (!ok)
            continue;
        if (!best || fixed > best.fixed)
            best = { view, params, fixed };
    }
    if (!best)
        return null;
    query.forEach((v, k) => { if (best.params[k] == null)
        best.params[k] = v; });
    return { view: best.view, params: best.params };
}
/** The side menu: areas in declared order, and Settings for the bottom. Record views are left out. */
export function menu(views) {
    return {
        main: views.filter((v) => { var _a; return ((_a = v.group) !== null && _a !== void 0 ? _a : 'main') === 'main'; }),
        settings: views.filter((v) => v.group === 'settings'),
    };
}
/**
 * The chain from a top-level area down to `id`: `['campaigns', 'campaign', 'campaign.results']`.
 * The first entry is the menu item to show as current; for a record view, the record's first view
 * is `chain[1]`.
 */
export function trail(views, id) {
    const byId = new Map(views.map((v) => [v.id, v]));
    const out = [];
    let cur = byId.get(id);
    while (cur && !out.includes(cur)) {
        out.unshift(cur);
        cur = cur.within ? byId.get(cur.within) : undefined;
    }
    return out;
}
/**
 * The swapped menu while one record is open: `back` is the area to return to ("← All campaigns"),
 * `items` the record's first view followed by the views within it. Null when `id` isn't a record view.
 */
export function recordMenu(views, id) {
    const chain = trail(views, id);
    const record = chain.find((v) => v.group === 'record');
    if (!record)
        return null;
    const back = record.within ? views.find((v) => v.id === record.within) : undefined;
    return { back, record, items: [record, ...views.filter((v) => v.within === record.id && v.group === 'record')] };
}
/**
 * Resolve a host's request against the app's views: a named view becomes its path; a raw path is
 * matched to a view where it can be. Null when the view is unknown, a required param is missing, or
 * the path isn't a hash route of this app (`/…`, no scheme, no `//`).
 */
export function resolve(views, req) {
    const params = {};
    for (const [k, v] of Object.entries(req.params || {}))
        if (typeof v === 'string')
            params[k] = v;
    if (req.view) {
        const view = views.find((v) => v.id === req.view);
        if (!view)
            return null;
        const path = pathFor(view, params);
        if (path == null)
            return null;
        return Object.assign({ path, view, params }, (req.highlight ? { highlight: req.highlight } : {}));
    }
    if (typeof req.path !== 'string' || !req.path.startsWith('/') || req.path.startsWith('//') || req.path.includes('://'))
        return null;
    let path = req.path;
    if (Object.keys(params).length) {
        const { pathname, query } = splitPath(path);
        for (const [k, v] of Object.entries(params))
            query.set(k, v);
        path = `${pathname}?${query.toString()}`;
    }
    const m = match(views, path);
    return Object.assign(Object.assign(Object.assign({ path }, (m ? { view: m.view } : {})), { params: m ? Object.assign(Object.assign({}, m.params), params) : params }), (req.highlight ? { highlight: req.highlight } : {}));
}
// -----------------------------------------------------------------------------
// App side
// -----------------------------------------------------------------------------
function inIframe() {
    return typeof window !== 'undefined' && !!window.parent && window.parent !== window;
}
function postParent(type, payload) {
    if (!inIframe())
        return;
    try {
        window.parent.postMessage({ _smartlinksIframeMessage: true, type, payload }, '*');
    }
    catch (_a) {
        /* ignore */
    }
}
/** `chrome` as the page was first opened: read once, so the app's own navigation can't lose it. */
const INITIAL_CHROME = (() => {
    try {
        if (typeof window === 'undefined' || !window.location)
            return 'full';
        const hash = window.location.hash || '';
        const q = hash.indexOf('?');
        const fromHash = q >= 0 ? new URLSearchParams(hash.slice(q + 1)).get('chrome') : null;
        const v = fromHash !== null && fromHash !== void 0 ? fromHash : new URLSearchParams(window.location.search || '').get('chrome');
        return v === 'none' ? 'none' : 'full';
    }
    catch (_a) {
        return 'full';
    }
})();
/**
 * `'none'` when the host opened this page with `chrome=none`: the host's own menu carries this app's
 * views, so the app hides its side menu (and the bar with its toggle) and shows only the content.
 * Read from the address the page was first opened at.
 */
export function hostChrome() {
    return INITIAL_CHROME;
}
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
export function onNavigate(views, handler) {
    if (typeof window === 'undefined' || !inIframe())
        return () => { };
    const list = Array.isArray(views) ? views : [];
    const onMsg = (e) => {
        var _a, _b, _c, _d, _e, _f;
        if (e.source !== window.parent)
            return;
        const d = e.data;
        if (!d || typeof d !== 'object' || d.type !== 'smartlinks:navigate')
            return;
        const req = { view: d.view, path: d.path, params: d.params, highlight: d.highlight };
        const target = resolve(list, req);
        if (!target) {
            postParent('smartlinks:navigate-result', { ok: false, view: (_a = req.view) !== null && _a !== void 0 ? _a : null, path: (_b = req.path) !== null && _b !== void 0 ? _b : null, reason: req.view ? 'unknown-view-or-missing-param' : 'bad-path' });
            return;
        }
        try {
            handler(target);
            postParent('smartlinks:navigate-result', { ok: true, view: (_d = (_c = target.view) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null, path: target.path });
        }
        catch (_g) {
            postParent('smartlinks:navigate-result', { ok: false, view: (_f = (_e = target.view) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : null, path: target.path, reason: 'handler-failed' });
        }
    };
    window.addEventListener('message', onMsg);
    postParent('smartlinks:navigable', { views: list.map((v) => v.id), chrome: INITIAL_CHROME });
    return () => {
        try {
            window.removeEventListener('message', onMsg);
        }
        catch ( /* ignore */_a) { /* ignore */ }
    };
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
export function openApp(req) {
    if (!req || typeof req.appId !== 'string' || !req.appId)
        return;
    postParent('smartlinks:open-app', Object.assign(Object.assign(Object.assign({ appId: req.appId }, (req.view ? { view: req.view } : {})), (req.params ? { params: req.params } : {})), (req.path ? { path: req.path } : {})));
}
/** The platform's screens any admin screen can open by name. */
export const DESTINATIONS = [
    // People
    { name: 'contacts', required: [], description: 'The contacts list in Customers.' },
    { name: 'contact', required: ['contactId'], description: 'One contact in Customers.' },
    { name: 'contact.messages', required: ['contactId'], description: "A person's messages: the Message log for them." },
    { name: 'conversation', required: ['conversationId'], description: 'One conversation in Messages.' },
    { name: 'segment', required: ['segmentId'], description: 'One segment in Customers.' },
    { name: 'contact.conversations', required: ['contactId'], description: "A person's conversations in the Inbox (their messages and replies, with notes)." },
    { name: 'loyalty.scheme', required: ['schemeId'], description: 'One loyalty scheme in Customers.' },
    // Messages
    { name: 'message.compose', required: [], optional: ['contactId', 'about'], description: 'The Messages composer: write to one person (or choose who).' },
    { name: 'message.log', required: [], optional: ['contactId', 'about'], description: 'The Message log, filtered by person or by what the messages were about.' },
    { name: 'campaign.new', required: [], optional: ['segmentId'], description: 'A new campaign: one message to many people, with opt-in and unsubscribe.' },
    { name: 'campaign', required: ['campaignId'], description: 'One campaign in Messages.' },
    { name: 'templates', required: [], description: 'The email and message templates.' },
    { name: 'template', required: ['templateId'], description: 'One template, open in the template editor.' },
    // Catalogue and records
    { name: 'product', required: ['productId'], description: 'One product in Items.' },
    { name: 'proof', required: ['productId', 'proofId'], description: 'One item (proof) of a product.' },
    { name: 'interaction.type', required: ['interactionId'], description: 'One interaction type in Customers.' },
    { name: 'batch', required: ['productId', 'batchId'], description: 'One batch of a product (Items).' },
    { name: 'variant', required: ['productId', 'variantId'], description: 'One variant of a product (Items).' },
    { name: 'lot', required: ['lotId'], description: 'One lot (Items).' },
    { name: 'tags', required: [], description: 'The tags and codes on items (Items).' },
    { name: 'print', required: ['productId'], optional: ['proofId'], description: 'Print labels and QR codes for a product, or for one item of it (Print Studio).' },
    { name: 'form', required: ['formId'], description: 'One form, open to edit.' },
    // Things the business owns (the Assets app)
    { name: 'assets', required: [], description: 'The asset register: everything the business owns.' },
    { name: 'asset', required: ['productId', 'proofId'], description: 'One asset (productId: its type, proofId: the asset).' },
    { name: 'asset.history', required: ['productId', 'proofId'], description: "One asset's history: moves, checks and changes." },
    { name: 'places', required: [], description: 'The places assets are kept (sites, rooms, stores).' },
    // Settings
    { name: 'settings', required: [], description: 'The business settings in Studio.' },
    { name: 'settings.address', required: [], optional: ['appId'], description: "The business's address: its name, front page, app pages (appId: point at that app's page) and links domain." },
    { name: 'settings.domain', required: [], description: 'The links domain (QR codes, GS1 Digital Links), on the Your address page.' },
    { name: 'settings.languages', required: [], description: 'The languages customers see.' },
    { name: 'settings.translations', required: [], description: 'Everything translated for customers.' },
    { name: 'settings.email', required: [], description: 'Email settings: the sending address and its look.' },
    { name: 'settings.team', required: [], description: 'The people who run the business in Studio.' },
    { name: 'settings.userGroups', required: [], description: 'User groups.' },
    { name: 'settings.billing', required: [], optional: ['intent'], description: 'Billing: the plan, invoices and AI credits (top up when the allowance is used up). intent=upgrade opens on the plans to move up to.' },
    { name: 'settings.addons', required: [], description: 'Add-ons: features the account can switch on (on enterprise, each feature can be switched).' },
    { name: 'settings.modules', required: [], description: 'Modules: install, reorder and remove the apps the account uses.' },
    { name: 'settings.integrations', required: [], description: 'Integrations: connections to other systems.' },
    { name: 'settings.guide', required: [], description: 'The customer guide: the assistant visitors talk to.' },
    { name: 'settings.translationRules', required: [], description: 'Translation rules: the brief, notes per language and terms to keep.' },
    { name: 'settings.setupLists', required: [], optional: ['appId'], description: "Set-up lists (an app's lists the business keeps)." },
    { name: 'settings.portal', required: [], description: 'The Portal: what people see when they scan.' },
    { name: 'settings.hub', required: [], description: 'The Hub: the ready-made site.' },
    { name: 'settings.signIn', required: [], description: 'Customer sign-in.' },
    { name: 'media', required: [], description: 'Images and files (assets).' },
    // Anything else
    { name: 'app', required: ['appId'], optional: ['view', 'params'], description: "Another app at one of its screens (as `openApp`)." },
];
const ANSWER_MS = 1500;
let available_ = null;
let listening = false;
const openWaiters = new Map();
const listWaiters = new Set();
function cleanAbout(a) {
    if (!a || typeof a !== 'object')
        return undefined;
    const o = a;
    if (typeof o.type !== 'string' || typeof o.id !== 'string' || !o.type || !o.id)
        return undefined;
    const out = { type: o.type, id: o.id };
    if (typeof o.appId === 'string')
        out.appId = o.appId;
    if (typeof o.view === 'string')
        out.view = o.view;
    if (typeof o.label === 'string')
        out.label = o.label;
    if (o.params && typeof o.params === 'object')
        out.params = stringsOnly(o.params);
    return out;
}
function stringsOnly(o) {
    const out = {};
    if (o && typeof o === 'object')
        for (const [k, v] of Object.entries(o))
            if (typeof v === 'string' && v)
                out[k] = v;
    return out;
}
function listen() {
    if (listening || typeof window === 'undefined' || !inIframe())
        return;
    listening = true;
    window.addEventListener('message', (e) => {
        if (e.source !== window.parent)
            return;
        const d = e.data;
        if (!d || typeof d !== 'object')
            return;
        if (d.type === 'smartlinks:destinations' && Array.isArray(d.available)) {
            available_ = d.available.filter((n) => typeof n === 'string');
            for (const w of listWaiters)
                w(available_);
            listWaiters.clear();
        }
        else if (d.type === 'smartlinks:open-result' && typeof d.id === 'string') {
            const w = openWaiters.get(d.id);
            if (w) {
                openWaiters.delete(d.id);
                w(Object.assign({ ok: !!d.ok }, (typeof d.reason === 'string' ? { reason: d.reason } : {})));
            }
        }
    });
}
/**
 * The destinations this host can open here: `['contact', 'message.compose', 'settings.domain', …]`.
 * Leaves out a screen whose app isn't on in this collection. `[]` with no host (the admin page opened
 * on its own), after a short wait.
 */
export function available() {
    if (typeof window === 'undefined' || !inIframe())
        return Promise.resolve([]);
    listen();
    if (available_)
        return Promise.resolve(available_);
    return new Promise((resolve) => {
        const done = (list) => { clearTimeout(timer); resolve(list); };
        const timer = setTimeout(() => { listWaiters.delete(done); resolve([]); }, ANSWER_MS);
        listWaiters.add(done);
        postParent('smartlinks:destinations-request', {});
    });
}
/**
 * Whether `open(name)` will open something here. Ask before showing a button: false when the screen's
 * app isn't on (Messages not switched on) or there is no host. Then hide the button, or say what to
 * switch on. Build your own only when the platform has nothing.
 *
 * @example
 *   const canMessage = await SL.adminViews.canOpen('message.compose')
 */
export async function canOpen(name) {
    return (await available()).includes(name);
}
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
export function open(to, params = {}) {
    if (typeof to !== 'string' || !to)
        return Promise.resolve({ ok: false, reason: 'unknown' });
    if (typeof window === 'undefined' || !inIframe())
        return Promise.resolve({ ok: false, reason: 'no-host' });
    listen();
    const id = `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const flat = {};
    for (const [k, v] of Object.entries(params || {}))
        if (k !== 'about' && k !== 'params' && typeof v === 'string' && v)
            flat[k] = v;
    const about = cleanAbout(params === null || params === void 0 ? void 0 : params.about);
    const appParams = (params === null || params === void 0 ? void 0 : params.params) ? stringsOnly(params.params) : undefined;
    return new Promise((resolve) => {
        const timer = setTimeout(() => { openWaiters.delete(id); resolve({ ok: false, reason: 'no-host' }); }, ANSWER_MS);
        openWaiters.set(id, (r) => { clearTimeout(timer); resolve(r); });
        postParent('smartlinks:open', Object.assign(Object.assign({ id,
            to, params: flat }, (about ? { about } : {})), (appParams ? { appParams } : {})));
    });
}
// -----------------------------------------------------------------------------
// Host side
// -----------------------------------------------------------------------------
/**
 * Ask an embedded app to open a screen. Post this only once the app has said it follows navigate
 * (`smartlinks:navigable`); otherwise reload the frame at the new path as before.
 */
export function postNavigate(target, req, targetOrigin = '*') {
    if (!target)
        return;
    try {
        target.postMessage(Object.assign({ type: 'smartlinks:navigate' }, req), targetOrigin);
    }
    catch (_a) {
        /* ignore */
    }
}
/** Tell an embedded app which destinations it can open here (on load, on request, and when it changes). */
export function postDestinations(target, availableNames, targetOrigin = '*') {
    if (!target)
        return;
    try {
        target.postMessage({ type: 'smartlinks:destinations', available: availableNames }, targetOrigin);
    }
    catch (_a) {
        /* ignore */
    }
}
/** Answer an app's `smartlinks:open`. */
export function postOpenResult(target, result, targetOrigin = '*') {
    if (!target)
        return;
    try {
        target.postMessage(Object.assign({ type: 'smartlinks:open-result' }, result), targetOrigin);
    }
    catch (_a) {
        /* ignore */
    }
}
