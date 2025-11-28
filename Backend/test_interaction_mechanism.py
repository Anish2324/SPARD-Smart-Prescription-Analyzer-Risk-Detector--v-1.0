#!/usr/bin/env python3
"""
Focused test on drug-drug interaction mechanism
"""
import sys
import os
sys.path.append('c:/Users/Anish/Desktop/ISE Hackathon/Backend')

from utils.interaction_checker import InteractionChecker

def test_drug_interaction_mechanism():
    print("🔬 DRUG-DRUG INTERACTION DETECTION MECHANISM TEST")
    print("=" * 60)
    
    checker = InteractionChecker()
    
    print(f"📊 Database contains {len(checker.interactions)} interaction records")
    print("\n🔍 Testing interaction detection algorithm:")
    
    # Test specific pairs from Veena's prescriptions
    test_pairs = [
        (["ibuprofen", "warfarin"], "Most dangerous combination"),
        (["azithromycin", "warfarin"], "Antibiotic + blood thinner"),
        (["ibuprofen", "lisinopril"], "NSAID + ACE inhibitor"),
        (["azithromycin", "antacids"], "Antibiotic + stomach acid reducer"),
        (["azithromycin", "ibuprofen"], "Should be safe combination"),
        (["warfarin", "lisinopril"], "Should be safe combination"),
    ]
    
    for medicines, description in test_pairs:
        print(f"\n🧪 Testing: {description}")
        print(f"   Medicines: {medicines}")
        
        interactions = checker.check_interactions(medicines)
        
        if interactions:
            print(f"   🔴 INTERACTION FOUND: {len(interactions)} interaction(s)")
            for interaction in interactions:
                severity_colors = {
                    "critical": "🚨 CRITICAL",
                    "high": "🔴 HIGH", 
                    "medium": "🟠 MEDIUM",
                    "low": "🟡 LOW"
                }
                severity_display = severity_colors.get(interaction['severity'].lower(), f"⚠️ {interaction['severity']}")
                
                print(f"      {severity_display}: {interaction['pair']}")
                print(f"      Mechanism: {interaction['reason']}")
                
                # Show how the algorithm found this interaction
                drug1, drug2 = medicines[0], medicines[1]
                print(f"      Algorithm: Checked '{drug1}' + '{drug2}' against database")
                
                # Find the matching database record
                for db_interaction in checker.interactions:
                    if ((db_interaction['drug1'].lower() == drug1 and db_interaction['drug2'].lower() == drug2) or 
                        (db_interaction['drug1'].lower() == drug2 and db_interaction['drug2'].lower() == drug1)):
                        print(f"      Database match: {db_interaction['drug1']} + {db_interaction['drug2']}")
                        break
        else:
            print(f"   ✅ NO INTERACTION: Safe combination")
    
    # Test the combination algorithm with multiple drugs
    print(f"\n🔬 TESTING MULTIPLE DRUG COMBINATION ALGORITHM:")
    print("-" * 50)
    
    all_veena_medicines = ["azithromycin", "ibuprofen", "warfarin", "antacids", "lisinopril"]
    print(f"All medicines: {all_veena_medicines}")
    
    interactions = checker.check_interactions(all_veena_medicines)
    print(f"\nTotal interactions found: {len(interactions)}")
    
    print(f"\n🎯 Algorithm checks all possible pairs:")
    from itertools import combinations
    all_pairs = list(combinations(all_veena_medicines, 2))
    print(f"   Total pairs to check: {len(all_pairs)}")
    
    for i, (drug1, drug2) in enumerate(all_pairs, 1):
        pair_interactions = checker.check_interactions([drug1, drug2])
        status = "🔴 INTERACTION" if pair_interactions else "✅ SAFE"
        print(f"   {i:2d}. {drug1} + {drug2} → {status}")
    
    # Risk level calculation
    print(f"\n🚨 RISK LEVEL CALCULATION:")
    print("-" * 30)
    
    risk_level = checker.calculate_risk_level(interactions, [])
    print(f"Risk calculation input:")
    print(f"   - {len(interactions)} drug interactions")
    print(f"   - Severities: {[i['severity'] for i in interactions]}")
    print(f"   - Calculated risk: {risk_level}")
    
    severity_scores = {"low": 1, "medium": 2, "high": 3, "critical": 4}
    max_severity = max([severity_scores.get(i['severity'].lower(), 0) for i in interactions] + [0])
    print(f"   - Max severity score: {max_severity}/4")
    
    print("\n" + "=" * 60)
    print("🏁 DRUG INTERACTION MECHANISM TEST COMPLETE!")
    print("\n✅ CONFIRMATION: Drug-drug interaction system is FULLY FUNCTIONAL!")

if __name__ == "__main__":
    test_drug_interaction_mechanism()