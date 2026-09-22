# Host dependency contract (R5)

> **SmartLinks SDK 2.x** (current `latest`). The portal host (R5) provides a fixed set of runtime
> libraries as window globals. Micro-apps **externalise** these and resolve them from the host —
> they must **not** bundle their own copies. This keeps one instance of React (and friends) on the
> page and keeps bundles small.

## The one rule that matters: externalise, never bundle

A container/widget/executor bundle **must externalise `react`, `react-dom`, and every shared
dependency below**, resolving them from the host globals. **Bundling your own React is the one
hard failure** — two React instances on the page → hooks break → crash. (Bundling `liquidjs` or
another shared lib is wasteful and can double-load, but React is the fatal one.)

React-18-built bundles keep working on the R5 host: they externalise React and run against the
host's **React 19** runtime. A bundle compiled against React 18 *typings* runs fine on the 19
*runtime* — see backwards-compatibility below.

## Vite / Rollup config

Externalise the shared deps and map each to its window global:

```ts
// vite.config.ts (library build for a container/widget/executor)
import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    lib: { entry: 'src/index.tsx', formats: ['umd'], name: 'MyApp', fileName: () => 'widgets.umd.js' },
    rollupOptions: {
      // Everything the host provides — do NOT bundle these.
      external: [
        'react', 'react-dom', 'react/jsx-runtime',
        '@proveanything/smartlinks',
        'react-router-dom', '@tanstack/react-query',
        'lucide-react', 'date-fns', 'liquidjs', 'marked', 'dompurify', 'clsx', 'tailwind-merge',
        'class-variance-authority',
        '@radix-ui/react-slot', '@radix-ui/react-dialog', '@radix-ui/react-popover',
        '@radix-ui/react-tooltip', '@radix-ui/react-tabs', '@radix-ui/react-accordion',
        '@radix-ui/react-select', '@radix-ui/react-scroll-area', '@radix-ui/react-label',
        '@radix-ui/react-toast', '@radix-ui/react-progress', '@radix-ui/react-avatar',
      ],
      output: {
        globals: {
          'react': 'React', 'react-dom': 'ReactDOM', 'react/jsx-runtime': 'jsxRuntime',
          '@proveanything/smartlinks': 'SL',
          'react-router-dom': 'ReactRouterDOM', '@tanstack/react-query': 'ReactQuery',
          'lucide-react': 'LucideReact', 'date-fns': 'dateFns', 'liquidjs': 'LiquidJS',
          'marked': 'marked', 'dompurify': 'DOMPurify', 'clsx': 'clsx',
          'tailwind-merge': 'tailwindMerge', 'class-variance-authority': 'CVA',
          '@radix-ui/react-slot': 'RadixSlot', '@radix-ui/react-dialog': 'RadixDialog',
          '@radix-ui/react-popover': 'RadixPopover', '@radix-ui/react-tooltip': 'RadixTooltip',
          '@radix-ui/react-tabs': 'RadixTabs', '@radix-ui/react-accordion': 'RadixAccordion',
          '@radix-ui/react-select': 'RadixSelect', '@radix-ui/react-scroll-area': 'RadixScrollArea',
          '@radix-ui/react-label': 'RadixLabel', '@radix-ui/react-toast': 'RadixToast',
          '@radix-ui/react-progress': 'RadixProgress', '@radix-ui/react-avatar': 'RadixAvatar',
        },
      },
    },
  },
})
```

## Host-provided globals (build against versions ≤ these)

