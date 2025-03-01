from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
import io
from PIL import Image
import base64
import cv2
import time
import os
from app.models.detection import ObjectDetector
from app.routers import classification

app = FastAPI(title="Sort-IQ Waste Classifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sort-iq-git-main-resas-projects-58fc9a08.vercel.app"],  # For development - restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(classification.router, prefix="/api", tags=["Classification"])

detector = None

@app.on_event("startup")
async def startup_event():
    global detector
    try:
        detector = ObjectDetector(model_path="yolov8n.pt", confidence_threshold=0.25)
        print("YOLOv8 model loaded successfully")
    except Exception as e:
        print(f"Error loading YOLOv8 model: {e}")

@app.get("/")
async def root():
    return {"message": "Sort-IQ Waste Classifier API is running"}

@app.post("/detect")
async def detect_waste(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    try:
        contents = await file.read()
        
        if detector is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        detections = detector.detect_from_image(contents)
        
        if detections:
            detections.sort(key=lambda x: x["confidence"], reverse=True)
            top_detection = detections[0]
            
            return {
                "success": True,
                "top_detection": top_detection,
                "all_detections": detections,
                "message": f"Classified as {top_detection['waste_category']} (from {top_detection['class_name']})"
            }
        else:
            return {
                "success": False,
                "message": "No waste detected or confidence too low"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/detect-base64")
async def detect_waste_base64(data: dict = Body(...)):
    if "image" not in data:
        raise HTTPException(status_code=400, detail="No image data provided")
    
    try:
        base64_image = data["image"]
        
        if detector is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        detections = detector.detect_from_base64(base64_image)
        
        if detections:
            detections.sort(key=lambda x: x["confidence"], reverse=True)
            top_detection = detections[0]
            
            return {
                "success": True,
                "top_detection": top_detection,
                "all_detections": detections,
                "message": f"Classified as {top_detection['waste_category']} (from {top_detection['class_name']})"
            }
        else:
            return {
                "success": False,
                "message": "No waste detected or confidence too low"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)