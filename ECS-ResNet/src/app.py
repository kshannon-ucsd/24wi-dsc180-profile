import io
import json
import warnings
import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.preprocessing import image
from model_loader import model
from custom_encoder import NpEncoder

# Suppress warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "ECS Model API with CNN model is running!"})

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    # Load image from request properly
    file = request.files["image"]

    # Convert file to in-memory format before loading
    img = image.load_img(io.BytesIO(file.read()), target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = img_array / 255.0  # Ensure normalization (if model was trained with normalization)

    # Debugging: Print Image Shape Before Prediction
    print("Image shape after processing:", img_array.shape)


    # Predict the result
    predictions = model.predict(img_array)
    predicted_class = (predictions > 0.5).astype(int) 
    return {
        "statusCode": 200,
        "body": json.dumps({"prediction": int(predicted_class)}, cls=NpEncoder),
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
    }

if __name__ == "__main__":
    print("🚀 Starting Flask app...")
    app.run(host="0.0.0.0", port=8080)
