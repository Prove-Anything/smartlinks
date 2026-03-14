# SmartLinks Widget System

This document covers the widget system that allows SmartLinks apps to expose embeddable React components for use in parent applications (like a SmartLinks portal or homepage).

---

## Overview

Widgets are self-contained React components that:
- Run inside the parent React application (not iframes)
- Receive standardized context props
- Inherit styling from the parent via CSS variables
- Can trigger structured cross-app navigation within the parent portal

```text
┌─────────────────────────────────────────────────────────────────┐
│ Parent SmartLinks Portal (React 18)                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Competition  │  │ Music App    │  │ Warranty     │          │
│  │ Widget       │  │ (ESM import) │  │ Widget       │          │
│  │ (ESM import) │  │              │  │ (ESM import) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         ↑                 ↑                 ↑                   │
│         │                 │                 │                   │
│   Props + SL SDK    Props + SL SDK    Props + SL SDK           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Widget Props Interface

All widgets receive the `SmartLinksWidgetProps` interface:

```typescript
interface SmartLinksWidgetProps {
  // Required context
  collectionId: string;
  appId: string;
  
  // Optional context
  productId?: string;
  proofId?: string;
  
  // User info (if logged in)
  user?: {
    id?: string;
    email?: string;
    name?: string;
    admin?: boolean;
  };
  
  // SmartLinks SDK (pre-initialized by parent)
  SL: typeof import('@proveanything/smartlinks');
  
  // Callback to navigate within the parent application
  onNavigate?: (request: NavigationRequest | string) => void;
  
  // Base URL to the full public portal for deep linking
  publicPortalUrl?: string;
  
  // Size hint for responsive rendering
  size?: 'compact' | 'standard' | 'large';
  
  // Internationalization
  lang?: string;
  translations?: Record<string, string>;
}
```

### Props Explained

| Prop | Type | Description |
|------|------|-------------|
| `collectionId` | `string` | The collection context (required) |
| `appId` | `string` | This app's identifier (required) |
| `productId` | `string?` | Optional product context |
| `proofId` | `string?` | Optional proof context |
| `user` | `object?` | Current user info if authenticated |
| `SL` | `typeof SL` | Pre-initialized SmartLinks SDK |
| `onNavigate` | `function?` | Callback to navigate within parent app (accepts `NavigationRequest` or legacy string) |
| `publicPortalUrl` | `string?` | Base URL to full portal for deep links |
| `size` | `string?` | Size hint: 'compact', 'standard', or 'large' |
| `lang` | `string?` | Language code (e.g., 'en', 'de', 'fr') |
| `translations` | `object?` | Translation overrides |

---

## Cross-App Navigation

Widgets can navigate to other apps within the portal using **structured navigation requests**. This allows a widget to say "open app X with these parameters" without knowing the portal's URL structure or hierarchy state. The portal orchestrator receives the request, preserves the current context (collection, product, proof, theme, auth), and performs the actual navigation.

### NavigationRequest

```typescript
interface NavigationRequest {
  /** Target app ID to activate */
  appId: string;
  /** Deep link / page within the target app (forwarded as pageId) */
  deepLink?: string;
  /** Extra params forwarded to the target app (e.g. { campaignId: '123' }) */
  params?: Record<string, string>;
  /** Optionally switch to a specific product before showing the app */
  productId?: string;
  /** Optionally switch to a specific proof before showing the app */
  proofId?: string;
}
```

### Usage Examples

```typescript
const MyWidget: React.FC<SmartLinksWidgetProps> = ({ onNavigate, ...props }) => {

  // Navigate to another app, keeping current context
  const handleEnterCompetition = () => {
    onNavigate?.({
      appId: 'competition-app',
      deepLink: 'enter',
      params: { campaignId: '123', ref: 'widget' },
    });
  };

  // Navigate to a specific product's app
  const handleViewProduct = (productId: string) => {
    onNavigate?.({
      appId: 'product-info',
      productId,
    });
  };

  // Navigate to a proof-level app
  const handleViewWarranty = (proofId: string) => {
    onNavigate?.({
      appId: 'warranty-app',
      proofId,
      productId: 'prod-123', // required when jumping to proof level
    });
  };

  return (
    <Card>
      <Button onClick={handleEnterCompetition}>Enter Competition</Button>
      <Button onClick={() => handleViewProduct('prod-456')}>View Product</Button>
    </Card>
  );
};
```

### How It Works End-to-End

```text
Widget clicks "Enter Competition"
  → onNavigate({ appId: 'competition', deepLink: 'enter', params: { ref: 'widget' } })
  → Portal orchestrator receives NavigationRequest
  → Calls actions.navigateToApp('competition', 'enter')
  → Orchestrator renders the target app with extraParams: { pageId: 'enter', ref: 'widget' }
  → Current collectionId, productId, proofId, theme all preserved automatically
