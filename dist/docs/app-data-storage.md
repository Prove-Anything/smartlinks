# App Data Storage Guide

The SmartLinks platform provides two distinct types of data storage for apps:

## 1. User-Specific Data (Global per User+App)

**Use the `userAppData` namespace for all user-specific data.**

User data is **shared across all collections** for a given user and app. This is perfect for storing user preferences, personal settings, and user-generated content that should persist regardless of which collection they're viewing.

### Use Cases
- User allergies in an allergy tracking app
- Garden bed layouts in a garden planning app
- User preferences and settings
- Shopping lists, wishlists, favorites
- Personal notes and annotations

### API Endpoints
```
GET    /public/auth/app/:appId              - Get user's single config blob
POST   /public/auth/app/:appId              - Set user's single config blob
DELETE /public/auth/app/:appId              - Delete user's config blob

GET    /public/auth/app/:appId/data         - Get all user's data items
GET    /public/auth/app/:appId/data/:itemId - Get a specific user data item
POST   /public/auth/app/:appId/data         - Create/update a user data item
DELETE /public/auth/app/:appId/data/:itemId - Delete a user data item
```

### SDK Usage

#### Single Config Blob (Simple Key-Value)
```typescript
import { userAppData } from '@proveanything/smartlinks';

// Get user's config
const config = await userAppData.getConfig('allergy-tracker');

// Save user's config
await userAppData.setConfig('allergy-tracker', { 
  allergies: ['peanuts', 'shellfish'],
  notifications: true 
});

// Delete user's config
await userAppData.deleteConfig('allergy-tracker');
```

#### Multiple Keyed Data Items (Recommended)
```typescript
// Get all user's garden beds
const beds = await userAppData.list('garden-planner');
// Returns: [{ id: 'bed-1', name: 'Vegetables', ... }, { id: 'bed-2', ... }]

// Get specific bed
const bed = await userAppData.get('garden-planner', 'bed-1');

// Save/update a bed
await userAppData.set('garden-planner', { 
  id: 'bed-1', 
  name: 'Vegetable Bed', 
  plants: ['tomatoes', 'peppers'],
  location: { x: 10, y: 20 }
});

// Delete a bed
await userAppData.remove('garden-planner', 'bed-1');
```

### Important Notes
- ✅ **Clean, simple API** - Just pass the `appId` (no collection/product scoping)
- ✅ User data requires authentication (Bearer token)
- ✅ Data is automatically scoped to the authenticated user
- ✅ Impossible to accidentally scope to collections

---

## 2. Collection/Product-Scoped Data (Admin Configuration)

**Use the `appConfiguration` namespace for collection/product-scoped data.**

This data is scoped to specific collections, products, variants, or batches. It's typically configured by collection admins/owners and applies to all users viewing that collection/product.

### Use Cases
- App-specific settings for a collection
- Product-level configuration
- Feature flags and toggles
- Theme and branding settings
- Public content that all users see

### API Endpoints
```
GET    /public/collection/:collectionId/app/:appId
POST   /admin/collection/:collectionId/app/:appId
DELETE /admin/collection/:collectionId/app/:appId

GET    /public/collection/:collectionId/product/:productId/app/:appId/data
POST   /admin/collection/:collectionId/product/:productId/app/:appId/data
...
```

### SDK Usage

```typescript
import { appConfiguration } from '@proveanything/smartlinks';

// Get collection-level app config
const collectionConfig = await appConfiguration.getConfig({ 
  appId: 'warranty-portal', 
  collectionId: 'my-collection'
});

// Set collection-level config (requires admin auth)
await appConfiguration.setConfig({ 
  appId: 'warranty-portal', 
  collectionId: 'my-collection',
  admin: true,
  config: { 
    warrantyPeriod: 24, 
    supportEmail: 'support@example.com' 
  }
});

// Get product-level data items
const items = await appConfiguration.getData({ 
  appId: 'product-docs', 
  collectionId: 'my-collection',
  productId: 'product-123'
});

// Set product-level data item (requires admin auth)
await appConfiguration.setDataItem({ 
  appId: 'product-docs', 
  collectionId: 'my-collection',
  productId: 'product-123',
  admin: true,
  data: { 
    id: 'manual-1', 
    title: 'User Manual',
    url: 'https://...' 
  }
});
```

---

## Comparison Table

| Feature | User Data | Collection/Product Data |
|---------|-----------|------------------------|
| **Namespace** | `userAppData` | `appConfiguration` |
| **Scope** | User + App (global) | Collection/Product/Variant/Batch |
| **Set by** | Individual users | Collection admins/owners |
| **Shared across collections?** | ✅ Yes | ❌ No |
| **Requires auth?** | ✅ Yes (user token) | ✅ Yes (admin token for write) |
| **Function signature** | Simple: `set(appId, data)` | Options object: `setDataItem({ appId, collectionId, data })` |
| **Admin write required?** | ❌ No | ✅ Yes (for write operations) |

---

## Migration from Old SDK

### Old SDK → New SDK

```typescript
// OLD: Get user config
RemoteApi.get({ path: `public/auth/app/${appId}` })
// NEW:
userAppData.getConfig(appId)

// OLD: Set user config
RemoteApi.post({ path: `public/auth/app/${appId}`, data })
// NEW:
userAppData.setConfig(appId, data)

// OLD: Get user data items
RemoteApi.get({ path: `public/auth/app/${appId}/data` })
// NEW:
userAppData.list(appId)

// OLD: Get user data item
RemoteApi.get({ path: `public/auth/app/${appId}/data/${itemId}` })
// NEW:
userAppData.get(appId, itemId)

// OLD: Set user data item
RemoteApi.post({ path: `public/auth/app/${appId}/data`, data: item })
// NEW:
userAppData.set(appId, item)

// OLD: Delete user data item
RemoteApi.delete({ path: `public/auth/app/${appId}/data/${itemId}` })
// NEW:
userAppData.remove(appId, itemId)
```

---

## Complete API Reference

### `userAppData` (User-Specific Data)

| Function | Signature | Description |
|----------|-----------|-------------|
| `getConfig` | `(appId: string) => Promise<any>` | Get user's config blob |
| `setConfig` | `(appId: string, config: any) => Promise<any>` | Set user's config blob |
| `deleteConfig` | `(appId: string) => Promise<void>` | Delete user's config blob |
| `list` | `(appId: string) => Promise<any[]>` | List all user's data items |
| `get` | `(appId: string, itemId: string) => Promise<any>` | Get specific data item |
| `set` | `(appId: string, item: any) => Promise<any>` | Create/update data item |
| `remove` | `(appId: string, itemId: string) => Promise<void>` | Delete data item |

### `appConfiguration` (Collection/Product-Scoped Data)

| Function | Signature | Description |
|----------|-----------|-------------|
| `getConfig` | `(opts: AppConfigOptions) => Promise<any>` | Get config for scope |
| `setConfig` | `(opts: AppConfigOptions) => Promise<any>` | Set config for scope |
| `deleteConfig` | `(opts: AppConfigOptions) => Promise<void>` | Delete config for scope |
| `getData` | `(opts: AppConfigOptions) => Promise<any[]>` | List data items in scope |
| `getDataItem` | `(opts: AppConfigOptions) => Promise<any>` | Get specific data item |
| `setDataItem` | `(opts: AppConfigOptions) => Promise<any>` | Create/update data item |
| `deleteDataItem` | `(opts: AppConfigOptions) => Promise<void>` | Delete data item |
