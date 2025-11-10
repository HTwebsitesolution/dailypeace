# Submit Daily Peace to Google Play Store - Step-by-Step from Cursor

## 🎯 Quick Start Checklist

Before you begin, make sure you have:
- ✅ Google Play Console account (login ready)
- ✅ AAB file built (or ready to build)
- ✅ All assets ready (icons, screenshots, feature graphic)

---

## 📋 STEP 1: Build Your AAB File (If Not Done Yet)

**In Cursor Terminal:**

```bash
cd c:\dailypeace-starter\dailypeace
eas build --platform android --profile production
```

**Wait for build to complete** (15-30 minutes), then:
- Go to: https://expo.dev/accounts/htweb/projects/daily-peace/builds
- Download the `.aab` file
- Save it somewhere easy to find (like Desktop)

---

## 🌐 STEP 2: Open Google Play Console

1. **Open in browser:** https://play.google.com/console
2. **Log in** with your Google account
3. **Pay $25 fee** if this is your first time (one-time payment)

---

## 📱 STEP 3: Create New App

1. Click **"Create app"** button (top right)
2. Fill in:
   - **App name:** `Daily Peace`
   - **Default language:** `English (United States)`
   - **App or game:** `App`
   - **Free or paid:** `Free`
   - ✅ Check all policy checkboxes
3. Click **"Create app"**

---

## 🎨 STEP 4: Complete Store Listing

Navigate to: **"Store presence" → "Main store listing"**

### 4.1 App Details

**App name:**
```
Daily Peace
```

**Short description (80 chars max):**
```
Find peace, calm and hope daily through Scripture and gentle conversation
```

**Full description:**
*(Copy from `PLAY-STORE-QUICK-REFERENCE.md` or see below)*

**Copy this entire block:**
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

### 4.2 Upload Graphics

