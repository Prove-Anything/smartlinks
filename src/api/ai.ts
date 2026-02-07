// src/api/ai.ts
// AI endpoints: public and admin helpers
import { post, request, del } from "../http"

// ============================================================================
// Chat Completions Types (OpenAI-compatible)
// ============================================================================

/** Content part for multimodal messages */
export interface ContentPart {
  type: 'text' | 'image_url'
  text?: string
  image_url?: {
    url: string
    detail?: 'auto' | 'low' | 'high'
  }
}

/** Function call representation */
export interface FunctionCall {
  name: string
  arguments: string
}

/** Tool call representation */
export interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

/** Chat message with role and content */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool'
  content: string | ContentPart[]
  name?: string
  function_call?: FunctionCall
  tool_calls?: ToolCall[]
  tool_call_id?: string
}

/** Tool/Function definition */
export interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, {
        type: string
        description?: string
        enum?: string[]
      }>
      required?: string[]
    }
  }
}

/** Chat completion request */
export interface ChatCompletionRequest {
  messages: ChatMessage[]
  model?: string
  stream?: boolean
  tools?: ToolDefinition[]
  tool_choice?: 'none' | 'auto' | 'required' | { type: 'function'; function: { name: string } }
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  response_format?: { type: 'text' | 'json_object' }
  user?: string
}

/** Chat completion choice */
export interface ChatCompletionChoice {
  index: number
  message: ChatMessage
  finish_reason: 'stop' | 'length' | 'function_call' | 'tool_calls' | 'content_filter' | null
}

