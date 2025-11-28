"""
Simple script to add your JSON dataset to MongoDB
Just modify the data below and run this script
"""

import json
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def add_my_dataset():
    """Add your custom dataset here"""
    
    # YOUR DATASET - CONVERTED FROM YOUR JSON FORMAT
    # ===============================================
    
    your_dataset = {
        "metformin": {
            "conflicts": [
                {"drug": "ibuprofen", "reason": "Ibuprofen can destabilize blood sugar levels when combined with Metformin."}
            ],
            "allergy_conflicts": []
        },
        "ibuprofen": {
            "conflicts": [
                {"drug": "metformin", "reason": "This combination can cause blood sugar fluctuations and stomach issues."},
                {"drug": "aspirin", "reason": "Both are NSAIDs and can increase stomach bleeding risk."}
            ],
            "allergy_conflicts": []
        },
        "amoxicillin": {
            "conflicts": [],
            "allergy_conflicts": [
                {"allergy": "penicillin", "reason": "Amoxicillin belongs to the penicillin family and may cause severe allergic reactions."}
            ]
        },
        "paracetamol": {
            "conflicts": [
                {"drug": "alcohol", "reason": "This combination increases the risk of liver damage."}
            ],
            "allergy_conflicts": []
        },
        "aspirin": {
            "conflicts": [
                {"drug": "ibuprofen", "reason": "Both are NSAIDs and may cause internal bleeding when taken together."},
                {"drug": "warfarin", "reason": "Aspirin enhances the blood-thinning effect of Warfarin, increasing bleeding risk."}
            ],
            "allergy_conflicts": [
                {"allergy": "salicylates", "reason": "Aspirin is a salicylate and may trigger allergic reactions."}
            ]
        },
        "warfarin": {
            "conflicts": [
                {"drug": "aspirin", "reason": "Both thin the blood and may cause severe bleeding."},
                {"drug": "ibuprofen", "reason": "NSAIDs can increase bleeding when combined with Warfarin."}
            ],
            "allergy_conflicts": []
        },
        "azithromycin": {
            "conflicts": [
                {"drug": "antacids", "reason": "Antacids reduce the absorption of Azithromycin."}
            ],
            "allergy_conflicts": [
                {"allergy": "macrolide", "reason": "Azithromycin is a macrolide antibiotic and may cause allergic reactions."}
            ]
        },
        "cetirizine": {
            "conflicts": [
                {"drug": "alcohol", "reason": "Alcohol increases drowsiness when taken with Cetirizine."}
            ],
            "allergy_conflicts": []
        },
        "pantoprazole": {
            "conflicts": [],
            "allergy_conflicts": []
        },
        "omeprazole": {
            "conflicts": [
                {"drug": "clopidogrel", "reason": "Omeprazole reduces the activation of Clopidogrel, lowering its effectiveness."}
            ],
            "allergy_conflicts": []
        },
        "clopidogrel": {
            "conflicts": [
                {"drug": "omeprazole", "reason": "Omeprazole reduces how well Clopidogrel works."}
            ],
            "allergy_conflicts": []
        },
        "lisinopril": {
            "conflicts": [
                {"drug": "ibuprofen", "reason": "Ibuprofen may reduce the blood pressure-lowering effect of Lisinopril."}
            ],
            "allergy_conflicts": [
                {"allergy": "ace_inhibitors", "reason": "Lisinopril is an ACE inhibitor and may trigger reactions."}
            ]
        },
        "amlodipine": {
            "conflicts": [
                {"drug": "simvastatin", "reason": "High doses of Simvastatin with Amlodipine may cause muscle damage."}
            ],
            "allergy_conflicts": []
        },
        "simvastatin": {
            "conflicts": [
                {"drug": "amlodipine", "reason": "Combination may increase risk of muscle breakdown."}
            ],
            "allergy_conflicts": []
        },
        "levocetirizine": {
            "conflicts": [
                {"drug": "alcohol", "reason": "Increases drowsiness and dizziness."}
            ],
            "allergy_conflicts": []
        },
        "montelukast": {
            "conflicts": [],
            "allergy_conflicts": []
        },
        "diclofenac": {
            "conflicts": [
                {"drug": "warfarin", "reason": "Increases risk of severe bleeding."}
            ],
            "allergy_conflicts": []
        },
        "sertraline": {
            "conflicts": [
                {"drug": "tramadol", "reason": "May cause serotonin syndrome."}
            ],
            "allergy_conflicts": []
        },
        "tramadol": {
            "conflicts": [
                {"drug": "sertraline", "reason": "May trigger serotonin syndrome, a life-threatening condition."}
            ],
            "allergy_conflicts": []
        },
        "metronidazole": {
            "conflicts": [
                {"drug": "alcohol", "reason": "Causes severe vomiting and rapid heartbeat."}
            ],
            "allergy_conflicts": []
        },
        "acetaminophen": {
            "conflicts": [
                {"drug": "alcohol", "reason": "Drastically increases risk of liver toxicity."}
            ],
            "allergy_conflicts": []
        },
        "cough_syrup": {
            "conflicts": [
                {"drug": "paracetamol", "reason": "Many syrups contain paracetamol, increasing overdose risk."}
            ],
            "allergy_conflicts": []
        },
        "insulin": {
            "conflicts": [
                {"drug": "beta_blockers", "reason": "Beta-blockers may hide symptoms of low blood sugar."}
            ],
            "allergy_conflicts": []
        },
        "atenolol": {
            "conflicts": [
                {"drug": "insulin", "reason": "Masks signs of hypoglycemia."}
            ],
            "allergy_conflicts": []
        },
        "erythromycin": {
            "conflicts": [
                {"drug": "statins", "reason": "May increase risk of muscle injury."}
            ],
            "allergy_conflicts": [
                {"allergy": "macrolide", "reason": "Erythromycin is a macrolide and may cause allergic reactions."}
            ]
        },
        "statins": {
            "conflicts": [
                {"drug": "erythromycin", "reason": "Increases statin concentration causing muscle damage."}
            ],
            "allergy_conflicts": []
        },
        "ceftriaxone": {
            "conflicts": [],
            "allergy_conflicts": [
                {"allergy": "cephalosporin", "reason": "Ceftriaxone is a cephalosporin and may cause reactions."}
            ]
        },
        "doxycycline": {
            "conflicts": [
                {"drug": "antacids", "reason": "Antacids reduce the absorption of Doxycycline."}
            ],
            "allergy_conflicts": []
        },
        "antacids": {
            "conflicts": [
                {"drug": "doxycycline", "reason": "Reduces antibiotic absorption significantly."}
            ],
            "allergy_conflicts": []
        },
        "prednisolone": {
            "conflicts": [
                {"drug": "ibuprofen", "reason": "Combination increases chances of stomach bleeding."}
            ],
            "allergy_conflicts": []
        }
    }
    
    # Convert your format to database format
    my_drug_interactions = []
    my_allergies = []
    
    for medicine, data in your_dataset.items():
        # Convert conflicts to drug_interactions
        for conflict in data["conflicts"]:
            my_drug_interactions.append({
                "drug1": medicine,
                "drug2": conflict["drug"],
                "severity": "high",  # You can adjust this based on the interaction
                "reason": conflict["reason"]
            })
        
        # Convert allergy_conflicts to allergy_database
        for allergy_conflict in data["allergy_conflicts"]:
            my_allergies.append({
                "medicine": medicine,
                "allergy_type": allergy_conflict["allergy"],
                "severity": "high",  # You can adjust this
                "reason": allergy_conflict["reason"]
            })
    
    # Medicine aliases (you can add more if needed)
    my_medicine_aliases = [
        {"medicine": "paracetamol", "aliases": ["acetaminophen", "tylenol", "crocin"]},
        {"medicine": "acetaminophen", "aliases": ["paracetamol", "tylenol", "panadol"]},
        {"medicine": "beta_blockers", "aliases": ["atenolol", "propranolol", "metoprolol"]},
        {"medicine": "ace_inhibitors", "aliases": ["lisinopril", "enalapril", "captopril"]},
        {"medicine": "macrolide", "aliases": ["azithromycin", "erythromycin", "clarithromycin"]},
        {"medicine": "cephalosporin", "aliases": ["ceftriaxone", "cephalexin", "cefuroxime"]},
        {"medicine": "salicylates", "aliases": ["aspirin", "methyl_salicylate"]},
        {"medicine": "statins", "aliases": ["simvastatin", "atorvastatin", "rosuvastatin"]}
    ]
    
    try:
        # Connect to MongoDB
        client = MongoClient(os.getenv('MONGO_URI'))
        db = client[os.getenv('DATABASE_NAME')]
        
        print("🔄 Adding your dataset to MongoDB...")
        
        # Add drug interactions
        if my_drug_interactions and my_drug_interactions[0].get('drug1') != 'your_medicine_1':
            for item in my_drug_interactions:
                item['created_at'] = datetime.utcnow()
            result = db['drug_interactions'].insert_many(my_drug_interactions)
            print(f"✅ Added {len(result.inserted_ids)} drug interactions")
        
        # Add allergies
        if my_allergies and my_allergies[0].get('medicine') != 'your_medicine':
            for item in my_allergies:
                item['created_at'] = datetime.utcnow()
            result = db['allergy_database'].insert_many(my_allergies)
            print(f"✅ Added {len(result.inserted_ids)} allergy entries")
        
        # Add medicine aliases
        if my_medicine_aliases and my_medicine_aliases[0].get('medicine') != 'generic_name':
            for item in my_medicine_aliases:
                item['created_at'] = datetime.utcnow()
            result = db['medicine_aliases'].insert_many(my_medicine_aliases)
            print(f"✅ Added {len(result.inserted_ids)} medicine aliases")
        
        client.close()
        print("🎉 Dataset added successfully!")
        
    except Exception as e:
        print(f"❌ Error adding dataset: {e}")

