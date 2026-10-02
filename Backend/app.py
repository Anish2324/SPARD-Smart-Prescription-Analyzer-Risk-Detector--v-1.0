import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import uuid
import hashlib
from datetime import datetime
from functools import wraps

from config import Config
from utils.ocr import OCRProcessor
from utils.medicine_parser import MedicineParser
from utils.db import DatabaseManager
from utils.ai_drug_analyzer import DrugInteractionAIModel
from utils.auth_manager import AuthManager

# Initialize Flask App
app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=Config.CORS_ORIGINS)  # Enable CORS with specific origins

# Ensure the upload folder exists
if not os.path.exists(Config.UPLOAD_FOLDER):
    os.makedirs(Config.UPLOAD_FOLDER)

# Initialize utility classes
ocr_processor = OCRProcessor()
medicine_parser = MedicineParser()
db_manager = DatabaseManager()
ai_model = DrugInteractionAIModel(gemini_api_key=Config.GEMINI_API_KEY, model_name=Config.GEMINI_MODEL)
auth_manager = AuthManager(db_manager)

# Make auth_manager available to the app context
app.auth_manager = auth_manager

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def token_required(f):
    """Decorator to require JWT token for protected routes."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]  # Remove 'Bearer ' prefix
            
            result = auth_manager.verify_token(token)
            if not result['success']:
                return jsonify({"error": result['message']}), 401
            
            # Extract user_id from token payload
            user_id = result['payload']['user_id']
            request.current_user = result['payload']  # Add user info to request
            
        except Exception as e:
            return jsonify({"error": "Token is invalid"}), 401
        
        return f(user_id=user_id, *args, **kwargs)
    return decorated

@app.route('/api/analyze', methods=['POST'])
@token_required
def analyze_prescriptions(user_id):
    """
    Main endpoint to analyze two prescriptions for interactions and allergies.
    Expects two files ('prescription1', 'prescription2') and optional 'allergies'.
    Now enhanced with AI/ML predictions!
    """
    if 'prescription1' not in request.files or 'prescription2' not in request.files:
        return jsonify({"error": "Both prescription files are required."}), 400

    file1 = request.files['prescription1']
    file2 = request.files['prescription2']
    
    # Get user allergies from database
    user = db_manager.get_user_by_id(user_id)
    user_allergies = user.get('allergies', []) if user else []
    
    # Clean and normalize user allergies (filter out empty/null/undefined values)
    cleaned_allergies = []
    for allergy in user_allergies:
        if allergy is not None and str(allergy).strip() and str(allergy).strip().lower() != 'undefined':
            cleaned_allergy = str(allergy).strip().lower()
            if cleaned_allergy:  # Double check it's not empty after processing
                cleaned_allergies.append(cleaned_allergy)
    
    # Remove duplicates and sort
    patient_allergies = sorted(list(set(cleaned_allergies)))
    
    print(f"🔍 User allergies processing:")
    print(f"  Raw user allergies: {user_allergies}")
    print(f"  Cleaned allergies: {cleaned_allergies}")
    print(f"  Final patient allergies: {patient_allergies}")

    if file1.filename == '' or file2.filename == '':
        return jsonify({"error": "File names cannot be empty."}), 400

    filepaths = []
    extracted_texts = []
    
    try:
        for file in [file1, file2]:
            if file and allowed_file(file.filename):
                # Generate a unique filename to prevent overwrites
                unique_filename = str(uuid.uuid4()) + "_" + secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(filepath)
                filepaths.append(filepath)
                
                # Process file for OCR
                print(f"🔍 Starting OCR for: {filepath}")
                ocr_result = ocr_processor.extract_text(filepath)
                
                # Extract text and method info
                text = ocr_result['text']
                method = ocr_result['method']
                success = ocr_result['success']
                
                # Enhanced logging with method information
                print(f"📝 TEXT EXTRACTION RESULT:")
                print(f"   📋 Method: {method.upper()}")
                print(f"   ✅ Success: {success}")
                print(f"   📊 Length: {len(text)} characters")
                print(f"   🔍 Preview: '{text[:100]}...'")
                
                if method == 'gemini_vision':
                    print("🤖 GEMINI VISION was used (OCR fallback)")
                elif method == 'tesseract':
                    print("🔧 TESSERACT OCR worked successfully")
                elif method == 'error':
                    print("❌ BOTH methods failed!")
                
                extracted_texts.append(text)
            else:
                return jsonify({"error": f"Invalid file type: {file.filename}. Allowed types are {Config.ALLOWED_EXTENSIONS}"}), 400

        # Parse medicines from each text
        print(f"🔍 Parsing medicines from text 1...")
        medicines1 = medicine_parser.parse_text(extracted_texts[0])
        print(f"💊 Medicines from prescription 1: {medicines1}")
        
        print(f"🔍 Parsing medicines from text 2...")
        medicines2 = medicine_parser.parse_text(extracted_texts[1])
        print(f"💊 Medicines from prescription 2: {medicines2}")
        
        all_medicines = sorted(list(set(medicines1 + medicines2)))
        print(f"🎯 ALL MEDICINES COMBINED: {all_medicines}")

        # Get AI predictions using Gemini model only
        print(f"🤖 Running Gemini AI analysis for medicines: {all_medicines}")
        ai_predictions = ai_model.predict_interactions_and_allergies(all_medicines, patient_allergies)
        
        # Use only AI predictions
        interactions = ai_predictions['interactions']
        allergy_conflicts = ai_predictions['allergies']
        risk_level = ai_predictions['risk_level']

        # Check for AI errors first
        if ai_predictions.get('error') or risk_level == 'ERROR':
            message = f"⚠️ AI Analysis Error: {ai_predictions.get('error', 'Unknown error occurred')}. Please try again or consult a healthcare professional."
            risk_level = 'UNKNOWN'  # Reset to unknown for safety
        else:
            # Construct enhanced response message with Gemini AI insights
            message = "Analysis complete using advanced Gemini AI medical analysis. "
            if risk_level in ["HIGH", "CRITICAL"]:
                message = "⚠️ CRITICAL: Unsafe combination detected by Gemini AI analysis. Please consult your doctor immediately before taking these medicines together."
            elif risk_level == "MEDIUM":
                message = "⚠️ MODERATE: Potential interactions found by Gemini AI analysis. Proceed with caution and consult a healthcare professional."
            else:
                message = "✅ LOW RISK: No significant interactions found by Gemini AI, but always consult your doctor for medical advice."
            
            # Add AI suggestions if available and not error suggestions
            suggestions = ai_predictions.get('suggestions', [])
            non_error_suggestions = [s for s in suggestions if 'error' not in s.lower() and 'unable to analyze' not in s.lower()]
            if non_error_suggestions:
                message += f" Gemini AI Recommendations: {', '.join(non_error_suggestions[:3])}"  # Limit to 3 suggestions

        # Build the enhanced final report with AI insights
        report = {
            "user_id": user_id,
            "doctorA_medicines": medicines1,
            "doctorB_medicines": medicines2,
            "all_medicines": all_medicines,
            "interactions": interactions,
            "allergy_conflicts": allergy_conflicts,
            "risk_level": risk_level,
            "message": message,
            "patient_allergies": patient_allergies,
            "ai_confidence_scores": ai_predictions.get('confidence_scores', {}),
            "ai_suggestions": ai_predictions.get('suggestions', []),
            "analysis_method": "gemini_ai_only",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Save the report to the database
        report_id = db_manager.save_analysis_report(report)
        report['_id'] = report_id # Add the new ID to the response
        
        # Add prescription to user's medical history
        auth_manager.add_prescription_to_user(user_id, report)
        
        # Log successful analysis
        print(f"🔬 Analysis completed for user {user_id}: Risk Level {risk_level}")
        
        return jsonify(report), 200

    except Exception as e:
        app.logger.error(f"An error occurred during analysis: {e}")
        print(f"❌ Analysis error: {e}")  # Debug print
        return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500
    finally:
        # Clean up uploaded files (temporarily disabled for debugging)
        # for path in filepaths:
        #     if os.path.exists(path):
        #         os.remove(path)
        print(f"📁 Files saved for debugging: {filepaths}")

@app.route('/api/reports', methods=['GET'])
def get_reports():
    """Retrieve all recent analysis reports."""
    try:
        reports = db_manager.get_all_reports()
        # Convert ObjectId to string for JSON serialization
        for report in reports:
            report['_id'] = str(report['_id'])
        return jsonify(reports), 200
    except Exception as e:
        app.logger.error(f"Error fetching reports: {e}")
        return jsonify({"error": "Could not retrieve reports."}), 500

@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    """Retrieve a specific analysis report by its ID."""
    try:
        report = db_manager.get_analysis_report(report_id)
        if report:
            report['_id'] = str(report['_id'])
            return jsonify(report), 200
        else:
            return jsonify({"error": "Report not found."}), 404
    except Exception as e:
        app.logger.error(f"Error fetching report {report_id}: {e}")
        return jsonify({"error": "Could not retrieve the report."}), 500

@app.route('/api/register', methods=['POST'])
def register_user():
    """Register a new user with enhanced security and proper MongoDB storage."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Use AuthManager to handle complete registration
        result = auth_manager.register_user(data)
        
        if result['success']:
            # Log successful registration
            print(f"✅ User registered: {result['user']['email']}")
            
            # Save user session for analytics
            session_data = {
                'action': 'register',
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'success': True
            }
            db_manager.save_user_session(result['user']['_id'], session_data)
            
            return jsonify(result), 201
        else:
            return jsonify({"error": result['message']}), 400
        
    except Exception as e:
        app.logger.error(f"Registration error: {e}")
        return jsonify({"error": "Registration failed. Please try again."}), 500

