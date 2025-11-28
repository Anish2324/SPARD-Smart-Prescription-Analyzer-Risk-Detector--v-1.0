#!/usr/bin/env python3

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Import only what we need for testing
try:
    from utils.db import DatabaseManager
    db_manager = DatabaseManager()
    print("✅ Database connected successfully")
except Exception as e:
    print(f"❌ Database connection failed: {e}")

@app.route('/')
def index():
    return "<h1>Test API</h1>"

@app.route('/api/test', methods=['POST'])
def test():
    return jsonify({"message": "Test successful"}), 200

@app.route('/api/register', methods=['POST'])
def register_user():
    """Register a new user."""
    try:
        data = request.get_json()
        print(f"Received registration data: {data}")
        
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
        print(f"Created user with ID: {user_id}")
        
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
        print(f"Registration error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Registration failed. Please try again."}), 500

if __name__ == '__main__':
    print("Starting test server...")
    app.run(debug=True, port=5001, host='127.0.0.1', use_reloader=False)