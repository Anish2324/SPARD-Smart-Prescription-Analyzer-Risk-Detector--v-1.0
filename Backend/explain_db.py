#!/usr/bin/env python3
"""
Explain what drug_db.json does in the system
"""
import sys
import os
sys.path.append('c:/Users/Anish/Desktop/ISE Hackathon/Backend')

import json
from utils.interaction_checker import InteractionChecker
from utils.medicine_parser import MedicineParser

def explain_drug_db_json():
    print("📋 EXPLAINING drug_db.json FILE PURPOSE & USAGE")
    print("=" * 60)
    
    # Load and analyze the JSON file
    db_path = "c:/Users/Anish/Desktop/ISE Hackathon/Backend/drug_db.json"
    
    try:
        with open(db_path, 'r') as f:
            db_data = json.load(f)
            
        print("🗂️ STRUCTURE OF drug_db.json:")
        print("-" * 40)
        for key, value in db_data.items():
            print(f"   📁 {key}: {len(value)} records")
        print()
        
        # Explain each section
        print("🔍 DETAILED BREAKDOWN:")
        print("-" * 40)
        
        # 1. Drug Interactions
        if "drug_interactions" in db_data:
            interactions = db_data["drug_interactions"]
            print(f"1️⃣ DRUG_INTERACTIONS ({len(interactions)} records):")
            print("   PURPOSE: Contains dangerous drug combination data")
            print("   STRUCTURE: drug1 + drug2 → severity + reason")
            print("   EXAMPLE RECORDS:")
            
            for i, interaction in enumerate(interactions[:5], 1):
                print(f"      {i}. {interaction['drug1']} + {interaction['drug2']}")
                print(f"         Severity: {interaction['severity']}")
                print(f"         Reason: {interaction['reason'][:60]}...")
                print()
                
            severity_count = {}
            for interaction in interactions:
                sev = interaction['severity']
                severity_count[sev] = severity_count.get(sev, 0) + 1
            
            print(f"   SEVERITY BREAKDOWN:")
            for severity, count in severity_count.items():
                print(f"      {severity.upper()}: {count} interactions")
            print()
        
        # 2. Allergy Database  
        if "allergy_database" in db_data:
            allergies = db_data["allergy_database"]
            print(f"2️⃣ ALLERGY_DATABASE ({len(allergies)} records):")
            print("   PURPOSE: Maps medicines to allergy types")
            print("   STRUCTURE: medicine → allergy_type + severity + reason")
            print("   EXAMPLE RECORDS:")
            
            for i, allergy in enumerate(allergies[:5], 1):
                print(f"      {i}. {allergy['medicine']} → {allergy['allergy_type']} allergy")
                print(f"         Severity: {allergy['severity']}")
                print(f"         Reason: {allergy['reason'][:60]}...")
                print()
                
            allergy_types = {}
            for allergy in allergies:
                atype = allergy['allergy_type']
                allergy_types[atype] = allergy_types.get(atype, 0) + 1
                
            print(f"   ALLERGY TYPE BREAKDOWN:")
            for atype, count in allergy_types.items():
                print(f"      {atype}: {count} medicines")
            print()
        
        # 3. Medicine Aliases
        if "medicine_aliases" in db_data:
            aliases = db_data["medicine_aliases"]
            print(f"3️⃣ MEDICINE_ALIASES ({len(aliases)} medicines):")
            print("   PURPOSE: Maps brand names to generic names")
            print("   STRUCTURE: generic_name → [brand1, brand2, ...]")
            print("   EXAMPLE RECORDS:")
            
            for i, (generic, brands) in enumerate(list(aliases.items())[:5], 1):
                print(f"      {i}. {generic} → {brands}")
            print()
        
        print("🔧 HOW THE SYSTEM USES drug_db.json:")
        print("-" * 40)
        
        # Show how InteractionChecker uses it
        checker = InteractionChecker()
        parser = MedicineParser()
        
        print("1️⃣ INTERACTION CHECKER:")
        print(f"   ✅ Loads {len(checker.interactions)} drug interactions")
        print(f"   ✅ Loads {len(checker.allergies)} allergy records")
        print("   ⚙️ Function: check_interactions() uses drug_interactions")
        print("   ⚙️ Function: check_allergy_conflicts() uses allergy_database")
        
        print("\n2️⃣ MEDICINE PARSER:")
        print(f"   ✅ Loads {len(parser.aliases)} medicine aliases")
        print(f"   ✅ Creates {len(parser.known_medicines)} known medicine names")
        print("   ⚙️ Function: parse_text() uses medicine_aliases")
        print("   ⚙️ Function: _normalize_medicine_name() uses aliases")
        
        print("\n🔄 WORKFLOW EXAMPLE:")
        print("-" * 40)
        print("1. User uploads prescription with 'Tylenol' (brand name)")
        print("2. MedicineParser uses medicine_aliases:")
        print("   'tylenol' → found in paracetamol aliases → normalizes to 'paracetamol'")
        print("3. InteractionChecker uses drug_interactions:")
        print("   Checks 'paracetamol + warfarin' → finds interaction record")
        print("4. InteractionChecker uses allergy_database:")
        print("   Checks patient allergies vs medicine allergy types")
        print("5. Returns safety analysis based on database data")
        
        print(f"\n💡 KEY INSIGHT:")
        print("drug_db.json is the BRAIN of your safety system!")
        print("Without it, the system couldn't:")
        print("   ❌ Recognize medicine names and brands")
        print("   ❌ Detect dangerous drug combinations") 
        print("   ❌ Identify allergy conflicts")
        print("   ❌ Assess risk levels")
        
        print(f"\n✅ VERIFICATION - Testing a real example:")
        test_medicines = ["azithromycin", "warfarin"]
        interactions = checker.check_interactions(test_medicines)
        allergy_conflicts = checker.check_allergy_conflicts(test_medicines, ["macrolide"])
        
        print(f"   Input: {test_medicines} + macrolide allergy")
        print(f"   Result: {len(interactions)} interactions, {len(allergy_conflicts)} allergy conflicts")
        print(f"   Source: ALL data comes from drug_db.json!")
        
    except Exception as e:
        print(f"❌ Error reading drug_db.json: {e}")
    
    print(f"\n" + "=" * 60)
    print("🏁 SUMMARY: drug_db.json is your knowledge database!")

if __name__ == "__main__":
    explain_drug_db_json()