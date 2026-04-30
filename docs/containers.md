# SmartLinks Containers

> **Copy this file into `node_modules/@proveanything/smartlinks/docs/containers.md`** in the published SDK package.

Containers are the **full public app experience** packaged as an embeddable React component. Unlike widgets (lightweight previews/cards), containers render the complete public interface — all pages, routing, and features — inside a parent React application.

---

## Widgets vs Containers

| Aspect          | Widget                             | Container                                    |
| --------------- | ---------------------------------- | -------------------------------------------- |
| **Purpose**     | Lightweight preview / summary      | Full app experience                          |
| **Bundle size** | ~10KB (app-specific code only)     | ~150KB+ (full public app)                    |
| **Loading**     | Loaded immediately with page       | Lazy-loaded on demand                        |
| **Routing**     | None (single component)            | MemoryRouter (parent owns URL bar)           |
| **Use case**    | Cards, thumbnails, quick glance    | "Open full view", embedded experiences       |
| **Build output**| `widgets.umd.js` / `widgets.es.js` | `containers.umd.js` / `containers.es.js`    |

### Why Separate Bundles?

Imagine a homepage displaying 10 app widgets. If containers were bundled with widgets, loading 10 small widget cards would also pull in 10 full app bundles — potentially megabytes of unused code. By splitting them:

1. **Widgets load fast** — parent loads `widgets.*.js` for all apps on the page (~10KB each)
2. **Containers load on demand** — only when user clicks "Open full view" does `containers.*.js` get fetched

---

## Dual-Mode Rendering

Containers can run in **two modes**, and the same container code must work in both:

| Mode | How It Works | Who Provides the Router? |
|------|-------------|--------------------------|
| **Direct Component** | Container runs directly in the parent's React context | **The framework** — wraps your component in `MemoryRouter` |
| **Iframe** | Container runs inside an iframe with its own URL | **Your app** — you manage your own `HashRouter` |

### The Critical Rule: No Router Wrappers in Your Export

> **❌ Your exported `PublicContainer` must NOT be wrapped in a `<Router>`, `<MemoryRouter>`, `<HashRouter>`, or `<BrowserRouter>`.**

**Why?** In direct-component mode, the framework already wraps your container in a `MemoryRouter`. If your component includes its own Router, React Router will throw: _"You cannot render a `<Router>` inside another `<Router>`"_.

**The routing architecture:**

```
Direct Component Mode:
  Portal Shell (HashRouter)
    └─ ContentOrchestrator
         └─ MemoryRouter ← framework provides this
              └─ <YourContainer /> ← only contains <Routes>, no <Router>
                   └─ <Route path="/" element={<Home />} />
                   └─ <Route path="/detail/:id" element={<Detail />} />

Iframe Mode:
  <iframe src="your-app-url">
    └─ <HashRouter> ← your App.tsx provides this
         └─ <Routes>
              └─ <Route path="/" element={<Home />} />
```

**Where routing goes:**
- ✅ Your **iframe entry point** (`App.tsx` / `main.tsx`) should use `HashRouter` 
- ✅ Your **exported container** (`PublicContainer.tsx`) should include `<Routes>` and `<Route>` elements
- ❌ Your **exported container** should NOT include any `<Router>` wrapper

### The Router Contract

In direct-component mode, the framework's `MemoryRouter` gives you full React Router capabilities:

- ✅ `useNavigate()` works — navigates within your container's routes
- ✅ `useLocation()` works — returns current location in the MemoryRouter
- ✅ `useParams()` works — reads params from your route definitions
- ✅ `<Routes>` / `<Route>` work — define your internal navigation
- ✅ `useSearchParams()` works — manages search params within the MemoryRouter
- ⚠️ `window.location` does **NOT** reflect your container's route — it reflects the portal's URL

**Example: Correct Container Structure**

