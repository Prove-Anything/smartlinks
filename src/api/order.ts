// src/api/order.ts
import { request, post, put, del, requestWithOptions } from "../http"
import {
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
  DeleteOrderResponse,
  ListOrdersRequest,
  ListOrdersResponse,
  AddItemsRequest,
  AddItemsResponse,
  RemoveItemsRequest,
  RemoveItemsResponse,
  LookupOrdersRequest,
  LookupOrdersResponse
} from "../types/order"

/**
 * Order Management API
 * 
 * Group scanned tags, proofs, or serial numbers into orders with flexible metadata.
 * Designed for fulfillment, shipping, batch processing, and audit trails.
 */
export namespace order {
  
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
  export async function create(
    collectionId: string,
    data: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders`
    return post<CreateOrderResponse>(path, data)
  }

  /**
   * Get a single order by ID with all its items.
   * 
   * @param collectionId - Identifier of the parent collection
   * @param orderId - Order ID
   * @returns Promise resolving to a GetOrderResponse object
   * @throws ErrorResponse if the request fails
   * 
   * @example
   * ```typescript
   * const order = await order.get('coll_123', 'order_abc123')
   * console.log(`Order has ${order.itemCount} items`)
   * ```
   */
  export async function get(
    collectionId: string,
    orderId: string
  ): Promise<GetOrderResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}`
    return request<GetOrderResponse>(path)
  }

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
  export async function update(
    collectionId: string,
    orderId: string,
    data: UpdateOrderRequest
  ): Promise<UpdateOrderResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}`
    return put<UpdateOrderResponse>(path, data)
  }

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
  export async function remove(
    collectionId: string,
    orderId: string
  ): Promise<DeleteOrderResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}`
    return del<DeleteOrderResponse>(path)
  }

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
   * // List all orders
   * const all = await order.list('coll_123')
   * 
   * // List with filters
   * const pending = await order.list('coll_123', {
   *   status: 'pending',
   *   limit: 50,
   *   offset: 0
   * })
   * 
   * // Filter by customer
   * const customerOrders = await order.list('coll_123', {
   *   customerId: 'CUST-789'
   * })
   * ```
   */
  export async function list(
    collectionId: string,
    params?: ListOrdersRequest
  ): Promise<ListOrdersResponse> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.orderRef) queryParams.append('orderRef', params.orderRef)
    if (params?.customerId) queryParams.append('customerId', params.customerId)
    
    const query = queryParams.toString()
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders${query ? `?${query}` : ''}`
    return request<ListOrdersResponse>(path)
  }

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
  export async function addItems(
    collectionId: string,
    orderId: string,
    data: AddItemsRequest
  ): Promise<AddItemsResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}/items`
    return post<AddItemsResponse>(path, data)
  }

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
  export async function removeItems(
    collectionId: string,
    orderId: string,
    data: RemoveItemsRequest
  ): Promise<RemoveItemsResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/${encodeURIComponent(orderId)}/items`
    // DELETE with body requires requestWithOptions since del() doesn't send body
    return requestWithOptions<RemoveItemsResponse>(path, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

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
  export async function lookup(
    collectionId: string,
    data: LookupOrdersRequest
  ): Promise<LookupOrdersResponse> {
    const path = `/admin/collection/${encodeURIComponent(collectionId)}/orders/lookup`
    return post<LookupOrdersResponse>(path, data)
  }
}
