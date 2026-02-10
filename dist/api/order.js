// src/api/order.ts
import { request, post, put, del, requestWithOptions } from "../http";
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
     * List orders for a collection with optional filters and pagination.
     * Orders are returned in descending order by createdAt (newest first).
     *
     * @param collectionId - Identifier of the parent collection
     * @param params - Optional query parameters for filtering and pagination
     * @returns Promise resolving to a ListOrdersResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // List all orders (without items for better performance)
     * const all = await order.list('coll_123')
     *
     * // List with filters
     * const pending = await order.list('coll_123', {
     *   status: 'pending',
     *   limit: 50,
     *   offset: 0
     * })
     *
     * // Filter by customer with items
     * const customerOrders = await order.list('coll_123', {
     *   customerId: 'CUST-789',
     *   includeItems: true
     * })
     * ```
     */
    async function list(collectionId, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.limit)
            queryParams.append('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.offset)
            queryParams.append('offset', params.offset.toString());
        if (params === null || params === void 0 ? void 0 : params.status)
            queryParams.append('status', params.status);
        if (params === null || params === void 0 ? void 0 : params.orderRef)
            queryParams.append('orderRef', params.orderRef);
        if (params === null || params === void 0 ? void 0 : params.customerId)
            queryParams.append('customerId', params.customerId);
        if (params === null || params === void 0 ? void 0 : params.includeItems)
            queryParams.append('includeItems', 'true');
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders${query ? `?${query}` : ''}`;
        return request(path);
    }
    order.list = list;
    /**
     * Get items from an order with pagination support.
     * Use this for orders with many items instead of includeItems.
     *
     * @param collectionId - Identifier of the parent collection
     * @param orderId - Order ID
     * @param params - Optional pagination parameters
     * @returns Promise resolving to a GetOrderItemsResponse object
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Get first page of items
     * const page1 = await order.getItems('coll_123', 'order_abc123', {
     *   limit: 100,
     *   offset: 0
     * })
     *
     * // Get next page
     * const page2 = await order.getItems('coll_123', 'order_abc123', {
     *   limit: 100,
     *   offset: 100
     * })
     * ```
     */
    async function getItems(collectionId, orderId, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.limit)
            queryParams.append('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.offset)
            queryParams.append('offset', params.offset.toString());
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}/items${query ? `?${query}` : ''}`;
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
    /**
     * Find all orders containing specific items (tags, proofs, or serial numbers).
     * Use case: Scan a tag and immediately see if it's part of any order.
     *
     * @param collectionId - Identifier of the parent collection
     * @param data - Items to look up
     * @returns Promise resolving to a LookupOrdersResponse with matching orders
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Scan a tag and find associated orders
     * const result = await order.lookup('coll_123', {
     *   items: [
     *     { itemType: 'tag', itemId: 'TAG001' }
     *   ]
     * })
     *
     * if (result.orders.length > 0) {
     *   console.log(`Tag is part of ${result.orders.length} order(s)`)
     *   result.orders.forEach(ord => {
     *     console.log(`Order ${ord.orderRef}: ${ord.status}`)
     *   })
     * }
     *
     * // Batch lookup multiple items
     * const batchResult = await order.lookup('coll_123', {
     *   items: [
     *     { itemType: 'tag', itemId: 'TAG001' },
     *     { itemType: 'serial', itemId: 'SN12345' },
     *     { itemType: 'proof', itemId: 'proof_xyz' }
     *   ]
     * })
     * ```
     */
    async function lookup(collectionId, data) {
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/lookup`;
        return post(path, data);
    }
    order.lookup = lookup;
    /**
     * Advanced query for orders with date filtering, metadata search, and sorting.
     * More powerful than the basic list() function.
     *
     * @param collectionId - Identifier of the parent collection
     * @param data - Query parameters with filters, sorting, and pagination
     * @returns Promise resolving to a QueryOrdersResponse
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Find pending orders created in January 2026
     * const result = await order.query('coll_123', {
     *   query: {
     *     status: 'pending',
     *     createdAfter: '2026-01-01T00:00:00Z',
     *     createdBefore: '2026-02-01T00:00:00Z',
     *     sortBy: 'createdAt',
     *     sortOrder: 'desc'
     *   },
     *   limit: 50
     * })
     *
     * // Find orders with specific metadata and item count
     * const highPriority = await order.query('coll_123', {
     *   query: {
     *     metadata: { priority: 'high' },
     *     minItemCount: 10,
     *     maxItemCount: 100
     *   },
     *   includeItems: true
     * })
     * ```
     */
    async function query(collectionId, data) {
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
     * Find all orders containing items with a specific product ID.
     * Uses the automatic productSummary tracking in order metadata.
     *
     * @param collectionId - Identifier of the parent collection
     * @param productId - Product ID to search for
     * @param params - Optional pagination and includeItems parameters
     * @returns Promise resolving to a LookupByProductResponse
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Find all orders with a specific product
     * const result = await order.findByProduct('coll_123', 'product_abc123', {
     *   limit: 50,
     *   includeItems: false
     * })
     *
     * result.orders.forEach(ord => {
     *   const count = ord.metadata.productSummary?.['product_abc123'] ?? 0
     *   console.log(`Order ${ord.orderRef} has ${count} items of this product`)
     * })
     * ```
     */
    async function findByProduct(collectionId, productId, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.limit)
            queryParams.append('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.offset)
            queryParams.append('offset', params.offset.toString());
        if (params === null || params === void 0 ? void 0 : params.includeItems)
            queryParams.append('includeItems', 'true');
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/product/${encodeURIComponent(productId)}${query ? `?${query}` : ''}`;
        return request(path);
    }
    order.findByProduct = findByProduct;
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
     * @param params - Optional filters (limit, date range, isAdmin)
     * @returns Promise resolving to a TimelineResponse with scan events
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Get all scan events
     * const timeline = await order.getTimeline('coll_123', 'order_abc123')
     *
     * timeline.timeline.forEach(event => {
     *   console.log(`${event.timestamp}: ${event.eventType} by ${event.isAdmin ? 'admin' : 'customer'}`)
     * })
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
     * @param params - Optional limit parameter
     * @returns Promise resolving to a LocationResponse with location scans
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * const locations = await order.getLocationHistory('coll_123', 'order_abc123', {
     *   limit: 100
     * })
     *
     * console.log(`Order scanned in ${locations.count} locations`)
     * locations.locations.forEach(scan => {
     *   console.log(`${scan.location} at ${scan.timestamp}`)
     * })
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
    /**
     * Find all orders containing items from a specific batch.
     * Uses indexed queries for fast lookups across order items.
     *
     * @param collectionId - Identifier of the parent collection
     * @param batchId - Batch ID to search for
     * @param params - Optional pagination and includeItems parameters
     * @returns Promise resolving to a FindOrdersByAttributeResponse
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Find orders with items from a specific batch
     * const { orders } = await order.findByBatch('coll_123', 'BATCH-2024-001', {
     *   includeItems: true,
     *   limit: 50
     * })
     *
     * // Get unique customers who received this batch
     * const customers = [...new Set(orders.map(o => o.customerId).filter(Boolean))]
     * console.log(`Batch delivered to ${customers.length} customers`)
     * ```
     */
    async function findByBatch(collectionId, batchId, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.limit)
            queryParams.append('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.offset)
            queryParams.append('offset', params.offset.toString());
        if (params === null || params === void 0 ? void 0 : params.includeItems)
            queryParams.append('includeItems', 'true');
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/batch/${encodeURIComponent(batchId)}${query ? `?${query}` : ''}`;
        return request(path);
    }
    order.findByBatch = findByBatch;
    /**
     * Find all orders containing items from a specific product.
     * Uses indexed queries for fast lookups across order items.
     *
     * @param collectionId - Identifier of the parent collection
     * @param productId - Product ID to search for
     * @param params - Optional pagination and includeItems parameters
     * @returns Promise resolving to a FindOrdersByAttributeResponse
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Find all orders containing a product
     * const { orders, limit, offset } = await order.findOrdersByProduct('coll_123', 'prod_789', {
     *   limit: 100
     * })
     *
     * console.log(`Product appears in ${orders.length} orders`)
     * ```
     */
    async function findOrdersByProduct(collectionId, productId, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.limit)
            queryParams.append('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.offset)
            queryParams.append('offset', params.offset.toString());
        if (params === null || params === void 0 ? void 0 : params.includeItems)
            queryParams.append('includeItems', 'true');
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/product/${encodeURIComponent(productId)}${query ? `?${query}` : ''}`;
        return request(path);
    }
    order.findOrdersByProduct = findOrdersByProduct;
    /**
     * Find all orders containing items from a specific variant.
     * Uses indexed queries for fast lookups across order items.
     *
     * @param collectionId - Identifier of the parent collection
     * @param variantId - Variant ID to search for
     * @param params - Optional pagination and includeItems parameters
     * @returns Promise resolving to a FindOrdersByAttributeResponse
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Find orders with a specific variant
     * const { orders } = await order.findByVariant('coll_123', 'var_456', {
     *   includeItems: true
     * })
     *
     * console.log(`Variant ${variantId} in ${orders.length} orders`)
     * ```
     */
    async function findByVariant(collectionId, variantId, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.limit)
            queryParams.append('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.offset)
            queryParams.append('offset', params.offset.toString());
        if (params === null || params === void 0 ? void 0 : params.includeItems)
            queryParams.append('includeItems', 'true');
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/variant/${encodeURIComponent(variantId)}${query ? `?${query}` : ''}`;
        return request(path);
    }
    order.findByVariant = findByVariant;
    /**
     * Get individual order items (not full orders) for a specific batch.
     * Returns all matching items with optional order summary.
     *
     * @param collectionId - Identifier of the parent collection
     * @param batchId - Batch ID to search for
     * @param params - Optional pagination and includeOrder parameters
     * @returns Promise resolving to a FindItemsByAttributeResponse
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Get items from a batch with order info
     * const { items, count } = await order.findItemsByBatch('coll_123', 'BATCH-2024-001', {
     *   includeOrder: true,
     *   limit: 100
     * })
     *
     * // Group by order status
     * const byStatus = items.reduce((acc, item) => {
     *   const status = item.order?.status || 'unknown'
     *   acc[status] = (acc[status] || 0) + 1
     *   return acc
     * }, {})
     * ```
     */
    async function findItemsByBatch(collectionId, batchId, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.limit)
            queryParams.append('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.offset)
            queryParams.append('offset', params.offset.toString());
        if (params === null || params === void 0 ? void 0 : params.includeOrder)
            queryParams.append('includeOrder', 'true');
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/batch/${encodeURIComponent(batchId)}/items${query ? `?${query}` : ''}`;
        return request(path);
    }
    order.findItemsByBatch = findItemsByBatch;
    /**
     * Get individual order items for a specific product.
     * Returns all matching items with optional order summary.
     *
     * @param collectionId - Identifier of the parent collection
     * @param productId - Product ID to search for
     * @param params - Optional pagination and includeOrder parameters
     * @returns Promise resolving to a FindItemsByAttributeResponse
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Get all items for a product
     * const { items } = await order.findItemsByProduct('coll_123', 'prod_789', {
     *   includeOrder: true
     * })
     *
     * console.log(`Product delivered in ${items.length} order items`)
     * ```
     */
    async function findItemsByProduct(collectionId, productId, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.limit)
            queryParams.append('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.offset)
            queryParams.append('offset', params.offset.toString());
        if (params === null || params === void 0 ? void 0 : params.includeOrder)
            queryParams.append('includeOrder', 'true');
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/product/${encodeURIComponent(productId)}/items${query ? `?${query}` : ''}`;
        return request(path);
    }
    order.findItemsByProduct = findItemsByProduct;
    /**
     * Get individual order items for a specific variant.
     * Returns all matching items with optional order summary.
     *
     * @param collectionId - Identifier of the parent collection
     * @param variantId - Variant ID to search for
     * @param params - Optional pagination and includeOrder parameters
     * @returns Promise resolving to a FindItemsByAttributeResponse
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Get variant items with order details
     * const { items, count } = await order.findItemsByVariant('coll_123', 'var_456', {
     *   includeOrder: true,
     *   limit: 50
     * })
     * ```
     */
    async function findItemsByVariant(collectionId, variantId, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.limit)
            queryParams.append('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.offset)
            queryParams.append('offset', params.offset.toString());
        if (params === null || params === void 0 ? void 0 : params.includeOrder)
            queryParams.append('includeOrder', 'true');
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/variant/${encodeURIComponent(variantId)}/items${query ? `?${query}` : ''}`;
        return request(path);
    }
    order.findItemsByVariant = findItemsByVariant;
    /**
     * Get unique order IDs containing items matching the specified attribute.
     * Lightweight query that only returns order IDs, not full order objects.
     *
     * @param collectionId - Identifier of the parent collection
     * @param attribute - Attribute to search by ('batchId', 'productId', or 'variantId')
     * @param value - Value to search for
     * @param params - Optional pagination parameters
     * @returns Promise resolving to a GetOrderIdsResponse
     * @throws ErrorResponse if the request fails
     *
     * @example
     * ```typescript
     * // Get order IDs for a batch (fast count)
     * const { orderIds, count } = await order.getOrderIdsByAttribute(
     *   'coll_123',
     *   'batchId',
     *   'BATCH-2024-001'
     * )
     * console.log(`Batch appears in ${count} orders`)
     *
     * // Get order IDs for a product
     * const productOrders = await order.getOrderIdsByAttribute(
     *   'coll_123',
     *   'productId',
     *   'prod_789',
     *   { limit: 500 }
     * )
     * ```
     */
    async function getOrderIdsByAttribute(collectionId, attribute, value, params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.limit)
            queryParams.append('limit', params.limit.toString());
        if (params === null || params === void 0 ? void 0 : params.offset)
            queryParams.append('offset', params.offset.toString());
        const query = queryParams.toString();
        const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/ids/${attribute}/${encodeURIComponent(value)}${query ? `?${query}` : ''}`;
        return request(path);
    }
    order.getOrderIdsByAttribute = getOrderIdsByAttribute;
})(order || (order = {}));
