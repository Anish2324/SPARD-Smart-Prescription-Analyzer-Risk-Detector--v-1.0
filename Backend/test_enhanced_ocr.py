#!/usr/bin/env python3
"""Test enhanced OCR with a real prescription image."""

from utils.ocr import OCRProcessor
import os

def test_enhanced_ocr():
    """Test the enhanced OCR processor."""
    ocr = OCRProcessor()
    
    print("🧪 Testing Enhanced OCR System")
    print("=" * 50)
    
    # Check temp folder for any uploaded images
    temp_folder = "temp"
    if os.path.exists(temp_folder):
        image_files = [f for f in os.listdir(temp_folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        if image_files:
            print(f"📁 Found {len(image_files)} images in temp folder")
            for img_file in image_files[:2]:  # Test first 2 images
                filepath = os.path.join(temp_folder, img_file)
                print(f"\n🔍 Testing: {img_file}")
                result = ocr.extract_text(filepath)
                print(f"📄 Full extracted text:\n{result}\n")
                print("-" * 40)
        else:
            print("📁 No images found in temp folder")
    else:
        print("📁 Temp folder not found")

if __name__ == "__main__":
    test_enhanced_ocr()