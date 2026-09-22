// src/shared-dependencies.ts
// -----------------------------------------------------------------------------
// The host↔app SHARED DEPENDENCY CONTRACT — the single source of truth for which
// libraries the R5 portal (host) provides as singletons, so apps externalize them
// instead of bundling their own copy.
//
// The host publishes these to modern (ESM) apps via a versioned import map, and to
// legacy (UMD) apps via window globals. Both hosts and app authors should read THIS
// list rather than hard-coding their own — a mismatch is what causes duplicate-React
// crashes and silent blank containers.
//
// See docs/host-dependency-contract.md.

/** Current contract revision. Bumped when the entry list or host versions change. */
export const SHARED_DEPENDENCY_CONTRACT_VERSION = 'v7' as const;

export interface SharedDependency {
  /** Bare import specifier the app writes, e.g. `react-dom/client`. */
  specifier: string;
  /** Window global the host exposes for the UMD (legacy) resolution path. */
  globalName: string;
  /** Minimum version whose API the host guarantees — build against `>=` this, `<=` host. */
  minVersion: string;
  /** Portal-served ESM shim path this specifier maps to in the import map. */
  importMapPath: string;
}

/**
 * Canonical import-map path for a specifier: drop the leading `@` scope marker and
 * turn every `/` into `-`.
 *   'react-dom/client'      -> '/sl-shared/v7/react-dom-client.js'
 *   '@radix-ui/react-slot'  -> '/sl-shared/v7/radix-ui-react-slot.js'
 * Hosts MUST serve shims at these paths so the map the SDK advertises resolves.
 */
export function importMapPathFor(
  specifier: string,
  version: string = SHARED_DEPENDENCY_CONTRACT_VERSION,
): string {
  const slug = specifier.replace(/^@/, '').replace(/\//g, '-');
  return `/sl-shared/${version}/${slug}.js`;
}

type ContractEntry = Omit<SharedDependency, 'importMapPath'>;

// The 29-entry v7 contract: the v6 set plus `dompurify` (HTML sanitizer — pairs with
// the shared `marked` so output apps sanitize instead of each bundling their own),
// `clsx` + `tailwind-merge` (the standard `cn()` pair the portal/hub already ship, now
// exposed to apps). All small, version-stable, ubiquitous — apps stop bundling copies.
// minVersion follows the R5 host baseline (React 19, Router 7.18.4 security floor,
// LiquidJS 10.27+, current Radix majors).
const CONTRACT: ContractEntry[] = [
  { specifier: 'react', globalName: 'React', minVersion: '19.0.0' },
  { specifier: 'react-dom', globalName: 'ReactDOM', minVersion: '19.0.0' },
  { specifier: 'react-dom/client', globalName: 'ReactDOMClient', minVersion: '19.0.0' },
  { specifier: 'react/jsx-runtime', globalName: 'jsxRuntime', minVersion: '19.0.0' },
  { specifier: 'react/jsx-dev-runtime', globalName: 'jsxDevRuntime', minVersion: '19.0.0' },
  { specifier: '@proveanything/smartlinks', globalName: 'SL', minVersion: '2.0.0' },
  { specifier: '@proveanything/smartlinks-auth-ui', globalName: 'SmartlinksAuthUI', minVersion: '2.0.0' },
  { specifier: 'react-router-dom', globalName: 'ReactRouterDOM', minVersion: '7.18.4' },
  { specifier: '@tanstack/react-query', globalName: 'ReactQuery', minVersion: '5.0.0' },
  { specifier: 'lucide-react', globalName: 'LucideReact', minVersion: '1.0.0' },
  { specifier: 'date-fns', globalName: 'dateFns', minVersion: '4.0.0' },
  { specifier: 'liquidjs', globalName: 'LiquidJS', minVersion: '10.27.0' },
  { specifier: 'marked', globalName: 'marked', minVersion: '12.0.0' },
  // `window.DOMPurify` is the CONFIGURED instance (callable, `.sanitize()`), exactly as
  // dompurify's own UMD build exposes it — so `import DOMPurify from 'dompurify'`
  // resolves to the same instance a bundled default import would.
  { specifier: 'dompurify', globalName: 'DOMPurify', minVersion: '3.0.0' },
  { specifier: 'clsx', globalName: 'clsx', minVersion: '2.0.0' },
  { specifier: 'tailwind-merge', globalName: 'tailwindMerge', minVersion: '3.0.0' },
  { specifier: 'class-variance-authority', globalName: 'CVA', minVersion: '0.7.0' },
  { specifier: '@radix-ui/react-slot', globalName: 'RadixSlot', minVersion: '1.2.0' },
  { specifier: '@radix-ui/react-dialog', globalName: 'RadixDialog', minVersion: '1.1.0' },
  { specifier: '@radix-ui/react-popover', globalName: 'RadixPopover', minVersion: '1.1.0' },
  { specifier: '@radix-ui/react-tooltip', globalName: 'RadixTooltip', minVersion: '1.2.0' },
  { specifier: '@radix-ui/react-tabs', globalName: 'RadixTabs', minVersion: '1.1.0' },
  { specifier: '@radix-ui/react-accordion', globalName: 'RadixAccordion', minVersion: '1.2.0' },
  { specifier: '@radix-ui/react-select', globalName: 'RadixSelect', minVersion: '2.3.0' },
  { specifier: '@radix-ui/react-scroll-area', globalName: 'RadixScrollArea', minVersion: '1.2.0' },
  { specifier: '@radix-ui/react-label', globalName: 'RadixLabel', minVersion: '2.1.0' },
  { specifier: '@radix-ui/react-toast', globalName: 'RadixToast', minVersion: '1.2.0' },
  { specifier: '@radix-ui/react-progress', globalName: 'RadixProgress', minVersion: '1.1.0' },
  { specifier: '@radix-ui/react-avatar', globalName: 'RadixAvatar', minVersion: '1.1.0' },
];

/** The full shared-dependency contract for {@link SHARED_DEPENDENCY_CONTRACT_VERSION}. */
export const SHARED_DEPENDENCIES: readonly SharedDependency[] = CONTRACT.map((d) => ({
  ...d,
  importMapPath: importMapPathFor(d.specifier),
}));

/** Just the bare specifiers — handy for a bundler `external` list. */
export const SHARED_DEPENDENCY_SPECIFIERS: readonly string[] = SHARED_DEPENDENCIES.map(
  (d) => d.specifier,
);

/** What a host advertises at runtime so apps can detect the live contract. */
export interface HostSharedDependencies {
  version: string;
  specifiers: string[];
}

/**
 * Read the shared-dependency contract the current host advertises at runtime
 * (via `window.__SMARTLINKS_SHARED__`). Returns `null` when there is no host
 * marker — e.g. an older portal, or the bundle running outside a portal — so an
 * app can degrade gracefully or fail with an actionable message instead of a
 * bare-specifier resolution crash.
 */
export function getHostSharedDependencies(): HostSharedDependencies | null {
  const g = globalThis as unknown as {
    __SMARTLINKS_SHARED__?: { version?: unknown; specifiers?: unknown };
  };
  const marker = g.__SMARTLINKS_SHARED__;
  if (!marker || typeof marker !== 'object') return null;
  const version = typeof marker.version === 'string' ? marker.version : null;
  const specifiers = Array.isArray(marker.specifiers)
    ? marker.specifiers.filter((s): s is string => typeof s === 'string')
    : null;
  if (!version || !specifiers) return null;
  return { version, specifiers };
}
