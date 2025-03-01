import base64
import io
import random
from PIL import Image
from app.models.schemas import WasteCategory
from transformers import AutoImageProcessor, TFAutoModelForImageClassification
import tensorflow as tf
from torchvision import models
import torchvision.transforms as transforms
import torch
from sorting_models.skeleton_model import custom_model

class WasteClassifier:
    """
    Waste classification service simulation.
    todo: use the Hugging Face model.
    """

    def __init__(self):
        # E-waste segregation model
        # Create the model architecture first
        self.ewaste_model = models.resnet18(pretrained=False)

        # Adjust the final layer to match your number of classes (2 in this case: Battery and Metal)
        num_classes = 2
        self.ewaste_model.fc = torch.nn.Linear(self.ewaste_model.fc.in_features, num_classes)
    
        # Load the state dictionary
        state_dict1 = torch.load("sorting_models/trained_resnet18.keras")
        self.ewaste_model.load_state_dict(state_dict1)
        self.ewaste_model.eval()

        # Organic / Non Organic / E-waste segregation model
        self.general_model = custom_model

        # Load the state dictionary
        state_dict2 = torch.load("sorting_models/custom_cnn.keras")
        self.general_model.load_state_dict(state_dict2)
        self.general_model.eval()

        # Organic waste segregation model
        self.organic_processor = AutoImageProcessor.from_pretrained(
            "Kaludi/food-category-classification-v2.0"
        )
        self.organic_model = TFAutoModelForImageClassification.from_pretrained(
            "Kaludi/food-category-classification-v2.0", from_pt=True
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
            # General Segregation
            image = self.decode_image(base64_image)
            category = None
            general_transform = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])

            general_labels = ["E-waste", "Non-organic", "Organic"]
            general_image_tensor = general_transform(image).unsqueeze(0)
            with torch.no_grad():
                general_outputs = self.general_model(general_image_tensor)
                general_probs = torch.nn.functional.softmax(general_outputs[0], dim=0)
                general_predicted_class = torch.argmax(general_probs).item()
                general_confidence = general_probs[general_predicted_class].item()
            
            general_class = general_labels[general_predicted_class]
            if general_class == "Non-organic":
                category = WasteCategory.NON_ORGANIC
                return {
                    "category": category,
                    "confidence": general_confidence,
                    "recyclable": self.recyclable_map[category],
                    "error": None
                }
            elif general_class == "E-waste":
                # Divide the type of e-waste
                class_labels = ["Battery", "Metal"]
                with torch.no_grad():
                    outputs = self.ewaste_model(general_image_tensor)
                    probs = torch.nn.functional.softmax(outputs[0], dim=0)
                    predicted_ewaste_label = torch.argmax(probs).item()
                    confidence = probs[predicted_ewaste_label].item()

                predicted_ewaste_class = class_labels[predicted_ewaste_label]
                useful_ewaste = ["Battery"]
                non_useful_ewaste = ["Metal"]

                if predicted_ewaste_class in useful_ewaste:
                    category = WasteCategory.E_WASTE_USEFUL
                else:
                    category = WasteCategory.E_WASTE_NOT_USEFUL
                
                return {
                    "category": category,
                    "confidence": confidence,
                    "recyclable": self.recyclable_map[category],
                    "error": None
                }
            else:
                # Divide organic compost and organic biogas
                inputs = self.organic_processor(images=image, return_tensors='tf')
                outputs = self.organic_model(**inputs)
                probs = tf.nn.softmax(outputs.logits, axis=-1)
                predicted_class = tf.argmax(probs, axis=-1).numpy()[0]
                predicted_label = self.organic_model.config.id2label[predicted_class]
                confidence = probs[0][predicted_class].numpy()
                compostLabel = ["Vegetable", "Fruit", "Eggs", "Bread", "Noodles", "Rice"]
                biogasLabel = ["Dairy, Dessert", "Fried Food", "Meat", "Seafood", "Soup"]
                
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