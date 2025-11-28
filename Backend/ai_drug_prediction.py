#!/usr/bin/env python3
"""
Alternative approaches to get drug interaction and allergy data without manual drug_db.json
"""
import requests
import json
from typing import List, Dict

class AIInteractionChecker:
    """Uses AI/ML and external APIs to predict drug interactions and allergies"""
    
    def __init__(self):
        self.rxnorm_base_url = "https://rxnav.nlm.nih.gov/REST"
        self.fda_base_url = "https://api.fda.gov/drug"
        
    def get_drug_interactions_from_nlm(self, drug_list: List[str]) -> List[Dict]:
        """
        Get drug interactions from NLM (National Library of Medicine) API
        This is FREE and doesn't require API key
        """
        interactions = []
        
        for i, drug1 in enumerate(drug_list):
            for drug2 in drug_list[i+1:]:
                try:
                    # Get RxNorm concept ID for drug1
                    rxcui1 = self._get_rxcui(drug1)
                    if not rxcui1:
                        continue
                        
                    # Query for interactions
                    interaction_url = f"{self.rxnorm_base_url}/interaction/interaction.json?rxcui={rxcui1}"
                    response = requests.get(interaction_url, timeout=5)
                    
                    if response.status_code == 200:
                        data = response.json()
                        interaction_groups = data.get('interactionTypeGroup', [])
                        
                        for group in interaction_groups:
                            for interaction_type in group.get('interactionType', []):
                                for pair in interaction_type.get('interactionPair', []):
                                    # Check if this interaction involves drug2
                                    interaction_concept = pair.get('interactionConcept', [])
                                    for concept in interaction_concept:
                                        if drug2.lower() in concept.get('minConceptItem', {}).get('name', '').lower():
                                            interactions.append({
                                                "drug1": drug1,
                                                "drug2": drug2,
                                                "severity": self._map_severity(pair.get('severity', 'unknown')),
                                                "description": pair.get('description', 'Interaction detected'),
                                                "source": "NLM_RxNorm"
                                            })
                                            
                except Exception as e:
                    print(f"Error checking {drug1} + {drug2}: {e}")
                    
        return interactions
    
    def get_drug_interactions_from_openai(self, drug_list: List[str]) -> List[Dict]:
        """
        Use OpenAI GPT to predict drug interactions based on medical knowledge
        Requires OpenAI API key
        """
        try:
            # This would require OpenAI API key
            import openai
            
            drug_pairs = []
            for i, drug1 in enumerate(drug_list):
                for drug2 in drug_list[i+1:]:
                    drug_pairs.append(f"{drug1} + {drug2}")
            
            prompt = f"""
            As a clinical pharmacist, analyze these drug combinations for interactions:
            {', '.join(drug_pairs)}
            
            For each pair, provide:
            1. Interaction severity (none/low/medium/high/critical)
            2. Clinical mechanism
            3. Risk assessment
            
            Respond in JSON format:
            {{"interactions": [{{"drug1": "...", "drug2": "...", "severity": "...", "reason": "..."}}]}}
            """
            
            # This is pseudocode - would need actual OpenAI setup
            # response = openai.ChatCompletion.create(
            #     model="gpt-4",
            #     messages=[{"role": "user", "content": prompt}]
            # )
            # return json.loads(response.choices[0].message.content)
            
            return []  # Placeholder
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return []
    
    def get_allergy_data_from_fda(self, drug_name: str) -> List[Dict]:
        """
        Get allergy/adverse reaction data from FDA API
        This is FREE but rate limited
        """
        try:
            # Search FDA adverse events database
            search_url = f"{self.fda_base_url}/event.json"
            params = {
                "search": f"patient.drug.medicinalproduct:{drug_name}",
                "limit": 100
            }
            
            response = requests.get(search_url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                allergies = []
                
                for result in data.get('results', []):
                    reactions = result.get('patient', {}).get('reaction', [])
                    for reaction in reactions:
                        # Look for allergy-related terms
                        reaction_term = reaction.get('reactionmeddrapt', '').lower()
                        if any(term in reaction_term for term in ['allergy', 'hypersensitivity', 'rash', 'anaphylaxis']):
                            allergies.append({
                                "medicine": drug_name,
                                "allergy_type": self._classify_allergy_type(drug_name),
                                "severity": self._map_reaction_severity(reaction_term),
                                "reason": f"FDA adverse event: {reaction_term}",
                                "source": "FDA_FAERS"
                            })
                
                return allergies
                
        except Exception as e:
            print(f"FDA API error for {drug_name}: {e}")
            
        return []
    
    def predict_interactions_with_ml(self, drug_list: List[str]) -> List[Dict]:
        """
        Use machine learning to predict drug interactions
        This would use trained models based on chemical structures, mechanisms, etc.
        """
        # This is conceptual - would need:
        # 1. Chemical structure data (SMILES, molecular descriptors)
        # 2. Trained ML model (could use sci-kit learn, TensorFlow)
        # 3. Feature engineering (drug similarity, target pathways, etc.)
        
        interactions = []
        
        # Pseudocode for ML approach:
        # for drug_pair in combinations(drug_list, 2):
        #     features = extract_drug_pair_features(drug_pair[0], drug_pair[1])
        #     interaction_probability = ml_model.predict_proba([features])[0][1]
        #     severity = severity_model.predict([features])[0]
        #     
        #     if interaction_probability > 0.7:  # Threshold
        #         interactions.append({
        #             "drug1": drug_pair[0],
        #             "drug2": drug_pair[1], 
        #             "severity": severity,
        #             "confidence": interaction_probability,
        #             "source": "ML_Prediction"
        #         })
        
        return interactions
    
    def get_interactions_from_drugbank(self, drug_list: List[str]) -> List[Dict]:
        """
        DrugBank API (commercial but very comprehensive)
        Requires API key and subscription
        """
        # This would be the most comprehensive but costs money
        # DrugBank has the most complete drug interaction database
        return []
    
    def _get_rxcui(self, drug_name: str) -> str:
        """Get RxNorm Concept Unique Identifier"""
        try:
            url = f"{self.rxnorm_base_url}/rxcui.json?name={drug_name}"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                rxcui_list = data.get('idGroup', {}).get('rxnormId', [])
                return rxcui_list[0] if rxcui_list else None
        except:
            return None
    
    def _classify_allergy_type(self, drug_name: str) -> str:
        """Classify drug into allergy family"""
        drug_name = drug_name.lower()
        
        # Rule-based classification
        if any(name in drug_name for name in ['amoxicillin', 'ampicillin', 'penicillin']):
            return 'penicillin'
        elif any(name in drug_name for name in ['azithromycin', 'clarithromycin', 'erythromycin']):
            return 'macrolide'
        elif any(name in drug_name for name in ['ibuprofen', 'aspirin', 'naproxen']):
            return 'nsaid'
        elif any(name in drug_name for name in ['ciprofloxacin', 'levofloxacin']):
            return 'fluoroquinolone'
        else:
            return 'unknown'
    
    def _map_severity(self, api_severity: str) -> str:
        """Map API severity to our system"""
        severity_map = {
            'high': 'critical',
            'moderate': 'medium', 
            'minor': 'low',
            'contraindicated': 'critical'
        }
        return severity_map.get(api_severity.lower(), 'medium')
    
    def _map_reaction_severity(self, reaction: str) -> str:
        """Map FDA reaction to severity"""
        if 'anaphylaxis' in reaction or 'severe' in reaction:
            return 'critical'
        elif 'moderate' in reaction or 'rash' in reaction:
            return 'high'
        else:
            return 'medium'

def demonstrate_ai_approaches():
    """Demonstrate different approaches to get drug interaction data"""
    print("🤖 AI/API APPROACHES TO DRUG INTERACTION PREDICTION")
    print("=" * 60)
    
    ai_checker = AIInteractionChecker()
    test_drugs = ["azithromycin", "warfarin", "ibuprofen"]
    
    print("💊 Test drugs:", test_drugs)
    print()
    
    # Approach 1: NLM RxNorm API (Free)
    print("1️⃣ NLM RxNorm API Approach (FREE):")
    print("   ✅ Pros: Free, official medical data, no API key needed")
    print("   ❌ Cons: Limited coverage, complex API structure")
    print("   📊 Coverage: ~40,000 drugs, basic interactions")
    
    # Test NLM approach (commented out to avoid API calls in demo)
    # nlm_interactions = ai_checker.get_drug_interactions_from_nlm(test_drugs)
    # print(f"   Found {len(nlm_interactions)} interactions")
    
    print("\n2️⃣ OpenAI GPT Approach:")
    print("   ✅ Pros: Can reason about novel combinations, explains mechanisms")
    print("   ❌ Cons: Costs money, may hallucinate, not always up-to-date")
    print("   📊 Coverage: Unlimited combinations, reasoning-based")
    
    print("\n3️⃣ FDA FAERS Database (FREE):")
    print("   ✅ Pros: Real-world adverse event data, free")
    print("   ❌ Cons: Historical data only, not predictive")
    print("   📊 Coverage: Actual reported side effects")
    
    print("\n4️⃣ Machine Learning Approach:")
    print("   ✅ Pros: Can predict novel interactions, learns patterns")
    print("   ❌ Cons: Needs training data, complex to build")
    print("   📊 Coverage: Based on chemical similarity and mechanisms")
    
    print("\n5️⃣ DrugBank API (COMMERCIAL):")
    print("   ✅ Pros: Most comprehensive, professionally curated")
    print("   ❌ Cons: Expensive ($1000s per year)")
    print("   📊 Coverage: 14,000+ drugs, 500,000+ interactions")
    
    print(f"\n💡 RECOMMENDATION:")
    print("For hackathon/prototype: Use your current drug_db.json approach")
    print("✅ Fast, reliable, works offline")
    print("✅ You control the data quality")
    print("✅ No API dependencies or costs")
    print("✅ Perfect for demonstration")
    
    print(f"\nFor production system:")
    print("🔄 Hybrid approach:")
    print("   1. Start with curated database (your current approach)")
    print("   2. Enhance with NLM API for coverage")
    print("   3. Add OpenAI for novel combinations")
    print("   4. Use ML for pattern detection")
    
    print(f"\n🏁 CONCLUSION:")
    print("Your drug_db.json approach is actually BETTER for this project!")
    print("APIs can fail, cost money, and add complexity.")
    print("Your static database is fast, reliable, and demonstrates the concept perfectly!")

if __name__ == "__main__":
    demonstrate_ai_approaches()