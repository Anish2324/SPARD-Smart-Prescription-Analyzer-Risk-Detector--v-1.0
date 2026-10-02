import json
import os
import warnings
import google.generativeai as genai
import re
from datetime import datetime
warnings.filterwarnings('ignore')

class DrugInteractionAIModel:
    """
    Gemini AI-powered drug interaction and allergy prediction system
    Uses Google Gemini Pro for advanced medical analysis
    """
    
    def __init__(self, gemini_api_key=None, model_name=None):
        # Gemini API setup
        self.gemini_api_key = gemini_api_key or os.getenv('GEMINI_API_KEY')
        self.model_name = model_name or os.getenv('GEMINI_MODEL', 'gemini-2.5-pro')
        self.use_gemini = bool(self.gemini_api_key)
        self.gemini_model = None
        
        if self.use_gemini:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self.gemini_model = genai.GenerativeModel(self.model_name)
                print(f"🤖 Gemini AI initialized successfully with model: {self.model_name}")
            except Exception as e:
                print(f"⚠️ Gemini API initialization failed: {e}")
                self.use_gemini = False
        else:
            print("ℹ️ No Gemini API key configured - please add GEMINI_API_KEY to .env file")
    
    def classify_allergy_type(self, medicine):
        """Classify medicine into allergy category"""
        medicine = medicine.lower()
        
        # Rule-based classification enhanced with AI
        if any(name in medicine for name in ['amoxicillin', 'ampicillin', 'penicillin']):
            return 'penicillin'
        elif any(name in medicine for name in ['azithromycin', 'clarithromycin', 'erythromycin']):
            return 'macrolide'
        elif any(name in medicine for name in ['ibuprofen', 'aspirin', 'naproxen', 'diclofenac']):
            return 'nsaid'
        elif any(name in medicine for name in ['ciprofloxacin', 'levofloxacin', 'moxifloxacin']):
            return 'fluoroquinolone'
        elif any(name in medicine for name in ['doxycycline', 'tetracycline', 'minocycline']):
            return 'tetracycline'
        elif any(name in medicine for name in ['sulfamethoxazole', 'trimethoprim']):
            return 'sulfa'
        else:
            return 'unknown'
    
    def generate_interaction_reason(self, drug1, drug2, severity):
        """Generate AI-based interaction reason"""
        reasons = {
            'critical': f"{drug1.title()} and {drug2.title()} have a severe interaction. This combination may cause life-threatening side effects including bleeding, heart problems, or toxic reactions.",
            'high': f"{drug1.title()} may significantly affect how {drug2.title()} works in your body, or vice versa. This could lead to serious side effects or reduced effectiveness.",
            'medium': f"Taking {drug1.title()} with {drug2.title()} may cause moderate side effects or alter the effectiveness of one or both medications.",
            'low': f"{drug1.title()} and {drug2.title()} have a minor interaction that may cause mild side effects but is generally manageable."
        }
        
        return reasons.get(severity, f"Potential interaction detected between {drug1.title()} and {drug2.title()}.")
    
    def generate_allergy_reason(self, medicine, allergy_type):
        """Generate AI-based allergy reason"""
        reasons = {
            'penicillin': f"{medicine.title()} is a penicillin-based antibiotic. Patients with penicillin allergies may experience severe reactions including rash, swelling, breathing difficulties, or anaphylaxis.",
            'macrolide': f"{medicine.title()} is a macrolide antibiotic that can cause allergic reactions including skin rash, gastrointestinal upset, and respiratory issues in sensitive patients.",
            'nsaid': f"{medicine.title()} is an NSAID that may cause allergic reactions including skin reactions, breathing problems, and gastrointestinal bleeding in allergic patients.",
            'fluoroquinolone': f"{medicine.title()} is a fluoroquinolone antibiotic that may cause severe allergic reactions including tendon problems, nerve damage, and skin reactions.",
            'tetracycline': f"{medicine.title()} is a tetracycline antibiotic that can cause photosensitivity, gastrointestinal upset, and other allergic reactions."
        }
        
        return reasons.get(allergy_type, f"{medicine.title()} may cause allergic reactions in sensitive patients.")
    
    def predict_interactions_and_allergies(self, drug_list, patient_allergies):
        """
        Main prediction method that uses only Gemini AI
        """
        if self.use_gemini and self.gemini_model:
            return self._predict_with_gemini(drug_list, patient_allergies)
        else:
            return {
                'error': 'Gemini API not available. Please configure GEMINI_API_KEY in .env file.',
                'interactions': [],
                'allergies': [],
                'risk_level': 'UNKNOWN',
                'suggestions': ['Please configure Gemini API key to get AI predictions'],
                'confidence_scores': {'overall_confidence': 0.0},
                'prediction_source': 'configuration_error'
            }
    
    def _predict_with_gemini(self, drug_list, patient_allergies):
        """Use Gemini API for advanced drug interaction and allergy predictions"""
        try:
            # Create comprehensive prompt for Gemini
            prompt = self._create_gemini_prompt(drug_list, patient_allergies)
            
            # Get prediction from Gemini
            response = self.gemini_model.generate_content(prompt)
            
            # Parse Gemini response
            return self._parse_gemini_response(response.text, drug_list, patient_allergies)
            
        except Exception as e:
            print(f"❌ Gemini API error: {e}")
            return {
                'error': f'Gemini AI error: {str(e)}',
                'interactions': [],
                'allergies': [],
                'risk_level': 'ERROR',
                'suggestions': ['Unable to analyze due to AI service error. Please try again.'],
                'confidence_scores': {'overall_confidence': 0.0},
                'prediction_source': 'gemini_error'
            }
    
    def _predict_with_local_models(self, drug_list, patient_allergies):
        """Use local ML models for predictions"""
        # Get predictions from existing methods
        interactions = self.predict_interactions(drug_list)
        allergies = self.predict_allergies(drug_list, patient_allergies)
        
        # Calculate risk level
        risk_level = 'LOW'
        if any(i.get('severity') in ['critical', 'high'] for i in interactions) or allergies:
            risk_level = 'CRITICAL'
        elif any(i.get('severity') == 'medium' for i in interactions):
            risk_level = 'MEDIUM'
        
        # Generate suggestions
        suggestions_data = self.generate_suggestions(interactions, allergies, drug_list)
        suggestions = [s['suggestion'] for s in suggestions_data]
        
        return {
            'interactions': interactions,
            'allergies': allergies,
            'risk_level': risk_level,
            'suggestions': suggestions,
            'confidence_scores': {
                'interaction_avg': sum(i.get('confidence', 0) for i in interactions) / max(len(interactions), 1),
                'allergy_avg': sum(a.get('confidence', 0) for a in allergies) / max(len(allergies), 1)
            },
            'prediction_source': 'local_ml_models'
        }
    
    def _create_gemini_prompt(self, drug_list, patient_allergies):
        """Create a comprehensive prompt for Gemini API"""
        drugs_text = ", ".join(drug_list)
        allergies_text = ", ".join(patient_allergies) if patient_allergies else "None reported"
        
        prompt = f"""
        You are a highly advanced pharmaceutical AI assistant. Analyze the following medication combination for potential drug-drug interactions, allergy conflicts, and provide safety recommendations.

        MEDICATIONS TO ANALYZE:
        {drugs_text}

        PATIENT ALLERGIES:
        {allergies_text}

        Please provide a comprehensive analysis in the following JSON format:

        {{
            "interactions": [
                {{
                    "pair": "Drug1 + Drug2",
                    "severity": "critical|high|medium|low",
                    "reason": "Detailed medical explanation",
                    "confidence": 0.95,
                    "source": "Gemini_AI"
                }}
            ],
            "allergies": [
                {{
                    "medicine": "Drug Name",
                    "allergy": "Allergy Type",
                    "reason": "Why this drug conflicts with patient allergies",
                    "confidence": 0.90,
                    "source": "Gemini_AI"
                }}
            ],
            "risk_level": "CRITICAL|HIGH|MEDIUM|LOW",
            "suggestions": [
                "Specific recommendation 1",
                "Specific recommendation 2"
            ],
            "confidence_scores": {{
                "overall_confidence": 0.92
            }},
            "clinical_notes": "Additional important clinical considerations"
        }}

        Focus on:
        1. Evidence-based drug interaction analysis
        2. Cross-allergy potential assessment  
        3. Dosing timing recommendations
        4. Alternative medication suggestions
        5. Monitoring requirements
        6. Patient safety priorities

        Be thorough, accurate, and prioritize patient safety in all recommendations.
        """
        return prompt
    
    def _parse_gemini_response(self, response_text, drug_list, patient_allergies):
        """Parse Gemini API response into structured format"""
        try:
            # Try to extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            
            if json_match:
                gemini_data = json.loads(json_match.group())
                
                return {
                    'interactions': gemini_data.get('interactions', []),
                    'allergies': gemini_data.get('allergies', []),
                    'risk_level': gemini_data.get('risk_level', 'MEDIUM'),
                    'suggestions': gemini_data.get('suggestions', []),
                    'confidence_scores': gemini_data.get('confidence_scores', {'overall_confidence': 0.85}),
                    'prediction_source': 'gemini_ai',
                    'clinical_notes': gemini_data.get('clinical_notes', '')
                }
            else:
                # Fallback: parse text response manually
                return self._parse_text_response(response_text, drug_list, patient_allergies)
                
        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            # Fallback to local models
            return self._predict_with_local_models(drug_list, patient_allergies)
    
    def _parse_text_response(self, text, drug_list, patient_allergies):
        """Parse plain text Gemini response as fallback"""
        # Basic text parsing for interactions and recommendations
        risk_level = 'MEDIUM'
        if 'critical' in text.lower() or 'severe' in text.lower():
            risk_level = 'CRITICAL'
        elif 'high risk' in text.lower():
            risk_level = 'HIGH'
        elif 'low risk' in text.lower() or 'minimal' in text.lower():
            risk_level = 'LOW'
        
        # Extract suggestions from text
        suggestions = []
        lines = text.split('\n')
        for line in lines:
            if any(word in line.lower() for word in ['recommend', 'suggest', 'consider', 'avoid']):
                suggestions.append(line.strip())
        
        return {
            'interactions': [],  # Would need more sophisticated parsing
            'allergies': [],
            'risk_level': risk_level,
            'suggestions': suggestions[:5],  # Limit suggestions
            'confidence_scores': {'overall_confidence': 0.75},
            'prediction_source': 'gemini_ai_text_parsed',
            'clinical_notes': text[:500]  # First 500 chars as notes
        }

    def generate_suggestions(self, interactions, allergies, medicines):
        """Generate AI-powered suggestions for safer alternatives"""
        suggestions = []
        
        # Suggestions for interactions
        for interaction in interactions:
            if interaction.get('severity') in ['critical', 'high']:
                suggestion = f"🔄 Consider spacing {interaction['pair']} doses 2-4 hours apart or consult doctor for alternative medications."
                suggestions.append({
                    'type': 'interaction',
                    'priority': 'high',
                    'suggestion': suggestion,
                    'medicines': interaction['pair']
                })
        
        # Suggestions for allergies
        for allergy in allergies:
            suggestion = f"⚠️ Replace {allergy['medicine']} with a non-{allergy['allergy']} alternative. Consult pharmacist for safe substitutes."
            suggestions.append({
                'type': 'allergy',
                'priority': 'critical',
                'suggestion': suggestion,
                'medicine': allergy['medicine']
            })
        
        # General suggestions
        if len(medicines) > 3:
            suggestions.append({
                'type': 'general',
                'priority': 'medium',
                'suggestion': "📋 Consider using a pill organizer and medication schedule to avoid missing doses or accidental overdoses."
            })
        
        return suggestions
    
# Test the Gemini AI system
if __name__ == "__main__":
    ai_model = DrugInteractionAIModel()
    print("🧪 Testing Gemini AI system...")
    
    # Test with sample data
    test_drugs = ['Aspirin', 'Warfarin']
    test_allergies = ['Penicillin']
    
    result = ai_model.predict_interactions_and_allergies(test_drugs, test_allergies)
    print(f"Test result: {result}")