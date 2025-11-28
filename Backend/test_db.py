#!/usr/bin/env python3

try:
    from utils.db import DatabaseManager
    print("Attempting to connect to database...")
    db = DatabaseManager()
    print("✅ Database connection successful!")
    
    # Test creating a user
    test_user = {
        'name': 'Test User',
        'email': 'test@example.com',
        'password_hash': 'test_hash',
        'age': 25,
        'gender': 'male',
        'allergies': [],
        'created_at': db.get_current_datetime(),
        'updated_at': db.get_current_datetime()
    }
    
    user_id = db.create_user(test_user)
    print(f"✅ Test user created with ID: {user_id}")
    
    # Test retrieving user
    user = db.get_user_by_email('test@example.com')
    print(f"✅ Test user retrieved: {user['name']}")
    
    print("✅ All database tests passed!")
    
except Exception as e:
    print(f"❌ Database error: {e}")
    import traceback
    traceback.print_exc()