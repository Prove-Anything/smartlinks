# SmartLinks Theme Tokens — host theming contract

Status: **v1 — live. This is the theming contract to build against.**
> ✅ **Adopt this.** The R5 host (Hub/Portal) sets the `--sl-*` tokens on your mount root and sends
> `smartlinks:root-state` for live viewer-preference changes; the SDK preset (`theme.css`), the iframe
> bootstrap (`theme-boot.js`) and the Hub theme engine all speak this contract. Bind your app to these
> tokens (via `theme.css`) and it is themed by every host, forever, with no per-app theme code.
>
> **It degrades gracefully, so adoption is safe.** `theme.css` ships sensible fallback values for every
> token, so on a host that hasn't enabled token theming yet the app simply renders with neutral
> defaults rather than breaking. The legacy path (`useSmartLinksTheme()` + shadcn `--primary`/`--background`
> via the `?theme=` payload, see [`theme.system.md`](./theme.system.md)) still works during the
> transition, and [step 17] shows how to bridge shadcn variables to these tokens so both paths stay live.
> New work should bind to the tokens here.

Applies to: `@proveanything/smartlinks` ^2.0 (R5), container + widget embeds
Companion to: [`css-baseline.md`](./css-baseline.md) (mechanics, live) — this doc is **brand** (colour, shape, type)

---

## The one idea

`sl-baseline` gives apps guaranteed **mechanics** (layout, spacing, type scale) with no colour or brand.
Theme tokens give apps the host's **brand** — colour, corner shape, fonts — as a small set of
**semantic CSS custom properties** the host sets and the app reads. An app that binds to these
follows any host theme automatically, forever, with no code change.

The durable thing here is the **token contract** (names + meanings), not any theme. A *theme* is just
a set of token *values* — disposable data, hand-authored or AI-generated. The contract is small,
semantic, and versioned; themes churn freely on top of it.

```
host sets  --sl-color-accent: #b4531f   (a theme value)
    │
    ▼
SDK theme.css maps it onto Tailwind's token   →  bg-primary, text-primary, …
    │
    ▼
app renders in the host's brand — no per-app work
```

---

## 1. Design rules (why it lasts)

1. **Semantic, never literal.** Tokens name a *role* (`--sl-color-accent`, `--sl-color-surface`),
   never a colour (`--sl-blue-600`). Roles survive redesigns; literals rot.
2. **Small guaranteed core.** The app-facing contract is ~12 tokens. Richer, Hub-specific styling
   (button weight, elevation, density, imagery) lives in **host-internal** component tokens and is
   NOT part of this contract — so it can evolve without breaking apps or binding other surfaces.
3. **Additive, versioned, retained.** New tokens are added within a version with sane fallbacks; a
   removal or rename is a new version, old retained. Same discipline as the shared-dependency
   contract — never hard-remove.
4. **Each surface declares the subset it honours.** The token set is a **superset**; Hub honours all
   of it, Portal a subset. Apps read defensively (every token has a fallback), so one brand renders
   consistently across surfaces and missing tokens degrade gracefully.
5. **Tokens only — never templated CSS.** Themes are declarative values, always previewable and
   validatable. (Liquid/templating belongs to content, not styling.)

---

## 2. The v1 token set

All tokens are CSS custom properties read from the **nearest scoping element** (the app's mount
root), so different embeds on one page can theme differently. Every token has a fallback, so an app
renders correctly even against a host that sets none of them.

### Core (v1 — guaranteed; every host honours these)

| Token | Role | Example value |
|---|---|---|
| `--sl-color-bg` | app / page background | `#ffffff` |
| `--sl-color-surface` | card / panel background | `#f7f7f8` |
| `--sl-color-fg` | primary text (on bg/surface) | `#18181b` |
| `--sl-color-muted` | secondary / muted text | `#71717a` |
| `--sl-color-border` | borders, dividers, input outlines | `#e4e4e7` |
| `--sl-color-accent` | brand / primary action | `#4f46e5` |
| `--sl-color-on-accent` | text / icon on an accent fill | `#ffffff` |
| `--sl-radius-sm` | small corner radius | `4px` |
| `--sl-radius-md` | default corner radius | `8px` |
| `--sl-radius-lg` | large corner radius | `16px` |
| `--sl-font-heading` | heading font stack | `'Inter', sans-serif` |
| `--sl-font-body` | body font stack | `'Inter', sans-serif` |

