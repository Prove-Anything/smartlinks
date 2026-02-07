// examples/ai-chat-demo.ts
// Demonstrates SmartLinks AI chat completions and RAG functionality

import { initializeApi, ai } from '@proveanything/smartlinks'

// Initialize the SDK
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  apiKey: process.env.SMARTLINKS_API_KEY
})

const COLLECTION_ID = 'my-collection'

// ============================================================================
// Example 1: Simple Chat Completion
// ============================================================================
async function simpleChatExample() {
  console.log('\n=== Simple Chat Example ===')
  
  const response = await ai.chat.completions.create(COLLECTION_ID, {
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is the capital of France?' }
    ]
  })

  console.log('Answer:', response.choices[0].message.content)
  console.log('Tokens used:', response.usage.total_tokens)
}

// ============================================================================
// Example 2: Streaming Chat
// ============================================================================
async function streamingChatExample() {
  console.log('\n=== Streaming Chat Example ===')
  
  try {
    const stream = await ai.chat.completions.create(COLLECTION_ID, {
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'user', content: 'Write a haiku about TypeScript' }
      ],
      stream: true
    })

    process.stdout.write('Response: ')
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      process.stdout.write(content)
    }
    console.log('\n')
  } catch (error: any) {
    console.log('Streaming not yet implemented:', error.message)
  }
}

