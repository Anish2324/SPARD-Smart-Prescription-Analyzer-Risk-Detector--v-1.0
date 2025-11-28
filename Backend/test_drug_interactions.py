#!/usr/bin/env python3
"""
Test script to debug drug-drug interaction detection
"""
import sys
import os
sys.path.append('c:/Users/Anish/Desktop/ISE Hackathon/Backend')

from utils.medicine_parser import MedicineParser
from utils.interaction_checker import InteractionChecker

def test_drug_interactions():
    print("🧪 Testing Drug-Drug Interaction Detection")
    print("=" * 50)
    
    # Initialize components
    parser = MedicineParser()
    checker = InteractionChecker()
    
    # Show available interactions in database
    print(f"📊 Total interaction records: {len(checker.interactions)}")
    print("\n🔍 Available drug interactions:")
    for i, interaction in enumerate(checker.interactions[:10], 1):
        print(f"   {i}. {interaction['drug1']} + {interaction['drug2']} → {interaction['severity']}")
        print(f"      Reason: {interaction['reason'][:80]}...")
        print()
    
    # Test Case 1: Known dangerous interaction
    print("\n1️⃣ Testing Known Dangerous Interactions:")
    test_cases = [
        # High-risk combinations from database
        (['metformin', 'ibuprofen'], 'Metformin + Ibuprofen'),
        (['warfarin', 'aspirin'], 'Warfarin + Aspirin'),
        (['warfarin', 'ibuprofen'], 'Warfarin + Ibuprofen'),
        (['lisinopril', 'ibuprofen'], 'Lisinopril + Ibuprofen'),
        (['omeprazole', 'clopidogrel'], 'Omeprazole + Clopidogrel'),
    ]
    
    for medicines, description in test_cases:
        interactions = checker.check_interactions(medicines)
        status = "🔴 DETECTED" if interactions else "❌ NOT DETECTED"
        print(f"   {status}: {description}")
        
        for interaction in interactions:
            print(f"      Severity: {interaction['severity']}")
            print(f"      Reason: {interaction['reason'][:100]}...")
        print()
    
    # Test Case 2: Prescription text parsing + interaction detection
    print("\n2️⃣ Testing Full Prescription Analysis:")
    
    prescription1_text = """
    Dr. Johnson - Prescription 1
    Patient: John Doe
    
    1. Metformin 500mg twice daily
    2. Aspirin 81mg once daily for cardio protection
    """
    
    prescription2_text = """
    Dr. Smith - Prescription 2  
    Patient: John Doe
    
    1. Ibuprofen 400mg as needed for pain
    2. Warfarin 5mg daily
    """
    
    print(f"📄 Prescription 1 text: {prescription1_text.strip()}")
    print(f"📄 Prescription 2 text: {prescription2_text.strip()}")
    
    medicines1 = parser.parse_text(prescription1_text)
    medicines2 = parser.parse_text(prescription2_text)
    all_medicines = list(set(medicines1 + medicines2))
    
    print(f"\n💊 Medicines from prescription 1: {medicines1}")
    print(f"💊 Medicines from prescription 2: {medicines2}")
    print(f"🎯 All medicines combined: {all_medicines}")
    
    # Check interactions
    interactions = checker.check_interactions(all_medicines)
    print(f"\n⚠️ Found {len(interactions)} drug interactions:")
    
    for interaction in interactions:
        print(f"   🔴 {interaction['pair']}")
        print(f"      Severity: {interaction['severity']}")
        print(f"      Reason: {interaction['reason']}")
        print()
    
    # Calculate risk level
    risk_level = checker.calculate_risk_level(interactions, [])
    print(f"🚨 Overall Risk Level: {risk_level}")
    
    # Test Case 3: Safe combinations
    print("\n3️⃣ Testing Safe Combinations:")
    safe_medicines = ['paracetamol', 'vitamin_d']  # Should have no interactions
    safe_interactions = checker.check_interactions(safe_medicines)
    print(f"   Safe combo: {safe_medicines}")
    print(f"   Interactions found: {len(safe_interactions)}")
    
    print("\n" + "=" * 50)
    print("🏁 Drug Interaction Test Complete!")

if __name__ == "__main__":
    test_drug_interactions()