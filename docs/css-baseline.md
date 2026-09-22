# SmartLinks CSS baseline (`sl-baseline`)

> **Status: SHIPPED — `v1`, frozen.** The SDK ships `@proveanything/smartlinks/baseline.css`
> (+ `baseline.classes.json`); the Portal/Hub serve it and apps opt in via
> `meta.cssBaseline: "v1"`. `v1` is frozen: an existing `sl-*` rule's meaning never changes;
> new capability ships as `v2` alongside. Supersedes the earlier "shared Tailwind base" idea —
> that approach (sharing raw generated Tailwind) was too large and could never safely change;
> this is the version that survives being frozen for years.

A small, **frozen, namespaced** set of structural CSS helpers the platform guarantees are
present, so any sub-app — and any AI/markdown/dynamic content renderer inside one — can rely
on them. It is **mechanics, not aesthetics**: layout, spacing, sizing, type scale,
responsive flow, radius/border/shadow, and a little motion. It never defines colours, fonts,
or components — those are brand data and per-app.

It is the CSS sibling of the JS shared-dependency contract, and like that contract **the SDK
is the source of truth**: the SDK authors and ships the baseline; hosts and apps consume it.

## Why this shape (and not the alternatives)

- **Small + frozen** → maintainable for years. A 60–120-rule hand-authored contract can be
  honoured indefinitely; a giant generated Tailwind sheet can't.
- **Namespaced (`sl-`)** → zero collision with an app's own Tailwind (`flex`, `p-4`) or the
  host. Apps use `sl-*` for the guaranteed floor *and* their own utilities side by side. This
  is what removes the cascade/coexistence fragility.
- **A stable contract, decoupled from Tailwind underneath** → the SDK may build it with
  Tailwind 4/5/6 internally, but apps target `sl-*`, so Tailwind upgrades are free.
- **Teachable** → ~100 stable primitives can be put in an AI prompt; the full Tailwind
  surface cannot. Dynamic/AI content gets a guaranteed floor instead of hand-rolling CSS.
- **A floor, not a ceiling** → opt-in, additive; apps are free to ignore it or write their
  own CSS. It just guarantees a consistent structural baseline when they want it.

## Responsive: container-query-backed, breakpoint-named

Apps render **both** as containers (in the host document) and as iframes. Plain viewport
`@media` is inconsistent across those — in an iframe it sees the iframe size (usually right),
in a container it sees the *host* viewport (wrong for a sub-region). So the responsive
primitives are **container-query based** (`@container`), exposed with familiar breakpoint
names so authors/AI still think "phone / tablet / desktop":

