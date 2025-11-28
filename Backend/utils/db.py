from pymongo import MongoClient
from config import Config
from datetime import datetime

class DatabaseManager:
    """Handles all MongoDB operations"""
    
    def __init__(self):
        self.client = MongoClient(Config.MONGO_URI)
        self.db = self.client[Config.DATABASE_NAME]
        self.prescriptions = self.db['prescriptions']
        self.analysis_reports = self.db['analysis_reports']
        self.users = self.db['users']
    
    def save_prescription(self, prescription_data):
        """Save prescription data to database"""
        prescription_data['created_at'] = datetime.utcnow()
        result = self.prescriptions.insert_one(prescription_data)
        return str(result.inserted_id)
    
    def save_analysis_report(self, report_data):
        """Save analysis report to database"""
        report_data['created_at'] = datetime.utcnow()
        result = self.analysis_reports.insert_one(report_data)
        return str(result.inserted_id)
    
    def get_prescription(self, prescription_id):
        """Retrieve prescription by ID"""
        from bson.objectid import ObjectId
        return self.prescriptions.find_one({'_id': ObjectId(prescription_id)})
    
    def get_analysis_report(self, report_id):
        """Retrieve analysis report by ID"""
        from bson.objectid import ObjectId
        return self.analysis_reports.find_one({'_id': ObjectId(report_id)})
    
    def get_all_reports(self, limit=50):
        """Get recent analysis reports"""
        reports = self.analysis_reports.find().sort('created_at', -1).limit(limit)
        return list(reports)
    
    # User Management Methods
    def create_user(self, user_data):
        """Create a new user"""
        result = self.users.insert_one(user_data)
        return str(result.inserted_id)
    
    def get_user_by_email(self, email):
        """Get user by email"""
        return self.users.find_one({'email': email})
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        from bson.objectid import ObjectId
        return self.users.find_one({'_id': ObjectId(user_id)})
    
    def update_user(self, user_id, update_data):
        """Update user data"""
        from bson.objectid import ObjectId
        result = self.users.update_one(
            {'_id': ObjectId(user_id)}, 
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def get_current_datetime(self):
        """Get current datetime for database operations"""
        return datetime.utcnow()
    
    def close(self):
        """Close database connection"""
        self.client.close()
