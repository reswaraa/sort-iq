import React, { useState } from 'react';
import { ClassificationResponse, getCategoryLabel } from '@/types/upload/index';
import { notifyWarning } from './ToastProvider';

interface WeightInputProps {
  classification: ClassificationResponse;
  onWeightSubmit: (weight: number) => void;
  isLoading: boolean;
}

const WeightInput: React.FC<WeightInputProps> = ({
  classification,
  onWeightSubmit,
  isLoading,
}) => {
  const [weight, setWeight] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setWeight(value);
      setError(null);
    } else {
      // Don't update state but show the error
      notifyWarning('Please enter only numbers with up to one decimal point.');
    }
  };

  const validateWeight = (weightValue: number): boolean => {
    // Check if weight is reasonable (less than 100kg)
    if (weightValue > 100) {
      setError('Weight exceeds 100kg. Please verify the weight.');
      notifyWarning('The entered weight seems unusually high. Please verify.');
      return false;
    }

    // Check if weight is too precise (more than 2 decimal places)
    const decimalPlaces = (weightValue.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      setError('Please enter weight with up to 2 decimal places.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!weight || weight === '0' || weight === '0.0') {
      setError('Please enter a valid weight greater than zero');
      notifyWarning('Weight must be greater than zero.');
      return;
    }

    const weightValue = parseFloat(weight);

    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Please enter a valid weight greater than zero');
      notifyWarning('Weight must be greater than zero.');
      return;
    }

    // Additional validation
    if (!validateWeight(weightValue)) {
      return;
    }

    onWeightSubmit(weightValue);
  };

  const categoryLabel = getCategoryLabel(classification.category);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Weight Input</h2>
        <p className="text-gray-600">
          Please enter the approximate weight of your {categoryLabel} item.
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="weight" className="block text-gray-700 mb-2">
          Weight (kg):
        </label>

        <div className="flex">
          <input
            type="text"
            id="weight"
            value={weight}
            onChange={handleWeightChange}
            placeholder="0.0"
            className={`
              flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2
              ${
                error
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200'
              }
            `}
            disabled={isLoading}
          />

          <span className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-lg">
            kg
          </span>
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`
            w-full bg-green-500 text-white py-2 rounded-lg
            ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
            } 
            transition
          `}
        >
          {isLoading ? 'Processing...' : 'Submit and Continue'}
        </button>
      </div>
    </div>
  );
};

export default WeightInput;
