import base64
import io
import os
import openai
from PIL import Image
from app.models.schemas import WasteCategory
from dotenv import load_dotenv
from pydantic import BaseSettings
from typing import Optional

load_dotenv()

class Settings(BaseSettings):
    openai_api_key: str = os.getenv("OPENAI_API_KEY")
    
    class Config: 
        env_file = ".env"
        env_file_encoding = "utf-8"
        
settings = Settings()

class WasteClassifier:
    """
    Waste classification service with LLM integration.
    """
    
    def __init__(self):
        # todo: load the model    
        
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
            if "base64," in base64_image:
                base64_image = base64_image.split("base64,")[1]
                
            image_data = base64.b64decode(base64_image)
            image = Image.open(io.BytesIO(image_data))
            return image
        except Exception as e:
            raise ValueError(f"Invalid image data: {str(e)}")
    
    def _get_llm_classification(self, description: str) -> Optional[dict]:
        """Get classification from LLM based on description."""
        prompt = f"""
        You are a waste classification system. Classify the following waste based on these categories:
        1. E_WASTE_USEFUL: Useful electronic devices or waste that can be refurbished or reused.
        2. E_WASTE_NOT_USEFUL: Electronic waste that is not useful or recyclable.
        3. NON_ORGANIC: Non-organic waste that is not biodegradable, for example: plastic, metal, glass.
        4. BIOGAS: Organic waste that can be used to produce biogas, for example vegetables, fruits, seeds, grains.
        5. COMPOST: Organic waste that can be composted, for example: meat, dairy, cooked food.
        
        If you feel not sure about the category, you can write it as UNIDENTIFIED.
        Please answer with the category name only, without any explanation.
        
        Item Description: {description}
"""
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a waste classification system."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=150
            )
            
            category = response.choices[0].message.content.strip().lower()
            return category
        except Exception as e:
            print(f"Error LLM: {str(e)}")
            return None

    def classify(self, base64_image: str):
        """
        Classify a waste image using LLM.
        """
        try:
            image = self.decode_image(base64_image)
            
            cv_description = "Simulated description from CV system"
            
            # Get classification from LLM
            llm_result = self._get_llm_classification(cv_description)
            
            if not llm_result:
                return {
                    "category": category,
                    "confidence": 0.0,
                    "recyclable": self.recyclable_map.get(category, None),
                    "error": "Failed to get classification from LLM"
                }

            # Map LLM result to WasteCategory
            category_str = llm_result.get("category", "").upper()
            category_map = {
                "E_WASTE_USEFUL": WasteCategory.E_WASTE_USEFUL,
                "E_WASTE_NOT_USEFUL": WasteCategory.E_WASTE_NOT_USEFUL,
                "NON_ORGANIC": WasteCategory.NON_ORGANIC,
                "BIOGAS": WasteCategory.BIOGAS,
                "COMPOST": WasteCategory.COMPOST
            }
            
            category = category_map.get(category_str, None)
            
            if not category:
                return {
                    "category": None,
                    "confidence": 0.0,
                    "recyclable": None,
                    "error": "Unidentified category"
                }
            
            return {
                "category": category,
                "confidence": 0.95,  # Fixed confidence for LLM
                "recyclable": self.recyclable_map.get(category),
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