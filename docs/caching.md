# Caching Strategy

## Overview

The Smartlinks SDK implements a multi-tier caching system designed to balance performance with data freshness:

1. **In-Memory Cache (L1)** - Fastest, cleared on page refresh
2. **SessionStorage** - Cleared on page refresh (not tab close)
3. **IndexedDB (L2)** - Persists across refreshes for offline support

## Cache Behavior on Page Refresh

### Default Behavior (Recommended)

When you refresh the page (F5, Ctrl+F5, or window reload):

- ✅ **In-memory cache** - Automatically cleared (module re-initialization)
- ✅ **SessionStorage** - Explicitly cleared on page load
- ✅ **IndexedDB** - Preserved for offline fallback only

This ensures that **page refreshes always fetch fresh data from the server**, while maintaining offline capabilities.

### How It Works

1. **During browsing (same page load)**:
   - API requests are cached in memory and sessionStorage
   - Subsequent identical requests serve from cache (fast!)
   - TTL rules determine cache freshness (30s - 1h depending on resource)

2. **On page refresh**:
   - Module re-initialization clears in-memory cache
   - `clearSessionCacheOnLoad()` runs automatically
   - SessionStorage caches are removed
   - Fresh network requests are made

3. **When offline** (with `persistence: 'indexeddb'`):
   - Network request fails
   - SDK checks IndexedDB for stale data
   - If found and within 7-day TTL, throws `SmartlinksOfflineError` with data
   - App can catch this and use stale data gracefully

## Cache Configuration

### Enable IndexedDB Persistence

```typescript
import { configureSdkCache } from '@smartlinks/sdk';

// Enable offline support via IndexedDB
configureSdkCache({
  persistence: 'indexeddb',
  persistenceTtlMs: 7 * 24 * 60 * 60_000, // 7 days
  serveStaleOnOffline: true,
});
```

### Disable Clear-on-Refresh (Not Recommended)

```typescript
// Keep caches across page refreshes
// ⚠️ Not recommended for production - you'll serve stale data after refresh
configureSdkCache({
  clearOnPageLoad: false,
});
```

### Disable Caching Entirely

```typescript
// Useful for testing or debugging
configureSdkCache({
  enabled: false,
});
```

## Cache Storage Types

### `storage: 'memory'` (Default)
- Lives in JavaScript memory (Map)
- Cleared on page refresh
- Fastest access
- No quota limits

### `storage: 'session'`
- Lives in `sessionStorage`
- **Cleared on page load** (new behavior)
- Survives navigation within same session
- ~5-10MB quota

### `storage: 'local'`
- Lives in `localStorage`
- Persists across browser restarts
- Use sparingly for truly persistent data
- ~5-10MB quota

### `persistence: 'indexeddb'`
- Lives in IndexedDB (L2 cache)
- Persists across refreshes and restarts
- **Only used as offline fallback**, not for normal requests
- ~50MB+ quota

## TTL Rules

Different API resources have different cache lifetimes:

| Resource | TTL | Reason |
|----------|-----|--------|
| `/proof/*` | 30 seconds | Proofs change frequently |
| `/attestation/*` | 2 minutes | Attestations update regularly |
| `/product/*` | 1 hour | Products are relatively stable |
| `/variant/*` | 1 hour | Variants rarely change |
| `/collection/*` | 1 hour | Collections are stable |
| Everything else | 1 minute | Default safety |

## Manual Cache Control

### Invalidate Specific Resource

```typescript
import { invalidateCache } from '@smartlinks/sdk';

// Substring match (default): clears the collection AND everything under it
// (settings, widgets, products, proofs) — a prefix wipe.
invalidateCache('/collection/abc123');

// Exact match: clears ONLY that entry, not its sub-resources. Use this to avoid
// accidental cascade wipes.
invalidateCache('/collection/abc123', { exact: true });

// Clear all product caches
invalidateCache('/product/');
```

### Don't force-refresh from a container-hosted app

`getWidgets(collectionId, { force: true })` (and `getAppConfig(..., { force: true })`)
bypass the cache and re-fetch. Inside a **container/iframe app**, the host has usually
already fetched that data and shares its own cache — forcing a refetch duplicates the
request the host just made. `force: true` was a **polling-era workaround** for not being
able to tell when something changed; **prefer the default (cached) path** in hosted apps.

> **Direction:** the platform is moving to a **push-based** model — app/config updates are
> pushed centrally and invalidate the relevant caches immediately, so a normal GET returns
> fresh data (and, with conditional requests/ETags, returns "not modified" cheaply) without
> anyone polling or forcing. As that lands, `force: true` should disappear from app code
> entirely. Don't build new flows around it.

### Clear All Caches

```typescript
import { invalidateCache } from '@smartlinks/sdk';

// Nuclear option - clear everything
invalidateCache();
```

## Best Practices

1. **Default is best** - The SDK defaults are designed for optimal behavior
2. **Enable IndexedDB for PWAs** - If building offline-first apps
3. **Don't disable clearOnPageLoad** - Users expect fresh data after refresh
4. **Use invalidateCache() after mutations** - SDK does this automatically for you
5. **Trust the TTL rules** - They're tuned for smartlinks.app API behavior

## Offline Mode Example

```typescript
import { collection, SmartlinksOfflineError } from '@smartlinks/sdk';

try {
  const data = await collection.get('abc123');
  // Fresh data from server
} catch (error) {
  if (error instanceof SmartlinksOfflineError) {
    // Network failed, but we have stale data
    console.warn('Offline - using stale data from', error.cachedAt);
    const staleData = error.data;
    // Display stale data with a banner
  } else {
    // Real error - no offline data available
    throw error;
  }
}
```

