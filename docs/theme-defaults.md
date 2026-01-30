# SmartLinks Theme Default Colors

Default color values for the SmartLinks theme system. Use these when no theme is provided via URL parameter.

---

## Light Mode (Default)

| Theme Key | CSS Variable             | HSL Value           | RGB           | Hex       |
|-----------|--------------------------|---------------------|---------------|-----------|
| `bg`      | `--background`           | 0 0% 100%           | 255, 255, 255 | #FFFFFF   |
| `fg`      | `--foreground`           | 222.2 84% 4.9%      | 2, 8, 23      | #020817   |
| `p`       | `--primary`              | 222.2 47.4% 11.2%   | 15, 23, 42    | #0F172A   |
| `pf`      | `--primary-foreground`   | 210 40% 98%         | 248, 250, 252 | #F8FAFC   |
| `s`       | `--secondary`            | 210 40% 96.1%       | 241, 245, 249 | #F1F5F9   |
| `sf`      | `--secondary-foreground` | 222.2 47.4% 11.2%   | 15, 23, 42    | #0F172A   |
| `a`       | `--accent`               | 210 40% 96.1%       | 241, 245, 249 | #F1F5F9   |
| `af`      | `--accent-foreground`    | 222.2 47.4% 11.2%   | 15, 23, 42    | #0F172A   |
| `mt`      | `--muted`                | 210 40% 96.1%       | 241, 245, 249 | #F1F5F9   |
| `mf`      | `--muted-foreground`     | 215.4 16.3% 46.9%   | 100, 116, 139 | #64748B   |
| `bd`      | `--border`               | 214.3 31.8% 91.4%   | 226, 232, 240 | #E2E8F0   |
| `inp`     | `--input`                | 214.3 31.8% 91.4%   | 226, 232, 240 | #E2E8F0   |
| `ring`    | `--ring`                 | 222.2 84% 4.9%      | 2, 8, 23      | #020817   |

---

## Dark Mode

| Theme Key | CSS Variable             | HSL Value           | RGB           | Hex       |
|-----------|--------------------------|---------------------|---------------|-----------|
| `bg`      | `--background`           | 222.2 84% 4.9%      | 2, 8, 23      | #020817   |
| `fg`      | `--foreground`           | 210 40% 98%         | 248, 250, 252 | #F8FAFC   |
| `p`       | `--primary`              | 210 40% 98%         | 248, 250, 252 | #F8FAFC   |
| `pf`      | `--primary-foreground`   | 222.2 47.4% 11.2%   | 15, 23, 42    | #0F172A   |
| `s`       | `--secondary`            | 217.2 32.6% 17.5%   | 30, 41, 59    | #1E293B   |
| `sf`      | `--secondary-foreground` | 210 40% 98%         | 248, 250, 252 | #F8FAFC   |
| `a`       | `--accent`               | 217.2 32.6% 17.5%   | 30, 41, 59    | #1E293B   |
| `af`      | `--accent-foreground`    | 210 40% 98%         | 248, 250, 252 | #F8FAFC   |
| `mt`      | `--muted`                | 217.2 32.6% 17.5%   | 30, 41, 59    | #1E293B   |
| `mf`      | `--muted-foreground`     | 215 20.2% 65.1%     | 148, 163, 184 | #94A3B8   |
| `bd`      | `--border`               | 217.2 32.6% 17.5%   | 30, 41, 59    | #1E293B   |
| `inp`     | `--input`                | 217.2 32.6% 17.5%   | 30, 41, 59    | #1E293B   |
| `ring`    | `--ring`                 | 212.7 26.8% 83.9%   | 203, 213, 225 | #CBD5E1   |

---

## Non-Color Defaults

| Theme Key | CSS Variable    | Default Value                          |
|-----------|-----------------|----------------------------------------|
| `r`       | `--radius`      | 0.5rem                                 |
| `fn`      | `--font-family` | system-ui, -apple-system, sans-serif   |

---

## Quick Copy (JSON)

### Light Mode Defaults

```json
{
  "m": "l",
  "bg": "0 0% 100%",
  "fg": "222.2 84% 4.9%",
  "p": "222.2 47.4% 11.2%",
  "pf": "210 40% 98%",
  "s": "210 40% 96.1%",
  "sf": "222.2 47.4% 11.2%",
  "a": "210 40% 96.1%",
  "af": "222.2 47.4% 11.2%",
  "mt": "210 40% 96.1%",
  "mf": "215.4 16.3% 46.9%",
  "bd": "214.3 31.8% 91.4%",
  "inp": "214.3 31.8% 91.4%",
  "ring": "222.2 84% 4.9%",
  "r": "0.5rem"
}
```

### Dark Mode Defaults

```json
{
  "m": "d",
  "bg": "222.2 84% 4.9%",
  "fg": "210 40% 98%",
  "p": "210 40% 98%",
  "pf": "222.2 47.4% 11.2%",
  "s": "217.2 32.6% 17.5%",
  "sf": "210 40% 98%",
  "a": "217.2 32.6% 17.5%",
  "af": "210 40% 98%",
  "mt": "217.2 32.6% 17.5%",
  "mf": "215 20.2% 65.1%",
  "bd": "217.2 32.6% 17.5%",
  "inp": "217.2 32.6% 17.5%",
  "ring": "212.7 26.8% 83.9%",
  "r": "0.5rem"
}
```
