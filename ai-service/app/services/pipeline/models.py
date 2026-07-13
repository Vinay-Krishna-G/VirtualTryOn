from pydantic import BaseModel, Field
from typing import List, Optional, Tuple

class QualityScore(BaseModel):
    score: float = Field(..., ge=0.0, le=100.0)
    reasons: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)

class ValidationResult(BaseModel):
    is_valid: bool
    quality: QualityScore
    is_saree_likely: bool = False
    failure_prediction_score: float = Field(0.0, description="0 to 1 scale of how likely FASHN will fail")

class PipelineContext(BaseModel):
    original_bytes: bytes
    enhanced_bytes: Optional[bytes] = None
    width: int
    height: int
    validation: ValidationResult
    metrics: dict = Field(default_factory=dict)

