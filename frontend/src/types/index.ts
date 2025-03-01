// Enum for waste categories
export enum WasteCategory {
  E_WASTE_USEFUL = 'e-waste-useful',
  E_WASTE_NOT_USEFUL = 'e-waste-not-useful',
  NON_ORGANIC = 'non-organic',
  BIOGAS = 'biogas',
  COMPOST = 'compost',
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
    case WasteCategory.E_WASTE_USEFUL:
      return 'Electronic Waste';
    case WasteCategory.E_WASTE_NOT_USEFUL:
      return 'Non-usable Electronic Waste';
    case WasteCategory.NON_ORGANIC:
      return 'Non-organic Waste';
    case WasteCategory.BIOGAS:
      return 'Biogas';
    case WasteCategory.COMPOST:
      return 'Compost';
    default:
      return 'Unknown';
  }
};

export const getCategoryColor = (category: WasteCategory | null): string => {
  if (!category) return 'gray';

  switch (category) {
    case WasteCategory.E_WASTE_USEFUL:
      return 'red';
    case WasteCategory.E_WASTE_NOT_USEFUL:
      return 'orange';
    case WasteCategory.NON_ORGANIC:
      return 'blue';
    case WasteCategory.BIOGAS:
      return 'green';
    case WasteCategory.COMPOST:
      return 'orange';
    default:
      return 'gray';
  }
};
