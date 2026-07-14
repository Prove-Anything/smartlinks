# Data Scoping for Products and Proofs

Canonical specification for how custom data is stored, who can read it, and who can write it — on both **products** and **proofs**.

Applies to the SmartLinks SDK, admin apps, public apps, and any consumer of the platform API.

---

## Design principles

1. **Fixed named fields at the root; flexible data in JSON bags.** The root of a product or proof is reserved for typed, first-class columns (name, image, gtin, ownerId, claimable, …). Everything custom lives inside a JSON bag.
2. **Every bag is defined by *who can write and read* it, and lives at the top level.** Write authority and read visibility are hard, server-enforced boundaries. Rather than hide them under sub-keys, each combination gets its own top-level bag. This matches the existing `product.admin` convention and keeps read-time filtering trivial: the server either returns a bag or it doesn't.
3. **Public is the default; admin is opt-in.** Anything in `data` is world-readable. Anything private to the business goes in `admin`, which the server never returns to a non-admin caller.
4. **Same shape everywhere.** Products and proofs share the same rules for the business-writable bags (`data`, `admin`). Proofs add a third top-level bag — `values` — for owner-writable and per-user data, because proofs have an owner and products don't.

---

## The schema

### Product

```
product.<rootColumns>      // typed columns: name, description, image, gtin, …

product.data  = { … }      // PUBLIC        → read: everyone,       write: business
product.admin = { … }      // BUSINESS-ONLY → read: business,       write: business
```

### Proof

```
proof.<rootColumns>        // typed columns: id, productId, ownerId, claimable, …

proof.data  = { … }        // PUBLIC        → read: everyone,       write: business
proof.admin = { … }        // BUSINESS-ONLY → read: business,       write: business

proof.values = {           // consumer bag — owner + business-writable
  <anyKey>: …,              // PUBLIC        → read: everyone,
                             //                write: business + current owner
  owner: { … },              // OWNER-SCOPED  → read: business + current owner,
                             //                write: business + current owner,
                             //                transfers with ownership
  personal: {                // PER-USER      → read/write: only the specific user,
    [userId]: { … },          //                not visible to the next owner
  },
}
```

Products intentionally have no `values` bag — there is no owner to write it. If a product ever needs owner-like data, that data belongs on the proof.

---

## Reserved sub-key names

Inside `proof.values`, these keys are reserved and MUST NOT be used as free-form public field names:

| Bag           | Reserved keys              |
| ------------- | --------------------------- |
| `proof.values`| `owner`, `personal`        |

`data` and `admin` bags have no reserved sub-keys — everything inside them is flat.

The field-config editor and SDK write helpers MUST reject attempts to create top-level public fields in `proof.values` named `owner` or `personal`.

---

## Who reads what (visibility matrix)

| Location                          | Public / Anonymous | Authenticated (non-owner) | Current Owner | Business Admin |
| --------------------------------- | :-----------------: | :------------------------: | :------------: | :--------------: |
| `product.<root>`                  |         ✅          |             ✅             |       ✅       |        ✅       |
| `product.data.*`                  |         ✅          |             ✅             |       ✅       |        ✅       |
| `product.admin.*`                 |         ❌          |             ❌             |       ❌       |        ✅       |
| `proof.<root>`                    |         ✅          |             ✅             |       ✅       |        ✅       |
| `proof.data.*`                    |         ✅          |             ✅             |       ✅       |        ✅       |
| `proof.admin.*`                   |         ❌          |             ❌             |       ❌       |        ✅       |
| `proof.values.<publicKey>`        |         ✅          |             ✅             |       ✅       |        ✅       |
| `proof.values.owner.*`            |         ❌          |             ❌             |       ✅       |        ✅       |
| `proof.values.personal[me].*`     |         ❌          |     ✅ (own slot only)     | ✅ (own slot)  | ❌ (see note)   |
| `proof.values.personal[other].*`  |         ❌          |             ❌             |       ❌       | ❌ (see note)   |

> **Note on `personal`:** the default rule is that `personal` slots are readable *only* by the user whose `userId` matches the slot key — not even business admins. If the platform ever needs an admin-visible variant, it should be a separate mechanism, not a relaxation of this rule.

## Who writes what (authority matrix)

