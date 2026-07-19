# Item Context (container prop)

> **Copy this file into `node_modules/@proveanything/smartlinks/docs/item-context.md`** in the published SDK package.

When the URL points at a specific item — either a **serial proof URL** or an
**NFC tap** — the portal derives an `ItemContext` describing what it found
and hands it to the container as the **`itemContext`** prop.

For collection- and product-only URLs there is no item to describe, so
`itemContext` is `undefined`. Sub-apps that don't care about authenticity
can simply ignore the prop.

The prop is named `itemContext` (not `item`) to make clear it's *context
about the item*, not the item record itself. The underlying record is
passed separately via `proof`, `product` and `collection` props.

```tsx
export default function MyContainer({ itemContext, collection, product, proof }) {
  if (!itemContext) {
    // Collection or product view — nothing to verify.
    return <BrowseView collection={collection} product={product} />;
  }
  if (itemContext.isAuthentic) {
    return <RealContent proof={proof} />;
  }
  if (itemContext.status === 'not-found' || itemContext.status === 'invalid') {
    return <NotGenuine message={itemContext.errorMessage} />;
  }
  // status === 'error' — transport failure
  return <TransientError message={itemContext.errorMessage} />;
}
```

---

## Shape

```ts
interface ItemContext {
  /** True only for `valid` and `rescan`. Read this for the simple case. */
  isAuthentic: boolean;

  status:
    | 'valid'        // genuine
    | 'rescan'       // genuine, but this exact NFC tap has been seen before
    | 'invalid'      // SDK rejected the NFC payload (bad crypto)
    | 'not-found'    // identifier well-formed but 404
    | 'error';       // transport / network failure — cannot tell

  source: 'nfc' | 'serial';

  /** Set for `invalid` / `not-found` / `error`. Safe to display. */
  errorMessage?: string;

  /** True when SDK reports this exact NFC tap was seen before. */
  isRescan?: boolean;

  /** Full NFC payload (SUN counter, tagId, claimSetId, codeId, mirror…). Present only when source === 'nfc'. */
  tag?: TagContext;

  /** Epoch ms when the check was derived. */
  checkedAt: number;
}
```

Also exported from `@proveanything/smartlinks` as `ItemContext` /
`ItemContextStatus` (`src/types/itemContext.ts`). The nested `TagContext`
shape is unchanged (`src/types/nfc.ts`).

## When `itemContext` is present

| URL points at                                  | itemContext         |
| ---------------------------------------------- | -------------------- |
| Collection root                                | `undefined`          |
| Product page (no proof)                        | `undefined`          |
| Serial proof URL (any outcome)                 | present, source `serial` |
| NFC tap (any outcome)                          | present, source `nfc`    |

## Status matrix (when present)

| Situation                                             | source   | status        | isAuthentic |
| ----------------------------------------------------- | -------- | ------------- | :---------: |
| Fresh NFC tap, SUN counter validated                  | `nfc`    | `valid`       | ✅          |
| Same NFC tap replayed / refresh                       | `nfc`    | `rescan`      | ✅          |
| NFC payload rejected (bad crypto / bad params)        | `nfc`    | `invalid`     | ❌          |
| Serial proof URL, proof fetched OK                    | `serial` | `valid`       | ✅          |
| Serial proof URL, proof returned 404                  | `serial` | `not-found`   | ❌          |
| Network / 5xx while resolving proof or NFC            | (either) | `error`       | ❌          |

`isAuthentic === (status === 'valid' || status === 'rescan')`.

## How it's delivered

**Direct-mounted containers** (default public mode):

```tsx
type Props = {
  collection: Collection;
  product?: Product;
  proof?: Proof;
  itemContext?: ItemContext;     // ← only when URL targets a specific item
  // …plus the normal navigation / theme / auth props
};
```

NFC-aware apps that need the raw SUN / tag payload read `itemContext.tag`.

**Iframe containers**: the portal serialises `ItemContext` to JSON, base64-
encodes it (UTF-8 safe) and appends it as an `itemContext` query param on
the iframe URL — omitted entirely when there is no item context:

```ts
function readItemContext(): ItemContext | undefined {
  const raw = new URLSearchParams(location.search).get('itemContext');
  if (!raw) return undefined;
  try { return JSON.parse(decodeURIComponent(escape(atob(raw)))); }
  catch { return undefined; }
}
```

## Guarantees

- `itemContext` is present on every container mount whose URL targeted an
  item (proof or NFC tap). Absent otherwise.
- `SL.nfc.validate` is called at most once per `(claimSetId, codeId)` per
  browser session — SUN counters are never double-consumed on refresh.
- SSR uses `SL.nfc.lookupTag` (non-consuming) only.
- `isAuthentic === true` implies the SDK either validated an NFC payload
  or returned a full proof document. It is never inferred from URL shape.
- The portal will **not** render its full-page error surface for a 404 on
  a proof — that surfaces as `status: 'not-found'` on `itemContext`, and
  the container is still mounted so it can present the message its own way.

## What containers should do

| Status        | Recommended UI                                                    |
| ------------- | ------------------------------------------------------------------ |
| `valid`       | Full experience. Show ownership, actions, etc.                    |
| `rescan`      | Same as `valid`, optionally with a subtle "seen before" hint.     |
| `invalid`     | Clear "this doesn't look genuine" message. Do NOT reveal data.    |
| `not-found`   | "We don't recognise this item." Offer a link home.                 |
| `error`       | Neutral "couldn't verify right now." Offer retry.                  |
| _absent_      | Standard browse UI. Don't mention authenticity at all.             |

## Gating UX with conditions

Sub-apps should standardize on passing `itemContext` into `validateCondition()`
and gating with `itemStatus` — the same condition type already used for
claim/virtual checks, extended with authenticity `statusType`s that read
`itemContext` instead of `proof`:

```ts
import { validateCondition } from '@proveanything/smartlinks';

const showFakeWarning = await validateCondition({
  condition: {
    conditions: [{ type: 'itemStatus', statusType: 'invalidProof' }],
  },
  itemContext, // the prop delivered to the container
});
```

- `isAuthentic` — passes when `itemContext.isAuthentic` is true (`valid`/`rescan`)
- `notAuthentic` — passes when an `itemContext` was resolved but isn't authentic (`invalid`/`not-found`/`error`)
- `invalidProof` — passes specifically when resolution was attempted and came back `invalid` or `not-found` — the "someone scanned a fake tag / typed a bad serial" case, as distinct from `noProof` ("nothing was on the URL to check at all")
- `isFirstScan` — the single "this is good, show the full experience" check: authentic AND this is the first time it's been seen (`status === 'valid'`)
- `isRescan` — authentic but a duplicate/replayed tap (`status === 'rescan'`) — use this to suppress "first scan" celebration UX without treating the tag as fake; `isAuthentic` alone is true for both `isFirstScan` and `isRescan` cases

## Deprecated

The old top-level `tag` prop (`TagContext`) is still forwarded for one
release for backward compatibility with scanner-aware apps that read raw
SUN data. New code should read `itemContext.tag` and treat `itemContext`
as the source of truth.

## Note on terminology

Today the SDK still uses `proof` for a specific item record (a serialised
instance of a product). "Item record" is under consideration as a clearer
name — no API changes are planned imminently, but a future SDK version may
support both `proof`- and `item record`-shaped names for the same
functions/types side by side. `itemContext` is deliberately future-proof:
it describes context about whatever the URL points at, regardless of what
we ultimately call the record itself.