### Extended (v1 — optional; Hub may set, Portal may not; read defensively)

| Token | Role | Fallback |
|---|---|---|
| `--sl-color-surface-raised` | elevated surface (popover, modal) | `--sl-color-surface` |
| `--sl-color-accent-soft` | soft accent fill (badges, hovers) | derived from `--sl-color-accent` |
| `--sl-color-success` | positive status | `#16a34a` |
| `--sl-color-danger` | negative / destructive status | `#dc2626` |
| `--sl-shadow-sm` / `--sl-shadow-md` | elevation | none |

> Everything richer than this — button weight (solid/soft/outline), density/compactness, image
> treatment, elevation scale — is a **host-internal component token**, driven by Hub's theme engine.
> It is deliberately NOT in this contract, so Hub can be as skinnable as it likes without it becoming
> a forever-obligation on every app and surface.

Dark mode is a *theme* (a different value-set), not a separate token set — the host swaps the values.

---

## 3. Theme value-sets (what the AI emits, what the lookbook stores)

A theme is data: a token version + a flat map of values. The host expands each `values` key to
`--sl-<key>` on the mount root.

```jsonc
{
  "tokensVersion": "v1",
  "name": "Warm Editorial",
  "values": {
    "color-bg": "#faf7f2",
    "color-surface": "#ffffff",
    "color-fg": "#1a1a1a",
    "color-muted": "#6b6b6b",
    "color-border": "#e6e0d8",
    "color-accent": "#b4531f",
    "color-on-accent": "#ffffff",
    "radius-sm": "4px", "radius-md": "10px", "radius-lg": "18px",
    "font-heading": "'Fraunces', serif",
    "font-body": "'Inter', sans-serif"
  }
}
```

- **Lookbook** = a gallery of these value-sets shipped as starting points; AI can generate more.
- **Refine** = AI edits `values` conversationally, previewed live in the real host, always inside the
  contract → always safe, previewable, validatable.
- **Brand on-ramp** = ingest a site/brand guide → AI emits a `values` set → refine.
- **Validation** = a value-set must pass contrast (WCAG AA) for `fg`/`bg`, `muted`/`bg`,
  `on-accent`/`accent` before it is offered or saved. AI output is checked, not trusted.

Store per collection as `{ tokensVersion, name, values }` — portable, diffable, exportable.

---

## 4. Host obligations vs app obligations

**Host (Hub / Portal):**
- Applies the active theme's `--sl-*` tokens where the embed will read them — `:root`/`<body>` for the
  simple one-brand page (container/widget apps inherit for free), or the app's mount root when embeds
  must theme independently or you want leak isolation for untrusted apps.
- For **iframe** apps, hands the initial state in via the URL fragment and posts live viewer-pref
  updates as `smartlinks:root-state` (§6.2). Brand-theme changes = reload the embed.
- Declares the token version it serves and which subset (Hub = full, Portal = core).

**App:**
- `@import "@proveanything/smartlinks/theme.css";` after Tailwind (see §5).
- Uses semantic utilities (`bg-primary`, `text-foreground`, `border-border`, `rounded-md`,
  `font-heading`) — never hardcoded palette utilities (`bg-blue-600`, `#rrggbb`).
- Authors CSS against the viewer-pref hooks (§6.1): the `.dark` class, `[data-contrast="high"]`,
  `--sl-font-scale`, and the native `@media (prefers-contrast|prefers-reduced-motion)` queries.
  **Never writes a message handler** — the SDK bootstrap flips the hooks.
- Iframe/standalone entries only: include `@proveanything/smartlinks/theme-boot.js` in `<head>`
  (§6.2). Container/widget apps don't need it.
- Declares intent in the manifest:

```jsonc
{ "meta": { "respectsHostTheme": true, "themeTokens": "v1" } }
```

`smartlinks-doctor` warns (not errors) on hardcoded colour utilities / hex in component source when
`respectsHostTheme` is `true`.

