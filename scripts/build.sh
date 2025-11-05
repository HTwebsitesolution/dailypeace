#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting Daily Peace build..."

# Export web build
echo "📦 Exporting Expo web build..."
npx expo export --platform web --output-dir web-dist

# Create icons directory
echo "📁 Creating icons directory..."
mkdir -p web-dist/icons

# Copy icon files (check if they exist first)
if [ -f "assets/icon.png" ]; then
  echo "📸 Copying icon files..."
  cp assets/icon.png web-dist/icons/icon-192.png
  cp assets/icon.png web-dist/icons/icon-512.png
  cp assets/icon.png web-dist/icons/maskable-512.png
else
  echo "⚠️  Warning: assets/icon.png not found, skipping icon copy"
fi

# Copy manifest if exists
if [ -f "public/manifest.json" ]; then
  echo "📄 Copying manifest.json..."
  cp public/manifest.json web-dist/manifest.json
else
  echo "⚠️  Warning: public/manifest.json not found"
fi

# Copy privacy policy if exists
if [ -f "public/privacy-policy.html" ]; then
  echo "📋 Copying privacy policy..."
  cp public/privacy-policy.html web-dist/privacy-policy.html
else
  echo "⚠️  Warning: public/privacy-policy.html not found"
fi

# Copy terms of use if exists
if [ -f "public/terms-of-use.html" ]; then
  echo "📄 Copying terms of use..."
  cp public/terms-of-use.html web-dist/terms-of-use.html
else
  echo "⚠️  Warning: public/terms-of-use.html not found"
fi

# Create _redirects file
echo "🔀 Creating _redirects file..."
cat > web-dist/_redirects << 'EOF'
# API routes
/api/* /.netlify/functions/:splat 200

# Privacy policy (serve directly)
/privacy-policy /privacy-policy.html 200

# Terms of use (serve directly)
/terms-of-use /terms-of-use.html 200

# SPA fallback
/* /index.html 200
EOF

echo "✅ Build complete!"
