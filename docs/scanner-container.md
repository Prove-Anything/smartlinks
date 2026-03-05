# Scanner Container SDK

> **Version:** 1.0 · **Platform:** SmartLinks R4 · **Last updated:** 2026-03-04

This document describes how to build a **Scanner Container** — a SmartLinks microapp that replaces the default scanner UI inside the SmartLinks Scanner host application. Scanner containers receive a unified stream of hardware events (RFID, NFC, QR, key presses) and can implement any domain-specific logic on top of raw scan data.

> **See also:** [containers.md](containers.md) covers the other container type — portal-embedded full-app containers that run inside web-based SmartLinks portals. Scanner containers are a distinct interface designed specifically for the Android scanner host; they share the UMD bundle format and the `containers` manifest section, but differ in props, build requirements, and runtime context.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Manifest Declaration](#manifest-declaration)
4. [Container Props](#container-props)
5. [Hardware Event Stream](#hardware-event-stream)
6. [Event Types Reference](#event-types-reference)
7. [Subscribing to Events](#subscribing-to-events)
8. [Build & Bundle Requirements](#build--bundle-requirements)
9. [Shared Dependencies](#shared-dependencies)
10. [Lifecycle](#lifecycle)
11. [Example: Minimal Scanner Container](#example-minimal-scanner-container)
12. [Best Practices](#best-practices)

---

## Overview

The SmartLinks Scanner is a host application that manages hardware readers (RFID, NFC, USB, QR camera) on Android devices. By default it displays scanned tags in a built-in list view with automatic SmartLinks tag resolution.

A **Scanner Container** is a microapp that *replaces* this default UI entirely. When a user selects your scanner app, the host:

1. Hides its own tag list and lookup logic
2. Loads your UMD container bundle via `<script>` injection
3. Renders your exported React component
4. Forwards **all** hardware events to your component via a pub/sub subscription

Your container has full control over how scans are displayed, resolved, and acted upon. The host continues to manage the hardware readers themselves (start/stop RFID, NFC session handling, etc.).

```
┌─────────────────────────────────────────────┐
│              Scanner Host App               │
│                                             │
│  ┌──────────┐   ┌────────────────────────┐  │
│  │ Hardware  │──▶│  Event Dispatcher      │  │
│  │ Bridge    │   │  (android-bridge.ts)   │  │
│  └──────────┘   └───────────┬────────────┘  │
│                             │               │
│                    pub/sub  │               │
│                             ▼               │
│               ┌─────────────────────────┐   │
│               │   Your Scanner          │   │
│               │   Container Component   │   │
│               │   (UMD bundle)          │   │
│               └─────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## Architecture

### Host Responsibilities

The host application handles:

- **Hardware management**: Starting/stopping RFID readers, NFC sessions, QR camera
- **Key mapping**: Physical trigger buttons (key 293 = scan trigger, key 139 = clear)
- **Collection context**: User selects a collection before scanning
- **App discovery**: Fetching widget/container manifests and presenting app selection UI
- **Bundle loading**: Injecting UMD scripts, resolving exports, managing CSS cleanup
- **Event forwarding**: Converting raw bridge messages into typed `ScannerEvent` objects

### Container Responsibilities

Your container handles:

- **Scan processing**: Deciding what to do with each event (resolve tags, build UI, etc.)
- **Data resolution**: Calling SmartLinks APIs to look up tag/product/proof data
- **Business logic**: Domain-specific workflows (e.g., cask tracking, inventory, quality control)
- **UI rendering**: Complete control over the scan interface

### What the Host Does NOT Do When Your App Is Active

When a scanner container is selected, the host **bypasses all local processing**:

- No local tag list tracking
- No automatic SmartLinks tag resolution
- No deduplication or lookup debouncing
- Raw events are forwarded directly to your subscriber

This ensures zero redundant work and gives your container full ownership of the data flow.

---

## Manifest Declaration

To be discovered as a scanner container, your app's `app.manifest.json` must declare a container component with `"uiRole": "scanner"`:

```json
{
  "meta": {
    "name": "My Scanner App",
    "appId": "my-scanner-app",
    "version": "1.0.0"
  },
  "containers": {
    "files": {
      "js": { "umd": "containers.umd.js", "esm": "containers.es.js" },
      "css": null
    },
    "components": [
      {
        "name": "ScannerContainer",
        "description": "Custom scanner interface for cask tracking",
        "uiRole": "scanner",
        "scope": "collection",
        "audience": "admin",
        "settings": {
          "type": "object",
          "properties": {
            "autoResolve": {
              "type": "boolean",
              "title": "Auto-resolve tags",
              "description": "Automatically look up tag metadata on scan",
              "default": true
            }
          }
        }
      }
    ]
  }
}
```

### Key Fields

| Field         | Required | Description                                                             |
| ------------- | -------- | ----------------------------------------------------------------------- |
| `name`        | ✅       | Export name in the UMD bundle (`window.SmartLinksContainers[name]`)     |
| `uiRole`      | ✅       | Must be `"scanner"` for the host to recognize it                        |
| `description` | ✅       | Shown in the scanner app picker UI                                      |
| `scope`       | Optional | `"collection"` or `"product"` — the data scope                         |
| `audience`    | Optional | `"admin"`, `"public"`, or `"both"`                                      |
| `settings`    | Optional | JSON Schema describing configurable props (see Widget Settings Schema)  |

---

## Container Props

The host renders your container with these props:

```typescript
interface ScannerContainerProps {
  /** The active collection ID */
  collectionId: string;

  /** Your app's unique identifier */
  appId: string;

  /** Whether the current user is an admin */
  isAdmin: boolean;

  /**
   * Subscribe to all hardware events.
   * Call once in useEffect; returns an unsubscribe function.
   */
  onSubscribeScannerEvents: (
    callback: (event: ScannerEvent) => void
  ) => (() => void);

  /**
   * @deprecated Use onSubscribeScannerEvents instead.
   * Provided for backward compatibility — identical behavior.
   */
  onSubscribeScanEvents?: (
    callback: (event: ScannerEvent) => void
  ) => (() => void);
}
```

> **Note — no `SL` prop:** Unlike portal containers (see [containers.md](containers.md)), scanner containers do not receive an `SL` prop from the host. Instead, the SmartLinks SDK is externalized to `window.SL` and imported directly in your bundle (`import * as SL from '@proveanything/smartlinks'`). See [Shared Dependencies](#shared-dependencies) for the full externals table.

---

## Hardware Event Stream

All hardware inputs are normalized into a single **discriminated union** type called `ScannerEvent`. The `type` field tells you the source:

```typescript
type ScannerEvent =
  | { type: 'rfid'; uid: string; timestamp: number; rssi?: number }
  | { type: 'nfc';  uid: string; timestamp: number; ndef?: string }
  | { type: 'qr';   data: string; timestamp: number }
  | { type: 'key';  keyCode: number; action: 'down' | 'up'; timestamp: number };
```

### Why a Unified Stream?

Rather than providing four separate subscription channels, a single stream:

- Simplifies the container API surface (one `useEffect`, one cleanup)
- Allows containers to correlate cross-device events (e.g., "trigger key held while RFID scans arrive")
- Makes it trivial to log or replay all hardware activity
- Avoids race conditions from multiple independent subscriptions

---

## Event Types Reference

### `rfid` — RFID Tag Scan

Emitted when the Chainway UHF RFID reader detects a tag.

| Field       | Type     | Description                                     |
| ----------- | -------- | ----------------------------------------------- |
| `type`      | `'rfid'` | Discriminant                                    |
| `uid`       | `string` | The EPC (Electronic Product Code) hex string    |
| `timestamp` | `number` | `Date.now()` when the event was created         |
| `rssi`      | `number` | Signal strength (optional, reader-dependent)    |

**Notes:**
- RFID readers emit continuously while active — expect many events per second
- The same EPC will appear repeatedly; your container should handle deduplication
- The host starts/stops the RFID reader via hardware key 293 (trigger button)

### `nfc` — NFC / USB Tag Scan

Emitted when the device's built-in NFC reader or an external USB NFC reader scans a tag.

| Field       | Type     | Description                                         |
| ----------- | -------- | --------------------------------------------------- |
| `type`      | `'nfc'`  | Discriminant                                        |
| `uid`       | `string` | The tag's unique ID (hex string, e.g., `04A3B2...`) |
| `timestamp` | `number` | `Date.now()` when the event was created             |
| `ndef`      | `string` | NDEF record content (URL or text), empty if none    |

**Notes:**
- NFC scans are one-shot (tap to scan)
- Both native NFC and USB reader scans are normalized to this type
- The `ndef` field often contains a SmartLinks URL that can be parsed for context

### `qr` — QR Code Scan

Emitted when the native QR code scanner successfully reads a code.

| Field       | Type    | Description                                |
| ----------- | ------- | ------------------------------------------ |
| `type`      | `'qr'`  | Discriminant                               |
| `data`      | `string`| The decoded QR code content (URL or text)  |
| `timestamp` | `number`| `Date.now()` when the event was created    |

**Notes:**
- Only successful scans are forwarded (cancelled/error scans are filtered)
- QR scans typically contain SmartLinks URLs or serial numbers

### `key` — Hardware Key Press

Emitted when a physical button is pressed or released on the device.

| Field       | Type              | Description                                 |
| ----------- | ----------------- | ------------------------------------------- |
| `type`      | `'key'`           | Discriminant                                |
| `keyCode`   | `number`          | Android key code constant                   |
| `action`    | `'down' \| 'up'`  | Press or release                            |
| `timestamp` | `number`          | `Date.now()` when the event was created     |

**Common Key Codes:**

| Code  | Button          | Default Host Behavior                        |
| ----- | --------------- | -------------------------------------------- |
| `293` | Scan trigger    | Start RFID on DOWN, stop on UP               |
| `139` | Function/Clear  | Clear tag list on DOWN                       |

**Notes:**
- Key events are forwarded to your container **and** processed by the host simultaneously
- The host will still start/stop RFID reading on key 293 — your container receives the resulting RFID events
- You can use key events for custom actions (e.g., confirm selection, switch modes)

---

## Subscribing to Events

Use the `onSubscribeScannerEvents` prop in a `useEffect`:

```tsx
import { useEffect } from 'react';

export function ScannerContainer({ onSubscribeScannerEvents, collectionId, appId }) {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const unsubscribe = onSubscribeScannerEvents((event) => {
      switch (event.type) {
        case 'rfid':
          console.log('RFID:', event.uid, 'RSSI:', event.rssi);
          // Deduplicate + resolve against SmartLinks
          break;
        case 'nfc':
          console.log('NFC:', event.uid, 'NDEF:', event.ndef);
          break;
        case 'qr':
          console.log('QR:', event.data);
          break;
        case 'key':
          console.log('Key:', event.keyCode, event.action);
          break;
      }
    });

    return unsubscribe; // Clean up on unmount
  }, [onSubscribeScannerEvents]);

  return <div>...</div>;
}
```

### Important Patterns

1. **Subscribe once** — The subscriber function is stable (wrapped in `useCallback` by the host). Subscribe in a `useEffect` with `[onSubscribeScannerEvents]` as the dependency.

2. **Use refs for mutable state** — If your event handler needs access to current state, use refs to avoid stale closures:

   ```tsx
   const scansRef = useRef(new Map());

   useEffect(() => {
     const unsubscribe = onSubscribeScannerEvents((event) => {
       if (event.type === 'rfid') {
         scansRef.current.set(event.uid, event);
         // Trigger re-render via setState
       }
     });
     return unsubscribe;
   }, [onSubscribeScannerEvents]);
   ```

3. **Batch state updates** — RFID events can arrive at high frequency. Consider debouncing UI updates while accumulating events.

---

## Build & Bundle Requirements

Scanner containers must be built as **UMD bundles** that register exports on `window.SmartLinksContainers`:

```typescript
// vite.config.container.ts
export default defineConfig({
  build: {
    lib: {
      entry: 'src/containers/index.ts',
      name: 'SmartLinksContainers',  // ← window global name
      formats: ['umd'],
      fileName: 'containers',
    },
    rollupOptions: {
      external: [/* shared dependencies — see below */],
      output: {
        globals: {/* dependency → window global mapping */},
      },
    },
  },
});
```

### Export Structure

```typescript
// src/containers/index.ts
export { ScannerContainer } from './ScannerContainer';
```

The host resolves your component by the `name` field in the manifest:

```javascript
const Component = window.SmartLinksContainers['ScannerContainer'];
```

---

## Shared Dependencies

The host exposes these libraries on `window` — your container build **must externalize them** (do not bundle):

| Import                        | Window Global           |
| ----------------------------- | ----------------------- |
| `react`                       | `window.React`          |
| `react-dom`                   | `window.ReactDOM`       |
| `react/jsx-runtime`           | `window.jsxRuntime`     |
| `@proveanything/smartlinks`   | `window.SL`             |
| `class-variance-authority`    | `window.CVA`            |
| `react-router-dom`            | `window.ReactRouterDOM` |
| `@tanstack/react-query`       | `window.ReactQuery`     |
| `lucide-react`                | `window.LucideReact`    |
| `date-fns`                    | `window.dateFns`        |
| `@radix-ui/react-*`           | `window.Radix*`         |

See the [SmartLinks Microapp Development Guide](../README.md) for the full shared dependencies table with exact global names.

Any dependency **not** in this list must be bundled into your container.

---

## Lifecycle

```
1. User selects collection
2. Host fetches widget/container manifests via SmartLinks API
3. Host identifies containers with uiRole === 'scanner'
4. User picks your scanner app from the list
   → Selection is persisted in localStorage per collection
5. Host loads your UMD bundle via <script> tag
6. Host resolves your component from window.SmartLinksContainers
7. Host renders <YourComponent ...props />
8. Your component subscribes to onSubscribeScannerEvents
9. User presses hardware trigger → RFID/NFC/QR events flow to your callback
10. User switches away or deselects → component unmounts, script/CSS removed
```

### Cleanup

The host handles all cleanup when your container is deselected or the collection changes:

- Script tag removal
- Injected CSS/style removal
- React component unmounting
- Event listener cleanup (via your returned unsubscribe function)

---

## Example: Minimal Scanner Container

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as SL from '@proveanything/smartlinks';

// Types — import from your own types file or declare inline
type ScannerEvent =
  | { type: 'rfid'; uid: string; timestamp: number; rssi?: number }
  | { type: 'nfc';  uid: string; timestamp: number; ndef?: string }
  | { type: 'qr';   data: string; timestamp: number }
  | { type: 'key';  keyCode: number; action: 'down' | 'up'; timestamp: number };

interface Props {
  collectionId: string;
  appId: string;
  isAdmin: boolean;
  onSubscribeScannerEvents: (cb: (event: ScannerEvent) => void) => () => void;
}

interface ScannedTag {
  uid: string;
  source: 'rfid' | 'nfc' | 'qr';
  firstSeen: number;
  count: number;
  productName?: string;
}

export function ScannerContainer({ collectionId, appId, isAdmin, onSubscribeScannerEvents }: Props) {
  const [tags, setTags] = useState<Map<string, ScannedTag>>(new Map());
  const tagsRef = useRef(tags);
  tagsRef.current = tags;

  const resolveTag = useCallback(async (cId: string, uid: string) => {
    try {
      const result = await SL.tags.publicGetByCollection(cId, uid, 'product');
      const product = result.embedded?.products?.[result.tag?.productId!];
      setTags(prev => {
        const next = new Map(prev);
        const tag = next.get(uid);
        if (tag) {
          next.set(uid, { ...tag, productName: product?.name ?? 'Unknown' });
        }
        return next;
      });
    } catch (err) {
      console.error('Tag resolution failed:', uid, err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSubscribeScannerEvents((event) => {
      if (event.type === 'rfid' || event.type === 'nfc') {
        const uid = event.uid;
        setTags(prev => {
          const next = new Map(prev);
          const existing = next.get(uid);
          if (existing) {
            next.set(uid, { ...existing, count: existing.count + 1 });
          } else {
            next.set(uid, {
              uid,
              source: event.type,
              firstSeen: event.timestamp,
              count: 1,
            });
            // Resolve tag in background
            resolveTag(collectionId, uid);
          }
          return next;
        });
      } else if (event.type === 'qr') {
        console.log('QR scanned:', event.data);
      }
    });

    return unsubscribe;
  }, [onSubscribeScannerEvents, collectionId, resolveTag]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Scanned Tags ({tags.size})</h2>
      {Array.from(tags.values()).map(tag => (
        <div key={tag.uid} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
          <strong>{tag.uid}</strong> × {tag.count}
          {tag.productName && <span> — {tag.productName}</span>}
          <span style={{ opacity: 0.5, marginLeft: 8 }}>{tag.source.toUpperCase()}</span>
        </div>
      ))}
      {tags.size === 0 && <p style={{ opacity: 0.5 }}>Waiting for scans...</p>}
    </div>
  );
}
```

---

## Best Practices

### Performance

- **Debounce UI updates** for RFID — you may receive 50+ events/second during active scanning
- **Use refs** for state accessed inside the event callback to avoid stale closures
- **Batch API calls** — use `SL.tags.lookupTags()` for batch resolution rather than one call per tag

### Data Resolution

- **Prefer collection-scoped lookups** — since you receive `collectionId` as a prop, always use `SL.tags.publicGetByCollection(collectionId, tagId)` for fast, direct resolution
- **Use `SL.tags.resolveTag` only as fallback** — for the rare case where a tag might belong to a different collection

### UX

- **Show scan feedback immediately** — display the raw UID before resolution completes
- **Handle key events thoughtfully** — the host already manages RFID start/stop via key 293; use key events for your own UI actions (confirm, navigate, toggle modes)
- **Support high-density scanning** — RFID use cases often involve scanning 50–100+ tags in a session

### Error Handling

- **Gracefully handle missing tags** — not every scanned EPC/UID will resolve to a SmartLinks tag
- **Network resilience** — tag resolution may fail; show cached/partial data and retry

### Bundle Size

- **Externalize shared dependencies** — never bundle React, SmartLinks SDK, or other shared libs
- **Keep containers focused** — a scanner container should do one thing well