@app.route('/api/login', methods=['POST'])
def login_user():
    """Login user with enhanced security and proper session tracking."""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required."}), 400
        
        # Use AuthManager to handle complete login
        result = auth_manager.login_user(data['email'], data['password'])
        
        if result['success']:
            # Log successful login
            print(f"✅ User logged in: {result['user']['email']}")
            
            # Save user session for analytics
            session_data = {
                'action': 'login',
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'success': True
            }
            db_manager.save_user_session(result['user']['_id'], session_data)
            
            return jsonify(result), 200
        else:
            # Log failed login attempt
            session_data = {
                'action': 'login_failed',
                'email': data.get('email'),
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'success': False,
                'reason': result['message']
            }
            db_manager.save_user_session(None, session_data)
            
            return jsonify({"error": result['message']}), 401
        
    except Exception as e:
        app.logger.error(f"Login error: {e}")
        return jsonify({"error": "Login failed. Please try again."}), 500

@app.route('/api/profile', methods=['GET'])
@token_required
def get_user_profile(user_id):
    """Get comprehensive user profile information with statistics."""
    try:
        user = auth_manager.get_user_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found."}), 404
        
        # Get user statistics
        stats = db_manager.get_user_statistics(user_id)
        
        # Combine user data with statistics
        response_data = {
            'id': user['_id'],
            'name': user['name'],
            'email': user['email'],
            'age': user.get('age'),
            'gender': user.get('gender'),
            'allergies': user.get('allergies', []),
            'created_at': user.get('created_at'),
            'updated_at': user.get('updated_at'),
            'last_login': user.get('last_login'),
            'is_active': user.get('is_active', True),
            'profile_complete': user.get('profile_complete', False),
            'statistics': {
                'total_analyses': stats['total_reports'],
                'risk_distribution': stats['risk_distribution'],
                'last_analysis_date': stats['last_analysis'].get('created_at') if stats['last_analysis'] else None
            }
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        app.logger.error(f"Profile fetch error: {e}")
        return jsonify({"error": "Could not retrieve profile."}), 500

@app.route('/api/profile', methods=['PUT'])
@token_required
def update_user_profile(user_id):
    """Update user profile information."""
    try:
        data = request.get_json()
        
        # Prepare update data (excluding sensitive fields)
        update_data = {}
        allowed_fields = ['name', 'age', 'gender', 'allergies']
        
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        if not update_data:
            return jsonify({"error": "No valid fields to update."}), 400
        
        update_data['updated_at'] = db_manager.get_current_datetime()
        
        # Update user in database
        success = db_manager.update_user(user_id, update_data)
        if not success:
            return jsonify({"error": "User not found or update failed."}), 404
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully'
        }), 200
        
    except Exception as e:
        app.logger.error(f"Profile update error: {e}")
        return jsonify({"error": "Profile update failed."}), 500

