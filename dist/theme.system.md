# SmartLinks Theme System

Dynamic theming for SmartLinks iframe apps. Allows parent frames to pass branding configuration via URL parameters or postMessage.

## Quick Start

### URL Parameter (Recommended)

Pass a base64-encoded JSON theme in the `theme` parameter:

```
https://your-app.com/#/?collectionId=xyz&theme=eyJtIjoiZCIsInAiOiIyMTcgOTElIDYwJSJ9
```

### PostMessage (Live Updates)

```javascript
iframe.contentWindow.postMessage({
  type: 'smartlinks-theme',
  theme: {
    m: 'd',
    p: '217 91% 60%',
    fn: 'Inter',
    fu: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  }
}, '*');
```

---

## Theme Schema

### Property Reference

| Key    | CSS Variable             | Description                         | Example         |
| ------ | ------------------------ | ----------------------------------- | --------------- |
| `m`    | -                        | Mode: `'d'` (dark) or `'l'` (light) | `"d"`           |
| `bg`   | `--background`           | Background color                    | `"222 84% 5%"`  |
| `fg`   | `--foreground`           | Foreground/text color               | `"210 40% 98%"` |
| `p`    | `--primary`              | Primary brand color                 | `"217 91% 60%"` |
| `pf`   | `--primary-foreground`   | Text on primary                     | `"210 40% 98%"` |
| `s`    | `--secondary`            | Secondary color                     | `"217 33% 18%"` |
| `sf`   | `--secondary-foreground` | Text on secondary                   | `"210 40% 98%"` |
| `a`    | `--accent`               | Accent color                        | `"217 33% 18%"` |
| `af`   | `--accent-foreground`    | Text on accent                      | `"210 40% 98%"` |
| `mt`   | `--muted`                | Muted backgrounds                   | `"217 33% 18%"` |
| `mf`   | `--muted-foreground`     | Muted text                          | `"215 20% 65%"` |
| `bd`   | `--border`               | Border color                        | `"217 33% 18%"` |
| `inp`  | `--input`                | Input border color                  | `"217 33% 18%"` |
| `ring` | `--ring`                 | Focus ring color                    | `"213 27% 84%"` |
| `r`    | `--radius`               | Border radius                       | `"0.5rem"`      |
| `fn`   | `--font-family`          | Font family name                    | `"Inter"`       |
| `fu`   | -                        | Font URL (CSS or woff2)             | See below       |

### Color Format

**All colors must be raw HSL values** (no `hsl()` wrapper):

```
"217 91% 60%"     ✅ Correct
"hsl(217, 91%, 60%)"  ❌ Wrong
"#3b82f6"         ⚠️ Works (auto-converted) but HSL preferred
```

### Font Loading

The `fu` property supports:

1. **Google Fonts CSS URL**:

   ```
   https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
   ```

2. **Direct font file URL**:
   ```
   https://example.com/fonts/custom-font.woff2
   ```

---

## Example Themes

### Dark Theme with Custom Font

```json
{
  "m": "d",
  "bg": "222 84% 5%",
  "fg": "210 40% 98%",
  "p": "217 91% 60%",
  "pf": "210 40% 98%",
  "s": "217 33% 18%",
  "sf": "210 40% 98%",
  "bd": "217 33% 18%",
  "r": "0.75rem",
  "fn": "Inter",
  "fu": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
}
```

Base64 encoded:

```
eyJtIjoiZCIsImJnIjoiMjIyIDg0JSA1JSIsImZnIjoiMjEwIDQwJSA5OCUiLCJwIjoiMjE3IDkxJSA2MCUiLCJwZiI6IjIxMCA0MCUgOTglIiwicyI6IjIxNyAzMyUgMTglIiwic2YiOiIyMTAgNDAlIDk4JSIsImJkIjoiMjE3IDMzJSAxOCUiLCJyIjoiMC43NXJlbSIsImZuIjoiSW50ZXIiLCJmdSI6Imh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9SW50ZXI6d2dodEA0MDA7NTAwOzYwMDs3MDAmZGlzcGxheT1zd2FwIn0=
```

### Light Theme (Minimal)

```json
{
  "m": "l",
  "p": "221 83% 53%",
  "r": "0.5rem"
}
```

Base64 encoded:

```
eyJtIjoibCIsInAiOiIyMjEgODMlIDUzJSIsInIiOiIwLjVyZW0ifQ==
```

---

## Integration

### Files Required

Copy these files to your SmartLinks app:

1. **`src/utils/theme.ts`** - Core theme utilities
2. **`src/hooks/useSmartLinksTheme.ts`** - React hook for state management

### Setup Steps

#### 1. Update `index.html`

Add this inline script in `<body>` before your app script. **CRITICAL**: This handles both CSS font URLs (Google Fonts) AND direct font files (.otf, .ttf, .woff, .woff2):