// ============================================================================
// Example 3: Tool/Function Calling
// ============================================================================
async function toolCallingExample() {
  console.log('\n=== Tool Calling Example ===')
  
  const tools = [
    {
      type: 'function' as const,
      function: {
        name: 'get_weather',
        description: 'Get the current weather for a location',
        parameters: {
          type: 'object' as const,
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
  ]

  const response = await ai.chat.completions.create(COLLECTION_ID, {
    model: 'google/gemini-2.5-flash',
    messages: [
      { role: 'user', content: 'What\'s the weather in Paris in celsius?' }
    ],
    tools
  })

  const toolCall = response.choices[0].message.tool_calls?.[0]
  if (toolCall) {
    console.log('Function called:', toolCall.function.name)
    console.log('Arguments:', JSON.parse(toolCall.function.arguments))
  }
}

// ============================================================================
// Example 4: List Available Models
// ============================================================================
async function listModelsExample() {
  console.log('\n=== Available Models ===')
  
  const models = await ai.models.list(COLLECTION_ID)
  
  console.log(`Found ${models.data.length} models:\n`)
  models.data.forEach(model => {
    console.log(`${model.name}`)
    console.log(`  Provider: ${model.provider}`)
    console.log(`  Capabilities: ${model.capabilities.join(', ')}`)
    console.log(`  Context: ${model.contextWindow.toLocaleString()} tokens`)
    console.log(`  Pricing: $${model.pricing.input}/1M input, $${model.pricing.output}/1M output`)
    if (model.recommended) {
      console.log(`  ⭐ ${model.recommended}`)
    }
    console.log()
  })
}

// ============================================================================
// Example 5: RAG - Index Product Documentation
// ============================================================================
async function indexDocumentExample() {
  console.log('\n=== RAG: Index Product Document ===')
  
  const productId = 'coffee-maker-deluxe'
  
  // Index product manual
  const result = await ai.rag.indexDocument(COLLECTION_ID, {
    productId,
    text: `
      Coffee Maker Deluxe - User Manual
      
      Getting Started:
      1. Fill water reservoir with fresh water
      2. Add coffee grounds to filter
      3. Press power button to start
      
      Cleaning Instructions:
      Clean the machine weekly by running a descaling solution through it.
      Remove and wash the filter basket daily.
      
      Troubleshooting:
      - Machine won't turn on: Check power connection
      - Weak coffee: Use more grounds or less water
      - Machine is leaking: Check water reservoir is properly seated
    `,
    chunkSize: 200,
    overlap: 20
  })

  console.log('Success! Indexed', result.chunks, 'chunks')
  console.log('Embedding dimensions:', result.metadata.embeddingDimensions)
  console.log('Sample chunk:', result.sample?.text)
}

// ============================================================================
// Example 6: RAG - Configure Product Assistant
// ============================================================================
async function configureAssistantExample() {
  console.log('\n=== RAG: Configure Product Assistant ===')
  
  const result = await ai.rag.configureAssistant(COLLECTION_ID, {
    productId: 'coffee-maker-deluxe',
    systemPrompt: 'You are a helpful coffee maker expert. Provide clear, step-by-step instructions.',
    model: 'google/gemini-2.5-flash',
    temperature: 0.7,
    rateLimitPerUser: 30,
    allowedTopics: ['usage', 'cleaning', 'troubleshooting']
  })

  console.log('Assistant configured successfully!')
  console.log('System prompt:', result.configuration.systemPrompt)
  console.log('Rate limit:', result.configuration.rateLimitPerUser, 'requests/hour')
}

// ============================================================================
// Example 7: RAG - Public Chat (No Auth Required)
// ============================================================================
async function publicChatExample() {
  console.log('\n=== RAG: Public Chat (No Auth) ===')
  
  const response = await ai.publicApi.chat(COLLECTION_ID, {
    productId: 'coffee-maker-deluxe',
    userId: 'demo-user-123',
    message: 'How do I clean my coffee maker?'
  })

  console.log('Question: How do I clean my coffee maker?')
  console.log('Answer:', response.message)
  console.log('Session ID:', response.sessionId)
  console.log('Based on', response.context?.chunksUsed, 'document sections')
  console.log('Top similarity:', response.context?.topSimilarity)
}

// ============================================================================
// Example 8: RAG - Multi-Turn Conversation
// ============================================================================
async function conversationExample() {
  console.log('\n=== RAG: Multi-Turn Conversation ===')
  
  const sessionId = `demo-session-${Date.now()}`
  const userId = 'demo-user-123'
  const productId = 'coffee-maker-deluxe'

  // Question 1
  const q1 = await ai.publicApi.chat(COLLECTION_ID, {
    productId,
    userId,
    message: 'How do I clean the machine?',
    sessionId
  })
  console.log('Q1: How do I clean the machine?')
  console.log('A1:', q1.message)
  console.log()

  // Question 2 (uses conversation history)
  const q2 = await ai.publicApi.chat(COLLECTION_ID, {
    productId,
    userId,
    message: 'How often should I do that?',
    sessionId
  })
  console.log('Q2: How often should I do that?')
  console.log('A2:', q2.message)
  console.log()

  // Get full conversation history
  const session = await ai.publicApi.getSession(COLLECTION_ID, sessionId);
  console.log('Full conversation has', session.messageCount, 'messages')
}

// ============================================================================
// Example 9: Check Rate Limit
// ============================================================================
async function checkRateLimitExample() {
  console.log('\n=== Check Rate Limit ===')
  
  const status = await ai.publicApi.getRateLimit(COLLECTION_ID, 'demo-user-123');
  
  console.log('Rate limit status:')
  console.log('  Used:', status.used)
  console.log('  Remaining:', status.remaining)
  console.log('  Resets at:', new Date(status.resetAt).toLocaleString())
}

// ============================================================================
// Example 10: Session Statistics (Admin)
// ============================================================================
async function sessionStatsExample() {
  console.log('\n=== Session Statistics ===')
  
  const stats = await ai.sessions.stats(COLLECTION_ID)
  
  console.log('Total sessions:', stats.totalSessions)
  console.log('Active sessions:', stats.activeSessions)
  console.log('Total messages:', stats.totalMessages)
  console.log('Rate-limited users:', stats.rateLimitedUsers)
}

// ============================================================================
// Example 11: Voice Integration (Browser Only)
// ============================================================================
function voiceExample() {
  console.log('\n=== Voice Integration ===')
  
  if (typeof window === 'undefined') {
    console.log('Voice features are browser-only. Run this in a browser context.')
    console.log('\nExample usage:')
    console.log(`
    if (ai.voice.isSupported()) {
      // Listen for voice input
      const question = await ai.voice.listen('en-US');
      console.log('User asked:', question);
      
      // Get answer from AI
      const response = await ai.publicApi.chat(COLLECTION_ID, {
        productId: 'coffee-maker-deluxe',
        userId: 'user-123',
        message: question
      });
      
      // Speak the answer
      await ai.voice.speak(response.message);
    }
    `)
  }
}

// ============================================================================
// Run All Examples
// ============================================================================
async function main() {
  console.log('SmartLinks AI Chat Demo\n')
  console.log('Note: Some examples require product documents to be indexed first.')
  console.log('Adjust COLLECTION_ID and product IDs to match your setup.\n')

  try {
    // Basic chat examples
    await simpleChatExample()
    await streamingChatExample()
    await toolCallingExample()
    await listModelsExample()

    // RAG examples (uncomment after setting up product documents)
    // await indexDocumentExample()
    // await configureAssistantExample()
    // await publicChatExample()
    // await conversationExample()
    // await checkRateLimitExample()
    // await sessionStatsExample()

    // Voice example
    voiceExample()

    console.log('\n✅ All examples completed!')
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    if (error.statusCode) {
      console.error('Status:', error.statusCode)
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

export {
  simpleChatExample,
  streamingChatExample,
  toolCallingExample,
  listModelsExample,
  indexDocumentExample,
  configureAssistantExample,
  publicChatExample,
  conversationExample,
  checkRateLimitExample,
  sessionStatsExample,
  voiceExample
}
