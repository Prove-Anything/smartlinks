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
| `onNavigate`      | function       | ❌       | Navigation callback                     |
| `size`            | string         | ❌       | `"compact"`, `"standard"`, or `"large"` |
| `lang`            | string         | ❌       | Language code (e.g., `"en"`)            |
| `translations`    | object         | ❌       | Translation overrides                   |
| `className`       | string         | ❌       | CSS class for the wrapper element       |

---

## Architecture

Containers use **MemoryRouter** (not HashRouter) because the parent app owns the browser's URL bar. Context is passed via props rather than URL parameters. Each container gets its own `QueryClient` to avoid cache collisions with the parent app.

```
Parent App (owns URL bar, provides globals)
  └── <PublicContainer>                    ← Container component
        ├── QueryClientProvider (isolated)
        ├── MemoryRouter (internal routing)
        ├── LanguageProvider
        └── PublicPage (+ all sub-routes)
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
  onNavigate={handleNavigate}
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
4. Ensure it uses `MemoryRouter` (not HashRouter)
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

---

## Troubleshooting

| Issue                      | Cause                                    | Fix                                                  |
| -------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| Container doesn't render   | Missing shared globals                   | Ensure all Shared Dependencies are on `window`       |
| Styles don't apply         | Missing `containers.css`                 | Load the CSS file alongside the JS bundle            |
| Routing doesn't work       | Using HashRouter instead of MemoryRouter | Containers must use MemoryRouter                     |
| Query cache conflicts      | Sharing parent's QueryClient             | Each container needs its own `QueryClient` instance  |
| `cva.cva` runtime error    | Global set to lowercase `cva`            | Use uppercase `CVA` for the global name              |
