// src/api/ai.ts
// AI endpoints: public and admin helpers
import { post, request, del, requestStream } from "../http.js";
function encodeQueryParams(params) {
    if (!params)
        return '';
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value)
            query.append(key, value);
    });
    const search = query.toString();
    return search ? `?${search}` : '';
}
var aiInternal;
(function (aiInternal) {
    // ============================================================================
    // Chat APIs
    // ============================================================================
    let chat;
    (function (chat) {
        let responses;
        (function (responses) {
            /**
             * Create a Responses API request (streaming or non-streaming)
             * @param collectionId - Collection identifier
             * @param request - Responses API request
             * @returns Responses API result or async iterable for streaming events
             */
            async function create(collectionId, request) {
                var _a;
                const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/v1/responses`;
                if (((_a = request.multi_agent) === null || _a === void 0 ? void 0 : _a.enabled) && request.stream) {
                    throw new Error('Streaming is not supported when multi_agent.enabled is true');
                }
                if (request.stream) {
                    return requestStream(path, { method: 'POST', body: request });
                }
                return post(path, request);
            }
            responses.create = create;
        })(responses = chat.responses || (chat.responses = {}));
        let completions;
        (function (completions) {
            /**
             * Create a chat completion (streaming or non-streaming)
             * @param collectionId - Collection identifier
             * @param request - Chat completion request
             * @returns Chat completion response or async iterable for streaming
             */
            async function create(collectionId, request) {
                const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/v1/chat/completions`;
                if (request.stream) {
                    return requestStream(path, { method: 'POST', body: request });
                }
                return post(path, request);
            }
            completions.create = create;
        })(completions = chat.completions || (chat.completions = {}));
    })(chat = aiInternal.chat || (aiInternal.chat = {}));
    // ============================================================================
    // Agent API (server-side tool-registry loop)
    // ============================================================================
    let agent;
    (function (agent) {
        /**
         * Run the server-side AI agent loop once: assembles the tool set, runs the
         * model, executes tool calls, and returns the final text + the tool trace.
         * POST /admin/collection/:collectionId/ai/agent/run
         */
        async function run(collectionId, body) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/agent/run`;
            return post(path, body);
        }
        agent.run = run;
        /**
         * List the tools the agent can use (optionally scoped by capability / name).
         * GET /admin/collection/:collectionId/ai/agent/tools
         */
        async function listTools(collectionId, query = {}) {
            const search = new URLSearchParams();
            for (const [k, v] of Object.entries(query)) {
                if (v)
                    search.set(k, String(v));
            }
            const qs = search.toString();
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/agent/tools${qs ? `?${qs}` : ''}`;
            return request(path);
        }
        agent.listTools = listTools;
    })(agent = aiInternal.agent || (aiInternal.agent = {}));
    // ============================================================================
    // Tools (direct, deterministic single-tool invocation — no model loop)
    // ============================================================================
    let tools;
    (function (tools) {
        async function run(collectionId, name, args = {}) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/tools/${encodeURIComponent(name)}/run`;
            return post(path, args);
        }
        tools.run = run;
    })(tools = aiInternal.tools || (aiInternal.tools = {}));
    // ============================================================================
    // Skills + Catalog (app-facing discovery)
    // ============================================================================
    let skills;
    (function (skills) {
        /** List the skills apps can invoke (name, description, input/output schema). */
        async function list(collectionId) {
            return request(`/admin/collection/${encodeURIComponent(collectionId)}/ai/skills`);
        }
        skills.list = list;
        /**
         * Invoke a skill by name with structured input — the app-facing verb; no
         * prompt-shaping. POST /admin/collection/:collectionId/ai/skills/:name/run
         */
        async function run(collectionId, name, input = {}) {
            return post(`/admin/collection/${encodeURIComponent(collectionId)}/ai/skills/${encodeURIComponent(name)}/run`, input);
        }
        skills.run = run;
    })(skills = aiInternal.skills || (aiInternal.skills = {}));
    /** The full self-describing catalog (tools + skills). GET /ai/catalog */
    async function catalog(collectionId) {
        return request(`/admin/collection/${encodeURIComponent(collectionId)}/ai/catalog`);
    }
    aiInternal.catalog = catalog;
    // ============================================================================
    // Models API
    // ============================================================================
    let models;
    (function (models) {
        /**
         * List available AI models
         */
        async function list(collectionId, params) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/models${encodeQueryParams({
                provider: params === null || params === void 0 ? void 0 : params.provider,
                capability: params === null || params === void 0 ? void 0 : params.capability,
            })}`;
            return request(path);
        }
        models.list = list;
        /**
         * Get specific model information
         */
        async function get(collectionId, modelId) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/models/${encodeURIComponent(modelId)}`;
            return request(path);
        }
        models.get = get;
    })(models = aiInternal.models || (aiInternal.models = {}));
    // ============================================================================
    // RAG API
    // ============================================================================
    let rag;
    (function (rag) {
        /**
         * Index a document for RAG
         */
        async function indexDocument(collectionId, request) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/indexDocument`;
            return post(path, request);
        }
        rag.indexDocument = indexDocument;
        /**
         * Configure AI assistant behavior
         */
        async function configureAssistant(collectionId, request) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/configureAssistant`;
            return post(path, request);
        }
        rag.configureAssistant = configureAssistant;
    })(rag = aiInternal.rag || (aiInternal.rag = {}));
    // ============================================================================
    // Sessions API
    // ============================================================================
    let sessions;
    (function (sessions) {
        /**
         * Get session statistics
         */
        async function stats(collectionId) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/sessions/stats`;
            return request(path);
        }
        sessions.stats = stats;
        /**
         * Persisted AI assistant sessions (admin scope) — durable conversation history for
         * admin/host assistants. Create one, then either append your turns explicitly, OR pass
         * its `id` as `session_id` to `ai.chat.responses.create` and the server threads prior
         * turns into the input and persists the new turn automatically (works with `server_tools`).
         */
        async function create(collectionId, body = {}) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/sessions`;
            return post(path, body);
        }
        sessions.create = create;
        /** List sessions, most-recently-active first (optionally filtered by app). */
        async function list(collectionId, params) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/sessions${encodeQueryParams({
                appId: params === null || params === void 0 ? void 0 : params.appId,
                limit: (params === null || params === void 0 ? void 0 : params.limit) != null ? String(params.limit) : undefined,
            })}`;
            return request(path);
        }
        sessions.list = list;
        /** Get one session, including its full transcript. */
        async function get(collectionId, id) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/sessions/${encodeURIComponent(id)}`;
            return request(path);
        }
        sessions.get = get;
        /** Append Responses items (input/output/tool) to a session — the manual-persistence path. */
        async function append(collectionId, id, items, opts) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/sessions/${encodeURIComponent(id)}/append`;
            return post(path, { items, usage: opts === null || opts === void 0 ? void 0 : opts.usage });
        }
        sessions.append = append;
        /** Archive (soft-delete) a session. */
        async function clear(collectionId, id) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/sessions/${encodeURIComponent(id)}`;
            return del(path);
        }
        sessions.clear = clear;
    })(sessions = aiInternal.sessions || (aiInternal.sessions = {}));
    /**
     * AI usage for a collection (daily totals), grouped by any of model/appId/feature/mode/surface/provider/day
     * over an optional date window (YYYY-MM-DD). Usage only — requests, tokens, images; no cost figures.
     */
    async function usage(collectionId, params) {
        const groupBy = Array.isArray(params === null || params === void 0 ? void 0 : params.groupBy) ? params.groupBy.join(',') : params === null || params === void 0 ? void 0 : params.groupBy;
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/usage${encodeQueryParams({
            groupBy,
            from: params === null || params === void 0 ? void 0 : params.from,
            to: params === null || params === void 0 ? void 0 : params.to,
        })}`;
        return request(path);
    }
    aiInternal.usage = usage;
    // ============================================================================
    // Rate Limiting API
    // ============================================================================
    let rateLimit;
    (function (rateLimit) {
        /**
         * Reset rate limit for a user
         */
        async function reset(collectionId, userId) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/rate-limit/${encodeURIComponent(userId)}/reset`;
            return post(path, {});
        }
        rateLimit.reset = reset;
    })(rateLimit = aiInternal.rateLimit || (aiInternal.rateLimit = {}));
    // ============================================================================
    // Podcast API
    // ============================================================================
    let podcast;
    (function (podcast) {
        /**
         * Generate a NotebookLM-style conversational podcast from product documents
         */
        async function generate(collectionId, request) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/generatePodcast`;
            return post(path, request);
        }
        podcast.generate = generate;
        /**
         * Get podcast generation status
         */
        async function getStatus(collectionId, podcastId) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/podcast/${encodeURIComponent(podcastId)}`;
            return request(path);
        }
        podcast.getStatus = getStatus;
    })(podcast = aiInternal.podcast || (aiInternal.podcast = {}));
    // ============================================================================
    // TTS API
    // ============================================================================
    let tts;
    (function (tts) {
        /**
         * Generate text-to-speech audio
         */
        async function generate(collectionId, request) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/tts`;
            // Note: This would need special handling for binary response
            return post(path, request);
        }
        tts.generate = generate;
    })(tts = aiInternal.tts || (aiInternal.tts = {}));
    // ============================================================================
    // Public API (no authentication required)
    // ============================================================================
    let publicClient;
    (function (publicClient) {
        /**
         * Chat with product assistant (RAG)
         */
        async function chat(collectionId, request) {
            const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/chat`;
            return post(path, request);
        }
        publicClient.chat = chat;
        /**
         * Public agent loop — run the orchestration-neutral tool loop on the consumer surface. Exposes an
         * app's PUBLIC server functions (`agent.tool:true`, `visibility:'public'`) to a consumer assistant;
         * built-in tools are opt-in by explicit `server_tools[]` allowlist only. The caller runs as the
         * signed-in consumer ('owner', send the authKit bearer) or anonymous ('public').
         * POST /public/collection/:collectionId/ai/agent/run
         */
        async function agentRun(collectionId, body) {
            const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/agent/run`;
            return post(path, body);
        }
        publicClient.agentRun = agentRun;
        /**
         * Get session history
         */
        async function getSession(collectionId, sessionId) {
            const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/session/${encodeURIComponent(sessionId)}`;
            return request(path);
        }
        publicClient.getSession = getSession;
        /**
         * Clear session history
         */
        async function clearSession(collectionId, sessionId) {
            const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/session/${encodeURIComponent(sessionId)}`;
            return del(path);
        }
        publicClient.clearSession = clearSession;
        /**
         * Persisted consumer AI sessions (durable — the replacement for getSession/clearSession above).
         * `scope: 'owner'` keys the history to the signed-in consumer (send the authKit bearer, and
         * only that consumer can read/append/clear it); `scope: 'public'` (default) is an anonymous
         * session where possession of the id is the capability.
         */
        let sessions;
        (function (sessions) {
            async function create(collectionId, body = {}) {
                const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/sessions`;
                return post(path, body);
            }
            sessions.create = create;
            /** List the signed-in consumer's own ('owner') sessions — requires an authKit bearer. */
            async function list(collectionId, params) {
                const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/sessions${encodeQueryParams({
                    appId: params === null || params === void 0 ? void 0 : params.appId,
                    limit: (params === null || params === void 0 ? void 0 : params.limit) != null ? String(params.limit) : undefined,
                })}`;
                return request(path);
            }
            sessions.list = list;
            async function get(collectionId, id) {
                const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/sessions/${encodeURIComponent(id)}`;
                return request(path);
            }
            sessions.get = get;
            async function append(collectionId, id, items, opts) {
                const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/sessions/${encodeURIComponent(id)}/append`;
                return post(path, { items, usage: opts === null || opts === void 0 ? void 0 : opts.usage });
            }
            sessions.append = append;
            async function clear(collectionId, id) {
                const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/sessions/${encodeURIComponent(id)}`;
                return del(path);
            }
            sessions.clear = clear;
        })(sessions = publicClient.sessions || (publicClient.sessions = {}));
        /**
         * Check rate limit status
         */
        async function getRateLimit(collectionId, userId) {
            const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/rate-limit/${encodeURIComponent(userId)}`;
            return request(path);
        }
        publicClient.getRateLimit = getRateLimit;
        /**
         * Generate ephemeral token for Gemini Live
         */
        async function getToken(collectionId, request) {
            const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/token`;
            return post(path, request);
        }
        publicClient.getToken = getToken;
    })(publicClient = aiInternal.publicClient || (aiInternal.publicClient = {}));
    // ============================================================================
    // Voice Helpers (Browser-only)
    // ============================================================================
    let voice;
    (function (voice_1) {
        /**
         * Check if voice is supported in browser
         */
        function isSupported() {
            if (typeof window === 'undefined')
                return false;
            return ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && 'speechSynthesis' in window;
        }
        voice_1.isSupported = isSupported;
        /**
         * Listen for voice input
         */
        async function listen(language = 'en-US') {
            if (typeof window === 'undefined') {
                throw new Error('Voice input is only available in the browser');
            }
            if (!isSupported()) {
                throw new Error('Speech recognition not supported in this browser');
            }
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = language;
            recognition.continuous = false;
            recognition.interimResults = false;
            return new Promise((resolve, reject) => {
                recognition.onresult = (event) => {
                    resolve(event.results[0][0].transcript);
                };
                recognition.onerror = reject;
                recognition.start();
            });
        }
        voice_1.listen = listen;
        /**
         * Speak text
         */
        async function speak(text, options) {
            if (typeof window === 'undefined') {
                throw new Error('Speech synthesis is only available in the browser');
            }
            if (!('speechSynthesis' in window)) {
                throw new Error('Speech synthesis not supported in this browser');
            }
            const utterance = new SpeechSynthesisUtterance(text);
            if (options === null || options === void 0 ? void 0 : options.rate)
                utterance.rate = options.rate;
            if (options === null || options === void 0 ? void 0 : options.voice) {
                const voices = speechSynthesis.getVoices();
                const voice = voices.find(v => v.name === options.voice);
                if (voice)
                    utterance.voice = voice;
            }
            return new Promise((resolve) => {
                utterance.onend = () => resolve();
                speechSynthesis.speak(utterance);
            });
        }
        voice_1.speak = speak;
    })(voice = aiInternal.voice || (aiInternal.voice = {}));
    // ============================================================================
    // Legacy Methods (backwards compatibility)
    // ============================================================================
    /**
     * Generate text/content via AI (admin)
     * @deprecated Use ai.chat.completions.create() instead
     */
    async function generateContent(collectionId, params, admin = true) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/ai/generateContent`;
        // Normalised envelope — text is at candidates[0].content.parts[0].text.
        return post(path, params);
    }
    aiInternal.generateContent = generateContent;
    /**
     * Generate an image via AI (admin)
     */
    async function generateImage(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/generateImage`;
        return post(path, params);
    }
    aiInternal.generateImage = generateImage;
    /**
     * Search stock photos or similar via AI (admin)
     */
    async function searchPhotos(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/searchPhotos`;
        // The API wraps the photos in an envelope — the array is on `.results`.
        return post(path, params);
    }
    aiInternal.searchPhotos = searchPhotos;
    /**
     * Upload a file for AI usage (admin). Pass FormData for binary uploads.
     */
    async function uploadFile(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/uploadFile`;
        return post(path, params);
    }
    aiInternal.uploadFile = uploadFile;
    /**
     * Create or warm a cache for AI (admin)
     */
    async function createCache(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/createCache`;
        return post(path, params);
    }
    aiInternal.createCache = createCache;
    // ============================================================================
    // Client tools (kind c) — front-end tools the model calls, executed in the page
    // ============================================================================
    /**
     * Declare a client tool + its browser-side handler. The `declaration` (name/description/input) is
     * sent to the model; the `handler` runs in the page when the model calls it — so it can touch the
     * DOM, the user's session, local state, etc. Pair with `runWithClientTools`.
     */
    function defineClientTool(name, spec, handler) {
        const declaration = { name, description: spec === null || spec === void 0 ? void 0 : spec.description, input: spec === null || spec === void 0 ? void 0 : spec.input };
        return { declaration, handler };
    }
    aiInternal.defineClientTool = defineClientTool;
    /**
     * Run an agent conversation that can call CLIENT tools, resolving them in the browser automatically.
     * Drives the suspend/resume loop: call the agent → if it suspends on a client tool
     * (`status:'requires_action'`), run the matching handler(s), append their outputs, and resubmit —
     * until a final answer. Built-ins + app functions ride along via `toolbelt`. Only declared tools run
     * (a call for an unknown tool throws), and each runs with the user's own auth.
     */
    async function runWithClientTools(collectionId, opts) {
        const { tools, surface = 'admin', maxRounds = 8 } = opts;
        const byName = new Map(tools.map((t) => [t.declaration.name, t]));
        const clientTools = tools.map((t) => t.declaration);
        const toolbelt = Object.assign(Object.assign({}, (opts.toolbelt || {})), { clientTools });
        let input = opts.input;
        for (let round = 0; round < maxRounds; round++) {
            const body = { input, instructions: opts.instructions, model: opts.model, maxSteps: opts.maxSteps, toolbelt };
            const res = surface === 'public'
                ? await publicClient.agentRun(collectionId, body)
                : await agent.run(collectionId, body);
            if (!res || res.status !== 'requires_action')
                return res;
            const outputs = [];
            for (const call of (res.client_tool_calls || [])) {
                const tool = byName.get(call.name);
                if (!tool)
                    throw new Error(`runWithClientTools: model called undeclared client tool "${call.name}"`);
                const out = await tool.handler(call.args || {});
                outputs.push({ type: 'function_call_output', call_id: call.callId, output: typeof out === 'string' ? out : JSON.stringify(out !== null && out !== void 0 ? out : null) });
            }
            input = [...(res.items || []), ...outputs];
        }
        throw new Error('runWithClientTools: exceeded maxRounds without a final answer');
    }
    aiInternal.runWithClientTools = runWithClientTools;
})(aiInternal || (aiInternal = {}));
export const ai = {
    chat: {
        responses: {
            create: aiInternal.chat.responses.create,
        },
        completions: {
            create: aiInternal.chat.completions.create,
        },
    },
    models: {
        list: aiInternal.models.list,
        get: aiInternal.models.get,
    },
    rag: {
        indexDocument: aiInternal.rag.indexDocument,
        configureAssistant: aiInternal.rag.configureAssistant,
    },
    sessions: {
        stats: aiInternal.sessions.stats,
    },
    rateLimit: {
        reset: aiInternal.rateLimit.reset,
    },
    podcast: {
        generate: aiInternal.podcast.generate,
        getStatus: aiInternal.podcast.getStatus,
    },
    tts: {
        generate: aiInternal.tts.generate,
    },
    public: {
        chat: aiInternal.publicClient.chat,
        agentRun: aiInternal.publicClient.agentRun,
        getSession: aiInternal.publicClient.getSession,
        clearSession: aiInternal.publicClient.clearSession,
        getRateLimit: aiInternal.publicClient.getRateLimit,
        getToken: aiInternal.publicClient.getToken,
    },
    voice: {
        isSupported: aiInternal.voice.isSupported,
        listen: aiInternal.voice.listen,
        speak: aiInternal.voice.speak,
    },
    agent: {
        run: aiInternal.agent.run,
        listTools: aiInternal.agent.listTools,
    },
    tools: {
        run: aiInternal.tools.run,
    },
    defineClientTool: aiInternal.defineClientTool,
    runWithClientTools: aiInternal.runWithClientTools,
    skills: {
        list: aiInternal.skills.list,
        run: aiInternal.skills.run,
    },
    catalog: aiInternal.catalog,
    generateContent: aiInternal.generateContent,
    generateImage: aiInternal.generateImage,
    searchPhotos: aiInternal.searchPhotos,
    uploadFile: aiInternal.uploadFile,
    createCache: aiInternal.createCache,
};
