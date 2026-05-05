// src/api/navigation.ts
import { analytics } from './analytics';
import type { LinkTarget, ResolveLinkContext, ResolvedLink } from '../types/navigation';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function detectEmbedded(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.parent !== window;
  } catch {
    // Cross-origin parent — access throws, which means we are embedded.
    return true;
  }
}

/**
 * Normalise a `deepLinkId` to a hash-route path.
 * `deepLinkId` is either a bare path ("/winners") or a "path?params" string
 * as minted from manifest entries. Strip any inline query string — params are
 * forwarded separately.
 */
function deepPath(deepLinkId: string): string {
  const [path] = deepLinkId.split('?');
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function qs(params?: Record<string, string>): string {
  if (!params) return '';
  const keys = Object.keys(params);
  if (!keys.length) return '';
  const usp = new URLSearchParams();
  for (const k of keys) usp.set(k, params[k]);
  return `?${usp.toString()}`;
}

/**
 * Build the window-features string for `window.open`.
 * `noopener` and `noreferrer` are always present; a caller-supplied `rel`
 * can add extra features (e.g. `'popup'`) which are appended after the
 * mandatory security flags.
 */
function windowFeatures(rel?: string): string {
  const base = 'noopener,noreferrer';
  if (!rel) return base;
  // Avoid duplicating the security flags if the caller already included them.
  const extra = rel
    .split(',')
    .map(f => f.trim())
    .filter(f => f && f !== 'noopener' && f !== 'noreferrer')
    .join(',');
  return extra ? `${base},${extra}` : base;
}

// ---------------------------------------------------------------------------
// Public namespace
// ---------------------------------------------------------------------------

export namespace navigation {
  /**
   * Resolve a stored `LinkTarget` into an executable navigation action.
   *
   * The resolver handles the embedded/standalone distinction automatically:
   *
   * | Kind              | Embedded (container/widget/iframe)                            | Standalone        |
   * |-------------------|---------------------------------------------------------------|-------------------|
   * | `external _blank` | `window.open(url, '_blank', 'noopener,noreferrer')`           | same              |
   * | `external _self`  | `window.location.assign(url)`                                 | same              |
   * | `app` / `deep`    | `postMessage` to parent shell; shell appends context params   | hash-route assign |
   *
   * Context params (`collectionId`, `productId`, `proofId`, etc.) are **not**
   * included in the message payload — the parent SmartLinks shell owns them and
   * appends them before broadcasting the navigation event.
   *
   * @example
   *   const r = SL.navigation.resolveLink(config.ctaLink);
   *   r.navigate();                // perform navigation
   *   button.ariaLabel = r.describe();  // human-readable label
   */
  export function resolveLink(link: LinkTarget, ctx: ResolveLinkContext = {}): ResolvedLink {
    const win = ctx.win ?? (typeof window !== 'undefined' ? window : (undefined as any));
    const embedded = ctx.embedded ?? detectEmbedded();

    function fireTracking(resolved: ResolvedLink): void {
      if (!ctx.track) return;
      try {
        analytics.browser.trackLinkClick({
          // Derived from the LinkTarget — caller overrides win if needed.
          href: link.kind === 'external' ? link.url : '',
          isExternal: link.kind === 'external',
          destinationAppId: link.kind !== 'external' ? link.appId : undefined,
          linkTitle: resolved.describe(),
          // Caller-supplied fields take precedence over the derived defaults above.
          ...ctx.track,
        });
      } catch {
        // Tracking must never prevent navigation.
      }
    }

    const resolved: ResolvedLink = {
      navigate(): void {
        if (!win) return;

        fireTracking(resolved);

        // External links are always handled the same way regardless of context.
        if (link.kind === 'external') {
          if (link.target === '_blank') {
            win.open(link.url, '_blank', windowFeatures(link.rel));
          } else {
            win.location.assign(link.url);
          }
          return;
        }

        if (embedded) {
          // Post a navigation request to the parent SmartLinks shell. The shell
          // will attach collectionId, productId, proofId, etc. before acting.
          const postTarget = ctx.postTarget ?? win.parent;
          if (!postTarget) return;
          postTarget.postMessage(
            {
              type: 'smartlinks-navigate',
              appId: link.appId,
              path: link.kind === 'deep' ? deepPath(link.deepLinkId) : '/',
              params: link.kind === 'deep' ? (link.params ?? {}) : {},
              target: link.target ?? '_self',
            },
            '*'
          );
          return;
        }

        // Standalone fallback — construct a best-effort hash route. This path
        // is intentionally minimal: the canonical URL shape is owned by the
        // platform shell. This is only used when no parent shell is present
        // (e.g. deep-linking from a server-rendered page).
        const hash =
          link.kind === 'deep'
            ? `#${deepPath(link.deepLinkId)}${qs(link.params)}`
            : `#/`;
        const url = `${win.location.pathname}?appId=${encodeURIComponent(link.appId)}${hash}`;
        if (link.target === '_blank') {
          win.open(url, '_blank', windowFeatures());
        } else {
          win.location.assign(url);
        }
      },

      describe(): string {
        if (link.kind === 'external') return `Open ${link.url}`;
        if (link.kind === 'app') return `Open app ${link.appId}`;
        return `Open ${link.appId} \u2192 ${link.deepLinkId}`;
      },
    };

    return resolved;
  }
}
