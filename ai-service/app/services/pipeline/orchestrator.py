import cv2
import numpy as np
import time
import logging
from app.core.config import settings
from app.services.pipeline.models import PipelineContext, ValidationResult, QualityScore
from app.services.pipeline.enhancer import ImageEnhancer
from app.services.pipeline.quality_analyzer import QualityAnalyzer
from app.services.pipeline.validator import PoseValidator
from app.services.pipeline.saree_detector import SareeDetector

logger = logging.getLogger(__name__)

class PreprocessingOrchestrator:
    """Orchestrates the entire CV pipeline within 300ms."""
    
    @staticmethod
    def run(person_bytes: bytes) -> PipelineContext:
        start_time = time.monotonic()
        metrics = {}
        
        nparr = np.frombuffer(person_bytes, np.uint8)
        bgr_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if bgr_img is None:
            return PipelineContext(
                original_bytes=person_bytes,
                width=0, height=0,
                validation=ValidationResult(
                    is_valid=False,
                    quality=QualityScore(score=0, reasons=["Corrupted image file."])
                ),
                metrics={"total_ms": 0}
            )
            
        h, w = bgr_img.shape[:2]
        
        enh_start = time.monotonic()
        enhanced_bytes = ImageEnhancer.process_bytes(person_bytes, settings)
        metrics["enhancement_ms"] = int((time.monotonic() - enh_start) * 1000)
        
        qa_start = time.monotonic()
        
        if settings.ENABLE_ENHANCEMENT:
            enhanced_nparr = np.frombuffer(enhanced_bytes, np.uint8)
            eval_img = cv2.imdecode(enhanced_nparr, cv2.IMREAD_COLOR)
        else:
            eval_img = bgr_img
            
        quality_score = QualityAnalyzer.analyze(eval_img)
        metrics["qa_ms"] = int((time.monotonic() - qa_start) * 1000)
        
        pose_start = time.monotonic()
        validator = PoseValidator()
        rgb_img = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2RGB)
        
        is_valid, failure_prob = validator.validate(rgb_img, quality_score)
        
        if settings.QUALITY_THRESHOLD > 0:
            if quality_score.score < settings.QUALITY_THRESHOLD:
                is_valid = False
                quality_score.reasons.insert(0, "QUALITY_REJECTED: The image quality score is too low.")
                
        is_saree = SareeDetector.detect(bgr_img, validator.process_image(rgb_img))
        
        metrics["pose_saree_ms"] = int((time.monotonic() - pose_start) * 1000)
        metrics["total_ms"] = int((time.monotonic() - start_time) * 1000)
        
        if not settings.ENABLE_FAILURE_DETECTION:
            is_valid = True
            
        logger.info(f"Pipeline Result: Score {quality_score.score:.1f}, Valid: {is_valid}, Metrics: {metrics}")
        
        return PipelineContext(
            original_bytes=person_bytes,
            enhanced_bytes=enhanced_bytes if settings.ENABLE_ENHANCEMENT else person_bytes,
            width=w, height=h,
            validation=ValidationResult(
                is_valid=is_valid,
                quality=quality_score,
                is_saree_likely=is_saree,
                failure_prediction_score=failure_prob
            ),
            metrics=metrics
        )

