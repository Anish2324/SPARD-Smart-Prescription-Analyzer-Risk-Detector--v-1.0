import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from pymongo import MongoClient
from bson.objectid import ObjectId
import re

class AuthManager:
    """Enhanced authentication system with secure password hashing and JWT tokens"""
    
    def __init__(self, db_manager):
        self.db = db_manager
        self.secret_key = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')
        self.token_expiry_hours = 24
    
    def hash_password(self, password):
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt)
    
    def verify_password(self, password, hashed):
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed)
    
    def validate_email(self, email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def validate_password(self, password):
        """Validate password strength"""
        if len(password) < 6:
            return False, "Password must be at least 6 characters long"
        return True, "Password is valid"
    
    def register_user(self, user_data):
        """Register a new user with validation"""
        try:
            # Validate required fields
            required_fields = ['name', 'email', 'password', 'age', 'gender']
            for field in required_fields:
                if field not in user_data or not user_data[field]:
                    return {'success': False, 'message': f'{field} is required'}
            
            # Validate email format
            if not self.validate_email(user_data['email']):
                return {'success': False, 'message': 'Invalid email format'}
            
            # Validate password strength
            is_valid, message = self.validate_password(user_data['password'])
            if not is_valid:
                return {'success': False, 'message': message}
            
            # Check if user already exists
            if self.db.users_collection.find_one({'email': user_data['email'].lower()}):
                return {'success': False, 'message': 'User with this email already exists'}
            
            # Hash password
            hashed_password = self.hash_password(user_data['password'])
            
            # Prepare user document
            user_doc = {
                'name': user_data['name'].strip(),
                'email': user_data['email'].lower().strip(),
                'password': hashed_password,
                'age': int(user_data['age']),
                'gender': user_data['gender'].lower(),
                'allergies': user_data.get('allergies', []),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'is_active': True,
                'profile_complete': True,
                'medical_history': [],
                'prescriptions': []
            }
            
            # Insert user
            result = self.db.users_collection.insert_one(user_doc)
            
            if result.inserted_id:
                # Generate JWT token
                token = self.generate_token(str(result.inserted_id), user_data['email'])
                
                # Return user data (without password)
                user_doc.pop('password')
                user_doc['_id'] = str(result.inserted_id)
                
                return {
                    'success': True,
                    'message': 'User registered successfully',
                    'user': user_doc,
                    'token': token
                }
            else:
                return {'success': False, 'message': 'Failed to create user'}
                
        except Exception as e:
            print(f"Registration error: {e}")
            return {'success': False, 'message': f'Registration failed: {str(e)}'}
    
    def login_user(self, email, password):
        """Authenticate user login"""
        try:
            # Find user by email
            user = self.db.users_collection.find_one({'email': email.lower().strip()})
            
            if not user:
                return {'success': False, 'message': 'Invalid email or password'}
            
            # Check if user is active
            if not user.get('is_active', True):
                return {'success': False, 'message': 'Account is deactivated'}
            
            # Verify password
            if not self.verify_password(password, user['password']):
                return {'success': False, 'message': 'Invalid email or password'}
            
            # Update last login
            self.db.users_collection.update_one(
                {'_id': user['_id']},
                {'$set': {'last_login': datetime.utcnow()}}
            )
            
            # Generate JWT token
            token = self.generate_token(str(user['_id']), user['email'])
            
            # Return user data (without password)
            user.pop('password')
            user['_id'] = str(user['_id'])
            
            return {
                'success': True,
                'message': 'Login successful',
                'user': user,
                'token': token
            }
            
        except Exception as e:
            print(f"Login error: {e}")
            return {'success': False, 'message': f'Login failed: {str(e)}'}
    
    def generate_token(self, user_id, email):
        """Generate JWT token"""
        payload = {
            'user_id': user_id,
            'email': email,
            'exp': datetime.utcnow() + timedelta(hours=self.token_expiry_hours),
            'iat': datetime.utcnow()
        }
        
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
    
    def verify_token(self, token):
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return {'success': True, 'payload': payload}
        except jwt.ExpiredSignatureError:
            return {'success': False, 'message': 'Token has expired'}
        except jwt.InvalidTokenError:
            return {'success': False, 'message': 'Invalid token'}
    
    def decode_token(self, token):
        """Decode token and return user_id (for backward compatibility)"""
        result = self.verify_token(token)
        if result['success']:
            return result['payload']['user_id']
        return None
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        try:
            user = self.db.users_collection.find_one({'_id': ObjectId(user_id)})
            if user:
                user.pop('password', None)  # Remove password from response
                user['_id'] = str(user['_id'])
                return user
            return None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    def update_user_allergies(self, user_id, allergies):
        """Update user's allergies"""
        try:
            result = self.db.users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {
                    '$set': {
                        'allergies': allergies,
                        'updated_at': datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating allergies: {e}")
            return False
    
    def add_prescription_to_user(self, user_id, prescription_data):
        """Add prescription to user's medical history"""
        try:
            prescription = {
                'prescription_id': prescription_data.get('_id'),
                'date': datetime.utcnow(),
                'medicines': prescription_data.get('medicines', []),
                'interactions': len(prescription_data.get('interactions', [])),
                'allergy_conflicts': len(prescription_data.get('allergy_conflicts', [])),
                'risk_level': prescription_data.get('risk_level', 'SAFE')
            }
            
            result = self.db.users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {
                    '$push': {'prescriptions': prescription},
                    '$set': {'updated_at': datetime.utcnow()}
                }
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error adding prescription to user: {e}")
            return False

# Middleware for token verification
from functools import wraps
from flask import request, jsonify, current_app

def token_required(f):
    """Decorator to require JWT token for protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            auth_manager = current_app.auth_manager
            result = auth_manager.verify_token(token)
            
            if not result['success']:
                return jsonify({'message': result['message']}), 401
            
            # Add user info to request
            request.current_user = result['payload']
            
        except Exception as e:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(*args, **kwargs)
    
    return decorated