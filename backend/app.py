from flask import Flask, request, jsonify
from flask_cors import CORS
import os 
import json
import uuid

# Import core logic from main.py
from main import process_allergen_image, analyze_ingredients, load_allergens 

app = Flask(__name__) # Creates the server app 
app = Flask(__name__)
CORS(app) # Allows React Native to connect to this server

# Load database once when server starts
allergen_db = load_allergens("allergens.json")

@app.route('/scan', methods=['POST'])
def scan_label():
    # The main API endpoint that React Native will call
    # 1. Check if the app actually sent an image  
    if 'image' not in request.files:
        return jsonify({"Error" : "No image file provided"}), 400
    
    file = request.files['image']

    # 2. Extract the user's allergen profile from the request 
    # The mobile app will send this as a stringified JSOn array (ex. '["milk", "soy"]')
    try:
        user_allergens = json.loads(request.form.get('allergens', '[]'))
    except json.JSONDecodeError:
        return jsonify({"Error": "Invalid allergen profile format"}), 400
    
    if not user_allergens:
        return jsonify({"Error": "No allergens selected"}), 400
    
    # 3. Save the image temporarily with a unique name to avoid conflicts
    unique_filename = f"{uuid.uuid4().hex}.jpg"
    file.save(unique_filename)

    # 4. Run the engine
    clean_text = process_allergen_image(unique_filename)
    # 3. Save the image temporarily so Tesseract can read it
    temp_image_path = "temp_scan.jpg"
    file.save(temp_image_path)

    # 4. Run the engine
    clean_text = process_allergen_image(temp_image_path)

    if clean_text:
        # Pass to the traffic controller
        final_results = analyze_ingredients(clean_text, user_allergens, allergen_db)

        # Clean up the temporary image
        os.remove(unique_filename)
        os.remove(temp_image_path)

        # Send the JSON verdict back to the mobile app
        return jsonify(final_results), 200
    else:
        # Clean up if OCR fails
        if os.path.exists(unique_filename):
            os.remove(unique_filename)
        return jsonify({"Error": "Failed to extract text from image"}), 500
    
    if not clean_text or clean_text.strip() == "":
        # Delete the file and return an error so app can tell the user to retake
        os.remove(unique_filename)
        return jsonify({"Error": "No readable text found. Please retake the photo."}), 400
    
if __name__ == '__main__':
    # Start the local development server
    app.run(debug=True, port=5000)
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)
        return jsonify({"Error": "Failed to extract text from image"}), 500
    
if __name__ == '__main__':
    # Start the local development server
    app.run(debug=True, port=5000)
    
