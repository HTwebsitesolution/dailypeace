# 🔐 EAS Credentials Setup Guide
## Simple Web-Based Approach

Since the CLI can be confusing with interactive prompts, use the **web interface** instead!

---

## 🌐 Option 1: Web Interface (Easiest!)

### 1. Go to Your Project Credentials Page

**Open this URL in your browser:**
```
https://expo.dev/accounts/htweb/projects/daily-peace/credentials
```

Or:
1. Go to: https://expo.dev
2. Login with your account (`htweb`)
3. Navigate to: **Projects** → **daily-peace** → **Credentials**

### 2. Set Up Android Credentials

**Option A: Via the Ellipsis Menu**
1. Look for your bundle identifier: `life.dailypeace.app`
2. Click the **three dots (⋯)** menu icon next to it
3. Look for options like **"Manage credentials"**, **"Generate keystore"**, or **"Set up credentials"**
4. Click it and follow the prompts to generate

**Option B: Auto-Generate During Build (Easiest!)**
- Just start a build! EAS will automatically generate credentials when needed
- See "Option 2" below 👇

### 3. Set Up iOS Credentials

1. In the **iOS** section, you should see a box that says **"Upload Apple credentials"**
2. Click the **"Get Started →"** button
3. You'll be guided through:
   - Choose **"Let Expo handle credentials"** (recommended - most secure)
   - Authenticate with your **Apple ID** (the one linked to your Developer account)
   - If prompted, use an **App-Specific Password** (not your regular password)
     - Get one at: https://appleid.apple.com → Sign-In and Security → App-Specific Passwords
   - Select your **Team** (Apple Developer team)
4. ✅ Done!

---

## 📱 Option 2: Quick Build (Auto-Generate)

If you just want to build and let EAS figure it out:

### For Android:
```bash
cd c:\dailypeace-starter\dailypeace
eas build --platform android --profile production
```
- When prompted: Answer **"Yes"** to generate keystore
- EAS will auto-create and store everything

### For iOS:
```bash
eas build --platform ios --profile production
```
- EAS will guide you through Apple authentication
- Have your Apple ID and App-Specific Password ready

---

## 🔑 Getting App-Specific Password (iOS)

If you need an App-Specific Password for iOS:

1. Go to: https://appleid.apple.com
2. Sign in with your Apple ID
3. Go to **Sign-In and Security** section
4. Click **App-Specific Passwords**
5. Click **Generate an app-specific password**
6. Label it: "EAS Build" or "Expo"
7. Copy the password (you'll use this instead of your regular password)

---

## ✅ Verify Credentials Are Set Up

After setting up, verify at:
```
https://expo.dev/accounts/htweb/projects/daily-peace/credentials
```

You should see:
- ✅ **Android**: Keystore configured
- ✅ **iOS**: Distribution certificate configured

---

## 🚀 Once Credentials Are Ready

Come back and we'll start the builds! Or run:

```bash
# Build both platforms
npm run build:all

# Or individually
npm run build:android
npm run build:ios
```

---

## 💡 Pro Tips

1. **Use Web Interface**: Much easier than CLI for credential management
2. **Let EAS Manage**: Choose "Let Expo handle credentials" - it's more secure
3. **Save Passwords**: Keep your App-Specific Password in a password manager
4. **Build Anytime**: Once credentials are set, builds just work!

---

**Need Help?**
- EAS Docs: https://docs.expo.dev/app-signing/managed-credentials/
- Expo Dashboard: https://expo.dev/accounts/htweb/projects/daily-peace
