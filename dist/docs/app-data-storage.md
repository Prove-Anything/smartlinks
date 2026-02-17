# App Data Storage Guide

The SmartLinks platform provides two distinct types of data storage for apps:

## 1. User-Specific Data (Global per User+App)

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
import { appConfiguration } from '@proveanything/smartlinks';

// Get user's config
const config = await appConfiguration.getConfig({ 
  appId: 'allergy-tracker', 
  user: true 
});

// Save user's config
await appConfiguration.setConfig({ 
  appId: 'allergy-tracker', 
  user: true,
  config: { 
    allergies: ['peanuts', 'shellfish'],
    notifications: true 
  }
});

// Delete user's config
await appConfiguration.deleteConfig({ 
  appId: 'allergy-tracker', 
  user: true 
});
```

#### Multiple Keyed Data Items (Recommended)
```typescript
// Get all user's garden beds
const beds = await appConfiguration.getData({ 
  appId: 'garden-planner', 
  userData: true 
});
// Returns: [{ id: 'bed-1', name: 'Vegetables', ... }, { id: 'bed-2', ... }]

// Get specific bed
const bed = await appConfiguration.getDataItem({ 
  appId: 'garden-planner', 
  userData: true,
  itemId: 'bed-1'
});

// Save/update a bed
await appConfiguration.setDataItem({ 
  appId: 'garden-planner', 
  userData: true,
  data: { 
    id: 'bed-1', 
    name: 'Vegetable Bed', 
    plants: ['tomatoes', 'peppers'],
    location: { x: 10, y: 20 }
  }
});

// Delete a bed
await appConfiguration.deleteDataItem({ 
  appId: 'garden-planner', 
  userData: true,
  itemId: 'bed-1'
});
```

### Important Notes
- ⚠️ **DO NOT** provide `collectionId` or `productId` when using `user: true` or `userData: true`
- User data requires authentication (Bearer token)
- Data is automatically scoped to the authenticated user
- The SDK will throw an error if you try to mix user data with collection/product scoping

---

## 2. Collection/Product-Scoped Data (Admin Configuration)

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
| **Scope** | User + App (global) | Collection/Product/Variant/Batch |
| **Set by** | Individual users | Collection admins/owners |
| **Shared across collections?** | ✅ Yes | ❌ No |
| **Requires auth?** | ✅ Yes (user token) | ✅ Yes (admin token for write) |
| **SDK flags** | `user: true` or `userData: true` | `collectionId` (and optionally `productId`, etc.) |
| **Admin write required?** | ❌ No | ✅ Yes (for write operations) |

---

## Migration from Old SDK

If you're migrating from the old SDK, here's the mapping:

### Old SDK → New SDK

```typescript
// OLD: Get user config
RemoteApi.get({ path: `public/auth/app/${appId}` })
// NEW:
appConfiguration.getConfig({ appId, user: true })

// OLD: Set user config
RemoteApi.post({ path: `public/auth/app/${appId}`, data })
// NEW:
appConfiguration.setConfig({ appId, user: true, config: data })

// OLD: Get user data items
RemoteApi.get({ path: `public/auth/app/${appId}/data` })
// NEW:
appConfiguration.getData({ appId, userData: true })

// OLD: Get user data item
RemoteApi.get({ path: `public/auth/app/${appId}/data/${itemId}` })
// NEW:
appConfiguration.getDataItem({ appId, userData: true, itemId })

// OLD: Set user data item
RemoteApi.post({ path: `public/auth/app/${appId}/data`, data: item })
// NEW:
appConfiguration.setDataItem({ appId, userData: true, data: item })

// OLD: Delete user data item
RemoteApi.delete({ path: `public/auth/app/${appId}/data/${itemId}` })
// NEW:
appConfiguration.deleteDataItem({ appId, userData: true, itemId })
```

---

## Common Mistakes to Avoid

❌ **Wrong: Passing collectionId with user data**
```typescript
await appConfiguration.getData({ 
  appId: 'garden-planner',
  userData: true,
  collectionId: 'my-collection' // ❌ ERROR!
});
```

✅ **Correct: User data without collection scope**
```typescript
await appConfiguration.getData({ 
  appId: 'garden-planner',
  userData: true // ✅ Shared across all collections
});
```

❌ **Wrong: Using user flag for collection config**
```typescript
await appConfiguration.getConfig({ 
  appId: 'warranty-portal',
  collectionId: 'my-collection',
  user: true // ❌ Contradictory!
});
```

✅ **Correct: Collection config without user flag**
```typescript
await appConfiguration.getConfig({ 
  appId: 'warranty-portal',
  collectionId: 'my-collection' // ✅ Collection-scoped
});
```
