# Netlify Build Troubleshooting Guide

## How to Access Build Logs

### Step 1: Open Netlify Dashboard
1. Go to: https://app.netlify.com
2. Sign in to your account
3. Click on your site (likely named "dailypeace" or similar)

### Step 2: View Deployments
1. Click on **"Deploys"** in the top menu
2. Find the most recent deployment (should show "Building..." or status)
3. Click on the deployment to see details

### Step 3: Check Build Logs
1. Click **"View build log"** or expand the build output
2. Scroll through to find any errors (usually in red)
3. Copy the error message and last 20-30 lines

---

## Common Build Errors & Solutions

### Error 1: `mkdir -p` or `cp` command failed
**Symptoms:**
```
Error: mkdir: cannot create directory
Error: cp: cannot stat 'assets/icon.png': No such file or directory
```

**Solution:**
- The file paths might be incorrect
- Check that `assets/icon.png` and `public/manifest.json` exist
- Fix: Update the build command (see below)

---

### Error 2: `printf` command failed
**Symptoms:**
```
Error: printf: invalid format
```

**Solution:**
- The `printf` command might have escaping issues
- Fix: Use `echo` instead or create the file differently

---

### Error 3: Build timeout
**Symptoms:**
```
Error: Build exceeded maximum build time
```

**Solution:**
- Free tier has 15-minute limit
- The `expo export` step can take 10+ minutes
- Fix: Upgrade Netlify plan or optimize build

---

### Error 4: Missing dependencies
**Symptoms:**
```
Error: Cannot find module 'expo'
Error: Command 'expo' not found
```

**Solution:**
- Dependencies not installed properly
- Fix: Ensure `package.json` has all required dependencies
- Netlify should run `npm install` automatically

---

### Error 5: File not found errors
**Symptoms:**
```
Error: ENOENT: no such file or directory
```

**Possible missing files:**
- `assets/icon.png`
- `public/manifest.json`
- `public/privacy-policy.html`

**Solution:**
- Verify all files exist in the repository
- Check file paths in the build command

---

## Quick Fix: Improved Build Command

The current build command is very long. Here's a more reliable version:

### Option 1: Use a build script (Recommended)
Create `scripts/build.sh`:
```bash
#!/bin/bash
set -e  # Exit on any error

# Export web build
npx expo export --platform web --output-dir web-dist

# Create icons directory
mkdir -p web-dist/icons

# Copy files (check if they exist first)
if [ -f "assets/icon.png" ]; then
  cp assets/icon.png web-dist/icons/icon-192.png
  cp assets/icon.png web-dist/icons/icon-512.png
  cp assets/icon.png web-dist/icons/maskable-512.png
fi

# Copy manifest if exists
if [ -f "public/manifest.json" ]; then
  cp public/manifest.json web-dist/manifest.json
fi

# Copy privacy policy if exists
if [ -f "public/privacy-policy.html" ]; then
  cp public/privacy-policy.html web-dist/privacy-policy.html
fi

# Create _redirects file
cat > web-dist/_redirects << 'EOF'
# API routes
/api/* /.netlify/functions/:splat 200

# Privacy policy (serve directly)
/privacy-policy /privacy-policy.html 200

# SPA fallback
/* /index.html 200
EOF

echo "Build complete!"
```

Then in `netlify.toml`:
```toml
[build]
  command = "bash scripts/build.sh"
```

### Option 2: Simplified inline command
```toml
[build]
  command = "npx expo export --platform web --output-dir web-dist && bash -c 'mkdir -p web-dist/icons && [ -f assets/icon.png ] && cp assets/icon.png web-dist/icons/icon-192.png && cp assets/icon.png web-dist/icons/icon-512.png && cp assets/icon.png web-dist/icons/maskable-512.png || true' && [ -f public/manifest.json ] && cp public/manifest.json web-dist/manifest.json || true && [ -f public/privacy-policy.html ] && cp public/privacy-policy.html web-dist/privacy-policy.html || true && echo '# API routes\n/api/* /.netlify/functions/:splat 200\n\n# Privacy policy\n/privacy-policy /privacy-policy.html 200\n\n# SPA fallback\n/* /index.html 200' > web-dist/_redirects"
```

---

## What to Check in Logs

### 1. Build Phases
Look for these phases in order:
- ✅ `Installing dependencies`
- ✅ `Installing NPM modules`
- ✅ `Running build command`
- ✅ `Bundling JavaScript`
- ✅ `Exporting assets`
- ✅ `Publishing directory`

### 2. Error Indicators
- ❌ `ERROR:` or `Error:`
- ❌ `FAILED` or `Failed`
- ❌ `Command failed with exit code`
- ❌ `Build script returned non-zero exit code`

### 3. Success Indicators
- ✅ `Build script success`
- ✅ `Publishing site`
- ✅ `Site published`

---

## Manual Build Test (Local)

Test the build command locally before pushing:

```bash
cd c:\dailypeace-starter\dailypeace

# Test the export command
npx expo export --platform web --output-dir web-dist

# Check if web-dist was created
ls web-dist

# Test copying files
mkdir -p web-dist/icons
cp assets/icon.png web-dist/icons/icon-192.png

# Check if privacy policy exists
ls public/privacy-policy.html
```

---

## Next Steps

1. **Share the build logs** - Copy the error message and last 20-30 lines
2. **Check file existence** - Verify all files mentioned in the build command exist
3. **Try the fix** - Update the build command with the improved version
4. **Retry deployment** - Push a new commit or trigger a rebuild

---

## Still Having Issues?

1. Share the **exact error message** from Netlify logs
2. Share the **last 20-30 lines** of the build output
3. Confirm which **phase** the build fails at
4. Check if the build **times out** (over 15 minutes)

We can then provide a specific fix for your error!











