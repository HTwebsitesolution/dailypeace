# Play Store Submission Checklist

## ✅ Immediate Actions

### 1. Update Build Configuration
- [x] Changed `buildType` from `apk` to `aab` in `eas.json`

### 2. Build AAB File
```bash
cd c:\dailypeace-starter\dailypeace
eas build --platform android --profile production
```
- [ ] AAB file built successfully
- [ ] Downloaded AAB file

---

## 📋 Required Before Submission

### Google Play Console
- [ ] Create Google Play Console account
- [ ] Pay $25 registration fee (one-time)
- [ ] Complete developer profile

### App Assets
- [ ] App icon: 512x512 PNG (check: `assets/branding/icons/icon-android.png`)
- [ ] Feature graphic: 1024x500 PNG/JPG (need to create)
- [ ] Screenshots: At least 2 phone screenshots (16:9 or 9:16)
- [ ] Tablet screenshots: Optional but recommended

### App Information
- [ ] App name: "Daily Peace"
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max)
- [ ] Category selected (Lifestyle/Health/Books)
- [ ] Content rating completed
- [ ] Target countries selected

### Legal/Policy
- [ ] Privacy Policy URL created and publicly accessible
  - Suggested: `https://dailypeace.life/privacy-policy`
  - Must mention OpenAI, Netlify, data collection

### App Release
- [ ] AAB file uploaded to Play Console
- [ ] Release name: "1.0.0"
- [ ] Release notes written

---

## 🎯 Quick Start Commands

### Build AAB:
```bash
cd c:\dailypeace-starter\dailypeace
eas build --platform android --profile production
```

### Submit (after Play Console setup):
```bash
eas submit --platform android --latest
```

---

## 📝 Next Steps Order

1. **Build AAB** ← Start here!
2. **Create privacy policy** page
3. **Capture screenshots** from web app
4. **Set up Play Console** account
5. **Upload and submit**

---

**Status:** Ready to build AAB! 🚀
