// Enum for waste categories
export enum WasteCategory {
  E_WASTE = 'e-waste',
  NON_ORGANIC = 'non-organic',
  ORGANIC_VEGETABLE_FRUIT = 'organic-vegetable-fruit',
  ORGANIC_DAIRY_MEAT = 'organic-dairy-meat',
}

// Classification response from the API
export interface ClassificationResponse {
  category: WasteCategory | null;
  confidence: number;
  recyclable: boolean | null;
  error: string | null;
}

// Interface for weight update request
export interface WeightUpdateRequest {
  category: WasteCategory;
  weight: number;
}

// Interface for weight summary response
export interface WeightSummaryResponse {
  weights: Record<WasteCategory, number>;
  total_weight: number;
}

// App state interface
export interface AppState {
  step: 'start' | 'upload' | 'result' | 'weight';
  currentImage: string | null;
  currentClassification: ClassificationResponse | null;
  weightSummary: WeightSummaryResponse | null;
  isLoading: boolean;
  error: string | null;
}

// Helper functions for category display
export const getCategoryLabel = (category: WasteCategory | null): string => {
  if (!category) return 'Unknown';

  switch (category) {
    case WasteCategory.E_WASTE:
      return 'Electronic Waste';
    case WasteCategory.NON_ORGANIC:
      return 'Non-organic Waste';
    case WasteCategory.ORGANIC_VEGETABLE_FRUIT:
      return 'Organic Waste (Vegetable/Fruit)';
    case WasteCategory.ORGANIC_DAIRY_MEAT:
      return 'Organic Waste (Dairy/Meat)';
    default:
      return 'Unknown';
  }
};

export const getCategoryColor = (category: WasteCategory | null): string => {
  if (!category) return 'gray';

  switch (category) {
    case WasteCategory.E_WASTE:
      return 'red';
    case WasteCategory.NON_ORGANIC:
      return 'blue';
    case WasteCategory.ORGANIC_VEGETABLE_FRUIT:
      return 'green';
    case WasteCategory.ORGANIC_DAIRY_MEAT:
      return 'orange';
    default:
      return 'gray';
  }
};