```

### Backward Compatibility

The `onNavigate` callback accepts both structured `NavigationRequest` objects and legacy strings. Existing widgets that call `onNavigate('/some-path')` continue to work — the portal treats plain strings as legacy no-ops and logs them for debugging.

**New widgets should always use the structured `NavigationRequest` format.**

### onNavigate vs publicPortalUrl

Widgets support two navigation patterns:

**`onNavigate` (parent-controlled, recommended)**
- Parent provides a callback that the orchestrator interprets
- Widget emits a structured `NavigationRequest`
- Portal handles hierarchy transitions, context preservation, and routing

**`publicPortalUrl` (direct redirect, escape hatch)**
- Widget knows the full URL to the public portal
- Uses `SL.iframe.redirectParent()` for navigation
- Automatically handles iframe escape via postMessage
- Useful when widget needs to break out of nested iframes

**Priority:** If both are provided, `onNavigate` takes precedence.

```typescript
// Recommended: structured navigation
<MyWidget
  onNavigate={(request) => {
    // Portal orchestrator handles this automatically
    // when using ContentOrchestrator / OrchestratedPortal
  }}
/>

// Escape hatch: direct redirect
<MyWidget
  publicPortalUrl="https://my-app.smartlinks.io"
/>
```

---

## Building a Widget

---

## Widget Instance Resolution

Some apps expose a **widget resolver** instead of a single hard-coded widget. The resolver receives a `widgetId`, looks up a stored instance in app config, and renders the correct widget with its saved settings.

This pattern is useful for widget toolkits, promo blocks, countdown libraries, CTA collections, and any app where admins create multiple reusable widget instances.

### URL and embed convention

Use `widgetId` the same way page-oriented apps use `pageId`:

```text
?appId=widget-toolkit&widgetId=launch-countdown
```

This works naturally in:

- direct container or iframe links
- widget-to-widget references
- content slots that need to embed a preconfigured widget instance
- platform deep-link routing when the manifest declares widget instance resolution

### Manifest declaration

Declare support in `app.manifest.json`:

```json
{
  "widgets": {
    "instanceResolution": true,
    "instanceParam": "widgetId",
    "files": {
      "js": {
        "umd": "dist/widgets.umd.js",
        "esm": "dist/widgets.es.js"
      },
      "css": null
    },
    "components": [
      {
        "name": "WidgetToolkitResolver",
        "description": "Resolves and renders widget instances by ID."
      }
    ]
  }
}
```

### SDK helpers

The SDK now includes two thin helpers on `SL.appConfiguration`:

```typescript
const widget = await SL.appConfiguration.getWidgetInstance({
  collectionId,
  appId: 'widget-toolkit',
  widgetId: 'launch-countdown',
})

const widgets = await SL.appConfiguration.listWidgetInstances({
  collectionId,
  appId: 'widget-toolkit',
})
```

`getWidgetInstance()` is intentionally just a wrapper over `getConfig()` that reads `config.widgets[widgetId]`. That keeps the integration simple today while giving the platform freedom to optimize the lookup later.

### Stored config shape

The recommended storage shape is:

```json
{
  "widgets": {
    "launch-countdown": {
      "id": "launch-countdown",
      "name": "Launch Countdown",
      "widget": {
        "type": "countdown",
        "targetDate": "2026-06-01T00:00:00Z",
        "label": "Launching in..."
      }
    }
  }
}
```

### Resolver pattern

```typescript
const WidgetToolkitResolver: React.FC<SmartLinksWidgetProps & { widgetId?: string }> = ({
  collectionId,
  appId,
  widgetId,
  SL,
  ...props
}) => {
  const [instance, setInstance] = React.useState<any | null>(null)

  React.useEffect(() => {
    if (!widgetId) return
    SL.appConfiguration.getWidgetInstance({ collectionId, appId, widgetId })
      .then(setInstance)
      .catch(console.error)
  }, [collectionId, appId, widgetId, SL])

  if (!widgetId || !instance) return null

  switch (instance.widget?.type) {
    case 'countdown':
      return <CountdownWidget {...props} {...instance.widget} />
    case 'cta-button':
      return <CtaButtonWidget {...props} {...instance.widget} />
    default:
      return null
  }
}
```

### Listing widget instances

`listWidgetInstances()` is useful for picker UIs and cross-app references:

```typescript
const options = await SL.appConfiguration.listWidgetInstances({
  collectionId,
  appId: 'widget-toolkit',
})

