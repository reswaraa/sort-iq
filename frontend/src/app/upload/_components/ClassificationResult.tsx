import React from 'react';
import {
  ClassificationResponse,
  getCategoryLabel,
  getCategoryColor,
} from '../../../types';

interface ClassificationResultProps {
  result: ClassificationResponse;
  onNext: () => void;
  onRetry: () => void;
}

const ClassificationResult: React.FC<ClassificationResultProps> = ({
  result,
  onNext,
  onRetry,
}) => {
  const isConfident = result.confidence >= 0.75;

  const confidencePercentage = (result.confidence * 100).toFixed(1);

  const categoryLabel = getCategoryLabel(result.category);
  const categoryColor = getCategoryColor(result.category);

  const getBadgeClass = () => {
    switch (categoryColor) {
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'orange':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'yellow':
        return 'bg-yellow-100-text-yellow-800-border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg mx-auto">
      {isConfident ? (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Classification Results</h2>
            <p className="text-gray-600">
              We have classified your waste with {confidencePercentage}%
              confidence.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-medium">Category:</span>
              <span
                className={`px-3 py-1 rounded-full border ${getBadgeClass()}`}
              >
                {categoryLabel}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-medium">Confidence:</span>
              <div className="w-2/3 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full"
                  style={{ width: `${confidencePercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Recyclable:</span>
              <span
                className={
                  result.recyclable ? 'text-green-600' : 'text-red-600'
                }
              >
                {result.recyclable ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
          >
            Continue to Weight Input
          </button>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Low Confidence Classification
            </h2>
            <p className="text-red-600 mb-2">
              Cant be sure of what the category is.
            </p>
            <p className="text-gray-600">
              Confidence: {confidencePercentage}% (below 75% threshold)
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onRetry}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
            >
              Try Again
            </button>
            <button
              onClick={onNext}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
            >
              Next Item
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassificationResult;
