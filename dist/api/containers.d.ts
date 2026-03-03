import type { Container, CreateContainerInput, UpdateContainerInput, AddContainerItemsInput, RemoveContainerItemsInput, ListContainersParams, ListContainersResponse, PublicListContainersResponse, GetContainerParams, ListContainerItemsParams, ContainerItemsResponse, AddContainerItemsResponse, RemoveContainerItemsResponse, FindContainersForItemParams, FindContainersForItemResponse } from "../types/containers";
/**
 * Container Tracking API.
 *
 * Containers are physical or logical groupings (pallets, fridges, casks,
 * shipping containers, warehouses, etc.) that support **hierarchical nesting**
 * via `parentContainerId`.  Each container can hold items of type `tag`,
 * `proof`, `serial`, `order_item`, or even other `container`s.
 *
 * ### Admin vs Public
 * - **Admin** routes (`/admin/collection/:id/containers`) allow full CRUD and
 *   mutation of item membership.
 * - **Public** routes (`/public/collection/:id/containers`) are read-only.
 *   Soft-deleted containers and containers with `metadata.publicListing === false`
 *   are excluded from list results.
 *
 * Attestations against containers are managed through the `attestations`
 * namespace.  Container-scoped public shortcuts are available via
 * `attestations.publicContainer*` helpers.
 *
 * @see docs/container-tracking.md
 */
