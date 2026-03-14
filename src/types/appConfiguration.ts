// src/types/appConfiguration.ts
/**
 * Represents an App Configuration object.
 */
export interface AppConfigurationResponse {
  /** Unique identifier for the app configuration */
  id: string
  /** Name of the app configuration */
  name: string
  /** Key-value pairs representing configuration settings */
  settings?: Record<string, any>
}

/** Options for resolving a configured widget instance from app config. */
export interface GetWidgetInstanceOptions {
  appId: string
  collectionId?: string
  productId?: string
  variantId?: string
  batchId?: string
  admin?: boolean
  widgetId: string
}

/** A configured widget instance stored in `appConfig.widgets`. */
export interface WidgetInstance<TWidget = any> {
  id: string
  name?: string
  widget?: TWidget
  [key: string]: any
}

/** Minimal summary shape for picker UIs and instance selectors. */
export interface WidgetInstanceSummary {
  id: string
  name: string
  type?: string
  [key: string]: any
}
