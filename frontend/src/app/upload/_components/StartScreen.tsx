import React from 'react';
import { wasteAPI } from '../../../services/api';
import { WeightSummaryResponse } from '../../../types';

interface StartScreenProps {
  onStart: () => void;
  onWeightSummaryUpdate: (summary: WeightSummaryResponse) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  onWeightSummaryUpdate,
}) => {
  const handleStart = async () => {
    try {
      const summary = await wasteAPI.resetWeights();
      onWeightSummaryUpdate(summary);
      onStart();
    } catch (error) {
      console.error('Error starting new session:', error);
      // Start anyway even if reset fails
      onStart();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold mb-6 text-green-700">
        Static Waste Classification
      </h1>
      <p className="text-xl mb-8 max-w-md">
        Upload pictures of waste items to classify them and track waste
        management data.
      </p>

      <div className="space-y-4">
        <button
          onClick={handleStart}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
        >
          Start New Session
        </button>
      </div>

      <div className="mt-12 text-sm text-gray-500">
        <p>
          This prototype uses AI to classify waste into four categories:
          <br />
          Usable Electronic Waste, Non-usable Electronic Waste, Non-organic
          Waste, Biogas, Compost.
        </p>
      </div>
    </div>
  );
};

export default StartScreen;
