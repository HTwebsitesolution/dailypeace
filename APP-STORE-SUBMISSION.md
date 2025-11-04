# 📱 App Store Submission Guide
## Daily Peace - iOS & Android

**Status:** Ready for Submission  
**Version:** 1.0.0  
**Last Updated:** January 2025

---

## 🎯 Overview

This guide walks you through submitting Daily Peace to:
- **Apple App Store** (iOS)
- **Google Play Store** (Android)

**Estimated Time:** 4-6 hours total
- iOS: 2-3 hours
- Android: 2-3 hours

---

## ✅ Pre-Submission Checklist

### Required Accounts
- [ ] **Apple Developer Account** ($99/year)
  - Sign up at: https://developer.apple.com/programs/
  - Wait for approval (usually 24-48 hours)
  
- [ ] **Google Play Console Account** ($25 one-time)
  - Sign up at: https://play.google.com/console
  - Instant access (pending verification)

### Assets Required
- [x] App icons (iOS: 1024×1024, Android: 512×512) ✅
- [x] Splash screens ✅
- [ ] App screenshots (3-5 per platform)
- [ ] App description & marketing text
- [ ] Privacy policy URL
- [ ] Support URL

### Configuration
- [ ] Bundle identifier configured (iOS & Android)
- [ ] EAS project initialized
- [ ] Build profiles configured
- [ ] Version numbers set

---

## 🍎 iOS App Store Submission

### Step 1: Configure Bundle Identifier

1. **Choose your bundle ID** (format: `com.yourcompany.dailypeace`)
   - Example: `com.dailypeace.app` or `life.dailypeace.app`
   - Must be unique across all App Store apps

2. **Update `app.json`:**
   ```json
   "ios": {
     "supportsTablet": true,
     "bundleIdentifier": "com.yourcompany.dailypeace"
   }
   ```

3. **Register bundle ID in Apple Developer Portal:**
   - Go to: https://developer.apple.com/account/resources/identifiers/list
   - Click "+" → App IDs
   - Enter bundle identifier
   - Select capabilities (Push Notifications, Background Modes if needed)

### Step 2: Set Up EAS Build

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Initialize EAS:**
   ```bash
   cd dailypeace
   eas build:configure
   ```

4. **Create/Update `eas.json`:**
   ```json
   {
     "cli": {
       "version": ">= 7.8.6"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal",
         "ios": {
           "simulator": true
         }
       },
       "preview": {
         "distribution": "internal",
         "ios": {
           "simulator": false
         }
       },
       "production": {
         "ios": {
           "bundleIdentifier": "com.yourcompany.dailypeace"
         }
       }
     },
     "submit": {
       "production": {}
     }
   }
   ```

### Step 3: Create iOS Build

1. **Build for App Store:**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Wait for build** (15-30 minutes)
   - Monitor at: https://expo.dev/accounts/[your-account]/projects/daily-peace/builds

3. **Download build** when complete

### Step 4: Prepare App Store Connect

1. **Access App Store Connect:**
   - Go to: https://appstoreconnect.apple.com
   - Click "My Apps" → "+" → "New App"

2. **Fill in App Information:**
   - **Name:** Daily Peace
   - **Primary Language:** English
   - **Bundle ID:** Select your registered bundle ID
   - **SKU:** `daily-peace-ios` (unique identifier)
   - **User Access:** Full Access

### Step 5: App Store Listing

#### Required Information:

**App Name:** Daily Peace  
**Subtitle:** Find peace through Scripture  
**Category:** 
- Primary: Lifestyle
- Secondary: Health & Fitness

**Description:**
```
Daily Peace helps you find strength, peace, and hope through scripture-based guidance. 

Features:
• Conversational AI companion for spiritual guidance
• Daily reflections with Bible verses
• Three response modes: Conversational, Scripture Wisdom, Quiet Reflection
• Voice input and text-to-speech playback
• Browse topical verse collections
• Save your favorite verses
• Beautiful, calming interface

Whether you're seeking peace in difficult times, looking for daily inspiration, or wanting to deepen your spiritual practice, Daily Peace is here to walk with you.
```

**Keywords:** (100 characters max, comma-separated)
```
spiritual guidance, bible verses, daily devotions, peace, meditation, prayer, scripture, faith, christian, reflection
```

**Support URL:** https://dailypeace.life  
**Marketing URL:** https://dailypeace.life  
**Privacy Policy URL:** https://dailypeace.life/privacy

### Step 6: App Screenshots

**Required Sizes:**
- iPhone 6.7" (iPhone 14 Pro Max): 1290×2796px (required)
- iPhone 6.5" (iPhone 11 Pro Max): 1242×2688px
- iPhone 5.5" (iPhone 8 Plus): 1242×2208px

