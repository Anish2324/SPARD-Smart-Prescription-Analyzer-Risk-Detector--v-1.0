#!/usr/bin/env python3
"""
Comprehensive system test to demonstrate full functionality
"""
import sys
import os
sys.path.append('c:/Users/Anish/Desktop/ISE Hackathon/Backend')

from utils.medicine_parser import MedicineParser
from utils.interaction_checker import InteractionChecker

def comprehensive_test():
    print("🧪 COMPREHENSIVE PRESCRIPTION SAFETY SYSTEM TEST")
    print("=" * 60)
    
    # Initialize components
    parser = MedicineParser()
    checker = InteractionChecker()
    
    # Scenario: Patient with multiple prescriptions and allergies
    print("👨‍⚕️ SCENARIO: 65-year-old patient with heart condition and infection")
    print("🚫 Known allergies: penicillin, macrolide")
    print()
    
    prescription1 = """
    Dr. Cardiology Department
    Patient: Robert Smith, Age: 65
    
    Medications:
    1. Warfarin 5mg daily (blood thinner)
    2. Metformin 500mg twice daily (diabetes)
    3. Lisinopril 10mg daily (blood pressure)
    """
    
    prescription2 = """
    Dr. Emergency Department  
    Patient: Robert Smith, Age: 65
    
    New medications for infection:
    1. Azithromycin 500mg daily x 3 days
    2. Ibuprofen 400mg as needed for pain
    """
    
    print("📄 PRESCRIPTION 1 (Cardiology):")
    print(prescription1.strip())
    print("\n📄 PRESCRIPTION 2 (Emergency):")
    print(prescription2.strip())
    print()
    
    # Parse medicines
    medicines1 = parser.parse_text(prescription1)
    medicines2 = parser.parse_text(prescription2)
    all_medicines = sorted(list(set(medicines1 + medicines2)))
    
    patient_allergies = ['penicillin', 'macrolide']
    
    print(f"💊 Medicines from Prescription 1: {medicines1}")
    print(f"💊 Medicines from Prescription 2: {medicines2}")
    print(f"🎯 ALL MEDICINES COMBINED: {all_medicines}")
    print(f"🚫 PATIENT ALLERGIES: {patient_allergies}")
    print()
    
    # Check for drug interactions
    print("⚠️  DRUG-DRUG INTERACTION ANALYSIS:")
    print("-" * 40)
    interactions = checker.check_interactions(all_medicines)
    
    if interactions:
        for i, interaction in enumerate(interactions, 1):
            severity_emoji = {"low": "🟡", "medium": "🟠", "high": "🔴", "critical": "🚨"}
            emoji = severity_emoji.get(interaction['severity'].lower(), "⚠️")
            
            print(f"{i}. {emoji} {interaction['pair']} - {interaction['severity'].upper()}")
            print(f"   Reason: {interaction['reason']}")
            print()
    else:
        print("✅ No drug-drug interactions detected")
        print()
    
    # Check for allergy conflicts
    print("🚫 ALLERGY CONFLICT ANALYSIS:")
    print("-" * 40)
    allergy_conflicts = checker.check_allergy_conflicts(all_medicines, patient_allergies)
    
    if allergy_conflicts:
        for i, conflict in enumerate(allergy_conflicts, 1):
            severity_emoji = {"low": "🟡", "medium": "🟠", "high": "🔴", "critical": "🚨"}
            emoji = severity_emoji.get(conflict['severity'].lower(), "⚠️")
            
            print(f"{i}. {emoji} {conflict['medicine'].upper()} vs {conflict['allergy']} allergy - {conflict['severity'].upper()}")
            print(f"   Reason: {conflict['reason']}")
            print()
    else:
        print("✅ No allergy conflicts detected")
        print()
    
    # Overall risk assessment
    risk_level = checker.calculate_risk_level(interactions, allergy_conflicts)
    risk_emojis = {"NONE": "✅", "LOW": "🟡", "MEDIUM": "🟠", "HIGH": "🔴", "CRITICAL": "🚨"}
    risk_emoji = risk_emojis.get(risk_level, "⚠️")
    
    print("🏥 FINAL SAFETY ASSESSMENT:")
    print("=" * 40)
    print(f"Risk Level: {risk_emoji} {risk_level}")
    print(f"Drug Interactions Found: {len(interactions)}")
    print(f"Allergy Conflicts Found: {len(allergy_conflicts)}")
    
    # Recommendations
    print("\n💡 CLINICAL RECOMMENDATIONS:")
    if risk_level in ["HIGH", "CRITICAL"]:
        print("🚨 URGENT: Do not take these medications together!")
        print("   Contact prescribing doctors immediately")
        print("   Consider alternative medications")
    elif risk_level == "MEDIUM":
        print("⚠️  CAUTION: Potential interactions detected")
        print("   Consult with healthcare provider")
        print("   Monitor for side effects closely")
    else:
        print("✅ Combination appears safe")
        print("   Continue as prescribed")
        print("   Monitor for any unusual symptoms")
    
    print("\n" + "=" * 60)
    print("🏁 COMPREHENSIVE TEST COMPLETE!")

if __name__ == "__main__":
    comprehensive_test()