# Real-Time Messaging with Ably

This guide covers adding Ably real-time messaging to SmartLinks apps that need live updates, chat, or presence features.

---

## Overview

Ably provides real-time pub/sub messaging over WebSockets. It's ideal for:

- **Live chat** between users
- **Real-time vote/poll results** that update instantly
- **Presence indicators** showing who's online
- **Live activity feeds** and notifications
- **Collaborative features** without polling

### Why It's Not in the Base Template

Ably is intentionally excluded from the base template because:

1. **Bundle size**: Ably SDK adds ~50KB+ to the bundle
2. **Connection overhead**: Initializing Ably opens a WebSocket connection
3. **Cost**: Ably charges per connection/message
4. **Not always needed**: Most apps (pamphlets, manuals, warranties) don't need real-time

Apps that need real-time features should add Ably on-demand.

---

## Installation

Add Ably to your app:

```bash
npm install ably
```

This adds the Ably SDK with React hooks support.

---

## Quick Start

### 1. Create the Ably Client

```typescript
// src/lib/ably.ts
import Ably from 'ably';

export const createAblyClient = (apiKey: string) => {
  return new Ably.Realtime({ key: apiKey });
};
```

### 2. Add the Provider

Wrap your app with the Ably provider:

```typescript
// In PublicApp.tsx or AdminApp.tsx
import { AblyProvider } from 'ably/react';
import { createAblyClient } from '@/lib/ably';

const ablyClient = createAblyClient(import.meta.env.VITE_ABLY_API_KEY);

function App() {
  return (
    <AblyProvider client={ablyClient}>
      <YourApp />
    </AblyProvider>
  );
}
```

### 3. Subscribe to a Channel

```typescript
import { useChannel } from 'ably/react';
import { useState } from 'react';

export const LiveUpdates = ({ collectionId }: { collectionId: string }) => {
  const [updates, setUpdates] = useState<string[]>([]);

  const { channel } = useChannel(
    `collection:${collectionId}:updates`,
    (message) => {
      setUpdates(prev => [...prev, message.data.text]);
    }
  );

  const sendUpdate = (text: string) => {
    channel.publish('update', { text });
  };

  return (
    <div>
      {updates.map((update, i) => (
        <p key={i}>{update}</p>
      ))}
      <button onClick={() => sendUpdate('Hello!')}>
        Send Update
      </button>
    </div>
  );
};
```

---

## Setup Patterns

### Option A: Direct API Key (Development)

For development or simple apps where the API key can be in environment variables:

```typescript
// src/lib/ably.ts
import Ably from 'ably';

export const createAblyClient = () => {
  const apiKey = import.meta.env.VITE_ABLY_API_KEY;
  
  if (!apiKey) {
    console.warn('VITE_ABLY_API_KEY not set - real-time features disabled');
    return null;
  }
  
  return new Ably.Realtime({ key: apiKey });
};
```

Add to your `.env`:

```env
VITE_ABLY_API_KEY=your-ably-api-key
```

### Option B: Token Auth (Production) - SmartLinks SDK

For production apps, use the SmartLinks SDK's built-in token authentication:

```typescript
// src/lib/ably.ts
import Ably from 'ably';
import * as SL from '@proveanything/smartlinks';

/**
 * Create an Ably client using SmartLinks token authentication.
 * This is the recommended approach for production apps.
 */
export const createAblyClientWithSmartLinks = (collectionId: string, appId?: string) => {
  return new Ably.Realtime({
    authCallback: async (tokenParams, callback) => {
      try {
        // Use the SmartLinks SDK to get a scoped token
        const tokenRequest = await SL.realtime.getPublicToken({
          collectionId,
          appId,
        });
        callback(null, tokenRequest);
      } catch (error) {
        callback(error as Error, null);
      }
    }
  });
};

/**
 * Create an Ably client for admin real-time features.
 * Provides subscribe-only access to interaction channels.
 */
export const createAblyClientForAdmin = () => {
  return new Ably.Realtime({
    authCallback: async (tokenParams, callback) => {
      try {
        const tokenRequest = await SL.realtime.getAdminToken();
        callback(null, tokenRequest);
      } catch (error) {
        callback(error as Error, null);
      }
    }
  });
};
```

### SmartLinks SDK Real-Time Functions

The SDK provides two token endpoints:

| Function | Use Case | Parameters |
|----------|----------|------------|
| `SL.realtime.getPublicToken()` | User-scoped real-time (chat, votes, presence) | `collectionId` (required), `appId` (optional) |
| `SL.realtime.getAdminToken()` | Admin real-time (interaction monitoring) | None |

Both require the user to be authenticated via the parent SmartLinks platform.

Token auth benefits:
- API key never exposed to client
- Tokens can have capability restrictions
- Tokens expire automatically

### Conditional Provider Setup

Handle cases where Ably isn't configured:

