import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {
  Detection,
  WasteCategory,
  classToWasteCategory,
  wasteCategoryBorderColors,
} from '@/types';
import { classifyWasteFromBase64 } from '@/services/api';
import Loader from '@/components/Loader';

interface WebcamDetectionProps {
  onDetection: (detections: Detection[]) => void;
  isDetecting: boolean;
  useBackend?: boolean; // Whether to use backend API or client-side detection
  detectionInterval?: number; // How often to perform detection in ms
}

const WebcamDetection: React.FC<WebcamDetectionProps> = ({
  onDetection,
  isDetecting,
  useBackend = false, // Default to client-side detection
  detectionInterval = 200, // Default to 5 FPS
}) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'environment',
  };

  // Load TensorFlow.js and COCO-SSD model
  useEffect(() => {
    async function loadModel() {
      try {
        // Make sure TensorFlow is ready
        await tf.ready();

        // Load the COCO-SSD model
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setIsModelLoading(false);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Failed to load model:', error);
        setError('Failed to load detection model. Please refresh the page.');
        setIsModelLoading(false);
      }
    }

    loadModel();

    // Cleanup function
    return () => {
      // Dispose of any tensors if needed
    };
  }, []);

  // Handle webcam errors
  const handleUserMediaError = useCallback((error: string | DOMException) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    setError(`Camera error: ${errorMessage}`);
  }, []);

  // Detect objects in webcam feed using TensorFlow.js
  const detectObjectsClientSide = useCallback(async () => {
    if (!isDetecting || !model || !webcamRef.current || !canvasRef.current)
      return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    // Get video properties
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    // Set canvas dimensions to match the video
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Detect objects
    const detections = await model.detect(video);

    // Process detections
    const processedDetections: Detection[] = detections
      .filter((detection) => detection.score > 0.5) // Only keep detections with confidence > 0.5
      .map((detection) => {
        const className = detection.class.toLowerCase();
        const wasteCategory =
          classToWasteCategory[className] || WasteCategory.UNKNOWN;

        return {
          class_name: detection.class,
          waste_category: wasteCategory,
          confidence: detection.score,
          bbox: detection.bbox as [number, number, number, number],
        };
      });

    // Draw bounding boxes
    drawBoundingBoxes(processedDetections, canvasRef.current);

    // Send detections to parent component
    if (processedDetections.length > 0) {
      onDetection(processedDetections);
    }

    // Schedule the next detection
    if (isDetecting) {
      window.requestAnimationFrame(detectObjectsClientSide);
    }
  }, [isDetecting, model, onDetection]);

  // Detect objects using backend API with YOLOv8
  const detectObjectsServerSide = useCallback(async () => {
    if (!isDetecting || !webcamRef.current || !canvasRef.current) return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    // Get video properties
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    // Set canvas dimensions to match the video
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Capture frame as base64
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      // Send to backend for detection
      const response = await classifyWasteFromBase64(imageSrc);

      if (
        response.success &&
        response.all_detections &&
        response.all_detections.length > 0
      ) {
        const detections: Detection[] = response.all_detections;

        // Draw bounding boxes
        drawBoundingBoxes(detections, canvasRef.current);

        // Send detections to parent component
        onDetection(detections);
      }

      // Schedule next detection after interval
      if (isDetecting) {
        setTimeout(detectObjectsServerSide, detectionInterval);
      }
    } catch (error) {
      console.error('Error detecting objects via backend:', error);
      // Still schedule next detection on error
      if (isDetecting) {
        setTimeout(detectObjectsServerSide, detectionInterval);
      }
    }
  }, [isDetecting, onDetection, detectionInterval]);

  // Unified detect function that chooses client or server based on props
  const detectObjects = useCallback(() => {
    if (useBackend) {
      return detectObjectsServerSide();
    } else {
      return detectObjectsClientSide();
    }
  }, [useBackend, detectObjectsClientSide, detectObjectsServerSide]);

  // Start detection when model is loaded and detecting flag is true
  useEffect(() => {
    const detectionTimer: NodeJS.Timeout | null = null;

    if (isDetecting) {
      if (useBackend) {
        // For backend detection, we don't need to wait for the model to load
        detectObjectsServerSide();
      } else if (model && !isModelLoading) {
        // For client-side detection, we need the model to be loaded
        detectObjectsClientSide();
      }
    }

    return () => {
      // Clean up any timers when component unmounts or dependencies change
      if (detectionTimer) {
        clearTimeout(detectionTimer);
      }
    };
  }, [
    isDetecting,
    model,
    isModelLoading,
    useBackend,
    detectObjectsClientSide,
    detectObjectsServerSide,
  ]);

  // Draw bounding boxes on canvas
  const drawBoundingBoxes = (
    detections: Detection[],
    canvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each detection
    detections.forEach((detection) => {
      if (!detection.bbox) return;

      const [x, y, width, height] = detection.bbox;
      const category = detection.waste_category;
      const color = wasteCategoryBorderColors[category];

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Draw label background
      ctx.fillStyle = color;
      const textWidth = ctx.measureText(category).width;
      ctx.fillRect(x, y - 25, textWidth + 10, 25);

      // Draw label text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '15px Arial';
      ctx.fillText(category, x + 5, y - 8);
    });
  };

  return (
    <div className="relative">
      {isModelLoading && !useBackend ? (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-md">
          <Loader
            size="large"
            text="Loading TensorFlow.js model..."
            color="blue-500"
          />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-300">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMediaError={handleUserMediaError}
            className="w-full h-auto"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
          {isDetecting && (
            <div className="absolute top-2 right-2">
              <div className="animate-pulse flex">
                <div className="h-3 w-3 bg-red-600 rounded-full mr-1"></div>
                <span className="text-white text-xs">Live</span>
              </div>
            </div>
          )}

          {/* Model indicator badge */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {useBackend ? 'YOLOv8' : 'TensorFlow.js'}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamDetection;
