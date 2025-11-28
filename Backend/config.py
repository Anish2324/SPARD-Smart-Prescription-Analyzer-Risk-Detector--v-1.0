import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    
    # MongoDB Atlas Configuration
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'prescription_safety_db')
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    # Upload Configuration
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'temp')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf', 'txt'}
    
    # OCR Configuration (Install Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki)
    TESSERACT_PATH = os.getenv('TESSERACT_PATH', r'C:\Program Files\Tesseract-OCR\tesseract.exe')
    
    # Risk Level Thresholds
    RISK_LEVELS = {
        'CRITICAL': 3,  # 3+ severe interactions
        'HIGH': 2,      # 2 interactions or 1 critical
        'MEDIUM': 1,    # 1 interaction
        'LOW': 0        # No interactions
    }
