#!/usr/bin/env python3
"""
Complete analysis: Check both drug-drug interactions AND allergies for all 6 prescription images
This script provides comprehensive safety analysis for all unique prescription images
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

class AllPrescriptionAnalyzer:
    """Analyzes all 6 prescription images for both interactions and allergies"""
    
    def __init__(self):
        self.ocr = OCRProcessor()
        self.parser = MedicineParser()
        self.interaction_checker = InteractionChecker()
        
        # Define the 6 unique prescription images
        self.prescription_images = {
            "Prescription 1": "WhatsApp_Image_2025-11-28_at_12.19.28_2274a1a6.jpg",  # Azithromycin, Ibuprofen, Warfarin
            "Prescription 2": "WhatsApp_Image_2025-11-28_at_12.24.17_856c8357.jpg",  # Multiple medicines
            "Prescription 3": "WhatsApp_Image_2025-11-28_at_12.24.41_39cbf32b.jpg",  # Complex prescription
            "Prescription 4": "WhatsApp_Image_2025-11-28_at_13.19.17_c1991b85.jpg",  # Hospital prescription
            "Prescription 5": "WhatsApp_Image_2025-11-28_at_13.19.36_c1fe3913.jpg",  # Pharmacy prescription
            "Prescription 6": "WhatsApp_Image_2025-11-28_at_13.24.47_89331281.jpg"   # Detailed prescription
        }
        
        # Test with comprehensive list of allergies that might conflict
        self.test_allergies = [
            'penicillin',      # Beta-lactam antibiotics
            'macrolide',       # Azithromycin, Clarithromycin, etc
            'nsaid',           # Ibuprofen, Aspirin, etc
            'fluoroquinolone', # Ciprofloxacin, Levofloxacin
            'tetracycline',    # Doxycycline, Tetracycline
            'sulfa',           # Sulfonamides
            'aspirin'          # Aspirin-specific allergy
        ]
    
    def find_image_file(self, target_filename):
        """Find the actual uploaded file for a prescription image"""
        temp_dir = Path("temp")
        
        for file in temp_dir.glob("*"):
            if target_filename in file.name:
                return str(file)
        
        return None
    
    def analyze_prescription(self, prescription_name, image_filename):
        """Analyze a single prescription for interactions and allergies"""
        print(f"\n{'='*80}")
        print(f"📋 ANALYZING {prescription_name}")
        print(f"📁 Image: {image_filename}")
        print(f"{'='*80}")
        
        # Find the actual file
        image_path = self.find_image_file(image_filename)
        
        if not image_path:
            print(f"❌ Image file not found: {image_filename}")
            return None
        
        try:
            # Step 1: Extract text using OCR
            print("🔍 Step 1: Extracting text from prescription image...")
            extracted_text = self.ocr.extract_text(image_path)
            print(f"📄 Extracted Text Preview:\n{extracted_text[:300]}...")
            
            # Step 2: Parse medicines from text
            print("\n💊 Step 2: Identifying medicines...")
            medicines = self.parser.parse_text(extracted_text)
            
            if not medicines:
                print("❌ No medicines identified in this prescription")
                return None
            
            print(f"✅ Found {len(medicines)} medicines:")
            for i, medicine in enumerate(medicines, 1):
                print(f"   {i}. {medicine.title()}")
            
            # Step 3: Check drug-drug interactions
            print(f"\n⚠️  Step 3: Checking drug-drug interactions...")
            interactions = self.interaction_checker.check_interactions(medicines)
            
            if interactions:
                print(f"🚨 Found {len(interactions)} DRUG-DRUG INTERACTIONS:")
                for interaction in interactions:
                    severity_emoji = {
                        'critical': '🔴',
                        'high': '🟠', 
                        'medium': '🟡',
                        'low': '🟢'
                    }.get(interaction['severity'], '⚪')
                    
                    print(f"   {severity_emoji} {interaction['drug1'].title()} + {interaction['drug2'].title()}")
                    print(f"      Severity: {interaction['severity'].upper()}")
                    print(f"      Risk: {interaction['reason']}")
            else:
                print("✅ No drug-drug interactions found")
            
            # Step 4: Check allergy conflicts for each allergy type
            print(f"\n🤧 Step 4: Checking allergy conflicts...")
            total_allergy_conflicts = 0
            allergy_details = []
            
            for allergy in self.test_allergies:
                conflicts = self.interaction_checker.check_allergy_conflicts(medicines, [allergy])
                
                if conflicts:
                    total_allergy_conflicts += len(conflicts)
                    print(f"🚨 ALLERGY CONFLICT - {allergy.upper()}:")
                    
                    for conflict in conflicts:
                        print(f"   ❌ {conflict['medicine'].title()} conflicts with {allergy} allergy")
                        print(f"      Risk: {conflict['reason']}")
                        allergy_details.append({
                            'medicine': conflict['medicine'],
                            'allergy_type': allergy,
                            'reason': conflict['reason']
                        })
            
            if total_allergy_conflicts == 0:
                print("✅ No allergy conflicts found with tested allergies")
            else:
                print(f"🚨 Total allergy conflicts found: {total_allergy_conflicts}")
            
            # Step 5: Calculate overall safety score
            total_risks = len(interactions) + total_allergy_conflicts
            critical_risks = len([i for i in interactions if i['severity'] == 'critical'])
            
            if critical_risks > 0:
                safety_level = "🔴 CRITICAL - IMMEDIATE MEDICAL ATTENTION REQUIRED"
            elif total_risks > 0:
                safety_level = "🟠 HIGH RISK - CONSULT DOCTOR BEFORE TAKING"
            else:
                safety_level = "🟢 SAFE - No significant interactions detected"
            
            print(f"\n🏥 OVERALL SAFETY ASSESSMENT:")
            print(f"   Status: {safety_level}")
            print(f"   Drug Interactions: {len(interactions)}")
            print(f"   Allergy Conflicts: {total_allergy_conflicts}")
            print(f"   Critical Issues: {critical_risks}")
            
            return {
                'prescription': prescription_name,
                'medicines': medicines,
                'interactions': interactions,
                'allergy_conflicts': total_allergy_conflicts,
                'allergy_details': allergy_details,
                'safety_level': safety_level,
                'total_risks': total_risks,
                'critical_risks': critical_risks
            }
            
        except Exception as e:
            print(f"❌ Error analyzing {prescription_name}: {str(e)}")
            return None
    
    def run_complete_analysis(self):
        """Run analysis on all 6 prescription images"""
        print("🏥 COMPLETE PRESCRIPTION SAFETY ANALYSIS")
        print("Checking both DRUG-DRUG INTERACTIONS and ALLERGY CONFLICTS")
        print("=" * 80)
        
        print(f"📊 Testing against {len(self.test_allergies)} allergy types:")
        print(f"   {', '.join([a.title() for a in self.test_allergies])}")
        
        results = []
        
        # Analyze each prescription
        for prescription_name, image_filename in self.prescription_images.items():
            result = self.analyze_prescription(prescription_name, image_filename)
            if result:
                results.append(result)
        
        # Summary report
        print(f"\n{'='*80}")
        print("📋 COMPREHENSIVE SUMMARY REPORT")
        print(f"{'='*80}")
        
        total_prescriptions = len(results)
        total_interactions = sum(len(r['interactions']) for r in results)
        total_allergy_conflicts = sum(r['allergy_conflicts'] for r in results)
        critical_prescriptions = len([r for r in results if r['critical_risks'] > 0])
        high_risk_prescriptions = len([r for r in results if r['total_risks'] > 0])
        
        print(f"📊 ANALYSIS STATISTICS:")
        print(f"   Prescriptions Analyzed: {total_prescriptions}")
        print(f"   Total Drug Interactions Found: {total_interactions}")
        print(f"   Total Allergy Conflicts Found: {total_allergy_conflicts}")
        print(f"   Critical Risk Prescriptions: {critical_prescriptions}")
        print(f"   High Risk Prescriptions: {high_risk_prescriptions}")
        
        print(f"\n🏥 PRESCRIPTION-BY-PRESCRIPTION SUMMARY:")
        for result in results:
            if result['critical_risks'] > 0:
                risk_emoji = "🔴"
                risk_level = "CRITICAL"
            elif result['total_risks'] > 0:
                risk_emoji = "🟠"
                risk_level = "HIGH RISK"
            else:
                risk_emoji = "🟢"
                risk_level = "SAFE"
                
            print(f"   {risk_emoji} {result['prescription']}: {len(result['medicines'])} medicines, {len(result['interactions'])} interactions, {result['allergy_conflicts']} allergy conflicts ({risk_level})")
        
        # Detailed findings
        if critical_prescriptions > 0:
            print(f"\n🚨 CRITICAL FINDINGS:")
            for result in results:
                if result['critical_risks'] > 0:
                    print(f"   {result['prescription']}:")
                    for interaction in result['interactions']:
                        if interaction['severity'] == 'critical':
                            print(f"      🔴 CRITICAL: {interaction['drug1'].title()} + {interaction['drug2'].title()}")
                            print(f"         {interaction['reason']}")
        
        # High-risk allergy conflicts
        high_risk_allergies = []
        for result in results:
            high_risk_allergies.extend(result['allergy_details'])
        
        if high_risk_allergies:
            print(f"\n🤧 ALLERGY CONFLICT DETAILS:")
            allergy_types = {}
            for allergy in high_risk_allergies:
                allergy_type = allergy['allergy_type']
                if allergy_type not in allergy_types:
                    allergy_types[allergy_type] = []
                allergy_types[allergy_type].append(allergy)
            
            for allergy_type, conflicts in allergy_types.items():
                print(f"   🚨 {allergy_type.upper()} Allergy Conflicts:")
                for conflict in conflicts:
                    print(f"      ❌ {conflict['medicine'].title()}: {conflict['reason']}")
        
        print(f"\n✅ ANALYSIS COMPLETE!")
        print(f"🎯 Your system successfully analyzed all 6 prescriptions and detected:")
        print(f"   🔍 {total_interactions} drug-drug interactions using drug_db.json database")
        print(f"   🤧 {total_allergy_conflicts} potential allergy conflicts across {len(self.test_allergies)} allergy types")
        print(f"   📊 Comprehensive safety assessment with risk levels")
        print(f"   🏥 {critical_prescriptions} prescriptions requiring immediate medical attention")
        
        if critical_prescriptions > 0:
            print(f"\n⚠️  IMPORTANT: {critical_prescriptions} prescription(s) contain CRITICAL interactions!")
            print(f"   Patient should consult healthcare provider immediately.")

def main():
    """Run the complete prescription analysis"""
    analyzer = AllPrescriptionAnalyzer()
    analyzer.run_complete_analysis()

if __name__ == "__main__":
    main()