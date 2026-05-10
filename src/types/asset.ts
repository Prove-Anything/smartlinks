/**
 * Slim reference to an asset embedded inside product and collection documents.
 * Use `asset.get()` with the `id` to retrieve the full `Asset` record.
 */
export interface AssetRef {
  /** Postgres UUID — use to fetch the full Asset */
  id: string
  /** CDN URL of the original file */
  url: string
  /** WebP thumbnail URL (max 512px longest edge), or null if not yet generated */
  thumbnail: string | null
}

/**
 * A previous file version recorded when `replace` is called on an asset.
 */
export interface AssetVersion {
  url: string
  mimeType: string | null
  fileType: string | null
  size: number | null
  hash: string | null
  thumbnail: string | null
  replacedAt: string
  replacedBy: string | null
}

/**
 * Full Asset object as returned by the platform.
 */
export interface Asset {
  // Identity
  /** Postgres UUID — stable permanent identifier */
  id: string
  /** Owning collection */
  collectionId: string
  /** Alias for collectionId (compat) */
  site: string
  /** Set when scoped to a product */
  productId: string | null
  /** Set when scoped to a proof (ledger entry) */
  proofId: string | null
  /** App that owns this asset, e.g. 'homepage' */
  appId: string | null

  // File
  /** CDN URL of the original file */
  url: string
  /**
   * CDN URL of the WebP thumbnail (max 512px longest edge, no crop).
   * Always .webp — null until thumbnail generation has run.
   */
  thumbnail: string | null
  /** Original filename */
  name: string
  /** Filename without extension */
  cleanName: string | null
  /** Broad asset classification */
  assetType: 'Image' | 'Video' | 'Audio' | 'Document'
  /** File extension, e.g. 'jpg' */
  fileType: string | null
  /** Alias for fileType (compat) */
  type: string | null
  /** MIME type, e.g. 'image/jpeg' */
  mimeType: string | null
  /** Alias for mimeType (compat) */
  contentType: string | null
  /** File size in bytes */
  size: number | null
  /** Width in pixels (images only) */
  width: number | null
  /** Height in pixels (images only) */
  height: number | null
  /** SHA-256 of file content */
  hash: string | null

  // Organisation
  /** Arbitrary string labels for filtering */
  labels: string[]
  metadata: Record<string, any>
  /** Previous file versions, populated by replace */
  versions: AssetVersion[]

  // Upload provenance
  /** Firebase UID of admin uploader */
  uploadedBy: string | null
  /** Contact ID for public/token uploads */
  uploaderContactId: string | null
  /** Upload token used for public uploads */
  uploadTokenId: string | null
  uploaderIp: string | null

  // Lifecycle
  status: 'active' | 'pending_review' | 'deleted'
  createdAt: string
  updatedAt: string
  deletedAt: string | null

  /**
   * @deprecated Use `thumbnail` instead. Legacy multi-size thumbnail map.
   */
  thumbnails?: {
    x100?: string
    x200?: string
    x512?: string
    [key: string]: string | undefined
  }
}

// Backwards compatibility alias
export type AssetResponse = Asset

// ---------------------------------------------------------------------------
// Admin upload / list / get / remove options (legacy scope-based interface)
// ---------------------------------------------------------------------------

export interface UploadAssetOptions {
  /** The file to upload (from input[type="file"] or drag-drop) */
  file: File
  
  /** Where to attach the asset */
  scope:
    | { type: 'collection'; collectionId: string }
    | { type: 'product'; collectionId: string; productId: string }
    | { type: 'proof'; collectionId: string; productId: string; proofId: string }
  
  /** Optional: Custom filename (defaults to file.name) */
  name?: string
  
  /** Optional: Custom metadata to store with the asset */
  metadata?: Record<string, any>
  
  /** Optional: Progress callback (0-100) */
  onProgress?: (percent: number) => void
  
  /** Optional: App ID for scoping to a specific microapp */
  appId?: string

  /** Optional: Upload via admin route instead of public */
  admin?: boolean
}

/**
 * Options for uploading an asset from a URL.
 * The server will fetch the file from the URL and store it in your CDN.
 */
export interface UploadFromUrlOptions {
  /** The URL of the file to fetch and upload */
  url: string
  
  /** Where to attach the asset */
  scope:
    | { type: 'collection'; collectionId: string }
    | { type: 'product'; collectionId: string; productId: string }
    | { type: 'proof'; collectionId: string; productId: string; proofId: string }
  
