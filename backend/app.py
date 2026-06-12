from flask import Flask, request, jsonify
from flask_cors import CORS
import os 
import json
import uuid
import tempfile

# Import core logic from main.py
from main import process_allergen_image, analyze_ingredients, load_allergens 

app = Flask(__name__) # Creates the server app 
CORS(app) # Allows React Native to connect to this server

# Absolute path to allergens.json 
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ALLERGEN_DB_PATH = os.path.join(BASE_DIR, 'allergens.json')

# Load database once when server starts
allergen_db = load_allergens(ALLERGEN_DB_PATH)

if not allergen_db:
    raise RuntimeError(f"Failed to load allergen DB from {ALLERGEN_DB_PATH}")

# Build a case-insensitive lookup for frontend allergen selections
allergen_key_map = {key.strip().lower(): key for key in allergen_db.keys()}

@app.route('/scan', methods=['POST'])
def scan_label():
    unique_filename = None
    temp_path = None 

    # The main API endpoint that React Native will call
    # 1. Check if the app actually sent an image  
    try:
        if 'image' not in request.files:
            return jsonify({
                "success" : False,
                "error": "No image file provided"}), 400
    
        file = request.files['image']

        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No image selected"}), 400

        # 2. Extract the user's allergen profile from the request 
        # The mobile app will send this as a stringified JSOn array (ex. '["milk", "soy"]')
        try:
            user_allergens = json.loads(request.form.get('allergens', '[]'))
        except json.JSONDecodeError:
            return jsonify({
                "success": False,
                "error": "Invalid allergen profile format"}), 400
    
        if not isinstance(user_allergens, list) or not user_allergens:
            return jsonify({
                "success": False,
                "error": "No allergens selected"}), 400
    
        normalized_user_allergens =[]
        invalid_allergens = []

        for item in user_allergens:
            normalized = str(item).strip().lower()
            if normalized in allergen_key_map:
                normalized_user_allergens.append(allergen_key_map[normalized])
            else:
                invalid_allergens.append(str(item))
    
        if not normalized_user_allergens:
            return jsonify({
                "success": False,
                "error": "No valid allergens selected",
                "invalid_allergens": invalid_allergens,
                "valid_allergens": list(allergen_db.keys())
            }), 400
    
        # 3. Save the image temporarily with a unique name to avoid conflicts
        original_ext = os.path.splitext(file.filename)[1].lower()
        if not original_ext:
            original_ext = '.jpg' # Default to .jpg if no extension provided
        
        unique_filename = f"{uuid.uuid4().hex}{original_ext}"
        temp_path = os.path.join(tempfile.gettempdir(), unique_filename)
        file.save(temp_path)

        # 4. Run the engine
        clean_text = process_allergen_image(temp_path)

        if not clean_text or clean_text.strip() == "":
            return jsonify({
                "success": False,
                "error": "No readable text found. Please retake the photo."
            }), 400

        # Pass to the traffic controller
        final_results = analyze_ingredients(clean_text, normalized_user_allergens, allergen_db)

        response_payload = {
            "success": True,
            "matches": final_results.get("verdict", "SAFE"),
            "missed_allergens": final_results.get("matches", []),
            "false_positives": final_results.get("stats", {})
        }

        # Send the JSON verdict back to the mobile app
        return jsonify(response_payload), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Server error during allergen scan",
        }), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
    
if __name__ == '__main__':
    # Start the local development server
    app.run(debug=True, port=5000)
