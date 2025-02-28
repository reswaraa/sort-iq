'use client';

import React, { useState, useEffect } from 'react';
import StartScreen from '../components/StartScreen';
import ImageUpload from '../components/ImageUpload';
import ClassificationResult from '../components/ClassificationResult';
import WeightInput from '../components/WeightInput';
import SummaryDisplay from '../components/SummaryDisplay';
import { wasteAPI } from '../services/api';
import {
  AppState,
  ClassificationResponse,
  WeightSummaryResponse,
  WasteCategory,
} from '../types';

const initialState: AppState = {
  step: 'start',
  currentImage: null,
  currentClassification: null,
  weightSummary: null,
  isLoading: false,
  error: null,
};

export default function Home() {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    const fetchWeightSummary = async () => {
      try {
        const summary = await wasteAPI.getWeightSummary();
        setState((prev) => ({ ...prev, weightSummary: summary }));
      } catch (error) {
        console.error('Error fetching weight summary:', error);
      }
    };

    fetchWeightSummary();
  }, []);

  const handleStart = () => {
    setState((prev) => ({ ...prev, step: 'upload' }));
  };

  const handleImageCapture = async (imageData: string) => {
    setState((prev) => ({
      ...prev,
      currentImage: imageData,
      isLoading: true,
      error: null,
    }));

    try {
      const result = await wasteAPI.classifyWaste(imageData);

      setState((prev) => ({
        ...prev,
        currentClassification: result,
        step: 'result',
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to classify image. Please try again.',
        isLoading: false,
      }));
    }
  };

  const handleContinueToWeight = () => {
    setState((prev) => ({ ...prev, step: 'weight' }));
  };

  const handleRetry = () => {
    setState((prev) => ({
      ...prev,
      currentImage: null,
      currentClassification: null,
      step: 'upload',
      error: null,
    }));
  };

  const handleWeightSubmit = async (weight: number) => {
    if (!state.currentClassification?.category) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const summary = await wasteAPI.updateWeight({
        category: state.currentClassification.category as WasteCategory,
        weight,
      });

      setState((prev) => ({
        ...prev,
        weightSummary: summary,
        currentImage: null,
        currentClassification: null,
        step: 'upload',
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to update weight. Please try again.',
        isLoading: false,
      }));
    }
  };

  const handleStopSession = () => {
    setState((prev) => ({ ...prev, step: 'start' }));
  };

  const handleWeightSummaryUpdate = (summary: WeightSummaryResponse) => {
    setState((prev) => ({ ...prev, weightSummary: summary }));
  };

  const renderStepContent = () => {
    switch (state.step) {
      case 'start':
        return (
          <StartScreen
            onStart={handleStart}
            onWeightSummaryUpdate={handleWeightSummaryUpdate}
          />
        );

      case 'upload':
        return (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Upload Waste Image</h2>
            <ImageUpload
              onImageCapture={handleImageCapture}
              isLoading={state.isLoading}
            />
            {state.error && <p className="mt-4 text-red-600">{state.error}</p>}
          </div>
        );

      case 'result':
        return state.currentClassification ? (
          <div className="text-center mb-8">
            <ClassificationResult
              result={state.currentClassification}
              onNext={handleContinueToWeight}
              onRetry={handleRetry}
            />
          </div>
        ) : null;

      case 'weight':
        return state.currentClassification ? (
          <div className="text-center mb-8">
            <WeightInput
              classification={state.currentClassification}
              onWeightSubmit={handleWeightSubmit}
              isLoading={state.isLoading}
            />
            {state.error && <p className="mt-4 text-red-600">{state.error}</p>}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Smart Waste Bin</h1>

          {state.step !== 'start' && (
            <button
              onClick={handleStopSession}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Stop Session
            </button>
          )}
        </header>

        <div className="mb-8">{renderStepContent()}</div>

        {state.weightSummary && (
          <div className="mt-12">
            <SummaryDisplay summary={state.weightSummary} />
          </div>
        )}
      </div>
    </main>
  );
}