```html
<script>
  // Early theme application to prevent flash
  (function() {
    try {
      function getThemeParam() {
        var search = window.location.search;
        var hash = window.location.hash;

        var searchParams = new URLSearchParams(search);
        if (searchParams.get('theme')) return searchParams.get('theme');

        if (hash && hash.indexOf('?') !== -1) {
          var hashParams = new URLSearchParams(hash.substring(hash.indexOf('?')));
          if (hashParams.get('theme')) return hashParams.get('theme');
        }
        return null;
      }

      function applyEarlyTheme(theme) {
        var root = document.documentElement;

        // Apply dark/light mode
        if (theme.m === 'd') root.classList.add('dark');
        else if (theme.m === 'l') root.classList.remove('dark');

        // CSS variable mapping
        var props = {
          bg: '--background', fg: '--foreground',
          p: '--primary', pf: '--primary-foreground',
          s: '--secondary', sf: '--secondary-foreground',
          a: '--accent', af: '--accent-foreground',
          mt: '--muted', mf: '--muted-foreground',
          bd: '--border', inp: '--input', ring: '--ring', r: '--radius'
        };

        // Apply CSS variables
        for (var key in props) {
          if (theme[key]) root.style.setProperty(props[key], theme[key]);
        }

        // Load custom font - IMPORTANT: handle both CSS and direct font files
        if (theme.fn) {
          root.style.setProperty('--font-family', "'" + theme.fn + "', system-ui, sans-serif");
          if (theme.fu) {
            var fontUrl = theme.fu;

            // Check if it's a CSS file (Google Fonts, etc.)
            if (fontUrl.indexOf('fonts.googleapis.com') !== -1 || fontUrl.indexOf('.css') !== -1) {
              // CSS file - inject as stylesheet link
              var link = document.createElement('link');
              link.id = 'smartlinks-custom-font';
              link.rel = 'stylesheet';
              link.href = fontUrl;
              document.head.appendChild(link);
            } else {
              // Direct font file (.otf, .ttf, .woff, .woff2) - inject @font-face
              var format = 'opentype'; // default for .otf
              var lowerUrl = fontUrl.toLowerCase();
              if (lowerUrl.indexOf('.woff2') !== -1) format = 'woff2';
              else if (lowerUrl.indexOf('.woff') !== -1) format = 'woff';
              else if (lowerUrl.indexOf('.ttf') !== -1) format = 'truetype';
              else if (lowerUrl.indexOf('.otf') !== -1) format = 'opentype';

              var style = document.createElement('style');
              style.id = 'smartlinks-custom-font';
              style.textContent = "@font-face { font-family: '" + theme.fn + "'; src: url('" + fontUrl + "') format('" + format + "'); font-weight: 100 900; font-display: swap; }";
              document.head.appendChild(style);
            }
          }
        }
      }

      var themeParam = getThemeParam();
      if (themeParam) {
        var theme = JSON.parse(atob(themeParam));
        applyEarlyTheme(theme);
      }
    } catch(e) {
      console.warn('Early theme application failed:', e);
    }
  })();
</script>
```

#### Key Font Loading Logic

The script must handle two types of font URLs differently:

| Font URL Type      | Example                                  | Loading Method                      |
| ------------------ | ---------------------------------------- | ----------------------------------- |
| Google Fonts / CSS | `fonts.googleapis.com/css2?family=Inter` | `<link rel="stylesheet">`           |
| Direct font file   | `cdn.example.com/font.otf`               | `<style>@font-face { ... }</style>` |

**Font Format Mapping** (for `@font-face`):

| Extension | Format Value |
| --------- | ------------ |
| `.otf`    | `opentype`   |
| `.ttf`    | `truetype`   |
| `.woff`   | `woff`       |
| `.woff2`  | `woff2`      |

#### 2. Update `src/index.css`

Add the font-family variable:

```css
:root {
  --font-family: system-ui, -apple-system, sans-serif;
  /* ... other variables ... */
}

body {
  font-family: var(--font-family);
}
```

#### 3. Use the Hook in App.tsx

```tsx
import { useSmartLinksTheme } from '@/hooks/useSmartLinksTheme';

const AppContent = () => {
  // Initialize theme system (handles URL params and postMessage)
  useSmartLinksTheme();

  // ... rest of your app
};
```

---

## PostMessage Protocol

### Theme Push (Parent → Iframe)

```javascript
iframe.contentWindow.postMessage({
  type: 'smartlinks-theme',
  theme: { m: 'd', p: '217 91% 60%' }
}, '*');
```

### Acknowledgment (Iframe → Parent)

The app automatically sends acknowledgment when theme is applied:

```javascript
// Listen in parent
window.addEventListener('message', (event) => {
  if (event.data.type === 'smartlinks-theme-applied') {
    console.log('Theme applied:', event.data.success);
  }
});
```

---

## Utilities

### Encode Theme (for testing)

```typescript
import { encodeTheme } from '@/utils/theme';

const theme = { m: 'd', p: '217 91% 60%' };
const encoded = encodeTheme(theme);
// Use: ?theme=encoded
```

### Manual Theme Application

```typescript
import { applyTheme } from '@/utils/theme';

applyTheme({
  m: 'd',
  p: '217 91% 60%',
  fn: 'Inter',
  fu: 'https://fonts.googleapis.com/css2?family=Inter'
});
```

---

## URL Length Considerations

- Safe URL limit: ~2,000 characters
- Typical theme JSON: 300-500 characters
- Base64 overhead: ~33% increase
- **Result**: Standard themes safely fit within limits

To minimize size:

- Only include properties that differ from defaults
- Use short HSL values where possible
- Omit font URL if using system fonts
