# Smartlinks API Summary

Version: 1.6.4  |  Generated: 2026-02-26T12:33:27.813Z

This is a concise summary of all available API functions and types.

## Documentation

For detailed guides on specific features:

- **[AI & Chat Completions](ai.md)** - Chat completions, RAG (document-grounded Q&A), voice integration, streaming, tool calling, podcast generation
- **[Widgets](widgets.md)** - Embeddable React components for parent applications
- **[Containers](containers.md)** - Building full-app embeddable containers (lazy-loaded) 
- **[Realtime](realtime.md)** - Real-time data updates and WebSocket connections
- **[iframe Responder](iframe-responder.md)** - iframe integration and cross-origin communication
- **[i18n](i18n.md)** - Internationalization and localization
- **[Liquid Templates](liquid-templates.md)** - Dynamic templating for content generation
- **[Theme System](theme.system.md)** - Theme configuration and customization
- **[Theme Defaults](theme-defaults.md)** - Default theme values and presets
- **[Proof Claiming Methods](proof-claiming-methods.md)** - All methods for claiming/registering product ownership (NFC tags, serial numbers, auto-generated claims)
- **[App Data Storage](app-data-storage.md)** - User-specific and collection-scoped app data storage
- **[App Objects: Cases, Threads & Records](app-objects.md)** - Generic app-scoped building blocks for support cases, discussions, bookings, registrations, and more
- **[Communications](comms.md)** - Transactional sends, multi-channel broadcasts, consent management, push registration, and analytics
- **[AI Guide Template](ai-guide-template.md)** - A sample for an app on how to build an AI setup guide

## API Namespaces

The Smartlinks SDK is organized into the following namespaces:

— Core Data & Configuration —
- **collection** - Manage collections, settings, and identifiers for your workspace.
- **product** - Create and manage products within a collection; metadata, tags, media.
- **variant** - Manage product variants per product; includes serial number helpers.
- **asset** - Upload and manage media assets for collections, products, and proofs.
- **batch** - Group products into batches; manage serial number ranges and lookups.
- **crate** - Organize products in containers/crates for logistics and grouping.
- **form** - Build and manage dynamic forms used by apps and workflows.
- **appConfiguration** - Read/write app configuration and scoped data (collection/product/proof).

— Identity & Access —
- **auth** - Admin authentication and account ops: login/logout, tokens, account info.
- **authKit** - End‑user auth flows (email/password, OAuth, phone); profiles and verification.
- **contact** - Manage customer contacts; CRUD, lookup, upsert, erase.

— Messaging & Audience —
- **comms** - Send notifications (push, email, wallet); templating, severity, delivery status. → [Guide](comms.md)
- **broadcasts** - Define broadcast campaigns; append recipients/events; analytics and CRUD.
- **segments** - Define dynamic/static audience segments; estimate and list recipients; schedule calculations.

— Analytics & Events —
- **interactions** - Log and analyze interactions/outcomes; aggregates and actor lists; interaction definition CRUD.

— Automation —
- **journeys** - Configure automated flows triggered by events or schedules; steps, rules; full CRUD.

— NFC, Proofs & Claims —
- **nfc** - Claim and validate NFC tags; perform tag lookups.
- **proof** - Create, update, claim, and list product proofs (digital certificates).
- **claimSet** - Manage claim sets and tag assignments; queries, reports, and updates.
- **qr** - Lookup short codes to resolve collection/product/proof context.

— AI & Utilities —
- **ai** - Chat completions, RAG (document Q&A), podcast generation, TTS, content/image generation, voice integration.
- **serialNumber** - Assign, lookup, and manage serial numbers across scopes.

— Other —
- **appObjects** - Functions for appObjects operations
- **async** - Functions for async operations
- **attestation** - Functions for attestation operations
- **jobs** - Functions for jobs operations
- **journeysAnalytics** - Functions for journeysAnalytics operations
- **location** - Functions for location operations
- **order** - Functions for order operations
- **realtime** - Functions for realtime operations
- **tags** - Functions for tags operations
- **template** - Functions for template operations

## HTTP Utilities

Core HTTP functions for API configuration and communication:

**isProxyEnabled**() → `boolean`
Return whether proxy mode is currently enabled.

