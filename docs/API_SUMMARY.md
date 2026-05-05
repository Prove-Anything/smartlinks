# Smartlinks API Summary

Version: 1.11.13  |  Generated: 2026-05-05T09:55:20.018Z

This is a concise summary of all available API functions and types.

## Documentation

For detailed guides on specific features:

- **[SmartLinks Microapp Overview](overview.md)** - Platform architecture, data model, auth patterns, storage, anti-patterns, and quick-reference for all SDK docs
- **[AI & Chat Completions](ai.md)** - Chat completions, RAG (document-grounded Q&A), voice integration, streaming, tool calling, podcast generation
- **[Translations](translations.md)** - Runtime translation lookup, browser-side IndexedDB caching, and admin translation management
- **[Widgets](widgets.md)** - Embeddable React components for parent applications
- **[Containers](containers.md)** - Building full-app embeddable containers (lazy-loaded) 
- **[Scanner Containers](scanner-container.md)** - Building scanner microapps for the SmartLinks Scanner Android host (RFID, NFC, QR, key events)
- **[Multi-Page App Architecture](mpa.md)** - Vite MPA build pipeline: public/admin entry points, widget/container/executor bundles, content-hashed CDN assets
- **[App Configuration Files](app-manifest.md)** - `app.manifest.json` and `app.admin.json` reference — bundles, components, setup questions, import schemas, tunable fields, and metrics
- **[Executor Model](executor.md)** - Programmatic JS bundles for AI-driven setup, server-side SEO metadata generation, and LLM content for AI crawlers
- **[Realtime](realtime.md)** - Real-time data updates and WebSocket connections
- **[iframe Responder](iframe-responder.md)** - iframe integration and cross-origin communication
- **[Utilities](utils.md)** - Helper functions for building portal paths, URLs, and common tasks
- **[i18n](i18n.md)** - Internationalization and localization
- **[Liquid Templates](liquid-templates.md)** - Dynamic templating for content generation
- **[Theme System](theme.system.md)** - Theme configuration and customization
- **[Theme Defaults](theme-defaults.md)** - Default theme values and presets
- **[Proof Claiming Methods](proof-claiming-methods.md)** - All methods for claiming/registering product ownership (NFC tags, serial numbers, auto-generated claims)
- **[App Data Storage](app-data-storage.md)** - User-specific and collection-scoped app data storage
- **[App Objects: Cases, Threads & Records](app-objects.md)** - Generic app-scoped building blocks for support cases, discussions, bookings, registrations, and more
- **[Communications](comms.md)** - Transactional sends, multi-channel broadcasts, consent management, push registration, and analytics
- **[Interactions & Event Tracking](interactions.md)** - Log user events, count outcomes, query history, and define interaction types with permissions
- **[Loyalty: Points, Members & Earning Rules](loyalty.md)** - Loyalty schemes, automatic point earning via interaction rules, member balances, transaction history, and manual adjustments
- **[Deep Link Discovery](deep-link-discovery.md)** - Registering and discovering navigable app states for portal menus and AI orchestration
- **[AI-Native App Manifests](manifests.md)** - How AI workflows discover, configure, and import apps via structured manifests and prose guides
- **[AI Guide Template](ai-guide-template.md)** - A sample for an app on how to build an AI setup guide

## Choosing App Storage

When you need flexible app-specific data, choose the storage model based on shape and lifecycle, not just on what can hold JSON.

- **`appConfiguration.getConfig` / `setConfig`** - One config blob per scope. Best for settings, feature flags, and app setup.
- **`appConfiguration.getData` / `getDataItem` / `setDataItem`** - Small keyed documents attached to a scope. Best for lookup tables, content fragments, menus, FAQs, or a handful of standalone items where you already know the ID.
- **`app.records`** - Default choice for richer app-owned entities that need status, visibility, ownership zones, querying, filtering, parent-child links, or lifecycle fields.
- **`app.cases`** - Use when the entity is a workflow item that moves toward resolution and may need assignment, priority, and history.
- **`app.threads`** - Use for conversations, comments, Q&A, or any object centered on replies.

Rule of thumb: if you are modelling a real domain object that users will browse, filter, secure, or evolve over time, start with app objects. If you just need a simple keyed payload hanging off a collection or product, scoped data items are still a good fit.

## Settings Visibility

For `appConfiguration` config blobs and `collection` settings groups, keep endpoint choice separate from visibility semantics.

- **`admin: true` means "use the admin endpoint"** for reads or writes.
- **It does not make every root field private.** Writing through an admin endpoint still saves the normal shared payload.
- **Root-level fields are the public/shared settings view.** Put public labels, colors, toggles, and general config there.
- **Use a top-level `admin` object for confidential values.** Public reads omit that block; admin reads include it.
- **Applies to both** `appConfiguration.getConfig` / `setConfig` **and** `collection.getSettings` / `updateSettings`.

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
- **appConfiguration** - Read/write app configuration and scoped data (collection/product/proof); hosts the deep-link registry. → [Guide](deep-link-discovery.md)
- **app** - Flexible app-scoped objects: use records for structured entities, cases for workflows, and threads for discussions. → [Guide](app-objects.md)

— Identity & Access —
- **auth** - Admin authentication and account ops: login/logout, tokens, account info.
- **authKit** - End‑user auth flows (email/password, OAuth, phone); profiles and verification.
- **contact** - Manage customer contacts; CRUD, lookup, upsert, erase.

— Messaging & Audience —
- **comms** - Send notifications (push, email, wallet); templating, severity, delivery status. → [Guide](comms.md)
- **broadcasts** - Define broadcast campaigns; append recipients/events; analytics and CRUD.
- **segments** - Define dynamic/static audience segments; estimate and list recipients; schedule calculations.

— Analytics & Events —
- **interactions** - Log and analyze interactions/outcomes; aggregates and actor lists; interaction definition CRUD. → [Guide](interactions.md)
- **loyalty** - Loyalty programmes: schemes, earning rules tied to interactions, member balances, transaction ledger, and manual adjustments. → [Guide](loyalty.md)

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
- **analytics** - Functions for analytics operations
- **async** - Functions for async operations
- **attestation** - Functions for attestation operations
- **attestations** - Functions for attestations operations
- **config** - Functions for config operations
- **containers** - Functions for containers operations
- **facets** - Functions for facets operations
- **http** - Functions for http operations
- **jobs** - Functions for jobs operations
- **journeysAnalytics** - Functions for journeysAnalytics operations
- **location** - Functions for location operations
- **navigation** - Functions for navigation operations
- **order** - Functions for order operations
- **products** - Functions for products operations
- **realtime** - Functions for realtime operations
- **tags** - Functions for tags operations
- **template** - Functions for template operations
- **translations** - Functions for translations operations

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
Manually invalidate entries in the SDK's GET cache. *contains* this string is removed. Omit (or pass `undefined`) to wipe the entire cache. ```ts invalidateCache()                     // clear everything invalidateCache('/collection/abc123') // one specific collection invalidateCache('/product/')          // all legacy singular product responses invalidateCache('/products/')         // all canonical plural product responses ```

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

**requestStream**(path: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: any
    headers?: Record<string, string>
  }) → `Promise<AsyncIterable<T>>`
Internal helper that performs a streaming request using the shared auth and proxy transport. The response is expected to be `text/event-stream` with JSON payloads in `data:` frames.

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

**ResponseTool** (interface)
```typescript
interface ResponseTool {
  type: string
  name?: string
  description?: string
  parameters?: Record<string, any>
  [key: string]: any
}
```

**ResponseInputItem** (interface)
```typescript
interface ResponseInputItem {
  role?: 'system' | 'user' | 'assistant' | 'function' | 'tool'
  type?: string
  content?: string | ContentPart[]
  name?: string
  function_call?: FunctionCall
  tool_calls?: ToolCall[]
  tool_call_id?: string
  [key: string]: any
}
```

**ResponsesRequest** (interface)
```typescript
interface ResponsesRequest {
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
```

**ResponsesResult** (interface)
```typescript
interface ResponsesResult {
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
```

