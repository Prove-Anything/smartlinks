// examples/ai-react-demo.tsx
// React example demonstrating SmartLinks AI integration

import React, { useState, useCallback, useEffect } from 'react';
import { initializeApi, ai } from '@proveanything/smartlinks';

// Initialize SDK
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1'
});

// ============================================================================
// Custom Hook: useProductAssistant
// ============================================================================
interface UseProductAssistantOptions {
  collectionId: string;
  productId: string;
  userId: string;
}

interface UseProductAssistantResult {
  ask: (message: string) => Promise<string>;
  loading: boolean;
  error: string | null;
  rateLimit: { remaining: number; limit: number };
  sessionId: string | null;
}

export function useProductAssistant(
  options: UseProductAssistantOptions
): UseProductAssistantResult {
  const { collectionId, productId, userId } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState({ remaining: 20, limit: 20 });
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize session ID
  useEffect(() => {
    setSessionId(`session-${userId}-${Date.now()}`);
  }, [userId]);

  // Check rate limit on mount
  useEffect(() => {
    async function checkLimit() {
      try {
        const status = await ai.publicApi.getRateLimit(collectionId, userId);
        setRateLimit({
          remaining: status.remaining,
          limit: status.used + status.remaining
        });
      } catch (err: any) {
        console.error('Failed to check rate limit:', err);
      }
    }
    checkLimit();
  }, [collectionId, userId]);

  const ask = useCallback(async (message: string) => {
    if (!sessionId) {
      throw new Error('Session not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ai.publicApi.chat(collectionId, {
        productId,
        userId,
        message,
        sessionId
      });

      setRateLimit(prev => ({
        ...prev,
        remaining: Math.max(0, prev.remaining - 1)
      }));

      return response.message;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionId, productId, userId, sessionId]);

  return { ask, loading, error, rateLimit, sessionId };
}

// ============================================================================
// Component: ProductHelpChat
// ============================================================================
interface ProductHelpChatProps {
  collectionId: string;
  productId: string;
  userId: string;
}

export function ProductHelpChat(props: ProductHelpChatProps) {
  const { collectionId, productId, userId } = props;
  const { ask, loading, error, rateLimit } = useProductAssistant({
    collectionId,
    productId,
    userId
  });

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Get AI response
      const response = await ask(userMessage);
      
      // Add assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error('Failed to get response:', err);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h2>Product Assistant</h2>
      
      {/* Rate Limit Display */}
      <div style={{ 
        padding: '10px', 
        background: '#f0f0f0', 
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        Questions remaining: {rateLimit.remaining} / {rateLimit.limit}
      </div>

      {/* Messages */}
      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '20px',
        background: '#fafafa'
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#999', textAlign: 'center' }}>
            Ask a question about this product...
          </p>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '8px',
            background: msg.role === 'user' ? '#e3f2fd' : '#fff',
            border: msg.role === 'assistant' ? '1px solid #ddd' : 'none'
          }}>
            <strong style={{ 
              display: 'block', 
              marginBottom: '5px',
              color: msg.role === 'user' ? '#1976d2' : '#388e3c'
            }}>
              {msg.role === 'user' ? 'You' : 'Assistant'}
            </strong>
            {msg.content}
          </div>
        ))}

        {loading && (
          <div style={{ textAlign: 'center', color: '#999' }}>
            Thinking...
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '10px',
          background: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          {error}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={loading || rateLimit.remaining === 0}
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || rateLimit.remaining === 0}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: loading || rateLimit.remaining === 0 ? '#ccc' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || rateLimit.remaining === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>

      {rateLimit.remaining === 0 && (
        <p style={{ color: '#c62828', marginTop: '10px', textAlign: 'center' }}>
          You've reached your question limit. Please try again later.
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Component: VoiceAssistant
// ============================================================================
interface VoiceAssistantProps {
  collectionId: string;
  productId: string;
  userId: string;
}

export function VoiceAssistant(props: VoiceAssistantProps) {
  const { collectionId, productId, userId } = props;
  const { ask } = useProductAssistant({ collectionId, productId, userId });
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(ai.voice.isSupported());
  }, []);

  const handleVoiceQuery = async () => {
    if (!supported) return;

    try {
      // Listen
      setIsListening(true);
      setStatus('Listening...');
      
      const question = await ai.voice.listen('en-US');
      setIsListening(false);
      setStatus(`You asked: "${question}"`);

      // Get answer
      setStatus('Processing...');
      const answer = await ask(question);
      
      // Speak
      setIsSpeaking(true);
      setStatus('Speaking...');
      await ai.voice.speak(answer, { rate: 1.0 });
      
      setIsSpeaking(false);
      setStatus('Ready');
    } catch (error: any) {
      setIsListening(false);
      setIsSpeaking(false);
      setStatus('Error: ' + error.message);
    }
  };

  if (!supported) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Voice is not supported in this browser.</p>
        <p style={{ color: '#999' }}>
          Try Chrome, Edge, or Safari for voice features.
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      padding: '40px',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h2>Voice Assistant</h2>
      
      <div style={{
        padding: '30px',
        background: isListening ? '#e3f2fd' : isSpeaking ? '#f3e5f5' : '#f5f5f5',
        borderRadius: '50%',
        width: '150px',
        height: '150px',
        margin: '30px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px'
      }}>
        {isListening ? '🎤' : isSpeaking ? '🔊' : '🤖'}
      </div>

      <p style={{ 
        fontSize: '18px', 
        marginBottom: '30px',
        minHeight: '60px'
      }}>
        {status}
      </p>

      <button
        onClick={handleVoiceQuery}
        disabled={isListening || isSpeaking}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          background: isListening || isSpeaking ? '#ccc' : '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: isListening || isSpeaking ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ask a Question'}
      </button>

      <p style={{ color: '#999', marginTop: '20px', fontSize: '14px' }}>
        Click the button and speak your question
      </p>
    </div>
  );
}

