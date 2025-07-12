import os
import torch
from PIL import Image
from transformers import AutoModelForImageClassification, AutoImageProcessor

# Define device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load model and processor from current directory
model_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models', 'state'))

model = AutoModelForImageClassification.from_pretrained(
    model_dir,
    local_files_only=True
).to(device)

image_processor = AutoImageProcessor.from_pretrained(
    model_dir,
    local_files_only=True
)

# Class labels
CLASS_LABELS = ['Anger', 'Disgust', 'Fear', 'Happiness', 'Sadness', 'Surprise', 'Neutral']

def predict_state(image: Image.Image) -> str:
    """Takes a PIL image and returns the predicted emotion label."""
    image = image.convert("RGB").resize((224, 224), Image.LANCZOS)
    inputs = image_processor(image, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = torch.nn.functional.softmax(outputs.logits[0], dim=0)
        predicted_class = torch.argmax(probabilities).item()

    return CLASS_LABELS[predicted_class]
