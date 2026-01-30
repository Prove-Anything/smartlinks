# SmartLinks Widget System

This document covers the widget system that allows SmartLinks apps to expose embeddable React components for use in parent applications (like a SmartLinks portal or homepage).

---

## Overview

Widgets are self-contained React components that:
- Run inside the parent React application (not iframes)
- Receive standardized context props
- Inherit styling from the parent via CSS variables
- Can trigger navigation to the full app

```text
┌─────────────────────────────────────────────────────────────────┐
│ Parent SmartLinks Portal (React 18)                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Competition  │  │ Music App    │  │ Warranty     │          │
│  │ Widget       │  │ Widget       │  │ Widget       │          │
│  │ (ESM import) │  │ (ESM import) │  │ (ESM import) │          │
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
  onNavigate?: (path: string) => void;
  
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
| `onNavigate` | `function?` | Callback to navigate within parent app |
| `publicPortalUrl` | `string?` | Base URL to full portal for deep links |
| `size` | `string?` | Size hint: 'compact', 'standard', or 'large' |
| `lang` | `string?` | Language code (e.g., 'en', 'de', 'fr') |
| `translations` | `object?` | Translation overrides |

### Navigation: onNavigate vs publicPortalUrl

Widgets support two navigation patterns:

**`onNavigate` (parent-controlled)**
- Parent provides a callback to handle navigation
- Widget passes a relative path (e.g., `/#/?collectionId=x&tab=details`)
- Parent decides what to do (router push, open modal, etc.)

**`publicPortalUrl` (direct redirect)**
- Widget knows the full URL to the public portal
- Uses `SL.iframe.redirectParent()` for navigation
- Automatically handles iframe escape via postMessage
- Useful when widget needs to break out of nested iframes

**Priority:** If both are provided, `onNavigate` takes precedence.

```typescript
// Parent provides callback
<MyWidget
  onNavigate={(path) => router.push(path)}
  // ...
/>

// Widget uses direct redirect
<MyWidget
  publicPortalUrl="https://my-app.smartlinks.io"
  // ...
/>
```

---

## Building a Widget

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
  publicPortalUrl,
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

  // Navigate to full app (supports both patterns)
  const handleOpenApp = () => {
    const params = new URLSearchParams({ collectionId, appId });
    if (productId) params.set('productId', productId);
    const relativePath = `/#/?${params.toString()}`;
    
    if (onNavigate) {
      // Parent-controlled navigation
      onNavigate(relativePath);
    } else if (publicPortalUrl) {
      // Direct redirect (handles iframe escape automatically)
      SL.iframe.redirectParent(`${publicPortalUrl}${relativePath}`);
    }
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
        <Button onClick={handleOpenApp}>Open App</Button>
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
      {/* Option 1: Parent controls navigation */}
      <CompetitionWidget
        collectionId="abc123"
        appId="competition"
        user={currentUser}
        SL={SL}
        onNavigate={(path) => window.open(`https://competition-app.example.com${path}`)}
        size="standard"
      />
      
      {/* Option 2: Widget handles its own navigation */}
      <CompetitionWidget
        collectionId="abc123"
        appId="competition"
        user={currentUser}
        SL={SL}
        publicPortalUrl="https://competition-app.example.com"
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
- ✅ Provide meaningful navigation via `onNavigate`

### Don'ts

- ❌ Don't bundle React or SmartLinks SDK
- ❌ Don't use hardcoded colors
- ❌ Don't assume specific viewport sizes
- ❌ Don't make widgets too complex (use full app for that)
- ❌ Don't store state that should persist (use parent or SDK)

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
├── types.ts              # SmartLinksWidgetProps and related types
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
