var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { post, getBaseURL, getApiHeaders } from "../http";
const analyticsBrowserState = {
    config: {
        sessionStorageKey: 'smartlinks.analytics.sessionId',
        visitorStorage: 'local',
        visitorStorageKey: 'smartlinks.analytics.visitorId',
        autoCaptureCampaignParams: true,
    },
};
const defaultCampaignParamMap = {
    utmSource: ['utm_source', 'utmSource'],
    utmMedium: ['utm_medium', 'utmMedium'],
    utmCampaign: ['utm_campaign', 'utmCampaign'],
    utmContent: ['utm_content', 'utmContent'],
    utmTerm: ['utm_term', 'utmTerm'],
    entryType: ['entryType', 'entry'],
    group: 'group',
    tag: 'tag',
    campaign: 'campaign',
    placement: 'placement',
    linkGroup: ['linkGroup', 'link_group'],
    linkPlacement: ['linkPlacement', 'link_placement'],
    linkPosition: ['linkPosition', 'link_position'],
    linkTitle: ['linkTitle', 'link_title'],
    destinationDomain: ['destinationDomain', 'destination_domain'],
    pagePath: ['pagePath', 'page_path'],
    pageId: 'pageId',
    qrCodeId: 'qrCodeId',
    scanMethod: ['scanMethod', 'scan_method'],
};
function createSessionId() {
    return `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}
function createVisitorId() {
    return `visitor_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}
