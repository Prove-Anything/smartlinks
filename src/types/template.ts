// src/types/template.ts


interface TemplateParameterSchema {
  key: string;
  label?: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}


// Base shape shared across admin/public projections
export interface TemplateBase {
  id: string
  collectionId: string
  name: string
  description?: string
  type: 'pdf' | 'email' | 'multichannel' | 'label'
  resizeMode?: string
  pdf?: {
    base: { url: string }
    orientation: 'portrait' | 'landscape'
  }
  channels?: {
    email?: {subject: string; body: string},
    sms?: { body: string },
    push: { title: string; body: string, url?: string, iconUrl?: string },
    wallet?: { header: string; body: string; imageUri?: string }
  }
  parameters: TemplateParameterSchema[]
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

// Rendering helpers
export interface TemplateRenderRequest { props: Record<string, any> }
export interface TemplateRenderResponse { ok: boolean; html: string }

export interface TemplateRenderSourceRequest {
  engine: 'liquid'
  source: string
  props?: Record<string, any>
  component?: string
}
export interface TemplateRenderSourceResponse { ok: boolean; html: string }
