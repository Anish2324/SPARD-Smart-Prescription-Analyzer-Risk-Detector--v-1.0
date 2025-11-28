import json
import os
import re

class MedicineParser:
    """Parses raw OCR text to identify and normalize medicine names."""
    
    def __init__(self, db_path=None):
        if db_path is None:
            # Correctly construct the path to drug_db.json relative to this file
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            db_path = os.path.join(base_dir, 'drug_db.json')
            
        self.db_path = db_path
        self._load_databases()

    def _load_databases(self):
        """Load medicine aliases and all known drug names from the JSON database."""
        try:
            with open(self.db_path, 'r') as f:
                db = json.load(f)
                self.aliases = db.get('medicine_aliases', {})
                
                # Create a reverse map for quick normalization
                self.reverse_aliases = {}
                for standard_name, alias_list in self.aliases.items():
                    for alias in alias_list:
                        self.reverse_aliases[alias.lower()] = standard_name.lower()
                
                # Create a set of all known medicine names (standard and aliases)
                self.known_medicines = set(self.aliases.keys())
                for alias_list in self.aliases.values():
                    self.known_medicines.update(alias.lower() for alias in alias_list)
                
                # Add drugs from interactions to the known list
                for interaction in db.get('drug_interactions', []):
                    self.known_medicines.add(interaction['drug1'].lower())
                    self.known_medicines.add(interaction['drug2'].lower())
                
                # Add drugs from allergies to the known list
                for allergy in db.get('allergy_database', []):
                    self.known_medicines.add(allergy['medicine'].lower())

        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error loading medicine database: {e}")
            self.aliases = {}
            self.reverse_aliases = {}
            self.known_medicines = set()

    def _normalize_medicine_name(self, name):
        """Normalize a medicine name to its standard form using the alias database."""
        name_lower = name.lower()
        # If it's a standard name already
        if name_lower in self.aliases:
            return name_lower
        # If it's an alias, return its standard form
        return self.reverse_aliases.get(name_lower, name_lower)

    def _fuzzy_match_medicine(self, word):
        """Find medicine names that are similar to the word (to handle OCR errors)."""
        from difflib import SequenceMatcher
        
        best_match = None
        best_score = 0.0
        min_similarity = 0.8  # 80% similarity threshold
        
        # Only do fuzzy matching for words that are reasonably long
        if len(word) < 4:
            return None
            
        for medicine in self.known_medicines:
            if len(medicine) >= 4:  # Only match against medicines with 4+ characters
                similarity = SequenceMatcher(None, word, medicine).ratio()
                if similarity > best_score and similarity >= min_similarity:
                    best_score = similarity
                    best_match = medicine
        
        return best_match

    def parse_text(self, text):
        """
        Extracts and normalizes medicine names from raw text with OCR error tolerance.
        
        Args:
            text (str): The raw text extracted from a prescription.
            
        Returns:
            list: A list of unique, normalized medicine names found in the text.
        """
        if not text:
            print("⚠️ No text provided to parse")
            return []
        
        print(f"🔍 Parsing text for medicines: '{text[:100]}...'")
        
        # Use regex to find potential medicine names
        # More flexible pattern to handle OCR errors
        words = set(re.findall(r'\b[a-zA-Z]{3,}[a-zA-Z0-9]*\b', text.lower()))
        print(f"🔤 Found {len(words)} potential medicine words: {list(words)[:10]}")
        
        found_medicines = set()
        
        # First pass: exact matches
        exact_matches = 0
        for word in words:
            if word in self.known_medicines:
                normalized_name = self._normalize_medicine_name(word)
                found_medicines.add(normalized_name)
                exact_matches += 1
                print(f"✅ Exact match: '{word}' -> '{normalized_name}'")
        
        # Second pass: fuzzy matches for OCR errors
        fuzzy_matches = 0
        for word in words:
            if word not in self.known_medicines:  # Skip words we already matched exactly
                fuzzy_match = self._fuzzy_match_medicine(word)
                if fuzzy_match:
                    normalized_name = self._normalize_medicine_name(fuzzy_match)
                    found_medicines.add(normalized_name)
                    fuzzy_matches += 1
                    print(f"🎯 Fuzzy match: '{word}' -> '{fuzzy_match}' -> '{normalized_name}'")
        
        result = sorted(list(found_medicines))
        print(f"💊 Medicine extraction complete: {exact_matches} exact, {fuzzy_matches} fuzzy, {len(result)} total")
        
        return result

# Example usage:
if __name__ == '__main__':
    parser = MedicineParser()
    
    sample_text = """
    PRESCRIPTION
    Dr. Smith | Date: 2025-11-28
    
    Patient: John Doe
    
    1. Metformin 500mg - 1 tablet twice daily
    2. Some notes about Brufen 400mg for pain
    3. Amoxil 250mg
    4. Random text about lifestyle
    """
    
    medicines = parser.parse_text(sample_text)
    print("Parsed and Normalized Medicines:")
    print(medicines)
    # Expected output: ['amoxicillin', 'ibuprofen', 'metformin']
