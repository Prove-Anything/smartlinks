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

Initialize once at app startup with your API base URL. In Node, you can also provide an API key for server-to-server calls.

```ts
import { initializeApi } from '@proveanything/smartlinks'

initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  // apiKey: process.env.SMARTLINKS_API_KEY, // Node/server only (optional)
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

initializeApi({ baseURL: 'https://smartlinks.app/api/v1' })

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

## Configuration reference

```ts
initializeApi({
  baseURL: string,
  apiKey?: string,      // Node/server only
  bearerToken?: string, // optional at init; set by auth.login/verifyToken
  proxyMode?: boolean   // set true if running inside an iframe and using parent proxy
})
```

When embedding the SDK in an iframe with `proxyMode: true`, you can also use:

```ts
import { sendCustomProxyMessage } from '@proveanything/smartlinks'
const data = await sendCustomProxyMessage('my-action', { foo: 'bar' })
```

## Full API surface

Explore every function, parameter, and type here:

- API Summary (API_SUMMARY.md)

## Requirements

- Node.js 16+ or modern browsers
- TypeScript 4.9+ (if using TS)

## License

MIT © Prove Anything
                 