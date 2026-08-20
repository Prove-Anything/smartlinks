# Assets

Reference for asset types, endpoints, and public (token-based) uploads.

---

## Asset object

```typescript
interface Asset {
  // Identity
  id:           string            // Postgres UUID — stable permanent identifier
  collectionId: string            // owning collection
  site:         string            // alias for collectionId (compat)
  productId:    string | null     // set when scoped to a product
  proofId:      string | null     // set when scoped to a proof (ledger entry)
  appId:        string | null     // app that owns this asset, e.g. 'homepage'

  // File
  url:          string            // CDN URL of the original file
  thumbnail:    string | null     // CDN URL of WebP thumbnail (max 512px longest edge, no crop)
                                  // Always .webp — null until thumbnail generation has run
  name:         string            // original filename
  cleanName:    string | null     // filename without extension
  assetType:    'Image' | 'Video' | 'Audio' | 'Document'
  fileType:     string | null     // file extension, e.g. 'jpg'
  type:         string | null     // alias for fileType (compat)
  mimeType:     string | null     // e.g. 'image/jpeg'
  contentType:  string | null     // alias for mimeType (compat)
  size:         number | null     // bytes
  width:        number | null     // pixels (images only)
  height:       number | null     // pixels (images only)
  hash:         string | null     // SHA-256 of file content

  // Organisation
  labels:       string[]          // arbitrary string labels for filtering
  metadata:     Record<string, any>
  versions:     AssetVersion[]    // previous file versions (populated by replace)

  // Upload provenance
  uploadedBy:        string | null  // Firebase UID of admin uploader
  uploaderContactId: string | null  // contact ID for public/token uploads
  uploadTokenId:     string | null  // upload token used (public uploads)
  uploaderIp:        string | null

  // Lifecycle
  status:    'active' | 'pending_review' | 'deleted'
  createdAt: string   // ISO 8601
  updatedAt: string
  deletedAt: string | null
}

interface AssetVersion {
  url:        string
  mimeType:   string | null
  fileType:   string | null
  size:       number | null
  hash:       string | null
  thumbnail:  string | null
  replacedAt: string
  replacedBy: string | null
}
```

### Thumbnail spec

- Format: WebP, quality 82
- Max 512px on the longest edge — never upscales
- Fit: `inside` (letterbox, no crop)
- SVGs are skipped — `thumbnail` stays null
- URL always ends in `_thumb.webp`

---

## AssetRef — slim embedded shape

When an asset is referenced inside a product or collection document (e.g. `heroImage`), only three fields are stored to keep documents lean:

```typescript
interface AssetRef {
  id:        string        // Postgres UUID — use to fetch the full Asset if needed
  url:       string        // CDN URL of the original file
  thumbnail: string | null // WebP thumbnail URL, or null if not yet generated
}
```

Render the thumbnail wherever a compact preview is needed; fall back to `url` if null:

```typescript
function getHeroImageUrl(product: Product): string | null {
  const ref = product.heroImage
  if (!ref) return null
  return ref.thumbnail ?? ref.url
}
```

---

## Admin endpoints

All admin endpoints require authentication. Base path: `/api/admin/collection/:collectionId`

### List assets

```
GET /asset
```

| Parameter   | Type   | Description |
|-------------|--------|-------------|
| `productId` | string | Filter to a specific product |
| `proofId`   | string | Filter to a specific proof |
| `appId`     | string | Filter by owning app |
| `assetType` | string | `Image`, `Video`, `Audio`, `Document` |
| `labels`    | string | Comma-separated label filter (any match) |
| `sort`      | string | `createdAt` (default), `name`, `size`, `assetType` |
| `order`     | string | `desc` (default), `asc` |
| `limit`     | number | Max results (default 50, max 200) |
| `offset`    | number | Pagination offset |

**Response:**

```typescript
{ data: Asset[], total: number, limit: number, offset: number }
```

**SDK:**

```typescript
const { data, total } = await Api.asset.listAdmin({
  collectionId: 'my-collection',
  assetType: 'Image',
  labels: 'hero,banner',
  limit: 20,
})
```

---

### Get asset

```
GET /asset/:assetId
```

Returns `Asset` or `404`.

**SDK:** `Api.asset.getAdmin(collectionId, assetId)`

---

### Upload asset

```
POST /asset
```

Use the existing `Api.asset.upload()` method (file) or `Api.asset.uploadFromUrl()` (URL import).

---

### Update asset metadata

```
PUT /asset/:assetId
```

Updates metadata only. Use `/replace` to swap the file.

```typescript
await Api.asset.updateAdmin({
  collectionId: 'my-collection',
  assetId: 'abc123',
  name: 'New display name',
  labels: ['hero', 'featured'],
  metadata: { altText: 'A product photo' },
})
```

---

### Replace file

```
POST /asset/:assetId/replace
```

Replaces the file; the previous URL is snapshotted into `versions[]`.

```typescript
await Api.asset.replaceFile({
  collectionId: 'my-collection',
  assetId: 'abc123',
  file: newFile,
  onProgress: (pct) => console.log(pct),
})
```

---

### Delete asset (soft)

```
DELETE /asset/:assetId?graceDays=30
```

Sets `deletedAt` and schedules CDN purge after `graceDays` (default 30). Recoverable until purge.

```typescript
await Api.asset.deleteAdmin({ collectionId: 'my-collection', assetId: 'abc123', graceDays: 7 })
```

---

### Restore asset

```
POST /asset/:assetId/restore
```

Clears `deletedAt`. Asset becomes active again.

```typescript
await Api.asset.restoreAdmin('my-collection', 'abc123')
```

---

### Bulk delete

```
POST /asset/bulk-delete
```

