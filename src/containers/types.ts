import type { SmartLinksWidgetProps } from '../types'

/**
 * Props for a SmartLinks container component.
 *
 * Extends {@link SmartLinksWidgetProps} with container-specific additions.
 *
 * ## Rendering modes
 *
 * Containers run in two modes, and props are the sole source of context in
 * both:
 *
 * | Mode              | How context arrives                                    |
 * |-------------------|--------------------------------------------------------|
 * | Direct component  | All props are passed directly by the parent platform   |
 * | Iframe fallback   | Core params arrive via URL; `PublicPage` reads them    |
 *                       from search params when the equivalent prop is absent  |
 *
 * ## Deep-link parameters (`dlParams`) in container mode
 *
 * When the parent platform resolves a deep link (e.g. from a scanned QR code,
 * NFC tap, or shared URL), it **decodes** the link's `dlParams` payload and
 * forwards each parameter as an explicit React prop — it does **not** append
 * them to the browser URL.
 *
 * App-specific params (e.g. `preselectedAmount`, `voucherId`, `campaignSlug`)
 * should therefore be declared as optional props directly on this interface.
 * The parent guarantees that any param present in the `dlParams` payload will
 * arrive as the corresponding named prop.
 *
 * ### PublicPage priority order
 *
 * `PublicPage` (and pages derived from it) **must** resolve app-specific params
 * in the following priority order so the component works correctly in both
 * rendering modes:
 *
 * ```
 * 1. Prop value (set by parent in container / direct-component mode)
 * 2. React Router search param (useSearchParams) in MemoryRouter
 * 3. Raw URL search param (window.location) — iframe-mode fallback
 * ```
 *
 * Example hook:
 *
 * ```ts
 * function usePreselectedAmount(
 *   propValue: string | undefined,
 * ): string | undefined {
 *   const [searchParams] = useSearchParams()
 *   return (
 *     propValue ??
 *     searchParams.get('preselectedAmount') ??
 *     new URLSearchParams(window.location.search).get('preselectedAmount') ??
 *     undefined
 *   )
 * }
 * ```
 *
 * @see docs/smartlinks/routing-guide.md — full pattern documentation
 * @see docs/containers.md              — container architecture overview
 */
export interface SmartLinksContainerProps extends SmartLinksWidgetProps {
  /**
   * Optional CSS class applied to the outermost wrapper element rendered by
   * the framework around this container.
   */
  className?: string

  /**
   * Initial route path to navigate to inside the container's MemoryRouter.
   *
   * The framework sets the MemoryRouter's `initialEntries` from this value
   * when present. Useful for deep links that target a specific page within
   * the container (e.g. `'/loyalty/redeem'`).
   *
   * In iframe mode the equivalent is the `pageId` URL search parameter.
   */
  initialPath?: string

  // ─── App-specific deep-link parameters ──────────────────────────────────
  //
  // When the parent platform decodes a deep link it passes each `dlParams`
  // key as a direct prop below.  Pages should always prefer these prop
  // values over any equivalent URL search parameter so that container mode
  // works without touching the browser URL bar.
  //
  // Convention: add new app-specific params here as `propName?: string`
  // (use string for cross-mode URL compatibility) and document the
  // corresponding `dlParams` key in a JSDoc comment.
  //
  // Example (loyalty / cashback app):
  //
  // /**
  //  * Pre-selects a withdrawal amount on the redemption page.
  //  * Passed from `dlParams.preselectedAmount` by the parent platform.
  //  */
  // preselectedAmount?: string
}
