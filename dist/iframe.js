// iframe.ts
// Utilities to communicate with parent window when running inside an iframe.
// These helpers are optional and safe in non-browser / Node environments.
// They build on the existing proxyMode infrastructure but can also be used standalone.
// Re-export IframeResponder for parent-side iframe communication
export { IframeResponder, isAdminFromRoles, buildIframeSrc, } from './iframeResponder';
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
        const h = height !== null && height !== void 0 ? height : document.documentElement.scrollHeight;
        postParentMessage((resizeOptions === null || resizeOptions === void 0 ? void 0 : resizeOptions.messageType) || 'smartlinks:resize', Object.assign(Object.assign({ height: h }, resizeOptions === null || resizeOptions === void 0 ? void 0 : resizeOptions.extra), extra));
    }
    iframe.sendHeight = sendHeight;
    function measureHeight() {
        if (!isBrowser())
            return 0;
        const doc = document.documentElement;
        // Use max of several properties for robustness
        return Math.max(doc.scrollHeight, doc.offsetHeight, doc.clientHeight, document.body ? document.body.scrollHeight : 0, document.body ? document.body.offsetHeight : 0);
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