**App Icon:**
1. Click **"Browse"** or drag & drop
2. Navigate to: `c:\dailypeace-starter\dailypeace\assets\branding\icons\`
3. Upload: `icon-android.png` (512×512)

**Feature Graphic:**
1. Click **"Browse"** or drag & drop
2. Navigate to: `c:\dailypeace-starter\dailypeace\assets\branding\`
3. Upload: `feature graphic - dailypeace.png` (1024×500)

### 4.3 Upload Screenshots

**Phone Screenshots (Required - at least 2):**
1. Click **"Add phone screenshots"**
2. Upload these files from `c:\dailypeace-starter\dailypeace\`:
   - `play-store-screenshot-1-home.png`
   - `play-store-screenshot-2-home-alt.png`
   - `play-store-screenshot-3-phone-720x1280.png`
   - `play-store-screenshot-4-phone-1080x1920.png`

**7-inch Tablet Screenshots:**
1. Click **"Add 7-inch tablet screenshots"**
2. Upload: `play-store-screenshot-7inch-tablet-1280x800.png`

**10-inch Tablet Screenshots:**
1. Click **"Add 10-inch tablet screenshots"**
2. Upload: `play-store-screenshot-10inch-tablet-1920x1200.png`

**Chromebook Screenshots (Up to 4):**
1. Click **"Add Chromebook screenshots"**
2. Upload all 4:
   - `play-store-screenshot-chromebook-1-1920x1080.png`
   - `play-store-screenshot-chromebook-2-1920x1080.png`
   - `play-store-screenshot-chromebook-3-1920x1080.png`
   - `play-store-screenshot-chromebook-4-1920x1080.png`

**Android XR Screenshots (Up to 4):**
1. Click **"Add Android XR screenshots"**
2. Upload all 4:
   - `play-store-screenshot-xr-1-2880x1440.png`
   - `play-store-screenshot-xr-2-2880x1440.png`
   - `play-store-screenshot-xr-3-2880x1440.png`
   - `play-store-screenshot-xr-4-2880x1440.png`

### 4.4 Categorization

**App category:**
- Primary: Select **"Lifestyle"** (or "Health & Fitness" / "Books & Reference")
- Secondary (optional): **"Religion"**

### 4.5 Contact Details

**Website:**
```
https://dailypeace.life
```

**Email:**
```
privacy@dailypeace.life
```

**Phone:** (Optional - leave blank)

### 4.6 Privacy Policy

**Privacy Policy URL:**
```
https://dailypeace.life/privacy-policy
```

✅ Check: "This URL is publicly accessible"

### 4.7 Save

1. Click **"Save"** (top right)
2. Wait for all uploads to finish
3. Check for any red error messages

---

## 📋 STEP 5: Complete Content Rating

1. Go to: **"Policy" → "App content" → "Content rating"**
2. Click **"Start questionnaire"**
3. Answer questions:
   - **Violence?** → No
   - **Sexual content?** → No
   - **Profanity?** → No
   - **Drugs/alcohol?** → No
   - **Gambling?** → No
   - **User-generated content?** → Yes (chat conversations)
   - **Social features?** → No
   - **Collects user data?** → Yes (see privacy policy)
4. Continue answering all questions
5. Click **"Submit"**
6. Wait for automatic rating (usually "Everyone" or "Teen")

---

## 📤 STEP 6: Upload AAB File

1. Go to: **"Release" → "Production"** (left sidebar)
2. Click **"Create new release"**
3. **Upload your AAB:**
   - Click **"Browse files"** or drag & drop
   - Select your `.aab` file (downloaded from EAS)
   - Wait for upload to complete

4. **Release name:**
```
1.0.0
```

5. **Release notes:**
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

## ✅ STEP 7: Final Checklist

Before submitting, verify all sections are complete:

- [ ] Store listing saved with all fields filled
- [ ] App icon uploaded
- [ ] Feature graphic uploaded
- [ ] At least 2 phone screenshots uploaded
- [ ] Tablet screenshots uploaded (if applicable)
- [ ] Chromebook screenshots uploaded (if applicable)
- [ ] Android XR screenshots uploaded (if applicable)
- [ ] Privacy policy URL added
- [ ] Content rating completed
- [ ] AAB file uploaded
- [ ] Release notes written
- [ ] App category selected

**Check left sidebar** - all sections should be green/complete (no red warnings)

---

## 🚀 STEP 8: Submit for Review

1. Go to: **"Release" → "Production"**
2. Click **"Review release"** or **"Submit for review"**
3. Review all information
4. Click **"Confirm"** or **"Submit"**
5. Status will change to: **"Under review"**

---

## ⏳ STEP 9: Wait for Review

**Typical Timeline:**
- **Review time:** 1-7 days
- **Average:** 2-3 days

**You'll receive:**
- Email notifications when status changes
- Updates in Play Console dashboard

**Possible Outcomes:**
1. ✅ **Approved** - Your app goes live!
2. ⚠️ **Changes requested** - Fix issues and resubmit
3. ❌ **Rejected** - Review feedback and fix issues

---

## 📧 STEP 10: After Approval

Once approved:
1. **App goes live** in Google Play Store
2. **Search** for "Daily Peace" to verify
3. **Share the link** with users
4. **Monitor reviews** and respond to feedback
5. **Track analytics** in Play Console

---

## 🔧 Quick Troubleshooting

**"Privacy Policy URL not accessible"**
→ Verify `https://dailypeace.life/privacy-policy` opens in an incognito browser

**"Screenshots required"**
→ Make sure you uploaded at least 2 phone screenshots

**"Content rating incomplete"**
→ Go back to Step 5 and complete the questionnaire

**"AAB file rejected"**
→ Check build logs, verify signing, ensure version code is correct

---

## 📁 File Locations Quick Reference

All files are in: `c:\dailypeace-starter\dailypeace\`

- **App Icon:** `assets\branding\icons\icon-android.png`
- **Feature Graphic:** `assets\branding\feature graphic - dailypeace.png`
- **Screenshots:** All `play-store-screenshot-*.png` files in root folder

---

## 🎉 You're Ready!

Follow these steps in order, and your app should be live in 1-7 days!

**Need the full description?** See `PLAY-STORE-QUICK-REFERENCE.md`

**Good luck!** 🚀

