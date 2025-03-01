from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, Dict, List


class WasteCategory(str, Enum):
    E_WASTE_USEFUL = "e-waste-useful"
    E_WASTE_NOT_USEFUL = "e-waste-not-useful"
    NON_ORGANIC = "non-organic"
    BIOGAS = "biogas"
    COMPOST = "compost"
    

class ClassificationRequest(BaseModel):
    image_data: str = Field(..., description="Base64 encoded image data")


class ClassificationResponse(BaseModel):
    category: Optional[WasteCategory] = None
    confidence: float
    recyclable: Optional[bool] = None
    error: Optional[str] = None


class WeightUpdateRequest(BaseModel):
    category: WasteCategory
    weight: float  # in kilograms


class WeightSummaryResponse(BaseModel):
    weights: Dict[WasteCategory, float]
    total_weight: float



