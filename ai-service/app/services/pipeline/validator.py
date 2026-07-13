import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import logging
import os
from app.services.pipeline.models import QualityScore

logger = logging.getLogger(__name__)

class PoseValidator:
    """Singleton MediaPipe Pose Validator using modern Tasks API."""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PoseValidator, cls).__new__(cls)
            model_path = os.path.join(os.path.dirname(__file__), "pose_landmarker_lite.task")
            base_options = python.BaseOptions(model_asset_path=model_path)
            options = vision.PoseLandmarkerOptions(
                base_options=base_options,
                output_segmentation_masks=False)
            cls._instance.detector = vision.PoseLandmarker.create_from_options(options)
        return cls._instance
        
    def process_image(self, rgb_image: np.ndarray):
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_image)
        return self.detector.detect(mp_image)
        
    def validate(self, rgb_image: np.ndarray, quality: QualityScore) -> tuple[bool, float]:
        """
        Validates the pose and updates quality score.
        Returns (is_valid, failure_prediction_score).
        """
        results = self.process_image(rgb_image)
        
        if not results.pose_landmarks or len(results.pose_landmarks) == 0:
            quality.score -= 80
            quality.reasons.append("No person detected in the image.")
            quality.recommendations.append("Ensure your full body is visible in the frame.")
            return False, 0.95
            
        landmarks = results.pose_landmarks[0]
        
        # Check essential body parts visibility
        missing_parts = []
        
        # Shoulders (11, 12)
        l_shoulder, r_shoulder = landmarks[11], landmarks[12]
        if l_shoulder.visibility < 0.5 and r_shoulder.visibility < 0.5:
            missing_parts.append("shoulders")
            
        # Hips (Torso) (23, 24)
        l_hip, r_hip = landmarks[23], landmarks[24]
        if l_hip.visibility < 0.5 and r_hip.visibility < 0.5:
            missing_parts.append("torso")
            
        # Legs/Knees (25, 26)
        l_knee, r_knee = landmarks[25], landmarks[26]
        if l_knee.visibility < 0.4 and r_knee.visibility < 0.4:
            quality.score -= 10
            quality.reasons.append("Legs are not clearly visible.")
            quality.recommendations.append("A full-body shot produces the best results.")
            
        if missing_parts:
            quality.score -= 40 * len(missing_parts)
            parts_str = ", ".join(missing_parts)
            quality.reasons.append(f"Missing visible body parts: {parts_str}.")
            quality.recommendations.append("Ensure you are taking a photo from waist/knees up at minimum.")
            
        # Failure prediction logic
        failure_prob = 0.0
        if quality.score < 50:
            failure_prob = 0.8
        elif quality.score < 70:
            failure_prob = 0.4
            
        is_valid = quality.score >= 40.0 
        return is_valid, failure_prob

