// src/context.ts
// Read the app's runtime CONTEXT (collectionId, appId, productId, proofId, and any app-specific
// params) regardless of how the app was delivered. A public app renders the SAME page whether it is:
//   - a PAGE (index.html / HashRouter) — context arrives in the URL search and/or the hash query, or
//   - a COMPONENT (PublicContainer) — context arrives as props from the parent.
// This helper merges those sources with a clear precedence so apps stop hand-rolling the
// `containerProps || hash || search` chain. See docs/design/public-views.md.

export interface SmartLinksContext {
  collectionId?: string;
  appId?: string;
  productId?: string;
  proofId?: string;
  /**
   * The release channel the host is running this build as (e.g. 'dev' in Forge's preview of a Test
   * build). SL.functions uses it to call that channel's server functions. Absent in production.
   */
  appChannel?: string;
  /** Limits `appChannel` to one app (where several apps share a page, e.g. a portal preview). */
  appChannelApp?: string;
  /** Any other declared view params (e.g. pageId, voteId, orientation, tvMode). */
  [key: string]: string | undefined;
}

function readSearchParamsInto(out: Record<string, string | undefined>, usp: URLSearchParams): void {
  usp.forEach((value, key) => {
    if (out[key] == null && value != null) out[key] = value; // first writer wins
  });
}

/**
 * Merge the app's context from `overrides` (e.g. container props) → URL hash query → URL search,
 * with the FIRST source winning (props override the URL, hash overrides search). Safe in non-browser
 * environments (returns just the overrides). Empty-string values are kept (a param that was set to "").
 *
 * @example
 *   // Works identically whether embedded as a page (URL) or a container (props):
 *   const { collectionId, productId } = SL.readContext(containerProps)
 */
export function readContext(overrides?: Record<string, string | undefined>): SmartLinksContext {
  const out: Record<string, string | undefined> = {};

  // 1. overrides (container props) win.
  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      if (value != null && out[key] == null) out[key] = value;
    }
  }

  try {
    if (typeof window !== 'undefined' && window.location) {
      // 2. hash query (e.g. "#/preview?collectionId=..&pageId=..") — the CDN/hash-router form.
      const hash = window.location.hash || '';
      const q = hash.indexOf('?');
      if (q >= 0) readSearchParamsInto(out, new URLSearchParams(hash.slice(q + 1)));
      // 3. search string.
      if (window.location.search) readSearchParamsInto(out, new URLSearchParams(window.location.search));
    }
    // 4. the SITE the page is served as (lowest precedence). When an app runs as a public website at
    //    its own hostname (an "app site"), the host page injects window.__SMARTLINKS_SITE__ =
    //    { collectionId, appId, channel, host } — so a site knows its collection with no URL params.
    const site = (globalThis as any).__SMARTLINKS_SITE__;
    if (site && typeof site === 'object') {
      const fill = (key: string, value: unknown) => { if (out[key] == null && typeof value === 'string' && value) out[key] = value; };
      fill('collectionId', site.collectionId);
      fill('appId', site.appId);
      // A site on a pre-release channel calls that channel's server functions (stable needs no channel).
      if (site.channel && site.channel !== 'stable') {
        fill('appChannel', site.channel);
        fill('appChannelApp', site.appId);
      }
    }
  } catch {
    /* non-browser / bad URL — return what we have */
  }

  return out as SmartLinksContext;
}
