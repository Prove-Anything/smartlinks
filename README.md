# @proveanything/smartlinks

Official JavaScript/TypeScript SDK for the Smartlinks API.

Build Smartlinks-powered apps in Node.js or the browser: list collections and products, authenticate users, manage assets and attestations, and call admin endpoints with a clean, typed API.

• TypeScript-first types and intellisense
• Works in Node.js and modern browsers
• Simple auth helpers (login, verify token, request admin/public JWTs)
• Rich resources: collections, products, proofs, assets, attestations, batches, variants, AI, and more
• Optional iframe proxy mode for embedded apps

For the full list of functions and types, see the API summary:
→ API Summary (API_SUMMARY.md)

## Install

```bash
npm install @proveanything/smartlinks
```

## Quick start

Initialize once at app startup with your API base URL. Trailing slashes are optional (normalized). In Node, you can also provide an API key for server-to-server calls. You can enable an ngrok header or supply custom headers.

```ts
import { initializeApi } from '@proveanything/smartlinks'

initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',            // or 'https://smartlinks.app/api/v1/'
  // apiKey: process.env.SMARTLINKS_API_KEY,            // Node/server only (optional)
  // ngrokSkipBrowserWarning: true,                    // adds 'ngrok-skip-browser-warning: true'
  // extraHeaders: { 'X-Debug': '1' }                  // merged into every request
})
```

List public collections and fetch products:

```ts
import { collection, product } from '@proveanything/smartlinks'

const collections = await collection.list(false) // public endpoint
const first = collections[0]
if (first) {
  const products = await product.list(first.id, false) // public endpoint
  console.log('First product:', products[0])
}
```

## Authentication

Use the built-in helpers to log in and verify tokens. After a successful login, the SDK stores the bearer token for subsequent calls.

```ts
import { initializeApi } from '@proveanything/smartlinks'
import { auth } from '@proveanything/smartlinks'

initializeApi({ baseURL: 'https://smartlinks.app/api/v1/' }) // trailing slash OK

// Email + password login (browser or Node)
const user = await auth.login('user@example.com', 'password')
console.log('Hello,', user.name)

// Verify an existing token (and set it if valid)
const verified = await auth.verifyToken(user.bearerToken)
console.log('Token valid?', verified.valid)

// Later, clear token
auth.logout()
```

Admin flows:

```ts
// Request an admin JWT for a collection (requires prior auth)
const jwt = await auth.requestAdminJWT('collectionId')

// Or request a public JWT authorized for a collection/product/proof
const publicJwt = await auth.requestPublicJWT('collectionId', 'productId', 'proofId')
```

## Common tasks

### Products

```ts
import { product } from '@proveanything/smartlinks'

// Public fetch
const item = await product.get('collectionId', 'productId', false)

// Admin create/update/delete (requires auth)
await product.create('collectionId', { name: 'New product' })
await product.update('collectionId', 'productId', { description: 'Updated' })
await product.remove('collectionId', 'productId')
```

### Assets (upload)

Browser-side upload to a proof with progress callback:

```ts
import { asset } from '@proveanything/smartlinks'

const result = await asset.uploadAsset(
  'collectionId',
  'productId',
  'proofId',
  file, // File from an <input type="file">
  { description: 'Uploaded via SDK' },
  (progress) => console.log(`Upload: ${progress}%`)
)
console.log('Uploaded asset:', result)
```

### AI helpers

```ts
import { ai } from '@proveanything/smartlinks'

const content = await ai.generateContent('collectionId', {
  contents: 'Write a friendly product blurb for our coffee beans.',
  responseMimeType: 'text/plain',
  provider: 'openai',
  model: 'gpt-4o'
})
console.log(content)
```

## Browser and React

The SDK works in modern browsers. Initialize once and call public endpoints without an API key; authenticate to access protected/admin endpoints.

```ts
import { initializeApi } from '@proveanything/smartlinks'
import { collection } from '@proveanything/smartlinks'

initializeApi({ baseURL: 'https://smartlinks.app/api/v1' })
const collections = await collection.list(false)
```

For a fuller UI example, see `examples/react-demo.tsx`.

## Iframe Integration

When embedding Smartlinks inside an iframe (set `proxyMode: true` in `initializeApi` if you need parent-proxy API calls), you can also send UI/control messages to the parent window. The SDK provides lightweight helpers in `iframe.ts`:

```ts
import { enableAutoIframeResize, disableAutoIframeResize, redirectParent, sendParentCustom, isIframe } from '@proveanything/smartlinks'

// Automatically push height changes to parent so it can resize the iframe.
enableAutoIframeResize({ intervalMs: 150 })

// Later disable if not needed:
disableAutoIframeResize()

// Redirect parent window to a URL (e.g. after login):
redirectParent('https://app.example.com/dashboard')

// Send any custom event + payload:
sendParentCustom('smartlinks:navigate', { url: '/profile' })

if (isIframe()) {
  console.log('Running inside an iframe')
}
```

Parent page can listen for these messages:

```ts
window.addEventListener('message', (e) => {
  const msg = e.data
  if (!msg || !msg._smartlinksIframeMessage) return
  switch (msg.type) {
    case 'smartlinks:resize':
      // adjust iframe height
      const iframeEl = document.getElementById('smartlinks-frame') as HTMLIFrameElement
      if (iframeEl) iframeEl.style.height = msg.payload.height + 'px'
      break
    case 'smartlinks:redirect':
      window.location.href = msg.payload.url
      break
    case 'smartlinks:navigate':
      // Custom example
      console.log('Navigate request:', msg.payload.url)
      break
  }
})
```

Notes:
- Auto-resize uses `ResizeObserver` when available, falling back to `MutationObserver` + polling.
- In non-browser or Node environments these helpers safely no-op.
- Use `sendParentCustom` for any domain-specific integration events.

## Configuration reference

```ts
initializeApi({
  baseURL: string, // with or without trailing slash
  apiKey?: string,      // Node/server only
  bearerToken?: string, // optional at init; set by auth.login/verifyToken
  proxyMode?: boolean   // set true if running inside an iframe and using parent proxy
  ngrokSkipBrowserWarning?: boolean // forces header 'ngrok-skip-browser-warning: true'
  extraHeaders?: Record<string,string> // custom headers merged in each request
  iframeAutoResize?: boolean // default true when embedded in an iframe
})

// Auto-detection: If baseURL contains '.ngrok.io' or '.ngrok-free.dev' the header is added automatically
// unless you explicitly set ngrokSkipBrowserWarning: false.
// Auto iframe resize: When in an iframe, resize messages are sent by default unless iframeAutoResize: false.
```

When embedding the SDK in an iframe with `proxyMode: true`, you can also use:

```ts
import { sendCustomProxyMessage } from '@proveanything/smartlinks'
const data = await sendCustomProxyMessage('my-action', { foo: 'bar' })

// Toggle ngrok header or update custom headers later:
import { setNgrokSkipBrowserWarning, setExtraHeaders } from '@proveanything/smartlinks'
setNgrokSkipBrowserWarning(true)
setExtraHeaders({ 'X-Debug': '1' })
```

## Full API surface

Explore every function, parameter, and type here:

- API Summary (API_SUMMARY.md)

## Requirements

- Node.js 16+ or modern browsers
- TypeScript 4.9+ (if using TS)

## License

MIT © Prove Anything
                 