```tsx
// ❌ WRONG — has Router wrapper
export const PublicContainer = (props: Record<string, any>) => {
  return (
    <MemoryRouter>  {/* ❌ Don't do this! */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );
};

// ✅ CORRECT — no Router wrapper
export const PublicContainer = (props: Record<string, any>) => {
  return (
    <AppContext.Provider value={props}>
      <Routes>  {/* ✅ Routes are fine, just no Router */}
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </AppContext.Provider>
  );
};
```

### The `useAppContext()` Pattern

To write containers that work identically in both modes, use this abstraction pattern:

```tsx
// src/hooks/useAppContext.ts
import { useContext, createContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface AppContextValue {
  collectionId: string;
  appId: string;
  productId?: string;
  proofId?: string;
  pageId?: string;
  initialPath?: string;
  lang?: string;
  user?: { id: string; email: string; name?: string };
  SL: typeof import('@proveanything/smartlinks');
  onNavigate?: (request: any) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

/**
 * Returns app context regardless of rendering mode.
 * - Direct component mode: reads from AppContext (props)
 * - Iframe mode: reads from URL search params
 */
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  
  // If context exists, we're in direct-component mode
  if (ctx) return ctx;
  
  // Otherwise, we're in iframe mode — read from URL params
  const [searchParams] = useSearchParams();
  const SL = (window as any).SL ?? require('@proveanything/smartlinks');

  return useMemo(() => ({
    collectionId: searchParams.get('collectionId') ?? '',
    appId: searchParams.get('appId') ?? '',
    productId: searchParams.get('productId') ?? undefined,
    proofId: searchParams.get('proofId') ?? undefined,
    pageId: searchParams.get('pageId') ?? undefined,
    lang: searchParams.get('lang') ?? undefined,
    SL,
  }), [searchParams, SL]);
}
```

**Usage in your container:**

```tsx
// src/exports/PublicContainer.tsx
import { Routes, Route } from 'react-router-dom';
import { AppContext } from '@/hooks/useAppContext';
import { Home } from '@/pages/Home';
import { Detail } from '@/pages/Detail';

export const PublicContainer = (props: Record<string, any>) => {
  return (
    <AppContext.Provider value={props}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </AppContext.Provider>
  );
};

// src/pages/Home.tsx
import { useAppContext } from '@/hooks/useAppContext';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const { collectionId, productId, SL } = useAppContext();
  const navigate = useNavigate();
  
  return (
    <div>
      <h1>Collection: {collectionId}</h1>
      <button onClick={() => navigate('/detail/123')}>
        View Detail
      </button>
    </div>
  );
}
```

### Deep Linking

The framework sets the `MemoryRouter`'s initial route based on the `pageId` or `initialPath` prop. For example, if the portal navigates to your container with `pageId: 'settings'`, your router will start at `/settings`.

To advertise deep-linkable pages, declare them in your `app.manifest.json`:

```json
{
  "linkable": [
    { "title": "Home", "path": "/" },
    { "title": "Settings", "path": "/settings" },
    { "title": "Item Detail", "path": "/item/:itemId" }
  ]
}
```

---

## Container Props

Container props extend the standard `SmartLinksWidgetProps` with an additional `className` prop:

```typescript
interface SmartLinksContainerProps extends SmartLinksWidgetProps {
  /** Optional className for the container wrapper element */
  className?: string;
}
```

All standard widget props apply:

| Prop              | Type           | Required | Description                             |
| ----------------- | -------------- | -------- | --------------------------------------- |
| `collectionId`    | string         | ✅       | Collection context                      |
| `appId`           | string         | ✅       | App identifier                          |
| `SL`              | SmartLinks SDK | ✅       | Pre-initialized SDK instance            |
| `productId`       | string         | ❌       | Product context                         |
| `proofId`         | string         | ❌       | Proof context                           |
| `user`            | object         | ❌       | Current user info                       |
| `onNavigate`      | function       | ❌       | Navigation callback (accepts `NavigationRequest` or legacy string) |
| `size`            | string         | ❌       | `"compact"`, `"standard"`, or `"large"` |
| `lang`            | string         | ❌       | Language code (e.g., `"en"`)            |
| `translations`    | object         | ❌       | Translation overrides                   |
| `className`       | string         | ❌       | CSS class for the wrapper element       |