| Import | Window global | Host provides (R5) |
|---|---|---|
| `react` | `React` | 19.3 (accepts 18.3 builds) |
| `react-dom` | `ReactDOM` | 19.3 (accepts 18.3 builds) |
| `react/jsx-runtime` | `jsxRuntime` | 19.3 |
| `@proveanything/smartlinks` | `SL` | 2.0.5 |
| `react-router-dom` | `ReactRouterDOM` | 7.18 (accepts 6.x builds) |
| `@tanstack/react-query` | `ReactQuery` | 5.103 |
| `lucide-react` | `LucideReact` | 1.47 |
| `date-fns` | `dateFns` | 4.4 |
| `liquidjs` | `LiquidJS` | 10.27+ |
| `marked` | `marked` | 12+ |
| `dompurify` | `DOMPurify` | 3+ |
| `clsx` | `clsx` | 2+ |
| `tailwind-merge` | `tailwindMerge` | 3+ |
| `class-variance-authority` | `CVA` | 0.7 |
| `@radix-ui/react-slot` | `RadixSlot` | 1.2.4 |
| `@radix-ui/react-dialog` | `RadixDialog` | 1.1.23 |
| `@radix-ui/react-popover` | `RadixPopover` | 1.1.1 |
| `@radix-ui/react-tooltip` | `RadixTooltip` | 1.2.8 |
| `@radix-ui/react-tabs` | `RadixTabs` | 1.1.13 |
| `@radix-ui/react-accordion` | `RadixAccordion` | 1.2.12 |
| `@radix-ui/react-select` | `RadixSelect` | 2.3.7 |
| `@radix-ui/react-scroll-area` | `RadixScrollArea` | 1.2.10 |
| `@radix-ui/react-label` | `RadixLabel` | 2.1.8 |
| `@radix-ui/react-toast` | `RadixToast` | 1.2.15 |
| `@radix-ui/react-progress` | `RadixProgress` | 1.1.8 |
| `@radix-ui/react-avatar` | `RadixAvatar` | 1.1.11 |

`liquidjs`, `marked`, `dompurify`, `clsx` and `tailwind-merge` are **host-provided** — externalise
them, don't ship a second copy (frequently missed). `marked` arrived in **v6**; `dompurify`, `clsx`
and `tailwind-merge` in **v7**. The portal and hub render markdown in the container, so use the
host's `marked` rather than bundling your own. `marked` does not sanitise HTML — pair it with the
shared `dompurify`: `el.innerHTML = DOMPurify.sanitize(marked.parse(md))`. `window.DOMPurify` is the
**configured instance** (callable, `.sanitize()`), so `import DOMPurify from 'dompurify'` behaves
exactly like a bundled default import. `clsx` + `tailwind-merge` are the standard `cn()` pair
(`import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge'`) — keep your local `cn()`
helper if you like, it just stops paying the bundle cost.

## Backwards compatibility

React-18-built containers and widgets keep working unchanged on R5. A pre-existing bundle only
breaks if it:

- calls `ReactDOM.render` / `hydrate` / `unmountComponentAtNode` (self-mounting — containers are
  mounted by the host, so this only affects apps that mount themselves);
- relies on `defaultProps` / `propTypes` on **function** components (React 19 silently ignores
  these → missing defaults, not a crash);
- uses string refs, `findDOMNode`, or legacy context;
- **bundles its own React** instead of externalising it → two instances → crash (the one hard
  failure);
- imports a `lucide-react` icon renamed/removed in the 0.x → 1.x move.

## Tailwind is *not* part of the contract

Bundles ship their own compiled CSS, so the host's Tailwind version is irrelevant to them. A
micro-app can stay on **Tailwind 3 indefinitely**, or adopt Tailwind 4 — its choice. (The starter
app ships the Tailwind 4 CSS-first layout as the default; see its README.)

> **CSS baseline (`sl-baseline` v1):** the CSS sibling of this JS contract, but deliberately
> **not** a shared Tailwind dump. It's a small, frozen, `sl-`-namespaced set of structural
> helpers (layout, spacing, responsive flow, type scale, motion — no colours, fonts, or
> components) the SDK ships (`@proveanything/smartlinks/baseline.css`) and the host serves.
> Opt-in via `meta.cssBaseline: "v1"`. See [css-baseline.md](css-baseline.md).

## The R5 host stack (reference)