```typescript
await Api.asset.bulkDelete({
  collectionId: 'my-collection',
  assetIds: ['abc123', 'def456'],
  graceDays: 14,
})
// Returns { deleted: 2 }
```

---

## Resumable uploads (large files, e.g. video)

`asset.upload()` is a single request — if the connection drops, the whole file
restarts. For large files on flaky connections (e.g. phone video), use a
**resumable** upload: the file is chunked directly to storage and can be paused,
resumed, and — crucially — **continued after a page reload or app restart**.

```typescript
import { asset } from '@proveanything/smartlinks'

// 1. Open a resumable upload.
const handle = await asset.createResumableUpload({
  file,                                   // a File (input[type=file] / drag-drop)
  scope: { type: 'proof', collectionId, productId, proofId },
  appId: 'photo-memory',
  // token: uploadToken,                  // for public/token uploads (see below)
})

// 2. Persist handle.id so the upload survives a reload.
localStorage.setItem('pendingUpload', handle.id)

// 3. Upload. Resumes automatically from the offset storage already holds.
const uploaded = await handle.start({
  onProgress: (pct) => setProgress(pct),  // 0–100
  signal: abortController.signal,         // optional: cancel a stalled upload
})
localStorage.removeItem('pendingUpload')
```

### Pause / resume, and resume after a reload

```typescript
handle.pause()                            // stop after the current chunk
await handle.resume({ onProgress })       // continue

// After a reload / app kill — rehydrate from the persisted id and the same file:
const saved = localStorage.getItem('pendingUpload')
if (saved) {
  const handle = await asset.resumeUpload(saved, file)
  await handle.start({ onProgress })      // continues, does not restart
}
```

### API

```typescript
namespace asset {
  createResumableUpload(options: CreateResumableUploadOptions): Promise<ResumableUploadHandle>
  resumeUpload(handleId: string, file: File): Promise<ResumableUploadHandle>
}

interface CreateResumableUploadOptions {
  file: File
  scope: { type: 'collection'; collectionId: string }
       | { type: 'product'; collectionId: string; productId: string }
       | { type: 'proof'; collectionId: string; productId: string; proofId: string }
  name?: string
  metadata?: Record<string, any>
  appId?: string
  admin?: boolean          // admin route (default is the public route)
  token?: string           // upload token for public/unauthenticated uploads
}

interface ResumableUploadHandle {
  readonly id: string      // durable, persistable — pass to resumeUpload() after a reload
  readonly size: number    // total bytes
  start(opts?: { onProgress?: (pct: number) => void; signal?: AbortSignal }): Promise<Asset>
  pause(): void
  resume(opts?: { onProgress?: (pct: number) => void; signal?: AbortSignal }): Promise<Asset>
}
```

**Notes**

- `handle.id` is an opaque string that carries everything needed to resume — persist it as-is.
- On completion, `start()`/`resume()` resolves to the finalized `Asset` record.
- `pause()` causes the in-flight `start()`/`resume()` promise to reject with an `UploadPausedError`; call `resume()` to continue.
- `asset.upload()` also now accepts an `AbortSignal` (`upload({ ..., signal })`) for cancelling a stalled single-shot upload.

---

## Public (token-based) uploads

For anonymous or contact-initiated uploads from the portal — no admin auth required.

### 1. Request an upload token

```
POST /api/public/collection/:collectionId/asset/token
```

Policy source (important):

- Public upload policy is resolved from the collection-scoped app config at `sites/{collectionId}/apps/{appId}`.
- Global app config (`apps/{appId}`) is not used for this endpoint.
- SDKs/clients that provision app config should save `uploadPolicy` on the collection app document.

Expected app config shape:

```typescript
{
  uploadPolicy: {
    enabled: boolean
    requireLevel?: 'anonymous' | 'contact' | 'owner'
    allowedMimeTypes?: string[]
    maxFileSizeBytes?: number
    reviewRequired?: boolean
    tokenTtlSeconds?: number
    maxUsesPerToken?: number
  }
}
```

```typescript
const { tokenId, expiresAt, policy } = await Api.asset.requestUploadToken({
  collectionId: 'my-collection',
  appId: 'user-gallery',
  contactId: contact.id,   // required when policy requireLevel = 'contact'
})
```

The `policy` describes what the token allows:

```typescript
interface UploadTokenPolicy {
  requireLevel:     'anonymous' | 'contact' | 'owner'
  allowedMimeTypes: string[]
  maxFileSizeBytes: number
  reviewRequired:   boolean   // when true, asset is created as 'pending_review'
  productId:        string | null
  proofId:          string | null
}
```

Tokens are **single-use**, TTL 900 s.

### 2. Upload with token

```typescript
const asset = await Api.asset.publicUploadWithToken({
  collectionId: 'my-collection',
  tokenId,
  file: selectedFile,
  onProgress: (pct) => setProgress(pct),
})
```

Assets are created with `status: 'pending_review'` when `reviewRequired: true`. An admin must review and set `status` to `'active'` before the asset appears publicly.

---

## Writing image fields on products and collections

`heroImage`, `additionalImages` (products), `logoImage`, and `headerImage` (collections) all use the slim `AssetRef` shape when read.

When writing:

- **Pass the `AssetRef` back unchanged** to keep the current image (server detects the UUID and skips re-processing).
- **Pass a URL string or `{ url }`** to import a new file — the server fetches/registers it and returns the resulting `AssetRef`.

```typescript
// Keep existing image
await Api.products.update(collectionId, productId, {
  name: 'New name',
  heroImage: product.heroImage,  // AssetRef — not re-processed
})

// Import a new image
await Api.products.update(collectionId, productId, {
  heroImage: 'https://example.com/new-image.jpg',
})
```
