import cv2
import numpy as np
from typing import List, Tuple
from app.services.pipeline.models import QualityScore

class QualityAnalyzer:
    """Analyzes image quality (blur, lighting, contrast) using OpenCV."""
    
    @staticmethod
    def analyze(bgr_image: np.ndarray) -> QualityScore:
        reasons = []
        recommendations = []
        score = 100.0
        
        # Convert to grayscale for laplacian and histogram
        gray = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY)
        
        # 1. Blur Detection (Variance of Laplacian)
        fm = cv2.Laplacian(gray, cv2.CV_64F).var()
        if fm < 100:
            score -= 30
            reasons.append("Image is severely blurred.")
            recommendations.append("Ensure the camera is steady and the subject is in focus.")
        elif fm < 500:
            score -= 10
            reasons.append("Image is slightly blurred.")
            
        # 2. Lighting Detection (Mean Brightness)
        mean_brightness = np.mean(gray)
        if mean_brightness < 40:
            score -= 40
            reasons.append("Image is too dark.")
            recommendations.append("Improve lighting. Take the photo in a well-lit room or outside.")
        elif mean_brightness > 240:
            score -= 30
            reasons.append("Image is overexposed.")
            recommendations.append("Avoid harsh direct light or facing a window.")
            
        # 3. Contrast Detection (RMS contrast)
        contrast = gray.std()
        if contrast < 20:
            score -= 20
            reasons.append("Image has very low contrast.")
            recommendations.append("Ensure good lighting and contrast against the background.")
            
        # Clamp score
        score = max(0.0, min(100.0, score))
        
        return QualityScore(
            score=score,
            reasons=reasons,
            recommendations=recommendations
        )

