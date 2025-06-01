// src/types/product.ts
/**
 * Represents a Product Item object.
 */
export interface ProductResponse {
  /** Unique identifier for the product */
  id: string
  /** Name of the product */
  name: string
  /** Detailed description of the product */
  description: string
  /** URL to the product’s hero image */
  heroImage: string
}
