// src/types/widgets.ts

/**
 * Structured navigation request emitted via the `onNavigate` prop when a
 * widget or container needs to navigate the parent platform shell to another
 * app or to a specific deep-link within an app.
 *
 * The portal orchestrator receives this object and performs the navigation
 * while preserving hierarchy context (`collectionId`, `productId`, etc.).
 *
 * Legacy callers may still pass a plain string path; the `onNavigate`
 * signature accepts both.  New widgets and containers should always use the
 * structured form.
 */
export interface NavigationRequest {
  /** Target app ID to activate */
  appId: string
  /** Deep link / page within the target app (forwarded as `pageId`) */
  deepLink?: string
  /** Extra URL params forwarded to the target app */
  params?: Record<string, string>
  /** Optionally switch to a specific product before showing the app */
  productId?: string
  /** Optionally switch to a specific proof before showing the app */
  proofId?: string
}

/**
 * Standard props received by every SmartLinks widget and container.
 *
 * These are passed by the parent platform (portal shell, OrchestratedPortal,
 * or a custom host) when mounting a widget or container component.
 *
 * **`SL` type note:** at runtime `SL` is the fully-initialised
 * `@proveanything/smartlinks` SDK instance.  It is typed as
 * `Record<string, unknown>` here to avoid a circular self-import; cast to
 * a more specific type in your app code if needed.
 */
export interface SmartLinksWidgetProps {
  /** Collection context — required */
  collectionId: string
  /** App identifier — required */
  appId: string

  /** Product context — present when the portal is scoped to a product */
  productId?: string
  /** Proof (scan/instance) context */
  proofId?: string

  /** Authenticated user info, if the viewer is logged in */
  user?: {
    id?: string
    email?: string
    name?: string
    admin?: boolean
  }

  /**
   * Pre-initialised SmartLinks SDK instance provided by the parent platform.
   * At runtime this is `typeof import('@proveanything/smartlinks')`.
   */
  SL: Record<string, unknown>

  /**
   * Navigation callback.  Emit a `NavigationRequest` to ask the parent
   * platform to navigate to another app.  A legacy plain-string path is also
   * accepted for backward compatibility.
   */
  onNavigate?: (request: NavigationRequest | string) => void

  /** Base URL of the full public portal, used for constructing deep links */
  publicPortalUrl?: string

  /** Responsive size hint */
  size?: 'compact' | 'standard' | 'large'

  /** BCP-47 language code (e.g. `'en'`, `'fr'`) */
  lang?: string

  /** Translation key overrides */
  translations?: Record<string, string>
}
