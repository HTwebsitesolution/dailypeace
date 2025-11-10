# Permissions Fix - No Permissions on App Launch

## Issue
Google Play Store may reject apps that request sensitive permissions (microphone, notifications) immediately on app launch. Permissions should only be requested when the user explicitly tries to use a feature.

## Fixes Applied

### ✅ 1. Notification Permissions
**Before:** `notifications.initialize()` requested permissions on app startup  
**After:** 
- `initialize()` only checks existing permissions and sets up Android channel
- New `requestPermissions()` method for user-initiated requests
- Permissions only requested when:
  - User enables notifications in Settings (toggle switch)
  - User completes onboarding and chooses a reminder time

**Files Changed:**
- `lib/notifications.ts` - Split initialization and permission request
- `app/index.tsx` - Still calls `initialize()` but it no longer requests permissions
- `app/components/OnboardingModal.tsx` - Uses `requestPermissions()` when user chooses reminder
- `app/screens/SettingsScreen.tsx` - Already correct (requests on toggle)

### ✅ 2. Audio/Microphone Permissions
**Before:** `ChatScreen` requested audio permissions on mount  
**After:** 
- Removed `requestPermissions()` call from `ChatScreen` useEffect
- Permissions now only requested when user presses microphone button
- `MicButton` component already handles this correctly (requests on `onPressIn`)

**Files Changed:**
- `app/screens/ChatScreen.tsx` - Removed permission request from mount

### ✅ 3. Expo SDK & Android SDK Alignment
**Status:** ✅ Already Correct

- **Expo SDK:** `^54.0.22` (SDK 54) ✅
- **Android SDK:** 
  - `targetSdkVersion: 35` ✅
  - `compileSdkVersion: 35` ✅
  - `buildToolsVersion: "35.0.0"` ✅
- **Configuration:** Set in `expo-build-properties` plugin ✅

**Files Verified:**
- `package.json` - Expo version correct
- `app.json` - Android SDK settings correct
- `eas.json` - Build configuration correct

## Testing Checklist

Before rebuilding AAB, verify:

- [ ] App launches without requesting any permissions
- [ ] Notification permission only requested when user toggles switch in Settings
- [ ] Microphone permission only requested when user presses mic button
- [ ] No permission dialogs appear on app startup
- [ ] App works correctly even if permissions are denied

## Expected Behavior

### On App Launch:
- ✅ No permission dialogs
- ✅ App loads normally
- ✅ All features work (with degraded functionality if permissions denied)

### When User Uses Features:
- ✅ Mic button → Audio permission requested
- ✅ Settings → Enable notifications → Notification permission requested
- ✅ Onboarding → Choose reminder → Notification permission requested

## Impact

**Low Risk Changes:**
- All changes are safe and follow Android best practices
- App gracefully handles denied permissions
- No breaking changes to existing functionality

**Benefits:**
- ✅ Better user experience (no intrusive permission requests)
- ✅ Complies with Google Play Store policies
- ✅ Reduces app rejection risk
- ✅ Follows Android permission guidelines

## Summary

All permission requests have been moved from app startup to user-initiated actions. The app now complies with Google Play Store policies and Android best practices for permission handling.







