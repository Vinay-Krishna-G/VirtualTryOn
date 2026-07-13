import cv2
import numpy as np
import logging

logger = logging.getLogger(__name__)

class SareeDetector:
    """Lightweight CV heuristic to detect if the user is already wearing a draped garment."""
    
    @staticmethod
    def detect(bgr_image: np.ndarray, pose_results) -> bool:
        """
        Uses pose landmarks to crop the torso and check for draped garment characteristics.
        Returns True if a saree/draped garment is highly likely.
        """
        if not pose_results or not pose_results.pose_landmarks or len(pose_results.pose_landmarks) == 0:
            return False
            
        try:
            h, w = bgr_image.shape[:2]
            
            # Get torso bounds
            landmarks = pose_results.pose_landmarks[0]
            l_shoulder = landmarks[11]
            r_shoulder = landmarks[12]
            l_hip = landmarks[23]
            r_hip = landmarks[24]
            
            # Check visibility
            if any(p.visibility < 0.5 for p in [l_shoulder, r_shoulder, l_hip, r_hip]):
                return False
                
            x_min = int(min(l_shoulder.x, r_shoulder.x, l_hip.x, r_hip.x) * w)
            x_max = int(max(l_shoulder.x, r_shoulder.x, l_hip.x, r_hip.x) * w)
            y_min = int(min(l_shoulder.y, r_shoulder.y, l_hip.y, r_hip.y) * h)
            y_max = int(max(l_shoulder.y, r_shoulder.y, l_hip.y, r_hip.y) * h)
            
            # Padding
            pad = int(0.1 * (x_max - x_min))
            x_min, x_max = max(0, x_min - pad), min(w, x_max + pad)
            y_min, y_max = max(0, y_min - pad), min(h, y_max + pad)
            
            if x_max <= x_min or y_max <= y_min:
                return False
                
            torso_roi = bgr_image[y_min:y_max, x_min:x_max]
            
            # Heuristic: Sarees often have strong diagonal edges across the torso (the pallu)
            gray = cv2.cvtColor(torso_roi, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            
            # Hough lines to detect long diagonals
            lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=50, minLineLength=int((y_max-y_min)*0.4), maxLineGap=10)
            
            diagonal_count = 0
            if lines is not None:
                for line in lines:
                    x1, y1, x2, y2 = line[0]
                    angle = np.abs(np.degrees(np.arctan2(y2 - y1, x2 - x1)))
                    if (30 < angle < 60) or (120 < angle < 150):
                        diagonal_count += 1
                        
            if diagonal_count >= 2:
                return True
                
            return False
            
        except Exception as e:
            logger.warning(f"Saree detection failed: {e}")
            return False

