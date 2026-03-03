/**
 * Container Tracking Types
 *
 * Physical or logical grouping entities (pallets, casks, fridges, shipping
 * containers, warehouses, etc.) with support for hierarchical nesting and
 * item membership tracking.
 *
 * @see docs/container-tracking.md
 */
/** Lifecycle status of a container. Custom strings are permitted. */
export type ContainerStatus = 'active' | 'archived' | string;
/**
 * Types of items that can be placed inside a container.
 * A `container` item type allows containers to nest inside other containers.
 */
export type ContainerItemType = 'tag' | 'proof' | 'serial' | 'order_item' | 'container';
/**
 * A physical or logical container entity.
 *
 * Containers can nest arbitrarily via `parentContainerId`.  The `children`
 * field is only populated when `?tree=true` is included in the request.
 * The `items` field is only populated when `?includeContents=true` is set.
 */
export interface Container {
    /** UUID primary key */
    id: string;
    orgId: string;
    collectionId: string;
    /**
     * Domain label describing what kind of container this is.
     * Examples: `'pallet'`, `'fridge'`, `'cask'`, `'warehouse'`, `'shipping_container'`
     */
    containerType: string;
    /** Human-readable identifier, e.g. a barcode, reference number, or QR code value */
    ref?: string;
    name?: string;
    description?: string;
    /** Default `'active'` */
    status: ContainerStatus;
    /** Arbitrary key/value store for application-specific data */
    metadata?: Record<string, any>;
    /** UUID of the parent container; `undefined` / `null` for top-level containers */
    parentContainerId?: string;
    /** Recursively nested children — populated only when `?tree=true` */
    children?: Container[];
    /** Current (or historical) items — populated only when `?includeContents=true` */
    items?: ContainerItem[];
    /** ISO 8601 */
    createdAt: string;
    /** ISO 8601 */
    updatedAt: string;
    /** ISO 8601 soft-delete timestamp; present only for deleted containers */
    deletedAt?: string;
}
/**
 * A membership record linking a single item to a container.
 *
 * `removedAt` being `null` / `undefined` means the item is currently inside
 * the container.  When non-null the item has been removed; the record is
 * preserved in the history log.
 */
export interface ContainerItem {
    id: string;
    orgId: string;
    containerId: string;
    collectionId?: string;
    itemType: ContainerItemType;
    /** UUID or physical identifier of the item (tag ID, proof ID, serial, etc.) */
    itemId: string;
    /** Convenience denormalisation — product UUID if applicable */
    productId?: string;
    /** Convenience denormalisation — proof / serial UUID if applicable */
    proofId?: string;
    /** ISO 8601 — when the item was placed into the container */
    addedAt: string;
    /** ISO 8601 — when the item was removed; `null` / `undefined` = still inside */
    removedAt?: string;
    /** Arbitrary extra metadata */
    metadata?: Record<string, any>;
}
/** Request body for `POST /containers` — creates a new container. */
export interface CreateContainerInput {
    /** Required — domain label for this container */
    containerType: string;
    /** Human-readable reference / barcode */
    ref?: string;
    name?: string;
    description?: string;
    /** Default `'active'` */
    status?: ContainerStatus;
    metadata?: Record<string, any>;
    /** UUID of the parent container; omit to create a top-level container */
    parentContainerId?: string;
}
/**
 * Request body for `PATCH /containers/:id`.
 * Only provided fields are updated; all are optional.
 */
export interface UpdateContainerInput {
    containerType?: string;
    ref?: string;
    name?: string;
    description?: string;
    status?: ContainerStatus;
    metadata?: Record<string, any>;
    /** Pass `null` to promote the container to top-level. */
    parentContainerId?: string | null;
}
/** Request body for `POST /containers/:id/items` — adds items to a container. */
export interface AddContainerItemsInput {
    items: Array<{
        /** Required */
        itemType: ContainerItemType;
        /** Required — UUID or physical identifier of the item */
        itemId: string;
        productId?: string;
        proofId?: string;
        metadata?: Record<string, any>;
    }>;
}
/** Request body for `DELETE /containers/:id/items` — soft-removes items. */
export interface RemoveContainerItemsInput {
    /** `ContainerItem` UUIDs to mark as removed */
    ids: string[];
}
export interface ListContainersResponse {
    containers: Container[];
    limit: number;
    offset: number;
}
export interface PublicListContainersResponse {
    containers: Container[];
}
export interface FindContainersForItemResponse {
    containers: Container[];
}
export interface ContainerItemsResponse {
    items: ContainerItem[];
    limit: number;
    offset: number;
}
export interface AddContainerItemsResponse {
    items: ContainerItem[];
}
export interface RemoveContainerItemsResponse {
    success: true;
    removedCount: number;
}
export interface ListContainersParams {
    /** Filter by container type label */
    containerType?: string;
    /** Filter by status */
    status?: ContainerStatus;
    /** Filter by human-readable reference */
    ref?: string;
    /** Filter by parent container UUID */
    parentContainerId?: string;
    /** When `true`, return only top-level containers (no `parentContainerId`) */
    topLevel?: boolean;
    /** Default 100 */
    limit?: number;
    /** Default 0 */
    offset?: number;
}
export interface GetContainerParams {
    /** When `true`, recursively embed child containers up to `treeDepth` levels */
    tree?: boolean;
    /** Max nesting depth for the tree; default unlimited */
    treeDepth?: number;
    /** When `true`, embed the current `items` array */
    includeContents?: boolean;
}
export interface ListContainerItemsParams {
    /** When `true`, include removed items (full membership log); default `false` */
    history?: boolean;
    /** Default 100 */
    limit?: number;
    /** Default 0 */
    offset?: number;
}
export interface FindContainersForItemParams {
    /** Required */
    itemType: ContainerItemType;
    /** Required */
    itemId: string;
}
