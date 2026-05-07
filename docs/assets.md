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
GET /assets
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
GET /assets/:assetId
```

Returns `Asset` or `404`.

**SDK:** `Api.asset.getAdmin(collectionId, assetId)`

---

### Upload asset

```
POST /assets
```

Use the existing `Api.asset.upload()` method (file) or `Api.asset.uploadFromUrl()` (URL import).

---

### Update asset metadata

```
PUT /assets/:assetId
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
POST /assets/:assetId/replace
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
DELETE /assets/:assetId?graceDays=30
```

Sets `deletedAt` and schedules CDN purge after `graceDays` (default 30). Recoverable until purge.

```typescript
await Api.asset.deleteAdmin({ collectionId: 'my-collection', assetId: 'abc123', graceDays: 7 })
```

---

### Restore asset

```
POST /assets/:assetId/restore
```

Clears `deletedAt`. Asset becomes active again.

```typescript
await Api.asset.restoreAdmin('my-collection', 'abc123')
```

---

### Bulk delete

```
POST /assets/bulk-delete
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

## Public (token-based) uploads

For anonymous or contact-initiated uploads from the portal — no admin auth required.

### 1. Request an upload token

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
