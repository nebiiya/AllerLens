import json
import pytesseract
from PIL import Image
import re

def load_allergens(filepath):
    # Loads the static JSON file into a Python dictionary (Hash Map).
    # Error handling is included to manage potential issues with file access or JSON parsing.
    try:
        with open(filepath, 'r') as file:
            # json.load() converts the JSON into a py dict
            allergen_hash_map = json.load(file)
            return allergen_hash_map
    except FileNotFoundError:
        print(f"Error: The allergens.json file was not found.")
        return None

# Load the library 
allergen_library = load_allergens("allergens.json")


def process_allergen_image(image_path):
    # Extracts text from an image and cleans it for algorithm processing.

    # 1. Open the image file
    try:
        img = Image.open(image_path) # Loads the physical image file from computer into python.
    except FileNotFoundError:
        print(f"Error: Image file not found.")
        return None
    
    # 2. Extract raw text using Tesseract 
    raw_text = pytesseract.image_to_string(img) # Scan the image pixels -> translates to a single, long text string

    # 3. Preprocessing: Clean the text
    # Convert everything to lowercase for uniformity
    clean_text = raw_text.lower()

    # Remove punctuation and special characters using regex
    clean_text = re.sub(r'[^a-z0-9\s]',' ', clean_text) 

    # If there are multiple spaces, reduce them to a single space
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()

    return clean_text    

# Algorithms Implementation
def build_bad_char_table(pattern):
    # Builds the bad character table for Boyer-Moore algorithm
    bad_char_table = {}
     
    for i in range(len(pattern)): # Store last occurence index of each char in the pattern
        bad_char_table[pattern[i]] = i
    return bad_char_table

def boyer_moore_search(text, pattern):
    n = len(text)
    m = len(pattern)
    match_positions = []
    comparisons = 0

    if m == 0 or n == 0 or m > n:
        return match_positions, comparisons
    
    bad_char_table = build_bad_char_table(patten)
    shift = 0

    while shift <= (n-m):
        j = m -1 

        while j >= 0:
            comparisons += 1
            if pattern[j] != text[shift + j]:
                break
            j -= 1
        
        if j < 0:
            match_positions.append(shift)
            
            if (shift + m) < n:
                next_char = text[shift + m]
                shift += m - bad_char_table.get(next_char, -1)
            else:
                shift += 1
        else:
            mismatched_char = text[shift + j]
            last_occurrence = bad_char_table.get(mismatched_char, -1)
            shift += max(1, j-last_occurrence)

    return match_positions, comparisons

def brute_force_search(text, pattern):
    n = len(text)
    m = len(pattern)
    match_positions = []
    comparisons = 0

    # Edge case handling matching your Boyer-Moore logic
    if m == 0 or n == 0 or m > n:
        return match_positions, comparisons 

    # Outer loop slides the pattern across the text step-by-step
    for shift in range(n - m + 1):
        j = 0
        
        # Inner loop checks characters from left to right
        while j < m:
            comparisons += 1
            if text[shift + j] != pattern[j]:
                break  # Mismatch found; stop checking this shift
            j += 1
            
        # If the inner loop finished without breaking, we found a match
        if j == m:
            match_positions.append(shift)

    return match_positions, comparisons

# Main processing function 
def analyze_ingredients(clean_text, user_allergens, allergen_db):
    # Cross references the clean OCR text against the user's allergen profile
    matches_found = []
    comparison_stats = {}

    # Loop thru each allergen the user selected 
    for allergen in user_allergens:

        # Grab the list of aliases from loaded JSON library/database
        if allergen in allergen_db:
            aliases = allergen_db[allergen]

            # Search the clean text for each alias using both algorithms
            for alias in aliases:

                # Boyer-Moore String Matching
                b_pos, b_comp = boyer_moore_search(clean_text, alias)

                # Brute Force String Matching (for comparison)
                f_pos, f_comp = brute_force_search(clean_text, alias)

                # If Boyer-Moore found a match, record/add to results dictionary
                if b_pos: 
                    matches_found.append({
                        "allergen": allergen,
                        "alias_found": alias,
                        "positions": b_pos
                    })
                
                # Record performance stats to show the user later
                comparison_stats[alias] ={ 
                    "boyer_comps": b_comp,
                    "brute_comps": f_comp
                }

    # Determine Final Verdict based on findings
    if matches_found:
        verdict = "WARNING"
    else:
        verdict = "SAFE"
    
    return {
        "verdict": verdict,
        "matches": matches_found,
        "stats": comparison_stats
    }