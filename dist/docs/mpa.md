# Multi-Page App (MPA) Architecture

SmartLinks apps use Vite's multi-page build to produce **separate bundles** for public and admin interfaces. This keeps the public bundle lean even as admin features grow.

---

## Why Multi-Page?

| Entry Point | HTML file | Purpose | Bundle target |
|-------------|-----------|---------|---------------|
| Public Portal | `index.html` | End-user interface | Lean, mobile-optimised |
| Admin Console | `admin.html` | Configuration & management | Can grow large |

Because `AdminApp.tsx` and its heavy dependencies are **never imported** into the public entry point, the public bundle stays small regardless of how complex the admin UI becomes:

| Scenario | Public bundle | Admin bundle |
|----------|--------------|-------------|
| App template (baseline) | ~150 KB | ~150 KB |
| Rich admin (future) | ~150 KB | ~500 KB+ |

---

## Entry Points

| File | Loads | Routes |
|------|-------|--------|
| `index.html` → `src/PublicApp.tsx` | Public routes only | `/#/`, `/#/__dev` (dev only) |
| `admin.html` → `src/AdminApp.tsx` | Admin routes only | `/#/`, `/#/settings`, … |

Both use `HashRouter` for iframe compatibility — the hash keeps routing client-side so the server always serves the same HTML file regardless of the route.

### Development Helper: `/#/__dev`

The `/#/__dev` route is a hidden helper page available **in dev mode only**. It provides:
- URL parameter testing and context injection
- Quick navigation to public / admin views
- Widget preview at all three sizes
- Context documentation inline

It is lazy-loaded and **stripped from production builds**.

---

## Build Pipeline

The build runs **five sequential steps**, each appending to `dist/` — no step wipes the output directory:

```
vite build
  && vite build --config vite.config.widget.ts
  && vite build --config vite.config.container.ts
  && vite build --config vite.config.executor.ts
  && node scripts/hash-bundles.mjs
```

| Step | Config / Script | Gate env var | Output |
|------|----------------|-------------|--------|
| 1 | `vite.config.ts` | Always runs | `index.html`, `admin.html`, `assets/*` |
| 2 | `vite.config.widget.ts` | `VITE_ENABLE_WIDGETS=true` | `widgets.umd.js`, `widgets.es.js`, `widgets.css` |
| 3 | `vite.config.container.ts` | `VITE_ENABLE_CONTAINERS=true` | `containers.umd.js`, `containers.es.js`, `containers.css` |
| 4 | `vite.config.executor.ts` | `VITE_ENABLE_EXECUTOR!=false` | `executor.umd.js`, `executor.es.js` |
| 5 | `scripts/hash-bundles.mjs` | Always runs | Renames bundles with content hashes; patches `dist/app.manifest.json` |

Steps 2–4 produce a harmless stub file when their gate env var is not set. Step 5 detects and skips stub files automatically.

**Convenience scripts:**

```bash
npm run build              # Full pipeline
npm run build:widgets      # Widget build only (step 2)
npm run build:containers   # Container build only (step 3)
npm run build:executor     # Executor build only (step 4)
```

---

## Content-Hashed Bundles

Widget, container, and executor bundles are renamed with an 8-character content hash after the build (e.g., `widgets.umd.js` → `widgets-a3b4c5d6.umd.js`). The post-build script (`scripts/hash-bundles.mjs`) patches `dist/app.manifest.json` with the hashed filenames.

This enables aggressive CDN caching:
- The **manifest** is served with no cache / short TTL — it always reflects current filenames
- The **bundles** use permanent caching (e.g., `Cache-Control: max-age=31536000, immutable`) — any content change produces a new hash and a new URL

The source `public/app.manifest.json` keeps template names (e.g., `widgets.umd.js`). Only the built copy in `dist/` gets the hashed filenames patched in.

---

## Build Output

```
dist/
├── index.html                      ← Public portal entry
├── admin.html                      ← Admin console entry
├── app.manifest.json               ← Patched with hashed bundle filenames
├── assets/
│   ├── index-[hash].js             ← Public bundle (lean)
│   ├── admin-[hash].js             ← Admin bundle (can be large)
│   └── shared-[hash].js            ← Shared chunks (UI components, etc.)
├── widgets-[hash].umd.js           ← Widget bundle (UMD)
├── widgets-[hash].es.js            ← Widget bundle (ESM)
├── widgets-[hash].css              ← Widget styles (only if custom CSS exists)
├── containers-[hash].umd.js        ← Container bundle (UMD)
├── containers-[hash].es.js         ← Container bundle (ESM)
├── containers-[hash].css           ← Container styles (only if custom CSS exists)
├── executor-[hash].umd.js          ← Executor bundle (UMD)
└── executor-[hash].es.js           ← Executor bundle (ESM)
```

> Widget and container CSS files are only present when the bundle ships custom styles. Most apps set `"css": null` in the manifest because they rely entirely on Tailwind/shadcn from the parent. See the [AI-Native App Manifests](manifests.md) guide for the CSS null warning.

---

## Platform Integration

The parent SmartLinks platform embeds apps via iframe:

| Context | URL pattern |
|---------|------------|
| Portal (public) | `https://app.example.com/#/?collectionId=...&appId=...` |
| Admin Console | `https://app.example.com/admin.html#/?collectionId=...&appId=...` |

Context parameters (`collectionId`, `appId`, `productId`, `proofId`) are passed as URL query params and read via the iframe responder. See the [iframe Responder guide](iframe-responder.md) for the full context injection API.

---

## Related Guides

| Guide | What it covers |
|-------|---------------|
| [Widgets](widgets.md) | Widget bundle: components, props, settings |
| [Containers](containers.md) | Container bundle: full-app embeds |
| [Executor Model](executor.md) | Executor bundle: SEO, LLM content, config mutations |
| [AI-Native App Manifests](manifests.md) | How manifests wire all bundles together for AI discovery |
| [iframe Responder](iframe-responder.md) | Reading context params inside the iframe |