// ============================================================================
// Component: AdminChatCompletion
// ============================================================================
interface AdminChatCompletionProps {
  collectionId: string;
  apiKey: string;
}

export function AdminChatCompletion(props: AdminChatCompletionProps) {
  const { collectionId } = props;
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('google/gemini-2.5-flash');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const result = await ai.chat.completions.create(collectionId, {
        model,
        messages: [
          { role: 'user', content: input }
        ]
      });

      setResponse(result.choices[0].message.content as string);
    } catch (error: any) {
      setResponse('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h2>Admin Chat Completion</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Model:
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          >
            <option value="google/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite (Fastest)</option>
            <option value="google/gemini-2.5-flash">Gemini 2.5 Flash (Balanced)</option>
            <option value="google/gemini-2.5-pro">Gemini 2.5 Pro (Most Capable)</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Prompt:
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt..."
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 20px',
            background: loading ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {response && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <strong>Response:</strong>
          <div style={{ marginTop: '10px' }}>
            {response}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Demo App
// ============================================================================
export default function AIDemo() {
  const [tab, setTab] = useState<'chat' | 'voice' | 'admin'>('chat');

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{
        borderBottom: '1px solid #ddd',
        marginBottom: '20px',
        padding: '10px 20px'
      }}>
        <button
          onClick={() => setTab('chat')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: tab === 'chat' ? '#1976d2' : '#f5f5f5',
            color: tab === 'chat' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Text Chat
        </button>
        <button
          onClick={() => setTab('voice')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: tab === 'voice' ? '#1976d2' : '#f5f5f5',
            color: tab === 'voice' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Voice
        </button>
        <button
          onClick={() => setTab('admin')}
          style={{
            padding: '10px 20px',
            background: tab === 'admin' ? '#1976d2' : '#f5f5f5',
            color: tab === 'admin' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Admin
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'chat' && (
        <ProductHelpChat
          collectionId="my-collection"
          productId="coffee-maker-deluxe"
          userId="demo-user-123"
        />
      )}
      
      {tab === 'voice' && (
        <VoiceAssistant
          collectionId="my-collection"
          productId="coffee-maker-deluxe"
          userId="demo-user-123"
        />
      )}
      
      {tab === 'admin' && (
        <AdminChatCompletion
          collectionId="my-collection"
          apiKey={process.env.REACT_APP_SMARTLINKS_API_KEY || ''}
        />
      )}
    </div>
  );
}