**initializeApi**(options: {
  baseURL: string
  apiKey?: string
  bearerToken?: string
  proxyMode?: boolean
  ngrokSkipBrowserWarning?: boolean
  extraHeaders?: Record<string, string>
  iframeAutoResize?: boolean // default true when in iframe
  logger?: Logger // optional console-like or function to enable verbose logging
  /**
   * When true, bypasses the idempotency guard and forces a full re-initialization.
   * Use only when you intentionally need to reset all SDK state (e.g. in tests or
   * when switching accounts) → `void`
Call this once (e.g. at app startup) to configure baseURL/auth.

**setNgrokSkipBrowserWarning**(flag: boolean) → `void`
Enable/disable automatic "ngrok-skip-browser-warning" header.

**setExtraHeaders**(headers: Record<string, string>) → `void`
Replace or augment globally applied custom headers.

**setBearerToken**(token: string | undefined) → `void`
Allows setting the bearerToken at runtime (e.g. after login/logout).

**getBaseURL**() → `string | null`
Get the currently configured API base URL. Returns null if initializeApi() has not been called yet.

**isInitialized**() → `boolean`
Returns true if initializeApi() has been called at least once. Useful for guards in widgets or shared modules that want to skip initialization when another module has already done it. ```ts if (!isInitialized()) { initializeApi({ baseURL: 'https://smartlinks.app/api/v1' }) } ```

**hasAuthCredentials**() → `boolean`
Returns true if the SDK currently has any auth credential set (bearer token or API key). Use this as a cheap pre-flight check before calling endpoints that require authentication, to avoid issuing a network request that you already know will return a 401. ```ts if (hasAuthCredentials()) { const account = await auth.getAccount() } ```

**configureSdkCache**(options: {
  enabled?: boolean
  ttlMs?: number
  maxEntries?: number
  persistence?: 'none' | 'indexeddb'
  persistenceTtlMs?: number
  serveStaleOnOffline?: boolean
  clearOnPageLoad?: boolean
}) → `void`
Configure the SDK's built-in in-memory GET cache. The cache is transparent — it sits inside the HTTP layer and requires no changes to your existing API calls. All GET requests benefit automatically. Per-resource rules (collections/products → 1 h, proofs → 30 s, etc.) override this value. in-memory only (`'none'`, default). Ignored in Node.js. fallback, from the original fetch time (default: 7 days). `SmartlinksOfflineError` with stale data instead of propagating the network error. caches on page load/refresh. IndexedDB persists for offline. ```ts // Enable IndexedDB persistence for offline support configureSdkCache({ persistence: 'indexeddb' }) // Disable cache entirely in test environments configureSdkCache({ enabled: false }) // Keep caches across page refreshes (not recommended for production) configureSdkCache({ clearOnPageLoad: false }) ```

**invalidateCache**(urlPattern?: string) → `void`
Manually invalidate entries in the SDK's GET cache. *contains* this string is removed. Omit (or pass `undefined`) to wipe the entire cache. ```ts invalidateCache()                     // clear everything invalidateCache('/collection/abc123') // one specific collection invalidateCache('/product/')          // all product responses ```

**proxyUploadFormData**(path: string,
  formData: FormData,
  onProgress?: (percent: number) → `void`
Upload a FormData payload via proxy with progress events using chunked postMessage. Parent is expected to implement the counterpart protocol.

**request**(path: string) → `Promise<T>`
Internal helper that performs a GET request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. Cache pipeline (when caching is not skipped): L1 hit  → return from memory (no I/O) L2 hit  → return from IndexedDB, promote to L1 (no network) Miss    → fetch from network, store in L1 + L2 Offline → serve stale L2 entry via SmartlinksOfflineError (if persistence enabled) Concurrent identical GETs share one in-flight promise (deduplication). Node-safe: IndexedDB calls are no-ops when IDB is unavailable.

**post**(path: string,
  body: any,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a POST request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. If body is FormData, Content-Type is not set. Returns the parsed JSON as T, or throws an Error.

**put**(path: string,
  body: any,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a PUT request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. If body is FormData, Content-Type is not set. Returns the parsed JSON as T, or throws an Error.

**patch**(path: string,
  body: any,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a PATCH request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. If body is FormData, Content-Type is not set. Returns the parsed JSON as T, or throws an Error.

**requestWithOptions**(path: string,
  options: RequestInit) → `Promise<T>`
Internal helper that performs a request to `${baseURL}${path}` with custom options, injecting headers for apiKey or bearerToken if present. Returns the parsed JSON as T, or throws an Error.

**del**(path: string,
  extraHeaders?: Record<string, string>) → `Promise<T>`
Internal helper that performs a DELETE request to `${baseURL}${path}`, injecting headers for apiKey or bearerToken if present. Returns the parsed JSON as T, or throws an Error.

**getApiHeaders**() → `Record<string, string>`
Returns the common headers used for API requests, including apiKey and bearerToken if set.

**sendCustomProxyMessage**(request: string, params: any) → `Promise<T>`
Sends a custom proxy message to the parent Smartlinks application when running in an iframe. This function is used to communicate with the parent window when the SDK is embedded in an iframe and proxyMode is enabled. It sends a message to the parent and waits for a response.

## Error Handling

All API functions throw `SmartlinksApiError` when requests fail. This error class provides structured access to HTTP status codes, server error codes, and additional context.

### SmartlinksApiError

**Properties:**
- **message** `string` - Human-readable error message in English (e.g., "Error 400: Not Authorized")
- **statusCode** `number` - HTTP status code (400, 401, 404, 500, etc.)
- **code** `number` - Numeric error code (same as statusCode)
- **details** `Record<string, any> | undefined` - Additional server response data, including string error codes
- **url** `string | undefined` - The URL that was requested

**Helper Methods:**
- **isAuthError()** `boolean` - Returns true for 401 or 403 status codes
- **isNotFound()** `boolean` - Returns true for 404 status code
- **isRateLimited()** `boolean` - Returns true for 429 status code
- **isClientError()** `boolean` - Returns true for 4xx status codes
- **isServerError()** `boolean` - Returns true for 5xx status codes
- **toJSON()** `object` - Returns a serializable object for logging

### Error Format Normalization

The SDK automatically normalizes various server error response formats into a consistent structure. The server may return errors in different formats, but they are all accessible through the same properties.

**Server String Error Codes:**
Server-specific error identifiers are preserved in `error.details`:
- Access via: `error.details?.errorCode` or `error.details?.error`
- Format examples: `"NOT_AUTHORIZED"`, `"broadcasts.topic.invalid"`, `"sendgrid.provision.failed"`
- Use these for programmatic error handling (switch statements, conditional logic)

### Usage Examples

**Basic Error Handling:**
```typescript
import { SmartlinksApiError, product } from '@proveanything/smartlinks'

try {
  const item = await product.get('collectionId', 'productId')
} catch (error) {
  if (error instanceof SmartlinksApiError) {
    console.error('Status:', error.statusCode)      // 404
    console.error('Message:', error.message)        // "Error 404: Not found"
    console.error('URL:', error.url)                // "/public/collection/..."
  }
}
```

**Using Helper Methods:**
```typescript
try {
  await product.create('collectionId', data)
} catch (error) {
  if (error instanceof SmartlinksApiError) {
    if (error.isAuthError()) {
      // Handle 401/403 - redirect to login
      redirectToLogin()
    } else if (error.isNotFound()) {
      // Handle 404
      showNotFound()
    } else if (error.isRateLimited()) {
      // Handle 429 - implement retry with backoff
      await retryAfterDelay()
    } else if (error.isServerError()) {
      // Handle 5xx
      showMaintenanceMessage()
    }
  }
}
```

**Accessing Server Error Codes:**
```typescript
try {
  await broadcasts.send('collectionId', 'broadcastId', options)
} catch (error) {
  if (error instanceof SmartlinksApiError) {
    // Extract server-defined string error code
    const serverCode = error.details?.errorCode || error.details?.error
    
    switch (serverCode) {
      case 'NOT_AUTHORIZED':
        redirectToLogin()
        break
      case 'broadcasts.topic.invalid':
        showTopicSelector()
        break
      case 'sendgrid.provision.failed':
        alertAdmin('Email service error')
        break
      default:
        showError(error.message)
    }
  }
}
```

**Error Logging for Monitoring:**
```typescript
try {
  await api.someMethod()
} catch (error) {
  if (error instanceof SmartlinksApiError) {
    // Log structured error data
    logger.error('API Error', error.toJSON())
    
    // Send to monitoring service
    Sentry.captureException(error, {
      extra: error.toJSON(),
      tags: {
        statusCode: error.statusCode,
        serverErrorCode: error.details?.errorCode || error.details?.error,
      }
    })
  }
}
```

**Handling Validation Errors:**
```typescript
try {
  await product.create('collectionId', formData)
} catch (error) {
  if (error instanceof SmartlinksApiError && error.statusCode === 400) {
    // Access field-specific validation errors if available
    if (error.details?.fields) {
      Object.entries(error.details.fields).forEach(([field, message]) => {
        showFieldError(field, String(message))
      })
    } else {
      showError(error.message)
    }
  }
}
```

**Retry Logic for Transient Errors:**
```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (error instanceof SmartlinksApiError) {
        // Only retry server errors and rate limiting
        const shouldRetry = error.isServerError() || error.isRateLimited()
        
        if (!shouldRetry || attempt === maxRetries - 1) {
          throw error
        }
        
        // Exponential backoff
        const delay = 1000 * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        throw error
      }
    }
  }
  throw new Error('Max retries exceeded')
}

// Usage
const collections = await withRetry(() => collection.list())
```

### Error Code Reference

**HTTP Status Codes (numeric):**
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `502` - Bad Gateway
- `503` - Service Unavailable

**Server Error Codes (strings in `details.errorCode` or `details.error`):**
Examples include:
- `"NOT_AUTHORIZED"` - Not authorized for this action
- `"broadcasts.topic.invalid"` - Invalid communication topic
- `"broadcasts.manual.segment.missing"` - Missing required segment
- `"sendgrid.provision.failed"` - Email service provisioning failed
- `"validation.failed"` - Request validation failed

*Note: Server error codes use either `UPPERCASE_UNDERSCORE` or `dotted.notation` format. Both are supported.*

## Types

### ai

**ContentPart** (interface)
```typescript
interface ContentPart {
  type: 'text' | 'image_url'
  text?: string
  image_url?: {
  url: string
  detail?: 'auto' | 'low' | 'high'
  }
}
```

**FunctionCall** (interface)
```typescript
interface FunctionCall {
  name: string
  arguments: string
}
```

**ToolCall** (interface)
```typescript
interface ToolCall {
  id: string
  type: 'function'
  function: {
  name: string
  arguments: string
  }
}
```

**ChatMessage** (interface)
```typescript
interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool'
  content: string | ContentPart[]
  name?: string
  function_call?: FunctionCall
  tool_calls?: ToolCall[]
  tool_call_id?: string
}
```

**ToolDefinition** (interface)
```typescript
interface ToolDefinition {
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
```

**ChatCompletionRequest** (interface)
```typescript
interface ChatCompletionRequest {
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
```

**ChatCompletionChoice** (interface)
```typescript
interface ChatCompletionChoice {
  index: number
  message: ChatMessage
  finish_reason: 'stop' | 'length' | 'function_call' | 'tool_calls' | 'content_filter' | null
}
```

**ChatCompletionResponse** (interface)
```typescript
interface ChatCompletionResponse {
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
```

**ChatCompletionChunk** (interface)
```typescript
interface ChatCompletionChunk {
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
```

**AIModel** (interface)
```typescript
interface AIModel {
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
```

**DocumentChunk** (interface)
```typescript
interface DocumentChunk {
  text: string
  embedding: number[]
  metadata: {
  chunkIndex: number
  documentId: string
  [key: string]: any
  }
}
```

**IndexDocumentRequest** (interface)
```typescript
interface IndexDocumentRequest {
  productId: string
  text?: string
  documentUrl?: string
  metadata?: Record<string, any>
  chunkSize?: number
  overlap?: number
  provider?: 'openai' | 'gemini'
}
```

**IndexDocumentResponse** (interface)
```typescript
interface IndexDocumentResponse {
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
```

**ConfigureAssistantRequest** (interface)
```typescript
interface ConfigureAssistantRequest {
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
```

**ConfigureAssistantResponse** (interface)
```typescript
interface ConfigureAssistantResponse {
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
```

**PublicChatRequest** (interface)
```typescript
interface PublicChatRequest {
  productId: string
  userId: string
  message: string
  sessionId?: string
  stream?: boolean
}
```

**PublicChatResponse** (interface)
```typescript
interface PublicChatResponse {
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
```

**Session** (interface)
```typescript
interface Session {
  sessionId: string
  productId: string
  userId: string
  messageCount: number
  createdAt: string
  lastActivityAt: string
  messages: ChatMessage[]
}
```

**RateLimitStatus** (interface)
```typescript
interface RateLimitStatus {
  used: number
  remaining: number
  resetAt: string
}
```

**SessionStatistics** (interface)
```typescript
interface SessionStatistics {
  totalSessions: number
  activeSessions: number
  totalMessages: number
  rateLimitedUsers: number
}
```

**VoiceSessionRequest** (interface)
```typescript
interface VoiceSessionRequest {
  productId: string
  userId: string
  collectionId: string
  settings?: {
  voice?: string
  language?: string
  model?: string
  }
}
```

**VoiceSessionResponse** (interface)
```typescript
interface VoiceSessionResponse {
  token: string
  systemInstruction: string
  expiresAt: string
  productName: string
}
```

**EphemeralTokenRequest** (interface)
```typescript
interface EphemeralTokenRequest {
  settings?: {
  ttl?: number
  voice?: string
  language?: string
  model?: string
  }
}
```

**EphemeralTokenResponse** (interface)
```typescript
interface EphemeralTokenResponse {
  token: string
  expiresAt: string
}
```

**TranscriptionResponse** (interface)
```typescript
interface TranscriptionResponse {
  text: string
}
```

**TTSRequest** (interface)
```typescript
interface TTSRequest {
  text: string
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  speed?: number
  format?: 'mp3' | 'opus' | 'aac' | 'flac'
}
```

**GeneratePodcastRequest** (interface)
```typescript
interface GeneratePodcastRequest {
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
```

**PodcastScript** (interface)
```typescript
interface PodcastScript {
  title: string
  description: string
  segments: Array<{
  speaker: 'host1' | 'host2'
  text: string
  timestamp?: number
  duration?: number
  }>
}
```

**GeneratePodcastResponse** (interface)
```typescript
interface GeneratePodcastResponse {
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
```

**PodcastStatus** (interface)
```typescript
interface PodcastStatus {
  podcastId: string
  status: 'generating_script' | 'generating_audio' | 'mixing' | 'completed' | 'failed'
  progress: number
  estimatedTimeRemaining?: number
  error?: string
  result?: GeneratePodcastResponse
}
```

**AIGenerateContentRequest** (interface)
```typescript
interface AIGenerateContentRequest {
  contents: string | any
  responseMimeType?: string
  systemInstruction?: string
  provider?: string
  model?: string
  [key: string]: any
}
```

**AIGenerateImageRequest** (interface)
```typescript
interface AIGenerateImageRequest {
  prompt: string
  provider?: string
  model?: string
  * Requested image size.
  * OpenAI supported values: '1024x1024', '1024x1792', '1792x1024'
  * Other providers may support different sizes.
  size?: string
  [key: string]: any
}
```

**AISearchPhotosRequest** (interface)
```typescript
interface AISearchPhotosRequest {
  query: string
  per_page?: number
  orientation?: 'landscape' | 'portrait' | 'squarish'
  [key: string]: any
}
```

**AISearchPhotosPhoto** (interface)
```typescript
interface AISearchPhotosPhoto {
  url: string
  alt?: string
  photographer?: string
  photographerUrl?: string
  [key: string]: any
}
```

### appConfiguration

**AppConfigurationResponse** (interface)
```typescript
interface AppConfigurationResponse {
  id: string
  name: string
  settings?: Record<string, any>
}
```

### appManifest

**AppBundle** (interface)
```typescript
interface AppBundle {
  js: string | null;
  css: string | null;
  source?: string;
  styles?: string;
}
```

**AppManifestFiles** (interface)
```typescript
interface AppManifestFiles {
  js: {
  umd: string;
  esm?: string;
  };
  css?: string;
}
```

**AppWidgetComponent** (interface)
```typescript
interface AppWidgetComponent {
  name: string;
  description?: string;
  sizes?: Array<'compact' | 'standard' | 'large' | string>;
  props?: {
  required?: string[];
  optional?: string[];
  };
  settings?: Record<string, any>;
}
```

**AppContainerComponent** (interface)
```typescript
interface AppContainerComponent {
  name: string;
  description?: string;
  props?: {
  required?: string[];
  optional?: string[];
  };
}
```

**AppAdminConfig** (interface)
```typescript
interface AppAdminConfig {
  $schema?: string;
  * Path (relative to the app's public root) to an AI guide markdown file.
  * Provides natural-language context for AI-assisted configuration.
  * @example "ai-guide.md"
  aiGuide?: string;
  setup?: {
  description?: string;
  questions?: Array<{
  id: string;
  prompt: string;
  type: string;
  default?: any;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  }>;
  configSchema?: Record<string, any>;
  saveWith?: {
  method: string;
  scope: 'collection' | 'product' | string;
  admin?: boolean;
  note?: string;
  };
  contentHints?: Record<string, {
  aiGenerate?: boolean;
  prompt?: string;
  }>;
  };
  import?: {
  description?: string;
  scope?: string;
  fields?: Array<{
  name: string;
  type: string;
  required?: boolean;
  default?: any;
  description?: string;
  }>;
  csvExample?: string;
  saveWith?: {
  method: string;
  scope: string;
  admin?: boolean;
  note?: string;
  };
  };
  tunable?: {
  description?: string;
  fields?: Array<{
  name: string;
  description?: string;
  type: string;
  options?: string[];
  }>;
  };
  metrics?: {
  interactions?: Array<{ id: string; description?: string }>;
  kpis?: Array<{ name: string; compute?: string }>;
  };
}
```

**AppManifest** (interface)
```typescript
interface AppManifest {
  $schema?: string;
  meta?: {
  name: string;
  description?: string;
  version: string;
  platformRevision?: string;
  appId: string;
  };
  * Relative path to the admin configuration file (e.g. `"app.admin.json"`).
  * When present, fetch this file to get the full {@link AppAdminConfig}
  * (setup questions, import schema, tunable fields, metrics definitions).
  * Absent when the app has no admin UI.
  admin?: string;
  widgets?: {
  files: AppManifestFiles;
  components: AppWidgetComponent[];
  };
  containers?: {
  files: AppManifestFiles;
  components: AppContainerComponent[];
  };
  [key: string]: any;
}
```

**CollectionAppWidget** (interface)
```typescript
interface CollectionAppWidget {
  appId: string;
  manifest: AppManifest;
  widget: AppBundle;
  container: AppBundle | null;
  admin: string | null;
}
```

**CollectionWidgetsResponse** (interface)
```typescript
interface CollectionWidgetsResponse {
  apps: CollectionAppWidget[];
}
```

**GetCollectionWidgetsOptions** (interface)
```typescript
interface GetCollectionWidgetsOptions {
  force?: boolean;
}
```

### appObjects

**PaginatedResponse<T>** (interface)
```typescript
interface PaginatedResponse<T> {
  data: T[]
  pagination: {
  total: number
  limit: number
  offset: number
  hasMore: boolean
  }
}
```

**AggregateRequest** (interface)
```typescript
interface AggregateRequest {
  filters?: {
  status?: string
  category?: string // cases only
  record_type?: string // records only
  product_id?: string
  created_at?: { gte?: string; lte?: string }
  closed_at?: '__notnull__' | { gte?: string; lte?: string } // cases only
  expires_at?: { lte?: string } // records only
  }
  groupBy?: string[] // see per-resource allowed values
  metrics?: string[] // see per-resource allowed values below
  timeSeriesField?: string // e.g. 'created_at'
  timeSeriesInterval?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
}
```

**AggregateResponse** (interface)
```typescript
interface AggregateResponse {
  groups?: ({ count: number } & Record<string, unknown>)[]
  timeSeries?: ({ bucket: string; count: number } & Record<string, unknown>)[]
  count?: number
  avg_close_time_seconds?: number
  p50_close_time_seconds?: number
  p95_close_time_seconds?: number
  total_replies?: number
  avg_replies?: number
}
```

**ListQueryParams** (interface)
```typescript
interface ListQueryParams {
  limit?: number // default 50, max 500
  offset?: number // default 0
  sort?: string // field:asc or field:desc
  includeDeleted?: boolean // admin only
  status?: string // exact or in:a,b,c
  productId?: string
  createdAt?: string // gte:2024-01-01, lte:2024-12-31, or ISO date string
  updatedAt?: string // same format
}
```

**AppCase** (interface)
```typescript
interface AppCase {
  id: string
  orgId: string
  collectionId: string
  appId: string
  visibility: Visibility
  ref: string | null
  status: string // 'open' | 'resolved' | 'closed' | custom
  priority: number | null
  category: string | null
  assignedTo: string | null // admin zone / admin callers only
  productId: string | null
  proofId: string | null
  contactId: string | null
  createdAt: string // ISO 8601
  updatedAt: string
  closedAt: string | null
  deletedAt: string | null // admin callers only
  data: Record<string, unknown> // visible to all roles
  owner: Record<string, unknown> // visible to owner + admin
  admin: Record<string, unknown> // visible to admin only
}
```

**CreateCaseInput** (interface)
```typescript
interface CreateCaseInput {
  visibility?: Visibility // default 'owner'
  ref?: string
  status?: string // default 'open'
  priority?: number
  category?: string
  assignedTo?: string // admin only
  productId?: string
  proofId?: string
  contactId?: string
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown> // admin only
}
```

**UpdateCaseInput** (interface)
```typescript
interface UpdateCaseInput {
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown>
  status?: string
  priority?: number
  category?: string
  assignedTo?: string
  ref?: string
}
```

**AppendHistoryInput** (interface)
```typescript
interface AppendHistoryInput {
  entry?: Record<string, unknown> // free-form entry object; 'at' is auto-set
  historyTarget?: 'owner' | 'admin' // which zone receives the entry (default 'admin')
  status?: string // optionally update status atomically
  priority?: number
  assignedTo?: string
}
```

**CaseSummaryRequest** (interface)
```typescript
interface CaseSummaryRequest {
  period?: { from: string; to: string } // ISO 8601 date range
}
```

**CaseSummaryResponse** (interface)
```typescript
interface CaseSummaryResponse {
  total: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  trend: { week: string; count: number }[]
}
```

**ReplyEntry** (interface)
```typescript
interface ReplyEntry {
  at: string // ISO 8601, auto-set
  authorId?: string
  authorType?: string
  [key: string]: unknown
}
```

**AppThread** (interface)
```typescript
interface AppThread {
  id: string
  orgId: string
  collectionId: string
  appId: string
  visibility: Visibility
  slug: string | null
  title: string | null
  status: string // 'open' | 'closed' | custom
  authorId: string | null
  authorType: string // default 'user'
  productId: string | null
  proofId: string | null
  contactId: string | null
  parentType: string | null
  parentId: string | null
  replyCount: number
  lastReplyAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null // admin only
  body: Record<string, unknown>
  replies: ReplyEntry[]
  tags: string[]
  data: Record<string, unknown>
  owner: Record<string, unknown>
  admin: Record<string, unknown> // admin only
}
```

**CreateThreadInput** (interface)
```typescript
interface CreateThreadInput {
  visibility?: Visibility // default 'owner'
  slug?: string
  title?: string
  status?: string // default 'open'
  authorId?: string
  authorType?: string
  productId?: string
  proofId?: string
  contactId?: string
  parentType?: string
  parentId?: string
  body?: Record<string, unknown>
  tags?: string[]
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown> // admin only
}
```

**UpdateThreadInput** (interface)
```typescript
interface UpdateThreadInput {
  body?: Record<string, unknown>
  tags?: string[]
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown>
  title?: string
  slug?: string
  status?: string
  visibility?: Visibility
}
```

**ReplyInput** (interface)
```typescript
interface ReplyInput {
  authorId?: string
  authorType?: string
  [key: string]: unknown // any extra fields stored on the reply object
}
```

**AppRecord** (interface)
```typescript
interface AppRecord {
  id: string
  orgId: string
  collectionId: string
  appId: string
  visibility: Visibility
  recordType: string
  ref: string | null
  status: string // default 'active'
  productId: string | null
  proofId: string | null
  contactId: string | null
  authorId: string | null
  authorType: string
  parentType: string | null
  parentId: string | null
  createdAt: string
  updatedAt: string
  startsAt: string | null
  expiresAt: string | null
  deletedAt: string | null // admin only
  data: Record<string, unknown>
  owner: Record<string, unknown>
  admin: Record<string, unknown> // admin only
}
```

**CreateRecordInput** (interface)
```typescript
interface CreateRecordInput {
  recordType: string
  visibility?: Visibility // default 'owner'
  ref?: string
  status?: string // default 'active'
  productId?: string
  proofId?: string
  contactId?: string
  authorId?: string
  authorType?: string
  parentType?: string
  parentId?: string
  startsAt?: string // ISO 8601
  expiresAt?: string
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown> // admin only
}
```

**UpdateRecordInput** (interface)
```typescript
interface UpdateRecordInput {
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown>
  status?: string
  visibility?: Visibility
  ref?: string
  recordType?: string
  startsAt?: string
  expiresAt?: string
}
```

**RelatedResponse** (interface)
```typescript
interface RelatedResponse {
  threads: AppThread[]
  records: AppRecord[]
}
```

**PublicCreatePolicy** (interface)
```typescript
interface PublicCreatePolicy {
  cases?: PublicCreateRule
  threads?: PublicCreateRule
  records?: PublicCreateRule
}
```

**PublicCreateRule** (interface)
```typescript
interface PublicCreateRule {
  allow: {
  anonymous?: boolean
  authenticated?: boolean
  }
  enforce?: {
  anonymous?: Partial<CreateCaseInput | CreateThreadInput | CreateRecordInput>
  authenticated?: Partial<CreateCaseInput | CreateThreadInput | CreateRecordInput>
  }
}
```

**Visibility** = `'public' | 'owner' | 'admin'`

**CallerRole** = `'admin' | 'owner' | 'public'`

### asset

**Asset** (interface)
```typescript
interface Asset {
  id: string
  url: string
  name: string
  mimeType?: string
  size?: number
  createdAt?: string
  metadata?: Record<string, any>
  assetType?: string
  type?: string
  collectionId?: string
  hash?: string
  thumbnails?: {
  x100?: string
  x200?: string
  x512?: string
  [key: string]: string | undefined
  }
  site?: string
  cleanName?: string
}
```

**UploadAssetOptions** (interface)
```typescript
interface UploadAssetOptions {
  file: File
  scope:
  | { type: 'collection'; collectionId: string }
  | { type: 'product'; collectionId: string; productId: string }
  | { type: 'proof'; collectionId: string; productId: string; proofId: string }
  name?: string
  metadata?: Record<string, any>
  onProgress?: (percent: number) => void
  appId?: string
  admin?: boolean
}
```

**UploadFromUrlOptions** (interface)
```typescript
interface UploadFromUrlOptions {
  url: string
  scope:
  | { type: 'collection'; collectionId: string }
  | { type: 'product'; collectionId: string; productId: string }
  | { type: 'proof'; collectionId: string; productId: string; proofId: string }
  folder?: 'images' | 'videos' | 'documents'
  metadata?: Record<string, any>
  appId?: string
  admin?: boolean
}
```

**ListAssetsOptions** (interface)
```typescript
interface ListAssetsOptions {
  scope:
  | { type: 'collection'; collectionId: string }
  | { type: 'product'; collectionId: string; productId: string }
  | { type: 'proof'; collectionId: string; productId: string; proofId: string }
  appId?: string
  mimeTypePrefix?: string
  limit?: number
  offset?: number
}
```

**GetAssetOptions** (interface)
```typescript
interface GetAssetOptions {
  assetId: string
  scope:
  | { type: 'collection'; collectionId: string }
  | { type: 'product'; collectionId: string; productId: string }
  | { type: 'proof'; collectionId: string; productId: string; proofId: string }
}
```

**RemoveAssetOptions** (interface)
```typescript
interface RemoveAssetOptions {
  assetId: string
  scope:
  | { type: 'collection'; collectionId: string }
  | { type: 'product'; collectionId: string; productId: string }
  | { type: 'proof'; collectionId: string; productId: string; proofId: string }
}
```

**AssetResponse** = `Asset`

### attestation

**AttestationResponse** (interface)
```typescript
interface AttestationResponse {
  id: string
  createdAt: string
  updatedAt: string
  public: Record<string, any>
  private: Record<string, any>
  proof: Record<string, any>
}
```

**AttestationCreateRequest** (interface)
```typescript
interface AttestationCreateRequest {
  public: Record<string, any>
  private: Record<string, any>
  proof: Record<string, any>
}
```

**AttestationUpdateRequest** (interface)
```typescript
interface AttestationUpdateRequest {
  type?: string
  data?: Record<string, any>
}
```

### auth

**UserAccountRegistrationRequest** (interface)
```typescript
interface UserAccountRegistrationRequest {
  name: string
  email?: string
  phone?: string
  password?: string
  sendAccountConfirmation?: boolean
  collectionId?: string,
  tokenType?: 'bearer' | 'firebase'
}
```

### authKit

**AuthKitUser** (interface)
```typescript
interface AuthKitUser {
  uid: string
  email?: string
  displayName?: string | null
  photoURL?: string | null
  phoneNumber?: string | null
  emailVerified?: boolean
  accountData?: Record<string, any>
}
```

**UserProfile** (interface)
```typescript
interface UserProfile {
  uid: string
  email?: string
  displayName?: string | null
  phoneNumber?: string | null
  photoURL?: string | null
  emailVerified?: boolean
  accountData?: Record<string, any>
}
```

**ProfileUpdateData** (interface)
```typescript
interface ProfileUpdateData {
  displayName?: string
  photoURL?: string
  accountData?: Record<string, any>
}
```

**SuccessResponse** (interface)
```typescript
interface SuccessResponse {
  success: boolean
  message?: string
  token?: string // some flows may return a refreshed token
}
```

**AuthLoginResponse** (interface)
```typescript
interface AuthLoginResponse {
  token?: string
  user: AuthKitUser
  accountData?: Record<string, any>
  emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login'
  requiresEmailVerification?: boolean  // True if email verification is required but not yet completed
  emailVerificationDeadline?: number   // Unix timestamp - for 'immediate' mode grace period deadline
  accountLocked?: boolean              // True if account is locked due to expired verification deadline
}
```

**MagicLinkSendResponse** (interface)
```typescript
interface MagicLinkSendResponse {
  success: boolean
  message: string
}
```

**PhoneSendCodeResponse** (interface)
```typescript
interface PhoneSendCodeResponse {
  verificationId: string
  message: string
}
```

**PhoneVerifyResponse** (interface)
```typescript
interface PhoneVerifyResponse {
  token: string
  user: AuthKitUser
}
```

**PasswordResetRequestResponse** (interface)
```typescript
interface PasswordResetRequestResponse {
  success: boolean
  message: string
}
```

**VerifyResetTokenResponse** (interface)
```typescript
interface VerifyResetTokenResponse {
  valid: boolean
  email?: string
  expiresAt?: number
  message?: string
}
```

**PasswordResetCompleteResponse** (interface)
```typescript
interface PasswordResetCompleteResponse {
  success: boolean
  message: string
}
```

**EmailVerificationActionResponse** (interface)
```typescript
interface EmailVerificationActionResponse {
  success: boolean
  message: string
}
```

**EmailVerifyTokenResponse** (interface)
```typescript
interface EmailVerifyTokenResponse {
  success: boolean
  message: string
  token?: string
  user?: AuthKitUser
  accountData?: Record<string, any>
  emailVerificationMode?: 'immediate' | 'verify-auto-login' | 'verify-manual-login'
}
```

**AuthKitBrandingConfig** (interface)
```typescript
interface AuthKitBrandingConfig {
  logoUrl?: string
  title?: string
  subtitle?: string
  primaryColor?: string
  secondaryColor?: string
  backgroundColor?: string
  buttonStyle?: string
  fontFamily?: string
}
```

**AuthKitConfig** (interface)
```typescript
interface AuthKitConfig {
  id: string
  branding?: AuthKitBrandingConfig
  enabledProviders?: string[]
  customCss?: string
  termsUrl?: string
  privacyUrl?: string
  supportEmail?: string
  redirectUrl?: string
  updatedAt?: string
}
```

### batch

**FirebaseTimestamp** (interface)
```typescript
interface FirebaseTimestamp {
  seconds: number                 // Unix timestamp in seconds
  nanoseconds?: number            // Nanoseconds component
}
```

**BatchResponse** (interface)
```typescript
interface BatchResponse {
  id: string                      // Batch ID
  name?: string                   // Batch name
  expiryDate?: FirebaseTimestamp | string  // Firebase timestamp or ISO 8601 date
  productId?: string              // Product ID (for collection-level searches)
  collectionId?: string           // Collection ID
  [key: string]: any              // Additional batch fields
}
```

**BatchCreateRequest** (interface)
```typescript
interface BatchCreateRequest {
  id: string                      // Batch ID
  name?: string                   // Batch name
  expiryDate?: FirebaseTimestamp | string  // Firebase timestamp or ISO 8601 date
  [key: string]: any              // Additional batch fields
}
```

**BatchUpdateRequest** (interface)
```typescript
interface BatchUpdateRequest {
  name?: string                   // Batch name
  expiryDate?: FirebaseTimestamp | string  // Firebase timestamp or ISO 8601 date
  [key: string]: any              // Additional batch fields
}
```

**SearchBatchesRequest** (interface)
```typescript
interface SearchBatchesRequest {
  search?: string                 // Search term (batch ID or name)
  productId?: string              // Filter by specific product
  limit?: number                  // Max results (default: 100)
}
```

**BatchTag** (interface)
```typescript
interface BatchTag {
  code: string                    // Code/tag ID
  claimSetId: string              // Claim set ID
  collectionId?: string           // Collection ID
  productId?: string              // Associated product ID
  batchId?: string                // Batch ID
  tagId?: string                  // Tag identifier
  index?: number                  // Position in claim set
}
```

### broadcasts

**ListBroadcastsQuery** (interface)
```typescript
interface ListBroadcastsQuery {
  limit?: number
  offset?: number
  appId?: string
}
```

**BroadcastRecord** (interface)
```typescript
interface BroadcastRecord {
  id: string
  collectionId: string
  appId: string
  templateId?: string | null
  segmentId?: string | null
  status?: string | null
  scheduledAt?: string | null
  sentAt?: string | null
  data?: {
  display?: {
  title?: string
  description?: string
  icon?: string
  color?: string
  }
  broadcastType?: string
  topic: string
  templateParams?: Record<string, unknown>;
  channelSettings?: {
  mode?: 'preferred' | 'channels' | 'all'
  channels?: Array<{
  channel: BroadcastChannel
  enabled?: boolean
  priority?: number
  }>
  }
  [key: string]: unknown
  }
  createdAt: string
}
```

**BroadcastList** (interface)
```typescript
interface BroadcastList {
  items: BroadcastRecord[]
  limit: number
  offset: number
}
```

**BroadcastRecipientsResponse** (interface)
```typescript
interface BroadcastRecipientsResponse {
  items: import('./comms').Recipient[]
  total: number
  limit: number
  offset: number
  note?: string
}
```

**BroadcastPreviewRequest** (interface)
```typescript
interface BroadcastPreviewRequest {
  contactId?: string
  email?: string
  phone?: string
  props?: Record<string, any>
  channelOverride?: BroadcastChannel
  hydrate?: boolean
  include?: { product?: boolean; proof?: boolean; user?: boolean; [k: string]: boolean | undefined }
}
```

**BroadcastSendTestRequest** (interface)
```typescript
interface BroadcastSendTestRequest {
  contactId?: string
  email?: string
  phone?: string
  props?: Record<string, any>
  channelOverride?: BroadcastChannel
  hydrate?: boolean
  include?: { product?: boolean; proof?: boolean; user?: boolean; [k: string]: boolean | undefined }
}
```

**BroadcastSendTestResponse** (interface)
```typescript
interface BroadcastSendTestResponse {
  ok: boolean; id?: string; channel?: BroadcastChannel
}
```

**BroadcastSendManualRequest** (interface)
```typescript
interface BroadcastSendManualRequest {
  limit?: number
  offset?: number
  dryRun?: boolean
  sharedContext?: Record<string, any>
}
```

**BroadcastSendManualResponse** (interface)
```typescript
interface BroadcastSendManualResponse {
  ok: boolean
  counts: { sent: number; failed: number; skipped: number }
  page: { limit: number; offset: number; total: number }
  results: Array<{
  contactId: string
  status: 'sent' | 'failed' | 'skipped' | 'dry_run'
  id?: string
  error?: string
  message?: string
  }>
}
```

**BroadcastSendRequest** (interface)
```typescript
interface BroadcastSendRequest {
  pageSize?: number
  maxPages?: number
  sharedContext?: Record<string, any>
  channel?: BroadcastChannel
  hydrate?: boolean
  include?: { product?: boolean; proof?: boolean; user?: boolean; [k: string]: boolean | undefined }
}
```

**BroadcastAppendEventBody** (interface)
```typescript
interface BroadcastAppendEventBody {
  broadcastId: string
  contactId?: string
  channel?: BroadcastChannel
  templateId?: string
  eventType: string
  outcome?: 'success' | 'failed'
  failureReason?: string
  metadata?: Record<string, any>
}
```

**BroadcastAppendBulkBody** (interface)
```typescript
interface BroadcastAppendBulkBody {
  ids: string[]
  idField?: string
  params: Record<string, any> // merged with collectionId server-side
}
```

**BroadcastChannel** = `'email' | 'push' | 'sms' | 'wallet'`

**BroadcastPreviewResponse** = ``

### claimSet

**ClaimCodeRef** (interface)
```typescript
interface ClaimCodeRef {
  codeId: string
  claimId: string
}
```

**UpdateClaimDataRequest** (interface)
```typescript
interface UpdateClaimDataRequest {
  data: Record<string, any>
  codes: ClaimCodeRef[]
}
```

**AssignClaimsRequest** (interface)
```typescript
interface AssignClaimsRequest {
  id: string
  collectionId: string
  productId: string
  batchId?: string
  start?: number
  end?: number
  codeId?: string
  data?: Record<string, any>
}
```

### collection

**Collection** (interface)
```typescript
interface Collection {
  id: string
  title: string
  description: string
  headerImage?: {
  url: string
  thumbnails: {
  x100: string
  x200: string
  x512: string
  }
  }
  logoImage?: {
  url: string
  thumbnails: {
  x100: string
  x200: string
  x512: string
  }
  }
  loaderImage?: {
  overwriteName: string
  name: string
  type: string
  url: string
  }
  languages?: {
  code: string
  lang: string
  supported: boolean
  }[],
  roles: {
  [userId: string]: string
  } // User roles mapping with user IDs as keys and role names as values
  groupTags?: string[] // Array of group tag names
  redirectUrl?: string // Whether the collection has a custom domain
  shortId: string, // The shortId of this collection
  dark?: boolean // if dark mode is enabled for this collection
  primaryColor?: string
  secondaryColor?: string
  portalUrl?: string // URL for the collection's portal (if applicable)
  allowAutoGenerateClaims?: boolean
  defaultAuthKitId: string // default auth kit for this collection, used for auth
}
```

**AppConfig** (interface)
```typescript
interface AppConfig {
  id: string
  srcAppId: string
  name: string
  description?: string
  faIcon?: string
  category: "Authenticity" | "Documentation" | "Commerce" | "Engagement" | "AI" | "Digital Product Passports" | "Integration" | "Web3" | "Other";
  active?: boolean
  ownersOnly?: boolean
  hidden?: boolean
  publicIframeUrl?: string
  manifestUrl?: string
  supportsDeepLinks?: boolean;
  usage: {
  collection: boolean;  // use at the collecton level
  product: boolean; // use at the product level
  proof: boolean;  // use at the proof level
  widget: boolean; // has a widget component available
  }
  directComponent: boolean; // Whether the app provides a direct React component for embedding (instead of using an iframe)
  [key: string]: any
}
```

**AppsConfigResponse** (interface)
```typescript
interface AppsConfigResponse {
  apps: AppConfig[]
}
```

**CollectionResponse** = `Collection`

**CollectionCreateRequest** = `Omit<Collection, 'id' | 'shortId'>`

**CollectionUpdateRequest** = `Partial<Omit<Collection, 'id' | 'shortId'>>`

### common

**IdField** = `'userId' | 'contactId'`

### comms

**NotificationSubjectTarget** (interface)
```typescript
interface NotificationSubjectTarget {
  type: 'product' | 'collection' | 'user' | 'batch' | 'proof'
  id: string
}
```

**CommunicationEvent** (interface)
```typescript
interface CommunicationEvent {
  orgId: string
  broadcastId?: string
  journeyId?: string
  userId?: string
  contactId?: string
  channel?: string
  timestamp: string
  eventType: string
  outcome?: string | null
  templateId?: string | null
  [k: string]: any
}
```

**CommsQueryByUser** (interface)
```typescript
interface CommsQueryByUser {
  userId?: string
  contactId?: string
  from?: string
  to?: string
  limit?: number
}
```

**RecipientWithOutcome** (interface)
```typescript
interface RecipientWithOutcome {
  id: string; outcome: string
}
```

**CommsRecipientIdsQuery** (interface)
```typescript
interface CommsRecipientIdsQuery {
  broadcastId?: string
  journeyId?: string
  journeyStepId?: string
  idField?: IdField
  from?: string
  to?: string
  limit?: number
}
```

**CommsRecipientsWithoutActionQuery** (interface)
```typescript
interface CommsRecipientsWithoutActionQuery {
  broadcastId?: string
  journeyId?: string
  actionId?: string
  appId?: string
  idField?: IdField
  from?: string
  to?: string
  limit?: number
}
```

**CommsRecipientsWithActionQuery** (interface)
```typescript
interface CommsRecipientsWithActionQuery {
  broadcastId?: string
  journeyId?: string
  actionId?: string
  appId?: string
  outcome?: string
  idField?: IdField
  includeOutcome?: boolean
  from?: string
  to?: string
  limit?: number
}
```

**LogCommunicationEventBody** (interface)
```typescript
interface LogCommunicationEventBody {
  broadcastId?: string
  journeyId?: string
  userId?: string
  contactId?: string
  channel?: string
  eventType: string
  outcome?: string
  templateId?: string
  timestamp?: string
  [k: string]: any
}
```

**LogBulkCommunicationEventsBody** (interface)
```typescript
interface LogBulkCommunicationEventsBody {
  params: { broadcastId?: string; journeyId?: string; [k: string]: any }
  ids: string[]
  idField?: IdField
}
```

**AppendResult** (interface)
```typescript
interface AppendResult {
  success: true
}
```

**AppendBulkResult** (interface)
```typescript
interface AppendBulkResult {
  success: true; count: number
}
```

**RecipientsPage** (interface)
```typescript
interface RecipientsPage {
  items: Recipient[]
  total: number
  limit: number
  offset: number
  note?: string
}
```

**PushSubscriptionJSON** (interface)
```typescript
interface PushSubscriptionJSON {
  endpoint: string
  keys?: {
  p256dh?: string
  auth?: string
  }
}
```

**PushVapidResponse** (interface)
```typescript
interface PushVapidResponse {
  publicKey: string
}
```

**PushSubscribeResponse** (interface)
```typescript
interface PushSubscribeResponse {
  ok: true; id: string
}
```

**RegisterPushMethodRequest** (interface)
```typescript
interface RegisterPushMethodRequest {
  contactId: string
  endpoint: string
  keys: { p256dh: string; auth: string }
  meta?: Record<string, any>
}
```

**CommsSettings** (interface)
```typescript
interface CommsSettings {
  unsub?: {
  requireToken?: boolean
  secret?: string
  hasSecret?: boolean
  }
  topics?: Record<string, TopicConfig>
  [k: string]: any
}
```

**TopicConfig** (interface)
```typescript
interface TopicConfig {
  label?: string
  description?: string
  labels?: string[]
  classification?: 'transactional' | 'marketing'
  defaults?: {
  channels?: Partial<Record<BroadcastChannel, boolean>>
  topics?: Record<string, boolean | undefined>
  policy?: 'opt-in' | 'opt-out'
  byChannel?: Partial<Record<BroadcastChannel, 'opt-in' | 'opt-out'>>
  }
  rules?: {
  allowChannels?: BroadcastChannel[]
  allowUnsubscribe?: boolean
  required?: boolean
  }
  [k: string]: any
}
```

**CommsSettingsGetResponse** (interface)
```typescript
interface CommsSettingsGetResponse {
  ok: true
  settings: CommsSettings
}
```

**CommsPublicTopicsResponse** (interface)
```typescript
interface CommsPublicTopicsResponse {
  ok: true; topics: Record<string, TopicConfig>
}
```

**UnsubscribeQuery** (interface)
```typescript
interface UnsubscribeQuery {
  contactId: string
  topic?: string
  channel?: BroadcastChannel
  token?: string
}
```

**UnsubscribeResponse** (interface)
```typescript
interface UnsubscribeResponse {
  ok: true; applied?: { channels?: Record<string, boolean>; topics?: Record<string, boolean> }
}
```

**CommsConsentUpsertRequest** (interface)
```typescript
interface CommsConsentUpsertRequest {
  contactId: string
  channels?: ConsentChannels
  topics?: Record<string, boolean>
  topicsByChannel?: Partial<Record<BroadcastChannel, Record<string, boolean>>>
}
```

**CommsPreferencesUpsertRequest** (interface)
```typescript
interface CommsPreferencesUpsertRequest {
  contactId: string
  subject?: { type: SubjectType; id: string; productId?: string }
  channels?: ConsentChannels
  topics?: Record<string, boolean>
  topicsByChannel?: Partial<Record<BroadcastChannel, Record<string, boolean>>>
}
```

**CommsSubscribeRequest** (interface)
```typescript
interface CommsSubscribeRequest {
  contactId: string
  subject: { type: SubjectType; id: string; productId?: string }
  subscribe: boolean
  source?: string
}
```

**CommsSubscribeResponse** (interface)
```typescript
interface CommsSubscribeResponse {
  ok: true; subscriptionId: string
}
```

**CommsSubscriptionCheckQuery** (interface)
```typescript
interface CommsSubscriptionCheckQuery {
  contactId: string
  subjectType: SubjectType
  subjectId: string
  productId?: string
}
```

**CommsSubscriptionCheckResponse** (interface)
```typescript
interface CommsSubscriptionCheckResponse {
  ok: true; subscribed: boolean
}
```

**CommsListMethodsQuery** (interface)
```typescript
interface CommsListMethodsQuery {
  contactId: string
  type?: BroadcastChannel
}
```

**CommsListMethodsResponse** (interface)
```typescript
interface CommsListMethodsResponse {
  ok: true; methods: import('./contact').CommMethod[]
}
```

**RegisterEmailMethodRequest** (interface)
```typescript
interface RegisterEmailMethodRequest {
  contactId?: string; email?: string; userId?: string
}
```

**RegisterSmsMethodRequest** (interface)
```typescript
interface RegisterSmsMethodRequest {
  contactId?: string; phone?: string; userId?: string
}
```

**RegisterMethodResponse** (interface)
```typescript
interface RegisterMethodResponse {
  ok: true; contactId: string
}
```

**SubscriptionsResolveRequest** (interface)
```typescript
interface SubscriptionsResolveRequest {
  subject: { type: SubjectType; id: string; productId?: string }
  hints: { userId?: string; pushEndpoint?: string; email?: string; walletObjectId?: string }
}
```

**SubscriptionsResolveResponse** (interface)
```typescript
interface SubscriptionsResolveResponse {
  ok: true
  subject: { type: SubjectType; id: string; productId?: string }
  contacts: Array<{
  contactId: string
  subscribed: boolean
  channels?: Partial<Record<BroadcastChannel, boolean>>
  walletForSubject?: boolean
  }>
  anySubscribed: boolean
  anyMethods: boolean
  anyWalletForSubject: boolean
}
```

**TransactionalSendRequest** (interface)
```typescript
interface TransactionalSendRequest {
  contactId: string
  templateId: string
  * Channel to send on. Defaults to 'preferred', which auto-selects the
  * contact's best available channel respecting consent, suppression, and
  * template availability (priority: email → push → sms → wallet).
  channel?: 'email' | 'sms' | 'push' | 'wallet' | 'preferred'
  props?: Record<string, unknown>
  include?: {
  collection?: boolean
  productId?: string
  proofId?: string
  user?: boolean
  appCase?: string
  appThread?: string
  appRecord?: string
  }
  ref?: string
  appId?: string
}
```

**TransactionalSendResponse** (interface)
```typescript
interface TransactionalSendResponse {
  ok: true
  channel: 'email' | 'sms' | 'push' | 'wallet'
  messageId?: string
}
```

**TransactionalSendError** (interface)
```typescript
interface TransactionalSendError {
  ok: false
  * Error code. Known values:
  * - `transactional.contact_not_found`
  * - `transactional.template_not_found`
  * - `transactional.no_channel_available`
  * - `transactional.email_missing`
  * - `transactional.phone_missing`
  * - `transactional.no_push_methods`
  * - `transactional.no_wallet_methods`
  error: string
}
```

**RecipientId** = `string`

**Recipient** = `import('./contact').Contact`

**CommsSettingsPatchBody** = `Partial<CommsSettings>`

**ConsentChannels** = `Partial<Record<BroadcastChannel, boolean>>`

**TransactionalSendResult** = `// src/types/comms.ts
// Communication and notification types for the Smartlinks API
import type { IdField } from './common'
import type { BroadcastChannel } from './broadcasts'

/**
 * Target subject for notifications (product, collection, etc.)
 */
export interface NotificationSubjectTarget {
  /** Type of target entity */
  type: 'product' | 'collection' | 'user' | 'batch' | 'proof'
  /** ID of the target entity */
  id: string
}


// Analytics & logging (communication events)

export interface CommunicationEvent {
  orgId: string
  broadcastId?: string
  journeyId?: string
  userId?: string
  contactId?: string
  channel?: string
  timestamp: string
  eventType: string
  outcome?: string | null
  templateId?: string | null
  [k: string]: any
}

export interface CommsQueryByUser {
  userId?: string
  contactId?: string
  from?: string
  to?: string
  limit?: number
}

export type RecipientId = string
export interface RecipientWithOutcome { id: string; outcome: string }

export interface CommsRecipientIdsQuery {
  broadcastId?: string
  journeyId?: string
  journeyStepId?: string
  idField?: IdField
  from?: string
  to?: string
  limit?: number
}

export interface CommsRecipientsWithoutActionQuery {
  broadcastId?: string
  journeyId?: string
  actionId?: string
  appId?: string
  idField?: IdField
  from?: string
  to?: string
  limit?: number
}

export interface CommsRecipientsWithActionQuery {
  broadcastId?: string
  journeyId?: string
  actionId?: string
  appId?: string
  outcome?: string
  idField?: IdField
  includeOutcome?: boolean
  from?: string
  to?: string
  limit?: number
}

export interface LogCommunicationEventBody {
  broadcastId?: string
  journeyId?: string
  userId?: string
  contactId?: string
  channel?: string
  eventType: string
  outcome?: string
  templateId?: string
  timestamp?: string
  [k: string]: any
}

export interface LogBulkCommunicationEventsBody {
  params: { broadcastId?: string; journeyId?: string; [k: string]: any }
  ids: string[]
  idField?: IdField
}

export interface AppendResult { success: true }
export interface AppendBulkResult { success: true; count: number }

// Common recipient type used by segments and broadcasts
export type Recipient = import('./contact').Contact

// Shared page response shape for recipient listings
export interface RecipientsPage {
  items: Recipient[]
  total: number
  limit: number
  offset: number
  note?: string
}

// Web Push (public client registration)

export interface PushSubscriptionJSON {
  endpoint: string
  keys?: {
    p256dh?: string
    auth?: string
  }
}

export interface PushVapidResponse { publicKey: string }
export interface PushSubscribeResponse { ok: true; id: string }

// Public: register a push contact method
export interface RegisterPushMethodRequest {
  contactId: string
  endpoint: string
  keys: { p256dh: string; auth: string }
  meta?: Record<string, any>
}

// Admin Comms Settings

export interface CommsSettings {
  unsub?: {
    requireToken?: boolean
    /** Secret for token generation; omitted unless includeSecret=true */
    secret?: string
    /** Convenience flag indicating a secret is set (masked responses) */
    hasSecret?: boolean
  }
  /** Map of topic keys to topic config */
  topics?: Record<string, TopicConfig>
  [k: string]: any
}

export interface TopicConfig {
  label?: string
  description?: string
  /** Optional UI-only grouping labels */
  labels?: string[]
  /** Classification for UI and default policy guidance */
  classification?: 'transactional' | 'marketing'
  defaults?: {
    channels?: Partial<Record<BroadcastChannel, boolean>>
    topics?: Record<string, boolean | undefined>
    /** Default consent policy when explicit preferences are absent */
    policy?: 'opt-in' | 'opt-out'
    /** Per-channel default policy (overrides policy when present) */
    byChannel?: Partial<Record<BroadcastChannel, 'opt-in' | 'opt-out'>>
  }
  rules?: {
    allowChannels?: BroadcastChannel[]
    allowUnsubscribe?: boolean
    required?: boolean
  }
  [k: string]: any
}

export interface CommsSettingsGetResponse {
  ok: true
  settings: CommsSettings
}

export type CommsSettingsPatchBody = Partial<CommsSettings>

// Public types listing (array form for public API)
export interface CommsPublicTopicsResponse { ok: true; topics: Record<string, TopicConfig> }

export interface UnsubscribeQuery {
  contactId: string
  topic?: string
  channel?: BroadcastChannel
  token?: string
}

export interface UnsubscribeResponse { ok: true; applied?: { channels?: Record<string, boolean>; topics?: Record<string, boolean> } }

// Public consent/preferences/subscribe
export type ConsentChannels = Partial<Record<BroadcastChannel, boolean>>
type SubjectType = import('./contact').SubjectType

export interface CommsConsentUpsertRequest {
  contactId: string
  channels?: ConsentChannels
  topics?: Record<string, boolean>
  topicsByChannel?: Partial<Record<BroadcastChannel, Record<string, boolean>>>
}

export interface CommsPreferencesUpsertRequest {
  contactId: string
  subject?: { type: SubjectType; id: string; productId?: string }
  channels?: ConsentChannels
  topics?: Record<string, boolean>
  topicsByChannel?: Partial<Record<BroadcastChannel, Record<string, boolean>>>
}

export interface CommsSubscribeRequest {
  contactId: string
  subject: { type: SubjectType; id: string; productId?: string }
  subscribe: boolean
  source?: string
}
export interface CommsSubscribeResponse { ok: true; subscriptionId: string }

export interface CommsSubscriptionCheckQuery {
  contactId: string
  subjectType: SubjectType
  subjectId: string
  productId?: string
}
export interface CommsSubscriptionCheckResponse { ok: true; subscribed: boolean }

export interface CommsListMethodsQuery {
  contactId: string
  type?: BroadcastChannel
}
export interface CommsListMethodsResponse { ok: true; methods: import('./contact').CommMethod[] }

export interface RegisterEmailMethodRequest { contactId?: string; email?: string; userId?: string }
export interface RegisterSmsMethodRequest { contactId?: string; phone?: string; userId?: string }
export interface RegisterMethodResponse { ok: true; contactId: string }

export interface SubscriptionsResolveRequest {
  subject: { type: SubjectType; id: string; productId?: string }
  hints: { userId?: string; pushEndpoint?: string; email?: string; walletObjectId?: string }
}
export interface SubscriptionsResolveResponse {
  ok: true
  subject: { type: SubjectType; id: string; productId?: string }
  contacts: Array<{
    contactId: string
    subscribed: boolean
    channels?: Partial<Record<BroadcastChannel, boolean>>
    walletForSubject?: boolean
  }>
  anySubscribed: boolean
  anyMethods: boolean
  anyWalletForSubject: boolean
}

// Transactional send (single-contact, single-message)

/**
 * Send a single message to one contact using a template.
 * No broadcast record is created; the send is logged directly to the
 * contact's communication history with sourceType: 'transactional'.
 *
 * POST /admin/collection/:collectionId/comm/send
 */
export interface TransactionalSendRequest {
  /** CRM contact UUID */
  contactId: string
  /** Firestore template ID */
  templateId: string
  /**
   * Channel to send on. Defaults to 'preferred', which auto-selects the
   * contact's best available channel respecting consent, suppression, and
   * template availability (priority: email → push → sms → wallet).
   */
  channel?: 'email' | 'sms' | 'push' | 'wallet' | 'preferred'
  /** Extra Liquid variables merged into the top-level render context */
  props?: Record<string, unknown>
  /** Context objects to hydrate into the Liquid template */
  include?: {
    /** Hydrate {{ collection }}. Default: true */
    collection?: boolean
    /** Hydrate {{ product }} from this product ID */
    productId?: string
    /** Hydrate {{ proof }} (requires productId) */
    proofId?: string
    /** Hydrate {{ user }} from contact.userId */
    user?: boolean
    /** Hydrate {{ appCase }} from this case UUID */
    appCase?: string
    /** Hydrate {{ appThread }} from this thread UUID */
    appThread?: string
    /** Hydrate {{ appRecord }} from this record UUID */
    appRecord?: string
  }
  /** Arbitrary label stored on the comms-events row (e.g. 'warranty-step-2') */
  ref?: string
  /** App context stored on the comms-events row */
  appId?: string
}

export interface TransactionalSendResponse {
  ok: true
  /** The channel the message was actually sent on */
  channel: 'email' | 'sms' | 'push' | 'wallet'
  /** Provider message ID (email/SMS); absent for push/wallet */
  messageId?: string
}

export interface TransactionalSendError {
  ok: false
  /**
   * Error code. Known values:
   * - `transactional.contact_not_found`
   * - `transactional.template_not_found`
   * - `transactional.no_channel_available`
   * - `transactional.email_missing`
   * - `transactional.phone_missing`
   * - `transactional.no_push_methods`
   * - `transactional.no_wallet_methods`
   */
  error: string
}

export type TransactionalSendResult =`

### contact

**Contact** (interface)
```typescript
interface Contact {
  contactId: string
  orgId: string
  userId: string | null
  firstName: string | null
  lastName: string | null
  displayName: string | null
  company: string | null
  email: string | null
  phone: string | null
  emails?: string[]
  phones?: string[]
  tags?: string[]
  source?: string | null
  notes?: string | null
  avatarUrl?: string | null
  locale?: string | null
  timezone?: string | null
  externalIds?: Record<string, any>
  comms?: CommsState
  customFields: ContactCustomFields
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  erasedAt: string | null
}
```

**ContactListResponse** (interface)
```typescript
interface ContactListResponse {
  items: Contact[]
  limit: number
  offset: number
}
```

**PublicContactUpsertResponse** (interface)
```typescript
interface PublicContactUpsertResponse {
  ok: boolean
  contactId: string
}
```

**UserSearchResponse** (interface)
```typescript
interface UserSearchResponse {
  user: {
  uid: string,
  displayName: string | null,
  email: string | null,
  phoneNumber: string | null,
  photoURL: string | null
  },
  contact: ContactResponse | null
  existsAsContact: boolean
}
```

**ContactPublic** (interface)
```typescript
interface ContactPublic {
  contactId: string
  firstName?: string | null
  lastName?: string | null
  displayName?: string | null
  company?: string | null
  avatarUrl?: string | null
  locale?: string | null
  timezone?: string | null
  email?: string | null
  phone?: string | null
  externalIds?: Record<string, any>
  customFields?: ContactCustomFields
}
```

**PublicGetMyContactResponse** (interface)
```typescript
interface PublicGetMyContactResponse {
  ok: boolean; contact: ContactPublic | null
}
```

**PublicUpdateMyContactResponse** (interface)
```typescript
interface PublicUpdateMyContactResponse {
  ok: boolean; contact: ContactPublic
}
```

**CommMethodMeta** (interface)
```typescript
interface CommMethodMeta {
  pushEndpoint?: string
  p256dh?: string
  auth?: string
  phone?: string
  email?: string
  walletObjectId?: string
  subjectType?: SubjectType
  subjectId?: string
  productId?: string
}
```

**CommMethod** (interface)
```typescript
interface CommMethod {
  id?: string
  type: ChannelName
  meta?: CommMethodMeta
  verified?: boolean
  suppressed?: boolean
  createdAt?: string
}
```

**Subscription** (interface)
```typescript
interface Subscription {
  id: string // canonical key derived from subject (opaque to clients)
  subjectType: SubjectType
  subjectId: string
  productId?: string | null
  contactId: string
  source?: string // e.g., 'api'
  createdAt?: string
  deletedAt?: string | null
}
```

**PreferenceEntry** (interface)
```typescript
interface PreferenceEntry {
  subjectType?: SubjectType | null
  subjectId?: string | null
  channels?: Partial<Record<ChannelName, boolean>>
  topics?: Record<string, boolean>
  topicsByChannel?: Partial<Record<ChannelName, Record<string, boolean>>>
  updatedAt?: string
}
```

**CommsState** (interface)
```typescript
interface CommsState {
  methods?: CommMethod[]
  subscriptions?: Subscription[]
  preferences?: Record<string, PreferenceEntry>
}
```

**FieldCondition** (interface)
```typescript
interface FieldCondition {
  targetFieldId: string   // The field whose value is tested
  operator: ConditionOperator
  value?: unknown         // Required for equals / not_equals / contains / not_contains / greater_than / less_than
}
```

**ContactSchemaProperty** (interface)
```typescript
interface ContactSchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'array'
  title?: string
  description?: string
  format?: string
  enum?: string[]
  * Display labels for `enum` values — parallel array.
  * `enum[i]` is the stored value; `enumNames[i]` is the display label.
  * When absent, `enum` values are used as labels.
  enumNames?: string[]
  default?: unknown
  minLength?: number
  maxLength?: number
  pattern?: string
  minimum?: number
  maximum?: number
  conditions?: FieldCondition[]
  showWhen?: 'all' | 'any'
}
```

**ContactUiSchemaEntry** (interface)
```typescript
interface ContactUiSchemaEntry {
  'ui:disabled'?: true
  'ui:placeholder'?: string
  'ui:help'?: string
  'ui:widget'?: string
  'ui:options'?: {
  rows?: number        // textarea: number of visible rows
  accept?: string      // file: accepted MIME types
  label?: boolean      // checkbox: show inline label
  [key: string]: unknown
  }
  [key: string]: unknown
}
```

**ContactSchemaResponse** (interface)
```typescript
interface ContactSchemaResponse {
  schema: {
  type: 'object'
  required?: string[]
  properties: Record<string, ContactSchemaProperty>
  }
  uiSchema: Record<string, ContactUiSchemaEntry>
  fieldOrder: string[]
  settings: Record<string, unknown>
  styling: Record<string, unknown>
}
```

**ContactCustomFields** = `Record<string, any>`

**ContactResponse** = `Contact`

**ContactCreateRequest** = `Omit<`

**ContactUpdateRequest** = `Partial<ContactCreateRequest>`

**PublicContactUpsertRequest** = `Partial<`

**ContactPatch** = `Partial<`

**ChannelName** = `import('./broadcasts').BroadcastChannel`

**SubjectType** = `'product' | 'proof' | 'batch'`

**ConditionOperator** = ``

**ContactSchema** = `ContactSchemaResponse`

### crate

**CrateItem** (interface)
```typescript
interface CrateItem {
  id: string                      // Item ID (tag ID)
  codeId: string                  // Code identifier
  batchId?: string                // Batch identifier
  productId?: string              // Product identifier
  claimId?: string                // Claim identifier
  productName?: string            // Product name
  productGtin?: string            // Product GTIN
  productImage?: string           // Product image URL
  data?: Record<string, any>      // Additional item data
}
```

**Crate** (interface)
```typescript
interface Crate {
  id: string                      // Crate ID
  items?: CrateItem[]             // Array of items in the crate
  deleted?: boolean               // Whether the crate is soft-deleted
  deletedAt?: string | null       // ISO 8601 timestamp when deleted
}
```

**ListCratesRequest** (interface)
```typescript
interface ListCratesRequest {
  limit?: number                  // Number of results per page (default: 100, max: 100)
  startAfter?: string             // Crate ID to start after for pagination
  includeDeleted?: boolean        // Include soft-deleted crates (default: false)
}
```

**ListCratesResponse** (interface)
```typescript
interface ListCratesResponse {
  items: Crate[]                  // Array of crates
  hasMore: boolean                // Whether more results are available
  lastId: string | null           // ID of last crate (use as startAfter for next page)
}
```

**CreateCrateRequest** (interface)
```typescript
interface CreateCrateRequest {
  items?: CrateItem[]             // Initial items for the crate
  [key: string]: any              // Additional fields
}
```

**UpdateCrateRequest** (interface)
```typescript
interface UpdateCrateRequest {
  items?: CrateItem[]             // Updated items
  [key: string]: any              // Additional fields
}
```

**DeleteCrateResponse** (interface)
```typescript
interface DeleteCrateResponse {
  success: boolean
}
```

### error

**ErrorResponse** (interface)
```typescript
interface ErrorResponse {
  code: number
  errorCode?: string
  message: string
  details?: Record<string, any>
}
```

### iframeResponder

**CachedData** (interface)
```typescript
interface CachedData {
  collection?: Record<string, any>;
  product?: Record<string, any>;
  proof?: Record<string, any>;
  user?: {
  uid: string;
  email?: string;
  displayName?: string;
  accountData?: Record<string, any>;
  } | null;
  apps?: AppConfig[];
}
```

**IframeResponderOptions** (interface)
```typescript
interface IframeResponderOptions {
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  version?: string;
  appUrl?: string;
  initialPath?: string;
  isAdmin?: boolean;
  cache?: CachedData;
  onAuthLogin?: (
  token: string,
  user: any,
  accountData?: Record<string, any>
  ) => Promise<void>;
  onAuthLogout?: () => Promise<void>;
  onRouteChange?: (path: string, state: Record<string, string>) => void;
  onResize?: (height: number) => void;
  onError?: (error: Error) => void;
  onReady?: () => void;
}
```

**RouteChangeMessage** (interface)
```typescript
interface RouteChangeMessage {
  type: 'smartlinks-route-change';
  path: string;
  context: Record<string, string>;
  state: Record<string, string>;
  appId?: string;
}
```

**SmartlinksIframeMessage** (interface)
```typescript
interface SmartlinksIframeMessage {
  _smartlinksIframeMessage: true;
  type:
  | 'smartlinks:resize'
  | 'smartlinks:redirect'
  | 'smartlinks:authkit:login'
  | 'smartlinks:authkit:logout'
  | 'smartlinks:authkit:redirect';
  payload: Record<string, any>;
  messageId?: string;
}
```

**ProxyRequest** (interface)
```typescript
interface ProxyRequest {
  _smartlinksProxyRequest: true;
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: any;
  headers?: Record<string, string>;
}
```

**CustomProxyRequest** (interface)
```typescript
interface CustomProxyRequest {
  _smartlinksProxyRequest: true;
  _smartlinksCustomProxyRequest: true;
  id: string;
  request: 'REDIRECT' | string;
  params: Record<string, any>;
}
```

**ProxyResponse** (interface)
```typescript
interface ProxyResponse {
  _smartlinksProxyResponse: true;
  id: string;
  data?: any;
  error?: string;
}
```

**UploadStartMessage** (interface)
```typescript
interface UploadStartMessage {
  _smartlinksProxyUpload: true;
  phase: 'start';
  id: string;
  fields: [string, string][];
  fileInfo: { type?: string; name?: string; key?: string };
  path: string;
  headers?: Record<string, string>;
}
```

**UploadChunkMessage** (interface)
```typescript
interface UploadChunkMessage {
  _smartlinksProxyUpload: true;
  phase: 'chunk';
  id: string;
  seq: number;
  chunk: ArrayBuffer;
}
```

**UploadEndMessage** (interface)
```typescript
interface UploadEndMessage {
  _smartlinksProxyUpload: true;
  phase: 'end';
  id: string;
}
```

**UploadAckMessage** (interface)
```typescript
interface UploadAckMessage {
  _smartlinksProxyUpload: true;
  phase: 'ack';
  id: string;
  seq: number;
}
```

**UploadDoneMessage** (interface)
```typescript
interface UploadDoneMessage {
  _smartlinksProxyUpload: true;
  phase: 'done';
  id: string;
  ok: boolean;
  data?: any;
  error?: string;
}
```

**UploadMessage** = ``

### interaction

**AdminInteractionsQueryRequest** (interface)
```typescript
interface AdminInteractionsQueryRequest {
  userId?: string
  contactId?: string
  appId?: string
  interactionId?: string
  scope?: string
  interactionIds?: string[]
  broadcastId?: string
  outcome?: string | null
  from?: string
  to?: string
  limit?: number
  includeDeleted?: boolean
  latestPerEventId?: boolean
  order?: 'ASC' | 'DESC'
  include?: Array<'interaction'>
}
```

**AdminInteractionsCountsByOutcomeRequest** (interface)
```typescript
interface AdminInteractionsCountsByOutcomeRequest {
  appId?: string
  interactionId?: string
  scope?: string
  from?: string
  to?: string
  limit?: number
  dedupeLatest?: boolean
  idField?: IdField
}
```

**PublicInteractionsCountsByOutcomeRequest** (interface)
```typescript
interface PublicInteractionsCountsByOutcomeRequest {
  appId: string
  interactionId: string
  scope?: string
  from?: string
  to?: string
  limit?: number
}
```

**PublicInteractionsByUserRequest** (interface)
```typescript
interface PublicInteractionsByUserRequest {
  appId?: string
  interactionId?: string
  scope?: string
  from?: string
  to?: string
  limit?: number
}
```

**InteractionEventRow** (interface)
```typescript
interface InteractionEventRow {
  orgId: string
  collectionId: string
  timestamp: string
  appId?: string
  interactionId?: string  // a link to a Interaction Object
  scope?: string       // a customizable string to segment interactions
  broadcastId?: string
  userId?: string
  contactId?: string
  outcome?: string | null
  metadata?: Record<string, unknown>
  [k: string]: unknown
}
```

**OutcomeCount** (interface)
```typescript
interface OutcomeCount {
  outcome: string | null; count: number
}
```

**InteractionEventBase** (interface)
```typescript
interface InteractionEventBase {
  collectionId: string,
  orgId?: string,
  userId?: string
  contactId?: string
  interactionId: string
  scope?: string
  appId?: string
  broadcastId?: string
  journeyId?: string
  productId?: string
  proofId?: string
  variantId?: string
  batchId?: string
  source?: string,
  eventType?: string
  outcome?: string
  timestamp?: string
  metadata?: Record<string, unknown>
  [k: string]: any
}
```

**InteractionPermissions** (interface)
```typescript
interface InteractionPermissions {
  enabled?: boolean
  requireAuth?: boolean
  allowPublicSubmit?: boolean
  allowAnonymousSubmit?: boolean
  allowedOrigins?: string[]
  startAt?: string
  endAt?: string
  * Enforce uniqueness per user: prevent duplicate submissions for this interaction.
  * If true, optionally use `uniquePerUserWindowSeconds` to scope the window.
  uniquePerUser?: boolean
  uniquePerUserWindowSeconds?: number
  uniqueOutcome?: string
  * Public summary visibility (counts, aggregates) without auth.
  * If false, summaries require `allowAuthenticatedSummary` + user auth.
  allowPublicSummary?: boolean
  * Authenticated summary visibility (counts, aggregates) when user is signed in.
  allowAuthenticatedSummary?: boolean
  allowOwnRead?: boolean
}
```

**InteractionDisplay** (interface)
```typescript
interface InteractionDisplay {
  title?: string
  description?: string
  icon?: string
  color?: string
}
```

**InteractionTypeRecord** (interface)
```typescript
interface InteractionTypeRecord {
  id?: string
  collectionId: string
  appId: string
  permissions?: InteractionPermissions
  data?: {
  display?: InteractionDisplay
  scopes?: Record<string, InteractionDisplay>;
  interactionType?: string
  [key: string]: unknown
  }
  createdAt: string
}
```

**InteractionTypeList** (interface)
```typescript
interface InteractionTypeList {
  items: InteractionTypeRecord[]
  limit: number
  offset: number
}
```

**CreateInteractionTypeBody** (interface)
```typescript
interface CreateInteractionTypeBody {
  id: string
  appId: string
  permissions?: InteractionPermissions
  data?: Record<string, unknown>
}
```

**UpdateInteractionTypeBody** (interface)
```typescript
interface UpdateInteractionTypeBody {
  appId?: string
  permissions?: InteractionPermissions
  data?: Record<string, unknown>
}
```

**ListInteractionTypesQuery** (interface)
```typescript
interface ListInteractionTypesQuery {
  appId?: string
  limit?: number
  offset?: number
}
```

### jobs

**Job** (interface)
```typescript
interface Job {
  id: number
  task: string
  payload: any
  priority: number
  runAt: string | null
  createdAt: string
  attempts: number
  lastError: string | null
  lockedAt: string | null
  key: string | null
  queueName: string | null
  status: JobStatus
}
```

**ListJobsQuery** (interface)
```typescript
interface ListJobsQuery {
  state?: JobStatus
  task?: string
  limit?: number
  offset?: number
  from?: string
  to?: string
}
```

**JobsPage** (interface)
```typescript
interface JobsPage {
  items: Job[]
  limit: number
  offset: number
}
```

**EnqueueAsyncJobRequest** (interface)
```typescript
interface EnqueueAsyncJobRequest {
  task: string
  payload?: Record<string, any>
  runAt?: string | Date
  priority?: number
  key?: string
  queueName?: string
}
```

**EnqueueAsyncJobResponse** (interface)
```typescript
interface EnqueueAsyncJobResponse {
  id: number
  task: string
  runAt?: string
  key?: string
}
```

**JobStatus** = `'queued' | 'running' | 'errored'`

### journeys

**JourneyRecord** (interface)
```typescript
interface JourneyRecord {
  id: string
  collectionId: string
  appId?: string
  name: string
  active: boolean
  journeyType: 'event_triggered' | 'scheduled'
  data?: {
  display?: {
  title?: string
  description?: string
  icon?: string
  color?: string
  }
  steps?: Array<{ id: string; type: string; config?: Record<string, unknown> }>
  triggers?: Array<{ type: string; config?: Record<string, unknown> }>
  entryRules?: any[]
  exitRules?: any[]
  metadata?: Record<string, unknown>
  [key: string]: unknown
  }
  createdAt: string
  updatedAt: string
}
```

**JourneyList** (interface)
```typescript
interface JourneyList {
  items: JourneyRecord[]
  limit: number
  offset: number
}
```

**ListJourneysQuery** (interface)
```typescript
interface ListJourneysQuery {
  appId?: string
  active?: boolean
  journeyType?: 'event_triggered' | 'scheduled'
  limit?: number
  offset?: number
}
```

**CreateJourneyBody** (interface)
```typescript
interface CreateJourneyBody {
  appId?: string
  name: string
  active?: boolean
  journeyType: 'event_triggered' | 'scheduled'
  data?: Record<string, unknown>
}
```

**UpdateJourneyBody** (interface)
```typescript
interface UpdateJourneyBody {
  appId?: string
  name?: string
  active?: boolean
  journeyType?: 'event_triggered' | 'scheduled'
  data?: Record<string, unknown>
}
```

### journeysAnalytics

**JourneyStatsRequest** (interface)
```typescript
interface JourneyStatsRequest {
  idField?: IdField // 'userId' | 'contactId'
  from?: string
  to?: string
  finalStepId?: string
  stepMappings?: Array<{ stepId: string; interactionId?: string; outcome?: string }>
}
```

**JourneyStatsResponse** (interface)
```typescript
interface JourneyStatsResponse {
  journeyId: string
  totalEntered: number
  currentlyActive?: number
  completed?: number
  exitedViaGoal?: number
  lastUpdated: string
  stepStats: Array<{ stepId: string; entered: number; completed: number; pending: number }>
}
```

**JourneyStepRecipientsRequest** (interface)
```typescript
interface JourneyStepRecipientsRequest {
  status?: 'entered' | 'completed' | 'pending'
  idField?: IdField
  interactionId?: string
  outcome?: string
  from?: string
  to?: string
  limit?: number
}
```

**JourneyFunnelReportRequest** (interface)
```typescript
interface JourneyFunnelReportRequest {
  idField?: IdField
  periodStart?: string
  periodEnd?: string
  stepMappings: Array<{ stepId: string; interactionId?: string; outcome?: string }>
}
```

**JourneyFunnelReportResponse** (interface)
```typescript
interface JourneyFunnelReportResponse {
  journeyId: string
  periodStart: string | null
  periodEnd: string | null
  steps: Array<{
  stepId: string
  enteredCount: number
  completedCount: number
  conversionRate: number
  avgTimeToComplete: number | null
  }>
}
```

**JourneyStepRecipientsResponse** = `string[]`

### location

**Location** (interface)
```typescript
interface Location {
  locationId: string
  collectionId: string | null
  scope: 'global' | 'collection'
  name: string
  category?: string
  description?: string
  countryName?: string
  countryCode?: string
  websiteUrl?: string
  logoUrl?: string
  phone?: string
  email?: string
  geofence?: Geofence | {}
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}
```

**LocationSearchQuery** (interface)
```typescript
interface LocationSearchQuery {
  q?: string
  category?: string
  countryCode?: string
  countryName?: string
  limit?: number // default 20; max 100
  sort?: 'name' | 'countryCode' | 'countryName' // default 'name'
}
```

**LocationSearchResponse** (interface)
```typescript
interface LocationSearchResponse {
  items: Location[]
  count: number
}
```

**Geofence** = ``

**LocationPayload** = `Omit<`

### nfc

**NfcTagInfo** (interface)
```typescript
interface NfcTagInfo {
  id: string
  tagId: string
  claimSetId: string
  collectionId?: string
  productId?: string
  batchId?: string
  variantId?: string
  proofId?: string
  index?: number
  data?: Record<string, any>
}
```

**NfcValidateRequest** (interface)
```typescript
interface NfcValidateRequest {
  claimSetId: string
  codeId: string
  mirror?: string
  userId?: string
}
```

**NfcValidateResponse** (interface)
```typescript
interface NfcValidateResponse {
  claimSetId: string
  codeId: string
  tagId: string
  index?: number
  isAdmin: boolean
  path?: string
  collectionId?:  string
  collection?:  Record<string, any>
  count: number,
  previousCount: number
  data?: Record<string, any>
  productId?:  string
  product?:  Record<string, any>
  batchId?:  string
  variantId?:  string
  proofId?:  string
}
```

**NfcClaimTagRequest** (interface)
```typescript
interface NfcClaimTagRequest {
  claimSetId: string
  codeId: string
  data: Record<string, any>
}
```

### order

**OrderItem** (interface)
```typescript
interface OrderItem {
  id: string                        // UUID
  orderId: string                   // Parent order ID
  itemType: 'tag' | 'proof' | 'serial' // Type of item
  itemId: string                    // The tag ID, proof ID, or serial number
  collectionId?: string             // Collection ID
  productId?: string                // Product ID
  variantId?: string | null         // Variant ID
  batchId?: string | null           // Batch ID
  metadata: Record<string, any>     // Item-specific metadata
  createdAt: string                 // ISO 8601 timestamp
  order?: OrderSummary              // Optional order summary (when includeOrder=true)
}
```

**OrderSummary** (interface)
```typescript
interface OrderSummary {
  id: string                        // Order ID
  orderRef?: string                 // Order reference
  status: string                    // Order status
  customerId?: string               // Customer ID
  createdAt: string                 // ISO 8601 timestamp
}
```

**Order** (interface)
```typescript
interface Order {
  id: string                        // UUID
  orgId: string                     // Organization ID
  collectionId: string              // Collection ID
  orderRef?: string                 // Customer's own order reference/ID (e.g., "ORD-12345")
  customerId?: string               // Customer's own customer ID (can map to CRM/contacts)
  status: string                    // e.g., "pending", "processing", "shipped", "completed"
  itemCount: number                 // Cached count of items (maintained automatically)
  metadata: {
  productSummary?: Record<string, number>  // productId -> count (auto-maintained)
  [key: string]: any              // Flexible additional data
  }
  items?: OrderItem[]               // Array of items (only when includeItems=true)
  createdAt: string                 // ISO 8601 timestamp
  updatedAt: string                 // ISO 8601 timestamp
}
```

**CreateOrderRequest** (interface)
```typescript
interface CreateOrderRequest {
  items: Array<{
  itemType: 'tag' | 'proof' | 'serial' // Required: Type of item
  itemId: string                        // Required: Item identifier
  metadata?: Record<string, any>        // Optional: Item-specific data
  }>
  orderRef?: string                       // Optional: Your own order reference/ID
  customerId?: string                     // Optional: Your customer ID
  status?: string                         // Optional: Order status (default: "pending")
  metadata?: Record<string, any>          // Optional: Order-level metadata
}
```

**GetOrderParams** (interface)
```typescript
interface GetOrderParams {
  includeItems?: boolean            // Optional: Include items array (default: false)
}
```

**UpdateOrderRequest** (interface)
```typescript
interface UpdateOrderRequest {
  orderRef?: string                 // Optional: Update order reference
  customerId?: string               // Optional: Update customer ID
  status?: string                   // Optional: Update status
  metadata?: Record<string, any>    // Optional: Merge with existing metadata
}
```

**DeleteOrderResponse** (interface)
```typescript
interface DeleteOrderResponse {
  success: boolean
}
```

**ListOrdersRequest** (interface)
```typescript
interface ListOrdersRequest {
  limit?: number                    // Optional: Max results (default: 100)
  offset?: number                   // Optional: Pagination offset (default: 0)
  status?: string                   // Optional: Filter by status
  orderRef?: string                 // Optional: Filter by order reference
  customerId?: string               // Optional: Filter by customer ID
  includeItems?: boolean            // Optional: Include items array (default: false)
}
```

**ListOrdersResponse** (interface)
```typescript
interface ListOrdersResponse {
  orders: Order[]
  limit: number
  offset: number
}
```

**AddItemsRequest** (interface)
```typescript
interface AddItemsRequest {
  items: Array<{
  itemType: 'tag' | 'proof' | 'serial' // Required: Type of item
  itemId: string                        // Required: Item identifier
  metadata?: Record<string, any>        // Optional: Item-specific data
  }>
}
```

**RemoveItemsRequest** (interface)
```typescript
interface RemoveItemsRequest {
  itemIds: string[]                 // Array of OrderItem IDs to remove
}
```

**LookupOrdersRequest** (interface)
```typescript
interface LookupOrdersRequest {
  items: Array<{
  itemType: 'tag' | 'proof' | 'serial' // Required: Type of item
  itemId: string                        // Required: Item identifier
  }>
}
```

**LookupOrdersResponse** (interface)
```typescript
interface LookupOrdersResponse {
  orders: Order[]                   // All orders containing any of the specified items
}
```

**GetOrderItemsParams** (interface)
```typescript
interface GetOrderItemsParams {
  limit?: number                    // Optional: Max results (default: 100)
  offset?: number                   // Optional: Pagination offset (default: 0)
}
```

**GetOrderItemsResponse** (interface)
```typescript
interface GetOrderItemsResponse {
  items: OrderItem[]
  limit: number
  offset: number
}
```

**QueryOrdersRequest** (interface)
```typescript
interface QueryOrdersRequest {
  query?: {
  status?: string
  orderRef?: string
  customerId?: string
  createdAfter?: string           // ISO 8601 date
  createdBefore?: string          // ISO 8601 date
  updatedAfter?: string           // ISO 8601 date
  updatedBefore?: string          // ISO 8601 date
  minItemCount?: number
  maxItemCount?: number
  metadata?: Record<string, any>
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  }
  limit?: number                    // Optional: Max results (default: 100)
  offset?: number                   // Optional: Pagination offset (default: 0)
  includeItems?: boolean            // Optional: Include items array (default: false)
}
```

**QueryOrdersResponse** (interface)
```typescript
interface QueryOrdersResponse {
  orders: Order[]
  limit: number
  offset: number
}
```

**ReportsParams** (interface)
```typescript
interface ReportsParams {
  groupByStatus?: boolean
  groupByCollection?: boolean
  groupByCustomer?: boolean
  groupByDate?: boolean
  groupByItemType?: boolean
  groupByProduct?: boolean
  includeItemStats?: boolean
  includeCount?: boolean            // default: true
  topN?: number                     // for customer/product grouping (default: 10)
  status?: string
  createdAfter?: string             // ISO 8601 date
  createdBefore?: string            // ISO 8601 date
}
```

**ReportsResponse** (interface)
```typescript
interface ReportsResponse {
  totalOrders?: number
  ordersByStatus?: Record<string, number>
  ordersByCollection?: Record<string, number>
  ordersByCustomer?: Record<string, number>
  ordersByDate?: Record<string, number>
  itemsByType?: Record<string, number>
  itemsByProduct?: Record<string, number>
  itemStats?: {
  totalItems: number
  avgItemsPerOrder: number
  maxItemsInOrder: number
  minItemsInOrder: number
  }
}
```

**LookupByProductParams** (interface)
```typescript
interface LookupByProductParams {
  limit?: number                    // Optional: Max results (default: 100)
  offset?: number                   // Optional: Pagination offset (default: 0)
  includeItems?: boolean            // Optional: Include items array (default: false)
}
```

**LookupByProductResponse** (interface)
```typescript
interface LookupByProductResponse {
  orders: Order[]
  limit: number
  offset: number
}
```

**FindOrdersByAttributeParams** (interface)
```typescript
interface FindOrdersByAttributeParams {
  limit?: number                    // Max results (default: 100)
  offset?: number                   // Pagination offset (default: 0)
  includeItems?: boolean            // Include items array (default: false)
}
```

**FindOrdersByAttributeResponse** (interface)
```typescript
interface FindOrdersByAttributeResponse {
  orders: Order[]
  limit: number
  offset: number
}
```

**FindItemsByAttributeParams** (interface)
```typescript
interface FindItemsByAttributeParams {
  limit?: number                    // Max results (default: 100)
  offset?: number                   // Pagination offset (default: 0)
  includeOrder?: boolean            // Include order summary (default: false)
}
```

**FindItemsByAttributeResponse** (interface)
```typescript
interface FindItemsByAttributeResponse {
  items: OrderItem[]
  count: number
  limit: number
  offset: number
}
```

**GetOrderIdsParams** (interface)
```typescript
interface GetOrderIdsParams {
  limit?: number                    // Max results (default: 1000)
  offset?: number                   // Pagination offset (default: 0)
}
```

**GetOrderIdsResponse** (interface)
```typescript
interface GetOrderIdsResponse {
  orderIds: string[]
  count: number
  attribute: 'batchId' | 'productId' | 'variantId'
  value: string
}
```

**TagScanSummary** (interface)
```typescript
interface TagScanSummary {
  tagId: string
  totalScans: number
  adminScans: number
  customerScans: number
  earliestScanAt: string | null
  earliestAdminScanAt: string | null
}
```

**OrderAnalyticsResponse** (interface)
```typescript
interface OrderAnalyticsResponse {
  orderRef: string
  orderId: string
  itemCount: number
  tagCount: number
  analytics: {
  totalScans: number
  adminScans: number
  customerScans: number
  earliestScanAt: string              // ISO 8601
  latestScanAt: string                // ISO 8601
  earliestAdminScanAt: string | null  // ISO 8601
  earliestCustomerScanAt: string | null // ISO 8601
  estimatedCreatedAt: string          // ISO 8601 - earliest admin scan or earliest scan
  uniqueLocations: number
  locations: string[]                 // Array of location strings
  uniqueDevices: number
  devices: string[]                   // Array of device types
  eventTypes: string[]                // e.g., ["scan_tag", "verify_tag"]
  tagSummaries: TagScanSummary[]
  } | null                              // null if no tags found
  message?: string                      // Only present if no tags found
}
```

**TagScanEvent** (interface)
```typescript
interface TagScanEvent {
  codeId: string
  claimId: string
  proofId: string | null
  productId: string | null
  variantId: string | null
  batchId: string | null
  collectionId: string
  timestamp: string                     // ISO 8601
  isAdmin: boolean
  eventType: string | null              // e.g., "scan_tag"
  location: string | null               // GPS coordinates or location string
  location_accuracy: number | null
  deviceType: string | null
  ip: string | null
  country: string | null
  sessionId: string | null
  metadata: Record<string, any> | null
}
```

**TimelineRequest** (interface)
```typescript
interface TimelineRequest {
  limit?: number                        // Max results (default: 1000)
  from?: string                         // ISO 8601 start date filter
  to?: string                           // ISO 8601 end date filter
  isAdmin?: boolean                     // Filter by admin scans only
}
```

**TimelineResponse** (interface)
```typescript
interface TimelineResponse {
  orderRef: string
  orderId: string
  timeline: TagScanEvent[]
  count: number
}
```

**LocationRequest** (interface)
```typescript
interface LocationRequest {
  limit?: number                        // Max results (default: 1000)
}
```

**LocationResponse** (interface)
```typescript
interface LocationResponse {
  orderRef: string
  orderId: string
  locations: LocationScan[]
  count: number
}
```

**BulkAnalyticsRequest** (interface)
```typescript
interface BulkAnalyticsRequest {
  orderIds: string[]                    // Array of order IDs
  from?: string                         // ISO 8601 start date filter
  to?: string                           // ISO 8601 end date filter
}
```

**OrderAnalyticsSummary** (interface)
```typescript
interface OrderAnalyticsSummary {
  orderId: string
  orderRef: string
  analytics: {
  totalScans: number
  adminScans: number
  customerScans: number
  earliestScanAt: string | null
  earliestAdminScanAt: string | null
  estimatedCreatedAt: string | null
  tagCount: number
  tagSummaries: TagScanSummary[]
  } | null
}
```

**BulkAnalyticsResponse** (interface)
```typescript
interface BulkAnalyticsResponse {
  results: OrderAnalyticsSummary[]
}
```

**DailyScanCount** (interface)
```typescript
interface DailyScanCount {
  date: string                          // YYYY-MM-DD
  scanCount: number
}
```

**AdminActivityEvent** (interface)
```typescript
interface AdminActivityEvent {
  timestamp: string                     // ISO 8601
  eventType: string
  codeId: string
}
```

**SummaryRequest** (interface)
```typescript
interface SummaryRequest {
  from?: string                         // ISO 8601 start date filter
  to?: string                           // ISO 8601 end date filter
}
```

**CollectionSummaryResponse** (interface)
```typescript
interface CollectionSummaryResponse {
  adminActivity: {
  count: number
  recent: AdminActivityEvent[]        // Last 100 events
  }
  scansByDay: DailyScanCount[]
  adminScansByDay: DailyScanCount[]
  customerScansByDay: DailyScanCount[]
}
```

### product

**Product** (interface)
```typescript
interface Product {
  id: string
  name: string
  collectionId: string
  description: string
  gtin?: string
  type?: string
  * Hero image asset object.
  * When creating/updating, you can pass either:
  * - A full asset object with url and thumbnails
  * - A string URL - the system will automatically fetch and store the image
  heroImage: {
  url: string
  thumbnails: {
  x100: string
  x200: string
  x512: string
  }
  }
  tags: {
  [tagName: string]: boolean
  } // Flexible map of tags with true/false values
  data: {
  [key: string]: any
  } // Flexible key/value data map
  admin?: {
  allowAutoGenerateClaims?: boolean
  lastSerialId?: number
  [key: string]: any
  }
}
```

**ProductResponse** = `Product`

**ProductCreateRequest** = `Omit<Product, 'id' | 'collectionId'> & {`

**ProductUpdateRequest** = `Partial<Omit<Product, 'id' | 'collectionId'>> & {`

### proof

**Proof** (interface)
```typescript
interface Proof {
  collectionId: string
  createdAt: string
  id: string
  productId: string
  tokenId: string
  userId: string
  claimable?: boolean
  virtual?: boolean
  values: Record<string, any>
}
```

**ProofCreateRequest** (interface)
```typescript
interface ProofCreateRequest {
  values: Record<string, any>
  claimable?: boolean
  virtual?: boolean
}
```

**ProofResponse** = `Proof`

**ProofUpdateRequest** = `Partial<ProofCreateRequest>`

**ProofClaimRequest** = `Record<string, any>`

### qr

**QrShortCodeLookupResponse** (interface)
```typescript
interface QrShortCodeLookupResponse {
  collectionId?: string
  productId?: string
  proofId?: string
  code: string
}
```

### realtime

**RealtimeTokenRequest** (interface)
```typescript
interface RealtimeTokenRequest {
  collectionId: string
  appId?: string
}
```

**AblyTokenRequest** (interface)
```typescript
interface AblyTokenRequest {
  keyName: string
  ttl: number
  timestamp: number
  capability: string
  nonce: string
  mac: string
  clientId: string
}
```

**RealtimeChannelPattern** = `string`

### segments

**InteractionFilterValue** (interface)
```typescript
interface InteractionFilterValue {
  interactionId: string
  scope?: string  // ← NEW: Scope filtering
  outcome?: string
  from?: string  // ISO date string
  to?: string    // ISO date string
}
```

**SegmentRecord** (interface)
```typescript
interface SegmentRecord {
  id: string
  collectionId: string
  appId?: string
  name: string
  filterType: 'dynamic' | 'static'
  estimatedCount?: number
  lastCalculatedAt?: string
  createdAt: string
  data?: {
  filterRules: SegmentFilterRule[]
  description?: string
  staticContactIds?: string[]
  [key: string]: unknown
  }
}
```

**ListSegmentsQuery** (interface)
```typescript
interface ListSegmentsQuery {
  appId?: string
  filterType?: 'dynamic' | 'static'
  limit?: number
  offset?: number
}
```

**SegmentList** (interface)
```typescript
interface SegmentList {
  items: SegmentRecord[]
  limit: number
  offset: number
}
```

**SegmentCalculateResult** (interface)
```typescript
interface SegmentCalculateResult {
  scheduled: boolean
  lastCalculatedAt?: string
  estimatedCount?: number | null
  note?: string
}
```

**SegmentRecipientsResponse** (interface)
```typescript
interface SegmentRecipientsResponse {
  items: import('./comms').Recipient[]
  limit: number
  offset: number
  total: number
  note?: string
}
```

**SegmentFilterRule** = ``

### tags

**Tag** (interface)
```typescript
interface Tag {
  id: string                        // UUID
  orgId: string                     // Organization ID
  tagId: string                     // Unique tag identifier (globally unique)
  collectionId: string              // Collection ID
  productId: string                 // Product ID
  variantId?: string | null         // Optional: Variant ID
  batchId?: string | null           // Optional: Batch ID
  proofId: string                   // Proof ID (serial number or explicit)
  metadata: Record<string, any>     // Additional metadata (e.g., serialIndex)
  createdAt: string                 // ISO 8601 timestamp
  updatedAt: string                 // ISO 8601 timestamp
}
```

**CreateTagRequest** (interface)
```typescript
interface CreateTagRequest {
  tagId: string                     // Required: Unique tag identifier
  productId: string                 // Required: Product ID
  variantId?: string                // Optional: Variant ID
  batchId?: string                  // Optional: Batch ID
  proofId?: string                  // Optional: Explicit proof ID (if omitted, auto-generates serial)
  useSerialNumber?: boolean         // Optional: Explicitly request serial number generation
  metadata?: Record<string, any>    // Optional: Additional metadata
  force?: boolean                   // Optional: Overwrite if tag exists in same collection (default: false)
}
```

**CreateTagsBatchRequest** (interface)
```typescript
interface CreateTagsBatchRequest {
  tags: Array<{
  tagId: string                   // Required: Unique tag identifier
  productId: string               // Required: Product ID
  variantId?: string              // Optional: Variant ID
  batchId?: string                // Optional: Batch ID
  proofId?: string                // Optional: If omitted, auto-generates serial number
  metadata?: Record<string, any>  // Optional: Additional metadata
  }>
  force?: boolean                   // Optional: Overwrite existing tags in same collection (default: false)
}
```

**CreateTagsBatchResponse** (interface)
```typescript
interface CreateTagsBatchResponse {
  summary: {
  total: number                   // Total tags in request
  created: number                 // Successfully created
  updated: number                 // Successfully updated (with force=true)
  failed: number                  // Failed to create/update
  conflicts: number               // Already exist (without force=true)
  }
  results: {
  created: Tag[]                  // Array of successfully created tags
  updated: Tag[]                  // Array of successfully updated tags
  failed: Array<{
  tagId: string
  reason: string                // Error code (e.g., "TAG_ASSIGNED_ELSEWHERE", "CREATE_FAILED")
  message: string               // Human-readable error message
  existingTag?: Tag             // Existing tag if applicable
  }>
  conflicts: Array<{
  tagId: string
  reason: string                // "TAG_ALREADY_ASSIGNED"
  message: string
  existingTag: Tag              // The existing tag
  }>
  }
}
```

**UpdateTagRequest** (interface)
```typescript
interface UpdateTagRequest {
  productId?: string                // Optional: Update product ID
  variantId?: string | null         // Optional: Update variant ID (null to clear)
  batchId?: string | null           // Optional: Update batch ID (null to clear)
  proofId?: string                  // Optional: Update proof ID
  metadata?: Record<string, any>    // Optional: Merge with existing metadata
}
```

**DeleteTagResponse** (interface)
```typescript
interface DeleteTagResponse {
  success: boolean
}
```

**ListTagsRequest** (interface)
```typescript
interface ListTagsRequest {
  limit?: number                    // Optional: Max results (default: 100)
  offset?: number                   // Optional: Pagination offset (default: 0)
  productId?: string                // Optional: Filter by product ID
  variantId?: string                // Optional: Filter by variant ID
  batchId?: string                  // Optional: Filter by batch ID
}
```

**ListTagsResponse** (interface)
```typescript
interface ListTagsResponse {
  tags: Tag[]
  limit: number
  offset: number
}
```

**PublicGetTagRequest** (interface)
```typescript
interface PublicGetTagRequest {
  embed?: string                    // Optional: Comma-separated values: "collection", "product", "proof"
}
```

**PublicGetTagResponse** (interface)
```typescript
interface PublicGetTagResponse {
  tag: Tag
  collection?: any                  // Included if embed contains "collection"
  product?: any                     // Included if embed contains "product"
  proof?: any                       // Included if embed contains "proof"
}
```

**PublicBatchLookupRequest** (interface)
```typescript
interface PublicBatchLookupRequest {
  tagIds: string[]                  // Array of tag IDs to lookup
  embed?: string                    // Optional: Comma-separated: "collection", "product", "proof"
}
```

**PublicBatchLookupResponse** (interface)
```typescript
interface PublicBatchLookupResponse {
  tags: Record<string, Tag>         // Map: tagId → Tag object
  collections?: Record<string, any> // Map: collectionId → Collection (if embed=collection)
  products?: Record<string, any>    // Map: productId → Product (if embed=product)
  proofs?: Record<string, any>      // Map: proofId → Proof (if embed=proof)
}
```

**PublicBatchLookupQueryRequest** (interface)
```typescript
interface PublicBatchLookupQueryRequest {
  tagIds: string                    // Comma-separated tag IDs
  embed?: string                    // Optional: Comma-separated: "collection", "product", "proof"
}
```

### template

**TemplateBase** (interface)
```typescript
interface TemplateBase {
  id: string
  collectionId: string
  name: string
  description?: string
  type: 'pdf' | 'email' | 'multichannel' | 'label'
  resizeMode?: string
  pdf?: {
  base: { url: string }
  orientation: 'portrait' | 'landscape'
  }
  channels?: {
  email?: {subject: string; body: string},
  sms?: { body: string },
  push: { title: string; body: string, url?: string, iconUrl?: string },
  wallet?: { header: string; body: string; imageUri?: string }
  }
  parameters: TemplateParameterSchema[]
  subject?: string
  body?: string
  css?: string
  public?: boolean
  engine?: string
  component?: string
  defaultProps?: Record<string, any>
  collections?: string[]
  [k: string]: any
}
```

**TemplateRenderRequest** (interface)
```typescript
interface TemplateRenderRequest {
  props: Record<string, any>
}
```

**TemplateRenderResponse** (interface)
```typescript
interface TemplateRenderResponse {
  ok: boolean; html: string
}
```

**TemplateRenderSourceRequest** (interface)
```typescript
interface TemplateRenderSourceRequest {
  engine: 'liquid'
  source: string
  props?: Record<string, any>
  component?: string
}
```

**TemplateRenderSourceResponse** (interface)
```typescript
interface TemplateRenderSourceResponse {
  ok: boolean; html: string
}
```

**TemplateInput** = `Omit<TemplateBase, 'id' | 'collectionId'>`

**TemplateUpdate** = `Partial<Omit<TemplateBase, 'id' | 'collectionId'>>`

**TemplatePublic** = `TemplateBase`

### variant

**VariantResponse** = `any`

**VariantCreateRequest** = `any`

**VariantUpdateRequest** = `any`

### appConfiguration (api)

**AppConfigOptions** (type)
```typescript
type AppConfigOptions = {
  /** The app ID */
  appId: string
  
  /** Collection ID (required for most operations) */
  collectionId?: string
  /** Product ID (optional - for product-scoped config) */
  productId?: string
  /** Variant ID (optional - for variant-scoped config) */
  variantId?: string
  /** Batch ID (optional - for batch-scoped config) */
  batchId?: string
  
  /** Item ID - required for getDataItem/deleteDataItem */
  itemId?: string
  
  /** Use admin endpoints instead of public */
  admin?: boolean
  
  /** Configuration object for setConfig */
  config?: any
  /** Data object for setDataItem */
  data?: any
}
```

### auth (api)

**LoginResponse** (type)
```typescript
type LoginResponse = {
  id: string
  name: string
  email: string
  bearerToken: string
  account: Record<string, any>
}
```

**VerifyTokenResponse** (type)
```typescript
type VerifyTokenResponse = {
  valid: boolean
  id?: string
  name?: string
  email?: string
  account?: Record<string, any>
}
```

**AccountInfoResponse** (type)
```typescript
type AccountInfoResponse = {
  accessType: string;
  analyticsCode: string;
  analyticsId: string;
  auth_time: number;
  baseCollectionId: string;
  clientType: string;
  email: string;
  email_verified: boolean;
  features: {
    actionLogger: boolean;
    adminCollections: boolean;
    adminApps: boolean;
    apiKeys: boolean;
    adminUsers: boolean;
    [key: string]: boolean;
  };
  iat: number;
  id: string;
  iss: string;
  location: string | null;
  name: string;
  picture: string;
  sites: {
    [siteName: string]: boolean;
  };
  sub: string;
  uid: string;
  userId: string;
  contactId: string
  whitelabel: {
    [key: string]: any;
  }
}
```

## API Functions

### ai

**create**(collectionId: string,
        request: ChatCompletionRequest) → `Promise<ChatCompletionResponse | AsyncIterable<ChatCompletionChunk>>`
Create a chat completion (streaming or non-streaming)

**list**(collectionId: string) → `Promise<`
List available AI models

**get**(collectionId: string, modelId: string) → `Promise<AIModel>`
Get specific model information

**indexDocument**(collectionId: string,
      request: IndexDocumentRequest) → `Promise<IndexDocumentResponse>`
Index a document for RAG

**configureAssistant**(collectionId: string,
      request: ConfigureAssistantRequest) → `Promise<ConfigureAssistantResponse>`
Configure AI assistant behavior

**stats**(collectionId: string) → `Promise<SessionStatistics>`
Get session statistics

**reset**(collectionId: string, userId: string) → `Promise<`
Reset rate limit for a user

**generate**(collectionId: string,
      request: GeneratePodcastRequest) → `Promise<GeneratePodcastResponse>`
Generate a NotebookLM-style conversational podcast from product documents

**getStatus**(collectionId: string, podcastId: string) → `Promise<PodcastStatus>`
Get podcast generation status

**generate**(collectionId: string,
      request: TTSRequest) → `Promise<Blob>`
Generate text-to-speech audio

**chat**(collectionId: string,
      request: PublicChatRequest) → `Promise<PublicChatResponse>`
Chat with product assistant (RAG)

**getSession**(collectionId: string, sessionId: string) → `Promise<Session>`
Get session history

**clearSession**(collectionId: string, sessionId: string) → `Promise<`
Clear session history

**getRateLimit**(collectionId: string, userId: string) → `Promise<RateLimitStatus>`
Check rate limit status

**getToken**(collectionId: string,
      request: EphemeralTokenRequest) → `Promise<EphemeralTokenResponse>`
Generate ephemeral token for Gemini Live

**isSupported**() → `boolean`
Check if voice is supported in browser

**listen**(language = 'en-US') → `Promise<string>`
Listen for voice input

**speak**(text: string, options?: { voice?: string; rate?: number }) → `Promise<void>`
Speak text

**generateContent**(collectionId: string,
    params: AIGenerateContentRequest,
    admin: boolean = true) → `Promise<any>`
Generate text/content via AI (admin)

**generateImage**(collectionId: string, params: AIGenerateImageRequest) → `Promise<any>`
Generate an image via AI (admin)

**searchPhotos**(collectionId: string,
    params: AISearchPhotosRequest) → `Promise<AISearchPhotosPhoto[]>`
Search stock photos or similar via AI (admin)

**uploadFile**(collectionId: string, params: any) → `Promise<any>`
Upload a file for AI usage (admin). Pass FormData for binary uploads.

**createCache**(collectionId: string, params: any) → `Promise<any>`
Create or warm a cache for AI (admin)

**postChat**(collectionId: string, params: any, admin: boolean = true) → `Promise<any>`
Post a chat message to the AI (admin or public)

### app

**create**(collectionId: string,
    appId: string,
    input: CreateCaseInput,
    admin: boolean = false) → `Promise<AppCase>`
Create a new case POST /cases

**list**(collectionId: string,
    appId: string,
    params?: CaseListQueryParams,
    admin: boolean = false) → `Promise<PaginatedResponse<AppCase>>`
List cases with optional query parameters GET /cases

**get**(collectionId: string,
    appId: string,
    caseId: string,
    admin: boolean = false) → `Promise<AppCase>`
Get a single case by ID GET /cases/:caseId

**update**(collectionId: string,
    appId: string,
    caseId: string,
    input: UpdateCaseInput,
    admin: boolean = false) → `Promise<AppCase>`
Update a case PATCH /cases/:caseId Admin can update any field, public (owner) can only update data and owner zones

**remove**(collectionId: string,
    appId: string,
    caseId: string,
    admin: boolean = false) → `Promise<`
Soft delete a case DELETE /cases/:caseId

**aggregate**(collectionId: string,
    appId: string,
    request: AggregateRequest,
    admin: boolean = false) → `Promise<AggregateResponse>`
Get aggregate statistics for cases POST /cases/aggregate

**summary**(collectionId: string,
    appId: string,
    request?: CaseSummaryRequest) → `Promise<CaseSummaryResponse>`
Get case summary (admin only) POST /cases/summary

**appendHistory**(collectionId: string,
    appId: string,
    caseId: string,
    input: AppendHistoryInput) → `Promise<AppCase>`
Append an entry to case history (admin only) POST /cases/:caseId/history

**related**(collectionId: string,
    appId: string,
    caseId: string) → `Promise<RelatedResponse>`
Get related threads and records for a case (admin only) GET /cases/:caseId/related

### appConfiguration

**getConfig**(opts: AppConfigOptions) → `Promise<any>`
Get app configuration for a collection/product scope. ```typescript const config = await appConfiguration.getConfig({ appId: 'warranty-portal', collectionId: 'my-collection' }); ```

**setConfig**(opts: AppConfigOptions) → `Promise<any>`
Set app configuration for a collection/product scope. Requires admin authentication. ```typescript await appConfiguration.setConfig({ appId: 'warranty-portal', collectionId: 'my-collection', admin: true, config: { warrantyPeriod: 24, supportEmail: 'support@example.com' } }); ```

**deleteConfig**(opts: AppConfigOptions) → `Promise<void>`
Delete app configuration for a collection/product scope. Requires admin authentication. ```typescript await appConfiguration.deleteConfig({ appId: 'warranty-portal', collectionId: 'my-collection', admin: true }); ```

**getData**(opts: AppConfigOptions) → `Promise<any[]>`
Get all data items for an app within a scope. ```typescript const items = await appConfiguration.getData({ appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123' }); ```

**getDataItem**(opts: AppConfigOptions) → `Promise<any>`
Get a single data item by ID within a scope. ```typescript const item = await appConfiguration.getDataItem({ appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123', itemId: 'manual-1' }); ```

**setDataItem**(opts: AppConfigOptions) → `Promise<any>`
Set/create a data item within a scope. Requires admin authentication. ```typescript await appConfiguration.setDataItem({ appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123', admin: true, data: { id: 'manual-1', title: 'User Manual', url: 'https://...' } }); ```

**deleteDataItem**(opts: AppConfigOptions) → `Promise<void>`
Delete a data item by ID within a scope. Requires admin authentication. ```typescript await appConfiguration.deleteDataItem({ appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123', admin: true, itemId: 'manual-1' }); ```

**getWidgets**(collectionId: string,
    options?: GetCollectionWidgetsOptions) → `Promise<CollectionWidgetsResponse>`
Fetches ALL widget data (manifests + bundle files) for a collection in one call. Returns everything needed to render widgets with zero additional requests. This solves N+1 query problems by fetching manifests, JavaScript bundles, and CSS files in parallel on the server. ```typescript // Fetch all widget data for a collection const { apps } = await Api.AppConfiguration.getWidgets(collectionId); // Returns: [{ appId, manifestUrl, manifest, bundleSource, bundleCss }, ...] // Convert bundle source to dynamic imports for (const app of apps) { const blob = new Blob([app.bundleSource], { type: 'application/javascript' }); const blobUrl = URL.createObjectURL(blob); const widgetModule = await import(blobUrl); // Inject CSS if present if (app.bundleCss) { const styleTag = document.createElement('style'); styleTag.textContent = app.bundleCss; document.head.appendChild(styleTag); } } // Force refresh all widgets const { apps } = await Api.AppConfiguration.getWidgets(collectionId, { force: true }); ```

### asset

**upload**(options: UploadAssetOptions) → `Promise<Asset>`
Upload an asset file

**uploadFromUrl**(options: UploadFromUrlOptions) → `Promise<Asset>`
Upload an asset from a URL The server will fetch the file from the provided URL and store it permanently in your CDN. This solves CORS issues and ensures files are permanently stored. ```typescript // Upload AI-generated image const asset = await asset.uploadFromUrl({ url: 'https://oaidalleapiprodscus.blob.core.windows.net/...', scope: { type: 'collection', collectionId: 'my-collection' }, metadata: { name: 'AI Generated Image', app: 'gallery' } }); // Upload stock photo const asset = await asset.uploadFromUrl({ url: 'https://images.unsplash.com/photo-...', scope: { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' }, folder: 'images', metadata: { name: 'Product Photo' } }); ```

**getForCollection**(collectionId: string,
    assetId: string) → `Promise<AssetResponse>`
Upload an asset from a URL The server will fetch the file from the provided URL and store it permanently in your CDN. This solves CORS issues and ensures files are permanently stored. ```typescript // Upload AI-generated image const asset = await asset.uploadFromUrl({ url: 'https://oaidalleapiprodscus.blob.core.windows.net/...', scope: { type: 'collection', collectionId: 'my-collection' }, metadata: { name: 'AI Generated Image', app: 'gallery' } }); // Upload stock photo const asset = await asset.uploadFromUrl({ url: 'https://images.unsplash.com/photo-...', scope: { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' }, folder: 'images', metadata: { name: 'Product Photo' } }); ```

**listForCollection**(collectionId: string) → `Promise<AssetResponse[]>`
Upload an asset from a URL The server will fetch the file from the provided URL and store it permanently in your CDN. This solves CORS issues and ensures files are permanently stored. ```typescript // Upload AI-generated image const asset = await asset.uploadFromUrl({ url: 'https://oaidalleapiprodscus.blob.core.windows.net/...', scope: { type: 'collection', collectionId: 'my-collection' }, metadata: { name: 'AI Generated Image', app: 'gallery' } }); // Upload stock photo const asset = await asset.uploadFromUrl({ url: 'https://images.unsplash.com/photo-...', scope: { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' }, folder: 'images', metadata: { name: 'Product Photo' } }); ```

**getForProduct**(collectionId: string,
    productId: string,
    assetId: string) → `Promise<AssetResponse>`
Upload an asset from a URL The server will fetch the file from the provided URL and store it permanently in your CDN. This solves CORS issues and ensures files are permanently stored. ```typescript // Upload AI-generated image const asset = await asset.uploadFromUrl({ url: 'https://oaidalleapiprodscus.blob.core.windows.net/...', scope: { type: 'collection', collectionId: 'my-collection' }, metadata: { name: 'AI Generated Image', app: 'gallery' } }); // Upload stock photo const asset = await asset.uploadFromUrl({ url: 'https://images.unsplash.com/photo-...', scope: { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' }, folder: 'images', metadata: { name: 'Product Photo' } }); ```

**listForProduct**(collectionId: string,
    productId: string) → `Promise<AssetResponse[]>`
Upload an asset from a URL The server will fetch the file from the provided URL and store it permanently in your CDN. This solves CORS issues and ensures files are permanently stored. ```typescript // Upload AI-generated image const asset = await asset.uploadFromUrl({ url: 'https://oaidalleapiprodscus.blob.core.windows.net/...', scope: { type: 'collection', collectionId: 'my-collection' }, metadata: { name: 'AI Generated Image', app: 'gallery' } }); // Upload stock photo const asset = await asset.uploadFromUrl({ url: 'https://images.unsplash.com/photo-...', scope: { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' }, folder: 'images', metadata: { name: 'Product Photo' } }); ```

**getForProof**(collectionId: string,
    productId: string,
    proofId: string,
    assetId: string) → `Promise<AssetResponse>`
Upload an asset from a URL The server will fetch the file from the provided URL and store it permanently in your CDN. This solves CORS issues and ensures files are permanently stored. ```typescript // Upload AI-generated image const asset = await asset.uploadFromUrl({ url: 'https://oaidalleapiprodscus.blob.core.windows.net/...', scope: { type: 'collection', collectionId: 'my-collection' }, metadata: { name: 'AI Generated Image', app: 'gallery' } }); // Upload stock photo const asset = await asset.uploadFromUrl({ url: 'https://images.unsplash.com/photo-...', scope: { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' }, folder: 'images', metadata: { name: 'Product Photo' } }); ```

**listForProof**(collectionId: string,
    productId: string,
    proofId: string,
    appId?: string) → `Promise<AssetResponse[]>`
Upload an asset from a URL The server will fetch the file from the provided URL and store it permanently in your CDN. This solves CORS issues and ensures files are permanently stored. ```typescript // Upload AI-generated image const asset = await asset.uploadFromUrl({ url: 'https://oaidalleapiprodscus.blob.core.windows.net/...', scope: { type: 'collection', collectionId: 'my-collection' }, metadata: { name: 'AI Generated Image', app: 'gallery' } }); // Upload stock photo const asset = await asset.uploadFromUrl({ url: 'https://images.unsplash.com/photo-...', scope: { type: 'product', collectionId: 'my-collection', productId: 'wine-bottle' }, folder: 'images', metadata: { name: 'Product Photo' } }); ```

**uploadAsset**(collectionId: string,
    productId: string,
    proofId: string,
    file: File,
    extraData?: Record<string, any>,
    onProgress?: (percent: number) → `void`
Uploads an asset file to a proof, with optional extraData as JSON. Supports progress reporting via onProgress callback (browser only).

**list**(options: ListAssetsOptions) → `Promise<Asset[]>`
List assets for a given scope

**get**(options: GetAssetOptions) → `Promise<Asset>`
Get an asset by id within a scope (public)

**remove**(options: RemoveAssetOptions) → `Promise<void>`
Remove an asset by id within a scope (admin)

### async

**enqueueAsyncJob**(collectionId: string,
    params: EnqueueAsyncJobRequest) → `Promise<EnqueueAsyncJobResponse>`
Enqueue a background job for a collection POST /admin/collection/:collectionId/async/jobs (202)

**getAsyncJobStatus**(collectionId: string,
    jobId: number) → `Promise<Job>`
Get job status by ID (may return 404 if completed/removed) GET /admin/collection/:collectionId/async/jobs/:jobId

### attestation

**list**(collectionId: string,
    productId: string,
    proofId: string) → `Promise<AttestationResponse[]>`
List all attestations for a proof.

**get**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string) → `Promise<AttestationResponse>`
Get a single attestation by ID.

**create**(collectionId: string,
    productId: string,
    proofId: string,
    data: AttestationCreateRequest) → `Promise<AttestationResponse>`
Create a new attestation for a proof.

**update**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string,
    data: AttestationUpdateRequest) → `Promise<AttestationResponse>`
Update an attestation.

**remove**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string) → `Promise<void>`
Delete an attestation.

### auth

**login**(email: string, password: string) → `Promise<LoginResponse>`
Login with email and password. Sets the bearerToken for subsequent API calls.

**logout**() → `void`
Logout (clears bearerToken for future API calls).

**verifyToken**(token?: string) → `Promise<VerifyTokenResponse>`
Verifies the current bearerToken (or a provided token). Returns user/account info if valid.

**requestAdminJWT**(collectionId: string) → `Promise<string>`
Requests an admin JWT for the current user and a specific collection Returns JWT if valid.

**requestPublicJWT**(collectionId: string, productId: string, proofId: string) → `Promise<string>`
Requests a JWT for the current user and a specific collection/product/proof Validates if the user has access to the resource, and returns a JWT

**registerUser**(user: UserAccountRegistrationRequest) → `Promise<LoginResponse>`
Tries to register a new user account. Can return a bearer token, or a Firebase token

**getUserToken**(opts?: {
    email?: string
    collectionId?: string
    userId?: string
    expiry?: string
  }) → `Promise<`
Admin: Get a user bearer token (impersonation/automation). POST /admin/auth/userToken All fields are optional; at least one identifier should be provided.

**getAccount**() → `Promise<AccountInfoResponse>`
Gets current account information for the logged in user. Returns user, owner, account, and location objects. Short-circuits immediately (no network request) when the SDK has no bearer token or API key set — the server would return 401 anyway. Throws a `SmartlinksApiError` with `statusCode 401` and `details.local = true` so callers can distinguish "never authenticated" from an actual server-side token rejection. This short-circuit is skipped when proxy mode is enabled, because in that case credentials are held by the parent frame and the local SDK may have no token set yet — the request must be forwarded to the parent to determine whether the user is authenticated.

### authKit

**login**(clientId: string, email: string, password: string) → `Promise<AuthLoginResponse>`
Login with email + password (public).

**register**(clientId: string, data: { email: string; password: string; displayName?: string; accountData?: Record<string, any> }) → `Promise<AuthLoginResponse>`
Register a new user (public).

**googleLogin**(clientId: string, idToken: string) → `Promise<AuthLoginResponse>`
Google OAuth login (public).

**sendMagicLink**(clientId: string, data: { email: string; redirectUrl: string; accountData?: Record<string, any> }) → `Promise<MagicLinkSendResponse>`
Send a magic link email to the user (public).

**verifyMagicLink**(clientId: string, token: string) → `Promise<MagicLinkVerifyResponse>`
Verify a magic link token and authenticate/create the user (public).

**sendPhoneCode**(clientId: string, phoneNumber: string) → `Promise<PhoneSendCodeResponse>`
Send phone verification code (public).

**verifyPhoneCode**(clientId: string, phoneNumber: string, code: string) → `Promise<PhoneVerifyResponse>`
Verify phone verification code (public).

**requestPasswordReset**(clientId: string, data: { email: string; redirectUrl?: string; clientName?: string }) → `Promise<PasswordResetRequestResponse>`
Verify phone verification code (public).

**verifyResetToken**(clientId: string, token: string) → `Promise<VerifyResetTokenResponse>`
Verify phone verification code (public).

**completePasswordReset**(clientId: string, token: string, newPassword: string) → `Promise<PasswordResetCompleteResponse>`
Verify phone verification code (public).

**sendEmailVerification**(clientId: string, data: { userId: string; email: string; redirectUrl?: string; clientName?: string }) → `Promise<EmailVerificationActionResponse>`
Verify phone verification code (public).

**verifyEmail**(clientId: string, token: string) → `Promise<EmailVerifyTokenResponse>`
Verify phone verification code (public).

**resendEmailVerification**(clientId: string, data: { userId: string; email: string; redirectUrl?: string; clientName?: string }) → `Promise<EmailVerificationActionResponse>`
Verify phone verification code (public).

**getProfile**(clientId: string) → `Promise<UserProfile>`
Verify phone verification code (public).

**updateProfile**(clientId: string, data: ProfileUpdateData) → `Promise<UserProfile>`
Verify phone verification code (public).

**changePassword**(clientId: string, currentPassword: string, newPassword: string) → `Promise<SuccessResponse>`
Verify phone verification code (public).

**changeEmail**(clientId: string, newEmail: string, password: string, redirectUrl: string) → `Promise<SuccessResponse>`
Verify phone verification code (public).

**verifyEmailChange**(clientId: string, token: string) → `Promise<SuccessResponse>`
Verify phone verification code (public).

**updatePhone**(clientId: string, phoneNumber: string, verificationCode: string) → `Promise<SuccessResponse>`
Verify phone verification code (public).

**deleteAccount**(clientId: string, password: string, confirmText: string) → `Promise<SuccessResponse>`
Verify phone verification code (public).

**load**(authKitId: string) → `Promise<AuthKitConfig>`
Verify phone verification code (public).

**get**(collectionId: string, authKitId: string) → `Promise<AuthKitConfig>`
Verify phone verification code (public).

**list**(collectionId: string, admin?: boolean) → `Promise<AuthKitConfig[]>`
Verify phone verification code (public).

**create**(collectionId: string, data: any) → `Promise<AuthKitConfig>`
Verify phone verification code (public).

**update**(collectionId: string, authKitId: string, data: any) → `Promise<AuthKitConfig>`
Verify phone verification code (public).

**remove**(collectionId: string, authKitId: string) → `Promise<void>`
Verify phone verification code (public).

### batch

**get**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<BatchResponse>`
Get a single batch by ID for a collection and product (admin only).

**list**(collectionId: string,
    productId: string) → `Promise<BatchResponse[]>`
List all batches for a collection and product (admin only).

**create**(collectionId: string,
    productId: string,
    data: BatchCreateRequest) → `Promise<BatchResponse>`
Create a new batch for a collection and product (admin only).

**update**(collectionId: string,
    productId: string,
    batchId: string,
    data: BatchUpdateRequest) → `Promise<BatchResponse>`
Update a batch for a collection and product (admin only).

**remove**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<void>`
Delete a batch for a collection and product (admin only).

**getPublic**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<BatchResponse>`
Get a single batch by ID for a collection and product (public endpoint).

**getSN**(collectionId: string,
    productId: string,
    batchId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a batch (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    batchId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a batch (admin only).

**searchInCollection**(collectionId: string,
    params?: SearchBatchesRequest) → `Promise<BatchResponse[]>`
Search for batches across all products in a collection. Allows searching by batch ID or name, with optional product filtering. ```typescript // Search for batches containing "2024" const batches = await batch.searchInCollection('coll_123', { search: 'BATCH-2024', limit: 50 }) // Filter batches for a specific product const productBatches = await batch.searchInCollection('coll_123', { productId: 'prod_abc', limit: 100 }) // Get all batches in collection const allBatches = await batch.searchInCollection('coll_123') // Check for expired batches batches.forEach(batch => { if (batch.expiryDate?.seconds) { const expiryDate = new Date(batch.expiryDate.seconds * 1000) if (expiryDate < new Date()) { console.log(`Batch ${batch.id} is expired`) } } }) ```

**findInCollection**(collectionId: string,
    batchId: string) → `Promise<BatchResponse>`
Find a specific batch by ID across all products in a collection. Returns the batch along with the productId it belongs to. ```typescript // Find which product contains a specific batch const batch = await batch.findInCollection('coll_123', 'BATCH-2024-001') console.log(`Batch found in product: ${batch.productId}`) console.log(`Expires: ${batch.expiryDate}`) ```

**getBatchTags**(collectionId: string,
    batchId: string,
    claimSetId?: string) → `Promise<BatchTag[]>`
Get all tags/codes assigned to a specific batch. Shows which claim set codes have been assigned to this batch. ```typescript // Get all tags assigned to a batch const tags = await batch.getBatchTags('coll_123', 'BATCH-2024-001') console.log(`Batch has ${tags.length} tags assigned`) tags.forEach(tag => { console.log(`Code: ${tag.code}, ClaimSet: ${tag.claimSetId}, TagID: ${tag.tagId}`) }) // Get tags from a specific claim set const claimSetTags = await batch.getBatchTags('coll_123', 'BATCH-2024-001', '000001') ```

### broadcasts

**create**(collectionId: string,
    body: Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>) → `Promise<BroadcastRecord>`

**list**(collectionId: string,
    query: ListBroadcastsQuery = {}) → `Promise<BroadcastList>`

**get**(collectionId: string,
    id: string) → `Promise<BroadcastRecord>`

**update**(collectionId: string,
    id: string,
    body: Partial<Omit<BroadcastRecord, 'id' | 'collectionId' | 'createdAt'>>) → `Promise<BroadcastRecord>`

**remove**(collectionId: string,
    id: string) → `Promise<void>`

**recipients**(collectionId: string,
    id: string,
    query: { limit?: number; offset?: number } = {}) → `Promise<BroadcastRecipientsResponse>`

**preview**(collectionId: string,
    id: string,
    body: BroadcastPreviewRequest) → `Promise<BroadcastPreviewResponse>`

**send**(collectionId: string,
    id: string,
    body: BroadcastSendRequest = {}) → `Promise<`

**sendTest**(collectionId: string,
    id: string,
    body: BroadcastSendTestRequest) → `Promise<BroadcastSendTestResponse>`

**sendManual**(collectionId: string,
    id: string,
    body: BroadcastSendManualRequest) → `Promise<BroadcastSendManualResponse>`

**append**(collectionId: string,
    body: BroadcastAppendEventBody) → `Promise<AppendResult>`

**appendBulk**(collectionId: string,
    body: BroadcastAppendBulkBody) → `Promise<AppendBulkResult>`

### claimSet

**getAllForCollection**(collectionId: string) → `Promise<any[]>`
Get all claim sets for a collection.

**getForCollection**(collectionId: string, claimSetId: string) → `Promise<any>`
Get a specific claim set for a collection.

**getAllTags**(collectionId: string, claimSetId: string) → `Promise<any[]>`
Get all tags for a claim set.

**getReport**(collectionId: string, claimSetId: string) → `Promise<any>`
Get a report for a claim set.

**getAssignedTags**(collectionId: string, claimSetId: string) → `Promise<any>`
Get assigned tags for a claim set.

**getTagSummary**(collectionId: string) → `Promise<any>`
Get tag summary for a collection.

**tagQuery**(collectionId: string, data: any) → `Promise<any>`
Perform a tag query for a collection.

**createForCollection**(collectionId: string, params: any) → `Promise<any>`
Create a new claim set for a collection.

**updateForCollection**(collectionId: string, params: any) → `Promise<any>`
Update a claim set for a collection.

**makeClaim**(collectionId: string, params: any) → `Promise<any>`
Make a claim for a claim set.

**assignClaims**(collectionId: string, data: AssignClaimsRequest) → `Promise<any>`
Assign claims to a claim set. { id: string,          // claim set id (required) collectionId: string,// required productId: string,   // required batchId?: string,    // optional start?: number,      // optional bulk range start end?: number,        // optional bulk range end codeId?: string,     // optional single code data?: { [k: string]: any } // optional claim key/values }

**updateClaimData**(collectionId: string, data: UpdateClaimDataRequest) → `Promise<any>`
Update claim data for a collection.

### collection

**get**(collectionId: string, admin?: boolean) → `Promise<CollectionResponse>`
Retrieves a single Collection by its ID.

**list**(admin?: boolean) → `Promise<CollectionResponse[]>`
Retrieves all Collections.

**getShortId**(shortId: string) → `Promise<CollectionResponse>`
Retrieve a collection by its shortId (public endpoint).

**getSettings**(collectionId: string, settingGroup: string, admin?: boolean) → `Promise<any>`
Retrieve a specific settings group for a collection (public endpoint).

**getAppsConfig**(collectionId: string) → `Promise<AppsConfigResponse>`
Retrieve all configured app module definitions for a collection (public endpoint).

**updateSettings**(collectionId: string, settingGroup: string, settings: any) → `Promise<any>`
Update a specific settings group for a collection (admin endpoint).

**create**(data: CollectionCreateRequest) → `Promise<CollectionResponse>`
Create a new collection (admin only).

**update**(collectionId: string, data: CollectionUpdateRequest) → `Promise<CollectionResponse>`
Update a collection (admin only).

**remove**(collectionId: string) → `Promise<void>`
Delete a collection (admin only).

**getSN**(collectionId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a collection (admin only).

**lookupSN**(collectionId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a collection (admin only).

**assignSN**(collectionId: string,
    codeId: string,
    value: any) → `Promise<any>`
Assign a value to a serial number for a collection (admin only).

### comms

**getPushVapidPublicKey**(collectionId: string) → `Promise<import("../types/comms").PushVapidResponse>`
Public: Get VAPID public key used for Web Push subscriptions. GET /public/collection/:collectionId/comm/push/vapidPublicKey Note: Key may be global; path is collection-scoped for consistency.

**registerPush**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Register a Web Push subscription under unified comms. POST /public/collection/:collectionId/comm/push/register

**getSettings**(collectionId: string,
    opts: { includeSecret?: boolean } = {}) → `Promise<import("../types/comms").CommsSettingsGetResponse>`
Admin: Get current comms settings for a collection. GET /admin/collection/:collectionId/comm.settings Optional query: includeSecret=true to include unsub.secret in response.

**patchSettings**(collectionId: string,
    body: import("../types/comms") → `void`
Admin: Patch comms settings for a collection. PATCH /admin/collection/:collectionId/comm.settings

**getPublicTopics**(collectionId: string) → `Promise<import("../types/comms").CommsPublicTopicsResponse>`
Public: Fetch configured topics for a collection. GET /public/collection/:collectionId/comm/topics

**unsubscribe**(collectionId: string,
    query: import("../types/comms") → `void`
Public: Unsubscribe a contact from a category or channel. GET /public/collection/:collectionId/comm/unsubscribe

**upsertConsent**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Upsert default consent for a contact. POST /public/collection/:collectionId/comm/consent

**upsertPreferences**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Upsert preferences for a specific subject (or default if subject omitted). POST /public/collection/:collectionId/comm/preferences

**subscribe**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Subscribe/unsubscribe contact to a subject. POST /public/collection/:collectionId/comm/subscribe

**checkSubscription**(collectionId: string,
    query: import("../types/comms") → `void`
Public: Check subscription status for a subject. GET /public/collection/:collectionId/comm/subscription/check

**listMethods**(collectionId: string,
    query: import("../types/comms") → `void`
Public: List registered contact methods. GET /public/collection/:collectionId/comm/methods

**registerEmail**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Register email method for a contact. POST /public/collection/:collectionId/comm/email/register

**registerSms**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Register SMS method for a contact. POST /public/collection/:collectionId/comm/sms/register

**resolveSubscriptions**(collectionId: string,
    body: import("../types/comms") → `void`
Public: Resolve contacts for a subject with identity hints. POST /public/collection/:collectionId/comm/subscriptions/resolve

**queryByUser**(collectionId: string,
    body: CommsQueryByUser = {}) → `Promise<CommunicationEvent[]>`
Analytics: Query communication events by user or contact. POST /admin/collection/:collectionId/comm/query/by-user

**queryRecipientIds**(collectionId: string,
    body: CommsRecipientIdsQuery) → `Promise<RecipientId[]>`
Analytics: Recipient IDs for a communication source. POST /admin/collection/:collectionId/comm/query/recipient-ids

**queryRecipientsWithoutAction**(collectionId: string,
    body: CommsRecipientsWithoutActionQuery) → `Promise<RecipientId[]>`
Analytics: Recipients who did not perform an action. POST /admin/collection/:collectionId/comm/query/recipients/without-action

**queryRecipientsWithAction**(collectionId: string,
    body: CommsRecipientsWithActionQuery) → `Promise<RecipientId[] | RecipientWithOutcome[]>`
Analytics: Recipients who performed an action, optionally with outcome. POST /admin/collection/:collectionId/comm/query/recipients/with-action

**sendTransactional**(collectionId: string,
    body: TransactionalSendRequest) → `Promise<TransactionalSendResult>`
Send a single transactional message to one contact using a template. No broadcast record is created. The send is logged to the contact's communication history with sourceType: 'transactional'. POST /admin/collection/:collectionId/comm/send ```typescript const result = await comms.sendTransactional(collectionId, { contactId:  'e4f2a1b0-...', templateId: 'warranty-update', channel:    'preferred', props:      { claimRef: 'CLM-0042', decision: 'approved' }, include:    { productId: 'prod-abc123', appCase: 'c9d1e2f3-...' }, ref:        'warranty-decision-notification', appId:      'warrantyApp', }) if (result.ok) { console.log(`Sent via ${result.channel}`, result.messageId) } else { console.error('Send failed:', result.error) } ```

**logCommunicationEvent**(collectionId: string,
    body: LogCommunicationEventBody) → `Promise<AppendResult>`
Logging: Append a single communication event. POST /admin/collection/:collectionId/comm/log

**logBulkCommunicationEvents**(collectionId: string,
    body: LogBulkCommunicationEventsBody | ({ sourceId: string; ids: string[]; idField?: 'userId'|'contactId'; [k: string]: any }) → `void`
Logging: Append many communication events for a list of IDs. POST /admin/collection/:collectionId/comm/log/bulk

### contact

**create**(collectionId: string, data: ContactCreateRequest) → `Promise<ContactResponse>`

**list**(collectionId: string,
    params?: { limit?: number; offset?: number; includeDeleted?: boolean }) → `Promise<ContactListResponse>`

**get**(collectionId: string,
    contactId: string,
    params?: { includeDeleted?: boolean }) → `Promise<ContactResponse>`

**update**(collectionId: string,
    contactId: string,
    data: ContactUpdateRequest) → `Promise<ContactResponse>`

**remove**(collectionId: string, contactId: string) → `Promise<void>`

**lookup**(collectionId: string,
    params: { email?: string; phone?: string }) → `Promise<ContactResponse>`

**upsert**(collectionId: string,
    data: ContactCreateRequest) → `Promise<ContactResponse>`

**publicUpsert**(collectionId: string,
    data: PublicContactUpsertRequest) → `Promise<PublicContactUpsertResponse>`

**publicGetMine**(collectionId: string) → `Promise<PublicGetMyContactResponse>`

**publicUpdateMine**(collectionId: string,
    data: ContactPatch) → `Promise<PublicUpdateMyContactResponse>`

**publicGetSchema**(collectionId: string) → `Promise<ContactSchemaResponse>`
Public: Get the contact schema for a collection. GET /public/collection/:collectionId/contact/schema Returns a ContactSchemaResponse describing all publicly visible contact fields. Core fields and collection-defined custom fields are merged into a single flat schema. Fields not in `publicVisibleFields` are stripped entirely from the response. Fields visible but not in `publicEditableFields` have `ui:disabled: true` in `uiSchema`. Use `fieldOrder` to render fields in the correct sequence, and `evaluateConditions` from the types package to handle conditional field visibility. ```typescript import { contact, evaluateConditions } from '@proveanything/smartlinks' const schema = await contact.publicGetSchema(collectionId) for (const fieldId of schema.fieldOrder) { const property = schema.schema.properties[fieldId] const ui       = schema.uiSchema[fieldId] || {} const visible  = evaluateConditions(property.conditions, property.showWhen, formValues) const disabled = ui['ui:disabled'] === true if (visible) renderField({ fieldId, property, ui, disabled }) } ```

**erase**(collectionId: string, contactId: string, body?: any) → `Promise<ContactResponse>`
Public: Get the contact schema for a collection. GET /public/collection/:collectionId/contact/schema Returns a ContactSchemaResponse describing all publicly visible contact fields. Core fields and collection-defined custom fields are merged into a single flat schema. Fields not in `publicVisibleFields` are stripped entirely from the response. Fields visible but not in `publicEditableFields` have `ui:disabled: true` in `uiSchema`. Use `fieldOrder` to render fields in the correct sequence, and `evaluateConditions` from the types package to handle conditional field visibility. ```typescript import { contact, evaluateConditions } from '@proveanything/smartlinks' const schema = await contact.publicGetSchema(collectionId) for (const fieldId of schema.fieldOrder) { const property = schema.schema.properties[fieldId] const ui       = schema.uiSchema[fieldId] || {} const visible  = evaluateConditions(property.conditions, property.showWhen, formValues) const disabled = ui['ui:disabled'] === true if (visible) renderField({ fieldId, property, ui, disabled }) } ```

**getUser**(collectionId: string,
    userId: string,) → `Promise<UserSearchResponse>`
Public: Get the contact schema for a collection. GET /public/collection/:collectionId/contact/schema Returns a ContactSchemaResponse describing all publicly visible contact fields. Core fields and collection-defined custom fields are merged into a single flat schema. Fields not in `publicVisibleFields` are stripped entirely from the response. Fields visible but not in `publicEditableFields` have `ui:disabled: true` in `uiSchema`. Use `fieldOrder` to render fields in the correct sequence, and `evaluateConditions` from the types package to handle conditional field visibility. ```typescript import { contact, evaluateConditions } from '@proveanything/smartlinks' const schema = await contact.publicGetSchema(collectionId) for (const fieldId of schema.fieldOrder) { const property = schema.schema.properties[fieldId] const ui       = schema.uiSchema[fieldId] || {} const visible  = evaluateConditions(property.conditions, property.showWhen, formValues) const disabled = ui['ui:disabled'] === true if (visible) renderField({ fieldId, property, ui, disabled }) } ```

### crate

**list**(collectionId: string,
    params?: ListCratesRequest) → `Promise<ListCratesResponse>`
List crates for a collection with pagination support. Returns crates in pages, with support for soft-deleted crates. ```typescript // Get first page const page1 = await crate.list('coll_123', { limit: 100 }) console.log(`Found ${page1.items.length} crates`) // Get next page if (page1.hasMore) { const page2 = await crate.list('coll_123', { limit: 100, startAfter: page1.lastId }) } // Include soft-deleted crates const withDeleted = await crate.list('coll_123', { includeDeleted: true }) ```

**get**(collectionId: string,
    crateId: string) → `Promise<GetCrateResponse>`
Get a single crate by ID for a collection (admin only). ```typescript const crate = await crate.get('coll_123', 'crate_abc123') console.log(`Crate has ${crate.items?.length ?? 0} items`) ```

**create**(collectionId: string,
    data: CreateCrateRequest) → `Promise<CreateCrateResponse>`
Create a new crate for a collection (admin only). ```typescript const newCrate = await crate.create('coll_123', { items: [ { id: 'tag_001', codeId: 'ABC123', productId: 'prod_1', productName: 'Product Name' } ] }) console.log(`Created crate ${newCrate.id}`) ```

**update**(collectionId: string,
    crateId: string,
    data: UpdateCrateRequest) → `Promise<UpdateCrateResponse>`
Update a crate for a collection (admin only). ```typescript const updated = await crate.update('coll_123', 'crate_abc123', { items: [ { id: 'tag_002', codeId: 'XYZ789', productId: 'prod_2' } ] }) ```

**remove**(collectionId: string,
    crateId: string) → `Promise<DeleteCrateResponse>`
Delete a crate for a collection (admin only). This performs a soft delete. ```typescript await crate.remove('coll_123', 'crate_abc123') ```

### form

**get**(collectionId: string, formId: string, admin?: boolean) → `Promise<any>`
Get a single form by ID for a collection.

**list**(collectionId: string, admin?: boolean) → `Promise<any[]>`
List all forms for a collection.

**create**(collectionId: string, data: any) → `Promise<any>`
Create a new form for a collection (admin only).

**update**(collectionId: string, formId: string, data: any) → `Promise<any>`
Update a form for a collection (admin only).

**remove**(collectionId: string, formId: string) → `Promise<void>`
Delete a form for a collection (admin only).

### interactions

**query**(collectionId: string,
    body: AdminInteractionsQueryRequest) → `Promise<InteractionEventRow[]>`
POST /admin/collection/:collectionId/interactions/query Flexible query for interaction events with optional includes.

**countsByOutcome**(collectionId: string,
    query: AdminInteractionsCountsByOutcomeRequest = {}) → `Promise<OutcomeCount[]>`
POST /admin/collection/:collectionId/interactions/counts-by-outcome Returns array of { outcome, count }.

**appendEvent**(collectionId: string,
    body: AppendInteractionBody) → `Promise<`
POST /admin/collection/:collectionId/interactions/append Appends one interaction event.

**updateEvent**(collectionId: string,
    body: UpdateInteractionBody) → `Promise<`
POST /admin/collection/:collectionId/interactions/append Appends one interaction event.

**submitPublicEvent**(collectionId: string,
    body: AppendInteractionBody) → `Promise<`
Appends one interaction event from a public source.

**create**(collectionId: string,
    body: CreateInteractionTypeBody) → `Promise<InteractionTypeRecord>`
Appends one interaction event from a public source.

**list**(collectionId: string,
    query: ListInteractionTypesQuery = {}) → `Promise<InteractionTypeList>`
Appends one interaction event from a public source.

**get**(collectionId: string,
    id: string) → `Promise<InteractionTypeRecord>`
Appends one interaction event from a public source.

**update**(collectionId: string,
    id: string,
    patchBody: UpdateInteractionTypeBody) → `Promise<InteractionTypeRecord>`
Appends one interaction event from a public source.

**remove**(collectionId: string,
    id: string) → `Promise<void>`
Appends one interaction event from a public source.

**publicCountsByOutcome**(collectionId: string,
    body: PublicInteractionsCountsByOutcomeRequest,
    authToken?: string) → `Promise<OutcomeCount[]>`
Appends one interaction event from a public source.

**publicMyInteractions**(collectionId: string,
    body: PublicInteractionsByUserRequest,
    authToken?: string) → `Promise<InteractionEventRow[]>`
Appends one interaction event from a public source.

**publicList**(collectionId: string,
    query: ListInteractionTypesQuery = {}) → `Promise<InteractionTypeList>`
Appends one interaction event from a public source.

**publicGet**(collectionId: string,
    id: string) → `Promise<InteractionTypeRecord>`
Appends one interaction event from a public source.

### jobs

**listJobs**(collectionId: string,
    query: ListJobsQuery = {}) → `Promise<JobsPage>`
List visible jobs for a collection GET /admin/collection/:collectionId/jobs

**getJob**(collectionId: string,
    jobId: number) → `Promise<Job>`
Get a single job GET /admin/collection/:collectionId/jobs/:jobId

### journeys

**create**(collectionId: string,
    body: CreateJourneyBody) → `Promise<JourneyRecord>`

**list**(collectionId: string,
    query: ListJourneysQuery = {}) → `Promise<JourneyList>`

**get**(collectionId: string,
    id: string) → `Promise<JourneyRecord>`

**update**(collectionId: string,
    id: string,
    body: UpdateJourneyBody) → `Promise<JourneyRecord>`

**remove**(collectionId: string,
    id: string) → `Promise<void>`

### journeysAnalytics

**stats**(collectionId: string,
    journeyId: string,
    body: JourneyStatsRequest = {}) → `Promise<JourneyStatsResponse>`
POST /admin/collection/:collectionId/journeys.analytics/:journeyId/stats Computes journey stats over a time window; outcome defaults to 'success'. If `finalStepId` is provided, includes `currentlyActive` and `completed` fields.

**recipients**(collectionId: string,
    journeyId: string,
    stepId: string,
    body: JourneyStepRecipientsRequest = {}) → `Promise<JourneyStepRecipientsResponse>`
POST /admin/collection/:collectionId/journeys.analytics/:journeyId/steps/:stepId/recipients Returns recipient IDs for a given journey step. For completed/pending, `interactionId` is required; outcome defaults to 'success'.

**funnelReport**(collectionId: string,
    journeyId: string,
    body: JourneyFunnelReportRequest) → `Promise<JourneyFunnelReportResponse>`
POST /admin/collection/:collectionId/journeys.analytics/:journeyId/funnel-report Computes conversion, counts, and avg time across mapped steps in a period.

### location

**createGlobal**(params: LocationPayload) → `Promise<Location>`
Platform: Create a global location (super admin; requires features.adminApps) POST /platform/location

**create**(collectionId: string, params: LocationPayload) → `Promise<Location>`
Admin: Create a collection-scoped location POST /admin/collection/:collectionId/location

**search**(collectionId: string,
    query: LocationSearchQuery = {}) → `Promise<LocationSearchResponse>`
Admin: Search locations to pick during setup (combines collection + global) GET /admin/collection/:collectionId/location/search

**getPublic**(locationId: string) → `Promise<Location>`
Public: Fetch a global location by ID GET /public/location/:locationId

**getPublicForCollection**(collectionId: string,
    locationId: string) → `Promise<Location>`
Public: Fetch a location for a collection; returns either a collection-owned or global fallback GET /public/collection/:collectionId/location/:locationId

### nfc

**claimTag**(data: NfcClaimTagRequest) → `Promise<NfcTagInfo>`
Claim an NFC tag (public). POST /public/nfc/claimTag

**validate**(data: NfcValidateRequest) → `Promise<NfcValidateResponse>`
Validate an NFC tag payload (public). POST /public/nfc/validate

**lookupTag**(tagId: string) → `Promise<NfcTagInfo[]>`
Lookup a tag by its ID (public). GET /public/nfc/findByTag/:tagId

### order

**create**(collectionId: string,
    data: CreateOrderRequest) → `Promise<CreateOrderResponse>`
Create a new order with items. ```typescript const order = await order.create('coll_123', { orderRef: 'ORD-12345', customerId: 'CUST-789', items: [ { itemType: 'tag', itemId: 'TAG001' }, { itemType: 'tag', itemId: 'TAG002' }, { itemType: 'serial', itemId: 'SN12345' } ], status: 'pending', metadata: { shipmentId: 'SHIP-789', destination: 'Warehouse B' } }) ```

**get**(collectionId: string,
    orderId: string,
    params?: GetOrderParams) → `Promise<GetOrderResponse>`
Get a single order by ID. ```typescript // Get order without items (faster) const order = await order.get('coll_123', 'order_abc123') console.log(`Order has ${order.itemCount} items`) // Get order with items const orderWithItems = await order.get('coll_123', 'order_abc123', { includeItems: true }) console.log(orderWithItems.items) // Items array available ```

**update**(collectionId: string,
    orderId: string,
    data: UpdateOrderRequest) → `Promise<UpdateOrderResponse>`
Update order status or metadata. Items are managed separately via addItems/removeItems. ```typescript const updated = await order.update('coll_123', 'order_abc123', { status: 'shipped', metadata: { trackingNumber: '1Z999AA10123456784', shippedAt: '2026-02-02T14:30:00Z' } }) ```

**remove**(collectionId: string,
    orderId: string) → `Promise<DeleteOrderResponse>`
Delete an order and all its items (cascade delete). ```typescript await order.remove('coll_123', 'order_abc123') ```

**list**(collectionId: string,
    params?: ListOrdersRequest) → `Promise<ListOrdersResponse>`
List orders for a collection with optional filters and pagination. Orders are returned in descending order by createdAt (newest first). ```typescript // List all orders (without items for better performance) const all = await order.list('coll_123') // List with filters const pending = await order.list('coll_123', { status: 'pending', limit: 50, offset: 0 }) // Filter by customer with items const customerOrders = await order.list('coll_123', { customerId: 'CUST-789', includeItems: true }) ```

**getItems**(collectionId: string,
    orderId: string,
    params?: GetOrderItemsParams) → `Promise<GetOrderItemsResponse>`
Get items from an order with pagination support. Use this for orders with many items instead of includeItems. ```typescript // Get first page of items const page1 = await order.getItems('coll_123', 'order_abc123', { limit: 100, offset: 0 }) // Get next page const page2 = await order.getItems('coll_123', 'order_abc123', { limit: 100, offset: 100 }) ```

**addItems**(collectionId: string,
    orderId: string,
    data: AddItemsRequest) → `Promise<AddItemsResponse>`
Add additional items to an existing order. ```typescript const updated = await order.addItems('coll_123', 'order_abc123', { items: [ { itemType: 'tag', itemId: 'TAG003' }, { itemType: 'proof', itemId: 'proof_xyz' } ] }) console.log(`Order now has ${updated.itemCount} items`) ```

**removeItems**(collectionId: string,
    orderId: string,
    data: RemoveItemsRequest) → `Promise<RemoveItemsResponse>`
Remove specific items from an order. ```typescript const updated = await order.removeItems('coll_123', 'order_abc123', { itemIds: ['item_001', 'item_002'] }) ```

**lookup**(collectionId: string,
    data: LookupOrdersRequest) → `Promise<LookupOrdersResponse>`
Find all orders containing specific items (tags, proofs, or serial numbers). Use case: Scan a tag and immediately see if it's part of any order. ```typescript // Scan a tag and find associated orders const result = await order.lookup('coll_123', { items: [ { itemType: 'tag', itemId: 'TAG001' } ] }) if (result.orders.length > 0) { console.log(`Tag is part of ${result.orders.length} order(s)`) result.orders.forEach(ord => { console.log(`Order ${ord.orderRef}: ${ord.status}`) }) } // Batch lookup multiple items const batchResult = await order.lookup('coll_123', { items: [ { itemType: 'tag', itemId: 'TAG001' }, { itemType: 'serial', itemId: 'SN12345' }, { itemType: 'proof', itemId: 'proof_xyz' } ] }) ```

**query**(collectionId: string,
    data: QueryOrdersRequest) → `Promise<QueryOrdersResponse>`
Advanced query for orders with date filtering, metadata search, and sorting. More powerful than the basic list() function. ```typescript // Find pending orders created in January 2026 const result = await order.query('coll_123', { query: { status: 'pending', createdAfter: '2026-01-01T00:00:00Z', createdBefore: '2026-02-01T00:00:00Z', sortBy: 'createdAt', sortOrder: 'desc' }, limit: 50 }) // Find orders with specific metadata and item count const highPriority = await order.query('coll_123', { query: { metadata: { priority: 'high' }, minItemCount: 10, maxItemCount: 100 }, includeItems: true }) ```

**reports**(collectionId: string,
    params?: ReportsParams) → `Promise<ReportsResponse>`
Get reports and aggregations for orders. Provides analytics grouped by status, customer, product, date, etc. ```typescript // Get order counts by status const statusReport = await order.reports('coll_123', { groupByStatus: true }) console.log(statusReport.ordersByStatus) // { pending: 45, shipped: 123, completed: 789 } // Get comprehensive analytics const fullReport = await order.reports('coll_123', { groupByStatus: true, groupByProduct: true, includeItemStats: true, createdAfter: '2026-01-01T00:00:00Z' }) console.log(fullReport.itemStats?.avgItemsPerOrder) // Get top 10 customers by order count const topCustomers = await order.reports('coll_123', { groupByCustomer: true, topN: 10 }) ```

**findByProduct**(collectionId: string,
    productId: string,
    params?: LookupByProductParams) → `Promise<LookupByProductResponse>`
Find all orders containing items with a specific product ID. Uses the automatic productSummary tracking in order metadata. ```typescript // Find all orders with a specific product const result = await order.findByProduct('coll_123', 'product_abc123', { limit: 50, includeItems: false }) result.orders.forEach(ord => { const count = ord.metadata.productSummary?.['product_abc123'] ?? 0 console.log(`Order ${ord.orderRef} has ${count} items of this product`) }) ```

**getAnalytics**(collectionId: string,
    orderId: string) → `Promise<OrderAnalyticsResponse>`
Get comprehensive scan analytics for all tags in an order. Returns scan counts, timestamps, locations, devices, and per-tag summaries. ```typescript const analytics = await order.getAnalytics('coll_123', 'order_abc123') if (analytics.analytics) { console.log(`Total scans: ${analytics.analytics.totalScans}`) console.log(`Admin scans: ${analytics.analytics.adminScans}`) console.log(`Created at: ${analytics.analytics.estimatedCreatedAt}`) console.log(`Unique locations: ${analytics.analytics.uniqueLocations}`) analytics.analytics.tagSummaries.forEach(tag => { console.log(`Tag ${tag.tagId}: ${tag.totalScans} scans`) }) } ```

**getTimeline**(collectionId: string,
    orderId: string,
    params?: TimelineRequest) → `Promise<TimelineResponse>`
Get chronological timeline of all scan events for an order's tags. Supports filtering by date range and admin/customer scans. ```typescript // Get all scan events const timeline = await order.getTimeline('coll_123', 'order_abc123') timeline.timeline.forEach(event => { console.log(`${event.timestamp}: ${event.eventType} by ${event.isAdmin ? 'admin' : 'customer'}`) }) // Get admin scans only from last week const adminScans = await order.getTimeline('coll_123', 'order_abc123', { isAdmin: true, from: '2026-02-01T00:00:00Z', limit: 500 }) ```

**getLocationHistory**(collectionId: string,
    orderId: string,
    params?: LocationRequest) → `Promise<LocationResponse>`
Get location-based scan history for an order's tags. Shows where the order's tags have been scanned. ```typescript const locations = await order.getLocationHistory('coll_123', 'order_abc123', { limit: 100 }) console.log(`Order scanned in ${locations.count} locations`) locations.locations.forEach(scan => { console.log(`${scan.location} at ${scan.timestamp}`) }) ```

**getBulkAnalytics**(collectionId: string,
    data: BulkAnalyticsRequest) → `Promise<BulkAnalyticsResponse>`
Get analytics summary for multiple orders at once. Efficient way to retrieve scan data for many orders. ```typescript const bulk = await order.getBulkAnalytics('coll_123', { orderIds: ['order_1', 'order_2', 'order_3'], from: '2026-01-01T00:00:00Z' }) bulk.results.forEach(result => { if (result.analytics) { console.log(`${result.orderRef}: ${result.analytics.totalScans} scans`) } }) ```

**getCollectionSummary**(collectionId: string,
    params?: SummaryRequest) → `Promise<CollectionSummaryResponse>`
Get collection-wide analytics summary across all orders. Returns daily scan counts and admin activity overview. ```typescript // Get all-time collection summary const summary = await order.getCollectionSummary('coll_123') console.log(`Admin activity count: ${summary.adminActivity.count}`) console.log('Scans by day:') summary.scansByDay.forEach(day => { console.log(`  ${day.date}: ${day.scanCount} scans`) }) // Get summary for last 30 days const recentSummary = await order.getCollectionSummary('coll_123', { from: '2026-01-08T00:00:00Z', to: '2026-02-08T00:00:00Z' }) ```

**findByBatch**(collectionId: string,
    batchId: string,
    params?: FindOrdersByAttributeParams) → `Promise<FindOrdersByAttributeResponse>`
Find all orders containing items from a specific batch. Uses indexed queries for fast lookups across order items. ```typescript // Find orders with items from a specific batch const { orders } = await order.findByBatch('coll_123', 'BATCH-2024-001', { includeItems: true, limit: 50 }) // Get unique customers who received this batch const customers = [...new Set(orders.map(o => o.customerId).filter(Boolean))] console.log(`Batch delivered to ${customers.length} customers`) ```

**findOrdersByProduct**(collectionId: string,
    productId: string,
    params?: FindOrdersByAttributeParams) → `Promise<FindOrdersByAttributeResponse>`
Find all orders containing items from a specific product. Uses indexed queries for fast lookups across order items. ```typescript // Find all orders containing a product const { orders, limit, offset } = await order.findOrdersByProduct('coll_123', 'prod_789', { limit: 100 }) console.log(`Product appears in ${orders.length} orders`) ```

**findByVariant**(collectionId: string,
    variantId: string,
    params?: FindOrdersByAttributeParams) → `Promise<FindOrdersByAttributeResponse>`
Find all orders containing items from a specific variant. Uses indexed queries for fast lookups across order items. ```typescript // Find orders with a specific variant const { orders } = await order.findByVariant('coll_123', 'var_456', { includeItems: true }) console.log(`Variant ${variantId} in ${orders.length} orders`) ```

**findItemsByBatch**(collectionId: string,
    batchId: string,
    params?: FindItemsByAttributeParams) → `Promise<FindItemsByAttributeResponse>`
Get individual order items (not full orders) for a specific batch. Returns all matching items with optional order summary. ```typescript // Get items from a batch with order info const { items, count } = await order.findItemsByBatch('coll_123', 'BATCH-2024-001', { includeOrder: true, limit: 100 }) // Group by order status const byStatus = items.reduce((acc, item) => { const status = item.order?.status || 'unknown' acc[status] = (acc[status] || 0) + 1 return acc }, {}) ```

**findItemsByProduct**(collectionId: string,
    productId: string,
    params?: FindItemsByAttributeParams) → `Promise<FindItemsByAttributeResponse>`
Get individual order items for a specific product. Returns all matching items with optional order summary. ```typescript // Get all items for a product const { items } = await order.findItemsByProduct('coll_123', 'prod_789', { includeOrder: true }) console.log(`Product delivered in ${items.length} order items`) ```

**findItemsByVariant**(collectionId: string,
    variantId: string,
    params?: FindItemsByAttributeParams) → `Promise<FindItemsByAttributeResponse>`
Get individual order items for a specific variant. Returns all matching items with optional order summary. ```typescript // Get variant items with order details const { items, count } = await order.findItemsByVariant('coll_123', 'var_456', { includeOrder: true, limit: 50 }) ```

**getOrderIdsByAttribute**(collectionId: string,
    attribute: 'batchId' | 'productId' | 'variantId',
    value: string,
    params?: GetOrderIdsParams) → `Promise<GetOrderIdsResponse>`
Get unique order IDs containing items matching the specified attribute. Lightweight query that only returns order IDs, not full order objects. ```typescript // Get order IDs for a batch (fast count) const { orderIds, count } = await order.getOrderIdsByAttribute( 'coll_123', 'batchId', 'BATCH-2024-001' ) console.log(`Batch appears in ${count} orders`) // Get order IDs for a product const productOrders = await order.getOrderIdsByAttribute( 'coll_123', 'productId', 'prod_789', { limit: 500 } ) ```

### product

**get**(collectionId: string,
    productId: string,
    admin?: boolean) → `Promise<ProductResponse>`
Retrieves a single Product Item by Collection ID and Product ID.

**list**(collectionId: string,
    admin?: boolean) → `Promise<ProductResponse[]>`
List all Product Items for a Collection.

**create**(collectionId: string,
    data: ProductCreateRequest) → `Promise<ProductResponse>`
Create a new product for a collection (admin only). The `data` payload follows the same shape as ProductResponse minus `id` and `collectionId`. **Hero Image Auto-Fetch:** You can pass `heroImage` as either: - A full asset object: `{ url: '...', thumbnails: {...} }` - A string URL: The system automatically fetches and stores the image ```typescript // Using a URL - auto-fetched and stored const product = await product.create(collectionId, { name: 'Wine Bottle', description: 'Premium red wine', heroImage: 'https://example.com/wine.jpg', // Auto-fetched! tags: {}, data: {} }); ```

**update**(collectionId: string,
    productId: string,
    data: ProductUpdateRequest) → `Promise<ProductResponse>`
Update a product for a collection (admin only). The `data` payload is a partial of ProductResponse minus `id` and `collectionId`. **Hero Image Auto-Fetch:** You can pass `heroImage` as either: - A full asset object: `{ url: '...', thumbnails: {...} }` - A string URL: The system automatically fetches and stores the image ```typescript // Update with new URL - auto-fetched and stored const product = await product.update(collectionId, productId, { heroImage: 'https://example.com/new-wine.jpg' // Auto-fetched! }); ```

**remove**(collectionId: string,
    productId: string) → `Promise<void>`
Delete a product for a collection (admin only).

**getSN**(collectionId: string,
    productId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a product (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a product (admin only).

### proof

**get**(collectionId: string,
    productId: string,
    proofId: string,
    admin?: boolean,
    include?: string[]) → `Promise<ProofResponse>`
Retrieves a single Proof by Collection ID, Product ID, and Proof ID. Both public and admin endpoints now include productId in the path.

**list**(collectionId: string,
    include?: string[]) → `Promise<ProofResponse[]>`
List all Proofs for a Collection.

**create**(collectionId: string,
    productId: string,
    values: ProofCreateRequest) → `Promise<ProofResponse>`
Create a proof for a product (admin only). POST /admin/collection/:collectionId/product/:productId/proof

**update**(collectionId: string,
    productId: string,
    proofId: string,
    values: ProofUpdateRequest) → `Promise<ProofResponse>`
Update a proof for a product (admin only). PUT /admin/collection/:collectionId/product/:productId/proof/:proofId

**claim**(collectionId: string,
    productId: string,
    proofId: string,
    values: ProofClaimRequest) → `Promise<ProofResponse>`
Claim a proof for a product using a proof ID (serial number, NFC tag, etc.). PUT /public/collection/:collectionId/product/:productId/proof/:proofId/claim

**claimProduct**(collectionId: string,
    productId: string,
    values?: ProofClaimRequest) → `Promise<ProofResponse>`
Claim a product without providing a proof ID. System auto-generates a unique serial number on-demand. Requires allowAutoGenerateClaims to be enabled on the collection or product. PUT /public/collection/:collectionId/product/:productId/proof/claim ```typescript const proof = await proof.claimProduct( 'beauty-brand', 'moisturizer-pro', { purchaseDate: '2026-02-17', store: 'Target' } ); console.log('Auto-generated ID:', proof.id); ```

**remove**(collectionId: string,
    productId: string,
    proofId: string) → `Promise<void>`
Delete a proof for a product (admin only). DELETE /admin/collection/:collectionId/product/:productId/proof/:proofId

**getByUser**(collectionId: string,
    userId: string) → `Promise<ProofResponse[]>`
Get proofs for a user in a collection (admin only). GET /admin/collection/:collectionId/proof/findByUser/:userId

**getByProduct**(collectionId: string,
    productId: string) → `Promise<ProofResponse[]>`
Get proofs for a product (admin only). GET /admin/collection/:collectionId/product/:productId/proof

**findByProduct**(collectionId: string,
    productId: string,
    query: any) → `Promise<ProofResponse[]>`
Find proofs for a product (admin only). POST /admin/collection/:collectionId/product/:productId/proof/find

**getByBatch**(collectionId: string,
    productId: string,
    batchId: string) → `Promise<ProofResponse[]>`
Get proofs for a batch (admin only). GET /admin/collection/:collectionId/product/:productId/batch/:batchId/proof

### qr

**lookupShortCode**(shortId: string, code: string) → `Promise<QrShortCodeLookupResponse>`
Resolve a short code to related resource identifiers.

### realtime

**getPublicToken**(params: RealtimeTokenRequest) → `Promise<AblyTokenRequest>`
Get an Ably token for public (user-scoped) real-time communication. This endpoint returns an Ably TokenRequest that can be used to initialize an Ably client with appropriate permissions for the specified collection and optional app. Requires user authentication (Bearer token). ```ts const tokenRequest = await realtime.getPublicToken({ collectionId: 'my-collection-id', appId: 'my-app-id' }) // Use with Ably const ably = new Ably.Realtime.Promise({ authCallback: async (data, callback) => { callback(null, tokenRequest) } }) // Subscribe to channels matching the pattern const channel = ably.channels.get('collection:my-collection-id:app:my-app-id:chat:general') await channel.subscribe('message', (msg) => console.log(msg.data)) ```

**getAdminToken**() → `Promise<AblyTokenRequest>`
Get an Ably token for admin real-time communication. This endpoint returns an Ably TokenRequest that can be used to initialize an Ably client with admin permissions to receive system notifications and alerts. Admin users get subscribe-only (read-only) access to the interaction:{userId} channel pattern. Requires admin authentication (Bearer token). ```ts const tokenRequest = await realtime.getAdminToken() // Use with Ably const ably = new Ably.Realtime.Promise({ authCallback: async (data, callback) => { callback(null, tokenRequest) } }) // Subscribe to admin interaction channel const userId = 'my-user-id' const channel = ably.channels.get(`interaction:${userId}`) await channel.subscribe((message) => { console.log('Admin notification:', message.data) }) ```

### records

**create**(collectionId: string,
    appId: string,
    input: CreateRecordInput,
    admin: boolean = false) → `Promise<AppRecord>`
Create a new record POST /records

**list**(collectionId: string,
    appId: string,
    params?: RecordListQueryParams,
    admin: boolean = false) → `Promise<PaginatedResponse<AppRecord>>`
List records with optional query parameters GET /records

**get**(collectionId: string,
    appId: string,
    recordId: string,
    admin: boolean = false) → `Promise<AppRecord>`
Get a single record by ID GET /records/:recordId

**update**(collectionId: string,
    appId: string,
    recordId: string,
    input: UpdateRecordInput,
    admin: boolean = false) → `Promise<AppRecord>`
Update a record PATCH /records/:recordId Admin can update any field, public (owner) can only update data and owner

**remove**(collectionId: string,
    appId: string,
    recordId: string,
    admin: boolean = false) → `Promise<`
Soft delete a record DELETE /records/:recordId

**aggregate**(collectionId: string,
    appId: string,
    request: AggregateRequest,
    admin: boolean = false) → `Promise<AggregateResponse>`
Get aggregate statistics for records POST /records/aggregate

### segments

**create**(collectionId: string,
    body: Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>) → `Promise<SegmentRecord>`

**list**(collectionId: string,
    query: ListSegmentsQuery = {}) → `Promise<SegmentList>`

**get**(collectionId: string,
    id: string) → `Promise<SegmentRecord>`

**update**(collectionId: string,
    id: string,
    body: Partial<Omit<SegmentRecord, 'id' | 'collectionId' | 'createdAt'>>) → `Promise<SegmentRecord>`

**remove**(collectionId: string,
    id: string) → `Promise<void>`

**calculate**(collectionId: string,
    id: string) → `Promise<SegmentCalculateResult>`

**recipients**(collectionId: string,
    id: string,
    query: { limit?: number; offset?: number } = {}) → `Promise<SegmentRecipientsResponse>`

### tags

**create**(collectionId: string,
    data: CreateTagRequest) → `Promise<CreateTagResponse>`
Create a single tag mapping. If proofId is not provided, automatically generates a serial number. ```typescript // Auto-generate serial number const tag = await tags.create('coll_123', { tagId: 'TAG001', productId: 'prod_456', variantId: 'var_789' }) // Use explicit proof ID const tag2 = await tags.create('coll_123', { tagId: 'TAG002', productId: 'prod_456', proofId: 'proof_explicit_123' }) ```

**createBatch**(collectionId: string,
    data: CreateTagsBatchRequest) → `Promise<CreateTagsBatchResponse>`
Create multiple tag mappings efficiently in a batch operation. By default, auto-generates serial numbers for all tags without explicit proofId. Tags are grouped by product/variant/batch and serial numbers are generated in a single transaction per group for optimal performance. ```typescript const result = await tags.createBatch('coll_123', { tags: [ { tagId: 'TAG001', productId: 'prod_456', variantId: 'var_789' }, { tagId: 'TAG002', productId: 'prod_456', variantId: 'var_789' }, { tagId: 'TAG003', productId: 'prod_456', batchId: 'batch_100' } ] }) console.log(`Created: ${result.summary.created}, Failed: ${result.summary.failed}`) ```

**update**(collectionId: string,
    tagId: string,
    data: UpdateTagRequest) → `Promise<UpdateTagResponse>`
Update an existing tag mapping. ```typescript const updated = await tags.update('coll_123', 'TAG001', { variantId: 'var_999', metadata: { notes: 'Updated variant' } }) ```

**remove**(collectionId: string,
    tagId: string) → `Promise<DeleteTagResponse>`
Delete a tag mapping. ```typescript await tags.remove('coll_123', 'TAG001') ```

**get**(collectionId: string,
    tagId: string) → `Promise<GetTagResponse>`
Get a single tag mapping by tagId. ```typescript const tag = await tags.get('coll_123', 'TAG001') ```

**list**(collectionId: string,
    params?: ListTagsRequest) → `Promise<ListTagsResponse>`
List all tags for a collection with optional filters and pagination. ```typescript // List all tags const all = await tags.list('coll_123') // List with filters const filtered = await tags.list('coll_123', { productId: 'prod_456', variantId: 'var_789', limit: 50, offset: 0 }) ```

**getTag**(tagId: string,
    params?: PublicGetTagRequest) → `Promise<PublicGetTagResponse>`
Public lookup of a single tag by tagId (global). Optionally embed related collection, product, or proof data. No authentication required. ```typescript // Simple lookup const result = await tags.getTag('TAG001') // With embedded data const withData = await tags.getTag('TAG001', { embed: 'collection,product,proof' }) console.log(withData.tag, withData.collection, withData.product, withData.proof) ```

**publicGet**(_collectionId: string,
    tagId: string,
    params?: PublicGetTagRequest) → `Promise<PublicGetTagResponse>`
Backward-compat: Public lookup with collectionId parameter (ignored). Calls global route under /public/tags/:tagId.

**lookupTags**(data: PublicBatchLookupRequest) → `Promise<PublicBatchLookupResponse>`
Public batch lookup of multiple tags in a single request (POST). Only returns tags from the specified collection. Optionally embed related data. Related data is deduplicated and batch-fetched. No authentication required. ```typescript const result = await tags.publicBatchLookup('coll_123', { tagIds: ['TAG001', 'TAG002', 'TAG003'], embed: 'collection,product' }) // Access tags and deduplicated collections/products console.log(result.tags['TAG001']) console.log(result.collections) console.log(result.products) ```

**publicBatchLookup**(_collectionId: string,
    data: PublicBatchLookupRequest) → `Promise<PublicBatchLookupResponse>`
Backward-compat: Public batch lookup with collectionId parameter (ignored). Calls global route under /public/tags/lookup.

**lookupTagsQuery**(params: PublicBatchLookupQueryRequest) → `Promise<PublicBatchLookupQueryResponse>`
Public batch lookup of multiple tags using query parameters (GET). Only returns tags from the specified collection. Alternative to publicBatchLookup for simple GET requests. No authentication required. ```typescript const result = await tags.publicBatchLookupQuery('coll_123', { tagIds: 'TAG001,TAG002,TAG003', embed: 'collection' }) ```

**publicBatchLookupQuery**(_collectionId: string,
    params: PublicBatchLookupQueryRequest) → `Promise<PublicBatchLookupQueryResponse>`
Backward-compat: Public batch lookup (GET) with collectionId parameter (ignored). Calls global route under /public/tags/lookup.

### template

**getAll**(collectionId: string) → `Promise<Template[]>`

**get**(collectionId: string, templateId: string) → `Promise<Template>`

**create**(collectionId: string, data: TemplateInput) → `Promise<Template>`

**update**(collectionId: string,
    templateId: string,
    data: TemplateUpdate) → `Promise<Template>`

**del**(collectionId: string, templateId: string) → `Promise<Template>`

**uploadAsset**(collectionId: string,
    templateId: string,
    file: File | Blob) → `Promise<`

**getAllowed**(collectionId: string) → `Promise<TemplatePublic[]>`

**getPublic**(collectionId: string, templateId: string) → `Promise<TemplatePublic>`

**getGlobal**(templateId: string) → `Promise<TemplatePublic>`

**getAllowedGlobal**(collectionId: string) → `Promise<TemplatePublic[]>`

**render**(collectionId: string,
    templateId: string,
    body: TemplateRenderRequest) → `Promise<TemplateRenderResponse>`

**renderSource**(collectionId: string,
    body: TemplateRenderSourceRequest) → `Promise<TemplateRenderSourceResponse>`

### threads

**create**(collectionId: string,
    appId: string,
    input: CreateThreadInput,
    admin: boolean = false) → `Promise<AppThread>`
Create a new thread POST /threads

**list**(collectionId: string,
    appId: string,
    params?: ThreadListQueryParams,
    admin: boolean = false) → `Promise<PaginatedResponse<AppThread>>`
List threads with optional query parameters GET /threads

**get**(collectionId: string,
    appId: string,
    threadId: string,
    admin: boolean = false) → `Promise<AppThread>`
Get a single thread by ID GET /threads/:threadId

**update**(collectionId: string,
    appId: string,
    threadId: string,
    input: UpdateThreadInput,
    admin: boolean = false) → `Promise<AppThread>`
Update a thread PATCH /threads/:threadId Admin can update any field, public (owner) can only update body, tags, data, owner

**remove**(collectionId: string,
    appId: string,
    threadId: string,
    admin: boolean = false) → `Promise<`
Soft delete a thread DELETE /threads/:threadId

**reply**(collectionId: string,
    appId: string,
    threadId: string,
    input: ReplyInput,
    admin: boolean = false) → `Promise<AppThread>`
Add a reply to a thread POST /threads/:threadId/reply Atomically appends to replies array, increments replyCount, updates lastReplyAt

**aggregate**(collectionId: string,
    appId: string,
    request: AggregateRequest,
    admin: boolean = false) → `Promise<AggregateResponse>`
Get aggregate statistics for threads POST /threads/aggregate

### userAppData

**getConfig**(appId: string) → `Promise<any>`
Get user's config blob for an app. This is a single JSON object stored per user+app. ```typescript const config = await userAppData.getConfig('allergy-tracker'); // Returns: { allergies: ['peanuts'], notifications: true } ```

**setConfig**(appId: string, config: any) → `Promise<any>`
Set user's config blob for an app. ```typescript await userAppData.setConfig('allergy-tracker', { allergies: ['peanuts', 'shellfish'], notifications: true }); ```

**deleteConfig**(appId: string) → `Promise<void>`
Delete user's config blob for an app. ```typescript await userAppData.deleteConfig('allergy-tracker'); ```

**list**(appId: string) → `Promise<any[]>`
List all user's data items for an app. Returns an array of objects, each with an `id` field. ```typescript const beds = await userAppData.list('garden-planner'); // Returns: [{ id: 'bed-1', name: 'Vegetables', ... }, { id: 'bed-2', ... }] ```

**get**(appId: string, itemId: string) → `Promise<any>`
Get a specific user data item by ID. ```typescript const bed = await userAppData.get('garden-planner', 'bed-1'); // Returns: { id: 'bed-1', name: 'Vegetable Bed', plants: [...] } ```

**set**(appId: string, item: any) → `Promise<any>`
Create or update a user data item. The item object must include an `id` field. ```typescript await userAppData.set('garden-planner', { id: 'bed-1', name: 'Vegetable Bed', plants: ['tomatoes', 'peppers'], location: { x: 10, y: 20 } }); ```

**remove**(appId: string, itemId: string) → `Promise<void>`
Delete a user data item by ID. ```typescript await userAppData.remove('garden-planner', 'bed-1'); ```

### variant

**get**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<VariantResponse>`
Get a single variant by ID for a collection and product (admin only).

**list**(collectionId: string,
    productId: string) → `Promise<VariantResponse[]>`
List all variants for a collection and product (admin only).

**create**(collectionId: string,
    productId: string,
    data: VariantCreateRequest) → `Promise<VariantResponse>`
Create a new variant for a collection and product (admin only).

**update**(collectionId: string,
    productId: string,
    variantId: string,
    data: VariantUpdateRequest) → `Promise<VariantResponse>`
Update a variant for a collection and product (admin only).

**remove**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<void>`
Delete a variant for a collection and product (admin only).

**getPublic**(collectionId: string,
    productId: string,
    variantId: string) → `Promise<VariantResponse>`
Get a single variant by ID for a collection and product (public endpoint).

**getSN**(collectionId: string,
    productId: string,
    variantId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<any>`
Get serial numbers for a variant (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    variantId: string,
    codeId: string) → `Promise<any>`
Look up a serial number by code for a variant (admin only).

