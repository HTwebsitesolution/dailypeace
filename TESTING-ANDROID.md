# Testing Android App in Cursor

## Quick Answer
Yes, you can test the Android app from Cursor, but you have several options depending on your setup:

---

## Option 1: Expo Go (Easiest - No Emulator Needed) ⭐ RECOMMENDED

**Best for:** Quick testing, no setup required

### Steps:
1. Install **Expo Go** app on your Android phone from Google Play Store
2. In Cursor terminal, run:
   ```bash
   cd dailypeace
   npm start
   ```
3. Scan the QR code with Expo Go app (or use the URL)
4. App loads on your phone instantly!

**Pros:**
- ✅ No emulator setup needed
- ✅ Works on real device (best testing)
- ✅ Fast refresh
- ✅ No Android Studio required

**Cons:**
- ❌ Requires physical Android device
- ❌ Some native features might not work (notifications, etc.)

---

## Option 2: Android Emulator (Full Native Testing)

**Best for:** Testing without a physical device, testing native features

### Prerequisites:
1. Install **Android Studio**: https://developer.android.com/studio
2. Install Android SDK and create an emulator:
   - Open Android Studio
   - Tools → Device Manager → Create Virtual Device
   - Choose a device (e.g., Pixel 6)
   - Download a system image (API 33 or 34 recommended)
   - Finish setup

### Steps:
1. Start the emulator from Android Studio, or from Cursor terminal:
   ```bash
   # Check if emulator is running
   adb devices
   
   # If not running, start it from Android Studio first
   ```

2. In Cursor terminal:
   ```bash
   cd dailypeace
   npm start
   ```
   
3. Press `a` to open on Android emulator, or run:
   ```bash
   npm run android
   ```

**Pros:**
- ✅ Full Android environment
- ✅ No physical device needed
- ✅ All native features work
- ✅ Can test different Android versions

**Cons:**
- ❌ Requires Android Studio installation (~3GB)
- ❌ Emulator is slow on some machines
- ❌ Takes time to set up

---

## Option 3: EAS Build Run (Cloud Emulator) 🌟 EASY ALTERNATIVE

**Best for:** Testing without local setup, testing production builds

### Steps:
1. Build a development version:
   ```bash
   cd dailypeace
   eas build --platform android --profile development
   ```

2. Run on EAS cloud emulator:
   ```bash
   eas build:run --platform android --latest
   ```

**Pros:**
- ✅ No local emulator setup
- ✅ Tests actual build (not just dev server)
- ✅ Works from anywhere
- ✅ No Android Studio needed

**Cons:**
- ❌ Requires EAS account
- ❌ Build takes 15-30 minutes
- ❌ Not as fast as local testing

---

## Option 4: Web Version (Quick UI Testing)

**Best for:** Quick UI checks, doesn't test Android-specific features

### Steps:
```bash
cd dailypeace
npm run web
```

Opens in browser at `http://localhost:8081` (or similar)

**Pros:**
- ✅ Instant testing
- ✅ No setup needed
- ✅ Good for UI/UX checks

**Cons:**
- ❌ Not actual Android
- ❌ Many native features don't work
- ❌ Different behavior than Android

---

## Option 5: Development Build (Best of Both Worlds)

**Best for:** Testing production-like build on device/emulator

### Steps:
1. Build development version:
   ```bash
   cd dailypeace
   eas build --platform android --profile development
   ```

2. Download the APK from EAS dashboard

3. Install on device/emulator:
   ```bash
   # On emulator
   adb install path/to/app.apk
   
   # On device: Enable USB debugging, then:
   adb install path/to/app.apk
   ```

**Pros:**
- ✅ Tests actual build (closest to production)
- ✅ Works on real device or emulator
- ✅ All native features work

**Cons:**
- ❌ Build takes 15-30 minutes
- ❌ Need to rebuild for each change

---

## Recommended Testing Workflow

### For Quick Development:
1. **Use Expo Go** on your phone for daily development
2. Use **Web version** for quick UI checks

### For Pre-Release Testing:
1. **Build development build** and test on physical device
2. Test on **Android emulator** for different Android versions
3. **Build production AAB** for final testing before submission

---

## Troubleshooting

### "Android SDK not found"
- Install Android Studio
- Make sure `ANDROID_HOME` environment variable is set
- Add Android SDK tools to PATH

### "No emulators found"
- Open Android Studio → Device Manager → Create Virtual Device
- Make sure emulator is started before running `npm run android`

### "Expo Go can't connect"
- Make sure phone and computer are on same WiFi network
- Try tunnel mode: `npx expo start --tunnel`

### "Build fails on EAS"
- Check build logs at https://expo.dev
- Make sure all dependencies are correct
- Check `eas.json` configuration

---

## Quick Commands Reference

```bash
# Start Expo dev server
npm start

# Start and open on Android emulator
npm run android

# Start web version
npm run web

# Build for development
eas build --platform android --profile development

# Build for production
eas build --platform android --profile production

# Run on EAS cloud emulator
eas build:run --platform android --latest
```

---

## Which Should You Use?

**Right now, for testing crash fixes:**
1. ✅ **Start with Expo Go** - fastest way to test
2. ✅ **Then build development build** - tests actual build
3. ✅ **Finally test production AAB** - before Play Store submission

**For ongoing development:**
- Expo Go for daily work
- Development build weekly
- Production build before releases







