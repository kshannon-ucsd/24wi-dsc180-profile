import requests
from PIL import Image
from io import BytesIO
import numpy as np
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent.parent / "config" / ".env"
print(env_path)

load_dotenv(env_path)

X_TEST_PATH = os.environ.get("X_TEST_PATH")
Y_TEST_PATH = os.environ.get("Y_TEST_PATH")
DEPLOYMENT_ENV = os.environ.get("DEPLOYMENT_ENV") 
if DEPLOYMENT_ENV == "local":
    API_URL = "http://127.0.0.1:8080/predict"
else:
    API_URL = os.environ.get("API_URL")
# Load test data
X_test = np.load(X_TEST_PATH)
y_test = np.load(Y_TEST_PATH)


print("X_test shape:", X_test.shape)
print("y_test shape:", y_test.shape)
print("y_test first result:", y_test[0])

# Convert first test image to a PIL image
image_array = (X_test[0] * 255).astype(np.uint8)  # Scale if needed
image = Image.fromarray(image_array)

# Save as a temporary in-memory file
image_buffer = BytesIO()
image.save(image_buffer, format="JPEG")
image_buffer.seek(0)

# Send the image to the API and Cloud Deployment Test
files = {"image": ("image.jpg", image_buffer, "image/jpeg")}
response = requests.post(API_URL, files=files)

print(response.json())
