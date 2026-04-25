# SmartLinks Forms

> Platform-managed form definitions and submissions. Covers the `form` data API (core SDK) and the `@proveanything/ui-forms` React package for schema-driven form UIs.

---

## Two layers

| Layer | Package | What it does |
|-------|---------|--------------|
| **Forms data API** | `@proveanything/smartlinks` (`form` namespace) | CRUD for form definitions; stores submission schema |
| **Forms UI** | `@proveanything/ui-forms` | React components that render a form definition, validate input, and submit |

You can use the data API without the UI package (e.g. in an executor), but the UI package requires both.

---

## Forms data API (`form` namespace)

The `form` namespace in the core SDK manages **form definitions** — the schema that describes fields, validation rules, and submission behaviour. This is an admin-side API.

```ts
import { form } from '@proveanything/smartlinks';

// List all forms in a collection
const forms = await form.list(collectionId, /* admin= */ true);

// Get a specific form
const myForm = await form.get(collectionId, formId);

// Create a form (admin)
const created = await form.create(collectionId, {
  name: 'Warranty Registration',
  fields: [
    { id: 'name',    type: 'text',  label: 'Full name',       required: true },
    { id: 'email',   type: 'email', label: 'Email address',   required: true },
    { id: 'serial',  type: 'text',  label: 'Serial number',   required: true },
    { id: 'receipt', type: 'file',  label: 'Proof of purchase' },
  ],
});

// Update a form (admin)
await form.update(collectionId, formId, { name: 'Warranty Registration v2' });

// Delete a form (admin)
await form.remove(collectionId, formId);
```

Form definitions are stored per-collection and referenced by `formId`.

---

## Forms UI (`@proveanything/ui-forms`)

`@proveanything/ui-forms` provides React components that consume a form definition from the API and render a complete, accessible, validated form.

Install: `npm install @proveanything/ui-forms`

### Rendering a form

```tsx
import { SmartForm } from '@proveanything/ui-forms';

// Fetches the form definition and renders it
<SmartForm
  collectionId={collectionId}
  formId={formId}
  onSubmit={async (values) => {
    // handle submission — e.g. create an app.records entry or send via comms
  }}
/>
```

### Headless usage

```tsx
import { useFormDefinition, FormRenderer } from '@proveanything/ui-forms';

const { fields, isLoading } = useFormDefinition(collectionId, formId);

// Render fields yourself using the definition
```

---

## Common patterns

### Warranty / registration forms

Define the form in `app.admin.json` setup or via the admin API. On the public widget, render with `<SmartForm>` and on submit create an `app.records` entry:

```ts
onSubmit={async (values) => {
  await app.records.create(collectionId, appId, {
    recordType: 'warranty_registration',
    ref: `proof:${proofId}`,
    data: values,
  });
}}
```

### Competition / feedback forms

Same pattern — use `<SmartForm>` for capture and write to `app.records` or trigger an `interactions.appendEvent` on submit.

---

## Further reading

- [app-objects.md](app-objects.md) — `app.records` for storing submissions
- [app-data-storage.md](app-data-storage.md) — choosing the right storage model
- [interactions.md](interactions.md) — firing events on form submission
- [comms.md](comms.md) — sending confirmation emails after submission
