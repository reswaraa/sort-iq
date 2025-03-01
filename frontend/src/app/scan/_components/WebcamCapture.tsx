import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  isCapturing: boolean;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture,
  isCapturing,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'environment',
  };

  const handleUserMedia = useCallback(() => {
    setIsWebcamReady(true);
    setError(null);
  }, []);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    setIsWebcamReady(false);
    setError(typeof error === 'string' ? error : error.message);
  }, []);

  const captureFrame = useCallback(() => {
    if (webcamRef.current && isCapturing) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [isCapturing, onCapture]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCapturing && isWebcamReady) {
      interval = setInterval(captureFrame, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCapturing, isWebcamReady, captureFrame]);

  return (
    <div className="relative">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
          <p className="mt-2">
            Please ensure your camera is connected and you have granted
            permission to use it.
          </p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-300">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            className="w-full h-auto"
          />
          {isCapturing && (
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

export default WebcamCapture;