/** Chat completion response */
export interface ChatCompletionResponse {
  id: string
  object: 'chat.completion'
  created: number
  model: string
  choices: ChatCompletionChoice[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/** Streaming chunk */
export interface ChatCompletionChunk {
  id: string
  object: 'chat.completion.chunk'
  created: number
  model: string
  choices: Array<{
    index: number
    delta: Partial<ChatMessage>
    finish_reason: string | null
  }>
}

// ============================================================================
// Model Types
// ============================================================================

/** AI Model information */
export interface AIModel {
  id: string
  provider: 'gemini' | 'openai'
  modelId: string
  name: string
  description: string
  capabilities: Array<'text' | 'vision' | 'audio' | 'code'>
  contextWindow: number
  pricing: {
    input: number
    output: number
    cached?: number
  }
  features: string[]
  recommended?: string
}

/** List of models */
export interface ModelList {
  object: 'list'
  data: AIModel[]
}

// ============================================================================
// RAG Types
// ============================================================================

/** Document chunk with embedding */
export interface DocumentChunk {
  text: string
  embedding: number[]
  metadata: {
    chunkIndex: number
    documentId: string
    [key: string]: any
  }
}

/** Index document request */
export interface IndexDocumentRequest {
  productId: string
  text?: string
  documentUrl?: string
  metadata?: Record<string, any>
  chunkSize?: number
  overlap?: number
  provider?: 'openai' | 'gemini'
}

/** Index document response */
export interface IndexDocumentResponse {
  success: boolean
  productId: string
  documentId: string
  chunks: number
  metadata: {
    textLength: number
    chunkSize: number
    overlap: number
    embeddingDimensions: number
  }
  sample?: {
    text: string
    chunkIndex: number
  }
}

/** Configure assistant request */
export interface ConfigureAssistantRequest {
  productId: string
  systemPrompt?: string
  model?: string
  maxTokensPerResponse?: number
  temperature?: number
  rateLimitPerUser?: number
  allowedTopics?: string[]
  customInstructions?: {
    tone?: string
    additionalRules?: string
    [key: string]: any
  }
}

/** Configure assistant response */
export interface ConfigureAssistantResponse {
  success: boolean
  configuration: {
    productId: string
    systemPrompt: string
    model: string
    maxTokensPerResponse: number
    temperature: number
    rateLimitPerUser: number
    allowedTopics: string[]
    customInstructions?: Record<string, any>
    updatedAt: string
  }
}

/** Public chat request */
export interface PublicChatRequest {
  productId: string
  userId: string
  message: string
  sessionId?: string
  stream?: boolean
}

/** Public chat response */
export interface PublicChatResponse {
  message: string
  sessionId: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  context?: {
    chunksUsed: number
    topSimilarity: number
  }
}

/** Session information */
export interface Session {
  sessionId: string
  productId: string
  userId: string
  messageCount: number
  createdAt: string
  lastActivityAt: string
  messages: ChatMessage[]
}

/** Rate limit status */
export interface RateLimitStatus {
  used: number
  remaining: number
  resetAt: string
}

/** Session statistics */
export interface SessionStatistics {
  totalSessions: number
  activeSessions: number
  totalMessages: number
  rateLimitedUsers: number
}

// ============================================================================
// Voice Types
// ============================================================================

/** Voice session request */
export interface VoiceSessionRequest {
  productId: string
  userId: string
  collectionId: string
  settings?: {
    voice?: string
    language?: string
    model?: string
  }
}

/** Voice session response */
export interface VoiceSessionResponse {
  token: string
  systemInstruction: string
  expiresAt: string
  productName: string
}

/** Ephemeral token request */
export interface EphemeralTokenRequest {
  settings?: {
    ttl?: number
    voice?: string
    language?: string
    model?: string
  }
}

/** Ephemeral token response */
export interface EphemeralTokenResponse {
  token: string
  expiresAt: string
}

/** Transcription response */
export interface TranscriptionResponse {
  text: string
}

/** TTS request */
export interface TTSRequest {
  text: string
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  speed?: number
  format?: 'mp3' | 'opus' | 'aac' | 'flac'
}

// ============================================================================
// Podcast Types
// ============================================================================

/** Podcast generation request */
export interface GeneratePodcastRequest {
  productId: string
  documentText?: string
  duration?: number
  style?: 'casual' | 'professional' | 'educational' | 'entertaining'
  voices?: {
    host1?: string
    host2?: string
  }
  includeAudio?: boolean
  language?: string
  customInstructions?: string
}

/** Podcast script segment */
export interface PodcastSegment {
  speaker: 'host1' | 'host2'
  text: string
  timestamp?: number
  duration?: number
}

/** Podcast script */
export interface PodcastScript {
  title: string
  description: string
  segments: PodcastSegment[]
}

/** Podcast generation response */
export interface GeneratePodcastResponse {
  success: boolean
  podcastId: string
  script: PodcastScript
  audio?: {
    host1Url?: string
    host2Url?: string
    mixedUrl?: string
  }
  metadata: {
    duration: number
    wordCount: number
    generatedAt: string
  }
}

/** Podcast status */
export interface PodcastStatus {
  podcastId: string
  status: 'generating_script' | 'generating_audio' | 'mixing' | 'completed' | 'failed'
  progress: number
  estimatedTimeRemaining?: number
  error?: string
  result?: GeneratePodcastResponse
}

// ============================================================================
// Legacy Types (kept for backwards compatibility)
// ============================================================================

// Request shape for AI generateContent calls
export interface AIGenerateContentRequest {
  /** The prompt or message contents sent to the AI */
  contents: string | any
  /** Desired MIME type of the response payload (e.g. 'application/json', 'text/plain') */
  responseMimeType?: string
  /** Optional system instruction or system prompt to steer the model */
  systemInstruction?: string
  /** AI provider identifier (e.g. 'openai', 'google', 'anthropic') */
  provider?: string
  /** The model name to use (e.g. 'gpt-4o', 'gemini-1.5-pro') */
  model?: string
  /** Allow passing additional provider/model-specific options */
  [key: string]: any
}

// Request shape for AI generateImage calls (admin)
export interface AIGenerateImageRequest {
  /** Text prompt describing the desired image */
  prompt: string
  /** AI provider identifier (e.g. 'openai', 'google', 'stability') */
  provider?: string
  /** Optional model name to use for image generation */
  model?: string
  /** Requested image size, e.g. '1024x1024' */
  size?: string
  /** Additional provider/model-specific options */
  [key: string]: any
}

// Request shape for AI searchPhotos calls (admin -> Unsplash proxy)
export interface AISearchPhotosRequest {
  /** Search query keyword(s) */
  query: string
  /** Number of results to return per page (e.g. 1) */
  per_page?: number
  /** Desired orientation of photos */
  orientation?: 'landscape' | 'portrait' | 'squarish'
  /** Additional provider-specific options */
  [key: string]: any
}

// Single photo item returned by searchPhotos
export interface AISearchPhotosPhoto {
  /** Direct image URL */
  url: string
  /** Alt text/description for accessibility */
  alt?: string
  /** Photographer display name */
  photographer?: string
  /** Link to the photographer profile */
  photographerUrl?: string
  /** Allow extra fields */
  [key: string]: any
}

export namespace ai {
  // ============================================================================
  // Chat Completions API (OpenAI-compatible)
  // ============================================================================

  export namespace chat {
    export namespace completions {
      /**
       * Create a chat completion (streaming or non-streaming)
       * @param collectionId - Collection identifier
       * @param request - Chat completion request
       * @returns Chat completion response or async iterable for streaming
       */
      export async function create(
        collectionId: string,
        request: ChatCompletionRequest
      ): Promise<ChatCompletionResponse | AsyncIterable<ChatCompletionChunk>> {
        const path = `/admin/${encodeURIComponent(collectionId)}/ai/v1/chat/completions`
        
        if (request.stream) {
          // TODO: Implement streaming via SSE
          throw new Error('Streaming not yet implemented')
        }
        
        return post<ChatCompletionResponse>(path, request)
      }
    }
  }

  // ============================================================================
  // Models API
  // ============================================================================

  export namespace models {
    /**
     * List available AI models
     */
    export async function list(collectionId: string): Promise<ModelList> {
      const path = `/admin/${encodeURIComponent(collectionId)}/ai/models`
      return request<ModelList>(path)
    }

    /**
     * Get specific model information
     */
    export async function get(collectionId: string, modelId: string): Promise<AIModel> {
      const path = `/admin/${encodeURIComponent(collectionId)}/ai/models/${encodeURIComponent(modelId)}`
      return request<AIModel>(path)
    }
  }

  // ============================================================================
  // RAG API
  // ============================================================================

  export namespace rag {
    /**
     * Index a document for RAG
     */
    export async function indexDocument(
      collectionId: string,
      request: IndexDocumentRequest
    ): Promise<IndexDocumentResponse> {
      const path = `/admin/${encodeURIComponent(collectionId)}/ai/indexDocument`
      return post<IndexDocumentResponse>(path, request)
    }

    /**
     * Configure AI assistant behavior
     */
    export async function configureAssistant(
      collectionId: string,
      request: ConfigureAssistantRequest
    ): Promise<ConfigureAssistantResponse> {
      const path = `/admin/${encodeURIComponent(collectionId)}/ai/configureAssistant`
      return post<ConfigureAssistantResponse>(path, request)
    }
  }

  // ============================================================================
  // Sessions API
  // ============================================================================

  export namespace sessions {
    /**
     * Get session statistics
     */
    export async function stats(collectionId: string): Promise<SessionStatistics> {
      const path = `/admin/${encodeURIComponent(collectionId)}/ai/sessions/stats`
      return request<SessionStatistics>(path)
    }
  }

  // ============================================================================
  // Rate Limiting API
  // ============================================================================

  export namespace rateLimit {
    /**
     * Reset rate limit for a user
     */
    export async function reset(collectionId: string, userId: string): Promise<{ success: boolean; userId: string }> {
      const path = `/admin/${encodeURIComponent(collectionId)}/ai/rate-limit/${encodeURIComponent(userId)}/reset`
      return post<{ success: boolean; userId: string }>(path, {})
    }
  }

  // ============================================================================
  // Podcast API
  // ============================================================================

  export namespace podcast {
    /**
     * Generate a NotebookLM-style conversational podcast from product documents
     */
    export async function generate(
      collectionId: string,
      request: GeneratePodcastRequest
    ): Promise<GeneratePodcastResponse> {
      const path = `/admin/${encodeURIComponent(collectionId)}/ai/generatePodcast`
      return post<GeneratePodcastResponse>(path, request)
    }

    /**
     * Get podcast generation status
     */
    export async function getStatus(collectionId: string, podcastId: string): Promise<PodcastStatus> {
      const path = `/admin/${encodeURIComponent(collectionId)}/ai/podcast/${encodeURIComponent(podcastId)}`
      return request<PodcastStatus>(path)
    }
  }

  // ============================================================================
  // TTS API
  // ============================================================================

  export namespace tts {
    /**
     * Generate text-to-speech audio
     */
    export async function generate(
      collectionId: string,
      request: TTSRequest
    ): Promise<Blob> {
      const path = `/admin/${encodeURIComponent(collectionId)}/ai/tts`
      // Note: This would need special handling for binary response
      return post<Blob>(path, request)
    }
  }

  // ============================================================================
  // Public API (no authentication required)
  // ============================================================================

  export namespace publicApi {
    /**
     * Chat with product assistant (RAG)
     */
    export async function chat(
      collectionId: string,
      request: PublicChatRequest
    ): Promise<PublicChatResponse> {
      const path = `/${encodeURIComponent(collectionId)}/ai/chat`
      return post<PublicChatResponse>(path, request)
    }

    /**
     * Get session history
     */
    export async function getSession(collectionId: string, sessionId: string): Promise<Session> {
      const path = `/${encodeURIComponent(collectionId)}/ai/session/${encodeURIComponent(sessionId)}`
      return request<Session>(path)
    }

    /**
     * Clear session history
     */
    export async function clearSession(collectionId: string, sessionId: string): Promise<{ success: boolean }> {
      const path = `/${encodeURIComponent(collectionId)}/ai/session/${encodeURIComponent(sessionId)}`
      return del<{ success: boolean }>(path)
    }

    /**
     * Check rate limit status
     */
    export async function getRateLimit(collectionId: string, userId: string): Promise<RateLimitStatus> {
      const path = `/${encodeURIComponent(collectionId)}/ai/rate-limit/${encodeURIComponent(userId)}`
      return request<RateLimitStatus>(path)
    }

    /**
     * Generate ephemeral token for Gemini Live
     */
    export async function getToken(
      collectionId: string,
      request: EphemeralTokenRequest
    ): Promise<EphemeralTokenResponse> {
      const path = `/${encodeURIComponent(collectionId)}/ai/token`
      return post<EphemeralTokenResponse>(path, request)
    }
  }

  // ============================================================================
  // Voice Helpers (Browser-only)
  // ============================================================================

  export namespace voice {
    /**
     * Check if voice is supported in browser
     */
    export function isSupported(): boolean {
      if (typeof window === 'undefined') return false
      return ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && 'speechSynthesis' in window
    }

    /**
     * Listen for voice input
     */
    export async function listen(language = 'en-US'): Promise<string> {
      if (typeof window === 'undefined') {
        throw new Error('Voice input is only available in the browser')
      }

      if (!isSupported()) {
        throw new Error('Speech recognition not supported in this browser')
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = language
      recognition.continuous = false
      recognition.interimResults = false

      return new Promise((resolve, reject) => {
        recognition.onresult = (event: any) => {
          resolve(event.results[0][0].transcript)
        }
        recognition.onerror = reject
        recognition.start()
      })
    }

    /**
     * Speak text
     */
    export async function speak(text: string, options?: { voice?: string; rate?: number }): Promise<void> {
      if (typeof window === 'undefined') {
        throw new Error('Speech synthesis is only available in the browser')
      }

      if (!('speechSynthesis' in window)) {
        throw new Error('Speech synthesis not supported in this browser')
      }

      const utterance = new SpeechSynthesisUtterance(text)
      if (options?.rate) utterance.rate = options.rate

      if (options?.voice) {
        const voices = speechSynthesis.getVoices()
        const voice = voices.find(v => v.name === options.voice)
        if (voice) utterance.voice = voice
      }

      return new Promise((resolve) => {
        utterance.onend = () => resolve()
        speechSynthesis.speak(utterance)
      })
    }
  }

  // ============================================================================
  // Legacy Methods (backwards compatibility)
  // ============================================================================

  /**
   * Generate text/content via AI (admin)
   * @deprecated Use ai.chat.completions.create() instead
   */
  export async function generateContent(
    collectionId: string,
    params: AIGenerateContentRequest,
    admin: boolean = true
  ): Promise<any> {
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/ai/generateContent`
    return post<any>(path, params)
  }

  /**
   * Generate an image via AI (admin)
   */
  export async function generateImage(collectionId: string, params: AIGenerateImageRequest): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/generateImage`
    return post<any>(path, params)
  }

  /**
   * Search stock photos or similar via AI (admin)
   */
  export async function searchPhotos(
    collectionId: string,
    params: AISearchPhotosRequest
  ): Promise<AISearchPhotosPhoto[]> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/searchPhotos`
    return post<AISearchPhotosPhoto[]>(path, params)
  }

  /**
   * Upload a file for AI usage (admin). Pass FormData for binary uploads.
   */
  export async function uploadFile(collectionId: string, params: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/uploadFile`
    return post<any>(path, params)
  }

  /**
   * Create or warm a cache for AI (admin)
   */
  export async function createCache(collectionId: string, params: any): Promise<any> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/createCache`
    return post<any>(path, params)
  }

  /**
   * Post a chat message to the AI (admin or public)
   */
  export async function postChat(collectionId: string, params: any, admin: boolean = true): Promise<any> {
    const base = admin ? '/admin' : '/public'
    const path = `${base}/collection/${encodeURIComponent(collectionId)}/ai/postChat`
    return post<any>(path, params)
  }
}
