'use client';
import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import WebcamDetection from './_components/WebcamDetection';
import ResultDisplay from './_components/ResultDisplay';
import { ClassificationResponse, Detection } from '@/types/scan/index';

export default function Home() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartDetection = () => {
    setIsDetecting(true);
    setError(null);
  };

  const handleStopDetection = () => {
    setIsDetecting(false);
  };

  const handleDetection = useCallback((detections: Detection[]) => {
    if (detections.length === 0) {
      setResult({
        success: false,
        message: 'No waste detected',
      });
      return;
    }

    // Sort detections by confidence
    const sortedDetections = [...detections].sort(
      (a, b) => b.confidence - a.confidence
    );
    const topDetection = sortedDetections[0];

    setResult({
      success: true,
      top_detection: topDetection,
      all_detections: sortedDetections,
      message: `Classified as ${topDetection.waste_category} (from ${topDetection.class_name})`,
    });
  }, []);

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
          <h1 className="text-3xl font-bold text-green-700">
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
              <WebcamDetection
                onDetection={handleDetection}
                isDetecting={isDetecting}
                useBackend={false}
              />
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p>{error}</p>
              </div>
            )}

            <div className="mb-4">
              <ResultDisplay result={result} isLoading={false} />
            </div>

            <div className="flex justify-center">
              {!isDetecting ? (
                <button
                  onClick={handleStartDetection}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Start Classifying
                </button>
              ) : (
                <button
                  onClick={handleStopDetection}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-green-500 rounded-full mb-3 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </div>
              <h3 className="text-lg font-medium mb-1">E-Waste (Useful)</h3>
              <p className="text-sm text-gray-600">
                Electronic waste that can be repaired or reused
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-red-500 rounded-full mb-3 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </div>
              <h3 className="text-lg font-medium mb-1">E-Waste (Not Useful)</h3>
              <p className="text-sm text-gray-600">
                Electronic waste that needs special disposal
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-500 rounded-full mb-3 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              <h3 className="text-lg font-medium mb-1">Non-Organic</h3>
              <p className="text-sm text-gray-600">
                Materials like plastic, glass, or paper
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-yellow-500 rounded-full mb-3 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </div>
              <h3 className="text-lg font-medium mb-1">Biogas</h3>
              <p className="text-sm text-gray-600">
                Organic waste suitable for biogas production
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="w-12 h-12 bg-lime-600 rounded-full mb-3 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </div>
              <h3 className="text-lg font-medium mb-1">Compost</h3>
              <p className="text-sm text-gray-600">
                Plant-based waste suitable for composting
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">
                Real-time Object Detection
              </h3>
              <p className="text-gray-600">
                Our smart bin uses TensorFlow.js and a pre-trained COCO-SSD
                model to detect objects in real-time directly in your browser.
                The model identifies common household items and classifies them
                into appropriate waste categories.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Color-coded Categories
              </h3>
              <p className="text-gray-600">
                Each waste category is color-coded for easy identification. The
                system draws bounding boxes around detected items and shows
                confidence scores to indicate how certain the model is about its
                classification.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Sort-IQ Waste Classifier - Built for
            the Hackathon
          </p>
        </footer>
      </main>
    </div>
  );
}
