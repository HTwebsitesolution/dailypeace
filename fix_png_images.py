#!/usr/bin/env python3
"""
Re-encode PNG images to fix Android AAPT2 compatibility issues.
This script loads PNG images and saves them with proper encoding.
"""

from PIL import Image
import os
import sys

# Images to fix (the ones causing AAPT2 errors)
images_to_fix = [
    "assets/images/hero-ocean.png",
    "assets/images/hero-mountain.png",
    "assets/images/hero-dove.png",  # Fix this one too as precaution
]

def reencode_png(image_path):
    """Re-encode a PNG image to ensure Android AAPT2 compatibility."""
    if not os.path.exists(image_path):
        print(f"Warning: {image_path} not found, skipping...")
        return False
    
    try:
        print(f"Processing: {image_path}...")
        
        # Load the image
        img = Image.open(image_path)
        
        # Get original format info
        original_size = os.path.getsize(image_path)
        original_mode = img.mode
        
        # Convert RGBA to RGB if no transparency is needed, or keep RGBA
        # For hero images, we want to preserve transparency if present
        if img.mode == 'RGBA':
            # Keep RGBA mode
            output_img = img
        elif img.mode == 'P':
            # Palette mode - convert to RGBA to preserve transparency
            output_img = img.convert('RGBA')
        else:
            # Other modes - convert to RGB
            output_img = img.convert('RGB')
        
        # Create backup
        backup_path = image_path + ".backup"
        if not os.path.exists(backup_path):
            import shutil
            shutil.copy2(image_path, backup_path)
            print(f"  Created backup: {backup_path}")
        
        # Save with optimization and proper encoding
        # Use optimize=True and compress_level=9 for best compatibility
        output_img.save(
            image_path,
            "PNG",
            optimize=True,
            compress_level=9
        )
        
        new_size = os.path.getsize(image_path)
        size_change = ((new_size - original_size) / original_size) * 100
        
        print(f"  Re-encoded successfully")
        print(f"    Size: {original_size:,} bytes -> {new_size:,} bytes ({size_change:+.1f}%)")
        print(f"    Mode: {original_mode} -> {output_img.mode}")
        
        return True
        
    except Exception as e:
        print(f"  Error processing {image_path}: {e}")
        return False

def main():
    print("Re-encoding PNG images for Android AAPT2 compatibility...")
    print("=" * 60)
    
    success_count = 0
    fail_count = 0
    
    for image_path in images_to_fix:
        if reencode_png(image_path):
            success_count += 1
        else:
            fail_count += 1
        print()
    
    print("=" * 60)
    print(f"Successfully processed: {success_count}/{len(images_to_fix)}")
    if fail_count > 0:
        print(f"Failed: {fail_count}/{len(images_to_fix)}")
    
    if success_count == len(images_to_fix):
        print("\nAll images processed successfully!")
        print("   You can now rebuild the Android app.")
        return 0
    else:
        print("\nSome images failed to process.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