// [{ id: 'launch-countdown', name: 'Launch Countdown', type: 'countdown' }]
```

This is a good foundation for future admin question types or dynamic selects, but the SDK does not currently define a built-in `dynamic-select` schema field.

### 1. Create the Widget Component

```typescript
// src/widgets/MyWidget/MyWidget.tsx
import { SmartLinksWidgetProps } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const MyWidget: React.FC<SmartLinksWidgetProps> = ({
  collectionId,
  appId,
  productId,
  user,
  SL,
  onNavigate,
  size = 'standard'
}) => {
  // Use the SL SDK for API calls
  const handleAction = async () => {
    const data = await SL.appConfiguration.getConfig({
      collectionId,
      appId
    });
    console.log('Config:', data);
  };

  // Navigate to another app using structured request
  const handleOpenFullApp = () => {
    onNavigate?.({
      appId,
      deepLink: 'details',
      params: { source: 'widget' },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Widget</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Widget content goes here
        </p>
        <Button onClick={handleOpenFullApp}>Open App</Button>
      </CardContent>
    </Card>
  );
};
```

### 2. Create the Index File

```typescript
// src/widgets/MyWidget/index.tsx
export { MyWidget } from './MyWidget';
```

### 3. Export from Widget Barrel

```typescript
// src/widgets/index.ts
export { MyWidget } from './MyWidget';

// Update the manifest
export const WIDGET_MANIFEST = {
  version: '1.0.0',
  reactVersion: '18.x',
  widgets: [
    // ... existing widgets
    {
      name: 'MyWidget',
      description: 'Description of my widget',
      sizes: ['compact', 'standard', 'large']
    }
  ]
};
```

---

## Size Modes

Widgets should support three size modes:

| Size | Use Case | Typical Height |
|------|----------|----------------|
| `compact` | Sidebar, small spaces | 80-120px |
| `standard` | Default widget display | 150-250px |
| `large` | Featured/expanded view | 300px+ |

```typescript
const MyWidget: React.FC<SmartLinksWidgetProps> = ({ size = 'standard' }) => {
  const isCompact = size === 'compact';
  const isLarge = size === 'large';

  return (
    <Card className={isCompact ? 'p-2' : ''}>
      <CardHeader className={isCompact ? 'pb-2' : ''}>
        <CardTitle className={isCompact ? 'text-sm' : 'text-lg'}>
          Widget Title
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLarge && (
          <p>Additional content shown only in large mode</p>
        )}
        <Button size={isCompact ? 'sm' : 'default'}>
          Action
        </Button>
      </CardContent>
    </Card>
  );
};
```

---

## Building Widget Bundle

The project includes a separate Vite config for building widgets:

```bash
# Build widgets only
vite build --config vite.config.widget.ts

# Output: dist/widgets.es.js
```

### Build Configuration

The widget build:
- Outputs ESM format for modern browsers
- Externalizes dependencies the parent already provides (see below)
- Generates source maps for debugging
- Minifies with esbuild for production
- Outputs to `/dist` alongside the main app (not a separate folder)

### Externalized Dependencies (Peer Dependencies)

The widget bundle does **not** include these libraries—the parent app must provide them:

| Package | Why Externalized |
|---------|------------------|
| `react`, `react-dom` | Parent's React context |
| `@proveanything/smartlinks` | Passed via props as `SL` |
| `tailwind-merge` | Utility for merging Tailwind classes |
| `clsx` | Utility for conditional class names |
| `class-variance-authority` | Utility for component variants |

These are standard packages that any modern React + Tailwind app will have. Externalizing them:
1. Reduces bundle size significantly
2. Removes JSDoc comments that inflate the bundle
3. Ensures consistent behavior with parent's versions

### Enabling Widget Builds

Widget builds are disabled by default to keep builds fast. To enable:

1. Add to `.env`:
   ```
   VITE_ENABLE_WIDGETS=true
   ```

2. The build script should be: `vite build && vite build --config vite.config.widget.ts`

If `VITE_ENABLE_WIDGETS` is not set to `true`, the build produces a minimal stub file and skips quickly.

---

## Parent Integration

### Dynamic Import

```typescript
// In parent SmartLinks portal
import { lazy, Suspense } from 'react';
import * as SL from '@proveanything/smartlinks';

// Dynamic import from app's CDN
const CompetitionWidget = lazy(() => 
  import('https://competition-app.example.com/widgets.es.js')
    .then(m => ({ default: m.CompetitionWidget }))
);

function Portal() {
  return (
    <Suspense fallback={<WidgetSkeleton />}>
      <CompetitionWidget
        collectionId="abc123"
        appId="competition"
        user={currentUser}
        SL={SL}
        onNavigate={(request) => {
          // The portal orchestrator handles NavigationRequest objects
          // automatically when using ContentOrchestrator / OrchestratedPortal
        }}
        size="standard"
      />
    </Suspense>
  );
}
```

### Using WidgetWrapper

The `WidgetWrapper` component provides error boundary and loading handling:

```typescript
import { WidgetWrapper, CompetitionWidget } from 'competition-app/widgets';

<WidgetWrapper
  loading={<CustomLoader />}
  error={<CustomError />}
>
  <CompetitionWidget {...props} />
</WidgetWrapper>
```

### Checking Compatibility

```typescript
import { WIDGET_MANIFEST } from 'competition-app/widgets';

// Verify React version compatibility
if (!WIDGET_MANIFEST.reactVersion.startsWith('18')) {
  console.warn('Widget React version mismatch');
}

// List available widgets
console.log('Available widgets:', WIDGET_MANIFEST.widgets);
```

---

## Styling

Widgets inherit styling from the parent application via CSS variables:

```css
/* Parent defines these in their index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  /* ... etc */
}
```

Widgets use semantic class names that reference these variables:

```tsx
// ✅ DO: Use semantic classes
<div className="bg-background text-foreground">
<p className="text-muted-foreground">
<Button className="bg-primary text-primary-foreground">

