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
  metadata: Record<string, any>     // Item-specific metadata
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
  metadata: Record<string, any>     // Flexible additional data
  items: OrderItem[]                // Array of items in this order
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
