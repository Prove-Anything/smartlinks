// src/api/ai.ts
// AI endpoints: public and admin helpers
import { post, request, del, getBaseURL, getApiHeaders } from "../http"
import { SmartlinksApiError } from "../types/error"
import type {
  // Chat Completions types
  ContentPart,
  FunctionCall,
  ToolCall,
  ChatMessage,
  ToolDefinition,
  ResponseTool,
  ResponseInputItem,
  ResponsesRequest,
  ResponsesResult,
  ResponsesStreamEvent,
  ChatCompletionRequest,
  ChatCompletionChoice,
  ChatCompletionResponse,
  ChatCompletionChunk,
  // Model types
  AIModel,
  AIModelListParams,
  AIModelListResponse,
  // RAG types
  DocumentChunk,
  IndexDocumentRequest,
  IndexDocumentResponse,
  ConfigureAssistantRequest,
  ConfigureAssistantResponse,
  PublicChatRequest,
  PublicChatResponse,
  Session,
  RateLimitStatus,
  SessionStatistics,
  // Voice types
  VoiceSessionRequest,
  VoiceSessionResponse,
  EphemeralTokenRequest,
  EphemeralTokenResponse,
  TranscriptionResponse,
  TTSRequest,
  // Podcast types
  GeneratePodcastRequest,
  PodcastScript,
  GeneratePodcastResponse,
  PodcastStatus,
  // Legacy types
  AIGenerateContentRequest,
  AIGenerateImageRequest,
  AISearchPhotosRequest,
  AISearchPhotosPhoto,
} from "../types/ai"

// Re-export types for backwards compatibility
export type {
  ContentPart,
  FunctionCall,
  ToolCall,
  ChatMessage,
  ToolDefinition,
  ResponseTool,
  ResponseInputItem,
  ResponsesRequest,
  ResponsesResult,
  ResponsesStreamEvent,
  ChatCompletionRequest,
  ChatCompletionChoice,
  ChatCompletionResponse,
  ChatCompletionChunk,
  AIModel,
  AIModelListParams,
  AIModelListResponse,
  DocumentChunk,
  IndexDocumentRequest,
  IndexDocumentResponse,
  ConfigureAssistantRequest,
  ConfigureAssistantResponse,
  PublicChatRequest,
  PublicChatResponse,
  Session,
  RateLimitStatus,
  SessionStatistics,
  VoiceSessionRequest,
  VoiceSessionResponse,
  EphemeralTokenRequest,
  EphemeralTokenResponse,
  TranscriptionResponse,
  TTSRequest,
  GeneratePodcastRequest,
  PodcastScript,
  GeneratePodcastResponse,
  PodcastStatus,
  AIGenerateContentRequest,
  AIGenerateImageRequest,
  AISearchPhotosRequest,
  AISearchPhotosPhoto,
}

function encodeQueryParams(params?: { [key: string]: string | undefined }): string {
  if (!params) return ''
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value)
  })
  const search = query.toString()
  return search ? `?${search}` : ''
}

async function createSseStream<T>(path: string, body: any): Promise<AsyncIterable<T>> {
  const baseURL = getBaseURL()
  if (!baseURL) {
    throw new Error('HTTP client is not initialized. Call initializeApi(...) first.')
  }

  const url = `${baseURL}${path}`
  const headers: Record<string, string> = {
    Accept: 'text/event-stream',
    'Content-Type': 'application/json',
    ...getApiHeaders(),
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    let responseBody: any
    try {
      responseBody = await response.json()
    } catch {
      responseBody = null
    }

    const code = response.status
    const message = responseBody?.message || responseBody?.error?.message || `Request failed with status ${code}`
    throw new SmartlinksApiError(`Error ${code}: ${message}`, code, {
      code,
      errorCode: responseBody?.error?.code || responseBody?.errorCode,
      message,
      details: responseBody?.error?.details || responseBody?.details,
    }, url)
  }

  if (!response.body) {
    throw new Error('Streaming response body is unavailable in this environment')
  }

  return parseSseStream<T>(response.body)
}

