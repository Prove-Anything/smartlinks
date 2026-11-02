// iframe.ts
// Utilities to communicate with parent window when running inside an iframe.
// These helpers are optional and safe in non-browser / Node environments.
// They build on the existing proxyMode infrastructure but can also be used standalone.
// Re-export IframeResponder for parent-side iframe communication
export { IframeResponder, isAdminFromRoles, buildIframeSrc, } from './iframeResponder.js';
export var iframe;
(function (iframe) {
    let autoResizeTimer;
    let lastHeight = 0;
    let resizeOptions;
    let resizeObserver;
    let mutationObserver;
    function isBrowser() {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    }
    function inIframe() {
        return isBrowser() && window.parent && window.parent !== window;
    }
    function postParentMessage(type, payload) {
        if (!inIframe())
            return;
        try {
            window.parent.postMessage({ _smartlinksIframeMessage: true, type, payload }, '*');
        }
        catch (_a) {
            // swallow errors silently
        }
    }
    /** Redirect parent window to a URL (if in iframe). */
    function redirectParent(url) {
        postParentMessage('smartlinks:redirect', { url });
    }
    iframe.redirectParent = redirectParent;
    /** Request parent to adjust iframe height to current content height. */
    function sendHeight(height, extra) {
        if (!inIframe())
            return;
        const h = height !== null && height !== void 0 ? height : measureHeight();
        postParentMessage((resizeOptions === null || resizeOptions === void 0 ? void 0 : resizeOptions.messageType) || 'smartlinks:resize', Object.assign(Object.assign({ height: h }, resizeOptions === null || resizeOptions === void 0 ? void 0 : resizeOptions.extra), extra));
    }
    iframe.sendHeight = sendHeight;
    /**
     * The page's own height — not the frame's. scrollHeight and clientHeight are never less than the iframe's
     * viewport, so a page that got shorter (a step done, a list emptied) was still reported at the frame's old
     * height and the frame never shrank. When the page overflows the frame, its scrollHeight is the real
     * height (absolutely positioned content included); when it fits, the document's own box is.
     */
    function measureHeight() {
        if (!isBrowser())
            return 0;
        const doc = document.documentElement;
        if (doc.scrollHeight > doc.clientHeight + 1)
            return doc.scrollHeight;
        const body = document.body;
        let bodyHeight = 0;
        if (body) {
            const cs = window.getComputedStyle(body);
            bodyHeight = body.offsetHeight + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0);
        }
        return Math.ceil(Math.max(doc.offsetHeight, bodyHeight));
    }
    function scheduleManualPolling() {
        var _a;
        if (!isBrowser())
            return;
        clearInterval(autoResizeTimer);
        const interval = (_a = resizeOptions === null || resizeOptions === void 0 ? void 0 : resizeOptions.intervalMs) !== null && _a !== void 0 ? _a : 100;
        autoResizeTimer = window.setInterval(() => {
            const h = measureHeight();
            if ((resizeOptions === null || resizeOptions === void 0 ? void 0 : resizeOptions.alwaysSend) || h !== lastHeight) {
                lastHeight = h;
                sendHeight(h);
            }
        }, interval);
    }
    let measureQueued = false;
    /**
     * Measure once, a moment after a burst of changes, however many asked for it. A timer, not
     * requestAnimationFrame: frames are paused in a hidden page and in an off-screen cross-origin iframe (an
     * app below the fold), so the height wasn't reported until it was scrolled into view; timers only slow down.
     */
    function queueMeasure() {
        if (measureQueued || !isBrowser())
            return;
        measureQueued = true;
        const run = () => {
            measureQueued = false;
            if (!resizeOptions)
                return;
            const h = measureHeight();
            if (resizeOptions.alwaysSend || h !== lastHeight) {
                lastHeight = h;
                sendHeight(h);
            }
        };
        setTimeout(run, 30);
    }
    let lastWidth = 0;
    /** The frame got wider or narrower: the page reflows. (Its height is ours to set — not a reason.) */
    function onWindowResize() {
        if (window.innerWidth === lastWidth)
            return;
        lastWidth = window.innerWidth;
        queueMeasure();
    }
    const CONTENT_EVENTS = ['load', 'transitionend', 'animationend'];
    /**
     * Re-measure when something that changes the page's height happens: its content (any DOM change — a step
     * rendered, times loaded), an image or font arriving, a transition or animation ending, the frame's width.
     * Never the frame's own height: an app held at the frame's height (html/body/root at 100%, a 100vh
     * wrapper — common in app templates) changes size whenever the host resizes the frame, so watching it
     * re-measured after every resize and, with a few px beyond 100vh, grew the frame step by step. Content
     * growing INSIDE such a pinned body never resized it either, so it was never reported (the booking app
     * said "700" once while loading and nothing after).
     */
    function setupObservers() {
        if (!isBrowser())
            return;
        if (typeof MutationObserver !== 'undefined') {
            mutationObserver = new MutationObserver(queueMeasure);
            mutationObserver.observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });
        }
        else {
            scheduleManualPolling();
        }
        for (const e of CONTENT_EVENTS)
            document.addEventListener(e, queueMeasure, true);
        const fonts = document.fonts;
        if (fonts && typeof fonts.addEventListener === 'function')
            fonts.addEventListener('loadingdone', queueMeasure);
        lastWidth = window.innerWidth;
        window.addEventListener('resize', onWindowResize);
    }
    /** Enable automatic height reporting to parent iframe. */
    function enableAutoIframeResize(options) {
        if (!inIframe())
            return;
        resizeOptions = options || {};
        lastHeight = measureHeight();
        sendHeight(lastHeight);
        setupObservers();
    }
    iframe.enableAutoIframeResize = enableAutoIframeResize;
    /** Disable automatic height reporting. */
    function disableAutoIframeResize() {
        if (resizeObserver)
            resizeObserver.disconnect();
        if (mutationObserver)
            mutationObserver.disconnect();
        if (isBrowser()) {
            for (const e of CONTENT_EVENTS)
                document.removeEventListener(e, queueMeasure, true);
            const fonts = document.fonts;
            if (fonts && typeof fonts.removeEventListener === 'function')
                fonts.removeEventListener('loadingdone', queueMeasure);
            window.removeEventListener('resize', onWindowResize);
            clearInterval(autoResizeTimer);
        }
        resizeObserver = undefined;
        mutationObserver = undefined;
        autoResizeTimer = undefined;
        resizeOptions = undefined;
    }
    iframe.disableAutoIframeResize = disableAutoIframeResize;
    /** Send a custom message to parent (browser-only). */
    function sendParentCustom(type, payload) {
        postParentMessage(type, payload);
    }
    iframe.sendParentCustom = sendParentCustom;
    /**
     * Ask the embedding host (parent window) to hand this app a bearer token, for DIRECT (non-proxied)
     * mode. Posts `{ type: 'smartlinks:request-auth' }` and resolves with the token from the host's
     * `{ type: 'smartlinks:auth', bearerToken }` reply, or `null` on timeout / when not embedded.
     *
     * Use in a first-party/dev embed where the host owns the session and hands it down (the console dev
     * preview), then feed it to the SDK:
     *   SL.initializeApi({ baseURL, proxyMode: false, awaitAuth: true })
     *   SL.iframe.requestParentAuth().then(t => t && SL.setBearerToken(t))
     * Untrusted third-party embeds should use proxyMode instead (never hold the user's token).
     */
    function requestParentAuth(opts) {
        if (!inIframe())
            return Promise.resolve(null);
        return new Promise((resolve) => {
            var _a;
            let done = false;
            const finish = (v) => {
                if (done)
                    return;
                done = true;
                clearTimeout(timer);
                try {
                    window.removeEventListener('message', onMsg);
                }
                catch ( /* ignore */_a) { /* ignore */ }
                resolve(v);
            };
            const onMsg = (e) => {
                const d = e && e.data;
                if (d && d.type === 'smartlinks:auth' && typeof d.bearerToken === 'string' && d.bearerToken) {
                    finish(d.bearerToken);
                }
            };
            const timer = setTimeout(() => finish(null), (_a = opts === null || opts === void 0 ? void 0 : opts.timeoutMs) !== null && _a !== void 0 ? _a : 8000);
            try {
                window.addEventListener('message', onMsg);
            }
            catch ( /* ignore */_b) { /* ignore */ }
            postParentMessage('smartlinks:request-auth', {});
        });
    }
    iframe.requestParentAuth = requestParentAuth;
    /** Returns true if running inside an iframe (browser). */
    function isIframe() {
        return inIframe();
    }
    iframe.isIframe = isIframe;
    /** Returns true if ResizeObserver is supported in current environment. */
    function supportsResizeObserver() {
        return typeof ResizeObserver !== 'undefined';
    }
    iframe.supportsResizeObserver = supportsResizeObserver;
})(iframe || (iframe = {}));