React **19.3** · Vite **8.3** · react-router-dom **7.18** · Tailwind **4.3** (CSS-first) ·
TypeScript **6.0** · ESLint **10.11** · `@proveanything/smartlinks` **2.0.5** ·
`@proveanything/smartlinks-utils-ui` **1.16.4** · liquidjs **10.29** · marked **12+** ·
dompurify **3+** · clsx **2+** · tailwind-merge **3+**.

> **TypeScript 7** (the native/Go compiler) is **deliberately deferred** — tooling hasn't settled.
> Target **TS 6** for R5; it compiles existing code with no source changes.

## Security floor

An R5 app must ship with **`npm audit` reporting zero vulnerabilities**. Run it against the real
registry — `npm audit --registry=https://registry.npmjs.org` — because the sandbox mirror doesn't
implement the audit endpoint. Two high-severity advisories are already pinned out in the R5 set and
must stay pinned:

- **`react-router` 7.12.0–7.18.1** — RSC-mode CSRF bypass. Build against **7.18.4+** (the host
  provides ≥7.18.4). Never ship a router below 7.18.4.
- **`browserslist` ≤4.28.6** — unbounded memory growth / prototype write. It's a transitive build
  dependency, so pin it with an `overrides` entry (`"overrides": { "browserslist": "^4.29" }`), not
  a direct dependency.

Both are compile-time/build-time concerns for the app's own toolchain; neither is a host global.

## Reading the contract programmatically (one source of truth)

Don't hard-code the externalized list — import it from the SDK, so hosts and apps
never drift:

```ts
import {
  SHARED_DEPENDENCY_CONTRACT_VERSION, // 'v7'
  SHARED_DEPENDENCIES,                // [{ specifier, globalName, minVersion, importMapPath }, …] (29)
  SHARED_DEPENDENCY_SPECIFIERS,       // bare specifiers — drop straight into a bundler `external` list
  getHostSharedDependencies,          // what the live host advertises at runtime, or null
} from '@proveanything/smartlinks'

// Build config: externalize exactly the contract.
export const external = [...SHARED_DEPENDENCY_SPECIFIERS]

// Runtime: degrade gracefully on an older host that lacks the import map.
const host = getHostSharedDependencies()
if (host && host.version !== SHARED_DEPENDENCY_CONTRACT_VERSION) {
  console.warn(`Built against ${SHARED_DEPENDENCY_CONTRACT_VERSION}, host serves ${host.version}`)
}
```

The host publishes its live contract on `window.__SMARTLINKS_SHARED__` (`{ version, specifiers }`),
which `getHostSharedDependencies()` reads. Import-map shim paths follow `importMapPathFor(specifier)`
(`/sl-shared/<version>/<slug>.js`), so both the portal and the SDK generate identical paths.

## Version retention — hosts MUST keep every published version (load-bearing)

The version in the shim path (`/sl-shared/vN/`) exists **so multiple contract versions coexist**. A
deployed app pins the version it was built against (`meta.sharedDependencies`) and resolves its shims
from that path forever. Therefore:

> **A contract bump is ADDITIVE. Generating `/sl-shared/v7/` MUST NOT delete `/sl-shared/v5/` or
> `/sl-shared/v6/`.** The shims are tiny re-export files — keep them.

If the host's shim generator *replaces* the previous version instead of *appending*, the versioning
buys nothing: every bump silently breaks every already-deployed app not yet rebuilt (bare-specifier
resolution failure → blank container — the exact failure this whole contract prevents). "The host
serves all versions while apps migrate" is not aspirational; it's a hard requirement of the host.

**Retiring a version:** only remove `/sl-shared/vN/` once no installed app still declares that
`meta.sharedDependencies` version. You can determine that from the app registry (each app's declared
version × where it's installed); until it's provably unreferenced, keep it. Prefer a long deprecation
window over reclaiming a few KB.

(The same rule applies to any versioned CSS-baseline paths — additive, never delete a live version.)
