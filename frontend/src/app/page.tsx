'use client';
import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import WebcamCapture from '@/components/WebcamCapture';
import ResultDisplay from '@/components/ResultDisplay';
import { classifyWasteFromBase64 } from '@/services/api';
import { ClassificationResponse } from '@/types';

export default function Home() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartCapture = () => {
    setIsCapturing(true);
    setError(null);
  };

  const handleStopCapture = () => {
    setIsCapturing(false);
  };

  const handleCapture = useCallback(
    async (imageSrc: string) => {
      if (isClassifying) return; // Don't overlap requests

      try {
        setIsClassifying(true);
        const classificationResult = await classifyWasteFromBase64(imageSrc);
        setResult(classificationResult);
      } catch (error) {
        console.error('Error classifying image:', error);
        setError(
          error instanceof Error ? error.message : 'Unknown error occurred'
        );
      } finally {
        setIsClassifying(false);
      }
    },
    [isClassifying]
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Sort-IQ Waste Classifier</title>
        <meta
          name="description"
          content="AI-powered waste classification for recycling"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Smart Waste Classifier
          </h1>
          <p className="text-gray-600 mt-2">
            Point your camera at waste to classify it into the correct recycling
            category
          </p>
        </header>

        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-4">
            <div className="mb-4">
              <WebcamCapture
                onCapture={handleCapture}
                isCapturing={isCapturing}
              />
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p>{error}</p>
              </div>
            )}

            <div className="mb-4">
              <ResultDisplay result={result} isLoading={isClassifying} />
            </div>

            <div className="flex justify-center">
              {!isCapturing ? (
                <button
                  onClick={handleStartCapture}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Start Classifying
                </button>
              ) : (
                <button
                  onClick={handleStopCapture}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Stop Classifying
                </button>
              )}
            </div>
          </div>
        </div>

        <section className="mt-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Waste Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-e-waste rounded-full mb-3 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-1">E-waste</h3>
              <p className="text-sm text-gray-600">
                Electronic waste like batteries, phones, computers, and other
                devices
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-non-organic rounded-full mb-3 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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
              </div>
              <h3 className="text-lg font-medium mb-1">Non-organic</h3>
              <p className="text-sm text-gray-600">
                Plastics, paper, glass, cardboard, and other recyclable
                materials
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-organic-vf rounded-full mb-3 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-1">
                Organic (Veg & Fruit)
              </h3>
              <p className="text-sm text-gray-600">
                Plant-based food waste like fruit and vegetable scraps
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-organic-dm rounded-full mb-3 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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
              <h3 className="text-lg font-medium mb-1">
                Organic (Dairy & Meat)
              </h3>
              <p className="text-sm text-gray-600">
                Animal products like meat, cheese, and other dairy waste
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Smart Waste Classifier - Built for the
            Hackathon
          </p>
        </footer>
      </main>
    </div>
  );
}