**ResponsesStreamEvent** (interface)
```typescript
interface ResponsesStreamEvent {
  type: string
  [key: string]: any
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

**AIModelListParams** (interface)
```typescript
interface AIModelListParams {
  provider?: 'gemini' | 'openai'
  capability?: 'text' | 'vision' | 'audio' | 'code'
}
```

**AIModelListResponse** (interface)
```typescript
interface AIModelListResponse {
  object: 'list'
  data: AIModel[]
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

### analytics

**AnalyticsLocation** (interface)
```typescript
interface AnalyticsLocation {
  country?: string
  latitude?: number
  longitude?: number
  area?: number
  [key: string]: any
}
```

**AnalyticsStandardEventFields** (interface)
```typescript
interface AnalyticsStandardEventFields {
  visitorId?: string
  referrer?: string
  referrerHost?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  entryType?: string
  group?: string
  tag?: string
  campaign?: string
  placement?: string
  linkGroup?: string
  linkPlacement?: string
  linkPosition?: string | number
  linkTitle?: string
  destinationDomain?: string
  pagePath?: string
  pageId?: string
  qrCodeId?: string
  scanMethod?: string
}
```

**AnalyticsTrackOptions** (interface)
```typescript
interface AnalyticsTrackOptions {
  preferBeacon?: boolean
}
```

**AnalyticsBrowserConfig** (interface)
```typescript
interface AnalyticsBrowserConfig {
  sessionStorageKey?: string
  sessionIdFactory?: () => AnalyticsSessionId
  visitorId?: string
  visitorStorage?: AnalyticsStorageMode
  visitorStorageKey?: string
  visitorIdFactory?: () => string
  autoCaptureCampaignParams?: boolean
  campaignParamMap?: Partial<Record<keyof AnalyticsStandardEventFields, string | string[]>>
  defaultCollectionEvent?: Partial<CollectionAnalyticsEvent>
  defaultTagEvent?: Partial<TagAnalyticsEvent>
  getCollectionDefaults?: () => Partial<CollectionAnalyticsEvent> | undefined
  getTagDefaults?: () => Partial<TagAnalyticsEvent> | undefined
  getLocation?: () => AnalyticsLocation | null | undefined
}
```

**AnalyticsVisitorIdOptions** (interface)
```typescript
interface AnalyticsVisitorIdOptions {
  persist?: boolean
  storage?: AnalyticsStorageMode
  storageKey?: string
}
```

**AnalyticsPageViewBindingOptions** (interface)
```typescript
interface AnalyticsPageViewBindingOptions {
  trackInitialPageView?: boolean
  includeHashChanges?: boolean
  event?: Partial<CollectionAnalyticsEvent>
  trackOptions?: AnalyticsTrackOptions
  getEvent?: (path: string) => Partial<CollectionAnalyticsEvent> | null | undefined
}
```

**AnalyticsLinkBindingOptions** (interface)
```typescript
interface AnalyticsLinkBindingOptions {
  root?: Document | HTMLElement
  selector?: string
  trackInternal?: boolean
  event?: Partial<CollectionAnalyticsEvent>
  trackOptions?: AnalyticsTrackOptions
  getEvent?: (anchor: HTMLAnchorElement, event: MouseEvent) => Partial<CollectionAnalyticsEvent> | null | undefined
}
```

**AnalyticsTrackResult** (interface)
```typescript
interface AnalyticsTrackResult {
  queued: boolean
  transport: 'beacon' | 'fetch' | 'unavailable'
}
```

**AnalyticsFilterRequest** (interface)
```typescript
interface AnalyticsFilterRequest {
  source?: AnalyticsSource
  from?: string
  to?: string
  eventType?: string
  eventTypes?: string[]
  productId?: string
  productIds?: string[]
  proofId?: string
  proofIds?: string[]
  batchId?: string
  batchIds?: string[]
  variantId?: string
  variantIds?: string[]
  sessionId?: AnalyticsSessionId
  sessionIds?: AnalyticsSessionId[]
  country?: string
  countries?: string[]
  metadata?: Record<string, any>
  appId?: string
  appIds?: string[]
  destinationAppId?: string
  destinationAppIds?: string[]
  linkId?: string
  linkIds?: string[]
  href?: string
  path?: string
  hrefContains?: string
  pathContains?: string
  isExternal?: boolean
  codeId?: string
  codeIds?: string[]
  claimId?: string
  claimIds?: string[]
  isAdmin?: boolean
  hasLocation?: boolean
}
```

**AnalyticsSummaryData** (interface)
```typescript
interface AnalyticsSummaryData {
  totalEvents?: number
  uniqueSessions?: number
  uniqueVisitors?: number
  uniqueCountries?: number
  uniqueLinks?: number
  externalEvents?: number
  internalEvents?: number
  firstEventAt?: string | null
  lastEventAt?: string | null
  uniqueCodes?: number
  uniqueClaims?: number
  adminEvents?: number
  customerEvents?: number
  locationEvents?: number
  [key: string]: any
}
```

**AnalyticsSummaryResponse** (interface)
```typescript
interface AnalyticsSummaryResponse {
  source: AnalyticsSource
  summary: AnalyticsSummaryData
}
```

**AnalyticsTimeseriesRow** (interface)
```typescript
interface AnalyticsTimeseriesRow {
  period: string
  count: number
  uniqueSessions?: number
  uniqueVisitors?: number
  value: number
  [key: string]: any
}
```

**AnalyticsTimeseriesResponse** (interface)
```typescript
interface AnalyticsTimeseriesResponse {
  source: AnalyticsSource
  granularity: AnalyticsGranularity
  metric: AnalyticsMetric
  rows: AnalyticsTimeseriesRow[]
}
```

**AnalyticsBreakdownRow** (interface)
```typescript
interface AnalyticsBreakdownRow {
  dimensionValue: string | number | boolean | null
  count: number
  uniqueSessions?: number
  uniqueVisitors?: number
  value: number
  [key: string]: any
}
```

**AnalyticsBreakdownResponse** (interface)
```typescript
interface AnalyticsBreakdownResponse {
  source: AnalyticsSource
  dimension: string
  metric: AnalyticsMetric
  rows: AnalyticsBreakdownRow[]
}
```

**AnalyticsEventsResponse** (interface)
```typescript
interface AnalyticsEventsResponse {
  source: AnalyticsSource
  limit: number
  offset: number
  sort: 'ASC' | 'DESC'
  count: number
  rows: Array<Record<string, any>>
}
```

**LegacyAnalyticsRequest** (interface)
```typescript
interface LegacyAnalyticsRequest {
  collection?: string
  collectionId?: string
  productId?: string
  appId?: string
  startDate?: string
  endDate?: string
  location?: string
  tagId?: string
  qrCodeUrl?: string
  [key: string]: any
}
```

**AnalyticsDashboardMetrics** (interface)
```typescript
interface AnalyticsDashboardMetrics {
  [key: string]: string | number | null
}
```

**AnalyticsDashboardCharts** (interface)
```typescript
interface AnalyticsDashboardCharts {
  [key: string]: any[]
}
```

**AnalyticsDashboardResponse** (interface)
```typescript
interface AnalyticsDashboardResponse {
  metrics: AnalyticsDashboardMetrics
  charts: AnalyticsDashboardCharts
  locationData: any[]
}
```

**AnalyticsProductsRow** (interface)
```typescript
interface AnalyticsProductsRow {
  productId: string
  totalEvents: number
}
```

**AnalyticsProductsResponse** (interface)
```typescript
interface AnalyticsProductsResponse {
  products: string[]
  rows: AnalyticsProductsRow[]
}
```

**AnalyticsQrCodeRow** (interface)
```typescript
interface AnalyticsQrCodeRow {
  href: string
  visits: number
  displayName: string
  code: string
}
```

**AnalyticsTagRow** (interface)
```typescript
interface AnalyticsTagRow {
  tagId: string
  claimId: string
  codeId: string
  displayName: string
  scans: number
  activeDays: number
}
```

**AnalyticsTagsResponse** (interface)
```typescript
interface AnalyticsTagsResponse {
  tags: AnalyticsTagRow[]
}
```

**AnalyticsSource** = `'events' | 'tag'`

**AnalyticsEventType** = `string`

**AnalyticsGranularity** = `'hour' | 'day' | 'week' | 'month'`

**AnalyticsMetric** = `'count' | 'uniqueSessions' | 'uniqueVisitors'`

**AnalyticsSortOrder** = `'asc' | 'desc'`

**AnalyticsDeviceType** = `'mobile' | 'tablet' | 'desktop' | 'unknown'`

**AnalyticsStorageMode** = `'local' | 'session' | false`

**AnalyticsSessionId** = `number`

**EventAnalyticsDimension** = ``

**TagAnalyticsDimension** = ``

**AnalyticsQrCodesResponse** = `AnalyticsQrCodeRow[]`

### appConfiguration

**AppConfigurationResponse** (interface)
```typescript
interface AppConfigurationResponse {
  id: string
  name: string
  settings?: Record<string, any>
}
```

**GetWidgetInstanceOptions** (interface)
```typescript
interface GetWidgetInstanceOptions {
  appId: string
  collectionId?: string
  productId?: string
  variantId?: string
  batchId?: string
  admin?: boolean
  widgetId: string
}
```

**WidgetInstance<TWidget = any>** (interface)
```typescript
interface WidgetInstance<TWidget = any> {
  id: string
  name?: string
  widget?: TWidget
  [key: string]: any
}
```

**WidgetInstanceSummary** (interface)
```typescript
interface WidgetInstanceSummary {
  id: string
  name: string
  type?: string
  [key: string]: any
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
  * CSS file path — set to `null` (or omit) when the bundle ships no CSS.
  * Most widgets and containers use Tailwind/shadcn classes from the parent and produce no CSS file.
  * Only set to a non-null string if an actual CSS file exists in dist/;
  * a non-null value pointing to a missing file will cause a 404 in the parent portal.
  css?: string | null;
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

**AppManifestWidgets** (interface)
```typescript
interface AppManifestWidgets {
  files: AppManifestFiles;
  components: AppWidgetComponent[];
  instanceResolution?: boolean;
  instanceParam?: string;
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

**DeepLinkEntry** (interface)
```typescript
interface DeepLinkEntry {
  title: string;
  * Hash route path within the app (optional).
  * Defaults to "/" if omitted.
  * @example "/gallery"
  path?: string;
  * App-specific query params appended to the hash route URL.
  * Do NOT include platform context params (collectionId, appId, productId, etc.) —
  * those are injected by the platform automatically.
  params?: Record<string, string>;
}
```

**ExecutorContext** (interface)
```typescript
interface ExecutorContext {
  collectionId: string;
  appId: string;
  SL: any;
}
```

**SEOInput** (interface)
```typescript
interface SEOInput {
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  SL: any;
  collection?: Record<string, any>;
  product?: Record<string, any>;
  proof?: Record<string, any>;
}
```

**SEOResult** (interface)
```typescript
interface SEOResult {
  title?: string;
  description?: string;
  ogImage?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  contentSummary?: string;
  topics?: string[];
}
```

**LLMContentSection** (interface)
```typescript
interface LLMContentSection {
  heading: string;
  content: string;
  order?: number;
}
```

**LLMContentInput** (interface)
```typescript
interface LLMContentInput {
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  SL: any;
  collection?: Record<string, any>;
  product?: Record<string, any>;
  proof?: Record<string, any>;
  pageSlug?: string;
}
```

**LLMContentResult** (interface)
```typescript
interface LLMContentResult {
  sections: LLMContentSection[];
}
```

**AppManifestExecutor** (interface)
```typescript
interface AppManifestExecutor {
  files: AppManifestFiles;
  factory?: string;
  exports?: string[];
  description?: string;
  llmContent?: {
  function: string;
  timeout?: number;
  responseShape?: Record<string, any>;
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
  * SEO configuration for this app.
  * `priority` controls which app's singular fields (title, description, ogImage) win
  * when multiple apps appear on the same page. Default is 0; higher wins.
  seo?: {
  strategy?: 'executor' | string;
  priority?: number;
  contract?: {
  function: string;
  input?: string[];
  timeout?: number;
  responseShape?: Record<string, string>;
  };
  };
  };
  * Relative path to the admin configuration file (e.g. `"app.admin.json"`).
  * When present, fetch this file to get the full {@link AppAdminConfig}
  * (setup questions, import schema, tunable fields, metrics definitions).
  * Absent when the app has no admin UI.
  admin?: string;
  widgets?: AppManifestWidgets;
  containers?: {
  files: AppManifestFiles;
  components: AppContainerComponent[];
  };
  * Static deep-linkable states built into this app.
  * These are fixed routes that exist regardless of content — declared once at build time.
  * Dynamic content entries (e.g. CMS pages) are stored separately in `appConfig.linkable`.
  * Consumers should merge both sources to get the full set of navigable states.
  * @see DeepLinkEntry
  linkable?: DeepLinkEntry[];
  * Executor bundle declaration. Present when the app ships a programmatic executor
  * for AI-driven configuration, server-side SEO, and LLM content generation.
  * @see AppManifestExecutor
  executor?: AppManifestExecutor;
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

**FacetRuleClause** (interface)
```typescript
interface FacetRuleClause {
  * Facet key this clause tests, e.g. "brand", "type", "bread-type".
  * Must reference a defined facet on the collection.
  facetKey: string
  * One or more facet value keys that satisfy the clause (OR semantics).
  * At least one value required. Server deduplicates and sorts.
  anyOf: string[]
}
```

**FacetRule** (interface)
```typescript
interface FacetRule {
  * All clauses must be satisfied (AND semantics).
  * Must be non-empty; no duplicate facetKey entries.
  all: FacetRuleClause[]
}
```

**RecordTarget** (interface)
```typescript
interface RecordTarget {
  productId?: string
  variantId?: string
  proofId?: string
  batchId?: string
  * Facet assignments for the product (e.g. `{ brand: ['samsung'], type: ['tv'] }`).
  * Used exclusively to match FacetRule records via GIN-indexed containment check.
  * Does NOT filter legacy scope.facets arrays (that system is removed in SDK 1.12).
  * Omit to exclude rule records from results.
  facets?: Record<string, string[]>
}
```

**BulkUpsertItem** (interface)
```typescript
interface BulkUpsertItem {
  ref: string
  recordType?: string
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  startsAt?: string | null
  expiresAt?: string | null
  status?: string | null
  data?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  facetRule?: FacetRule | null
}
```

**BulkUpsertResult** (interface)
```typescript
interface BulkUpsertResult {
  saved: number
  failed: number
  results: Array<
  | { index: number; status: 'created'; id: string; ref: string; created: true }
  | { index: number; status: 'updated'; id: string; ref: string; created: false }
  | { index: number; status: 'error'; error: string }
  >
}
```

**BulkDeleteResult** (interface)
```typescript
interface BulkDeleteResult {
  deleted: number
}
```

**MatchResult** (interface)
```typescript
interface MatchResult {
  data: MatchEntry[]
  total: number
  strategy: 'all' | 'best'
}
```

**UpsertRecordInput** (interface)
```typescript
interface UpsertRecordInput {
  ref: string
  recordType?: string
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  startsAt?: string | null
  expiresAt?: string | null
  status?: string | null
  data?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
  facetRule?: FacetRule | null
}
```

**MatchRecordsInput** (interface)
```typescript
interface MatchRecordsInput {
  target: RecordTarget
  * 'all'  — return all matching records (default)
  * 'best' — return the highest-specificity record per recordType
  strategy?: 'all' | 'best'
  recordType?: string
  limit?: number
  includeScheduled?: boolean
  includeExpired?: boolean
  at?: string
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
  recordType: string | null
  ref: string | null
  scopeType: string | null
  scopeId: string | null
  customId: string | null
  customIdNormalized: string | null
  sourceSystem: string | null
  status: string | null
  productId: string | null
  variantId: string | null
  batchId: string | null
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
  * Numeric specificity score. Server-computed from anchor IDs and facetRule.
  * Higher = more specific. 0 = universal (no anchors, no rule).
  specificity: number
  * Facet rule for rule records (ref starts with "rule:").
  * null on all other record types. Mutually exclusive with anchor IDs.
  facetRule: FacetRule | null
  singletonKey: string | null
  data: Record<string, unknown>
  owner: Record<string, unknown>
  admin: Record<string, unknown> // admin only
  metadata: Record<string, unknown> | null
}
```

**CreateRecordInput** (interface)
```typescript
interface CreateRecordInput {
  recordType?: string
  visibility?: Visibility
  ref?: string
  status?: string
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  contactId?: string
  authorId?: string
  authorType?: string
  parentType?: string
  parentId?: string
  startsAt?: string | null
  expiresAt?: string | null
  scopeType?: string | null
  scopeId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  * Opt-in singleton cardinality. When set, the server upserts rather than
  * inserting a duplicate. Values: 'collection' | 'product' | 'variant' | 'batch' | 'proof'
  singletonPer?: string
  data?: Record<string, unknown>
  owner?: Record<string, unknown>
  admin?: Record<string, unknown>
  metadata?: Record<string, unknown>
  facetRule?: FacetRule | null
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
  productId?: string | null
  variantId?: string | null
  batchId?: string | null
  proofId?: string | null
  startsAt?: string | null
  expiresAt?: string | null
  scopeType?: string | null
  scopeId?: string | null
  customId?: string | null
  sourceSystem?: string | null
  metadata?: Record<string, unknown>
  facetRule?: FacetRule | null
}
```

**ResolveAllParams** (interface)
```typescript
interface ResolveAllParams {
  context: {
  productId?: string
  variantId?: string
  batchId?: string
  proofId?: string
  * Facet assignments for the product — used for both legacy facet-ref matching
  * and facetRule evaluation.
  * e.g. { "brand": "samsung", "type": ["tv", "laptop"] }
  facets?: Record<string, string | string[]>
  }
  recordType?: string
  tiers?: Array<'proof' | 'batch' | 'variant' | 'product' | 'rule' | 'facet' | 'collection'>
  limit?: number
  at?: string
  includeScheduled?: boolean
  includeExpired?: boolean
}
```

**ResolveAllResult** (interface)
```typescript
interface ResolveAllResult {
  records: ResolveAllEntry[]
  total: number
  context: ResolveAllContext
  truncated: boolean
}
```

**ResolveAllEntry** (interface)
```typescript
interface ResolveAllEntry {
  record: AppRecord
  matchedAt: MatchedAt
  specificity: number
  matchedRule?: FacetRule
  matchedClauseCount?: number
}
```

**ResolveAllContext** (interface)
```typescript
interface ResolveAllContext {
  productId?: string
  variantId?: string
  batchId?: string
  proofId?: string
  facets?: Record<string, string[]>
}
```

**PreviewRuleParams** (interface)
```typescript
interface PreviewRuleParams {
  facetRule: FacetRule
  recordType?: string
  limit?: number
}
```

**PreviewRuleResult** (interface)
```typescript
interface PreviewRuleResult {
  matchingProducts: Array<{ productId: string; name?: string; facets: Record<string, string[]> }>
  total: number
  rule: FacetRule
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
  cases?:   PublicCreateObjectRule
  threads?: PublicCreateObjectRule
  records?: PublicCreateObjectRule
}
```

**PublicCreateObjectRule** (interface)
```typescript
interface PublicCreateObjectRule {
  anonymous?:     PublicCreateBranch
  authenticated?: PublicCreateBranch
}
```

**PublicCreateBranch** (interface)
```typescript
interface PublicCreateBranch {
  allow: boolean
  * Field values merged **over** the caller's request body before writing.
  * Use this to lock down `visibility` and `status` regardless of what the
  * client sends.
  enforce?: {
  visibility?: 'public' | 'owner' | 'admin'
  status?:     string
  }
  * Anonymous edit-token configuration.
  * **Records only** — ignored for cases and threads.
  *
  * When `editToken: true`, the server generates a one-time 256-bit hex token
  * on anonymous record creation, stores it in `admin.editToken` (never
  * exposed to public / owner responses), and returns it **once** in the
  * creation response under the `editToken` key.
  *
  * The client can then pass that token as the `X-Edit-Token` header on
  * `PATCH /records/:recordId` to amend the `data` zone without
  * authentication.
  *
  * @see {@link CreateRecordResponse} — creation response shape
  * @see {@link records.updateWithToken} — SDK method for the amendment call
  edit?: {
  editToken: boolean
  * Optional expiry window in minutes from `createdAt`.
  * After this many minutes the token is rejected with HTTP 403
  * `EDIT_WINDOW_EXPIRED`.  Omit for no expiry.
  windowMinutes?: number
  }
}
```

**Visibility** = `'public' | 'owner' | 'admin'`

**CallerRole** = `'admin' | 'owner' | 'public'`

**BulkDeleteInput** = ``

**MatchedAt** = ``

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

### attestations

**Attestation** (interface)
```typescript
interface Attestation {
  id: string
  orgId: string
  collectionId: string
  subjectType: AttestationSubjectType
  subjectId: string
  attestationType: string
  recordedAt: string
  visibility: AttestationVisibility
  value?: Record<string, any>
  ownerData?: Record<string, any>
  adminData?: Record<string, any>
  unit?: string
  source?: string
  authorId?: string
  metadata?: Record<string, any>
  contentHash: string
  prevHash?: string
  createdAt: string
}
```

**LatestAttestation** (interface)
```typescript
interface LatestAttestation {
  attestationType: string
  latest: Attestation
}
```

**AttestationSummaryBucket** (interface)
```typescript
interface AttestationSummaryBucket {
  period: string
  count: number
  values?: Record<string, any>
}
```

**ChainVerifyResult** (interface)
```typescript
interface ChainVerifyResult {
  valid: boolean
  checkedCount: number
  failedAt?: string
  message: string
}
```

**CreateAttestationInput** (interface)
```typescript
interface CreateAttestationInput {
  subjectType: AttestationSubjectType
  subjectId: string
  attestationType: string
  recordedAt?: string
  visibility?: AttestationVisibility
  value?: Record<string, any>
  ownerData?: Record<string, any>
  adminData?: Record<string, any>
  unit?: string
  source?: string
  authorId?: string
  metadata?: Record<string, any>
}
```

**ListAttestationsResponse** (interface)
```typescript
interface ListAttestationsResponse {
  attestations: Attestation[]
}
```

**PublicListAttestationsResponse** (interface)
```typescript
interface PublicListAttestationsResponse {
  attestations: Attestation[]
  audience: AttestationAudience
}
```

**AttestationSummaryResponse** (interface)
```typescript
interface AttestationSummaryResponse {
  summary: AttestationSummaryBucket[]
}
```

**PublicAttestationSummaryResponse** (interface)
```typescript
interface PublicAttestationSummaryResponse {
  summary: AttestationSummaryBucket[]
  audience: 'public'
}
```

**AttestationLatestResponse** (interface)
```typescript
interface AttestationLatestResponse {
  latest: LatestAttestation[]
}
```

**PublicAttestationLatestResponse** (interface)
```typescript
interface PublicAttestationLatestResponse {
  latest: LatestAttestation[]
  audience: AttestationAudience
}
```

**AttestationTreeSummaryResponse** (interface)
```typescript
interface AttestationTreeSummaryResponse {
  summary: AttestationSummaryBucket[]
  subjectCount: number
}
```

**PublicAttestationTreeSummaryResponse** (interface)
```typescript
interface PublicAttestationTreeSummaryResponse {
  summary: AttestationSummaryBucket[]
  audience: 'public'
  subjectCount: number
}
```

**AttestationTreeLatestResponse** (interface)
```typescript
interface AttestationTreeLatestResponse {
  latest: LatestAttestation[]
  subjectCount: number
}
```

**PublicAttestationTreeLatestResponse** (interface)
```typescript
interface PublicAttestationTreeLatestResponse {
  latest: LatestAttestation[]
  audience: 'public'
  subjectCount: number
}
```

**ListAttestationsParams** (interface)
```typescript
interface ListAttestationsParams {
  subjectType: AttestationSubjectType
  subjectId: string
  attestationType?: string
  recordedAfter?: string
  recordedBefore?: string
  limit?: number
  offset?: number
}
```

**AttestationSummaryParams** (interface)
```typescript
interface AttestationSummaryParams {
  subjectType: AttestationSubjectType
  subjectId: string
  attestationType: string
  valueField?: string
  groupBy?: AttestationGroupBy
  recordedAfter?: string
  recordedBefore?: string
  limit?: number
}
```

**AttestationLatestParams** (interface)
```typescript
interface AttestationLatestParams {
  subjectType: AttestationSubjectType
  subjectId: string
}
```

**AttestationVerifyParams** (interface)
```typescript
interface AttestationVerifyParams {
  subjectType: AttestationSubjectType
  subjectId: string
  attestationType: string
}
```

**AttestationTreeSummaryParams** (interface)
```typescript
interface AttestationTreeSummaryParams {
  subjectId: string
  attestationType: string
  valueField?: string
  groupBy?: AttestationGroupBy
  recordedAfter?: string
  recordedBefore?: string
  limit?: number
  includeItems?: boolean
}
```

**AttestationTreeLatestParams** (interface)
```typescript
interface AttestationTreeLatestParams {
  subjectId: string
  includeItems?: boolean
}
```

**AttestationSubjectType** = ``

**AttestationVisibility** = `'public' | 'owner' | 'admin'`

**AttestationAudience** = `'public' | 'owner' | 'admin'`

**AttestationGroupBy** = `'hour' | 'day' | 'week' | 'month'`

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

**AuthLocation** (interface)
```typescript
interface AuthLocation {
  latitude?: number
  longitude?: number
  area?: number
  country?: string
  [key: string]: any
}
```

**AuthLocationCacheOptions** (interface)
```typescript
interface AuthLocationCacheOptions {
  cache?: 'session' | false
  ttlMs?: number
  storageKey?: string
  forceRefresh?: boolean
}
```

**AccountFirebaseInfo** (interface)
```typescript
interface AccountFirebaseInfo {
  identities?: Record<string, string[]>
  sign_in_provider?: string
  [key: string]: any
}
```

**AccountClientInfo** (interface)
```typescript
interface AccountClientInfo {
  createdAt?: string
  createdVia?: string
  [key: string]: any
}
```

**AccountFeatureFlags** (interface)
```typescript
interface AccountFeatureFlags {
  actionLogger?: boolean
  apiKeys?: boolean
  analytics?: boolean
  webhooks?: boolean
  creating?: boolean
  helpDocs?: boolean
  certificateTemplates?: boolean
  contentLibrary?: boolean
  devScanner?: boolean
  appScanner?: boolean
  [key: string]: boolean | undefined
}
```

**AccountInfoResponse** (interface)
```typescript
interface AccountInfoResponse {
  id: string
  uid: string
  userId: string
  user_id?: string
  sub: string
  name: string
  email: string
  email_verified: boolean
  picture?: string | null
  iss: string
  aud?: string
  auth_time: number
  iat: number
  exp?: number
  firebase?: AccountFirebaseInfo
  accessType?: string
  clientType?: string
  analyticsCode?: string
  analyticsId?: string
  baseCollectionId?: string
  collectionGroup?: string
  contactId?: string
  features: AccountFeatureFlags
  adminCollections?: string[]
  clients?: Record<string, AccountClientInfo>
  sites?: Record<string, boolean>
  whitelabel?: Record<string, any>
  location?: AuthLocation | null
  prefs?: Record<string, any>
  [key: string]: any
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

**CreateClaimSetTagRequest** (interface)
```typescript
interface CreateClaimSetTagRequest {
  id?: string
  tagId?: string
  productId?: string
  collectionId?: string
  batchId?: string
  password?: string
  data?: Record<string, unknown>
}
```

**CreateClaimSetRequest** (interface)
```typescript
interface CreateClaimSetRequest {
  name: string
  claimMode: string
  allocationMode: string
}
```

**ImportClaimSetTagItem** (interface)
```typescript
interface ImportClaimSetTagItem {
  id: string
  tagId?: string
  index?: number
}
```

**ImportClaimSetTagsRequest** (interface)
```typescript
interface ImportClaimSetTagsRequest {
  tags: ImportClaimSetTagItem[]
  * Import mode:
  * - "upsert" (default) merges with existing tags
  * - "replace" wipes all existing tags first then writes the new set
  mode?: 'upsert' | 'replace'
}
```

**ImportClaimSetTagsResponse** (interface)
```typescript
interface ImportClaimSetTagsResponse {
  written: number
}
```

**CreateClaimSetTagResponse** (interface)
```typescript
interface CreateClaimSetTagResponse {
  id: string
  claimSetId: string
  createdAt: string
  tagId?: string
  productId?: string
  collectionId?: string
  batchId?: string
  password?: string
  data?: Record<string, unknown>
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
  variants: boolean // does this collection support variants?
  batches: boolean // does this collection support batches?
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
 * POST /admin/collection/:collectionId/comm.send
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

### config

**FieldOption** (interface)
```typescript
interface FieldOption {
  label: string
  value: string
}
```

**FieldDefinition** (interface)
```typescript
interface FieldDefinition {
  id: string
  label: string
  storageKey?: string
  type: FieldType
  options?: FieldOption[]
  required?: boolean
  col?: number
  placeholder?: string
  help?: string
  min?: number
  max?: number
  step?: number
  rows?: number
  autoGrow?: boolean
  accept?: string
  clearable?: boolean
  disabled?: boolean
  * Conditional visibility. If absent the field is always shown.
  * Object form: `{ field: 'someKey', equals: 'someValue' }` — show when `model[field] === equals`.
  showIf?: { field: string; equals: unknown }
}
```

**ProofTypeDefinition** (interface)
```typescript
interface ProofTypeDefinition {
  id: string
  name: string
  description?: string
  * Grouping used to organise proof types in the picker.
  * Examples: 'basic', 'retail', 'ownable', 'consumable', 'attendance',
  * 'qualification', 'creative', 'memories', 'safety', 'connected',
  * 'smartdocent', 'tradable'
  category?: string
  * Whether this proof type is shown to users.
  * Only types with `active === true` are returned to the public API
  * when the platform admin has filtered by "Only Active".
  active?: boolean
  group: boolean
  * The underlying proof mechanisms that products of this type can use.
  * Stored as `proofTypes` (plural) on the product document.
  proofTypes?: ProofMechanism[]
  proofType?: ProofMechanism
  * Field IDs (from the field catalog) shown when creating/editing the product group.
  * Ordered — rendered in this sequence.
  groupFields?: string[]
  * Field IDs shown when creating/editing an individual proof item within the group.
  * If absent, falls back to groupFields.
  proofFields?: string[]
  * Column definitions shown in the proof list view.
  * Keys are field IDs; value true means show the column.
  listFields?: Record<string, boolean>
  * App uniqueNames automatically installed (for free) when this proof type is selected.
  freeApps?: string[]
  * App uniqueNames shown as recommended paid add-ons for this proof type.
  apps?: string[]
  collection?: string
  action?: string
  bound?: 'soul'
  * UI translation overrides for this proof type.
  * Keys are source English words; values are replacement strings.
  * Example: `{ "Products": "Works" }`
  translations?: Record<string, string>
  hideProductTools?: boolean
}
```

**FieldType** = ``

**ProofMechanism** = ``

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

### containers

**Container** (interface)
```typescript
interface Container {
  id: string
  orgId: string
  collectionId: string
  * Domain label describing what kind of container this is.
  * Examples: `'pallet'`, `'fridge'`, `'cask'`, `'warehouse'`, `'shipping_container'`
  containerType: string
  ref?: string
  name?: string
  description?: string
  status: ContainerStatus
  metadata?: Record<string, any>
  parentContainerId?: string
  children?: Container[]
  items?: ContainerItem[]
  createdAt: string
  updatedAt: string
  deletedAt?: string
}
```

**ContainerItem** (interface)
```typescript
interface ContainerItem {
  id: string
  orgId: string
  containerId: string
  collectionId?: string
  itemType: ContainerItemType
  itemId: string
  productId?: string
  proofId?: string
  addedAt: string
  removedAt?: string
  metadata?: Record<string, any>
}
```

**CreateContainerInput** (interface)
```typescript
interface CreateContainerInput {
  containerType: string
  ref?: string
  name?: string
  description?: string
  status?: ContainerStatus
  metadata?: Record<string, any>
  parentContainerId?: string
}
```

**UpdateContainerInput** (interface)
```typescript
interface UpdateContainerInput {
  containerType?: string
  ref?: string
  name?: string
  description?: string
  status?: ContainerStatus
  metadata?: Record<string, any>
  parentContainerId?: string | null
}
```

**AddContainerItemsInput** (interface)
```typescript
interface AddContainerItemsInput {
  items: Array<{
  itemType: ContainerItemType
  itemId: string
  productId?: string
  proofId?: string
  metadata?: Record<string, any>
  }>
}
```

**RemoveContainerItemsInput** (interface)
```typescript
interface RemoveContainerItemsInput {
  ids: string[]
}
```

**ListContainersResponse** (interface)
```typescript
interface ListContainersResponse {
  containers: Container[]
  limit: number
  offset: number
}
```

**PublicListContainersResponse** (interface)
```typescript
interface PublicListContainersResponse {
  containers: Container[]
}
```

**FindContainersForItemResponse** (interface)
```typescript
interface FindContainersForItemResponse {
  containers: Container[]
}
```

**ContainerItemsResponse** (interface)
```typescript
interface ContainerItemsResponse {
  items: ContainerItem[]
  limit: number
  offset: number
}
```

**AddContainerItemsResponse** (interface)
```typescript
interface AddContainerItemsResponse {
  items: ContainerItem[]
}
```

**RemoveContainerItemsResponse** (interface)
```typescript
interface RemoveContainerItemsResponse {
  success: true
  removedCount: number
}
```

**ListContainersParams** (interface)
```typescript
interface ListContainersParams {
  containerType?: string
  status?: ContainerStatus
  ref?: string
  parentContainerId?: string
  topLevel?: boolean
  limit?: number
  offset?: number
}
```

**GetContainerParams** (interface)
```typescript
interface GetContainerParams {
  tree?: boolean
  treeDepth?: number
  includeContents?: boolean
}
```

**ListContainerItemsParams** (interface)
```typescript
interface ListContainerItemsParams {
  history?: boolean
  limit?: number
  offset?: number
}
```

**FindContainersForItemParams** (interface)
```typescript
interface FindContainersForItemParams {
  itemType: ContainerItemType
  itemId: string
}
```

**ContainerStatus** = `'active' | 'archived' | string`

**ContainerItemType** = `'tag' | 'proof' | 'serial' | 'order_item' | 'container'`

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

### facets

**FacetDefinition** (interface)
```typescript
interface FacetDefinition {
  id?: string
  orgId?: string
  collectionId?: string | null
  key: string
  name: string
  description?: string | null
  cardinality?: "single" | "multi"
  kind?: "system" | "custom"
  hierarchical?: boolean
  reserved?: boolean
  enabled?: boolean
  sortOrder?: number | null
  config?: Record<string, JsonValue>
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  values?: FacetValue[]
}
```

**FacetValue** (interface)
```typescript
interface FacetValue {
  id?: string
  orgId?: string
  collectionId?: string | null
  facetDefinitionId?: string
  facetKey: string
  key: string
  slug?: string | null
  name: string
  shortName?: string | null
  description?: string | null
  color?: string | null
  icon?: string | null
  image?: Record<string, JsonValue> | null
  metadata?: Record<string, JsonValue>
  sortOrder?: number | null
  parentValueId?: string | null
  parentValueKey?: string | null
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  count?: number
}
```

**FacetDefinitionWriteInput** (interface)
```typescript
interface FacetDefinitionWriteInput {
  key?: string
  name: string
  description?: string | null
  cardinality?: "single" | "multi"
  kind?: "system" | "custom"
  hierarchical?: boolean
  reserved?: boolean
  enabled?: boolean
  sortOrder?: number | null
  config?: Record<string, JsonValue>
}
```

**FacetValueWriteInput** (interface)
```typescript
interface FacetValueWriteInput {
  key?: string
  slug?: string | null
  name: string
  shortName?: string | null
  description?: string | null
  color?: string | null
  icon?: string | null
  image?: Record<string, JsonValue> | null
  metadata?: Record<string, JsonValue>
  sortOrder?: number | null
  parentValueKey?: string | null
  enabled?: boolean
}
```

**FacetListResponse** (interface)
```typescript
interface FacetListResponse {
  items: FacetDefinition[]
}
```

**FacetValueListResponse** (interface)
```typescript
interface FacetValueListResponse {
  facet: FacetDefinition
  items: FacetValue[]
}
```

**FacetValueResponse** (interface)
```typescript
interface FacetValueResponse {
  facet: FacetDefinition
  item: FacetValue
}
```

**FacetQueryRequest** (interface)
```typescript
interface FacetQueryRequest {
  facetKeys?: string[]
  includeEmpty?: boolean
  includeDeleted?: boolean
  query?: ProductQueryRequest["query"] & {
  facetEquals?: Record<string, JsonValue | JsonValue[]>
  }
}
```

**FacetBucket** (interface)
```typescript
interface FacetBucket {
  facetKey: string
  valueKey: string
  name?: string
  count: number
}
```

**FacetQueryResponse** (interface)
```typescript
interface FacetQueryResponse {
  items: Array<{
  facet: FacetDefinition
  values: FacetValue[]
  }>
  buckets: FacetBucket[]
  meta?: {
  source?: "postgres"
  matchedProducts?: number
  }
}
```

**FacetListParams** (interface)
```typescript
interface FacetListParams {
  includeValues?: boolean
  includeDeleted?: boolean
  kind?: "system" | "custom"
  reserved?: boolean
}
```

**PublicFacetListParams** (interface)
```typescript
interface PublicFacetListParams {
  includeValues?: boolean
}
```

**FacetGetParams** (interface)
```typescript
interface FacetGetParams {
  includeValues?: boolean
  includeDeleted?: boolean
}
```

**FacetValueListParams** (interface)
```typescript
interface FacetValueListParams {
  includeDeleted?: boolean
}
```

**FacetValueGetParams** (interface)
```typescript
interface FacetValueGetParams {
  includeDeleted?: boolean
}
```

**FacetValueDefinition** = `FacetValue`

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
  statusCode?: number;
  errorBody?: any;
}
```

**ProxyStreamRequest** (interface)
```typescript
interface ProxyStreamRequest {
  _smartlinksProxyStreamRequest: true;
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: any;
  headers?: Record<string, string>;
}
```

**ProxyStreamAbortMessage** (interface)
```typescript
interface ProxyStreamAbortMessage {
  _smartlinksProxyStreamAbort: true;
  id: string;
}
```

**ProxyStreamMessage** (interface)
```typescript
interface ProxyStreamMessage {
  _smartlinksProxyStream: true;
  id: string;
  phase: 'open' | 'event' | 'end' | 'error';
  data?: any;
  error?: string;
  status?: number;
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

**AdminInteractionsAggregateRequest** (interface)
```typescript
interface AdminInteractionsAggregateRequest {
  appId?: string
  interactionId?: string
  interactionIds?: string[]
  scope?: string
  outcome?: string | null
  from?: string
  to?: string
  limit?: number
  dedupeLatest?: boolean
  groupBy: string
  aggregate: {
  field: string
  ops: Array<'count' | 'sum' | 'avg' | 'min' | 'max'>
  }
}
```

**AdminInteractionsAggregateResponse** (interface)
```typescript
interface AdminInteractionsAggregateResponse {
  groupBy: string
  aggregate: {
  field: string
  ops: Array<'count' | 'sum' | 'avg' | 'min' | 'max'>
  dedupeLatest?: boolean
  }
  rows: AdminInteractionsAggregateRow[]
}
```

**AdminInteractionsAggregateRow** (interface)
```typescript
interface AdminInteractionsAggregateRow {
  groupValue: string | null
  eventCount: number
  count?: number
  sum?: number
  avg?: number
  min?: number
  max?: number
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
  uniquePerAnonId?: boolean
  * Time window in seconds for `uniquePerAnonId` enforcement.
  * `0` or omitted means all-time deduplication.
  uniquePerAnonIdWindowSeconds?: number
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

**SubmitInteractionResponse** (interface)
```typescript
interface SubmitInteractionResponse {
  success: true
  eventId: string
}
```

**SubmitInteractionError** (interface)
```typescript
interface SubmitInteractionError {
  error: 'FORBIDDEN'
  reason:
  | 'not_public'
  | 'auth_required'
  | 'duplicate'
  | 'duplicate_anon'
  | 'disabled'
  | 'before_start'
  | 'after_end'
  | 'origin_forbidden'
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

### loyalty

**LoyaltyScheme** (interface)
```typescript
interface LoyaltyScheme {
  id: string
  orgId: string
  collectionId: string
  name: string
  type: string
  active: boolean
  createdAt: string // ISO
  updatedAt: string // ISO
  deletedAt: string | null // ISO
  data: DataBlock
  owner?: DataBlock
  admin?: DataBlock
}
```

**LoyaltyMember** (interface)
```typescript
interface LoyaltyMember {
  id: string
  orgId: string
  collectionId: string
  schemeId: string
  contactId: string
  userId: string | null
  balance: number
  lifetimePoints: number
  createdAt: string // ISO
  updatedAt: string // ISO
  data: DataBlock
  owner?: DataBlock
  admin?: DataBlock
}
```

**LoyaltyTransaction** (interface)
```typescript
interface LoyaltyTransaction {
  id: string
  orgId: string
  collectionId: string
  schemeId: string
  memberId: string
  points: number
  reason: string | null
  idempotencyKey: string | null
  metadata: DataBlock
  createdAt: string // ISO
}
```

**LoyaltyEarningRule** (interface)
```typescript
interface LoyaltyEarningRule {
  id: string
  orgId: string
  collectionId: string
  schemeId: string
  interactionId: string
  points: number
  * Key-value conditions matched against the interaction event before awarding.
  * Supports top-level event fields (outcome, scope, status, eventType, etc.)
  * and dot-path into metadata (e.g. `"metadata.tier": "gold"`).
  * Empty object = always fires for any event on this interaction.
  conditions: Record<string, string>
  maxPerContact: number | null
  cooldownHours: number | null
  active: boolean
  createdAt: string // ISO
  updatedAt: string // ISO
  data: DataBlock
}
```

**LoyaltyTransactionResult** (interface)
```typescript
interface LoyaltyTransactionResult {
  member: LoyaltyMember
  transaction: LoyaltyTransaction
}
```

**LoyaltyPaginationParams** (interface)
```typescript
interface LoyaltyPaginationParams {
  limit?: number  // default 50, max 200
  offset?: number
}
```

**LoyaltyPaginatedResult<T>** (interface)
```typescript
interface LoyaltyPaginatedResult<T> {
  items: T[]
  limit: number
  offset: number
}
```

**CreateLoyaltySchemeBody** (interface)
```typescript
interface CreateLoyaltySchemeBody {
  name: string
  type: string
  active?: boolean
  data?: DataBlock
  owner?: DataBlock
  admin?: DataBlock
}
```

**UpdateLoyaltySchemeBody** (interface)
```typescript
interface UpdateLoyaltySchemeBody {
  name?: string
  type?: string
  active?: boolean
  data?: DataBlock
  owner?: DataBlock
  admin?: DataBlock
}
```

**CreateLoyaltyEarningRuleBody** (interface)
```typescript
interface CreateLoyaltyEarningRuleBody {
  interactionId: string
  points: number
  conditions?: Record<string, string>
  maxPerContact?: number | null
  cooldownHours?: number | null
  active?: boolean
  data?: DataBlock
}
```

**UpdateLoyaltyEarningRuleBody** (interface)
```typescript
interface UpdateLoyaltyEarningRuleBody {
  points?: number
  conditions?: Record<string, string>
  maxPerContact?: number | null
  cooldownHours?: number | null
  active?: boolean
  data?: DataBlock
}
```

**RecordLoyaltyTransactionBody** (interface)
```typescript
interface RecordLoyaltyTransactionBody {
  points: number
  reason?: string
  * Optional caller-supplied key scoped to the scheme.
  * If a transaction with this key already exists the server returns 409.
  * Use to safely retry without double-crediting points.
  idempotencyKey?: string
  metadata?: DataBlock
  userId?: string
}
```

**DataBlock** = `Record<string, unknown>`

### navigation

**ResolveLinkContext** (interface)
```typescript
interface ResolveLinkContext {
  * True when running inside a SmartLinks container, widget, or iframe.
  * Defaults to auto-detection via `window.parent !== window`.
  embedded?: boolean;
  * Override for the `postMessage` target window.
  * Defaults to `window.parent`. Useful in tests and hosts that proxy messages.
  postTarget?: Window | null;
  * Override for the navigation window.
  * Defaults to `window`. Useful in tests.
  win?: Window;
  * When provided, `resolveLink` automatically fires a `click_link` analytics
  * event via `SL.analytics.browser.trackLinkClick` immediately before
  * navigating. Supply at minimum `collectionId`; add `productId`, `proofId`,
  * or any other `CollectionAnalyticsEvent` fields you want on the event.
  *
  * The resolver derives `isExternal`, `destinationAppId`, `linkTitle`, and
  * `href` from the `LinkTarget` automatically. Fields you supply here take
  * precedence over the derived values if there is a conflict.
  *
  * Called synchronously so the event fires even for external `_blank` links
  * that unload the page immediately after.
  *
  * @example
  *   SL.navigation.resolveLink(link, {
  *     track: { collectionId, productId },
  *   });
  track?: LinkTrackingContext;
}
```

**ResolvedLink** (interface)
```typescript
interface ResolvedLink {
  navigate(): void;
  describe(): string;
}
```

**LinkOpenTarget** = `'_self' | '_blank'`

**LinkTarget** = ``

**LinkTrackingContext** (type)
```typescript
type LinkTrackingContext = { collectionId: string }
```

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
  productId?: string
  batchId?: string
  variantId?: string
  itemType?: 'tag' | 'proof' | 'serial'
  itemId?: string
  itemCollectionId?: string
  itemMetadata?: Record<string, any>
  items?: Array<{
  itemType: 'tag' | 'proof' | 'serial'
  itemId: string
  }>
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
  attribute: 'productId'
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

**ProductKey** (interface)
```typescript
interface ProductKey {
  collectionId: string
  id: string
}
```

**ProductImageThumbnails** (interface)
```typescript
interface ProductImageThumbnails {
  x100?: string
  x200?: string
  x512?: string
}
```

**ProductImage** (interface)
```typescript
interface ProductImage {
  id?: string
  collectionId?: string
  productId?: string
  site?: string
  name?: string
  cleanName?: string
  assetType?: string
  type?: string
  url?: string
  thumbnails?: ProductImageThumbnails
  contentType?: string
  size?: string | number
  hash?: string
  createdAt?: ISODateString | null
  updatedAt?: ISODateString | null
  deletedAt?: ISODateString | null
}
```

**ProductImageUrlInput** (interface)
```typescript
interface ProductImageUrlInput {
  url: string
}
```

**AdditionalGtin** (interface)
```typescript
interface AdditionalGtin {
  gtin: string
  owner?: boolean | null
}
```

**ProductFacetValue** (interface)
```typescript
interface ProductFacetValue {
  id?: string
  key: string
  slug?: string
  name: string
  shortName?: string
  description?: string
  color?: string
  icon?: string
}
```

**ProductFacetMap** (interface)
```typescript
interface ProductFacetMap {
  [facetKey: string]: ProductFacetValue[]
}
```

**ProductQueryRequest** (interface)
```typescript
interface ProductQueryRequest {
  query?: {
  search?: string
  status?: string[]
  productIds?: string[]
  sku?: string
  gtin?: string
  updatedAfter?: ISODateString
  updatedBefore?: ISODateString
  createdAfter?: ISODateString
  createdBefore?: ISODateString
  facetEquals?: Record<string, JsonValue>
  }
  sort?: Array<{
  field: string
  direction: 'asc' | 'desc'
  }>
  page?: {
  limit?: number
  offset?: number
  cursor?: string | null
  }
  includeDeleted?: boolean
}
```

**ProductWriteInput** (interface)
```typescript
interface ProductWriteInput {
  id?: string
  name: string
  description?: string | null
  gtin?: string | null
  ownGtin?: boolean | null
  additionalGtins?: AdditionalGtin[]
  sku?: string | null
  label?: string | null
  status?: string | null
  sortOrder?: number | null
  heroImage?: ProductImage | ProductImageUrlInput | string | null
  facets?: ProductFacetMap
  data?: Record<string, JsonValue>
  admin?: Record<string, JsonValue>
  extra?: Record<string, JsonValue>
  validCollections?: string[]
}
```

**ProductQueryResponse** (interface)
```typescript
interface ProductQueryResponse {
  items: Product[]
  page?: {
  limit?: number
  offset?: number
  returned?: number
  total?: number
  hasMore?: boolean
  nextCursor?: string | null
  }
  meta?: {
  apiVersion?: 'v1'
  mode?: 'canonical-products' | 'legacy-product-compatibility'
  source?: 'postgres' | 'firestore' | 'compatibility-layer'
  queryMode?: 'canonical' | 'compatibility'
  unsupportedFilters?: string[]
  supportedSortFields?: string[]
  }
}
```

**JsonPrimitive** = `string | number | boolean | null`

**JsonValue** = ``

**ISODateString** = `string`

**ProductClaimCreateRequestBody** = `Omit<ProductClaimCreateInput, 'collectionId' | 'id'>`

**ProductResponse** = `Product`

**ProductCreateRequest** = `ProductWriteInput`

**ProductUpdateRequest** = `Partial<Omit<ProductWriteInput, 'id'>>`

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
  id:           string                // Internal UUID
  orgId:        string                // Organisation ID
  tagId:        string                // Physical tag identifier (NFC UID, QR code, etc.)
  collectionId: string                // Owning collection
  productId:    string | null         // Linked product
  variantId:    string | null         // Product variant
  batchId:      string | null         // Production batch
  proofId:      string | null         // Proof / serial number
  * Polymorphic ref type: `'app_record'`, `'app_case'`, `'app_thread'`, `'container'`, etc.
  * Always paired with `refId`.
  refType:      string | null
  refId:        string | null
  metadata:     Record<string, any>
  createdAt:    string                // ISO 8601
  updatedAt:    string                // ISO 8601
}
```

**TagIndexEntry** (interface)
```typescript
interface TagIndexEntry {
  tagId:        string
  collectionId: string
}
```

**TagEmbedded** (interface)
```typescript
interface TagEmbedded {
  products?:   Record<string, any>
  * `proofId → proof record or virtual serial-number proof`
  * (when `embed` includes `'proof'`)
  proofs?:     Record<string, any>
  * `containerId → Container row`
  * (for tags where `refType === 'container'`, when `embed` includes `'container'`)
  containers?: Record<string, any>
  * `refId → app_record | app_case | app_thread | container`
  * (when `embed` includes `'ref'`)
  refs?:       Record<string, any>
}
```

**CreateTagRequest** (interface)
```typescript
interface CreateTagRequest {
  tagId:            string           // Required
  productId?:       string
  variantId?:       string
  batchId?:         string
  proofId?:         string           // Required if productId set, unless useSerialNumber=true
  useSerialNumber?: boolean          // Auto-generate a serial number as proofId
  refType?:         string           // Must be paired with refId
  refId?:           string           // Must be paired with refType
  metadata?:        Record<string, any>
  force?:           boolean          // Overwrite if tag already exists in this collection
}
```

**BatchCreateTagRequest** (interface)
```typescript
interface BatchCreateTagRequest {
  tags:  Omit<CreateTagRequest, 'force'>[]
  force?: boolean
}
```

**UpdateTagRequest** (interface)
```typescript
interface UpdateTagRequest {
  productId?:  string
  variantId?:  string
  batchId?:    string
  proofId?:    string
  refType?:    string | null
  refId?:      string | null
  metadata?:   Record<string, any>   // Merged with existing metadata
}
```

**BatchCreateResult** (interface)
```typescript
interface BatchCreateResult {
  summary: {
  total:     number
  created:   number
  updated:   number
  failed:    number
  conflicts: number
  }
  results: {
  created:   Tag[]
  updated:   Tag[]
  failed:    Array<{ tagId: string; reason: string; message: string }>
  conflicts: Array<{ tagId: string; reason: string; message: string; existingTag: Tag }>
  }
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
  limit?:     number
  offset?:    number
  productId?: string
  variantId?: string
  batchId?:   string
  refType?:   string
  refId?:     string
}
```

**ListTagsResponse** (interface)
```typescript
interface ListTagsResponse {
  tags:   Tag[]
  limit:  number
  offset: number
}
```

**LookupTagsRequest** (interface)
```typescript
interface LookupTagsRequest {
  tagIds: string[]
  embed?: string
}
```

**LookupTagsQueryRequest** (interface)
```typescript
interface LookupTagsQueryRequest {
  tagIds: string
  embed?: string
}
```

**ByRefRequest** (interface)
```typescript
interface ByRefRequest {
  refType: string
  refId:   string
  embed?:  string
}
```

**ReverseTagLookupParams** (interface)
```typescript
interface ReverseTagLookupParams {
  refType: string
  refId:   string
  embed?:  string
}
```

**PublicGetTagResponse** (interface)
```typescript
interface PublicGetTagResponse {
  tag:      Tag
  embedded: TagEmbedded
}
```

**TagLookupResponse** (interface)
```typescript
interface TagLookupResponse {
  count:    number
  tags:     Tag[]
  embedded: TagEmbedded
}
```

**ReverseTagLookupResponse** (interface)
```typescript
interface ReverseTagLookupResponse {
  tags: Tag[]
}
```

**ByRefResponse** (interface)
```typescript
interface ByRefResponse {
  tags:     Tag[]
  embedded: TagEmbedded
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

### translations

**TranslationContext** (interface)
```typescript
interface TranslationContext {
  surface?: string
  field?: string
  [key: string]: TranslationContextValue | undefined
}
```

**TranslationLookupRequestBase** (interface)
```typescript
interface TranslationLookupRequestBase {
  targetLanguage: string
  sourceLanguage?: string
  mode?: TranslationLookupMode
  contentType?: TranslationContentType
  context?: TranslationContext
  returnMeta?: boolean
}
```

**TranslationLookupItem** (interface)
```typescript
interface TranslationLookupItem {
  index: number
  hash: string
  sourceText: string
  translatedText?: string
  status?: TranslationItemStatus
  provider?: string
  model?: string
  isOverride?: boolean
  quality?: TranslationQuality
  createdAt?: string
  updatedAt?: string
}
```

**TranslationLookupResponse** (interface)
```typescript
interface TranslationLookupResponse {
  targetLanguage: string
  sourceLanguage?: string
  mode?: TranslationLookupMode
  items: TranslationLookupItem[]
}
```

**ResolvedTranslationResponse** (interface)
```typescript
interface ResolvedTranslationResponse {
  targetLanguage: string
  sourceLanguage?: string
  mode?: TranslationLookupMode
  items: ResolvedTranslationItem[]
}
```

**TranslationHashOptions** (interface)
```typescript
interface TranslationHashOptions {
  trim?: boolean
  collapseWhitespace?: boolean
  unicodeNormalization?: 'NFC' | 'NFKC' | false
}
```

**TranslationResolveOptions** (interface)
```typescript
interface TranslationResolveOptions {
  useLocalCache?: boolean
  refreshLocalCache?: boolean
  localCacheTtlMs?: number
  hashOptions?: TranslationHashOptions
}
```

**TranslationRecord** (interface)
```typescript
interface TranslationRecord {
  id: string
  collectionId: string
  sourceHash: string
  sourceText: string
  sourceLanguage?: string
  targetLanguage: string
  contentType: string
  contextKey?: string | null
  translatedText: string
  provider?: string | null
  model?: string | null
  quality: TranslationQuality
  isOverride: boolean
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}
```

**TranslationListParams** (interface)
```typescript
interface TranslationListParams {
  targetLanguage?: string
  sourceLanguage?: string
  contentType?: string
  contextKey?: string
  q?: string
  isOverride?: boolean
  limit?: number
  offset?: number
}
```

**TranslationListResponse** (interface)
```typescript
interface TranslationListResponse {
  items: TranslationRecord[]
  total?: number
  limit?: number
  offset?: number
}
```

**TranslationUpdateRequest** (interface)
```typescript
interface TranslationUpdateRequest {
  translatedText?: string
  isOverride?: boolean
  quality?: TranslationQuality
  metadata?: Record<string, any>
}
```

**TranslationLookupMode** = `'cache-fill' | 'cache-only'`

**TranslationContentType** = `'text/plain' | 'text/html' | 'text/x-liquid' | (string & {})`

**TranslationQuality** = `'machine' | 'human' | 'passthrough' | (string & {})`

**TranslationItemStatus** = `'cached' | 'generated' | 'miss' | 'passthrough' | 'local-cache' | (string & {})`

**TranslationContextValue** = `string | number | boolean | null`

**TranslationLookupRequest** = `TranslationLookupSingleRequest | TranslationLookupBatchRequest`

### variant

**VariantResponse** = `any`

**VariantCreateRequest** = `any`

**VariantUpdateRequest** = `any`

### widgets

**NavigationRequest** (interface)
```typescript
interface NavigationRequest {
  appId: string
  deepLink?: string
  params?: Record<string, string>
  productId?: string
  proofId?: string
}
```

**SmartLinksWidgetProps** (interface)
```typescript
interface SmartLinksWidgetProps {
  collectionId: string
  appId: string
  productId?: string
  proofId?: string
  user?: {
  id?: string
  email?: string
  name?: string
  admin?: boolean
  }
  * Pre-initialised SmartLinks SDK instance provided by the parent platform.
  * At runtime this is `typeof import('@proveanything/smartlinks')`.
  SL: Record<string, unknown>
  * Navigation callback.  Emit a `NavigationRequest` to ask the parent
  * platform to navigate to another app.  A legacy plain-string path is also
  * accepted for backward compatibility.
  onNavigate?: (request: NavigationRequest | string) => void
  publicPortalUrl?: string
  size?: 'compact' | 'standard' | 'large'
  lang?: string
  translations?: Record<string, string>
}
```

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
  
  /**
   * Use admin endpoints instead of public.
   * This selects which endpoint is called; it does not by itself make root-level config fields private.
   */
  admin?: boolean
  
  /**
   * Configuration object for setConfig.
   * For admin-only values in app config, store them under a top-level `admin` object.
   * Public reads return the root config but omit `config.admin`.
   */
  config?: any
  /** Data object for setDataItem. Best for small keyed scoped documents rather than richer app domain objects. */
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

### conditions (utils)

**BaseCondition** (interface)
```typescript
interface BaseCondition {
  type: string
  contains?: boolean
  passes?: boolean
}
```

**ConditionSet** (interface)
```typescript
interface ConditionSet {
  id?: string
  type?: 'and' | 'or'
  conditions?: Condition[]
}
```

**UserLocation** (interface)
```typescript
interface UserLocation {
  country?: string
  latitude?: number
  longitude?: number
}
```

**PlatformInfo** (interface)
```typescript
interface PlatformInfo {
  android?: boolean
  ios?: boolean
  win?: boolean
  mac?: boolean
}
```

**StatsInfo** (interface)
```typescript
interface StatsInfo {
  version?: string | null
  platform?: PlatformInfo
  mobile?: boolean
}
```

**UserInfo** (interface)
```typescript
interface UserInfo {
  valid: boolean
  uid?: string
  location?: UserLocation
  groups?: string[]
}
```

**ProductInfo** (interface)
```typescript
interface ProductInfo {
  id: string
  tags?: Record<string, any>
  * Facet values assigned to this product.
  * Shape mirrors `ProductFacetMap`: a map of facet key → array of value objects.
  * Each value object must have at minimum a `key` string property.
  *
  * @example
  * ```ts
  * {
  *   material: [{ key: 'cotton', name: 'Cotton' }],
  *   certifications: [{ key: 'organic', name: 'Organic' }, { key: 'recycled', name: 'Recycled' }]
  * }
  * ```
  facets?: Record<string, Array<{ key: string; [k: string]: unknown }>>
}
```

**ProofInfo** (interface)
```typescript
interface ProofInfo {
  id?: string
  userId?: string
  claimable?: boolean
  virtual?: boolean
}
```

**CollectionInfo** (interface)
```typescript
interface CollectionInfo {
  id: string
  roles?: Record<string, any>
}
```

**ConditionParams** (interface)
```typescript
interface ConditionParams {
  condition?: ConditionSet
  conditionId?: string
  conditionStack?: string[]
  user?: UserInfo
  product?: ProductInfo
  proof?: ProofInfo
  collection?: CollectionInfo
  stats?: StatsInfo
  fetchCondition?: (collectionId: string, conditionId: string) => Promise<ConditionSet | null>
  getLocation?: () => Promise<{ latitude: number; longitude: number }>
  debugConditions?: boolean | ConditionDebugOptions
  [key: string]: any
}
```

**ConditionDebugOptions** (interface)
```typescript
interface ConditionDebugOptions {
  enabled?: boolean
  logger?: ConditionDebugLogger
  label?: string
}
```

**RegionKey** = `keyof typeof REGION_COUNTRIES`

**Condition** = ``

**ConditionDebugLogger** = `(...args: any[]) => void`

### paths (utils)

**PortalPathParams** (interface)
```typescript
interface PortalPathParams {
  collection: Collection | { shortId: string; portalUrl?: string }
  product?: Product
  productId?: string
  batch?: BatchResponse
  batchId?: string
  variant?: { id: string } | string
  proof?: Proof | string
  queryParams?: Record<string, string>
  pathOnly?: boolean
}
```

## API Functions

### analytics.admin

**summary**(collectionId: string,
      body: AnalyticsSummaryRequest) → `Promise<AnalyticsSummaryResponse>`

**timeseries**(collectionId: string,
      body: AnalyticsTimeseriesRequest) → `Promise<AnalyticsTimeseriesResponse>`

**breakdown**(collectionId: string,
      body: AnalyticsBreakdownRequest) → `Promise<AnalyticsBreakdownResponse>`

**events**(collectionId: string,
      body: AnalyticsEventsRequest) → `Promise<AnalyticsEventsResponse>`

**web**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsDashboardResponse>`

**clicks**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsDashboardResponse>`

**tagScans**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsDashboardResponse>`

**products**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsProductsResponse>`

**qrCodes**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsQrCodesResponse>`

**tags**(collectionId: string,
      body: LegacyAnalyticsRequest = {}) → `Promise<AnalyticsTagsResponse>`

**weekly**(collectionId: string,
      body: AnalyticsWeeklyRequest = {}) → `Promise<AnalyticsTimeseriesResponse>`

**country**(collectionId: string,
      body: AnalyticsCountryRequest = {}) → `Promise<AnalyticsBreakdownResponse>`

**topPages**(collectionId: string,
      body: AnalyticsClassicReportRequest = {}) → `Promise<AnalyticsBreakdownResponse>`

**topReferrers**(collectionId: string,
      body: AnalyticsClassicReportRequest = {}) → `Promise<AnalyticsBreakdownResponse>`

**topCampaigns**(collectionId: string,
      body: AnalyticsClassicReportRequest = {}) → `Promise<AnalyticsBreakdownResponse>`

**topSources**(collectionId: string,
      body: AnalyticsClassicReportRequest = {}) → `Promise<AnalyticsBreakdownResponse>`

**topDestinations**(collectionId: string,
      body: AnalyticsClassicReportRequest = {}) → `Promise<AnalyticsBreakdownResponse>`

### analytics.browser

**configure**(config: AnalyticsBrowserConfig) → `void`

**getSessionId**() → `AnalyticsSessionId | undefined`

**getVisitorId**() → `string | undefined`

**setVisitorId**(visitorId: string,
      options?: AnalyticsVisitorIdOptions) → `string`

**clearVisitorId**(options?: Pick<AnalyticsVisitorIdOptions, 'storage' | 'storageKey'>) → `void`

**captureCampaignParams**(search?: string) → `Partial<CollectionAnalyticsEvent>`

**setLocation**(location: TagAnalyticsEvent['location'] | null) → `void`

**clearLocation**() → `void`

**getLocation**() → `TagAnalyticsEvent['location'] | undefined`

**detectDevice**() → `CollectionAnalyticsEvent['deviceType']`

**captureLocation**(options: AnalyticsGeolocationCaptureOptions = {}) → `Promise<TagAnalyticsEvent['location'] | null>`

**trackCollection**(event: Partial<CollectionAnalyticsEvent>,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`

**trackTag**(event: Partial<TagAnalyticsEvent>,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`

**trackPageView**(event: Partial<CollectionAnalyticsEvent>,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`

**trackLinkClick**(event: AnalyticsLinkClickInput,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`

**trackTagScan**(event: Partial<TagAnalyticsEvent>,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`

**bindPageViews**(binding: AnalyticsPageViewBindingOptions = {}) → `() => void`

**bindLinkTracking**(binding: AnalyticsLinkBindingOptions = {}) → `() => void`

### analytics.collection

**track**(event: CollectionAnalyticsEvent,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`
Fire-and-forget collection analytics event. Uses `navigator.sendBeacon()` when available, falling back to `fetch(..., { keepalive: true })`.

### analytics.tag

**track**(event: TagAnalyticsEvent,
      options?: AnalyticsTrackOptions) → `AnalyticsTrackResult`
Fire-and-forget tag analytics event. Uses `navigator.sendBeacon()` when available, falling back to `fetch(..., { keepalive: true })`.

### app.cases

Workflow-oriented app objects for issues, requests, claims, and tasks that move through statuses and often need assignment or history.

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

### app.records

General-purpose structured app objects. Use these when a simple scoped data item grows into something queryable, lifecycle-aware, or access-controlled.

**create**(collectionId: string,
    appId: string,
    input: CreateRecordInput,
    admin: boolean = false) → `Promise<CreateRecordResponse>`
Create a new record POST /records When called on the public endpoint (admin = false) with an anonymous caller, and the app's `publicCreate.records.anonymous.edit.editToken` policy is enabled, the response includes a one-time `editToken` string. Store it immediately — it is never returned again.

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

**updateWithToken**(collectionId: string,
    appId: string,
    recordId: string,
    data: Record<string, unknown>,
    editToken: string) → `Promise<AppRecord>`
Amend the `data` zone of a record using an anonymous edit token. PATCH /records/:recordId  (public endpoint, no auth) This is the follow-up call after an anonymous `create()` that returned an `editToken`.  Present the token via `X-Edit-Token` — the server validates it with a constant-time comparison and, if `windowMinutes` is configured in the policy, checks that the token has not expired. **Scope:** only the `data` zone may be modified via this path. `owner`, `admin`, `status`, `visibility`, and indexed fields are immutable to anonymous token holders. ```ts const record = await app.records.create(collectionId, appId, { recordType: 'payment', visibility: 'public', data: { amount: 9900, currency: 'USD' }, }) const { editToken } = record  // store this immediately! // Later, once the payment gateway confirms: const updated = await app.records.updateWithToken( collectionId, appId, record.id, { amount: 9900, currency: 'USD', transactionId: 'txn_abc123' }, editToken, ) ``` ### Error codes | HTTP | `errorCode`           | Meaning                                           | |------|-----------------------|---------------------------------------------------| | 401  | `UNAUTHORIZED`        | No auth token and no `X-Edit-Token` header        | | 403  | `FORBIDDEN`           | Policy not enabled, or token does not match       | | 403  | `EDIT_WINDOW_EXPIRED` | `windowMinutes` elapsed since record creation     | | 404  | `NOT_FOUND`           | Record does not exist                             |

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

**restore**(collectionId: string,
    appId: string,
    recordId: string) → `Promise<AppRecord>`
Restore a soft-deleted record. POST /records/:recordId/restore (admin only)

**upsert**(collectionId: string,
    appId: string,
    input: UpsertRecordInput) → `Promise<UpsertRecordResponse>`
Upsert a record by ref — creates if no record with that ref exists, otherwise updates. Scope, specificity, and ref are canonicalized on write. POST /records/upsert (admin only)

**match**(collectionId: string,
    appId: string,
    input: MatchRecordsInput,
    admin: boolean = false) → `Promise<MatchResult>`
Match records against a runtime target scope. Returns records whose scope is satisfied by the target, ordered by specificity descending (most specific first). POST /records/match ```ts const { records, best } = await app.records.match(collectionId, appId, { target: { productId: 'prod_abc', facets: { tier: ['gold'] } }, strategy: 'best', recordType: 'nutrition', }, true); // best.nutrition → the single highest-specificity nutrition record ```

**bulkUpsert**(collectionId: string,
    appId: string,
    records: BulkUpsertItem[]) → `Promise<BulkUpsertResult>`
Upsert up to 500 records in a single transaction. Each row is individually error-isolated — a failure on one row does not abort the others. POST /records/bulk-upsert (admin only)

**bulkDelete**(collectionId: string,
    appId: string,
    input: BulkDeleteInput) → `Promise<BulkDeleteResult>`
Soft-delete records in bulk. Supports two modes: - **refs mode**: explicit list of refs (max 1000) - **scope mode**: delete by scope anchor (productId / variantId / etc.) POST /records/bulk-delete (admin only) ```ts // Refs mode await app.records.bulkDelete(collectionId, appId, { refs: ['product:prod_abc', 'product:prod_xyz'], recordType: 'nutrition', }); // Scope mode await app.records.bulkDelete(collectionId, appId, { scope: { productId: 'prod_abc' }, }); ```

**resolveAll**(collectionId: string,
    appId: string,
    input: ResolveAllParams,
    admin: boolean = false) → `Promise<ResolveAllResult>`
Resolve every applicable record for a product context in one call. Returns records across all tiers (proof, batch, variant, product, rule, facet, collection) deduplicated and sorted by specificity descending. POST /records/resolve-all

**previewRule**(collectionId: string,
    appId: string,
    input: PreviewRuleParams) → `Promise<PreviewRuleResult>`
Preview which products in the collection match a given facetRule. Admin only. Use for live "matches N products" feedback while authoring a rule. POST /records/preview-rule

### app.threads

Conversation-oriented app objects for comments, discussions, Q&A, and reply-driven experiences.

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

### appConfiguration

Scoped config and keyed data items for collections, products, variants, or batches. Best for settings and small standalone documents, not as the default answer for every app-owned entity.

**getConfig**(opts: AppConfigOptions) → `Promise<any>`
Get app configuration for a collection/product scope. Public reads return the public view of the config. If the stored config contains a top-level `admin` object, that block is omitted from public responses and included when `opts.admin === true`. ```typescript const config = await appConfiguration.getConfig({ appId: 'warranty-portal', collectionId: 'my-collection' }); ```

**getWidgetInstance**(opts: GetWidgetInstanceOptions) → `Promise<WidgetInstance<TWidget>>`
Resolve a configured widget instance by ID from an app's stored config. This is a thin convenience wrapper over `getConfig()` that reads `config.widgets[widgetId]`. ```typescript const widget = await appConfiguration.getWidgetInstance({ collectionId: 'my-collection', appId: 'widget-toolkit', widgetId: 'launch-countdown' }) ```

**listWidgetInstances**(opts: Omit<GetWidgetInstanceOptions, 'widgetId'>) → `Promise<WidgetInstanceSummary[]>`
List configured widget instances for an app. Useful for picker UIs, setup schemas, and widget-to-widget references. ```typescript const widgets = await appConfiguration.listWidgetInstances({ collectionId: 'my-collection', appId: 'widget-toolkit' }) ```

**setConfig**(opts: AppConfigOptions) → `Promise<any>`
Set app configuration for a collection/product scope. Requires admin authentication. Writing through the admin endpoint does not make every root-level field private. Use `config.admin` for confidential values that should only be returned on admin reads. ```typescript await appConfiguration.setConfig({ appId: 'warranty-portal', collectionId: 'my-collection', admin: true, config: { warrantyPeriod: 24, supportEmail: 'support@example.com' } }); ```

**deleteConfig**(opts: AppConfigOptions) → `Promise<void>`
Delete app configuration for a collection/product scope. Requires admin authentication. ```typescript await appConfiguration.deleteConfig({ appId: 'warranty-portal', collectionId: 'my-collection', admin: true }); ```

**getData**(opts: AppConfigOptions) → `Promise<any[]>`
Get all keyed data items for an app within a scope. Best for a small set of standalone documents such as FAQs, menus, lookup tables, or content fragments where the caller typically knows the item IDs. If you are modelling richer app entities that need filtering, lifecycle fields, visibility, ownership, or relationships, prefer `app.records`, `app.cases`, or `app.threads` instead. ```typescript const items = await appConfiguration.getData({ appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123' }); ```

**getDataItem**(opts: AppConfigOptions) → `Promise<any>`
Get a single keyed data item by ID within a scope. This is ideal when you already know the exact ID of a simple scoped document. For richer domain objects that users browse or query, prefer `app.records`, `app.cases`, or `app.threads`. ```typescript const item = await appConfiguration.getDataItem({ appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123', itemId: 'manual-1' }); ```

**setDataItem**(opts: AppConfigOptions) → `Promise<any>`
Set/create a keyed data item within a scope. Requires admin authentication. Use this for simple scoped documents attached to a collection/product/variant/batch, especially when you want a small number of items with stable IDs. Do not treat this as the default write path for every app-owned entity. If the data starts behaving like a real object with lifecycle, filtering, visibility, ownership, history, or relationships, prefer `app.records`, `app.cases`, or `app.threads`. ```typescript await appConfiguration.setDataItem({ appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123', admin: true, data: { id: 'manual-1', title: 'User Manual', url: 'https://...' } }); ```

**deleteDataItem**(opts: AppConfigOptions) → `Promise<void>`
Delete a keyed data item by ID within a scope. Requires admin authentication. ```typescript await appConfiguration.deleteDataItem({ appId: 'product-docs', collectionId: 'my-collection', productId: 'product-123', admin: true, itemId: 'manual-1' }); ```

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
Update an attestation. via `attestations.create()` with a note in `metadata` instead.

**remove**(collectionId: string,
    productId: string,
    proofId: string,
    attestationId: string) → `Promise<void>`
Delete an attestation. Use `attestations.create()` to append a corrective/superseding record instead.

### attestations

**create**(collectionId: string,
    data: CreateAttestationInput) → `Promise<Attestation>`
Create a single attestation (admin). `attestationType` are required ```typescript const a = await attestations.create('coll_123', { subjectType:     'container', subjectId:       'uuid-of-cask', attestationType: 'temperature', recordedAt:      '2025-04-15T14:30:00Z', value:           { celsius: 12.4 }, ownerData:       { sensorId: 'TEMP-7' }, unit:            '°C', visibility:      'public', }) ```

**createBatch**(collectionId: string,
    items: CreateAttestationInput[]) → `Promise<Attestation[]>`
Batch-create attestations (admin). Sends an array of `CreateAttestationInput` objects in a single request. The server processes them atomically and returns the created records. ```typescript const records = await attestations.createBatch('coll_123', [ { subjectType: 'container', subjectId: 'uuid1', attestationType: 'temperature', value: { celsius: 12.4 } }, { subjectType: 'container', subjectId: 'uuid1', attestationType: 'humidity',    value: { rh: 68 } }, ]) ```

**list**(collectionId: string,
    params: ListAttestationsParams) → `Promise<ListAttestationsResponse>`
List attestations for a subject (admin). Returns all three data zones. Supports filtering by type and date range. ```typescript const { attestations: records } = await attestations.list('coll_123', { subjectType: 'container', subjectId:   'uuid-of-cask', attestationType: 'temperature', recordedAfter:   '2025-01-01T00:00:00Z', limit: 50, }) ```

**summary**(collectionId: string,
    params: AttestationSummaryParams) → `Promise<AttestationSummaryResponse>`
Time-series summary of attestations (admin). Aggregates attestation counts (and optionally a numeric `value` field) into time buckets.  Useful for charting trends. `attestationType` are required ```typescript const { summary } = await attestations.summary('coll_123', { subjectType:     'container', subjectId:       'uuid-of-cask', attestationType: 'temperature', valueField:      'celsius', groupBy:         'day', recordedAfter:   '2025-01-01T00:00:00Z', }) ```

**latest**(collectionId: string,
    params: AttestationLatestParams) → `Promise<AttestationLatestResponse>`
Latest snapshot — one record per `attestationType` (admin). Returns the most-recent attestation for each type recorded against this subject.  Ideal for dashboards that show the current state of a container. ```typescript const { latest } = await attestations.latest('coll_123', { subjectType: 'container', subjectId:   'uuid-of-fridge', }) // latest[0].attestationType === 'temperature' // latest[0].latest.value === { celsius: 4.1 } ```

**verify**(collectionId: string,
    params: AttestationVerifyParams) → `Promise<ChainVerifyResult>`
Verify the hash chain for a `(subjectType, subjectId, attestationType)` tuple (admin). Re-computes each `contentHash` and confirms it matches the stored value and correctly references the previous record's hash.  A `valid: false` result with `failedAt` indicates the first broken link. ```typescript const result = await attestations.verify('coll_123', { subjectType:     'container', subjectId:       'uuid-of-cask', attestationType: 'temperature', }) if (!result.valid) { console.warn('Chain broken at', result.failedAt) } ```

**treeSummary**(collectionId: string,
    params: AttestationTreeSummaryParams) → `Promise<AttestationTreeSummaryResponse>`
Tree time-series summary — aggregates across an entire container subtree (admin). Performs a BFS traversal of the container hierarchy rooted at `subjectId`, collects all descendant container IDs (and optionally their items), then aggregates attestations across all of them. `subjectType` is implicitly `'container'` ```typescript const { summary, subjectCount } = await attestations.treeSummary('coll_123', { subjectId:       'root-warehouse-uuid', attestationType: 'temperature', valueField:      'celsius', groupBy:         'hour', includeItems:    true, }) console.log(`Aggregated over ${subjectCount} subjects`) ```

**treeLatest**(collectionId: string,
    params: AttestationTreeLatestParams) → `Promise<AttestationTreeLatestResponse>`
Tree latest snapshot — most-recent record per type across a container subtree (admin). Same BFS traversal as `treeSummary`, but returns the most-recent record per `attestationType` aggregated across the entire subtree.

**publicList**(collectionId: string,
    params: ListAttestationsParams) → `Promise<PublicListAttestationsResponse>`
List attestations for a subject (public). Records with `visibility='admin'` are always excluded. Records with `visibility='owner'` are included only when the caller provides a valid Firebase ID token that resolves to the subject owner. The `audience` field in the response indicates the tier that was served. ```typescript const { attestations: records, audience } = await attestations.publicList('coll_123', { subjectType: 'proof', subjectId:   'proof-uuid', }) ```

**publicSummary**(collectionId: string,
    params: AttestationSummaryParams) → `Promise<PublicAttestationSummaryResponse>`
Time-series summary (public). Always served at `audience='public'`.  Same parameters as the admin version. `attestationType` are required

**publicLatest**(collectionId: string,
    params: AttestationLatestParams) → `Promise<PublicAttestationLatestResponse>`
Latest snapshot per `attestationType` (public). Owner elevation applies — provide a Firebase ID token for owner-tier data.

**publicTreeSummary**(collectionId: string,
    params: AttestationTreeSummaryParams) → `Promise<PublicAttestationTreeSummaryResponse>`
Tree time-series summary (public). Always served at `audience='public'`.  Performs the same BFS traversal as the admin version but only includes publicly visible attestations.

**publicTreeLatest**(collectionId: string,
    params: AttestationTreeLatestParams) → `Promise<PublicAttestationTreeLatestResponse>`
Tree latest snapshot (public).

**publicContainerList**(collectionId: string,
    containerId: string,
    params?: Omit<ListAttestationsParams, 'subjectType' | 'subjectId'>) → `Promise<PublicListAttestationsResponse>`
List attestations for a specific container (public shortcut). Equivalent to `publicList` with `subjectType='container'` and `subjectId=containerId` pre-filled.

**publicContainerSummary**(collectionId: string,
    containerId: string,
    params: Omit<AttestationSummaryParams, 'subjectType' | 'subjectId'>) → `Promise<PublicAttestationSummaryResponse>`
Time-series summary for a specific container (public shortcut).

**publicContainerLatest**(collectionId: string,
    containerId: string) → `Promise<PublicAttestationLatestResponse>`
Latest snapshot for a specific container (public shortcut).

**publicContainerTreeSummary**(collectionId: string,
    containerId: string,
    params: Omit<AttestationTreeSummaryParams, 'subjectId'>) → `Promise<PublicAttestationTreeSummaryResponse>`
Tree time-series summary rooted at a specific container (public shortcut).

**publicContainerTreeLatest**(collectionId: string,
    containerId: string,
    params?: Pick<AttestationTreeLatestParams, 'includeItems'>) → `Promise<PublicAttestationTreeLatestResponse>`
Tree latest snapshot rooted at a specific container (public shortcut).

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

**getLocation**(options: AuthLocationCacheOptions = {}) → `Promise<AuthLocation>`
Gets a best-effort coarse location for the current anonymous caller. This endpoint is typically IP-derived and is useful when the user is not logged in but you still want country/location context for content rules, analytics enrichment, or regional defaults. Returns fields such as `country`, `latitude`, `longitude`, and `area` when available. By default the result is cached in session storage for 30 minutes so apps can reuse coarse location context without repeatedly hitting the endpoint.

**clearCachedLocation**(storageKey: string = DEFAULT_AUTH_LOCATION_CACHE_KEY) → `void`
Clears the cached anonymous auth location, if present.

**getAccount**() → `Promise<AccountInfoResponse>`
Gets current account information for the logged in user. Returns user, owner, account, and location objects. When the caller is authenticated, prefer `account.location` from this response. For anonymous callers, use `auth.getLocation()` instead. Short-circuits immediately (no network request) when the SDK has no bearer token or API key set — the server would return 401 anyway. Throws a `SmartlinksApiError` with `statusCode 401` and `details.local = true` so callers can distinguish "never authenticated" from an actual server-side token rejection. This short-circuit is skipped when proxy mode is enabled, because in that case credentials are held by the parent frame and the local SDK may have no token set yet — the request must be forwarded to the parent to determine whether the user is authenticated.

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

### chat.completions

**create**(collectionId: string,
        request: ChatCompletionRequest) → `Promise<ChatCompletionResponse | AsyncIterable<ChatCompletionChunk>>`
Create a chat completion (streaming or non-streaming)

### chat.responses

**create**(collectionId: string,
        request: ResponsesRequest) → `Promise<ResponsesResult | AsyncIterable<ResponsesStreamEvent>>`
Create a Responses API request (streaming or non-streaming)

### claimSet

**getAll**(collectionId?: string) → `Promise<any[]>`
Get all claim sets. When collectionId is provided, returns claim sets for that collection. When omitted, returns all claim sets owned by the authenticated user.

**get**(claimSetId: string, collectionId?: string) → `Promise<any>`
Get a specific claim set by ID.

**create**(params: CreateClaimSetRequest, collectionId?: string) → `Promise<any>`
Create a new claim set. When collectionId is provided, creates it scoped to that collection. When omitted, creates a global user-owned claim set.

**update**(claimSetId: string, params: any, collectionId?: string) → `Promise<any>`
Update a claim set.

**remove**(claimSetId: string, collectionId?: string) → `Promise<any>`
Delete (soft-delete) a claim set.

**getAllTags**(claimSetId: string, collectionId?: string) → `Promise<any>`
Get all tags for a claim set (including data).

**getAssignedTags**(claimSetId: string, collectionId?: string) → `Promise<any>`
Get assigned tags for a claim set — tags soft-assigned to a collection or product.

**createTag**(claimSetId: string,
    data: CreateClaimSetTagRequest,
    collectionId?: string) → `Promise<CreateClaimSetTagResponse>`
Create a single tag inside a claim set.

**importTags**(claimSetId: string,
    data: ImportClaimSetTagsRequest,
    collectionId?: string) → `Promise<ImportClaimSetTagsResponse>`
Bulk import tags into a claim set.

**getReport**(collectionId: string, claimSetId: string) → `Promise<any>`
Get a report for a claim set (collection-scoped).

**getTagSummary**(collectionId: string) → `Promise<any>`
Get tag summary for a collection.

**tagQuery**(collectionId: string, data: any) → `Promise<any>`
Perform a tag query for a collection.

**makeClaim**(collectionId: string, params: any) → `Promise<any>`
Make a claim against a claim set (collection-scoped).

**assignClaims**(collectionId: string, data: AssignClaimsRequest) → `Promise<any>`
Assign claims to codes or ranges within a collection.

**updateClaimData**(collectionId: string, data: UpdateClaimDataRequest) → `Promise<any>`
Update claim data for a claim set (collection-scoped).

### collection

**get**(collectionId: string, admin?: boolean) → `Promise<CollectionResponse>`
Retrieves a single Collection by its ID.

**list**(admin?: boolean) → `Promise<CollectionResponse[]>`
Retrieves all Collections.

**getShortId**(shortId: string) → `Promise<CollectionResponse>`
Retrieve a collection by its shortId (public endpoint).

**getSettings**(collectionId: string, settingGroup: string, admin?: boolean) → `Promise<any>`
Retrieve a specific settings group for a collection. Public reads return the public view of the settings group. If the stored payload contains a top-level `admin` object, that block is omitted from public responses and included when `admin === true`.

**getAppsConfig**(collectionId: string) → `Promise<AppsConfigResponse>`
Retrieve all configured app module definitions for a collection (public endpoint).

**updateSettings**(collectionId: string, settingGroup: string, settings: any) → `Promise<any>`
Update a specific settings group for a collection (admin endpoint). This writes through the admin endpoint, but root-level fields are still part of the public settings payload. Put confidential values under `settings.admin` if they should only be returned on admin reads.

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
Send a single transactional message to one contact using a template. No broadcast record is created. The send is logged to the contact's communication history with sourceType: 'transactional'. POST /admin/collection/:collectionId/comm.send ```typescript const result = await comms.sendTransactional(collectionId, { contactId:  'e4f2a1b0-...', templateId: 'warranty-update', channel:    'preferred', props:      { claimRef: 'CLM-0042', decision: 'approved' }, include:    { productId: 'prod-abc123', appCase: 'c9d1e2f3-...' }, ref:        'warranty-decision-notification', appId:      'warrantyApp', }) if (result.ok) { console.log(`Sent via ${result.channel}`, result.messageId) } else { console.error('Send failed:', result.error) } ```

**logCommunicationEvent**(collectionId: string,
    body: LogCommunicationEventBody) → `Promise<AppendResult>`
Logging: Append a single communication event. POST /admin/collection/:collectionId/comm/log

**logBulkCommunicationEvents**(collectionId: string,
    body: LogBulkCommunicationEventsBody | ({ sourceId: string; ids: string[]; idField?: 'userId'|'contactId'; [k: string]: any }) → `void`
Logging: Append many communication events for a list of IDs. POST /admin/collection/:collectionId/comm/log/bulk

### config

**getFields**() → `Promise<FieldDefinition[]>`
Returns the full platform field catalog. Fields are used as building blocks for proof type templates — they define the input widgets shown when creating or editing products and proof items. **Endpoint:** `GET /api/v1/public/config/fields`

**getProofTypes**() → `Promise<ProofTypeDefinition[]>`
Returns all proof type definitions. Proof types are templates that specify which fields to show, which apps are pre-installed, and how the portal behaves for a given product category. **Endpoint:** `GET /api/v1/public/config/proofTypes`

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

### containers

**create**(collectionId: string,
    data: CreateContainerInput) → `Promise<Container>`
Create a new container (admin). ```typescript const cask = await containers.create('coll_123', { containerType: 'cask', ref:           'CASK-0042', name:          'Cask 42 — Single Malt', metadata:      { distilleryYear: 2019, capacity: 200 }, }) ```

**list**(collectionId: string,
    params?: ListContainersParams) → `Promise<ListContainersResponse>`
List containers (admin). Supports filtering by type, status, ref, parent, and top-level flag. ```typescript // All active pallets const { containers: pallets } = await containers.list('coll_123', { containerType: 'pallet', status:        'active', limit:         50, }) // Top-level containers only const { containers: roots } = await containers.list('coll_123', { topLevel: true }) ```

**findForItem**(collectionId: string,
    params: FindContainersForItemParams) → `Promise<FindContainersForItemResponse>`
Reverse lookup — find all containers currently holding a specific item (admin). ```typescript const { containers: holding } = await containers.findForItem('coll_123', { itemType: 'proof', itemId:   'proof-uuid', }) ```

**get**(collectionId: string,
    containerId: string,
    params?: GetContainerParams) → `Promise<Container>`
Get a single container by ID (admin). Pass `?tree=true` to recursively embed children, and/or `?includeContents=true` to embed the current item list. ```typescript // Flat const cask = await containers.get('coll_123', 'cask-uuid') // Full tree with contents const tree = await containers.get('coll_123', 'warehouse-uuid', { tree:            true, treeDepth:       3, includeContents: true, }) ```

**update**(collectionId: string,
    containerId: string,
    data: UpdateContainerInput) → `Promise<Container>`
Partially update a container (admin). Only fields present in the request body are modified. Pass `parentContainerId: null` to promote a container to top-level. ```typescript const updated = await containers.update('coll_123', 'cask-uuid', { status:   'archived', metadata: { bottledAt: '2025-04-01' }, }) ```

**remove**(collectionId: string,
    containerId: string) → `Promise<`
Soft-delete a container (admin). Sets `deletedAt`; the record and its full item history remain queryable by admins.  Public API responses automatically exclude deleted containers.

**listItems**(collectionId: string,
    containerId: string,
    params?: ListContainerItemsParams) → `Promise<ContainerItemsResponse>`
List items currently (or historically) inside a container (admin). Pass `history: true` to include removed items and see the full membership log. ```typescript // Current contents const { items } = await containers.listItems('coll_123', 'cask-uuid') // Full history including removed items const { items: history } = await containers.listItems('coll_123', 'cask-uuid', { history: true }) ```

**addItems**(collectionId: string,
    containerId: string,
    data: AddContainerItemsInput) → `Promise<AddContainerItemsResponse>`
Add one or more items to a container (admin). Each item requires `itemType` and `itemId`.  Pass `productId` / `proofId` for denormalisation convenience. ```typescript const { items } = await containers.addItems('coll_123', 'pallet-uuid', { items: [ { itemType: 'tag',   itemId: 'NFC-00AABBCC' }, { itemType: 'proof', itemId: 'proof-uuid', productId: 'product-id' }, ], }) ```

**removeItems**(collectionId: string,
    containerId: string,
    data: RemoveContainerItemsInput) → `Promise<RemoveContainerItemsResponse>`
Soft-remove items from a container (admin). Sets `removedAt` on the specified `ContainerItem` records.  The records are retained in the history log and can be queried with `history: true`. ```typescript const result = await containers.removeItems('coll_123', 'pallet-uuid', { ids: ['container-item-uuid-1', 'container-item-uuid-2'], }) console.log(`Removed ${result.removedCount} items`) ```

**publicList**(collectionId: string,
    params?: ListContainersParams) → `Promise<PublicListContainersResponse>`
List containers (public). Soft-deleted containers and containers with `metadata.publicListing === false` are excluded from results.

**publicGet**(collectionId: string,
    containerId: string,
    params?: GetContainerParams) → `Promise<Container>`
Get a single container (public). Soft-deleted containers return a 404.  Same `?tree` and `?includeContents` options as the admin version.

**publicListItems**(collectionId: string,
    containerId: string,
    params?: Pick<ListContainerItemsParams, 'limit' | 'offset'>) → `Promise<ContainerItemsResponse>`
List current contents of a container (public). Returns only items where `removedAt` is null.  No `?history` option on the public side.

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

### facets

**list**(collectionId: string,
    params?: FacetListParams) → `Promise<FacetListResponse>`

**create**(collectionId: string,
    data: FacetDefinitionWriteInput) → `Promise<FacetDefinition>`

**get**(collectionId: string,
    facetKey: string,
    params?: FacetGetParams) → `Promise<FacetDefinition>`

**update**(collectionId: string,
    facetKey: string,
    data: FacetDefinitionWriteInput) → `Promise<FacetDefinition>`

**remove**(collectionId: string,
    facetKey: string) → `Promise<void>`

**listValues**(collectionId: string,
    facetKey: string,
    params?: FacetValueListParams) → `Promise<FacetValueListResponse>`

**createValue**(collectionId: string,
    facetKey: string,
    data: FacetValueWriteInput) → `Promise<FacetValueResponse>`

**getValue**(collectionId: string,
    facetKey: string,
    valueKey: string,
    params?: FacetValueGetParams) → `Promise<FacetValueResponse>`

**updateValue**(collectionId: string,
    facetKey: string,
    valueKey: string,
    data: FacetValueWriteInput) → `Promise<FacetValueResponse>`

**removeValue**(collectionId: string,
    facetKey: string,
    valueKey: string) → `Promise<void>`

**query**(collectionId: string,
    body: FacetQueryRequest) → `Promise<FacetQueryResponse>`

**publicList**(collectionId: string,
    params?: PublicFacetListParams) → `Promise<FacetListResponse>`

**publicGet**(collectionId: string,
    facetKey: string,
    params?: PublicFacetListParams) → `Promise<FacetDefinition>`

**publicListValues**(collectionId: string,
    facetKey: string) → `Promise<FacetValueListResponse>`

**publicGetValue**(collectionId: string,
    facetKey: string,
    valueKey: string) → `Promise<FacetValueResponse>`

**publicQuery**(collectionId: string,
    body: FacetQueryRequest) → `Promise<FacetQueryResponse>`

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

### http

**get**(path: string) → `Promise<T>`
Perform a GET request to any API endpoint. const fields = await http.get<FieldDefinition[]>('/public/config/fields')

**post**(path: string, body: any) → `Promise<T>`
Perform a POST request to any API endpoint. const result = await http.post('/public/app/eticket/uploadTickets', { collectionId, productId, appId, data, })

**put**(path: string, body: any) → `Promise<T>`
Perform a PUT request to any API endpoint.

**patch**(path: string, body: any) → `Promise<T>`
Perform a PATCH request to any API endpoint.

**del**(path: string) → `Promise<T>`
Perform a DELETE request to any API endpoint.

### interactions

**query**(collectionId: string,
    body: AdminInteractionsQueryRequest) → `Promise<InteractionEventRow[]>`
POST /admin/collection/:collectionId/interactions/query Flexible query for interaction events with optional includes.

**countsByOutcome**(collectionId: string,
    query: AdminInteractionsCountsByOutcomeRequest = {}) → `Promise<OutcomeCount[]>`
POST /admin/collection/:collectionId/interactions/counts-by-outcome Returns array of { outcome, count }.

**aggregate**(collectionId: string,
    body: AdminInteractionsAggregateRequest) → `Promise<AdminInteractionsAggregateResponse>`
POST /admin/collection/:collectionId/interactions/aggregate Returns grouped numeric aggregates (sum, avg, min, max, count).

**aggregateByOutcome**(collectionId: string,
    body: AdminInteractionsAggregateRequest) → `Promise<AdminInteractionsAggregateResponse>`
Legacy-friendly alias for aggregate().

**appendEvent**(collectionId: string,
    body: AppendInteractionBody) → `Promise<`
POST /admin/collection/:collectionId/interactions/append Appends one interaction event.

**updateEvent**(collectionId: string,
    body: UpdateInteractionBody) → `Promise<`
POST /admin/collection/:collectionId/interactions/append Appends one interaction event.

**submitPublicEvent**(collectionId: string,
    body: AppendInteractionBody) → `Promise<SubmitInteractionResponse | SubmitInteractionError>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

**create**(collectionId: string,
    body: CreateInteractionTypeBody) → `Promise<InteractionTypeRecord>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

**list**(collectionId: string,
    query: ListInteractionTypesQuery = {}) → `Promise<InteractionTypeList>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

**get**(collectionId: string,
    id: string) → `Promise<InteractionTypeRecord>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

**update**(collectionId: string,
    id: string,
    patchBody: UpdateInteractionTypeBody) → `Promise<InteractionTypeRecord>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

**remove**(collectionId: string,
    id: string) → `Promise<void>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

**publicCountsByOutcome**(collectionId: string,
    body: PublicInteractionsCountsByOutcomeRequest,
    authToken?: string) → `Promise<OutcomeCount[]>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

**publicMyInteractions**(collectionId: string,
    body: PublicInteractionsByUserRequest,
    authToken?: string) → `Promise<InteractionEventRow[]>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

**publicList**(collectionId: string,
    query: ListInteractionTypesQuery = {}) → `Promise<InteractionTypeList>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

**publicGet**(collectionId: string,
    id: string) → `Promise<InteractionTypeRecord>`
POST /api/v1/public/collection/:collectionId/interactions/submit Submits an interaction event from a public/client-side context. When the interaction has `allowAnonymousSubmit: true`, neither `userId` nor `contactId` is required. Pass `anonId` inside `metadata` to enable device-level deduplication via `uniquePerAnonId`.

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

### loyalty

Loyalty programmes built on top of collections. Configure schemes and earning rules; contacts earn points automatically via interaction events. See the [Loyalty guide](loyalty.md) for the full walkthrough.

**list**(collectionId: string,
    params: { includeDeleted?: boolean } = {}) → `Promise<LoyaltyScheme[]>`

**get**(collectionId: string,
    schemeId: string) → `Promise<LoyaltyScheme>`

**create**(collectionId: string,
    body: CreateLoyaltySchemeBody) → `Promise<LoyaltyScheme>`

**update**(collectionId: string,
    schemeId: string,
    body: UpdateLoyaltySchemeBody) → `Promise<LoyaltyScheme>`

**remove**(collectionId: string,
    schemeId: string) → `Promise<LoyaltyScheme>`

**listEarningRules**(collectionId: string,
    schemeId: string) → `Promise<LoyaltyEarningRule[]>`

**getEarningRule**(collectionId: string,
    schemeId: string,
    ruleId: string) → `Promise<LoyaltyEarningRule>`

**createEarningRule**(collectionId: string,
    schemeId: string,
    body: CreateLoyaltyEarningRuleBody) → `Promise<LoyaltyEarningRule>`

**updateEarningRule**(collectionId: string,
    schemeId: string,
    ruleId: string,
    body: UpdateLoyaltyEarningRuleBody) → `Promise<LoyaltyEarningRule>`

**removeEarningRule**(collectionId: string,
    schemeId: string,
    ruleId: string) → `Promise<LoyaltyEarningRule>`

**listMembers**(collectionId: string,
    schemeId: string,
    params: LoyaltyPaginationParams = {}) → `Promise<LoyaltyPaginatedResult<LoyaltyMember>>`

**getMember**(collectionId: string,
    schemeId: string,
    contactId: string) → `Promise<LoyaltyMember>`

**recordTransaction**(collectionId: string,
    schemeId: string,
    contactId: string,
    body: RecordLoyaltyTransactionBody) → `Promise<LoyaltyTransactionResult>`
Manually award or deduct points for a contact. - `points` must be a non-zero integer - Positive = award, negative = deduct - Deducting below zero returns HTTP 422 `INSUFFICIENT_BALANCE` - Supply `idempotencyKey` to safely retry without double-crediting Points earned via interaction events are awarded automatically by the server — this endpoint is for manual adjustments and admin overrides.

**getMemberHistory**(collectionId: string,
    schemeId: string,
    contactId: string,
    params: LoyaltyPaginationParams = {}) → `Promise<LoyaltyPaginatedResult<LoyaltyTransaction>>`
Manually award or deduct points for a contact. - `points` must be a non-zero integer - Positive = award, negative = deduct - Deducting below zero returns HTTP 422 `INSUFFICIENT_BALANCE` - Supply `idempotencyKey` to safely retry without double-crediting Points earned via interaction events are awarded automatically by the server — this endpoint is for manual adjustments and admin overrides.

**publicList**(collectionId: string) → `Promise<LoyaltyScheme[]>`
List active schemes for a collection. No authentication required.

**publicGet**(collectionId: string,
    schemeId: string) → `Promise<LoyaltyScheme>`
Get a single active scheme. No authentication required.

**publicListEarningRules**(collectionId: string,
    schemeId: string) → `Promise<LoyaltyEarningRule[]>`
List active earning rules for a scheme — useful for showing "how to earn" in a loyalty UI. No authentication required.

**publicGetMe**(collectionId: string) → `Promise<LoyaltySchemeWithMembership[]>`
Get all active schemes with the caller's membership embedded in each. This is the primary entry point for a loyalty widget — one call gives you everything needed to render a user's loyalty status across all programs in a collection. - Authenticated: `member` is populated with balance + lifetimePoints (or null if not yet enrolled in that scheme) - Unauthenticated: `member` is null on all schemes

**publicGetMine**(collectionId: string,
    schemeId: string) → `Promise<LoyaltyMember>`
Get the authenticated caller's membership (balance + lifetimePoints) on a specific scheme. Requires authentication.

**publicGetMineHistory**(collectionId: string,
    schemeId: string,
    params: LoyaltyPaginationParams = {}) → `Promise<LoyaltyPaginatedResult<LoyaltyTransaction>>`
Get the authenticated caller's transaction history on a specific scheme. Ordered newest first. Requires authentication.

### models

**list**(collectionId: string, params?: AIModelListParams) → `Promise<AIModelListResponse>`
List available AI models

**get**(collectionId: string, modelId: string) → `Promise<AIModel>`
Get specific model information

### navigation

**resolveLink**(link: LinkTarget, ctx: ResolveLinkContext = {}) → `ResolvedLink`
Resolve a stored `LinkTarget` into an executable navigation action. The resolver handles the embedded/standalone distinction automatically: | Kind              | Embedded (container/widget/iframe)                            | Standalone        | |-------------------|---------------------------------------------------------------|-------------------| | `external _blank` | `window.open(url, '_blank', 'noopener,noreferrer')`           | same              | | `external _self`  | `window.location.assign(url)`                                 | same              | | `app` / `deep`    | `postMessage` to parent shell; shell appends context params   | hash-route assign | Context params (`collectionId`, `productId`, `proofId`, etc.) are **not** included in the message payload — the parent SmartLinks shell owns them and appends them before broadcasting the navigation event. const r = SL.navigation.resolveLink(config.ctaLink); r.navigate();                // perform navigation button.ariaLabel = r.describe();  // human-readable label

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
Advanced query for orders with order-level and item-level filtering. More powerful than the basic list() function. ```typescript // Find pending orders created in January 2026 const result = await order.query('coll_123', { query: { status: 'pending', createdAfter: '2026-01-01T00:00:00Z', createdBefore: '2026-02-01T00:00:00Z', sortBy: 'createdAt', sortOrder: 'desc' }, limit: 50 }) // Find orders with specific metadata and item count const highPriority = await order.query('coll_123', { query: { metadata: { priority: 'high' }, minItemCount: 10, maxItemCount: 100 }, includeItems: true }) // Find orders containing a specific product batch const batchOrders = await order.query('coll_123', { query: { productId: 'prod_789', batchId: 'BATCH-2024-001' }, includeItems: true }) // Find an order containing one of several specific items const matched = await order.query('coll_123', { query: { items: [ { itemType: 'tag', itemId: 'TAG001' }, { itemType: 'serial', itemId: 'SN12345' } ] }, includeItems: true }) ```

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

**findOrdersByProduct**(collectionId: string,
    productId: string,
    params?: FindOrdersByAttributeParams) → `Promise<FindOrdersByAttributeResponse>`
Find all orders containing items from a specific product. Uses indexed queries for fast lookups across order items. ```typescript // Find all orders containing a product const { orders, limit, offset } = await order.findOrdersByProduct('coll_123', 'prod_789', { limit: 100 }) console.log(`Product appears in ${orders.length} orders`) ```

**findItemsByProduct**(collectionId: string,
    productId: string,
    params?: FindItemsByAttributeParams) → `Promise<FindItemsByAttributeResponse>`
Get individual order items for a specific product. Returns all matching items with optional order summary. ```typescript // Get all items for a product const { items } = await order.findItemsByProduct('coll_123', 'prod_789', { includeOrder: true }) console.log(`Product delivered in ${items.length} order items`) ```

**getOrderIdsByAttribute**(collectionId: string,
    attribute: 'productId',
    value: string,
    params?: GetOrderIdsParams) → `Promise<GetOrderIdsResponse>`
Get unique order IDs containing items for a specific product. Lightweight query that only returns order IDs, not full order objects. ```typescript // Get order IDs for a product const productOrders = await order.getOrderIdsByAttribute( 'coll_123', 'productId', 'prod_789', { limit: 500 } ) ```

### podcast

**generate**(collectionId: string,
      request: GeneratePodcastRequest) → `Promise<GeneratePodcastResponse>`
Generate a NotebookLM-style conversational podcast from product documents

**getStatus**(collectionId: string, podcastId: string) → `Promise<PodcastStatus>`
Get podcast generation status

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
Create a new product for a collection (admin only). The `data` payload follows the same shape as ProductResponse minus `id` and `collectionId`. **Hero Image Auto-Fetch:** You can pass `heroImage` as either: - A full asset object: `{ url: '...', thumbnails: {...} }` - A string URL: The system automatically fetches and stores the image ```typescript // Using a URL - auto-fetched and stored const product = await product.create(collectionId, { name: 'Wine Bottle', description: 'Premium red wine', heroImage: 'https://example.com/wine.jpg', // Auto-fetched! data: {} }); ```

**update**(collectionId: string,
    productId: string,
    data: ProductUpdateRequest) → `Promise<ProductResponse>`
Update a product for a collection (admin only). The `data` payload is a partial of ProductResponse minus `id` and `collectionId`. **Hero Image Auto-Fetch:** You can pass `heroImage` as either: - A full asset object: `{ url: '...', thumbnails: {...} }` - A string URL: The system automatically fetches and stores the image ```typescript // Update with new URL - auto-fetched and stored const product = await product.update(collectionId, productId, { heroImage: 'https://example.com/new-wine.jpg' // Auto-fetched! }); ```

**remove**(collectionId: string,
    productId: string) → `Promise<void>`
Delete a product for a collection (admin only).

**find**(collectionId: string,
    body: ProductQueryRequest) → `Promise<ProductQueryResponse>`

**publicFind**(collectionId: string,
    params?: ProductPublicFindParams) → `Promise<ProductResponse[]>`

**clone**(collectionId: string,
    productId: string,
    body: Record<string, JsonValue> = {}) → `Promise<ProductResponse>`

**listAssets**(collectionId: string,
    productId: string,
    admin?: boolean) → `Promise<unknown>`

**createClaimWindow**(collectionId: string,
    productId: string,
    body: Record<string, JsonValue>) → `Promise<unknown>`

**updateClaimWindow**(collectionId: string,
    productId: string,
    claimId: string,
    body: Record<string, JsonValue>) → `Promise<unknown>`

**refresh**(collectionId: string,
    productId: string) → `Promise<ProductResponse>`

**getSN**(collectionId: string,
    productId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<unknown>`
Get serial numbers for a product (admin only).

**lookupSN**(collectionId: string,
    productId: string,
    codeId: string) → `Promise<unknown>`
Look up a serial number by code for a product (admin only).

**publicLookupClaim**(collectionId: string,
    productId: string,
    claimId: string) → `Promise<unknown>`

**publicCreateClaim**(collectionId: string,
    productId: string,
    body: ProductClaimCreateRequestBody) → `Promise<unknown>`

### products

**get**(collectionId: string,
    productId: string,
    admin?: boolean) → `Promise<ProductResponse>`

**list**(collectionId: string,
    admin?: boolean) → `Promise<ProductResponse[]>`

**create**(collectionId: string,
    data: ProductCreateRequest) → `Promise<ProductResponse>`

**update**(collectionId: string,
    productId: string,
    data: ProductUpdateRequest) → `Promise<ProductResponse>`

**remove**(collectionId: string,
    productId: string) → `Promise<void>`

**query**(collectionId: string,
    body: ProductQueryRequest) → `Promise<ProductQueryResponse>`

**clone**(collectionId: string,
    productId: string,
    body: Record<string, JsonValue> = {}) → `Promise<ProductResponse>`

**listAssets**(collectionId: string,
    productId: string,
    admin?: boolean) → `Promise<unknown>`

**createClaimWindow**(collectionId: string,
    productId: string,
    body: Record<string, JsonValue>) → `Promise<unknown>`

**updateClaimWindow**(collectionId: string,
    productId: string,
    claimId: string,
    body: Record<string, JsonValue>) → `Promise<unknown>`

**refresh**(collectionId: string,
    productId: string) → `Promise<ProductResponse>`

**getSN**(collectionId: string,
    productId: string,
    startIndex: number = 0,
    count: number = 10) → `Promise<unknown>`

**lookupSN**(collectionId: string,
    productId: string,
    codeId: string) → `Promise<unknown>`

**publicLookupClaim**(collectionId: string,
    productId: string,
    claimId: string) → `Promise<unknown>`

**publicCreateClaim**(collectionId: string,
    productId: string,
    body: ProductClaimCreateRequestBody) → `Promise<unknown>`

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

**migrate**(collectionId: string,
    productId: string,
    proofId: string,
    /** The destination product ID */
    data: { targetProductId: string }) → `Promise<ProofResponse>`
Migrate a proof to a different product within the same collection (admin only). Because the Firestore ledger document ID is `{productId}-{proofId}`, a proof cannot simply be re-assigned to another product by updating a field — the document must be re-keyed. This endpoint handles that atomically: 1. Reads the source ledger document (`{sourceProductId}-{proofId}`). 2. Writes a new document (`{targetProductId}-{proofId}`) with `productId` and `proofGroup` updated. The short `proofId` (nanoid) is unchanged. 3. Writes a migration history entry to the new document's `history` subcollection (snapshot of the original proof + migration metadata). 4. Copies all subcollections — `assets`, `attestations`, `history` — from the old document to the new one. 5. Deletes the old subcollections and then the old document. Repeated migrations are safe — each one appends a history record; no migration metadata is stored on the proof document itself. ```typescript const migrated = await proof.migrate('coll_123', 'prod_old', 'proof_abc', { targetProductId: 'prod_new', }) console.log(migrated.productId) // 'prod_new' ```

### publicClient

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

### qr

**lookupShortCode**(shortId: string, code: string) → `Promise<QrShortCodeLookupResponse>`
Resolve a short code to related resource identifiers.

### rag

**indexDocument**(collectionId: string,
      request: IndexDocumentRequest) → `Promise<IndexDocumentResponse>`
Index a document for RAG

**configureAssistant**(collectionId: string,
      request: ConfigureAssistantRequest) → `Promise<ConfigureAssistantResponse>`
Configure AI assistant behavior

### rateLimit

**reset**(collectionId: string, userId: string) → `Promise<`
Reset rate limit for a user

### realtime

**getPublicToken**(params: RealtimeTokenRequest) → `Promise<AblyTokenRequest>`
Get an Ably token for public (user-scoped) real-time communication. This endpoint returns an Ably TokenRequest that can be used to initialize an Ably client with appropriate permissions for the specified collection and optional app. Requires user authentication (Bearer token). ```ts const tokenRequest = await realtime.getPublicToken({ collectionId: 'my-collection-id', appId: 'my-app-id' }) // Use with Ably const ably = new Ably.Realtime.Promise({ authCallback: async (data, callback) => { callback(null, tokenRequest) } }) // Subscribe to channels matching the pattern const channel = ably.channels.get('collection:my-collection-id:app:my-app-id:chat:general') await channel.subscribe('message', (msg) => console.log(msg.data)) ```

**getAdminToken**() → `Promise<AblyTokenRequest>`
Get an Ably token for admin real-time communication. This endpoint returns an Ably TokenRequest that can be used to initialize an Ably client with admin permissions to receive system notifications and alerts. Admin users get subscribe-only (read-only) access to the interaction:{userId} channel pattern. Requires admin authentication (Bearer token). ```ts const tokenRequest = await realtime.getAdminToken() // Use with Ably const ably = new Ably.Realtime.Promise({ authCallback: async (data, callback) => { callback(null, tokenRequest) } }) // Subscribe to admin interaction channel const userId = 'my-user-id' const channel = ably.channels.get(`interaction:${userId}`) await channel.subscribe((message) => { console.log('Admin notification:', message.data) }) ```

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

### sessions

**stats**(collectionId: string) → `Promise<SessionStatistics>`
Get session statistics

### tags

**create**(collectionId: string,
    data: CreateTagRequest) → `Promise<CreateTagResponse>`
Create a single tag mapping (admin). If `productId` is set without `proofId`, a serial number is auto-generated unless `useSerialNumber: true` is explicitly passed. `refType` and `refId` can be set independently of or alongside product/proof. ```typescript // Auto-generate serial number const tag = await tags.create('coll_123', { tagId:     'NFC-001', productId: 'prod_456', batchId:   'batch_2026_01', }) // Explicit proof + polymorphic ref const tag2 = await tags.create('coll_123', { tagId:   'NFC-002', refType: 'container', refId:   'container-uuid', }) ```

**createBatch**(collectionId: string,
    data: BatchCreateTagRequest) → `Promise<BatchCreateResult>`
Batch-create tags (admin). Tags with `productId` but no `proofId` automatically get serial numbers. Serial number generation is grouped by `(productId, variantId, batchId)` for efficiency.  Partial success is possible â€” check `results` for individual outcomes. ```typescript const result = await tags.createBatch('coll_123', { tags: [ { tagId: 'NFC-001', productId: 'prod_456', batchId: 'batch_2026_01' }, { tagId: 'NFC-002', productId: 'prod_456', batchId: 'batch_2026_01' }, ], }) console.log(`Created: ${result.summary.created}, Conflicts: ${result.summary.conflicts}`) ```

**get**(collectionId: string,
    tagId: string) → `Promise<GetTagResponse>`
Get a single tag by `tagId` (admin).

**update**(collectionId: string,
    tagId: string,
    data: UpdateTagRequest) → `Promise<UpdateTagResponse>`
Update a tag (admin). Partial update â€” only provided fields are changed.  `metadata` is deep-merged with the existing value.  Pass `refType: null, refId: null` to clear the polymorphic ref. ```typescript const updated = await tags.update('coll_123', 'NFC-001', { variantId: 'var_premium', metadata:  { notes: 'Updated to premium variant' }, }) // Clear polymorphic ref await tags.update('coll_123', 'NFC-001', { refType: null, refId: null }) ```

**remove**(collectionId: string,
    tagId: string) → `Promise<DeleteTagResponse>`
Delete a tag (admin). Permanently removes the tag from the per-org shard and the shared index.

**list**(collectionId: string,
    params?: ListTagsRequest) → `Promise<ListTagsResponse>`
List tags with optional filters and pagination (admin). ```typescript // All tags for a product const { tags: list } = await tags.list('coll_123', { productId: 'prod_456' }) // All tags linked to a container const { tags: linked } = await tags.list('coll_123', { refType: 'container', refId:   'container-uuid', }) ```

**byRef**(collectionId: string,
    params: ReverseTagLookupParams) → `Promise<ReverseTagLookupResponse>`
Reverse lookup â€” find all tags linked to a given object (admin). Uses a compound index on `(orgId, refType, refId)` on the per-org shard. No embed support on the admin side. ```typescript const { tags: linked } = await tags.byRef('coll_123', { refType: 'container', refId:   'container-uuid', }) ```

**resolveTag**(tagId: string) → `Promise<TagIndexEntry>`
Global tag resolve â€” returns `{ tagId, collectionId }` only. Use this **only** when you have a raw `tagId` and do not yet know which collection it belongs to.  Queries the shared `tag_index` shard. Once `collectionId` is resolved, call `publicGetByCollection` for full data. > The global `/public/tags/by-ref` endpoint has been removed. > Use the collection-scoped `publicByRef` instead. ```typescript // Step 1: resolve collection const { collectionId } = await tags.resolveTag('NFC-001') // Step 2: full lookup with embedded data const { tag, embedded } = await tags.publicGetByCollection( collectionId, 'NFC-001', 'product,proof' ) ```

**publicGetByCollection**(collectionId: string,
    tagId: string,
    embed?: string) → `Promise<PublicGetTagResponse>`
Single tag lookup with optional embedded data (public). `GET /public/collection/:collectionId/tags/:tagId?embed=product,proof,container,ref` Supported `embed` values: `'product'`, `'proof'`, `'container'`, `'ref'` (`'collection'` is not supported â€” the collection is already known from the URL). ```typescript const { tag, embedded } = await tags.publicGetByCollection( 'coll_123', 'NFC-001', 'product,proof' ) const product = embedded.products?.[tag.productId!] const proof   = embedded.proofs?.[tag.proofId!] ```

**lookupTags**(collectionId: string,
    data: LookupTagsRequest) → `Promise<TagLookupResponse>`
Batch tag lookup via POST (public). `POST /public/collection/:collectionId/tags/lookup` Tags not belonging to this collection are filtered out silently. Returns deduplicated embedded objects alongside the tag array. ```typescript const { count, tags: list, embedded } = await tags.lookupTags('coll_123', { tagIds: ['NFC-001', 'NFC-002', 'NFC-003'], embed:  'product,proof', }) ```

**lookupTagsQuery**(collectionId: string,
    params: LookupTagsQueryRequest) → `Promise<TagLookupResponse>`
Batch tag lookup via GET (public). `GET /public/collection/:collectionId/tags/lookup?tagIds=NFC-001,NFC-002&embed=product`

**publicByRef**(collectionId: string,
    params: ReverseTagLookupParams) → `Promise<ByRefResponse>`
Reverse lookup by ref via GET (public). `GET /public/collection/:collectionId/tags/by-ref?refType=container&refId=<uuid>&embed=ref` ```typescript const { tags: linked, embedded } = await tags.publicByRef('coll_123', { refType: 'container', refId:   'container-uuid', embed:   'container', }) const container = embedded.containers?.[containerId] ```

**publicByRefPost**(collectionId: string,
    data: ByRefRequest) → `Promise<ByRefResponse>`
Reverse lookup by ref via POST (public). `POST /public/collection/:collectionId/tags/by-ref`

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

### translations

**hashText**(text: string, options?: TranslationHashOptions) → `Promise<string>`

**hashTexts**(texts: string[], options?: TranslationHashOptions) → `Promise<string[]>`

**normalizeText**(text: string, options?: TranslationHashOptions) → `string`

**lookup**(collectionId: string,
    body: TranslationLookupRequest) → `Promise<TranslationLookupResponse>`

**resolve**(collectionId: string,
    body: TranslationLookupRequest,
    options: TranslationResolveOptions = {}) → `Promise<ResolvedTranslationResponse>`

**list**(collectionId: string,
    params?: TranslationListParams) → `Promise<TranslationListResponse>`

**get**(collectionId: string,
    translationId: string) → `Promise<TranslationRecord>`

**update**(collectionId: string,
    translationId: string,
    body: TranslationUpdateRequest) → `Promise<TranslationRecord>`

**clearLocalCache**(collectionId?: string) → `Promise<void>`

### tts

**generate**(collectionId: string,
      request: TTSRequest) → `Promise<Blob>`
Generate text-to-speech audio

### userAppData

User-owned app data stored per user and app, shared across collections.

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

### voice

**isSupported**() → `boolean`
Check if voice is supported in browser

**listen**(language = 'en-US') → `Promise<string>`
Listen for voice input

**speak**(text: string, options?: { voice?: string; rate?: number }) → `Promise<void>`
Speak text

