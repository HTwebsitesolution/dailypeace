# 🚀 App Store Submission - Quick Start Checklist

## ⚠️ BEFORE YOU START

### 1. Choose Your Bundle Identifiers

**You MUST update these before building:**

- **iOS Bundle ID:** `com.yourcompany.dailypeace`
  - Replace `yourcompany` with your actual company/domain
  - Examples: `com.dailypeace.app`, `life.dailypeace.app`, `io.yourdomain.dailypeace`
  - Must be unique across App Store

- **Android Package Name:** `com.yourcompany.dailypeace`
  - Same format as iOS
  - Must match iOS (or be different if preferred, but same format recommended)

**Files to update:**
- [ ] `app.json` - Update `ios.bundleIdentifier` and `android.package`
- [ ] `eas.json` - Update `production.ios.bundleIdentifier` and `production.android.package`

### 2. Required Accounts

- [ ] **Apple Developer Account** ($99/year)
  - Sign up: https://developer.apple.com/programs/
  - Approval takes 24-48 hours
  
- [ ] **Google Play Console** ($25 one-time)
  - Sign up: https://play.google.com/console
  - Instant access

- [ ] **Expo Account** (Free)
  - Sign up: https://expo.dev/signup
  - Required for EAS builds

### 3. Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 4. Initialize EAS Project

```bash
cd dailypeace
eas build:configure
```

This will:
- Link your project to Expo
- Create/update `eas.json`
- Set up build profiles

### 5. Privacy Policy

**Required for both stores!**

- [ ] Create privacy policy page at: https://dailypeace.life/privacy
- [ ] Must mention:
  - Data collection (if any)
  - Third-party services (OpenAI, PostHog)
  - User rights
  - Contact information

### 6. Prepare Screenshots

**iOS Required Sizes:**
- [ ] iPhone 6.7" (1290×2796px) - **Required**
- [ ] iPhone 6.5" (1242×2688px) - Optional but recommended
- [ ] iPhone 5.5" (1242×2208px) - Optional

**Android Required:**
- [ ] Phone screenshots (min 2, max 8)
  - Recommended: 1080×1920px
- [ ] Feature graphic: 1024×500px (optional but recommended)

**Screenshot Ideas:**
1. Home screen with Daily Reflection
2. Chat conversation
3. Verse Collections
4. Settings/Theme selection
5. Favorites screen

---

## 📋 Step-by-Step Execution

### Phase 1: Configuration (30 minutes)

1. [ ] Choose bundle identifiers
2. [ ] Update `app.json` with bundle IDs
3. [ ] Update `eas.json` with bundle IDs
4. [ ] Register bundle ID in Apple Developer Portal (iOS)
5. [ ] Install EAS CLI and login
6. [ ] Run `eas build:configure`

### Phase 2: Build (30-60 minutes)

7. [ ] Build iOS: `npm run build:ios`
8. [ ] Wait for iOS build (15-30 min)
9. [ ] Build Android: `npm run build:android`
10. [ ] Wait for Android build (15-30 min)

### Phase 3: iOS Submission (1-2 hours)

11. [ ] Create app in App Store Connect
12. [ ] Fill in app information
13. [ ] Upload screenshots
14. [ ] Write app description
15. [ ] Add privacy policy URL
16. [ ] Submit build (via EAS or manually)
17. [ ] Wait for review (24-48 hours)

### Phase 4: Android Submission (1-2 hours)

18. [ ] Create app in Play Console
19. [ ] Complete store listing
20. [ ] Upload screenshots
21. [ ] Complete content rating questionnaire
22. [ ] Add privacy policy URL
23. [ ] Upload AAB build
24. [ ] Create release and submit
25. [ ] Wait for review (1-7 days)

---

## 🔧 Quick Commands

```bash
# Configuration
npm run build:configure

# Build
npm run build:ios          # iOS build
npm run build:android      # Android build
npm run build:all          # Both platforms

# Submit (after build completes)
npm run submit:ios         # Submit iOS
npm run submit:android     # Submit Android
```

---

## ⚡ Fast Track (If You Have Everything Ready)

```bash
# 1. Configure
cd dailypeace
eas build:configure

# 2. Build both platforms (parallel)
eas build --platform all --profile production

# 3. Submit both (after builds complete)
eas submit --platform ios --latest
eas submit --platform android --latest
```

**Total time:** ~2-3 hours (mostly waiting for builds and reviews)

---

## 📝 Notes

- Bundle identifiers **cannot be changed** after first submission
- Choose carefully!
- Both stores require privacy policy URL
- Screenshots can be updated anytime
- App descriptions can be updated anytime

---

## ❓ Need Help?

See full guide: `APP-STORE-SUBMISSION.md`

Common issues:
- Bundle ID already taken → Choose different identifier
- Build fails → Check EAS build logs
- Missing privacy policy → Create at https://dailypeace.life/privacy
