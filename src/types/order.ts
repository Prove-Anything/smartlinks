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
  id: string                        // UUID
  orderId: string                   // Parent order ID
  itemType: 'tag' | 'proof' | 'serial' // Type of item
  itemId: string                    // The tag ID, proof ID, or serial number
  collectionId?: string             // Collection ID
  productId?: string                // Product ID
  variantId?: string | null         // Variant ID
  batchId?: string | null           // Batch ID
  metadata: Record<string, any>     // Item-specific metadata
  createdAt: string                 // ISO 8601 timestamp
  order?: OrderSummary              // Optional order summary (when includeOrder=true)
}

/**
 * Summary of order details (included with items when requested).
 */
export interface OrderSummary {
  id: string                        // Order ID
  orderRef?: string                 // Order reference
  status: string                    // Order status
  customerId?: string               // Customer ID
  createdAt: string                 // ISO 8601 timestamp
}

/**
 * Represents an order containing multiple items.
 */
export interface Order {
  id: string                        // UUID
  orgId: string                     // Organization ID
  collectionId: string              // Collection ID
  orderRef?: string                 // Customer's own order reference/ID (e.g., "ORD-12345")
  customerId?: string               // Customer's own customer ID (can map to CRM/contacts)
  status: string                    // e.g., "pending", "processing", "shipped", "completed"
  itemCount: number                 // Cached count of items (maintained automatically)
  metadata: {
    productSummary?: Record<string, number>  // productId -> count (auto-maintained)
    [key: string]: any              // Flexible additional data
  }
  items?: OrderItem[]               // Array of items (only when includeItems=true)
  createdAt: string                 // ISO 8601 timestamp
  updatedAt: string                 // ISO 8601 timestamp
}

/**
 * Request to create a new order with items.
 */
export interface CreateOrderRequest {
  items: Array<{
    itemType: 'tag' | 'proof' | 'serial' // Required: Type of item
    itemId: string                        // Required: Item identifier
    metadata?: Record<string, any>        // Optional: Item-specific data
  }>
  orderRef?: string                       // Optional: Your own order reference/ID
  customerId?: string                     // Optional: Your customer ID
  status?: string                         // Optional: Order status (default: "pending")
  metadata?: Record<string, any>          // Optional: Order-level metadata
}

/**
 * Response from creating an order.
 */
export interface CreateOrderResponse extends Order {}

/**
 * Query parameters for getting a single order.
 */
export interface GetOrderParams {
  includeItems?: boolean            // Optional: Include items array (default: false)
}

/**
 * Response from getting a single order.
 */
export interface GetOrderResponse extends Order {}

/**
 * Request to update an existing order.
 * Items are managed separately via add/remove endpoints.
 */
export interface UpdateOrderRequest {
  orderRef?: string                 // Optional: Update order reference
  customerId?: string               // Optional: Update customer ID
  status?: string                   // Optional: Update status
  metadata?: Record<string, any>    // Optional: Merge with existing metadata
}

/**
 * Response from updating an order.
 */
export interface UpdateOrderResponse extends Order {}

/**
 * Response from deleting an order.
 */
export interface DeleteOrderResponse {
  success: boolean
}

/**
 * Request parameters for listing orders.
 */
export interface ListOrdersRequest {
  limit?: number                    // Optional: Max results (default: 100)
  offset?: number                   // Optional: Pagination offset (default: 0)
  status?: string                   // Optional: Filter by status
  orderRef?: string                 // Optional: Filter by order reference
  customerId?: string               // Optional: Filter by customer ID
  includeItems?: boolean            // Optional: Include items array (default: false)
}

/**
 * Response from listing orders.
 */
export interface ListOrdersResponse {
  orders: Order[]
  limit: number
  offset: number
}

/**
 * Request to add items to an existing order.
 */
export interface AddItemsRequest {
  items: Array<{
    itemType: 'tag' | 'proof' | 'serial' // Required: Type of item
    itemId: string                        // Required: Item identifier
    metadata?: Record<string, any>        // Optional: Item-specific data
  }>
}

/**
 * Response from adding items to an order.
 */
export interface AddItemsResponse extends Order {}

/**
 * Request to remove items from an order.
 */
export interface RemoveItemsRequest {
  itemIds: string[]                 // Array of OrderItem IDs to remove
}

/**
 * Response from removing items from an order.
 */
