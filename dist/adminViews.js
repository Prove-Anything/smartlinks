// src/adminViews.ts
// ADMIN VIEWS — an app's admin screens by name (app.manifest.json#adminViews), and the two runtime
// messages that use them:
//   host → app   { type: 'smartlinks:navigate', view?, path?, params?, highlight? }   open a screen, no reload
//   app → host   'smartlinks:navigable'  (the app follows navigate)   'smartlinks:navigate-result'
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
