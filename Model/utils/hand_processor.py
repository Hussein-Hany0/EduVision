# utils/hand_processor.py
import torch
import torch.nn as nn
from torchvision import models, transforms
import mediapipe as mp
import numpy as np
from PIL import Image
import cv2
import os
import time

# Constants
IMG_HEIGHT = 224
IMG_WIDTH = 224
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load Model
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'hand_model.pth')
model = models.resnet50(pretrained=False)
num_ftrs = model.fc.in_features
model.fc = nn.Sequential(
    nn.Dropout(0.5),
    nn.Linear(num_ftrs, 4)
)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.to(DEVICE)
model.eval()

# Class labels
class_names = {0: 'dislike', 1: 'like', 2: 'no_raised_hand', 3: 'raised_hand'}

# MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5)

# Preprocessing
preprocess = transforms.Compose([
    transforms.Resize((IMG_HEIGHT, IMG_WIDTH)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def predict_hand(image: Image.Image) -> str:
    frame = np.array(image)
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    h, w, _ = frame.shape

    # Detect hands
    results = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    if not results.multi_hand_landmarks:
        return "no_hand_detected"

    for hand_landmarks in results.multi_hand_landmarks:
        x_min = max(0, int(min([lm.x for lm in hand_landmarks.landmark]) * w - 20))
        x_max = min(w, int(max([lm.x for lm in hand_landmarks.landmark]) * w + 20))
        y_min = max(0, int(min([lm.y for lm in hand_landmarks.landmark]) * h - 20))
        y_max = min(h, int(max([lm.y for lm in hand_landmarks.landmark]) * h + 20))

        hand_crop = frame[y_min:y_max, x_min:x_max]
        if hand_crop.size == 0:
            continue

        hand_crop_rgb = cv2.cvtColor(hand_crop, cv2.COLOR_BGR2RGB)
        hand_pil = Image.fromarray(hand_crop_rgb)
        hand_tensor = preprocess(hand_pil).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            output = model(hand_tensor)
            prob = torch.softmax(output, dim=1).cpu().numpy()[0]
            pred = np.argmax(prob)
            return class_names[pred]

    return "no_hand_detected"
