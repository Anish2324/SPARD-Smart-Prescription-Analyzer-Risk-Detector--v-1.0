import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import uuid
import hashlib
from datetime import datetime

from config import Config
from utils.ocr import OCRProcessor
from utils.medicine_parser import MedicineParser
from utils.interaction_checker import InteractionChecker
from utils.db import DatabaseManager

# Initialize Flask App
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Enable CORS for all routes

# Ensure the upload folder exists
if not os.path.exists(Config.UPLOAD_FOLDER):
    os.makedirs(Config.UPLOAD_FOLDER)

# Initialize utility classes
ocr_processor = OCRProcessor()
medicine_parser = MedicineParser()
interaction_checker = InteractionChecker()
db_manager = DatabaseManager()

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@app.route('/api/analyze', methods=['POST'])
def analyze_prescriptions():
    """
    Main endpoint to analyze two prescriptions for interactions and allergies.
    Expects two files ('prescription1', 'prescription2') and a form field 'allergies'.
    """
    if 'prescription1' not in request.files or 'prescription2' not in request.files:
        return jsonify({"error": "Both prescription files are required."}), 400

    file1 = request.files['prescription1']
    file2 = request.files['prescription2']
    
    patient_allergies_str = request.form.get('allergies', '')
    patient_allergies = [allergy.strip().lower() for allergy in patient_allergies_str.split(',') if allergy.strip()]

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
                text = ocr_processor.extract_text(filepath)
                print(f"📝 OCR extracted: '{text[:100]}...' ({len(text)} chars)")
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

        # Check for interactions and allergies
        interactions = interaction_checker.check_interactions(all_medicines)
        allergy_conflicts = interaction_checker.check_allergy_conflicts(all_medicines, patient_allergies)
        
        # Calculate risk level
        risk_level = interaction_checker.calculate_risk_level(interactions, allergy_conflicts)

        # Construct response message
        message = "Analysis complete. "
        if risk_level in ["HIGH", "CRITICAL"]:
            message = "Unsafe combination detected. Please consult your doctor before taking these medicines together."
        elif risk_level == "MEDIUM":
            message = "Potential interactions found. Proceed with caution and consult a healthcare professional."
        else:
            message = "No significant interactions found, but always consult your doctor for medical advice."

        # Build the final report
        report = {
            "doctorA_medicines": medicines1,
            "doctorB_medicines": medicines2,
            "interactions": interactions,
            "allergy_conflicts": allergy_conflicts,
            "risk_level": risk_level,
            "message": message,
            "patient_allergies_submitted": patient_allergies
        }
        
        # Save the report to the database
        report_id = db_manager.save_analysis_report(report)
        report['_id'] = report_id # Add the new ID to the response

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
    """Register a new user."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({"error": "Name, email, and password are required."}), 400
        
        # Check if user already exists
        existing_user = db_manager.get_user_by_email(data['email'])
        if existing_user:
            return jsonify({"error": "User with this email already exists."}), 400
        
        # Hash password
        password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
        
        # Create user data
        user_data = {
            'name': data.get('name'),
            'email': data.get('email'),
            'password_hash': password_hash,
            'age': data.get('age'),
            'gender': data.get('gender', 'prefer-not-to-say'),
            'allergies': data.get('allergies', []),
            'created_at': db_manager.get_current_datetime(),
            'updated_at': db_manager.get_current_datetime()
        }
        
        # Save user to database
        user_id = db_manager.create_user(user_data)
        
        # Return user data (without password)
        response_data = {
            'id': user_id,
            'name': user_data['name'],
            'email': user_data['email'],
            'age': user_data.get('age'),
            'gender': user_data.get('gender'),
            'allergies': user_data.get('allergies', [])
        }
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'user': response_data
        }), 201
        
    except Exception as e:
        app.logger.error(f"Registration error: {e}")
        return jsonify({"error": "Registration failed. Please try again."}), 500

@app.route('/api/login', methods=['POST'])
def login_user():
    """Login user."""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required."}), 400
        
        # Get user from database
        user = db_manager.get_user_by_email(data['email'])
        if not user:
            return jsonify({"error": "Invalid email or password."}), 401
        
        # Verify password hash
        password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
        if user.get('password_hash', user.get('password')) != password_hash:
            return jsonify({"error": "Invalid email or password."}), 401
        
        # Return user data (without password)
        response_data = {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'age': user.get('age'),
            'gender': user.get('gender'),
            'allergies': user.get('allergies', [])
        }
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': response_data
        }), 200
        
    except Exception as e:
        app.logger.error(f"Login error: {e}")
        return jsonify({"error": "Login failed. Please try again."}), 500

@app.route('/')
def index():
    return "<h1>Prescription Safety Analysis API</h1><p>Use the /api/analyze endpoint to check prescriptions.</p>"

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='127.0.0.1', use_reloader=False)
