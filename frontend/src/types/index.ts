export type WasteCategory =
  | 'E-waste'
  | 'Non-organic'
  | 'Organic (Vegetable and Fruit)'
  | 'Organic (Dairy and Meat)'
  | 'Unknown';

export interface Detection {
  class_name: string;
  waste_category: WasteCategory;
  confidence: number;
}

export interface ClassificationResponse {
  success: boolean;
  top_detection?: Detection;
  all_detections?: Detection[];
  message: string;
}

export const wasteCategoryColors = {
  'E-waste': 'bg-e-waste',
  'Non-organic': 'bg-non-organic',
  'Organic (Vegetable and Fruit)': 'bg-organic-vf',
  'Organic (Dairy and Meat)': 'bg-organic-dm',
  Unknown: 'bg-unknown',
};

export const wasteCategoryDescriptions = {
  'E-waste': 'Electronic waste that requires special handling',
  'Non-organic': 'Materials like plastic, glass, or paper',
  'Organic (Vegetable and Fruit)': 'Compostable plant-based materials',
  'Organic (Dairy and Meat)': 'Animal products requiring separate handling',
  Unknown: 'Unable to classify this waste',
};
