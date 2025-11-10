# How to Run the Android Build

## ✅ Run in Your Local Terminal (PowerShell or Command Prompt)

**Important:** Run this in your own terminal (not in Cursor), as EAS may need interactive prompts.

---

## Step-by-Step Instructions

### 1. Open Your Terminal

Open **PowerShell** or **Command Prompt** on Windows.

### 2. Navigate to the Project Directory

```bash
cd c:\dailypeace-starter\dailypeace
```

### 3. Verify You're Logged into EAS

If you haven't logged in yet, run:
```bash
eas login
```

### 4. Run the Android Build

```bash
eas build --platform android --profile production
```

---

## What to Expect

### During the Build:

1. **EAS will check credentials** - If Android keystore doesn't exist, it will prompt you to generate one (answer "Yes")

2. **Build will start** - You'll see:
   ```
   Build started, it may take a few minutes to complete.
   › Build ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

3. **Monitor progress** - You can watch the build at:
   ```
   https://expo.dev/accounts/htweb/projects/daily-peace/builds
   ```

4. **Build time** - Typically takes **15-30 minutes**

5. **Completion** - You'll get a download link for the APK when it's done

---

## Alternative: Use the Build URL

If you prefer to trigger the build from the web interface:

1. Go to: https://expo.dev/accounts/htweb/projects/daily-peace/builds
2. Click **"New Build"**
3. Select **Android** → **Production** profile
4. Click **"Start Build"**

---

## Troubleshooting

### If asked to generate keystore:
- Answer **"Yes"** - EAS will automatically create and store it

### If build fails:
- Check the build logs at the URL provided
- Copy the error message and we can fix it

### If credentials are missing:
- The build will prompt you to set them up automatically
- Or set them up via web: https://expo.dev/accounts/htweb/projects/daily-peace/credentials

---

**Ready to build!** 🚀