// ❌ DON'T: Use hardcoded colors
<div className="bg-white text-black">
<p className="text-gray-500">
<Button className="bg-blue-500 text-white">
```

---

## Best Practices

### Do's

- ✅ Keep widgets focused and single-purpose
- ✅ Support all three size modes
- ✅ Use semantic color classes for theming
- ✅ Handle loading and error states gracefully
- ✅ Use the provided `SL` SDK for API calls
- ✅ Use structured `NavigationRequest` for cross-app navigation
- ✅ Include `params` for any extra context the target app needs

### Don'ts

- ❌ Don't bundle React or SmartLinks SDK
- ❌ Don't use hardcoded colors
- ❌ Don't assume specific viewport sizes
- ❌ Don't make widgets too complex (use full app for that)
- ❌ Don't store state that should persist (use parent or SDK)
- ❌ Don't construct portal URLs manually — use `NavigationRequest` instead

---

## Widget Manifest

Each app exports a `WIDGET_MANIFEST` for discovery:

```typescript
export const WIDGET_MANIFEST = {
  version: '1.0.0',        // Widget bundle version
  reactVersion: '18.x',    // Required React version
  widgets: [
    {
      name: 'ExampleWidget',
      description: 'Demo widget showing SmartLinks integration',
      sizes: ['compact', 'standard', 'large']
    }
  ]
};
```

Parent applications can use this manifest to:
- Verify version compatibility
- Discover available widgets
- Show widget descriptions in UI

---

## Testing Widgets Locally

During development, you can test widgets within the app itself:

```typescript
// In a development page
import { ExampleWidget } from '@/widgets';
import * as SL from '@proveanything/smartlinks';

function WidgetTestPage() {
  return (
    <div className="p-8 space-y-8">
      <h2>Compact</h2>
      <ExampleWidget
        collectionId="test"
        appId="example"
        SL={SL}
        size="compact"
      />
      
      <h2>Standard</h2>
      <ExampleWidget
        collectionId="test"
        appId="example"
        SL={SL}
        size="standard"
      />
      
      <h2>Large</h2>
      <ExampleWidget
        collectionId="test"
        appId="example"
        SL={SL}
        size="large"
      />
    </div>
  );
}
```

---

## File Structure

```
src/widgets/
├── index.ts              # Main exports barrel
├── types.ts              # SmartLinksWidgetProps, NavigationRequest, and related types
├── WidgetWrapper.tsx     # Error boundary + Suspense wrapper
└── ExampleWidget/
    ├── index.tsx         # Re-export
    └── ExampleWidget.tsx # Widget implementation
```

When creating new widgets, follow this structure:
1. Create a folder: `src/widgets/MyWidget/`
2. Add component: `MyWidget.tsx`
3. Add re-export: `index.tsx`
4. Export from: `src/widgets/index.ts`
5. Add to: `WIDGET_MANIFEST`
