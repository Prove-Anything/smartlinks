/**
 * Order Management Types
 *
 * Types for grouping scanned tags, proofs, or serial numbers into orders
 * with flexible metadata.
 */
/**
 * Represents a single item within an order.
 */
export interface OrderItem {
    id: string;
    orderId: string;
    itemType: 'tag' | 'proof' | 'serial';
    itemId: string;
    collectionId?: string;
    productId?: string;
    variantId?: string | null;
    batchId?: string | null;
    metadata: Record<string, any>;
    createdAt: string;
    order?: OrderSummary;
}
/**
 * Summary of order details (included with items when requested).
 */
export interface OrderSummary {
    id: string;
    orderRef?: string;
    status: string;
    customerId?: string;
    createdAt: string;
}
/**
 * Represents an order containing multiple items.
 */
export interface Order {
    id: string;
    orgId: string;
    collectionId: string;
    orderRef?: string;
    customerId?: string;
    status: string;
    itemCount: number;
    metadata: {
        productSummary?: Record<string, number>;
        [key: string]: any;
    };
    items?: OrderItem[];
    createdAt: string;
    updatedAt: string;
}
/**
 * Request to create a new order with items.
 */
export interface CreateOrderRequest {
    items: Array<{
        itemType: 'tag' | 'proof' | 'serial';
        itemId: string;
        metadata?: Record<string, any>;
    }>;
    orderRef?: string;
    customerId?: string;
    status?: string;
    metadata?: Record<string, any>;
}
/**
 * Response from creating an order.
 */
export interface CreateOrderResponse extends Order {
}
/**
 * Query parameters for getting a single order.
 */
export interface GetOrderParams {
    includeItems?: boolean;
}
/**
 * Response from getting a single order.
 */
export interface GetOrderResponse extends Order {
}
/**
 * Request to update an existing order.
 * Items are managed separately via add/remove endpoints.
 */
export interface UpdateOrderRequest {
    orderRef?: string;
    customerId?: string;
    status?: string;
    metadata?: Record<string, any>;
}
/**
 * Response from updating an order.
 */
export interface UpdateOrderResponse extends Order {
}
/**
 * Response from deleting an order.
 */
export interface DeleteOrderResponse {
    success: boolean;
}
/**
 * Request parameters for listing orders.
 */
export interface ListOrdersRequest {
    limit?: number;
    offset?: number;
    status?: string;
    orderRef?: string;
    customerId?: string;
    includeItems?: boolean;
}
/**
 * Response from listing orders.
 */
export interface ListOrdersResponse {
    orders: Order[];
    limit: number;
    offset: number;
}
/**
 * Request to add items to an existing order.
 */
export interface AddItemsRequest {
    items: Array<{
        itemType: 'tag' | 'proof' | 'serial';
        itemId: string;
        metadata?: Record<string, any>;
    }>;
}
/**
 * Response from adding items to an order.
 */
export interface AddItemsResponse extends Order {
}
/**
 * Request to remove items from an order.
 */
export interface RemoveItemsRequest {
    itemIds: string[];
}
/**
 * Response from removing items from an order.
 */
export interface RemoveItemsResponse extends Order {
}
/**
 * Request to lookup orders by item.
 */
export interface LookupOrdersRequest {
    items: Array<{
        itemType: 'tag' | 'proof' | 'serial';
        itemId: string;
    }>;
}
/**
 * Response from looking up orders by item.
 */
export interface LookupOrdersResponse {
    orders: Order[];
}
/**
 * Query parameters for getting order items.
 */
export interface GetOrderItemsParams {
    limit?: number;
    offset?: number;
}
/**
 * Response from getting order items.
 */
export interface GetOrderItemsResponse {
    items: OrderItem[];
    limit: number;
    offset: number;
}
/**
 * Request for advanced order querying.
 */
export interface QueryOrdersRequest {
    query?: {
        status?: string;
        orderRef?: string;
        customerId?: string;
        createdAfter?: string;
        createdBefore?: string;
        updatedAfter?: string;
        updatedBefore?: string;
        minItemCount?: number;
        maxItemCount?: number;
        productId?: string;
        batchId?: string;
        variantId?: string;
        itemType?: 'tag' | 'proof' | 'serial';
        itemId?: string;
        itemCollectionId?: string;
        itemMetadata?: Record<string, any>;
        items?: Array<{
            itemType: 'tag' | 'proof' | 'serial';
            itemId: string;
        }>;
        metadata?: Record<string, any>;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    };
    limit?: number;
    offset?: number;
    includeItems?: boolean;
}
/**
 * Response from advanced order querying.
 */
export interface QueryOrdersResponse {
    orders: Order[];
    limit: number;
    offset: number;
}
/**
 * Query parameters for order reports.
 */
export interface ReportsParams {
    groupByStatus?: boolean;
    groupByCollection?: boolean;
    groupByCustomer?: boolean;
    groupByDate?: boolean;
    groupByItemType?: boolean;
    groupByProduct?: boolean;
    includeItemStats?: boolean;
    includeCount?: boolean;
    topN?: number;
    status?: string;
    createdAfter?: string;
    createdBefore?: string;
}
/**
 * Response from order reports.
 */
