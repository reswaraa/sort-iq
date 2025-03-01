import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {
  Detection,
  WasteCategory,
  classToWasteCategory,
  wasteCategoryBorderColors,
} from '@/types/scan/index';
import { classifyWasteFromBase64 } from '@/services/scan/api';
import Loader from './Loader';

interface WebcamDetectionProps {
  onDetection: (detections: Detection[]) => void;
  isDetecting: boolean;
  useBackend?: boolean;
  detectionInterval?: number;
}

const WebcamDetection: React.FC<WebcamDetectionProps> = ({
  onDetection,
  isDetecting,
  useBackend = false,
  detectionInterval = 200,
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

  useEffect(() => {
    async function loadModel() {
      try {
        await tf.ready();

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

    return () => {};
  }, []);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    setError(`Camera error: ${errorMessage}`);
  }, []);

  const detectObjectsClientSide = useCallback(async () => {
    if (!isDetecting || !model || !webcamRef.current || !canvasRef.current)
      return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const detections = await model.detect(video);

    const processedDetections: Detection[] = detections
      .filter((detection) => detection.score > 0.5) // Only keep detections with confidence > 0.5
      .map((detection) => {
        const className = detection.class.toLowerCase();
        const wasteCategory =
          classToWasteCategory[className] || WasteCategory.OTHERS;

        return {
          class_name: detection.class,
          waste_category: wasteCategory,
          confidence: detection.score,
          bbox: detection.bbox as [number, number, number, number],
        };
      });

    drawBoundingBoxes(processedDetections, canvasRef.current);

    if (processedDetections.length > 0) {
      onDetection(processedDetections);
    }

    if (isDetecting) {
      window.requestAnimationFrame(detectObjectsClientSide);
    }
  }, [isDetecting, model, onDetection]);

  const detectObjectsServerSide = useCallback(async () => {
    if (!isDetecting || !webcamRef.current || !canvasRef.current) return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const response = await classifyWasteFromBase64(imageSrc);

      if (
        response.success &&
        response.all_detections &&
        response.all_detections.length > 0
      ) {
        const detections: Detection[] = response.all_detections;

        drawBoundingBoxes(detections, canvasRef.current);

        onDetection(detections);
      }

      if (isDetecting) {
        setTimeout(detectObjectsServerSide, detectionInterval);
      }
    } catch (error) {
      console.error('Error detecting objects via backend:', error);
      if (isDetecting) {
        setTimeout(detectObjectsServerSide, detectionInterval);
      }
    }
  }, [isDetecting, onDetection, detectionInterval]);

  useEffect(() => {
    const detectionTimer: NodeJS.Timeout | null = null;

    if (isDetecting) {
      if (useBackend) {
        detectObjectsServerSide();
      } else if (model && !isModelLoading) {
        detectObjectsClientSide();
      }
    }

    return () => {
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

  const drawBoundingBoxes = (
    detections: Detection[],
    canvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((detection) => {
      if (!detection.bbox) return;

      const [x, y, width, height] = detection.bbox;
      const category = detection.waste_category;
      const color = wasteCategoryBorderColors[category];

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = color;
      const textWidth = ctx.measureText(category).width;
      ctx.fillRect(x, y - 25, textWidth + 10, 25);

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
        </div>
      )}
    </div>
  );
};

export default WebcamDetection;
