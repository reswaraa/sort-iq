import base64
import io
import random
from PIL import Image
from app.models.schemas import WasteCategory
from transformers import AutoImageProcessor, TFAutoModelForImageClassification
import tensorflow as tf

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
        try:
            image = self.decode_image(base64_image)
            inputs = self.organic_processor(images = image, return_tensors='tf')
            outputs = self.organic_model(**inputs)
            probs = tf.nn.softmax(outputs.logits,axis=-1)
            predicted_class = tf.argmax(probs, axis=-1).numpy()[0]
            predicted_label = self.organic_model.config.id2label[predicted_class]
            confidence = probs[0][predicted_class].numpy()
            compostLabel = ["Vegetable","Fruit","Eggs","Bread","Noodles","Rice"]
            biogasLabel = ["Dairy, Dessert","Fried Food", "Meat", "Seafood", "Soup"]
            
            if predicted_label in compostLabel:
                category = WasteCategory.COMPOST
            elif predicted_label in biogasLabel:
                category = WasteCategory.BIOGAS
            
            return {
                "category": category,
                "confidence": confidence,
                "recyclable": self.recyclable_map[category],
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