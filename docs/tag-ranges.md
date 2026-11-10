# NFC tag ranges and partners

For partners and enterprise clients who run their own tag programmes: mint a batch of tags, send them
to a manufacturer with instructions, get the chip UIDs back, then put the tags to work for a client or
product. Ordinary business collections don't use this.

## The words

| Word | Means |
|---|---|
| **Claim set** | A pool of codes on one tap domain and one tag type (NTAG 424 DNA, NTAG 213/215/216, or QR). Most partners need one. |
| **Range** | A named, contiguous block of tags inside a set: "Tap to donate - February", 100 tags, indexes 201-300. |
| **Index** | A tag's place in its set. Ranges never overlap and indexes are never reused. |
| **Partner** | An organisation above collections that owns sets and assigns their tags into collections its people administer. Set up by SmartLinks staff. |

## Who can do what

`scope` is `{ partnerId }` for a partner's sets, or `{ collectionId }` for a collection's own sets.

| Role | Can |
|---|---|
| Partner owner / admin, or a collection admin | Make sets, mint ranges, download the printer file and instructions, import UIDs, program tags, assign |
| Partner assigner | See ranges and tags (never keys), assign |

Assigning always needs you to be an admin of the collection the tags go to.

## The flow

```ts
import { partner, claimSet } from '@proveanything/smartlinks'

const [p] = await partner.list()                       // the partners you belong to
const scope = { partnerId: p.id }
const [set] = await partner.claimSets(p.id)            // or partner.createClaimSet(p.id, { name, tagType: 'ntag424', tapDomain })

// 1. Mint
const range = await claimSet.ranges.create(scope, set.id, { name: 'Tap to donate - February', quantity: 100 })

// 2. Send to print: the CSV (carries each tag's key) and the instruction sheet
const file = await claimSet.ranges.exportFile(scope, set.id, range.id)          // { filename, csv }
const sheet = await claimSet.ranges.instructions(scope, set.id, range.id, 'pdf') // { filename, base64 }
await claimSet.ranges.update(scope, set.id, range.id, { stage: 'sent', manufacturer: 'Print Co', orderRef: 'PO-123' })

// 3. Receive: the manufacturer sends back the same file with UID filled in
const check = await claimSet.ranges.importUids(scope, set.id, range.id, { csv: returnedCsv })
// check.rows: ok / index_mismatch / bad_uid / uid_in_use / … ; nothing written yet
await claimSet.ranges.importUids(scope, set.id, range.id, { csv: returnedCsv, commit: true })

// 4. Assign all of it, or from-to
await claimSet.ranges.assign(scope, set.id, range.id, { collectionId: 'reading-fc', productId: 'scarf', start: 201, end: 250 })
```

**Programming on a phone instead of a manufacturer** (Sidekick): `ranges.next()` gives the lowest
tag without a chip, with its URL and key; write it, then `ranges.recordTag(scope, set.id, range.id, code, { uid })` (add `password` for a plain tag's write password).

To find where a chip or code went, `partner.lookupTags(partner.id, { uid })` or `{ code }` searches every set the partner owns and returns each hit's set, tag and range, never a key.

## Open ranges and groups

A range's count is fixed when it is minted. Two phone-side jobs don't know their count in advance, so a range
has a `kind`:

- **`open`**: blank tags programmed on Sidekick one at a time. `ranges.create(scope, set.id, { kind: 'open', name })`
  reserves only a start index; each `ranges.next()` hands back a free minted code or mints one more, so
  `quantity`/`endIndex` grow as tags are written (`remaining` is null). One open range per set, and nothing can
  be minted behind it (`409 RANGE_OPEN`) until `ranges.close(scope, set.id, range.id)` turns it into an ordinary
  range (an open range that minted nothing is removed instead).
- **`group`**: tags that already exist, added by tapping, assigned by hand, and moved together later. Assigners may
  make one: `ranges.create(scope, set.id, { kind: 'group', name, intendedCollectionId? })`. Each tap goes through
  `ranges.addMember(scope, set.id, group.id, { code | uid, collectionId, productId? })`, which stamps the tag with
  the group and assigns it with the single-tag rules; `assigned.skipped` says when a tag was left alone (claimed,
  or in a collection you don't administer). `ranges.assign(scope, set.id, group.id, { collectionId })` moves every
  member in one go; `ranges.removeMember` takes one out. Groups have no printer file, instructions, import or
  `next` (`400 NOT_A_RANGE`). Its tags must be codes of the group's set; a chip that is a code elsewhere is
  `409 OTHER_SET`.

Status reads `open` or `group` for these (and `assigned` once every member of a group is assigned).

## The printer file

One row per tag, in index order. The manufacturer fills in `UID` and sends the same file back; rows are
matched by `Code`, and `Index` is checked.

| Tag type | Columns |
|---|---|
| NTAG 424 DNA | `Index, Code, URL, PiccOffset, Key, UID` |
| NTAG 213/215/216 | `Index, Code, URL, MirrorOffset, MirrorPage, MirrorByte, UID` |
| QR | `Index, Code, URL` |

`URL` is `https://{tap domain}/t/{set}/{code}` plus the placeholder the chip fills on every read
(`?p=` + 32 zeros for 424 SUN, `?m=00000000000000x000000` for the 21x UID and counter mirror). The
offsets are byte positions in the NDEF data, assuming the `https://` URI prefix code and a short record.

## Notes

- Range responses are never cached by the SDK: tags change as they're programmed and several carry keys.
- A tag bound to a proof (minted or claimed) is never moved or cleared by `assign`; it's reported in `skipped`.
- `status` is the stage (`minted`, `sent`, `received`), or `assigned` once every tag is assigned.
