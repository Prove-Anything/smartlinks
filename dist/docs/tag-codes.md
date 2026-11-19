# Tag codes: attaching a scanned tag to an asset

`SL.tagCodes` lets an admin app (Core Assets, Sidekick, a custom app) work with the tags on a collection's
things: what a scanned tag is, putting it on an asset, and taking it off. The same three calls work for
every claim-set tag:

- **printed QR codes from a computed claim set**: bought runs, and codes a business prints itself;
- **NFC tags and older QR sets**, whose codes are stored.

An *asset* is a proof; its *asset type* is the proof's product. Design note: prove
`server/docs/design/asset-tags-and-printed-codes.md`.

## The calls

```ts
import * as SL from '@proveanything/smartlinks'

// What was scanned: the address on the tag (or { claimSetId, code })
const tag = await SL.tagCodes.lookup(collectionId, { url: 'https://atag.co/4fK2qPx' })
// → { claimSetId, code, url, computed: true, tagType: 'qr', status: 'free' }

await SL.tagCodes.attach(collectionId, { url, productId: 'bed-sb755', proofId: 'bed14' })
// → { …, status: 'attached', productId: 'bed-sb755', proofId: 'bed14' }

await SL.tagCodes.detach(collectionId, { url })
// → { …, status: 'free', proofId: null }
```

`status`:

| Status | Meaning |
|---|---|
| `free` | not on anything; this collection may attach it |
| `attached` | on one of this collection's assets (`productId`, `proofId` say which) |
| `elsewhere` | another organisation's tag; nothing more is shown |

## The rules

- Admins of the collection only.
- Refused with `OTHER_ORGANISATION` when the tag's set belongs to another collection, or the run it's in was
  sold to another collection.
- Refused with `ASSIGNED_ELSEWHERE` when the tag is already in use by another collection.
- Refused with `ALREADY_ATTACHED` when it's on another asset: `detach` first.
- After `attach`, scanning the tag opens the asset's page.

## Computed claim sets (for whoever makes tags)

A claim set created with `codeSource: 'computed'` (QR only) stores nothing per code: each code is worked out from
its index with a signature (24 bits by default, `sigBits` 16 to 32). A run in such a set can hold up to
1,000,000 tags. Its printer file downloads in parts:

```ts
await SL.claimSet.ranges.exportFile(scope, claimSetId, rangeId, { from: 1, to: 200000 })
```

A computed set with `bareCodes: true` answers bare codes on its tap domain: `https://{domain}/{code}`.
Each domain has at most one such set. Assigning a **whole** computed run to a collection
(`ranges.assign` without `start`/`end`) is one write on the range, however many tags it holds; the response
says `wholeRange: true`.
