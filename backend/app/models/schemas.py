from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, Dict, List


class WasteCategory(str, Enum):
    E_WASTE = "e-waste"
    NON_ORGANIC = "non-organic"
    ORGANIC_VEGETABLE_FRUIT = "organic-vegetable-fruit"
    ORGANIC_DAIRY_MEAT = "organic-dairy-meat"


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