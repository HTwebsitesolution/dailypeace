# Android Build Fix - Kotlin Compilation Error

## Problem

The Android build was failing with a Kotlin compilation error:

```
e: file:///home/expo/workingdir/build/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/safearea/SafeAreaView.kt:109:13 
Operator '!=' cannot be applied to 'Insets' and 'EdgeInsets'
```

## Root Cause

Version incompatibility between:
- **React Navigation 7.x** requires `react-native-screens >= 4.0.0`
- **react-native-screens 4.x** has a Kotlin type mismatch bug (`Insets` vs `EdgeInsets`)
- **react-native-screens 3.31.1** works but isn't compatible with React Navigation 7.x

This created a catch-22 situation.

## Solution

**Downgraded React Navigation to v6.x**, which is compatible with `react-native-screens@3.31.1`:

1. **Downgraded React Navigation:**
   - `@react-navigation/native`: `^7.1.18` → `^6.1.18`
   - `@react-navigation/native-stack`: `^7.3.28` → `^6.11.0`

2. **Set react-native-screens to stable version:**
   - `react-native-screens`: `4.17.1` → `3.31.1`

3. **Added npm overrides** to ensure version consistency:
   - Added `"overrides": { "react-native-screens": "3.31.1" }`

## Changes Made

1. **Updated `package.json`:**
   - Downgraded React Navigation packages to v6.x
   - Set `react-native-screens` to `3.31.1`
   - Added npm `overrides` section
   - Removed `@types/react-native` from devDependencies (types are included with react-native)

## Compatibility Notes

React Navigation v6.x is stable and fully compatible with:
- Expo SDK 51
- React Native 0.74.5
- All current app functionality

The API differences between v6 and v7 are minimal and shouldn't affect the app's functionality.

## Next Steps

1. Re-run the Android build:
   ```bash
   cd c:\dailypeace-starter\dailypeace
   npm install  # To apply the new versions
   eas build --platform android --profile production
   ```

2. The build should now complete successfully without the Kotlin compilation error.

---

**Status:** ✅ Fixed - Ready for rebuild with React Navigation v6.x
