# Google Play Store Submission Guide

## Prerequisites

### 1. Google Play Console Account
- Sign up at: https://play.google.com/console
- **One-time registration fee:** $25 USD (one-time, lifetime)
- Payment method required (credit card, PayPal, etc.)

### 2. Developer Account Setup
1. Complete developer account registration
2. Accept the Developer Distribution Agreement
3. Complete account details (name, address, contact info)

---

## Step 1: Build Type - AAB vs APK

**Important:** Google Play Store **prefers AAB (Android App Bundle)** format now.

### Current Status
Your current build is **APK**. For Play Store, we should build **AAB** instead.

### Switch to AAB Build
We'll update `eas.json` to build AAB format (better for Play Store).

---

## Step 2: Required Assets & Information

### App Icon
- ✅ You have: `assets/branding/icons/icon-android.png`
- **Requirements:**
  - Size: 512 x 512 pixels
  - Format: PNG (32-bit)
  - No transparency

### Feature Graphic (Banner)
- **Size:** 1024 x 500 pixels
- **Format:** PNG or JPG
- **Purpose:** Store listing banner
- **Can create from:** Your app logo + tagline

### Screenshots (Required)
**Minimum requirements:**
- At least 2 screenshots
- Phone screenshots: 16:9 or 9:16 ratio
- Tablet screenshots (optional): 16:9 or 9:16 ratio

**Recommended:**
- 2-8 phone screenshots
- Show key features:
  - Home screen with daily reflection
  - Chat interface
  - Settings screen
  - Any unique features

**How to create:**
1. Use your web app to capture screenshots
2. Or use Android emulator (if you set one up)
3. Or manually create mockups

### App Description
**Short description** (80 characters max):
```
Find peace, calm and hope daily through Scripture and gentle conversation
```

**Full description** (4000 characters max):
```
🕊️ Daily Peace — Your Companion for Faith, Calm, and Spiritual Guidance

Find stillness, strength, and hope with Daily Peace, your AI-powered spiritual companion designed to bring comfort, wisdom, and calm into your daily life.
Whether you seek biblical insight, quiet reflection, or gentle conversation, Daily Peace guides you toward peace of mind and a deeper connection with Scripture.

✨ AI-Powered Spiritual Conversations

Engage in meaningful dialogue with an AI that listens, comforts, and responds with faith-based encouragement. Receive scriptural wisdom and reflections inspired by the King James Bible to uplift your spirit every day.

📖 Daily Reflections

Start your mornings with carefully chosen messages of peace and hope. Each reflection blends biblical truth with empathy and practical encouragement for real-life challenges.

📚 Scripture Integration

Explore Bible verses matched to your reflections and conversations. Whether you need strength, calm, or direction, Daily Peace connects you with the Word of God in a personal way.

🎙️ Voice Input

Speak naturally. Let your thoughts flow.
Daily Peace understands your voice and turns your spoken words into heartfelt spiritual conversations.

💬 Three Modes of Guidance

Choose the tone that suits your moment:

Conversational: Warm, understanding, and personal.

Biblical: Rooted in Scripture with KJV citations.

Reflective: Gentle pauses and prompts for prayer and meditation.

🎨 Beautiful, Peaceful Design

Experience a minimal, calming interface crafted to quiet distractions and nurture reflection — perfect for morning devotion, evening prayer, or peaceful moments throughout your day.

🌿 Your Journey Toward Peace

Whether you're seeking comfort in difficulty, guidance for decisions, or simply a moment of stillness, Daily Peace is your companion for spiritual growth, mindfulness, and connection with God.

Join thousands discovering new ways to stay calm, centered, and spiritually grounded — every day.

🌿 Enhanced Closing Section (Optimized for Conversion & Trust)

Daily Peace is your companion on the journey of faith and calm.
In moments of uncertainty, when you seek comfort, wisdom, or quiet reflection, Daily Peace is there to listen, guide, and inspire you through Scripture and gentle conversation.

🔒 Privacy & Security You Can Trust

Your conversations are private, secure, and never shared.
We value your trust — everything you say stays between you and your spiritual companion. No tracking. No third-party access. Just peace of mind.

🙏 Start Your Journey Today

Download Daily Peace and discover a place where your faith, calm, and reflection come together — every day.

✅ Keywords gently optimized for ASO:
faith, peace, calm, Bible, Christian, prayer, reflection, devotion, hope, Scripture, wisdom.
```

### Privacy Policy (Required)
**Google requires a publicly accessible privacy policy URL.**

**Options:**
1. **Create a page on your website:**
   - Add to: `https://dailypeace.life/privacy-policy`
   - Must be publicly accessible

