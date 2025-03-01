from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    ClassificationRequest,
    ClassificationResponse,
    WeightUpdateRequest,
    WeightSummaryResponse,
    WasteCategory
)
from app.services.classifier import classifier
from typing import Dict


router = APIRouter()

# Store for weights
weight_store: Dict[WasteCategory, float] = {
    WasteCategory.E_WASTE_USEFUL: 0.0,
    WasteCategory.E_WASTE_NOT_USEFUL: 0.0,
    WasteCategory.NON_ORGANIC: 0.0,
    WasteCategory.BIOGAS: 0.0,
    WasteCategory.COMPOST: 0.0
}


@router.post("/classify", response_model=ClassificationResponse)
async def classify_waste(request: ClassificationRequest):
    """
    Classify a waste image and return the predicted category with confidence.
    """
    if not request.image_data:
        raise HTTPException(status_code=400, detail="No image data provided")
    
    result = classifier.classify(request.image_data)
    
    response = ClassificationResponse(
        category=result["category"],
        confidence=result["confidence"],
        recyclable=result["recyclable"],
        error=result["error"]
    )
    
    return response


@router.post("/update-weight", response_model=WeightSummaryResponse)
async def update_weight(request: WeightUpdateRequest):
    """
    Update the weight for a specific waste category.
    """
    weight_store[request.category] += request.weight
    
    total_weight = sum(weight_store.values())
    
    return WeightSummaryResponse(
        weights=weight_store,
        total_weight=total_weight
    )


@router.post("/reset-weights", response_model=WeightSummaryResponse)
async def reset_weights():
    """
    Reset all weights to zero.
    """
    global weight_store
    
    for category in weight_store:
        weight_store[category] = 0.0
    
    return WeightSummaryResponse(
        weights=weight_store,
        total_weight=0.0
    )


@router.get("/weight-summary", response_model=WeightSummaryResponse)
async def get_weight_summary():
    """
    Get the current weight summary.
    """
    total_weight = sum(weight_store.values())
    
    return WeightSummaryResponse(
        weights=weight_store,
        total_weight=total_weight
    )