export declare namespace containers {
    /**
     * Create a new container (admin).
     *
     * @param collectionId - Collection context
     * @param data - Container definition; `containerType` is required
     * @returns The created `Container` record
     *
     * @example
     * ```typescript
     * const cask = await containers.create('coll_123', {
     *   containerType: 'cask',
     *   ref:           'CASK-0042',
     *   name:          'Cask 42 — Single Malt',
     *   metadata:      { distilleryYear: 2019, capacity: 200 },
     * })
     * ```
     */
    function create(collectionId: string, data: CreateContainerInput): Promise<Container>;
    /**
     * List containers (admin).
     *
     * Supports filtering by type, status, ref, parent, and top-level flag.
     *
     * @param collectionId - Collection context
     * @param params - Optional filter and pagination parameters
     * @returns `{ containers: Container[], limit: number, offset: number }`
     *
     * @example
     * ```typescript
     * // All active pallets
     * const { containers: pallets } = await containers.list('coll_123', {
     *   containerType: 'pallet',
     *   status:        'active',
     *   limit:         50,
     * })
     *
     * // Top-level containers only
     * const { containers: roots } = await containers.list('coll_123', { topLevel: true })
     * ```
     */
    function list(collectionId: string, params?: ListContainersParams): Promise<ListContainersResponse>;
    /**
     * Reverse lookup — find all containers currently holding a specific item (admin).
     *
     * @param collectionId - Collection context
     * @param params - `itemType` and `itemId` are required
     * @returns `{ containers: Container[] }`
     *
     * @example
     * ```typescript
     * const { containers: holding } = await containers.findForItem('coll_123', {
     *   itemType: 'proof',
     *   itemId:   'proof-uuid',
     * })
     * ```
     */
    function findForItem(collectionId: string, params: FindContainersForItemParams): Promise<FindContainersForItemResponse>;
    /**
     * Get a single container by ID (admin).
     *
     * Pass `?tree=true` to recursively embed children, and/or
     * `?includeContents=true` to embed the current item list.
     *
     * @param collectionId - Collection context
     * @param containerId - Container UUID
     * @param params - Optional display options
     * @returns `Container` (with optional `children` and `items` arrays)
     *
     * @example
     * ```typescript
     * // Flat
     * const cask = await containers.get('coll_123', 'cask-uuid')
     *
     * // Full tree with contents
     * const tree = await containers.get('coll_123', 'warehouse-uuid', {
     *   tree:            true,
     *   treeDepth:       3,
     *   includeContents: true,
     * })
     * ```
     */
    function get(collectionId: string, containerId: string, params?: GetContainerParams): Promise<Container>;
    /**
     * Partially update a container (admin).
     *
     * Only fields present in the request body are modified.
     * Pass `parentContainerId: null` to promote a container to top-level.
     *
     * @param collectionId - Collection context
     * @param containerId - Container UUID
     * @param data - Fields to update
     * @returns Updated `Container`
     *
     * @example
     * ```typescript
     * const updated = await containers.update('coll_123', 'cask-uuid', {
     *   status:   'archived',
     *   metadata: { bottledAt: '2025-04-01' },
     * })
     * ```
     */
    function update(collectionId: string, containerId: string, data: UpdateContainerInput): Promise<Container>;
    /**
     * Soft-delete a container (admin).
     *
     * Sets `deletedAt`; the record and its full item history remain queryable
     * by admins.  Public API responses automatically exclude deleted containers.
     *
     * @param collectionId - Collection context
     * @param containerId - Container UUID
     * @returns `{ success: true }`
     */
    function remove(collectionId: string, containerId: string): Promise<{
        success: true;
    }>;
    /**
     * List items currently (or historically) inside a container (admin).
     *
     * Pass `history: true` to include removed items and see the full membership log.
     *
     * @param collectionId - Collection context
     * @param containerId - Container UUID
     * @param params - Optional filters and pagination
     * @returns `{ items: ContainerItem[], limit: number, offset: number }`
     *
     * @example
     * ```typescript
     * // Current contents
     * const { items } = await containers.listItems('coll_123', 'cask-uuid')
     *
     * // Full history including removed items
     * const { items: history } = await containers.listItems('coll_123', 'cask-uuid', { history: true })
     * ```
     */
    function listItems(collectionId: string, containerId: string, params?: ListContainerItemsParams): Promise<ContainerItemsResponse>;
    /**
     * Add one or more items to a container (admin).
     *
     * Each item requires `itemType` and `itemId`.  Pass `productId` / `proofId`
     * for denormalisation convenience.
     *
     * @param collectionId - Collection context
     * @param containerId - Container UUID
     * @param data - Items to add
     * @returns `{ items: ContainerItem[] }` — the newly created membership records
     *
     * @example
     * ```typescript
     * const { items } = await containers.addItems('coll_123', 'pallet-uuid', {
     *   items: [
     *     { itemType: 'tag',   itemId: 'NFC-00AABBCC' },
     *     { itemType: 'proof', itemId: 'proof-uuid', productId: 'product-id' },
     *   ],
     * })
     * ```
     */
    function addItems(collectionId: string, containerId: string, data: AddContainerItemsInput): Promise<AddContainerItemsResponse>;
    /**
     * Soft-remove items from a container (admin).
     *
     * Sets `removedAt` on the specified `ContainerItem` records.  The records
     * are retained in the history log and can be queried with `history: true`.
     *
     * @param collectionId - Collection context
     * @param containerId - Container UUID
     * @param data - `ids` array of `ContainerItem` UUIDs to remove
     * @returns `{ success: true, removedCount: number }`
     *
     * @example
     * ```typescript
     * const result = await containers.removeItems('coll_123', 'pallet-uuid', {
     *   ids: ['container-item-uuid-1', 'container-item-uuid-2'],
     * })
     * console.log(`Removed ${result.removedCount} items`)
     * ```
     */
    function removeItems(collectionId: string, containerId: string, data: RemoveContainerItemsInput): Promise<RemoveContainerItemsResponse>;
    /**
     * List containers (public).
     *
     * Soft-deleted containers and containers with `metadata.publicListing === false`
     * are excluded from results.
     *
     * @param collectionId - Collection context
     * @param params - Optional filter and pagination parameters
     * @returns `{ containers: Container[] }`
     */
    function publicList(collectionId: string, params?: ListContainersParams): Promise<PublicListContainersResponse>;
    /**
     * Get a single container (public).
     *
     * Soft-deleted containers return a 404.  Same `?tree` and
     * `?includeContents` options as the admin version.
     *
     * @param collectionId - Collection context
     * @param containerId - Container UUID
     * @param params - Optional display options
     * @returns `Container`
     */
    function publicGet(collectionId: string, containerId: string, params?: GetContainerParams): Promise<Container>;
    /**
     * List current contents of a container (public).
     *
     * Returns only items where `removedAt` is null.  No `?history` option on
     * the public side.
     *
     * @param collectionId - Collection context
     * @param containerId - Container UUID
     * @param params - Optional pagination
     * @returns `{ items: ContainerItem[], limit: number, offset: number }`
     */
    function publicListItems(collectionId: string, containerId: string, params?: Pick<ListContainerItemsParams, 'limit' | 'offset'>): Promise<ContainerItemsResponse>;
}
