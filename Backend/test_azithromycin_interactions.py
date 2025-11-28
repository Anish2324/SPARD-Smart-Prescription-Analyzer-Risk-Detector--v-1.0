#!/usr/bin/env python3
"""
Test azithromycin-specific drug interactions
"""
import sys
import os
sys.path.append('c:/Users/Anish/Desktop/ISE Hackathon/Backend')

from utils.medicine_parser import MedicineParser
from utils.interaction_checker import InteractionChecker

def test_azithromycin_interactions():
    print("🧪 Testing Azithromycin Drug Interactions")
    print("=" * 50)
    
    # Initialize components
    checker = InteractionChecker()
    
    # Test azithromycin with common medications
    azithromycin_combos = [
        (['azithromycin', 'warfarin'], 'Azithromycin + Warfarin'),
        (['azithromycin', 'digoxin'], 'Azithromycin + Digoxin'),
        (['azithromycin', 'antacids'], 'Azithromycin + Antacids'),
        (['azithromycin', 'ibuprofen'], 'Azithromycin + Ibuprofen (should be safe)'),
        (['azithromycin', 'metformin'], 'Azithromycin + Metformin (should be safe)'),
    ]
    
    print("🔍 Testing azithromycin combinations:")
    for medicines, description in azithromycin_combos:
        interactions = checker.check_interactions(medicines)
        if interactions:
            print(f"   🔴 INTERACTION FOUND: {description}")
            for interaction in interactions:
                print(f"      Severity: {interaction['severity']}")
                print(f"      Reason: {interaction['reason']}")
        else:
            print(f"   ✅ SAFE: {description}")
        print()
    
    # Test realistic prescription scenario
    print("🏥 Realistic Prescription Scenario:")
    print("   Prescription 1: Azithromycin 500mg (antibiotic)")
    print("   Prescription 2: Warfarin 5mg (blood thinner)")
    
    realistic_medicines = ['azithromycin', 'warfarin']
    interactions = checker.check_interactions(realistic_medicines)
    allergy_conflicts = checker.check_allergy_conflicts(realistic_medicines, ['macrolide'])
    
    print(f"\n💊 Medicines: {realistic_medicines}")
    print(f"⚠️ Drug interactions: {len(interactions)}")
    print(f"🚫 Allergy conflicts: {len(allergy_conflicts)}")
    
    for interaction in interactions:
        print(f"   🔴 {interaction['pair']} - {interaction['severity']}")
        print(f"      {interaction['reason']}")
    
    for conflict in allergy_conflicts:
        print(f"   🚫 {conflict['medicine']} vs {conflict['allergy']} - {conflict['severity']}")
        print(f"      {conflict['reason']}")
    
    risk_level = checker.calculate_risk_level(interactions, allergy_conflicts)
    print(f"\n🚨 Overall Risk Level: {risk_level}")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    test_azithromycin_interactions()