@app.route('/api/reports/<report_id>', methods=['GET'])
@token_required
def get_user_report(user_id, report_id):
    """Retrieve a specific analysis report (only user's own reports)."""
    try:
        report = db_manager.get_analysis_report(report_id)
        if not report:
            return jsonify({"error": "Report not found."}), 404
        
        # Check if report belongs to the requesting user
        if str(report.get('user_id', '')) != user_id:
            return jsonify({"error": "Access denied."}), 403
        
        report['_id'] = str(report['_id'])
        return jsonify(report), 200
    except Exception as e:
        app.logger.error(f"Error fetching report {report_id}: {e}")
        return jsonify({"error": "Could not retrieve the report."}), 500

@app.route('/api/reports', methods=['GET'])
@token_required
def get_user_reports(user_id):
    """Retrieve all analysis reports for the authenticated user."""
    try:
        reports = db_manager.get_user_reports(user_id)
        # Convert ObjectId to string for JSON serialization
        for report in reports:
            report['_id'] = str(report['_id'])
        return jsonify(reports), 200
    except Exception as e:
        app.logger.error(f"Error fetching user reports: {e}")
        return jsonify({"error": "Could not retrieve reports."}), 500

@app.route('/api/ai/test', methods=['GET'])
def test_gemini_connection():
    """Test Gemini AI connection."""
    try:
        if not ai_model.use_gemini:
            return jsonify({
                'success': False,
                'message': 'Gemini API not configured. Please add GEMINI_API_KEY to .env file.'
            }), 400
        
        # Test with sample data
        test_drugs = ["aspirin", "warfarin"]
        test_allergies = ["penicillin"]
        
        result = ai_model.predict_interactions_and_allergies(test_drugs, test_allergies)
        
        return jsonify({
            'success': True,
            'message': 'Gemini AI connection successful',
            'test_result': {
                'risk_level': result.get('risk_level'),
                'prediction_source': result.get('prediction_source'),
                'has_interactions': len(result.get('interactions', [])) > 0
            }
        }), 200
        
    except Exception as e:
        app.logger.error(f"Gemini test error: {e}")
        return jsonify({
            'success': False, 
            'message': f'Gemini AI test failed: {str(e)}'
        }), 500