async function* parseSseStream<T>(stream: ReadableStream<Uint8Array>): AsyncIterable<T> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let dataLines: string[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split(/\r?\n/)
    buffer = lines.pop() || ''

    for (const rawLine of lines) {
      const line = rawLine.trimEnd()

      if (!line) {
        if (!dataLines.length) continue
        const payload = dataLines.join('\n')
        dataLines = []

        if (payload === '[DONE]') return

        try {
          yield JSON.parse(payload) as T
        } catch {
          continue
        }
        continue
      }

      if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trimStart())
      }
    }
  }

  if (dataLines.length) {
    const payload = dataLines.join('\n')
    if (payload !== '[DONE]') {
      try {
        yield JSON.parse(payload) as T
      } catch {
        return
      }
    }
  }
}

namespace aiInternal {
  // ============================================================================
  // Chat APIs
  // ============================================================================

  export namespace chat {
    export namespace responses {
      /**
       * Create a Responses API request (streaming or non-streaming)
       * @param collectionId - Collection identifier
       * @param request - Responses API request
       * @returns Responses API result or async iterable for streaming events
       */
      export async function create(
        collectionId: string,
        request: ResponsesRequest
      ): Promise<ResponsesResult | AsyncIterable<ResponsesStreamEvent>> {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/v1/responses`

        if (request.stream) {
          return createSseStream<ResponsesStreamEvent>(path, request)
        }

        return post<ResponsesResult>(path, request)
      }
    }

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
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/v1/chat/completions`
        
        if (request.stream) {
          return createSseStream<ChatCompletionChunk>(path, request)
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
    export async function list(collectionId: string, params?: AIModelListParams): Promise<AIModelListResponse> {
      const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/models${encodeQueryParams({
        provider: params?.provider,
        capability: params?.capability,
      })}`
      return request<AIModelListResponse>(path)
    }

    /**
     * Get specific model information
     */
    export async function get(collectionId: string, modelId: string): Promise<AIModel> {
      const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/models/${encodeURIComponent(modelId)}`
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
      const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/indexDocument`
      return post<IndexDocumentResponse>(path, request)
    }

    /**
     * Configure AI assistant behavior
     */
    export async function configureAssistant(
      collectionId: string,
      request: ConfigureAssistantRequest
    ): Promise<ConfigureAssistantResponse> {
      const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/configureAssistant`
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
      const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/sessions/stats`
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
      const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/rate-limit/${encodeURIComponent(userId)}/reset`
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
      const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/generatePodcast`
      return post<GeneratePodcastResponse>(path, request)
    }

    /**
     * Get podcast generation status
     */
    export async function getStatus(collectionId: string, podcastId: string): Promise<PodcastStatus> {
      const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/podcast/${encodeURIComponent(podcastId)}`
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
      const path = `/admin/collection/${encodeURIComponent(collectionId)}/ai/tts`
      // Note: This would need special handling for binary response
      return post<Blob>(path, request)
    }
  }

  // ============================================================================
  // Public API (no authentication required)
  // ============================================================================

  export namespace publicClient {
    /**
     * Chat with product assistant (RAG)
     */
    export async function chat(
      collectionId: string,
      request: PublicChatRequest
    ): Promise<PublicChatResponse> {
      const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/chat`
      return post<PublicChatResponse>(path, request)
    }

    /**
     * Get session history
     */
    export async function getSession(collectionId: string, sessionId: string): Promise<Session> {
      const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/session/${encodeURIComponent(sessionId)}`
      return request<Session>(path)
    }

    /**
     * Clear session history
     */
    export async function clearSession(collectionId: string, sessionId: string): Promise<{ success: boolean }> {
      const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/session/${encodeURIComponent(sessionId)}`
      return del<{ success: boolean }>(path)
    }

    /**
     * Check rate limit status
     */
    export async function getRateLimit(collectionId: string, userId: string): Promise<RateLimitStatus> {
      const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/rate-limit/${encodeURIComponent(userId)}`
      return request<RateLimitStatus>(path)
    }

    /**
     * Generate ephemeral token for Gemini Live
     */
    export async function getToken(
      collectionId: string,
      request: EphemeralTokenRequest
    ): Promise<EphemeralTokenResponse> {
      const path = `/public/collection/${encodeURIComponent(collectionId)}/ai/token`
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
}
