# Visibility & Readability Reference Point

**Date:** 2025-01-XX  
**Status:** ✅ Reference Implementation

## Current Settings Summary

### Background Image Settings
```typescript
// AtmosphericBackground.tsx
imageStyle={{
  opacity: 0.75,  // High opacity - images clearly visible
}}

// Overlay settings
backgroundColor: 'rgba(0,0,0,0.45)',  // ~45% dark overlay
```

### Text Styling (HomeScreen)
- **Main Title:** 52px, weight 900, white with subtle text shadow
- **Subtitle:** 24px, weight 600, white
- **Button:** 22px, weight 800, with text shadow

### ReflectionCard Settings
- **Background:** `rgba(20,27,35,0.95)` - very dark, opaque card
- **Header:** `rgba(35,48,63,0.90)` - elevated glass strip
- **Border:** `rgba(255,255,255,0.15)` - subtle border
- **Scripture Text:** 18px, weight 400, white
- **Verse Badges:** 13px, color #A5B4FC

## Balance Achieved

✅ **Background images are clearly visible** (75% opacity)  
✅ **Text is highly readable** (dark card backgrounds provide contrast)  
✅ **Good visual hierarchy** (dark cards pop against lighter backgrounds)  
✅ **Professional appearance** (glass-pro style cards)

## Key Design Pattern

The solution uses:
1. **Visible background images** with 75% opacity
2. **Moderate dark overlay** (45%) for overall tone
3. **Opaque dark cards** (95% opacity) for content
4. **Strong text contrast** within the dark cards

This creates a "window through" effect where beautiful backgrounds show through, while content remains perfectly readable on solid dark surfaces.