@app.route('/api/ai/status', methods=['GET'])
def get_ai_model_status():
    """Get Gemini AI model status and information."""
    try:
        status = {
            'gemini_available': ai_model.use_gemini,
            'model_type': 'Google Gemini Pro AI',
            'features': [
                'Advanced drug interaction prediction',
                'Medical allergy conflict detection', 
                'Evidence-based risk level assessment',
                'Clinical recommendations',
                'Medical knowledge synthesis'
            ],
            'api_configured': bool(Config.GEMINI_API_KEY and Config.GEMINI_API_KEY != 'your_gemini_api_key_here'),
            'model_version': Config.GEMINI_MODEL,
            'version': '2.0.0',
            'description': 'Powered by Google Gemini AI for medical analysis'
        }
        
        return jsonify(status), 200
        
    except Exception as e:
        app.logger.error(f"AI status error: {e}")
        return jsonify({"error": "Could not retrieve AI status."}), 500

@app.route('/')
def index():
    return """
    <h1>🏥 Prescription Safety Analysis API with AI/ML</h1>
    <h2>Available Endpoints:</h2>
    <ul>
        <li><strong>POST /api/register</strong> - Register new user</li>
        <li><strong>POST /api/login</strong> - User login</li>
        <li><strong>GET /api/profile</strong> - Get user profile (requires token)</li>
        <li><strong>PUT /api/profile</strong> - Update user profile (requires token)</li>
        <li><strong>POST /api/analyze</strong> - Analyze prescriptions with Gemini AI (requires token)</li>
        <li><strong>GET /api/reports</strong> - Get user's analysis reports (requires token)</li>
        <li><strong>GET /api/reports/{id}</strong> - Get specific report (requires token)</li>
        <li><strong>GET /api/ai/status</strong> - Get Gemini AI status</li>
        <li><strong>GET /api/ai/test</strong> - Test Gemini AI connection</li>
    </ul>
    <p><em>🤖 Powered exclusively by Google Gemini AI for medical analysis!</em></p>
    """

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='127.0.0.1', use_reloader=False)
