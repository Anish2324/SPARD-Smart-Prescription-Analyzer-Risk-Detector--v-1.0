import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    
    # MongoDB Configuration
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'prescription_safety_db')
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_FILE_SIZE', 16 * 1024 * 1024))  # 16MB default
    
    # Upload Configuration
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), os.getenv('UPLOAD_FOLDER', 'temp'))
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf', 'txt'}
    
    # OCR Configuration (Install Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki)
    TESSERACT_PATH = os.getenv('TESSERACT_PATH', r'C:\Program Files\Tesseract-OCR\tesseract.exe')
    
    # AI/ML Configuration
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    USE_GEMINI_API = os.getenv('USE_GEMINI_API', 'true').lower() == 'true'
    GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.5-pro')
    LOCAL_MODELS_FALLBACK = os.getenv('LOCAL_MODELS_FALLBACK', 'true').lower() == 'true'
    
    # Authentication Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-jwt-key')
    JWT_EXPIRY_HOURS = int(os.getenv('JWT_EXPIRY_HOURS', 24))
    BCRYPT_ROUNDS = int(os.getenv('BCRYPT_ROUNDS', 12))
    
    # Application Configuration
    DEBUG = os.getenv('DEBUG_MODE', 'true').lower() == 'true'
    HOST = os.getenv('HOST', '127.0.0.1')
    PORT = int(os.getenv('PORT', 5000))
    
    # CORS Configuration
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
    
    # Risk Level Thresholds
    RISK_LEVELS = {
        'CRITICAL': 3,  # 3+ severe interactions
        'HIGH': 2,      # 2 interactions or 1 critical
        'MEDIUM': 1,    # 1 interaction
        'LOW': 0        # No interactions
    }
