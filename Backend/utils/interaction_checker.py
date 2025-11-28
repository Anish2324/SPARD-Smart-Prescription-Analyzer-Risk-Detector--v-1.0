import json
import os
from itertools import combinations

class InteractionChecker:
    """Checks for drug-drug interactions and allergy conflicts."""
    
    def __init__(self, db_path=None):
        if db_path is None:
            # Correctly construct the path to drug_db.json relative to this file
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            db_path = os.path.join(base_dir, 'drug_db.json')
            
        self.db_path = db_path
        self._load_databases()

    def _load_databases(self):
        """Load interaction and allergy databases from the JSON file."""
        try:
            with open(self.db_path, 'r') as f:
                db = json.load(f)
                self.interactions = db.get('drug_interactions', [])
                self.allergies = db.get('allergy_database', [])
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error loading interaction/allergy database: {e}")
            self.interactions = []
            self.allergies = []

    def check_interactions(self, medicines):
        """
        Checks for harmful interactions between a list of medicines.
        
        Args:
            medicines (list): A list of normalized medicine names.
            
        Returns:
            list: A list of dictionaries, each describing a found interaction.
        """
        found_interactions = []
        
        # Generate all unique pairs of medicines
        medicine_pairs = combinations(sorted(medicines), 2)
        
        for med1, med2 in medicine_pairs:
            for interaction in self.interactions:
                # Check if the pair matches the interaction record (in any order)
                if (interaction['drug1'].lower() == med1 and interaction['drug2'].lower() == med2) or \
                   (interaction['drug1'].lower() == med2 and interaction['drug2'].lower() == med1):
                    
                    found_interactions.append({
                        "pair": f"{med1} + {med2}",
                        "severity": interaction.get('severity', 'unknown'),
                        "reason": interaction.get('reason', 'No reason provided.')
                    })
        
        return found_interactions

    def check_allergy_conflicts(self, medicines, patient_allergies):
        """
        Checks if any of the medicines conflict with the patient's known allergies.
        
        Args:
            medicines (list): A list of normalized medicine names.
            patient_allergies (list): A list of allergies the patient has (e.g., ['penicillin', 'nsaid']).
            
        Returns:
            list: A list of dictionaries, each describing an allergy conflict.
        """
        if not patient_allergies:
            return []

        found_conflicts = []
        patient_allergies_lower = [a.lower() for a in patient_allergies]
        
        for med in medicines:
            for allergy_record in self.allergies:
                if allergy_record['medicine'].lower() == med and allergy_record['allergy_type'].lower() in patient_allergies_lower:
                    found_conflicts.append({
                        "medicine": med,
                        "allergy": allergy_record['allergy_type'],
                        "severity": allergy_record.get('severity', 'unknown'),
                        "reason": allergy_record.get('reason', 'No reason provided.')
                    })
                    
        return found_conflicts

    def calculate_risk_level(self, interactions, allergy_conflicts):
        """
        Calculates a qualitative risk level based on the findings.
        
        Args:
            interactions (list): List of interaction results.
            allergy_conflicts (list): List of allergy conflict results.
            
        Returns:
            str: A risk level ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').
        """
        severity_map = {'low': 1, 'medium': 2, 'high': 3, 'critical': 4}
        
        max_severity = 0
        
        for item in interactions + allergy_conflicts:
            severity_score = severity_map.get(item['severity'].lower(), 0)
            if severity_score > max_severity:
                max_severity = severity_score
        
        if max_severity == 4:
            return "CRITICAL"
        if max_severity == 3:
            return "HIGH"
        if max_severity == 2:
            return "MEDIUM"
        if max_severity == 1:
            return "LOW"
            
        return "NONE"

# Example usage:
if __name__ == '__main__':
    checker = InteractionChecker()
    
    # --- Test Case 1: Interaction ---
    medicines1 = ['metformin', 'ibuprofen', 'amoxicillin']
    interactions = checker.check_interactions(medicines1)
    print("Found Interactions:")
    print(json.dumps(interactions, indent=2))
    
    # --- Test Case 2: Allergy Conflict ---
    medicines2 = ['amoxicillin', 'lisinopril']
    allergies = ['penicillin', 'sulfa']
    conflicts = checker.check_allergy_conflicts(medicines2, allergies)
    print("\nFound Allergy Conflicts:")
    print(json.dumps(conflicts, indent=2))
    
    # --- Test Case 3: Risk Level ---
    risk = checker.calculate_risk_level(interactions, conflicts)
    print(f"\nCalculated Risk Level: {risk}")
    # Expected: HIGH (from the metformin+ibuprofen interaction)