2. **Use a privacy policy generator:**
   - https://www.freeprivacypolicy.com/
   - https://www.privacypolicygenerator.info/

**What to include:**
- Data collection practices
- How data is used
- Third-party services (OpenAI, Netlify)
- User rights
- Contact information

**Sample Privacy Policy Structure:**
```
1. Introduction
2. Information We Collect
3. How We Use Your Information
4. Third-Party Services
   - OpenAI (for AI conversations)
   - Netlify (for hosting)
5. Data Security
6. Your Rights
7. Contact Us
```

---

## Step 3: App Information

### App Name
```
Daily Peace
```

### Category
**Primary:** Lifestyle or Health & Fitness or Books & Reference

**Secondary (optional):** Religion

### Content Rating
Complete the **Content Rating Questionnaire** in Play Console:
1. Answer questions about your app's content
2. IARC (International Age Rating Coalition) will provide ratings
3. Typically: **Everyone** or **Teen** for spiritual guidance apps

### Target Audience
- Age range: All ages or 13+
- Target countries: Select countries where you want to publish

---

## Step 4: Build AAB for Play Store

### Update eas.json to Build AAB

Change from APK to AAB:
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "aab"  // Changed from "apk"
      }
    }
  }
}
```

### Build the AAB
```bash
cd c:\dailypeace-starter\dailypeace
eas build --platform android --profile production
```

This will create an **AAB file** suitable for Play Store submission.

---

## Step 5: App Signing Setup

### Play App Signing (Recommended)
1. **Enable Play App Signing** in Play Console:
   - Go to: Release → Setup → App signing
   - Let Google manage your app signing key (recommended)
   - Upload your upload key (EAS generates this)

2. **EAS automatically handles:**
   - Generating upload key
   - Signing the AAB
   - You just upload to Play Console

---

## Step 6: Submission Checklist

Before submitting, ensure you have:

### Required Items
- [ ] Google Play Console account created ($25 paid)
- [ ] AAB file built and ready
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500)
- [ ] At least 2 screenshots
- [ ] App description (short + full)
- [ ] Privacy policy URL (publicly accessible)
- [ ] Content rating completed
- [ ] App name, category selected
- [ ] Target countries selected

### Optional but Recommended
- [ ] Tablet screenshots
- [ ] Promotional video
- [ ] App category icon
- [ ] Promotional text

---

## Step 7: Upload to Play Console

### Create New App
1. Go to: https://play.google.com/console
2. Click **"Create app"**
3. Fill in:
   - App name: **Daily Peace**
   - Default language: **English (United States)**
   - App or game: **App**
   - Free or paid: **Free**
   - Declarations: Check boxes as applicable

### Upload AAB
1. Go to: **Production** → **Create new release**
2. Upload your AAB file
3. Add release name: `1.0.0` (or version number)
4. Add release notes:
   ```
   Initial release of Daily Peace
   - AI-powered spiritual guidance
   - Daily reflections
   - Bible verse integration
   - Voice input support
   ```

### Complete Store Listing
1. Fill in all required fields
2. Upload screenshots and graphics
3. Add app description
4. Set privacy policy URL
5. Complete content rating

### Submit for Review
1. Review all information
2. Click **"Submit for review"**
3. Review typically takes **1-7 days**

---

## Step 8: Submission Commands

### Build AAB
```bash
cd c:\dailypeace-starter\dailypeace
eas build --platform android --profile production
```

### Submit via EAS (Alternative)
Once AAB is built, you can submit directly:
```bash
eas submit --platform android --latest
```

You'll need to provide:
- Google Play Console account credentials
- Or upload the AAB manually in Play Console

---

## Step 9: Post-Submission

### What to Expect
- **Review time:** 1-7 days typically
- **Status updates:** Via email and Play Console
- **Possible requests:** Additional information, clarifications

### After Approval
- App will be live in Play Store
- Users can download and install
- Monitor reviews and ratings
- Respond to user feedback

---

## Common Issues & Solutions

### Issue: Privacy Policy Required
**Solution:** Create privacy policy page on your website or use a free generator.

### Issue: Screenshots Needed
**Solution:** Capture from web version or create mockups using design tools.

### Issue: AAB Required
**Solution:** Change `buildType` to `"aab"` in `eas.json` and rebuild.

### Issue: Content Rating
**Solution:** Complete the questionnaire honestly - it's automated and takes 5 minutes.

---

## Next Steps

1. **Update eas.json** to build AAB
2. **Build new AAB** file
3. **Create privacy policy** page
4. **Prepare screenshots** and assets
5. **Set up Google Play Console** account
6. **Upload and submit**

---

**Ready to start?** Let's update the build configuration to generate an AAB file! 🚀
