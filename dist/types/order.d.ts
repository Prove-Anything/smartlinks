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
    metadata: Record<string, any>;
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
    metadata: Record<string, any>;
    items: OrderItem[];
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
