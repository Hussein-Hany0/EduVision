import io
import base64
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
import cv2
import numpy as np

from utils.state_processor2 import predict_state
from utils.hand_processor import predict_hand
from utils.gaze_tracking import GazeTracking
gaze = GazeTracking()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.route("/")
def home():
    return "I'm Working :)"

@app.route("/predict", methods=["POST"])
def predict_all():
    try:
        data = request.get_json()
        base64_image = data.get("base64Image")
        user_id = data.get("userId")
        user_name = data.get("userName")
        meeting_id = data.get("meetingId")

        if not base64_image:
            return jsonify({"error": "No image provided"}), 400

        # Decode base64 image to PIL and CV2 formats
        image_bytes = base64.b64decode(base64_image)
        image_pil = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        frame_cv2 = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)

        # Predict State (Emotion)
        state_prediction = predict_state(image_pil)

        # Predict Hand
        hand_prediction = predict_hand(image_pil)

        # Predict Gaze
        gaze.refresh(frame_cv2)
        if gaze.is_blinking():
            gaze_prediction = "blinking"
        elif gaze.is_right():
            gaze_prediction = "looking right"
        elif gaze.is_left():
            gaze_prediction = "looking left"
        elif gaze.is_center():
            gaze_prediction = "looking center"
        else:
            gaze_prediction = "undetected"

        # Final Response
        result = {
            "userId": user_id,
            "userName": user_name,
            "meetingId": meeting_id,
            "state": state_prediction,
            "hand": hand_prediction,
            "gaze": gaze_prediction
        }

        return jsonify(result), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, threaded=True, port=8000)