def load_from_json_file():
    """Load data from your JSON file"""
    
    # MODIFY THESE PATHS TO YOUR JSON FILES
    json_file_path = "your_dataset.json"  # Change this to your file path
    collection_name = "drug_interactions"   # Change this to target collection
    
    if not os.path.exists(json_file_path):
        print(f"❌ File not found: {json_file_path}")
        print("Please update the json_file_path variable with your actual file path")
        return
    
    try:
        # Read your JSON file
        with open(json_file_path, 'r') as f:
            data = json.load(f)
        
        # Connect to MongoDB
        client = MongoClient(os.getenv('MONGO_URI'))
        db = client[os.getenv('DATABASE_NAME')]
        
        # Add timestamps
        if isinstance(data, list):
            for item in data:
                item['created_at'] = datetime.utcnow()
        else:
            data['created_at'] = datetime.utcnow()
            data = [data]
        
        # Insert to MongoDB
        result = db[collection_name].insert_many(data)
        print(f"✅ Added {len(result.inserted_ids)} records from {json_file_path} to {collection_name}")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error loading JSON file: {e}")

if __name__ == '__main__':
    print("📊 Add Your Dataset to MongoDB")
    print("=" * 35)
    print()
    print("Choose an option:")
    print("1. Add data by modifying this script")
    print("2. Load data from your JSON file") 
    
    choice = input("\nEnter choice (1 or 2): ").strip()
    
    if choice == '1':
        print("\n⚠️  Please modify the data in this script first, then run again")
        add_my_dataset()
    elif choice == '2':
        print("\n⚠️  Please update the json_file_path variable first")
        load_from_json_file()
    else:
        print("❌ Invalid choice")
    
    print("\nTip: You can run this script multiple times to add more data!")