| Location                          | Public / Anonymous | Authenticated (non-owner) | Current Owner | Business Admin |
| --------------------------------- | :-----------------: | :------------------------: | :------------: | :--------------: |
| `product.<root>`                  |         ❌          |             ❌             |       ❌       |        ✅       |
| `product.data.*`                  |         ❌          |             ❌             |       ❌       |        ✅       |
| `product.admin.*`                 |         ❌          |             ❌             |       ❌       |        ✅       |
| `proof.<root>` (spec)             |         ❌          |             ❌             |       ❌       |        ✅       |
| `proof.data.*`                    |         ❌          |             ❌             |       ❌       |        ✅       |
| `proof.admin.*`                   |         ❌          |             ❌             |       ❌       |        ✅       |
| `proof.values.<publicKey>`        |         ❌          |             ❌             |       ✅       |        ✅       |
| `proof.values.owner.*`            |         ❌          |             ❌             |       ✅       |        ✅       |
| `proof.values.personal[me].*`     |         ❌          |     ✅ (own slot only)     |  ✅ (own slot) |        ❌       |

All read and write rules are **server-enforced**. Clients MUST NOT rely on UI hiding alone.

---

## Worked examples

### A bicycle

```jsonc
// product (the model)
{
  "id": "prod_road_2024",
  "name": "Aero Road 2024",
  "image": "…",
  "data": {
    "frameMaterial": "carbon",           // public
    "wheelSize": "700c",                 // public
    "purchaseLink": "https://…"          // public
  },
  "admin": {
    "internalSku": "AR24-CARB-M",        // business-only
    "unitCost": 1420,                    // business-only
    "manufacturingSite": "Taichung"      // business-only
  }
}

// proof (a specific bike)
{
  "id": "proof_abc123",
  "productId": "prod_road_2024",
  "ownerId": "user_42",
  "claimable": false,
  "data": {
    "serial": "SN-000123",               // public spec, business-set
    "colour": "matte black",             // public spec, business-set
    "year": 2024                         // public spec, business-set
  },
  "admin": {
    "warrantyExpiry": "2027-06-01",      // business-only
    "batchId": "B-2024-Q2-17"            // business-only
  },
  "values": {
    "nickname": "Midnight",              // public, owner-editable
    "displayNote": "For sale — DM me",   // public, owner-editable
    "owner": {
      "purchasedAt": "Halfords Oxford",  // business + current owner, transfers
      "serviceHistory": [ /* … */ ]      //   with ownership
    },
    "personal": {
      "user_42": {
        "combinationLock": "17-04-88",   // only user_42 ever sees this
        "privateNotes": "…"
      }
    }
  }
}
```

### Liquid template ergonomics

```liquid
{{ product.name }}                              {# root column #}
{{ product.data.purchaseLink }}                 {# public #}
{{ product.admin.internalSku }}                 {# admin surfaces only #}

{{ proof.data.colour }}                         {# public spec #}
{{ proof.admin.warrantyExpiry }}                {# admin surfaces only #}
{{ proof.values.nickname }}                     {# public, owner-editable #}
{{ proof.values.owner.purchasedAt }}            {# owner-scoped #}
{{ proof.values.personal[currentUserId].combinationLock }}
```

---

## Legacy compatibility

The new shape is **strictly additive**. No existing data needs to move.

- **`product.data.<key>`** — legacy flat keys continue to mean "public". No migration.
- **`product.admin.<key>`** — already exists today; formalised here as the canonical private-business bag.
- **`proof.values.<key>`** — legacy flat keys continue to mean "public, owner-editable". No migration.
- **`proof.data`** — new bucket, added alongside the existing `proof.values`, for public business-owned spec that isn't consumer-editable.
- **`proof.admin`** — new bucket, mirroring `product.admin`.
- **`owner` / `personal`** — reserved going forward inside `proof.values`. Any pre-existing custom field literally named `owner` or `personal` should be renamed on a case-by-case basis. New writes MUST reject these as free-form key names.

Legacy apps that only read the flat public shape continue to work unchanged. New apps that need scoped data opt in by reading and writing the new bags and reserved sub-keys.

---

## SDK guidance

