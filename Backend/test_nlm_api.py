#!/usr/bin/env python3
"""
Real working example: Get drug interactions from NLM RxNorm API
This shows how to replace drug_db.json with API calls
"""
import requests
import json
import time
from typing import List, Dict, Optional

class NLMInteractionChecker:
    """Uses NLM (National Library of Medicine) API for drug interactions"""
    
    def __init__(self):
        self.base_url = "https://rxnav.nlm.nih.gov/REST"
        self.cache = {}  # Simple cache to avoid repeated API calls
    
    def get_drug_interactions(self, medicines: List[str]) -> List[Dict]:
        """
        Get drug interactions from NLM API for a list of medicines
        Returns interactions in the same format as your drug_db.json
        """
        print(f"🔍 Checking interactions for: {medicines}")
        interactions = []
        
        for i, drug1 in enumerate(medicines):
            for drug2 in medicines[i+1:]:
                interaction = self._check_pair_interaction(drug1, drug2)
                if interaction:
                    interactions.append(interaction)
                    
        return interactions
    
    def _check_pair_interaction(self, drug1: str, drug2: str) -> Optional[Dict]:
        """Check interaction between two specific drugs"""
        try:
            # Get RxCUI (RxNorm Concept Unique Identifier) for drug1
            rxcui1 = self._get_rxcui(drug1)
            if not rxcui1:
                print(f"❌ Could not find RxCUI for {drug1}")
                return None
            
            print(f"📋 Found RxCUI for {drug1}: {rxcui1}")
            
            # Get interactions for drug1
            interactions_url = f"{self.base_url}/interaction/interaction.json?rxcui={rxcui1}"
            response = requests.get(interactions_url, timeout=10)
            
            if response.status_code != 200:
                print(f"❌ API error for {drug1}: {response.status_code}")
                return None
            
            data = response.json()
            
            # Parse the complex NLM response structure
            interaction_groups = data.get('interactionTypeGroup', [])
            
            for group in interaction_groups:
                for interaction_type in group.get('interactionType', []):
                    for pair in interaction_type.get('interactionPair', []):
                        
                        # Check if this interaction involves drug2
                        interaction_concepts = pair.get('interactionConcept', [])
                        
                        for concept in interaction_concepts:
                            concept_name = concept.get('minConceptItem', {}).get('name', '').lower()
                            
                            if self._drug_name_matches(drug2, concept_name):
                                severity = self._map_nlm_severity(pair.get('severity', 'N/A'))
                                description = pair.get('description', 'Interaction detected via NLM API')
                                
                                print(f"✅ Found interaction: {drug1} + {drug2} = {severity}")
                                
                                return {
                                    "drug1": drug1.lower(),
                                    "drug2": drug2.lower(), 
                                    "severity": severity,
                                    "reason": description,
                                    "source": "NLM_RxNorm_API"
                                }
            
            # Add small delay to be respectful to API
            time.sleep(0.1)
            
        except Exception as e:
            print(f"❌ Error checking {drug1} + {drug2}: {e}")
        
        return None
    
    def _get_rxcui(self, drug_name: str) -> Optional[str]:
        """Get RxNorm Concept Unique Identifier for a drug name"""
        if drug_name in self.cache:
            return self.cache[drug_name]
        
        try:
            # Try approximate match first (more flexible)
            url = f"{self.base_url}/approximateTerm.json?term={drug_name}&maxEntries=5"
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                candidates = data.get('approximateGroup', {}).get('candidate', [])
                
                if candidates:
                    # Take the first (best) match
                    rxcui = candidates[0].get('rxcui')
                    if rxcui:
                        self.cache[drug_name] = rxcui
                        return rxcui
            
            # Fallback to exact match
            url = f"{self.base_url}/rxcui.json?name={drug_name}"
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                rxcui_list = data.get('idGroup', {}).get('rxnormId', [])
                if rxcui_list:
                    rxcui = rxcui_list[0]
                    self.cache[drug_name] = rxcui
                    return rxcui
                    
        except Exception as e:
            print(f"Error getting RxCUI for {drug_name}: {e}")
        
        return None
    
    def _drug_name_matches(self, target_drug: str, api_drug_name: str) -> bool:
        """Check if API drug name matches our target drug"""
        target = target_drug.lower().strip()
        api_name = api_drug_name.lower().strip()
        
        # Exact match
        if target == api_name:
            return True
        
        # Check if target is contained in API name (for generic/brand names)
        if target in api_name or api_name in target:
            return True
        
        # Check common variations
        variations = {
            'ibuprofen': ['advil', 'motrin', 'brufen'],
            'azithromycin': ['zithromax', 'z-pak'],
            'warfarin': ['coumadin', 'jantoven']
        }
        
        if target in variations:
            return any(var in api_name for var in variations[target])
        
        return False
    
    def _map_nlm_severity(self, nlm_severity: str) -> str:
        """Map NLM severity levels to our system"""
        severity_mapping = {
            'high': 'critical',
            'moderate': 'high', 
            'minor': 'medium',
            'contraindicated': 'critical',
            'major': 'critical',
            'serious': 'high',
            'significant': 'high'
        }
        
        nlm_severity = nlm_severity.lower().strip()
        return severity_mapping.get(nlm_severity, 'medium')

def test_nlm_api():
    """Test the NLM API approach with real drugs"""
    print("🧪 TESTING NLM API FOR DRUG INTERACTIONS")
    print("=" * 50)
    
    checker = NLMInteractionChecker()
    
    # Test with drugs we know have interactions
    test_medicines = ["warfarin", "ibuprofen", "azithromycin"]
    
    print(f"Testing medicines: {test_medicines}")
    print()
    
    interactions = checker.get_drug_interactions(test_medicines)
    
    print(f"\n📊 RESULTS:")
    print(f"Found {len(interactions)} interactions from NLM API")
    
    for interaction in interactions:
        print(f"⚠️  {interaction['drug1'].title()} + {interaction['drug2'].title()}")
        print(f"   Severity: {interaction['severity'].upper()}")
        print(f"   Reason: {interaction['reason'][:100]}...")
        print()
    
    if not interactions:
        print("❌ No interactions found via NLM API")
        print("This could be due to:")
        print("- Drug names not recognized by RxNorm")
        print("- Limited interaction coverage in NLM database") 
        print("- API structure complexity")
        print()
        print("💡 This is why your drug_db.json approach is better!")
        print("   ✅ You control exactly what interactions to detect")
        print("   ✅ No dependency on external APIs")
        print("   ✅ Guaranteed to work for your demo")
    
    print(f"\n🏁 COMPARISON:")
    print("drug_db.json approach:")
    print("  ✅ 25 known interactions, instant results")
    print("  ✅ Works offline, no API failures")
    print("  ✅ Perfect control over data quality")
    
    print("NLM API approach:")
    print("  ❌ Complex API structure")
    print("  ❌ Limited interaction coverage") 
    print("  ❌ Network dependency")
    print("  ❌ May not find common drug names")

if __name__ == "__main__":
    test_nlm_api()