export interface RemoveItemsResponse extends Order {}

/**
 * Request to lookup orders by item.
 */
export interface LookupOrdersRequest {
  items: Array<{
    itemType: 'tag' | 'proof' | 'serial' // Required: Type of item
    itemId: string                        // Required: Item identifier
  }>
}

/**
 * Response from looking up orders by item.
 */
export interface LookupOrdersResponse {
  orders: Order[]                   // All orders containing any of the specified items
}

/**
 * Query parameters for getting order items.
 */
export interface GetOrderItemsParams {
  limit?: number                    // Optional: Max results (default: 100)
  offset?: number                   // Optional: Pagination offset (default: 0)
}

/**
 * Response from getting order items.
 */
export interface GetOrderItemsResponse {
  items: OrderItem[]
  limit: number
  offset: number
}

/**
 * Request for advanced order querying.
 */
export interface QueryOrdersRequest {
  query?: {
    status?: string
    orderRef?: string
    customerId?: string
    createdAfter?: string           // ISO 8601 date
    createdBefore?: string          // ISO 8601 date
    updatedAfter?: string           // ISO 8601 date
    updatedBefore?: string          // ISO 8601 date
    minItemCount?: number
    maxItemCount?: number
    metadata?: Record<string, any>
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
  limit?: number                    // Optional: Max results (default: 100)
  offset?: number                   // Optional: Pagination offset (default: 0)
  includeItems?: boolean            // Optional: Include items array (default: false)
}

/**
 * Response from advanced order querying.
 */
export interface QueryOrdersResponse {
  orders: Order[]
  limit: number
  offset: number
}

/**
 * Query parameters for order reports.
 */
export interface ReportsParams {
  groupByStatus?: boolean
  groupByCollection?: boolean
  groupByCustomer?: boolean
  groupByDate?: boolean
  groupByItemType?: boolean
  groupByProduct?: boolean
  includeItemStats?: boolean
  includeCount?: boolean            // default: true
  topN?: number                     // for customer/product grouping (default: 10)
  status?: string
  createdAfter?: string             // ISO 8601 date
  createdBefore?: string            // ISO 8601 date
}

/**
 * Response from order reports.
 */
export interface ReportsResponse {
  totalOrders?: number
  ordersByStatus?: Record<string, number>
  ordersByCollection?: Record<string, number>
  ordersByCustomer?: Record<string, number>
  ordersByDate?: Record<string, number>
  itemsByType?: Record<string, number>
  itemsByProduct?: Record<string, number>
  itemStats?: {
    totalItems: number
    avgItemsPerOrder: number
    maxItemsInOrder: number
    minItemsInOrder: number
  }
}

/**
 * Query parameters for looking up orders by product.
 */
export interface LookupByProductParams {
  limit?: number                    // Optional: Max results (default: 100)
  offset?: number                   // Optional: Pagination offset (default: 0)
  includeItems?: boolean            // Optional: Include items array (default: false)
}

/**
 * Response from looking up orders by product.
 */
export interface LookupByProductResponse {
  orders: Order[]
  limit: number
  offset: number
}

/**
 * Query parameters for finding orders by batch/product/variant.
 */
export interface FindOrdersByAttributeParams {
  limit?: number                    // Max results (default: 100)
  offset?: number                   // Pagination offset (default: 0)
  includeItems?: boolean            // Include items array (default: false)
}

/**
 * Response from finding orders by batch/product/variant.
 */
export interface FindOrdersByAttributeResponse {
  orders: Order[]
  limit: number
  offset: number
}

/**
 * Query parameters for finding items by batch/product/variant.
 */
export interface FindItemsByAttributeParams {
  limit?: number                    // Max results (default: 100)
  offset?: number                   // Pagination offset (default: 0)
  includeOrder?: boolean            // Include order summary (default: false)
}

/**
 * Response from finding items by batch/product/variant.
 */
export interface FindItemsByAttributeResponse {
  items: OrderItem[]
  count: number
  limit: number
  offset: number
}

/**
 * Query parameters for getting order IDs by attribute.
 */
export interface GetOrderIdsParams {
  limit?: number                    // Max results (default: 1000)
  offset?: number                   // Pagination offset (default: 0)
}

/**
 * Response from getting order IDs by attribute.
 */
export interface GetOrderIdsResponse {
  orderIds: string[]
  count: number
  attribute: 'batchId' | 'productId' | 'variantId'
  value: string
}

/**
 * Summary of scans for a single tag.
 */
export interface TagScanSummary {
  tagId: string
  totalScans: number
  adminScans: number
  customerScans: number
  earliestScanAt: string | null
  earliestAdminScanAt: string | null
}

/**
 * Complete analytics for an order.
 */
export interface OrderAnalyticsResponse {
  orderRef: string
  orderId: string
  itemCount: number
  tagCount: number
  analytics: {
    totalScans: number
    adminScans: number
    customerScans: number
    earliestScanAt: string              // ISO 8601
    latestScanAt: string                // ISO 8601
    earliestAdminScanAt: string | null  // ISO 8601
    earliestCustomerScanAt: string | null // ISO 8601
    estimatedCreatedAt: string          // ISO 8601 - earliest admin scan or earliest scan
    uniqueLocations: number
    locations: string[]                 // Array of location strings
    uniqueDevices: number
    devices: string[]                   // Array of device types
    eventTypes: string[]                // e.g., ["scan_tag", "verify_tag"]
    tagSummaries: TagScanSummary[]
  } | null                              // null if no tags found
  message?: string                      // Only present if no tags found
}

/**
 * Individual scan event from timeline.
 */
export interface TagScanEvent {
  codeId: string
  claimId: string
  proofId: string | null
  productId: string | null
  variantId: string | null
  batchId: string | null
  collectionId: string
  timestamp: string                     // ISO 8601
  isAdmin: boolean
  eventType: string | null              // e.g., "scan_tag"
  location: string | null               // GPS coordinates or location string
  location_accuracy: number | null
  deviceType: string | null
  ip: string | null
  country: string | null
  sessionId: string | null
  metadata: Record<string, any> | null
}

/**
 * Request for timeline analytics.
 */
export interface TimelineRequest {
  limit?: number                        // Max results (default: 1000)
  from?: string                         // ISO 8601 start date filter
  to?: string                           // ISO 8601 end date filter
  isAdmin?: boolean                     // Filter by admin scans only
}

/**
 * Response with scan timeline.
 */
export interface TimelineResponse {
  orderRef: string
  orderId: string
  timeline: TagScanEvent[]
  count: number
}

/**
 * Location-based scan event.
 */
export interface LocationScan extends TagScanEvent {
  // Inherits all TagScanEvent fields
}

/**
 * Request for location history.
 */
export interface LocationRequest {
  limit?: number                        // Max results (default: 1000)
}

/**
 * Response with location history.
 */
export interface LocationResponse {
  orderRef: string
  orderId: string
  locations: LocationScan[]
  count: number
}

/**
 * Request for bulk analytics.
 */
export interface BulkAnalyticsRequest {
  orderIds: string[]                    // Array of order IDs
  from?: string                         // ISO 8601 start date filter
  to?: string                           // ISO 8601 end date filter
}

/**
 * Summary analytics for a single order in bulk request.
 */
export interface OrderAnalyticsSummary {
  orderId: string
  orderRef: string
  analytics: {
    totalScans: number
    adminScans: number
    customerScans: number
    earliestScanAt: string | null
    earliestAdminScanAt: string | null
    estimatedCreatedAt: string | null
    tagCount: number
    tagSummaries: TagScanSummary[]
  } | null
}

/**
 * Response from bulk analytics request.
 */
export interface BulkAnalyticsResponse {
  results: OrderAnalyticsSummary[]
}

/**
 * Daily scan count for summary analytics.
 */
export interface DailyScanCount {
  date: string                          // YYYY-MM-DD
  scanCount: number
}

/**
 * Admin activity event.
 */
export interface AdminActivityEvent {
  timestamp: string                     // ISO 8601
  eventType: string
  codeId: string
  // Additional fields from scan events
}

/**
 * Request for collection summary.
 */
export interface SummaryRequest {
  from?: string                         // ISO 8601 start date filter
  to?: string                           // ISO 8601 end date filter
}

/**
 * Response with collection-wide analytics summary.
 */
export interface CollectionSummaryResponse {
  adminActivity: {
    count: number
    recent: AdminActivityEvent[]        // Last 100 events
  }
  scansByDay: DailyScanCount[]
  adminScansByDay: DailyScanCount[]
  customerScansByDay: DailyScanCount[]
}
