from pymongo import MongoClient
from config import Config
from datetime import datetime

class DatabaseManager:
    """Handles all MongoDB operations with enhanced user authentication"""
    
    def __init__(self):
        self.client = MongoClient(Config.MONGO_URI)
        self.db = self.client[Config.DATABASE_NAME]
        self.prescriptions = self.db['prescriptions']
        self.analysis_reports = self.db['analysis_reports']
        self.users = self.db['users']
        self.users_collection = self.db['users']  # For auth compatibility
        
        # Create indexes for better performance
        self._create_indexes()
    
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
    
    def get_user_reports(self, user_id):
        """Get all reports for a specific user"""
        reports = list(self.analysis_reports.find({'user_id': user_id}).sort('created_at', -1))
        return reports
    
    def _create_indexes(self):
        """Create database indexes for better performance"""
        try:
            # Create index on user email (unique)
            self.users_collection.create_index('email', unique=True)
            
            # Create index on analysis reports user_id
            self.analysis_reports.create_index('user_id')
            
            # Create index on created_at for sorting
            self.analysis_reports.create_index('created_at')
            self.users_collection.create_index('created_at')
            
            print("✅ Database indexes created successfully")
        except Exception as e:
            print(f"⚠️ Index creation warning: {e}")
    
    def get_user_statistics(self, user_id):
        """Get user's prescription analysis statistics"""
        try:
            from bson.objectid import ObjectId
            
            total_reports = self.analysis_reports.count_documents({'user_id': user_id})
            
            # Get risk level distribution
            pipeline = [
                {'$match': {'user_id': user_id}},
                {'$group': {
                    '_id': '$risk_level',
                    'count': {'$sum': 1}
                }}
            ]
            
            risk_distribution = list(self.analysis_reports.aggregate(pipeline))
            
            return {
                'total_reports': total_reports,
                'risk_distribution': {item['_id']: item['count'] for item in risk_distribution},
                'last_analysis': self.analysis_reports.find_one(
                    {'user_id': user_id}, 
                    sort=[('created_at', -1)]
                )
            }
        except Exception as e:
            print(f"Error getting user statistics: {e}")
            return {'total_reports': 0, 'risk_distribution': {}, 'last_analysis': None}
    
    def save_user_session(self, user_id, session_data):
        """Save user session data for analytics"""
        try:
            from bson.objectid import ObjectId
            session_data.update({
                'user_id': user_id,
                'timestamp': datetime.utcnow()
            })
            
            result = self.db['user_sessions'].insert_one(session_data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error saving user session: {e}")
            return None
    
    def get_current_datetime(self):
        """Get current datetime for database operations"""
        return datetime.utcnow()
    
    def close(self):
        """Close database connection"""
        self.client.close()
