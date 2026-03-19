# Building React Components for SmartLinks

> **Read this first** before implementing widgets or containers for the SmartLinks platform.

This guide covers the fundamental concepts you need to understand to build React components that work correctly in the SmartLinks ecosystem. For implementation details, see [widgets.md](./widgets.md) and [containers.md](./containers.md).

---

## Table of Contents

1. [Dual-Mode Rendering](#dual-mode-rendering)
2. [The Router Contract](#the-router-contract)
3. [The useAppContext Pattern](#the-useappcontext-pattern)
4. [Common Pitfalls](#common-pitfalls)

---

## Dual-Mode Rendering

Every SmartLinks component can run in **two modes**. The platform decides which mode to use based on configuration — your app doesn't choose.

| Mode | How It Works | When Used |
|------|-------------|-----------|
| **Direct Component** | Your component runs directly in the parent's React context | Default - better performance, shared context |
| **Iframe** | Your app runs inside an iframe with its own URL | Fallback - full isolation when needed |

**Key insight:** You write your component code once, and it must work correctly in **both** modes.

### What Changes Between Modes?

| Aspect | Direct Component Mode | Iframe Mode |
|--------|----------------------|-------------|
| **Context source** | Props passed from parent | URL search parameters |
| **Router** | Parent provides `MemoryRouter` | Your app provides `HashRouter` |
| **Styling** | Inherits parent's CSS scope | Fully isolated CSS |
| **SDK instance** | Shared with parent via props | Own instance from `window.SL` |
| **Communication** | Direct callbacks (props) | `postMessage` |

---

## The Router Contract

This is the **most important rule** to avoid runtime errors:

### ❌ The Critical Rule

> **Your exported component (`PublicContainer` or `PublicComponent`) must NOT be wrapped in any `<Router>` component.**

If you wrap your export in `<MemoryRouter>`, `<HashRouter>`, or `<BrowserRouter>`, React Router will throw:

```
Error: You cannot render a <Router> inside another <Router>
```

### ✅ Where Routing Goes

**For Widgets (no routing needed):**
```tsx
// src/exports/PublicComponent.tsx
export const PublicComponent = (props) => {
  return <WidgetContent />; // No router needed
};
```

**For Containers (with internal navigation):**
```tsx
// src/exports/PublicContainer.tsx
import { Routes, Route } from 'react-router-dom';

export const PublicContainer = (props) => {
  return (
    <Routes>  {/* ✅ Routes are fine */}
      <Route path="/" element={<Home />} />
      <Route path="/detail/:id" element={<Detail />} />
    </Routes>
  );
};
```

**For Iframe Entry Point:**
```tsx
// src/App.tsx (only used in iframe mode)
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HashRouter>  {/* ✅ HashRouter only in iframe entry point */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
```

### Why This Matters

```
Direct Component Mode:
  Portal App
    └─ MemoryRouter ← Parent provides this
         └─ Your Component
              └─ [If you add another Router here, it breaks]

Iframe Mode:
  <iframe>
    └─ Your App.tsx
         └─ HashRouter ← You provide this
              └─ Your Component
```

---

## The useAppContext Pattern

To access context (collectionId, productId, etc.) in a way that works in **both** modes, use this abstraction:

### The Hook

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
  lang?: string;
  user?: { id: string; email: string; name?: string };
  SL: typeof import('@proveanything/smartlinks');
  onNavigate?: (request: any) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

/**
 * Returns app context regardless of rendering mode.
 * - Direct component mode: reads from React Context (props)
 * - Iframe mode: reads from URL search params
 */
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  
  // Direct-component mode
  if (ctx) return ctx;
  
  // Iframe mode — read from URL
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

### Wire It Up in Your Export

```tsx
// src/exports/PublicContainer.tsx
import { AppContext } from '@/hooks/useAppContext';

export const PublicContainer = (props: Record<string, any>) => {
  return (
    <AppContext.Provider value={props}>
      <YourComponentTree />
    </AppContext.Provider>
  );
};
```

### Use It in Your Components

```tsx
// Anywhere in your component tree
import { useAppContext } from '@/hooks/useAppContext';

function MyComponent() {
  const { collectionId, productId, SL } = useAppContext();
  // This works in both direct-component and iframe modes!
  
  return <div>Collection: {collectionId}</div>;
}
```

### Why Not Just useSearchParams()?

In **direct-component mode**, there are no URL search params — context comes as props. If you use `useSearchParams()` directly, it will return empty values. The `useAppContext()` pattern handles both cases automatically.

---

## Common Pitfalls

### ❌ "You cannot render a `<Router>` inside another `<Router>`"

**Cause:** Your exported component wraps itself in a Router.

**Fix:** Remove the Router wrapper from `PublicContainer.tsx` or `PublicComponent.tsx`. Only your iframe entry point (`App.tsx`) should have a Router.

---

### ❌ "Invalid hook call" / Minified React error #321

**Cause:** Your bundle includes its own copy of React instead of using the parent's shared instance.

**Fix:** Ensure your build configuration externalizes React, ReactDOM, and react/jsx-runtime:

```ts
// vite.config.container.ts or vite.config.widget.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-router-dom',
        '@proveanything/smartlinks',
        // ... other shared dependencies
      ],
    },
  },
});
```

---

### ❌ Context values are undefined in direct-component mode

**Cause:** Using `useSearchParams()` or reading from `window.location` instead of using the `useAppContext()` pattern.

**Fix:** Implement the `useAppContext()` hook as shown above and use it throughout your component tree.

---

### ❌ Navigation doesn't work

**Cause:** Using `window.location` or `window.parent.postMessage` for navigation.

**Fix:** Use the `onNavigate` callback from props/context with structured `NavigationRequest` objects. See [widgets.md](./widgets.md#cross-app-navigation) for details.

---

### ❌ Styles leak between apps

**Cause:** Direct components share the parent's CSS scope — there's no iframe isolation.

**Fix:** Use CSS Modules, scoped class prefixes, or Tailwind with a unique prefix. Avoid global CSS selectors in your bundle.

---

### ❌ CORS errors when loading bundles

**Cause:** Your widget/container JavaScript or CSS is served from a different origin without CORS headers.

**Fix:** Configure CORS headers on your hosting, or use inline bundle source via the SDK's `getWidgets()` API.

---

## Quick Diagnostic Checklist

| Issue | Check |
|-------|-------|
| Router error | Remove all `<Router>` wrappers from your exported component |
| Invalid hook call | Verify React is externalized in your build config |
| Missing context | Use `useAppContext()` instead of `useSearchParams()` |
| Duplicate React | Check `window.React === yourBundle.React` in browser console |
| CSS conflicts | Use scoped CSS (modules/prefixes), avoid global selectors |

---

## File Structure Reference

```
my-app/
├── src/
│   ├── App.tsx                     ← Iframe entry (has HashRouter)
│   ├── exports/
│   │   ├── PublicContainer.tsx     ← Container export (no Router!)
│   │   └── PublicComponent.tsx     ← Widget export (no Router!)
│   ├── hooks/
│   │   └── useAppContext.ts        ← Dual-mode abstraction
│   ├── pages/
│   │   ├── Home.tsx                ← Shared components
│   │   └── Detail.tsx
│   └── main.tsx                    ← Iframe bootstrap
├── vite.config.ts                  ← Iframe build
├── vite.config.container.ts        ← Container bundle
└── vite.config.widget.ts           ← Widget bundle
```

---

## Next Steps

Now that you understand the core concepts, see the implementation guides:

- **[widgets.md](./widgets.md)** — Build lightweight preview components
- **[containers.md](./containers.md)** — Build full-page embedded experiences
- **[mpa.md](./mpa.md)** — Multi-page app architecture (optional)
- **[iframe-responder.md](./iframe-responder.md)** — Parent-side iframe integration

---

## Related Documentation

- [theme.system.md](./theme.system.md) — Theming and CSS variables
- [ai.md](./ai.md) — AI assistant integration
- [deep-link-discovery.md](./deep-link-discovery.md) — Deep linking patterns
- [manifests.md](./manifests.md) — App manifest configuration
