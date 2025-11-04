#!/usr/bin/env python3
"""
Check for common Android build issues
"""

import os
import sys
from PIL import Image

def check_png_validity():
    """Check if PNG images are valid and properly formatted."""
    images = [
        "assets/images/hero-ocean.png",
        "assets/images/hero-mountain.png",
        "assets/images/hero-dove.png",
    ]
    
    print("Checking PNG image validity...")
    print("=" * 60)
    
    all_valid = True
    for img_path in images:
        if not os.path.exists(img_path):
            print(f"ERROR: {img_path} not found!")
            all_valid = False
            continue
        
        try:
            img = Image.open(img_path)
            img.verify()
            size = os.path.getsize(img_path)
            print(f"OK: {img_path}")
            print(f"  Size: {size:,} bytes")
            print(f"  Format: {img.format}")
            print(f"  Mode: {img.mode}")
            print(f"  Dimensions: {img.size[0]}x{img.size[1]}")
            
            # Check if file is too large (Android has limits)
            if size > 10 * 1024 * 1024:  # 10MB
                print(f"  WARNING: File is very large ({size / (1024*1024):.1f}MB)")
            
        except Exception as e:
            print(f"ERROR: {img_path} - INVALID: {e}")
            all_valid = False
        print()
    
    return all_valid

def check_app_json():
    """Check app.json configuration."""
    print("Checking app.json configuration...")
    print("=" * 60)
    
    import json
    try:
        with open("app.json", "r") as f:
            config = json.load(f)
        
        expo = config.get("expo", {})
        android = expo.get("android", {})
        package = android.get("package", "")
        
        print(f"Android package: {package}")
        if not package or package == "com.yourcompany.dailypeace":
            print("  WARNING: Package name might not be set correctly")
        
        bundle_id = expo.get("ios", {}).get("bundleIdentifier", "")
        print(f"iOS bundle ID: {bundle_id}")
        
        return True
    except Exception as e:
        print(f"ERROR reading app.json: {e}")
        return False

def main():
    print("Android Build Issue Checker")
    print("=" * 60)
    print()
    
    png_ok = check_png_validity()
    print()
    json_ok = check_app_json()
    print()
    
    print("=" * 60)
    if png_ok and json_ok:
        print("Basic checks passed.")
        print("If build still fails, check the Gradle build logs for specific errors.")
    else:
        print("Issues found. Please fix the errors above.")
    
    return 0 if (png_ok and json_ok) else 1

if __name__ == "__main__":
    sys.exit(main())