- The app's mount root is a **container context** (`sl-container`, i.e. `container-type:
  inline-size`) — set by the host on container mounts and by the app root in iframe mode.
- `sl-md-grid-2` then means "when **my** box is ≥ tablet width", correct in both embed modes.
- Breakpoints (container widths): `sm` ≥ 480px, `md` ≥ 768px, `lg` ≥ 1024px.

This is the "works well on mobile / tablet / desktop" house opinion, done correctly for an
embed-first platform.

## The v1 surface (frozen)

All names `sl-`-prefixed. Responsive variants exist only for the layout-flow primitives
marked ✦ (as `sl-{sm|md|lg}-<name>`), to keep the set teachable and small.

**Reset & a11y**
`sl-reset` (border-box + margin:0 on self/descendants) · `sl-media` (max-width:100%,
height:auto) · `sl-focus` (keyboard-only focus ring) · `sl-sr-only` · `sl-container`
(responsive container context)

**Display ✦** `sl-block` · `sl-inline-block` · `sl-inline` · `sl-flex` · `sl-inline-flex` ·
`sl-grid` · `sl-hidden`

**Flex ✦(direction)** `sl-flex-row` · `sl-flex-col` · `sl-flex-wrap` · `sl-flex-nowrap` ·
`sl-items-{start,center,end,stretch,baseline}` · `sl-justify-{start,center,end,between,around}`
· `sl-flex-1` · `sl-flex-auto` · `sl-grow-0` · `sl-shrink-0`

**Grid ✦(columns)** `sl-grid-{2,3,4}` (collapse to 1 col below `sm`) · `sl-grid-auto`
(auto-fit minmax) · `sl-col-span-full`

**Spacing** — curated 8-step scale `0,1,2,3,4,5,6,7` ≈ `0, .25, .5, .75, 1, 1.5, 2, 3 rem`.
Logical properties (RTL-safe): `sl-gap-{0..7}` · `sl-p-{0..7}` · `sl-px-{0..7}` ·
`sl-py-{0..7}` · `sl-ps-{0..7}` / `sl-pe-{0..7}` (inline start/end) · `sl-m-{0..7}` ·
`sl-mx-auto` · `sl-mt-{0..7}` · `sl-mb-{0..7}`

**Sizing** `sl-w-full` · `sl-h-full` · `sl-min-w-0` · `sl-max-w-{reading(42rem),prose(65ch),
page(72rem)}` · `sl-aspect-{square,wide(16/9)}`

**Typography** — static rem scale (predictable in any embed; use the responsive `✦` align
and per-breakpoint sizing where you want type to change). `sl-text-{xs,sm,base,lg,xl,2xl,3xl,
4xl}` · `sl-font-{normal,medium,semibold,bold}` · `sl-leading-{tight,normal,relaxed}` ·
`sl-tracking-{tight,normal}` · `sl-text-{left,center,right}` ✦(align) · `sl-truncate` ·
`sl-line-clamp-{2,3}` · `sl-balance` (text-wrap:balance) · `sl-pretty`

**Radius / border / shadow** — neutral mechanics only (no brand colour). `sl-rounded-{sm,md,
lg,xl,full}` · `sl-border` / `sl-border-0` (colour = `--sl-border`, a subtle
`color-mix(currentColor 14%, transparent)` default, overridable) · `sl-shadow-{sm,md,lg}`
(neutral)

**Object-fit / overflow** `sl-cover` · `sl-contain` · `sl-overflow-hidden` · `sl-overflow-auto`

**Position & layering** `sl-relative` · `sl-absolute` · `sl-sticky` · `sl-inset-0` ·
`sl-z-{base,raised,overlay}` (named levels — a house layering convention so apps don't fight
over z-index)

**Motion** (small, reduced-motion-safe; keyframes are `sl-`-namespaced) `sl-transition`
(standard ease/duration) · `sl-reveal` (fade-up on view) · `sl-hover-lift` · all motion is
**disabled under `prefers-reduced-motion`**. Rich motion vocabularies stay per-app (and may
become a separate versioned motion contract later if several apps want to share one).

### Explicitly NOT in the baseline (non-goals)
- **No colours** — brand data, delivered via CSS variables / theme params.
- **No fonts** — per-app; the baseline sets a *scale*, never a family.
- **No components** — no buttons/cards/nav; those are per-app aesthetics.
- **No full utility surface** — anything bespoke ships in the app's own scoped CSS.

## Delivery — one SDK source, two paths

The SDK ships the compiled baseline as `@proveanything/smartlinks/baseline.css` (+ the
machine-readable class list for the doctor). One authored source; two delivery mechanisms:

| Embed mode | How the app gets it |
|---|---|
| **Container (ESM/UMD)** — same document as host | Host has already loaded `baseline.css`; the app **ships nothing** and just uses `sl-*`. Declares `meta.cssBaseline: "v1"`. |
| **Iframe** — its own document | The app **imports the SDK's `baseline.css`** into its own document (it inherits nothing, exactly like it must carry its own modules). Byte-identical to the host copy. |

Cascade: baseline loads first; app CSS after → app rules win ties. `sl-*` never collides with
app utilities regardless.

## SDK / build support (kept minimal — no CSS surgery)
- The SDK **exports `baseline.css`** (and `baseline.classes.json`), built in the SDK's own
  build so the file and the class list can't drift.
- Manifest field **`meta.cssBaseline: "v1"`** — declares reliance so the host can guarantee
  it's present.
- `smartlinks-doctor`: warn if an app declares `cssBaseline` but uses an `sl-*` class outside
  the declared version (the useful invariant — spirit of the JS import check). No subtraction
  tooling needed: `sl-*` is a fixed vocabulary apps just use.

## Versioning & freeze
- `v1` is **frozen**: an existing `sl-*` class's meaning/output never changes in place.
- New capability ships as `v2` **alongside** `v1` (both served), never a silent mutation.
- Tailwind (or whatever builds it) may be upgraded underneath as long as the `sl-*` contract
  keeps its meaning.
- Governance: additions to the surface go through review (it's a decades-long contract);
  err toward *stable and generous* over minimal, since the AI builders target it.