export interface ReportsResponse {
    totalOrders?: number;
    ordersByStatus?: Record<string, number>;
    ordersByCollection?: Record<string, number>;
    ordersByCustomer?: Record<string, number>;
    ordersByDate?: Record<string, number>;
    itemsByType?: Record<string, number>;
    itemsByProduct?: Record<string, number>;
    itemStats?: {
        totalItems: number;
        avgItemsPerOrder: number;
        maxItemsInOrder: number;
        minItemsInOrder: number;
    };
}
/**
 * Query parameters for looking up orders by product.
 */
export interface LookupByProductParams {
    limit?: number;
    offset?: number;
    includeItems?: boolean;
}
/**
 * Response from looking up orders by product.
 */
export interface LookupByProductResponse {
    orders: Order[];
    limit: number;
    offset: number;
}
/**
 * Query parameters for finding orders by batch/product/variant.
 */
export interface FindOrdersByAttributeParams {
    limit?: number;
    offset?: number;
    includeItems?: boolean;
}
/**
 * Response from finding orders by batch/product/variant.
 */
export interface FindOrdersByAttributeResponse {
    orders: Order[];
    limit: number;
    offset: number;
}
/**
 * Query parameters for finding items by batch/product/variant.
 */
export interface FindItemsByAttributeParams {
    limit?: number;
    offset?: number;
    includeOrder?: boolean;
}
/**
 * Response from finding items by batch/product/variant.
 */
export interface FindItemsByAttributeResponse {
    items: OrderItem[];
    count: number;
    limit: number;
    offset: number;
}
/**
 * Query parameters for getting order IDs by attribute.
 */
export interface GetOrderIdsParams {
    limit?: number;
    offset?: number;
}
/**
 * Response from getting order IDs by attribute.
 */
export interface GetOrderIdsResponse {
    orderIds: string[];
    count: number;
    attribute: 'productId';
    value: string;
}
/**
 * Summary of scans for a single tag.
 */
export interface TagScanSummary {
    tagId: string;
    totalScans: number;
    adminScans: number;
    customerScans: number;
    earliestScanAt: string | null;
    earliestAdminScanAt: string | null;
}
/**
 * Complete analytics for an order.
 */
export interface OrderAnalyticsResponse {
    orderRef: string;
    orderId: string;
    itemCount: number;
    tagCount: number;
    analytics: {
        totalScans: number;
        adminScans: number;
        customerScans: number;
        earliestScanAt: string;
        latestScanAt: string;
        earliestAdminScanAt: string | null;
        earliestCustomerScanAt: string | null;
        estimatedCreatedAt: string;
        uniqueLocations: number;
        locations: string[];
        uniqueDevices: number;
        devices: string[];
        eventTypes: string[];
        tagSummaries: TagScanSummary[];
    } | null;
    message?: string;
}
/**
 * Individual scan event from timeline.
 */
export interface TagScanEvent {
    codeId: string;
    claimId: string;
    proofId: string | null;
    productId: string | null;
    variantId: string | null;
    batchId: string | null;
    collectionId: string;
    timestamp: string;
    isAdmin: boolean;
    eventType: string | null;
    location: string | null;
    location_accuracy: number | null;
    deviceType: string | null;
    ip: string | null;
    country: string | null;
    sessionId: string | null;
    metadata: Record<string, any> | null;
}
/**
 * Request for timeline analytics.
 */
export interface TimelineRequest {
    limit?: number;
    from?: string;
    to?: string;
    isAdmin?: boolean;
}
/**
 * Response with scan timeline.
 */
export interface TimelineResponse {
    orderRef: string;
    orderId: string;
    timeline: TagScanEvent[];
    count: number;
}
/**
 * Location-based scan event.
 */
export interface LocationScan extends TagScanEvent {
}
/**
 * Request for location history.
 */
export interface LocationRequest {
    limit?: number;
}
/**
 * Response with location history.
 */
export interface LocationResponse {
    orderRef: string;
    orderId: string;
    locations: LocationScan[];
    count: number;
}
/**
 * Request for bulk analytics.
 */
export interface BulkAnalyticsRequest {
    orderIds: string[];
    from?: string;
    to?: string;
}
/**
 * Summary analytics for a single order in bulk request.
 */
export interface OrderAnalyticsSummary {
    orderId: string;
    orderRef: string;
    analytics: {
        totalScans: number;
        adminScans: number;
        customerScans: number;
        earliestScanAt: string | null;
        earliestAdminScanAt: string | null;
        estimatedCreatedAt: string | null;
        tagCount: number;
        tagSummaries: TagScanSummary[];
    } | null;
}
/**
 * Response from bulk analytics request.
 */
export interface BulkAnalyticsResponse {
    results: OrderAnalyticsSummary[];
}
/**
 * Daily scan count for summary analytics.
 */
export interface DailyScanCount {
    date: string;
    scanCount: number;
}
/**
 * Admin activity event.
 */
export interface AdminActivityEvent {
    timestamp: string;
    eventType: string;
    codeId: string;
}
/**
 * Request for collection summary.
 */
export interface SummaryRequest {
    from?: string;
    to?: string;
}
/**
 * Response with collection-wide analytics summary.
 */
export interface CollectionSummaryResponse {
    adminActivity: {
        count: number;
        recent: AdminActivityEvent[];
    };
    scansByDay: DailyScanCount[];
    adminScansByDay: DailyScanCount[];
    customerScansByDay: DailyScanCount[];
}