  /** Optional: Storage folder ('images', 'videos', 'documents') */
  folder?: 'images' | 'videos' | 'documents'
  
  /** Optional: Custom metadata to store with the asset */
  metadata?: Record<string, any>
  
  /** Optional: App ID for scoping to a specific microapp */
  appId?: string
  
  /** Optional: Upload via admin route instead of public */
  admin?: boolean
}

export interface ListAssetsOptions {
  scope:
    | { type: 'collection'; collectionId: string }
    | { type: 'product'; collectionId: string; productId: string }
    | { type: 'proof'; collectionId: string; productId: string; proofId: string }
  
  /** Filter by app ID */
  appId?: string
  
  /** Filter by MIME type prefix (e.g., 'image/', 'video/') */
  mimeTypePrefix?: string
  
  /** Pagination */
  limit?: number
  offset?: number
}

export interface GetAssetOptions {
  assetId: string
  scope:
    | { type: 'collection'; collectionId: string }
    | { type: 'product'; collectionId: string; productId: string }
    | { type: 'proof'; collectionId: string; productId: string; proofId: string }
}

export interface RemoveAssetOptions {
  assetId: string
  scope:
    | { type: 'collection'; collectionId: string }
    | { type: 'product'; collectionId: string; productId: string }
    | { type: 'proof'; collectionId: string; productId: string; proofId: string }
}

// ---------------------------------------------------------------------------
// Admin asset management — flat collection-scoped options
// ---------------------------------------------------------------------------

export interface AdminListAssetsOptions {
  collectionId: string
  productId?: string
  proofId?: string
  appId?: string
  assetType?: 'Image' | 'Video' | 'Audio' | 'Document'
  /** Comma-separated label filter (any match) */
  labels?: string
  sort?: 'createdAt' | 'name' | 'size' | 'assetType'
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface AdminListAssetsResponse {
  data: Asset[]
  total: number
  limit: number
  offset: number
}

export interface UpdateAssetOptions {
  collectionId: string
  assetId: string
  name?: string
  appId?: string
  labels?: string[]
  metadata?: Record<string, any>
  /** Manually override the thumbnail URL */
  thumbnail?: string
}

export interface ReplaceAssetFileOptions {
  collectionId: string
  assetId: string
  file: File
  onProgress?: (percent: number) => void
}

export interface DeleteAssetOptions {
  collectionId: string
  assetId: string
  /** Days before the file is purged from CDN (default 30) */
  graceDays?: number
}

export interface BulkDeleteAssetsOptions {
  collectionId: string
  assetIds: string[]
  graceDays?: number
}

// ---------------------------------------------------------------------------
// Public (token-based) uploads
// ---------------------------------------------------------------------------

/**
 * Collection-scoped app config policy used by `requestUploadToken`.
 *
 * Important: this policy is read from `sites/{collectionId}/apps/{appId}`
 * (collection app config), not from global `apps/{appId}` config.
 */
export interface UploadPolicyConfig {
  enabled: boolean
  requireLevel?: 'anonymous' | 'contact' | 'owner'
  allowedMimeTypes?: string[]
  maxFileSizeBytes?: number
  reviewRequired?: boolean
  tokenTtlSeconds?: number
  maxUsesPerToken?: number
}

export interface RequestUploadTokenOptions {
  collectionId: string
  /**
   * App ID whose collection-scoped config provides `uploadPolicy`.
   * Resolved from `sites/{collectionId}/apps/{appId}`.
   */
  appId: string
  /** Required when the app policy requireLevel is 'contact' */
  contactId?: string
  productId?: string
  proofId?: string
}

export interface UploadTokenPolicy {
  requireLevel: 'anonymous' | 'contact' | 'owner'
  allowedMimeTypes: string[]
  maxFileSizeBytes: number
  /** When true, asset is created with status 'pending_review' */
  reviewRequired: boolean
  productId: string | null
  proofId: string | null
}

export interface UploadTokenResponse {
  /** Pass as the X-Upload-Token header when uploading */
  tokenId: string
  expiresAt: string
  policy: UploadTokenPolicy
}

export interface PublicTokenUploadOptions {
  collectionId: string
  /** Token ID returned by requestUploadToken */
  tokenId: string
  file: File
  name?: string
  metadata?: Record<string, any>
  onProgress?: (percent: number) => void
}
