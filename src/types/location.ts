// src/types/location.ts

export type Geofence =
  | { type: 'bbox'; minLat: number; minLon: number; maxLat: number; maxLon: number }
  | { type: 'polygon'; coordinates: Array<[lat: number, lon: number]> }
  | Record<string, unknown>

// Derive payload from Location by omitting server-managed fields.
// Fields in Location are optional where appropriate, so payload stays consistent.
export type LocationPayload = Omit<
  Location,
  'locationId' | 'collectionId' | 'scope' | 'createdAt' | 'updatedAt'
>

export interface Location {
  locationId: string
  collectionId: string | null
  scope: 'global' | 'collection'
  name: string
  category?: string
  description?: string
  countryName?: string
  countryCode?: string
  websiteUrl?: string
  logoUrl?: string
  phone?: string
  email?: string
  geofence?: Geofence | {}
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface LocationSearchQuery {
  q?: string
  category?: string
  countryCode?: string
  countryName?: string
  limit?: number // default 20; max 100
  sort?: 'name' | 'countryCode' | 'countryName' // default 'name'
}

export interface LocationSearchResponse {
  items: Location[]
  count: number
}
