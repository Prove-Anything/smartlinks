// src/api/order.ts
import { request, post, put, del, requestWithOptions } from "../http.js";
import { listQuery } from "../list.js";
/**
 * Order Management API
 *
 * Group scanned tags, proofs, or serial numbers into orders with flexible metadata.
 * Designed for fulfillment, shipping, batch processing, and audit trails.
 */
export var order;
(function (order) {
    /**
     * Create a new order with items.
     *
     * @param collectionId - Identifier of the parent collection
     * @param data - Order creation data including items
     * @returns Promise resolving to a CreateOrderResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const order = await order.create('coll_123', {
     *   orderRef: 'ORD-12345',
     *   customerId: 'CUST-789',
     *   items: [
     *     { itemType: 'tag', itemId: 'TAG001' },
     *     { itemType: 'tag', itemId: 'TAG002' },
     *     { itemType: 'serial', itemId: 'SN12345' }
     *   ],
     *   status: 'pending',
     *   metadata: {
     *     shipmentId: 'SHIP-789',
     *     destination: 'Warehouse B'
     *   }
     * })
     * ```
     */
    async function create(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders`;
        return post(path, data);
    }
    order.create = create;
    /**
     * Get a single order by ID.
     *
     * @param collectionId - Identifier of the parent collection
     * @param orderId - Order ID
     * @param params - Optional parameters (includeItems)
     * @returns Promise resolving to a GetOrderResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Get order without items (faster)
     * const order = await order.get('coll_123', 'order_abc123')
     * console.log(`Order has ${order.itemCount} items`)
     *
     * // Get order with items
     * const orderWithItems = await order.get('coll_123', 'order_abc123', { includeItems: true })
     * console.log(orderWithItems.items) // Items array available
     * ```
     */
    async function get(collectionId, orderId, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.includeItems)
            queryParams.append('includeItems', 'true');
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}${query ? `?${query}` : ''}`;
        return request(path);
    }
    order.get = get;
    /**
     * Update order status or metadata.
     * Items are managed separately via addItems/removeItems.
     *
     * @param collectionId - Identifier of the parent collection
     * @param orderId - Order ID
     * @param data - Update data (only include fields to update)
     * @returns Promise resolving to an UpdateOrderResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const updated = await order.update('coll_123', 'order_abc123', {
     *   status: 'shipped',
     *   metadata: {
     *     trackingNumber: '1Z999AA10123456784',
     *     shippedAt: '2026-02-02T14:30:00Z'
     *   }
     * })
     * ```
     */
    async function update(collectionId, orderId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}`;
        return put(path, data);
    }
    order.update = update;
    /**
     * Delete an order and all its items (cascade delete).
     *
     * @param collectionId - Identifier of the parent collection
     * @param orderId - Order ID
     * @returns Promise resolving to a DeleteOrderResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * await order.remove('coll_123', 'order_abc123')
     * ```
     */
    async function remove(collectionId, orderId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}`;
        return del(path);
    }
    order.remove = remove;
    /**
     * List orders for a collection with optional filters, a page at a time (default 100).
     * Orders are returned in descending order by createdAt (newest first).
     *
     * @param collectionId - Identifier of the parent collection
     * @param params - Optional filters, plus `limit` and `cursor` for paging
     * @returns Promise resolving to `{ items, nextCursor }`: the orders, and the cursor for the next page (null on the last)
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // The first page of orders (without items for better performance)
     * const { items } = await order.list('coll_123')
     *
     * // List with filters, page by page
     * let page = await order.list('coll_123', { status: 'pending', limit: 50 })
     * while (page.nextCursor) {
     *   page = await order.list('coll_123', { status: 'pending', limit: 50, cursor: page.nextCursor })
     * }
     *
     * // Filter by customer with items
     * const customerOrders = await order.list('coll_123', {
     *   customerId: 'CUST-789',
     *   expand: ['items']
     * })
     *
     * // Purchase orders from one supplier
     * const purchases = await order.list('coll_123', { direction: 'purchase', partyId: supplierId })
     * ```
     */
    async function list(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders${listQuery(params)}`;
        return request(path);
    }
    order.list = list;
    /**
     * Get items from an order with pagination support.
     * Use this for orders with many items instead of `expand: ['items']`.
     *
     * @param collectionId - Identifier of the parent collection
     * @param orderId - Order ID
     * @param params - Optional `limit` and `cursor` for paging
     * @returns Promise resolving to `{ items, nextCursor }`: the order's items, and the cursor for the next page (null on the last)
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Get first page of items
     * const page1 = await order.getItems('coll_123', 'order_abc123', { limit: 100 })
     *
     * // Get next page
     * if (page1.nextCursor) {
     *   const page2 = await order.getItems('coll_123', 'order_abc123', { limit: 100, cursor: page1.nextCursor })
     * }
     * ```
     */
    async function getItems(collectionId, orderId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}/items${listQuery(params)}`;
        return request(path);
    }
    order.getItems = getItems;
    /**
     * Add additional items to an existing order.
     *
     * @param collectionId - Identifier of the parent collection
     * @param orderId - Order ID
     * @param data - Items to add
     * @returns Promise resolving to an AddItemsResponse object (updated order)
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const updated = await order.addItems('coll_123', 'order_abc123', {
     *   items: [
     *     { itemType: 'tag', itemId: 'TAG003' },
     *     { itemType: 'proof', itemId: 'proof_xyz' }
     *   ]
     * })
     * console.log(`Order now has ${updated.itemCount} items`)
     * ```
     */
    async function addItems(collectionId, orderId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}/items`;
        return post(path, data);
    }
    order.addItems = addItems;
    /**
     * Remove specific items from an order.
     *
     * @param collectionId - Identifier of the parent collection
     * @param orderId - Order ID
     * @param data - Item IDs to remove
     * @returns Promise resolving to a RemoveItemsResponse object (updated order)
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const updated = await order.removeItems('coll_123', 'order_abc123', {
     *   itemIds: ['item_001', 'item_002']
     * })
     * ```
     */
    /**
     * Add to (or take from) how much of a line has been shipped or received. Atomic, so two receipts at
     * once both count; it can't go below zero.
     *
     * @example
     * ```typescript
     * // 20 more caps arrived against a purchase order line
     * await order.lineDone('coll_123', orderId, lineId, 20)
     * ```
     */
    async function lineDone(collectionId, orderId, itemId, by) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}/items/${encodeURIComponent(itemId)}/done`;
        return post(path, { by });
    }
    order.lineDone = lineDone;
    async function removeItems(collectionId, orderId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}/items`;
        // DELETE with body requires requestWithOptions since del() doesn't send body
        return requestWithOptions(path, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
    order.removeItems = removeItems;
    function validateOrderQuery(data) {
        const query = data.query;
        if (!query)
            return;
        if ((query.batchId || query.variantId) && !query.productId) {
            throw new Error('query.productId is required when using query.batchId or query.variantId');
        }
    }
    /**
     * Advanced query for orders with order-level and item-level filtering.
     * More powerful than the basic list() function.
     *
     * @param collectionId - Identifier of the parent collection
     * @param data - The filters (`query`), plus `orderBy`, the date ranges `createdAt` / `updatedAt`,
     *   `expand: ['items']`, and `limit` and `cursor` for paging. These all sit beside `query`, not inside it.
     * @returns Promise resolving to `{ items, nextCursor }`: the matching orders, and the cursor for the next page (null on the last)
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Find pending orders created in January 2026, newest first
     * const result = await order.query('coll_123', {
     *   query: { status: 'pending' },
     *   createdAt: { gte: '2026-01-01T00:00:00Z', lte: '2026-02-01T00:00:00Z' },
     *   orderBy: [{ createdAt: 'desc' }],
     *   limit: 50
     * })
     * console.log(result.items.length)
     *
     * // The next page: the same query with the cursor
     * if (result.nextCursor) {
     *   const next = await order.query('coll_123', {
     *     query: { status: 'pending' },
     *     createdAt: { gte: '2026-01-01T00:00:00Z', lte: '2026-02-01T00:00:00Z' },
     *     orderBy: [{ createdAt: 'desc' }],
     *     limit: 50,
     *     cursor: result.nextCursor
     *   })
     * }
     *
     * // Find orders with specific metadata and item count, with their items
     * const highPriority = await order.query('coll_123', {
     *   query: {
     *     metadata: { priority: 'high' },
     *     minItemCount: 10,
     *     maxItemCount: 100
     *   },
     *   expand: ['items']
     * })
     *
     * // Find orders containing a specific product batch
     * const batchOrders = await order.query('coll_123', {
     *   query: {
     *     productId: 'prod_789',
     *     batchId: 'BATCH-2024-001'
     *   },
     *   expand: ['items']
     * })
     *
     * // Find an order containing one of several specific items
     * const matched = await order.query('coll_123', {
     *   query: {
     *     items: [
     *       { itemType: 'tag', itemId: 'TAG001' },
     *       { itemType: 'serial', itemId: 'SN12345' }
     *     ]
     *   },
     *   expand: ['items']
     * })
     * ```
     */
    async function query(collectionId, data) {
        validateOrderQuery(data);
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/query`;
        return post(path, data);
    }
    order.query = query;
    /**
     * Get reports and aggregations for orders.
     * Provides analytics grouped by status, customer, product, date, etc.
     *
     * @param collectionId - Identifier of the parent collection
     * @param params - Report parameters specifying grouping and filters
     * @returns Promise resolving to a ReportsResponse with aggregated data
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Get order counts by status
     * const statusReport = await order.reports('coll_123', {
     *   groupByStatus: true
     * })
     * console.log(statusReport.ordersByStatus)
     * // { pending: 45, shipped: 123, completed: 789 }
     *
     * // Get comprehensive analytics
     * const fullReport = await order.reports('coll_123', {
     *   groupByStatus: true,
     *   groupByProduct: true,
     *   includeItemStats: true,
     *   createdAfter: '2026-01-01T00:00:00Z'
     * })
     * console.log(fullReport.itemStats?.avgItemsPerOrder)
     *
     * // Get top 10 customers by order count
     * const topCustomers = await order.reports('coll_123', {
     *   groupByCustomer: true,
     *   topN: 10
     * })
     * ```
     */
    async function reports(collectionId, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.groupByStatus)
            queryParams.append('groupByStatus', 'true');
        if (params === null || params === void 0 ? void 0 : params.groupByCollection)
            queryParams.append('groupByCollection', 'true');
        if (params === null || params === void 0 ? void 0 : params.groupByCustomer)
            queryParams.append('groupByCustomer', 'true');
        if (params === null || params === void 0 ? void 0 : params.groupByDate)
            queryParams.append('groupByDate', 'true');
        if (params === null || params === void 0 ? void 0 : params.groupByItemType)
            queryParams.append('groupByItemType', 'true');
        if (params === null || params === void 0 ? void 0 : params.groupByProduct)
            queryParams.append('groupByProduct', 'true');
        if (params === null || params === void 0 ? void 0 : params.includeItemStats)
            queryParams.append('includeItemStats', 'true');
        if ((params === null || params === void 0 ? void 0 : params.includeCount) !== undefined)
            queryParams.append('includeCount', params.includeCount.toString());
        if (params === null || params === void 0 ? void 0 : params.topN)
            queryParams.append('topN', params.topN.toString());
        if (params === null || params === void 0 ? void 0 : params.status)
            queryParams.append('status', params.status);
        if (params === null || params === void 0 ? void 0 : params.createdAfter)
            queryParams.append('createdAfter', params.createdAfter);
        if (params === null || params === void 0 ? void 0 : params.createdBefore)
            queryParams.append('createdBefore', params.createdBefore);
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/reports${query ? `?${query}` : ''}`;
        return request(path);
    }
    order.reports = reports;
    /**
     * Get comprehensive scan analytics for all tags in an order.
     * Returns scan counts, timestamps, locations, devices, and per-tag summaries.
     *
     * @param collectionId - Identifier of the parent collection
     * @param orderId - Order ID
     * @returns Promise resolving to an OrderAnalyticsResponse with scan analytics
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const analytics = await order.getAnalytics('coll_123', 'order_abc123')
     *
     * if (analytics.analytics) {
     *   console.log(`Total scans: ${analytics.analytics.totalScans}`)
     *   console.log(`Admin scans: ${analytics.analytics.adminScans}`)
     *   console.log(`Created at: ${analytics.analytics.estimatedCreatedAt}`)
     *   console.log(`Unique locations: ${analytics.analytics.uniqueLocations}`)
     *
     *   analytics.analytics.tagSummaries.forEach(tag => {
     *     console.log(`Tag ${tag.tagId}: ${tag.totalScans} scans`)
     *   })
     * }
     * ```
     */
    async function getAnalytics(collectionId, orderId) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/analytics/${encodeURIComponent(orderId)}`;
        return post(path, {});
    }
    order.getAnalytics = getAnalytics;
    /**
     * Get chronological timeline of all scan events for an order's tags.
     * Supports filtering by date range and admin/customer scans.
     *
     * @param collectionId - Identifier of the parent collection
     * @param orderId - Order ID
     * @param params - Optional filters (`from` / `to` time window, `isAdmin`), plus `limit` and `cursor` for paging
     * @returns Promise resolving to `{ items, nextCursor, orderRef, orderId }`: the scan events, a page at a
     *   time (`limit` says how many, default 1000), with the order they belong to
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // The first page of scan events
     * let timeline = await order.getTimeline('coll_123', 'order_abc123')
     *
     * timeline.items.forEach(event => {
     *   console.log(`${event.timestamp}: ${event.eventType} by ${event.isAdmin ? 'admin' : 'customer'}`)
     * })
     *
     * // The next page
     * if (timeline.nextCursor) timeline = await order.getTimeline('coll_123', 'order_abc123', { cursor: timeline.nextCursor })
     *
     * // Get admin scans only from last week
     * const adminScans = await order.getTimeline('coll_123', 'order_abc123', {
     *   isAdmin: true,
     *   from: '2026-02-01T00:00:00Z',
     *   limit: 500
     * })
     * ```
     */
    async function getTimeline(collectionId, orderId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/analytics/${encodeURIComponent(orderId)}/timeline`;
        return post(path, params || {});
    }
    order.getTimeline = getTimeline;
    /**
     * Get location-based scan history for an order's tags.
     * Shows where the order's tags have been scanned.
     *
     * @param collectionId - Identifier of the parent collection
     * @param orderId - Order ID
     * @param params - Optional `limit` and `cursor` for paging
     * @returns Promise resolving to `{ items, nextCursor, orderRef, orderId }`: the scans that have a location,
     *   a page at a time (`limit` says how many, default 1000), with the order they belong to
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * let locations = await order.getLocationHistory('coll_123', 'order_abc123', {
     *   limit: 100
     * })
     *
     * locations.items.forEach(scan => {
     *   console.log(`${scan.location} at ${scan.timestamp}`)
     * })
     *
     * // The next page
     * if (locations.nextCursor) {
     *   locations = await order.getLocationHistory('coll_123', 'order_abc123', { limit: 100, cursor: locations.nextCursor })
     * }
     * ```
     */
    async function getLocationHistory(collectionId, orderId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/analytics/${encodeURIComponent(orderId)}/locations`;
        return post(path, params || {});
    }
    order.getLocationHistory = getLocationHistory;
    /**
     * Get analytics summary for multiple orders at once.
     * Efficient way to retrieve scan data for many orders.
     *
     * @param collectionId - Identifier of the parent collection
     * @param data - Request with array of order IDs and optional date filters
     * @returns Promise resolving to a BulkAnalyticsResponse with summaries
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const bulk = await order.getBulkAnalytics('coll_123', {
     *   orderIds: ['order_1', 'order_2', 'order_3'],
     *   from: '2026-01-01T00:00:00Z'
     * })
     *
     * bulk.results.forEach(result => {
     *   if (result.analytics) {
     *     console.log(`${result.orderRef}: ${result.analytics.totalScans} scans`)
     *   }
     * })
     * ```
     */
    async function getBulkAnalytics(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/analytics/bulk`;
        return post(path, data);
    }
    order.getBulkAnalytics = getBulkAnalytics;
    /**
     * Get collection-wide analytics summary across all orders.
     * Returns daily scan counts and admin activity overview.
     *
     * @param collectionId - Identifier of the parent collection
     * @param params - Optional date range filters
     * @returns Promise resolving to a CollectionSummaryResponse
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Get all-time collection summary
     * const summary = await order.getCollectionSummary('coll_123')
     *
     * console.log(`Admin activity count: ${summary.adminActivity.count}`)
     * console.log('Scans by day:')
     * summary.scansByDay.forEach(day => {
     *   console.log(`  ${day.date}: ${day.scanCount} scans`)
     * })
     *
     * // Get summary for last 30 days
     * const recentSummary = await order.getCollectionSummary('coll_123', {
     *   from: '2026-01-08T00:00:00Z',
     *   to: '2026-02-08T00:00:00Z'
     * })
     * ```
     */
    async function getCollectionSummary(collectionId, params) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/analytics/summary`;
        return post(path, params || {});
    }
    order.getCollectionSummary = getCollectionSummary;
})(order || (order = {}));