```typescript
// src/providers/AblyProvider.tsx
import { AblyProvider as AblyReactProvider } from 'ably/react';
import { createAblyClient } from '@/lib/ably';
import { ReactNode, useMemo } from 'react';

interface Props {
  children: ReactNode;
}

export const AblyProvider = ({ children }: Props) => {
  const client = useMemo(() => createAblyClient(), []);
  
  // If no client (no API key), render children without provider
  if (!client) {
    return <>{children}</>;
  }
  
  return (
    <AblyReactProvider client={client}>
      {children}
    </AblyReactProvider>
  );
};
```

---

## Common Patterns

### Subscribing to a Channel

```typescript
import { useChannel } from 'ably/react';

const MyComponent = () => {
  const { channel } = useChannel('my-channel', (message) => {
    console.log('Received:', message.name, message.data);
  });

  return <div>Listening...</div>;
};
```

### Publishing Messages

```typescript
const { channel } = useChannel('my-channel', handleMessage);

const sendMessage = (text: string) => {
  channel.publish('message', { 
    text,
    timestamp: Date.now(),
    sender: userId 
  });
};
```

### Presence (Who's Online)

```typescript
import { usePresence } from 'ably/react';

const OnlineUsers = ({ roomId }: { roomId: string }) => {
  const { presenceData, updateStatus } = usePresence(roomId, {
    id: currentUser.id,
    name: currentUser.name,
  });

  return (
    <div>
      <h3>Online ({presenceData.length})</h3>
      <ul>
        {presenceData.map((member) => (
          <li key={member.clientId}>{member.data.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

### Connection State

```typescript
import { useConnectionStateListener } from 'ably/react';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('connecting');
  
  useConnectionStateListener((stateChange) => {
    setStatus(stateChange.current);
  });

  return (
    <div className={status === 'connected' ? 'text-green-500' : 'text-yellow-500'}>
      {status}
    </div>
  );
};
```

---

## SmartLinks Integration

### Channel Naming Conventions

Use consistent channel names that include SmartLinks context:

| Scope | Pattern | Example |
|-------|---------|---------|
| Collection | `collection:${collectionId}:${feature}` | `collection:abc123:updates` |
| Product | `product:${collectionId}:${productId}:${feature}` | `product:abc123:prod456:chat` |
| Proof | `proof:${collectionId}:${productId}:${proofId}:${feature}` | `proof:abc123:prod456:prf789:activity` |

### Helper for Channel Names

```typescript
// src/lib/ably-channels.ts
export const channels = {
  collectionUpdates: (collectionId: string) => 
    `collection:${collectionId}:updates`,
    
  productChat: (collectionId: string, productId: string) => 
    `product:${collectionId}:${productId}:chat`,
    
  proofActivity: (collectionId: string, productId: string, proofId: string) => 
    `proof:${collectionId}:${productId}:${proofId}:activity`,
    
  voteResults: (collectionId: string, appId: string, interactionId: string) =>
    `votes:${collectionId}:${appId}:${interactionId}`,
};
```

### Usage with SmartLinks Context

```typescript
import { useChannel } from 'ably/react';
import { usePersistentQueryParams } from '@/hooks/usePersistentQueryParams';
import { channels } from '@/lib/ably-channels';

const LiveProductChat = () => {
  const { persistentQueryParams } = usePersistentQueryParams();
  const { collectionId, productId } = persistentQueryParams;
  
  const channelName = channels.productChat(collectionId!, productId!);
  
  const { channel } = useChannel(channelName, (message) => {
    // Handle incoming chat message
  });

  // ...
};
```

---

## Example: Live Chat Component

Full working example of a chat component:

```typescript
// src/components/LiveChat.tsx
import { useChannel, usePresence } from 'ably/react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  senderName: string;
  timestamp: number;
}

interface LiveChatProps {
  channelName: string;
  userId: string;
  userName: string;
}

