/**
 * Response from any asset upload or retrieval operation
 */
/**
 * Represents an Asset object.
 *
 * Example server response shape:
 * @example
 * {
 *   "name": "Screenshot 2025-09-15 at 15.21.14",
 *   "assetType": "Image",
 *   "type": "png",
 *   "collectionId": "myCollection",
 *   "url": "https://cdn.smartlinks.app/s25-09-15%20at14537.png",
 *   "createdAt": "2005-10-10T23:15:03",
 *   "hash": "fb98140a6b41ee69b824f29cc8b6795444246f871e4ab2379528b34a4d16284e",
 *   "thumbnails": {
 *     "x100": "https://cdn.smartlinks.app/sit2F..._100x100.png",
 *     "x200": "https://cdn.smartlinks.app/sit2F..._200x200.png",
 *     "x512": "https://cdn.smartlinks.app/sit2F..._512x512.png"
 *   },
 *   "id": "7k1cGErrlmQ94J8yDlVj",
 *   "site": "ChaseAtlantic",
 *   "cleanName": "Screenshot 2025-09-15 at 15.21"
 * }
 */
export interface Asset {
    /** Unique identifier for the asset */
    id: string;
    /** The public URL to access the asset */
    url: string;
    /** Original filename */
    name: string;
    /** MIME type (e.g., 'image/jpeg', 'video/mp4') */
    mimeType?: string;
    /** File size in bytes */
    size?: number;
    /** When the asset was uploaded */
    createdAt?: string;
    /** Any custom metadata attached during upload */
    metadata?: Record<string, any>;
    /** Optional: broader classification like 'Image' or 'Video' */
    assetType?: string;
    /** Optional: file extension/type shorthand (e.g., 'png') */
    type?: string;
    /** Optional: owning collection identifier */
    collectionId?: string;
    /** Optional: content hash */
    hash?: string;
    /** Optional: CDN thumbnail URLs */
    thumbnails?: {
        x100?: string;
        x200?: string;
        x512?: string;
        [key: string]: string | undefined;
    };
    /** Optional: site identifier alias */
    site?: string;
    /** Optional: prettified name */
    cleanName?: string;
}
export type AssetResponse = Asset;
export interface UploadAssetOptions {
    /** The file to upload (from input[type="file"] or drag-drop) */
    file: File;
    /** Where to attach the asset */
    scope: {
        type: 'collection';
        collectionId: string;
    } | {
        type: 'product';
        collectionId: string;
        productId: string;
    } | {
        type: 'proof';
        collectionId: string;
        productId: string;
        proofId: string;
    };
    /** Optional: Custom filename (defaults to file.name) */
    name?: string;
    /** Optional: Custom metadata to store with the asset */
    metadata?: Record<string, any>;
    /** Optional: Progress callback (0-100) */
    onProgress?: (percent: number) => void;
    /** Optional: App ID for scoping to a specific microapp */
    appId?: string;
}
export interface ListAssetsOptions {
    scope: {
        type: 'collection';
        collectionId: string;
    } | {
        type: 'product';
        collectionId: string;
        productId: string;
    } | {
        type: 'proof';
        collectionId: string;
        productId: string;
        proofId: string;
    };
    /** Filter by app ID */
    appId?: string;
    /** Filter by MIME type prefix (e.g., 'image/', 'video/') */
    mimeTypePrefix?: string;
    /** Pagination */
    limit?: number;
    offset?: number;
}
export interface GetAssetOptions {
    assetId: string;
    scope: {
        type: 'collection';
        collectionId: string;
    } | {
        type: 'product';
        collectionId: string;
        productId: string;
    } | {
        type: 'proof';
        collectionId: string;
        productId: string;
        proofId: string;
    };
}
export interface RemoveAssetOptions {
    assetId: string;
    scope: {
        type: 'collection';
        collectionId: string;
    } | {
        type: 'product';
        collectionId: string;
        productId: string;
    } | {
        type: 'proof';
        collectionId: string;
        productId: string;
        proofId: string;
    };
}
