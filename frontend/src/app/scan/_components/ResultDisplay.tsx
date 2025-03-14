import React from 'react';
import {
  ClassificationResponse,
  WasteCategory,
  wasteCategoryColors,
  wasteCategoryDescriptions,
} from '@/types/scan/index';

interface ResultDisplayProps {
  result: ClassificationResponse | null;
  isLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Analyzing waste...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <p className="text-center text-gray-600">
          Point your camera at waste to classify it
        </p>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-center text-gray-700">
          No Waste Detected
        </h3>
        <p className="mt-2 text-sm text-center text-gray-500">
          {result.message}
        </p>
      </div>
    );
  }

  const { top_detection } = result;
  if (!top_detection) return null;

  const categoryColor =
    wasteCategoryColors[top_detection.waste_category] ||
    wasteCategoryColors[WasteCategory.OTHERS];
  const categoryDescription =
    wasteCategoryDescriptions[top_detection.waste_category] || '';

  const confidencePercentage = Math.round(top_detection.confidence * 100);

  const renderCategoryIcon = (category: WasteCategory) => {
    switch (category) {
      case WasteCategory.E_WASTE_USEFUL:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      case WasteCategory.E_WASTE_NOT_USEFUL:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        );
      case WasteCategory.NON_ORGANIC:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        );
      case WasteCategory.BIOGAS:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
            />
          </svg>
        );
      case WasteCategory.COMPOST:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  // Format the category name for display
  const formatCategoryName = (category: WasteCategory) => {
    return category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-center mb-4">
        <div
          className={`${categoryColor} p-3 rounded-full bg-opacity-80 text-white`}
        >
          {renderCategoryIcon(top_detection.waste_category)}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
        {formatCategoryName(top_detection.waste_category)}
      </h3>

      <p className="text-sm text-center text-gray-600 mb-4">
        {categoryDescription}
      </p>

      <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${categoryColor}`}
          style={{ width: `${confidencePercentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-center text-gray-500 mt-1">
        Confidence: {confidencePercentage}%
      </p>

      {top_detection.class_name && (
        <p className="text-xs text-center text-gray-500 mt-3">
          Detected item: {top_detection.class_name}
        </p>
      )}

      {result.all_detections && result.all_detections.length > 1 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Other potential items:
          </h4>
          <div className="space-y-1">
            {result.all_detections.slice(1, 4).map((detection, index) => (
              <div key={index} className="text-xs flex justify-between">
                <span>{detection.class_name}</span>
                <span className="text-gray-500">
                  {Math.round(detection.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
