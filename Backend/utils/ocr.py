import os
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import google.generativeai as genai

# Try to import OCR dependencies
try:
    import pytesseract
    from pdf2image import convert_from_path
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    print("⚠️ Tesseract OCR not available. Will use Gemini Vision as fallback.")

from config import Config

class OCRProcessor:
    """Handles Optical Character Recognition (OCR) to extract text from images and PDFs.
    Uses Tesseract OCR as primary method and Gemini Vision as intelligent fallback.
    """
    
    def __init__(self):
        self.tesseract_available = TESSERACT_AVAILABLE
        
        # Initialize Gemini for fallback
        self.gemini_api_key = getattr(Config, 'GEMINI_API_KEY', None)
        self.gemini_model = None
        if self.gemini_api_key:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
                print("✅ Gemini Vision initialized as OCR fallback")
            except Exception as e:
                print(f"⚠️ Gemini Vision initialization failed: {e}")
        
        if TESSERACT_AVAILABLE:
            try:
                # Set the path to the Tesseract executable
                pytesseract.pytesseract.tesseract_cmd = Config.TESSERACT_PATH
                # Test if Tesseract is working
                test_result = pytesseract.get_tesseract_version()
                print(f"✅ Tesseract OCR version: {test_result}")
            except Exception as e:
                print(f"⚠️ Tesseract configuration failed: {e}")
                self.tesseract_available = False

    def _preprocess_image(self, image_path):
        """Enhance image quality for better OCR accuracy."""
        try:
            # Read image with OpenCV
            img = cv2.imread(image_path)
            if img is None:
                # Fallback to PIL if OpenCV fails
                pil_img = Image.open(image_path)
                return pil_img
            
            # Convert to RGB (OpenCV uses BGR)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            # Convert to grayscale for better OCR
            gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
            
            # Apply denoising
            denoised = cv2.fastNlMeansDenoising(gray)
            
            # Apply adaptive thresholding for better text contrast
            thresh = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
            
            # Morphological operations to clean up text
            kernel = np.ones((1,1), np.uint8)
            cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
            
            # Convert back to PIL Image
            enhanced_img = Image.fromarray(cleaned)
            
            # Additional PIL enhancements
            enhanced_img = enhanced_img.filter(ImageFilter.MedianFilter())
            enhancer = ImageEnhance.Contrast(enhanced_img)
            enhanced_img = enhancer.enhance(2.0)
            
            print("✨ Image preprocessing completed")
            return enhanced_img
            
        except Exception as e:
            print(f"⚠️ Image preprocessing failed: {e}, using original image")
            return Image.open(image_path)

    def _extract_with_gemini_vision(self, image_path):
        """Use Gemini Vision to extract text from prescription image as fallback."""
        if not self.gemini_model:
            return None
            
        try:
            print(f"🤖 Using Gemini Vision as OCR fallback for: {image_path}")
            
            # Open and prepare image for Gemini
            image = Image.open(image_path)
            
            # Create prompt for prescription text extraction
            prompt = """
Please extract all text from this prescription image. Focus on:
1. Doctor's name and clinic information
2. Patient information
3. All medication names, dosages, and instructions
4. Any other relevant medical text

Return only the extracted text, maintaining the original structure as much as possible.
If this is not a prescription image, please say "Not a prescription image".
"""
            
            # Send image to Gemini Vision
            response = self.gemini_model.generate_content([prompt, image])
            
            if response and response.text:
                extracted_text = response.text.strip()
                print(f"🤖 GEMINI VISION: Successfully extracted {len(extracted_text)} characters")
                print(f"📝 Gemini extraction preview: {extracted_text[:200]}...")
                return extracted_text
            else:
                print("⚠️ GEMINI VISION: Returned empty response")
                return None
                
        except Exception as e:
            print(f"❌ Gemini Vision OCR failed: {e}")
            return None

    def _is_pdf(self, filepath):
        """Check if the file is a PDF."""
        return filepath.lower().endswith('.pdf')
    
    def _is_text_file(self, filepath):
        """Check if the file is a text file."""
        return filepath.lower().endswith('.txt')

    def _process_text_file(self, filepath):
        """Read text directly from text file."""
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
                print(f"✅ Read text file: {len(content)} characters")
                return content
        except Exception as e:
            print(f"❌ Error reading text file {filepath}: {e}")
            return ""

    def _process_image(self, filepath):
        """Extract text from a single image file with enhanced preprocessing."""
        if not self.tesseract_available:
            print("⚠️ Tesseract OCR not available. Trying Gemini Vision fallback...")
            if os.path.exists(filepath):
                gemini_result = self._extract_with_gemini_vision(filepath)
                if gemini_result:
                    print("✅ SUCCESS: Text extracted using GEMINI VISION (OCR unavailable)")
                    return {'text': gemini_result, 'method': 'gemini_vision', 'success': True}
            print("❌ FAILED: Both Tesseract and Gemini Vision unavailable")
            return {'text': 'Error: Unable to extract text. Please ensure the image is clear and readable.', 'method': 'error', 'success': False}
        
        try:
            print(f"🔍 Processing image: {filepath}")
            if not os.path.exists(filepath):
                print("❌ FAILED: Image file not found")
                return {'text': 'Error: Image file not found.', 'method': 'error', 'success': False}
            
            # Try simple OCR first (often works best for clean prescription images)
            simple_result = pytesseract.image_to_string(Image.open(filepath))
            print(f"🔍 Simple OCR result: '{simple_result[:150]}...' ({len(simple_result)} chars)")
            
            # If simple OCR gives good results, use it
            if len(simple_result.strip()) > 50:
                result = simple_result
                print("✅ Using simple OCR result")
            else:
                # Fallback to enhanced preprocessing
                print("🔄 Simple OCR insufficient, trying enhanced preprocessing...")
                enhanced_image = self._preprocess_image(filepath)
                
                # OCR configuration for medical prescriptions
                custom_config = r'--oem 3 --psm 6'
                
                # Extract text with enhanced settings
                result = pytesseract.image_to_string(enhanced_image, config=custom_config)
            
            # Try multiple OCR approaches if first attempt yields little text
            if len(result.strip()) < 20:
                print("🔄 Low text detected, trying alternative OCR settings...")
                
                configs_to_try = [
                    r'--oem 3 --psm 4',  # Single column of text of variable sizes
                    r'--oem 3 --psm 8',  # Treat image as single word
                    r'--oem 3 --psm 11', # Sparse text, find as much text as possible
                    r'--oem 3 --psm 13'  # Raw line, treat image as single text line
                ]
                
                best_result = result
                for config in configs_to_try:
                    try:
                        temp_result = pytesseract.image_to_string(enhanced_image, config=config)
                        if len(temp_result.strip()) > len(best_result.strip()):
                            best_result = temp_result
                            print(f"✨ Better result found with config: {config}")
                    except:
                        continue
                
                result = best_result
            
            # Clean up the result
            result = result.strip()
            print(f"✅ SUCCESS: Text extracted using TESSERACT OCR ({len(result)} characters)")
            
            # Debug: Show first 200 characters of extracted text
            if result:
                print(f"📝 Extracted text preview: {result[:200]}...")
            else:
                print("📝 No text extracted from image")
            
            if len(result) < 10:
                print("⚠️ Very little text extracted. Image may be unclear or rotated.")
                
            return {'text': result, 'method': 'tesseract', 'success': True}
            
        except Exception as e:
            print(f"❌ TESSERACT FAILED for {filepath}: {e}")
            print("🔄 FALLBACK: Trying Gemini Vision...")
            
            # Try Gemini Vision as fallback
            if os.path.exists(filepath):
                gemini_result = self._extract_with_gemini_vision(filepath)
                if gemini_result:
                    print("✅ SUCCESS: Text extracted using GEMINI VISION (Tesseract fallback)")
                    return {'text': gemini_result, 'method': 'gemini_vision', 'success': True}
            
            print(f"❌ FAILED: Both Tesseract and Gemini Vision failed")
            return {'text': f'Error: Failed to extract text from image. OCR error: {str(e)}', 'method': 'error', 'success': False}

    def _process_pdf(self, filepath):
        """Convert PDF to images and extract text from each page."""
        try:
            pages = convert_from_path(filepath)
            full_text = ""
            for i, page in enumerate(pages):
                # Save the page as a temporary image file
                temp_image_path = os.path.join(Config.UPLOAD_FOLDER, f"temp_page_{i}.jpg")
                page.save(temp_image_path, 'JPEG')
                
                # Extract text from the temporary image
                full_text += pytesseract.image_to_string(Image.open(temp_image_path)) + "\n\n"
                
                # Clean up the temporary image file
                os.remove(temp_image_path)
            return full_text
        except Exception as e:
            print(f"Error processing PDF {filepath}: {e}")
            return ""

    def extract_text(self, filepath):
        """
        Extracts text from an uploaded file (image, PDF, or text).
        
        Args:
            filepath (str): The absolute path to the file.
            
        Returns:
            dict: {
                'text': str - The extracted text,
                'method': str - Method used ('tesseract', 'gemini_vision', 'text_file', 'pdf', 'error'),
                'success': bool - Whether extraction was successful
            }
        """        
        file_extension = os.path.splitext(filepath)[1].lower()
        print(f"📄 Processing file type: {file_extension}")
        
        if file_extension in ['.txt']:
            if not os.path.exists(filepath):
                print(f"❌ Text file not found: {filepath}")
                return {'text': '', 'method': 'error', 'success': False}
            text = self._process_text_file(filepath)
            return {'text': text, 'method': 'text_file', 'success': bool(text)}
        elif file_extension == '.pdf':
            text = self._process_pdf(filepath)
            return {'text': text, 'method': 'pdf', 'success': bool(text)}
        else:
            # For images, _process_image now returns dict with method info
            return self._process_image(filepath)

# Example usage:
if __name__ == '__main__':
    # Create a dummy file for testing
    dummy_file = os.path.join(Config.UPLOAD_FOLDER, 'test.png')
    if not os.path.exists(dummy_file):
        # You should have a test image in your temp folder
        print("Please add a test image to the 'temp' folder to run this example.")
    else:
        ocr = OCRProcessor()
        text = ocr.extract_text(dummy_file)
        print("Extracted Text:")
        print(text)
