export enum WasteCategory {
  E_WASTE_USEFUL = 'e-waste-useful',
  E_WASTE_NOT_USEFUL = 'e-waste-not-useful',
  NON_ORGANIC = 'non-organic',
  BIOGAS = 'biogas',
  COMPOST = 'compost',
  UNKNOWN = 'unknown',
}

export interface Detection {
  class_name: string;
  waste_category: WasteCategory;
  confidence: number;
  bbox?: [number, number, number, number]; // [x, y, width, height]
}

export interface ClassificationResponse {
  success: boolean;
  top_detection?: Detection;
  all_detections?: Detection[];
  message: string;
}

export const wasteCategoryColors: Record<WasteCategory, string> = {
  [WasteCategory.E_WASTE_USEFUL]: 'bg-green-500',
  [WasteCategory.E_WASTE_NOT_USEFUL]: 'bg-red-500',
  [WasteCategory.NON_ORGANIC]: 'bg-blue-500',
  [WasteCategory.BIOGAS]: 'bg-yellow-500',
  [WasteCategory.COMPOST]: 'bg-lime-600',
  [WasteCategory.UNKNOWN]: 'bg-gray-500',
};

export const wasteCategoryBorderColors: Record<WasteCategory, string> = {
  [WasteCategory.E_WASTE_USEFUL]: 'rgba(34, 197, 94, 0.8)',
  [WasteCategory.E_WASTE_NOT_USEFUL]: 'rgba(239, 68, 68, 0.8)',
  [WasteCategory.NON_ORGANIC]: 'rgba(59, 130, 246, 0.8)',
  [WasteCategory.BIOGAS]: 'rgba(234, 179, 8, 0.8)',
  [WasteCategory.COMPOST]: 'rgba(101, 163, 13, 0.8)',
  [WasteCategory.UNKNOWN]: 'rgba(107, 114, 128, 0.8)',
};

export const wasteCategoryDescriptions: Record<WasteCategory, string> = {
  [WasteCategory.E_WASTE_USEFUL]:
    'Electronic waste that can be repaired or reused',
  [WasteCategory.E_WASTE_NOT_USEFUL]:
    'Electronic waste that needs special disposal',
  [WasteCategory.NON_ORGANIC]: 'Materials like plastic, glass, or paper',
  [WasteCategory.BIOGAS]: 'Organic waste suitable for biogas production',
  [WasteCategory.COMPOST]: 'Plant-based waste suitable for composting',
  [WasteCategory.UNKNOWN]: 'Unable to classify this waste',
};

// Mapping from model classes to waste categories
export const classToWasteCategory: Record<string, WasteCategory> = {
  // E-waste (useful)
  laptop: WasteCategory.E_WASTE_USEFUL,
  'cell phone': WasteCategory.E_WASTE_USEFUL,
  remote: WasteCategory.E_WASTE_USEFUL,
  clock: WasteCategory.E_WASTE_USEFUL,
  bicycle: WasteCategory.E_WASTE_USEFUL,

  // E-waste (not useful)
  tv: WasteCategory.E_WASTE_NOT_USEFUL,
  keyboard: WasteCategory.E_WASTE_NOT_USEFUL,
  mouse: WasteCategory.E_WASTE_NOT_USEFUL,
  microwave: WasteCategory.E_WASTE_NOT_USEFUL,
  oven: WasteCategory.E_WASTE_NOT_USEFUL,
  toaster: WasteCategory.E_WASTE_NOT_USEFUL,
  refrigerator: WasteCategory.E_WASTE_NOT_USEFUL,
  'hair drier': WasteCategory.E_WASTE_NOT_USEFUL,
  'traffic light': WasteCategory.E_WASTE_NOT_USEFUL,
  'parking meter': WasteCategory.E_WASTE_NOT_USEFUL,

  // Non-organic
  bottle: WasteCategory.NON_ORGANIC,
  cup: WasteCategory.NON_ORGANIC,
  'wine glass': WasteCategory.NON_ORGANIC,
  fork: WasteCategory.NON_ORGANIC,
  knife: WasteCategory.NON_ORGANIC,
  spoon: WasteCategory.NON_ORGANIC,
  bowl: WasteCategory.NON_ORGANIC,
  chair: WasteCategory.NON_ORGANIC,
  couch: WasteCategory.NON_ORGANIC,
  bed: WasteCategory.NON_ORGANIC,
  'dining table': WasteCategory.NON_ORGANIC,
  toilet: WasteCategory.NON_ORGANIC,
  book: WasteCategory.NON_ORGANIC,
  backpack: WasteCategory.NON_ORGANIC,
  umbrella: WasteCategory.NON_ORGANIC,
  handbag: WasteCategory.NON_ORGANIC,
  tie: WasteCategory.NON_ORGANIC,
  suitcase: WasteCategory.NON_ORGANIC,
  frisbee: WasteCategory.NON_ORGANIC,
  skis: WasteCategory.NON_ORGANIC,
  snowboard: WasteCategory.NON_ORGANIC,
  'sports ball': WasteCategory.NON_ORGANIC,
  kite: WasteCategory.NON_ORGANIC,
  'baseball bat': WasteCategory.NON_ORGANIC,
  'baseball glove': WasteCategory.NON_ORGANIC,
  skateboard: WasteCategory.NON_ORGANIC,
  surfboard: WasteCategory.NON_ORGANIC,
  'tennis racket': WasteCategory.NON_ORGANIC,
  vase: WasteCategory.NON_ORGANIC,
  scissors: WasteCategory.NON_ORGANIC,
  'teddy bear': WasteCategory.NON_ORGANIC,
  toothbrush: WasteCategory.NON_ORGANIC,
  'stop sign': WasteCategory.NON_ORGANIC,
  bench: WasteCategory.NON_ORGANIC,
  sink: WasteCategory.NON_ORGANIC,

  // Biogas
  sandwich: WasteCategory.BIOGAS,
  'hot dog': WasteCategory.BIOGAS,
  pizza: WasteCategory.BIOGAS,
  cake: WasteCategory.BIOGAS,
  donut: WasteCategory.BIOGAS,

  // Compost
  banana: WasteCategory.COMPOST,
  apple: WasteCategory.COMPOST,
  orange: WasteCategory.COMPOST,
  carrot: WasteCategory.COMPOST,
  broccoli: WasteCategory.COMPOST,
  'potted plant': WasteCategory.COMPOST,
};
