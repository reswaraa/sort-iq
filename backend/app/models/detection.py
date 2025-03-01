from ultralytics import YOLO
import numpy as np
import cv2
from PIL import Image
import io
import base64
from typing import List, Dict, Any, Tuple, Optional

# Define waste categories
class WasteCategory:
    E_WASTE_USEFUL = 'e-waste-useful'
    E_WASTE_NOT_USEFUL = 'e-waste-not-useful'
    NON_ORGANIC = 'non-organic'
    BIOGAS = 'biogas'
    COMPOST = 'compost'
    UNKNOWN = 'unknown'

# Mapping from COCO dataset classes to waste categories
# Complete mapping of all 80 COCO classes
COCO_TO_WASTE_CATEGORY = {
    # Person and animals - Not applicable to waste classification
    'person': WasteCategory.UNKNOWN,
    'bicycle': WasteCategory.E_WASTE_USEFUL,
    'car': WasteCategory.UNKNOWN,
    'motorcycle': WasteCategory.UNKNOWN,
    'airplane': WasteCategory.UNKNOWN,
    'bus': WasteCategory.UNKNOWN,
    'train': WasteCategory.UNKNOWN,
    'truck': WasteCategory.UNKNOWN,
    'boat': WasteCategory.UNKNOWN,
    
    # Animals - Not applicable to waste classification
    'bird': WasteCategory.UNKNOWN,
    'cat': WasteCategory.UNKNOWN,
    'dog': WasteCategory.UNKNOWN,
    'horse': WasteCategory.UNKNOWN,
    'sheep': WasteCategory.UNKNOWN,
    'cow': WasteCategory.UNKNOWN,
    'elephant': WasteCategory.UNKNOWN,
    'bear': WasteCategory.UNKNOWN,
    'zebra': WasteCategory.UNKNOWN,
    'giraffe': WasteCategory.UNKNOWN,
    
    # Common indoor objects - Applicable to waste classification
    'backpack': WasteCategory.NON_ORGANIC,
    'umbrella': WasteCategory.NON_ORGANIC,
    'handbag': WasteCategory.NON_ORGANIC,
    'tie': WasteCategory.NON_ORGANIC,
    'suitcase': WasteCategory.NON_ORGANIC,
    'frisbee': WasteCategory.NON_ORGANIC,
    'skis': WasteCategory.NON_ORGANIC,
    'snowboard': WasteCategory.NON_ORGANIC,
    'sports ball': WasteCategory.NON_ORGANIC,
    'kite': WasteCategory.NON_ORGANIC,
    'baseball bat': WasteCategory.NON_ORGANIC,
    'baseball glove': WasteCategory.NON_ORGANIC,
    'skateboard': WasteCategory.NON_ORGANIC,
    'surfboard': WasteCategory.NON_ORGANIC,
    'tennis racket': WasteCategory.NON_ORGANIC,
    
    # Bottles and containers
    'bottle': WasteCategory.NON_ORGANIC,
    'wine glass': WasteCategory.NON_ORGANIC,
    'cup': WasteCategory.NON_ORGANIC,
    'fork': WasteCategory.NON_ORGANIC,
    'knife': WasteCategory.NON_ORGANIC,
    'spoon': WasteCategory.NON_ORGANIC,
    'bowl': WasteCategory.NON_ORGANIC,
    
    # Food items
    'banana': WasteCategory.COMPOST,
    'apple': WasteCategory.COMPOST,
    'sandwich': WasteCategory.BIOGAS,
    'orange': WasteCategory.COMPOST,
    'broccoli': WasteCategory.COMPOST,
    'carrot': WasteCategory.COMPOST,
    'hot dog': WasteCategory.BIOGAS,
    'pizza': WasteCategory.BIOGAS,
    'donut': WasteCategory.BIOGAS,
    'cake': WasteCategory.BIOGAS,
    
    # Furniture - Generally not waste but if discarded
    'chair': WasteCategory.NON_ORGANIC,
    'couch': WasteCategory.NON_ORGANIC,
    'potted plant': WasteCategory.COMPOST,
    'bed': WasteCategory.NON_ORGANIC,
    'dining table': WasteCategory.NON_ORGANIC,
    'toilet': WasteCategory.NON_ORGANIC,
    
    # Electronics
    'tv': WasteCategory.E_WASTE_NOT_USEFUL,
    'laptop': WasteCategory.E_WASTE_USEFUL,
    'mouse': WasteCategory.E_WASTE_NOT_USEFUL,
    'remote': WasteCategory.E_WASTE_USEFUL,
    'keyboard': WasteCategory.E_WASTE_NOT_USEFUL,
    'cell phone': WasteCategory.E_WASTE_USEFUL,
    'microwave': WasteCategory.E_WASTE_NOT_USEFUL,
    'oven': WasteCategory.E_WASTE_NOT_USEFUL,
    'toaster': WasteCategory.E_WASTE_NOT_USEFUL,
    'sink': WasteCategory.NON_ORGANIC,
    'refrigerator': WasteCategory.E_WASTE_NOT_USEFUL,
    
    # Indoor items
    'book': WasteCategory.NON_ORGANIC,
    'clock': WasteCategory.E_WASTE_USEFUL,
    'vase': WasteCategory.NON_ORGANIC,
    'scissors': WasteCategory.NON_ORGANIC,
    'teddy bear': WasteCategory.NON_ORGANIC,
    'hair drier': WasteCategory.E_WASTE_NOT_USEFUL,
    'toothbrush': WasteCategory.NON_ORGANIC,
    
    # Outdoor and transportation
    'traffic light': WasteCategory.E_WASTE_NOT_USEFUL,
    'fire hydrant': WasteCategory.UNKNOWN,
    'stop sign': WasteCategory.NON_ORGANIC,
    'parking meter': WasteCategory.E_WASTE_NOT_USEFUL,
    'bench': WasteCategory.NON_ORGANIC,
}

