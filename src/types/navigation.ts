// src/types/navigation.ts
import type { CollectionAnalyticsEvent } from './analytics';

/** Where the link opens once resolved. */
export type LinkOpenTarget = '_self' | '_blank';

/**
 * Discriminated union representing any outbound link a `LinkPicker` can produce.
 *
 * This is the **persistence type** — store as-is in app config; never convert to a
 * URL string before saving. Resolve at navigation time with `SL.navigation.resolveLink`.
 *
 * - `external` — a URL outside the SmartLinks platform (supports same-tab or new-tab)
 * - `app`      — open an installed app at its default route
 * - `deep`     — open a specific deep-linkable page within an installed app
 *
 * @example
 *   // External link
 *   { kind: 'external', url: 'https://example.com', target: '_blank' }
 *
 *   // Open an app at its default route
 *   { kind: 'app', appId: 'raffle' }
 *
 *   // Open a specific page within an app
 *   { kind: 'deep', appId: 'prizes', deepLinkId: '/winners', params: { year: '2026' } }
 */
export type LinkTarget =
  | {
      kind: 'external';
      /** Absolute URL to navigate to. */
      url: string;
      target: LinkOpenTarget;
      /**
       * Window features string for `window.open`.
       * Defaults to `'noopener,noreferrer'`; supply this only to override the
       * default (e.g. to add `'popup'`). `noopener` and `noreferrer` are always
       * included regardless of what is provided here.
       */
      rel?: string;
    }
  | {
      kind: 'app';
      /** The target app's `appId`. */
      appId: string;
      target?: LinkOpenTarget;
    }
  | {
      kind: 'deep';
      /** The target app's `appId`. */
      appId: string;
      /**
       * Identifies the deep-linkable page within the target app.
       * Corresponds to `DeepLinkEntry.path` (or `path?params`) as declared in
       * `app.manifest.json#linkable` or `appConfig.linkable`.
       */
      deepLinkId: string;
      /** App-specific query params. Platform context params are injected automatically. */
      params?: Record<string, string>;
      target?: LinkOpenTarget;
    };

/**
 * Platform context fields passed to `resolveLink` to enable automatic link-click
 * tracking via `SL.analytics.browser.trackLinkClick`.
 *
 * `collectionId` is required; all other `CollectionAnalyticsEvent` fields are
 * optional and will be merged into the fired event. The resolver derives
 * `isExternal`, `destinationAppId`, `linkTitle`, and `href` automatically from
 * the `LinkTarget` — supply any of those here only if you need to override them.
 *
 * @example
 *   SL.navigation.resolveLink(link, {
 *     track: { collectionId, productId },
 *   });
 */
export type LinkTrackingContext =
  { collectionId: string } &
  Partial<Omit<CollectionAnalyticsEvent, 'collectionId' | 'eventType'>>;

/**
 * Context passed to `SL.navigation.resolveLink` to control execution environment.
 * All fields are optional — the resolver detects sensible defaults at runtime.
 */
export interface ResolveLinkContext {
  /**
   * True when running inside a SmartLinks container, widget, or iframe.
   * Defaults to auto-detection via `window.parent !== window`.
   */
  embedded?: boolean;
  /**
   * Override for the `postMessage` target window.
   * Defaults to `window.parent`. Useful in tests and hosts that proxy messages.
   */
  postTarget?: Window | null;
  /**
   * Override for the navigation window.
   * Defaults to `window`. Useful in tests.
   */
  win?: Window;
  /**
   * When provided, `resolveLink` automatically fires a `click_link` analytics
   * event via `SL.analytics.browser.trackLinkClick` immediately before
   * navigating. Supply at minimum `collectionId`; add `productId`, `proofId`,
   * or any other `CollectionAnalyticsEvent` fields you want on the event.
   *
   * The resolver derives `isExternal`, `destinationAppId`, `linkTitle`, and
   * `href` from the `LinkTarget` automatically. Fields you supply here take
   * precedence over the derived values if there is a conflict.
   *
   * Called synchronously so the event fires even for external `_blank` links
   * that unload the page immediately after.
   *
   * @example
   *   SL.navigation.resolveLink(link, {
   *     track: { collectionId, productId },
   *   });
   */
  track?: LinkTrackingContext;
}

/**
 * The object returned by `SL.navigation.resolveLink`.
 *
 * - `navigate()` — performs the navigation (postMessage, location.assign, or window.open).
 * - `describe()` — returns a plain-text summary suitable for `aria-label` and AI agents.
 */
export interface ResolvedLink {
  navigate(): void;
  describe(): string;
}
