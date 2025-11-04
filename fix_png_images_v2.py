#!/usr/bin/env python3
"""
Optimize PNG images for Android AAPT2 compatibility.
This version focuses on proper encoding with better compression.
"""

from PIL import Image
import os
import sys

# Images to fix
images_to_fix = [
    "assets/images/hero-ocean.png",
    "assets/images/hero-mountain.png",
    "assets/images/hero-dove.png",
]

def optimize_png(image_path):
    """Optimize PNG image for Android AAPT2 compatibility."""
    if not os.path.exists(image_path):
        print(f"Warning: {image_path} not found, skipping...")
        return False
    
    try:
        print(f"Processing: {image_path}...")
        
        # Load the image
        img = Image.open(image_path)
        
        # Get original info
        original_size = os.path.getsize(image_path)
        original_mode = img.mode
        
        # Convert to RGB or RGBA depending on transparency
        if img.mode in ('RGBA', 'LA', 'P'):
            # Check if image has transparency
            if img.mode == 'P':
                # Palette mode - check for transparency
                if 'transparency' in img.info:
                    output_img = img.convert('RGBA')
                else:
                    output_img = img.convert('RGB')
            elif img.mode == 'LA':
                output_img = img.convert('RGBA')
            else:
                output_img = img
        else:
            output_img = img.convert('RGB')
        
        # Create backup if not exists
        backup_path = image_path + ".backup"
        if not os.path.exists(backup_path):
            import shutil
            shutil.copy2(image_path, backup_path)
            print(f"  Created backup: {backup_path}")
        
        # Save with better compression settings
        # Use compress_level=6 for better balance between size and compatibility
        output_img.save(
            image_path,
            "PNG",
            optimize=True,
            compress_level=6
        )
        
        new_size = os.path.getsize(image_path)
        size_change = ((new_size - original_size) / original_size) * 100
        
        print(f"  Optimized successfully")
        print(f"    Size: {original_size:,} bytes -> {new_size:,} bytes ({size_change:+.1f}%)")
        print(f"    Mode: {original_mode} -> {output_img.mode}")
        
        return True
        
    except Exception as e:
        print(f"  Error processing {image_path}: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("Optimizing PNG images for Android AAPT2...")
    print("=" * 60)
    
    success_count = 0
    fail_count = 0
    
    for image_path in images_to_fix:
        if optimize_png(image_path):
            success_count += 1
        else:
            fail_count += 1
        print()
    
    print("=" * 60)
    print(f"Successfully processed: {success_count}/{len(images_to_fix)}")
    if fail_count > 0:
        print(f"Failed: {fail_count}/{len(images_to_fix)}")
    
    if success_count == len(images_to_fix):
        print("\nAll images optimized successfully!")
        return 0
    else:
        print("\nSome images failed to process.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
