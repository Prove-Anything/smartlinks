/**
 * AI domain types
 */
/** Content part for multimodal messages */
export interface ContentPart {
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
        url: string;
        detail?: 'auto' | 'low' | 'high';
    };
}
/** Function call representation */
export interface FunctionCall {
    name: string;
    arguments: string;
}
/** Tool call representation */
export interface ToolCall {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
    };
}
/** Chat message with role and content */
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
    content: string | ContentPart[];
    name?: string;
    function_call?: FunctionCall;
    tool_calls?: ToolCall[];
    tool_call_id?: string;
}
/** Tool/Function definition */
export interface ToolDefinition {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: {
            type: 'object';
            properties: Record<string, {
                type: string;
                description?: string;
                enum?: string[];
            }>;
            required?: string[];
        };
    };
}
/** Additional/native tool definition accepted by the Responses API. */
export interface ResponseTool {
    type: string;
    name?: string;
    description?: string;
    parameters?: Record<string, any>;
    /** Expected shape of this tool's output, used by Programmatic Tool Calling. */
    output_schema?: Record<string, any>;
    /** Restricts which callers may invoke this tool (e.g. `['programmatic']` for Programmatic Tool Calling). */
    allowed_callers?: Array<'assistant' | 'programmatic'>;
    [key: string]: any;
}
/** Structured input item accepted by the Responses API. */
export interface ResponseInputItem {
    role?: 'system' | 'user' | 'assistant' | 'function' | 'tool';
    type?: string;
    content?: string | ContentPart[];
    name?: string;
    function_call?: FunctionCall;
    tool_calls?: ToolCall[];
    tool_call_id?: string;
    [key: string]: any;
}
/** Request for the Responses API. */
export interface ResponsesRequest {
    model?: string;
    input?: string | ResponseInputItem[];
    messages?: ResponseInputItem[];
    previous_response_id?: string;
    conversation?: string | Record<string, any>;
    tools?: Array<ToolDefinition | ResponseTool>;
    tool_choice?: 'none' | 'auto' | 'required' | {
        type: 'function';
        function: {
            name: string;
        };
    } | {
        type: 'function';
        name: string;
    };
    stream?: boolean;
    temperature?: number;
    max_output_tokens?: number;
    store?: boolean;
    instructions?: string;
    include?: string[];
    reasoning?: Record<string, any>;
    parallel_tool_calls?: boolean;
    truncation?: 'auto' | 'disabled';
    text?: Record<string, any>;
    metadata?: Record<string, string>;
    prompt_cache_key?: string;
    /** Enables multi-agent (subagent) orchestration. Not supported together with `stream: true`. */
    multi_agent?: {
        enabled: boolean;
        max_concurrent_subagents?: number;
    };
    /** `'flex'` is ~50% cheaper at Batch-API rates but slower; reserve for non-interactive/background work. */
    service_tier?: 'auto' | 'standard' | 'flex' | 'priority';
    /**
     * Attribution tag for AI usage/cost reporting (see `ai.usage`). Not sent to the model —
     * the server strips it. e.g. `'readiness-check'`, `'design-critique'`.
     */
    feature?: string;
    /**
     * Persist this turn to a server-managed session (create one with `ai.sessions.create`). The
     * server threads the session's prior transcript into the input and appends the new turn — so
     * you get conversation memory without managing history yourself, and it works even with
     * `server_tools` (unlike `previous_response_id`).
     */
    session_id?: string;
    /**
     * Run through the server-side agent loop: the platform executes built-in tools
     * (see BUILTIN_AI_TOOLS / AiToolName) and feeds results back automatically, so the
     * app never has to relay tool calls itself. `true` enables all built-ins; an array
     * restricts to those tool names. When streaming, tool progress arrives as
     * `agent.tool_call` / `agent.tool_result` events (see AgentStreamEvent), ending with
     * `response.completed`. Not combinable with `previous_response_id`/`conversation`
     * yet — pass prior turns in `input`.
     */
    server_tools?: boolean | AiToolName[];
    /** With `server_tools`: only run tools whose capabilities are all granted. */
    allowCapabilities?: AiToolCapability[];
    /** With `server_tools`: restrict to these tool names (alias of the array form). */
    only?: AiToolName[];
    /** With `server_tools`: drop these tool names. */
    exclude?: AiToolName[];
    /** With `server_tools`: cap model round-trips (1–12, default 8). */
    maxSteps?: number;
}
/** Response from the Responses API. */
export interface ResponsesResult {
    id: string;
    object: 'response';
    created: number;
    model: string;
    status?: 'completed' | 'failed' | 'in_progress' | 'queued' | 'cancelled' | 'incomplete';
    output: any[];
    output_text: string;
    usage: {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
    };
    error?: any;
    incomplete_details?: {
        reason?: 'max_output_tokens' | 'content_filter';
    } | null;
    previous_response_id?: string | null;
    conversation?: unknown;
    provider: 'openai';
    responseTime: number;
    /** Present when the request used `server_tools`: the server-side tool-use trace. */
    _agent?: ResponsesAgentTrace;
}
/** Generic SSE event emitted by the Responses API. */
export interface ResponsesStreamEvent {
    type: string;
    [key: string]: any;
}
/** Chat completion request */
export interface ChatCompletionRequest {
    messages: ChatMessage[];
    model?: string;
    stream?: boolean;
    tools?: ToolDefinition[];
    tool_choice?: 'none' | 'auto' | 'required' | {
        type: 'function';
        function: {
            name: string;
        };
    };
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    response_format?: {
        type: 'text' | 'json_object';
    };
    user?: string;
}
/** Chat completion choice */
export interface ChatCompletionChoice {
    index: number;
    message: ChatMessage;
    finish_reason: 'stop' | 'length' | 'function_call' | 'tool_calls' | 'content_filter' | null;
}
/** Chat completion response */
export interface ChatCompletionResponse {
    id: string;
    object: 'chat.completion';
    created: number;
    model: string;
    choices: ChatCompletionChoice[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
/** Streaming chunk */
export interface ChatCompletionChunk {
    id: string;
    object: 'chat.completion.chunk';
    created: number;
    model: string;
    choices: Array<{
        index: number;
        delta: Partial<ChatMessage>;
        finish_reason: string | null;
    }>;
}
/** AI Model information */
export interface AIModel {
    id: string;
    provider: 'gemini' | 'openai';
    modelId: string;
    name: string;
    description: string;
    capabilities: Array<'text' | 'vision' | 'audio' | 'code'>;
    contextWindow: number;
    pricing: {
        input: number;
        output: number;
        cached?: number;
    };
    features: string[];
    recommended?: string;
}
/** Filter parameters when listing models. */
export interface AIModelListParams {
    provider?: 'gemini' | 'openai';
    capability?: 'text' | 'vision' | 'audio' | 'code';
}
/** Model list response. */
export interface AIModelListResponse {
    object: 'list';
    data: AIModel[];
}
/** Document chunk with embedding */
export interface DocumentChunk {
    text: string;
    embedding: number[];
    metadata: {
        chunkIndex: number;
        documentId: string;
        [key: string]: any;
    };
}
/** Index document request */
export interface IndexDocumentRequest {
    productId: string;
    text?: string;
    documentUrl?: string;
    metadata?: Record<string, any>;
    chunkSize?: number;
    overlap?: number;
    provider?: 'openai' | 'gemini';
}
/** Index document response */
export interface IndexDocumentResponse {
    success: boolean;
    productId: string;
    documentId: string;
    chunks: number;
    metadata: {
        textLength: number;
        chunkSize: number;
        overlap: number;
        embeddingDimensions: number;
    };
    sample?: {
        text: string;
        chunkIndex: number;
    };
}
/** Configure assistant request */
export interface ConfigureAssistantRequest {
    productId: string;
    systemPrompt?: string;
    model?: string;
    maxTokensPerResponse?: number;
    temperature?: number;
    rateLimitPerUser?: number;
    allowedTopics?: string[];
    customInstructions?: {
        tone?: string;
        additionalRules?: string;
        [key: string]: any;
    };
}
/** Configure assistant response */
export interface ConfigureAssistantResponse {
    success: boolean;
    configuration: {
        productId: string;
        systemPrompt: string;
        model: string;
        maxTokensPerResponse: number;
        temperature: number;
        rateLimitPerUser: number;
        allowedTopics: string[];
        customInstructions?: Record<string, any>;
        updatedAt: string;
    };
}
/** Public chat request */
export interface PublicChatRequest {
    productId: string;
    userId: string;
    message: string;
    sessionId?: string;
    stream?: boolean;
}
/** Public chat response */
export interface PublicChatResponse {
    message: string;
    sessionId: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    context?: {
        chunksUsed: number;
        topSimilarity: number;
    };
}
/** Session information */
export interface Session {
    sessionId: string;
    productId: string;
    userId: string;
    messageCount: number;
    createdAt: string;
    lastActivityAt: string;
    messages: ChatMessage[];
}
/** Rate limit status */
export interface RateLimitStatus {
    used: number;
    remaining: number;
    resetAt: string;
}
/** Session statistics */
export interface SessionStatistics {
    totalSessions: number;
    activeSessions: number;
    totalMessages: number;
    rateLimitedUsers: number;
}
/** Who may read/append a persisted AI session. */
export type AiSessionScope = 'admin' | 'owner' | 'public';
/** A persisted AI assistant conversation (durable, scoped). */
export interface AiSession {
    id: string;
    collectionId: string;
    appId?: string | null;
    scope: AiSessionScope;
    title?: string | null;
    status: string;
    ownerId?: string | null;
    authorId?: string | null;
    productId?: string | null;
    proofId?: string | null;
    feature?: string | null;
    /** Append-only Responses items (input/output + tool calls/results). */
    items: ResponseInputItem[];
    /** Compacted digest of older turns (server-managed). */
    summary?: Record<string, any>;
    /** Running token/turn accounting for this session. */
    usage?: Record<string, any>;
    itemCount: number;
    lastTurnAt?: string | null;
    createdAt: string;
    updatedAt: string;
    expiresAt?: string | null;
}
/** Fields for creating a session (all optional). */
export interface AiSessionCreate {
    appId?: string;
    title?: string;
    productId?: string;
    proofId?: string;
    feature?: string;
    /** Time-to-live in ms; omit to keep until explicitly cleared. */
    ttlMs?: number;
    /** Seed items (e.g. a system/instruction turn). */
    items?: ResponseInputItem[];
}
/** Per-collection AI usage/cost report. `costUnits` are OPAQUE internal units, never provider currency. */
export interface AiUsageReport {
    groupBy: string[];
    from?: string | null;
    to?: string | null;
    totals: {
        promptTokens: number;
        outputTokens: number;
        totalTokens: number;
        requests: number;
        costUnits: number;
    };
    groups: Array<Record<string, any> & {
        promptTokens: number;
        outputTokens: number;
        totalTokens: number;
        requests: number;
        costUnits: number;
    }>;
}
/** Voice session request */
export interface VoiceSessionRequest {
    productId: string;
    userId: string;
    collectionId: string;
    settings?: {
        voice?: string;
        language?: string;
        model?: string;
    };
}
/** Voice session response */
export interface VoiceSessionResponse {
    token: string;
    systemInstruction: string;
    expiresAt: string;
    productName: string;
}
/** Ephemeral token request */
export interface EphemeralTokenRequest {
    settings?: {
        ttl?: number;
        voice?: string;
        language?: string;
        model?: string;
    };
}
/** Ephemeral token response */
export interface EphemeralTokenResponse {
    token: string;
    expiresAt: string;
}
/** Transcription response */
export interface TranscriptionResponse {
    text: string;
}
/** TTS request */
export interface TTSRequest {
    text: string;
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
    speed?: number;
    format?: 'mp3' | 'opus' | 'aac' | 'flac';
}
/** Podcast generation request */
export interface GeneratePodcastRequest {
    productId: string;
    documentText?: string;
    duration?: number;
    style?: 'casual' | 'professional' | 'educational' | 'entertaining';
    voices?: {
        host1?: string;
        host2?: string;
    };
    includeAudio?: boolean;
    language?: string;
    customInstructions?: string;
}
/** Podcast script */
export interface PodcastScript {
    title: string;
    description: string;
    segments: Array<{
        speaker: 'host1' | 'host2';
        text: string;
        timestamp?: number;
        duration?: number;
    }>;
}
/** Podcast generation response */
export interface GeneratePodcastResponse {
    success: boolean;
    podcastId: string;
    script: PodcastScript;
    audio?: {
        host1Url?: string;
        host2Url?: string;
        mixedUrl?: string;
    };
    metadata: {
        duration: number;
        wordCount: number;
        generatedAt: string;
    };
}
/** Podcast status */
export interface PodcastStatus {
    podcastId: string;
    status: 'generating_script' | 'generating_audio' | 'mixing' | 'completed' | 'failed';
    progress: number;
    estimatedTimeRemaining?: number;
    error?: string;
    result?: GeneratePodcastResponse;
}
/** Request shape for AI generateContent calls */
export interface AIGenerateContentRequest {
    /** The prompt or message contents sent to the AI */
    contents: string | any;
    /** Desired MIME type of the response payload (e.g. 'application/json', 'text/plain') */
    responseMimeType?: string;
    /** Optional system instruction or system prompt to steer the model */
    systemInstruction?: string;
    /** AI provider identifier (e.g. 'openai', 'google', 'anthropic') */
    provider?: string;
    /** The model name to use (e.g. 'gpt-4o', 'gemini-1.5-pro') */
    model?: string;
    /** Allow passing additional provider/model-specific options */
    [key: string]: any;
}
/** Request shape for AI generateImage calls (admin) */
export interface AIGenerateImageRequest {
    /** Text prompt describing the desired image */
    prompt: string;
    /** AI provider identifier (e.g. 'openai', 'google', 'stability') */
    provider?: string;
    /** Optional model name to use for image generation */
    model?: string;
    /**
     * Requested image size.
     * OpenAI supported values: '1024x1024', '1024x1792', '1792x1024'
     * Other providers may support different sizes.
     */
    size?: string;
    /** Additional provider/model-specific options */
    [key: string]: any;
}
/** Request shape for AI searchPhotos calls (admin -> Unsplash proxy) */
export interface AISearchPhotosRequest {
    /** Search query keyword(s) */
    query: string;
    /** Number of results to return per page (e.g. 1) */
    per_page?: number;
    /** Desired orientation of photos */
    orientation?: 'landscape' | 'portrait' | 'squarish';
    /** Additional provider-specific options */
    [key: string]: any;
}
/** Single photo item returned by searchPhotos */
export interface AISearchPhotosPhoto {
    /** Provider photo id */
    id?: string;
    /** Direct image URL */
    url: string;
    /** Thumbnail URL */
    thumb?: string;
    /** Alt text/description for accessibility */
    alt?: string;
    /** Pixel dimensions */
    width?: number;
    height?: number;
    /** Photographer display name */
    photographer?: string;
    /** Link to the photographer profile */
    photographerUrl?: string;
    /** Allow extra fields */
    [key: string]: any;
}
/**
 * Response from `searchPhotos`. The API returns an **envelope** — the photos are in
 * `results`, not the top-level array. (`searchPhotos` returns this object, not `Photo[]`.)
 */
export interface AISearchPhotosResponse {
    /** Source provider, e.g. `'unsplash'`. */
    provider: string;
    /** The matched photos. */
    results: AISearchPhotosPhoto[];
    /** Total matches available. */
    total?: number;
    /** Total pages available. */
    total_pages?: number;
    [key: string]: any;
}
/** A single generated image from `generateImage`. */
export interface AIGeneratedImage {
    /** Image URL, or a `data:` URI when the provider returns base64; `null` if neither. */
    url: string | null;
    /** Base64 image payload when the model returns it, else `null`. */
    b64_json: string | null;
    /** The provider's revised prompt, when returned. */
    revised_prompt?: string;
    [key: string]: any;
}
/**
 * Response from `generateImage`. The API returns an **envelope** — the image(s) are in
 * `images`, with `provider`/`model` metadata. (Not a bare URL or a bare array.)
 */
export interface AIGenerateImageResponse {
    /** Provider used, e.g. `'openai'` | `'gemini'`. */
    provider: string;
    /** Model used, when reported. */
    model?: string;
    /** The generated image(s). */
    images: AIGeneratedImage[];
    [key: string]: any;
}
/** One candidate in a `generateContent` response (Gemini-normalised shape). */
export interface AIGenerateContentCandidate {
    content?: {
        parts?: Array<{
            text?: string;
            [k: string]: any;
        }>;
        role?: string;
        [k: string]: any;
    };
    finishReason?: string;
    [key: string]: any;
}
/**
 * Response from `generateContent`. The API returns a **normalised envelope** (both providers
 * are mapped to this shape) — text lives at `candidates[0].content.parts[0].text`.
 */
export interface AIGenerateContentResponse {
    provider?: string;
    model?: string;
    candidates?: AIGenerateContentCandidate[];
    usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
        [k: string]: any;
    };
    responseTime?: number;
    [key: string]: any;
}
/** A file uploaded for AI use (`uploadFile`) — a provider file reference. */
export interface AIUploadedFile {
    /** Provider file id / resource name. */
    name?: string;
    /** URI to reference the file in later calls. */
    uri?: string;
    url?: string;
    mimeType?: string;
    sizeBytes?: number | string;
    state?: string;
    [key: string]: any;
}
/** A cache reference returned by `createCache` — a provider cache resource. */
export interface AICacheRef {
    /** Cache resource name / id. */
    name?: string;
    model?: string;
    expireTime?: string;
    [key: string]: any;
}
export interface AgentRunRequest {
    /** User prompt (either input or prompt). */
    input?: string;
    prompt?: string;
    /** System instructions. */
    instructions?: string;
    /** Model id, e.g. 'openai/gpt-5.6-terra'. */
    model?: string;
    /** Safety cap on model round-trips. */
    maxSteps?: number;
    /** Cap blast radius: only tools whose capabilities are all granted. */
    allowCapabilities?: string[];
    /** Restrict to these tool names. */
    only?: string[];
    /** Drop these tool names. */
    exclude?: string[];
}
export interface AgentToolResult {
    name: string;
    isError: boolean;
    result: any;
}
export interface AgentRunResult {
    finalText: string | null;
    steps: number;
    maxStepsReached: boolean;
    toolResults: AgentToolResult[];
    availableTools: string[];
}
export interface AgentToolDefinition {
    name: string;
    description: string;
    capabilities: string[];
    parameters: any;
}
export interface AgentToolsResponse {
    tools: AgentToolDefinition[];
}
export interface AgentToolsQuery {
    allowCapabilities?: string;
    only?: string;
    exclude?: string;
}
export interface SkillDescriptor {
    name: string;
    description: string;
    inputSchema: any;
    outputSchema: any;
    capabilities: string[];
}
export interface SkillsListResponse {
    skills: SkillDescriptor[];
}
export interface CatalogResponse {
    tools: AgentToolDefinition[];
    skills: SkillDescriptor[];
}
/** Capability tags a tool requires; scope a run with `allowCapabilities`. */
export type AiToolCapability = 'web:read' | 'ai:vision' | 'ai:image' | 'ai:text' | 'media:image' | 'media:pdf' | 'net:http';
/** The names of the built-in server-side agent tools (run via `server_tools`). */
export type AiToolName = 'web.fetchPage' | 'web.extractSchema' | 'web.screenshot' | 'web.search' | 'brand.assets' | 'document.read' | 'data.extract' | 'image.describe' | 'image.generate' | 'image.fromReference' | 'image.searchStock' | 'image.transform' | 'pdf.create' | 'pdf.fill' | 'pdf.merge' | 'http.request' | 'translate';
export interface WebFetchPageArgs {
    url: string;
    type?: string;
    forceRefresh?: boolean;
}
export interface WebExtractSchemaArgs {
    url: string;
    schemaType?: string;
    forceRefresh?: boolean;
}
export interface WebScreenshotArgs {
    url: string;
}
export interface WebSearchArgs {
    query: string;
    limit?: number;
    scrapeContent?: boolean;
}
export interface BrandAssetsArgs {
    url: string;
}
export interface DocumentReadArgs {
    url: string;
    forceRefresh?: boolean;
}
export interface DataExtractArgs {
    url: string;
    schema?: Record<string, any>;
    prompt?: string;
}
export interface ImageDescribeArgs {
    imageUrl: string;
    prompt?: string;
}
export interface ImageGenerateArgs {
    prompt: string;
    size?: string;
    provider?: 'openai' | 'gemini';
}
export interface ImageFromReferenceArgs {
    prompt: string;
    imageUrls: string[];
    size?: string;
    model?: string;
}
export interface ImageSearchStockArgs {
    query: string;
    per_page?: number;
    orientation?: 'landscape' | 'portrait' | 'squarish';
}
export interface ImageTransformArgs {
    imageUrl: string;
    resize?: {
        width?: number;
        height?: number;
        fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
        allowUpscale?: boolean;
    };
    crop?: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    rotate?: number;
    flip?: boolean;
    flop?: boolean;
    grayscale?: boolean;
    tint?: string;
    modulate?: {
        brightness?: number;
        saturation?: number;
        hue?: number;
        lightness?: number;
    };
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
    quality?: number;
}
export interface PdfCreateArgs {
    html: string;
    format?: string;
    landscape?: boolean;
}
export interface PdfFillArgs {
    url: string;
    fields: Record<string, string | number | boolean>;
    flatten?: boolean;
}
export interface PdfMergeArgs {
    urls: string[];
}
export interface HttpRequestArgs {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
    headers?: Record<string, string>;
    body?: any;
}
export interface TranslateArgs {
    text: string;
    targetLanguages: string[];
    sourceLanguage?: string;
}
/** Map of tool name → its argument type, for typed construction. */
export interface AiToolArgsMap {
    'web.fetchPage': WebFetchPageArgs;
    'web.extractSchema': WebExtractSchemaArgs;
    'web.screenshot': WebScreenshotArgs;
    'web.search': WebSearchArgs;
    'brand.assets': BrandAssetsArgs;
    'document.read': DocumentReadArgs;
    'data.extract': DataExtractArgs;
    'image.describe': ImageDescribeArgs;
    'image.generate': ImageGenerateArgs;
    'image.fromReference': ImageFromReferenceArgs;
    'image.searchStock': ImageSearchStockArgs;
    'image.transform': ImageTransformArgs;
    'pdf.create': PdfCreateArgs;
    'pdf.fill': PdfFillArgs;
    'pdf.merge': PdfMergeArgs;
    'http.request': HttpRequestArgs;
    'translate': TranslateArgs;
}
export interface WebSearchResultItem {
    url: string | null;
    title: string | null;
    description: string | null;
    markdown?: string;
}
export interface WebSearchResult {
    query: string;
    results: WebSearchResultItem[];
}
export interface DocumentReadResult {
    url: string;
    text: string | null;
    metadata?: any;
    provider?: string;
    cached?: boolean;
}
export interface DataExtractResult {
    url: string;
    data: Record<string, any>;
}
export interface WebFetchPageResult {
    url: string;
    markdown?: string | null;
    html?: string | null;
    metadata?: any;
    schemas?: any[];
    provider?: string;
    cached?: boolean;
    status?: number | null;
}
export interface ImageDescribeResult {
    imageUrl: string;
    text: string | null;
}
/** Result of a tool that produces a hosted binary (image.transform, pdf.*). */
export interface HostedAssetResult {
    hostedUrl: string | null;
    contentType?: string;
    info?: {
        width?: number;
        height?: number;
        format?: string;
        size?: number;
    };
}
export interface HttpRequestResult {
    status: number;
    headers: Record<string, any>;
    body: any;
    truncated: boolean;
    finalUrl: string;
}
export interface TranslateResult {
    translations: Record<string, string>;
    sourceLanguage: string;
}
/** The `_agent` trace attached to an agentic Responses result. */
export interface ResponsesAgentTrace {
    steps: number;
    maxStepsReached: boolean;
    toolResults: AgentToolResult[];
    availableTools: string[];
}
export interface AgentToolCallEvent {
    type: 'agent.tool_call';
    name: string;
    args: Record<string, any>;
}
export interface AgentToolResultEvent {
    type: 'agent.tool_result';
    name: string;
    isError: boolean;
    result: any;
}
export interface AgentResponseCompletedEvent {
    type: 'response.completed';
    response: ResponsesResult;
    _agent: ResponsesAgentTrace;
}
/** Union of events emitted when streaming an agentic Responses request. */
export type AgentStreamEvent = AgentToolCallEvent | AgentToolResultEvent | AgentResponseCompletedEvent | ResponsesStreamEvent;
