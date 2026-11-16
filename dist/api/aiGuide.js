// The customer guide, and "what's on my screen" for AI (browser side of prove docs/design/customer-assistant.md).
//
//   ai.guide.get(collectionId, surface)       is the guide on here, its name, modes and opening questions
//   ai.guide.start(collectionId, options)     a live conversation with it, by voice or by text
//   ai.content.provide(handler)               an app says what its screen shows, in words
//   ai.content.request(options)               a host asks the app on screen what it shows
//
// The guide runs as the visitor (anonymous, or signed in with Auth Kit). Everything that shapes it — its
// instructions, voice and tools — is fixed by SmartLinks when the conversation starts; the page only says
// where the visitor is and what is on their screen.
import { post, request } from '../http.js';
import { startLive } from '../live.js';
const base = (collectionId) => `/public/collection/${encodeURIComponent(collectionId)}/ai/guide`;
export var guide;
(function (guide) {
    /** Is the guide on for this surface, and how does it present itself? */
    async function get(collectionId, surface) {
        return request(`${base(collectionId)}${surface ? `?surface=${surface}` : ''}`);
    }
    guide.get = get;
    /** Start a live conversation with the guide. Resolves once connected; the handle pauses, stops, sends text. */
    async function start(collectionId, options) {
        let handoff = null;
        const language = options.language || (typeof navigator !== 'undefined' ? (navigator.language || '').split('-')[0] : '') || undefined;
        const screenTools = {
            read_screen: async () => {
                var _a;
                const s = options.readScreen ? await options.readScreen() : await content.request({ timeoutMs: 1500 });
                return s && s.content ? { title: (_a = s.title) !== null && _a !== void 0 ? _a : null, content: String(s.content).slice(0, 12000) } : { error: 'Nothing to read on the screen right now.' };
            },
            show_app: async (args) => {
                var _a, _b;
                if (!options.showApp)
                    return { error: "That can't be opened from here." };
                await options.showApp(String((_a = args['appId']) !== null && _a !== void 0 ? _a : ''));
                return { opened: String((_b = args['appId']) !== null && _b !== void 0 ? _b : '') };
            },
            go_to: async (args) => {
                var _a;
                const id = String((_a = args['productId']) !== null && _a !== void 0 ? _a : '');
                if (!id)
                    return { error: 'Which product?' };
                if (!options.goTo)
                    return { error: "That can't be opened from here." };
                await options.goTo(id);
                return { opened: id };
            },
            offer_person: async () => {
                var _a;
                if (!handoff)
                    return { error: 'There is no way to reach a person set up.' };
                await ((_a = options.offerPerson) === null || _a === void 0 ? void 0 : _a.call(options, handoff));
                return { shown: handoff.kind };
            },
        };
        const opts = {
            mode: options.mode,
            build: 'sdk-guide-1',
            screenTools,
            endpoints: {
                mint: async () => {
                    var _a, _b, _c;
                    const reply = await post(`${base(collectionId)}/session`, {
                        surface: options.surface,
                        mode: options.mode,
                        productId: (_a = options.productId) !== null && _a !== void 0 ? _a : undefined,
                        proofId: (_b = options.proofId) !== null && _b !== void 0 ? _b : undefined,
                        apps: options.apps,
                        where: options.where,
                        language,
                        screen: options.screen,
                    });
                    handoff = (_c = reply.handoff) !== null && _c !== void 0 ? _c : null;
                    return reply;
                },
                tool: (name, args, sessionId) => post(`${base(collectionId)}/tool`, { name, args, sessionId }),
                event: (event) => { void post(`${base(collectionId)}/event`, event).catch(() => undefined); },
            },
            onToolReply: async (_name, reply) => {
                var _a, _b;
                if (reply['show'])
                    (_a = options.onShow) === null || _a === void 0 ? void 0 : _a.call(options, reply['show']);
                if (reply['navigate'])
                    await ((_b = options.openPage) === null || _b === void 0 ? void 0 : _b.call(options, reply['navigate']));
            },
            onState: options.onState,
            onCaption: options.onCaption,
            onReply: options.onReply,
            onError: options.onError,
            onMuted: options.onMuted,
        };
        return startLive(opts);
    }
    guide.start = start;
})(guide || (guide = {}));
const REQUEST = 'smartlinks:ai-content-request';
const REPLY = 'smartlinks:ai-content';
const local = new Set();
export var content;
(function (content) {
    /**
     * An app says what its screen shows, in words (an exhibit's text, a recipe, a form's purpose). Called
     * whenever an assistant needs it. Works in an iframe (the host asks by message) and in the same page
     * (a direct component). Returns a function that stops providing.
     */
    function provide(handler) {
        local.add(handler);
        let onMessage = null;
        if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
            onMessage = (e) => {
                const d = e.data;
                if (e.source !== window.parent || !d || d.type !== REQUEST || !d.id)
                    return;
                void Promise.resolve(handler({ reason: d.reason }))
                    .catch(() => null)
                    .then((c) => window.parent.postMessage({ type: REPLY, id: d.id, content: c !== null && c !== void 0 ? c : null }, '*'));
            };
            window.addEventListener('message', onMessage);
        }
        return () => {
            local.delete(handler);
            if (onMessage)
                window.removeEventListener('message', onMessage);
        };
    }
    content.provide = provide;
    /**
     * A host asks what the app on screen shows: an app in an iframe (pass its window as `frame`), or apps in
     * this page that called `provide`. Resolves null if nothing answers within the time.
     */
    async function request(options = {}) {
        var _a;
        const timeoutMs = (_a = options.timeoutMs) !== null && _a !== void 0 ? _a : 1000;
        if (options.frame) {
            const frame = options.frame;
            const id = Math.random().toString(36).slice(2);
            return new Promise((resolve) => {
                const done = (c) => { clearTimeout(timer); window.removeEventListener('message', onMessage); resolve(c); };
                const onMessage = (e) => {
                    var _a;
                    const d = e.data;
                    if (e.source === frame && d && d.type === REPLY && d.id === id)
                        done((_a = d.content) !== null && _a !== void 0 ? _a : null);
                };
                const timer = setTimeout(() => done(null), timeoutMs);
                window.addEventListener('message', onMessage);
                frame.postMessage({ type: REQUEST, id, reason: options.reason }, '*');
            });
        }
        for (const handler of [...local].reverse()) {
            const c = await Promise.race([
                Promise.resolve(handler({ reason: options.reason })).catch(() => null),
                new Promise((r) => setTimeout(() => r(null), timeoutMs)),
            ]);
            if (c && c.content)
                return c;
        }
        return null;
    }
    content.request = request;
})(content || (content = {}));
export { startLive };
