# processors/state_processor.py

import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model

# Constants
IMG_SIZE = (48, 48)
CLASS_LABELS = ['Anger', 'Disgust', 'Fear', 'Happiness', 'Sadness', 'Surprise', 'Neutral']

# Load model once
state_model = load_model('models/state_model.h5')

def preprocess_image(image: Image.Image):
    image = image.convert("RGB")
    image = image.resize(IMG_SIZE)
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

def predict_state(image: Image.Image):
    image = preprocess_image(image)
    prediction = state_model.predict(image)
    class_idx = np.argmax(prediction, axis=1)[0]
    return CLASS_LABELS[class_idx]
