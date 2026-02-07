# SmartLinks AI

Complete guide to using AI capabilities in the SmartLinks SDK, including chat completions, RAG (Retrieval-Augmented Generation), and voice integration.

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Chat Completions](#chat-completions)
- [RAG: Product Assistants](#rag-product-assistants)
- [Voice Integration](#voice-integration)
- [Podcast Generation](#podcast-generation)
- [Type Definitions](#type-definitions)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Best Practices](#best-practices)

---

## Overview

SmartLinks AI provides four main capabilities:

1. **Chat Completions** - OpenAI-compatible text generation with streaming and tool calling
2. **RAG (Retrieval-Augmented Generation)** - Document-grounded Q&A for product assistants
3. **Voice Integration** - Voice-to-text and text-to-voice for hands-free interaction
4. **Podcast Generation** - NotebookLM-style multi-voice conversational podcasts from documents

### Key Features

- ✅ Full TypeScript support with type safety
- ✅ Streaming responses with async iterators
- ✅ Automatic rate limit handling
- ✅ Session management for conversations
- ✅ Voice input/output helpers
- ✅ Tool/function calling support
- ✅ Document indexing and retrieval
- ✅ Customizable assistant behavior

---

## Quick Start

```typescript
import { initializeApi, ai } from '@proveanything/smartlinks';

// Initialize the SDK
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  apiKey: process.env.SMARTLINKS_API_KEY // Required for admin endpoints
});

// Simple chat completion
const response = await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  messages: [
    { role: 'user', content: 'Hello!' }
  ]
});

console.log(response.choices[0].message.content);
```

---

## Authentication

### Admin Endpoints

Admin endpoints require an API key passed during initialization:

```typescript
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  apiKey: process.env.SMARTLINKS_API_KEY
});
```

The SDK automatically includes the API key in the `Authorization: Bearer <token>` header.

### Public Endpoints

Public endpoints don't require an API key but are rate-limited by `userId`:

```typescript
// No API key needed
const response = await ai.publicApi.chat({
  productId: 'coffee-maker',
  userId: 'user-123',
  message: 'How do I clean this?'
});
```

---

## Chat Completions

OpenAI-compatible chat completions with streaming and tool calling support.

### Basic Chat

```typescript
const response = await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' }
  ]
});

console.log(response.choices[0].message.content);
// Output: "The capital of France is Paris."
```

### Streaming Chat

Stream responses in real-time for better UX:

```typescript
const stream = await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  messages: [
    { role: 'user', content: 'Write a short poem about coding' }
  ],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
```

### Tool/Function Calling

Define tools (functions) that the AI can call:

```typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get the current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City name'
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit']
          }
        },
        required: ['location']
      }
    }
  }
];

const response = await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  messages: [
    { role: 'user', content: 'What\'s the weather in Paris?' }
  ],
  tools
});

const toolCall = response.choices[0].message.tool_calls?.[0];
if (toolCall) {
  console.log('Function:', toolCall.function.name);
  console.log('Arguments:', JSON.parse(toolCall.function.arguments));
  // { location: "Paris", unit: "celsius" }
}
```

### Available Models

```typescript
// List all available models
const models = await ai.models.list('my-collection');

models.data.forEach(model => {
  console.log(`${model.name}`);
  console.log(`  Provider: ${model.provider}`);
  console.log(`  Context: ${model.contextWindow} tokens`);
  console.log(`  Pricing: $${model.pricing.input}/1M input tokens`);
});

// Get specific model info
const model = await ai.models.get('my-collection', 'google/gemini-2.5-flash');
console.log(model.capabilities); // ['text', 'vision', 'audio', 'code']
```

**Recommended Models:**

| Model | Use Case | Speed | Cost |
|-------|----------|-------|------|
| `google/gemini-2.5-flash-lite` | Simple Q&A | Fastest | Lowest |
| `google/gemini-2.5-flash` | General purpose | Fast | Low |
| `google/gemini-2.5-pro` | Complex reasoning | Slower | Higher |

---

## RAG: Product Assistants

Create intelligent product assistants that answer questions based on product documentation.

### Setup: Index Documents

First, index your product documentation:

```typescript
// Index a product manual from URL
const result = await ai.rag.indexDocument('my-collection', {
  productId: 'coffee-maker-deluxe',
  documentUrl: 'https://example.com/manuals/coffee-maker.pdf',
  chunkSize: 500,      // Tokens per chunk
  overlap: 50,         // Token overlap between chunks
  provider: 'openai'   // Embedding provider
});

console.log(`Indexed ${result.chunks} chunks`);
console.log(`Dimensions: ${result.metadata.embeddingDimensions}`);

// Or index from text directly
await ai.rag.indexDocument('my-collection', {
  productId: 'coffee-maker-deluxe',
  text: 'Your product manual content here...',
  metadata: {
    source: 'manual',
    version: '2.0'
  }
});
```

### Configure Assistant

Customize the assistant's behavior:

```typescript
await ai.rag.configureAssistant('my-collection', {
  productId: 'coffee-maker-deluxe',
  systemPrompt: 'You are a helpful coffee maker assistant. Be concise and friendly.',
  model: 'google/gemini-2.5-flash',
  temperature: 0.7,
  maxTokensPerResponse: 500,
  rateLimitPerUser: 20,
  allowedTopics: ['usage', 'cleaning', 'troubleshooting'],
  customInstructions: {
    tone: 'friendly',
    additionalRules: 'Always include safety warnings when relevant.'
  }
});
```

### Public Chat

Users can chat with the product assistant without authentication:

```typescript
// First question
const response = await ai.publicApiApi.chat('my-collection', {
  productId: 'coffee-maker-deluxe',
  userId: 'user-123',
  message: 'How do I descale my coffee maker?'
});

console.log('Answer:', response.message);
console.log('Used', response.context.chunksUsed, 'document sections');
console.log('Top similarity:', response.context.topSimilarity);
```

### Conversation History

Maintain conversation context with sessions:

```typescript
const sessionId = `session-${Date.now()}`;

// First question
const q1 = await ai.public.chat('my-collection', {
  productId: 'coffee-maker-deluxe',
  userId: 'user-123',
  message: 'How do I clean it?',
  sessionId
});

// Follow-up question (uses history)
const q2 = await ai.public.chat('my-collection', {
  productId: 'coffee-maker-deluxe',
  userId: 'user-123',
  message: 'How often should I do that?',
  sessionId
});

// Get full conversation history
const session = await ai.public.getSession('my-collection', sessionId);
console.log('Messages:', session.messages);
console.log('Total messages:', session.messageCount);

// Clear session when done
await ai.public.clearSession('my-collection', sessionId);
```

### Session Management

```typescript
// Get session statistics (admin)
const stats = await ai.sessions.stats('my-collection');
console.log('Total sessions:', stats.totalSessions);
console.log('Active sessions:', stats.activeSessions);
console.log('Total messages:', stats.totalMessages);
console.log('Rate-limited users:', stats.rateLimitedUsers);
```

---

## Voice Integration

Enable voice input and output for hands-free interaction.

### Browser Voice Helpers

```typescript
// Check if voice is supported
if (ai.voice.isSupported()) {
  // Listen for voice input
  const question = await ai.voice.listen('en-US');
  console.log('User said:', question);
  
  // Get answer from AI
  const response = await ai.public.chat('my-collection', {
    productId: 'coffee-maker-deluxe',
    userId: 'user-123',
    message: question
  });
  
  // Speak the answer
  await ai.voice.speak(response.message, {
    voice: 'alloy',
    rate: 1.0
  });
}
```

### Voice Assistant Class

Create a complete voice assistant:

```typescript
class ProductVoiceAssistant {
  private collectionId: string;
  private productId: string;
  private userId: string;
  private sessionId: string;

  constructor(config: { 
    collectionId: string;
    productId: string;
    userId: string;
  }) {
    this.collectionId = config.collectionId;
    this.productId = config.productId;
    this.userId = config.userId;
    this.sessionId = `voice-${Date.now()}`;
  }

  async ask(): Promise<string> {
    // Listen for question
    console.log('Listening...');
    const question = await ai.voice.listen();

    // Get answer
    console.log('Processing...');
    const response = await ai.public.chat(this.collectionId, {
      productId: this.productId,
      userId: this.userId,
      message: question,
      sessionId: this.sessionId
    });

    // Speak answer
    console.log('Speaking...');
    await ai.voice.speak(response.message);

    return response.message;
  }

  async getRemainingQuestions(): Promise<number> {
    const status = await ai.publicApiApi.getRateLimit(this.collectionId, this.userId);
    return status.remaining;
  }
}

// Usage
const assistant = new ProductVoiceAssistant({
  collectionId: 'my-collection',
  productId: 'coffee-maker-deluxe',
  userId: 'user-123'
});

await assistant.ask(); // Voice question → Voice answer
const remaining = await assistant.getRemainingQuestions();
console.log(`${remaining} questions remaining`);
```

### Gemini Live Integration

Generate ephemeral tokens for Gemini Live (multimodal voice):

```typescript
// Generate token for voice session
const token = await ai.publicApi.getToken('my-collection', {
  settings: {
    ttl: 3600,        // 1 hour
    voice: 'alloy',
    language: 'en-US'
  }
});

console.log('Token:', token.token);
console.log('Expires at:', new Date(token.expiresAt));

// Use token with Gemini Live API
// (See Google's Gemini documentation)
```

---

## Podcast Generation

Generate NotebookLM-style multi-voice conversational podcasts from product documentation.

### Generate a Podcast

```typescript
const podcast = await ai.podcast.generate('my-collection', {
  productId: 'coffee-maker-deluxe',
  duration: 5,              // Target 5 minutes
  style: 'casual',          // 'casual' | 'professional' | 'educational' | 'entertaining'
  voices: {
    host1: 'nova',          // Female voice
    host2: 'onyx'           // Male voice
  },
  includeAudio: true        // Generate audio files
});

console.log('Podcast Title:', podcast.script.title);
console.log('Duration:', podcast.metadata.duration, 'seconds');
console.log('Download:', podcast.audio?.mixedUrl);
```

### Available Voices

| Voice | Gender | Personality | Best For |
|-------|--------|-------------|----------|
| `alloy` | Neutral | Balanced, neutral | Professional podcasts |
| `echo` | Male | Clear, authoritative | Expert/teacher role |
| `fable` | Neutral | Warm, storytelling | Narrative content |
| `onyx` | Male | Deep, engaging | Main host, discussions |
| `nova` | Female | Friendly, enthusiastic | Co-host, questions |
| `shimmer` | Female | Bright, energetic | Entertaining content |

**Recommended Combinations:**
- **Casual**: Nova + Onyx - Friendly and engaging
- **Professional**: Alloy + Echo - Authoritative and clear
- **Educational**: Fable + Echo - Teaching style
- **Entertaining**: Shimmer + Onyx - High energy

### Access the Script

```typescript
// View the generated script
podcast.script.segments.forEach((segment, i) => {
  const speaker = segment.speaker === 'host1' ? 'Host 1' : 'Host 2';
  console.log(`${speaker}: ${segment.text}`);
});
```

### Check Generation Status

For long-running podcast generation, poll for status:

```typescript
// Start generation
const podcast = await ai.podcast.generate('my-collection', {
  productId: 'coffee-maker-deluxe',
  duration: 10,
  includeAudio: true
});

// Poll for status
const checkStatus = async () => {
  const status = await ai.podcast.getStatus('my-collection', podcast.podcastId);
  
  console.log(`Status: ${status.status} (${status.progress}%)`);
  
  if (status.status === 'completed' && status.result) {
    console.log('Podcast ready!');
    console.log('Listen:', status.result.audio?.mixedUrl);
    return true;
  } else if (status.status === 'failed') {
    console.error('Generation failed:', status.error);
    return true;
  }
  
  return false;
};

// Check every 5 seconds
const interval = setInterval(async () => {
  const done = await checkStatus();
  if (done) clearInterval(interval);
}, 5000);
```

### Text-to-Speech (TTS)

Generate custom audio from text:

```typescript
const audioBlob = await ai.tts.generate('my-collection', {
  text: 'Welcome to our podcast about coffee makers!',
  voice: 'nova',
  speed: 1.0,
  format: 'mp3'
});

// Create audio URL for playback
const audioUrl = URL.createObjectURL(audioBlob);
```

---

## Type Definitions

### Core Types

```typescript
/**
 * Chat message with role and content
 */
interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string | ContentPart[];
  name?: string;
  function_call?: FunctionCall;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

/**
 * Chat completion request
 */
interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  stream?: boolean;
  tools?: ToolDefinition[];
  tool_choice?: 'none' | 'auto' | 'required' | { type: 'function'; function: { name: string } };
  temperature?: number;       // 0-2, default: 0.7
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  response_format?: { type: 'text' | 'json_object' };
  user?: string;
}

/**
 * Chat completion response
 */
interface ChatCompletionResponse {
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

/**
 * Streaming chunk
 */
interface ChatCompletionChunk {
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
```

### RAG Types

```typescript
/**
 * Index document request
 */
interface IndexDocumentRequest {
  productId: string;
  text?: string;              // Either text or documentUrl required
  documentUrl?: string;
  metadata?: Record<string, any>;
  chunkSize?: number;         // Default: 500
  overlap?: number;           // Default: 50
  provider?: 'openai' | 'gemini';
}

/**
 * Configure assistant request
 */
interface ConfigureAssistantRequest {
  productId: string;
  systemPrompt?: string;
  model?: string;
  maxTokensPerResponse?: number;
  temperature?: number;
  rateLimitPerUser?: number;
  allowedTopics?: string[];
  customInstructions?: Record<string, any>;
}

/**
 * Public chat request
 */
interface PublicChatRequest {
  productId: string;
  userId: string;
  message: string;
  sessionId?: string;
  stream?: boolean;
}

/**
 * Public chat response
 */
interface PublicChatResponse {
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
```

### Podcast Types

```typescript
/**
 * Podcast generation request
 */
interface GeneratePodcastRequest {
  productId: string;
  documentText?: string;      // Optional if document already indexed
  duration?: number;          // Target duration in minutes (default: 10)
  style?: 'casual' | 'professional' | 'educational' | 'entertaining';
  voices?: {
    host1?: string;           // Voice name for first host
    host2?: string;           // Voice name for second host
  };
  includeAudio?: boolean;     // Generate audio files (default: false)
  language?: string;          // Default: 'en-US'
  customInstructions?: string;
}

/**
 * Podcast script segment
 */
interface PodcastSegment {
  speaker: 'host1' | 'host2';
  text: string;
  timestamp?: number;         // Start time in seconds
  duration?: number;          // Segment duration
}

/**
 * Podcast script
 */
interface PodcastScript {
  title: string;
  description: string;
  segments: PodcastSegment[];
}

/**
 * Podcast generation response
 */
interface GeneratePodcastResponse {
  success: boolean;
  podcastId: string;
  script: PodcastScript;
  audio?: {
    host1Url?: string;        // URL to download host 1 audio
    host2Url?: string;        // URL to download host 2 audio
    mixedUrl?: string;        // URL to download mixed podcast
  };
  metadata: {
    duration: number;         // Actual duration in seconds
    wordCount: number;
    generatedAt: string;
  };
}

/**
 * Podcast status
 */
interface PodcastStatus {
  podcastId: string;
  status: 'generating_script' | 'generating_audio' | 'mixing' | 'completed' | 'failed';
  progress: number;           // 0-100
  estimatedTimeRemaining?: number;  // Seconds
  error?: string;
  result?: GeneratePodcastResponse; // Available when completed
}

/**
 * TTS request
 */
interface TTSRequest {
  text: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed?: number;             // 0.25 - 4.0, default: 1.0
  format?: 'mp3' | 'opus' | 'aac' | 'flac';  // Default: mp3
}
```

### Error Types

```typescript
/**
 * API Error response
 */
interface AIError {
  error: {
    message: string;
    type: string;
    code: string;
    param?: string;
    resetAt?: string;  // ISO 8601 timestamp (for rate limits)
  };
}

/**
 * Custom error class
 */
class SmartLinksAIError extends Error {
  type: string;
  code: string;
  statusCode: number;
  resetAt?: string;

  isRateLimitError(): boolean;
  isAuthError(): boolean;
  isNotFoundError(): boolean;
}
```

---

## API Reference

### Admin Endpoints

#### `ai.chat.completions.create(collectionId, request)`

Create a chat completion (OpenAI-compatible).

**Parameters:**
- `collectionId` (string) - Collection ID
- `request` (ChatCompletionRequest) - Request parameters

**Returns:** `Promise<ChatCompletionResponse | AsyncIterable<ChatCompletionChunk>>`

**Example:**
```typescript
const response = await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

---

#### `ai.models.list(collectionId)`

List available AI models.

**Returns:** `Promise<ModelList>`

---

#### `ai.models.get(collectionId, modelId)`

Get specific model information.

**Parameters:**
- `modelId` (string) - Model identifier (e.g., 'google/gemini-2.5-flash')

**Returns:** `Promise<AIModel>`

---

#### `ai.rag.indexDocument(collectionId, request)`

Index a document for RAG.

**Parameters:**
- `request` (IndexDocumentRequest) - Document and indexing parameters

**Returns:** `Promise<IndexDocumentResponse>`

---

#### `ai.rag.configureAssistant(collectionId, request)`

Configure AI assistant behavior.

**Parameters:**
- `request` (ConfigureAssistantRequest) - Assistant configuration

**Returns:** `Promise<ConfigureAssistantResponse>`

---

#### `ai.sessions.stats(collectionId)`

Get session statistics.

**Returns:** `Promise<SessionStatistics>`

---

#### `ai.rateLimit.reset(collectionId, userId)`

Reset rate limit for a user.

**Returns:** `Promise<{ success: boolean; userId: string }>`

---

#### `ai.podcast.generate(collectionId, request)`

Generate a NotebookLM-style conversational podcast.

**Parameters:**
- `request` (GeneratePodcastRequest) - Podcast generation parameters

**Returns:** `Promise<GeneratePodcastResponse>`

**Example:**
```typescript
const podcast = await ai.podcast.generate('my-collection', {
  productId: 'coffee-maker-deluxe',
  duration: 5,
  style: 'casual',
  voices: { host1: 'nova', host2: 'onyx' },
  includeAudio: true
});
```

---

#### `ai.podcast.getStatus(collectionId, podcastId)`

Get podcast generation status.

**Parameters:**
- `podcastId` (string) - Podcast identifier

**Returns:** `Promise<PodcastStatus>`

---

#### `ai.tts.generate(collectionId, request)`

Generate text-to-speech audio.

**Parameters:**
- `request` (TTSRequest) - TTS parameters

**Returns:** `Promise<Blob>`

**Example:**
```typescript
const audioBlob = await ai.tts.generate('my-collection', {
  text: 'Welcome to our podcast!',
  voice: 'nova',
  speed: 1.0
});
```

---

### Public Endpoints

#### `ai.publicApi.chat(collectionId, request)`

Chat with product assistant (no auth required).

**Parameters:**
- `request` (PublicChatRequest) - Chat parameters

**Returns:** `Promise<PublicChatResponse>`

**Rate Limited:** Yes (20 requests/hour per userId by default)

---

#### `ai.publicApi.getSession(collectionId, sessionId)`

Get conversation history.

**Returns:** `Promise<Session>`

---

#### `ai.publicApi.clearSession(collectionId, sessionId)`

Clear conversation history.

**Returns:** `Promise<{ success: boolean }>`

---

#### `ai.publicApi.getRateLimit(collectionId, userId)`

Check rate limit status.

**Returns:** `Promise<RateLimitStatus>`

---

#### `ai.publicApi.getToken(collectionId, request)`

Generate ephemeral token for Gemini Live.

**Returns:** `Promise<EphemeralTokenResponse>`

---

## Usage Examples

### Example 1: Product FAQ Bot

```typescript
async function createProductFAQ() {
  const collectionId = 'my-collection';
  const productId = 'coffee-maker-deluxe';

  // 1. Index product documentation
  await ai.rag.indexDocument(collectionId, {
    productId,
    documentUrl: 'https://example.com/manual.pdf'
  });

  // 2. Configure assistant
  await ai.rag.configureAssistant(collectionId, {
    productId,
    systemPrompt: 'You are a coffee maker expert. Provide clear, step-by-step instructions.',
    rateLimitPerUser: 30
  });

  // 3. Answer user questions
  const answer = await ai.publicApi.chat(collectionId, {
    productId,
    userId: 'user-123',
    message: 'How do I make espresso?'
  });

  console.log(answer.message);
}
```

### Example 2: Streaming Chatbot UI

```typescript
async function streamingChatbot(userMessage: string) {
  const stream = await ai.chat.completions.create('my-collection', {
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: userMessage }
    ],
    stream: true
  });

  let fullResponse = '';
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    fullResponse += content;
    
    // Update UI in real-time
    updateChatUI(content);
  }

  return fullResponse;
}
```

### Example 3: Multi-Turn Conversation

```typescript
async function chatConversation() {
  const collectionId = 'my-collection';
  const sessionId = `chat-${Date.now()}`;
  const userId = 'user-123';
  const productId = 'coffee-maker-deluxe';

  // Question 1
  const a1 = await ai.publicApi.chat(collectionId, {
    productId,
    userId,
    message: 'How do I clean the machine?',
    sessionId
  });
  console.log('A1:', a1.message);

  // Question 2 (references previous context)
  const a2 = await ai.publicApi.chat(collectionId, {
    productId,
    userId,
    message: 'How often should I do that?',
    sessionId
  });
  console.log('A2:', a2.message);

  // Get full history
  const session = await ai.publicApi.getSession(collectionId, sessionId);
  console.log('Full conversation:', session.messages);
}
```

### Example 4: React Hook for Product Assistant

```typescript
import { useState, useCallback } from 'react';
import { ai } from '@proveanything/smartlinks';

export function useProductAssistant(
  collectionId: string,
  productId: string,
  userId: string
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState({ remaining: 20, limit: 20 });

  const ask = useCallback(async (message: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ai.publicApi.chat(collectionId, {
        productId,
        userId,
        message
      });

      setRateLimit(prev => ({
        ...prev,
        remaining: prev.remaining - 1
      }));

      return response.message;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionId, productId, userId]);

  return { ask, loading, error, rateLimit };
}

// Usage in component
function ProductHelp() {
  const { ask, loading, rateLimit } = useProductAssistant(
    'my-collection',
    'coffee-maker',
    'user-123'
  );
  const [answer, setAnswer] = useState('');

  const handleAsk = async () => {
    const response = await ask('How do I clean this?');
    setAnswer(response);
  };

  return (
    <div>
      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Asking...' : 'Ask Question'}
      </button>
      {answer && <p>{answer}</p>}
      <p>{rateLimit.remaining} questions remaining</p>
    </div>
  );
}
```

### Example 5: Voice Q&A

```typescript
async function voiceQA() {
  if (!ai.voice.isSupported()) {
    console.error('Voice not supported in this browser');
    return;
  }

  console.log('Speak your question...');
  
  // Listen for voice input
  const question = await ai.voice.listen('en-US');
  console.log('You asked:', question);

  // Get answer from AI
  const response = await ai.public.chat('my-collection', {
    productId: 'coffee-maker-deluxe',
    userId: 'user-123',
    message: question
  });

  // Display answer
  console.log('Answer:', response.message);

  // Speak answer
  await ai.voice.speak(response.message);
}
```

### Example 6: Generate Product Podcast

```typescript
async function generateProductPodcast() {
  // Generate a casual 5-minute podcast about the coffee maker
  const podcast = await ai.podcast.generate('my-collection', {
    productId: 'coffee-maker-deluxe',
    duration: 5,              // minutes
    style: 'casual',          // Conversational style
    voices: {
      host1: 'nova',          // Female voice
      host2: 'onyx'           // Male voice
    },
    includeAudio: true
  });

  console.log('Podcast Title:', podcast.script.title);
  console.log('Duration:', podcast.metadata.duration, 'seconds');
  
  // Display script
  console.log('\nScript:');
  podcast.script.segments.forEach((segment, i) => {
    const speaker = segment.speaker === 'host1' ? 'Host 1' : 'Host 2';
    console.log(`\n${speaker}: ${segment.text}`);
  });

  // Download audio
  if (podcast.audio?.mixedUrl) {
    console.log('\nDownload podcast:', podcast.audio.mixedUrl);
  }
}
```

### Example 7: Podcast with Progress Tracking

```typescript
async function generatePodcastWithProgress() {
  // Start podcast generation
  const podcast = await ai.podcast.generate('my-collection', {
    productId: 'coffee-maker-deluxe',
    duration: 10,
    style: 'professional',
    includeAudio: true
  });

  const podcastId = podcast.podcastId;

  // Poll for status
  const checkStatus = async () => {
    const status = await ai.podcast.getStatus('my-collection', podcastId);
    
    console.log(`Status: ${status.status} (${status.progress}%)`);
    
    if (status.status === 'completed' && status.result) {
      console.log('Podcast ready!');
      console.log('Listen:', status.result.audio?.mixedUrl);
      return true;
    } else if (status.status === 'failed') {
      console.error('Generation failed:', status.error);
      return true;
    }
    
    return false;
  };

  // Check every 5 seconds
  const interval = setInterval(async () => {
    const done = await checkStatus();
    if (done) clearInterval(interval);
  }, 5000);
}
```

---

## Error Handling

### Error Codes

| Code | Type | HTTP Status | Description |
|------|------|-------------|-------------|
| `rate_limit_exceeded` | `rate_limit_error` | 429 | User exceeded rate limit |
| `invalid_request` | `invalid_request_error` | 400 | Invalid parameters |
| `authentication_error` | `authentication_error` | 401 | Invalid/missing API key |
| `permission_denied` | `permission_error` | 403 | Insufficient permissions |
| `not_found` | `not_found_error` | 404 | Resource not found |
| `document_not_found` | `not_found_error` | 404 | Product document not indexed |
| `server_error` | `server_error` | 500 | Internal server error |
| `service_unavailable` | `server_error` | 503 | Service temporarily unavailable |

### Error Handling Pattern

```typescript
import { SmartLinksAIError } from '@proveanything/smartlinks';

async function robustChat() {
  try {
    const response = await ai.publicApi.chat('my-collection', {
      productId: 'coffee-maker',
      userId: 'user-123',
      message: 'Help!'
    });
    return response.message;
  } catch (error) {
    if (error instanceof SmartLinksAIError) {
      switch (error.code) {
        case 'rate_limit_exceeded':
          console.error('Rate limit exceeded');
          console.log('Try again at:', new Date(error.resetAt!));
          break;
        case 'document_not_found':
          console.error('Product manual not indexed yet');
          break;
        case 'authentication_error':
          console.error('Invalid API key');
          break;
        case 'invalid_request':
          console.error('Invalid request:', error.message);
          break;
        default:
          console.error('API error:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
```

### Rate Limit Retry

```typescript
async function chatWithRetry(
  request: PublicChatRequest,
  maxRetries = 3
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await ai.publicApi.chat('my-collection', request);
    } catch (error) {
      if (error instanceof SmartLinksAIError && error.isRateLimitError()) {
        if (retries === maxRetries - 1) throw error;

        const resetTime = new Date(error.resetAt!).getTime();
        const waitTime = resetTime - Date.now();

        console.log(`Rate limited. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));

        retries++;
      } else {
        throw error;
      }
    }
  }
}
```

---

## Rate Limiting

### Rate Limit Overview

Public endpoints are rate-limited per `userId`:

| Endpoint Type | Default Limit | Window |
|--------------|---------------|--------|
| Public Chat | 20 requests | 1 hour |
| Token Generation | 10 requests | 1 hour |
| Admin Endpoints | Unlimited* | - |

*Admin endpoints use API key authentication and are not rate-limited by default.

### Rate Limit Headers

All API responses include rate limit information:

```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1707300000000
```

### Checking Rate Limit

```typescript
// Check rate limit status before making requests
const status = await ai.publicApi.getRateLimit('my-collection', 'user-123');

console.log('Used:', status.used);
console.log('Remaining:', status.remaining);
console.log('Resets at:', new Date(status.resetAt));

if (status.remaining > 0) {
  // Safe to make request
  await ai.publicApi.chat(/* ... */);
} else {
  // Show user when they can ask again
  console.log('Rate limit reached. Try again at:', status.resetAt);
}
```

### Resetting Rate Limits (Admin)

```typescript
// Reset rate limit for a specific user
await ai.rateLimit.reset('my-collection', 'user-123');
console.log('Rate limit reset for user-123');
```

---

## Best Practices

### 1. Choose the Right Model

```typescript
// For simple Q&A (fast, cheap)
await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-flash-lite',
  messages: [...]
});

// For general use (balanced)
await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-flash',
  messages: [...]
});

// For complex reasoning (powerful)
await ai.chat.completions.create('my-collection', {
  model: 'google/gemini-2.5-pro',
  messages: [...]
});
```

### 2. Use Streaming for Long Responses

Improve perceived performance with streaming:

```typescript
// Non-streaming: User waits for full response
const response = await ai.chat.completions.create('my-collection', {
  messages: [...]
});

// Streaming: User sees progress immediately
const stream = await ai.chat.completions.create('my-collection', {
  stream: true,
  messages: [...]
});

for await (const chunk of stream) {
  updateUI(chunk.choices[0]?.delta?.content);
}
```

### 3. Maintain Session Context

Keep conversations coherent with session IDs:

```typescript
// Generate unique session ID per conversation
const sessionId = `user-${userId}-product-${productId}`;

// All questions in same conversation use same sessionId
await ai.public.chat('my-collection', {
  sessionId,
  message: 'First question',
  ...
});

await ai.public.chat('my-collection', {
  sessionId,
  message: 'Follow-up question',
  ...
});
```

### 4. Handle Rate Limits Gracefully

Show clear feedback to users:

```typescript
try {
  await ai.publicApi.chat('my-collection', {...});
} catch (error) {
  if (error instanceof SmartLinksAIError && error.isRateLimitError()) {
    const resetTime = new Date(error.resetAt!);
    showNotification(
      `You've reached your question limit. ` +
      `Try again at ${resetTime.toLocaleTimeString()}`
    );
  }
}
```

### 5. Optimize Voice UX

Provide clear status updates:

```typescript
async function voiceAssistant() {
  try {
    showStatus('Listening...');
    const question = await ai.voice.listen();

    showStatus('Processing...');
    const answer = await ai.public.chat('my-collection', {
      message: question,
      ...
    });

    showStatus('Speaking...');
    await ai.voice.speak(answer.message);

    showStatus('Ready');
  } catch (error) {
    showStatus('Error', error.message);
  }
}
```

### 6. Chunk Large Documents

For better RAG performance, chunk documents appropriately:

```typescript
// For technical manuals
await ai.rag.indexDocument('my-collection', {
  productId: 'coffee-maker',
  documentUrl: '...',
  chunkSize: 500,  // Smaller chunks for precise answers
  overlap: 50      // Overlap maintains context
});

// For narrative content
await ai.rag.indexDocument('my-collection', {
  productId: 'coffee-maker',
  documentUrl: '...',
  chunkSize: 1000, // Larger chunks for coherent responses
  overlap: 100
});
```

### 7. Use System Prompts Effectively

Provide clear instructions:

```typescript
await ai.chat.completions.create('my-collection', {
  messages: [
    {
      role: 'system',
      content: `You are a coffee maker expert assistant.
- Be concise and clear
- Use numbered lists for steps
- Always mention safety precautions
- If unsure, ask for clarification`
    },
    { role: 'user', content: 'How do I descale?' }
  ]
});
```

### 8. Monitor Usage and Costs

Track usage for cost management:

```typescript
const response = await ai.chat.completions.create('my-collection', {
  messages: [...]
});

// Log token usage
console.log('Usage:', response.usage);
console.log('Prompt tokens:', response.usage.prompt_tokens);
console.log('Completion tokens:', response.usage.completion_tokens);
console.log('Total tokens:', response.usage.total_tokens);

// Calculate estimated cost
const model = await ai.models.get('my-collection', response.model);
const cost = 
  (response.usage.prompt_tokens * model.pricing.input / 1_000_000) +
  (response.usage.completion_tokens * model.pricing.output / 1_000_000);
console.log('Estimated cost: $', cost.toFixed(4));
```

---

## Related Documentation

- [API Summary](./API_SUMMARY.md) - Complete API reference
- [Widgets](./widgets.md) - Embedding SmartLinks components
- [Realtime](./realtime.md) - Realtime data updates
- [iframe Responder](./iframe-responder.md) - iframe integration

---

## Support

For questions or issues:

- **Documentation:** https://smartlinks.app/docs
- **GitHub:** https://github.com/Prove-Anything/smartlinks
- **Email:** support@smartlinks.app
