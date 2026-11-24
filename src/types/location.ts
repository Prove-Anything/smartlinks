// src/types/location.ts
import type { ListOptions, OrderBy } from './list'

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

/** `location.search` options: the filters, plus `limit` and `cursor`. */
export interface LocationSearchQuery extends ListOptions {
  /** Search text. */
  q?: string
  category?: string
  countryCode?: string
  countryName?: string
  /** How many to return: 20 unless you say otherwise, at most 100. */
  limit?: number
  /** Sort by one field: `[{ countryName: 'desc' }]`. By name unless you say otherwise. */
  orderBy?: OrderBy<'name' | 'countryCode' | 'countryName'>
}
