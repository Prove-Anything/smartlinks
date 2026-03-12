import type { ContentPart, FunctionCall, ToolCall, ChatMessage, ToolDefinition, ResponseTool, ResponseInputItem, ResponsesRequest, ResponsesResult, ResponsesStreamEvent, ChatCompletionRequest, ChatCompletionChoice, ChatCompletionResponse, ChatCompletionChunk, AIModel, AIModelListParams, AIModelListResponse, DocumentChunk, IndexDocumentRequest, IndexDocumentResponse, ConfigureAssistantRequest, ConfigureAssistantResponse, PublicChatRequest, PublicChatResponse, Session, RateLimitStatus, SessionStatistics, VoiceSessionRequest, VoiceSessionResponse, EphemeralTokenRequest, EphemeralTokenResponse, TranscriptionResponse, TTSRequest, GeneratePodcastRequest, PodcastScript, GeneratePodcastResponse, PodcastStatus, AIGenerateContentRequest, AIGenerateImageRequest, AISearchPhotosRequest, AISearchPhotosPhoto } from "../types/ai";
export type { ContentPart, FunctionCall, ToolCall, ChatMessage, ToolDefinition, ResponseTool, ResponseInputItem, ResponsesRequest, ResponsesResult, ResponsesStreamEvent, ChatCompletionRequest, ChatCompletionChoice, ChatCompletionResponse, ChatCompletionChunk, AIModel, AIModelListParams, AIModelListResponse, DocumentChunk, IndexDocumentRequest, IndexDocumentResponse, ConfigureAssistantRequest, ConfigureAssistantResponse, PublicChatRequest, PublicChatResponse, Session, RateLimitStatus, SessionStatistics, VoiceSessionRequest, VoiceSessionResponse, EphemeralTokenRequest, EphemeralTokenResponse, TranscriptionResponse, TTSRequest, GeneratePodcastRequest, PodcastScript, GeneratePodcastResponse, PodcastStatus, AIGenerateContentRequest, AIGenerateImageRequest, AISearchPhotosRequest, AISearchPhotosPhoto, };
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
    }
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
    function generateContent(collectionId: string, params: AIGenerateContentRequest, admin?: boolean): Promise<any>;
    /**
     * Generate an image via AI (admin)
     */
    function generateImage(collectionId: string, params: AIGenerateImageRequest): Promise<any>;
    /**
     * Search stock photos or similar via AI (admin)
     */
    function searchPhotos(collectionId: string, params: AISearchPhotosRequest): Promise<AISearchPhotosPhoto[]>;
    /**
     * Upload a file for AI usage (admin). Pass FormData for binary uploads.
     */
    function uploadFile(collectionId: string, params: any): Promise<any>;
    /**
     * Create or warm a cache for AI (admin)
     */
    function createCache(collectionId: string, params: any): Promise<any>;
    /**
     * Post a chat message to the AI (admin or public)
     */
    function postChat(collectionId: string, params: any, admin?: boolean): Promise<any>;
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
    generateContent: typeof aiInternal.generateContent;
    generateImage: typeof aiInternal.generateImage;
    searchPhotos: typeof aiInternal.searchPhotos;
    uploadFile: typeof aiInternal.uploadFile;
    createCache: typeof aiInternal.createCache;
    postChat: typeof aiInternal.postChat;
};
