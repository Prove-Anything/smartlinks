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
  // logger: console,                                   // optional: verbose logging of requests/responses and proxy messages
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

### Assets

Upload, list, get, and remove assets within a scope (collection/product/proof).

#### Upload (new)

```ts
import { asset } from '@proveanything/smartlinks'

const uploaded = await asset.upload({
  file, // File from an <input type="file">
  scope: { type: 'proof', collectionId, productId, proofId },
  name: 'hero.png',
  metadata: { description: 'Uploaded via SDK' },
  onProgress: (p) => console.log(`Upload: ${p}%`),
  // appId: 'microapp-123' // optional
})
console.log('Uploaded asset:', uploaded)
```

Deprecated upload helper (wraps to the new `upload` internally):

```ts
// @deprecated Use asset.upload(options)
const legacy = await asset.uploadAsset(collectionId, productId, proofId, file)
```

#### List

```ts
// Collection assets, first 20 images
const list1 = await asset.list({
  scope: { type: 'collection', collectionId },
  mimeTypePrefix: 'image/',
  limit: 20,
})

// Product assets, filter by appId
const list2 = await asset.list({
  scope: { type: 'product', collectionId, productId },
  appId: 'microapp-123',
})
```

#### Get (scoped)

```ts
const a = await asset.get({
  assetId,
  scope: { type: 'proof', collectionId, productId, proofId },
})
```

#### Remove (scoped, admin)

```ts
await asset.remove({
  assetId,
  scope: { type: 'product', collectionId, productId },
})
```

#### Asset response example

```json
{
  "name": "Screenshot 2025-09-15 at 15.21.14",
  "assetType": "Image",
  "type": "png",
  "collectionId": "ChaseAtlantic",
  "url": "https://cdn.smartlinks.app/sites%2FChaseAtlantic%2Fimages%2F2025%2F9%2FScreenshot%202025-09-15%20at%2015%2C21%2C14-1757946214537.png",
  "createdAt": "2005-10-10T23:15:03",
  "hash": "fb98140a6b41ee69b824f29cc8b6795444246f871e4ab2379528b34a4d16284e",
  "thumbnails": {
    "x100": "https://cdn.smartlinks.app/..._100x100.png",
    "x200": "https://cdn.smartlinks.app/..._200x200.png",
    "x512": "https://cdn.smartlinks.app/..._512x512.png"
  },
  "id": "7k1cGErrlmQ94J8yDlVj",
  "site": "ChaseAtlantic",
  "cleanName": "Screenshot 2025-09-15 at 15.21"
}
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

### Analytics (Actions & Broadcasts)

Track user actions and broadcast deliveries per collection. These endpoints live under admin and require valid auth (API key or bearer token).

```ts
import { actions, broadcasts } from '@proveanything/smartlinks'

// List action events for a user
const actionEvents = await actions.byUser('collectionId', {
  userId: 'user_123',
  from: '2025-01-01T00:00:00Z',
  to: '2025-12-31T23:59:59Z',
  limit: 100,
})

// Outcome counts, optionally deduping latest per actor
const counts = await actions.countsByOutcome('collectionId', {
  actionId: 'click',
  dedupeLatest: true,
  idField: 'userId',
})

// Append a single action event
await actions.append('collectionId', {
  userId: 'user_123',
  actionId: 'click',
  outcome: 'success',
})

// Broadcast recipients and filters
const recipients = await broadcasts.recipientIds('collectionId', {
  broadcastId: 'br_456',
  idField: 'contactId',
})

// Append broadcast recipients in bulk (preferred shape)
await broadcasts.appendBulk('collectionId', {
  params: { broadcastId: 'br_456', channel: 'email' },
  ids: ['contact_1','contact_2'],
  idField: 'contactId',
})
```

### Broadcast sending and previews

```ts
import { broadcasts } from '@proveanything/smartlinks'

// Preview a broadcast (HTML)
const preview = await broadcasts.preview('collectionId', 'broadcastId', {
  contactId: 'contact_123',
  props: { firstName: 'Sam' },
})

// Send a test email
await broadcasts.sendTest('collectionId', 'broadcastId', {
  to: 'test@example.com',
  subject: 'Test subject',
  props: { foo: 'bar' },
})

// Enqueue broadcast sending (background)
await broadcasts.send('collectionId', 'broadcastId', {
  pageSize: 100,
  sharedContext: { campaign: 'summer' },
})

// Manual page send (for testing/UX)
const manual = await broadcasts.sendManual('collectionId', 'broadcastId', {
  limit: 50,
  dryRun: true,
})
```

### Async jobs

```ts
import { async as slAsync, jobs } from '@proveanything/smartlinks'

// Enqueue an async job
const queued = await slAsync.enqueueAsyncJob('collectionId', {
  task: 'email:daily-digest',
  payload: { segmentId: 'seg_1' },
  priority: 5,
  key: 'digest:seg_1',
})

// Check job status
const status = await slAsync.getAsyncJobStatus('collectionId', queued.id)

// List recent jobs
const recent = await jobs.listJobs('collectionId', { state: 'queued', limit: 20 })

// Get a single job
const job = await jobs.getJob('collectionId', queued.id)
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
  logger?: Function | { debug?: Function; info?: Function; warn?: Function; error?: Function; log?: Function } // optional verbose logging
})

// Auto-detection: If baseURL contains '.ngrok.io' or '.ngrok-free.dev' the header is added automatically
// unless you explicitly set ngrokSkipBrowserWarning: false.
// Auto iframe resize: When in an iframe, resize messages are sent by default unless iframeAutoResize: false.
// Verbose logging: Pass a logger (e.g. console) to log outbound requests/responses and proxy postMessages.
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
                 