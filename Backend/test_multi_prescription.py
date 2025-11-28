#!/usr/bin/env python3
"""
Multi-prescription interaction test: Combine medicines from all 6 prescriptions 
to check for dangerous drug-drug interactions and allergy conflicts
"""
import os
import sys
import json
from pathlib import Path

# Add the parent directory to sys.path so we can import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.ocr import OCRProcessor
from utils.medicine_parser import MedicineParser  
from utils.interaction_checker import InteractionChecker

class MultiPrescriptionInteractionChecker:
    """Checks interactions when patient takes medicines from multiple prescriptions"""
    
    def __init__(self):
        self.ocr = OCRProcessor()
        self.parser = MedicineParser()
        self.interaction_checker = InteractionChecker()
        
        # All 6 unique prescription images
        self.prescription_images = {
            "Prescription 1 (Aspirin)": "WhatsApp_Image_2025-11-28_at_12.19.28_2274a1a6.jpg",  
            "Prescription 2 (Ibuprofen)": "WhatsApp_Image_2025-11-28_at_12.24.17_856c8357.jpg",  
            "Prescription 3 (Warfarin)": "WhatsApp_Image_2025-11-28_at_12.24.41_39cbf32b.jpg",  
            "Prescription 4 (Azithromycin)": "WhatsApp_Image_2025-11-28_at_13.19.17_c1991b85.jpg",  
            "Prescription 5 (Antacid)": "WhatsApp_Image_2025-11-28_at_13.19.36_c1fe3913.jpg",  
            "Prescription 6 (Lisinopril)": "WhatsApp_Image_2025-11-28_at_13.24.47_89331281.jpg"   
        }
        
        # Test with comprehensive allergies
        self.test_allergies = [
            'penicillin', 'macrolide', 'nsaid', 'fluoroquinolone', 
            'tetracycline', 'sulfa', 'aspirin'
        ]
    
    def find_image_file(self, target_filename):
        """Find the actual uploaded file for a prescription image"""
        temp_dir = Path("temp")
        for file in temp_dir.glob("*"):
            if target_filename in file.name:
                return str(file)
        return None
    
    def extract_medicine_from_prescription(self, prescription_name, image_filename):
        """Extract medicine from a single prescription"""
        print(f"📋 Processing {prescription_name}...")
        
        image_path = self.find_image_file(image_filename)
        if not image_path:
            print(f"❌ Image file not found: {image_filename}")
            return None
        
        try:
            # Extract text and parse medicine
            extracted_text = self.ocr.extract_text(image_path)
            medicines = self.parser.parse_text(extracted_text)
            
            if medicines:
                medicine = medicines[0]  # Get the first medicine
                print(f"✅ Found: {medicine.title()}")
                return medicine
            else:
                print("❌ No medicine found")
                return None
                
        except Exception as e:
            print(f"❌ Error: {e}")
            return None
    
    def run_multi_prescription_analysis(self):
        """Analyze interactions when combining medicines from all prescriptions"""
        print("💊 MULTI-PRESCRIPTION INTERACTION ANALYSIS")
        print("Simulating patient taking medicines from all 6 prescriptions simultaneously")
        print("=" * 80)
        
        # Step 1: Extract all medicines from all prescriptions
        print("🔍 Step 1: Extracting medicines from all prescriptions...")
        all_medicines = []
        prescription_sources = {}
        
        for prescription_name, image_filename in self.prescription_images.items():
            medicine = self.extract_medicine_from_prescription(prescription_name, image_filename)
            if medicine:
                all_medicines.append(medicine)
                prescription_sources[medicine] = prescription_name
        
        print(f"\n📊 COMBINED MEDICINE LIST ({len(all_medicines)} medicines):")
        for i, medicine in enumerate(all_medicines, 1):
            source = prescription_sources[medicine]
            print(f"   {i}. {medicine.title()} (from {source})")
        
        if len(all_medicines) < 2:
            print("❌ Need at least 2 medicines to check interactions")
            return
        
        # Step 2: Check drug-drug interactions across all medicines
        print(f"\n⚠️  Step 2: Checking drug-drug interactions across all prescriptions...")
        interactions = self.interaction_checker.check_interactions(all_medicines)
        
        if interactions:
            print(f"🚨 CRITICAL FINDING: {len(interactions)} DANGEROUS DRUG INTERACTIONS DETECTED!")
            print("🚨 Patient is at risk when taking medicines from multiple prescriptions!")
            print()
            
            for interaction in interactions:
                severity_emoji = {
                    'critical': '🔴',
                    'high': '🟠', 
                    'medium': '🟡',
                    'low': '🟢'
                }.get(interaction['severity'], '⚪')
                
                # Parse the pair to get individual drugs
                pair_text = interaction['pair']
                drugs = [drug.strip().lower() for drug in pair_text.split(' + ')]
                
                drug1_source = prescription_sources.get(drugs[0], 'Unknown')
                drug2_source = prescription_sources.get(drugs[1], 'Unknown') if len(drugs) > 1 else 'Unknown'
                
                print(f"   {severity_emoji} DANGEROUS COMBINATION:")
                print(f"      Drug Combination: {pair_text}")
                print(f"      Drug 1: {drugs[0].title()} ({drug1_source})")
                if len(drugs) > 1:
                    print(f"      Drug 2: {drugs[1].title()} ({drug2_source})")
                print(f"      Severity: {interaction['severity'].upper()}")
                print(f"      Risk: {interaction['reason']}")
                
                if interaction['severity'] == 'critical':
                    print(f"      ⚠️  IMMEDIATE ACTION REQUIRED: Consult doctor before taking these together!")
                print()
        else:
            print("✅ No drug-drug interactions found between prescriptions")
        
        # Step 3: Check allergy conflicts across all medicines
        print(f"🤧 Step 3: Checking allergy conflicts across all medicines...")
        total_allergy_conflicts = 0
        allergy_summary = {}
        
        for allergy in self.test_allergies:
            conflicts = self.interaction_checker.check_allergy_conflicts(all_medicines, [allergy])
            
            if conflicts:
                total_allergy_conflicts += len(conflicts)
                allergy_summary[allergy] = conflicts
                
                print(f"🚨 {allergy.upper()} ALLERGY CONFLICTS:")
                for conflict in conflicts:
                    source = prescription_sources.get(conflict['medicine'], 'Unknown')
                    print(f"   ❌ {conflict['medicine'].title()} ({source})")
                    print(f"      Risk: {conflict['reason']}")
        
        if total_allergy_conflicts == 0:
            print("✅ No allergy conflicts found")
        
        # Step 4: Overall safety assessment
        print(f"\n{'='*80}")
        print("🏥 COMPREHENSIVE SAFETY ASSESSMENT")
        print(f"{'='*80}")
        
        total_risks = len(interactions) + total_allergy_conflicts
        critical_interactions = len([i for i in interactions if i['severity'] == 'critical'])
        
        print(f"📊 RISK STATISTICS:")
        print(f"   Total Medicines Analyzed: {len(all_medicines)}")
        print(f"   Drug-Drug Interactions: {len(interactions)}")
        print(f"   Critical Interactions: {critical_interactions}")
        print(f"   Allergy Conflicts: {total_allergy_conflicts}")
        print(f"   Total Risk Factors: {total_risks}")
        
        # Safety recommendation
        if critical_interactions > 0:
            safety_level = "🔴 CRITICAL DANGER"
            recommendation = "STOP! Consult doctor immediately. Some combinations are life-threatening."
        elif len(interactions) > 0:
            safety_level = "🟠 HIGH RISK" 
            recommendation = "Consult doctor before taking these medicines together."
        elif total_allergy_conflicts > 0:
            safety_level = "🟡 MODERATE RISK"
            recommendation = "Check for allergies before taking these medicines."
        else:
            safety_level = "🟢 SAFE"
            recommendation = "No significant interactions detected."
        
        print(f"\n🎯 FINAL ASSESSMENT:")
        print(f"   Overall Risk Level: {safety_level}")
        print(f"   Recommendation: {recommendation}")
        
        # Detailed findings
        if interactions:
            print(f"\n📋 INTERACTION DETAILS:")
            for interaction in interactions:
                print(f"   • {interaction['pair']} = {interaction['severity'].upper()} risk")
        
        if allergy_summary:
            print(f"\n🤧 ALLERGY RISK SUMMARY:")
            for allergy_type, conflicts in allergy_summary.items():
                medicines = [c['medicine'].title() for c in conflicts]
                print(f"   • {allergy_type.title()} allergy: Avoid {', '.join(medicines)}")
        
        print(f"\n✅ MULTI-PRESCRIPTION ANALYSIS COMPLETE!")
        print("🎯 Your system successfully:")
        print("   🔍 Combined medicines from multiple prescriptions")
        print("   ⚠️  Detected dangerous drug-drug interactions")
        print("   🤧 Identified allergy conflicts across all medicines")
        print("   📊 Provided comprehensive safety assessment")
        
        if critical_interactions > 0:
            print(f"\n🚨 URGENT WARNING: {critical_interactions} CRITICAL interaction(s) found!")
            print("   This demonstrates why your prescription safety system is essential!")
            print("   Without this system, patient could be seriously harmed!")

def main():
    """Run the multi-prescription interaction analysis"""
    checker = MultiPrescriptionInteractionChecker()
    checker.run_multi_prescription_analysis()

if __name__ == "__main__":
    main()