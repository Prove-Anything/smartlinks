# AI Guide: Example App

<!-- CUSTOMIZE: Replace "Example App" and all content below with your app's specifics. -->
<!-- This file is consumed by AI orchestrators alongside public/app.manifest.json. -->
<!-- The manifest provides structured data; this file provides prose context and nuance. -->

---

## Purpose & Identity

<!-- CUSTOMIZE: Describe what your app does in 2-3 sentences. -->

The **Example App** is a template SmartLinks microapp that demonstrates all platform patterns including setup wizards, data imports, widget embedding, and analytics. It serves as a reference implementation for app authors building on the SmartLinks platform.

---

## Setup Wizard Instructions

An AI orchestrator should follow these steps to configure the Example App for a collection. The structured questions and schema are in `app.manifest.json` under `setup`.

### Prerequisites

- The user must have **admin access** to the target collection.
- The `collectionId` and `appId` must be known (typically from URL context).

### Questions to Ask

Walk the user through each question defined in `setup.questions[]` of the manifest:

1. **App Title** (`appTitle`): Ask what the app should be called. Offer to auto-generate a suggestion using `SL.ai.chat.completions` if the user wants help (see `contentHints` in the manifest).
2. **Enable Notifications** (`enableNotifications`): Ask whether the app should send notifications to users.

<!-- CUSTOMIZE: Add app-specific guidance for each question. For example: -->
<!-- "If the user is setting up a competition, suggest a title like 'Win a [Product Name]!'" -->
<!-- "For plant passports, notifications are typically disabled." -->

### How to Save the Config

After collecting answers, validate against `setup.configSchema` and save:

```typescript
await SL.appConfiguration.setConfig({
  collectionId,
  appId,
  config: {
    appTitle: "User's chosen title",
    enableNotifications: false
  },
  admin: true  // REQUIRED for admin operations
});
```

### Post-Setup Verification

After saving, confirm by reading the config back:

```typescript
const saved = await SL.appConfiguration.getConfig({
  collectionId,
  appId,
  admin: true
});
// Verify saved.appTitle and saved.enableNotifications match expectations
```

Tell the user: "Your app is configured! You can adjust settings anytime by asking me to update the configuration."

---

## Import Instructions

The app supports bulk import of product-level configuration. The field definitions are in `app.manifest.json` under `import`.

### CSV Template

Generate or share this template with the user:

```csv
productId,appTitle,enableNotifications
prod_001,My First Product,true
prod_002,My Second Product,false
```

<!-- CUSTOMIZE: Add real-world examples relevant to your app. -->

### Field Validation Rules

| Field                 | Type    | Required | Validation                            |
| --------------------- | ------- | -------- | ------------------------------------- |
| `productId`           | string  | ✅       | Must be a valid SmartLinks product ID |
| `appTitle`            | string  | ✅       | Non-empty string                      |
| `enableNotifications` | boolean | ❌       | Defaults to `false`                   |

<!-- CUSTOMIZE: Add app-specific validation rules. For example: -->
<!-- "For plant passports: botanicalName must be in Latin binomial format." -->

### API Call Sequence

For each row in the CSV:

```typescript
await SL.appConfiguration.setConfig({
  collectionId,
  productId: row.productId,  // From CSV
  appId,
  config: {
    appTitle: row.appTitle,
    enableNotifications: row.enableNotifications ?? false
  },
  admin: true
});
```

### Error Handling

- If a `productId` is invalid, log the error and continue with the next row.
- After processing all rows, report a summary: `"Imported X of Y products successfully. Z failed."`.
- For failed rows, list the product ID and error message so the user can fix the data.

### Cross-App Import

When importing data for multiple apps simultaneously:

1. Fetch `app.manifest.json` from each app.
2. Merge `import.fields` arrays (prefix field names with app name if there are conflicts).
3. Generate a combined CSV template.
4. For each row, split into separate payloads per app and call each app's `saveWith.method`.

---

## Widget Embedding Guide

### Available Widgets

| Widget          | Description                                | Sizes                    |
| --------------- | ------------------------------------------ | ------------------------ |
| `ExampleWidget` | Demo widget showing SmartLinks integration | compact, standard, large |

<!-- CUSTOMIZE: List all widgets your app exports. -->

### Props Reference

All widgets receive `SmartLinksWidgetProps`:

| Prop              | Type           | Required | Description                             |
| ----------------- | -------------- | -------- | --------------------------------------- |
| `collectionId`    | string         | ✅       | Collection context                      |
| `appId`           | string         | ✅       | App identifier                          |
| `SL`              | SmartLinks SDK | ✅       | Pre-initialized SDK instance            |
| `productId`       | string         | ❌       | Product context                         |
| `proofId`         | string         | ❌       | Proof context                           |
| `user`            | object         | ❌       | Current user info                       |
| `onNavigate`      | function       | ❌       | Navigation callback                     |
| `publicPortalUrl` | string         | ❌       | URL to full app for deep linking        |
| `size`            | string         | ❌       | `"compact"`, `"standard"`, or `"large"` |
| `lang`            | string         | ❌       | Language code (e.g., `"en"`)            |
| `translations`    | object         | ❌       | Translation overrides                   |

### Example Code

```tsx
import { ExampleWidget } from '@my-app/widgets';

<ExampleWidget
  collectionId="col_123"
  appId="example-app"
  SL={SL}
  size="standard"
  onNavigate={(path) => router.push(path)}
/>
```

<!-- CUSTOMIZE: Show real widget usage with app-specific props. -->

---

## Tunable Settings

These settings can be adjusted after initial setup without reconfiguring everything. The AI can modify them in response to user requests like "turn off notifications" or optimization suggestions.

| Setting               | Type    | Description                    |
| --------------------- | ------- | ------------------------------ |
| `enableNotifications` | boolean | Toggle notifications on or off |

<!-- CUSTOMIZE: List all tunable fields with guidance on when to change them. -->

To update a tunable setting:

```typescript
// 1. Read current config
const current = await SL.appConfiguration.getConfig({ collectionId, appId, admin: true });

// 2. Merge the change
await SL.appConfiguration.setConfig({
  collectionId,
  appId,
  config: { ...current, enableNotifications: true },
  admin: true
});
```

---

## Metrics & Analytics

### Tracked Interactions

| Interaction ID | Description                                   |
| -------------- | --------------------------------------------- |
| `page-view`    | Tracks each time a user views the public page |

<!-- CUSTOMIZE: List all interaction IDs your app tracks. -->

### KPIs

| KPI         | How to Compute                                                                         |
| ----------- | -------------------------------------------------------------------------------------- |
| Total Views | `SL.interactions.countsByOutcome(collectionId, { appId, interactionId: 'page-view' })` |

<!-- CUSTOMIZE: Add app-specific KPIs and interpretation guidance. -->

---

## Troubleshooting

### Common Issues

| Issue                 | Cause                      | Fix                                                   |
| --------------------- | -------------------------- | ----------------------------------------------------- |
| Config save fails     | Missing `admin: true` flag | Always include `admin: true` for admin operations     |
| Widget doesn't render | Missing required props     | Ensure `collectionId`, `appId`, and `SL` are provided |
| Import skips rows     | Invalid `productId`        | Verify product IDs exist in the collection            |
| Theme not applied     | Missing `?theme=` param    | Check URL parameters or postMessage setup             |

<!-- CUSTOMIZE: Add app-specific troubleshooting entries. -->

### Getting Help

- **SDK Docs**: `node_modules/@proveanything/smartlinks/docs/`
- **App Manifest**: `public/app.manifest.json`
- **Platform Guide**: `src/docs/smartlinks/about.md`
