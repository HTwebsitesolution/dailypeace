# Submit Daily Peace to iOS App Store - Step-by-Step Guide

## 🎯 Prerequisites Checklist

Before you begin, make sure you have:
- ✅ **Apple Developer Account** ($99/year) - [enroll here](https://developer.apple.com/programs/)
- ✅ **App Store Connect access** - [sign in here](https://appstoreconnect.apple.com)
- ✅ **Apple ID** linked to your Developer account
- ✅ **iOS icon** configured (already done: `./assets/branding/icons/icon-ios.png`)
- ✅ **Bundle Identifier** set: `life.dailypeace.app`

---

## 📋 STEP 1: Set Up Apple Developer Credentials in EAS

### Option A: Via Web Interface (Recommended)

1. **Go to your project credentials page:**
   ```
   https://expo.dev/accounts/htweb/projects/daily-peace/credentials
   ```

2. **In the iOS section:**
   - Click **"Get Started →"** or **"Upload Apple credentials"**
   - Choose **"Let Expo handle credentials"** (recommended)
   - Sign in with your **Apple ID** (the one linked to your Developer account)
   - If prompted, use an **App-Specific Password**:
     - Get one at: https://appleid.apple.com → Sign-In and Security → App-Specific Passwords
   - Select your **Team** (Apple Developer team)

### Option B: Let EAS Handle It Automatically (During Build)

EAS will prompt you during the first iOS build:
```bash
eas build --platform ios --profile production
```

When prompted:
- Answer **"Yes"** to let EAS manage credentials
- Sign in with your Apple ID
- EAS will automatically create certificates and provisioning profiles

---

## 🏗️ STEP 2: Build iOS App

**In Cursor Terminal:**

```bash
cd c:\dailypeace-starter\dailypeace
eas build --platform ios --profile production --clear-cache
```

**What happens:**
- EAS compiles your React Native app into an iOS `.ipa` file
- Build takes **20-40 minutes** (iOS builds are slower than Android)
- You'll get a link to download the build when complete

**Monitor progress:**
- Check: https://expo.dev/accounts/htweb/projects/daily-peace/builds
- Or wait in terminal for completion

---

## 📱 STEP 3: Create App in App Store Connect

1. **Go to App Store Connect:**
   - https://appstoreconnect.apple.com
   - Sign in with your Apple ID (linked to Developer account)

2. **Create New App:**
   - Click **"My Apps"** → **"+"** button (top left)
   - Fill in:
     - **Platform:** iOS
     - **Name:** `Daily Peace`
     - **Primary Language:** `English (U.S.)`
     - **Bundle ID:** Select `life.dailypeace.app`
     - **SKU:** `daily-peace-ios` (any unique identifier)
   - Click **"Create"**

3. **Note Your App ID:**
   - After creation, you'll see an **App ID** (e.g., `1234567890`)
   - Save this for `eas.json` configuration

---

## ⚙️ STEP 4: Configure EAS Submit for iOS

Update `eas.json` with your App Store Connect details:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

**How to find these values:**

1. **appleId:** Your Apple ID email (the one you use for App Store Connect)
2. **ascAppId:** Found in App Store Connect → Your App → App Information → Apple ID
3. **appleTeamId:** Found in Apple Developer → Membership → Team ID (8-10 characters)

**Don't have these yet?** You can submit manually instead (see Step 6).

---

## 📦 STEP 5: Upload Build to App Store Connect

### Option A: Automatic Submission (EAS Submit)

Once `eas.json` is configured:

```bash
eas submit --platform ios --profile production --latest
```

**OR** specify a build ID:

```bash
eas submit --platform ios --profile production --id <build-id>
```

### Option B: Manual Upload (via Transporter App)

1. **Download Transporter:**
   - Mac App Store: [Transporter](https://apps.apple.com/us/app/transporter/id1450874784)
   - Or use Xcode → Open Developer Tool → Transporter

2. **Download your build:**
   - Go to: https://expo.dev/accounts/htweb/projects/daily-peace/builds
   - Download the `.ipa` file from your latest iOS build

3. **Upload in Transporter:**
   - Open Transporter
   - Click **"+"** → Select your `.ipa` file
   - Click **"Deliver"**
   - Wait for upload to complete (5-10 minutes)

---

## 📝 STEP 6: Complete App Store Listing

### A. App Information

1. **In App Store Connect → Your App → App Information:**
   - **Category:** Select appropriate categories
     - Primary: `Lifestyle` or `Health & Fitness`
     - Secondary: `Spiritual` or `Reference`
   - **Privacy Policy URL:** `https://dailypeace.life/privacy` (or your privacy policy URL)
   - **Support URL:** `https://dailypeace.life` (or your support page)

### B. Pricing and Availability

1. **App Store Connect → Your App → Pricing and Availability:**
   - **Price:** Free
   - **Availability:** Select countries (or "All countries")

### C. App Privacy

1. **App Store Connect → Your App → App Privacy:**
   - Click **"Get Started"**
   - Answer questions about what data your app collects:
     - **Does your app collect data?** → Answer based on your PostHog/analytics setup
     - **Does your app share data?** → Answer accordingly
   - Click **"Save"**

### D. Version Information

1. **App Store Connect → Your App → Version 1.0.2:**

   **What's New:**
   ```
   Initial release of Daily Peace - your spiritual companion for daily reflection and peace.
   ```

   **Description:**
   ```
   Daily Peace is a spiritual companion app designed to bring calm, reflection, and peace into your daily life through scripture-inspired guidance, thoughtful reflections, and meaningful conversations.

   Features:
   • Daily reflections and spiritual guidance
   • Chat with an AI companion for support and reflection
   • Browse and save favorite Bible verses
   • Personalized spiritual experience
   • Beautiful, calming interface

   Perfect for anyone seeking daily moments of peace, reflection, and spiritual growth.
   ```

   **Keywords:** (separated by commas, max 100 characters)
   ```
   bible, reflection, meditation, spiritual, peace, daily devotion, scripture, faith, prayer, mindfulness
   ```

   **Support URL:** `https://dailypeace.life`
   **Marketing URL:** (optional) `https://dailypeace.life`

   **Promotional Text:** (optional, up to 170 characters)
   ```
   A spiritual companion for daily reflection and peace through scripture-inspired guidance.
   ```

### E. App Review Information

1. **Contact Information:**
   - **First Name:** Your first name
   - **Last Name:** Your last name
   - **Phone Number:** Your contact number
   - **Email:** Your contact email

2. **Demo Account:** (if required)
   - If your app requires login, provide demo credentials
   - Otherwise, mark as "No demo account required"

3. **Notes:**
   ```
   Thank you for reviewing Daily Peace. This is a spiritual companion app that provides daily reflections and guidance. No login required to use basic features.
   ```

### F. Screenshots (Required)

**You need screenshots for:**
- iPhone 6.7" Display (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796 pixels
- iPhone 6.5" Display (iPhone 11 Pro Max, XS Max): 1242 x 2688 pixels
- iPhone 5.5" Display (iPhone 8 Plus): 1242 x 2208 pixels

**Minimum:** At least one set of screenshots (3-5 images)

**How to create:**
1. Run your app in iOS Simulator
2. Take screenshots of key screens:
   - Home screen
   - Chat screen
   - Reflection screen
   - Verse browsing screen
3. Upload to App Store Connect → Version → Screenshots

**Quick tip:** Use `Cmd + S` in iOS Simulator to save screenshots

---

## ✅ STEP 7: Submit for Review

1. **In App Store Connect → Your App → Version 1.0.2:**
   - Scroll to **"Build"** section
   - Click **"+"** next to "Build"
   - Select your uploaded build (should appear after upload completes)
   - Click **"Done"**

2. **Review all sections:**
   - ✅ App Information complete
   - ✅ Version Information complete
   - ✅ Screenshots uploaded
   - ✅ App Privacy completed
   - ✅ Build selected

3. **Submit:**
   - Click **"Add for Review"** or **"Submit for Review"** button (top right)
   - Confirm submission

4. **Status:**
   - Your app status will change to **"Waiting for Review"**
   - Review typically takes **24-48 hours** (sometimes longer)

---

## 📊 STEP 8: Monitor Review Status

**Check status:**
- App Store Connect → Your App → App Store → Version Information
- You'll receive email notifications about status changes

**Possible statuses:**
- ⏳ **Waiting for Review**
- 🔍 **In Review**
- ✅ **Ready for Sale** (approved!)
- ❌ **Rejected** (you'll get feedback to fix)

**If rejected:**
- Read the feedback carefully
- Fix issues
- Resubmit with a new build (increment `buildNumber` in `app.json`)

---

## 🔄 STEP 9: Update Build Number for Next Submission

Each time you submit a new build, increment the `buildNumber` in `app.json`:

```json
{
  "expo": {
    "ios": {
      "buildNumber": "2"  // Increment this: 1 → 2 → 3, etc.
    }
  }
}
```

**Note:** The `version` field (currently "1.0.2") is what users see. The `buildNumber` is internal and must increment with each submission.

---

## 🎯 Quick Reference Commands

```bash
# Build iOS app
eas build --platform ios --profile production --clear-cache

# Submit to App Store (after configuring eas.json)
eas submit --platform ios --profile production --latest

# Check build status
eas build:list --platform ios

# View credentials
eas credentials
```

---

## 📚 Useful Links

- **App Store Connect:** https://appstoreconnect.apple.com
- **Apple Developer:** https://developer.apple.com
- **EAS Build Dashboard:** https://expo.dev/accounts/htweb/projects/daily-peace/builds
- **Apple Developer Forums:** https://developer.apple.com/forums/

---

## ⚠️ Common Issues & Solutions

### Issue: "No builds found"
**Solution:** Make sure your build completed successfully and was uploaded to App Store Connect. EAS Submit helps with this.

### Issue: "Bundle ID mismatch"
**Solution:** Ensure `bundleIdentifier` in `app.json` matches what you registered in App Store Connect.

### Issue: "Missing compliance"
**Solution:** Complete the App Privacy section in App Store Connect.

### Issue: "App gets rejected"
**Solution:** Read Apple's feedback, fix issues, rebuild with incremented `buildNumber`, and resubmit.

---

## 🎉 Success!

Once approved, your app will be available in the App Store! 🚀

**Estimated timeline:**
- Build: 20-40 minutes
- Upload: 5-10 minutes
- Review: 24-48 hours (can be longer)

**Total:** ~2-3 days from submission to approval










