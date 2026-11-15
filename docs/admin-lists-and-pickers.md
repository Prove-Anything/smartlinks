# Lists an admin edits: value lists, set-up types and pickers

Most apps have lists the business keeps up to date: the machines on a floor, the desks in a room,
hold reasons, teams. This page says where each kind lives and how a screen picks from it quickly.
Design note: `prove/server/docs/design/admin-lists-and-pickers.md`.

## Which home

Ask in order; the first yes wins.

| Question | Home |
|---|---|
| Is it something SmartLinks already has (contacts, products, work orders, stock, bookings)? | That object. Don't redeclare it; point at it with a `ref` field |
| Is there one of it per collection (or product, variant, batch)? | **Settings**: `SL.appConfiguration.getConfig` / `setConfig` |
| Does your code branch on the values (`if (stage === "filling")`)? | A **fixed enum**: `"type": "enum", "options": [...]`, changed by a release |
| Is it just values the admin adds, renames, reorders or switches off? | A **value list**: `data.lists`, picked by `"type": "enum", "list": "<id>"` |
| Does each entry have its own fields or point at other things? | A **set-up type**: app records of a declared type |

Don't keep lists of things in keyed app data (`getData` / `setData`): it has no type, no search and
no checks, and it is being retired. Use a set-up type.

## Value lists

Declare the list and its starting values in the manifest's `data` block. An `enum` field picks from
it with `list` instead of `options`:

```jsonc
"data": {
  "schemaVersion": "1.0.0",
  "lists": {
    "hold-reasons": {
      "label": "Hold reasons",
      "values": [
        { "code": "awaiting-components", "label": "Awaiting components" },
        { "code": "customer-query", "label": "Customer query" }
      ]
    }
  },
  "types": {
    "accord.job": {
      "fields": { "holdReason": { "type": "enum", "list": "hold-reasons", "label": "Hold reason" } }
    }
  }
}
```

- A record stores the value's **code**; screens show its label. Codes never change.
- The manifest's values are used until the admin first saves the list. After that the list is the
  collection's.
- **Values are never deleted.** A value the admin leaves out is kept, switched off, so records that
  carry it still show its label. Saving checks that codes are unique.
- `"editable": false` makes a list the app's alone (changed by a release). `"public": true` lets the
  public API read it; otherwise only admins and server code can.

Save a list (admins): `SL.app.options.saveList(collectionId, appId, 'hold-reasons', [{ code, label, active }])`.

## Set-up types

A set-up type is an ordinary declared type (`storage: { kind: 'record' }`) with a few extra keys:

| Key | Meaning |
|---|---|
| `label` | The field pickers show. Default `label`, then `name`, then `title` |
| `sublabel` | A field shown as the second line (a machine's stage) |
| `activeField` | A boolean field; `false` switches the entry off. Default: the record's status (`inactive` / `archived` = off) |
| `orderField` | A number field to sort by. Default `sortOrder`, then `order`, then the label |
| `small` | Dozens to hundreds of entries: `ctx.sl.appRecords.all` reads them from cache |
| `setup` | A list the admin keeps: Studio will draw a list and form for it. Implies `checked` |
| `checked` | Saves are checked against the declared fields |

```jsonc
"accord.machine": {
  "description": "A machine on the production floor.",
  "storage": { "kind": "record", "recordType": "machine" },
  "visibility": "admin",
  "label": "name", "sublabel": "stage", "activeField": "isActive",
  "small": true, "setup": true,
  "fields": {
    "name": { "type": "string", "label": "Name", "required": true },
    "stage": { "type": "enum", "options": ["Decoration", "Filling", "Packaging", "Wrapping"] },
    "outputPerMinute": { "type": "number", "label": "Output per minute" },
    "isActive": { "type": "boolean" }
  }
}
```

**Checks on save.** For a `checked` (or `setup`) type, a create or update whose data doesn't match is
refused with `400 INVALID_RECORD` and a `problems` list (`{ field, message }`), all problems at once:
wrong value types, missing required fields, an `enum` value not in its options or list, a `ref` to one
of the app's own types that names no live record. Fields you don't declare are left alone. Types
that aren't checked are never checked.

## Pickers: one call

```ts
// In any screen
const res = await SL.app.options.get(collectionId, appId, 'type:accord.machine', { admin: true })
const res = await SL.app.options.get(collectionId, appId, 'list:hold-reasons', { admin: true })
// → { items: [{ id, label, sublabel?, active, order }], version, mode: 'all' }

// In server code (needs sl:records:read)
await ctx.sl.appOptions.get('list:hold-reasons')
```

- `source` is `type:<declared type id or record type>` or `list:<list id>`.
- Entries carry only id, label, second line, on/off and order, never the record's data. They come
  sorted. For a list, `id` is the value's code.
- **Switched-off entries come back too** (`active: false`). Hide them for new choices; keep showing
  the label on records that already carry them.
- **Cached.** Saved, deleted and restored records clear their type's entry at once. Hold on to
  `version` and pass it back (`{ version }`); if nothing changed you get `{ unchanged: true, version }`.
- **Large types.** A type with more than 2,000 entries answers `mode: 'search'` with no items; pass
  `q` and it answers the first 50 whose label contains it.
- **Who sees what.** `admin: true` (the admin API) lists everything. The public API lists public
  records, and lists declared `public`.

## Every record of a type, with its data

Server code that needs the fields as well (the capacity check reads every machine's rate):

```ts
const machines = await ctx.sl.appRecords.all('machine')   // or 'accord.machine'
```

Up to 5,000 records, oldest first; more is refused (`TOO_MANY`), so page with `query`. Read from cache
for `small` types, cleared on every write. Admin authority sees every record; other callers see the
public ones.

## Testing

`createFunctionTestContext` has both calls in memory. Records follow the default conventions; lists
come from the `valueLists` option:

```ts
const ctx = createFunctionTestContext({
  def,
  valueLists: { 'hold-reasons': [{ code: 'customer-query', label: 'Customer query' }] },
})
```