- **Reads** return whatever bags the caller is entitled to. Callers MUST NOT assume `admin`, `values.owner`, or `values.personal` are present.
- **Writes** to `admin` bags, `proof.data`, and `proof.values.owner` require the appropriate role; the server rejects unauthorised writes with a permission error rather than silently dropping keys.
- **Field-config editors** (custom-fields UIs on collection settings) should:
  - Offer a **scope** dropdown per field. Products: `Public` (→ `product.data`), `Admin` (→ `product.admin`). Proofs: `Public` (→ `proof.values.<key>` — owner-editable), `Owner` (→ `proof.values.owner`), `Personal` (→ `proof.values.personal[userId]`), `Admin` (→ `proof.admin`).
  - Reject reserved names (`owner`, `personal`) as free-form keys in `proof.values`.
  - Persist enough metadata for renderers to know which bag a field lives in and to gate its display by the current caller's role.
- **Server** performs both read-scoping (strip bags the caller can't see) and write authorisation (reject writes the caller isn't allowed to make). The client is a convenience layer, never the source of truth for either.

---

## Summary

```
product.data   = { … }              // public business
product.admin  = { … }              // admin-only business

proof.data     = { … }              // public business (spec)
proof.admin    = { … }              // admin-only business
proof.values   = { …public, owner?, personal? }   // consumer
```

Reserved sub-keys: **`owner`** and **`personal`** inside `proof.values`. Everything else in every bag is a free-form key.

---

## Field-definition schemas (collection settings)

The custom-field definitions that drive the editors above are stored on the
**collection** in named settings groups. Both are read/written via the standard
settings API:

```ts
// Read (admin: true required for admin-scoped fields to be returned)
const productFields = await SL.collection.getSettings(collectionId, 'productFields', true);
const proofFields   = await SL.collection.getSettings(collectionId, 'proofFields',   true);

// Write
await SL.collection.updateSettings(collectionId, 'productFields', productFieldsConfig);
await SL.collection.updateSettings(collectionId, 'proofFields',   proofFieldsConfig);
```

Third-party apps (CRM, warranty, provenance, etc.) that render a product or
proof for a user should fetch these once per collection to know which
configurable fields exist, their labels, types, and — crucially — which bag to
read the value from.

### Settings group names

| Group key        | Shape                | Applies to                                                    |
| ----------------- | --------------------- | ---------------------------------------------------------------- |
| `productFields`  | `ProductFieldsConfig`| Custom fields on `product.data` / `product.admin`             |
| `proofFields`    | `ProofFieldsConfig`  | Custom fields on `proof.values` / `proof.data` / `proof.admin`|

### Shared field-def shape

Product and proof field defs share the same base shape. The only difference is
the allowed `scope` values.

```ts
type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'switch'
  | 'url';

interface FieldOption {
  value: string;
  label: string;
}

interface FieldDef {
  /** Stable key. Written into the resolved bag at this name. */
  key: string;
  /** Human label for editors and read-only renderers. */
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  /** Required when type === 'select'. */
  options?: FieldOption[];
  /** Default value applied when creating a new record. */
  defaultValue?: unknown;
  /** Show as a column in the default items table. */
  showInTable?: boolean;
  /** Show on the inline detail / edit view. */
  showInDetail?: boolean;
  /**
   * Storage scope. When omitted the field is legacy public and written flat
   * (product.data.<key> or proof.values.<key>). New fields opt into a scope.
   */
  scope?: FieldScope;
}
```

### `productFields` — `ProductFieldsConfig`

```ts
type ProductFieldScope = 'public' | 'admin';

type ProductFieldDef = FieldDef & { scope?: ProductFieldScope };

interface ProductFieldsConfig {
  fields: ProductFieldDef[];
}
```

**Value resolution** for a given `ProductFieldDef` `f`:

| `f.scope`             | Read from                                    |
| ---------------------- | ---------------------------------------------- |
| `'public'` / omitted  | `product.data[f.key]`                        |
| `'admin'`             | `product.admin?.[f.key]` (admin only)        |

### `proofFields` — `ProofFieldsConfig`

```ts
type ProofFieldScope = 'public' | 'owner' | 'personal' | 'admin';

type ProofFieldDef = FieldDef & { scope?: ProofFieldScope };

interface ProofFieldsConfig {
  fields: ProofFieldDef[];
}
```

**Value resolution** for a given `ProofFieldDef` `f`, current user id `uid`:

| `f.scope`             | Read from                                       |
| ---------------------- | -------------------------------------------------- |
| `'public'` / omitted  | `proof.values[f.key]`                           |
| `'owner'`             | `proof.values.owner?.[f.key]`                   |
| `'personal'`          | `proof.values.personal?.[uid]?.[f.key]`         |
| `'admin'`             | `proof.admin?.[f.key]`                          |

If the caller isn't entitled to the scope, the server strips the bag; the
field def still exists but the value comes back `undefined`. Clients should
treat that as "not visible to me" rather than "unset".

> **Note:** there is currently no `scope` value that maps to `proof.data`
> (public business spec). If/when the editor UX wants to distinguish
> "public, business-only-writable" from "public, owner-editable" (the current
> unscoped `proof.values.<key>`), add a `'spec'` scope that resolves to
> `proof.data[f.key]`. Until then, treat `proof.data` as hand-authored /
> server-set and out of scope for the collection-settings field editor.

### JSON Schema — `productFields`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://smartlinks.app/schemas/collection-settings/productFields.json",
  "title": "Collection Settings: productFields",
  "type": "object",
  "additionalProperties": false,
  "required": ["fields"],
  "properties": {
    "fields": {
      "type": "array",
      "items": { "$ref": "#/$defs/productFieldDef" }
    }
  },
  "$defs": {
    "productFieldDef": {
      "type": "object",
      "additionalProperties": false,
      "required": ["key", "label", "type"],
      "properties": {
        "key":          { "type": "string", "pattern": "^[A-Za-z_][A-Za-z0-9_]*$" },
        "label":        { "type": "string" },
        "type":         { "enum": ["text","textarea","number","date","select","switch","url"] },
        "required":     { "type": "boolean" },
        "placeholder":  { "type": "string" },
        "help":         { "type": "string" },
        "options": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["value", "label"],
            "properties": {
              "value": { "type": "string" },
              "label": { "type": "string" }
            }
          }
        },
        "defaultValue": {},
        "showInTable":  { "type": "boolean" },
        "showInDetail": { "type": "boolean" },
        "scope":        { "enum": ["public", "admin"] }
      }
    }
  }
}
```

### JSON Schema — `proofFields`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://smartlinks.app/schemas/collection-settings/proofFields.json",
  "title": "Collection Settings: proofFields",
  "type": "object",
  "additionalProperties": false,
  "required": ["fields"],
  "properties": {
    "fields": {
      "type": "array",
      "items": { "$ref": "#/$defs/proofFieldDef" }
    }
  },
  "$defs": {
    "proofFieldDef": {
      "type": "object",
      "additionalProperties": false,
      "required": ["key", "label", "type"],
      "properties": {
        "key":          { "type": "string", "pattern": "^(?!owner$|personal$)[A-Za-z_][A-Za-z0-9_]*$" },
        "label":        { "type": "string" },
        "type":         { "enum": ["text","textarea","number","date","select","switch","url"] },
        "required":     { "type": "boolean" },
        "placeholder":  { "type": "string" },
        "help":         { "type": "string" },
        "options": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["value", "label"],
            "properties": {
              "value": { "type": "string" },
              "label": { "type": "string" }
            }
          }
        },
        "defaultValue": {},
        "showInTable":  { "type": "boolean" },
        "showInDetail": { "type": "boolean" },
        "scope":        { "enum": ["public", "owner", "personal", "admin"] }
      }
    }
  }
}
```

### Worked example — CRM app resolving a proof

```ts
const { fields } = await SL.collection.getSettings(collectionId, 'proofFields');
const uid = (await SL.auth.getAccount())?.id;

for (const f of fields) {
  const value =
    !f.scope || f.scope === 'public' ? proof.values?.[f.key] :
    f.scope === 'owner'              ? proof.values?.owner?.[f.key] :
    f.scope === 'personal'           ? proof.values?.personal?.[uid!]?.[f.key] :
    f.scope === 'admin'              ? proof.admin?.[f.key] :
    undefined;

  render({ label: f.label, type: f.type, value });
}
```

The same loop, swapping `proofFields` → `productFields` and the resolution
table for the product one (`public` → `product.data`, `admin` → `product.admin`),
gives a CRM app a complete configurable read of a product. No app-specific
knowledge required beyond "fetch the field defs from the collection".