class ObjectDetector:
    def __init__(self, model_path="yolov8n.pt", confidence_threshold=0.25):
        """Initialize the YOLOv8 object detector"""
        self.model = YOLO(model_path)
        self.confidence_threshold = confidence_threshold
        print(f"YOLOv8 model loaded from {model_path}")
    
    def detect_from_image(self, image_data: bytes) -> List[Dict[str, Any]]:
        """Detect objects in an image provided as bytes"""
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_data))
        
        # Convert PIL Image to numpy array for YOLOv8
        image_np = np.array(image)
        
        # Run inference
        results = self.model(image_np, conf=self.confidence_threshold)
        
        return self._process_results(results)
    
    def detect_from_base64(self, base64_image: str) -> List[Dict[str, Any]]:
        """Detect objects in a base64 encoded image"""
        try:
            # Extract base64 data
            if "base64," in base64_image:
                base64_image = base64_image.split("base64,")[1]
            
            # Decode base64 to bytes
            image_bytes = base64.b64decode(base64_image)
            
            # Open image
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to numpy array
            image_np = np.array(image)
            
            # Handle RGBA images (convert to RGB)
            if image_np.shape[-1] == 4:
                image_np = image_np[:, :, :3]
            
            # Run inference
            results = self.model(image_np, conf=self.confidence_threshold)
            
            return self._process_results(results)
        except Exception as e:
            print(f"Error processing base64 image: {str(e)}")
            return []
    
    def _process_results(self, results) -> List[Dict[str, Any]]:
        """Process YOLOv8 results into a standardized format"""
        detections = []
        result = results[0]  # Get the first result
        
        if result.boxes is not None:
            boxes = result.boxes
            for i, box in enumerate(boxes):
                # Get box coordinates
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(float)
                conf = float(box.conf[0].cpu().numpy())
                cls = int(box.cls[0].cpu().numpy())
                class_name = result.names[cls]
                
                # Map to waste category
                waste_category = COCO_TO_WASTE_CATEGORY.get(class_name, WasteCategory.UNKNOWN)
                
                # Create detection object
                detection = {
                    "class_name": class_name,
                    "waste_category": waste_category,
                    "confidence": conf,
                    "bbox": [float(x1), float(y1), float(x2-x1), float(y2-y1)]  # [x, y, width, height]
                }
                
                detections.append(detection)
        
        return detections