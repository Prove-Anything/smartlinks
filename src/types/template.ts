// src/types/template.ts

// Base shape shared across admin/public projections
export interface TemplateBase {
  id: string
  collectionId: string
  name: string
  description?: string
  type: string
  resizeMode?: string
  pdf?: {
    base: { url: string }
    orientation: 'portrait' | 'landscape'
  }
  subject?: string
  body?: string
  css?: string
  public?: boolean
  engine?: string
  component?: string
  defaultProps?: Record<string, any>
  collections?: string[]
  [k: string]: any
}

// Admin shape (stored); includes soft-delete flags
export interface Template extends TemplateBase {
  deleted?: boolean
  deletedAt?: string
}

export type TemplateInput = Omit<TemplateBase, 'id' | 'collectionId'>
export type TemplateUpdate = Partial<Omit<TemplateBase, 'id' | 'collectionId'>>


// Public projection: privacy-safe fields
export type TemplatePublic = TemplateBase
