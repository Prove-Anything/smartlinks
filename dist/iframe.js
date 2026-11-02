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
    function setupObservers() {
        if (!isBrowser())
            return;
        // Prefer ResizeObserver for layout changes
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
                const h = measureHeight();
                if ((resizeOptions === null || resizeOptions === void 0 ? void 0 : resizeOptions.alwaysSend) || h !== lastHeight) {
                    lastHeight = h;
                    sendHeight(h);
                }
            });
            resizeObserver.observe(document.body);
            // A body held at the frame's height (height: 100%) doesn't resize when its content does.
            resizeObserver.observe(document.documentElement);
        }
        else {
            // Fallback: MutationObserver for DOM changes
            mutationObserver = new MutationObserver(() => {
                const h = measureHeight();
                if ((resizeOptions === null || resizeOptions === void 0 ? void 0 : resizeOptions.alwaysSend) || h !== lastHeight) {
                    lastHeight = h;
                    sendHeight(h);
                }
            });
            mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
            // Manual polling as additional safeguard
            scheduleManualPolling();
        }
    }
    /** Enable automatic height reporting to parent iframe. */
    function enableAutoIframeResize(options) {
        if (!inIframe())
            return;
        resizeOptions = options || {};
        lastHeight = measureHeight();
        sendHeight(lastHeight);
        setupObservers();
        if (!resizeObserver) {
            // If no ResizeObserver, MutationObserver is active and we also poll
            scheduleManualPolling();
        }
    }
    iframe.enableAutoIframeResize = enableAutoIframeResize;
    /** Disable automatic height reporting. */
    function disableAutoIframeResize() {
        if (resizeObserver)
            resizeObserver.disconnect();
        if (mutationObserver)
            mutationObserver.disconnect();
        if (isBrowser())
            clearInterval(autoResizeTimer);
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