function getStorage(mode) {
    try {
        if (mode === 'local' && typeof localStorage !== 'undefined')
            return localStorage;
        if (mode === 'session' && typeof sessionStorage !== 'undefined')
            return sessionStorage;
    }
    catch (_a) {
    }
    return undefined;
}
function getOrCreateSessionId() {
    var _a, _b, _c, _d;
    if (analyticsBrowserState.sessionId)
        return analyticsBrowserState.sessionId;
    const key = (_a = analyticsBrowserState.config.sessionStorageKey) !== null && _a !== void 0 ? _a : 'smartlinks.analytics.sessionId';
    const storage = getStorage('session');
    const existing = key ? storage === null || storage === void 0 ? void 0 : storage.getItem(key) : undefined;
    if (existing) {
        analyticsBrowserState.sessionId = existing;
        return existing;
    }
    const generated = (_d = (_c = (_b = analyticsBrowserState.config).sessionIdFactory) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : createSessionId();
    analyticsBrowserState.sessionId = generated;
    if (key) {
        try {
            storage === null || storage === void 0 ? void 0 : storage.setItem(key, generated);
        }
        catch (_e) {
        }
    }
    return generated;
}
function getOrCreateVisitorId() {
    var _a, _b, _c, _d, _e;
    if (analyticsBrowserState.config.visitorStorage === false)
        return undefined;
    if (analyticsBrowserState.visitorId)
        return analyticsBrowserState.visitorId;
    const storageMode = (_a = analyticsBrowserState.config.visitorStorage) !== null && _a !== void 0 ? _a : 'local';
    const key = (_b = analyticsBrowserState.config.visitorStorageKey) !== null && _b !== void 0 ? _b : 'smartlinks.analytics.visitorId';
    const storage = getStorage(storageMode);
    const existing = key ? storage === null || storage === void 0 ? void 0 : storage.getItem(key) : undefined;
    if (existing) {
        analyticsBrowserState.visitorId = existing;
        return existing;
    }
    const generated = (_e = (_d = (_c = analyticsBrowserState.config).visitorIdFactory) === null || _d === void 0 ? void 0 : _d.call(_c)) !== null && _e !== void 0 ? _e : createVisitorId();
    analyticsBrowserState.visitorId = generated;
    if (key) {
        try {
            storage === null || storage === void 0 ? void 0 : storage.setItem(key, generated);
        }
        catch (_f) {
        }
    }
    return generated;
}
function persistVisitorId(visitorId, options = {}) {
    var _a, _b, _c, _d;
    analyticsBrowserState.visitorId = visitorId;
    const storageMode = (_b = (_a = options.storage) !== null && _a !== void 0 ? _a : analyticsBrowserState.config.visitorStorage) !== null && _b !== void 0 ? _b : 'local';
    const storageKey = (_d = (_c = options.storageKey) !== null && _c !== void 0 ? _c : analyticsBrowserState.config.visitorStorageKey) !== null && _d !== void 0 ? _d : 'smartlinks.analytics.visitorId';
    const shouldPersist = options.persist !== false && storageMode !== false;
    const storage = shouldPersist ? getStorage(storageMode) : undefined;
    if (!storageKey || !storage)
        return visitorId;
    try {
        if (visitorId) {
            storage.setItem(storageKey, visitorId);
        }
        else {
            storage.removeItem(storageKey);
        }
    }
    catch (_e) {
    }
    return visitorId;
}
function detectDeviceType() {
    var _a;
    if (typeof navigator === 'undefined' || typeof screen === 'undefined')
        return 'unknown';
    const ua = (_a = navigator.userAgent) !== null && _a !== void 0 ? _a : '';
    if (/Mobi|Android/i.test(ua)) {
        if (Math.min(screen.width, screen.height) >= 768)
            return 'tablet';
        return 'mobile';
    }
    if (/iPad|Tablet/i.test(ua))
        return 'tablet';
    return 'desktop';
}
function getCurrentPath() {
    if (typeof window === 'undefined')
        return undefined;
    return `${window.location.pathname}${window.location.search}`;
}
function getCurrentReferrerFields() {
    if (typeof document === 'undefined' || !document.referrer)
        return {};
    try {
        const referrerUrl = new URL(document.referrer);
        return {
            referrer: document.referrer,
            referrerHost: referrerUrl.hostname,
        };
    }
    catch (_a) {
        return {
            referrer: document.referrer,
        };
    }
}
function getCampaignFields(search) {
    var _a;
    const query = search !== null && search !== void 0 ? search : (typeof window !== 'undefined' ? window.location.search : '');
    if (!query)
        return {};
    const params = new URLSearchParams(query);
    const fields = {};
    const paramMap = Object.assign(Object.assign({}, defaultCampaignParamMap), ((_a = analyticsBrowserState.config.campaignParamMap) !== null && _a !== void 0 ? _a : {}));
    for (const [field, aliases] of Object.entries(paramMap)) {
        const names = Array.isArray(aliases) ? aliases : [aliases];
        for (const name of names) {
            const value = params.get(name);
            if (value) {
                ;
                fields[field] = value;
                break;
            }
        }
    }
    return fields;
}
function getDestinationDomain(href) {
    if (!href)
        return undefined;
    try {
        const base = typeof window !== 'undefined' ? window.location.href : undefined;
        return new URL(href, base).hostname;
    }
    catch (_a) {
        return undefined;
    }
}
function getResolvedLocation() {
    var _a, _b, _c;
    if (analyticsBrowserState.location !== undefined)
        return (_a = analyticsBrowserState.location) !== null && _a !== void 0 ? _a : undefined;
    const configured = (_c = (_b = analyticsBrowserState.config).getLocation) === null || _c === void 0 ? void 0 : _c.call(_b);
    if (configured !== undefined)
        return configured !== null && configured !== void 0 ? configured : undefined;
    return undefined;
}
function mergeCollectionEventDefaults(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const configuredDefaults = (_a = analyticsBrowserState.config.defaultCollectionEvent) !== null && _a !== void 0 ? _a : {};
    const dynamicDefaults = (_d = (_c = (_b = analyticsBrowserState.config).getCollectionDefaults) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : {};
    const campaignFields = analyticsBrowserState.config.autoCaptureCampaignParams === false ? {} : getCampaignFields();
    const path = (_e = event.path) !== null && _e !== void 0 ? _e : getCurrentPath();
    const visitorId = (_f = event.visitorId) !== null && _f !== void 0 ? _f : getOrCreateVisitorId();
    const href = (_h = (_g = event.href) !== null && _g !== void 0 ? _g : dynamicDefaults.href) !== null && _h !== void 0 ? _h : configuredDefaults.href;
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, configuredDefaults), dynamicDefaults), campaignFields), getCurrentReferrerFields()), { visitorId, sessionId: getOrCreateSessionId(), deviceType: detectDeviceType(), path, pagePath: (_k = (_j = event.pagePath) !== null && _j !== void 0 ? _j : campaignFields.pagePath) !== null && _k !== void 0 ? _k : path, destinationDomain: (_l = event.destinationDomain) !== null && _l !== void 0 ? _l : getDestinationDomain(href), location: getResolvedLocation(), eventType: 'page_view' }), event), { metadata: Object.assign(Object.assign(Object.assign(Object.assign({}, ((_m = configuredDefaults.metadata) !== null && _m !== void 0 ? _m : {})), ((_o = dynamicDefaults.metadata) !== null && _o !== void 0 ? _o : {})), (visitorId ? { visitorId } : {})), ((_p = event.metadata) !== null && _p !== void 0 ? _p : {})) });
}
function mergeTagEventDefaults(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const configuredDefaults = (_a = analyticsBrowserState.config.defaultTagEvent) !== null && _a !== void 0 ? _a : {};
    const dynamicDefaults = (_d = (_c = (_b = analyticsBrowserState.config).getTagDefaults) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : {};
    const visitorId = (_e = event.visitorId) !== null && _e !== void 0 ? _e : getOrCreateVisitorId();
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, configuredDefaults), dynamicDefaults), { visitorId, sessionId: getOrCreateSessionId(), deviceType: detectDeviceType(), location: getResolvedLocation(), eventType: 'scan_tag' }), event), { metadata: Object.assign(Object.assign(Object.assign(Object.assign({}, ((_f = configuredDefaults.metadata) !== null && _f !== void 0 ? _f : {})), ((_g = dynamicDefaults.metadata) !== null && _g !== void 0 ? _g : {})), (visitorId ? { visitorId } : {})), ((_h = event.metadata) !== null && _h !== void 0 ? _h : {})) });
}
function isExternalHref(href) {
    if (typeof window === 'undefined')
        return undefined;
    try {
        const url = new URL(href, window.location.href);
        return url.hostname !== window.location.hostname;
    }
    catch (_a) {
        return undefined;
    }
}
function queueAnalytics(path, body, options) {
    const baseURL = getBaseURL();
    if (!baseURL) {
        throw new Error('HTTP client is not initialized. Call initializeApi(...) first.');
    }
    const url = `${baseURL}${path}`;
    const payload = JSON.stringify(body);
    const headers = getApiHeaders();
    const preferBeacon = (options === null || options === void 0 ? void 0 : options.preferBeacon) !== false;
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function' && preferBeacon) {
        try {
            const blob = new Blob([payload], { type: 'application/json' });
            const queued = navigator.sendBeacon(url, blob);
            if (queued)
                return { queued: true, transport: 'beacon' };
        }
        catch (_a) {
        }
    }
    if (typeof fetch === 'function') {
        void fetch(url, {
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
            body: payload,
            keepalive: true,
        }).catch(() => { });
        return { queued: true, transport: 'fetch' };
    }
    return { queued: false, transport: 'unavailable' };
}
export var analytics;
(function (analytics) {
    let collection;
    (function (collection) {
        /**
         * Fire-and-forget collection analytics event.
         * Uses `navigator.sendBeacon()` when available, falling back to `fetch(..., { keepalive: true })`.
         */
        function track(event, options) {
            return queueAnalytics('/public/analytics/collection', event, options);
        }
        collection.track = track;
    })(collection = analytics.collection || (analytics.collection = {}));
    let tag;
    (function (tag) {
        /**
         * Fire-and-forget tag analytics event.
         * Uses `navigator.sendBeacon()` when available, falling back to `fetch(..., { keepalive: true })`.
         */
        function track(event, options) {
            return queueAnalytics('/public/analytics/tag', event, options);
        }
        tag.track = track;
    })(tag = analytics.tag || (analytics.tag = {}));
    let browser;
    (function (browser) {
        function configure(config) {
            const { visitorId } = config, nextConfig = __rest(config, ["visitorId"]);
            analyticsBrowserState.config = Object.assign(Object.assign({}, analyticsBrowserState.config), nextConfig);
            if (visitorId) {
                setVisitorId(visitorId);
            }
        }
        browser.configure = configure;
        function getSessionId() {
            return getOrCreateSessionId();
        }
        browser.getSessionId = getSessionId;
        function getVisitorId() {
            return getOrCreateVisitorId();
        }
        browser.getVisitorId = getVisitorId;
        function setVisitorId(visitorId, options) {
            var _a;
            return (_a = persistVisitorId(visitorId, options)) !== null && _a !== void 0 ? _a : visitorId;
        }
        browser.setVisitorId = setVisitorId;
        function clearVisitorId(options) {
            persistVisitorId(undefined, Object.assign(Object.assign({}, options), { persist: true }));
        }
        browser.clearVisitorId = clearVisitorId;
        function captureCampaignParams(search) {
            return getCampaignFields(search);
        }
        browser.captureCampaignParams = captureCampaignParams;
        function setLocation(location) {
            analyticsBrowserState.location = location;
        }
        browser.setLocation = setLocation;
        function clearLocation() {
            analyticsBrowserState.location = null;
        }
        browser.clearLocation = clearLocation;
        function getLocation() {
            return getResolvedLocation();
        }
        browser.getLocation = getLocation;
        function detectDevice() {
            return detectDeviceType();
        }
        browser.detectDevice = detectDevice;
        async function captureLocation(options = {}) {
            if (typeof navigator === 'undefined' || !navigator.geolocation)
                return null;
            const location = await new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(({ coords }) => {
                    const nextLocation = {};
                    if (options.includeCoordinates !== false) {
                        nextLocation.latitude = coords.latitude;
                        nextLocation.longitude = coords.longitude;
                    }
                    if (options.includeAccuracyArea) {
                        nextLocation.area = coords.accuracy;
                    }
                    resolve(nextLocation);
                }, () => resolve(null), options);
            });
            analyticsBrowserState.location = location;
            return location;
        }
        browser.captureLocation = captureLocation;
        function trackCollection(event, options) {
            return collection.track(mergeCollectionEventDefaults(event), options);
        }
        browser.trackCollection = trackCollection;
        function trackTag(event, options) {
            return tag.track(mergeTagEventDefaults(event), options);
        }
        browser.trackTag = trackTag;
        function trackPageView(event, options) {
            return trackCollection(Object.assign({ eventType: 'page_view' }, event), options);
        }
        browser.trackPageView = trackPageView;
        function trackLinkClick(event, options) {
            var _a, _b, _c, _d;
            return trackCollection(Object.assign({ eventType: 'click_link', path: (_a = event.path) !== null && _a !== void 0 ? _a : getCurrentPath(), pagePath: (_c = (_b = event.pagePath) !== null && _b !== void 0 ? _b : event.path) !== null && _c !== void 0 ? _c : getCurrentPath(), isExternal: (_d = event.isExternal) !== null && _d !== void 0 ? _d : isExternalHref(event.href) }, event), options);
        }
        browser.trackLinkClick = trackLinkClick;
        function trackTagScan(event, options) {
            return trackTag(Object.assign({ eventType: 'scan_tag' }, event), options);
        }
        browser.trackTagScan = trackTagScan;
        function bindPageViews(binding = {}) {
            if (typeof window === 'undefined' || typeof history === 'undefined')
                return () => { };
            const trackOptions = binding.trackOptions;
            const includeHashChanges = binding.includeHashChanges === true;
            let lastPath;
            const track = () => {
                var _a, _b;
                const path = getCurrentPath();
                if (!path || path === lastPath)
                    return;
                const extraEvent = (_a = binding.getEvent) === null || _a === void 0 ? void 0 : _a.call(binding, path);
                if (extraEvent === null)
                    return;
                lastPath = path;
                trackPageView(Object.assign(Object.assign({ path, pagePath: path }, ((_b = binding.event) !== null && _b !== void 0 ? _b : {})), (extraEvent !== null && extraEvent !== void 0 ? extraEvent : {})), trackOptions);
            };
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            history.pushState = function (...args) {
                originalPushState.apply(history, args);
                track();
            };
            history.replaceState = function (...args) {
                originalReplaceState.apply(history, args);
                track();
            };
            window.addEventListener('popstate', track);
            if (includeHashChanges) {
                window.addEventListener('hashchange', track);
            }
            if (binding.trackInitialPageView !== false) {
                track();
            }
            else {
                lastPath = getCurrentPath();
            }
            return () => {
                history.pushState = originalPushState;
                history.replaceState = originalReplaceState;
                window.removeEventListener('popstate', track);
                if (includeHashChanges) {
                    window.removeEventListener('hashchange', track);
                }
            };
        }
        browser.bindPageViews = bindPageViews;
        function bindLinkTracking(binding = {}) {
            var _a, _b;
            if (typeof document === 'undefined')
                return () => { };
            const root = (_a = binding.root) !== null && _a !== void 0 ? _a : document;
            const selector = (_b = binding.selector) !== null && _b !== void 0 ? _b : 'a[href]';
            const handler = (event) => {
                var _a, _b, _c, _d, _e, _f, _g;
                const mouseEvent = event;
                const target = mouseEvent.target;
                const anchor = (_a = target === null || target === void 0 ? void 0 : target.closest) === null || _a === void 0 ? void 0 : _a.call(target, selector);
                if (!(anchor === null || anchor === void 0 ? void 0 : anchor.href))
                    return;
                const customEvent = (_b = binding.getEvent) === null || _b === void 0 ? void 0 : _b.call(binding, anchor, mouseEvent);
                if (customEvent === null)
                    return;
                const external = isExternalHref(anchor.href);
                if (binding.trackInternal === false && external === false)
                    return;
                trackLinkClick(Object.assign(Object.assign(Object.assign({ href: anchor.href, linkTitle: ((_c = anchor.textContent) === null || _c === void 0 ? void 0 : _c.trim()) || undefined }, ((_d = binding.event) !== null && _d !== void 0 ? _d : {})), (customEvent !== null && customEvent !== void 0 ? customEvent : {})), { isExternal: (_g = (_e = customEvent === null || customEvent === void 0 ? void 0 : customEvent.isExternal) !== null && _e !== void 0 ? _e : (_f = binding.event) === null || _f === void 0 ? void 0 : _f.isExternal) !== null && _g !== void 0 ? _g : external }), binding.trackOptions);
            };
            root.addEventListener('click', handler);
            return () => root.removeEventListener('click', handler);
        }
        browser.bindLinkTracking = bindLinkTracking;
    })(browser = analytics.browser || (analytics.browser = {}));
    let admin;
    (function (admin) {
        async function classicBreakdown(collectionId, body, config) {
            const { metric = 'count', limit = 10, source = 'events', eventType } = body, rest = __rest(body, ["metric", "limit", "source", "eventType"]);
            return breakdown(collectionId, Object.assign({ source, dimension: config.dimension, metadataKey: config.metadataKey, metric,
                limit, eventType: eventType !== null && eventType !== void 0 ? eventType : config.defaultEventType }, rest));
        }
        async function summary(collectionId, body) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/summary`, body);
        }
        admin.summary = summary;
        async function timeseries(collectionId, body) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/timeseries`, body);
        }
        admin.timeseries = timeseries;
        async function breakdown(collectionId, body) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/breakdown`, body);
        }
        admin.breakdown = breakdown;
        async function events(collectionId, body) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/events`, body);
        }
        admin.events = events;
        async function web(collectionId, body = {}) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/web`, body);
        }
        admin.web = web;
        async function clicks(collectionId, body = {}) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/clicks`, body);
        }
        admin.clicks = clicks;
        async function tagScans(collectionId, body = {}) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/tag-scans`, body);
        }
        admin.tagScans = tagScans;
        async function products(collectionId, body = {}) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/products`, body);
        }
        admin.products = products;
        async function qrCodes(collectionId, body = {}) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/qr-codes`, body);
        }
        admin.qrCodes = qrCodes;
        async function tags(collectionId, body = {}) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/tags`, body);
        }
        admin.tags = tags;
        async function weekly(collectionId, body = {}) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/weekly`, body);
        }
        admin.weekly = weekly;
        async function country(collectionId, body = {}) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/analytics/country`, body);
        }
        admin.country = country;
        async function topPages(collectionId, body = {}) {
            return classicBreakdown(collectionId, body, {
                dimension: 'metadata',
                metadataKey: 'pagePath',
                defaultEventType: 'page_view',
            });
        }
        admin.topPages = topPages;
        async function topReferrers(collectionId, body = {}) {
            return classicBreakdown(collectionId, body, {
                dimension: 'metadata',
                metadataKey: 'referrerHost',
                defaultEventType: 'page_view',
            });
        }
        admin.topReferrers = topReferrers;
        async function topCampaigns(collectionId, body = {}) {
            return classicBreakdown(collectionId, body, {
                dimension: 'metadata',
                metadataKey: 'utmCampaign',
                defaultEventType: 'page_view',
            });
        }
        admin.topCampaigns = topCampaigns;
        async function topSources(collectionId, body = {}) {
            return classicBreakdown(collectionId, body, {
                dimension: 'metadata',
                metadataKey: 'utmSource',
                defaultEventType: 'page_view',
            });
        }
        admin.topSources = topSources;
        async function topDestinations(collectionId, body = {}) {
            return classicBreakdown(collectionId, body, {
                dimension: 'metadata',
                metadataKey: 'destinationDomain',
                defaultEventType: 'click_link',
            });
        }
        admin.topDestinations = topDestinations;
    })(admin = analytics.admin || (analytics.admin = {}));
})(analytics || (analytics = {}));
