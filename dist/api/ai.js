var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
// src/api/ai.ts
// AI endpoints: public and admin helpers
import { post, request, del, getBaseURL, getApiHeaders } from "../http";
import { SmartlinksApiError } from "../types/error";
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
async function createSseStream(path, body) {
    var _a, _b, _c;
    const baseURL = getBaseURL();
    if (!baseURL) {
        throw new Error('HTTP client is not initialized. Call initializeApi(...) first.');
    }
    const url = `${baseURL}${path}`;
    const headers = Object.assign({ Accept: 'text/event-stream', 'Content-Type': 'application/json' }, getApiHeaders());
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        let responseBody;
        try {
            responseBody = await response.json();
        }
        catch (_d) {
            responseBody = null;
        }
        const code = response.status;
        const message = (responseBody === null || responseBody === void 0 ? void 0 : responseBody.message) || ((_a = responseBody === null || responseBody === void 0 ? void 0 : responseBody.error) === null || _a === void 0 ? void 0 : _a.message) || `Request failed with status ${code}`;
        throw new SmartlinksApiError(`Error ${code}: ${message}`, code, {
            code,
            errorCode: ((_b = responseBody === null || responseBody === void 0 ? void 0 : responseBody.error) === null || _b === void 0 ? void 0 : _b.code) || (responseBody === null || responseBody === void 0 ? void 0 : responseBody.errorCode),
            message,
            details: ((_c = responseBody === null || responseBody === void 0 ? void 0 : responseBody.error) === null || _c === void 0 ? void 0 : _c.details) || (responseBody === null || responseBody === void 0 ? void 0 : responseBody.details),
        }, url);
    }
    if (!response.body) {
        throw new Error('Streaming response body is unavailable in this environment');
    }
    return parseSseStream(response.body);
}
function parseSseStream(stream) {
    return __asyncGenerator(this, arguments, function* parseSseStream_1() {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let dataLines = [];
        while (true) {
            const { done, value } = yield __await(reader.read());
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() || '';
            for (const rawLine of lines) {
                const line = rawLine.trimEnd();
                if (!line) {
                    if (!dataLines.length)
                        continue;
                    const payload = dataLines.join('\n');
                    dataLines = [];
                    if (payload === '[DONE]')
                        return yield __await(void 0);
                    try {
                        yield yield __await(JSON.parse(payload));
                    }
                    catch (_a) {
                        continue;
                    }
                    continue;
                }
                if (line.startsWith('data:')) {
                    dataLines.push(line.slice(5).trimStart());
                }
            }
        }
        if (dataLines.length) {
            const payload = dataLines.join('\n');
            if (payload !== '[DONE]') {
                try {
                    yield yield __await(JSON.parse(payload));
                }
                catch (_b) {
                    return yield __await(void 0);
                }
            }
        }
    });
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
                const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/v1/responses`;
                if (request.stream) {
                    return createSseStream(path, request);
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
                    return createSseStream(path, request);
                }
                return post(path, request);
            }
            completions.create = create;
        })(completions = chat.completions || (chat.completions = {}));
    })(chat = aiInternal.chat || (aiInternal.chat = {}));
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
    })(sessions = aiInternal.sessions || (aiInternal.sessions = {}));
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
    /**
     * Post a chat message to the AI (admin or public)
     */
    async function postChat(collectionId, params, admin = true) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/ai/postChat`;
        return post(path, params);
    }
    aiInternal.postChat = postChat;
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
    generateContent: aiInternal.generateContent,
    generateImage: aiInternal.generateImage,
    searchPhotos: aiInternal.searchPhotos,
    uploadFile: aiInternal.uploadFile,
    createCache: aiInternal.createCache,
    postChat: aiInternal.postChat,
};
