// src/types/collection.ts
/**
 * Represents a Collection object.
 */
export interface CollectionResponse {
  /** Unique identifier for the collection */
  id: string
  /** Machine-readable name of the collection */
  name: string
  /** Human-readable title of the collection */
  title: string
  /** URL to the collection’s logo image */
  logoImage: string
}