---

## Cross-App Navigation

Containers support the same **structured navigation requests** as widgets. When a container needs to navigate to another app within the portal, it emits a `NavigationRequest` via the `onNavigate` callback. The portal orchestrator interprets the request, preserves hierarchy context, and performs the navigation.

### NavigationRequest

```typescript
interface NavigationRequest {
  /** Target app ID to activate */
  appId: string;
  /** Deep link / page within the target app (forwarded as pageId) */
  deepLink?: string;
  /** Extra params forwarded to the target app */
  params?: Record<string, string>;
  /** Optionally switch to a specific product before showing the app */
  productId?: string;
  /** Optionally switch to a specific proof before showing the app */
  proofId?: string;
}
```

### Usage in Containers

```typescript
// Inside a container component
const handleNavigateToWarranty = () => {
  onNavigate?.({
    appId: 'warranty-app',
    deepLink: 'register',
    params: { source: 'product-page' },
  });
};

// Switch product context and open an app
const handleViewRelatedProduct = (productId: string) => {
  onNavigate?.({
    appId: 'product-info',
    productId,
  });
};
```

### How It Works

```text
Container button "Register Warranty"
  → onNavigate({ appId: 'warranty', deepLink: 'register', params: { ref: 'container' } })
  → Portal orchestrator receives NavigationRequest
  → Calls actions.navigateToApp('warranty', 'register')
  → Target app loads with extraParams: { pageId: 'register', ref: 'container' }
  → collectionId, productId, proofId, theme all preserved automatically
```

### Backward Compatibility

The `onNavigate` callback accepts both structured `NavigationRequest` objects and legacy strings. Existing containers that call `onNavigate('/some-path')` continue to work. **New containers should always use the structured `NavigationRequest` format.**

See `widgets.md` for the full `NavigationRequest` documentation and additional examples.

---

## Architecture

The framework wraps containers in a **MemoryRouter** (not HashRouter) because the parent app owns the browser's URL bar. Context is passed via props rather than URL parameters. Each container gets its own `QueryClient` to avoid cache collisions with the parent app.

```
Parent App (owns URL bar, provides globals)
  └── MemoryRouter                         ← Framework provides this
       └── <PublicContainer>               ← Container component (no Router!)
             ├── QueryClientProvider (isolated)
             ├── LanguageProvider
             └── Routes/Route (internal navigation)
```

---

## Usage in Parent Apps

### ESM (Modern Bundlers)

```typescript
// Lazy-load the container only when needed
const { PublicContainer } = await import('https://my-app.com/containers.es.js');

<PublicContainer
  collectionId="abc"
  appId="my-app"
  productId="prod-123"
  SL={SL}
  onNavigate={(request) => {
    // The portal orchestrator handles NavigationRequest objects
    // automatically when using ContentOrchestrator / OrchestratedPortal
  }}
  lang="en"
  className="max-w-4xl mx-auto"
/>
```

### UMD (Script Tag)

```html
<!-- Ensure shared globals are set up first (see Shared Dependencies Contract) -->
<script src="https://my-app.com/containers.umd.js"></script>
<script>
  const { PublicContainer } = window.SmartLinksContainers;
  // Render with React
</script>
```

---

## Shared Dependencies Contract

Containers use the **exact same Shared Dependencies Contract** as widgets. No additional globals are needed. The parent app must expose these globals before loading container bundles:

- React, ReactDOM, jsxRuntime
- SL (SmartLinks SDK)
- CVA (class-variance-authority) — **uppercase to avoid `cva.cva` collision**
- ReactRouterDOM, ReactQuery
- LucideReact, dateFns, LiquidJS
- 12 Radix UI primitives (Slot, Dialog, Popover, Tooltip, Tabs, Accordion, Select, ScrollArea, Label, Toast, Progress, Avatar)

