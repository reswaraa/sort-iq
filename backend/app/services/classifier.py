import base64
import io
import random
from PIL import Image
from app.models.schemas import WasteCategory
from transformers import AutoImageProcessor, TFAutoModelForImageClassification

class WasteClassifier:
    """
    Waste classification service simulation.
    todo: use the Hugging Face model.
    """
    
    def __init__(self):
        # todo: load the model
        
        self.organic_processor = AutoImageProcessor.from_pretrained(
            "Kaludi/food-category-classification-v2.0"
        )
        self.organic_model = TFAutoModelForImageClassification.from_pretrained(
            "Kaludi/food-category-classification-v2.0", from_pt = True
        )
        
        
        self.categories = [
            WasteCategory.E_WASTE_USEFUL,
            WasteCategory.E_WASTE_NOT_USEFUL,
            WasteCategory.NON_ORGANIC,
            WasteCategory.BIOGAS,
            WasteCategory.COMPOST
        ]
        
        # Categories that are recyclable
        self.recyclable_map = {
            WasteCategory.E_WASTE_USEFUL: True,
            WasteCategory.E_WASTE_NOT_USEFUL: False,
            WasteCategory.NON_ORGANIC: True,
            WasteCategory.BIOGAS: True,
            WasteCategory.COMPOST: False
        }
    
    def decode_image(self, base64_image: str) -> Image.Image:
        """Decode a base64 image to a PIL Image."""
        try:
            # Remove the data URI prefix if present
            if "base64," in base64_image:
                base64_image = base64_image.split("base64,")[1]
                
            image_data = base64.b64decode(base64_image)
            image = Image.open(io.BytesIO(image_data))
            return image
        except Exception as e:
            raise ValueError(f"Invalid image data: {str(e)}")
    
    def classify(self, base64_image: str):
        """
        Classify a waste image.
        
        For now, we're simulating the classification:
        - Random category
        - Random confidence level
        - Determine recyclability based on category
        """
        try:
            # todo: process the image here
            # For now, we just decode it to validate it's a proper image
            image = self.decode_image(base64_image)
            
            # Simulate classification
            category = random.choice(self.categories)
            
            # Generate a random confidence level
            confidence = random.uniform(0.5, 0.95)
            
            # Determine if the waste is recyclable based on its category
            recyclable = self.recyclable_map[category]
            
            return {
                "category": category,
                "confidence": confidence,
                "recyclable": recyclable,
                "error": None
            }
            
        except Exception as e:
            return {
                "category": None,
                "confidence": 0.0,
                "recyclable": None,
                "error": str(e)
            }


classifier = WasteClassifier()