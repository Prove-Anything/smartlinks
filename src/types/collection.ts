// src/types/collection.ts
/**
 * Represents a Collection object.
 */
export interface Collection {
  /** Unique identifier for the collection */
  id: string
  /** Human-readable title of the collection */
  title: string
  /** Description of collection */
  description: string

  /** URL to the collection's larger header/hero image */
  headerImage?: {
    /** URL to the asset */
    url: string
    /** Thumbnail URLs in different sizes */
    thumbnails: {
      x100: string
      x200: string
      x512: string
    }
  }
  /** URL to the collection's logo image */
  logoImage?: {
    /** URL to the asset */
    url: string
    /** Thumbnail URLs in different sizes */
    thumbnails: {
      x100: string
      x200: string
      x512: string
    }
  }
  /** Collection's loader image */
  loaderImage?: {
    /** Override name for the file */
    overwriteName: string
    /** Name of the asset */
    name: string
    /** File type/extension */
    type: string
    /** URL to the asset */
    url: string
  }
  /** Array of supported languages */
  languages?: {
    /** Language code (e.g., "fr", "it", "es") */
    code: string
    /** Human-readable language name (e.g., "French", "Italian") */
    lang: string
    /** Whether this language is supported */
    supported: boolean
  }[],
  /** User roles mapping with user IDs as keys and role names as values */
  roles: {
    [userId: string]: string
  } // User roles mapping with user IDs as keys and role names as values
  /** Array of group tag names */
  groupTags?: string[] // Array of group tag names
  /** Whether the collection has a custom domain */
  redirectUrl?: string // Whether the collection has a custom domain
  /** The shortId of this collection */
  shortId: string, // The shortId of this collection
  /** if dark mode is enabled for this collection */
  dark?: boolean // if dark mode is enabled for this collection

}

// Backwards compatibility alias
export type CollectionResponse = Collection

// Derived request types
export type CollectionCreateRequest = Omit<Collection, 'id' | 'shortId'>
export type CollectionUpdateRequest = Partial<Omit<Collection, 'id' | 'shortId'>>

/**
 * Configuration for an app module within a collection.
 */
export interface AppConfig {
  // App Definition Fields
  /** Unique identifier for the app */
  id: string
  /** Underling app module id */
  srcAppId: string
  /** Display name of the app */
  name: string
  /** Optional description of the app */
  description?: string
  /** Optional icon for the app */
  faIcon?: string
  /** app category */
  category: "Authenticity" | "Documentation" | "Commerce" | "Engagement" | "AI" | "Digital Product Passports" | "Integration" | "Web3" | "Other";

  // Collection-Specific Configuration
  /** Whether the app is enabled for this collection */
  active?: boolean
  /** Whether the app is only accessible to owners */
  ownersOnly?: boolean
  /** Whether the app is hidden in the UI */
  hidden?: boolean
  
  /** Universal iframe URL for external embedding */
  publicIframeUrl?: string

  /** supports multiple pages / deep links into the app */
  supportsDeepLinks?: boolean;

  // App Component Configuration
  /** App component configuration */
  usage: {
    collection: boolean;  // use at the collecton level
    product: boolean; // use at the product level
    proof: boolean;  // use at the proof level
    widget: boolean; // has a widget component available
  }
  
  // Additional app definition fields
  [key: string]: any
}

/**
 * Response containing app configurations for a collection.
 */
export interface AppsConfigResponse {
  /** Array of app configurations */
  apps: AppConfig[]
}
