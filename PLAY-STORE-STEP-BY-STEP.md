# Google Play Store Submission - Step-by-Step Guide

## ✅ What You Have Ready

- ✅ Google Play Console account login details
- ✅ AAB file: Built and ready (or APK from previous build)
- ✅ App icon: `assets/branding/icons/icon-android.png` (512x512)
- ✅ Feature graphic: `assets/branding/feature graphic - dailypeace.png` (1024x500)
- ✅ Screenshots: 
  - `play-store-screenshot-1-home.png` (360x800)
  - `play-store-screenshot-2-home-alt.png` (360x800)
- ✅ Privacy policy: Live at `https://dailypeace.life/privacy-policy`
- ✅ App descriptions: Ready to copy/paste

---

## 📋 Step 1: Log In to Google Play Console

1. Go to: **https://play.google.com/console**
2. Log in with your Google account
3. If this is your first time, you may need to:
   - Pay the $25 one-time registration fee (if not already paid)
   - Accept the Developer Distribution Agreement
   - Complete your developer profile

---

## 📱 Step 2: Create a New App

1. Click the **"Create app"** button (top right)
2. Fill in the form:

   **App name:**
   ```
   Daily Peace
   ```

   **Default language:**
   ```
   English (United States)
   ```

   **App or game:**
   ```
   App
   ```

   **Free or paid:**
   ```
   Free
   ```

   **Developer Program Policies:**
   - ✅ Check: "I confirm that..."
   - ✅ Check: "I acknowledge that..."

3. Click **"Create app"**

---

## 🎨 Step 3: Complete Store Listing

### 3.1 App Details

1. In the left sidebar, go to: **"Store presence" → "Main store listing"**

2. **App name:**
   ```
   Daily Peace
   ```

3. **Short description** (80 characters max):
   ```
   Find peace, calm and hope daily through Scripture and gentle conversation
   ```

4. **Full description** (4000 characters max):
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

### 3.2 Graphics & Screenshots

**App icon:**
1. Click **"Browse"** or drag & drop
2. Upload: `dailypeace/assets/branding/icons/icon-android.png`
3. Verify it shows correctly (512x512 PNG)

**Feature graphic:**
1. Click **"Browse"** or drag & drop
2. Upload: `dailypeace/assets/branding/feature graphic - dailypeace.png`
3. Verify it shows correctly (1024x500)

**Phone screenshots (required - at least 2):**
1. Click **"Add phone screenshots"**
2. Upload both screenshots:
   - `dailypeace/play-store-screenshot-1-home.png`
   - `dailypeace/play-store-screenshot-2-home-alt.png`
3. Drag to reorder if needed (most important first)

**Tablet screenshots (optional):**
- You can skip this for now, or upload phone screenshots here too

### 3.3 Categorization

**App category:**
- Primary: Select **"Lifestyle"** or **"Health & Fitness"** or **"Books & Reference"**
- Secondary (optional): **"Religion"**

**Tags (optional):**
- `spiritual guidance`
- `Bible`
- `meditation`
- `prayer`

### 3.4 Contact Details

**Website:**
```
https://dailypeace.life
```

**Email:**
```
privacy@dailypeace.life
```
(Or your contact email)

**Phone number:** (Optional - can skip)

### 3.5 Privacy Policy

**Privacy Policy URL:**
```
https://dailypeace.life/privacy-policy
```

**Confirm:** ✅ This URL is publicly accessible

### 3.6 Save Store Listing

1. Click **"Save"** at the top right
2. Wait for all uploads to complete
3. Check that all required fields are filled (no red warnings)

---

## 📦 Step 4: App Content - Content Rating

1. Go to: **"Policy" → "App content" → "Content rating"**

2. Click **"Start questionnaire"**

3. Answer the questions honestly:
   - **Does your app contain violence?** → No
   - **Does your app contain sexual content?** → No
   - **Does your app contain profanity?** → No
   - **Does your app contain drugs/alcohol?** → No
   - **Does your app contain gambling?** → No
   - **Does your app allow user-generated content?** → Yes (chat conversations)
   - **Does your app have social features?** → No
   - **Does your app collect user data?** → Yes (see privacy policy)
   - Continue answering all questions...

4. Click **"Submit"**

5. Review will be automatic - typically returns a rating of **"Everyone"** or **"Teen"**

