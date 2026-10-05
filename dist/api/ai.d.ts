import type { ContentPart, FunctionCall, ToolCall, ChatMessage, ToolDefinition, ResponseTool, ResponseInputItem, ResponsesRequest, ResponsesResult, ResponsesStreamEvent, ChatCompletionRequest, ChatCompletionChoice, ChatCompletionResponse, ChatCompletionChunk, AIModel, AIModelListParams, AIModelListResponse, AgentRunRequest, AgentRunResult, AgentToolsQuery, AgentToolsResponse, ToolRunResult, AiToolName, AiToolArgsMap, PublicAgentRunRequest, ClientTool, RunWithClientToolsOptions, SkillsListResponse, CatalogResponse, DocumentChunk, IndexDocumentRequest, IndexDocumentResponse, ConfigureAssistantRequest, ConfigureAssistantResponse, PublicChatRequest, PublicChatResponse, Session, RateLimitStatus, SessionStatistics, AiSession, AiSessionCreate, AiUsageReport, VoiceSessionRequest, VoiceSessionResponse, EphemeralTokenRequest, EphemeralTokenResponse, TranscriptionResponse, TTSRequest, GeneratePodcastRequest, PodcastScript, GeneratePodcastResponse, PodcastStatus, AIGenerateContentRequest, AIGenerateContentCandidate, AIGenerateContentResponse, AIGenerateImageRequest, AIGenerateImageResponse, AIGeneratedImage, AISearchPhotosRequest, AISearchPhotosPhoto, AISearchPhotosResponse, AIUploadedFile, AICacheRef } from "../types/ai.js";
export type { ContentPart, FunctionCall, ToolCall, ChatMessage, ToolDefinition, ResponseTool, ResponseInputItem, ResponsesRequest, ResponsesResult, ResponsesStreamEvent, ChatCompletionRequest, ChatCompletionChoice, ChatCompletionResponse, ChatCompletionChunk, AIModel, AIModelListParams, AIModelListResponse, DocumentChunk, IndexDocumentRequest, IndexDocumentResponse, ConfigureAssistantRequest, ConfigureAssistantResponse, PublicChatRequest, PublicChatResponse, Session, RateLimitStatus, SessionStatistics, AiSession, AiSessionCreate, AiUsageReport, VoiceSessionRequest, VoiceSessionResponse, EphemeralTokenRequest, EphemeralTokenResponse, TranscriptionResponse, TTSRequest, GeneratePodcastRequest, PodcastScript, GeneratePodcastResponse, PodcastStatus, AIGenerateContentRequest, AIGenerateContentCandidate, AIGenerateContentResponse, AIGenerateImageRequest, AIGenerateImageResponse, AIGeneratedImage, AISearchPhotosRequest, AISearchPhotosPhoto, AISearchPhotosResponse, AIUploadedFile, AICacheRef, };
declare namespace aiInternal {
    namespace chat {
        namespace responses {
            /**
             * Create a Responses API request (streaming or non-streaming)
             * @param collectionId - Collection identifier
             * @param request - Responses API request
             * @returns Responses API result or async iterable for streaming events
             */
            function create(collectionId: string, request: ResponsesRequest): Promise<ResponsesResult | AsyncIterable<ResponsesStreamEvent>>;
        }
        namespace completions {
            /**
             * Create a chat completion (streaming or non-streaming)
             * @param collectionId - Collection identifier
             * @param request - Chat completion request
             * @returns Chat completion response or async iterable for streaming
             */
            function create(collectionId: string, request: ChatCompletionRequest): Promise<ChatCompletionResponse | AsyncIterable<ChatCompletionChunk>>;
        }
    }
    namespace agent {
        /**
         * Run the server-side AI agent loop once: assembles the tool set, runs the
         * model, executes tool calls, and returns the final text + the tool trace.
         * POST /admin/collection/:collectionId/ai/agent/run
         */
        function run(collectionId: string, body: AgentRunRequest): Promise<AgentRunResult>;
        /**
         * List the tools the agent can use (optionally scoped by capability / name).
         * GET /admin/collection/:collectionId/ai/agent/tools
         */
        function listTools(collectionId: string, query?: AgentToolsQuery): Promise<AgentToolsResponse>;
    }
    namespace tools {
        /**
         * Invoke ONE built-in server tool directly — no model in the loop. This is the
         * "direct code" caller of the orchestration-neutral tool registry: the SAME tools the
         * agent loop and the Responses `server_tools` path run, but called as a plain, typed,
         * deterministic API. A front end can use it two ways: (1) call a tool straight as an
         * API (e.g. `pdf.render` / `pdf.extract` behind a PDF UX), or (2) drive its OWN agent
         * loop and execute each model tool-call here. Capability-gated server-side to the
         * caller's grants (same blast-radius rules as the agent loop).
         * POST /admin/collection/:collectionId/ai/tools/:name/run
         */
        function run<K extends AiToolName>(collectionId: string, name: K, args: AiToolArgsMap[K]): Promise<ToolRunResult>;
        function run<T = any>(collectionId: string, name: string, args?: Record<string, any>): Promise<ToolRunResult<T>>;
    }
    namespace skills {
        /** List the skills apps can invoke (name, description, input/output schema). */
        function list(collectionId: string): Promise<SkillsListResponse>;
        /**
         * Invoke a skill by name with structured input — the app-facing verb; no
         * prompt-shaping. POST /admin/collection/:collectionId/ai/skills/:name/run
         */
        function run<T = any>(collectionId: string, name: string, input?: Record<string, any>): Promise<T>;
    }
    /** The full self-describing catalog (tools + skills). GET /ai/catalog */
    function catalog(collectionId: string): Promise<CatalogResponse>;
    namespace models {
        /**
         * List available AI models
         */
        function list(collectionId: string, params?: AIModelListParams): Promise<AIModelListResponse>;
        /**
         * Get specific model information
         */
        function get(collectionId: string, modelId: string): Promise<AIModel>;
    }
    namespace rag {
        /**
         * Index a document for RAG
         */
        function indexDocument(collectionId: string, request: IndexDocumentRequest): Promise<IndexDocumentResponse>;
        /**
         * Configure AI assistant behavior
         */
        function configureAssistant(collectionId: string, request: ConfigureAssistantRequest): Promise<ConfigureAssistantResponse>;
    }
    namespace sessions {
        /**
         * Get session statistics
         */
        function stats(collectionId: string): Promise<SessionStatistics>;
        /**
         * Persisted AI assistant sessions (admin scope) — durable conversation history for
         * admin/host assistants. Create one, then either append your turns explicitly, OR pass
         * its `id` as `session_id` to `ai.chat.responses.create` and the server threads prior
         * turns into the input and persists the new turn automatically (works with `server_tools`).
         */
        function create(collectionId: string, body?: AiSessionCreate): Promise<AiSession>;
        /** List sessions, most-recently-active first (optionally filtered by app). */
        function list(collectionId: string, params?: {
            appId?: string;
            limit?: number;
        }): Promise<{
            sessions: AiSession[];
        }>;
        /** Get one session, including its full transcript. */
        function get(collectionId: string, id: string): Promise<AiSession>;
        /** Append Responses items (input/output/tool) to a session — the manual-persistence path. */
        function append(collectionId: string, id: string, items: ResponseInputItem[], opts?: {
            usage?: Record<string, any>;
        }): Promise<AiSession>;
        /** Archive (soft-delete) a session. */
        function clear(collectionId: string, id: string): Promise<{
            ok: boolean;
            id: string;
        }>;
    }
    /**
     * AI usage for a collection (daily totals), grouped by any of model/appId/feature/mode/surface/provider/day
     * over an optional date window (YYYY-MM-DD). Usage only — requests, tokens, images; no cost figures.
     */
    function usage(collectionId: string, params?: {
        groupBy?: string | string[];
        from?: string;
        to?: string;
    }): Promise<AiUsageReport>;
    namespace rateLimit {
        /**
         * Reset rate limit for a user
         */
        function reset(collectionId: string, userId: string): Promise<{
            success: boolean;
            userId: string;
        }>;
    }
    namespace podcast {
        /**
         * Generate a NotebookLM-style conversational podcast from product documents
         */
        function generate(collectionId: string, request: GeneratePodcastRequest): Promise<GeneratePodcastResponse>;
        /**
         * Get podcast generation status
         */
        function getStatus(collectionId: string, podcastId: string): Promise<PodcastStatus>;
    }
    namespace tts {
        /**
         * Generate text-to-speech audio
         */
        function generate(collectionId: string, request: TTSRequest): Promise<Blob>;
    }
    namespace publicClient {
        /**
         * Chat with product assistant (RAG)
         */
        function chat(collectionId: string, request: PublicChatRequest): Promise<PublicChatResponse>;
        /**
         * Public agent loop — run the orchestration-neutral tool loop on the consumer surface. Exposes an
         * app's PUBLIC server functions (`agent.tool:true`, `visibility:'public'`) to a consumer assistant;
         * built-in tools are opt-in by explicit `server_tools[]` allowlist only. The caller runs as the
         * signed-in consumer ('owner', send the authKit bearer) or anonymous ('public').
         * POST /public/collection/:collectionId/ai/agent/run
         */
        function agentRun(collectionId: string, body: PublicAgentRunRequest): Promise<AgentRunResult>;
        /**
         * Get session history
         */
        function getSession(collectionId: string, sessionId: string): Promise<Session>;
        /**
         * Clear session history
         */
        function clearSession(collectionId: string, sessionId: string): Promise<{
            success: boolean;
        }>;
        /**
         * Persisted consumer AI sessions (durable — the replacement for getSession/clearSession above).
         * `scope: 'owner'` keys the history to the signed-in consumer (send the authKit bearer, and
         * only that consumer can read/append/clear it); `scope: 'public'` (default) is an anonymous
         * session where possession of the id is the capability.
         */
        namespace sessions {
            function create(collectionId: string, body?: AiSessionCreate & {
                scope?: 'owner' | 'public';
            }): Promise<AiSession>;
            /** List the signed-in consumer's own ('owner') sessions — requires an authKit bearer. */
            function list(collectionId: string, params?: {
                appId?: string;
                limit?: number;
            }): Promise<{
                sessions: AiSession[];
            }>;
            function get(collectionId: string, id: string): Promise<AiSession>;
            function append(collectionId: string, id: string, items: ResponseInputItem[], opts?: {
                usage?: Record<string, any>;
            }): Promise<AiSession>;
            function clear(collectionId: string, id: string): Promise<{
                ok: boolean;
                id: string;
            }>;
        }
        /**
         * Check rate limit status
         */
        function getRateLimit(collectionId: string, userId: string): Promise<RateLimitStatus>;
        /**
         * Generate ephemeral token for Gemini Live
         */
        function getToken(collectionId: string, request: EphemeralTokenRequest): Promise<EphemeralTokenResponse>;
    }
    namespace voice {
        /**
         * Check if voice is supported in browser
         */
        function isSupported(): boolean;
        /**
         * Listen for voice input
         */
        function listen(language?: string): Promise<string>;
        /**
         * Speak text
         */
        function speak(text: string, options?: {
            voice?: string;
            rate?: number;
        }): Promise<void>;
    }
    /**
     * Generate text/content via AI (admin)
     * @deprecated Use ai.chat.completions.create() instead
     */
    function generateContent(collectionId: string, params: AIGenerateContentRequest, admin?: boolean): Promise<AIGenerateContentResponse>;
    /**
     * Generate an image via AI (admin)
     */
    function generateImage(collectionId: string, params: AIGenerateImageRequest): Promise<AIGenerateImageResponse>;
    /**
     * Search stock photos or similar via AI (admin)
     */
    function searchPhotos(collectionId: string, params: AISearchPhotosRequest): Promise<AISearchPhotosResponse>;
    /**
     * Upload a file for AI usage (admin). Pass FormData for binary uploads.
     */
    function uploadFile(collectionId: string, params: any): Promise<AIUploadedFile>;
    /**
     * Create or warm a cache for AI (admin)
     */
    function createCache(collectionId: string, params: any): Promise<AICacheRef>;
    /**
     * Declare a client tool + its browser-side handler. The `declaration` (name/description/input) is
     * sent to the model; the `handler` runs in the page when the model calls it — so it can touch the
     * DOM, the user's session, local state, etc. Pair with `runWithClientTools`.
     */
    function defineClientTool(name: string, spec: {
        description?: string;
        input?: Record<string, any>;
    }, handler: (args: Record<string, any>) => any | Promise<any>): ClientTool;
    /**
     * Run an agent conversation that can call CLIENT tools, resolving them in the browser automatically.
     * Drives the suspend/resume loop: call the agent → if it suspends on a client tool
     * (`status:'requires_action'`), run the matching handler(s), append their outputs, and resubmit —
     * until a final answer. Built-ins + app functions ride along via `toolbelt`. Only declared tools run
     * (a call for an unknown tool throws), and each runs with the user's own auth.
     */
    function runWithClientTools(collectionId: string, opts: RunWithClientToolsOptions): Promise<AgentRunResult>;
}
export declare const ai: {
    chat: {
        responses: {
            create: typeof aiInternal.chat.responses.create;
        };
        completions: {
            create: typeof aiInternal.chat.completions.create;
        };
    };
    models: {
        list: typeof aiInternal.models.list;
        get: typeof aiInternal.models.get;
    };
    rag: {
        indexDocument: typeof aiInternal.rag.indexDocument;
        configureAssistant: typeof aiInternal.rag.configureAssistant;
    };
    sessions: {
        stats: typeof aiInternal.sessions.stats;
    };
    rateLimit: {
        reset: typeof aiInternal.rateLimit.reset;
    };
    podcast: {
        generate: typeof aiInternal.podcast.generate;
        getStatus: typeof aiInternal.podcast.getStatus;
    };
    tts: {
        generate: typeof aiInternal.tts.generate;
    };
    public: {
        chat: typeof aiInternal.publicClient.chat;
        agentRun: typeof aiInternal.publicClient.agentRun;
        getSession: typeof aiInternal.publicClient.getSession;
        clearSession: typeof aiInternal.publicClient.clearSession;
        getRateLimit: typeof aiInternal.publicClient.getRateLimit;
        getToken: typeof aiInternal.publicClient.getToken;
    };
    voice: {
        isSupported: typeof aiInternal.voice.isSupported;
        listen: typeof aiInternal.voice.listen;
        speak: typeof aiInternal.voice.speak;
    };
    agent: {
        run: typeof aiInternal.agent.run;
        listTools: typeof aiInternal.agent.listTools;
    };
    tools: {
        run: typeof aiInternal.tools.run;
    };
    defineClientTool: typeof aiInternal.defineClientTool;
    runWithClientTools: typeof aiInternal.runWithClientTools;
    skills: {
        list: typeof aiInternal.skills.list;
        run: typeof aiInternal.skills.run;
    };
    catalog: typeof aiInternal.catalog;
    generateContent: typeof aiInternal.generateContent;
    generateImage: typeof aiInternal.generateImage;
    searchPhotos: typeof aiInternal.searchPhotos;
    uploadFile: typeof aiInternal.uploadFile;
    createCache: typeof aiInternal.createCache;
};
