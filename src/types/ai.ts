// src/types/ai.ts
/**
 * AI domain types
 */

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

/** Additional/native tool definition accepted by the Responses API. */
export interface ResponseTool {
  type: string
  name?: string
  description?: string
  parameters?: Record<string, any>
  [key: string]: any
}

/** Structured input item accepted by the Responses API. */
export interface ResponseInputItem {
  role?: 'system' | 'user' | 'assistant' | 'function' | 'tool'
  type?: string
  content?: string | ContentPart[]
  name?: string
  function_call?: FunctionCall
  tool_calls?: ToolCall[]
  tool_call_id?: string
  [key: string]: any
}

/** Request for the Responses API. */
export interface ResponsesRequest {
  model?: string
  input?: string | ResponseInputItem[]
  messages?: ResponseInputItem[]
  previous_response_id?: string
  conversation?: string | Record<string, any>
  tools?: Array<ToolDefinition | ResponseTool>
  tool_choice?:
    | 'none'
    | 'auto'
    | 'required'
    | { type: 'function'; function: { name: string } }
    | { type: 'function'; name: string }
  stream?: boolean
  temperature?: number
  max_output_tokens?: number
  store?: boolean
  instructions?: string
  include?: string[]
  reasoning?: Record<string, any>
  parallel_tool_calls?: boolean
  truncation?: 'auto' | 'disabled'
  text?: Record<string, any>
  metadata?: Record<string, string>
  prompt_cache_key?: string
}

/** Response from the Responses API. */
export interface ResponsesResult {
  id: string
  object: 'response'
  created: number
  model: string
  status?: 'completed' | 'failed' | 'in_progress' | 'queued' | 'cancelled' | 'incomplete'
  output: any[]
  output_text: string
  usage: {
    input_tokens: number
    output_tokens: number
    total_tokens: number
  }
  error?: any
  incomplete_details?: { reason?: 'max_output_tokens' | 'content_filter' } | null
  previous_response_id?: string | null
  conversation?: unknown
  provider: 'openai'
  responseTime: number
}

/** Generic SSE event emitted by the Responses API. */
export interface ResponsesStreamEvent {
  type: string
  [key: string]: any
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

/** Filter parameters when listing models. */
export interface AIModelListParams {
  provider?: 'gemini' | 'openai'
  capability?: 'text' | 'vision' | 'audio' | 'code'
}

/** Model list response. */
export interface AIModelListResponse {
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

/** Podcast script */
export interface PodcastScript {
  title: string
  description: string
  segments: Array<{
    speaker: 'host1' | 'host2'
    text: string
    timestamp?: number
    duration?: number
  }>
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

/** Request shape for AI generateContent calls */
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

/** Request shape for AI generateImage calls (admin) */
export interface AIGenerateImageRequest {
  /** Text prompt describing the desired image */
  prompt: string
  /** AI provider identifier (e.g. 'openai', 'google', 'stability') */
  provider?: string
  /** Optional model name to use for image generation */
  model?: string
  /** 
   * Requested image size. 
   * OpenAI supported values: '1024x1024', '1024x1792', '1792x1024'
   * Other providers may support different sizes.
   */
  size?: string
  /** Additional provider/model-specific options */
  [key: string]: any
}

/** Request shape for AI searchPhotos calls (admin -> Unsplash proxy) */
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

/** Single photo item returned by searchPhotos */
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