6. Once approved, the rating will appear in your app listing

---

## 📤 Step 5: Upload Your App Bundle (AAB)

### Option A: Build AAB Now (Recommended)

If you haven't built an AAB yet, build it first:

```bash
cd c:\dailypeace-starter\dailypeace
eas build --platform android --profile production
```

Wait for the build to complete (15-30 minutes), then download the AAB file.

### Option B: Use Existing Build

If you have an AAB file from a previous build, use that.

### Upload to Play Console

1. Go to: **"Release" → "Production"** (in left sidebar)

2. Click **"Create new release"**

3. **Upload your AAB file:**
   - Click **"Browse files"** or drag & drop
   - Select your `.aab` file
   - Wait for upload to complete

4. **Release name:**
   ```
   1.0.0
   ```

5. **Release notes** (what's new in this version):
   ```
   Initial release of Daily Peace
   
   Features:
   - AI-powered spiritual guidance conversations
   - Daily reflections with Scripture verses
   - Three conversation modes (Conversational, Biblical, Reflective)
   - Voice input support
   - Beautiful, peaceful interface
   - Save and favorite verses
   ```

6. Click **"Save"** (don't submit yet)

---

## ✅ Step 6: Complete Required Sections

Before you can submit, you need to complete:

1. **Store listing** ✅ (Completed in Step 3)
2. **Content rating** ✅ (Completed in Step 4)
3. **App bundle uploaded** ✅ (Completed in Step 5)
4. **Privacy policy** ✅ (Added in Step 3.5)
5. **App access** (if applicable)
6. **Target audience and content** (if not done)

Check the left sidebar for any incomplete sections with red warnings.

---

## 🎯 Step 7: Pre-launch Checklist

Before submitting, verify:

- [ ] All store listing fields filled
- [ ] App icon uploaded and looks correct
- [ ] Feature graphic uploaded and looks correct
- [ ] At least 2 screenshots uploaded
- [ ] App descriptions are accurate
- [ ] Privacy policy URL is accessible
- [ ] Content rating completed
- [ ] AAB file uploaded
- [ ] Release notes written
- [ ] App name is correct: "Daily Peace"
- [ ] Category selected

---

## 🚀 Step 8: Submit for Review

1. Go to: **"Release" → "Production"**

2. Review your release:
   - Check the AAB version
   - Check release notes
   - Verify all sections are complete

3. Click **"Review release"** or **"Submit for review"**

4. Confirm submission:
   - Read any warnings
   - Accept terms if prompted
   - Click **"Confirm"** or **"Submit"**

5. **Status will change to:** "Under review"

---

## ⏳ Step 9: Wait for Review

**Typical timeline:**
- **Review time:** 1-7 days
- **Average:** 2-3 days

**You'll receive:**
- Email notifications when status changes
- Updates in Play Console dashboard

**Possible outcomes:**
1. ✅ **Approved** - App goes live!
2. ⚠️ **Changes requested** - Fix issues and resubmit
3. ❌ **Rejected** - Review rejection reasons

---

## 📧 Step 10: After Approval

Once approved:

1. **App goes live** in Google Play Store
2. **Search for "Daily Peace"** to verify
3. **Share the link** with users
4. **Monitor reviews** and respond to feedback
5. **Track analytics** in Play Console

---

## 🔧 Troubleshooting

### Issue: "Privacy Policy URL not accessible"
**Solution:** Verify `https://dailypeace.life/privacy-policy` opens in an incognito browser window.

### Issue: "Screenshots required"
**Solution:** Make sure you uploaded at least 2 phone screenshots in Step 3.2.

### Issue: "Content rating incomplete"
**Solution:** Go back to Step 4 and complete the questionnaire.

### Issue: "AAB file rejected"
**Solution:** 
- Check build logs for errors
- Verify app bundle is signed correctly
- Ensure version code is higher than any previous uploads

### Issue: "App rejected during review"
**Solution:**
- Read the rejection email carefully
- Address each issue mentioned
- Resubmit after fixing issues

---

## 📞 Need Help?

- **Google Play Console Help:** https://support.google.com/googleplay/android-developer
- **EAS Build Support:** https://docs.expo.dev/build/introduction/

---

## 🎉 You're Ready!

You have everything you need to submit. Follow these steps in order, and your app should be live in 1-7 days!

**Good luck with your submission!** 🚀
