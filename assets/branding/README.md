# Daily Peace Brand Assets

This folder contains the complete branding export pack for Daily Peace.

## Folder Structure

```
/branding/
├── icons/          # App icons for iOS, Android, Web, PWA
├── splash/         # Splash screens, heroes, OG images
├── wordmark/       # Horizontal wordmark layouts
└── README.md       # This file
```

## Tier 1 — App Icons (Simplified Circular Emblem)

**Purpose:** iOS, Android, favicon, PWA manifest

**Composition:**
- Circle wave + cross + "Daily Peace" text only
- Remove book spine and ribbon for clarity
- Keep gradient background (dark blue → ocean blue)

### Files Required

| Platform | Size (px) | Filename | Status |
|----------|-----------|----------|--------|
| iOS App | 1024×1024 | `icon-ios.png` | ✅ Exists |
| Android App | 512×512 | `icon-android.png` | ✅ Exists |
| Web Favicon | 180×180, 96×96, 32×32 | `favicon.png` | ✅ Exists |

**Background Gradient:**
```css
linear-gradient(145deg, #0B1016 0%, #1E2A3A 60%, #0C5F95 100%)
```

---

## Tier 2 — Full "Book + Cross" Version

**Purpose:** Splash screen, intro hero, website header

**Composition:**
- Entire book, cross, bookmark, and circle emblem
- Subtle light bloom/halo behind the cross

### Files Required

| Platform | Size (px) | Filename | Status |
|----------|-----------|----------|--------|
| Splash Screen | 2732×2732 | `splash.png` | ⚠️ Need `splash-dailypeace.png` |
| Website Hero | 2000×1125 | `hero-logo.png` | ❌ Missing |
| OG Image | 1200×630 | `og-image.png` | ❌ Missing |

**Background Gradient:**
```css
linear-gradient(180deg, #0B1016 0%, #1A2330 40%, #254A7B 100%)
```

**Note:** Currently using `splash-dailypeace.png` for splash screen.

---

## Tier 3 — Wordmark + Icon Combo

**Purpose:** Website navbar, marketing cards, footer

**Composition:**
- Circle emblem on left
- "Daily Peace" text on right (Inter SemiBold 700 or DM Sans Bold)
- Tagline below: "Find peace and hope from Scripture ✨"

### Files Required

| Platform | Size (px) | Filename | Status |
|----------|-----------|----------|--------|
| Web Navbar | 512×128 | `wordmark-light.png` | ❌ Missing |
| Footer / Light BG | 512×128 | `wordmark-dark.png` | ❌ Missing |
| Print / Vector | scalable | `wordmark.svg` | ❌ Missing |

---

## Color Palette

| Element | Color | Use |
|---------|-------|-----|
| Ocean Base | `#0B1016` | Primary dark |
| Deep Wave | `#1F3A60` | Mid tone |
| Highlight Wave | `#2F70A6` | Accent |
| Cross | `#FFFFFF` | Always pure white |
| Sunset | `#FF7F50 → #FDB813` | Gradient stop |
| Bookmark | `#E63946` | Brand accent |

---

## Integration

### Expo (app.json)
```json
{
  "icon": "./assets/branding/icons/icon-ios.png",
  "splash": {
    "image": "./assets/branding/splash/splash-dailypeace.png",
    "resizeMode": "contain",
    "backgroundColor": "#0B1016"
  },
  "web": {
    "favicon": "./assets/branding/icons/favicon.png"
  }
}
```

### Netlify / Landing Page
```html
<link rel="icon" href="/assets/branding/icons/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/branding/icons/icon-web.png">
<meta property="og:title" content="Daily Peace">
<meta property="og:description" content="Find peace and hope from Scripture ✨">
<meta property="og:image" content="/assets/branding/splash/og-image.png">
<meta name="theme-color" content="#0B1016">
```

---

## Export Checklist

- [ ] Create 1024×1024 icon-ios.png (circle only)
- [ ] Create 512×512 icon-android.png (square crop)
- [ ] Create 512×512 icon-web.png for PWA
- [ ] Create favicon.png (multi-size: 180, 96, 32)
- [ ] Create 2732×2732 splash-dailypeace.png (full book)
- [ ] Create 2000×1125 hero-logo.png
- [ ] Create 1200×630 og-image.jpg
- [ ] Create 512×128 wordmark-light.png
- [ ] Create 512×128 wordmark-dark.png
- [ ] Create wordmark.svg (vector)

---

## Notes

- All PNG files should use transparent backgrounds where appropriate
- Favicon can be ICO format for better browser support
- Wordmark SVGs should have outlined text paths for maximum compatibility
- OG images should be JPG for better compression on social platforms

