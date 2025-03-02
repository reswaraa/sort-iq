'use client';

import React, { useState, useEffect } from 'react';
import StartScreen from './_components/StartScreen';
import ImageUpload from './_components/ImageUpload';
import ClassificationResult from './_components/ClassificationResult';
import WeightInput from './_components/WeightInput';
import SummaryDisplay from './_components/SummaryDisplay';
import { wasteAPI } from '@/services/upload/api';
import { AxiosError } from 'axios';
import {
  AppState,
  WeightSummaryResponse,
  WasteCategory,
} from '@/types/upload/index';
import {
  ToastProvider,
  notifyError,
  notifySuccess,
  handleApiError,
} from './_components/ToastProvider';

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
        notifyError({
          type: handleApiError(error as AxiosError),
          message: 'Failed to load current waste summary data.',
        });
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

      notifySuccess('Image successfully classified!');
    } catch (error) {
      const errorType = handleApiError(error as AxiosError);

      setState((prev) => ({
        ...prev,
        error: 'Failed to classify image. Please try again.',
        isLoading: false,
      }));

      notifyError({ type: errorType });
      console.log('Error classifying image:', error);
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

      notifySuccess(`Weight of ${weight} kg added successfully!`);
    } catch (error) {
      const errorType = handleApiError(error as AxiosError);

      setState((prev) => ({
        ...prev,
        error: 'Failed to update weight. Please try again.',
        isLoading: false,
      }));

      notifyError({ type: errorType });
      console.log('Error updating weight:', error);
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
    <ToastProvider>
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="container mx-auto">
          <header className="flex justify-between items-center mb-8">
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
    </ToastProvider>
  );
}
