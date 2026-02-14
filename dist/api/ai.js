// src/api/ai.ts
// AI endpoints: public and admin helpers
import { post, request, del } from "../http";
export var ai;
(function (ai) {
    // ============================================================================
    // Chat Completions API (OpenAI-compatible)
    // ============================================================================
    let chat;
    (function (chat) {
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
                    // TODO: Implement streaming via SSE
                    throw new Error('Streaming not yet implemented');
                }
                return post(path, request);
            }
            completions.create = create;
        })(completions = chat.completions || (chat.completions = {}));
    })(chat = ai.chat || (ai.chat = {}));
    // ============================================================================
    // Models API
    // ============================================================================
    let models;
    (function (models) {
        /**
         * List available AI models
         */
        async function list(collectionId) {
            const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/models`;
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
    })(models = ai.models || (ai.models = {}));
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
    })(rag = ai.rag || (ai.rag = {}));
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
    })(sessions = ai.sessions || (ai.sessions = {}));
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
    })(rateLimit = ai.rateLimit || (ai.rateLimit = {}));
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
    })(podcast = ai.podcast || (ai.podcast = {}));
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
    })(tts = ai.tts || (ai.tts = {}));
    // ============================================================================
    // Public API (no authentication required)
    // ============================================================================
    let publicApi;
    (function (publicApi) {
        /**
         * Chat with product assistant (RAG)
         */
        async function chat(collectionId, request) {
            const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/chat`;
            return post(path, request);
        }
        publicApi.chat = chat;
        /**
         * Get session history
         */
        async function getSession(collectionId, sessionId) {
            const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/session/${encodeURIComponent(sessionId)}`;
            return request(path);
        }
        publicApi.getSession = getSession;
        /**
         * Clear session history
         */
        async function clearSession(collectionId, sessionId) {
            const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/session/${encodeURIComponent(sessionId)}`;
            return del(path);
        }
        publicApi.clearSession = clearSession;
        /**
         * Check rate limit status
         */
        async function getRateLimit(collectionId, userId) {
            const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/rate-limit/${encodeURIComponent(userId)}`;
            return request(path);
        }
        publicApi.getRateLimit = getRateLimit;
        /**
         * Generate ephemeral token for Gemini Live
         */
        async function getToken(collectionId, request) {
            const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/token`;
            return post(path, request);
        }
        publicApi.getToken = getToken;
    })(publicApi = ai.publicApi || (ai.publicApi = {}));
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
    })(voice = ai.voice || (ai.voice = {}));
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
    ai.generateContent = generateContent;
    /**
     * Generate an image via AI (admin)
     */
    async function generateImage(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/generateImage`;
        return post(path, params);
    }
    ai.generateImage = generateImage;
    /**
     * Search stock photos or similar via AI (admin)
     */
    async function searchPhotos(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/searchPhotos`;
        return post(path, params);
    }
    ai.searchPhotos = searchPhotos;
    /**
     * Upload a file for AI usage (admin). Pass FormData for binary uploads.
     */
    async function uploadFile(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/uploadFile`;
        return post(path, params);
    }
    ai.uploadFile = uploadFile;
    /**
     * Create or warm a cache for AI (admin)
     */
    async function createCache(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/createCache`;
        return post(path, params);
    }
    ai.createCache = createCache;
    /**
     * Post a chat message to the AI (admin or public)
     */
    async function postChat(collectionId, params, admin = true) {
        const base = admin ? '/admin' : '/public';
        const path = `${base}/collection/${encodeURIComponent(collectionId)}/ai/postChat`;
        return post(path, params);
    }
    ai.postChat = postChat;
})(ai || (ai = {}));