export const LiveChat = ({ channelName, userId, userName }: LiveChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to chat messages
  const { channel } = useChannel(channelName, (message) => {
    if (message.name === 'chat') {
      setMessages(prev => [...prev, message.data as ChatMessage]);
    }
  });

  // Track presence
  const { presenceData } = usePresence(channelName, {
    id: userId,
    name: userName,
  });

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const message: ChatMessage = {
      id: `${userId}-${Date.now()}`,
      text: inputValue.trim(),
      sender: userId,
      senderName: userName,
      timestamp: Date.now(),
    };

    channel.publish('chat', message);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-[400px] border rounded-lg">
      {/* Header with presence */}
      <div className="p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Live Chat</span>
          <span className="text-xs text-muted-foreground">
            ({presenceData.length} online)
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${
                msg.sender === userId ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {msg.senderName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg px-3 py-2 max-w-[70%] ${
                  msg.sender === userId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="sm">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
```

---

## Example: Live Vote Counter

Display real-time vote tallies:

```typescript
// src/components/LiveVoteCounter.tsx
import { useChannel } from 'ably/react';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import * as SL from '@proveanything/smartlinks';

interface VoteCounts {
  [option: string]: number;
}

interface LiveVoteCounterProps {
  collectionId: string;
  appId: string;
  interactionId: string;
  options: string[];
}

export const LiveVoteCounter = ({
  collectionId,
  appId,
  interactionId,
  options,
}: LiveVoteCounterProps) => {
  const [votes, setVotes] = useState<VoteCounts>({});
  const channelName = `votes:${collectionId}:${appId}:${interactionId}`;

  // Fetch initial counts
  useEffect(() => {
    const fetchCounts = async () => {
      const counts = await SL.interactions.countsByOutcome(collectionId, {
        appId,
        interactionId,
      });
      setVotes(counts || {});
    };
    fetchCounts();
  }, [collectionId, appId, interactionId]);

  // Subscribe to real-time vote updates
  useChannel(channelName, (message) => {
    if (message.name === 'vote') {
      const { option } = message.data;
      setVotes(prev => ({
        ...prev,
        [option]: (prev[option] || 0) + 1,
      }));
    }
  });

  const totalVotes = Object.values(votes).reduce((sum, n) => sum + n, 0);

  return (
    <div className="space-y-4 p-4">
      <h3 className="font-semibold">Live Results</h3>
      
      {options.map((option) => {
        const count = votes[option] || 0;
        const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;

        return (
          <div key={option} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{option}</span>
              <span className="text-muted-foreground">
                {count} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      })}

      <p className="text-sm text-muted-foreground text-center">
        Total votes: {totalVotes}
      </p>
    </div>
  );
};
```

### Publishing Vote Updates

When a user votes, publish to the channel:

```typescript
const submitVote = async (option: string) => {
  // Record in SmartLinks
  await SL.interactions.submitPublicEvent(collectionId, {
    appId,
    interactionId: 'poll',
    outcome: option,
  });

  // Publish to Ably for real-time updates
  channel.publish('vote', { option });
};
```

---

## Best Practices

### 1. Clean Up Subscriptions

React hooks automatically handle cleanup, but for manual subscriptions:

```typescript
useEffect(() => {
  const channel = ably.channels.get('my-channel');
  
  const handler = (message: Ably.Message) => {
    // Handle message
  };
  
  channel.subscribe('event', handler);
  
  return () => {
    channel.unsubscribe('event', handler);
  };
}, []);
```

### 2. Handle Connection States

```typescript
const { channel } = useChannel('my-channel', handleMessage);

useConnectionStateListener((stateChange) => {
  if (stateChange.current === 'disconnected') {
    // Show reconnecting UI
  }
  if (stateChange.current === 'connected') {
    // Clear reconnecting UI, maybe refetch missed messages
  }
});
```

### 3. Debounce Rapid Updates

For typing indicators or frequent updates:

```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedPublish = useDebouncedCallback((data) => {
  channel.publish('typing', data);
}, 300);
```

### 4. Message Size Limits

Ably has a 64KB message size limit. For large data:
- Store in SmartLinks/database
- Send only the ID via Ably
- Fetch full data on receive

```typescript
// Publishing
channel.publish('update', { recordId: '123' });

// Receiving
useChannel(channelName, async (message) => {
  const fullData = await SL.appConfiguration.getDataItem({
    collectionId,
    appId,
    itemId: message.data.recordId,
  });
  // Use fullData
});
```

### 5. Error Handling

```typescript
try {
  await channel.publish('event', data);
} catch (error) {
  if (error instanceof Ably.ErrorInfo) {
    console.error('Ably error:', error.code, error.message);
    // Handle specific error codes
  }
}
```

---

## Environment Variables

For development, add to your local `.env`:

```env
VITE_ABLY_API_KEY=your-api-key-here
```

For production, use Lovable Cloud secrets or your deployment platform's environment variables.

---

## TypeScript Types

Ably provides full TypeScript support. Key types:

```typescript
import Ably from 'ably';

// Message type
interface CustomMessage {
  text: string;
  sender: string;
  timestamp: number;
}

// Typed channel usage
const { channel } = useChannel<CustomMessage>('my-channel', (message) => {
  const data: CustomMessage = message.data;
  console.log(data.text); // Typed!
});

// Presence data type
interface PresenceData {
  id: string;
  name: string;
  status: 'active' | 'away';
}

const { presenceData } = usePresence<PresenceData>(channelName, {
  id: userId,
  name: userName,
  status: 'active',
});
```

---

## Troubleshooting

### "Ably is not defined"

Ensure you've installed the package:
```bash
npm install ably
```

### "No API key provided"

Check that `VITE_ABLY_API_KEY` is set in your environment.

### Messages not received

1. Check channel names match exactly
2. Verify connection state is 'connected'
3. Check browser console for Ably errors
4. Ensure you're subscribed before publishing

### Too many connections

Each browser tab opens a new connection. In development:
- Close unused tabs
- Use the same client instance across components (provider pattern)