See `widgets.md` for the complete table with globals and version expectations.

> **Why `CVA` not `cva`?** The `class-variance-authority` package exports a named function called `cva`. If the UMD global is also `cva`, the wrapper resolves it as `window.cva.cva` — a double-nesting bug. Using uppercase `CVA` avoids this collision.

---

## Build Configuration

Containers are built via a dedicated Vite config: `vite.config.container.ts`.

### Enable Container Builds

Add to your `.env` file:

```
VITE_ENABLE_CONTAINERS=true
```

### Build Command

```bash
# Full pipeline (main + widgets + containers)
vite build && vite build --config vite.config.widget.ts && vite build --config vite.config.container.ts

# Containers only
vite build --config vite.config.container.ts
```

### Build Output

```text
dist/
├── containers.umd.js    # Full app container (UMD)
├── containers.es.js     # Full app container (ESM)
└── containers.css       # Container styles
```

When `VITE_ENABLE_CONTAINERS` is not set, the build produces a harmless `containers.stub.js` and skips quickly.

---

## File Structure

```
src/containers/
├── index.ts              # Main exports barrel + ContainerManifest
├── types.ts              # SmartLinksContainerProps interface
├── stub.ts               # Minimal stub for skipped builds
└── PublicContainer.tsx   # Full public app wrapper
```

### Creating a New Container

1. Create your container component in `src/containers/MyContainer.tsx`
2. Export it from `src/containers/index.ts`
3. Add it to the `CONTAINER_MANIFEST` in `src/containers/index.ts`
4. Ensure it does NOT include a Router wrapper (framework provides `MemoryRouter`)
5. Give it its own `QueryClient` to avoid cache collisions

---

## Key Differences from Iframe Apps

| Concern           | Iframe App                        | Container                          |
| ----------------- | --------------------------------- | ---------------------------------- |
| **Isolation**     | Full browser isolation            | Shares parent's React tree         |
| **URL control**   | Owns its own URL (HashRouter)     | Parent owns URL (MemoryRouter)     |
| **Context source**| URL parameters                    | React props                        |
| **Styling**       | Fully isolated CSS                | Inherits parent CSS variables      |
| **Communication** | postMessage                       | Direct props / callbacks           |
| **Auth**          | Via `SL.auth.getAccount()`        | Via `user` prop from parent        |
| **Navigation**    | `window.parent.postMessage`       | `onNavigate` with `NavigationRequest` |

---

## Troubleshooting

| Issue                      | Cause                                    | Fix                                                  |
| -------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| Container doesn't render   | Missing shared globals                   | Ensure all Shared Dependencies are on `window`       |
| Styles don't apply         | Missing `containers.css`                 | Load the CSS file alongside the JS bundle            |
| Routing doesn't work       | Container includes a Router wrapper      | Remove all Router wrappers (framework provides MemoryRouter) |
| Query cache conflicts      | Sharing parent's QueryClient             | Each container needs its own `QueryClient` instance  |
| `cva.cva` runtime error    | Global set to lowercase `cva`            | Use uppercase `CVA` for the global name              |
| Navigation does nothing    | Using legacy string with `onNavigate`    | Use structured `NavigationRequest` object instead    |

---

## Multiple Consumer Components

A single `containers` bundle can export more than one component — useful when an app wants to offer different UX styles for different portal contexts (e.g. a portal card view vs a hub embed view). Each is a named export in the same bundle, declared as a separate entry in `components[]`:

```json
"containers": {
  "components": [
    {
      "name": "PortalContainer",
      "description": "Full consumer experience for the SmartLinks portal"
    },
    {
      "name": "HubContainer",
      "description": "Compact consumer embed for hub-style layouts"
    }
  ]
}
```

All components in `containers` are consumer-facing. **Admin and operator surfaces always ship as a separate bundle** (`mobileAdmin` or via iframe). See [mobile-admin-container.md](mobile-admin-container.md) for the separate-bundle approach.
