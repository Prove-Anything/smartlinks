# IframeResponder - Parent-Side Iframe Communication

The `IframeResponder` enables bidirectional communication between a parent application and an embedded iframe, both using the SmartLinks SDK. This allows seamless integration of microapps within your application with automatic API proxying, authentication sync, and deep linking.

## Features

- **Automatic URL Resolution** - Fetches app configuration from collection and resolves the correct URL
- **API Request Proxying** - Forwards API requests from iframe to parent's authenticated session
- **Smart Caching** - Reduces API calls by serving cached collection, product, and proof data
- **Authentication Sync** - Handles login/logout events between parent and iframe
- **Deep Linking** - Synchronizes iframe routes with parent URL state
- **Responsive Sizing** - Calculates and reports optimal iframe dimensions
- **Chunked File Uploads** - Proxies large file uploads through the parent

## Basic Usage

### 1. Create and Attach Responder

```typescript
import * as smartlinks from '@proveanything/smartlinks';

// Initialize SDK
smartlinks.initializeApi({
  baseURL: 'https://api.smartlinks.io',
  apiKey: 'your-api-key',
});

// Create responder (URL resolved automatically from collection apps)
const responder = new smartlinks.IframeResponder({
  collectionId: 'acme-wines',
  appId: 'warranty-registration',
  productId: 'wine-bottle-123', // Optional context
  onAuthLogin: async (token, user) => {
    // Handle authentication from iframe
    smartlinks.setBearerToken(token);
    console.log('User logged in:', user);
  },
  onResize: (height) => {
    // Update iframe height
    iframeElement.style.height = `${height}px`;
  },
});

// Attach to iframe element
const iframe = document.getElementById('app-iframe') as HTMLIFrameElement;
const src = await responder.attach(iframe);
iframe.src = src;

// Cleanup when done
// responder.destroy();
```

### 2. With Pre-cached Data (Faster Loading)

```typescript
// Fetch data upfront
const collection = await smartlinks.collection.get('acme-wines');
const product = await smartlinks.product.get('wine-bottle-123');
const user = await smartlinks.auth.getAccountInfo();

const responder = new smartlinks.IframeResponder({
  collectionId: 'acme-wines',
  appId: 'warranty-registration',
  productId: 'wine-bottle-123',
  
  // Pre-populate cache for instant API responses
  cache: {
    collection,
    product,
    user: user ? {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      accountData: user.accountData,
    } : null,
  },
  
  onAuthLogin: async (token, user) => {
    smartlinks.setBearerToken(token);
  },
});

const src = await responder.attach(iframeElement);
iframeElement.src = src;
```

## Configuration Options

### IframeResponderOptions

```typescript
interface IframeResponderOptions {
  // Required
  collectionId: string;        // Collection context
  appId: string;                // App to load (e.g., 'warranty-registration')
  
  // Optional Context
  productId?: string;           // Product context
  proofId?: string;             // Proof context
  isAdmin?: boolean;            // Admin mode flag
  
  // URL Configuration
  version?: 'stable' | 'development'; // App version (default: 'stable')
  appUrl?: string;              // Override URL (for local dev)
  initialPath?: string;         // Initial hash path (e.g., '/settings')
  
  // Data
  cache?: CachedData;           // Pre-cached data
  
  // Callbacks
  onAuthLogin?: (token: string, user: any, accountData?: any) => Promise<void>;
  onAuthLogout?: () => Promise<void>;
  onRouteChange?: (path: string, state: Record<string, string>) => void;
  onResize?: (height: number) => void;
  onError?: (error: Error) => void;
  onReady?: () => void;
}
```

## Advanced Examples

### Deep Linking / Route Synchronization

Keep the parent URL in sync with iframe navigation:

```typescript
const responder = new smartlinks.IframeResponder({
  collectionId: 'acme-wines',
  appId: 'warranty',
  initialPath: '/products/wine-123',
  
  onRouteChange: (path, state) => {
    // Update parent URL with iframe route
    const url = new URL(window.location.href);
    url.searchParams.set('app-path', path);
    Object.entries(state).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.pushState({}, '', url);
  },
});
```

### Local Development Override

```typescript
const responder = new smartlinks.IframeResponder({
  collectionId: 'acme-wines',
  appId: 'warranty',
  
  // Override URL for local development
  appUrl: 'http://localhost:5173',
  version: 'development',
});
```

### Admin Mode with Role Detection

```typescript
const user = await smartlinks.auth.getAccountInfo();
const collection = await smartlinks.collection.get('acme-wines');

const isAdmin = smartlinks.isAdminFromRoles(user, collection);

const responder = new smartlinks.IframeResponder({
  collectionId: 'acme-wines',
  appId: 'warranty',
  isAdmin, // Pass admin status to iframe
  cache: { collection, user },
});
```

### Responsive Height Management

```typescript
const responder = new smartlinks.IframeResponder({
  collectionId: 'acme-wines',
  appId: 'warranty',
  
  onResize: (height) => {
    // Smooth height transitions
    iframe.style.transition = 'height 0.3s ease';
    iframe.style.height = `${height}px`;
    
    // Or calculate viewport-based height
    const maxHeight = window.innerHeight - 100;
    iframe.style.height = `${Math.min(height, maxHeight)}px`;
  },
});
```

## Helper Functions

### buildIframeSrc()

Manually construct an iframe src URL without using the full responder:

```typescript
const src = smartlinks.buildIframeSrc({
  appUrl: 'https://warranty.lovable.app',
  collectionId: 'acme-wines',
  appId: 'warranty',
  productId: 'wine-123',
  isAdmin: false,
  dark: true,
  theme: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
  },
  initialPath: '/register',
});

iframe.src = src;
```

### isAdminFromRoles()

Check if a user has admin access:

```typescript
const user = await smartlinks.auth.getAccountInfo();
const collection = await smartlinks.collection.get('acme-wines');

const isAdmin = smartlinks.isAdminFromRoles(user, collection);
// or with proof
const isAdminOfProof = smartlinks.isAdminFromRoles(user, collection, proof);
```

## Cache Utilities

The `cache` module provides TTL-based caching:

```typescript
import * as smartlinks from '@proveanything/smartlinks';

// Cache with 5-minute TTL
const apps = await smartlinks.cache.getOrFetch(
  'apps:acme-wines',
  () => smartlinks.collection.getApps('acme-wines'),
  { ttl: 5 * 60 * 1000, storage: 'session' }
);

// Invalidate cache
smartlinks.cache.invalidate('apps:acme-wines');

// Clear all cache
smartlinks.cache.clear();
```

### Cache Storage Options

- `memory` - In-memory only (default, cleared on page reload)
- `session` - sessionStorage (persists across page reloads in same tab)
- `local` - localStorage (persists across browser sessions)

## Backend API Requirement

The SDK uses the existing `getAppsConfig()` endpoint:

```
GET /public/collection/:collectionId/apps-config

Response:
{
  "apps": [
    {
      "id": "warranty-registration",
      "srcAppId": "warranty-v2",
      "name": "Warranty Registration",
      "publicIframeUrl": "https://warranty.lovable.app",
      "active": true,
      "category": "Commerce",
      "usage": {
        "collection": true,
        "product": true,
        "proof": false,
        "widget": false
      }
    }
  ]
}
```

Each app must have a `publicIframeUrl` configured for the IframeResponder to work.

## Complete Integration Example

```typescript
import * as smartlinks from '@proveanything/smartlinks';

// Initialize SDK
smartlinks.initializeApi({
  baseURL: 'https://api.smartlinks.io',
  apiKey: 'your-api-key',
});

class AppManager {
  private responder: smartlinks.IframeResponder | null = null;
  
  async loadApp(containerId: string) {
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    document.getElementById(containerId)?.appendChild(iframe);
    
    // Fetch context data
    const collection = await smartlinks.collection.get('acme-wines');
    const product = await smartlinks.product.get('wine-123');
    
    // Determine admin status
    try {
      const user = await smartlinks.auth.getAccountInfo();
      const isAdmin = smartlinks.isAdminFromRoles(user, collection);
      
      // Create responder
      this.responder = new smartlinks.IframeResponder({
        collectionId: 'acme-wines',
        appId: 'warranty',
        productId: 'wine-123',
        isAdmin,
        cache: { collection, product, user },
        
        onAuthLogin: async (token, user) => {
          smartlinks.setBearerToken(token);
          this.responder?.updateCache({ user });
        },
        
        onAuthLogout: async () => {
          smartlinks.setBearerToken('');
          this.responder?.updateCache({ user: null });
        },
        
        onRouteChange: (path, state) => {
          console.log('Route changed:', path, state);
        },
        
        onResize: (height) => {
          iframe.style.height = `${height}px`;
        },
        
        onError: (error) => {
          console.error('Iframe error:', error);
        },
      });
      
      // Attach and load
      const src = await this.responder.attach(iframe);
      iframe.src = src;
      
    } catch (err) {
      console.error('Failed to load app:', err);
    }
  }
  
  destroy() {
    this.responder?.destroy();
    this.responder = null;
  }
}

// Usage
const manager = new AppManager();
await manager.loadApp('app-container');

// Cleanup on unmount
// manager.destroy();
```

## Message Protocol

The responder handles these message types from the iframe:

### Route Changes
```typescript
{
  type: 'smartlinks-route-change',
  path: '/products/wine-123',
  context: { collectionId: 'acme-wines', appId: 'warranty' },
  state: { tab: 'details' }
}
```

### Resize Events
```typescript
{
  _smartlinksIframeMessage: true,
  type: 'smartlinks:resize',
  payload: { height: 800 }
}
```

### Authentication
```typescript
{
  _smartlinksIframeMessage: true,
  type: 'smartlinks:authkit:login',
  payload: { token: '...', user: {...}, messageId: 'abc123' }
}
```

### API Proxy
```typescript
{
  _smartlinksProxyRequest: true,
  id: 'req-123',
  method: 'GET',
  path: 'public/product/wine-123',
  headers: { 'Authorization': 'Bearer ...' }
}
```

## TypeScript Support

All types are exported for full TypeScript support:

```typescript
import type {
  IframeResponderOptions,
  CachedData,
  CollectionApp,
  RouteChangeMessage,
  SmartlinksIframeMessage,
} from '@proveanything/smartlinks';
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Requires `postMessage`, `MessageEvent`, `ResizeObserver` APIs
- Falls back gracefully in Node.js environments (no-ops for browser-only features)

## Best Practices

1. **Pre-cache data** when possible to eliminate loading delays
2. **Handle onError** to catch and log communication issues
3. **Clean up** responder with `destroy()` when unmounting
4. **Use version control** to test against development versions
5. **Validate tokens** server-side for security
6. **Set height dynamically** based on content using `onResize`
7. **Sync routes** with parent navigation for better UX

## Troubleshooting

### App not loading
- Verify the appId exists in collection apps configuration
- Check browser console for errors
- Ensure backend API endpoint is available

### Authentication not syncing
- Implement `onAuthLogin` callback
- Verify token is being set with `setBearerToken()`
- Check that auth messages are being received

### Height not updating
- Implement `onResize` callback
- Ensure iframe has CSS styling for height changes
- Check that iframe is sending resize messages

### Cache not working
- Verify cache storage option is supported (sessionStorage/localStorage)
- Check browser storage isn't disabled
- Clear cache and retry with `smartlinks.cache.clear()`