**Screenshot Ideas:**
1. Home screen with Daily Reflection
2. Chat conversation in Conversational mode
3. Verse Collections browsing
4. Settings/Theme selection
5. Favorites screen

**How to Generate:**
1. Run app in iOS Simulator
2. Take screenshots at correct sizes
3. Upload to App Store Connect

### Step 7: App Store Review Information

**First Name:** [Your first name]  
**Last Name:** [Your last name]  
**Phone Number:** [Your phone]  
**Email:** [Your email]  
**Demo Account:** Not required (app doesn't require login)

**Notes for Review:**
```
Daily Peace is a spiritual guidance app that uses AI to provide scripture-based responses. 
The app does not require user accounts or collect personal data. All conversations are processed server-side and not stored.

To test:
1. Open the app
2. On first launch, complete the 3-step onboarding
3. On the home screen, tap "Start Conversation"
4. Type or speak a message to begin a conversation
5. Try different conversation modes in Settings
```

### Step 8: Submit Build

1. **Submit via EAS:**
   ```bash
   eas submit --platform ios --latest
   ```

2. **Or manually in App Store Connect:**
   - Go to your app → "TestFlight" or "+ Version"
   - Click "+" next to Build
   - Select your build
   - Fill in "What's New" (first release)
   - Click "Submit for Review"

### Step 9: Review Process

- **Typical Timeline:** 24-48 hours
- **Status Updates:** Check App Store Connect
- **Common Issues:**
  - Missing privacy policy
  - Screenshot requirements
  - App crashes during review

---

## 🤖 Google Play Store Submission

### Step 1: Configure Package Name

1. **Choose your package name** (format: `com.yourcompany.dailypeace`)
   - Example: `com.dailypeace.app` or `life.dailypeace.app`
   - Must be unique across Play Store
   - Use reverse domain notation

2. **Update `app.json`:**
   ```json
   "android": {
     "package": "com.yourcompany.dailypeace",
     "adaptiveIcon": {
       "foregroundImage": "./assets/branding/icons/icon-android.png",
       "backgroundColor": "#0B1016"
     },
     "useNextNotificationsApi": true
   }
   ```

3. **Update `eas.json` production profile:**
   ```json
   "production": {
     "android": {
       "package": "com.yourcompany.dailypeace"
     }
   }
   ```

### Step 2: Create Android Build

1. **Build for Play Store:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Wait for build** (15-30 minutes)

3. **Download AAB file** (not APK - Play Store requires AAB)

### Step 3: Set Up Play Console

1. **Create App:**
   - Go to: https://play.google.com/console
   - Click "Create app"

2. **App Details:**
   - **App name:** Daily Peace
   - **Default language:** English
   - **App or game:** App
   - **Free or paid:** Free
   - **Declarations:** Check privacy, content ratings, etc.

### Step 4: Store Listing

**Short Description:** (80 characters max)
```
Find peace and hope through scripture-based AI guidance and daily reflections.
```

**Full Description:**
```
Daily Peace helps you find strength, peace, and hope through scripture-based guidance.

FEATURES:
• Conversational AI companion for spiritual guidance
• Daily reflections with Bible verses
• Three response modes: Conversational, Scripture Wisdom, Quiet Reflection
• Voice input and text-to-speech playback
• Browse topical verse collections
• Save your favorite verses
• Beautiful, calming interface

Whether you're seeking peace in difficult times, looking for daily inspiration, or wanting to deepen your spiritual practice, Daily Peace is here to walk with you.

Perfect for:
• Daily devotions and reflection
• Finding comfort in difficult times
• Spiritual growth and guidance
• Quiet moments of prayer
```

**App Icon:** 512×512px (already created ✅)  
**Feature Graphic:** 1024×500px (create if needed)

**Screenshots:**
- **Phone:** 2 screenshots minimum (up to 8)
  - Sizes: Any phone size (min 320px, max 3840px width)
  - Recommended: 1080×1920px or similar
- **Tablet:** Optional (7" and 10")

**Screenshot Ideas:** (Same as iOS)

**Category:** Lifestyle  
**Tags:** spiritual, meditation, bible, daily devotion, faith

### Step 5: Content Rating

1. **Complete Questionnaire:**
   - Go to "Content rating" in Play Console
   - Answer questions about app content
   - Daily Peace should be rated: **Everyone** or **Teen**

2. **Submit for Rating** (takes ~1 hour)

### Step 6: Privacy Policy

**Required URL:** https://dailypeace.life/privacy

**Privacy Policy Must Include:**
- What data is collected (if any)
- How data is used
- Third-party services (OpenAI, PostHog)
- User rights
- Contact information

### Step 7: App Access

**Sign in required:** No  
**Google Sign-In:** Not used

### Step 8: Prepare Release

1. **Create Release:**
   - Go to "Production" → "Create new release"

2. **Upload AAB:**
   - Upload the AAB file from EAS build
   - **Release name:** "1.0.0 - Initial Release"
   - **Release notes:**
     ```
     Welcome to Daily Peace! This initial release includes:
     • AI-powered spiritual guidance conversations
     • Daily reflections with scripture
     • Voice input and text-to-speech
     • Verse collections and favorites
     • Beautiful, peaceful interface
     ```

3. **Review Release:**
   - Check all warnings
   - Address any issues

### Step 9: Submit for Review

1. **Review Checklist:**
   - [ ] Store listing complete
   - [ ] Content rating done
   - [ ] Privacy policy URL provided
   - [ ] AAB uploaded
   - [ ] Screenshots uploaded

2. **Submit:**
   - Click "Start rollout to Production"
   - Review can take 1-7 days

---

## 🔧 EAS Configuration Files

### eas.json (Create this file)

```json
{
  "cli": {
    "version": ">= 7.8.6"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_BASE": "https://dailypeace.life/.netlify/functions",
        "EXPO_PUBLIC_APP_LINK": "https://dailypeace.life"
      },
      "ios": {
        "bundleIdentifier": "com.yourcompany.dailypeace"
      },
      "android": {
        "package": "com.yourcompany.dailypeace"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-email@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./path-to-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

---

## 📋 Submission Checklist

### Before Building
- [ ] Bundle identifier/package name chosen
- [ ] `app.json` updated with correct identifiers
- [ ] `eas.json` created and configured
- [ ] EAS CLI installed and logged in
- [ ] Apple Developer account active
- [ ] Google Play Console account active

### iOS Specific
- [ ] Bundle ID registered in Apple Developer Portal
- [ ] App created in App Store Connect
- [ ] Screenshots prepared (3-5 at correct sizes)
- [ ] App description written
- [ ] Privacy policy URL ready
- [ ] Build created with EAS
- [ ] Build submitted to App Store Connect

### Android Specific
- [ ] App created in Play Console
- [ ] Store listing completed
- [ ] Screenshots uploaded
- [ ] Content rating completed
- [ ] Privacy policy URL added
- [ ] AAB build created
- [ ] Release created and submitted

### Post-Submission
- [ ] Monitor review status
- [ ] Respond to any review feedback
- [ ] Prepare for launch announcement

---

## 🚀 Quick Start Commands

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configure (creates eas.json)
cd dailypeace
eas build:configure

# 4. Build iOS
eas build --platform ios --profile production

# 5. Build Android
eas build --platform android --profile production

# 6. Submit iOS (after build completes)
eas submit --platform ios --latest

# 7. Submit Android (upload AAB manually or use eas submit)
eas submit --platform android --latest
```

---

## 📝 App Store Metadata Template

### iOS App Description
[Use the description from Step 5 above]

### Android Store Listing
[Use the description from Step 4 above]

### Keywords (iOS)
```
spiritual guidance, bible verses, daily devotions, peace, meditation, prayer, scripture, faith, christian, reflection
```

---

## 🔗 Useful Links

- **Apple Developer:** https://developer.apple.com
- **App Store Connect:** https://appstoreconnect.apple.com
- **Google Play Console:** https://play.google.com/console
- **EAS Documentation:** https://docs.expo.dev/build/introduction/
- **EAS Submit:** https://docs.expo.dev/submit/introduction/

---

## ❓ Common Issues & Solutions

### Issue: Bundle ID already taken
**Solution:** Choose a different bundle identifier (add company name, domain, etc.)

### Issue: Build fails
**Solution:** Check EAS build logs, ensure all dependencies are compatible

### Issue: App rejected for missing privacy policy
**Solution:** Create privacy policy page at https://dailypeace.life/privacy

### Issue: Screenshots not showing correctly
**Solution:** Ensure correct dimensions, test on actual devices first

---

## 🎉 After Approval

Once approved:
1. **iOS:** App appears in App Store within 24 hours
2. **Android:** App goes live immediately after approval
3. **Monitor:** Track downloads, reviews, crashes
4. **Update:** Prepare for future updates and improvements

---

**Good luck with your submission!** 🚀

If you encounter any issues, refer to the [EAS Documentation](https://docs.expo.dev/build/introduction/) or contact Expo support.