---

## 5. The SDK preset (`theme.css`)

Ships from the SDK. A Tailwind 4 `@theme` block that maps Tailwind's tokens onto the `--sl-*`
contract, with fallbacks so it is safe even where the host sets nothing:

```css
@import "tailwindcss";
@import "@proveanything/smartlinks/theme.css";
```

Requires Tailwind 4 (`@theme`). Apps still on Tailwind 3 stay as they are until they migrate
(step 16); the preset is opt-in and additive.

---

## 6. Viewer preferences, accessibility & iframe delivery

Two different kinds of "theme-ish" state, handled differently:

| | Brand theme | Viewer / accessibility prefs |
|---|---|---|
| What | accent, fonts, radius (the `--sl-*` tokens) | light/dark, contrast, font size, reduced-motion, language |
| Set by | the operator (rarely, in an editor) | the **viewer** (any time, mid-session) |
| Change model | **reload** the embed with new values | **live**, no reload (a reload on an a11y toggle *is* an a11y failure) |

**The app never writes a message handler.** It authors **CSS** against a small, fixed set of root
hooks; a generic SDK bootstrap (§6.2) flips those hooks. That's the whole obligation.

### 6.1 The viewer-pref hooks (fixed vocabulary)

- **Dark mode** — the `.dark` class (Tailwind/shadcn convention) *and* `[data-theme="dark"|"light"]`.
- **Contrast** — `[data-contrast="high"]`. Also honour `@media (prefers-contrast: more)` — the browser
  propagates the OS setting into iframes natively, so you get that slice for free.
- **Reduced motion** — honour `@media (prefers-reduced-motion: reduce)` (native, free).
- **Font size** — `--sl-font-scale` (a number, e.g. `1.25`); scale your base/rem type off it.
- **Language** — the `lang` attribute. (A language change is *content*, not just CSS — re-render/
  re-fetch is the app's own i18n job; the hook just flags it. A heavy content swap may reload.)

Most of accessibility is therefore **free**: the OS-level `prefers-contrast` / `prefers-reduced-motion`
/ browser zoom reach the iframe with no passing at all — just respect the standard media queries.

### 6.2 Iframe delivery (`theme-boot.js`)

Container/widget apps inherit the host `:root` and need none of this. **Iframe/standalone** apps
(their own document — the security boundary for untrusted apps) include the SDK bootstrap
`@proveanything/smartlinks/theme-boot.js` in `<head>` (inline is best — zero flash):

- **Boot (before first paint):** reads the initial state from the URL fragment
  `#slt=<base64url(JSON)>` (`{ tokensVersion, values, theme, contrast, fontScale, lang }`), plus
  convenience params `?theme=&contrast=&fontScale=&lang=`, and applies it to `:root` synchronously.
  This *replaces* the legacy base64-17-keys scheme — same idea (correct on first paint), but a
  structured, versioned payload.
- **Live:** applies generic root-state updates the host posts as
  `{ type: 'smartlinks:root-state', values?, theme?, contrast?, fontScale?, lang?, attrs? }`. This is
  what makes accessibility toggles instant. The app carries none of this logic — the bootstrap is
  generic and SDK-owned; the app only wrote CSS.

Payload stays small (the reason the fixed vocabulary matters): the token set + a handful of mode keys
fit comfortably in a URL fragment, no compression needed.

---

## 7. Versioning

- `themeTokens: "vN"` — the version an app targets.
- Within a version: additive only (new tokens get fallbacks). Never remove a token in-version.
- A removal/rename → `v(N+1)`, `vN` retained; hosts may serve several; apps declare which they target.
- Surfaces declare their honoured subset; the "mapping" between Hub and Portal is *which keys each
  honours*, not a translation layer.

## 8. Change log

- **v1 (draft, 2026-09-23):** initial semantic core (12) + extended (optional) set; value-set schema;
  host mount-root scoping; manifest declaration + doctor warn; viewer-pref/accessibility hooks
  (`.dark`/`data-theme`, `data-contrast`, `--sl-font-scale`, `lang`, native `prefers-*`); iframe
  `theme-boot.js` (URL-boot + generic live root-state); brand change = reload, prefs = live.
