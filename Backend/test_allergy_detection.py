#!/usr/bin/env python3
"""
Test script to debug allergy detection issues
"""
import sys
import os
sys.path.append('c:/Users/Anish/Desktop/ISE Hackathon/Backend')

from utils.medicine_parser import MedicineParser
from utils.interaction_checker import InteractionChecker

def test_allergy_detection():
    print("🧪 Testing Allergy Detection System")
    print("=" * 50)
    
    # Initialize components
    parser = MedicineParser()
    checker = InteractionChecker()
    
    # Test 1: Check if medicine parser works
    print("\n1️⃣ Testing Medicine Parser...")
    test_text = "Prescription: Amoxicillin 500mg three times daily, Ibuprofen 400mg as needed"
    medicines = parser.parse_text(test_text)
    print(f"✅ Parsed medicines: {medicines}")
    
    # Test 2: Check allergy database
    print("\n2️⃣ Testing Allergy Database...")
    print(f"📊 Total allergy records: {len(checker.allergies)}")
    for i, allergy in enumerate(checker.allergies[:5], 1):
        print(f"   {i}. Medicine: {allergy['medicine']}, Allergy: {allergy['allergy_type']}")
    
    # Test 3: Test allergy conflict detection
    print("\n3️⃣ Testing Allergy Conflict Detection...")
    
    # Test case: Patient allergic to penicillin, prescribed amoxicillin
    test_medicines = ['amoxicillin', 'ibuprofen']
    test_allergies = ['penicillin', 'nsaid']
    
    print(f"🧑‍⚕️ Test medicines: {test_medicines}")
    print(f"🚫 Patient allergies: {test_allergies}")
    
    conflicts = checker.check_allergy_conflicts(test_medicines, test_allergies)
    print(f"⚠️ Found conflicts: {len(conflicts)}")
    
    for conflict in conflicts:
        print(f"   🔴 {conflict['medicine']} conflicts with {conflict['allergy']} allergy")
        print(f"      Severity: {conflict['severity']}")
        print(f"      Reason: {conflict['reason']}")
    
    # Test 4: Test with different allergy formats
    print("\n4️⃣ Testing Different Allergy Formats...")
    
    test_cases = [
        (['amoxicillin'], ['penicillin']),
        (['amoxicillin'], ['Penicillin']),  # Different case
        (['amoxicillin'], ['PENICILLIN']),  # All caps
        (['ibuprofen'], ['nsaid']),
        (['aspirin'], ['nsaid']),
        (['codeine'], ['opioid']),
    ]
    
    for medicines, allergies in test_cases:
        conflicts = checker.check_allergy_conflicts(medicines, allergies)
        status = "✅ DETECTED" if conflicts else "❌ NOT DETECTED"
        print(f"   {status}: {medicines[0]} vs {allergies[0]} allergy")
    
    print("\n" + "=" * 50)
    print("🏁 Test Complete!")

if __name__ == "__main__":
    test_allergy_detection()