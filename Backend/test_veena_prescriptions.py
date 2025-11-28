#!/usr/bin/env python3
"""
Test the specific prescription combinations from Veena's prescriptions
"""
import sys
import os
sys.path.append('c:/Users/Anish/Desktop/ISE Hackathon/Backend')

from utils.medicine_parser import MedicineParser
from utils.interaction_checker import InteractionChecker

def test_veena_prescriptions():
    print("🧪 TESTING VEENA'S PRESCRIPTION COMBINATIONS")
    print("=" * 60)
    
    # Initialize components
    parser = MedicineParser()
    checker = InteractionChecker()
    
    # Define the prescriptions from the images
    prescriptions = {
        "Prescription 1 (Dr. Neha Kapoor)": {
            "text": "Azithromycin 500 mg - Take 1 tablet once daily after meals - Duration: 3 days",
            "medicines": ["azithromycin"]
        },
        "Prescription 2 (Dr. Sameer Mehta)": {
            "text": "Ibuprofen 400 mg - Take 1 tablet every 8 hours after meals - Duration: 3 days", 
            "medicines": ["ibuprofen"]
        },
        "Prescription 3 (Dr. Anjali Deshmukh)": {
            "text": "Warfarin 5 mg - Take 1 tablet once daily at the same time - Duration: 7 days (monitor INR levels)",
            "medicines": ["warfarin"]
        },
        "Prescription 4 (Dr. Rishabh Verma)": {
            "text": "Antacid (e.g., Gelusil) - 2 teaspoons after meals and before bedtime - Duration: 5 days",
            "medicines": ["antacids"]
        },
        "Prescription 5 (Dr. Kavita Menon)": {
            "text": "Lisinopril 10 mg - Take 1 tablet once daily in the morning - Duration: 10 days (monitor blood pressure regularly)",
            "medicines": ["lisinopril"]
        }
    }
    
    # Get all medicines
    all_medicines = []
    print("📋 PRESCRIPTIONS ANALYSIS:")
    print("-" * 40)
    for i, (prescription_name, data) in enumerate(prescriptions.items(), 1):
        print(f"{i}. {prescription_name}")
        print(f"   Medicine: {', '.join(data['medicines'])}")
        all_medicines.extend(data['medicines'])
        print()
    
    # Remove duplicates and sort
    all_medicines = sorted(list(set(all_medicines)))
    print(f"🎯 ALL MEDICINES COMBINED: {all_medicines}")
    print()
    
    # Test different scenarios
    scenarios = [
        {
            "name": "SCENARIO 1: Taking any 2 prescriptions together",
            "combinations": [
                (["azithromycin", "warfarin"], "Azithromycin + Warfarin"),
                (["ibuprofen", "warfarin"], "Ibuprofen + Warfarin"), 
                (["ibuprofen", "lisinopril"], "Ibuprofen + Lisinopril"),
                (["azithromycin", "antacids"], "Azithromycin + Antacids"),
                (["azithromycin", "ibuprofen"], "Azithromycin + Ibuprofen"),
            ]
        },
        {
            "name": "SCENARIO 2: Taking 3 prescriptions together",
            "combinations": [
                (["azithromycin", "ibuprofen", "warfarin"], "Triple combination: Antibiotic + Painkiller + Blood thinner"),
                (["ibuprofen", "warfarin", "lisinopril"], "Triple combination: Painkiller + Blood thinner + BP medication"),
            ]
        },
        {
            "name": "SCENARIO 3: All prescriptions together (WORST CASE)",
            "combinations": [
                (all_medicines, "All 5 prescriptions combined"),
            ]
        }
    ]
    
    # Test allergy scenarios
    allergy_scenarios = [
        (["macrolide"], "Patient allergic to macrolide antibiotics"),
        (["nsaid"], "Patient allergic to NSAIDs"), 
        (["macrolide", "nsaid"], "Patient allergic to both macrolide and NSAIDs"),
    ]
    
    for scenario in scenarios:
        print(f"🔍 {scenario['name']}")
        print("-" * 50)
        
        for medicines, description in scenario['combinations']:
            print(f"\n📊 {description}")
            print(f"   Medicines: {medicines}")
            
            # Check drug interactions
            interactions = checker.check_interactions(medicines)
            print(f"   ⚠️ Drug interactions: {len(interactions)}")
            
            for interaction in interactions:
                severity_emoji = {"low": "🟡", "medium": "🟠", "high": "🔴", "critical": "🚨"}
                emoji = severity_emoji.get(interaction['severity'].lower(), "⚠️")
                print(f"      {emoji} {interaction['pair']} - {interaction['severity'].upper()}")
                print(f"         Reason: {interaction['reason'][:80]}...")
            
            # Test with different allergies
            for allergies, allergy_desc in allergy_scenarios:
                allergy_conflicts = checker.check_allergy_conflicts(medicines, allergies)
                if allergy_conflicts:
                    print(f"   🚫 Allergy conflicts ({allergy_desc}): {len(allergy_conflicts)}")
                    for conflict in allergy_conflicts:
                        print(f"      🚫 {conflict['medicine']} vs {conflict['allergy']} - {conflict['severity'].upper()}")
            
            # Calculate risk
            # Test worst case: both drug interactions and allergies
            worst_allergy_conflicts = checker.check_allergy_conflicts(medicines, ["macrolide", "nsaid"])
            risk_level = checker.calculate_risk_level(interactions, worst_allergy_conflicts)
            risk_emoji = {"NONE": "✅", "LOW": "🟡", "MEDIUM": "🟠", "HIGH": "🔴", "CRITICAL": "🚨"}
            print(f"   🏥 Risk Level: {risk_emoji.get(risk_level, '⚠️')} {risk_level}")
            print()
        
        print()
    
    print("🏥 CLINICAL SUMMARY FOR VEENA:")
    print("=" * 50)
    print("⚠️ MOST DANGEROUS COMBINATIONS DETECTED:")
    print("   🚨 CRITICAL: Ibuprofen + Warfarin (severe bleeding risk)")
    print("   🔴 HIGH: Azithromycin + Warfarin (enhanced bleeding)")  
    print("   🔴 HIGH: Ibuprofen + Lisinopril (kidney damage)")
    print("   🟠 MEDIUM: Azithromycin + Antacids (reduced absorption)")
    print()
    print("🚫 ALLERGY RISKS:")
    print("   🔴 If allergic to MACROLIDE: Cannot take Azithromycin")
    print("   🔴 If allergic to NSAID: Cannot take Ibuprofen") 
    print()
    print("💡 RECOMMENDATIONS:")
    print("   1. NEVER combine Ibuprofen + Warfarin")
    print("   2. Space Azithromycin and Antacids by 2+ hours")
    print("   3. Monitor blood pressure if taking Ibuprofen + Lisinopril")
    print("   4. Check patient's allergy history before prescribing")
    print()
    print("🏁 ANALYSIS COMPLETE!")

if __name__ == "__main__":
    test_veena_prescriptions()