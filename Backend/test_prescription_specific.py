#!/usr/bin/env python3
"""
Test script to debug the specific prescription text issue
"""
import sys
import os
sys.path.append('c:/Users/Anish/Desktop/ISE Hackathon/Backend')

from utils.medicine_parser import MedicineParser
from utils.interaction_checker import InteractionChecker

def test_prescription_text():
    print("🧪 Testing Specific Prescription Text")
    print("=" * 50)
    
    # Initialize components
    parser = MedicineParser()
    checker = InteractionChecker()
    
    # The exact text from the prescription image
    prescription_text = """
    Medical Prescription
    
    Patient Name: Veena
    Age: 24
    Date: 28/11/2025
    
    Medication Prescribed:
    - Azithromycin 500 mg
    - Take 1 tablet once daily after meals
    
    Duration: 3 days
    
    Doctor's Name: Dr. Neha Kapoor
    Hospital: MedPlus Care Center
    """
    
    print(f"📄 Testing prescription text:")
    print(prescription_text)
    print("-" * 30)
    
    # Test medicine parsing
    medicines = parser.parse_text(prescription_text)
    print(f"💊 Parsed medicines: {medicines}")
    
    # Check if azithromycin is in the known medicines
    print(f"\n🔍 Checking azithromycin in database:")
    print(f"   - In known medicines: {'azithromycin' in parser.known_medicines}")
    
    # Check aliases
    print(f"   - In aliases: {'azithromycin' in parser.aliases}")
    print(f"   - Available aliases for azithromycin: {parser.aliases.get('azithromycin', 'None')}")
    
    # Test allergy detection with common allergies
    test_allergies = ['penicillin', 'sulfa', 'macrolide']
    print(f"\n🧪 Testing allergy conflicts with: {test_allergies}")
    conflicts = checker.check_allergy_conflicts(medicines, test_allergies)
    print(f"⚠️ Found conflicts: {len(conflicts)}")
    
    for conflict in conflicts:
        print(f"   🔴 {conflict['medicine']} conflicts with {conflict['allergy']} allergy")
    
    # Check what's in the allergy database related to azithromycin
    print(f"\n📊 Searching allergy database for azithromycin or macrolide:")
    for allergy in checker.allergies:
        if 'azithromycin' in allergy['medicine'].lower() or 'macrolide' in allergy['allergy_type'].lower():
            print(f"   Found: {allergy}")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    test_prescription_text()