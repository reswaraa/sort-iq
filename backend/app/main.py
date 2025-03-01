from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
import io
from PIL import Image
import base64
import cv2
import time
import os
from ultralytics import YOLO

app = FastAPI(title="Smart Waste Classifier API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the YOLO model (will download if not present)
model = None

@app.on_event("startup")
async def startup_event():
    global model
    try:
        # Load YOLOv8 model - we'll use a pre-trained model and fine-tune it
        # For the prototype, we're using a standard YOLO model
        # In a real implementation, you'd fine-tune on waste dataset
        model = YOLO("yolov8n.pt")
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")

# Custom mapping for waste categories
# In a real application, this would be based on fine-tuned classes
waste_categories = {
    "cell phone": "E-waste",
    "laptop": "E-waste",
    "keyboard": "E-waste",
    "mouse": "E-waste",
    "remote": "E-waste",
    "tv": "E-waste",
    "bottle": "Non-organic",
    "cup": "Non-organic",
    "book": "Non-organic",
    "paper": "Non-organic",
    "plastic bag": "Non-organic",
    "cardboard": "Non-organic",
    "banana": "Organic (Vegetable and Fruit)",
    "apple": "Organic (Vegetable and Fruit)",
    "orange": "Organic (Vegetable and Fruit)",
    "carrot": "Organic (Vegetable and Fruit)",
    "broccoli": "Organic (Vegetable and Fruit)",
    "sandwich": "Organic (Dairy and Meat)",
    "hot dog": "Organic (Dairy and Meat)",
    "pizza": "Organic (Dairy and Meat)",
    "cake": "Organic (Dairy and Meat)",
    "donut": "Organic (Dairy and Meat)",
}

@app.get("/")
async def root():
    return {"message": "Smart Waste Classifier API is running"}

@app.post("/classify")
async def classify_waste(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    try:
        # Read image file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert PIL Image to cv2 format
        img_array = np.array(image)
        if len(img_array.shape) == 2:  # Grayscale image
            img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2BGR)
        
        # Run inference
        if model is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        results = model(img_array)
        result = results[0]  # Get the first result
        
        # Process detections
        detections = []
        for box in result.boxes:
            cls_id = int(box.cls[0].item())
            cls_name = result.names[cls_id]
            confidence = float(box.conf[0].item())
            
            # Map to waste category if possible
            waste_type = waste_categories.get(cls_name, "Unknown")
            
            # Only include detections with good confidence
            if confidence > 0.5:
                detections.append({
                    "class_name": cls_name,
                    "waste_category": waste_type,
                    "confidence": confidence,
                })
        
        # Return the top detection or "unknown" if nothing detected
        if detections:
            detections.sort(key=lambda x: x["confidence"], reverse=True)
            top_detection = detections[0]
            
            # Return all detections and highlight the top one
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

@app.post("/classify-base64")
async def classify_waste_base64(data: dict):
    if "image" not in data:
        raise HTTPException(status_code=400, detail="No image data provided")
    
    try:
        # Extract base64 string and decode
        base64_image = data["image"].split(",")[1] if "," in data["image"] else data["image"]
        image_bytes = base64.b64decode(base64_image)
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert PIL Image to cv2 format
        img_array = np.array(image)
        if len(img_array.shape) == 2:  # Grayscale image
            img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2BGR)
        
        # Run inference
        if model is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        results = model(img_array)
        result = results[0]  # Get the first result
        
        # Process detections
        detections = []
        for box in result.boxes:
            cls_id = int(box.cls[0].item())
            cls_name = result.names[cls_id]
            confidence = float(box.conf[0].item())
            
            # Map to waste category if possible
            waste_type = waste_categories.get(cls_name, "Unknown")
            
            # Only include detections with good confidence
            if confidence > 0.5:
                detections.append({
                    "class_name": cls_name,
                    "waste_category": waste_type,
                    "confidence": confidence,
                })
        
        # Return the top detection or "unknown" if nothing detected
        if detections:
            detections.sort(key=lambda x: x["confidence"], reverse=True)
            top_detection = detections[0]
            
            # Return all detections and highlight the top one
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