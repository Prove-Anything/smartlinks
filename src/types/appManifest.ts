// src/types/appManifest.ts

/**
 * SmartLinks App Manifest structure
 * Defines the configuration, widgets, setup, import, and metrics for a microapp
 */
export interface AppManifest {
  $schema?: string;
  
  meta?: {
    name: string;
    description?: string;
    version: string;
    platformRevision?: string;
    appId: string;
  };
  
  widgets?: Array<{
    name: string;
    description?: string;
    sizes?: string[];
    props?: {
      required?: string[];
      optional?: string[];
    };
  }>;
  
  setup?: {
    description?: string;
    questions?: Array<{
      id: string;
      prompt: string;
      type: string;
      default?: any;
      required?: boolean;
    }>;
    configSchema?: Record<string, any>;
    saveWith?: {
      method: string;
      scope: string;
      admin?: boolean;
    };
    contentHints?: Record<string, {
      aiGenerate?: boolean;
      prompt?: string;
    }>;
  };
  
  import?: {
    description?: string;
    scope?: string;
    fields?: Array<{
      name: string;
      type: string;
      required?: boolean;
      default?: any;
      description?: string;
    }>;
    csvExample?: string;
    saveWith?: {
      method: string;
      scope: string;
      admin?: boolean;
      note?: string;
    };
  };
  
  tunable?: {
    description?: string;
    fields?: Array<{
      name: string;
      description?: string;
      type: string;
    }>;
  };
  
  metrics?: {
    interactions?: Array<{
      id: string;
      description?: string;
    }>;
    kpis?: Array<{
      name: string;
      compute?: string;
    }>;
  };
  
  [key: string]: any; // Allow additional custom fields
}

/**
 * Single app widget data with manifest and bundle files
 */
export interface CollectionWidget {
  appId: string;
  manifestUrl: string;
  manifest: AppManifest;
  bundleSource: string;
  bundleCss?: string; // Optional CSS file
}

/**
 * Response from collection widgets endpoint
 */
export interface CollectionWidgetsResponse {
  apps: CollectionWidget[];
}

/**
 * Options for fetching collection widgets
 */
export interface GetCollectionWidgetsOptions {
  force?: boolean; // Bypass cache and fetch fresh data
}
